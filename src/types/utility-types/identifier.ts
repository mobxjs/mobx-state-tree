import { IType } from "../type"
import { string as stringType, number as numberType } from "../primitives"
import { fail } from "../../utils"

export interface IIdentifierDescriptor<T> {
    isIdentifier: true
    primitiveType: IType<T, T>
}

// TODO: properly turn this into a factory, that reuses `types.string`?
// See: https://github.com/mobxjs/mobx-state-tree/pull/65#issuecomment-289603441
// todo: change to const `types.identifier`!
export function identifier<T>(baseType: IType<T, T>): T;
export function identifier(): string;
export function identifier(baseType: IType<any, any> = stringType): any {
    // TODO: MWE: this seems contrived, let's not assert anything and support unions, refinements etc.
    if (baseType !== stringType && baseType !== numberType)
        fail(`Only 'types.number' and 'types.string' are acceptable as type specification for identifiers`)
    return {
        isIdentifier: true,
        primitiveType: baseType
    } as IIdentifierDescriptor<any>
}

export function isIdentifierFactory(thing: any): thing is IIdentifierDescriptor<any> {
    return typeof thing === "object" && thing && thing.isIdentifier === true
}
