---
id: faq
title: Frequently Asked Questions
---

<div id="codefund"></div>

### Should all state of my app be stored in `mobx-state-tree`?

No, or not necessarily. An application can use both state trees and vanilla MobX observables at the same time.
State trees are primarily designed to store your domain data as this kind of state is often distributed and not very local.
For local component state, for example, vanilla MobX observables might often be simpler to use.


### When not to use MST?

MST provides access to snapshots, patches and interceptable actions. Also, it fixes the `this` problem.
All these features have a downside as they incur a little runtime overhead.
Although in many places the MST core can still be optimized significantly, there will always be a constant overhead.
If you have a performance critical application that handles a huge amount of mutable data, you will probably be better
off by using 'raw' MobX, which has a predictable and well-known performance and much less overhead.

Likewise, if your application mainly processes stateless information (such as a logging system), MST won't add much value.


### Can I use Hot Module Reloading?

<i><a style="color: white; background:cornflowerblue;padding:5px;margin:5px;border-radius:2px" href="https://egghead.io/lessons/react-restore-the-model-tree-state-using-hot-module-reloading-when-model-definitions-change">egghead.io lesson 10: Restore the Model Tree State using Hot Module Reloading when Model Definitions Change</a></i>

Yes, with MST it is pretty straight forward to setup hot reloading for your store definitions while preserving state. See the [todomvc example](https://github.com/mobxjs/mobx-state-tree/blob/745904101fdaeb51f16f40ebb80cd7fecf742572/packages/mst-example-todomvc/src/index.js#L60-L64).

### How does MST compare to Redux

So far this might look a lot like an immutable state tree as found for example in Redux apps, but there're are only so many reasons to use Redux as per [article linked at the very top of Redux guide](https://medium.com/@dan_abramov/you-might-not-need-redux-be46360cf367) that MST covers too, meanwhile:

-   Like Redux, and unlike MobX, MST prescribes a very specific state architecture.
-   mobx-state-tree allows direct modification of any value in the tree. It is not necessary to construct a new tree in your actions.
-   mobx-state-tree allows for fine-grained and efficient observation of any point in the state tree.
-   mobx-state-tree generates JSON patches for any modification that is made.
-   mobx-state-tree provides utilities to turn any MST tree into a valid Redux store.
-   Having multiple MSTs in a single application is perfectly fine.

### Where is the `any` type?

MST doesn't offer an any type because it can't reason about it. For example, given a snapshot and a field with `any`, how should MST know how to deserialize it or apply patches to it, etc.? If you need `any`, there are following options:

1.  Use `types.frozen()`. Frozen values need to be immutable and serializable (so MST can treat them verbatim)
2.  Use volatile state. Volatile state can store anything, but won't appear in snapshots, patches etc.
3.  If your type is regular, and you just are too lazy to type the model, you could also consider generating the type at runtime once (after all, MST types are just JS...). However, you will loose static typing, and any confusion it causes is up to you to handle :-).
