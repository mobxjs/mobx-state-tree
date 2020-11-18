<img src="website/static/img/mobx-state-tree-logo-gradient.png" alt="logo" height="120" align="right" />

# mobx-state-tree

[![npm version](https://badge.fury.io/js/mobx-state-tree.svg)](https://badge.fury.io/js/mobx-state-tree)
[![CircleCI](https://circleci.com/gh/mobxjs/mobx-state-tree.svg?style=svg)](https://circleci.com/gh/mobxjs/mobx-state-tree)
[![Coverage Status](https://coveralls.io/repos/github/mobxjs/mobx-state-tree/badge.svg?branch=master)](https://coveralls.io/github/mobxjs/mobx-state-tree?branch=master)
[![Join the community on Github Discussions](https://img.shields.io/badge/GitHub-Discussions-lightgrey)](https://github.com/mobxjs/mobx-state-tree/discussions)

## What is mobx-state-tree?

Technically speaking, mobx-state-tree (also known as MST) is a state container system built on [MobX](https://github.com/mobxjs/mobx), a functional reactive state library.

This may not mean much to you, and that’s okay. I’ll explain it like this: **MobX is a state management "engine", and MST makes it feel a lot more like Redux by giving it structure.** MST also offers better performance and much less boilerplate than Redux!

As [one of the most popular Redux alternatives](https://2019.stateofjs.com/data-layer/mobx/), MST is used [by companies worldwide](). MST plays very well with TypeScript, React, and React Native, especially when paired with [mobx-react](https://github.com/mobxjs/mobx/tree/main/packages/mobx-react). It supports multiple stores, async actions and side effects, enables extremely targeted re-renders for React apps, and much more -- all in a package with _zero dependencies_ other than MobX itself.

# Getting started

See the [Getting started](https://mobx-state-tree.js.org/intro/getting-started) tutorial or follow the free [egghead.io course](https://egghead.io/courses/manage-application-state-with-mobx-state-tree).

👉 Official docs can be found at [http://mobx-state-tree.js.org/](http://mobx-state-tree.js.org/)

## Quick Code Example

There's nothing quite like looking at some code to get a feel for a library. Check out this small example of an author and list of tweets by that author.

```js
import { types } from "mobx-state-tree"

// Define a couple models
const Author = types.model({
    id: types.identifier,
    firstName: types.string,
    lastName: types.string
})

const Tweet = types.model({
    id: types.identifier,
    author: types.reference(Author),
    body: types.string,
    timestamp: types.number
})

// Define a store just like a model
const RootStore = types.model({
    authors: types.array(Author),
    tweets: types.array(Tweet)
})

// Instantiate a couple model instances
const jamon = Author.create({
    id: "jamon",
    firstName: "Jamon",
    lastName: "Holmgren"
})

const tweet = Tweet.create({
    id: "1",
    author: jamon.id,
    body: "Hello world!",
    timestamp: Date.now()
})

// Now instantiate the store!
const rootStore = RootStore.create({
    author: jamon,
    tweets: [tweet]
})

// Ready to use in a React component or anywhere:
const MyComponent = (props) => {
    return <div>Hello, {rootStore.author.firstName}!</div>
}
```

## Thanks!

-   [Infinite Red](https://infinite.red) for supporting ongoing maintenance on MST.
-   [Mendix](https://mendix.com) for sponsoring and providing the opportunity to work on exploratory projects like MST.
-   [Dan Abramov](https://twitter.com/dan_abramov)'s work on [Redux](http://redux.js.org) has strongly influenced the idea of snapshots and transactional actions in MST.
-   [Giulio Canti](https://twitter.com/GiulioCanti)'s work on [tcomb](http://github.com/gcanti/tcomb) and type systems in general has strongly influenced the type system of MST.
-   All the early adopters encouraging to pursue this whole idea and proving it is something feasible.
