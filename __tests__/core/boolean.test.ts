import { t } from "../../src"
import { Hook, NodeLifeCycle } from "../../src/internal"

describe("types.boolean", () => {
  describe("methods", () => {
    describe("create", () => {
      describe("with no arguments", () => {
        if (process.env.NODE_ENV !== "production") {
          it("should throw an error in development", () => {
            expect(() => {
              t.boolean.create()
            }).toThrow()
          })
        }
      })
      describe("with a boolean argument", () => {
        it("should return a boolean", () => {
          const n = t.boolean.create(true)
          expect(typeof n).toBe("boolean")
        })
      })
      describe("with argument of different types", () => {
        const testCases = [
          null,
          undefined,
          "string",
          1,
          [],
          function () {},
          new Date(),
          /a/,
          new Map(),
          new Set(),
          Symbol(),
          new Error(),
          Infinity,
          NaN
        ]

        if (process.env.NODE_ENV !== "production") {
          testCases.forEach((testCase) => {
            it(`should throw an error when passed ${JSON.stringify(testCase)}`, () => {
              expect(() => {
                t.boolean.create(testCase as any)
              }).toThrow()
            })
          })
        }
      })
    })
    describe("describe", () => {
      it("should return the value 'boolean'", () => {
        const description = t.boolean.describe()
        expect(description).toBe("boolean")
      })
    })
    describe("getSnapshot", () => {
      it("should return the value passed in", () => {
        const b = t.boolean.instantiate(null, "", {}, true)
        const snapshot = t.boolean.getSnapshot(b)
        expect(snapshot).toBe(true)
      })
    })
    describe("getSubtype", () => {
      it("should return null", () => {
        const subtype = t.boolean.getSubTypes()
        expect(subtype).toBe(null)
      })
    })
    describe("instantiate", () => {
      if (process.env.NODE_ENV !== "production") {
        describe("with invalid arguments", () => {
          it("should not throw an error", () => {
            expect(() => {
              // @ts-ignore
              t.boolean.instantiate()
            }).not.toThrow()
          })
        })
      }
      describe("with a boolean argument", () => {
        it("should return an object", () => {
          const b = t.boolean.instantiate(null, "", {}, true)
          expect(typeof b).toBe("object")
        })
      })
    })
    describe("is", () => {
      describe("with a boolean argument", () => {
        it("should return true", () => {
          const result = t.boolean.is(true)
          expect(result).toBe(true)
        })
      })
      describe("with argument of different types", () => {
        const testCases = [
          null,
          undefined,
          "string",
          1,
          [],
          function () {},
          new Date(),
          /a/,
          new Map(),
          new Set(),
          Symbol(),
          new Error(),
          Infinity,
          NaN
        ]

        testCases.forEach((testCase) => {
          it(`should return false when passed ${JSON.stringify(testCase)}`, () => {
            const result = t.boolean.is(testCase as any)
            expect(result).toBe(false)
          })
        })
      })
    })
    describe("isAssignableFrom", () => {
      describe("with a boolean argument", () => {
        it("should return true", () => {
          const result = t.boolean.isAssignableFrom(t.boolean)
          expect(result).toBe(true)
        })
      })
      describe("with argument of different types", () => {
        const testCases = [
          t.Date,
          t.number,
          t.finite,
          t.float,
          t.identifier,
          t.identifierNumber,
          t.integer,
          t.null,
          t.string,
          t.undefined
        ]

        testCases.forEach((testCase) => {
          it(`should return false when passed ${JSON.stringify(testCase)}`, () => {
            const result = t.boolean.isAssignableFrom(testCase as any)
            expect(result).toBe(false)
          })
        })
      })
    })
    // TODO: we need to test this, but to be honest I'm not sure what the expected behavior is on single boolean nodes.
    describe.skip("reconcile", () => {})
    describe("validate", () => {
      describe("with a boolean argument", () => {
        it("should return with no validation errors", () => {
          const result = t.boolean.validate(true, [])
          expect(result).toEqual([])
        })
      })
      describe("with argument of different types", () => {
        const testCases = [
          null,
          undefined,
          "string",
          1,
          [],
          function () {},
          new Date(),
          /a/,
          new Map(),
          new Set(),
          Symbol(),
          new Error(),
          Infinity,
          NaN
        ]

        testCases.forEach((testCase) => {
          it(`should return with a validation error when passed ${JSON.stringify(
            testCase
          )}`, () => {
            const result = t.boolean.validate(testCase as any, [])
            expect(result).toEqual([
              {
                context: [],
                message: "Value is not a boolean",
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
        const flags = t.boolean.flags
        expect(flags).toBe(4)
      })
    })
    describe("identifierAttribute", () => {
      // We don't have a way to set the identifierAttribute on a primitive type, so this should return undefined.
      test("returns undefined", () => {
        const identifierAttribute = t.boolean.identifierAttribute
        expect(identifierAttribute).toBe(undefined)
      })
    })
    describe("isType", () => {
      test("returns true", () => {
        const isType = t.boolean.isType
        expect(isType).toBe(true)
      })
    })
    describe("name", () => {
      test('returns "boolean"', () => {
        const name = t.boolean.name
        expect(name).toBe("boolean")
      })
    })
  })
  describe("instance", () => {
    describe("methods", () => {
      describe("aboutToDie", () => {
        it("calls the beforeDetach hook", () => {
          const b = t.boolean.instantiate(null, "", {}, true)
          let called = false
          b.registerHook(Hook.beforeDestroy, () => {
            called = true
          })
          b.aboutToDie()
          expect(called).toBe(true)
        })
      })
      describe("die", () => {
        it("kills the node", () => {
          const b = t.boolean.instantiate(null, "", {}, true)
          b.die()
          expect(b.isAlive).toBe(false)
        })
        it("should mark the node as dead", () => {
          const b = t.boolean.instantiate(null, "", {}, true)
          b.die()
          expect(b.state).toBe(NodeLifeCycle.DEAD)
        })
      })
      describe("finalizeCreation", () => {
        it("should mark the node as finalized", () => {
          const b = t.boolean.instantiate(null, "", {}, true)
          b.finalizeCreation()
          expect(b.state).toBe(NodeLifeCycle.FINALIZED)
        })
      })
      describe("finalizeDeath", () => {
        it("should mark the node as dead", () => {
          const b = t.boolean.instantiate(null, "", {}, true)
          b.finalizeDeath()
          expect(b.state).toBe(NodeLifeCycle.DEAD)
        })
      })
      describe("getReconciliationType", () => {
        it("should return the correct type", () => {
          const b = t.boolean.instantiate(null, "", {}, true)
          const type = b.getReconciliationType()
          expect(type).toBe(t.boolean)
        })
      })
      describe("getSnapshot", () => {
        it("should return the value passed in", () => {
          const b = t.boolean.instantiate(null, "", {}, true)
          const snapshot = b.getSnapshot()
          expect(snapshot).toBe(true)
        })
      })
      describe("registerHook", () => {
        it("should register a hook and call it", () => {
          const b = t.boolean.instantiate(null, "", {}, true)
          let called = false
          b.registerHook(Hook.beforeDestroy, () => {
            called = true
          })

          b.die()

          expect(called).toBe(true)
        })
      })
      describe("setParent", () => {
        if (process.env.NODE_ENV !== "production") {
          describe("with null", () => {
            it("should throw an error", () => {
              const b = t.boolean.instantiate(null, "", {}, true)
              expect(() => {
                b.setParent(null, "foo")
              }).toThrow()
            })
          })
          describe("with a parent object", () => {
            it("should throw an error", () => {
              const Parent = t.model({
                child: t.boolean
              })

              const parent = Parent.create({ child: true })

              const b = t.boolean.instantiate(null, "", {}, true)

              expect(() => {
                // @ts-ignore
                b.setParent(parent, "bar")
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
