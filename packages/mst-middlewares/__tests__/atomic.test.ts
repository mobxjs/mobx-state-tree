import atomic from "../src/atomic"
import { types, addMiddleware, flow } from "mobx-state-tree"

function delay(time: number) {
    return new Promise(resolve => {
        setTimeout(resolve, time)
    })
}

const TestModel = types
    .model({
        z: 1
    })
    .actions(self => {
        addMiddleware(self, atomic)
        return {
            inc(x: number) {
                self.z += x
                return self.z
            },
            throwingFn(x: number) {
                self.z += x
                throw "Oops"
            },
            incProcess: flow(function*(x: number) {
                yield delay(2)
                self.z += x
                yield delay(2)
                self.z += x
                return self.z
            }),
            throwingProcess: flow(function*(x: number) {
                yield delay(2)
                self.z += x
                yield delay(2)
                self.z += x
                throw "Oops"
            })
        }
    })

test("should run action normally", () => {
    const m = TestModel.create()
    expect(m.inc(3)).toBe(4)
    expect(m.z).toBe(4)
})

test("should rollback on action failure", () => {
    const m = TestModel.create()
    expect(() => {
        m.throwingFn(3)
    }).toThrow(/Oops/)
    expect(m.z).toBe(1)
})

test("should run async action normally on action failure", async () => {
    const m = TestModel.create()
    const value = await m.incProcess(3)
    expect(value).toBe(7)
    expect(m.z).toBe(7)
})

test("should rollback on async action failure", async () => {
    const m = TestModel.create()
    try {
        await m.throwingProcess(3)
    } catch (e) {
        expect(e).toBe("Oops")
        expect(m.z).toBe(1)
    }
})
