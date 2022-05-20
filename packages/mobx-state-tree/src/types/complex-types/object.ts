import {
    _interceptReads,
    action,
    computed,
    defineProperty,
    makeObservable,
    IKeyValueMap,
    IObjectWillChange,
    IObjectDidChange,
    intercept,
    observable,
    observe,
    values,
    keys
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
    isPlainObject,
    isType,
    IType,
    IValidationResult,
    ModelType,
    ObjectNode,
    typecheckInternal,
    typeCheckFailure,
    TypeFlags,
    EMPTY_OBJECT,
    AnyObjectNode,
    AnyNode,
    IAnyModelType,
    asArray,
    cannotDetermineSubtype,
    devMode,
    createActionInvoker,
    addHiddenFinalProp,
    addHiddenWritableProp,
    IHooksGetter,
    ModelActions,
    Instance,
    Hook
} from "../../internal"

const PRE_PROCESS_SNAPSHOT = "preProcessSnapshot"
const POST_PROCESS_SNAPSHOT = "postProcessSnapshot"

/** @hidden */
export interface IObjectType<IT extends IAnyType,OTHERS={}>
    extends IType<
        IKeyValueMap<IT["CreationType"]> | undefined,
        IKeyValueMap<IT["SnapshotType"]>,
        IMSTObject<IT,OTHERS>
    > {
    hooks(hooks: IHooksGetter<IMSTObject<IT>>): IObjectType<IT>,
    actions<A extends ModelActions>(
        fn: (self: Instance<this>) => A
    ): IObjectType<IT,OTHERS&A>
    views<V extends Object>(
        fn: (self: Instance<this>) => V
    ): IObjectType<IT,OTHERS&V>
}

/** @hidden */
export type IMSTObject<IT extends IAnyType,OTHERS={}> = {
    [key: string]: IT["Type"]
}& OTHERS

