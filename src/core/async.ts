// based on: https://github.com/mobxjs/mobx-utils/blob/master/src/async-action.ts

let generatorId = 0

export function asyncAction<R>(
    name: string,
    generator: () => IterableIterator<any>
): () => Promise<R>
export function asyncAction<A1>(
    name: string,
    generator: (a1: A1) => IterableIterator<any>
): (a1: A1) => Promise<any> // Ideally we want to have R instead of Any, but cannot specify R without specifying A1 etc... 'any' as result is better then not specifying request args
export function asyncAction<A1, A2, A3, A4, A5, A6, A7, A8>(
    name: string,
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
    name: string,
    generator: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7) => Promise<any>
export function asyncAction<A1, A2, A3, A4, A5, A6>(
    name: string,
    generator: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => Promise<any>
export function asyncAction<A1, A2, A3, A4, A5>(
    name: string,
    generator: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => Promise<any>
export function asyncAction<A1, A2, A3, A4>(
    name: string,
    generator: (a1: A1, a2: A2, a3: A3, a4: A4) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3, a4: A4) => Promise<any>
export function asyncAction<A1, A2, A3>(
    name: string,
    generator: (a1: A1, a2: A2, a3: A3) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3) => Promise<any>
export function asyncAction<A1, A2>(
    name: string,
    generator: (a1: A1, a2: A2) => IterableIterator<any>
): (a1: A1, a2: A2) => Promise<any>
export function asyncAction<A1>(
    name: string,
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
 * When using the mobx devTools, an async will emit `action` events with names like:
 * * `"fetchUsers - runid: 6 - init"`
 * * `"fetchUsers - runid: 6 - yield 0"`
 * * `"fetchUsers - runid: 6 - yield 1"`
 *
 * The `runId` represents the generator instance. In other words, if `fetchUsers` is invoked multiple times concurrently, the events with the same `runid` belong toghether.
 * The `yield` number indicates the progress of the generator. `init` indicates spawning (it won't do anything, but you can find the original arguments of the `asyncAction` here).
 * `yield 0` ... `yield n` indicates the code block that is now being executed. `yield 0` is before the first `yield`, `yield 1` after the first one etc. Note that yield numbers are not determined lexically but by the runtime flow.
 *
 * `asyncActions` requires `Promise` and `generators` to be available on the target environment. Polyfill `Promise` if needed. Both TypeScript and Babel can compile generator functions down to ES5.
 *
 * @example
 * TODO
 *
 * @export
 * @alias async
 * @returns {Promise}
 */
export function asyncAction(name: string, generator: Function) {
    // Implementation based on https://github.com/tj/co/blob/master/index.js
    return function(this: any) {
        const ctx = this
        const args = arguments
        return new Promise(function(resolve, reject) {
            const runId = ++generatorId
            let stepId = 0
            // const gen = createActionInvoker(
            //     `${name} - runid: ${runId} - init`,
            //     generator.bind(ctx)
            // ).apply(ctx, args)
            const gen = generator.apply(ctx, args)
            onFulfilled(undefined) // kick off the process

            function onFulfilled(res: any) {
                let ret
                try {
                    // ret = createActionInvoker(
                    //     `${name} - runid: ${runId} - yield ${stepId++}`,
                    //     gen.next
                    // ).call(gen, res)
                    ret = gen.next(res)
                } catch (e) {
                    return reject(e)
                }
                next(ret)
                return null
            }

            function onRejected(err: any) {
                let ret
                try {
                    ret = createActionInvoker(
                        `${name} - runid: ${runId} - yield ${stepId++}`,
                        gen.throw
                    ).call(gen, err)
                } catch (e) {
                    return reject(e)
                }
                next(ret)
            }

            function next(ret: any) {
                if (ret.done) return resolve(ret.value)
                // TODO: support more type of values? See https://github.com/tj/co/blob/249bbdc72da24ae44076afd716349d2089b31c4c/index.js#L100
                if (!ret.value || typeof ret.value.then !== "function")
                    fail("Only promises can be yielded to `async`, got: " + ret)
                return ret.value.then(onFulfilled, onRejected)
            }
        })
    }
}

import { createActionInvoker } from "./action"
import { fail } from "../utils"
