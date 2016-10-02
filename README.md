# mobx-state-tree

Opinionated state container for MobX powered applications

[![Build Status](https://travis-ci.org/mobxjs/mobx-state-tree.svg?branch=master)](https://travis-ci.org/mobxjs/mobx-state-tree)
[![Coverage Status](https://coveralls.io/repos/github/mobxjs/mobx-state-tree/badge.svg?branch=master)](https://coveralls.io/github/mobxjs/mobx-state-tree?branch=master)
[![Join the chat at https://gitter.im/mobxjs/mobx](https://badges.gitter.im/mobxjs/mobx.svg)](https://gitter.im/mobxjs/mobx?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Installation

# Philosophy

MobX is unopionated about how state is structured throughout your application.
This gives a lot of flexibility but makes it also harder to make generic tools for MobX applications, like a standardized serialization or time travelling mechanism.
The `mobx-state-tree` is an opt-in standardized state container that enforces certain constraints making it easier to build generic extensions on top of it.

`mobx-state-tree` allows you to create, as the name suggests, state trees.
These trees have build in support for snapshotting, intercepting changes, dispatching action and providing streams with JSON patches

`mobx-state-tree` tries to combine the best ideas from both the mutable and immutable state management paradigms. How that works.. read on.
What benefits that has:

1. Mutable data structures are very efficient. MobX can establish fine-grained observers on mutable data structures and derive UI, values and effects very efficiently from observable data structures.
2. It is trivial to write actions for mutable data structures.
3. Immutable data structures on the other hand are very easy to serialize, clone, and transport.
4. Immutable data structures can be used efficiently for time travelling.
5. Replayable actions can easily be distributed.
6. Or check the examples below to see which cool things can be done using a hybrid approach!

# Concepts

## Models

Models are at the heart of `mobx-state-tree`. They simply store your data.

* Models are self-contained.
* Models have fields. Either primitive or complex objects like maps, arrays or other models. In short, these are MobX observables. Fields can only be modified by actions.
* Models have derived fields. Based on the `mobx` concept of `computed` values.
* Models have actions. Only actions are allowed to change fields. Fields cannot be changed directly. This ensures replayability of the application state.
* Models can contain other models. However, models are not allowed to form a graph (using direct references) but must always have a tree shape. This enables many feature like standardized serialization and cloning.
* Last but not least, models always have a `snapshot`

## Snapshots

A snapshot is a representation of a model. Snapshots are immutable and use structural sharing (sinces model can contain models, snapshots can contain other snapshots).
This means that any mutation of a model results in a new snapshot (using structural sharing) of the entire state tree.
This enables compatibility with any library that is based on immutable state trees.

* Snapshots are immutable
* Snapshots can be transported
* Snapshots can be used to update / restore models to a certain state
* Snapshots use structural sharing
* It is posible to subscribe to models and be notified of each new snapshot

## Actions

Actions modify models. Actions are replayable and are therefor constrained in several ways:

* Actions can be invoked directly as method on a model
* All action arguments must be serializable
* Actions mutate models but do not return values (Todo: or can they?)
* Actions are serializable and replayable
* It is possible to subscribe to the stream of actions that is invoked on a model
* Actions can only modify models that belong to the tree on which they are invoked

## Factories

## Patches

Modifying a model does not only result in a new snapshot, but also in a stream of [JSON-patches](http://jsonpatch.com/) describing which modifications are made.
This means

## Environments

# Cool examples:





## FAQ

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
