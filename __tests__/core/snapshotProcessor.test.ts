import { observable } from "mobx"
import {
  types,
  getSnapshot,
  unprotect,
  cast,
  detach,
  clone,
  SnapshotIn,
  getNodeId,
  Instance,
  getType,
  onSnapshot
} from "../../src"

describe("snapshotProcessor", () => {
  describe("over a model type", () => {
    const M = types.model({
      x: types.string
    })

    test("no processors", () => {
      const Model = types.model({
        m: types.snapshotProcessor(M, {})
      })
      const model = Model.create({ m: { x: "hi" } })
      unprotect(model)
      expect(model.m.x).toBe("hi")
      expect(getSnapshot(model).m.x).toBe("hi")
      // reconciliation
      model.m = { x: "ho" }
      expect(model.m.x).toBe("ho")
      expect(getSnapshot(model).m.x).toBe("ho")
    })

    test("pre processor", () => {
      const Model = types.model({
        m: types.snapshotProcessor(M, {
          preProcessor(sn: { x: number }) {
            return {
              ...sn,
              x: String(sn.x)
            }
          }
        })
      })
      const model = Model.create({ m: { x: 5 } })
      unprotect(model)
      expect(model.m.x).toBe("5")
      expect(getSnapshot(model).m.x).toBe("5")
      // reconciliation
      model.m = cast({ x: 6 })
      expect(model.m.x).toBe("6")
      expect(getSnapshot(model).m.x).toBe("6")
    })

    test("post processor", () => {
      let model: Instance<typeof Model>
      const Model = types.model({
        m: types.snapshotProcessor(M, {
          postProcessor(sn, node): { x: number; val?: string } {
            expect(node).toBeTruthy()

            return {
              ...sn,
              x: Number(sn.x),
              val: node.x
            }
          }
        })
      })
      model = Model.create({
        m: { x: "5" }
      })
      unprotect(model)
      expect(model.m.x).toBe("5")
      expect(getSnapshot(model).m.x).toBe(5)
      expect(getSnapshot(model).m.val).toBe("5")
      // reconciliation
      model.m = cast({ x: "6" })
      expect(model.m.x).toBe("6")
      expect(getSnapshot(model).m.x).toBe(6)
      expect(getSnapshot(model).m.val).toBe("6")
    })

    test("post processor that observes other observables recomputes when they change", () => {
      let model: Instance<typeof Model>
      const atom = observable.box("foo")

      const Model = types.model({
        m: types.snapshotProcessor(M, {
          postProcessor(sn, node): { x: number; val: string } {
            return {
              ...sn,
              x: Number(sn.x),
              val: atom.get()
            }
          }
        })
      })
      model = Model.create({
        m: { x: "5" }
      })
      const newSnapshot = jest.fn()
      onSnapshot(model, newSnapshot)
      expect(getSnapshot(model).m.val).toBe("foo")
      atom.set("bar")
      expect(getSnapshot(model).m.val).toBe("bar")
      expect(newSnapshot).toHaveBeenCalledTimes(1)
    })

    test("pre and post processor", () => {
      const Model = types.model({
        m: types.snapshotProcessor(M, {
          preProcessor(sn: { x: number }) {
            return {
              ...sn,
              x: String(sn.x)
            }
          },
          postProcessor(sn): { x: number } {
            return {
              ...sn,
              x: Number(sn.x)
            }
          }
        })
      })
      const model = Model.create({
        m: { x: 5 }
      })
      unprotect(model)
      expect(model.m.x).toBe("5")
      expect(getSnapshot(model).m.x).toBe(5)
      // reconciliation
      model.m = cast({ x: 6 })
      expect(model.m.x).toBe("6")
      expect(getSnapshot(model).m.x).toBe(6)
      // cloning
      expect(getSnapshot(clone(model.m)).x).toBe(6)
    })
  })

  describe("over a literal type", () => {
    const M = types.string

    test("no processors", () => {
      const Model = types.model({
        m: types.snapshotProcessor(M, {})
      })
      const model = Model.create({ m: "hi" })
      unprotect(model)
      expect(model.m).toBe("hi")
      expect(getSnapshot(model).m).toBe("hi")
      // reconciliation
      model.m = "ho"
      expect(model.m).toBe("ho")
      expect(getSnapshot(model).m).toBe("ho")
    })

    test("pre processor", () => {
      const Model = types.model({
        m: types.snapshotProcessor(M, {
          preProcessor(sn: number) {
            return String(sn)
          }
        })
      })
      const model = Model.create({ m: 5 })
      unprotect(model)
      expect(model.m).toBe("5")
      expect(getSnapshot(model).m).toBe("5")
      // reconciliation
      model.m = 6 as any
      expect(model.m).toBe("6")
      expect(getSnapshot(model).m).toBe("6")
    })

    test("post processor", () => {
      const Model = types.model({
        m: types.snapshotProcessor(M, {
          postProcessor(sn, node): number {
            expect(node).toMatch(/5|6/)
            return Number(sn)
          }
        })
      })
      const model = Model.create({
        m: "5"
      })
      unprotect(model)
      expect(model.m).toBe("5")
      expect(getSnapshot(model).m).toBe(5)
      // reconciliation
      model.m = "6"
      expect(model.m).toBe("6")
      expect(getSnapshot(model).m).toBe(6)
    })

    test("pre and post processor", () => {
      const Model = types.model({
        m: types.snapshotProcessor(M, {
          preProcessor(sn: number) {
            return String(sn)
          },
          postProcessor(sn): number {
            return Number(sn)
          }
        })
      })
      const model = Model.create({
        m: 5
      })
      unprotect(model)
      expect(model.m).toBe("5")
      expect(getSnapshot(model).m).toBe(5)
      // reconciliation
      model.m = "6"
      expect(model.m).toBe("6")
      expect(getSnapshot(model).m).toBe(6)
      // cloning
      expect(getSnapshot(clone(model)).m).toBe(6)
    })
  })

  describe("over an array type", () => {
    const M = types.array(types.string)

    test("no processors", () => {
      const Model = types.model({
        m: types.snapshotProcessor(M, {})
      })
      const model = Model.create({ m: ["hi"] })
      unprotect(model)
      expect(model.m[0]).toBe("hi")
      expect(getSnapshot(model).m[0]).toBe("hi")
      // reconciliation
      model.m = cast(["ho"])
      expect(model.m[0]).toBe("ho")
      expect(getSnapshot(model).m[0]).toBe("ho")
    })

    test("pre processor", () => {
      const Model = types.model({
        m: types.snapshotProcessor(M, {
          preProcessor(sn: number[]) {
            return sn.map((n) => String(n))
          }
        })
      })
      const model = Model.create({ m: [5] })
      unprotect(model)
      expect(model.m[0]).toBe("5")
      expect(getSnapshot(model).m[0]).toBe("5")
      // reconciliation
      model.m = cast([6])
      expect(model.m[0]).toBe("6")
      expect(getSnapshot(model).m[0]).toBe("6")
    })

    test("post processor", () => {
      const Model = types.model({
        m: types.snapshotProcessor(M, {
          postProcessor(sn, node): number[] {
            expect(node).toBeDefined()
            expect(node.length).toEqual(1)
            return sn.map((n) => Number(n))
          }
        })
      })
      const model = Model.create({
        m: ["5"]
      })
      unprotect(model)
      expect(model.m[0]).toBe("5")
      expect(getSnapshot(model).m[0]).toBe(5)
      // reconciliation
      model.m = cast(["6"])
      expect(model.m[0]).toBe("6")
      expect(getSnapshot(model).m[0]).toBe(6)
    })

    test("pre and post processor", () => {
      const Model = types.model({
        m: types.snapshotProcessor(M, {
          preProcessor(sn: number[]) {
            return sn.map((n) => String(n))
          },
          postProcessor(sn): number[] {
            return sn.map((n) => Number(n))
          }
        })
      })
      const model = Model.create({
        m: [5]
      })
      unprotect(model)
      expect(model.m[0]).toBe("5")
      expect(getSnapshot(model).m[0]).toBe(5)
      // reconciliation
      model.m = cast([6])
      expect(model.m[0]).toBe("6")
      expect(getSnapshot(model).m[0]).toBe(6)
      // cloning
      expect(getSnapshot(clone(model.m))[0]).toBe(6)
    })
  })

  describe("over a map type", () => {
    const M = types.map(types.string)

    test("no processors", () => {
      const Model = types.model({
        m: types.snapshotProcessor(M, {})
      })
      const model = Model.create({ m: { x: "hi" } })
      unprotect(model)
      expect(model.m.get("x")).toBe("hi")
      expect(getSnapshot(model).m.x).toBe("hi")
      // reconciliation
      model.m.set("x", "ho")
      expect(model.m.get("x")).toBe("ho")
      expect(getSnapshot(model).m.x).toBe("ho")
    })

    test("pre processor", () => {
      const Model = types.model({
        m: types.snapshotProcessor(M, {
          preProcessor(sn: { x: number }) {
            return {
              ...sn,
              x: String(sn.x)
            }
          }
        })
      })
      const model = Model.create({ m: { x: 5 } })
      unprotect(model)
      expect(model.m.get("x")).toBe("5")
      expect(getSnapshot(model).m.x).toBe("5")
      // reconciliation
      model.m = cast({ x: 6 })
      expect(model.m.get("x")).toBe("6")
      expect(getSnapshot(model).m.x).toBe("6")
    })

    test("post processor", () => {
      const Model = types.model({
        m: types.snapshotProcessor(M, {
          postProcessor(sn, node): { x: number } {
            expect(node.size).toBe(1)

            return {
              ...sn,
              x: Number(sn.x)
            }
          }
        })
      })
      const model = Model.create({
        m: { x: "5" }
      })
      unprotect(model)
      expect(model.m.get("x")).toBe("5")
      expect(getSnapshot(model).m.x).toBe(5)
      // reconciliation
      model.m = cast({ x: "6" })
      expect(model.m.get("x")).toBe("6")
      expect(getSnapshot(model).m.x).toBe(6)
    })

    test("pre and post processor", () => {
      const Model = types.model({
        m: types.snapshotProcessor(M, {
          preProcessor(sn: { x: number }) {
            return {
              ...sn,
              x: String(sn.x)
            }
          },
          postProcessor(sn): { x: number } {
            return {
              ...sn,
              x: Number(sn.x)
            }
          }
        })
      })
      const model = Model.create({
        m: { x: 5 }
      })
      unprotect(model)
      expect(model.m.get("x")).toBe("5")
      expect(getSnapshot(model).m.x).toBe(5)
      // reconciliation
      model.m = cast({ x: 6 })
      expect(model.m.get("x")).toBe("6")
      expect(getSnapshot(model).m.x).toBe(6)
      // cloning
      expect(getSnapshot(clone(model.m)).x).toBe(6)
    })
  })

  test("chained transforms", () => {
    const TL = types.snapshotProcessor(types.string, {
      preProcessor(sn: string) {
        return sn.trimLeft()
      },
      postProcessor(sn): string {
        return "_" + sn
      }
    })
    const TB = types.snapshotProcessor(TL, {
      preProcessor(sn: string) {
        return sn.trimRight()
      },
      postProcessor(sn): string {
        return sn + "_"
      }
    })
    const M = types.model({
      name: TB
    })

    const t = TB.create(" hello ")
    expect(t).toBe("hello")

    const m = M.create({
      name: " hello "
    })
    expect(m.name).toBe("hello")
    expect(getSnapshot(m).name).toBe("_hello_")
  })

  describe("moving nodes around with a pre-processor", () => {
    const Task = types.model("Task", { x: types.number })
    const Store = types.model({
      a: types.array(
        types.snapshotProcessor(
          Task,
          {
            preProcessor(sn: { x: string }) {
              return {
                x: Number(sn.x)
              }
            }
          },
          "PTask"
        )
      ),
      b: types.array(Task)
    })

    test("moving from a to b", () => {
      const s = Store.create({
        a: [{ x: "1" }]
      })
      unprotect(s)
      const n = s.a[0]
      detach(n)
      expect(s.a.length).toBe(0)
      expect(getSnapshot(n)).toEqual({ x: 1 })

      s.b.push(n)
      expect(s.b.length).toBe(1)
      expect(getSnapshot(s.b)).toEqual([{ x: 1 }])
    })

    test("moving from b to a", () => {
      const s = Store.create({
        b: [{ x: 1 }]
      })
      unprotect(s)
      const n = s.b[0]
      detach(n)
      expect(s.b.length).toBe(0)
      expect(getSnapshot(n)).toEqual({ x: 1 })

      s.a.push(n)
      expect(s.a.length).toBe(1)
      expect(getSnapshot(s.a)).toEqual([{ x: 1 }])
    })
  })

  describe("moving nodes around with a post-processor", () => {
    const Task = types.model({ x: types.number })
    const Store = types.model({
      a: types.array(
        types.snapshotProcessor(Task, {
          postProcessor(sn): { x: string } {
            return {
              x: String(sn.x)
            }
          }
        })
      ),
      b: types.array(Task)
    })

    test("moving from a to b", () => {
      const s = Store.create({
        a: [{ x: 1 }]
      })
      unprotect(s)
      const n = s.a[0]
      detach(n)
      expect(s.a.length).toBe(0)
      expect(getSnapshot(n)).toEqual({ x: "1" })

      s.b.push(n)
      expect(s.b.length).toBe(1)
      expect(getSnapshot(s.b)).toEqual([{ x: "1" }])
    })

    test("moving from b to a", () => {
      const s = Store.create({
        b: [{ x: 1 }]
      })
      unprotect(s)
      const n = s.b[0]
      detach(n)
      expect(s.b.length).toBe(0)
      expect(getSnapshot(n)).toEqual({ x: 1 })

      s.a.push(n)
      expect(s.a.length).toBe(1)
      expect(getSnapshot(s.a)).toEqual([{ x: "1" }])
    })
  })

  describe("assigning instances works", () => {
    const Todo = types.model("Todo", {
      id: types.identifier
    })

    const TodoWithProcessor = types.snapshotProcessor(Todo, {
      preProcessor(snapshot: { id: string }) {
        return snapshot
      }
    })

    const Store = types
      .model("TodoStore", {
        todos: types.map(TodoWithProcessor),
        instance: types.optional(TodoWithProcessor, { id: "new" })
      })
      .actions((self) => ({
        addTodo(todo: { id: string }) {
          self.todos.put(todo)
        },
        setInstance(next: { id: string }) {
          self.instance = next
        }
      }))

    test("using instances in maps work", () => {
      const store = Store.create()
      const todo = TodoWithProcessor.create({ id: "map" })

      store.addTodo(todo)

      expect(store.todos.size).toBe(1)
      expect(getSnapshot(store.todos)).toEqual({ map: { id: "map" } })
    })

    test("using instances as values works", () => {
      const store = Store.create()
      const todo = TodoWithProcessor.create({ id: "map" })

      store.setInstance(todo)

      expect(store.instance).toBe(todo)
    })

    test("using the non processed type in place of the processed one works", () => {
      const store = Store.create()
      const todo = Todo.create({ id: "map" })

      store.setInstance(todo)

      expect(store.instance).toBe(todo)
    })

    test("using the processed type in place of the non processed one works", () => {
      const store = types
        .model("Store", { instance: Todo })
        .actions((self) => ({
          setInstance(next: { id: string }) {
            self.instance = next
          }
        }))
        .create({ instance: { id: "new" } })

      const todo = TodoWithProcessor.create({ id: "map" })

      store.setInstance(todo)

      expect(store.instance).toBe(todo)
    })
  })

  test("cached initial snapshots are ok", () => {
    const M2 = types.snapshotProcessor(types.model({ x: types.number }), {
      preProcessor(sn: { x: number }) {
        return { ...sn, x: 0 }
      }
    })
    const M1 = types.model({ m2: M2 })
    const M = types.model({ m1: M1 })

    const m = M.create({ m1: { m2: { x: 10 } } })
    expect(getSnapshot(m)).toEqual({
      m1: { m2: { x: 0 } }
    })
  })

  test("works with IType.is", () => {
    const Model = types.model({ x: types.number })
    const model = Model.create({ x: 1 })
    expect(Model.is(model)).toBe(true)
    expect(Model.is({ x: 1 })).toBe(true)

    const ProcessedModel = types.snapshotProcessor(Model, {
      preProcessor(sn: { y: number }) {
        const copy = { ...sn, x: sn.y }
        // @ts-ignore
        delete copy.y
        return copy
      },
      postProcessor(sn: { x: number }) {
        const copy = { ...sn, y: sn.x }
        // @ts-ignore
        delete copy.x
        return copy
      }
    })

    const processedModel = ProcessedModel.create({ y: 1 })
    expect(ProcessedModel.is(processedModel)).toBe(true)
    expect(ProcessedModel.is({ y: 1 })).toBe(true)
    expect(ProcessedModel.is(Model)).toBe(false)
  })

  describe("1776 - reconciliation in an array", () => {
    test("model with transformed property is reconciled", () => {
      const SP = types.snapshotProcessor(
        types.model({
          id: types.identifier,
          x: types.number
        }),
        {
          preProcessor(sn: { id: string; y: number }) {
            if ("x" in sn) {
              // Ensure snapshot don't run through preprocessor twice
              throw new Error("sn has already been preprocessed")
            }
            return { id: sn.id, x: sn.y }
          }
        }
      )
      const Store = types.model({ items: types.array(SP) }).actions((self) => ({
        setItems(items: SnapshotIn<typeof SP>[]) {
          self.items = cast(items)
        }
      }))
      const store = Store.create({ items: [{ id: "1", y: 0 }] })
      const oldNodeId = getNodeId(store.items[0])
      store.setItems([{ id: "1", y: 1 }])
      expect(getNodeId(store.items[0])).toBe(oldNodeId)
    })

    test("model with transformed identifier attribute is reconciled", () => {
      const SP = types.snapshotProcessor(
        types.model({
          id: types.identifier
        }),
        {
          preProcessor(sn: { foo: string }) {
            return { id: sn.foo }
          }
        }
      )
      const Store = types.model({ items: types.array(SP) }).actions((self) => ({
        setItems(items: SnapshotIn<typeof SP>[]) {
          self.items = cast(items)
        }
      }))
      const store = Store.create({ items: [{ foo: "1" }] })
      const oldNodeId = getNodeId(store.items[0])
      store.setItems([{ foo: "1" }])
      expect(getNodeId(store.items[0])).toBe(oldNodeId)
    })
  })

  describe("single node reconcilication", () => {
    test("model with transformed property is reconciled", () => {
      const SP = types.snapshotProcessor(
        types.model({
          id: types.identifier,
          x: types.number
        }),
        {
          preProcessor(sn: { id: string; y: number }) {
            if ("x" in sn) {
              // Ensure snapshot don't run through preprocessor twice
              throw new Error("sn has already been preprocessed")
            }
            return { id: sn.id, x: sn.y }
          }
        }
      )
      const Store = types.model({ item: SP }).actions((self) => ({
        setItem(item: SnapshotIn<typeof SP>) {
          self.item = cast(item)
        }
      }))
      const store = Store.create({ item: { id: "1", y: 0 } })
      const oldNodeId = getNodeId(store.item)
      store.setItem({ id: "1", y: 1 })
      expect(getNodeId(store.item)).toBe(oldNodeId)
      expect(store.item.x).toBe(1)
    })

    test("model with transformed identifier property is reconciled", () => {
      const SP = types.snapshotProcessor(
        types.model({
          id: types.identifier
        }),
        {
          preProcessor(sn: { foo: string }) {
            return { id: sn.foo }
          }
        }
      )
      const Store = types.model({ item: SP }).actions((self) => ({
        setItem(item: SnapshotIn<typeof SP>) {
          self.item = cast(item)
        }
      }))
      const store = Store.create({ item: { foo: "1" } })
      const oldNodeId = getNodeId(store.item)
      store.setItem({ foo: "1" })
      expect(getNodeId(store.item)).toBe(oldNodeId)
      expect(store.item.id).toBe("1")
    })

    test("1791 - model wrapped with maybe is reconciled", () => {
      const SP = types.snapshotProcessor(
        types.model({
          id: types.identifier,
          x: types.number
        }),
        {
          preProcessor(sn: { id: string; y: number }) {
            return { id: sn.id, x: sn.y }
          }
        }
      )
      const Store = types.model({ item: types.maybe(SP) }).actions((self) => ({
        setItem(item: SnapshotIn<typeof SP>) {
          self.item = cast(item)
        }
      }))
      const store = Store.create({ item: { id: "1", y: 0 } })
      const oldNodeId = getNodeId(store.item!)
      store.setItem({ id: "1", y: 1 })
      expect(getNodeId(store.item!)).toBe(oldNodeId)
      expect(store.item?.x).toBe(1)
    })

    test("model wrapped with optional is reconciled", () => {
      const SP = types.snapshotProcessor(
        types.model({
          id: types.identifier,
          x: types.number
        }),
        {
          preProcessor(sn: { id: string; y: number }) {
            return { id: sn.id, x: sn.y }
          }
        }
      )
      const Store = types
        .model({ item: types.optional(SP, { id: "1", y: 0 }) })
        .actions((self) => ({
          setItem(item?: SnapshotIn<typeof SP>) {
            self.item = cast(item)
          }
        }))
      const store = Store.create()
      const oldNodeId = getNodeId(store.item!)
      expect(store.item?.x).toBe(0)
      store.setItem({ id: "1", y: 1 })
      expect(getNodeId(store.item!)).toBe(oldNodeId)
      expect(store.item?.x).toBe(1)
      store.setItem(undefined)
      expect(getNodeId(store.item!)).toBe(oldNodeId)
      expect(store.item?.x).toBe(0)
    })
  })

  test("1777 - preProcessor wrapped in maybe accepts undefined", () => {
    const SP = types.snapshotProcessor(
      types.model({
        id: types.identifier,
        x: types.number
      }),
      {
        preProcessor(sn: { id: string; y: number }) {
          return { id: sn.id, x: sn.y }
        }
      }
    )
    const Store = types.model({ item: types.maybe(SP) }).actions((self) => ({
      setItem(item?: SnapshotIn<typeof SP>) {
        self.item = cast(item)
      }
    }))
    const store = Store.create()
    expect(store.item).toBeUndefined()
    store.setItem({ id: "1", y: 1 })
    expect(store.item?.x).toBe(1)
    store.setItem(undefined)
    expect(store.item).toBeUndefined()
  })

  test("1849 - Wrapped unions don't cause infinite recursion", () => {
    const Store = types
      .model({
        prop: types.optional(
          types.snapshotProcessor(types.union(types.literal("a"), types.literal("b")), {}),
          "a"
        )
      })
      .actions((self) => ({
        setProp(prop: typeof self.prop) {
          self.prop = prop
        }
      }))

    const store = Store.create()
    expect(store.prop).toBe("a")
    expect(() => store.setProp("b")).not.toThrow()
    expect(store.prop).toBe("b")
  })

  if (process.env.NODE_ENV !== "production") {
    test("it should fail if given incorrect processor", () => {
      expect(() => {
        types.model({
          m: types.snapshotProcessor(types.number, {
            postProcessor: {} as any
          })
        })
      }).toThrowError("[mobx-state-tree] postSnapshotProcessor must be a function")
    })
  }
})
