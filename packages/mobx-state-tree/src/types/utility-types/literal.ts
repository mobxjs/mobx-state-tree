import { ISimpleType, Type } from "../type"
import { TypeFlags } from "../type-flags"
import { fail, isPrimitive } from "../../utils"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure } from "../type-checker"
import { Node, createNode } from "../../core"

export class Literal<T> extends Type<T, T> {
    readonly value: any
    readonly flags = TypeFlags.Literal

    constructor(value: any) {
        super(JSON.stringify(value))
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
        return typeCheckFailure(
            context,
            value,
            `Value is not a literal ${JSON.stringify(this.value)}`
        )
    }
}

/**
 * The literal type will return a type that will match only the exact given type.
 * The given value must be a primitive, in order to be serialized to a snapshot correctly.
 * You can use literal to match exact strings for example the exact male or female string.
 *
 * @example
 * const Person = types.model({
 *     name: types.string,
 *     gender: types.union(types.literal('male'), types.literal('female'))
 * })
 *
 * @export
 * @alias types.literal
 * @template S
 * @param {S} value The value to use in the strict equal check
 * @returns {ISimpleType<S>}
 */
export function literal<S>(value: S): ISimpleType<S> {
    // check that the given value is a primitive
    if (process.env.NODE_ENV !== "production") {
        if (!isPrimitive(value)) fail(`Literal types can be built only on top of primitives`)
    }
    return new Literal<S>(value)
}
