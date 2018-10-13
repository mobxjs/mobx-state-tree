import * as mst from "mobx-state-tree"

export default function simpleActionLogger(call: mst.IMiddlewareEvent, next: any) {
    if (call.type === "action" && call.parentId === 0)
        console.log("[MST] " + mst.getPath(call.context) + "/" + call.name)
    return next(call)
}
