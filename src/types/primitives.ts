import { ISimpleType, TypeFlags, Type } from "./type"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure } from "./type-checker"
import { isPrimitive, fail } from "../utils"
import { ImmutableNode, ComplexNode, AbstractNode } from "../core"

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

    instantiate(parent: ComplexNode | null, subpath: string, environment: any, snapshot: T): AbstractNode {
        if (!isPrimitive(snapshot)) fail(`Not a primitive: '${snapshot}'`)
        if (!this.checker(snapshot)) fail(`Value is not assignable to '` + this.name + `'`)
        return new ImmutableNode(this, parent, subpath, snapshot)
    }

    validate(value: any, context: IContext): IValidationResult {
        if (isPrimitive(value) && this.checker(value)) {
            return typeCheckSuccess()
        }
        return typeCheckFailure(context, value)
    }

    get identifierAttribute() {
        return null
    }
}

// tslint:disable-next-line:variable-name
export const string: ISimpleType<string> = new CoreType<string>("string", TypeFlags.String, (v: any) => typeof v === "string")
// tslint:disable-next-line:variable-name
export const number: ISimpleType<number> = new CoreType<number>("number", TypeFlags.Number, (v: any) => typeof v === "number")
// tslint:disable-next-line:variable-name
export const boolean: ISimpleType<boolean> = new CoreType<boolean>("boolean", TypeFlags.Boolean, (v: any) => typeof v === "boolean")
// tslint:disable-next-line:variable-name
export const DatePrimitive: ISimpleType<Date> = new CoreType<Date>("Date", TypeFlags.Date, (v: any) => v instanceof Date)

export function getPrimitiveFactoryFromValue(value: any): ISimpleType<any> {
    switch (typeof value) {
        case "string":
            return string
        case "number":
            return number
        case "boolean":
            return boolean
        case "object":
            if (value instanceof Date)
                return DatePrimitive
    }
    return fail("Cannot determine primtive type from value " + value)
}

export function isPrimitiveType(type: any): type is CoreType<any> {
    return (type.flags & (TypeFlags.String | TypeFlags.Number | TypeFlags.Boolean | TypeFlags.Date)) > 0
}
