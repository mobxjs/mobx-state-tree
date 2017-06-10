import { TypeFlags, Type } from "../type"
import {
  IContext,
  IValidationResult,
  typeCheckSuccess,
  typeCheckFailure,
  popTypeFromContext
} from "../type-checker"
import {
  fail,
  noop
} from "../../utils"
import { createNode, Node } from "../../core"

export type ISetter<T> = ((value: any) => void) | undefined
export type IGetter<T> = () => T

export class Computed<T> extends Type<never, T> {
  readonly snapshottable = false
  readonly flags = TypeFlags.Computed

  constructor(private getter: IGetter<T>, private setter: ISetter<T> = noop) {
    super("computed")
  }

  describe() {
    return "computed"
  }

  instantiate(
    parent: Node | null,
    subpath: string,
    environment: any,
    value: any
  ): Node {
    return createNode(
      this,
      parent,
      subpath,
      environment,
      undefined
    )
  }

  getValue(node: Node) {
      if (node.parent === null) return fail("Computeds should have a parent!")
      return this.getter.bind(node.parent.getValue())() // TODO: Is there a better way? D:
  }

  getSnapshot(node: Node) {
      return undefined
  }

  reconcile(current: Node, value: any) {
      if (this.setter) this.setter(value)
      return current
  }

  isValidSnapshot(value: any, context: IContext): IValidationResult {
    if (typeof value !== "undefined") {
      return typeCheckFailure(popTypeFromContext(context), value, "Computed properties should not be provided in the snapshot")
    }
    return typeCheckSuccess()
  }
}

export const computed = <T>(getter: IGetter<T>, setter?: ISetter<T>) => {
    return new Computed<T>(getter, setter)
}
