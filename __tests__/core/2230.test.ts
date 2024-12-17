//github.com/mobxjs/mobx-state-tree/issues/2230
import { describe, test } from "bun:test"
import { types, Instance } from "../../src/index"

describe("2230 - type instantiation is excessively deep and possibly infinite", () => {
    test("does not happen", () => {
        const ModelProps = types
            .model({
                prop01: "",
                prop02: "",
                prop03: ""
            })
            .props({
                prop11: "",
                prop12: "",
                prop13: ""
            })
            .props({
                prop21: "",
                prop22: "",
                prop23: ""
            })
            .props({
                prop31: "",
                prop32: "",
                prop33: ""
            })
            .props({
                prop41: "",
                prop42: "",
                prop43: ""
            })
            .props({
                prop51: "",
                prop52: "",
                prop53: ""
            })
            .props({
                prop61: "",
                prop62: "",
                prop63: ""
            })
            .props({
                prop71: "",
                prop72: "",
                prop73: ""
            })
            .props({
                prop81: "",
                prop82: "",
                prop83: ""
            })
            .props({
                prop91: "",
                prop92: "",
                prop93: ""
            })
        interface IModelProps extends Instance<typeof ModelProps> {}

        const ModelVolatile = ModelProps.volatile(() => ({
            vol01: null,
            vol02: null,
            vol03: null
        }))
            .volatile(() => ({
                vol11: null,
                vol12: null,
                vol13: null
            }))
            .volatile(() => ({
                vol21: null,
                vol22: null,
                vol23: null
            }))
            .volatile(() => ({
                vol31: null,
                vol32: null,
                vol33: null
            }))
            .volatile(() => ({
                vol41: null,
                vol42: null,
                vol43: null
            }))
            .volatile(() => ({
                vol51: null,
                vol52: null,
                vol53: null
            }))
            .volatile(() => ({
                vol61: null,
                vol62: null,
                vol63: null
            }))
            .volatile(() => ({
                vol71: null,
                vol72: null,
                vol73: null
            }))
            .volatile(() => ({
                vol81: null,
                vol82: null,
                vol83: null
            }))
            .volatile(() => ({
                vol91: null,
                vol92: null,
                vol93: null
            }))
        interface IModelVolatile extends Instance<typeof ModelVolatile> {}

        const ModelViews = ModelVolatile.views((self: IModelVolatile) => ({
            get vol01Var() {
                return self.vol01
            }
        }))
        interface IModelViews extends Instance<typeof ModelViews> {}

        const Action1 = ModelViews.actions((self: IModelViews) => ({
            getProp01(): string {
                return self.prop01
            }
        }))
        interface IAction1 extends Instance<typeof Action1> {}

        const Action2 = Action1.actions((self: IAction1) => ({
            getProp11(): string {
                return self.prop11
            }
        }))
        interface IAction2 extends Instance<typeof Action2> {}

        const Action3 = Action2.actions((self: IAction2) => ({
            getProp21(): string {
                return self.prop21
            }
        }))
        interface IAction3 extends Instance<typeof Action3> {}

        const Action4 = Action3.actions((self: IAction3) => ({
            getProp31(): string {
                return self.prop31
            }
        }))
        interface IAction4 extends Instance<typeof Action4> {}

        const Action5 = Action4.actions((self: IAction4) => ({
            getProp41(): string {
                return self.prop41
            }
        }))
            .actions((self: IAction4) => ({
                getProp51(): string {
                    return self.prop51
                }
            }))
            .actions((self: IAction4) => ({
                getProp61(): string {
                    return self.prop61
                }
            }))
            .actions((self: IAction4) => ({
                getProp71(): string {
                    return self.prop71
                }
            }))
            .actions((self: IAction4) => ({
                getProp81(): string {
                    return self.prop81
                }
            }))
            .actions((self: IAction4) => ({
                getProp91(): string {
                    return self.prop91
                }
            }))
        interface IAction5 extends Instance<typeof Action5> {}
    })
})
