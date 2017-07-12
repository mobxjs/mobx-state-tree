import { when, action, observable, IObservableArray } from "mobx"
import { ISimpleType, Type, IType } from "../type"
import { TypeFlags } from "../type-flags"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure } from "../type-checker"
import { isSerializable, deepFreeze, fail } from "../../utils"
import { createNode, Node, isStateTreeNode } from "../../core"
import { frozen } from "./frozen"

export class Lazy<S, T, TR> extends Type<S, T | TR> {
    private replacementType: IType<S, TR>
    private shouldLoadPredicate: (value: any) => boolean
    private loadType: () => Promise<IType<S, T>>
    private loadedType: null | IType<S, T> = null
    private disposers: (() => void)[] = []
    private pendingNodeList: IObservableArray<Node> = observable.shallowArray()

    get flags() {
        return this.loadedType === null ? this.replacementType.flags : this.loadedType.flags
    }

    constructor(
        name: string,
        shouldLoadPredicate: (value: any) => boolean,
        loadType: () => Promise<IType<S, T>>,
        replacementType: IType<S, TR>
    ) {
        super(name)
        this.shouldLoadPredicate = shouldLoadPredicate
        this.loadType = loadType
        this.replacementType = replacementType

        when(
            () =>
                // any of the pending node has decided that the time has come
                this.pendingNodeList.length > 0 &&
                this.pendingNodeList.some(
                    (node: Node) =>
                        node.isAlive &&
                        this.shouldLoadPredicate(node.parent ? node.parent.value : null)
                ),
            () => {
                // load the real type
                this.loadType().then(
                    action((type: IType<S, T>) => {
                        // stores the loaded type
                        this.loadedType = type

                        // replace the replacement nodes with the correct one
                        this.pendingNodeList.forEach(node => {
                            if (!node.parent) return
                            if (!this.loadedType) return

                            node.parent.replaceChild(node.subpath, type.create(node.snapshot))
                        })
                    })
                )
            }
        )
    }

    describe() {
        return "lazy<" + this.name + ">"
    }

    instantiate(parent: Node | null, subpath: string, environment: any, value: any): Node {
        // because the node will be dropped and readded to the parent
        if (!parent || !isStateTreeNode(parent.storedValue))
            return fail(
                `lazy types can only be used as direct child of a model, array or map type.`
            )

        // use the replacement type if not loaded yet
        if (this.loadedType !== null) {
            // correct type has loaded
            return this.loadedType.instantiate(parent, subpath, environment, value)
        }

        // use the replacement type to create a temporary node
        const replacementNode = this.replacementType.instantiate(
            parent,
            subpath,
            environment,
            value
        )

        // make the node in "pendingNodeList" and remove it when it dies
        this.pendingNodeList.push(replacementNode)
        when(
            () => !replacementNode.isAlive,
            () => this.pendingNodeList.splice(this.pendingNodeList.indexOf(replacementNode), 1)
        )

        return replacementNode
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        return this.loadedType === null
            ? this.replacementType.validate(value, context)
            : this.loadedType.validate(value, context)
    }

    isAssignableFrom(type: IType<any, any>) {
        return type === this.loadedType || type === this.replacementType
    }
}

export function lazy<S, T, TR>(
    name: string,
    shouldLoadPredicate: (value: any) => boolean,
    loadType: () => Promise<IType<S, T>>,
    replacementType?: IType<S, TR>
): Lazy<S, T, TR>
export function lazy<S, T, TR>(
    shouldLoadPredicate: (value: any) => boolean,
    loadType: () => Promise<IType<S, T>>,
    replacementType?: IType<S, TR>
): Lazy<S, T, TR>
export function lazy<S, T, TR>(...args: any[]): Lazy<S, T, TR> {
    const name = typeof args[0] === "string" ? args.shift() : args[2].name
    const [shouldLoadPredicate, loadType, replacementType = frozen] = args
    return new Lazy(name, shouldLoadPredicate, loadType, replacementType)
}
