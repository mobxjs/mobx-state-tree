import { t } from "../../src"

describe("APIs to definitely implement", () => {
  describe("entries", () => {
    it("should return an array of entries", () => {
      const myObject = t.object(t.string)
      const info = { a: "something", b: "else" }
      const instance = myObject.create(info)

      const entries = instance.entries()
      expect(entries).toEqual([
        ["a", "something"],
        ["b", "else"]
      ])
    })
  })

  describe("from entries", () => {
    it("should create an object from entries", () => {
      const myObject = t.object(t.string)
      const entries = [
        ["a", "something"],
        ["b", "else"]
      ]
      myObject.fromEntries(entries)
      expect(myObject.entries()).toEqual(entries)
    })
  })

  describe("groupBy", () => {
    it("should group by a key", () => {
      const myObject = t.object(t.string)
      const info = { a: "something", b: "else" }
      const instance = myObject.create(info)
      // @ts-expect-error - this method doesn't exist yet, but it should, and needs to handle TS inference
      const grouped = instance.groupBy((value, key) => key.length)
      expect(grouped).toEqual({
        9: ["something"],
        4: ["else"]
      })
    })
  })

  describe("keys", () => {
    it("should return the keys", () => {
      const myObject = t.object(t.string)
      const info = { name: "something", age: 10 }
      const instance = myObject.create(info)
      const keys = instance.keys()
      expect(keys).toEqual(["name", "age"])
    })
  })

  describe("values", () => {
    it("should return the values", () => {
      const myObject = t.object(t.string)
      const info = { name: "something", age: 10 }
      const instance = myObject.create(info)
      const values = instance.values()
      expect(values).toEqual(["something", 10])
    })
  })
})

describe("APIs to consider implementing", () => {
  describe("defineProperties", () => {
    it("should define properties", () => {
      const myObject = t.object(t.string)
      const instance = myObject.create()

      instance.defineProperties({
        name: "something",
        age: 10
      })
    })
  })

  describe("defineProperty", () => {
    it("should define a property", () => {
      const myObject = t.object(t.string)
      const instance = myObject.create()

      instance.defineProperty("name", "something")
    })
  })

  describe("freeze", () => {
    it("should freeze the object", () => {
      const myObject = t.object(t.string)
      const info = { a: "something", b: "else" }
      const instance = myObject.create(info)

      instance.freeze()
      expect(() => myObject.defineProperties({ c: "another" })).toThrow()
    })
  })
  describe("isFrozen", () => {
    it("should return true if the object is frozen", () => {
      const myObject = t.object(t.string)
      const instance = myObject.create()
      instance.freeze()
      expect(instance.isFrozen()).toBe(true)
    })

    it("should return false if the object is not frozen", () => {
      const myObject = t.object(t.string)
      const instance = myObject.create()
      expect(instance.isFrozen()).toBe(false)
    })
  })
  describe("hasOwn", () => {
    it("should return true if the object has a property", () => {
      const myObject = t.object(t.string)
      const info = { name: "something" }
      const instance = myObject.create(info)
      expect(instance.hasOwn("name")).toBe(true)
    })
  })
  describe("hasOwnProperty", () => {
    it("should return true if the object has a property", () => {
      const myObject = t.object(t.string)
      const info = { name: "something" }
      const instance = myObject.create(info)
      expect(instance.hasOwnProperty("name")).toBe(true)
    })
  })

  describe("isExtensible", () => {
    it("should return true if the object is extensible", () => {
      const myObject = t.object(t.string)
      const instance = myObject.create()
      expect(instance.isExtensible()).toBe(true)
    })

    it("should return false if the object is not extensible", () => {
      const myObject = t.object(t.string)
      const instance = myObject.create()
      instance.freeze()
      expect(instance.isExtensible()).toBe(false)
    })
  })
  describe("seal", () => {
    it("should seal the object", () => {
      const myObject = t.object(t.string)
      const info = { name: "something" }
      const instance = myObject.create(info)
      instance.seal()
      expect(() => instance.defineProperty("age", 10)).toThrow()
    })
  })

  describe("isSealed", () => {
    it("should return true if the object is sealed", () => {
      const myObject = t.object(t.string)
      const instance = myObject.create()
      instance.seal()
      expect(instance.isSealed()).toBe(true)
    })

    it("should return false if the object is not sealed", () => {
      const myObject = t.object(t.string)
      const instance = myObject.create()
      expect(instance.isSealed()).toBe(false)
    })
  })

  describe("preventExtensions", () => {
    it("should prevent extensions", () => {
      const myObject = t.object(t.string)
      const instance = myObject.create()
      instance.preventExtensions()
      expect(() => instance.defineProperty("name", "something")).toThrow()
    })
  })

  describe("propertyIsEnumerable", () => {
    it("should return true if the property is enumerable", () => {
      const myObject = t.object(t.string)
      const info = { name: "something" }
      const instance = myObject.create(info)
      expect(instance.propertyIsEnumerable("name")).toBe(true)
    })

    it("should return false if the property is not enumerable", () => {
      const myObject = t.object(t.string)
      const info = { name: "something" }
      const instance = myObject.create(info)
      expect(instance.propertyIsEnumerable("keys")).toBe(false)
    })
  })

  /**
   * MST already kind of has these string methods with toJSON and snapshots, so maybe we should skip them. They technically work, since the instance is a JS object as well
   */
  describe("toLocaleString", () => {
    it("should return a string", () => {
      const myObject = t.object(t.string)
      const instance = myObject.create()
      expect(instance.toLocaleString()).toBe("[object Object]")
    })
  })
  describe("toString", () => {
    it("should return a string", () => {
      const myObject = t.object(t.string)
      const instance = myObject.create()
      expect(instance.toString()).toBe("[object Object]")
    })
  })
  describe("valueOf", () => {
    it("should return the object", () => {
      const myObject = t.object(t.string)
      const instance = myObject.create()
      expect(instance.valueOf()).toEqual({})
    })
  })
})

