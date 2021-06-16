---
id: volatiles
title: Volatile state
---

<div id="codefund"></div>

<details>
    <summary style="color: white; background:#ff7000;padding:5px;margin:5px;border-radius:2px">egghead.io lesson 15: Use Volatile State and Lifecycle Methods to Manage Private State</summary>
    <br>
    <div style="padding:5px;">
        <iframe style="border: none;" width=760 height=427  src="https://egghead.io/lessons/react-use-volatile-state-and-lifecycle-methods-to-manage-private-state/embed" ></iframe>
    </div>
    <a style="font-style:italic;padding:5px;margin:5px;"  href="https://egghead.io/lessons/react-use-volatile-state-and-lifecycle-methods-to-manage-private-state">Hosted on egghead.io</a>
</details>

MST models primarily aid in storing _persistable_ state. State that can be persisted, serialized, transferred, patched, replaced, etc.
However, sometimes you need to keep track of temporary, non-persistable state. This is called _volatile_ state in MST. Examples include promises, sockets, DOM elements, etc. - state which is needed for local purposes as long as the object is alive.

Volatile state (which is also private) can be introduced by creating variables inside any of the action initializer functions.

Volatile is preserved for the life-time of an object and not reset when snapshots are applied, etc. Note that the life time of an object depends on proper reconciliation, see the [how does reconciliation work?](reconciliation) section.

The following is an example of an object with volatile state. Note that volatile state here is used to track a XHR request and clean up resources when it is disposed. Without volatile state this kind of information would need to be stored in an external WeakMap or something similar.

```javascript
const Store = types
    .model({
        todos: types.array(Todo),
        state: types.enumeration("State", ["loading", "loaded", "error"])
    })
    .actions(self => {
        let pendingRequest = null // a Promise

        function afterCreate() {
            self.state = "loading"
            pendingRequest = someXhrLib.createRequest("someEndpoint")
        }

        function beforeDestroy() {
            // abort the request, no longer interested
            pendingRequest.abort()
        }

        return {
            afterCreate,
            beforeDestroy
        }
    })
```

Some tips:

1.  Note that multiple `actions` calls can be chained. This makes it possible to create multiple closures with their own protected volatile state.
2.  Although in the above example the `pendingRequest` could be initialized directly in the action initializer, it is recommended to do this in the `afterCreate` hook, which will only be called once the entire instance has been set up (there might be many action and property initializers for a single type).

3.  The above example doesn't actually use the promise. For how to work with promises / asynchronous flows, see the [asynchronous actions](async-actions) section.

4.  It is possible to share volatile state between views and actions by using `extend`. `.extend` works like a combination of `.actions` and `.views` and should return an object with a `actions` and `views` field:

Here's an example of how to do your own volatile state using an observable:

```javascript
// if your local state is part of a view getter (computed) then
// it is important to make sure that state used such getters are observable,
// or else the value returned by the view would become stale upon observation
const Todo = types.model({}).extend(self => {
    const localState = observable.box(3)

    return {
        views: {
            // note this one IS a getter (computed value)
            get x() {
                return localState.get()
            }
        },
        actions: {
            setX(value) {
                localState.set(value)
            }
        }
    }
})
```

And here's an example of how to do your own volatile state _not_ using an observable (but if you do this make sure the local state will _never_ be used in a computed value first and bear in mind it _won't_ be reactive!):

```javascript
// if not using an observable then make sure your local state is NOT part of a view getter or computed value of any kind!
// also changes to it WON'T be reactive
const Todo = types.model({}).extend(self => {
    let localState = 3

    return {
        views: {
            // note this one is NOT a getter (NOT a computed value)
            // if this were a getter this value would get stale upon observation
            getX() {
                return localState
            }
        },
        actions: {
            setX(value) {
                localState = value
            }
        }
    }
})
```


### model.volatile

Since the pattern above (having a volatile state that is _observable_ (in terms of Mobx observables) and _readable_ from outside the instance) is such a common pattern there is a shorthand to declare such properties. The example above can be rewritten as:

```javascript
const Todo = types
    .model({})
    .volatile(self => ({
        localState: 3
    }))
    .actions(self => ({
        setX(value) {
            self.localState = value
        }
    }))
```

The object that is returned from the `volatile` initializer function can contain any piece of data and will result in an instance property with the same name. Volatile properties have the following characteristics:

1.  They can be read from outside the model (if you want hidden volatile state, keep the state in your closure as shown in the previous section, and _only_ if it is not used on a view consider not making it observable)
2.  The volatile properties will be only observable, see [observable _references_](https://mobx.js.org/api.html#observableref). Values assigned to them will be unmodified and not automatically converted to deep observable structures.
3.  Like normal properties, they can only be modified through actions
4.  Volatile props will not show up in snapshots, and cannot be updated by applying snapshots
5.  Volatile props are preserved during the lifecycle of an instance. See also [reconciliation](reconciliation)
6.  Changes in volatile props won't show up in the patch or snapshot stream
7.  It is currently not supported to define getters / setters in the object returned by `volatile`
