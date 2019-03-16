import atomic from "../src/atomic"
import { types, addMiddleware, flow, decorate } from "mobx-state-tree"

const TestModel = types
    .model({
        a: 1,
        b: 1
    })
    .actions(self => {
        addMiddleware(self, atomic)
        return {
            incA(x: number) {
                self.a += x
                this.incB(x)
                return self.a
            },
            incB(x: number) {
                self.b += x
                return self.b
            },
            throwingFn(x: number) {
                this.incA(x)
                throw "Oops"
            },

            incProcessA: flow(function*(x: number) {
                yield Promise.resolve()
                self.a += x
                yield Promise.resolve()
                self.a += x
                yield (self as any).incProcessB(x)
                return self.a
            }),
            incProcessB: flow(function*(x: number) {
                yield Promise.resolve()
                self.b += x
                yield Promise.resolve()
                self.b += x
                return self.a
            }),
            throwingProcess: flow(function*(x: number) {
                yield (self as any).incProcessA(x)
                throw "Oops"
            })
        }
    })

test("should run action normally", () => {
    const m = TestModel.create()
    expect(m.incA(3)).toBe(4)
    expect(m.a).toBe(4)
    expect(m.b).toBe(4)
})

test("should rollback on action failure", () => {
    const m = TestModel.create()
    expect(() => {
        m.throwingFn(3)
    }).toThrow(/Oops/)
    expect(m.a).toBe(1)
    expect(m.b).toBe(1)
})

test("should run async action normally on action failure", async () => {
    const m = TestModel.create()
    const value = await m.incProcessA(3)
    expect(value).toBe(7)
    expect(m.a).toBe(7)
    expect(m.b).toBe(7)
})

test("should rollback on async action failure", async () => {
    const m = TestModel.create()
    try {
        await m.throwingProcess(3)
    } catch (e) {
        expect(e).toBe("Oops")
        expect(m.a).toBe(1)
        expect(m.b).toBe(1)
    }
})

test("decorate atomic should work", () => {
    const T = types
        .model({
            a: 0
        })
        .actions(self => ({
            inc(x: number) {
                self.a += x
            },
            atomicInc: decorate(atomic, (x: number, _throw: boolean) => {
                self.a += x
                ;(self as any).inc(x)
                if (_throw) {
                    throw "Oops"
                }
                return self.a
            }),
            nonAtomicInc(x: number, _throw: boolean) {
                self.a += x
                ;(self as any).inc(x)
                if (_throw) {
                    throw "Oops"
                }
                return self.a
            }
        }))

    const t = T.create()
    expect(t.atomicInc(1, false)).toBe(2)
    expect(t.nonAtomicInc(-1, false)).toBe(0)

    expect(t.a).toBe(0)
    expect(() => t.atomicInc(1, true)).toThrow("Oops")
    expect(t.a).toBe(0)

    expect(() => t.nonAtomicInc(1, true)).toThrow("Oops")
    expect(t.a).toBe(2)
})