/**
 * Listed mostly for completeness parity with https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/values
 */
describe("APIs to definitely not implement", () => {
  describe("getOwnPropertyDescriptor", () => {
    it("should return the property descriptor", () => {
      const myObject = t.object(t.string)
      const info = { name: "something" }
      const instance = myObject.create(info)
      const descriptor = instance.getOwnPropertyDescriptor("name")
      expect(descriptor).toEqual({
        configurable: true,
        enumerable: true,
        value: "something",
        writable: true
      })
    })
  })
  describe("getOwnPropertyDescriptors", () => {
    it("should return the property descriptors", () => {
      const myObject = t.object(t.string)
      const info = { name: "something" }
      const instance = myObject.create(info)
      const descriptors = instance.getOwnPropertyDescriptors()
      expect(descriptors).toEqual({
        name: {
          configurable: true,
          enumerable: true,
          value: "something",
          writable: true
        },
        age: {
          configurable: true,
          enumerable: true,
          value: 10,
          writable: true
        }
      })
    })
  })

  describe("getOwnPropertyNames", () => {
    it("should return the property names", () => {
      const myObject = t.object(t.string)
      const info = { name: "something" }
      const instance = myObject.create(info)
      const names = instance.getOwnPropertyNames()
      expect(names).toEqual(["name"])
    })
  })

  /** Skip this because it's not clear if we can add symbols as keys anyway? */
  describe("getOwnPropertySymbols", () => {})

  describe("getPrototypeOf", () => {
    it("should return the prototype", () => {
      const myObject = t.object(t.string)
      const instance = myObject.create()
      const prototype = instance.getPrototypeOf()
      expect(prototype).toEqual({})
    })
  })
  /** This is a static method on JS Object, and may not be relevant to us */
  describe("is", () => {})
  /** This probably isn't relevant to us */
  describe("isPrototypeOf", () => {})
  /** We should almost definitely not implement this, but listing it for completeness */
  describe("setPrototypeOf", () => {})
})
