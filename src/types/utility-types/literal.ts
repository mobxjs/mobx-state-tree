import { ISimpleType, TypeFlags, Type} from "../type"
import { fail, isPrimitive } from "../../utils"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure } from "../type-checker"
import { Node, createNode } from "../../core"

export class Literal<T> extends Type<T, T> {
    readonly snapshottable = true
    readonly value: any
    readonly flags = TypeFlags.Literal

    constructor(value: any) {
        super("" + value)
        this.value = value
    }

    instantiate(parent: Node | null, subpath: string, environment: any, snapshot: T): Node {
        return createNode(this, parent, subpath, environment, snapshot)
    }

    describe() {
        return JSON.stringify(this.value)
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (isPrimitive(value) && value === this.value) {
            return typeCheckSuccess()
        }
        return typeCheckFailure(context, value)
    }
}

export function literal<S>(value: S): ISimpleType<S> {
    if (!isPrimitive(value)) fail(`Literal types can be built only on top of primitives`)
    return new Literal<S>(value)
}
