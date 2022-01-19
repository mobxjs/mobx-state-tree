import {
    _interceptReads,
    action,
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
    IHooksGetter
} from "../../internal"

/** @hidden */
export interface IDynamicObjectType<IT extends IAnyType>
    extends IType<
        IKeyValueMap<IT["CreationType"]> | undefined,
        IKeyValueMap<IT["SnapshotType"]>,
        IMSTDynamicObject<IT>
    > {
    hooks(hooks: IHooksGetter<IMSTDynamicObject<IT>>): IDynamicObjectType<IT>
}

/** @hidden */
export type IMSTDynamicObject<IT extends IAnyType> = {
    [key: string]: IT["Type"]
}

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
export enum DynamicObjectIdentifierMode {
    UNKNOWN,
    YES,
    NO
}

/**
 * @internal
 * @hidden
 */
export class DynamicObjectType<IT extends IAnyType> extends ComplexType<
    IKeyValueMap<IT["CreationType"]> | undefined,
    IKeyValueMap<IT["SnapshotType"]>,
    IMSTDynamicObject<IT>
> {
    identifierMode: DynamicObjectIdentifierMode = DynamicObjectIdentifierMode.UNKNOWN
    objectIdentifierAttribute: string | undefined = undefined
    readonly flags = TypeFlags.DynamicObject

    private readonly hookInitializers: Array<IHooksGetter<IMSTDynamicObject<IT>>> = []

    constructor(
        name: string,
        private readonly _subType: IAnyType,
        hookInitializers: Array<IHooksGetter<IMSTDynamicObject<IT>>> = []
    ) {
        super(name)
        this._determineIdentifierMode()
        this.hookInitializers = hookInitializers
    }

    hooks(hooks: IHooksGetter<IMSTDynamicObject<IT>>) {
        const hookInitializers =
            this.hookInitializers.length > 0 ? this.hookInitializers.concat(hooks) : [hooks]
        return new DynamicObjectType(this.name, this._subType, hookInitializers)
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
        if (this.identifierMode !== DynamicObjectIdentifierMode.UNKNOWN) {
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
                this.identifierMode = DynamicObjectIdentifierMode.YES
                this.objectIdentifierAttribute = identifierAttribute
            } else {
                this.identifierMode = DynamicObjectIdentifierMode.NO
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
        return observable(childNodes, undefined, { deep: false })
    }

    finalizeNewInstance(node: this["N"], instance: this["T"]): void {
        Object.keys(instance).forEach((name) => {
            _interceptReads(instance, name, node.unbox)
        })
        const type = node.type as this
        type.hookInitializers.forEach((initializer) => {
            const hooks = initializer(instance as unknown as IMSTDynamicObject<IT>)
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
        intercept(instance, this.willChange)
        observe(instance, this.didChange)
    }

    describe() {
        return "{[key: string]: " + this._subType.describe() + "}"
    }

    getChildren(node: this["N"]): ReadonlyArray<AnyNode> {
        return values(node.storedValue) as any
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
        const dynamicObjectType = node.type as this
        const subType = dynamicObjectType._subType

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
                dynamicObjectType.processIdentifier(key, change.newValue)
                break
            case "add":
                typecheckInternal(subType, change.newValue)
                change.newValue = subType.instantiate(node, key, undefined, change.newValue)
                dynamicObjectType.processIdentifier(key, change.newValue)
                break
        }
        return change
    }

    private processIdentifier(expected: string, node: AnyNode): void {
        if (this.identifierMode === DynamicObjectIdentifierMode.YES && node instanceof ObjectNode) {
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
        const value = change.newValue.snapshot
        const oldValue = change.oldValue ? change.oldValue.snapshot : undefined

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
        const target = node.storedValue
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
DynamicObjectType.prototype.applySnapshot = action(DynamicObjectType.prototype.applySnapshot)

export function dynamicObject<IT extends IAnyType>(subtype: IT): IDynamicObjectType<IT> {
    return new DynamicObjectType<IT>(`{[key:string] ${subtype.name}}`, subtype)
}

/**
 * Returns if a given value represents a dynameic object type.
 *
 * @param type
 * @returns `true` if it is a dynameic object type.
 */
export function isDynamicObjectType<Items extends IAnyType = IAnyType>(
    type: IAnyType
): type is IDynamicObjectType<Items> {
    return isType(type) && (type.flags & TypeFlags.DynamicObject) > 0
}
