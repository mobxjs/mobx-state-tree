// based on: https://github.com/mobxjs/mobx-utils/blob/master/src/async-action.ts

export function asyncAction<R>(generator: () => IterableIterator<any>): () => Promise<R>
export function asyncAction<A1>(
    generator: (a1: A1) => IterableIterator<any>
): (a1: A1) => Promise<any> // Ideally we want to have R instead of Any, but cannot specify R without specifying A1 etc... 'any' as result is better then not specifying request args
export function asyncAction<A1, A2, A3, A4, A5, A6, A7, A8>(
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
export function asyncAction<A1, A2, A3, A4, A5, A6, A7>(
    generator: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7) => Promise<any>
export function asyncAction<A1, A2, A3, A4, A5, A6>(
    generator: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => Promise<any>
export function asyncAction<A1, A2, A3, A4, A5>(
    generator: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => Promise<any>
export function asyncAction<A1, A2, A3, A4>(
    generator: (a1: A1, a2: A2, a3: A3, a4: A4) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3, a4: A4) => Promise<any>
export function asyncAction<A1, A2, A3>(
    generator: (a1: A1, a2: A2, a3: A3) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3) => Promise<any>
export function asyncAction<A1, A2>(
    generator: (a1: A1, a2: A2) => IterableIterator<any>
): (a1: A1, a2: A2) => Promise<any>
export function asyncAction<A1>(
    generator: (a1: A1) => IterableIterator<any>
): (a1: A1) => Promise<any>
/**
 * See [asynchronous actions](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/async-actions.md).
 *
 * @export
 * @alias async
 * @returns {Promise}
 */
export function asyncAction(asyncAction: any): any {
    return createAsyncActionInvoker(asyncAction.name, asyncAction)
}

let generatorId = 0

export function createAsyncActionInvoker(name: string, generator: Function) {
    // Implementation based on https://github.com/tj/co/blob/master/index.js
    const runId = ++generatorId

    const spawner = function asyncAction(this: any) {
        const ctx = this
        const args = arguments

        function wrap(fn: any, mode: IActionAsyncMode, arg: any) {
            createActionInvoker(ctx, name, fn, mode, runId).call(null, arg)
        }

        return new Promise(function(resolve, reject) {
            let gen: any
            createActionInvoker(
                ctx,
                name,
                function asyncActionInit(this: any) {
                    gen = generator.apply(this, arguments)
                    onFulfilled(undefined) // kick off the process
                },
                "invoke",
                runId
            ).apply(null, args)

            function onFulfilled(res: any) {
                let ret
                try {
                    // prettier-ignore
                    wrap((r: any) => { ret = gen.next(r) }, "yield", res)
                } catch (e) {
                    // prettier-ignore
                    setImmediate(() => {
                        wrap((r: any) => { reject(e) }, "throw", e)
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
                    wrap((r: any) => { ret = gen.throw(r) }, "yieldError", err) // or yieldError?
                } catch (e) {
                    // prettier-ignore
                    setImmediate(() => {
                        wrap((r: any) => { reject(e) }, "throw", e)
                    })
                    return
                }
                next(ret)
            }

            function next(ret: any) {
                if (ret.done) {
                    // prettier-ignore
                    setImmediate(() => {
                        wrap((r: any) => { resolve(r) }, "return", ret.value)
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
    // TODO: remove this again:
    ;(spawner as any).isAsyncMSTAction = true
    return spawner
}

import { createActionInvoker, IActionAsyncMode } from "./action"
import { fail } from "../utils"
