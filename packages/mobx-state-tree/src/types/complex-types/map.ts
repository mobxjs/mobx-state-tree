import {
    _interceptReads,
    action,
    IInterceptor,
    IKeyValueMap,
    IMapDidChange,
    IMapWillChange,
    intercept,
    Lambda,
    observable,
    ObservableMap,
    observe,
    values
} from "mobx"
import {
    ComplexType,
    createNode,
    escapeJsonPath,
    fail,
    flattenTypeErrors,
    getContextForPath,
    getStateTreeNode,
    IAnyStateTreeNode,
    IAnyType,
    IChildNodesMap,
    IComplexType,
    IContext,
    IJsonPatch,
    INode,
    isMutable,
    isPlainObject,
    isStateTreeNode,
    isType,
    IType,
    IValidationResult,
    Late,
    ModelType,
    ObjectNode,
    OptionalValue,
    typecheck,
    typeCheckFailure,
    TypeFlags,
    Union,
    EMPTY_OBJECT,
    OptionalProperty
} from "../../internal"

export interface IMapType<C, S, T>
    extends IComplexType<IKeyValueMap<C> | undefined, IKeyValueMap<S>, IMSTMap<C, S, T>>,
        OptionalProperty {}

export interface IMSTMap<C, S, T> {
    // bases on ObservableMap, but fine tuned to the auto snapshot conversion of MST

    clear(): void
    delete(key: string): boolean
    forEach(callbackfn: (value: T, key: string, map: IMSTMap<C, S, T>) => void, thisArg?: any): void
    get(key: string): T | undefined
    has(key: string): boolean
    set(key: string, value: C | S | T): this
    readonly size: number
    put(value: C | S | T): T
    keys(): IterableIterator<string>
    values(): IterableIterator<T>
    entries(): IterableIterator<[string, T]>
    [Symbol.iterator](): IterableIterator<[string, T]>
    /** Merge another object into this map, returns self. */
    merge(other: IMSTMap<any, any, T> | IKeyValueMap<C | S | T> | any): this
    replace(values: IMSTMap<any, any, T> | IKeyValueMap<T>): this
    /**
     * Returns a plain object that represents this map.
     * Note that all the keys being stringified.
     * If there are duplicating keys after converting them to strings, behaviour is undetermined.
     */
    toPOJO(): IKeyValueMap<T>
    /**
     * Returns a shallow non observable object clone of this map.
     * Note that the values migth still be observable. For a deep clone use mobx.toJS.
     */
    toJS(): Map<string, T>
    toJSON(): IKeyValueMap<T>
    toString(): string
    [Symbol.toStringTag]: "Map"
    /**
     * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
     * for callback details
     */
    observe(
        listener: (changes: IMapDidChange<string, T>) => void,
        fireImmediately?: boolean
    ): Lambda
    intercept(handler: IInterceptor<IMapWillChange<string, T>>): Lambda
}

const needsIdentifierError = `Map.put can only be used to store complex values that have an identifier type attribute`

function tryCollectModelTypes(type: IAnyType, modelTypes: Array<ModelType<any, any>>): boolean {
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
        const t = type.getSubType(false)
        if (!t) return false
        tryCollectModelTypes(t, modelTypes)
    }
    return true
}

/** @internal */
export enum MapIdentifierMode {
    UNKNOWN,
    YES,
    NO
}

class MSTMap<C, S, T> extends ObservableMap {
    constructor(initialData: any) {
        super(initialData, observable.ref.enhancer)
    }

    get(key: string): T {
        // maybe this is over-enthousiastic? normalize numeric keys to strings
        return super.get("" + key)
    }

    has(key: string): boolean {
        return super.has("" + key)
    }

    delete(key: string): boolean {
        return super.delete("" + key)
    }

    set(key: string, value: C | S | T): this {
        return super.set("" + key, value)
    }

    put(value: C | S | T): T {
        if (!!!value) fail(`Map.put cannot be used to set empty values`)
        if (isStateTreeNode(value)) {
            const node = getStateTreeNode(value)
            if (process.env.NODE_ENV !== "production") {
                if (!node.identifierAttribute) return fail(needsIdentifierError)
            }
            let key = node.identifier!
            this.set(key, node.value)
            return node.value
        } else if (!isMutable(value)) {
            return fail(`Map.put can only be used to store complex values`)
        } else {
            let key: string
            const mapType = getStateTreeNode(this as IAnyStateTreeNode).type as MapType<
                any,
                any,
                any
            >
            if (mapType.identifierMode === MapIdentifierMode.NO) return fail(needsIdentifierError)
            if (mapType.identifierMode === MapIdentifierMode.YES) {
                key = "" + (value as any)[mapType.identifierAttribute!]
                this.set(key, value)
                return this.get(key) as any
            }
            return fail(needsIdentifierError)
        }
    }
}

