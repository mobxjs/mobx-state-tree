"use strict"

const mst = require("mobx-state-tree")

module.exports = function(call, next) {
    if (call.type === "action" && call.parentId === 0)
        console.log("[MST action call] " + mst.getPath(call.context) + "/" + call.name)
    return next(call)
}
