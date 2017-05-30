import { getIdentifierAttribute } from "./object"
import { observable, ObservableMap, IMapChange, IMapWillChange, action, intercept, observe } from "mobx"
import { getComplexNode, escapeJsonPath, IJsonPatch, AbstractNode } from "../../core"
import { identity, isPlainObject, nothing, isPrimitive, fail, addHiddenFinalProp } from "../../utils"
import { IType, IComplexType, TypeFlags, isType } from "../type"
import { IContext, IValidationResult, typeCheckFailure, flattenTypeErrors, getContextForPath } from "../type-checker"
import { ComplexType } from "./complex-type"

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
    const identifierAttr = getIdentifierAttribute((getComplexNode(this).type as MapType<any, any>).subType)
    if (!(!!identifierAttr)) fail(`Map.put is only supported if the subtype has an idenfier attribute`)
    if (!(!!value)) fail(`Map.put cannot be used to set empty values`)
    this.set(value[identifierAttr!], value)
    return this
}

export class MapType<S, T> extends ComplexType<{[key: string]: S}, IExtendedObservableMap<T>> {
    isMapFactory = true
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

        addHiddenFinalProp(map, "put", put)
        addHiddenFinalProp(map, "toString", mapToString)
        return map
    }

    finalizeNewInstance(instance: ObservableMap<any>, snapshot: any) {
        intercept(instance, c => this.willChange(c))
        observe(instance, this.didChange)
        getComplexNode(instance).applySnapshot(snapshot)
    }

    getChildren(node: AbstractNode): AbstractNode[] {
        const res: AbstractNode[] = []
        // Ignore all alarm bells to be able to read this:...
        Object.keys(node.storedValue.$mobx.values).forEach(key => {
            res.push(node.storedValue.$mobx.values[key].value)
        })
        return res
    }

    getChildNode(node: AbstractNode, key: string): AbstractNode {
        const childNode = node.storedValue.$mobx.values[key]
        if (!childNode)
            fail("Not a child" + key)
        return childNode
    }

    willChange(change: IMapWillChange<any>): IMapWillChange<any> | null {
        const node = getComplexNode(change.object)
        node.assertWritable()

        // Q: how to create a map that is not keyed by identifier, but contains objects with identifiers? Is that a use case? A: No, that is were reference maps should come into play...
        const identifierAttr = getIdentifierAttribute(node.type)
        if (identifierAttr && change.newValue && typeof change.newValue === "object" && change.newValue[identifierAttr] !== change.name)
            fail(`A map of objects containing an identifier should always store the object under their own identifier. Trying to store key '${change.name}', but expected: '${change.newValue[identifierAttr!]}'`)

        switch (change.type) {
            case "update":
                {
                    const {newValue} = change
                    const oldValue = change.object.get(change.name)
                    if (newValue === oldValue)
                        return null
                    change.newValue = node.reconcileChildren(this.subType, [this.getChildNode(node, change.name)], [newValue], [change.name])[0]
                }
                break
            case "add":
                {
                    const {newValue} = change
                    change.newValue = node.reconcileChildren(this.subType, [], [newValue], [change.name])[0]
                }
                break
            case "delete":
                {
                    node.reconcileChildren(this.subType, [this.getChildNode(node, change.name)], [], [])
                }
                break
        }
        return change
    }

    serialize(node: AbstractNode): Object {
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

    applyPatchLocally(node: AbstractNode, subpath: string, patch: IJsonPatch): void {
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

    @action applySnapshot(node: AbstractNode, snapshot: any): void {
        node.pseudoAction(() => {
            const target = node.storedValue as ObservableMap<any>
            target.replace(snapshot)
            // const identifierAttr = getIdentifierAttribute(this.subType)
            // // Try to update snapshot smartly, by reusing instances under the same key as much as possible
            // const currentKeys: { [key: string]: boolean } = {}
            // target.keys().forEach(key => { currentKeys[key] = false })
            // Object.keys(snapshot).forEach(key => {
            //     const item = snapshot[key]
            //     if (identifierAttr && item && typeof item === "object" && key !== item[identifierAttr])
            //         fail(`A map of objects containing an identifier should always store the object under their own identifier. Trying to store key '${key}', but expected: '${item[identifierAttr]}'`)
            //     // if snapshot[key] is non-primitive, and this.get(key) has a Node, update it, instead of replace
            //     if (key in currentKeys && !isPrimitive(item)) {
            //         currentKeys[key] = true
            //         maybeMST(
            //             target.get(key),
            //             propertyNode => {
            //                 // update existing instance
            //                 propertyNode.applySnapshot(item)
            //             },
            //             () => {
            //                 target.set(key, item)
            //             }
            //         )
            //     } else {
            //         target.set(key, item)
            //     }
            // })
            // Object.keys(currentKeys).forEach(key => {
            //     if (currentKeys[key] === false)
            //         target.delete(key)
            // })
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

    removeChild(node: AbstractNode, subpath: string) {
        (node.storedValue as ObservableMap<any>).delete(subpath)
    }

    get identifierAttribute() {
        return null
    }
}

export function map<S, T>(subtype: IType<S, T>): IComplexType<{[key: string]: S}, IExtendedObservableMap<T>> {
    return new MapType<S, T>(`map<string, ${subtype.name}>`, subtype)
}

export function isMapFactory<S, T>(type: any): type is IComplexType<{[key: string]: S}, IExtendedObservableMap<T>> {
    return isType(type) && ((type as IType<any, any>).flags & TypeFlags.Map) > 0
}
