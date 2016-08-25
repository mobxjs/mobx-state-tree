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
These trees have build in support for snapshotting, intercepting changes and providing streams with JSON patches

## Constraints

Some model constructions which are supported by mobx are not supported by mobx-state-tree

* Data graphs are not supported, only data trees
* This means that each object needs to uniquely contained
* Only containment relations are allowed. Associations need to be expressed with 'foreign keys'; strings identifying other objects. However there is a standard pattern enabling using real objects as references with a little boilerplate, see [working with associations](#working-with-associations).

## Features

* Supports 'rich' objects baesd on classes / prototypes etc.
* Provides immutable, structurally shared snapshots which can be used as serialization or for time travelling. Snapshots consists entirely of plain objects.
* Provides [JSON patch](https://tools.ietf.org/html/rfc6902) streams for easy remote synchronization or easy diffing.
* Each object is uniquely contained and has an explicit path like in a file system. This enables using relative references and is very useful for debugging.
* State trees are composable
* There can be many state trees in a single app.

## Comparison with immutable state trees

So far this might look a lot like an immutable state tree as found for example in Redux apps, but there are a few differences:

* mobx-state-tree allow direct modification of any value in the tree, it is not needed to construct a new tree in your actions
* mobx-state-tree is not limited to using plain objects. It supports objects / prototypes / classes / factory functions.
* mobx-state-tree allows for fine grained and efficient observability on any point in the state tree
* mobx-state-tree generates json patches for any modification that is made
* (?) mobx-state-tree is a valid redux store, providing the same api (TODO)

# Creating and using a state tree

# Composing state trees


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
