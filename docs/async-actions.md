# Creating asynchronous actions

Asynchronous actions are a first class concept in Mobx-State-Tree. Modelling an asynchronous flow can be done in two ways:

1. Model each step of the flow as separate action
2. Use generators

The recommended approach is to use _generators_, for reasons mentioned below.
But let's take a look at modelling asynchronous actions as a set of actions first.

## Using separate actions

MST doesn't allow changing state outside actions (except when the tree is unprotected).
This means that each step in an asynchronous flow that needs to actually change the model needs to become a separate action.
For example:

```javascript
const Store = types.model({
        githubProjects: types.array(types.frozen),
        state: types.enumeration("State", ["pending", "done", "error"])
    })
    .actions(self => ({
        fetchProjects() {
            self.githubProjects = []
            self.state = "pending"
            fetchGithubProjectsSomehow().then(
                // when promise resolves invoke the appropiate action
                // (note that there is no need to bind here)
                self.fetchProjectsSuccess,
                self.fetchProjectsError
            )
        },
        fetchProjectsSuccess(projects) {
            self.state = "done"
            self.githubProjects = projects
        },
        fetchProjectsError(error) {
            console.error("Failed to fetch projects", error)
            self.state = "error"
        }
    }
))
```

This approach works fine and has great type inference, but comes with a few downsides:

1. For complex flows, which update data in the middle of the flow, a lot of "utility" actions need to be created.
2. Each step of the flow is exposed as action to the outside world. In the above example, one could (but shouldn't) directly invoke `store.fetchProjectsSuccess([])`
3. Middleware cannot distinguish the flow initiating action from the handler actions. This means that actions like `fetchProjectsSuccess` will become part of the recorded action list, although you probably never want to replay it (as replaying `fetchProjects` itself will cause the handler actions to be fired in the end).

## Using generators

Generators might sound scary, but they are very suitable for expressing asynchronous flows. The above example looks as follows when using generators:

```javascript
import { flow } from "mobx-state-tree"

const Store = types.model({
        githubProjects: types.array(types.frozen),
        state: types.enumeration("State", ["pending", "done", "error"])
    })
    .actions(self => ({
        fetchProjects: flow(function* fetchProjects() { // <- note the star, this a generator function!
            self.githubProjects = []
            self.state = "pending"
            try {
                // ... yield can be used in async/await style
                self.githubProjects = yield fetchGithubProjectsSomehow()
                self.state = "done"
            } catch (e) {
                // ... including try/catch error handling
                console.error("Failed to fetch projects", error)
                self.state = "error"
            }
        })
    }))

const store = Store.create({})
// async actions will always return a promise resolving to the returned value
store.fetchProjects().then(() => {
    console.log("done")
})
```

Creating asynchronous actions using generators works as follow:

1. The action needs to be marked as generator, by postfixing the `function` keyword with a `*` and a name (which will be used by middleware), and wrapping it with `flow`
2. The action can be paused by using a `yield` statement. Yield always needs to return a `Promise`.
3. If the promise resolves, the resolved value will be returned from the `yield` statement, and the action will continue to run
4. If the promise rejects, the action continues and the rejection reason will be thrown from the `yield` statement
5. Invoking the asynchronous action returns a promise. That will resolve with the return value of the function, or rejected with any exception that escapes from the asynchronous actions.

> Note: `flow()` is available in `v1.1.0` and above. If you see an error message like: `_mobxStateTree.flow is not a function`, check your version and upgrade if necessary.

Using generators is syntactically clean.
But the main advantage is that they receive first class support from MST.
Middleware (see below) can implement specific behavior for asynchronous actions.
For example, the `onAction` middleware will only record starting asynchronous flows, but not any async steps that are taking during the flow.
After all, when replaying the invocation will lead to the other steps being executed automatically.
Besides that, each step in the generator is allowed to modify it's own instance, and there is no need to expose the individual flow steps as actions.

See the [bookshop example sources](https://github.com/mobxjs/mobx-state-tree/blob/5a4bd43ac874cddbf91b40eeef20043198477084/packages/mst-example-bookshop/src/stores/BookStore.js#L25) for a more extensive example.

Using generators requires Promises and generators to be available. Promises can easily be polyfilled although they tend to be available on every modern JS environment. Generators are well supported as well, and both TypeScript and Babel can compile generators to ES5.

To see how `flows`s can be monitored and detected in middleware, see the [middleware docs](middleware.md).

## What about async / await?

Async/await can only be used in trees that are unprotected. Async / await is not flexible enough to allow MST to wrap asynchronous steps in actions automatically, as is done for the generator functions.
Luckily, using generators in combination with `flow` is very similar to `async / await`: `async function() {}` becomes `flow(function* () {})`, and `await promise` becomes `yield promise`, and further behavior should be the same.
