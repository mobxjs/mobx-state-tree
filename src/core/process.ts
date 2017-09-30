// DEPRICATED
// replaced with ./flow.ts

import { flow, createFlowSpawner } from "./flow"

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
 * @deprecated Renamed to `flow`.
 * @export
 * @alias process
 * @returns {Promise}
 */
export function process(asyncAction: any): any {
    if (global && global.process.env.NODE_ENV !== "production") {
        console.warn("[Deprication Warning] `process` has been renamed to `flow`")
    }
    return flow(asyncAction)
}

/**
 * @deprecated Renamed to `createFlowSpawner`.
 */
export function createProcessSpawner(name: string, generator: Function) {
    if (global && global.process.env.NODE_ENV !== "production") {
        console.warn(
            "[Deprication Warning] `createProcessSpawner` has been renamed to `createFlowSpawner`"
        )
    }
    return createFlowSpawner(name, generator)
}
