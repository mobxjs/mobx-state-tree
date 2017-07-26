// based on: https://github.com/mobxjs/mobx-utils/blob/master/src/async-action.ts

let generatorId = 0

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
 * `async` takes a generator function and automatically wraps all parts of the process in actions. See the examples below.
 * `async` can be used both as decorator or to wrap functions.
 *
 * - It is important that `async should always be used with a generator function (recognizable as `function*` or `*name` syntax)
 * - Each yield statement should return a Promise. The generator function will continue as soon as the promise settles, with the settled value
 * - When the generator function finishes, you can return a normal value. The `async` wrapped function will always produce a promise delivering that value.
 *
 * `async` requires `Promise` and `generators` to be available on the target environment. Polyfill `Promise` if needed. Both TypeScript and Babel can compile generator functions down to ES5.
 *
 * @example
 * TODO
 *
 * @export
 * @alias async
 * @returns {Promise}
 */
export function asyncAction(asyncAction: any): any {
    if (!isGeneratorFunction(asyncAction))
        fail(`async expects a generator function (e.g. function* () {...}))`)
    // async just helps with typings, the real creation of the invoker is done by the ActionProperty type
    return asyncAction
}

export function createAsyncActionInvoker(name: string, generator: Function) {
    // Implementation based on https://github.com/tj/co/blob/master/index.js
    const runId = ++generatorId

    return function asyncAction(this: any) {
        const ctx = this
        const args = arguments

        function wrap(fn: any, mode: IActionAsyncMode, arg: any) {
            createActionInvoker(name, fn, mode, runId).call(ctx, arg)
        }

        return new Promise(function(resolve, reject) {
            let gen: any
            createActionInvoker(
                name,
                function asyncActionInit(this: any) {
                    gen = generator.apply(this, arguments)
                    onFulfilled(undefined) // kick off the process
                },
                "start",
                runId
            ).apply(ctx, args)

            function onFulfilled(res: any) {
                let ret
                try {
                    // prettier-ignore
                    wrap((r: any) => { ret = gen.next(r) }, "yield", res)
                } catch (e) {
                    // prettier-ignore
                    setImmediate(() => {
                        wrap((r: any) => { reject(e) }, "error", e)
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
                        wrap((r: any) => { reject(e) }, "error", e)
                    })
                    return
                }
                next(ret)
            }

            function next(ret: any) {
                if (ret.done) {
                    // prettier-ignore
                    setImmediate(() => {
                        wrap((r: any) => { resolve(r) }, "done", ret.value)
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
}

import { createActionInvoker, IActionAsyncMode } from "./action"
import { fail, isGeneratorFunction } from "../utils"
