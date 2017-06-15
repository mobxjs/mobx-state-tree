import { getSnapshot } from "../../../lib/core"
import { ISimpleType, TypeFlags, Type, IType } from "../type"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure } from "../type-checker"
import { isMutable, isSerializable, deepFreeze, fail } from "../../utils"
import { createNode, Node } from "../../core"

export class Volatile<T> extends Type<void, T> {
    flags = TypeFlags.LocalState

    constructor(private initialValue: T) {
        super("volatile")
    }

    describe() {
        return "<volatile value>"
    }

    instantiate(parent: Node | null, subpath: string, environment: any, value: any): Node {
        // if (value !== undefined) fail("volatile values cannot be provided from snapshots")
        // TODO: throw if value !== undefined?
        // deep freeze the object/array
        return createNode(this, parent, subpath, environment, this.initialValue)
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        // if (value !== undefined) {
        //     return typeCheckFailure(
        //         context,
        //         value,
        //         "volatile values cannot be provided from snapshots"
        //     )
        // }
        return typeCheckSuccess()
    }

    getSnapshot(node: Node) {
        return undefined
    }
}

export function volatile<T>(initialValue: T): IType<void, T>
export function volatile<T>(): IType<void, T | undefined>
export function volatile<T>(initialValue?: any): IType<any, any> {
    return new Volatile(initialValue)
}
