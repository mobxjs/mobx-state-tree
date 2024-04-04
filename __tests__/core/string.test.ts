import { types } from "../../src"
import { Hook, NodeLifeCycle } from "../../src/internal"
import { describe, expect, it, test } from "bun:test"

describe("types.string", () => {
  describe("methods", () => {
    describe("create", () => {
      describe("with no arguments", () => {
        if (process.env.NODE_ENV !== "production") {
          it("should throw an error in development", () => {
            expect(() => {
              types.string.create()
            }).toThrow()
          })
        }
      })
      describe("with a string argument", () => {
        it("should return a string", () => {
          const s = types.string.create("foo")
          expect(typeof s).toBe("string")
        })
      })
      describe("with argument of different types", () => {
        const testCases = [
          null,
          undefined,
          1,
          true,
          [],
          function () {},
          new Date(),
          /a/,
          new Map(),
          new Set(),
          Symbol(),
          new Error(),
          NaN,
          Infinity
        ]

        if (process.env.NODE_ENV !== "production") {
          testCases.forEach((testCase) => {
            it(`should throw an error when passed ${JSON.stringify(testCase)}`, () => {
              expect(() => {
                types.string.create(testCase as any)
              }).toThrow()
            })
          })
        }
      })
    })
    describe("describe", () => {
      it("should return the value 'string'", () => {
        const description = types.string.describe()
        expect(description).toBe("string")
      })
    })
    describe("getSnapshot", () => {
      it("should return the value passed in", () => {
        const s = types.string.instantiate(null, "", {}, "foo")
        const snapshot = types.string.getSnapshot(s)
        expect(snapshot).toBe("foo")
      })
    })
    describe("getSubtype", () => {
      it("should return null", () => {
        const subtype = types.string.getSubTypes()
        expect(subtype).toBe(null)
      })
    })
    describe("instantiate", () => {
      if (process.env.NODE_ENV !== "production") {
        describe("with invalid arguments", () => {
          it("should not throw an error", () => {
            expect(() => {
              // @ts-ignore
              types.string.instantiate()
            }).not.toThrow()
          })
        })
      }
      describe("with a string argument", () => {
        it("should return an object", () => {
          const s = types.string.instantiate(null, "", {}, "foo")
          expect(typeof s).toBe("object")
        })
      })
    })
    describe("is", () => {
      describe("with a string argument", () => {
        it("should return true", () => {
          const result = types.string.is("foo")
          expect(result).toBe(true)
        })
      })
      describe("with argument of different types", () => {
        const testCases = [
          null,
          undefined,
          1,
          true,
          [],
          function () {},
          new Date(),
          /a/,
          new Map(),
          new Set(),
          Symbol(),
          new Error(),
          NaN,
          Infinity
        ]

        testCases.forEach((testCase) => {
          it(`should return false when passed ${JSON.stringify(testCase)}`, () => {
            const result = types.string.is(testCase as any)
            expect(result).toBe(false)
          })
        })
      })
    })
    describe("isAssignableFrom", () => {
      describe("with a string argument", () => {
        it("should return true", () => {
          const result = types.string.isAssignableFrom(types.string)
          expect(result).toBe(true)
        })
      })
      describe("with argument of different types", () => {
        const testCases = [
          types.Date,
          types.boolean,
          types.finite,
          types.float,
          types.identifier,
          types.identifierNumber,
          types.integer,
          types.null,
          types.number,
          types.undefined
        ]

        testCases.forEach((testCase) => {
          it(`should return false when passed ${JSON.stringify(testCase)}`, () => {
            const result = types.string.isAssignableFrom(testCase as any)
            expect(result).toBe(false)
          })
        })
      })
    })
    // TODO: we need to test this, but to be honest I'm not sure what the expected behavior is on single string nodes.
    describe.skip("reconcile", () => {})
    describe("validate", () => {
      describe("with a string argument", () => {
        it("should return with no validation errors", () => {
          const result = types.string.validate("foo", [])
          expect(result).toEqual([])
        })
      })
      describe("with argument of different types", () => {
        const testCases = [
          null,
          undefined,
          1,
          true,
          [],
          function () {},
          new Date(),
          /a/,
          new Map(),
          new Set(),
          Symbol(),
          new Error(),
          NaN,
          Infinity
        ]

        testCases.forEach((testCase) => {
          it(`should return with a validation error when passed ${JSON.stringify(
            testCase
          )}`, () => {
            const result = types.string.validate(testCase as any, [])
            expect(result).toEqual([
              {
                context: [],
                message: "Value is not a string",
                value: testCase
              }
            ])
          })
        })
      })
    })
  })
  describe("properties", () => {
    describe("flags", () => {
      test("return the correct value", () => {
        const flags = types.string.flags
        expect(flags).toBe(1)
      })
    })
    describe("identifierAttribute", () => {
      // We don't have a way to set the identifierAttribute on a primitive type, so this should return undefined.
      test("returns undefined", () => {
        const identifierAttribute = types.string.identifierAttribute
        expect(identifierAttribute).toBeUndefined()
      })
    })
    describe("isType", () => {
      test("returns true", () => {
        const isType = types.string.isType
        expect(isType).toBe(true)
      })
    })
    describe("name", () => {
      test('returns "string"', () => {
        const name = types.string.name
        expect(name).toBe("string")
      })
    })
  })
  describe("instance", () => {
    describe("methods", () => {
      describe("aboutToDie", () => {
        it("calls the beforeDetach hook", () => {
          const s = types.string.instantiate(null, "", {}, "foo")
          let called = false
          s.registerHook(Hook.beforeDestroy, () => {
            called = true
          })
          s.aboutToDie()
          expect(called).toBe(true)
        })
      })
      describe("die", () => {
        it("kills the node", () => {
          const s = types.string.instantiate(null, "", {}, "foo")
          s.die()
          expect(s.isAlive).toBe(false)
        })
        it("should mark the node as dead", () => {
          const s = types.string.instantiate(null, "", {}, "foo")
          s.die()
          expect(s.state).toBe(NodeLifeCycle.DEAD)
        })
      })
      describe("finalizeCreation", () => {
        it("should mark the node as finalized", () => {
          const s = types.string.instantiate(null, "", {}, "foo")
          s.finalizeCreation()
          expect(s.state).toBe(NodeLifeCycle.FINALIZED)
        })
      })
      describe("finalizeDeath", () => {
        it("should mark the node as dead", () => {
          const s = types.string.instantiate(null, "", {}, "foo")
          s.finalizeDeath()
          expect(s.state).toBe(NodeLifeCycle.DEAD)
        })
      })
      describe("getReconciliationType", () => {
        it("should return the correct type", () => {
          const s = types.string.instantiate(null, "", {}, "foo")
          const type = s.getReconciliationType()
          expect(type).toBe(types.string)
        })
      })
      describe("getSnapshot", () => {
        it("should return the value passed in", () => {
          const s = types.string.instantiate(null, "", {}, "foo")
          const snapshot = s.getSnapshot()
          expect(snapshot).toBe("foo")
        })
      })
      describe("registerHook", () => {
        it("should register a hook and call it", () => {
          const s = types.string.instantiate(null, "", {}, "foo")
          let called = false
          s.registerHook(Hook.beforeDestroy, () => {
            called = true
          })

          s.die()

          expect(called).toBe(true)
        })
      })
      describe("setParent", () => {
        if (process.env.NODE_ENV !== "production") {
          describe("with null", () => {
            it("should throw an error", () => {
              const s = types.string.instantiate(null, "", {}, "foo")
              expect(() => {
                s.setParent(null, "foo")
              }).toThrow()
            })
          })
          describe("with a parent object", () => {
            it("should throw an error", () => {
              const Parent = types.model({
                child: types.string
              })

              const parent = Parent.create({ child: "foo" })

              const s = types.string.instantiate(null, "", {}, "bar")

              expect(() => {
                // @ts-ignore
                s.setParent(parent, "bar")
              }).toThrow(
                "[mobx-state-tree] assertion failed: scalar nodes cannot change their parent"
              )
            })
          })
        }
      })
    })
  })
})
