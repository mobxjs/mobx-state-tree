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
    typecheckInternal,
    typeCheckFailure,
    TypeFlags,
    Union,
    EMPTY_OBJECT,
    OptionalProperty,
    ExtractC,
    ExtractS,
    ExtractT
} from "../../internal"

export interface IMapType<IT extends IAnyType>
    extends IComplexType<
            IKeyValueMap<ExtractC<IT>> | undefined,
            IKeyValueMap<ExtractS<IT>>,
            IMSTMap<IT>
        >,
        OptionalProperty {}

export interface IMSTMap<IT extends IAnyType> {
    // bases on ObservableMap, but fine tuned to the auto snapshot conversion of MST

    clear(): void
    delete(key: string): boolean
    forEach(
        callbackfn: (value: ExtractT<IT>, key: string, map: IMSTMap<IT>) => void,
        thisArg?: any
    ): void
    get(key: string): ExtractT<IT> | undefined
    has(key: string): boolean
    set(key: string, value: ExtractC<IT> | ExtractS<IT> | ExtractT<IT>): this
    readonly size: number
    put(value: ExtractC<IT> | ExtractS<IT> | ExtractT<IT>): ExtractT<IT>
    keys(): IterableIterator<string>
    values(): IterableIterator<ExtractT<IT>>
    entries(): IterableIterator<[string, ExtractT<IT>]>
    [Symbol.iterator](): IterableIterator<[string, ExtractT<IT>]>
    /** Merge another object into this map, returns self. */
    merge(
        other:
            | IMSTMap<IType<any, any, ExtractT<IT>>>
            | IKeyValueMap<ExtractC<IT> | ExtractS<IT> | ExtractT<IT>>
            | any
    ): this
    replace(values: IMSTMap<IType<any, any, ExtractT<IT>>> | IKeyValueMap<ExtractT<IT>>): this
    /**
     * Returns a plain object that represents this map.
     * Note that all the keys being stringified.
     * If there are duplicating keys after converting them to strings, behaviour is undetermined.
     */
    toPOJO(): IKeyValueMap<ExtractT<IT>>
    /**
     * Returns a shallow non observable object clone of this map.
     * Note that the values migth still be observable. For a deep clone use mobx.toJS.
     */
    toJS(): Map<string, ExtractT<IT>>
    toJSON(): IKeyValueMap<ExtractT<IT>>
    toString(): string
    [Symbol.toStringTag]: "Map"
    /**
     * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
     * for callback details
     */
    observe(
        listener: (changes: IMapDidChange<string, ExtractT<IT>>) => void,
        fireImmediately?: boolean
    ): Lambda
    intercept(handler: IInterceptor<IMapWillChange<string, ExtractT<IT>>>): Lambda
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

/**
 * @internal
 * @private
 */
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
                key = "" + (value as any)[mapType.mapIdentifierAttribute!]
                this.set(key, value)
                return this.get(key) as any
            }
            return fail(needsIdentifierError)
        }
    }
}

/**
 * @internal
 * @private
 */
export class MapType<
    IT extends IAnyType,
    C = ExtractC<IT>,
    S = ExtractS<IT>,
    T = ExtractT<IT>
> extends ComplexType<IKeyValueMap<C> | undefined, IKeyValueMap<S>, IMSTMap<IT>> {
    shouldAttachNode = true
    subType: IAnyType
    identifierMode: MapIdentifierMode = MapIdentifierMode.UNKNOWN
    mapIdentifierAttribute: string | undefined = undefined
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
                this.mapIdentifierAttribute = identifierAttribute
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

    createNewInstance(node: INode, childNodes: IChildNodesMap, snapshot: any): IMSTMap<any> {
        return (new MSTMap(childNodes) as any) as IMSTMap<any>
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
                    typecheckInternal(subType, newValue)
                    change.newValue = subType.reconcile(node.getChildNode(key), change.newValue)
                    mapType.processIdentifier(key, change.newValue as INode)
                }
                break
            case "add":
                {
                    typecheckInternal(subType, change.newValue)
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
        typecheckInternal(this, snapshot)
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
export function map<IT extends IAnyType>(subtype: IT): IMapType<IT> {
    const ret = new MapType<IT>(`map<string, ${subtype.name}>`, subtype)
    return ret as typeof ret & OptionalProperty
}

/**
 * Returns if a given value represents a map type.
 *
 * @export
 * @template IT
 * @param {IT} type
 * @returns {type is IT}
 */
export function isMapType<IT extends IMapType<any>>(type: IT): type is IT {
    return isType(type) && (type.flags & TypeFlags.Map) > 0
}
