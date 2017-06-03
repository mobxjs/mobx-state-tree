import { observable, ObservableMap, IMapChange, IMapWillChange, action, intercept, observe, extras } from "mobx"
import { getComplexNode, escapeJsonPath, IJsonPatch, Node, unbox, isComplexValue } from "../../core"
import { identity, isPlainObject, nothing, isPrimitive, fail, addHiddenFinalProp } from "../../utils"
import { IType, IComplexType, TypeFlags, isType, ComplexType } from "../type"
import { IContext, IValidationResult, typeCheckFailure, flattenTypeErrors, getContextForPath } from "../type-checker"

interface IMapFactoryConfig {
    isMapFactory: true
}

export interface IExtendedObservableMap<T> extends ObservableMap<T> {
    put(value: T | any): this // downtype to any, again, because we cannot type the snapshot, see
}

export function mapToString(this: ObservableMap<any>) {
    return `${getComplexNode(this)}(${this.size} items)`
}

function put(this: ObservableMap<any>, value: any) {
    if (!(!!value)) fail(`Map.put cannot be used to set empty values`)
    if (!isComplexValue(value)) fail(`Map.put can only be used to store complex values`)
    const id = getComplexNode(value).identifierAttribute!
    if (!id) fail(`Map.put can only be used to store complex values that have an identifier type attribute`)
    this.set(id, value)
    return this
}

export class MapType<S, T> extends ComplexType<{[key: string]: S}, IExtendedObservableMap<T>> {
    shouldAttachNode = true
    subType: IType<any, any>
    readonly flags = TypeFlags.Map

    constructor(name: string, subType: IType<any, any>) {
        super(name)
        this.subType = subType
    }

    describe() {
        return "Map<string, " + this.subType.describe() + ">"
    }

    createNewInstance() {
        // const identifierAttr = getIdentifierAttribute(this.subType)
        const map = observable.shallowMap()
        extras.getAdministration(map).dehancer = unbox

        addHiddenFinalProp(map, "put", put)
        addHiddenFinalProp(map, "toString", mapToString)
        return map
    }

    finalizeNewInstance(instance: ObservableMap<any>, snapshot: any) {
        intercept(instance, c => this.willChange(c))
        observe(instance, this.didChange)
        getComplexNode(instance).applySnapshot(snapshot)
    }

    getChildren(node: Node): Node[] {
        const res: Node[] = [];
        // Ignore all alarm bells to be able to read this:...
        (node.storedValue as ObservableMap<any>).keys().forEach(key => {
            const childNode = node.storedValue._data[key].get()
            if(childNode) res.push(childNode)
        })
        return res
    }

    getChildNode(node: Node, key: string): Node {
        const childNode = node.storedValue._data[key]
        if (!childNode)
            fail("Not a child" + key)
        return childNode.get()
    }

    willChange(change: IMapWillChange<any>): IMapWillChange<any> | null {

        const node = getComplexNode(change.object)
        node.assertWritable()

        switch (change.type) {
            case "update":
                {
                    const {newValue} = change
                    const oldValue = change.object.get(change.name)
                    if (newValue === oldValue)
                        return null
                    change.newValue = node.reconcileChild(this.subType, this.getChildNode(node, change.name), newValue, change.name)
                    this.verifyIdentifier(change.name, change.newValue as Node)
                }
                break
            case "add":
                {
                    const {newValue} = change
                    change.newValue = node.reconcileChild(this.subType, null, newValue, change.name)
                    this.verifyIdentifier(change.name, change.newValue as Node)
                }
                break
            case "delete":
                {
                    this.getChildNode(node, change.name).die()
                }
                break
        }
        return change
    }

    private verifyIdentifier(expected: string, node: Node) {
        const identifier = node.identifier
        if (identifier !== null && identifier !== expected)
            fail(`A map of objects containing an identifier should always store the object under their own identifier. Trying to store key '${expected}', but expected: '${identifier}'`)
    }

    getValue(node: Node): any {
        return node.storedValue
    }

    getSnapshot(node: Node): { [key: string]: any } {
        const res: {[key: string]: any} = {}
        node.getChildren().forEach(childNode => {
            res[childNode.subpath] = childNode.snapshot
        })
        return res
    }

    didChange(change: IMapChange<any>): void {
        const node = getComplexNode(change.object)
        switch (change.type) {
            case "update":
            case "add":
                return void node.emitPatch({
                    op: change.type === "add" ? "add" : "replace",
                    path: escapeJsonPath(change.name),
                    value: node.getChildNode(change.name).snapshot
                }, node)
            case "delete":
                return void node.emitPatch({
                    op: "remove",
                    path: escapeJsonPath(change.name)
                }, node)
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

    @action applySnapshot(node: Node, snapshot: any): void {
        node.pseudoAction(() => {
            const target = node.storedValue as ObservableMap<any>
            target.replace(snapshot)
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
            Object.keys(value).map(
                (path) => this.subType.validate(value[path], getContextForPath(context, path, this.subType))
            )
        )
    }

    getDefaultSnapshot() {
        return {}
    }

    removeChild(node: Node, subpath: string) {
        (node.storedValue as ObservableMap<any>).delete(subpath)
    }
}

export function map<S, T>(subtype: IType<S, T>): IComplexType<{[key: string]: S}, IExtendedObservableMap<T>> {
    return new MapType<S, T>(`map<string, ${subtype.name}>`, subtype)
}

export function isMapFactory<S, T>(type: any): type is IComplexType<{[key: string]: S}, IExtendedObservableMap<T>> {
    return isType(type) && ((type as IType<any, any>).flags & TypeFlags.Map) > 0
}
