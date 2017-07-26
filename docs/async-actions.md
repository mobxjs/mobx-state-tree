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

Advantages

Requirements

## What about async / await?



## Asynchronous actions and middleware

## Typescript tips

