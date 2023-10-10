import {
  fail,
  BaseType,
  IValidationContext,
  IValidationResult,
  TypeFlags,
  isType,
  IAnyType,
  typeCheckSuccess,
  AnyObjectNode,
  ExtractNodeType,
  cannotDetermineSubtype,
  devMode
} from "../../internal"

class Late<IT extends IAnyType> extends BaseType<
  IT["CreationType"],
  IT["SnapshotType"],
  IT["TypeWithoutSTN"],
  ExtractNodeType<IT>
> {
  private _subType?: IT

  get flags() {
    return (this._subType ? this._subType.flags : 0) | TypeFlags.Late
  }

  getSubType(mustSucceed: true): IT
  getSubType(mustSucceed: false): IT | undefined
  getSubType(mustSucceed: boolean): IT | undefined {
    if (!this._subType) {
      let t = undefined
      try {
        t = this._definition()
      } catch (e) {
        if (e instanceof ReferenceError)
          // can happen in strict ES5 code when a definition is self refering
          t = undefined
        else throw e
      }
      if (mustSucceed && t === undefined)
        throw fail("Late type seems to be used too early, the definition (still) returns undefined")
      if (t) {
        if (devMode() && !isType(t))
          throw fail("Failed to determine subtype, make sure types.late returns a type definition.")
        this._subType = t
      }
    }
    return this._subType
  }

  constructor(name: string, private readonly _definition: () => IT) {
    super(name)
  }

  instantiate(
    parent: AnyObjectNode | null,
    subpath: string,
    environment: any,
    initialValue: this["C"] | this["T"]
  ): this["N"] {
    return this.getSubType(true).instantiate(parent, subpath, environment, initialValue) as any
  }

  reconcile(
    current: this["N"],
    newValue: this["C"] | this["T"],
    parent: AnyObjectNode,
    subpath: string
  ): this["N"] {
    return this.getSubType(true).reconcile(current, newValue, parent, subpath) as any
  }

  describe() {
    const t = this.getSubType(false)
    return t ? t.name : "<uknown late type>"
  }

  isValidSnapshot(value: this["C"], context: IValidationContext): IValidationResult {
    const t = this.getSubType(false)
    if (!t) {
      // See #916; the variable the definition closure is pointing to wasn't defined yet, so can't be evaluted yet here
      return typeCheckSuccess()
    }
    return t.validate(value, context)
  }

  isAssignableFrom(type: IAnyType) {
    const t = this.getSubType(false)
    return t ? t.isAssignableFrom(type) : false
  }

  getSubTypes() {
    const subtype = this.getSubType(false)
    return subtype ? subtype : cannotDetermineSubtype
  }
}

export function late<T extends IAnyType>(type: () => T): T
export function late<T extends IAnyType>(name: string, type: () => T): T
/**
 * `types.late` - Defines a type that gets implemented later. This is useful when you have to deal with circular dependencies.
 * Please notice that when defining circular dependencies TypeScript isn't smart enough to inference them.
 *
 * Example:
 * ```ts
 *   // TypeScript isn't smart enough to infer self referencing types.
 *  const Node = types.model({
 *       children: types.array(types.late((): IAnyModelType => Node)) // then typecast each array element to Instance<typeof Node>
 *  })
 * ```
 *
 * @param name The name to use for the type that will be returned.
 * @param type A function that returns the type that will be defined.
 * @returns
 */
export function late(nameOrType: any, maybeType?: () => IAnyType): IAnyType {
  const name = typeof nameOrType === "string" ? nameOrType : `late(${nameOrType.toString()})`
  const type = typeof nameOrType === "string" ? maybeType : nameOrType
  // checks that the type is actually a late type
  if (devMode()) {
    if (!(typeof type === "function" && type.length === 0))
      throw fail(
        "Invalid late type, expected a function with zero arguments that returns a type, got: " +
          type
      )
  }
  return new Late(name, type)
}

/**
 * Returns if a given value represents a late type.
 *
 * @param type
 * @returns
 */
export function isLateType<IT extends IAnyType>(type: IT): type is IT {
  return isType(type) && (type.flags & TypeFlags.Late) > 0
}