/** @internal */
export class MapType<C, S, T> extends ComplexType<
    IKeyValueMap<C> | undefined,
    IKeyValueMap<S>,
    IMSTMap<C, S, T>
> {
    shouldAttachNode = true
    subType: IAnyType
    identifierMode: MapIdentifierMode = MapIdentifierMode.UNKNOWN
    identifierAttribute: string | undefined = undefined
    readonly flags = TypeFlags.Map

    constructor(name: string, subType: IAnyType) {
        super(name)
        this.subType = subType
        this._determineIdentifierMode()
    }

    instantiate(parent: ObjectNode | null, subpath: string, environment: any, snapshot: S): INode {
        if (this.identifierMode === MapIdentifierMode.UNKNOWN) {
            this._determineIdentifierMode()
        }
        return createNode(this, parent, subpath, environment, snapshot)
    }

    private _determineIdentifierMode() {
        const modelTypes = [] as Array<ModelType<any, any>>
        if (tryCollectModelTypes(this.subType, modelTypes)) {
            let identifierAttribute: string | undefined = undefined
            modelTypes.forEach(type => {
                if (type.identifierAttribute) {
                    if (identifierAttribute && identifierAttribute !== type.identifierAttribute) {
                        fail(
                            `The objects in a map should all have the same identifier attribute, expected '${identifierAttribute}', but child of type '${
                                type.name
                            }' declared attribute '${type.identifierAttribute}' as identifier`
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
        const subType = (objNode.type as MapType<any, any, any>).subType
        const environment = objNode._environment
        const result = {} as IChildNodesMap
        Object.keys(initialSnapshot).forEach(name => {
            result[name] = subType.instantiate(objNode, name, environment, initialSnapshot[name])
        })

        return result
    }

    createNewInstance(
        node: INode,
        childNodes: IChildNodesMap,
        snapshot: any
    ): IMSTMap<any, any, any> {
        return (new MSTMap(childNodes) as any) as IMSTMap<any, any, any>
    }

    finalizeNewInstance(node: ObjectNode, instance: any) {
        _interceptReads(instance, node.unbox)
        intercept(instance, this.willChange)
        observe(instance, this.didChange)
    }

    describe() {
        return "Map<string, " + this.subType.describe() + ">"
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
        const node = getStateTreeNode(change.object as IAnyStateTreeNode)
        const key = change.name
        node.assertWritable()
        const mapType = node.type as MapType<any, any, any>
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
            const identifier = node.identifier!
            if (identifier !== expected)
                fail(
                    `A map of objects containing an identifier should always store the object under their own identifier. Trying to store key '${identifier}', but expected: '${expected}'`
                )
        }
    }

    getValue(node: ObjectNode): any {
        return node.storedValue
    }

    getSnapshot(node: ObjectNode): IKeyValueMap<S> {
        const res: any = {}
        node.getChildren().forEach(childNode => {
            res[childNode.subpath] = childNode.snapshot
        })
        return res
    }

    processInitialSnapshot(childNodes: IChildNodesMap, snapshot: any): any {
        const processed = {} as any
        Object.keys(childNodes).forEach(key => {
            processed[key] = childNodes[key].getSnapshot()
        })
        return processed
    }

    didChange(change: IMapDidChange<any, any>): void {
        const node = getStateTreeNode(change.object as IAnyStateTreeNode)
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
            target.set(key, snapshot[key])
            currentKeys["" + key] = true
        }
        Object.keys(currentKeys).forEach(key => {
            if (currentKeys[key] === false) target.delete(key)
        })
    }

    getChildType(key: string): IAnyType {
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
        return EMPTY_OBJECT
    }

    removeChild(node: ObjectNode, subpath: string) {
        ;(node.storedValue as ObservableMap<any, any>).delete(subpath)
    }
}

/**
 * Creates a key based collection type who's children are all of a uniform declared type.
 * If the type stored in a map has an identifier, it is mandatory to store the child under that identifier in the map.
 *
 * This type will always produce [observable maps](https://mobx.js.org/refguide/map.html)
 *
 * @example
 * const Todo = types.model({
 *   id: types.identifier,
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
export function map<C, S, T>(subtype: IType<C, S, T>): IMapType<C, S, T> {
    const ret = new MapType<C, S, T>(`map<string, ${subtype.name}>`, subtype)
    return ret as typeof ret & { optional: true }
}

export function isMapType<IT extends IMapType<any, any, any>>(type: IT): type is IT {
    return isType(type) && (type.flags & TypeFlags.Map) > 0
}
