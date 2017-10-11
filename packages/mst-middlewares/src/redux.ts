import * as mst from "mobx-state-tree"
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
export const asReduxStore = function(model: mst.IStateTreeNode, ...middlewares: any[]) {
    if (!mst.isStateTreeNode(model)) throw new Error("Expected model object")
    let store = {
        getState: () => mst.getSnapshot(model),
        dispatch: (action: any) => {
            runMiddleWare(action, runners.slice(), (newAction: any) =>
                mst.applyAction(model, reduxActionToAction(newAction))
            )
        },
        subscribe: (listener: any) => mst.onSnapshot(model, listener)
    }
    let runners = middlewares.map(mw => mw(store))
    return store
}

function reduxActionToAction(action: any) {
    const actionArgs = Object.assign({}, action)
    delete actionArgs.type
    return {
        name: action.type,
        args: [actionArgs]
    }
}

function runMiddleWare(action: any, runners: any[], next: any) {
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
export const connectReduxDevtools = function connectReduxDevtools(remoteDevDep: any, model: any) {
    // Connect to the monitor
    const remotedev = remoteDevDep.connectViaExtension()
    let applyingSnapshot = false

    // Subscribe to change state (if need more than just logging)
    remotedev.subscribe((message: any) => {
        // Helper when only time travelling needed
        const state = remoteDevDep.extractState(message)
        if (state) {
            applyingSnapshot = true
            mst.applySnapshot(model, state)
            applyingSnapshot = false
        }
    })

    // Send changes to the remote monitor
    mst.onAction(model, action => {
        if (applyingSnapshot) return
        const copy: any = {}
        copy.type = action.name
        if (action.args) action.args.forEach((value, index) => (copy[index] = value))
        remotedev.send(copy, mst.getSnapshot(model))
    })
}
