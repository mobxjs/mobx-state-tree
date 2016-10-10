import {IActionCall} from "../core/action"
import {onSnapshot, getSnapshot, applyAction, isModel} from "../index"
import {invariant, extend} from "../utils"

export type ReduxStore = {
    getState(): any
    dispatch(action: any)
    subscribe(listener: (snapshot) => void)
}

// TODO: support middlewares:
// export type MiddleWare =
//     (middlewareApi: { getState: () => any, dipatch: (action: IActionCall) => void }) =>
//         (next: (action:IActionCall) => void) => void

export function asReduxStore(model): ReduxStore {
    invariant(isModel(model), "Expected model object")
    return {
        getState : ()       => getSnapshot(model),
        subscribe: listener => onSnapshot(model, listener),
        dispatch : action   => { applyAction(model, reduxActionToAction(action))
        }
    }
}

function reduxActionToAction(action): IActionCall {
    const actionArgs = extend({}, action)
    delete actionArgs.type
    return {
        name: action.type,
        args: [actionArgs]
    }
}
