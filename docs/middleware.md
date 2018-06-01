# Middleware
Middlewares can be used to intercept any action on a subtree.

It is allowed to attach multiple middlewares to a node.
The order in which middlewares are invoked is inside-out:
This means that the middlewares are invoked in the order you attach them.
The value returned by the action invoked/ the aborted value gets passed through the middleware chain and can be manipulated.


MST ships with a small set of [pre-built / example middlewares](../packages/mst-middlewares/README.md).


Custom middleware example:
[SandBox example](https://codesandbox.io/s/88jrqlzm1l)

## Custom Middleware
Middlewares can be attached by using:

`addMiddleware(target: IStateTreeNode, handler: IMiddlewareHandler, includeHooks: boolean = true) :
void`

### target

the middleware will only be attached to actions of the `target` and further sub nodes of such.

### handler
An example of this is as follows:

```js
const store = SomeStore.create()
const disposer = addMiddleware(store, (call, next, abort) => {
  console.log(`action ${call.name} was invoked`)
  // runs the next middleware
  // or the implementation of the targeted action
  // if there is no middleware left to run

  // the value returned from the next can be manipulated
  next(call, value => value + 1);
});
```
```js
const store = SomeStore.create()
const disposer = addMiddleware(store, (call, next, abort) => {
  console.log(`action ${call.name} was invoked`)
  // aborts running the middlewares and returns the 'value' instead.
  // note that the targeted action won't be reached either.
  return abort('value')  
})
```

A middleware handler receives three arguments:
1. the description of the the call,
-  a function to invoke the next middleware in the chain and manipulate the returned value from the next middleware in the chain.
- a function to abort the middleware queue and return a value.



*Note: You must call either `next(call)` or `abort(value)` within a middleware.*

*Note: If you abort, the action invoked will never be reached.*

*Note: The value from either `abort('value')` or the returned value from the `action` can be manipulated by previous middlewares.*

*Note: It is important to invoke `next(call)` or `abort(value)` synchronously.*

*Note: The value of the `abort(value)` must be a promise in case of aborting a `flow`.*

#### call
```javascript
export type IMiddleWareEvent = {
    type: IMiddlewareEventType
    name: string
    id: number
    parentId: number
    rootId: number
    tree: IStateTreeNode
    context: IStateTreeNode
    args: any[]
}

export type IMiddlewareEventType =
    | "action"
    | "flow_spawn"
    | "flow_resume"
    | "flow_resume_error"
    | "flow_return"
    | "flow_throw"
```

* `name` is the name of the action
* `context` is the object on which the action was defined & invoked
* `tree` is the root of the MST tree in which the action was fired (`tree === getRoot(context)`)
* `args` are the original arguments passed to the action
* `id` is a number that is unique per external action invocation.
* `parentId` is the number of the action / process that called this action. `0` if it wasn't called by another action but directly from user code
* `rootid` is the id of the action that spawned this action. If an action was not spawned by another action, but something external (user event etc), `id` and `rootId` will be equal (and `parentid` `0`)

`type` Indicates which kind of event this is

* `action`: this is a normal synchronous action invocation
* `flow_spawn`: The invocation / kickoff of a `process` block (see [asynchronous actions](async-actions.md))
* `flow_resume`: a promise that was returned from `yield` earlier has resolved. `args` contains the value it resolved to, and the action will now continue with that value
* `flow_resume_error`: a promise that was returned from `yield` earlier was rejected. `args` contains the rejection reason, and the action will now continue throwing that error into the generator
* `flow_return`: the generator completed successfully. The promise returned by the action will resolve with the value found in `args`
* `flow_throw`: the generator threw an uncatched exception. The promise returned by the action will reject with the exception found in `args`

To see how a bunch of calls from an asynchronous process look, see the [unit tests](https://github.com/mobxjs/mobx-state-tree/blob/09708ba86d04f433cc23fbcb6d1dc4db170f798e/test/async.ts#L289)

A minimal, empty process will fire the following events if started as action:

1. `action`: An `action` event will always be emitted if a process is exposed as action on a model)
2. `flow_spawn`: This is just the notification that a new generator was started
3. `flow_resume`: This will be emitted when the first "code block" is entered. (So, with zero yields there is one `flow_resume`  still)
4. `flow_return`: The process has completed

#### next
use next to call the next middleware.

`next(call: IMiddlewareEvent, callback?: (value: any) => any): void`

- `call` Before passing the call middleware, feel free to (clone and) modify the `call.args`.
Other properties should not be modified

- `callback` can be used to manipulate values returned by later middlewares or the implementation of the targeted action.

#### abort

use abort if you wan't kill the queue of middlewares and immediately return.
the implementation of the targeted action won't be reached if you abort the queue.

`abort(value: any) : void`

- `value` is returned instead of the return value from the implementation of the targeted action.

### includeHooks
set this flag to `false` if you wan't to avoid having hooks passed to the middleware.

## FAQ

- I alter a property and the change does not appear in the middleware.

 - *If you alter a value of an unprotected node, the change won't reach the middleware. Only actions can be intercepted.*
