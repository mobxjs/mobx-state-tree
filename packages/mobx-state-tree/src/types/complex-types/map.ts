import {
    ObservableMap,
    IMapWillChange,
    action,
    intercept,
    observe,
    values,
    observable,
    _interceptReads,
    IMapDidChange
} from "mobx"
import {
    getStateTreeNode,
    escapeJsonPath,
    IJsonPatch,
    INode,
    createNode,
    isStateTreeNode,
    IStateTreeNode,
    IType,
    IComplexType,
    ComplexType,
    TypeFlags,
    IContext,
    IValidationResult,
    typeCheckFailure,
    flattenTypeErrors,
    getContextForPath,
    typecheck,
    addHiddenFinalProp,
    fail,
    isMutable,
    isPlainObject,
    isType,
    ObjectNode,
    mobxShallow,
    IChildNodesMap,
    ModelType,
    OptionalValue,
    Union,
    Late
} from "../../internal"

export interface IExtendedObservableMap<T> extends ObservableMap<string, T> {
    put(value: T | any): this // downtype to any, again, because we cannot type the snapshot, see
}

export function mapToString(this: ObservableMap<any, any>) {
    return `${getStateTreeNode(this as IStateTreeNode)}(${this.size} items)`
}

const needsIdentifierError = `Map.put can only be used to store complex values that have an identifier type attribute`

function put(this: ObservableMap<any, any>, value: any) {
    if (!!!value) fail(`Map.put cannot be used to set empty values`)
    if (isStateTreeNode(value)) {
        const node = getStateTreeNode(value)
        if (process.env.NODE_ENV !== "production") {
            if (!node.identifierAttribute) return fail(needsIdentifierError)
        }
        this.set("" + node.identifier!, node.value)
        return this
    } else if (!isMutable(value)) {
        return fail(`Map.put can only be used to store complex values`)
    } else {
        const mapType = getStateTreeNode(this as IStateTreeNode).type as MapType<any, any>
        if (mapType.identifierMode === MapIdentifierMode.YES) {
            this.set("" + value[mapType.identifierAttribute!], value)
            return this
        }
        return fail(needsIdentifierError)
    }
}

function tryCollectModelTypes(
    type: IType<any, any>,
    modelTypes: Array<ModelType<any, any>>
): boolean {
    if (type instanceof ModelType) {
        modelTypes.push(type)
    } else if (type instanceof OptionalValue) {
        if (!tryCollectModelTypes(type.type, modelTypes)) return false
    } else if (type instanceof Union) {
        for (let i = 0; i < type.types.length; i++) {
            const uType = type.types[i]
            if (!tryCollectModelTypes(uType, modelTypes)) return false
        }
    } else if (type instanceof Late) {
        try {
            tryCollectModelTypes(type.subType, modelTypes)
        } catch (e) {
            return false
        }
    }
    return true
}

export enum MapIdentifierMode {
    UNKNOWN,
    YES,
    NO
}

export class MapType<S, T> extends ComplexType<{ [key: string]: S }, IExtendedObservableMap<T>> {
    shouldAttachNode = true
    subType: IType<any, any>
    identifierMode: MapIdentifierMode = MapIdentifierMode.UNKNOWN
    identifierAttribute: string | undefined = undefined
    readonly flags = TypeFlags.Map

    constructor(name: string, subType: IType<any, any>) {
        super(name)
        this.subType = subType
        this._determineIdentifierMode()
    }

    instantiate(parent: ObjectNode | null, subpath: string, environment: any, snapshot: S): INode {
        if (this.identifierMode === MapIdentifierMode.UNKNOWN) {
            this._determineIdentifierMode()
        }
        return createNode(
            this,
            parent,
            subpath,
            environment,
            snapshot,
            this.createNewInstance,
            this.finalizeNewInstance
        )
    }

