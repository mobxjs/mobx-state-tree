import {observable, transaction, action, autorun, spy} from 'mobx';
import {types, getSnapshot, applySnapshot, getParent, hasParent, onPatch} from 'mobx-state-tree';

import {randomUuid} from '../utils';

export const Box = types.model("Box", {
    id: types.identifier(),
    name: '',
    x: 0,
    y: 0,
    get width() {
        return this.name.length * 15;
    },
    get isSelected() {
        if (!hasParent(this))
            return false
        return getParent(getParent(this)).selection === this
    },
    move(dx, dy) {
        this.x += dx
        this.y += dy
    },
    setName(newName) {
        this.name = newName
    }
})

export const Arrow = types.model("Arrow", {
    id: types.identifier(),
    from: types.reference(Box, "../../boxes"),
    to: types.reference(Box, "../../boxes")
})

export const Store = types.model("Store", {
    boxes: types.map(Box),
    arrows: types.array(Arrow),
    selection: types.reference(Box, "./boxes"),
    addBox(name, x, y) {
        const box = Box.create({ name, x, y, id: randomUuid() })
        this.boxes.put(box)
        return box
    },
    addArrow(from, to) {
        this.arrows.push(Arrow.create({ id: randomUuid(), from, to }))
    },
    setSelection(selection) {
        this.selection = selection
    },
    createBox(name, x, y, source) {
        const box = this.addBox(name, x, y)
        this.setSelection(box)
        if (source)
            this.addArrow(source.id, box.id)
    }
})

/*
    The store that holds our domain: boxes and arrows
*/
const store = Store.create({
    "boxes":{
        "ce9131ee-f528-4952-a012-543780c5e66d": {"id":"ce9131ee-f528-4952-a012-543780c5e66d","name":"Rotterdam","x":100,"y":100},
        "14194d76-aa31-45c5-a00c-104cc550430f": {"id":"14194d76-aa31-45c5-a00c-104cc550430f","name":"Bratislava","x":650,"y":300}
    },
    "arrows":[
        {"id":"7b5d33c1-5e12-4278-b1c5-e4ae05c036bd","from":"ce9131ee-f528-4952-a012-543780c5e66d","to":"14194d76-aa31-45c5-a00c-104cc550430f"}
    ],
    "selection":""
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
