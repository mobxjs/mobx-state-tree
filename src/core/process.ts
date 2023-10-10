import { deprecated, flow, createFlowSpawner } from "../internal"

// based on: https://github.com/mobxjs/mobx-utils/blob/master/src/async-action.ts
/*
    All contents of this file are deprecated.

    The term `process` has been replaced with `flow` to avoid conflicts with the
    global `process` object.

    Refer to `flow.ts` for any further changes to this implementation.
*/

const DEPRECATION_MESSAGE =
  "See https://github.com/mobxjs/mobx-state-tree/issues/399 for more information. " +
  "Note that the middleware event types starting with `process` now start with `flow`."

/**
 * @deprecated has been renamed to `flow()`.
 * @hidden
 */
export function process<R>(generator: () => IterableIterator<any>): () => Promise<R>
/**
 * @deprecated has been renamed to `flow()`.
 * @hidden
 */
export function process<A1>(generator: (a1: A1) => IterableIterator<any>): (a1: A1) => Promise<any>
/**
 * @deprecated has been renamed to `flow()`.
 * @hidden
 */
export function process<A1, A2>(
  generator: (a1: A1, a2: A2) => IterableIterator<any>
): (a1: A1, a2: A2) => Promise<any>
/**
 * @deprecated has been renamed to `flow()`.
 * @hidden
 */
export function process<A1, A2, A3>(
  generator: (a1: A1, a2: A2, a3: A3) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3) => Promise<any>
/**
 * @deprecated has been renamed to `flow()`.
 * @hidden
 */
export function process<A1, A2, A3, A4>(
  generator: (a1: A1, a2: A2, a3: A3, a4: A4) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3, a4: A4) => Promise<any>
/**
 * @deprecated has been renamed to `flow()`.
 * @hidden
 */
export function process<A1, A2, A3, A4, A5>(
  generator: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => Promise<any>
/**
 * @deprecated has been renamed to `flow()`.
 * @hidden
 */
export function process<A1, A2, A3, A4, A5, A6>(
  generator: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => Promise<any>
/**
 * @deprecated has been renamed to `flow()`.
 * @hidden
 */
export function process<A1, A2, A3, A4, A5, A6, A7>(
  generator: (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7) => IterableIterator<any>
): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7) => Promise<any>
/**
 * @deprecated has been renamed to `flow()`.
 * @hidden
 */
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
 * @hidden
 *
 * @deprecated has been renamed to `flow()`.
 * See https://github.com/mobxjs/mobx-state-tree/issues/399 for more information.
 * Note that the middleware event types starting with `process` now start with `flow`.
 *
 * @returns {Promise}
 */
export function process(asyncAction: any): any {
  deprecated("process", "`process()` has been renamed to `flow()`. " + DEPRECATION_MESSAGE)
  return flow(asyncAction)
}

/**
 * @internal
 * @hidden
 */
export function createProcessSpawner(name: string, generator: Function) {
  deprecated(
    "process",
    "`createProcessSpawner()` has been renamed to `createFlowSpawner()`. " + DEPRECATION_MESSAGE
  )
  return createFlowSpawner(name, generator)
}
