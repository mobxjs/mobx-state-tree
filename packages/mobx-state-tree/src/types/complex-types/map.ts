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
    createObjectNode,
    escapeJsonPath,
    fail,
    flattenTypeErrors,
    getContextForPath,
    getStateTreeNode,
    IAnyStateTreeNode,
    IAnyType,
    IChildNodesMap,
    IValidationContext,
    IJsonPatch,
    isMutable,
    isPlainObject,
    isStateTreeNode,
    isType,
    IType,
    IValidationResult,
    ModelType,
    ObjectNode,
    typecheckInternal,
    typeCheckFailure,
    TypeFlags,
    EMPTY_OBJECT,
    ExtractC,
    ExtractS,
    normalizeIdentifier,
    AnyObjectNode,
    AnyNode,
    AnyModelType,
    asArray,
    cannotDetermineSubtype,
    ExtractTWithSTN,
    ExtractCSTWithSTN
} from "../../internal"
import { ExtractTWithoutSTN } from "../../core/type/type"

/** @hidden */
export interface IMapType<IT extends IAnyType>
    extends IType<
        IKeyValueMap<ExtractC<IT>> | undefined,
        IKeyValueMap<ExtractS<IT>>,
        IMSTMap<IT>
    > {}

/** @hidden */
export interface IMSTMap<IT extends IAnyType> {
    // bases on ObservableMap, but fine tuned to the auto snapshot conversion of MST

    clear(): void
    delete(key: string): boolean
    forEach(
        callbackfn: (value: ExtractTWithSTN<IT>, key: string, map: this) => void,
        thisArg?: any
    ): void
    get(key: string): ExtractTWithSTN<IT> | undefined
    has(key: string): boolean
    set(key: string, value: ExtractCSTWithSTN<IT>): this
    readonly size: number
    put(value: ExtractCSTWithSTN<IT>): ExtractTWithSTN<IT>
    keys(): IterableIterator<string>
    values(): IterableIterator<ExtractTWithSTN<IT>>
    entries(): IterableIterator<[string, ExtractTWithSTN<IT>]>
    [Symbol.iterator](): IterableIterator<[string, ExtractTWithSTN<IT>]>
    /** Merge another object into this map, returns self. */
    merge(
        other:
            | IMSTMap<IType<any, any, ExtractTWithoutSTN<IT>>>
            | IKeyValueMap<ExtractCSTWithSTN<IT>>
            | any
    ): this
    replace(
        values:
            | IMSTMap<IType<any, any, ExtractTWithoutSTN<IT>>>
            | IKeyValueMap<ExtractCSTWithSTN<IT>>
            | any
    ): this

    /**
     * Returns a plain object that represents this map.
     * Note that all the keys being stringified.
     * If there are duplicating keys after converting them to strings, behaviour is undetermined.
     */
    toPOJO(): IKeyValueMap<ExtractS<IT>>
    toJSON(): IKeyValueMap<ExtractS<IT>>

    /**
     * Returns a shallow non observable object clone of this map.
     * Note that the values migth still be observable. For a deep clone use mobx.toJS.
     */
    toJS(): Map<string, ExtractTWithSTN<IT>>

    toString(): string
    [Symbol.toStringTag]: "Map"

    /**
     * Observes this object. Triggers for the events 'add', 'update' and 'delete'.
     * See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
     * for callback details
     */
    observe(
        listener: (changes: IMapDidChange<string, ExtractTWithSTN<IT>>) => void,
        fireImmediately?: boolean
    ): Lambda
    intercept(handler: IInterceptor<IMapWillChange<string, ExtractTWithSTN<IT>>>): Lambda
}

const needsIdentifierError = `Map.put can only be used to store complex values that have an identifier type attribute`

function tryCollectModelTypes(type: IAnyType, modelTypes: Array<AnyModelType>): boolean {
    const subtypes = type.getSubTypes()
    if (subtypes === cannotDetermineSubtype) {
        return false
    }
    if (subtypes) {
        const subtypesArray = asArray(subtypes)
        for (const subtype of subtypesArray) {
            if (!tryCollectModelTypes(subtype, modelTypes)) return false
        }
    }
    if (type instanceof ModelType) {
        modelTypes.push(type)
    }
    return true
}

/**
 * @internal
 * @hidden
 */
