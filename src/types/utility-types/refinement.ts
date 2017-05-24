import { IType, TypeFlags, Type } from "../type"
import { fail } from "../../utils"
import { isMST, getMSTAdministration } from "../../core"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure } from "../type-checker"

export class Refinement extends Type<any, any> {
    readonly type: IType<any, any>
    readonly predicate: (v: any) => boolean

    get flags () {
        return this.type.flags
    }

    constructor(name: string, type: IType<any, any>, predicate: (v: any) => boolean) {
        super(name)
        this.type = type
        this.predicate = predicate
    }

    describe() {
        return this.name
    }

    create(value: any) {
        // create the child type
        const inst = this.type.create(value)
        const snapshot = isMST(inst) ? getMSTAdministration(inst).snapshot : inst

        // check if pass the predicate
        if (!this.is(snapshot)) fail(`Value ${JSON.stringify(snapshot)} is not assignable to type ${this.name}`)

        return inst
    }

    validate(value: any, context: IContext): IValidationResult {
        if (this.type.is(value) && this.predicate(value)) {
            return typeCheckSuccess()
        }
        return typeCheckFailure(context, value)
    }

    get identifierAttribute() {
        return this.type.identifierAttribute
    }
}

export function refinement<T>(name: string, type: IType<T, T>, predicate: (snapshot: T) => boolean): IType<T, T>
export function refinement<S, T extends S, U extends S>(name: string, type: IType<S, T>, predicate: (snapshot: S) => snapshot is U): IType<S, U>
export function refinement(name: string, type: IType<any, any>, predicate: (snapshot: any) => boolean): IType<any, any> {
    // check if the subtype default value passes the predicate
    const inst = type.create()
    if (!predicate(isMST(inst) ? getMSTAdministration(inst).snapshot : inst)) fail(`Default value for refinement type ` + name + ` does not pass the predicate.`)

    return new Refinement(name, type, predicate)
}
