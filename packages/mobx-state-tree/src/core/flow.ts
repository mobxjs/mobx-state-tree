export interface FlowStep {
    // fake, only for typing
    "!!flowStep": undefined
}

// we skip promises that are the result of yielding promises
export type FlowReturnType<R> = FlowStepOnlyToVoid<R extends Promise<any> ? FlowStep : R>

// we extract yielded promises from the return type
export type FlowStepOnlyToVoid<R> = Exclude<R, FlowStep> extends never ? void : Exclude<R, FlowStep>

/**
 * See [asynchronous actions](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/async-actions.md).
 *
 * @export
 * @alias flow
 * @returns {Promise}
 */
export function flow<R, Args extends any[]>(
    generator: (...args: Args) => IterableIterator<R>
): (...args: Args) => Promise<FlowReturnType<R>> {
    return createFlowSpawner(generator.name, generator) as any
}

/**
 * @internal
 * @private
 */
export function createFlowSpawner(name: string, generator: Function) {
    const spawner = function flowSpawner(this: any) {
        // Implementation based on https://github.com/tj/co/blob/master/index.js
        const runId = getNextActionId()
        const baseContext = getActionContext()
        const args = arguments

        function wrap(fn: any, type: IMiddlewareEventType, arg: any) {
            fn.$mst_middleware = (spawner as any).$mst_middleware // pick up any middleware attached to the flow
            runWithActionContext(
                {
                    name,
                    type,
                    id: runId,
                    args: [arg],
                    tree: baseContext.tree,
                    context: baseContext.context,
                    parentId: baseContext.id,
                    rootId: baseContext.rootId
                },
                fn
            )
        }

        return new Promise(function(resolve, reject) {
            let gen: any
            const init = function asyncActionInit() {
                gen = generator.apply(null, arguments)
                onFulfilled(undefined) // kick off the flow
            }
            ;(init as any).$mst_middleware = (spawner as any).$mst_middleware

            runWithActionContext(
                {
                    name,
                    type: "flow_spawn",
                    id: runId,
                    args: argsToArray(args),
                    tree: baseContext.tree,
                    context: baseContext.context,
                    parentId: baseContext.id,
                    rootId: baseContext.rootId
                },
                init
            )

            function onFulfilled(res: any) {
                let ret
                try {
                    // prettier-ignore
                    wrap((r: any) => { ret = gen.next(r) }, "flow_resume", res)
                } catch (e) {
                    // prettier-ignore
                    setImmediate(() => {
                        wrap((r: any) => { reject(e) }, "flow_throw", e)
                    })
                    return
                }
                next(ret)
                return
            }

            function onRejected(err: any) {
                let ret
                try {
                    // prettier-ignore
                    wrap((r: any) => { ret = gen.throw(r) }, "flow_resume_error", err) // or yieldError?
                } catch (e) {
                    // prettier-ignore
                    setImmediate(() => {
                        wrap((r: any) => { reject(e) }, "flow_throw", e)
                    })
                    return
                }
                next(ret)
            }

            function next(ret: any) {
                if (ret.done) {
                    // prettier-ignore
                    setImmediate(() => {
                        wrap((r: any) => { resolve(r) }, "flow_return", ret.value)
                    })
                    return
                }
                // TODO: support more type of values? See https://github.com/tj/co/blob/249bbdc72da24ae44076afd716349d2089b31c4c/index.js#L100
                if (!ret.value || typeof ret.value.then !== "function")
                    fail("Only promises can be yielded to `async`, got: " + ret)
                return ret.value.then(onFulfilled, onRejected)
            }
        })
    }
    return spawner
}

import {
    IMiddlewareEventType,
    runWithActionContext,
    getActionContext,
    getNextActionId
} from "./action"
import { fail, argsToArray } from "../utils"
