import {observable, transaction, action, autorun, spy} from 'mobx';
import {createFactory, arrayOf, mapOf, getSnapshot, applySnapshot, getParent, hasParent, referenceTo, onPatch} from 'mobx-state-tree';

import {randomUuid} from '../utils';

export const Arrow = createFactory({
    id: '',
    fromId: '',
    toId: '',
    get from() {
        if (!hasParent(this))
            return null
        return getParent(this).boxes.get(this.fromId)
    },
    get to() {
        if (!hasParent(this))
            return null
        return getParent(this).boxes.get(this.toId)
    }
})

export const Box = createFactory({
    id: '',
    name: '',
    x: 0,
    y: 0,
    get width() {
        return this.name.length * 15;
    },
    get isSelected() {
        if (!hasParent(this))
            return false
        return getParent(this).selection === this
    },
    move: action(function(dx, dy) {
        this.x += dx
        this.y += dy
    }),
    setName: action(function(newName) {
        this.name = newName
    })
})

export const Store = createFactory({
    boxes: mapOf(Box),
    arrows: arrayOf(Arrow),
    selection: referenceTo("/boxes/id"),
    addBox: action(function(name, x, y) {
        const id = randomUuid()
        this.boxes.set(id, Box({ name, x, y, id }))
    }),
    addArrow: action(function(fromId, toId) {
        this.arrows.push(Arrow({ id: randomUuid(), fromId, toId }))
    }),
    setSelection: action(function(selection) {
        this.selection = selection // TODO: remove action by emitting in reference
    }),
    createBox: action(function(name, x, y) {
        this.addBox(name, x, y)
        // TODO: set selection
    })
})

/*
    The store that holds our domain: boxes and arrows
*/
const store = Store({
    "boxes":{
        "ce9131ee-f528-4952-a012-543780c5e66d": {"id":"ce9131ee-f528-4952-a012-543780c5e66d","name":"Rotterdam","x":100,"y":100},
        "14194d76-aa31-45c5-a00c-104cc550430f": {"id":"14194d76-aa31-45c5-a00c-104cc550430f","name":"Bratislave","x":650,"y":300}
    },
    "arrows":[
        {"id":"7b5d33c1-5e12-4278-b1c5-e4ae05c036bd","fromId":"ce9131ee-f528-4952-a012-543780c5e66d","toId":"14194d76-aa31-45c5-a00c-104cc550430f"}
    ],
    "selection_id":""
})

export default store;
window.store = store; // for demo

/**
    Generate 'amount' new random arrows and boxes
*/
export function generateStuff(amount) {
    transaction(() => {
        for(var i = 0; i < amount; i++) {
            store.addBox('#' + i, Math.random() * window.innerWidth * 0.5, Math.random() * window.innerHeight);
            store.addArrow(
                store.boxes[Math.floor(Math.random() * store.boxes.length)].id,
                store.boxes[Math.floor(Math.random() * store.boxes.length)].id
            );
        }
    });
}

/**
    Save / Restore the state of the store while this module is hot reloaded
*/
if (module.hot) {
    if (module.hot.data && module.hot.data.store) {
        applySnapshot(store, module.hot.data.store);
    }
    module.hot.dispose((data) => {
        data.store = getSnapshot(store);
    });
}
