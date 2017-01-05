import {isModelFactory, IModelFactory, createFactory, IModelFactoryDispatcher} from "../core/factories"
import {invariant, fail} from "../utils"


export function createUnionFactory<SA, SB, TA, TB>(dispatch: IModelFactoryDispatcher, A: IModelFactory<SA, TA>, B: IModelFactory<SB, TB>): IModelFactory<SA | SB, TA | TB>
export function createUnionFactory<SA, SB, TA, TB>(A: IModelFactory<SA, TA>, B: IModelFactory<SB, TB>): IModelFactory<SA | SB, TA | TB>
export function createUnionFactory(dispatchOrType: IModelFactoryDispatcher | IModelFactory<any, any>, ...otherTypes: IModelFactory<any, any>[]): IModelFactory<any, any>{
    const types = isModelFactory(dispatchOrType) ? otherTypes.concat(dispatchOrType) : otherTypes
    const dispatch = isModelFactory(dispatchOrType) ? null : dispatchOrType
    const name = types.map(type => type.factoryName).join(" | ")

    const getType = (dispatch, snapshot): IModelFactory<any, any> => {
        let castableTypes = types.filter(type => type.is(snapshot))

        if(castableTypes.length === 1) return castableTypes[0]
        if(dispatch === null){
            fail('Ambiguos snapshot '+JSON.stringify(snapshot)+' for union '+name+'. Please provide a dispatch in the union declaration.')
        } 
        return dispatch(snapshot)
    }

    return createFactory(
        name,
        "union",
        snapshot => types.some(type => type.is(snapshot)),
        snapshot => getType(dispatch, snapshot),
        function (snapshot?: any, env?: Object){
            let type = getType(dispatch, snapshot)
            return arguments.length > 0 ? type(snapshot, env) : type()
        }
    )
}