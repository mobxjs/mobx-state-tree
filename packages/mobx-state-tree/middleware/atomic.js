import { createActionTrackingMiddleware, recordPatches } from "mobx-state-tree"

const atomic = createActionTrackingMiddleware({
    filter: call => call.parentId === 0,
    onStart: call => recordPatches(call.tree),
    onResume: (call, recorder) => recorder.resume(),
    onSuspend: (call, recorder) => recorder.stop(),
    onSuccess: (call, recorder) => {},
    onFail: (call, recorder) => recorder.undo()
})

export default atomic
