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

// devtools

type ChangesMadeSetter = () => void

interface ActionContext {
    parent?: ActionContext
    name: string
    targetTypePath: string
    id: number
    runningAsync: boolean
    errored: boolean
    errorReported: boolean
    step: number
    callArgs: { [k: number]: any }
    changesMadeSetter: ChangesMadeSetter | undefined
}

function getActionContextNameAndTypePath(actionContext: ActionContext, logArgsNearName: boolean) {
    let name = actionContext.name
    let targetTypePath = actionContext.targetTypePath

    if (logArgsNearName) {
        let args = Object.values(actionContext.callArgs)
            .map(a => JSON.stringify(a))
            .join(", ")

        if (args.length > 64) {
            args = args.slice(0, 64) + "..."
        }

        name += `(${args})`
    }

    if (actionContext.runningAsync) {
        name += ` (${actionContext.step})`
    }

    if (actionContext.errored) {
        name += ` -error thrown-`
    }

    if (actionContext.parent) {
        const ret = getActionContextNameAndTypePath(actionContext.parent, logArgsNearName)
        if (ret) {
            name = `${ret.name} >>> ${name}`
            targetTypePath = `${ret.targetTypePath} >>> ${targetTypePath}`
        }
    }

    return {
        name,
        targetTypePath
    }
}

function getTypeName(node: mst.IAnyStateTreeNode) {
    return mst.getType(node).name || "(UnnamedType)"
}

function getTargetTypePath(node: mst.IAnyStateTreeNode): string[] {
    let current: mst.IAnyStateTreeNode | undefined = node
    const names = []
    while (current) {
        names.unshift(getTypeName(current))
        current = mst.hasParent(current) ? mst.getParent(current) : undefined
    }
    return names
}

/**
 * Connects a MST tree to the Redux devtools.
 * See this [example](https://github.com/mobxjs/mobx-state-tree/blob/e9e804c8c43e1edde4aabbd52675544e2b3a905b/examples/redux-todomvc/src/index.js#L21)
 * for a setup example.
 *
 * @export
 * @param {*} remoteDevDep
 * @param {*} model
 * @param {{ logIdempotentActionSteps: boolean; logChildActions: boolean }} [options]
 */