export enum MapIdentifierMode {
    UNKNOWN,
    YES,
    NO
}

class MSTMap<IT extends IAnyType> extends ObservableMap<string, any> {
    constructor(initialData?: [string, any][] | IKeyValueMap<any> | Map<string, any> | undefined) {
        super(initialData, observable.ref.enhancer)
    }

    get(key: string): ExtractTWithSTN<IT> | undefined {
        // maybe this is over-enthousiastic? normalize numeric keys to strings
        return super.get("" + key)
    }

    has(key: string) {
        return super.has("" + key)
    }

    delete(key: string) {
        return super.delete("" + key)
    }

    set(key: string, value: ExtractCSTWithSTN<IT>): this {
        return super.set("" + key, value)
    }

    put(value: ExtractCSTWithSTN<IT>): ExtractTWithSTN<IT> {
        if (!value) throw fail(`Map.put cannot be used to set empty values`)
        if (isStateTreeNode(value)) {
            const node = getStateTreeNode(value)
            if (process.env.NODE_ENV !== "production") {
                if (!node.identifierAttribute) throw fail(needsIdentifierError)
            }
            this.set(node.identifier!, value)
            return value as any
        } else if (!isMutable(value)) {
            throw fail(`Map.put can only be used to store complex values`)
        } else {
            const mapType = getStateTreeNode(this as IAnyStateTreeNode).type as MapType<any>
            if (mapType.identifierMode === MapIdentifierMode.NO) throw fail(needsIdentifierError)
            if (mapType.identifierMode === MapIdentifierMode.YES) {
                const key = normalizeIdentifier(value[mapType.mapIdentifierAttribute!])
                this.set(key, value)
                return this.get(key) as any
            }
            throw fail(needsIdentifierError)
        }
    }
}

/**
 * @internal
 * @hidden
 */
export class MapType<IT extends IAnyType> extends ComplexType<
    IKeyValueMap<ExtractC<IT>> | undefined,
    IKeyValueMap<ExtractS<IT>>,
    IMSTMap<IT>
