import { types } from "../../src"
import { isObservableProp, isComputedProp } from "mobx"

test("this support", () => {
    const M = types
        .model({ x: 5 })
        .views(self => ({
            get x2() {
                return self.x * 2
            },
            get x4() {
                return this.x2 * 2
            },
            boundTo() {
                return this
            },
            innerBoundTo() {
                return () => this
            },
            isThisObservable() {
                return (
                    isObservableProp(this, "x2") &&
                    isObservableProp(this, "x4") &&
                    isObservableProp(this, "localState") &&
                    isComputedProp(this, "x2")
                )
            }
        }))
        .volatile(self => ({
            localState: 3,
            getLocalState() {
                return this.localState
            },
            getLocalState2() {
                return this.getLocalState() * 2
            }
        }))

        .actions(self => {
            return {
                xBy(by: number) {
                    return self.x * by
                },
                setX(x: number) {
                    self.x = x
                },
                setThisX(x: number) {
                    ;(this as any).x = x // this should not affect self.x
                },
                setXBy(x: number) {
                    this.setX(this.xBy(x))
                },
                setLocalState(x: number) {
                    self.localState = x
                }
            }
        })

    const mi = M.create()

    expect(mi.isThisObservable()).toBe(true)

    expect(mi.boundTo()).toBe(mi)
    expect(mi.innerBoundTo()()).toBe(mi)

    expect(mi.x).toBe(5)

    mi.setX(6)
    expect(mi.x).toBe(6)

    mi.setXBy(2)
    expect(mi.x).toBe(12)
    expect(mi.x2).toBe(12 * 2)
    expect(mi.x4).toBe(12 * 4)
    expect(mi.xBy(2)).toBe(24)

    expect(mi.localState).toBe(3)
    expect(mi.getLocalState()).toBe(3)
    expect(mi.getLocalState2()).toBe(3 * 2)

    mi.setLocalState(6)
    expect(mi.localState).toBe(6)
    expect(mi.getLocalState()).toBe(6)
    expect(mi.getLocalState2()).toBe(6 * 2)

    mi.setLocalState(7)
    expect(mi.localState).toBe(7)

    // make sure attempts to modify this (as long as it is not an action) doesn't affect self
    const oldX = mi.x
    mi.setThisX(oldX + 1)
    expect(mi.x).toBe(oldX)
})
