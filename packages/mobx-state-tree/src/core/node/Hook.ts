/**
 * @hidden
 */
export enum Hook {
    afterCreate = "afterCreate",
    afterAttach = "afterAttach",
    afterCreationFinalization = "afterCreationFinalization",
    beforeDetach = "beforeDetach",
    beforeDestroy = "beforeDestroy"
}

export interface IHooks {
    [Hook.afterCreate]?: () => void
    [Hook.afterAttach]?: () => void
    [Hook.beforeDetach]?: () => void
    [Hook.beforeDestroy]?: () => void
}

export type IHooksGetter<T> = (self: T) => IHooks
