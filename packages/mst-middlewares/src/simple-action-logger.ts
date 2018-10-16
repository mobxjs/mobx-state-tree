import { IMiddlewareEvent, getPath } from "mobx-state-tree"

export default function simpleActionLogger(call: IMiddlewareEvent, next: any) {
    if (call.type === "action" && call.parentId === 0)
        console.log("[MST] " + getPath(call.context) + "/" + call.name)
    return next(call)
}
