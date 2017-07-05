import { ISimpleType, IType, Type } from "./type"
import { TypeFlags } from "./type-flags"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure } from "./type-checker"
import { isPrimitive, fail, identity } from "../utils"
import { Node, createNode } from "../core"

export class CoreType<S, T> extends Type<S, T> {
    readonly checker: (value: any) => boolean
    readonly flags: TypeFlags
    readonly initializer: (v: any) => any

    constructor(
        name: any,
        flags: TypeFlags,
        checker: any,
        initializer: (v: any) => any = identity
    ) {
        super(name)
        this.flags = flags
        this.checker = checker
        this.initializer = initializer
    }

    describe() {
        return this.name
    }

    instantiate(parent: Node | null, subpath: string, environment: any, snapshot: T): Node {
        return createNode(this, parent, subpath, environment, snapshot, this.initializer)
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        if (isPrimitive(value) && this.checker(value)) {
            return typeCheckSuccess()
        }
        return typeCheckFailure(context, value)
    }
}

// tslint:disable-next-line:variable-name
export const string: ISimpleType<string> = new CoreType<string, string>(
    "string",
    TypeFlags.String,
    (v: any) => typeof v === "string"
)
// tslint:disable-next-line:variable-name
export const number: ISimpleType<number> = new CoreType<number, number>(
    "number",
    TypeFlags.Number,
    (v: any) => typeof v === "number"
)
// tslint:disable-next-line:variable-name
export const boolean: ISimpleType<boolean> = new CoreType<boolean, boolean>(
    "boolean",
    TypeFlags.Boolean,
    (v: any) => typeof v === "boolean"
)
// tslint:disable-next-line:variable-name
export const DatePrimitive: IType<number, Date> = new CoreType<number, Date>(
    "Date",
    TypeFlags.Date,
    (v: any) => typeof v === "number" || v instanceof Date,
    (v: number | Date) => (v instanceof Date ? v : new Date(v))
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
