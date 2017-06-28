import { isStateTreeNode } from "../core"
import { getSnapshot, applySnapshot, onSnapshot } from "../core/mst-operations"
import { applyAction, onAction, ISerializedActionCall, IRawActionCall } from "../core/action"
import { fail, extend } from "../utils"

export interface IMiddleWareApi {
    getState: () => any
    dispatch: (action: any) => void
}

export interface IReduxStore extends IMiddleWareApi {
    subscribe(listener: (snapshot: any) => void): any
}

export type MiddleWare = (middlewareApi: IMiddleWareApi) => ((next: (action: IRawActionCall) => void) => void)

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

function reduxActionToAction(action: any): IRawActionCall {
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
