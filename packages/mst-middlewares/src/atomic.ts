import { createActionTrackingMiddleware2, recordPatches, IPatchRecorder } from "mobx-state-tree"

const atomic = createActionTrackingMiddleware2<{ recorder: IPatchRecorder }>({
    filter(call) {
        // only call the methods above for actions that were not being recorded,
        // but do not call them for child acions (which inherit a copy of the env)
        return !call.env
    },
    onStart(call) {
        call.env = { recorder: recordPatches(call.tree) }
        call.env.recorder.resume()
    },
    onFinish(call, error) {
        call.env!.recorder.stop()
        if (error !== undefined) {
            call.env!.recorder.undo()
        }
        call.env = undefined
    }
})

export default atomic
