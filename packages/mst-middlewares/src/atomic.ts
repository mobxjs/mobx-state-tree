import { createActionTrackingMiddleware, recordPatches, IPatchRecorder } from "mobx-state-tree"

const atomic = createActionTrackingMiddleware<IPatchRecorder>({
    filter: call => !call.parentId,
    onStart: call => recordPatches(call.tree),
    onResume: (call, recorder) => recorder.resume(),
    onSuspend: (call, recorder) => recorder.stop(),
    onSuccess: (call, recorder) => {},
    onFail: (call, recorder) => recorder.undo()
})

export default atomic
