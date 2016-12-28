import {getSnapshot, onAction, IActionCall, applySnapshot} from "../"
const { connectViaExtension, extractState } = require("remotedev")

export function connectReduxDevtools(model: any) {
    // Connect to the monitor
    const remotedev = connectViaExtension()
    let applyingSnapshot = false

    // Subscribe to change state (if need more than just logging)
    remotedev.subscribe(message => {
        // Helper when only time travelling needed
        const state = extractState(message)
        if (state) {
            applyingSnapshot = true
            applySnapshot(model, state)
            applyingSnapshot = false
        }
    })

    // Send changes to the remote monitor
    onAction(model, (action: IActionCall, next) => {
        next()
        if (applyingSnapshot)
            return
        const copy: any = {}
        copy.type = action.name
        if (action.args)
            action.args.forEach((value, index) => copy[index] = value)
        remotedev.send(copy, getSnapshot(model))
    })
}
