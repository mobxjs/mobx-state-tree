# Prebuilt middlewares

The MST package ships with some prebuilt middlewares, which serves mainly as examples on how to write your own middleware.
The source of each middleware can be found in this github directory, you are encouraged to read them!

The middlewares are bundled separately to keep the core package small, and can be included using:


```javascript
import MiddleWarename from "mobx-state-tree/middleware/middlewarename"
```

The middlewares serve as example and are supported on a best effort bases. The goal of these middlewares is that if they are critical to your system, you can simply copy paste them and further tailor them towards your specific needs.

For the exact description of all middleware events offered by MST, see the [api docs](../middleware.md)

# Contributing

Feel free to contribute to these middlewares and improve them on your experience.
The middlewares must be written in valid ES5. `.spec` files will be run automatically and individually and needs to be written in ES5-ish as well.

---

# simple-action-logger

This is the most basic of middlewares: It logs all _direct_ action invocations. Example:

```javascript
import logger from "mobx-state-tree/middleware/simple-action-logger"

// .. type definitions ...

const store = Store.create({
    todos: [{ title: "test " }]
})

mst.addMiddleware(store, logger)

store.todos[0].setTitle("hello world")

// Prints:
[MST action call] /todos/0/setTitle
```

For a more sophisticated logger, see [process-logger](#process-logger) which also logs process invocations and continuations

---

# atomic

This middleware rolls back if an (asynchronous) action process fails.

The exception itself is not eaten, but any modifications that are made during the (async) action will be rollback, by reverse applying any pending patches. Can be connected to a model by using either `addMiddleware` or `decoratore`

Example:

```javascript
import { types, addMiddleware, process } from "mobx-state-tree"
import atomic form "mobx-state-tree/middleware/atomic"

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
import TimeTraveller from "mobx-state-tree/middleware/TimeTraveller"

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
import TimeTraveller from "mobx-state-tree/middleware/TimeTraveller"

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

# redux

The Redux 'middleware' is not literally middleware, but provides two useful methods for Redux interoperability:

## asReduxStore

`asReduxStore(mstStore, middlewares?)` creates a tiny proxy around a MST tree that conforms to the redux store api.
This makes it possible to use MST inside a redux application.

See the [redux-todomvc example](https://github.com/mobxjs/mobx-state-tree/blob/master/examples/redux-todomvc/src/index.js#L20) for more details.

## connectReduxDevtools

`connectReduxDevtools(remoteDevDependency, mstStore)` connects a MST tree to the Redux devtools. Pass in the `remoteDev` dependency to set up the connect (only one at a time). See this [example](https://github.com/mobxjs/mobx-state-tree/blob/master/examples/redux-todomvc/src/index.js#L21) for a setup example.