export function connectReduxDevtools(
    remoteDevDep: any,
    model: mst.IAnyStateTreeNode,
    options?: {
        logIdempotentActionSteps: boolean
        logChildActions: boolean
        logArgsNearName: boolean
    }
) {
    options = {
        logIdempotentActionSteps: true,
        logChildActions: false,
        logArgsNearName: true,
        ...options
    }

    let handlingMonitorAction = 0

    // Connect to the monitor
    const remotedev = remoteDevDep.connectViaExtension({
        name: mst.getType(model).name
    })

    // Subscribe to change state (if need more than just logging)
    remotedev.subscribe((message: any) => {
        if (message.type === "DISPATCH") {
            handleMonitorActions(remotedev, model, message)
        }
    })

    const initialState = mst.getSnapshot(model)
    remotedev.init(initialState)

    const actionContexts = new Map<number, ActionContext>()

    let changesMadeSetter: ChangesMadeSetter | undefined = undefined
    if (!options.logIdempotentActionSteps) {
        mst.onPatch(model, () => {
            if (!handlingMonitorAction && changesMadeSetter) {
                changesMadeSetter()
            }
        })
    }

    mst.addMiddleware(model, actionMiddleware, false)
    function actionMiddleware(call: mst.IMiddlewareEvent, next: any) {
        if (handlingMonitorAction) {
            next(call)
            return
        }

        let context!: ActionContext

        // find the context of the parent action (if any)
        for (let i = call.allParentIds.length - 1; i >= 0; i--) {
            const parentId = call.allParentIds[i]
            const foundContext = actionContexts.get(parentId)
            if (foundContext) {
                context = foundContext
                break
            }
        }

        // if it is an action we need to create a new action context
        if (call.type === "action") {
            const targetTypePath = getTargetTypePath(call.context).join("/")

            const parentContext = context
            context = {
                // use a space rather than a dot so that the redux devtools move the actions to the next line if there's not enough space
                name: `[root${mst.getPath(call.context)}] ${call.name}`,
                targetTypePath: targetTypePath,
                id: call.id,
                runningAsync: false,
                errored: false,
                errorReported: false,
                step: 0,
                callArgs: {},
                changesMadeSetter: undefined
            }

            if (call.args) {
                call.args.forEach((value, index) => (context.callArgs[index] = value))
            }

            // subaction, assign the parent action context
            if (call.parentId) {
                context.parent = parentContext
            }

            actionContexts.set(call.id, context)
        }

        let changesMade = false
        context.changesMadeSetter = () => {
            changesMade = true
        }
        let oldChangesMadeSetter = changesMadeSetter
        changesMadeSetter = context.changesMadeSetter

        // capture any errors and rethrow them later (after it is logged)
        let errorThrown
        try {
            next(call)
        } catch (e) {
            errorThrown = e
            context.errored = true
        }

        changesMadeSetter = oldChangesMadeSetter
        context.changesMadeSetter = undefined

        const changedTheModel = options!.logIdempotentActionSteps ? true : changesMade

        switch (call.type) {
            case "flow_spawn":
            case "flow_resume":
            case "flow_resume_error": // not errored since the promise error might be caught
                // when this events come we can be sure that this action is being run async, as well as its parent actions
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

        // only log if:
        // - it is a sync (never run async code) action
        // - a flow_resume
        // - a flow_throw that wasn't reported as an error before
        // we don't include other kinds since flow_spawn never contain state changes and flow_resume_error might be caught by and handled the parent
        const syncAction = call.type === "action" && !context.runningAsync
        let log =
            syncAction ||
            call.type === "flow_resume" ||
            (call.type === "flow_throw" && !context.errorReported)

        // do not log child actions if asked not to, but only for sync actions
        if (!options!.logChildActions && context.parent && !context.runningAsync) {
            log = false
            // give the child action changes to the parent action
            if (changesMade && context.parent.changesMadeSetter) {
                context.parent.changesMadeSetter()
            }
        }

        if (log) {
            const logStep = (logContext: ActionContext) => {
                const sn = mst.getSnapshot(model)

                const names = getActionContextNameAndTypePath(logContext, options!.logArgsNearName)

                const copy = {
                    type: names.name,
                    targetTypePath: names.targetTypePath,
                    args: { ...logContext.callArgs }
                }
                remotedev.send(copy, sn)

                // we do it over the original context, not the log context, since the original context might throw but the original context might not
                if (context.errored) {
                    context.errorReported = true
                }

                // increase the step for logging purposes, as well as any parent steps (since child steps count as a parent step)
                context.step++

                let parent = context.parent
                while (parent) {
                    parent.step++
                    parent = parent.parent
                }
            }

            // if it is an async subaction we need to log it since it made a change, but we will log it as if it were the root
            const logAsRoot = context.parent && !options!.logChildActions

            if (changedTheModel) {
                let logContext = context
                if (logAsRoot) {
                    while (logContext.parent) {
                        logContext = logContext.parent
                    }
                }

                logStep(logContext)
            } else if (!logAsRoot && context.errored && !context.errorReported) {
                logStep(context)
            }
        }

        // once the action is totally finished remove it from the context list to avoid mem leaks
        if (call.type === "flow_return" || call.type === "flow_throw" || !context!.runningAsync) {
            actionContexts.delete(context!.id!)
        }

        // rethrow previously captured excepton if needed
        if (errorThrown) {
            throw errorThrown
        }
    }

    function handleMonitorActions(remotedev2: any, model2: any, message: any) {
        try {
            handlingMonitorAction++

            switch (message.payload.type) {
                case "RESET":
                    mst.applySnapshot(model2, initialState)
                    return remotedev2.init(initialState)
                case "COMMIT":
                    return remotedev2.init(mst.getSnapshot(model2))
                case "ROLLBACK":
                    return remotedev2.init(remoteDevDep.extractState(message))
                case "JUMP_TO_STATE":
                case "JUMP_TO_ACTION":
                    mst.applySnapshot(model2, remoteDevDep.extractState(message))
                    return
                case "IMPORT_STATE":
                    const nextLiftedState = message.payload.nextLiftedState
                    const computedStates = nextLiftedState.computedStates
                    mst.applySnapshot(model2, computedStates[computedStates.length - 1].state)
                    remotedev2.send(null, nextLiftedState)
                    return
                default:
            }
        } finally {
            handlingMonitorAction--
        }
    }
}
