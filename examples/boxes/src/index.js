import ReactDOM from 'react-dom';
import React from 'react';
import {observable, asReference} from 'mobx';
import {observer} from 'mobx-react';
import {onSnapshot, applySnapshot, onPatch, applyPatch, onAction, applyAction, connectReduxDevtools} from 'mobx-state-tree';

import store from './stores/domain-state';
import Canvas from './components/canvas';

const socket = new WebSocket("ws://localhost:3001");
/**
 * To support HMR of store, this ref holds the latest loaded store.
 */
const storeInstance = observable(null);

function prepareStore(newStore) {
    storeInstance.set(newStore)
    connectReduxDevtools(newStore)

    let supress = false
    onAction(newStore, (data, next) => {
        next()
        if (!supress)
            socket.send(JSON.stringify(data))
    })
    socket.onmessage = event => {
        supress = true
        applyAction(newStore, JSON.parse(event.data))
        supress = false
    }
}

prepareStore(store)



const App = observer(() => <Canvas store={storeInstance.get()} />)

ReactDOM.render(
    <App />,
    document.getElementById('root')
);


/**
    Replace the storeInstance if a new domain-state is available
*/
if (module.hot) {
    // accept update of dependency
    module.hot.accept("./stores/domain-state", function() {
        // obtain new store
        prepareStore(require("./stores/domain-state").default)
    });
}