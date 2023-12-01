import { t } from "../../src/index"
import { Hook, ObjectNode, onPatch, unprotect } from "../../src/internal"

const warnMock = jest.fn()
jest.spyOn(console, "warn").mockImplementation(warnMock)

const TestModel = t.model("TestModel", {
  title: t.string
})
const TestArray = t.array(TestModel)
const TestMap = t.map(TestModel)
const Parent = t.model("Parent", {
  child: t.maybe(TestModel)
})
const TestModelWithIdentifier = t.model("TestModelWithIdentifier", {
  id: t.identifier,
  title: t.string
})

/**
 * These tests were added to help understand the ObjectNode class and how it interacts internally in MST.
 * As such, they test internals of the library that aren't intended to be used by consumers. That means:
 *
 * 1. Please do not use these examples in application-level code with MST, these are not necessarily best practices, and are definitely not intended as a public API
 * 2. These tests may not test every single case, but they cover scenarios I was interested in understanding.
 * 3. Since the tests are tightly coupled to implementation, this test suite may end up being noisy.
 *
 * If you are making a change to MST and get failures here, please consider that as a yellow flag, not a red flag.
 * Feel free to make changes you need to, or even skip tests if they're a nuisance.
 */
describe("ObjectNode", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  describe("constructor", () => {
    // Since ObjectNode is not exported as part of the MST API, we don't have tests for invalid parameters, but we expect an error in this scenario.
    it("throws if type is not a complex type", () => {
      expect(() => new ObjectNode(t.string as any, null, "", {}, "foo")).toThrow(
        "complexType.initializeChildNodes is not a function"
      )
    })
    it("works with a complex type", () => {
      const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
      expect(node).toBeDefined()
    })
  })
  describe("methods", () => {
    describe("aboutToDie", () => {
      describe("if the observable node is unitialized", () => {
        it("does not call the onAboutToDie hook", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          const hook = jest.fn()
          node.registerHook(Hook.beforeDestroy, hook)
          node.aboutToDie()
          expect(hook).not.toBeCalled()
        })
      })
      describe("if the observable node is initialized", () => {
        it("calls the onAboutToDie hook", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          const hook = jest.fn()
          node.registerHook(Hook.beforeDestroy, hook)
          node.createObservableInstance() // createObservableInstance calls finalizeCreation internally, and marks the observable node as being created.
          node.aboutToDie()
          expect(hook).toBeCalled()
        })
      })
    })
    describe("addDisposer", () => {
      it("adds a disposer to the node", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        const disposer = jest.fn()
        node.addDisposer(disposer)
        node.createObservableInstance()
        expect(node.hasDisposer(disposer)).toBe(true)
      })
    })
    describe("addMiddleWare", () => {
      it("adds a middleware to the node", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        const middleware = jest.fn((call, next) => {
          next(call)
        })
        node.addMiddleWare(middleware)
        node.createObservableInstance()
        node.applySnapshot({ title: "hello" } as any)
        expect(middleware).toBeCalled()
      })
    })
    describe("applyPatchLocally", () => {
      describe("when the node is protected", () => {
        it("throws an error", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          expect(() =>
            node.applyPatchLocally("", {
              op: "replace",
              path: "",
              value: { title: "hello" }
            })
          ).toThrow(
            "[mobx-state-tree] Cannot modify 'TestModel@<root>', the object is protected and can only be modified by using an action."
          )
        })
      })
      describe("when the node is not alive", () => {
        it("warns by default", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          unprotect(node.root.value) // In order to call applyPatchLocally, the node must be unprotected
          node.die()
          node.applyPatchLocally("", {
            op: "replace",
            path: "",
            value: { title: "hello" }
          })

          expect(console.warn).toBeCalled()
        })
      })
      describe("when the node is alive and not protected", () => {
        describe("for models", () => {
          it("does not allow remove", () => {
            const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
            unprotect(node.root.value) // In order to call applyPatchLocally, the node must be unprotected
            expect(() => {
              node.applyPatchLocally("", {
                op: "remove",
                path: ""
              })
            }).toThrow("[mobx-state-tree] object does not support operation remove")
          })
          it("allows add", () => {
            const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
            unprotect(node.root.value) // In order to call applyPatchLocally, the node must be unprotected
            node.applyPatchLocally("title", {
              op: "add",
              path: "",
              value: "world"
            })

            // @ts-ignore
            expect(node.storedValue.title).toBe("world")
          })
          it("allows replace", () => {
            const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
            unprotect(node.root.value) // In order to call applyPatchLocally, the node must be unprotected
            node.applyPatchLocally("title", {
              op: "replace",
              path: "",
              value: "world"
            })

            // @ts-ignore
            expect(node.storedValue.title).toBe("world")
          })
        })
        describe("for arrays", () => {
          it("works for replace", () => {
            const node = new ObjectNode(TestArray as any, null, "", {}, [{ title: "hello" }])
            unprotect(node.root.value) // In order to call applyPatchLocally, the node must be unprotected
            node.applyPatchLocally("0", {
              op: "replace",
              path: "",
              value: { title: "world" }
            })

            // @ts-ignore
            expect(node.storedValue[0].title).toBe("world")
          })
          it("works for add", () => {
            const node = new ObjectNode(TestArray as any, null, "", {}, [{ title: "hello" }])
            unprotect(node.root.value) // In order to call applyPatchLocally, the node must be unprotected
            node.applyPatchLocally("1", {
              op: "add",
              path: "",
              value: { title: "world" }
            })

            // @ts-ignore
            expect(node.storedValue.length).toBe(2)
            // @ts-ignore
            expect(node.storedValue[1].title).toBe("world")
          })
          it("works for remove", () => {
            const node = new ObjectNode(TestArray as any, null, "", {}, [{ title: "hello" }])
            unprotect(node.root.value) // In order to call applyPatchLocally, the node must be unprotected
            node.applyPatchLocally("0", {
              op: "remove",
              path: ""
            })

            // @ts-ignore
            expect(node.storedValue.length).toBe(0)
          })
        })
        describe("for maps", () => {
          it("works for add", () => {
            const node = new ObjectNode(TestMap as any, null, "", {}, { hello: { title: "hello" } })
            unprotect(node.root.value) // In order to call applyPatchLocally, the node must be unprotected
            node.applyPatchLocally("world", {
              op: "add",
              path: "",
              value: { title: "world" }
            })

            // @ts-ignore
            expect(node.storedValue.get("world").title).toBe("world")
          })
          it("works for replace", () => {
            const node = new ObjectNode(TestMap as any, null, "", {}, { hello: { title: "hello" } })
            unprotect(node.root.value) // In order to call applyPatchLocally, the node must be unprotected
            node.applyPatchLocally("hello", {
              op: "replace",
              path: "",
              value: { title: "world" }
            })

            // @ts-ignore
            expect(node.storedValue.get("hello").title).toBe("world")
          })
          it("works for remove", () => {
            const node = new ObjectNode(TestMap as any, null, "", {}, { hello: { title: "hello" } })
            unprotect(node.root.value) // In order to call applyPatchLocally, the node must be unprotected
            node.applyPatchLocally("hello", {
              op: "remove",
              path: ""
            })

            // @ts-ignore
            expect(node.storedValue.size).toBe(0)
          })
        })
      })
    })
    describe("applyPatches", () => {
      describe("when the path is not specified", () => {
        it("applies the value as a snapshot", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          // Notice we're saying to "remove" the value, but using just a snapshot. This will just apply a snapshot based on how applyPatches runs.
          // @ts-ignore
          node.applyPatches([{ op: "remove", value: { title: "world" } }])

          // @ts-ignore
          expect(node.storedValue.title).toBe("world")
        })
      })
      describe("with correct paths", () => {
        it("applies the patch", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          node.applyPatches([{ op: "replace", path: "/title", value: "world" }])

          // @ts-ignore
          expect(node.storedValue.title).toBe("world")
        })
      })
    })
    describe("applySnapshot", () => {
      it("works", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        node.applySnapshot({ title: "world" })
        // @ts-ignore
        expect(node.storedValue.title).toBe("world")
      })
    })
    describe("assertAlive", () => {
      describe("when the node is alive", () => {
        it("does not warn", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          node.assertAlive({})
          expect(console.warn).not.toBeCalled()
        })
      })
      describe("when the node is not alive", () => {
        it("warns about liveliness", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          node.die()
          node.assertAlive({})
          // @ts-ignore
          const receivedErrorMessage = console.warn.mock.calls[0][0].toString()
          expect(receivedErrorMessage).toBe(
            "Error: [mobx-state-tree] You are trying to read or write to an object that is no longer part of a state tree. (Object type: 'TestModel', Path upon death: '', Subpath: '', Action: ''). Either detach nodes first, or don't use objects after removing / replacing them in the tree."
          )
        })
      })
    })
    describe("assertWritable", () => {
      describe("when the node is not alive", () => {
        it("throws an error", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          node.die()
          expect(() => node.assertWritable({})).toThrow(
            "[mobx-state-tree] Cannot modify 'TestModel@<root> [dead]', the object is protected and can only be modified by using an action."
          )
        })
      })
      describe("when the node is alive and protected", () => {
        it("throws an error", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          // Nodes are protected by default
          expect(() => node.assertWritable({})).toThrow(
            "[mobx-state-tree] Cannot modify 'TestModel@<root>', the object is protected and can only be modified by using an action."
          )
        })
      })
      describe("when the node is alive and not protected", () => {
        it("does not throw an error", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          unprotect(node.root.value)
          expect(() => node.assertWritable({})).not.toThrow()
        })
      })
    })
    describe("clearParent", () => {
      it("removes the parent from a node", () => {
        const parent = Parent.create({ child: { title: "hello" } })
        const child = parent.child
        expect(child).toBeDefined()
        // We can't directly modify the tree without unprotecting it first
        unprotect(parent)
        // The object node is made available through the $treenode property
        child!.$treenode.clearParent()
        expect(parent.child).toBeUndefined()
      })
    })
    describe("createObservableInstance", () => {
      describe("when the node is still initializing", () => {
        it("works", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          expect(node.storedValue).toBeUndefined()
          expect(node.state).toBe(0)
          node.createObservableInstance()
          expect(node.storedValue).toBeDefined()
          expect(node.state).toBe(2)
        })
      })
      if (process.env.NODE_ENV !== "production") {
        describe("when the node has been initialized", () => {
          it("does not work", () => {
            const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
            node.createObservableInstance()
            expect(() => node.createObservableInstance()).toThrow(
              "[mobx-state-tree] assertion failed: the creation of the observable instance must be done on the initializing phase"
            )
          })
        })
      }
      if (process.env.NODE_ENV !== "production") {
        describe("if the node is dead", () => {
          it("does not work", () => {
            const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
            node.die()
            expect(() => node.createObservableInstance()).toThrow(
              "[mobx-state-tree] assertion failed: the creation of the observable instance must be done on the initializing phase"
            )
          })
        })
      }
    })
    describe("createObservableInstanceIfNeeded", () => {
      describe("when the node is still initializing", () => {
        it("works", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          expect(node.storedValue).toBeUndefined()
          expect(node.state).toBe(0)
          node.createObservableInstanceIfNeeded()
          expect(node.storedValue).toBeDefined()
          expect(node.state).toBe(2)
        })
      })
      describe("when the node has been initialized", () => {
        it("does not throw, but an observable instance should be available", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          node.createObservableInstanceIfNeeded()
          expect(() => node.createObservableInstanceIfNeeded()).not.toThrow()
          expect(node.storedValue).toBeDefined()
          expect(node.state).toBe(2)
        })
      })
      if (process.env.NODE_ENV !== "production") {
        describe("if the node is dead", () => {
          it("does not work", () => {
            const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
            node.die()
            expect(() => node.createObservableInstance()).toThrow(
              "[mobx-state-tree] assertion failed: the creation of the observable instance must be done on the initializing phase"
            )
          })
        })
      }
    })
    describe("detach", () => {
      describe("when the node is not alive", () => {
        it("does throws an error", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          node.die()
          expect(() => node.detach()).toThrow("Error while detaching, node is not alive.")
        })
      })
      describe("when the node is alive and does not have a parent", () => {
        it("does not throw an error", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          expect(() => node.detach()).not.toThrow()
        })
      })
      describe("when the node is alive and has a parent", () => {
        it("detaches the node from the parent", () => {
          const parent = Parent.create({ child: { title: "hello" } })
          const child = parent.child
          expect(child).toBeDefined()
          // We can't directly modify the tree without unprotecting it first
          unprotect(parent)
          // The object node is made available through the $treenode property
          child!.$treenode.detach()
          expect(parent.child).toBeUndefined()
        })
      })
    })
    describe("die", () => {
      describe("if the node is already dead", () => {
        it("does nothing", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          node.die()
          expect(() => node.die()).not.toThrow()
        })
      })
      describe("if the node is detaching", () => {
        it("does nothing", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          node.detach()
          expect(() => node.die()).not.toThrow()
        })
      })
      describe("if the node is unititalized", () => {
        it("does not call the onAboutToDie hooks", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          const hook = jest.fn()
          node.registerHook(Hook.beforeDestroy, hook)
          node.die()
          expect(hook).not.toBeCalled()
        })
      })
      describe("if the die method gets past lifecycle checks", () => {
        it('calls the "aboutToDie" hook', () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          const hook = jest.fn()
          node.registerHook(Hook.beforeDestroy, hook)
          node.createObservableInstance()
          node.die()
          expect(hook).toBeCalled()
        })
        it("finalizes the death of its children", () => {
          const parent = Parent.create({ child: { title: "hello" } })
          const child = parent.child
          expect(child).toBeDefined()
          // We can't directly modify the tree without unprotecting it first
          unprotect(parent)
          // The object node is made available through the $treenode property
          parent.$treenode.die()
          expect(child!.$treenode.state).toBe(4)
        })
        it("notifies the identifier cache that it has died", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          const identifierCache = node.root.identifierCache
          const identifierCacheNotifySpy = identifierCache
            ? jest.spyOn(identifierCache, "notifyDied")
            : jest.fn()
          node.createObservableInstance()
          node.die()
          expect(identifierCacheNotifySpy).toBeCalledWith(node)
        })
        it("stores the snapshot upon death", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          node.createObservableInstance()
          node.die()
          expect(node.snapshot).toEqual({ title: "hello" })
        })
        it("sets the subpath upon death", () => {
          const parent = Parent.create({ child: { title: "hello" } })
          const child = parent.child
          expect(child).toBeDefined()
          // We can't directly modify the tree without unprotecting it first
          unprotect(parent)
          // The object node is made available through the $treenode property
          parent.$treenode.die()
          expect(child!.$treenode.subpathUponDeath).toBe("child")
        })
        it("sets the path upon death", () => {
          const parent = Parent.create({ child: { title: "hello" } })
          const child = parent.child
          expect(child).toBeDefined()
          // We can't directly modify the tree without unprotecting it first
          unprotect(parent)
          // The object node is made available through the $treenode property
          parent.$treenode.die()
          expect(child!.$treenode.pathUponDeath).toBe("/child")
        })
        it("sets its parent to null", () => {
          const parent = Parent.create({ child: { title: "hello" } })
          const child = parent.child
          expect(child).toBeDefined()
          // We can't directly modify the tree without unprotecting it first
          unprotect(parent)
          // The object node is made available through the $treenode property
          parent.$treenode.die()
          expect(child!.$treenode.parent).toBeNull()
        })
        it("sets the state to dead", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          node.createObservableInstance()
          node.die()
          expect(node.state).toBe(4)
        })
      })
    })
    describe("emitPatch", () => {
      it("emits the patch and a reverse patch", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        node.createObservableInstance()
        const patchMock = jest.fn()
        onPatch(node.storedValue, patchMock)
        node.emitPatch(
          {
            op: "replace",
            path: "title",
            value: "world",
            oldValue: "hello"
          },
          node
        )

        expect(patchMock).toBeCalledWith(
          {
            op: "replace",
            path: "/title",
            value: "world"
          },
          {
            op: "replace",
            path: "/title",
            value: "hello"
          }
        )
      })
      it("emits the patch and a reverse patch through its parent", () => {
        const parent = Parent.create({ child: { title: "hello" } })
        const patchMock = jest.fn()
        onPatch(parent, patchMock)
        parent.child!.$treenode.emitPatch(
          {
            op: "replace",
            path: "title",
            value: "world",
            oldValue: "hello"
          },
          parent.child!.$treenode
        )

        expect(patchMock).toBeCalledWith(
          {
            op: "replace",
            path: "/child/title",
            value: "world"
          },
          {
            op: "replace",
            path: "/child/title",
            value: "hello"
          }
        )
      })
    })
    describe("finalizeCreation", () => {
      if (process.env.NODE_ENV !== "production") {
        describe("if the node is not alive", () => {
          it("fails", () => {
            const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
            node.die()
            expect(() => node.finalizeCreation()).toThrow(
              "assertion failed: cannot finalize the creation of a node that is already dead"
            )
          })
        })
      }
      describe("when a node has no parent", () => {
        it("calls the afterCreationFinalization hook", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          const hook = jest.fn()
          node.registerHook(Hook.afterCreationFinalization, hook)
          node.state = 1 // Force the state to CREATED so we don't bail out in the isAlive check as per the prior test
          node.finalizeCreation()
          expect(hook).toBeCalled()
        })
        it('sets the state to "FINALIZED"', () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          node.state = 1 // Force the state to CREATED so we don't bail out in the isAlive check as per the prior test
          node.finalizeCreation()
          expect(node.state).toBe(2)
        })
      })
      describe("when the node has a parent", () => {
        describe("but the parent is not yet finalized", () => {
          it("does not call the afterAttach hook", () => {
            const parent = new ObjectNode(Parent as any, null, "", {}, {})
            const child = new ObjectNode(TestModel as any, parent, "", {}, { title: "hello" })
            const hook = jest.fn()
            child.registerHook(Hook.afterCreationFinalization, hook)
            child.setParent(parent, "child")
            child.state = 1 // Force the state to CREATED in the child so we don't bail out in the isAlive check as per the prior test
            child.finalizeCreation()
            expect(hook).not.toBeCalled()
          })
          it('does not set the state to "FINALIZED"', () => {
            const parent = new ObjectNode(Parent as any, null, "", {}, {})
            const child = new ObjectNode(TestModel as any, parent, "", {}, { title: "hello" })
            child.setParent(parent, "child")
            child.state = 1 // Force the state to CREATED in the child so we don't bail out in the isAlive check as per the prior test
            child.finalizeCreation()
            expect(child.state).toBe(1)
          })
        })
        describe("and the parent is finalized", () => {
          it("calls the afterAttach hook", () => {
            const parent = new ObjectNode(Parent as any, null, "", {}, {})
            const child = new ObjectNode(TestModel as any, parent, "", {}, { title: "hello" })
            const hook = jest.fn()
            child.registerHook(Hook.afterCreationFinalization, hook)
            child.setParent(parent, "child")
            child.state = 1 // Force the state to CREATED in the child so we don't bail out in the isAlive check as per the prior test
            parent.state = 2 // Force the state to FINALIZED so we don't bail out during the baseFinalizeCreation on child
            child.finalizeCreation()
            expect(hook).toBeCalled()
          })
          it('sets the state to "FINALIZED"', () => {
            const parent = new ObjectNode(Parent as any, null, "", {}, {})
            const child = new ObjectNode(TestModel as any, parent, "", {}, { title: "hello" })
            child.setParent(parent, "child")
            child.state = 1 // Force the state to CREATED in the child so we don't bail out in the isAlive check as per the prior test
            parent.state = 2 // Force the state to FINALIZED so we don't bail out during the baseFinalizeCreation on child
            child.finalizeCreation()
            expect(child.state).toBe(2)
          })
        })
      })
      describe("when the node has children", () => {
        it("fires the finalizeCreation hook on the parent", () => {
          const env = {}
          const child = new ObjectNode(TestModel as any, null, "", env, { title: "hello" })
          const parent = new ObjectNode(Parent as any, null, "", env, { child: child.storedValue })
          child.setParent(parent, "child")
          const hook = jest.fn()
          parent.registerHook(Hook.afterCreationFinalization, hook)
          child.state = 1
          expect(hook).not.toBeCalled()
          parent.state = 1 // Force the state to CREATED so we don't bail out in the isAlive check as per the prior test
          parent.finalizeCreation()
          expect(hook).toBeCalled()
        })
        it("fires the afterAttach hook on the child", () => {
          const env = {}
          const child = new ObjectNode(TestModel as any, null, "", env, { title: "hello" })
          const parent = new ObjectNode(Parent as any, null, "", env, { child: child.storedValue })
          child.setParent(parent, "child")
          const c = parent.getChildNode("child")
          const hook = jest.fn()
          c.registerHook(Hook.afterAttach, hook)
          c.state = 1
          expect(hook).not.toBeCalled()
          parent.state = 1 // Force the state to CREATED so we don't bail out in the isAlive check as per the prior test
          parent.finalizeCreation()
          expect(hook).toBeCalled()
        })
        it("sets both child and parent states to finalized", () => {
          const env = {}
          const child = new ObjectNode(TestModel as any, null, "", env, { title: "hello" })
          const parent = new ObjectNode(Parent as any, null, "", env, { child: child.storedValue })
          child.setParent(parent, "child")
          const c = parent.getChildNode("child")
          c.state = 1
          parent.state = 1 // Force the state to CREATED so we don't bail out in the isAlive check as per the prior test
          parent.finalizeCreation()
          expect(c.state).toBe(2)
          expect(parent.state).toBe(2)
        })
      })
    })
    describe("finalizeDeath", () => {
      it("does everything die() does without calling aboutToDie()", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        const hook = jest.fn()
        node.registerHook(Hook.beforeDestroy, hook)
        node.createObservableInstance()
        node.finalizeDeath()
        expect(hook).not.toBeCalled()
        expect(node.state).toBe(4)
      })
    })
    describe("getChildNode", () => {
      if (process.env.NODE_ENV !== "production") {
        describe("when the node is not alive", () => {
          it("fails", () => {
            const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
            node.die()
            node.getChildNode("title")
            // @ts-ignore
            const receivedErrorMessage = console.warn.mock.calls[0][0].toString()
            expect(receivedErrorMessage).toBe(
              "Error: [mobx-state-tree] You are trying to read or write to an object that is no longer part of a state tree. (Object type: 'TestModel', Path upon death: '', Subpath: 'title', Action: ''). Either detach nodes first, or don't use objects after removing / replacing them in the tree."
            )
          })
        })
      }
      describe("when the node is alive", () => {
        it("returns the child node", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          node.createObservableInstance()
          const childNode = node.getChildNode("title")
          expect(childNode).toBeDefined()
          expect(childNode.storedValue).toBe("hello")
        })
      })
    })
    describe("getChildType", () => {
      it("returns the child type", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        const childType = node.getChildType("title")
        expect(childType).toBe(t.string)
      })
    })
    describe("getChildren", () => {
      describe("when the node is not alive", () => {
        it("fails", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          node.die()
          node.getChildren()
          // @ts-ignore
          const receivedErrorMessage = console.warn.mock.calls[0][0].toString()
          expect(receivedErrorMessage).toBe(
            "Error: [mobx-state-tree] You are trying to read or write to an object that is no longer part of a state tree. (Object type: 'TestModel', Path upon death: '', Subpath: '', Action: ''). Either detach nodes first, or don't use objects after removing / replacing them in the tree."
          )
        })
      })
      describe("when the node is alive and has children", () => {
        it("returns an array of children", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          node.createObservableInstance()
          const children = node.getChildren()
          expect(children).toBeDefined()
          expect(children.length).toBe(1)
          expect(children[0].storedValue).toBe("hello")
        })
      })
    })
    describe("getReconciliationType", () => {
      it("returns the complext type used to instantiate the node", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node.getReconciliationType()).toBe(TestModel)
      })
    })
    describe("getSnapshot", () => {
      it("returns the snapshot", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node.getSnapshot()).toEqual({ title: "hello" })
      })
    })
    describe("hasDisposer", () => {
      describe("when there are no disposers", () => {
        it("returns false", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          expect(node.hasDisposer(() => {})).toBe(false)
        })
      })
      describe("when there are disposers", () => {
        it("returns true", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          const disposer = () => {}
          node.addDisposer(disposer)
          expect(node.hasDisposer(disposer)).toBe(true)
        })
      })
    })
    describe("onPatch", () => {
      it("registers the patch listener", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        const listener = jest.fn()
        node.onPatch(listener)
        node.createObservableInstance()
        node.applyPatches([{ op: "replace", path: "/title", value: "world" }])
        expect(listener).toHaveBeenCalledWith(
          {
            op: "replace",
            path: "/title",
            value: "world"
          },
          {
            op: "replace",
            path: "/title",
            value: "hello"
          }
        )
      })
    })
    describe("onSnapshot", () => {
      it("registers the snapshot listener", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        const listener = jest.fn()
        node.onSnapshot(listener)
        node.createObservableInstance()
        node.applySnapshot({ title: "world" })
        expect(listener).toHaveBeenCalledWith({ title: "world" })
      })
    })
    describe("registerHook", () => {
      describe("afterCreate", () => {
        it("works", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          const hook = jest.fn()
          node.registerHook(Hook.afterCreate, hook)
          // We call afterCreate during observable instance creation
          node.createObservableInstance()
          expect(hook).toBeCalled()
        })
      })
      describe("afterAttach", () => {
        describe("for a root node", () => {
          it("does not get called", () => {
            const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
            const hook = jest.fn()
            node.registerHook(Hook.afterAttach, hook)
            // We call afterAttach during observable instance creation
            node.createObservableInstance()
            expect(hook).not.toBeCalled()
          })
        })
        describe("for a non-root node", () => {
          it("gets called", () => {
            const env = {}
            const child = new ObjectNode(TestModel as any, null, "", env, { title: "hello" })
            const parent = new ObjectNode(Parent as any, null, "", env, {
              child: child.storedValue
            })
            child.setParent(parent, "child")
            const c = parent.getChildNode("child")
            const hook = jest.fn()
            c.registerHook(Hook.afterAttach, hook)
            parent.createObservableInstance()
            expect(hook).toBeCalled()
          })
        })
      })
      describe("afterCreationFinalization", () => {
        it("works", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          const hook = jest.fn()
          node.registerHook(Hook.afterCreationFinalization, hook)
          // We call afterCreationFinalization during observable instance creation
          node.createObservableInstance()
          expect(hook).toBeCalled()
        })
      })
      describe("beforeDetach", () => {
        describe("for a root node", () => {
          it("does not get called", () => {
            const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
            const hook = jest.fn()
            node.registerHook(Hook.beforeDetach, hook)
            node.createObservableInstance()
            node.detach()
            expect(hook).not.toBeCalled()
          })
        })
        describe("for a non-root node", () => {
          it("gets called", () => {
            const env = {}
            const child = new ObjectNode(TestModel as any, null, "", env, { title: "hello" })
            const parent = new ObjectNode(Parent as any, null, "", env, {
              child: child.storedValue
            })
            child.setParent(parent, "child")
            const hook = jest.fn()
            child.registerHook(Hook.beforeDetach, hook)
            parent.createObservableInstance()
            unprotect(parent.storedValue) // In order to detach a child node directly, we need to unprotect the root here
            child.detach()
            expect(hook).toBeCalled()
          })
        })
      })
      describe("beforeDestroy", () => {
        it("works", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          const hook = jest.fn()
          node.registerHook(Hook.beforeDestroy, hook)
          // We need to create an observable instance before we can destroy it and get the hook to fire
          node.createObservableInstance()
          node.die()
          expect(hook).toBeCalled()
        })
      })
    })
    describe("removeChild", () => {
      describe("for models", () => {
        it("removes the child by path", () => {
          const parent = Parent.create({ child: { title: "hello" } })
          const child = parent.child
          expect(child).toBeDefined()
          // We can't directly modify the tree without unprotecting it first
          unprotect(parent)
          // The object node is made available through the $treenode property
          parent.$treenode.removeChild("child")
          expect(parent.child).toBeUndefined()
        })
      })
      describe("for arrays", () => {
        it("removes the child by index", () => {
          const parent = TestArray.create([{ title: "hello" }])
          expect(parent[0]).toBeDefined()
          // We can't directly modify the tree without unprotecting it first
          unprotect(parent)
          // The object node is made available through the $treenode property
          parent.$treenode.removeChild(0)
          expect(parent[0]).toBeUndefined()
        })
      })
      describe("for maps", () => {
        it("removes the child by key", () => {
          const parent = TestMap.create({ hello: { title: "hello" } })
          expect(parent.get("hello")).toBeDefined()
          // We can't directly modify the tree without unprotecting it first
          unprotect(parent)
          // The object node is made available through the $treenode property
          parent.$treenode.removeChild("hello")
          expect(parent.get("hello")).toBeUndefined()
        })
      })
    })
    describe("removeDisposer", () => {
      describe("when a disposer does not exist", () => {
        it("throws an error", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          expect(() => node.removeDisposer(() => {})).toThrow(
            "[mobx-state-tree] cannot remove a disposer which was never registered for execution"
          )
        })
      })
      describe("when a disposer exists", () => {
        it("removes the disposer", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          const disposer = () => {}
          node.addDisposer(disposer)
          node.removeDisposer(disposer)
          expect(node.hasDisposer(disposer)).toBe(false)
        })
      })
    })
    describe("setParent", () => {
      describe("if the parent and subpath are unchanged", () => {
        it("does nothing", () => {
          const parent = new ObjectNode(Parent as any, null, "", {}, {})
          const node = new ObjectNode(TestModel as any, parent, "child", {}, { title: "hello" })
          node.setParent(parent, "child")
          expect(node.parent).toBe(parent)
          expect(node.subpath).toBe("child")
        })
      })
      if (process.env.NODE_ENV !== "production") {
        describe("if there is no subpath", () => {
          it("throws an error", () => {
            const parent = new ObjectNode(Parent as any, null, "", {}, {})
            const node = new ObjectNode(TestModel as any, parent, "child", {}, { title: "hello" })
            expect(() => node.setParent(parent, "")).toThrow(
              "[mobx-state-tree] assertion failed: subpath expected"
            )
          })
        })
        describe("if there is no new parent", () => {
          it("throws an error", () => {
            const parent = new ObjectNode(Parent as any, null, "", {}, {})
            const node = new ObjectNode(TestModel as any, parent, "child", {}, { title: "hello" })
            expect(() => node.setParent(null as any, "child")).toThrow(
              "[mobx-state-tree] assertion failed: new parent expected"
            )
          })
        })
        describe("if the node already has a parent", () => {
          it("throws an error", () => {
            const parent = new ObjectNode(Parent as any, null, "", {}, {})
            const node = new ObjectNode(TestModel as any, parent, "child", {}, { title: "hello" })
            const newParent = new ObjectNode(Parent as any, null, "", {}, {})
            expect(() => node.setParent(newParent, "child")).toThrow(
              "[mobx-state-tree] A node cannot exists twice in the state tree. Failed to add TestModel@/child to path '/child'."
            )
          })
        })
        describe("if the parent is made to be itself", () => {
          it("throws an error", () => {
            const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
            expect(() => node.setParent(node, "child")).toThrow(
              "[mobx-state-tree] A state tree is not allowed to contain itself. Cannot assign TestModel@<root> to path '/child'"
            )
          })
        })
        describe("if the parent exists in another state tree in a different environment", () => {
          it("throws an error", () => {
            const env1 = {}
            const env2 = {}

            const node = new ObjectNode(TestModel as any, null, "", env1, { title: "hello" })
            const parent = new ObjectNode(Parent as any, null, "", env2, {})

            expect(() => node.setParent(parent, "child")).toThrow(
              "[mobx-state-tree] A state tree cannot be made part of another state tree as long as their environments are different."
            )
          })
        })
      }
      describe("if the parent is different", () => {
        it("gives the node a new parent", () => {
          const env = {}
          const parent = new ObjectNode(Parent as any, null, "", env, {})
          const node = new ObjectNode(TestModel as any, null, "", env, { title: "hello" })
          node.setParent(parent, "child")
          expect(node.parent).toBe(parent)
        })
        it("fires the afterAttach hook", () => {
          const env = {}
          const parent = new ObjectNode(Parent as any, null, "", env, {})
          const node = new ObjectNode(TestModel as any, null, "", env, { title: "hello" })
          const hook = jest.fn()
          node.registerHook(Hook.afterAttach, hook)
          node.setParent(parent, "child")
          expect(hook).toBeCalled()
        })
      })
      describe("if the parent is the same but the subpath has changed", () => {
        it("gives the node a new subpath", () => {
          const env = {}
          const parent = new ObjectNode(Parent as any, null, "", env, {})
          const node = new ObjectNode(TestModel as any, parent, "", env, { title: "hello" })
          node.setParent(parent, "child")
          expect(node.subpath).toBe("child")
        })
      })
    })
    describe("toString", () => {
      it("returns a string representation of the node", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node.toString()).toBe("TestModel@<root>")
      })
    })
    describe("unbox", () => {
      // This was probably intended to be used with `null` or `undefined`, but the implementation just checks for falsy values.
      describe("when given some falsy value", () => {
        it("returns the value", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          expect(node.unbox(undefined)).toBe(undefined)
          expect(node.unbox(null as any)).toBe(null)
          expect(node.unbox(false as any)).toBe(false)
          expect(node.unbox(0 as any)).toBe(0)
        })
      })
      describe("when given a child node", () => {
        it("gives back the value", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          const childNode = node.getChildNode("title")
          expect(node.unbox(childNode)).toBe("hello")
        })
      })
    })
  })
  describe("properties", () => {
    describe("_isRunningAciton", () => {
      // The only time we ever set this to _true is during the operation sin createObservableInstance, so we don't have a great way to test it. For now, just test default value.
      it("is false by default", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node._isRunningAction).toBe(false)
      })
    })
    describe("environmment", () => {
      it("returns the environment", () => {
        const env = {}
        const node = new ObjectNode(TestModel as any, null, "", env, { title: "hello" })
        expect(node.environment).toBe(env)
      })
      it("matches by reference", () => {
        const env = {}
        // It's using the reference to the object, not just the value of an "empty" object
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node.environment).not.toBe(env)
      })
    })
    describe("hasSnapshotPostProcessor", () => {
      it("returns false by default", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node.hasSnapshotPostProcessor).toBe(false)
      })
      it("returns false if there is a pre processor and no post processor", () => {
        const NewType = t.model("NewType", {
          title: t.string
        })

        const NewType2 = t.snapshotProcessor(NewType, {
          preProcessor(sn: any) {
            return { title: sn.title.toUpperCase() }
          }
        })

        const instance = NewType2.create({ title: "hello" })
        const node = instance.$treenode

        expect(node.hasSnapshotPostProcessor).toBe(false)
      })
      it("returns true if there is a post processor", () => {
        const NewType = t.model("NewType", {
          title: t.string
        })

        const NewType2 = t.snapshotProcessor(NewType, {
          postProcessor(sn: any, node: any) {
            return { title: sn.title.toUpperCase() }
          }
        })

        const instance = NewType2.create({ title: "hello" })
        const node = instance.$treenode

        expect(node.hasSnapshotPostProcessor).toBe(true)
      })
      it("returns true if there is a pre processor and a post processor", () => {
        const NewType = t.model("NewType", {
          title: t.string
        })

        const NewType2 = t.snapshotProcessor(NewType, {
          preProcessor(sn: any) {
            return { title: sn.title.toUpperCase() }
          },
          postProcessor(sn: any, node: any) {
            return { title: sn.title.toUpperCase() }
          }
        })

        const instance = NewType2.create({ title: "hello" })
        const node = instance.$treenode

        expect(node.hasSnapshotPostProcessor).toBe(true)
      })
    })
    describe("identifier", () => {
      describe("when the type has no identifier", () => {
        it("returns null", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          expect(node.identifier).toBe(null)
        })
      })
      describe("when the type has an identifier", () => {
        it("returns the identifier", () => {
          const node = new ObjectNode(
            TestModelWithIdentifier as any,
            null,
            "",
            {},
            { id: "1234", title: "hello" }
          )
          expect(node.identifier).toBe("1234")
        })
      })
    })
    describe("when the type does not have an identifier", () => {
      it("returns undefined", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node.identifierAttribute).toBe(undefined)
      })
    })
    describe("when the type has an identifier", () => {
      it("returns the identifier", () => {
        const node = new ObjectNode(
          TestModelWithIdentifier as any,
          null,
          "",
          {},
          { id: "1234", title: "hello" }
        )
        expect(node.identifierAttribute).toBe("id")
      })
    })
    describe("identifierCache", () => {
      describe("if the node is the root", () => {
        it("exists", () => {
          const Parent = t.model("Parent", {
            child: TestModel
          })

          const parent = Parent.create({ child: { title: "hello" } })

          expect(parent.$treenode.identifierCache).toBeDefined()
        })
        it("keeps track of ids", () => {
          const Parent = t.model("Parent", {
            child: TestModelWithIdentifier
          })

          const parent = Parent.create({ child: { id: "1234", title: "hello" } })
          const identifierCache = parent.$treenode.identifierCache
          expect(identifierCache.has(TestModelWithIdentifier, "1234")).toBe(true)
          expect(identifierCache.has(TestModelWithIdentifier, "aaa")).toBe(false)
        })
      })
      describe("if the node is not the root", () => {
        it("is undefined", () => {
          const Parent = t.model("Parent", {
            child: TestModel
          })

          const parent = Parent.create({ child: { title: "hello" } })

          expect(parent.child.$treenode.identifierCache).toBeUndefined()
        })
      })
    })
    describe("isAlive", () => {
      describe("when the node is dead", () => {
        it("returns false", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          node.die()
          expect(node.isAlive).toBe(false)
        })
      })
      describe("when the node is initializing, created, finalized, or detaching", () => {
        const testCases = [0, 1, 2, 3]
        testCases.forEach((state) => {
          it(`returns true when the state is ${state}`, () => {
            const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
            node.state = state
            expect(node.isAlive).toBe(true)
          })
        })
      })
    })
    describe("isDetaching", () => {
      describe("when the node is detaching", () => {
        it("returns true", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          node.state = 3
          expect(node.isDetaching).toBe(true)
        })
      })
      describe("when the node is in any other state", () => {
        const testCases = [0, 1, 2, 4]
        testCases.forEach((state) => {
          it(`returns false when the state is ${state}`, () => {
            const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
            node.state = state
            expect(node.isDetaching).toBe(false)
          })
        })
      })
    })
    describe("isProtected", () => {
      it("returns true by default", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node.isProtected).toBe(true)
      })
      it("returns false if the node is unprotected", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        node.createObservableInstance()
        unprotect(node.storedValue)
        expect(node.isProtected).toBe(false)
      })
    })
    describe("isRoot", () => {
      it("returns true by default", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node.isRoot).toBe(true)
      })
      it("returns false when it is made a child of another node", () => {
        const env = {}
        const parent = new ObjectNode(Parent as any, null, "", env, {})
        const node = new ObjectNode(TestModel as any, null, "", env, { title: "hello" })
        node.setParent(parent, "child")
        expect(node.isRoot).toBe(false)
      })
    })
    describe("middlewares", () => {
      it("returns no middlewares by default", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node.middlewares).toBeUndefined()
      })
      it("returns the middlewares", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        const middleware = jest.fn()
        node.addMiddleWare(middleware)
        expect(node.middlewares).toBeDefined()
      })
    })
    describe("nodeId", () => {
      it("increments every time a node is created", () => {
        const node1 = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        const node2 = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node1.nodeId).not.toBe(node2.nodeId)
      })
    })
    /**
     * observableIsAlive will follow the isAlive patterns,
     * it just has a side effect of reporting observation when called
     */
    describe("observableIsAlive", () => {
      describe("when the node is dead", () => {
        it("returns false", () => {
          const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
          node.die()
          expect(node.observableIsAlive).toBe(false)
        })
      })
      describe("when the node is initializing, created, finalized, or detaching", () => {
        const testCases = [0, 1, 2, 3]
        testCases.forEach((state) => {
          it(`returns true when the state is ${state}`, () => {
            const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
            node.state = state
            expect(node.observableIsAlive).toBe(true)
          })
        })
      })
    })
    describe("parent", () => {
      it("returns the parent node", () => {
        const env = {}
        const parent = new ObjectNode(Parent as any, null, "", env, {})
        const node = new ObjectNode(TestModel as any, parent, "", env, { title: "hello" })
        expect(node.parent).toBe(parent)
      })
      it("returns null when there is no parent", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node.parent).toBe(null)
      })
    })
    describe("path", () => {
      it("returns the provided path", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node.path).toBe("")
      })
    })
    describe("root", () => {
      it("returns the node when it is the root", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node.root).toBe(node)
      })
      it("returns the root node when it is not the root", () => {
        const env = {}
        const parent = new ObjectNode(Parent as any, null, "", env, {})
        const node = new ObjectNode(TestModel as any, parent, "", env, { title: "hello" })
        expect(node.root).toBe(parent)
      })
    })
    describe("snapshot", () => {
      it("returns the snapshot", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node.snapshot).toEqual({ title: "hello" })
      })
    })
    describe("state", () => {
      // We implicitly test this in many ways through the rest of the spec, so I've just left a simple one here.
      it("works", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node.state).toBe(0)
      })
    })
    describe("storedValue", () => {
      it("is undefined before the observable instance is created", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node.storedValue).toBeUndefined()
      })
      it('is the "value" of the observable instance after it is created', () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        node.createObservableInstance()
        expect(node.storedValue).toBeDefined()
        // @ts-ignore
        expect(node.storedValue.title).toBe("hello")
      })
    })
    describe("subpath", () => {
      it('returns "" when the node is the root', () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node.subpath).toBe("")
      })
      it("returns the subpath when the node is not the root", () => {
        const env = {}
        const parent = new ObjectNode(Parent as any, null, "", env, {})
        const node = new ObjectNode(TestModel as any, parent, "child", env, { title: "hello" })
        expect(node.subpath).toBe("child")
      })
    })
    describe("subpathUponDeath", () => {
      it("remembers the subpath upon death", () => {
        const env = {}
        const parent = new ObjectNode(Parent as any, null, "", env, {})
        const node = new ObjectNode(TestModel as any, parent, "child", env, { title: "hello" })
        node.die()
        expect(node.subpathUponDeath).toBe("child")
        parent.die()
        expect(parent.subpathUponDeath).toBe("")
      })
    })
    describe("type", () => {
      it("returns the given type of the objectnode", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        expect(node.type).toBe(TestModel)
      })
    })
    describe("value", () => {
      it("returns the value as returned by the given type", () => {
        const node = new ObjectNode(TestModel as any, null, "", {}, { title: "hello" })
        // @ts-ignore
        expect(node.value.title).toBe("hello")
      })
    })
  })
})
