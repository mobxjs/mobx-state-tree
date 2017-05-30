import { fail } from "../../utils"
import { Type, IType, TypeFlags } from "../type"
import { IContext, IValidationResult, typeCheckSuccess, typeCheckFailure } from "../type-checker"
import { ComplexNode, AbstractNode } from "../../core";

export class Late<S, T> extends Type<S, T> {
    readonly definition: () => IType<S, T>
    private _subType: IType<S, T> | null = null

    get flags () {
        return this.subType.flags
    }

    get subType(): IType<S, T> {
        if (this._subType === null) {
            this._subType = this.definition()
        }
        return this._subType
    }

    constructor(name: string, definition: () => IType<S, T>) {
        super(name)
        if (!(typeof definition === "function" && definition.length === 0)) fail("Invalid late type, expected a function with zero arguments that returns a type, got: " + definition)
        this.definition = definition
    }

    instantiate(parent: ComplexNode | null, subpath: string, environment: any, snapshot: any): AbstractNode {
        return this.subType.instantiate(parent, subpath, environment, snapshot)
    }

    describe() {
        return this.subType.name
    }

    validate(value: any, context: IContext): IValidationResult {
        return this.subType.validate(value, context)
    }

    get identifierAttribute() {
        return this.subType.identifierAttribute
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
