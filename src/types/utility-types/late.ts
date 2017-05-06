import { Type, IType } from "../type"

export class Late<S, T> extends Type<S, T> {
    readonly subType: () => IType<S, T>

    constructor(name: string, subType: () => IType<S, T>) {
        super(name)
        this.subType = subType
    }

    create(snapshot?: any, environment?: any) {
        return this.subType().create(snapshot, environment)
    }

    describe() {
        return this.subType().name
    }

    is(value: any): value is T {
        return this.subType().is(value)
    }

}

export type ILateType<S, T> = () => IType<S, T>

export function late<S, T>(type: ILateType<S, T>): IType<S, T>
export function late<S, T>(name: string, type: ILateType<S, T>): IType<S, T>
export function late<S, T>(nameOrType: any, maybeType?: ILateType<S, T>): IType<S, T>  {
    const name = typeof nameOrType === "string" ? nameOrType : "<late>"
    const type = typeof nameOrType === "string" ? maybeType : nameOrType
    return new Late<S, T>(name, type)
}