    private _determineIdentifierMode() {
        const modelTypes = [] as Array<ModelType<any, any>>
        if (tryCollectModelTypes(this.subType, modelTypes)) {
            let identifierAttribute: string | undefined = undefined
            modelTypes.forEach(type => {
                if (type.identifierAttribute) {
                    if (identifierAttribute && identifierAttribute !== type.identifierAttribute) {
                        fail(
                            `The objects in a map should all have the same identifier attribute, expected '${identifierAttribute}', but child of type '${type.name}' declared attribute '${type.identifierAttribute}' as identifier`
                        )
                    }
                    identifierAttribute = type.identifierAttribute
                }
            })
            if (identifierAttribute) {
                this.identifierMode = MapIdentifierMode.YES
                this.identifierAttribute = identifierAttribute
            } else {
                this.identifierMode = MapIdentifierMode.NO
            }
        }
    }

    initializeChildNodes(objNode: ObjectNode, initialSnapshot: any = {}): IChildNodesMap {
        const subType = (objNode.type as MapType<any, any>).subType
        const environment = objNode._environment
        const result = {} as IChildNodesMap
        Object.keys(initialSnapshot).forEach(name => {
            result[name] = subType.instantiate(objNode, name, environment, initialSnapshot[name])
        })

        return result
    }

    describe() {
        return "Map<string, " + this.subType.describe() + ">"
    }

    createNewInstance(childNodes: IChildNodesMap) {
        const instance = observable.map(childNodes, mobxShallow)
        addHiddenFinalProp(instance, "put", put)
        addHiddenFinalProp(instance, "toString", mapToString)
        return instance
    }

    finalizeNewInstance(node: INode) {
        const objNode = node as ObjectNode
        const type = objNode.type as MapType<any, any>
        const instance = objNode.storedValue as ObservableMap<any, any>
        _interceptReads(instance, objNode.unbox)
        intercept(instance, type.willChange)
        observe(instance, type.didChange)
    }

    getChildren(node: ObjectNode): ReadonlyArray<INode> {
        // return (node.storedValue as ObservableMap<any>).values()
        return values(node.storedValue as ObservableMap<any, any>)
    }

    getChildNode(node: ObjectNode, key: string): INode {
        const childNode = node.storedValue.get("" + key)
        if (!childNode) fail("Not a child " + key)
        return childNode
    }

    willChange(change: IMapWillChange<any, any>): IMapWillChange<any, any> | null {
        const node = getStateTreeNode(change.object as IStateTreeNode)
        const key = "" + change.name
        node.assertWritable()
        const mapType = node.type as MapType<any, any>
        const subType = mapType.subType

        switch (change.type) {
            case "update":
                {
                    const { newValue } = change
                    const oldValue = change.object.get(key)
                    if (newValue === oldValue) return null
                    typecheck(subType, newValue)
                    change.newValue = subType.reconcile(node.getChildNode(key), change.newValue)
                    mapType.processIdentifier(key, change.newValue as INode)
                }
                break
            case "add":
                {
                    typecheck(subType, change.newValue)
                    change.newValue = subType.instantiate(node, key, undefined, change.newValue)
                    mapType.processIdentifier(key, change.newValue as INode)
                }
                break
        }
        return change
    }

    private processIdentifier(expected: string, node: INode) {
        if (this.identifierMode === MapIdentifierMode.YES && node instanceof ObjectNode) {
            const identifier = "" + node.identifier! // 'cause snapshots always have their identifiers as strings. blegh..
            if (identifier !== expected)
                fail(
                    `A map of objects containing an identifier should always store the object under their own identifier. Trying to store key '${identifier}', but expected: '${expected}'`
                )
        }
    }

    getValue(node: ObjectNode): any {
        return node.storedValue
    }

    getSnapshot(node: ObjectNode): { [key: string]: any } {
        const res: { [key: string]: any } = {}
        node.getChildren().forEach(childNode => {
            res[childNode.subpath] = childNode.snapshot
        })
        return res
    }

