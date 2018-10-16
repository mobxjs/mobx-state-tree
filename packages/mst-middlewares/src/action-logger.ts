import { IMiddlewareEvent, getPath } from "mobx-state-tree"

export function actionLogger(call: IMiddlewareEvent, next: any) {
    const skip =
        (call.type === "action" && call.parentId !== 0) ||
        call.type === "flow_resume" ||
        call.type === "flow_resume_error"

    if (!skip)
        console.log(`[MST] #${call.rootId} ${call.type} - ${getPath(call.context)}/${call.name}`)
    next(call)
}