> {
    identifierMode: MapIdentifierMode = MapIdentifierMode.UNKNOWN
    mapIdentifierAttribute: string | undefined = undefined
    readonly flags = TypeFlags.Map

    constructor(name: string, private readonly _subType: IAnyType) {
        super(name)
        this._determineIdentifierMode()
    }

    instantiate(
        parent: AnyObjectNode | null,
        subpath: string,
        environment: any,
        initialValue: this["C"] | this["T"]
    ): this["N"] {
        this._determineIdentifierMode()
        return createObjectNode(this, parent, subpath, environment, initialValue)
    }

    private _determineIdentifierMode() {
        if (this.identifierMode !== MapIdentifierMode.UNKNOWN) {
            return
        }

        const modelTypes: AnyModelType[] = []
        if (tryCollectModelTypes(this._subType, modelTypes)) {
            let identifierAttribute: string | undefined = undefined
            modelTypes.forEach(type => {
                if (type.identifierAttribute) {
                    if (identifierAttribute && identifierAttribute !== type.identifierAttribute) {
                        throw fail(
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

    initializeChildNodes(objNode: this["N"], initialSnapshot: this["C"] = {}): IChildNodesMap {
        const subType = (objNode.type as this)._subType
        const environment = objNode.environment
        const result: IChildNodesMap = {}
        Object.keys(initialSnapshot!).forEach(name => {
            result[name] = subType.instantiate(objNode, name, environment, initialSnapshot[name])
        })

        return result
    }

    createNewInstance(node: this["N"], childNodes: IChildNodesMap): this["T"] {
        return new MSTMap(childNodes) as any
    }

    finalizeNewInstance(node: this["N"], instance: ObservableMap<string, any>): void {
        _interceptReads(instance, node.unbox)
        intercept(instance, this.willChange)
        observe(instance, this.didChange)
    }

    describe() {
        return "Map<string, " + this._subType.describe() + ">"
    }

    getChildren(node: this["N"]): ReadonlyArray<AnyNode> {
        // return (node.storedValue as ObservableMap<any>).values()
        return values(node.storedValue)
    }

    getChildNode(node: this["N"], key: string): AnyNode {
        const childNode = node.storedValue.get("" + key)
        if (!childNode) throw fail("Not a child " + key)
        return childNode
    }

    willChange(change: IMapWillChange<string, AnyNode>): IMapWillChange<string, AnyNode> | null {
        const node = getStateTreeNode(change.object as IAnyStateTreeNode)
        const key = change.name
        node.assertWritable({ subpath: key })
        const mapType = node.type as this
        const subType = mapType._subType

        switch (change.type) {
            case "update":
                {
                    const { newValue } = change
                    const oldValue = change.object.get(key)
                    if (newValue === oldValue) return null
                    typecheckInternal(subType, newValue)
                    change.newValue = subType.reconcile(node.getChildNode(key), change.newValue)
                    mapType.processIdentifier(key, change.newValue)
                }
                break
            case "add":
                {
                    typecheckInternal(subType, change.newValue)
                    change.newValue = subType.instantiate(node, key, undefined, change.newValue)
                    mapType.processIdentifier(key, change.newValue)
                }
                break
        }
        return change
    }

    private processIdentifier(expected: string, node: AnyNode): void {
        if (this.identifierMode === MapIdentifierMode.YES && node instanceof ObjectNode) {
            const identifier = node.identifier!
            if (identifier !== expected)
                throw fail(
                    `A map of objects containing an identifier should always store the object under their own identifier. Trying to store key '${identifier}', but expected: '${expected}'`
                )
        }
    }

    getSnapshot(node: this["N"]): this["S"] {
        const res: this["S"] = {}
        node.getChildren().forEach(childNode => {
            res[childNode.subpath] = childNode.snapshot
        })
        return res
    }

    processInitialSnapshot(childNodes: IChildNodesMap): this["S"] {
        const processed: this["S"] = {}
        Object.keys(childNodes).forEach(key => {
            processed[key] = childNodes[key].getSnapshot()
        })
        return processed
    }

    didChange(change: IMapDidChange<string, AnyNode>): void {
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
                    {
                        op: "remove",
                        path: escapeJsonPath(change.name),
                        oldValue: oldSnapshot
                    },
                    node
                )
        }
    }

    applyPatchLocally(node: this["N"], subpath: string, patch: IJsonPatch): void {
        const target = node.storedValue
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
    applySnapshot(node: this["N"], snapshot: this["C"]): void {
        typecheckInternal(this, snapshot)
        const target = node.storedValue
        const currentKeys: { [key: string]: boolean } = {}
        Array.from(target.keys()).forEach(key => {
            currentKeys[key] = false
        })
        if (snapshot) {
            // Don't use target.replace, as it will throw away all existing items first
            for (let key in snapshot) {
                target.set(key, snapshot[key])
                currentKeys["" + key] = true
            }
        }
        Object.keys(currentKeys).forEach(key => {
            if (currentKeys[key] === false) target.delete(key)
        })
    }

    getChildType(): IAnyType {
        return this._subType
    }

    isValidSnapshot(value: this["C"], context: IValidationContext): IValidationResult {
        if (!isPlainObject(value)) {
            return typeCheckFailure(context, value, "Value is not a plain object")
        }

        return flattenTypeErrors(
            Object.keys(value).map(path =>
                this._subType.validate(value[path], getContextForPath(context, path, this._subType))
            )
        )
    }

    getDefaultSnapshot(): this["C"] {
        return EMPTY_OBJECT as this["C"]
    }

    removeChild(node: this["N"], subpath: string) {
        node.storedValue.delete(subpath)
    }
}

/**
 * `types.map` - Creates a key based collection type who's children are all of a uniform declared type.
 * If the type stored in a map has an identifier, it is mandatory to store the child under that identifier in the map.
 *
 * This type will always produce [observable maps](https://mobx.js.org/refguide/map.html)
 *
 * Example:
 * ```ts
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
 * ```
 *
 * @param subtype
 * @returns
 */
export function map<IT extends IAnyType>(subtype: IT): IMapType<IT> {
    return new MapType<IT>(`map<string, ${subtype.name}>`, subtype)
}

/**
 * Returns if a given value represents a map type.
 *
 * @param type
 * @returns `true` if it is a map type.
 */
export function isMapType<Items extends IAnyType = IAnyType>(
    type: IAnyType
): type is IMapType<Items> {
    return isType(type) && (type.flags & TypeFlags.Map) > 0
}
