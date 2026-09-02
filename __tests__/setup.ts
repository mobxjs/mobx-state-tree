import { beforeEach, afterEach, mock } from "bun:test"
import { resetNextActionId, setLivelinessChecking } from "../src/internal"

beforeEach(() => {
    setLivelinessChecking("warn")
    resetNextActionId()
})

afterEach(() => {
    mock.restore()
})
