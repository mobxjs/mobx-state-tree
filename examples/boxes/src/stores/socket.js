import {onSnapshot, applySnapshot, onPatch, applyPatch, onAction, applyAction} from 'mobx-state-tree';

let subscription;

export default function syncStoreWithBackend(socket, store) {
    let isHandlingMessage = false

    subscription = onSnapshot(store, (data, next) => {
        // next()
        if (!isHandlingMessage)
            socket.send(JSON.stringify(data))
    })

    socket.onmessage = event => {
        isHandlingMessage = true
        applySnapshot(store, JSON.parse(event.data))
        isHandlingMessage = false
    }
}

/**
 * Clean up old subscription when switching communication system
 */
if (module.hot) {
    module.hot.dispose((data) => {
        subscription()
    });
}