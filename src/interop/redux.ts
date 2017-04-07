import {isMST, IRawActionCall} from "../core"
import {onSnapshot, getSnapshot, applyAction} from "../top-level-api"
import {invariant, extend, fail} from "../utils"

export interface IMiddleWareApi {
    getState: () => any
    dispatch: (action: any) => void
}

export interface IReduxStore extends IMiddleWareApi {
    subscribe(listener: (snapshot: any) => void): any
}

export type MiddleWare =
    (middlewareApi: IMiddleWareApi) =>
        ((next: (action: IRawActionCall) => void) => void)

export function asReduxStore(model: any, ...middlewares: MiddleWare[]): IReduxStore {
    invariant(isMST(model), "Expected model object")
    let store: IReduxStore = {
        getState : ()       => getSnapshot(model),
        dispatch : action   => {
            // TODO: reimplement redux middleware
            fail("Not implemented")
            // runMiddleWare(action, runners.slice(), (newAction: any) => applyAction(model, reduxActionToAction(newAction)))
        },
        subscribe: listener => onSnapshot(model, listener)
    }
    let runners = middlewares.map(mw => mw(store))
    return store
}

function reduxActionToAction(action: any): IRawActionCall {
    const actionArgs = extend({}, action)
    delete actionArgs.type
    return {
        name: action.type,
        args: [actionArgs]
    } as any // TODO: restore functionality!
}

function runMiddleWare(action: any, runners: any, next: any) {
    function n(retVal: any) {
        const f = runners.shift()
        if (f)
            f(n)(retVal)
        else
            next(retVal)
    }
    n(action)
}
