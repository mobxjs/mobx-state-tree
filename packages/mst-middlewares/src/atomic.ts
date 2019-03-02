import { createActionTrackingMiddleware, recordPatches, IPatchRecorder } from "mobx-state-tree"

const atomic = createActionTrackingMiddleware<IPatchRecorder | undefined>({
    onStart: call => (!call.parentId ? recordPatches(call.tree) : undefined),
    onResume: (call, recorder) => recorder && recorder.resume(),
    onSuspend: (call, recorder) => recorder && recorder.stop(),
    onSuccess: (call, recorder) => {},
    onFail: (call, recorder) => recorder && recorder.undo()
})

export default atomic
