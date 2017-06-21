import { ISimpleType, Type } from "./type"
import { TypeFlags } from "./type-flags"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure } from "./type-checker"
import { isPrimitive, fail } from "../utils"
import { Node, createNode } from "../core"

export class CoreType<T> extends Type<T, T> {
    readonly checker: (value: any) => boolean
    readonly flags: TypeFlags

    constructor(name: any, flags: TypeFlags, checker: any) {
        super(name)
        this.flags = flags
        this.checker = checker
    }

    describe() {
        return this.name
    }

    instantiate(parent: Node | null, subpath: string, environment: any, snapshot: T): Node {
        return createNode(this, parent, subpath, environment, snapshot)
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (isPrimitive(value) && this.checker(value)) {
            return typeCheckSuccess()
        }
        return typeCheckFailure(context, value)
    }
}

// tslint:disable-next-line:variable-name
export const string: ISimpleType<string> = new CoreType<string>(
    "string",
    TypeFlags.String,
    (v: any) => typeof v === "string"
)
// tslint:disable-next-line:variable-name
export const number: ISimpleType<number> = new CoreType<number>(
    "number",
    TypeFlags.Number,
    (v: any) => typeof v === "number"
)
// tslint:disable-next-line:variable-name
export const boolean: ISimpleType<boolean> = new CoreType<boolean>(
    "boolean",
    TypeFlags.Boolean,
    (v: any) => typeof v === "boolean"
)
// tslint:disable-next-line:variable-name
export const DatePrimitive: ISimpleType<Date> = new CoreType<Date>(
    "Date",
    TypeFlags.Date,
    (v: any) => v instanceof Date
)
;(DatePrimitive as any).getSnapshot = function(node: Node) {
    return node.storedValue.getTime()
}

// TODO: move null and undefined primitive to here (from maybe)

export function getPrimitiveFactoryFromValue(value: any): ISimpleType<any> {
    switch (typeof value) {
        case "string":
            return string
        case "number":
            return number
        case "boolean":
            return boolean
        case "object":
            if (value instanceof Date) return DatePrimitive
    }
    return fail("Cannot determine primtive type from value " + value)
}