function tryCollectModelTypes(type: IAnyType, modelTypes: Array<IAnyModelType>): boolean {
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
export enum ObjectIdentifierMode {
    UNKNOWN,
    YES,
    NO
}

/**
 * @internal
 * @hidden
 */
export class ObjectType<IT extends IAnyType,OTHERS={}> extends ComplexType<
    IKeyValueMap<IT["CreationType"]> | undefined,
    IKeyValueMap<IT["SnapshotType"]>,
    IMSTObject<IT,OTHERS>
> {
    identifierMode: ObjectIdentifierMode = ObjectIdentifierMode.UNKNOWN
    objectIdentifierAttribute: string | undefined = undefined
    readonly flags = TypeFlags.Object

    private readonly hookInitializers: Array<IHooksGetter<IMSTObject<IT>>> = []
    private readonly initializers: ((instance: any) => any)[] = []

    constructor(
        name: string,
        private readonly _subType: IAnyType,
        hookInitializers: Array<IHooksGetter<IMSTObject<IT>>> = [],
        initializers: ((instance: any) => any)[]=[],
    ) {
        super(name)
        this._determineIdentifierMode()
        this.hookInitializers = hookInitializers
        this.initializers = initializers
    }

    hooks(hooks: IHooksGetter<IMSTObject<IT>>) {
        const hookInitializers =
            this.hookInitializers.length > 0 ? this.hookInitializers.concat(hooks) : [hooks]
        return new ObjectType(this.name, this._subType, hookInitializers,this.initializers)
    }

    actions<A extends ModelActions>(fn: (self: Instance<this>) => A) {
        const actionInitializers = (self: Instance<this>) => {
            this.instantiateActions(self, fn(self))
            return self
        }
        const initializers = this.initializers.concat([actionInitializers])

        return new ObjectType(this.name, this._subType, this.hookInitializers,initializers)
    }

    views<V extends Object>(fn: (self: Instance<this>) => V) {
        const viewInitializer = (self: Instance<this>) => {
            this.instantiateViews(self, fn(self))
            return self
        }
        const initializers = this.initializers.concat([viewInitializer])

        return new ObjectType(this.name, this._subType, this.hookInitializers,initializers)
    }

    private instantiateActions(self: this["T"], actions: ModelActions): void {
        // check if return is correct
        if (!isPlainObject(actions))
            throw fail(`actions initializer should return a plain object containing actions`)

        // bind actions to the object created
        Object.keys(actions).forEach((name) => {
            // warn if preprocessor was given
            if (name === PRE_PROCESS_SNAPSHOT)
                throw fail(
                    `Cannot define action '${PRE_PROCESS_SNAPSHOT}', it should be defined using 'type.preProcessSnapshot(fn)' instead`
                )
            // warn if postprocessor was given
            if (name === POST_PROCESS_SNAPSHOT)
                throw fail(
                    `Cannot define action '${POST_PROCESS_SNAPSHOT}', it should be defined using 'type.postProcessSnapshot(fn)' instead`
                )

            let action2 = actions[name]

            // apply hook composition
            let baseAction = (self as any)[name]
            if (name in Hook && baseAction) {
                let specializedAction = action2
                action2 = function () {
                    baseAction.apply(null, arguments)
                    specializedAction.apply(null, arguments)
                }
            }

            // the goal of this is to make sure actions using "this" can call themselves,
            // while still allowing the middlewares to register them
            const middlewares = (action2 as any).$mst_middleware // make sure middlewares are not lost
            let boundAction = action2.bind(actions)
            boundAction.$mst_middleware = middlewares
            const actionInvoker = createActionInvoker(self as any, name, boundAction)
            actions[name] = actionInvoker

            // See #646, allow models to be mocked
            ;(!devMode() ? addHiddenFinalProp : addHiddenWritableProp)(self, name, actionInvoker)
        })
    }

    private instantiateViews(self: this["T"], views: Object): void {
        // check views return
        if (!isPlainObject(views))
            throw fail(`views initializer should return a plain object containing views`)
        Object.keys(views).forEach((key) => {
            // is this a computed property?
            const descriptor = Object.getOwnPropertyDescriptor(views, key)!
            if ("get" in descriptor) {
                defineProperty(self, key, descriptor)
                makeObservable(self, { [key]: computed } as any)
            } else if (typeof descriptor.value === "function") {
                // this is a view function, merge as is!
                // See #646, allow models to be mocked
                ;(!devMode() ? addHiddenFinalProp : addHiddenWritableProp)(
                    self,
                    key,
                    descriptor.value
                )
            } else {
                throw fail(`A view member should either be a function or getter based property`)
            }
        })
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
        if (this.identifierMode !== ObjectIdentifierMode.UNKNOWN) {
            return
        }

        const modelTypes: IAnyModelType[] = []
        if (tryCollectModelTypes(this._subType, modelTypes)) {
            let identifierAttribute: string | undefined = undefined
            modelTypes.forEach((type) => {
                if (type.identifierAttribute) {
                    if (identifierAttribute && identifierAttribute !== type.identifierAttribute) {
                        throw fail(
                            `The objects in a dynamic object should all have the same identifier attribute, expected '${identifierAttribute}', but child of type '${type.name}' declared attribute '${type.identifierAttribute}' as identifier`
                        )
                    }
                    identifierAttribute = type.identifierAttribute
                }
            })
            if (identifierAttribute) {
                this.identifierMode = ObjectIdentifierMode.YES
                this.objectIdentifierAttribute = identifierAttribute
            } else {
                this.identifierMode = ObjectIdentifierMode.NO
            }
        }
    }

    initializeChildNodes(objNode: this["N"], initialSnapshot: this["C"] = {}): IChildNodesMap {
        const subType = (objNode.type as this)._subType
        const result: IChildNodesMap = {}
        Object.keys(initialSnapshot!).forEach((name) => {
            result[name] = subType.instantiate(objNode, name, undefined, initialSnapshot[name])
        })
        return result
    }

    createNewInstance(childNodes: IChildNodesMap): this["T"] {
        return observable(childNodes, undefined, { deep: false }) as any
    }

    finalizeNewInstance(node: this["N"], instance: this["T"]): void {
        Object.keys(instance).forEach((name) => {
            _interceptReads(instance, name, node.unbox)
        })
        const type = node.type as this
        type.hookInitializers.forEach((initializer) => {
            const hooks = initializer(instance as unknown as IMSTObject<IT>)
            Object.keys(hooks).forEach((name) => {
                const hook = hooks[name as keyof typeof hooks]!
                const actionInvoker = createActionInvoker(instance as IAnyStateTreeNode, name, hook)
                ;(!devMode() ? addHiddenFinalProp : addHiddenWritableProp)(
                    instance,
                    name,
                    actionInvoker
                )
            })
        })
        type.initializers.reduce((self,fn) => fn(self), instance)
        intercept(instance, this.willChange)
        observe(instance, this.didChange)
    }

    describe() {
        return "{[key: string]: " + this._subType.describe() + "}"
    }

    getChildren(node: this["N"]): ReadonlyArray<AnyNode> {
        return values(node.storedValue)
    }

    getChildNode(node: this["N"], key: string): AnyNode {
        const childNode = node.storedValue["" + key]
        if (!childNode) throw fail("Not a child " + key)
        return childNode
    }

    willChange(
        change: IObjectWillChange<IKeyValueMap<AnyNode>>
    ): IObjectWillChange<IKeyValueMap<AnyNode>> | null {
        const node = getStateTreeNode(change.object as IAnyStateTreeNode)
        const key = change.name as string
        node.assertWritable({ subpath: key })
        const objectType = node.type as this
        const subType = objectType._subType

        switch (change.type) {
            case "update":
                const oldValue = change.object[key]
                if (change.newValue === oldValue) return null
                typecheckInternal(subType, change.newValue)
                change.newValue = subType.reconcile(
                    node.getChildNode(key),
                    change.newValue,
                    node,
                    key
                )
                objectType.processIdentifier(key, change.newValue)
                break
            case "add":
                typecheckInternal(subType, change.newValue)
                change.newValue = subType.instantiate(node, key, undefined, change.newValue)
                objectType.processIdentifier(key, change.newValue)
                break
        }
        return change
    }

    private processIdentifier(expected: string, node: AnyNode): void {
        if (this.identifierMode === ObjectIdentifierMode.YES && node instanceof ObjectNode) {
            const identifier = node.identifier!
            if (identifier !== expected)
                throw fail(
                    `A dynamic object of objects containing an identifier should always store the object under their own identifier. Trying to store key '${identifier}', but expected: '${expected}'`
                )
        }
    }

    getSnapshot(node: this["N"]): this["S"] {
        const res: any = {}
        node.getChildren().forEach((childNode) => {
            res[childNode.subpath] = childNode.snapshot
        })
        return res
    }

    processInitialSnapshot(childNodes: IChildNodesMap): this["S"] {
        const processed: any = {}
        Object.keys(childNodes).forEach((key) => {
            processed[key] = childNodes[key].getSnapshot()
        })
        return processed
    }

    didChange(chg: IObjectDidChange<IKeyValueMap<AnyNode>>): void {
        const node = getStateTreeNode(chg.object as IAnyStateTreeNode)
        const change = chg as IObjectWillChange & { newValue?: any; oldValue?: any }
        const value = change.newValue?.snapshot
        const oldValue = change.oldValue?.snapshot

        switch (change.type) {
            case "update":
                return node.emitPatch(
                    {
                        op: "replace",
                        path: escapeJsonPath(change.name as string),
                        value,
                        oldValue
                    },
                    node
                )
            case "add":
                _interceptReads(change.object, change.name as string, node.unbox)
                return node.emitPatch(
                    {
                        op: "add",
                        path: escapeJsonPath(change.name as string),
                        value,
                        oldValue
                    },
                    node
                )
            case "remove":
                change.oldValue.die()
                return node.emitPatch(
                    {
                        op: "remove",
                        path: escapeJsonPath(change.name as string),
                        oldValue
                    },
                    node
                )
        }
    }

    applyPatchLocally(node: this["N"], subpath: string, patch: IJsonPatch): void {
        const target = node.storedValue as any
        switch (patch.op) {
            case "add":
            case "replace":
                target[subpath] = patch.value
                break
            case "remove":
                delete target[subpath]
                break
        }
    }

    applySnapshot(node: this["N"], snapshot: this["C"]): void {
        typecheckInternal(this, snapshot)
        const target = node.storedValue
        const currentKeys: { [key: string]: boolean } = {}
        keys(target).forEach((key) => {
            currentKeys[key as string] = false
        })
        if (snapshot) {
            for (let key in snapshot) {
                ;(target as any)[key] = snapshot[key]
                currentKeys["" + key] = true
            }
        }
        Object.keys(currentKeys).forEach((key) => {
            if (currentKeys[key] === false) delete target[key]
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
            Object.keys(value).map((path) =>
                this._subType.validate(value[path], getContextForPath(context, path, this._subType))
            )
        )
    }

    getDefaultSnapshot(): this["C"] {
        return EMPTY_OBJECT as this["C"]
    }

    removeChild(node: this["N"], subpath: string) {
        delete node.storedValue[subpath]
    }
}
ObjectType.prototype.applySnapshot = action(ObjectType.prototype.applySnapshot)

export function object<IT extends IAnyType>(subtype: IT): IObjectType<IT> {
    return new ObjectType<IT>(`{[key:string] ${subtype.name}}`, subtype) as any
}

/**
 * Returns if a given value represents a dynameic object type.
 *
 * @param type
 * @returns `true` if it is a dynameic object type.
 */
export function isObjectType<Items extends IAnyType = IAnyType>(
    type: IAnyType
): type is IObjectType<Items> {
    return isType(type) && (type.flags & TypeFlags.Object) > 0
}
