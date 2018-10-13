import * as mst from "mobx-state-tree"

const atomic = mst.createActionTrackingMiddleware({
    filter: call => call.parentId === 0,
    onStart: call => mst.recordPatches(call.tree),
    onResume: (call, recorder) => recorder.resume(),
    onSuspend: (call, recorder) => recorder.stop(),
    onSuccess: (call, recorder) => {},
    onFail: (call, recorder) => recorder.undo()
})

export default atomic
