import {isFactory, IFactory} from "../core/factories"
import {invariant, fail} from "../utils"
import {Type} from "../core/types"

export class Union extends Type {
    types: IFactory<any, any>[] = []

    // TODO: support / use dispatch function instead of this
    constructor(name, types: IFactory<any, any>[]) {
        super(name)
        this.types = types
    }

    create(value) {
        invariant(this.is(value))
        // TODO: copy error from below
        const applicableTypes = this.types.filter(type => type.is(value))
        invariant(applicableTypes.length === 1, "Ambigous value") // TODO: better error message
        return applicableTypes[0](value)
    }

    is(value) {
        return this.types.some(type => type.is(value))
    }

}

// TODO: support dispatcher function
// export function createUnionFactory<SA, SB, TA, TB>(dispatch: IModelFactoryDispatcher, A: IModelFactory<SA, TA>, B: IModelFactory<SB, TB>): IModelFactory<SA | SB, TA | TB>
export function createUnionFactory<SA, SB, TA, TB>(A: IFactory<SA, TA>, B: IFactory<SB, TB>): IFactory<SA | SB, TA | TB> {
    // const types = isModelFactory(dispatchOrType) ? otherTypes.concat(dispatchOrType) : otherTypes
    // TODO: generalize:
    const types: IFactory<any, any>[] = [A, B]
    const name = types.map(type => type.factoryName).join(" | ")
    return new Union(name, types).factory
}
//     const dispatch = isModelFactory(dispatchOrType) ? null : dispatchOrType

//     const getType = (dispatch, snapshot): IModelFactory<any, any> => {
//         let castableTypes = types.filter(type => type.is(snapshot))

//         if(castableTypes.length === 1) return castableTypes[0]
//         if(dispatch === null){
//             fail('Ambiguos snapshot '+JSON.stringify(snapshot)+' for union '+name+'. Please provide a dispatch in the union declaration.')
//         }
//         return dispatch(snapshot)
//     }

//     return createFactory(
//         name,
//         "union",
//         snapshot => types.some(type => type.is(snapshot)),
//         snapshot => getType(dispatch, snapshot),
//         function (snapshot?: any, env?: Object){
//             let type = getType(dispatch, snapshot)
//             return arguments.length > 0 ? type(snapshot, env) : type()
//         }
//     )
// }