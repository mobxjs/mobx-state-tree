---
id: philosophy
title: Overview & Philosophy
---

<div id="codefund"></div>

`mobx-state-tree` (also known as "MST") is a state container that combines the _simplicity and ease of mutable data_ with the _traceability of immutable data_ and the _reactiveness and performance of observable data_.

Simply put, MST tries to combine the best features of both immutability (transactionality, traceability and composition) and mutability (discoverability, co-location and encapsulation) based approaches to state management; everything to provide the best developer experience possible.
Unlike MobX itself, MST is very opinionated about how data should be structured and updated.
This makes it possible to solve many common problems out of the box.

Central in MST is the concept of a _living tree_. The tree consists of mutable, but strictly protected objects enriched with _runtime type information_. In other words, each tree has a _shape_ (type information) and _state_ (data).
From this living tree, immutable, structurally shared, snapshots are automatically generated.

```javascript
import { types, onSnapshot } from "mobx-state-tree"

const Todo = types
    .model("Todo", {
        title: types.string,
        done: false
    })
    .actions((self) => ({
        toggle() {
            self.done = !self.done
        }
    }))

const Store = types.model("Store", {
    todos: types.array(Todo)
})

// create an instance from a snapshot
const store = Store.create({
    todos: [
        {
            title: "Get coffee"
        }
    ]
})

// listen to new snapshots
onSnapshot(store, (snapshot) => {
    console.dir(snapshot)
})

// invoke action that modifies the tree
store.todos[0].toggle()
// prints: `{ todos: [{ title: "Get coffee", done: true }]}`
```

By using the type information available, snapshots can be converted to living trees, and vice versa, with zero effort.
Because of this, [time travelling](https://github.com/coolsoftwaretyler/mst-example-boxes/blob/main/src/stores/time.js) is supported out of the box, and tools like HMR are trivial to support [example](https://github.com/coolsoftwaretyler/mst-example-boxes/blob/main/src/stores/domain-state.js#L94).

The type information is designed in such a way that it is used both at design- and run-time to verify type correctness (Design time type checking works in TypeScript only at the moment; Flow PR's are welcome!)

```
[mobx-state-tree] Value '{\"todos\":[{\"turtle\":\"Get tea\"}]}' is not assignable to type: Store, expected an instance of Store or a snapshot like '{ todos: { title: string; done: boolean }[] }' instead.
```

_Runtime type error_

![typescript error](/img/tserror.png)

_Designtime type error_

Because state trees are living, mutable models, actions are straight-forward to write; just modify local instance properties where appropriate. See the `toggle()`-action in the Todo-store above or the examples below. It is not necessary to produce a new state tree yourself, MST's snapshot functionality will derive one for you automatically.

Although mutable sounds scary to some, fear not, actions have many interesting properties.
By default trees can only be modified by using an action that belongs to the same subtree.
Furthermore, actions are replayable and can be used to distribute changes ([unclear example, where is the code to look at?](https://github.com/coolsoftwaretyler/mst-example-boxes/blob/main/src/stores/socket.js)).

Moreover, because changes can be detected on a fine grained level, JSON patches are supported out of the box.
Simply subscribing to the patch stream of a tree is another way to sync diffs with, for example, back-end servers or other clients ([example](https://github.com/coolsoftwaretyler/mst-example-boxes/blob/main/src/stores/socket.js)).

![patches](/img/patches.png)

Since MST uses MobX behind the scenes, it integrates seamlessly with [mobx](https://mobx.js.org) and [mobx-react-lite (or mobx-react)](https://mobx.js.org/react-integration.html). See also this [egghead.io lesson: Render mobx-state-tree Models in React](https://egghead.io/lessons/react-render-mobx-state-tree-models-in-react).
Even cooler, because it supports snapshots, middleware and replayable actions out of the box, it is possible to replace a Redux store and reducer with a MobX state tree.
This makes it possible to connect the Redux devtools to MST. See the [Redux / MST TodoMVC example](https://github.com/coolsoftwaretyler/mst-example-redux-todomvc/blob/main/src/index.js#L6).

---

For futher reading: the conceptual difference between snapshots, patches and actions in relation to distributing state changes is extensively discussed in this [blog post](https://medium.com/@mweststrate/distributing-state-changes-using-snapshots-patches-and-actions-part-1-2811a2fcd65f)

![devtools](/img/reduxdevtools.png)

Finally, MST has built-in support for references, identifiers, dependency injection, change recording and circular type definitions (even across files).
Even fancier, it analyses liveliness of objects, failing early when you try to access accidentally cached information! (More on that later)

A unique feature of MST is that it offers liveliness guarantees. MST will throw an exception when reading or writing from objects that are no longer part of a state tree. This protects you against accidental stale reads of objects still referred by, for example, a closure.

```javascript
const oldTodo = store.todos[0]
store.removeTodo(0)

function logTodo(todo) {
    setTimeout(() => console.log(todo.title), 1000)
}

logTodo(store.todos[0])
store.removeTodo(0)
// throws exception in one second for using an stale object!
```

Despite all that, you will see that in practice the API is quite straightforward!

---

Another way to look at mobx-state-tree is to consider it, as argued by Daniel Earwicker, to be ["React, but for data"](http://danielearwicker.github.io/json_mobx_Like_React_but_for_Data_Part_2.html).
Like React, MST consists of composable components, called _models_, which captures a small piece of state. They are instantiated from props (snapshots) and after that manage and protect their own internal state (using actions). Moreover, when applying snapshots, tree nodes are reconciled as much as possible. There is even a context-like mechanism, called environments, to pass information to deep descendants.

An introduction to the philosophy can be watched [here](https://youtu.be/ta8QKmNRXZM?t=21m52s). [Slides](https://immer-mutable-state.surge.sh/). Or, as [markdown](https://github.com/mweststrate/reactive2016-slides/blob/master/slides.md) to read it quickly.

mobx-state-tree "immutable trees" and "graph model" features talk, ["Next Generation State Management"](https://www.youtube.com/watch?v=rwqwwn_46kA) at React Europe 2017. [Slides](http://tree.surge.sh/#1).
