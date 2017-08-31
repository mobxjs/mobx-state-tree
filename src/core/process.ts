// based on: https://github.com/mobxjs/mobx-utils/blob/master/src/async-action.ts

export function process<R>(generator: () => IterableIterator<any>): () => Promise<R>
export function process<A1>(generator: (a1: A1) => IterableIterator<any>): (a1: A1) => Promise<any> // Ideally we want to have R instead of Any, but cannot specify R without specifying A1 etc... 'any' as result is better then not specifying request args
export function process<A1, A2>(
    generator: (a1: A1, a2: A2) => IterableIterator<any>
): (a1: A1, a2: A2) => Promise<any>
export function process<A1, A2, A3>(
    generator: (a1: A1, a2: A2, a3: A3) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3) => Promise<any>
export function process<A1, A2, A3, A4>(
    generator: (a1: A1, a2: A2, a3: A3, a4: A4) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3, a4: A4) => Promise<any>
export function process<A1, A2, A3, A4, A5>(
    generator: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => Promise<any>
export function process<A1, A2, A3, A4, A5, A6>(
    generator: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => Promise<any>
export function process<A1, A2, A3, A4, A5, A6, A7>(
    generator: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7) => Promise<any>
export function process<A1, A2, A3, A4, A5, A6, A7, A8>(
    generator: (
        a1: A1,
        a2: A2,
        a3: A3,
        a4: A4,
        a5: A5,
        a6: A6,
        a7: A7,
        a8: A8
    ) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8) => Promise<any>
/**
 * See [asynchronous actions](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/async-actions.md).
 *
 * @export
 * @alias process
 * @returns {Promise}
 */
export function process(asyncAction: any): any {
    return createProcessSpawner(asyncAction.name, asyncAction)
}

export function createProcessSpawner(name: string, generator: Function) {
    const spawner = function processSpawner(this: any) {
        // Implementation based on https://github.com/tj/co/blob/master/index.js
        const runId = getNextActionId()
        const baseContext = getActionContext()
        const args = arguments

        function wrap(fn: any, type: IMiddlewareEventType, arg: any) {
            fn.$mst_middleware = (spawner as any).$mst_middleware // pick up any middleware attached to the process
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
                onFulfilled(undefined) // kick off the process
            }
            ;(init as any).$mst_middleware = (spawner as any).$mst_middleware

            runWithActionContext(
                {
                    name,
                    type: "process_spawn",
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
                    wrap((r: any) => { ret = gen.next(r) }, "process_resume", res)
                } catch (e) {
                    // prettier-ignore
                    setImmediate(() => {
                        wrap((r: any) => { reject(e) }, "process_throw", e)
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
                    wrap((r: any) => { ret = gen.throw(r) }, "process_resume_error", err) // or yieldError?
                } catch (e) {
                    // prettier-ignore
                    setImmediate(() => {
                        wrap((r: any) => { reject(e) }, "process_throw", e)
                    })
                    return
                }
                next(ret)
            }

            function next(ret: any) {
                if (ret.done) {
                    // prettier-ignore
                    setImmediate(() => {
                        wrap((r: any) => { resolve(r) }, "process_return", ret.value)
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
