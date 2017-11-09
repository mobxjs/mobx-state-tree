# Prebuilt middlewares

The MST package ships with some prebuilt middlewares, which serves mainly as examples on how to write your own middleware.
The source of each middleware can be found in this github directory, you are encouraged to read them!

The middlewares are bundled separately to keep the core package small, and can be included using:


```javascript
import {MiddlewareName} from "mst-middlewares"
```

The middlewares serve as example and are supported on a best effort bases. The goal of these middlewares is that if they are critical to your system, you can simply copy paste them and further tailor them towards your specific needs.

For the exact description of all middleware events offered by MST, see the [api docs](../middleware.md)

# Contributing

Feel free to contribute to these middlewares and improve them on your experience.
The middlewares must be written in TypeScript.
Any additional test for your middleware should be written inside the test folder

---

# simple-action-logger

This is the most basic of middlewares: It logs all _direct_ action invocations. Example:

```javascript
import {simpleActionLogger} from "mst-middlewares"

// .. type definitions ...

const store = Store.create({
    todos: [{ title: "test " }]
})

mst.addMiddleware(store, logger)

store.todos[0].setTitle("hello world")

// Prints:
[MST] /todos/0/setTitle
```

For a more sophisticated logger, see [action-logger](#action-logger) which also logs process invocations and continuations

---

# action-logger

This is a little more sophisticated middlewares: It logs all _direct_ action invocations and also every flow that spawns, returns or throws. Example:

```javascript
import {actionLogger} from "mst-middlewares"

// .. type definitions ...

const store = Store.create({
    todos: [{ title: "test " }]
})

mst.addMiddleware(store, logger)

store.todos[0].setTitle("hello world")
```

This will print something like `[MST] <root action id> <action type> - <path to action>

```
[MST] #5 action - /todos/0/setTitle
[MST] #5 flow_spawn - /todos/0/setTitle
[MST] #5 flow_spawn - /todos/0/helper2
[MST] #5 flow_return - /todos/0/helper2
[MST] #5 flow_return - /todos/0/setTitle
```

The number (`"#5"`) indicates the id of the original action invocation that lead directly or indirectly to the flow being spawned.
For more details on the meaning of the action types see the [middleware docs](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/middleware.md).

---

# atomic

This middleware rolls back if an (asynchronous) action process fails.

The exception itself is not eaten, but any modifications that are made during the (async) action will be rollback, by reverse applying any pending patches. Can be connected to a model by using either `addMiddleware` or `decoratore`

Example:

```javascript
import { types, addMiddleware, process } from "mobx-state-tree"
import {atomic} form "mst-middlewares"

const TestModel = types
    .model({
        z: 1
    })
    .actions(self => {
        addMiddleware(self, atomic)

        return {
            inc: process(function*(x) {
                yield delay(2)
                self.z += x
                yield delay(2)
                self.z += x
                throw "Oops"
            })
        }
    })

const m = TestModel.create()
m.inc(3).catch(error => {
    t.is(error, "Oops")
    t.is(m.z, 1) // Not 7! The change was rolled back
})
```

---

# TimeTraveller

This built in model can be used as stand alone store or as part of your state tree and adds time travelling capabilities.
It records all emitted snapshots by a tree and exposes the following methods / views:

* `canUndo: boolean`
* `canRedo: boolean`
* `undo()`
* `redo()`
* `history`: array with all recorded states

The state of the TimeTraveller itself is stored in a Mobx state tree, meaning that you can freely snapshot your state including its history. This means that it is possible to store your app state including the undo stack in for example local storage.  (but beware that stringify-ing will not benefit from structural sharing).

Usage inside a state tree:

```javascript
import {TimeTraveller} from "mst-middleware"

export const Store = types
    .model({
        todos: types.array(Todo),
        history: types.optional(TimeTraveller, { targetPath: "../todos" })
    })

const store = Store.create()

// later:
if (store.history.canUndo)
    store.history.undo()
// etc
```

Note that the `targetPath` is a path relative to the `TimeTraveller` instance that will indicate which part of the tree will be snapshotted. Please make sure the targetPath doesn't point to a parent of the time traveller, as that would start recording it's own history..... In other words, `targetPath: "../"` -> Boom💥

To instantiate the `TimeTraveller` as a stand-alone state tree, pass in the the store through context:

```javascript
import {TimeTraveller} from "mst-middlewares"

export const Store = types
    .model({
        todos: types.array(Todo),

    })

const store = Store.create()
const timeTraveller = TimeTraveller.create({}, { targetStore: store })

// later:
if (timeTraveller.canUndo)
    timeTraveller.undo()
// etc
```

---

# UndoManager

The `UndoManager` is the more fine grained `TimeTraveller`.
Because it records patches instead of snapshots, it is better at dealing with concurrent and asynchronous processes.
The differences to the `TimeTraveller` make it useful to implement end-user undo / redo.

For an in-depth explanation why undo / redo should be patch, not snapshot, based, check out the second half of the React Next talk:
[MobX-state-tree, React but for data](https://www.youtube.com/watch?v=xfC_xEA8Z1M&index=6&list=PLMYVq3z1QxSqq6D7jxVdqttOX7H_Brq8Z)

Differences to the `TimeTraveller`:

1. It records patches for actions / processes, not snapshots. It's therefore using less memory.
2. `undo` / `redo` applies all inverted patches / patches for a recorded action / process instead of snapshots.
3. An undo state is only comitted to the history if the action / process is finished. Ongoing processes can't be undone.
4. Failing processes do not add an undo state.
5. Multiple concurrent processes only undo their own changes and don't touch the changes caused by other actions - unlike snapshots would.

API:

* `history: { patches: [], inversePatches [] }[]`
* `canUndo: boolean`
* `canRedo: boolean`
* `undo()`
* `redo()`
* `withoutUndo(() => fn)` patches for actions / processes within the fn are not recorded.
* `startGroup(() => fn)` can be used to start a group, all patches within a group are saved as one history entry.
* `stopGroup()` can be used to stop the recording of patches for the grouped history entry.

Setup and API usage examples:

The setup is very similar to the one of the `TimeTraveller`.
The `UndoManager` automatically records all the actions within the tree it is attached to.

If you want the history to be a part of your store:
```javascript
import {UndoManager} from "mst-middlewares"

export const Store = types.model({
    persons: types.array(PersonModel),
    history: types.optional(UndoManager, {})
})

const store = Store.create()
```

To record the changes in another tree:
```javascript
import {UndoManager} from "mst-middlewares"

export const Store = types.model({
    todos: types.array(Todo),
})

const store = Store.create()
const undoManager = UndoManager.create({}, { targetStore: store })
```

Undo/ Redo:
```js
import {undoManager, store} from './Store'

// if the undoManger is created within another tree
const undo1 = () => undoManager.canUndo && undoManager.undo()
const redo1 = () => undoManager.canRedo && undoManager.redo()

// if the undoManger is created within the same tree
const undo2 = () => store.history.canUndo && store.history.undo()
const redo2 = () => store.history.canRedo && store.history.redo()
```

WithoutUndo within a react component:
```js
import {store, undoManger} from '../Store'
...
setPersonName = () => {
    // the action addPerson wont be saved onto the history, you could add more than one action.
    undoManger.withoutUndo(() => store.setPersonName('firstName', 'lastName'))
}

render() {
    return (
        <div onClick={this.setPersonName}>
            SetPersonName
        </div>
    )
}
...
```

WithoutUndo declarative:
```javascript
import {undoManger} from '../Store'
import {types} from 'mobx-state-tree'

const PersonModel = types.model('PersonModel', {
    firstName: types.string,
    lastName: types.string
}).actions(self => {
    return {
        // setPersonName won't be recorded onto the history in general
        setPersonName: (firstName, lastName) => undoManger.withoutUndo(() => {
            self.firstName = firstName
            self.lastName = lastName
        })
    }
})

const StoreModel = types.model('StoreModel', {
    persons: types.map(PersonModel)
}).actions(self => ({
    addPerson(firstName, lastName) {
        persons.put({ firstName, lastName })
    }
}))

export const Store = StoreModel.create({});
export const undoManager = UndoManager.create({}, { targetStore: Store });
```

StartGroup, EndGroup
```
...
handleStop = (mousePosition, { dx, dy }) => {
  this.stopTrackingDrag();
  undoManager.endGroup();
}

handleDrag = (mousePosition, { dx, dy }) => {
  const { view, parentNode } = this.props;
  // only one history entry will be created for the whole dragging
  undoManager.startGroup(() =>
    parentNode.moveSelectedNodes({ dx: dx / view.zoom, dy: dy / view.zoom })
  );
}
...
```

---

# redux

The Redux 'middleware' is not literally middleware, but provides two useful methods for Redux interoperability:

## asReduxStore

`asReduxStore(mstStore, middlewares?)` creates a tiny proxy around a MST tree that conforms to the redux store api.
This makes it possible to use MST inside a redux application.

See the [redux-todomvc example](https://github.com/mobxjs/mobx-state-tree/blob/master/examples/redux-todomvc/src/index.js#L20) for more details.

## connectReduxDevtools

`connectReduxDevtools(remoteDevDependency, mstStore)` connects a MST tree to the Redux devtools. Pass in the `remoteDev` dependency to set up the connect (only one at a time). See this [example](https://github.com/mobxjs/mobx-state-tree/blob/master/examples/redux-todomvc/src/index.js#L21) for a setup example.
