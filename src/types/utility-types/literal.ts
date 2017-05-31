import { ISimpleType, TypeFlags, Type} from "../type"
import { fail, isPrimitive } from "../../utils"
import { IContext, IValidationResult, typecheck, typeCheckSuccess, typeCheckFailure } from "../type-checker"

export class Literal<T> extends Type<T, T> {
    readonly value: any
    readonly flags = TypeFlags.Literal

    constructor(value: any) {
        super("" + value)
        this.value = value
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

    get identifierAttribute() {
        return null
    }
}

export function literal<S>(value: S): ISimpleType<S> {
    if (!isPrimitive(value)) fail(`Literal types can be built only on top of primitives`)
    return new Literal<S>(value)
}

import { Node } from '../../core';
