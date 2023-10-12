import { IMiddlewareEvent, IMiddlewareHandler, IActionContext } from "../internal"

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export interface IActionTrackingMiddleware2Call<TEnv> extends Readonly<IActionContext> {
  env: TEnv | undefined
  readonly parentCall?: IActionTrackingMiddleware2Call<TEnv>
}

export interface IActionTrackingMiddleware2Hooks<TEnv> {
  filter?: (call: IActionTrackingMiddleware2Call<TEnv>) => boolean
  onStart: (call: IActionTrackingMiddleware2Call<TEnv>) => void
  onFinish: (call: IActionTrackingMiddleware2Call<TEnv>, error?: any) => void
}

class RunningAction {
  private flowsPending = 0
  private running = true

  constructor(
    public readonly hooks: IActionTrackingMiddleware2Hooks<any> | undefined,
    readonly call: IActionTrackingMiddleware2Call<any>
  ) {
    if (hooks) {
      hooks.onStart(call)
    }
  }

  finish(error?: any) {
    if (this.running) {
      this.running = false
      if (this.hooks) {
        this.hooks.onFinish(this.call, error)
      }
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
    // find parentRunningAction
    const parentRunningAction = call.parentActionEvent
      ? runningActions.get(call.parentActionEvent.id)
      : undefined

    if (call.type === "action") {
      const newCall: IActionTrackingMiddleware2Call<TEnv> = {
        ...call,
        // make a shallow copy of the parent action env
        env: parentRunningAction && parentRunningAction.call.env,
        parentCall: parentRunningAction && parentRunningAction.call
      }

      const passesFilter = !middlewareHooks.filter || middlewareHooks.filter(newCall)
      const hooks = passesFilter ? middlewareHooks : undefined

      const runningAction = new RunningAction(hooks, newCall)
      runningActions.set(call.id, runningAction)

      let res
      try {
        res = next(call)
      } catch (e) {
        runningActions.delete(call.id)
        runningAction.finish(e)
        throw e
      }
      // sync action finished
      if (!runningAction.hasFlowsPending) {
        runningActions.delete(call.id)
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
              runningActions.delete(call.parentActionEvent!.id)
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
              runningActions.delete(call.parentActionEvent!.id)
              parentRunningAction.finish()
            }
          }
        }
      }
    }
  }
}
