import { IMiddlewareEvent, IMiddlewareHandler, IAnyStateTreeNode } from "../internal"

export interface IActionTrackingMiddleware2Call<TEnv> {
    readonly name: string
    readonly id: number
    readonly parentId: number
    readonly rootId: number
    readonly allParentIds: number[]
    readonly context: IAnyStateTreeNode
    readonly tree: IAnyStateTreeNode
    readonly args: any[]
    env: TEnv | undefined
    readonly parentCall?: IActionTrackingMiddleware2Call<TEnv>
}

export interface IActionTrackingMiddleware2Hooks<TEnv> {
    filter?: (call: IActionTrackingMiddleware2Call<TEnv>) => boolean
    onStart: (call: IActionTrackingMiddleware2Call<TEnv>) => void
    onFinish: (call: IActionTrackingMiddleware2Call<TEnv>, error?: any) => void
}

const noopHooks: IActionTrackingMiddleware2Hooks<any> = {
    onStart() {},
    onFinish() {}
}

class RunningAction {
    private flowsPending = 0
    private running = true

    constructor(
        private readonly map: Map<number, RunningAction>,
        public readonly hooks: IActionTrackingMiddleware2Hooks<any>,
        readonly call: IActionTrackingMiddleware2Call<any>
    ) {
        map.set(this.id, this)
        hooks.onStart(call)
    }

    private get id() {
        return this.call.id
    }

    finish(error?: any) {
        if (this.running) {
            this.running = false
            this.map.delete(this.id)
            this.hooks.onFinish(this.call, error)
        }
    }

    incFlowsPending() {
        this.flowsPending++
    }

    decFlowsPending() {
        this.flowsPending--
    }

    get hasFlowsPending() {
        return this.flowsPending > 0
    }
}

/**
 * Convenience utility to create action based middleware that supports async processes more easily.
 * The flow is like this:
 * - for each action: if filter passes -> `onStart` -> (inner actions recursively) -> `onFinish`
 *
 * Example: if we had an action `a` that called inside an action `b1`, then `b2` the flow would be:
 * - `filter(a)`
 * - `onStart(a)`
 *   - `filter(b1)`
 *   - `onStart(b1)`
 *   - `onFinish(b1)`
 *   - `filter(b2)`
 *   - `onStart(b2)`
 *   - `onFinish(b2)`
 * - `onFinish(a)`
 *
 * The flow is the same no matter if the actions are sync or async.
 *
 * See the `atomic` middleware for an example
 *
 * @param hooks
 * @returns
 */
export function createActionTrackingMiddleware2<TEnv = any>(
    middlewareHooks: IActionTrackingMiddleware2Hooks<TEnv>
): IMiddlewareHandler {
    const runningActions = new Map<number, RunningAction>()

    return function actionTrackingMiddleware(
        call: IMiddlewareEvent,
        next: (actionCall: IMiddlewareEvent) => any
    ) {
        let parentRunningAction

        // allParentIds goes from root to immediate parent, so we traverse it backwards
        for (let i = call.allParentIds.length - 1; i >= 0; i--) {
            const id = call.allParentIds[i]
            parentRunningAction = runningActions.get(id)
            if (parentRunningAction) {
                break
            }
        }

        if (call.type === "action") {
            const newCall: IActionTrackingMiddleware2Call<TEnv> = {
                ...call,
                // make a shallow copy of the parent action env
                env: parentRunningAction && parentRunningAction.call.env,
                parentCall: parentRunningAction && parentRunningAction.call
            }

            const passesFilter = !middlewareHooks.filter || middlewareHooks.filter(newCall)
            const hooks = passesFilter ? middlewareHooks : noopHooks

            const runningAction = new RunningAction(runningActions, hooks, newCall)

            let res
            try {
                res = next(call)
            } catch (e) {
                runningAction.finish(e)
                throw e
            }

            if (!runningAction.hasFlowsPending) {
                // sync action finished
                runningAction.finish()
            }
            return res
        } else {
            if (!parentRunningAction) {
                return next(call)
            }

            switch (call.type) {
                case "flow_spawn": {
                    parentRunningAction.incFlowsPending()
                    return next(call)
                }
                case "flow_resume":
                case "flow_resume_error": {
                    return next(call)
                }
                case "flow_throw": {
                    const error = call.args[0]
                    try {
                        return next(call)
                    } finally {
                        parentRunningAction.decFlowsPending()
                        if (!parentRunningAction.hasFlowsPending) {
                            parentRunningAction.finish(error)
                        }
                    }
                }
                case "flow_return": {
                    try {
                        return next(call)
                    } finally {
                        parentRunningAction.decFlowsPending()
                        if (!parentRunningAction.hasFlowsPending) {
                            parentRunningAction.finish()
                        }
                    }
                }
            }
        }
    }
}
