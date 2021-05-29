import { action, IObservableArray, observable, when } from "mobx"
import { AnyNode } from "../../core/node/BaseNode"
import { Instance, IType } from "../../core/type/type"
import {
    IValidationContext,
    IValidationResult,
    TypeFlags,
    IAnyType,
    typeCheckSuccess,
    AnyObjectNode,
    SimpleType,
    createScalarNode,
    deepFreeze,
    isSerializable,
    typeCheckFailure
} from "../../internal"

interface LazyOptions<T> {
    loadType: () => Promise<IType<T, T, T>>
    // todo: type this any?
    shouldLoadPredicate: (parent: any) => boolean
}

export class Lazy<T> extends SimpleType<T, T, T> {
    flags = TypeFlags.Frozen

    private loadedType: IType<T, T, T> | null = null
    private pendingNodeList: IObservableArray<AnyNode> = observable.array()

    constructor(name: string, private readonly options: LazyOptions<T>) {
        super(name)

        when(
            () =>
                // any of the pending node has decided that the time has come
                this.pendingNodeList.length > 0 &&
                this.pendingNodeList.some(
                    (node) =>
                        node.isAlive &&
                        this.options.shouldLoadPredicate(node.parent ? node.parent.value : null)
                ),
            () => {
                // load the real type
                this.options.loadType().then(
                    action((type) => {
                        // stores the loaded type
                        this.loadedType = type

                        // replace the replacement nodes with the correct one
                        this.pendingNodeList.forEach((node) => {
                            if (!node.parent) return
                            if (!this.loadedType) return

                            node.parent.applyPatches([
                                {
                                    op: "replace",
                                    path: `/${node.subpath}`,
                                    value: node.snapshot
                                }
                            ])
                        })
                    })
                )
            }
        )
    }

    describe() {
        return `<lazy ${this.name}>`
    }

    instantiate(
        parent: AnyObjectNode | null,
        subpath: string,
        environment: any,
        value: this["C"]
    ): this["N"] {
        if (this.loadedType) {
            return this.loadedType.instantiate(parent, subpath, environment, value) as this["N"]
        }

        const node = createScalarNode(this, parent, subpath, environment, deepFreeze(value))
        this.pendingNodeList.push(node)

        when(
            () => !node.isAlive,
            () => this.pendingNodeList.splice(this.pendingNodeList.indexOf(node), 1)
        )

        return node
    }

    isValidSnapshot(value: this["C"], context: IValidationContext): IValidationResult {
        if (this.loadedType) {
            return this.loadedType.validate(value, context)
        }
        if (!isSerializable(value)) {
            return typeCheckFailure(context, value, "Value is not serializable and cannot be lazy")
        }
        return typeCheckSuccess()
    }

    reconcile(current: this["N"], value: T, parent: AnyObjectNode, subpath: string): this["N"] {
        if (this.loadedType) {
            current.die()
            return this.loadedType.instantiate(
                parent,
                subpath,
                parent.environment,
                value
            ) as this["N"]
        }
        return super.reconcile(current, value, parent, subpath)
    }
}

export function lazy<T>(name: string, options: LazyOptions<T>) {
    return new Lazy(name, options)
}
