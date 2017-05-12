export interface ISnapshottable<S> {}

export interface IContextEntry {
    path: string
    type?: IType<any, any>
}

export type IContext = IContextEntry[]
export interface IValidationError {
    context: IContext
    snapshot: any
    message?: string
}
export type IValidationResult = IValidationError[]

export interface IType<S, T> {
    name: string
    is(thing: any): thing is S | T
    validate(thing: any, context: IContext): IValidationResult
    create(snapshot?: S, environment?: any): T
    isType: boolean
    describe(): string
    Type: T
    SnapshotType: S
    identifierAttribute: string | null
}

export interface ISimpleType<T> extends IType<T, T> { }

export interface IComplexType<S, T> extends IType<S, T & ISnapshottable<S> & IMSTNode> { }

export function isType(value: any): value is IType<any, any> {
    return typeof value === "object" && value && value.isType === true
}

export abstract class Type<S, T> implements IType<S, T> {
    name: string
    isType = true

    constructor(name: string) {
        this.name = name
    }

    abstract create(snapshot: any): any
    abstract validate(thing: any, context: IContext): IValidationResult
    abstract describe(): string

    is(value: any): value is S | T {
        return this.validate(
            value, 
            [{path: "", type: this}]
        ).length === 0
    }

    get Type(): T {
        return fail("Factory.Type should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.Type`")
    }
    get SnapshotType(): S {
        return fail("Factory.SnapshotType should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.SnapshotType`")
    }

    abstract get identifierAttribute(): string | null
}

export function typecheck(type: IType<any, any>, value: any): void {
    const errors = type.validate(isMST(value) ? getMSTAdministration(value).snapshot : value, [{path: "", type}])
    const errorString = errors.map(
                error => error.context.filter(({path}) => path.length > 0).map(({path}) => path).join("/")
            ).join("\n")

    if (!type.is(value)) {
        const currentTypename = maybeMST(value, node => ` of type ${node.type.name}:`, () => "")
        const isSnapshotCompatible = isMST(value) && type.is(getMSTAdministration(value).snapshot)
        fail(
            `Value${currentTypename} '${isSerializable(value) ? JSON.stringify(value) : value}' is not assignable to type: ${type.name}` +
            (isPrimitiveType(type) || (type instanceof OptionalValue && isPrimitiveType((<OptionalValue<any, any>> type).type))
                ? `.`
                : (`, expected an instance of ${type.name} or a snapshot like '${type.describe()}' instead.` +
                    (isSnapshotCompatible ? " (Note that a snapshot of the provided value is compatible with the targeted type)" : "")
                )
            )
        )
    }
}

import { fail, isSerializable } from "../utils"
import { getMSTAdministration, IMSTNode, isMST, maybeMST, getType } from "../core/mst-node"
import { isPrimitiveType } from "./primitives"
import { OptionalValue } from "./utility-types/optional"
