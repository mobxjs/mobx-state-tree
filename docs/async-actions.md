# Creating asynchronous actions

Asynchronous actions are a first class concept in Mobx-State-Tree. Modelling an asynchronous process can be done in two ways:
1. Model each step of the process as separate action
2. Use generators

## Using separate actions

MST doesn't allow changing state outside actions (unless when the tree is unprotected).
This means that each step in an asynchronous process needs to become an action.
The easiest way to achieve this is to specify separate actions for each step:

```javascript
const Store = types.model(
    {
	    githubProjects: types.array(types.frozen),
        state: types.enum("pending", "done", "error")
    },
    {
        fetchProjects() {
            this.githubProjects = []
            this.state = "pending"
            fetchGithubProjectsSomehow().then(
                // when promise resolves invoke the appropiate action
                // note that no binding is needed; MST actions will be bound
                // automatically
                this.fetchProjectsSuccess,
                this.fetchProjectsError
            )
        },
        fetchProjectsSuccess(projects) {
            this.state = "done"
            this.githubProjects = projects
        },
        fetchProjectsError(error) {
            console.error("Failed to fetch projects", error)
            this.state = "error"
        }
    }
)
```

This approach works fine and has great type inference, but comes with a few downsides:

1. For complex processes, a lot of utility methods need to be created. (But note that only asynchronous modifications need to become separate actions. So intermediate async steps can still be part of the original action)
2. Middleware cannot distinguish the process initiating action from the handler actions. This means that actions like `fetchProjectsSuccess` will become part of the recorded action list, although you probably never want to replay it (as replaying `fetchProjects` itself will cause the handler actions to be fired in the end).

For asynchronous processes, for each step that intends to modify a model you need a separate action. So for example one to kick off the process. And one to update the model. In a multi stage async process, consider postponing all updates until the last step is completed.

## Using generators

Generators might sound scary, but they are very suitable for expressing asynchronous process. The above example looks as follows when using generators:

```javascript
const Store = types.model(
    {
	    githubProjects: types.array(types.frozen),
        state: types.enum("pending", "done", "error")
    },
    {
        *fetchProjects() { // <- note the star, this a generator function!
            this.githubProjects = []
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
        },
    }
)

const store = Store.create({})
// async actions will always return a promise resolving to the returned value
store.fetchProjects().then(() => {
    console.log("done")
})
```

Creating asynchronous actions using generators works as follow:

1. The action needs to be marked as generator, by prefix the name with `*`
2. The action can be paused by using a `yield` statement. Yield always needs to yield a `Promise`
3. If the promise resolves, the resolved value will be returned from the `yield` statement, and the action will continue to run
4. If the promise rejects, the action continues and the rejection reason will be thrown from the `yield` statement
5. Invoking the asynchronous action returns a promise. That will resolve with the return value of the function, or rejected with any exception that escapes from the asynchronous actions.

Using generators is syntactically very clean, but another advantage is that they receive first class support from MST. Middleware (see below) can implement specific behavior for asynchronous actions.
For example, the `onAction` middleware will only record starting asynchronous processes, but not any async steps that are taking during the process.
After all, when replaying the invocation will lead to the other steps being executed automatically.

Using generators requires Promises and generators to be available. Promises can easily be polyfilled although they tend to be available on every modern JS environment. Generators are well supported as well, and both TypeScript and Babel will compile generators to ES5 out of the box for you.

## What about async / await?

Async/await can only be used in trees that are unprotected. Async / await is not flexible enough to allow MST to wrap asynchronous steps in actions automatically, as is done with generators.
Luckily, writing generators is very similar: `async function() {}` becomes `function* () {}`, and `await promise` becomes `yield promise`, and further behavior should be the same.

## Asynchronous actions and middleware

When processing asynchronous actions in middleware there are two properties relevant:

```
asyncMode: "none" | "invoke" | "yield" | "yieldError" | "return" | "throw"
asyncId: number
```

`asyncId` is a number that is unique per process invocation. This means that all events passing your middleware with the same `asyncId` are part of the same process.
For synchronous actions, `asyncId` is always `0`.

`asyncMode` indicates which step of the process is currently fyring:

* `none`: this is a synchronous action
* `invoke`: this is the invocation of the asynchronous actions. `args` contains the arguments passed to the action
* `yield`: a promise that was returned from `yield` earlier has resolved. `args` contains the value it resolved to, and the action will now continue with that value
* `yieldError`: a promise that was returned from `yield` earlier was rejected. `args` contains the rejection reason, and the action will now continue throwing that error into the generator
* `return`: the generator completed successfully. The promise returned by the action will resolve with the value found in `args`
* `throw`: the generator threw an uncatched exception. The promise returned by the action will reject with the exception found in `args`

A small example:

Given the following action:

```javascript
*fetchData(any, kind: string) {
    this.title = "getting coffee " + kind
    // N.b.: delay creates a promises that resulves to the value after 100 ms
    this.title = yield delay(100, "drinking coffee")
    return "awake"
}
```

And invocation

```javascript
store.fetchData("black").then(value => {
    console.log(value) // "awake"
})
```

The following events will be emitted to all middleware:

```javascript
[
    {
        name: "fetchData"
        asyncMode: "invoke",
        asyncId: 123,
        args: ["black"],
    },
    {
        name: "fetchData"
        asyncMode: "yield",
        asyncId: 123,
        args: ["drinking coffee"],
    },
    {
        name: "fetchData"
        asyncMode: "return",
        asyncId: 123,
        args: ["awake"],
    }
]
```

For more examples, see the [unit tests](https://github.com/mobxjs/mobx-state-tree/blob/master/test/async.ts).

_Note: for middleware, it is extremely important that `next(action)` is called for asynchronous actions, otherwise the generator will remain in an unfinished state forever_

## Typescript tips

When using generators, you will notice that the return type will be inferred incorrectly. (Usually: `any`). Note that the actual return type from an asynchronous action is `Promise<T>` where `T` is the type returned by the `return` statement(s).
For more questions or ideas, see also [#273](https://github.com/mobxjs/mobx-state-tree/issue/273)
