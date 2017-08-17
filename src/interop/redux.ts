import { isStateTreeNode } from "../core"
import { getSnapshot, applySnapshot, onSnapshot } from "../core/mst-operations"
import { applyAction, onAction, ISerializedActionCall, IMiddleWareEvent } from "../core/action"
import { fail, extend } from "../utils"

export interface IMiddleWareApi {
    getState: () => any
    dispatch: (action: any) => void
}

export interface IReduxStore extends IMiddleWareApi {
    subscribe(listener: (snapshot: any) => void): any
}

export type MiddleWare = (
    middlewareApi: IMiddleWareApi
) => ((next: (action: IMiddleWareEvent) => void) => void)

/**
 * Creates a tiny proxy around a MST tree that conforms to the redux store api.
 * This makes it possible to use MST inside a redux application.
 *
 * See the [redux-todomvc example](https://github.com/mobxjs/mobx-state-tree/blob/e9e804c8c43e1edde4aabbd52675544e2b3a905b/examples/redux-todomvc/src/index.js#L20) for more details.
 *
 * @export
 * @param {*} model
 * @param {...MiddleWare[]} middlewares
 * @returns {IReduxStore}
 */
export function asReduxStore(model: any, ...middlewares: MiddleWare[]): IReduxStore {
    if (!isStateTreeNode(model)) fail("Expected model object")
    let store: IReduxStore = {
        getState: () => getSnapshot(model),
        dispatch: action => {
            runMiddleWare(action, runners.slice(), (newAction: any) =>
                applyAction(model, reduxActionToAction(newAction))
            )
        },
        subscribe: listener => onSnapshot(model, listener)
    }
    let runners = middlewares.map(mw => mw(store))
    return store
}

function reduxActionToAction(action: any): IMiddleWareEvent {
    const actionArgs = extend({}, action)
    delete actionArgs.type
    return {
        name: action.type,
        args: [actionArgs]
    } as any
}

function runMiddleWare(action: any, runners: any, next: any) {
    function n(retVal: any) {
        const f = runners.shift()
        if (f) f(n)(retVal)
        else next(retVal)
    }
    n(action)
}

/**
 * Connects a MST tree to the Redux devtools.
 * See this [example](https://github.com/mobxjs/mobx-state-tree/blob/e9e804c8c43e1edde4aabbd52675544e2b3a905b/examples/redux-todomvc/src/index.js#L21) for a setup example.
 *
 * @export
 * @param {*} remoteDevDep
 * @param {*} model
 */
export function connectReduxDevtools(remoteDevDep: any, model: any) {
    // Connect to the monitor
    const remotedev = remoteDevDep.connectViaExtension()
    let applyingSnapshot = false

    // Subscribe to change state (if need more than just logging)
    remotedev.subscribe((message: any) => {
        // Helper when only time travelling needed
        const state = remoteDevDep.extractState(message)
        if (state) {
            applyingSnapshot = true
            applySnapshot(model, state)
            applyingSnapshot = false
        }
    })

    // Send changes to the remote monitor
    onAction(model, (action: ISerializedActionCall) => {
        if (applyingSnapshot) return
        const copy: any = {}
        copy.type = action.name
        if (action.args) action.args.forEach((value, index) => (copy[index] = value))
        remotedev.send(copy, getSnapshot(model))
    })
}
