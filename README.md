<p align="center">
	   <img src="docs/logo.png" height="100">
    <h3 align="center">mobx-state-tree</h3>
    <p align="center"><i>Opinionated, transactional, MobX powered state container combining the best features of the immutable and mutable world for an optimal DX</i><p>
</p>

[![Build Status](https://travis-ci.org/mobxjs/mobx-state-tree.svg?branch=master)](https://travis-ci.org/mobxjs/mobx-state-tree)
[![Coverage Status](https://coveralls.io/repos/github/mobxjs/mobx-state-tree/badge.svg?branch=master)](https://coveralls.io/github/mobxjs/mobx-state-tree?branch=master)
[![Join the chat at https://gitter.im/mobxjs/mobx](https://badges.gitter.im/mobxjs/mobx.svg)](https://gitter.im/mobxjs/mobx?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

**DISCLAIMER: Docs are still being worked on, so if you are confused at any point; we hope to see you back soon, or feel free to open issue or join the gitter channel**

# Contents

* [Installation](#installation)
* [Getting Started](docs/getting-started.md)
* [Philosophy & Overview](#philosophy--overview)
* [Examples](#examples)
* [Concepts](#concepts)
  * [Trees, types and state](#trees-types-and-state)
  * [Creating models](#creating-models)
  * [Tree semantics in detail](#tree-semantics-in-detail)
  * [Composing trees](#composing-trees)
  * [Actions](#actions)
  * [Snapshots](#snapshots)
  * [Patches](#patches)
  * [References and identifiers](#references-and-identifiers)
  * [Listening to observables, snapshots, patches or actions](#listening-to-observables-snapshots-patches-or-actions)
  * [Volatile state](#volatile-state)
  * [Dependency injection](#dependency-injection)
* [Types overview](#types-overview)
  * [Lifecycle hooks](https://github.com/mobxjs/mobx-state-tree#lifecycle-hooks-for-typesmodel)
* [Api overview](#api-overview)
* [Tips](#tips)
* [FAQ](#FAQ)
* [Full Api Docs](API.md)
* [Changelog](changelog.md)

# Installation

* NPM: `npm install mobx-state-tree --save`
* Yarn: `yarn add mobx-state-tree`
* CDN: https://unpkg.com/mobx-state-tree@0.8.2/dist/mobx-state-tree.umd.js (exposed as `window.mobxStateTree`)
* Playground: [https://mattiamanzati.github.io/mobx-state-tree-playground/](https://mattiamanzati.github.io/mobx-state-tree-playground/) (with React UI, snapshots, patches and actions display)
* CodeSandbox [TodoList demo](https://codesandbox.io/s/nZ26kGMD) fork for testing and bug reporting
* JSBin [playground](http://jsbin.com/petoxeheta/edit?html,js,console) (for non console based fiddles)

Typescript typings are included in the packages. Use `module: "commonjs"` or `moduleResolution: "node"` to make sure they are picked up automatically in any consuming project.

# Getting started

See the [Getting started](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/getting-started.md#getting-started) tutorial.

# Philosophy & Overview

`mobx-state-tree` is a state container that combines the _simplicity and ease of mutable data_ with the _traceability of immutable data_ and the _reactiveness and performance of observable data_.

Simply put, mobx-state-tree tries to combine the best features of both immutability (transactionality, traceability and composition) and mutability (discoverability, co-location and encapsulation) based approaches to state management; everything to provide the best developer experience possible.
Unlike MobX itself, mobx-state-tree is very opinionated on how data should be structured and updated.
This makes it possible to solve many common problems out of the box.

Central in MST (mobx-state-tree) is the concept of a *living tree*. The tree consists of mutable, but strictly protected objects enriched with _runtime type information_. In other words; each tree has a _shape_ (type information) and _state_ (data).
From this living tree, immutable, structurally shared, snapshots are generated automatically.

```javascript
import { types, onSnapshot } from "mobx-state-tree"

const Todo = types.model("Todo", {
    title: types.string,
    done: false
}, {
    toggle() {
        this.done = !this.done
    }
})

const Store = types.model("Store", {
    todos: types.array(Todo)
})

// create an instance from a snapshot
const store = Store.create({ todos: [{
    title: "Get coffee"
}]})

// listen to new snapshots
onSnapshot(store, (snapshot) => {
    console.dir(snapshot)
})

// invoke action that modifies the tree
store.todos[0].toggle()
// prints: `{ todos: [{ title: "Get coffee", done: true }]}`
```

By using the type information available, snapshots can be converted to living trees, and vice versa, with zero effort.
Because of this, [time travelling](https://github.com/mobxjs/mobx-state-tree/blob/master/examples/boxes/src/stores/time.js) is supported out of the box, and tools like HMR are trivial to support [example](https://github.com/mobxjs/mobx-state-tree/blob/4c2b19ec4a6a8d74064e4b8a87c0f8b46e97e621/examples/boxes/src/stores/domain-state.js#L94).

The type information is designed in such a way that it is used both at design- and run-time to verify type correctness (Design time type checking works in TypeScript only at the moment; Flow PR's are welcome!)

```
[mobx-state-tree] Value '{\"todos\":[{\"turtle\":\"Get tea\"}]}' is not assignable to type: Store, expected an instance of Store or a snapshot like '{ todos: { title: string; done: boolean }[] }' instead.
```

_Runtime type error_

![typescript error](docs/tserror.png)

_Designtime type error_

Because state trees are living, mutable models, actions are straight-forward to write; just modify local instance properties where appropiate. See `toggleTodo()` above or the examples below. It is not necessary to produce a new state tree yourself, MST's snapshot functionality will derive one for you automatically.

Although mutable sounds scary to some, fear not: actions have many interesting properties.
By default trees can only be modified by using an action that belongs to the same subtree.
Furthermore, actions are replayable and can be used to distribute changes ([example](https://github.com/mobxjs/mobx-state-tree/blob/master/examples/boxes/src/stores/socket.js)).

Moreover, because changes can be detected on a fine grained level, JSON patches are supported out of the box.
Simply subscribing to the patch stream of a tree is another way to sync diffs with, for example, back-end servers or other clients ([example](https://github.com/mobxjs/mobx-state-tree/blob/master/examples/boxes/src/stores/socket.js)).

![patches](docs/patches.png)

Since MST uses MobX behind the scenes, it integrates seamlessly with [mobx](https://mobx.js.org) and [mobx-react](https://github.com/mobxjs/mobx-react).
But even cooler: because it supports snapshots, middleware and replayable actions out of the box, it is even possible to replace a Redux store and reducer with a MobX state tree.
This makes it even possible to connect the Redux devtools to MST. See the [Redux / MST TodoMVC example](https://github.com/mobxjs/mobx-state-tree/blob/4c2b19ec4a6a8d74064e4b8a87c0f8b46e97e621/examples/redux-todomvc/src/index.js#L6).

![devtools](docs/reduxdevtools.png)

Finally, MST has built-in support for references, identifiers, dependency injection, change recording and circular type definitions (even across files).
Even fancier: it analyses liveliness of objects, failing early when you try to access accidentally cached information! (More on that later)

A pretty unique feature of MST is that it offers liveliness guarantees; it will throw when reading or writing from objects that are for no longer part of a state tree. This protects you against accidental stale reads of objects still referred by, for example, a closure.

```javascript
const oldTodo = store.todos[0]
store.removeTodo(0)

function logTodo(todo) {
    setTimeout(
        () => console.log(todo.title),
        1000
    )
)

logTodo(store.todos[0])
store.removeTodo(0)
// throws exception in one second for using an stale object!
```


Despite all that, you will see that the [API](API.md) is pretty straightforward!

---

Another way to look at mobx-state-tree is to consider it, as argued by Daniel Earwicker, to be ["React, but for data"](http://danielearwicker.github.io/json_mobx_Like_React_but_for_Data_Part_2_.html).
Like React, MST consists of composable components, called *models*, which capture a small piece of state. They are instantiated from props (snapshots) and after that manage and protect their own internal state (using actions). Moreover, when applying snapshots, tree nodes are reconciled as much as possible. There is even a context-like mechanism, called environments, to pass information to deep descendants.

An introduction to the philosophy can be watched [here](https://youtu.be/ta8QKmNRXZM?t=21m52s). [Slides](https://immer-mutable-state.surge.sh/). Or, as [markdown](https://github.com/mweststrate/reactive2016-slides/blob/master/slides.md) to read it quickly.

mobx-state-tree "immutable trees" and "graph model" features talk, ["Next Generation State Management"](https://www.youtube.com/watch?v=rwqwwn_46kA) at React Europe 2017. [Slides](http://tree.surge.sh/#1).

# Examples

* [Bookshop](https://github.com/mobxjs/mobx-state-tree/tree/master/examples/bookshop) Example webshop application with references, identifiers, routing, testing etc.
* [Boxes](https://github.com/mobxjs/mobx-state-tree/tree/master/examples/boxes) Example app where one can draw, drag, and drop boxes. With time-travelling and multi-client synchronization over websockets.
* [Redux TodoMVC](https://github.com/mobxjs/mobx-state-tree/tree/master/examples/redux-todomvc) Redux TodoMVC application, except that the reducers are replaced with a MST. Tip: open the Redux devtools; they will work!

# Concepts

With MobX state tree, you build, as the name suggests, trees of models.

### Trees, types and state

Each **node** in the tree is described by two things: Its **type** (the shape of the thing) and its **data** (the state it is currently in).

The simplest tree possible:

```javascript
import {types} from "mobx-state-tree"

// declaring the shape of a node with the type `Todo`
const Todo = types.model({
    title: types.string
})

// creating a tree based on the "Todo" type, with initial data:
const coffeeTodo = Todo.create({
    title: "Get coffee"
})
```

The `types.model` type declaration is used to describe the shape of an object.
Other built-in types include arrays, maps, primitives etc. See the [types overview](#types-overview).
The type information will be used for both.


### Creating models

The most important type in MST is `types.model`, which can be used to describe the shape of an object.
An example:

```javascript
const TodoStore = types.model("TodoStore", {      // 1
    loaded: types.boolean                         // 2
    endpoint: "http://localhost",                 // 3
    todos: types.array(Todo),                     // 4
    selectedTodo: types.reference(Todo),          // 5
    get completedTodos() {                        // 6
        return this.todos.filter(t => t.done)
    },
    findTodosByUser(user) {                       // 7
        return this.todos.filter(t => t.assignee === user)
    }
}, {
    addTodo(title) {
        this.todos.push({
            id: Math.random(),
            title
        })
    }
})
```

When defining a model, it is advised to give the model a name for debugging purposes (see `// 1`).
A model takes two objects arguments, first all the properties, then the actions.

The _properties_ argument is a key-value set where each key indicates the introduction of a property, and the value its type. The following types are acceptable:

1. A type. This can be a simple primitive type like `types.boolean`, see `// 2`, or a complex, possibly pre-defined type (`// 4`)
2. A primitive. Using a primitive as type as type is syntactic sugar for introducing an property with a default value. See `// 3`, `endpoint: "http://localhost"` is the same as `endpoint: types.optional(types.string, "http://localhost")`. The primitive type is inferred from the default value. Properties with a default value can be omitted in snapshots.
3. A [computed property](https://mobx.js.org/refguide/computed-decorator.html), see `// 6`. Computed properties are tracked and memoized by MobX. Computed properties will not be stored in snapshots or emit patch events. It is possible to provide a setter for a computed property as well. A setter should always invoke an action.
4. A view function (see `// 7`). A view function can, unlike computed properties, take arbitrary arguments. It won't be memoized, but its value can be tracked by Mobx nonetheless. View functions are not allowed to change the model, but should rather be used to retrieve information from the model.

The _actions_ argument is a key-value set with actions that are available to manage the model. Only actions are allowed to manage models (including any contained objects).

It is also possible to define lifecycle hooks in the _actions_ object, these are actions with a predefined name that are run at a specific moment. See [Lifecycle hooks](#lifecycle-hooks-for-typesmodel).

_Tip: Note that `{ action1() { }, action2() { }}` is ES6 syntax for `{ action1: function() { }, action2: function() { } }`, in other words; it's just an object literal.
For that reason a comma between each member of a model is mandatory, unlike classes which are syntactically a totally different concept._

### Tree semantics in detail

MST trees have very specific semantics. These semantics purposefully constrain what you can do with MST. The reward for that is all kinds of generic features out of the box like snapshots, replayability, etc... If these constraints don't suit your app, you are probably better of using plain mobx with your own model classes. Which is perfectly fine as well.

1. Each object in a MST tree is concidered a _node_. Each primitive (and frozen) value is considered a _leaf_.
1. MST has only three types of nodes; _model_, _array_, and _map_.
1. Every _node_ tree in a MST tree is a tree in itself. Any operation that can be invoked on the complete tree can also be applied to a sub tree.
1. A node can only exist exactly _once_ in a tree. This ensures it has an unique, identifiable position.
2. It is however possible to refer to another object in the _same_ tree by using _references_
3. There is no limit to the amount of MST trees that live in an application. However, each node can only live in exactly one tree.
4. All _leaves_ in the tree must be serializable; it is not possible to store, for example, functions in a MST.
6. The only free-form type in MST is frozen; with the requirement that frozen values are immutable so that the MST semantics can still be upheld.
7. At any point in the tree it is possible to assign a snapshot to the tree instead of a concrete instance of the expect type. In that case an instance of the correct type, based on the snapshot, will be automatically created for you.
8. Nodes in the MST tree will be reconciled (the exact same instance will be reused) when updating the tree by any means, based on their _identifier_ property. If there is no identifier property, instances won't be reconciled.
9. If a node in the tree is replaced by another node, the original node will die and become unusable. This makes sure you are not accidentally holding on to stale objects anywhere in your application.
10. If you want to create a new node based on an existing node in a tree, you can either `detach` that node, or `clone` it.

### Composing trees

In MST every node in the tree is a tree in itself.
Trees can be composed by composing their types:

```javascript
const TodoStore = types.model({
    todos: types.array(Todo)
})

const storeInstance = TodoStore.create({
    todos: [{
        title: "Get biscuit"
    }]
})
```

The _snapshot_ passed to the `create` method of a type will recursively be turned in MST nodes. So you can safely call:

```javascript
storeInstance.todos[0].setTitle("Chocolate instead plz")
```

Because any node in a tree is an tree in itself, any built-in method in MST can be invoked on any node in the tree, not just the root.
This makes it possible to get a patch stream of a certain subtree, or to apply middleware to a certain subtree only.

### Actions

By default, nodes can only be modified by one of their actions, or by actions higher up in the tree.
Actions can be defined by passing a second object to to `types.model`:

```javascript
const Todo = types.model({
    title: types.string
}, {
    setTitle(newTitle) {
        this.title = newTitle
    }
})
```

Actions are replayable and are therefore constrained in several ways:

- Trying to modify a node without using an action will throw an exception.
- All action arguments should be serializable. Some arguments can be serialized automatically, such as relative paths to other nodes
- Actions can only modify models that belong to the (sub)tree on which they are invoked
- Actions are automatically bound to their instance, so it is safe to pass actions around without binding them or wrapping them in arrow functions.

Useful methods:

-   `onAction(model, listener)` listens to any action that is invoked on the model or any of its descendants. See `onAction` for more details.
-   `addMiddleware(model, middleware)` listens to any action that is invoked on the model or any of its descendants. See `addMiddleware` for more details.
-   `applyAction(model, action)` invokes an action on the model according to the given action description

#### Asynchronous actions

Asynchronous actions have first class support in MST and are described in more detail [here](docs/async-actions.md#asynchronous-actions-and-middleware).
Asynchronous actions are written by using generators and always return a promise. A quick example to get the gist:

```javascript
*fetchProjects() { // <- note the star, this a generator function!
    this.state = "pending"
    try {
        // ... yield can be used in async/await style
        this.githubProjects = yield fetchGithubProjectsSomehow().then(
        this.state = "done"
    } catch (e) {
        // ... including try/catch error handikng
        console.error("Failed to fetch projects", error)
        this.state = "error"
    }
    // The action will return a promise that resolves to the returned value
    // (or rejects with anything thrown from the action)
    return this.githubProjects.length
}
```

#### Action listeners versus middleware

The difference between action listeners and middleware is: Middleware can intercept the action that is about to be invoked, modify arguments, return types etc. Action listeners cannot intercept, and are only notified. Action listeners receive the action arguments in a serializable format, while middleware receive the raw arguments. (`onAction` is actually just a built-in middleware)

#### Disabling protected mode

This may be desired if the default protection of mobx-state-tree doesn't fit your use case. For example, if you are not interested in replayable actions, or hate the effort of writing actions to modify any field; `unprotect(tree)` will disable the protected mode of a tree, allowing anyone to directly modify the tree.

### Snapshots

Snapshots are the immutable serialization, in plain objects, of a tree at a specific point in time.
Snapshots can be inspected through `getSnapshot(node)`.
Snapshots don't contain any type information and are stripped from all actions etc, so they are perfectly suitable for transportation.
Requesting a snapshot is cheap, as MST always maintains a snapshot of each node in the background, and uses structural sharing

```javascript
coffeeTodo.setTitle("Tea instead plz")

console.dir(getSnapshot(coffeeTodo))
// prints `{ title: "Tea instead plz" }`
```

Some interesting properties of snapshots:

-   Snapshots are immutable
-   Snapshots can be transported
-   Snapshots can be used to update models or restore them to a particular state
-   Snapshots are automatically converted to models when needed. So the two following statements are equivalent: `store.todos.push(Todo.create({ title: "test" }))` and `store.todos.push({ title: "test" })`.
Useful methods:

-   `getSnapshot(model)`: returns a snapshot representing the current state of the model
-   `onSnapshot(model, callback)`: creates a listener that fires whenever a new snapshot is available (but only one per MobX transaction).
-   `applySnapshot(model, snapshot)`: updates the state of the model and all its descendants to the state represented by the snapshot

## Patches

Modifying a model does not only result in a new snapshot, but also in a stream of [JSON-patches](http://jsonpatch.com/) describing which modifications were made.
Patches have the following signature:

    export interface IJsonPatch {
        op: "replace" | "add" | "remove"
        path: string
        value?: any
    }

-   Patches are constructed according to JSON-Patch, RFC 6902
-   Patches are emitted immediately when a mutation is made, and don't respect transaction boundaries (like snapshots)
-   Patch listeners can be used to achieve deep observing
-   The `path` attribute of a patch contains the path of the event, relative to the place where the event listener is attached
-   A single mutation can result in multiple patches, for example when splicing an array
-   Patches can be reverse applied, which enables many powerful patterns like undo / redo

Useful methods:

-   `onPatch(model, listener)` attaches a patch listener to the provided model, which will be invoked whenever the model or any of its descendants is mutated
-   `applyPatch(model, patch)` applies a patch (or array of patches) to the provided model
-   `revertPatch(model, patch)` reverse applies a patch (or array of patches) to the provided model. This replays the inverse of a set of patches to an model, which can be used to bring it back to it's original state

### References and identifiers

References and identifiers are a first-class concept in MST.
This makes it possible to declare references, and keep the data normalized in the background, while you interact with it in a denormalized manner.

Example:
```javascript
const Todo = types.model({
    id: types.identifier(),
    title: types.string
})

const TodoStore = types.model({
    todos: types.array(Todo),
    selectedTodo: types.reference(Todo)
})

// create a store with a normalized snapshot
const storeInstance = TodoStore.create({
    todos: [{
        id: "47",
        title: "Get coffee"
    }],
    selectedTodo: "47"
})

// because `selectedTodo` is declared to be a reference, it returns the actual Todo node with the matching identifier
console.log(storeInstance.selectedTodo.title)
// prints "Get coffee"
```

#### Identifiers

-   Each model can define zero or one `identifier()` properties
-   The identifier property of an object cannot be modified after initialization
-   Each identifiers / type combination should be unique within the entire tree
-   Identifiers are used to reconcile items inside arrays and maps - wherever possible - when applying snapshots
-   The `map.put()` method can be used to simplify adding objects that have identifiers to maps
-   The primary goal of identifiers is not validation, but reconciliation and reference resolving. For this reason identifiers cannot be defined or updated after creation. If you want to check if some value just looks as an identifier, without providing the above semantics; use something like: `types.refinement(types.string, v => v.match(/someregex/))`

_Tip: If you know the format of the identifiers in your application, leverage `types.refinement` to actively check this, for example the following definition enforces that identifiers of `Car` always start with the string `Car_`:_

```javascript
const Car = types.model("Car", {
    id: types.identifier(types.refinement(types.string, identifier => identifier.indexOf("Car_") === 0))
})
```

#### References

References are defined by mentioning the type they should resolve to. The targeted type should have exactly one attribute of the type `identifier()`.
References are looked up through the entire tree, but per type. So identifiers need to be unique in the entire tree.

### Listening to observables, snapshots, patches or actions

MST is powered by MobX. This means that it is immediately compatible with `observer` components, or reactions like `autorun`:

```javascript
import { autorun } from "mobx"

autorun(() => {
    console.log(storeInstance.selectedTodo.title)
})
```

But, because MST keeps immutable snapshots in the background, it is also possible to be notified when a new snapshot of the tree is available. This is similar to `.subscribe` on a redux store:

```javascript
onSnapshot(storeInstance, newSnapshot => {
    console.dir("Got new state: ", newSnapshot)
})
```

However, sometimes it is more useful to precisely know what has changed, rather than just receiving a complete new snapshot.
For that, MST supports json-patches out of the box

```javascript
onPatch(storeInstance, patch => {
    console.dir("Got change: ", patch)
})

storeInstance.todos[0].setTitle("Add milk")
// prints:
{
    path: "/todos/0",
    op: "replace",
    value: "Add milk"
}
```

Similarly, you can be notified whenever an action is invoked by using `onAction`

```javascript
onAction(storeInstance, call => {
    console.dir("Action was called: ", call)
})

storeInstance.todos[0].setTitle("Add milk")
// prints:
{
    path: "/todos/0",
    name: "setTitle",
    args: ["Add milk"]
}
```

It is even possible to intercept actions before they are applied by adding middleware using `addMiddleware`:

```javascript
addMiddleware(storeInstance, (call, next) => {
    call.args[0] = call.args[0].replace(/tea/gi, "Coffee")
    return next(call)
})
```

A more extensive middleware example can be found in this [code sandbox](https://codesandbox.io/s/mQrqy8j73)

Finally, it is not only possible to be notified about snapshots, patches or actions; it is also possible to re-apply them by using `applySnapshot`, `applyPatch` or `applyAction`!

## Volatile state

MST models primarily aid in storing _persistable_ state. State that can be persisted, serialized, transferred, patched, replaced etc.
However, sometimes you need to keep track of temporary, non persistable state. This is called _volatile_ state in MST. Examples include promises, sockets, DOM elements etc - state which is needed for local purposes as long as the object is alive.

Volatile state can be introduced by passing another object to `types.model`, between the *properties* and the *actions*. (If there are only two objects passed, MST will assume these to be properties and actions. In order for volatile state to be meaningful, you always need actions to operate on them).

Volatile is preserved for the life-time of an object, and not reset when snapshots are applied etc. Note that the life time of an object depends on proper reconciliation, see below.

The following is an example of an object with volatile state. Note that volatile state here is used to track a XHR request, and clean up resources when it is disposed. Without volatile state this kind of information would need to be stored in an external WeakMap, or something similar.

```javascript
// pseudo code
const Store = types.model({
    todos: types.array(Todo),
    get isLoading() {
        return this.pendingRequest.state === "pending"
    }
}, {
    pendingRequest: null
}, {
    afterCreate() {
        this.pendingRequest = someXhrLib.createRequest("someEndpoint")
    },
    beforeDestroy() {
        // abort the request, no longer interested
        this.pendingRequest.abort()
    }
})
```

To initialize a volatile file, either:
1. Supply a primitive value (`pendingRequest: null`)
2. Use `afterCreate` to initialize the field (as done above)
3. Provide a function to produce the first value. Both the scope and first argument of that function will be the target instance. Requiring a function avoids accidental sharing of a non-primitive value accross all instances of a type. Example: `pendingRequest: (instance) => someXhrLib.createRequest("http://endpoint/" + instance.id)`

_Tip: To strongly-type volatile state using Typescript, without initialzing the default yet, use a double cast: For example use `{ pendingRequest: null as any as Promise<Stuff> }` so that the type of `pendingRequest` will always be a promise (Note: make sure to initialize it in `afterCreate` hook or declare the type as `{ pendingRequest: null as any as (Promise<Stuff> | null) }`)_

## Dependency injection

When creating a new state tree it is possible to pass in environment specific data by passing an object as the second argument to a `.create` call.
This object should be (shallowly) immutable and can be accessed by any model in the tree by calling `getEnv(this)`.

This is useful to inject environment, or test-specific utilities like a transport layer, loggers etc. This is a very useful to mock behavior in unit tests or provide instantiated utilities to models without requiring singleton modules.
See also the (bookshop example)[https://github.com/mobxjs/mobx-state-tree/blob/a4f25de0c88acf0e239acb85e690e91147a8f0f0/examples/bookshop/src/stores/ShopStore.test.js#L9] for inspiration.

```javascript
import { types, getEnv } from "mobx-state-tree"

const Todo = types.model({
    title: ""
}, {
    setTitle(newTitle) {
        // grab injected logger and log
        getEnv(this).logger.log("Changed title to: " + newTitle)
        this.title = newTitle
    }
})

const Store = types.model({
    todos: types.array(Todo)
})

// setup logger and inject it when the store is created
const logger = {
    log(msg) {
        console.log(msg)
    }
}

const store = Store.create({
    todos: [{ title: "Grab tea" }]
}, {
    logger: logger // inject logger to the tree
})

store.todos[0].setTitle("Grab coffee")
// prints: Changed title to: Grab coffee
```


# Types overview

These are the types available in MST. All types can be found in the `types` namespace, e.g. `types.string`. See [Api Docs](API.md) for examples.

## Complex types

* `types.model(properties, actions)` Defines a "class like" type, with properties and actions to operate on the object.
* `types.array(type)` Declares an array of the specified type
* `types.map(type)` Declares an map of the specified type

## Primitive types

* `types.string`
* `types.number`
* `types.boolean`
* `types.Date`

## Utility types

* `types.union(dispatcher?, types...)` create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.
* `types.optional(type, defaultValue)` marks an value as being optional (in e.g. a model). If a value is not provided the `defaultValue` will be used instead. If `defaultValue` is a function, it will be evaluated. This can be used to generate, for example, IDs or timestamps upon creation.
* `types.literal(value)` can be used to create a literal type, where the only possible value is specifically that value. This is very powerful in combination with `union`s. E.g. `temperature: types.union(types.literal("hot"), types.literal("cold"))`.
* `types.enumeration(name?, options: string[])` creates an enumeration. This method is a shorthand for a union of string literals.
* `types.refinement(name?, baseType, (snapshot) => boolean)` creates a type that is more specific then the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.
* `types.maybe(type)` makes a type optional and nullable, shorthand for `types.optional(types.union(type, types.literal(null)), null)`.
* `types.null` the type of `null`
* `types.undefined` the type of `undefined`
* `types.late(() => type)` can be used to create recursive or circular types, or types that are spread over files in such a way that circular dependencies between files would be an issue otherwise.
* `types.frozen` Accepts any kind of serializable value (both primitive and complex), but assumes that the value itself is immutable.
* `types.compose(name?, type1...typeX)`, creates a new model type by taking a bunch of existing types and combining them into a new one
* `types.compose(name?, baseType, props, volatileState?, actions?)`, creates a new model type by taking an existing type and introducing additional properties, state and actions

## Property types

Property types can only be used as a direct member of a `types.model` type and not further composed (for now).
* `types.identifier(subType?)` Only one such member can exist in a `types.model` and should uniquely identify the object. See [identifiers](#identifiers) for more details. `subType` should be either `types.string` or `types.number`, defaulting to the first if not specified.
* `types.reference(targetType)` creates a property that is a reference to another item of the given `targetType` somewhere in the same tree. See [references](#references) for more details.

## LifeCycle hooks for `types.model`

| Hook            | Meaning                                                                                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `preProcessSnapshot` | Before creating an instance or applying a snapshot to an existing instance, this hook is called to give the option to transform the snapshot before it is applied. The hook should bea _pure_ function that returns a new snapshot. This can be useful to do some data conversion, enrichment, property renames etc. This hook is not called for individual property updates. |
| `afterCreate`   | Immediately after an instance is created and initial values are applied. Children will fire this event before parents                                     |
| `afterAttach`   | As soon as the _direct_ parent is assigned (this node is attached to an other node)                                                                       |
| `postProcessSnapshot` | This hook is called every time a new snapshot is being generated. Typically it is the inverse function of `preProcessSnapshot`. This function should be a pure function that returns a new snapshot.
| `beforeDetach`  | As soon as the node is removed from the _direct_ parent, but only if the node is _not_ destroyed. In other words, when `detach(node)` is used             |
| `beforeDestroy` | Called before the node is destroyed, as a result of calling `destroy`, or by removing or replacing the node from the tree. Child destructors will fire before parents |

Note, all hooks should be defined as actions.

# Api overview

See the [full API docs](https://github.com/mobxjs/mobx-state-tree/blob/master/API.md) for more details.

| signature | |
| ---- | --- |
| `addDisposer(node, () => void) ` | Function to be invoked whenever the target node is to be destroyed |
| `addMiddleware(node, middleware: (actionDescription, next) => any)` | Attaches middleware to a node. See [actions](#actions). Returns disposer. |
| `applyAction(node, actionDescription)` | Replays an action on the targeted node |
| `applyPatch(node, jsonPatch)` | Applies a JSON patch, or array of patches, to a node in the tree |
| `applySnapshot(node, snapshot)` | Updates a node with the given snapshot |
| `asReduxStore(node)` | Wraps a node in a Redux-store compatible API |
| `clone(node, keepEnvironment?: true \| false \| newEnvironment)` | Creates a full clone of the given node. By default preserves the same environment |
| `connectReduxDevtools(removeDevModule, node)` | Connects a node to the Redux development tools [example](https://github.com/mobxjs/mobx-state-tree/blob/b01fe97d427ca664f7ecc99349d10e58d08d2d98/examples/redux-todomvc/src/index.js)  |
| `destroy(node)` | Kills `node`, making it unusable. Removes it from any parent in the process |
| `detach(node)` | Removes `node` from its current parent, and lets it live on as standalone tree |
| `getChildType(node, property?)` | Returns the declared type of the given `property` of `node`. For arrays and maps `property` can be omitted as they all have the same type |
| `getEnv(node)` | Returns the environment of `node`, see [environments](#environments) |
| `getParent(node, depth=1)` | Returns the intermediate parent of the `node`, or a higher one if `depth > 1` |
| `getPath(node)` | Returns the path of `node` in the tree |
| `getPathParts(node)` | Returns the path of `node` in the tree, unescaped as separate parts |
| `getRelativePath(base, target)` | Returns the short path, which one could use to walk from node `base` to node `target`, assuming they are in the same tree. Up is represented as `../` |
| `getRoot(node)` | Returns the root element of the tree containing `node` |
| `getSnapshot(node)` | Returns the snapshot of the `node`. See [snapshots](#snapshots) |
| `getType(node)` | Returns the type of `node` |
| `hasParent(node, depth=1)` | Returns `true` if `node` has a parent at `depth` |
| `isAlive(node)` | Returns `true` if `node` is alive |
| `isStateTreeNode(value)` | Returns `true` if `value` is a node of a mobx-state-tree |
| `isProtected(value)` | Returns `true` if the given node is protected, see [actions](#actions) |
| `isRoot(node)` | Returns true if `node` has no parents  |
| `joinJsonPath(parts)` | Joins and escapes the given path `parts` into a JSON path |
| `onAction(node, (actionDescription) => void` | A built-in middleware that calls the provided callback with an action description upon each invocation. Returns disposer |
| `onPatch(node, (patch) => void)` | Attach a JSONPatch listener, that is invoked for each change in the tree. Returns disposer |
| `onSnapshot` | Attach a snapshot listener, that is invoked for each change in the tree. Returns disposer |
| `protect` | Protects an unprotected tree against modifications from outside actions |
| `recordActions(node)` | Creates a recorder that listens to all actions in `node`. Call `.stop()` on the recorder to stop this, and `.replay(target)` to replay the recorded actions on another tree  |
| `recordPatches` | Creates a recorder that listens to all patches emitted by the node. Call `.stop()` on the recorder to stop this, and `.replay(target)` to replay the recorded patches on another tree |
| `resolve(node, path)` | Resolves a `path` (json path) relatively to the given `node` |
| `revertPatch(node, jsonPatch)` | Inverse applies a JSON patch or array of patches to `node` |
| `splitJsonPath(path)` | Splits and unescapes the given JSON `path` into path parts |
| `tryResolve(node, path)` | Like `resolve`, but just returns `null` if resolving fails at any point in the path |
| `unprotect(node)` | Unprotects `node`, making it possible to directly modify any value in the subtree, without actions |
| `walk(startNode, (node) => void)` | Performs a depth-first walk through a tree |
| `escapeJsonPath(path)` | escape special characters in an identifier, according to http://tools.ietf.org/html/rfc6901 |
| `unescapeJsonPath(path)` | escape special characters in an identifier, according to http://tools.ietf.org/html/rfc6901 |
| `resolveIdentifier(type, target, identifier)` | resolves an identifier of a given type in a model tree |
| `resolvePath(target, path)` | resolves a JSON path, starting at the specified target |

A _disposer_ is a function that cancels the effect it was created for.

# Tips

### `optionals` and default value functions

`types.optional` can takes as default function also a function, which will be invoked each time the default value is needed. This is useful to generate timestamps, identifiers or even complex objects:

`createdDate: types.optional(types.date, () => new Date())`

### `toJSON()` for debugging

For debugging you might want to use `getSnapshot(model)` to print the state of a model. But if you didn't import `getSnapshot` while debugging in some debugger; don't worry, `model.toJSON()` will produce the same snapshot. (For API consistency, this feature is not part of the typed API)

### Handle circular dependencies between files using `late`

On the exporting file:

```javascript
export function LateStore() {
    return types.model({
        title: types.string
    })
}
```

In the importing file
```javascript
import { LateStore } from "./circular-dep"

const Store = types.late(() => LateStore)
```

Thanks to function hoisting in combination with `types.late`, this lets you have circular dependencies between types, across files.

### Simulate inheritance by using type composition

There is no notion of inheritance in MST. The recommended approach is to keep references to the original configuration of a model in order to compose it into a new one, for example by using `types.compose`. So a classical animal inheritance could be expressed using composition as follows:

```javascript
const Square = types.model(
    "Square",
    {
        width: types.number,
        surface() {
            return this.width * this.width
        }
    }
)

const Box = types.compose(
    "Box",
    Square, // Base type, copy properties, state and actions from this type
    {
        // new properties
        volume() {
            // super call
            return Square.actions.surface.call(this) * this.width
        }
    },
    { }, // new volatile state
    { }, // new actions
)

// no inheritance, but, union types and code reuse
const Shape = types.union(Box, Square)
```

### Creating enumerations

There is no built-in type for enumerations, but enumerations can simply be constructed by combining unions and literals:

```javascript
const Temperature = types.union(types.literal("Hot"), types.literal("Cold"))
```

Or, fancier:

```javascript
const Temperature = types.union(...["Hot", "Cold"].map(types.literal))
```

# FAQ

### How does reconcilation work?

* When applying snapshots, MST will always try to reuse existing object instances for snapshots with the same identifier (see `types.identifier()`).
* If no identifier is specified, but the type of the snapshot is correct, MST will reconcile objects as well if they are stored in a specific model property or under the same map key.
* In arrays, items without identifier are never reconciled

If an object is reconciled, the consequence is that localState is preserved and `postCreate` / `attach` life-cycle hooks are not fired because applying a snapshot results just in an existing tree node being updated.

### Creating async processes

See [creating asynchronous process](docs/async-actions.md).

### Using mobx and mobx-state-tree together

Yep, perfectly fine. No problem. Go on. `observer`, `autorun` etc will work as expected.

### Should all state of my app be stored in `mobx-state-tree`?
No, or, not necessarily. An application can use both state trees and vanilla MobX observables at the same time.
State trees are primarily designed to store your domain data, as this kind of state is often distributed and not very local.
For local component state, for example, vanilla MobX observables might often be simpler to use.

### TypeScript & MST

TypeScript support is best-effort, as not all patterns can be expressed in TypeScript. But except for assigning snapshots to properties we get pretty close! As MST uses the latest fancy Typescript features it is recommended to use TypeScript 2.3 or higher, with `noImplicitThis` and `strictNullChecks` enabled.

When using models, you write an interface, along with its property types, that will be used to perform type checks at runtime.
What about compile time? You can use TypeScript interfaces to perform those checks, but that would require writing again all the properties and their actions!

Good news! You don't need to write it twice! Using the `typeof` operator of TypeScript over the `.Type` property of a MST Type will result in a valid TypeScript Type!

```typescript
const Todo = types.model({
    title: types.string
}, {
    setTitle(v: string) {
        this.title = v
    }
})
type ITodo = typeof Todo.Type // => ITodo is now a valid TypeScript type with { title: string; setTitle: (v: string) => void }
```

### How does MST compare to Redux

So far this might look a lot like an immutable state tree as found for example in Redux apps, but there are a few differences:

-   like Redux, and unlike MobX, MST prescribes a very specific state architecture.
-   mobx-state-tree allows direct modification of any value in the tree; it is not necessary to construct a new tree in your actions.
-   mobx-state-tree allows for fine-grained and efficient observation of any point in the state tree.
-   mobx-state-tree generates JSON patches for any modification that is made.
-   mobx-state-tree provides utilties to turn any MST tree into a valid Redux store.
-   having multiple MSTs in a single application is perfectly fine.


## Thanks!

* [Mendix](https://mendix.com) for sponsoring and providing the opportunity to work on exploratory projects like MST.
* [Dan Abramov](https://twitter.com/dan_abramov)'s work on [Redux](http://redux.js.org) has strongly influenced the idea of snapshots and transactional actions in MST.
* [Giulio Canti](https://twitter.com/GiulioCanti)'s work on [tcomb](http://github.com/gcanti/tcomb) and type systems in general has strongly influenced the type system of MST.
* All the early adopters encouraging to pursue this whole idea and proving it is something feasible.
