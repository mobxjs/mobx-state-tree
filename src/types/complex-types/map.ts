import { observable, ObservableMap, IMapChange, IMapWillChange, action, intercept, observe, extras } from "mobx"
import { getStateTreeNode, escapeJsonPath, IJsonPatch, Node, createNode, isStateTreeNode } from "../../core"
import { addHiddenFinalProp, fail, isMutable, isPlainObject } from "../../utils"
import { IType, IComplexType, ComplexType } from "../type"
import { TypeFlags } from "../type-flags"
import {
    IContext,
    IValidationResult,
    typeCheckFailure,
    flattenTypeErrors,
    getContextForPath,
    typecheck
} from "../type-checker"

interface IMapFactoryConfig {
    isMapFactory: true
}

export interface IExtendedObservableMap<T> extends ObservableMap<T> {
    put(value: T | any): this // downtype to any, again, because we cannot type the snapshot, see
}

export function mapToString(this: ObservableMap<any>) {
    return `${getStateTreeNode(this)}(${this.size} items)`
}

function put(this: ObservableMap<any>, value: any) {
    if (!!!value) fail(`Map.put cannot be used to set empty values`)
    let node: Node
    if (isStateTreeNode(value)) {
        node = getStateTreeNode(value)
    } else if (isMutable(value)) {
        const targetType = (getStateTreeNode(this).type as MapType<any, any>).subType
        node = getStateTreeNode(targetType.create(value))
    } else {
        return fail(`Map.put can only be used to store complex values`)
    }
    if (!node.identifierAttribute)
        fail(`Map.put can only be used to store complex values that have an identifier type attribute`)
    this.set(node.identifier!, node.value)
    return this
}

export class MapType<S, T> extends ComplexType<{ [key: string]: S }, IExtendedObservableMap<T>> {
    shouldAttachNode = true
    subType: IType<any, any>
    readonly flags = TypeFlags.Map

    constructor(name: string, subType: IType<any, any>) {
        super(name)
        this.subType = subType
    }

    instantiate(parent: Node | null, subpath: string, environment: any, snapshot: S): Node {
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

    describe() {
        return "Map<string, " + this.subType.describe() + ">"
    }

    createNewInstance = () => {
        // const identifierAttr = getIdentifierAttribute(this.subType)
        const map = observable.shallowMap()
        addHiddenFinalProp(map, "put", put)
        addHiddenFinalProp(map, "toString", mapToString)
        return map
    }

    finalizeNewInstance = (node: Node, snapshot: any) => {
        const instance = node.storedValue as ObservableMap<any>
        extras.interceptReads(instance, node.unbox)
        intercept(instance, c => this.willChange(c))
        node.applySnapshot(snapshot)
        observe(instance, this.didChange)
    }

    getChildren(node: Node): Node[] {
        return (node.storedValue as ObservableMap<any>).values()
    }

    getChildNode(node: Node, key: string): Node {
        const childNode = node.storedValue.get(key)
        if (!childNode) fail("Not a child " + key)
        return childNode
    }

    willChange(change: IMapWillChange<any>): IMapWillChange<any> | null {
        const node = getStateTreeNode(change.object)
        node.assertWritable()

        switch (change.type) {
            case "update":
                {
                    const { newValue } = change
                    const oldValue = change.object.get(change.name)
                    if (newValue === oldValue) return null
                    typecheck(this.subType, newValue)
                    change.newValue = this.subType.reconcile(node.getChildNode(change.name), change.newValue)
                    this.verifyIdentifier(change.name, change.newValue as Node)
                }
                break
            case "add":
                {
                    typecheck(this.subType, change.newValue)
                    change.newValue = this.subType.instantiate(node, change.name, undefined, change.newValue)
                    this.verifyIdentifier(change.name, change.newValue as Node)
                }
                break
            case "delete":
                {
                    node.getChildNode(change.name).die()
                }
                break
        }
        return change
    }

    private verifyIdentifier(expected: string, node: Node) {
        const identifier = node.identifier
        if (identifier !== null && "" + identifier !== "" + expected)
            fail(
                `A map of objects containing an identifier should always store the object under their own identifier. Trying to store key '${identifier}', but expected: '${expected}'`
            )
    }

    getValue(node: Node): any {
        return node.storedValue
    }

    getSnapshot(node: Node): { [key: string]: any } {
        const res: { [key: string]: any } = {}
        node.getChildren().forEach(childNode => {
            res[childNode.subpath] = childNode.snapshot
        })
        return res
    }

    didChange(change: IMapChange<any>): void {
        const node = getStateTreeNode(change.object)
        switch (change.type) {
            case "update":
            case "add":
                return void node.emitPatch(
                    {
                        op: change.type === "add" ? "add" : "replace",
                        path: escapeJsonPath(change.name),
                        value: node.getChildNode(change.name).snapshot
                    },
                    node
                )
            case "delete":
                return void node.emitPatch(
                    {
                        op: "remove",
                        path: escapeJsonPath(change.name)
                    },
                    node
                )
        }
    }

    applyPatchLocally(node: Node, subpath: string, patch: IJsonPatch): void {
        const target = node.storedValue as ObservableMap<any>
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
    applySnapshot(node: Node, snapshot: any): void {
        typecheck(this, snapshot)
        node.pseudoAction(() => {
            const target = node.storedValue as ObservableMap<any>
            const currentKeys: { [key: string]: boolean } = {}
            target.keys().forEach(key => {
                currentKeys[key] = false
            })
            // Don't use target.replace, as it will throw all existing items first
            Object.keys(snapshot).forEach(key => {
                target.set(key, snapshot[key])
                currentKeys[key] = true
            })
            Object.keys(currentKeys).forEach(key => {
                if (currentKeys[key] === false) target.delete(key)
            })
        })
    }

    getChildType(key: string): IType<any, any> {
        return this.subType
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (!isPlainObject(value)) {
            return typeCheckFailure(context, value)
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

    removeChild(node: Node, subpath: string) {
        ;(node.storedValue as ObservableMap<any>).delete(subpath)
    }
}

export function map<S, T>(subtype: IType<S, T>): IComplexType<{ [key: string]: S }, IExtendedObservableMap<T>> {
    return new MapType<S, T>(`map<string, ${subtype.name}>`, subtype)
}
