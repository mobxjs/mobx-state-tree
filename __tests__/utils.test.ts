import { MstError } from "../src/utils"
import { describe, expect, test } from "bun:test"

describe("MstError custom error class", () => {
  test("with default message", () => {
    const error = new MstError()
    expect(error.message).toBe("[mobx-state-tree] Illegal state")
  })

  test("with custom message", () => {
    const customMessage = "custom error message"
    const error = new MstError(customMessage)
    expect(error.message).toBe(`[mobx-state-tree] ${customMessage}`)
  })

  test("instance of MstError", () => {
    const error = new MstError()
    expect(error).toBeInstanceOf(MstError)
    expect(error).toBeInstanceOf(Error)
  })
})
