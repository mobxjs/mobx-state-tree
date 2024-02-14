---
id: welcome
title: Welcome to MobX-State-Tree!
---

<div id="codefund"></div>

**_Full-featured reactive state management without the boilerplate._**

## What is MobX-State-Tree?

MobX-State-Tree (MST) is a [batteries included](<https://en.wikipedia.org/wiki/Batteries_Included#:~:text=%22Batteries%20included%22%20(slang)%2C%20in%20a%20product%20usability%20(mostly%20in%20software)%20it%20states%20that%20the%20product%20comes%20together%20with%20all%20possible%20parts%20required%20for%20full%20usability>) state management library. It only requires **one peer dependency**, and will provide you with:

1. **Centralized stores** for your data
2. **Mutable, but protected data**, which means it is easy to work with your data, but safe to modify.
3. **Serializable and traceable updates**. The mutable, protected nature of MobX-State-Tree data means you can **generate snapshots** and do **time-travel debugging**.
4. **Side effect management**, so you don't need to write `useEffect` hooks or their equivalent to manage the consequences of data mutations. You can do it all from MST itself.
5. **Runtime type checking**, so you can't accidentally assign the wrong data type to a property
6. **Static type checking** with TypeScript inference from your runtime types - automatically!
7. **Data normalization** - MST has support for references, so you can normalize data across your application code.
8. **Warm, welcoming community**. We pride ourselves on a healthy and kind open source community.

## Basic Example

Here's what MST code looks like:

_You can play with it in [this CodeSandbox playground](https://codesandbox.io/s/boring-pond-cmooq?file=/src/index.js)._

```javascript
import { t, onSnapshot } from "mobx-state-tree"

// A tweet has a body (which is text) and whether it's read or not
const Tweet = t
  .model("Tweet", {
    body: t.string,
    read: false // automatically inferred as type "boolean" with default "false"
  })
  .actions((tweet) => ({
    toggle() {
      tweet.read = !tweet.read
    }
  }))

// Define the Twitter "store" as having an array of tweets
const TwitterStore = t.model("TwitterStore", {
  tweets: t.array(Tweet)
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

## Video Demonstration

Jamon Holmgren has an excellent introduction video with a more realistic, robust example of MobX-State-Tree and React. Check it out!

<iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/n_VjjJxyd8Q?si=RxMDaUi7ExERZQsx" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## MobX Ecosystem

[MobX](https://github.com/mobxjs/mobx) is [one of the most popular Redux alternatives](https://2019.stateofjs.com/data-layer/mobx/) and is used (along with MobX-State-Tree) by companies all over the world, including Netflix, Grow, IBM, DAZN, Baidu, and more.

If you're wondering how MobX-State-Tree is distinct from MobX, you can think of it like this: **MobX is a state management "engine", and MobX-State-Tree is a luxury car**. MST gives you the structure, tools, and other features to get you where you're going. MST is valuable in a large team but also useful in smaller applications when you expect your code to scale rapidly. And if we compare it to Redux, MST offers better performance with much less boilerplate code than Redux!

Since MST uses MobX under the hood, MobX-State-Tree works with the MobX bindings for React, React Native, Vue, Angular, Svelte, and even barebones JavaScript apps.

_You don't need to know how to use MobX in order to use MST._ Just like you don't need to know how your car's engine works to be an excellent driver. It can help, but it's not necessary.

## Next Steps

- Learn how to [install MobX-State-Tree](./installation.md) or jump straight to our [Getting Started](./getting-started.md) guide!
- View [examples](./examples.md) here.
- If you're interested in the philosophy behind MobX-State-Tree and a lot more explanation of features and benefits, check out the [Philosophy](./philosophy.md) page.
- Or check out a talk or two on our [Resources](./../tips/resources.md) page
