---
id: welcome
title: Welcome to MobX-State-Tree!
---

<div id="codefund"></div>

**_Full-featured reactive state management without the boilerplate._**

## What is MobX-State-Tree?

Technically speaking, MobX-State-Tree (also known as MST) is a state container system built on [MobX](https://github.com/mobxjs/mobx), a functional reactive state library.

This may not mean much to you, and that’s okay. I’ll explain it like this: **MobX is a state management "engine", and MobX-State-Tree gives it structure and common tools you need for your app.** MST is valuable in a large team but also useful in smaller applications when you expect your code to scale rapidly. And if we compare it to Redux, MST offers better performance and much less boilerplate code than Redux!

MobX is [one of the most popular Redux alternatives](https://2019.stateofjs.com/data-layer/mobx/) and is used (along with MobX-State-Tree) by companies all over the world, including Netflix, Grow, IBM, DAZN, Baidu, and more.

It supports a full set of features for a modern state management system -- all in a package with _zero dependencies_ other than MobX itself.

_Note: you don't need to know how to use MobX in order to use MST._

### Ten reasons you should use MobX-State-Tree:

1. **MST works great** in React, React Native, Vue, Angular, Svelte, and even barebones JavaScript apps
2. Instead of being scattered throughout your app, MST provides **centralized stores** for your data
3. Your data is **mutable**, but can only be mutated in "actions", so it's _easy to use_ but also _protected_
4. Via **runtime type checking**, you can't accidentally assign the wrong data type to a property
5. TypeScript can infer **static types** from your runtime types automatically
6. Every update to your data is traced and you can quickly **generate snapshots** of your state at any time
7. MST has built-in support for references so you can **normalize your data** across your whole app
8. **Side effects** can be managed via async flows, which are basically long-running actions
9. Using snapshots, you can do **time-travel debugging** or logging of state changes over time
10. MST has a **robust community** and a large, active core team

## Basic example

_You can play with it in [this CodeSandbox playground](https://codesandbox.io/s/boring-pond-cmooq?file=/src/index.js)._

```javascript
import { types, onSnapshot } from "mobx-state-tree"

// A tweet has a body (which is text) and whether it's read or not
const Tweet = types
    .model("Tweet", {
        body: types.string,
        read: false // automatically inferred as type "boolean" with default "false"
    })
    .actions((tweet) => ({
        toggle() {
            tweet.read = !tweet.read
        }
    }))

// Define the Twitter "store" as having an array of tweets
const TwitterStore = types.model("TwitterStore", {
    tweets: types.array(Tweet)
})

// create your new Twitter store instance with some initial data
const twitterStore = TwitterStore.create({
    tweets: [
        {
            body: "Anyone tried MST?"
        }
    ]
})

// Listen to new snapshots, which are created anytime something changes
onSnapshot(twitterStore, (snapshot) => {
    console.log(snapshot)
})

// Let's mark the first tweet as "read" by invoking the "toggle" action
twitterStore.tweets[0].toggle()

// In the console, you should see the result: `{ tweets: [{ body: "Anyone tried MST?", read: true }]}`
```

## Next Steps

-   Learn how to [install MobX-State-Tree](./installation.md) or jump straight to our [Getting Started](./getting-started.md) guide!
-   View [examples](./examples.md) here.
-   If you're interested in the philosophy behind MobX-State-Tree and a lot more explanation of features and benefits, check out the [Philosophy](./philosophy.md) page.
-   Or check out a talk or two on our [Resources](./../tips/resources.md) page
