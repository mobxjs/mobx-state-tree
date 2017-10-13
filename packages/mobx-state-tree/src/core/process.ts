/*
    All contents of this file are deprecated.

    The term `process` has been replaced with `flow` to avoid conflicts with the 
    global `process` object.

    Refer to `flow.ts` for any further changes to this implementation.
*/

export function process<R>(generator: () => IterableIterator<any>): () => Promise<R>
export function process<A1>(generator: (a1: A1) => IterableIterator<any>): (a1: A1) => Promise<any>
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
 * @deprecated has been renamed to `flow()`. See https://github.com/mobxjs/mobx-state-tree/issues/399 for more information.
 *
 * @export
 * @alias process
 * @returns {Promise}
 */
export function process(asyncAction: any): any {
    deprecated(
        "process",
        "`process()` has been renamed to `flow()`. See https://github.com/mobxjs/mobx-state-tree/issues/399 for more information."
    )
    return flow(asyncAction)
}

export function createProcessSpawner(name: string, generator: Function) {
    deprecated(
        "process",
        "`createProcessSpawner()` has been renamed to `createFlowSpawner()`. See https://github.com/mobxjs/mobx-state-tree/issues/399 for more information."
    )
    return createFlowSpawner(name, generator)
}

import { deprecated } from "../utils"
import { flow, createFlowSpawner } from "./flow"
