import {IActionCall} from "../core/action"
import {onSnapshot, getSnapshot, applyAction, isModel} from "../index"
import {invariant, extend} from "../utils"

export interface MiddleWareApi {
    getState: () => any
    dispatch: (action: any) => void
}

export interface ReduxStore extends MiddleWareApi {
    subscribe(listener: (snapshot) => void)
}

export type MiddleWare =
    (middlewareApi: MiddleWareApi) =>
        ((next: (action: IActionCall) => void) => void)

export function asReduxStore(model, ...middlewares: MiddleWare[]): ReduxStore {
    invariant(isModel(model), "Expected model object")
    let store: ReduxStore = {
        getState : ()       => getSnapshot(model),
        dispatch : action   => {
            runMiddleWare(action, runners.slice(), action => applyAction(model, reduxActionToAction(action)))
        },
        subscribe: listener => onSnapshot(model, listener),
    }
    let runners = middlewares.map(mw => mw(store))
    return store
}

function reduxActionToAction(action): IActionCall {
    const actionArgs = extend({}, action)
    delete actionArgs.type
    return {
        name: action.type,
        args: [actionArgs]
    }
}

function runMiddleWare(action, runners, next) {
    function n(retVal) {
        const f = runners.shift()
        if (f)
            f(n)(retVal)
        else
            next(retVal)
    }
    n(action)
}