    didChange(change: IMapDidChange<any, any>): void {
        const node = getStateTreeNode(change.object as IStateTreeNode)
        switch (change.type) {
            case "update":
                return void node.emitPatch(
                    {
                        op: "replace",
                        path: escapeJsonPath(change.name),
                        value: change.newValue.snapshot,
                        oldValue: change.oldValue ? change.oldValue.snapshot : undefined
                    },
                    node
                )
            case "add":
                return void node.emitPatch(
                    {
                        op: "add",
                        path: escapeJsonPath(change.name),
                        value: change.newValue.snapshot,
                        oldValue: undefined
                    },
                    node
                )
            case "delete":
                // a node got deleted, get the old snapshot and make the node die
                const oldSnapshot = change.oldValue.snapshot
                change.oldValue.die()
                // emit the patch
                return void node.emitPatch(
                    { op: "remove", path: escapeJsonPath(change.name), oldValue: oldSnapshot },
                    node
                )
        }
    }

    applyPatchLocally(node: ObjectNode, subpath: string, patch: IJsonPatch): void {
        const target = node.storedValue as ObservableMap<any, any>
        switch (patch.op) {
            case "add":
            case "replace":
                target.set(subpath, patch.value)
                break
            case "remove":
                target.delete(subpath)
                break
        }
    }

    @action
    applySnapshot(node: ObjectNode, snapshot: any): void {
        typecheck(this, snapshot)
        const target = node.storedValue as ObservableMap<any, any>
        const currentKeys: { [key: string]: boolean } = {}
        Array.from(target.keys()).forEach(key => {
            currentKeys[key] = false
        })
        // Don't use target.replace, as it will throw all existing items first
        for (let key in snapshot) {
            target.set("" + key, snapshot[key])
            currentKeys["" + key] = true
        }
        Object.keys(currentKeys).forEach(key => {
            if (currentKeys[key] === false) target.delete(key)
        })
    }

    getChildType(key: string): IType<any, any> {
        return this.subType
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (!isPlainObject(value)) {
            return typeCheckFailure(context, value, "Value is not a plain object")
        }

        return flattenTypeErrors(
            Object.keys(value).map(path =>
                this.subType.validate(value[path], getContextForPath(context, path, this.subType))
            )
        )
    }

    getDefaultSnapshot() {
        return {}
    }

    removeChild(node: ObjectNode, subpath: string) {
        ;(node.storedValue as ObservableMap<any, any>).delete(subpath)
    }
}

export function map<S, T>(
    subtype: IComplexType<S, T>
): IComplexType<{ [key: string]: S }, IExtendedObservableMap<T>>
/**
 * Creates a key based collection type who's children are all of a uniform declared type.
 * If the type stored in a map has an identifier, it is mandatory to store the child under that identifier in the map.
 *
 * This type will always produce [observable maps](https://mobx.js.org/refguide/map.html)
 *
 * @example
 * const Todo = types.model({
 *   id: types.identifier(types.number),
 *   task: types.string
 * })
 *
 * const TodoStore = types.model({
 *   todos: types.map(Todo)
 * })
 *
 * const s = TodoStore.create({ todos: {} })
 * unprotect(s)
 * s.todos.set(17, { task: "Grab coffee", id: 17 })
 * s.todos.put({ task: "Grab cookie", id: 18 }) // put will infer key from the identifier
 * console.log(s.todos.get(17).task) // prints: "Grab coffee"
 *
 * @export
 * @alias types.map
 * @param {IType<S, T>} subtype
 * @returns {IComplexType<S[], IObservableArray<T>>}
 */
export function map<S, T>(
    subtype: IType<S, T>
): IComplexType<{ [key: string]: S }, IExtendedObservableMap<T>> {
    return new MapType<S, T>(`map<string, ${subtype.name}>`, subtype)
}

export function isMapType<S, T>(
    type: any
): type is IComplexType<{ [key: string]: S }, IExtendedObservableMap<T>> {
    return isType(type) && (type.flags & TypeFlags.Map) > 0
}
