import { beforeEach, afterEach, mock } from "bun:test"
import { resetNextActionId, setLivelinessChecking } from "../src/internal"
import { configure } from "mobx"

beforeEach(() => {
  setLivelinessChecking("warn")
  resetNextActionId()
})

afterEach(() => {
  mock.restore()

  // Some tests turn off proxy support, so ensure it's always turned back on
  configure({
    useProxies: "always"
  })
})
