import { IMiddlewareEvent, IMiddlewareHandler } from "../internal"

export interface IActionTrackingMiddlewareHooks<T> {
    filter?: (call: IMiddlewareEvent) => boolean
    onStart: (call: IMiddlewareEvent) => T
    onResume: (call: IMiddlewareEvent, context: T) => void
    onSuspend: (call: IMiddlewareEvent, context: T) => void
    onSuccess: (call: IMiddlewareEvent, context: T, result: any) => void
    onFail: (call: IMiddlewareEvent, context: T, error: any) => void
}

const noopHooks: IActionTrackingMiddlewareHooks<any> = {
    onStart() {},
    onResume() {},
    onSuspend() {},
    onSuccess() {},
    onFail() {}
}

/**
 * Convenience utility to create action based middleware that supports async processes more easily.
 * All hooks are called for both synchronous and asynchronous actions, except in the case of `onSuccess`/`onFail`,
 * where only one of them is called.
 *
 * The create middleware tracks the process of an action (assuming it passes the `filter`).
 * `onStart` can return any value, which will be passed as second context argument to any other hook. This makes it possible to keep state during a process.
 *
 * See the `atomic` middleware for an example
 *
 * @param hooks
 * @returns
 */
export function createActionTrackingMiddleware<T = any>(
    middlewareHooks: IActionTrackingMiddlewareHooks<T>
): IMiddlewareHandler {
    interface RunningAction {
        flowsPending: number
        context: T
        passedFilter: boolean
    }
    const runningActions = new Map<number, RunningAction>()

    return function actionTrackingMiddleware(
        call: IMiddlewareEvent,
        next: (actionCall: IMiddlewareEvent) => any
    ) {
        if (call.type === "action") {
            const passedFilter = !middlewareHooks.filter || middlewareHooks.filter(call)

            // when filtered use noop hooks
            // but keep using the whole flow so we don't leak running actions
            const hooks = passedFilter ? middlewareHooks : noopHooks

            const context = hooks.onStart(call)
            hooks.onResume(call, context)
            const runningAction = {
                context,
                flowsPending: 0,
                passedFilter
            }
            runningActions.set(call.id, runningAction)
            try {
                const res = next(call)
                hooks.onSuspend(call, context)
                if (!runningAction.flowsPending) {
                    hooks.onSuccess(call, context, res)
                }
                return res
            } catch (e) {
                hooks.onFail(call, context, e)
                throw e
            } finally {
                if (!runningAction.flowsPending) {
                    runningActions.delete(call.id)
                }
            }
        } else {
            let runningAction
            let runningActionId!: number

            // allParentIds goes from root to immediate parent, so we traverse it backwards
            for (let i = call.allParentIds.length - 1; i >= 0; i--) {
                const id = call.allParentIds[i]
                runningAction = runningActions.get(id)
                if (runningAction) {
                    runningActionId = id
                    break
                }
            }
            if (!runningAction) {
                throw fail("assertion error: no parent action found")
            }

            // when filtered use noop hooks
            // but keep using the whole flow so we don't leak running actions
            const hooks = runningAction.passedFilter ? middlewareHooks : noopHooks

            switch (call.type) {
                case "flow_spawn": {
                    runningAction.flowsPending++
                    return next(call)
                }
                case "flow_resume":
                case "flow_resume_error": {
                    try {
                        hooks.onResume(call, runningAction.context)
                        return next(call)
                    } finally {
                        hooks.onSuspend(call, runningAction.context)
                    }
                }
                case "flow_throw": {
                    try {
                        hooks.onFail(call, runningAction.context, call.args[0])
                        return next(call)
                    } finally {
                        runningAction.flowsPending--
                        if (!runningAction.flowsPending) {
                            runningActions.delete(runningActionId)
                        }
                    }
                }
                case "flow_return": {
                    try {
                        hooks.onSuccess(call, runningAction.context, call.args[0])
                        return next(call)
                    } finally {
                        runningAction.flowsPending--
                        if (!runningAction.flowsPending) {
                            runningActions.delete(runningActionId)
                        }
                    }
                }
            }
        }
    }
}
