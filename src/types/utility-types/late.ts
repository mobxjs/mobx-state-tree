import { fail } from '../../utils'
import { Type, IType } from '../type'
import { TypeFlags } from '../type-flags'
import { IContext, IValidationResult } from '../type-checker'
import { Node } from '../../core'

export class Late<S, T> extends Type<S, T> {
    readonly definition: () => IType<S, T>
    private _subType: IType<S, T> | null = null

    get flags() {
        return this.subType.flags | TypeFlags.Late
    }

    get subType(): IType<S, T> {
        if (this._subType === null) {
            this._subType = this.definition()
        }
        return this._subType
    }

    constructor(name: string, definition: () => IType<S, T>) {
        super(name)
        if (!(typeof definition === 'function' && definition.length === 0))
            fail(
                'Invalid late type, expected a function with zero arguments that returns a type, got: ' +
                    definition
            )
        this.definition = definition
    }

    instantiate(parent: Node | null, subpath: string, environment: any, snapshot: any): Node {
        return this.subType.instantiate(parent, subpath, environment, snapshot)
    }

    reconcile(current: Node, newValue: any): Node {
        return this.subType.reconcile(current, newValue)
    }

    describe() {
        return this.subType.name
    }

    isValidSnapshot(value: any, context: IContext): IValidationResult {
        return this.subType.validate(value, context)
    }

    isAssignableFrom(type: IType<any, any>) {
        return this.subType.isAssignableFrom(type)
    }
}

export type ILateType<S, T> = () => IType<S, T>

export function late<S = any, T = any>(type: ILateType<S, T>): IType<S, T>
export function late<S = any, T = any>(name: string, type: ILateType<S, T>): IType<S, T>
export function late<S, T>(nameOrType: any, maybeType?: ILateType<S, T>): IType<S, T> {
    const name = typeof nameOrType === 'string' ? nameOrType : `late(${nameOrType.toString()})`
    const type = typeof nameOrType === 'string' ? maybeType : nameOrType
    return new Late<S, T>(name, type)
}
