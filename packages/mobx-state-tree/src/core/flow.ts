import { setImmediateWithFallback } from "../utils"

/**
 * @hidden
 */
export type FlowReturn<R> = R extends Promise<infer T> ? T : R

/**
 * See [asynchronous actions](concepts/async-actions.md).
 *
 * @returns The flow as a promise.
 */
export function flow<R, Args extends any[]>(
    generator: (...args: Args) => Generator<Promise<any>, R, any>
): (...args: Args) => Promise<FlowReturn<R>> {
    return createFlowSpawner(generator.name, generator) as any
}

/**
 * @deprecated Not needed since TS3.6.
 * Used for TypeScript to make flows that return a promise return the actual promise result.
 *
 * @param val
 * @returns
 */
export function castFlowReturn<T>(val: T): T {
    return val as any
}

/**
 * @internal
 * @hidden
 */
export function createFlowSpawner(name: string, generator: Function) {
    const spawner = function flowSpawner(this: any) {
        // Implementation based on https://github.com/tj/co/blob/master/index.js
        const runId = getNextActionId()
        const parentContext = getCurrentActionContext()!
        if (!parentContext) {
            throw fail("a mst flow must always have a parent context")
        }
        const parentActionContext = getParentActionContext(parentContext)
        if (!parentActionContext) {
            throw fail("a mst flow must always have a parent action context")
        }

        const contextBase = {
            name,
            id: runId,
            tree: parentContext.tree,
            context: parentContext.context,
            parentId: parentContext.id,
            allParentIds: [...parentContext.allParentIds, parentContext.id],
            rootId: parentContext.rootId,
            parentEvent: parentContext,
            parentActionEvent: parentActionContext
        }

        const args = arguments

        function wrap(fn: any, type: IMiddlewareEventType, arg: any) {
            fn.$mst_middleware = (spawner as any).$mst_middleware // pick up any middleware attached to the flow
            runWithActionContext(
                {
                    ...contextBase,
                    type,
                    args: [arg]
                },
                fn
            )
        }

        return new Promise(function (resolve, reject) {
            let gen: any
            const init = function asyncActionInit() {
                gen = generator.apply(null, arguments)
                onFulfilled(undefined) // kick off the flow
            }
            ;(init as any).$mst_middleware = (spawner as any).$mst_middleware

            runWithActionContext(
                {
                    ...contextBase,
                    type: "flow_spawn",
                    args: argsToArray(args)
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
                    setImmediateWithFallback(() => {
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
                    setImmediateWithFallback(() => {
                        wrap((r: any) => { reject(e) }, "flow_throw", e)
                    })
                    return
                }
                next(ret)
            }

            function next(ret: any) {
                if (ret.done) {
                    // prettier-ignore
                    setImmediateWithFallback(() => {
                        wrap((r: any) => { resolve(r) }, "flow_return", ret.value)
                    })
                    return
                }
                // TODO: support more type of values? See https://github.com/tj/co/blob/249bbdc72da24ae44076afd716349d2089b31c4c/index.js#L100
                if (!ret.value || typeof ret.value.then !== "function") {
                    // istanbul ignore next
                    throw fail("Only promises can be yielded to `async`, got: " + ret)
                }
                return ret.value.then(onFulfilled, onRejected)
            }
        })
    }
    return spawner
}

import {
    IMiddlewareEventType,
    runWithActionContext,
    getCurrentActionContext,
    getParentActionContext,
    getNextActionId
} from "./action"
import { fail, argsToArray } from "../utils"
