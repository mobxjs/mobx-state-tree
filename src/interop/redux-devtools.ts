import {getSnapshot, onAction, IActionCall} from "../"

export function connectReduxDevtools(model: any): boolean {
    if (typeof window !== "undefined" && window["__REDUX_DEVTOOLS_EXTENSION__"]) {
        const devtools = window["__REDUX_DEVTOOLS_EXTENSION__"]
        devtools.connect()
        devtools.send("mobx-tree-init", getSnapshot(model))
        onAction(model, (action: IActionCall, next) => {
            next()
            const copy: any = {}
            copy.type = action.name
            if (action.args)
                action.args.forEach((value, index) => copy[index] = value)
            devtools.send(copy, getSnapshot(model))
        })
        return true
    }
    return false
}