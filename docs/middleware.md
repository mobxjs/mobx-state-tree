# Middleware

Middleware can be used to intercept any action is invoked on the subtree where it is attached.
If a tree is protected (by default), this means that any mutation of the tree will pass through your middleware.

[SandBox example](https://codesandbox.io/s/mQrqy8j73)

Middleware can be attached by using `addMiddleware(node, handler: (call, next(call) => void) => void)`

It is allowed to attach multiple middlewares. The order in which middleware is invoked is inside-out:
local middleware is invoked before parent middleware. On the same object, earlier attached middleware is run before later attached middleware.

A middleware handler receives two arguments: 1. the description of the the call, 2: a function to invoke the next middleware in the chain.
If `next(call)` is not invoked by your middleware, the action will be aborted and not actually executed.
Before passing the call to the next middleware using `next`, feel free to (clone and) modify the call arguments. Other properties should not be modified

A call description looks like:

```javascript
export type IMiddleWareEvent = {
    type: IMiddlewareEventType
    name: string
    id: number
    rootId: number
    context: IStateTreeNode
    args: any[]
}

export type IMiddlewareEventType =
    | "action"
    | "process_spawn"
    | "process_resume"
    | "process_resume_error"
    | "process_return"
    | "process_throw"
```

A very simple middleware that just logs the invocation of actions will look like:

@example
```typescript
const store = SomeStore.create()
const disposer = addMiddleWare(store, (call, next) => {
  console.log(`action ${call.name} was invoked`)
  return next(call) // runs the next middleware (or the implementation of the targeted action if there is no middleware to run left)
})
```

_Note: for middleware, it is extremely important that `next(action)` is called for asynchronous actions (`call.type !== "action"`), otherwise the generator will remain in an unfinished state forever_

# Built-in middlewares

* [`onAction`](https://github.com/mobxjs/mobx-state-tree/blob/09708ba86d04f433cc23fbcb6d1dc4db170f798e/src/core/action.ts#L174)
* More will follow soon

## Call attributes

* `name` is the name of the action
* `context` is the object on which the action was defined & invoked
* `args` are the original arguments passed to the action
* `id` is a number that is unique per external action invocation.
* `rootid` is the id of the action that spawned this action. If an action was not spawned by another action, but something external (user event etc), `id` and `rootId` will be eqal

`type` Indicates which kind of event this is

* `action`: this is a normal synchronous action invocation
* `process_spawn`: The invocation / kickoff of a `process` block (see [asynchronous actions](async-actions.md))
* `process_resume`: a promise that was returned from `yield` earlier has resolved. `args` contains the value it resolved to, and the action will now continue with that value
* `process_resume_error`: a promise that was returned from `yield` earlier was rejected. `args` contains the rejection reason, and the action will now continue throwing that error into the generator
* `process_return`: the generator completed successfully. The promise returned by the action will resolve with the value found in `args`
* `process_throw`: the generator threw an uncatched exception. The promise returned by the action will reject with the exception found in `args`

To see how a bunch of calls from an asynchronous process look, see the [unit tests](https://github.com/mobxjs/mobx-state-tree/blob/09708ba86d04f433cc23fbcb6d1dc4db170f798e/test/async.ts#L289)

A minimal, empty process will fire the following events if started as action:

1. `action`: An `action` event will always be emitted if a process is exposed as action on a model)
2. `process_spawn`: This is just the notification that a new generator was started
3. `process_resume`: This will be emitted when the first "code block" is entered. (So, with zero yields there is one `process_resume`  still)
4. `process_return`: The process has completed