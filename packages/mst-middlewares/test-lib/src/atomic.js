"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const mobx_state_tree_1 = require("mobx-state-tree")
const atomic = mobx_state_tree_1.createActionTrackingMiddleware({
    filter: call => call.parentId === 0,
    onStart: call => mobx_state_tree_1.recordPatches(call.tree),
    onResume: (call, recorder) => recorder.resume(),
    onSuspend: (call, recorder) => recorder.stop(),
    onSuccess: (call, recorder) => {},
    onFail: (call, recorder) => recorder.undo()
})
exports.default = atomic
