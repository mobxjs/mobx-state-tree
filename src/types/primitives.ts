import { ISimpleType, IContext, IValidationResult, Type } from "./type"
import { invariant, isPrimitive, fail } from "../utils"

export class CoreType<T> extends Type<T, T> {
    readonly checker: (value: any) => boolean

    constructor(name: any, checker: any) {
        super(name)
        this.checker = checker
    }

    describe() {
        return this.name
    }

    create(value: any) {
        invariant(isPrimitive(value), `Not a primitive: '${value}'`)
        invariant(this.checker(value), `Value is not assignable to '` + this.name + `'`)
        return value
    }

    validate(value: any, context: IContext): IValidationResult {
        if (isPrimitive(value) && this.checker(value)) {
            return []
        }
        return [{ value, context }]
    }

    get identifierAttribute() {
        return null
    }
}

// tslint:disable-next-line:variable-name
export const string: ISimpleType<string> = new CoreType<string>("string", (v: any) => typeof v === "string")
// tslint:disable-next-line:variable-name
export const number: ISimpleType<number> = new CoreType<number>("number", (v: any) => typeof v === "number")
// tslint:disable-next-line:variable-name
export const boolean: ISimpleType<boolean> = new CoreType<boolean>("boolean", (v: any) => typeof v === "boolean")
// tslint:disable-next-line:variable-name
export const DatePrimitive: ISimpleType<Date> = new CoreType<Date>("Date", (v: any) => v instanceof Date)

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
    return type instanceof CoreType
}
