import {isModelFactory, IModelFactory, createFactory, IModelFactoryDispatcher} from "../core/factories"
import {invariant} from "../utils"


export function createUnionFactory<SA, SB, TA, TB>(dispatch: IModelFactoryDispatcher, A: IModelFactory<SA, TA>, B: IModelFactory<SB, TB>): IModelFactory<SA | SB, TA | TB>
export function createUnionFactory<SA, SB, TA, TB>(A: IModelFactory<SA, TA>, B: IModelFactory<SB, TB>): IModelFactory<SA | SB, TA | TB>
export function createUnionFactory(dispatch: IModelFactoryDispatcher, ...otherTypes: IModelFactory<any, any>[]): IModelFactory<any, any>{
    let types = isModelFactory(dispatch) ? otherTypes.concat(dispatch) : otherTypes

    const getType = state => {
        let castableTypes = types.filter(type => type.is(state))

        return castableTypes.length === 1 ? castableTypes[0] : dispatch(state)
    }

    return createFactory(
        types.map(type => type.factoryName).join(" | "),
        "union",
        snapshot => types.some(type => type.is(snapshot)),
        getType,
        (state?: any, env?: Object) => getType(state)(state, env)
    )
}