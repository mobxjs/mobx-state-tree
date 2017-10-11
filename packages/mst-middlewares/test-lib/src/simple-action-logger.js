"use strict"
Object.defineProperty(exports, "__esModule", { value: true })
const mobx_state_tree_1 = require("mobx-state-tree")
function simpleActionLogger(call, next) {
    if (call.type === "action" && call.parentId === 0)
        console.log(
            "[MST action call] " + mobx_state_tree_1.getPath(call.context) + "/" + call.name
        )
    return next(call)
}
exports.default = simpleActionLogger
