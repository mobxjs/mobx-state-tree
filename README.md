# mobx-state-tree

## _This package is work in progress, stay tuned_

_Opinionated, transactional, MobX powered state container_
 
[![Build Status](https://travis-ci.org/mobxjs/mobx-state-tree.svg?branch=master)](https://travis-ci.org/mobxjs/mobx-state-tree)
[![Coverage Status](https://coveralls.io/repos/github/mobxjs/mobx-state-tree/badge.svg?branch=master)](https://coveralls.io/github/mobxjs/mobx-state-tree?branch=master)
[![Join the chat at https://gitter.im/mobxjs/mobx](https://badges.gitter.im/mobxjs/mobx.svg)](https://gitter.im/mobxjs/mobx?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

An introduction to the philosophy can be watched [here](https://youtu.be/etnPDw5PKqg?t=32m15s). [Slides](immer-mutable-state.surge.sh). Or, as [markdown](https://github.com/mweststrate/reactive2016-slides/blob/master/slides.md) to read it quickly.


# Installation

NPM:

npm install mobx-state-tree --save-dev

CDN:

https://unpkg.com/mobx-state-tree/mobx-state-tree.umd.js


# Philosophy

`mobx-state-tree` is a state container that combines the _simplicity and ease of mutable data_ with the _traceability of immutable data_ and the _reactiveness and performance of observable data_.

It is an opt-in state container that can be used in MobX, but also Redux based applications.

TODO: slides / reactive conf talk

Unlike MobX itself, mobx-state-tree is quite opinionated on how you structure your data.
This makes it possible to solve many problems generically and out of the box, like:

* (De-) serialization
* Snapshotting state
* Replaying actions
* Time travelling
* Emitting and applying JSON patches
* Protecting state against uncontrolled mutations
* Using middleware
* Using dependency injection
* Maintaining invariants

`mobx-state-tree` tries to take the best features from both object oriented (discoverability, co-location and encapsulation), and immutable based state management approaches (transactionality, sharing functionality through composition).

# Concepts

1. The state is represented as a _tree_ of _models_.
2. _models_ are created using _factories_.
3. A _factory_ basically takes a _snapshot_ and a clone of a base _model_ and copies the two into a fresh _model_ instance.
4. A _snapshot_ is the immutable representation of the _state_ of a _model_. In other words, a one-time copy of the internal state of a model at a certain point in time.
5. _snapshots_ use structural sharing. So a snapshot of a node in the tree is composed of the snapshots of it's children, where unmodified snapshots are always shared
6. `mobx-state-tree` supports JSON patches, replayable actions, listeners for patches, actions and snapshots. References, maps, arrays. Just read on :)

## Models

Models are at the heart of `mobx-state-tree`. They simply store your data.

* Models are self-contained.
* Models have fields. Either primitive or complex objects like maps, arrays or other models. In short, these are MobX observables. Fields can only be modified by actions.
* Models have derived fields. Based on the `mobx` concept of `computed` values.
* Models have actions. Only actions are allowed to change fields. Fields cannot be changed directly. This ensures replayability of the application state.
* Models can contain other models. However, models are not allowed to form a graph (using direct references) but must always have a tree shape. This enables many feature like standardized serialization and cloning.
* Models can be snapshotted at any time
* Models can be created using factories, that take copy a base model and combine it with a (partial) snapshot

Example:

```javascript
import {createFactory, action, mapOf, refenceTo} from "mobx-state-tree"

const Box = createFactory({
    // props
    name: "",
    x: 0,
    y: 0,

    // computed prop
    get width() {
        return this.name.length * 15
    },

    // action
    move: action(function(dx, dy) {
        this.x += dx
        this.y += dy
    })
})

const BoxStore = createFactory({
    boxes: mapOf(Box),
    selection: referenceTo("boxes/name"),
    addBox: action(function(name) {
        this.boxes.set(name, Box({ name, x: 100, y: 100}))
    })
})

const boxStore = BoxStore()
boxStore.addBox("test")
boxStore.boxes.get("test").move(7, 3)
```

Useful methods:

 * `createFactory(exampleModel)`: creates a new factory
 * `clone(model)`: constructs a deep clone of the given model instance

## Snapshots

A snapshot is a representation of a model. Snapshots are immutable and use structural sharing (sinces model can contain models, snapshots can contain other snapshots).
This means that any mutation of a model results in a new snapshot (using structural sharing) of the entire state tree.
This enables compatibility with any library that is based on immutable state trees.

* Snapshots are immutable
* Snapshots can be transported
* Snapshots can be used to update / restore models to a certain state
* Snapshots use structural sharing
* It is posible to subscribe to models and be notified of each new snapshot
* Snapshots are automatically converted to models when needed. So assignments like `boxStore.boxes.set("test", Box({ name: "test" }))` and `boxStore.boxes.set("test", { name: "test" })` are both valid.

Useful methods:

* `getSnapshot(model)`: returns a snapshot representing the current state of the model
* `onSnapshot(model, callback)`: creates a listener that fires whenever a new snapshot is available (but only one per MobX transaction).
* `applySnapshot(model, snapshot)`: updates the state of the model and all its descendants to the state represented by the snapshot

## Actions

Actions modify models. Actions are replayable and are therefore constrained in several ways:

* Actions can be invoked directly as method on a model
* All action arguments must be serializable
* Actions mutate models but do not return values (TODO: or can they?)
* Actions are serializable and replayable
* It is possible to subscribe to the stream of actions that is invoked on a model
* Actions can only modify models that belong to the tree on which they are invoked
* Actions are allowed to invoke other actions, but only if they belong to the same subtree as the original action (this ensures replayability) (TODO: disputable constraint?)
* Actions are automatically bound the their instance, so it is save to pass actions around first class without binding or wrapping in arrow functions.

A serialized action call looks like:
```
{
   name: "setAge"
   path: "/user",
   args: [17]
}
```

Useful methods:

* `action(fn)` constructs
* `onAction(model, middleware)` listens to any action that is invoked on the model or any of it's descendants. See `onAction` for more details.
* `applyAction(model, action)` invokes an action on the model according to the given action description

## Patches

Modifying a model does not only result in a new snapshot, but also in a stream of [JSON-patches](http://jsonpatch.com/) describing which modifications are made.
Patches have the following signature:

```
export interface IJsonPatch {
    op: "replace" | "add" | "remove"
    path: string
    value?: any
}
```

* Patches are constructed according to JSON-Patch, RFC 6902
* Patches are emitted immediately when a mutation is made, and don't respect transaction boundaries (like snapshots)
* Patch listeners can be used to achieve deep observing
* The `path` attribute of a patch considers the relative path of the event from the place where the event listener is attached
* A single mutation can result in multiple patches, for example when splicing an array

Useful methods:

* `onPatch(model, listener)` attaches a patch listener  to the provided model, which will be invoked whenever the model or any of it's descendants is mutated
* `applyPatch(model, patch)` applies a patch to the provided model

## Dependency Injection

The actual signature of all *factory* functions is `(snapshot, environment) => model`.
This makes it possible to associate an environment with a factory created object.
The environment is intended to be an inmutable object context information about the environment, for example which data fetch library should be used etc.
This makes it easy to mock these kind of dependencies, as alternative to requiring singletons that might be needed inside actions.

It is recommended to only provide an environment to the root of your state tree; environments of non-roots might be lost when using functions like `applySnapshot`, `applyPatch`, or `applyAction`.

Useful methods:

`getEnvironment(model, key)` Returns a value from the environment. Environments are stacked; the resolve the environment value the tree is walked up, until a model provides an environment value for the specified key.

Example:

```javascript

const Store = createFactory({
    users: [],
    requestData: action(function() {
        const fetchImpl = getEnvironment(this, "fetch")
        fetchImpl("http://localhost/users").then(this.receiveData)
    }),
    receiveData: action(function(users) {
        // etc...
    })
})
```

const myStore = Store({ users: []}, { fetch: window.fetch })

## Working with references

## Factory composition

## Integrations

# Examples




# API


# FAQ

**Should all state of my app be stored in `mobx-state-tree`?**
No, or, not necessarily. An application can use both state trees and vanilla MobX observables at the same time.
State trees are primarily designed to store your domain data, as this kind of state is often distributed and not very local.
For, for example, local component state, vanilla MobX observables might often be simpler to use.




## Constraints

Some model constructions which are supported by mobx are not supported by mobx-state-tree

* Data graphs are not supported, only data trees
* This means that each object needs to uniquely contained
* Only containment relations are allowed. Associations need to be expressed with 'foreign keys'; strings identifying other objects. However there is a standard pattern enabling using real objects as references with a little boilerplate, see [working with associations](#working-with-associations).
* `mobx-state-tree` does currently not support inheritance / subtyping. This could be changed by popular demand, but not supporting inheritance avoids the need to serialize type information or keeping a (global) type registery

## Features

* Provides immutable, structurally shared snapshots which can be used as serialization or for time travelling. Snapshots consists entirely of plain objects.
* Provides [JSON patch](https://tools.ietf.org/html/rfc6902) streams for easy remote synchronization or easy diffing.
* Each object is uniquely contained and has an explicit path like in a file system. This enables using relative references and is very useful for debugging.
* State trees are composable
* There can be many state trees in a single app.

## Comparison with immutable state trees

So far this might look a lot like an immutable state tree as found for example in Redux apps, but there are a few differences:

* mobx-state-tree allow direct modification of any value in the tree, it is not needed to construct a new tree in your actions
* mobx-state-tree allows for fine grained and efficient observability on any point in the state tree
* mobx-state-tree generates json patches for any modification that is made
* (?) mobx-state-tree is a valid redux store, providing the same api (TODO)



# Working with assocations

```javascript
import { resolve } from "mobx-state-tree"

class Message {
    @observable _author = "103"

    @computed get author() {
        return resolve(this, `/users`, this._author)
    }
    set author(author: User) {
        this._author = author ? author.id : null
    }
}
```
