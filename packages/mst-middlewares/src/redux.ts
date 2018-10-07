import * as mst from "mobx-state-tree"

// tslint:disable:no-shadowed-variable

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

interface ActionContext {
    parent?: ActionContext
    name: string
    id: number
    runningAsync: boolean
    errored: boolean
    errorReported: boolean
    step: number
    callArgs: { [k: number]: any }
}

function getActionContextName(actionContext: ActionContext) {
    let name = actionContext.name

    if (actionContext.runningAsync) {
        name += ` [${actionContext.step}]`
    }

    if (actionContext.errored) {
        name += ` (error thrown)`
    }

    if (actionContext.parent) {
        name = `${getActionContextName(actionContext.parent)} > ${name}`
    }

    return name
}

/**
 * Connects a MST tree to the Redux devtools.
 * See this [example](https://github.com/mobxjs/mobx-state-tree/blob/e9e804c8c43e1edde4aabbd52675544e2b3a905b/examples/redux-todomvc/src/index.js#L21)
 * for a setup example.
 *
 * @export
 * @param {*} remoteDevDep
 * @param {*} model
 */
export function connectReduxDevtools(remoteDevDep: any, model: any) {
    // Connect to the monitor
    const remotedev = remoteDevDep.connectViaExtension({
        name: mst.getType(model).name
    })
    let applyingSnapshot = 0

    // Subscribe to change state (if need more than just logging)
    remotedev.subscribe((message: any) => {
        if (message.type === "DISPATCH") {
            handleMonitorActions(remotedev, model, message)
        }
    })

    const initialState = mst.getSnapshot(model)
    remotedev.init(initialState)

    const actionContexts = new Map<number, ActionContext>()

    mst.addMiddleware(model, actionMiddleware, false)
    function actionMiddleware(call: mst.IMiddlewareEvent, next: any) {
        if (applyingSnapshot) {
            next(call)
            return
        }

        let context!: ActionContext

        for (let i = call.allParentIds.length - 1; i >= 0; i--) {
            const parentId = call.allParentIds[i]
            const foundFlow = actionContexts.get(parentId)
            if (foundFlow) {
                context = foundFlow
                break
            }
        }

        if (call.type === "action") {
            const previousFlow = context
            context = {
                name: call.name,
                id: call.id,
                runningAsync: false,
                errored: false,
                errorReported: false,
                step: 0,
                callArgs: {}
            }

            if (call.args) {
                call.args.forEach((value, index) => (context.callArgs[index] = value))
            }

            if (call.parentId) {
                // subaction
                context.parent = previousFlow
            }

            actionContexts.set(call.id, context)
        }

        let errorThrown
        try {
            next(call)
        } catch (e) {
            errorThrown = e
            context.errored = true
        }

        switch (call.type) {
            case "flow_spawn":
            case "flow_resume":
            case "flow_resume_error": // not errored since the promise error might be caught
                context.runningAsync = true
                let parent = context.parent
                while (parent) {
                    parent.runningAsync = true
                    parent = parent.parent
                }
                break
            case "flow_throw":
                context.errored = true
                break
        }

        // only log if it is a sync (notStarted) action or a flow_resume or a flow_throw
        const syncAction = call.type === "action" && !context.runningAsync
        const log =
            syncAction ||
            call.type === "flow_resume" ||
            (call.type === "flow_throw" && !context.errorReported)

        if (log) {
            const sn = mst.getSnapshot(model)

            const copy = { type: getActionContextName(context), ...context.callArgs }
            remotedev.send(copy, sn)

            if (context.errored) {
                context.errorReported = true
            }

            context.step++

            let parent = context.parent
            while (parent) {
                parent.step++
                parent = parent.parent
            }
        }

        if (call.type === "flow_return" || call.type === "flow_throw" || !context!.runningAsync) {
            actionContexts.delete(context!.id!)
        }

        if (errorThrown) {
            throw errorThrown
        }
    }

    function handleMonitorActions(remotedev2: any, model2: any, message: any) {
        switch (message.payload.type) {
            case "RESET":
                applySnapshot(model2, initialState)
                return remotedev2.init(initialState)
            case "COMMIT":
                return remotedev2.init(mst.getSnapshot(model2))
            case "ROLLBACK":
                return remotedev2.init(remoteDevDep.extractState(message))
            case "JUMP_TO_STATE":
            case "JUMP_TO_ACTION":
                applySnapshot(model2, remoteDevDep.extractState(message))
                return
            case "IMPORT_STATE":
                const nextLiftedState = message.payload.nextLiftedState
                const computedStates = nextLiftedState.computedStates
                applySnapshot(model2, computedStates[computedStates.length - 1].state)
                remotedev2.send(null, nextLiftedState)
                return
            default:
        }
    }

    function applySnapshot(model2: any, state: any) {
        applyingSnapshot++
        try {
            mst.applySnapshot(model2, state)
        } finally {
            applyingSnapshot--
        }
    }
}
