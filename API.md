# Mobx-State-Tree API reference guide

_This reference guide lists all methods exposed by MST. Contributions like linguistic improvements, adding more details to the descriptions or additional examples are highly appreciated! Please note that the docs are generated from source. Most methods are declared in the [mst-operations.ts](https://github.com/mobxjs/mobx-state-tree/blob/master/src/core/mst-operations.ts) file._

# types.map

Creates a key based collection type who's children are all of a uniform declared type.
If the type stored in a map has an identifier, it is mandatory to store the child under that identifier in the map.

This type will always produce [observable maps](https://mobx.js.org/refguide/map.html)

**Parameters**

-   `subtype` **IType&lt;S, T>** 

**Examples**

````javascript
    ```javascript
    const Todo = types.model({
      id: types.identifier,
      task: types.string
    })

    const TodoStore = types.model({
      todos: types.map(Todo)
    })

    const s = TodoStore.create({ todos: [] })
    s.todos.set(17, { task: "Grab coffee", id: 17 })
    s.todos.put({ task: "Grab cookie", id: 18 }) // put will infer key from the identifier
    console.log(s.todos.get(17)) // prints: "Grab coffee"
    ```
````

Returns **IComplexType&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;S>, IObservableArray&lt;T>>** 

# types.array

Creates a index based collection type who's children are all of a uniform declared type.

This type will always produce [observable arrays](https://mobx.js.org/refguide/array.html)

**Parameters**

-   `subtype` **IType&lt;S, T>** 

**Examples**

````javascript
    ```javascript
    const Todo = types.model({
      task: types.string
    })

    const TodoStore = types.model({
      todos: types.array(Todo)
    })

    const s = TodoStore.create({ todos: [] })
    s.todos.push({ task: "Grab coffee" })
    console.log(s.todos[0]) // prints: "Grab coffee"
    ```
````

Returns **IComplexType&lt;[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;S>, IObservableArray&lt;T>>** 

# types.identifier

Identifier are used to make references, lifecycle events and reconciling works.
Inside a state tree, for each type can exist only one instance for each given identifier.
For example there could'nt be 2 instances of user with id 1. If you need more, consider using references.
Identifier can be used only as type property of a model.
This type accepts as parameter the value type of the identifier field that can be either string or number.

**Parameters**

-   `baseType` **IType&lt;T, T>** 

**Examples**

```javascript
const Todo = types.model("Todo", {
     id: types.identifier(types.string),
     title: types.string
 })
```

Returns **IType&lt;T, T>** 

# types.model

Creates a new model type by providing a name, properties, volatile state and actions.

See the [model type](https://github.com/mobxjs/mobx-state-tree#creating-models) description or the [getting started](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/getting-started.md#getting-started-1) tutorial.

# types.compose

Composes a new model from one or more existing model types.
This method can be invoked in two forms:

1.  Given 2 or more model types, the types are composed into a new Type.
2.  Given 1 model type, and additionally a set of properties, actions and volatile state, a new type is composed.

Overloads:

-   `compose(...modelTypes)`
-   `compose(modelType, properties)`
-   `compose(modelType, properties, actions)`
-   `compose(modelType, properties, volatileState, actions)`

[Example of form 2](https://github.com/mobxjs/mobx-state-tree#simulate-inheritance-by-using-type-composition)

# types.reference

Creates a reference to another type, which should have defined an identifier.
See also the [reference and identifiers](https://github.com/mobxjs/mobx-state-tree#references-and-identifiers) section.

**Parameters**

-   `factory`  

# types.union

types.union(dispatcher?, types...) create a union of multiple types. If the correct type cannot be inferred unambigously from a snapshot, provide a dispatcher function of the form (snapshot) => Type.

**Parameters**

-   `dispatchOrType` **(ITypeDispatcher | IType&lt;any, any>)** 
-   `otherTypes` **...[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;IType&lt;any, any>>** 

Returns **IType&lt;any, any>** 

# types.optional

`types.optional` can be used to create a property with a default value.
If the given value is not provided in the snapshot, it will default to the provided `defaultValue`.
If `defaultValue` is a function, the function will be invoked for every new instance.
Applying a snapshot in which the optional value is _not_ present, causes the value to be reset

**Parameters**

-   `type`  
-   `defaultValueOrFunction`  

**Examples**

````javascript
    ```javascript
    const Todo = types.model({
      title: types.optional(types.string, "Test"),
      done: types.optional(types.boolean, false),
      created: types.optional(types.Date, () => new Date())
    })

    // it is now okay to omit 'created' and 'done'. created will get a freshly generated timestamp
    const todo = Todo.create({ title: "Get coffee "})
    ```
````

# types.literal

The literal type will return a type that will match only the exact given type.
The given value must be a primitive, in order to be serialized to a snapshot correctly.
You can use literal to match exact strings for example the exact male or female string.

**Parameters**

-   `value` **S** The value to use in the strict equal check

**Examples**

```javascript
const Person = types.model({
    name: types.string,
    gender: types.union(types.literal('male'), types.literal('female'))
})
```

Returns **ISimpleType&lt;S>** 

# types.maybe

Maybe will make a type nullable, and also null by default.

**Parameters**

-   `type` **IType&lt;S, T>** The type to make nullable

Returns **(IType&lt;(S | null | [undefined](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)), (T | null)>)** 

# types.refinement

`types.refinement(baseType, (snapshot) => boolean)` creates a type that is more specific then the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.

**Parameters**

-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 
-   `type` **IType&lt;T, T>** 
-   `predicate`  

Returns **IType&lt;T, T>** 

# types.frozen

Frozen can be used to story any value that is serializable in itself (that is valid JSON).
Frozen values need to be immutable or treated as if immutable.
Values stored in frozen will snapshotted as-is by MST, and internal changes will not be tracked.

This is useful to store complex, but immutable values like vectors etc. It can form a powerful bridge to parts of your application that should be immutable, or that assume data to be immutable.

**Examples**

````javascript
    ```javascript
    const GameCharacter = types.model({
      name: string,
      location: types.frozen
    })

    const hero = new GameCharacter({
      name: "Mario",
      location: { x: 7, y: 4 }
    })

    hero.location = { x: 10, y: 2 } // OK
    hero.location.x = 7 // Not ok!
    ```
````

# types.string

Creates a type that can only contain a string value.
This type is used for string values by default

**Examples**

````javascript
    ```javascript
    const Person = types.model({
      firstName: types.string,
      lastName: "Doe"
    })
    ```
````

# types.number

Creates a type that can only contain a numeric value.
This type is used for numeric values by default

**Examples**

````javascript
    ```javascript
    const Vector = types.model({
      x: types.number,
      y: 0
    })
    ```
````

# types.boolean

Creates a type that can only contain a boolean value.
This type is used for boolean values by default

**Examples**

````javascript
    ```javascript
    const Thing = types.model({
      isCool: types.boolean,
      isAwesome: false
    })
    ```
````

# types.null

The type of the value `null`

# types.undefined

The type of the value `undefined`

# types.Date

Creates a type that can only contain a javascript Date value.

**Examples**

````javascript
    ```javascript
    const LogLine = types.model({
      timestamp: types.Date,
    })

    LogLine.create({ timestamp: new Date() })
    ```
````

# types.late

Defines a type that gets implemented later. This is usefull when you have to deal with circular dependencies.
Please notice that when defining circular dependencies TypeScript is'nt smart enought to inference them.
You need to declare an interface to explicit the return type of the late parameter function.

```typescript
 interface INode {
      childs: INode[]
 }

  // TypeScript is'nt smart enough to infer self referencing types.
 const Node = types.model({
      childs: types.optional(types.array(types.late<any, INode>(() => Node)), [])
 })
```

**Parameters**

-   `name` **\[[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)]** The name to use for the type that will be returned.
-   `type` **ILateType&lt;S, T>** A function that returns the type that will be defined.
-   `nameOrType`  
-   `maybeType`  

Returns **IType&lt;S, T>** 

# types.enumeration

Can be used to create an string based enumeration.
(note: this methods is just sugar for a union of string literals)

**Parameters**

-   `name` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** descriptive name of the enumeration (optional)
-   `options` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** possible values this enumeration can have

**Examples**

````javascript
    ```javascript
    const TrafficLight = types.model({
      color: types.enum("Color", ["Red", "Orange", "Green"])
    })
    ```
````

Returns **ISimpleType&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** 

# getType

Returns the _actual_ type of the given tree node. (Or throws)

**Parameters**

-   `object` **IStateTreeNode** 

Returns **IType&lt;S, T>** 

# getChildType

Returns the _declared_ type of the given sub property of an object, array or map.

**Parameters**

-   `object` **IStateTreeNode** 
-   `child` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

**Examples**

````javascript
    ```typescript
    const Box = types.model({ x: 0, y: 0 })
    const box = Box.create()

    console.log(getChildType(box, "x").name) // 'number'
    ```
````

Returns **IType&lt;any, any>** 

# addMiddleware

Middleware can be used to intercept any action is invoked on the subtree where it is attached.
If a tree is protected (by default), this means that any mutation of the tree will pass through your middleware.

[SandBox example](https://codesandbox.io/s/mQrqy8j73)

It is allowed to attach multiple middlewares. The order in which middleware is invoked is inside-out:
local middleware is invoked before parent middleware. On the same object, earlier attached middleware is run before later attached middleware.

A middleware receives two arguments: 1. the description of the the call, 2: a function to invoke the next middleware in the chain.
If `next(call)` is not invoked by your middleware, the action will be aborted and not actually executed.
Before passing the call to the next middleware using `next`, feel free to clone and modify the call description

A call description looks like:

    {
         name: string // name of the action
         object: any & IStateTreeNode // the object on which the action was original invoked
         args: any[] // the arguments of the action
         asyncMode: string
         asyncId: number
    }

The fields `asyncMode` and `asyncId` are explained in detail in the [asynchronous action](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/async-actions.md#asynchronous-actions-and-middleware) section.

An example of a build in middleware is the `onAction` method.

**Parameters**

-   `target` **IStateTreeNode** 
-   `middleware`  

**Examples**

````javascript
    ```typescript
    const store = SomeStore.create()
    const disposer = addMiddleWare(store, (call, next) => {
      console.log(`action ${call.name} was invoked`)
      next(call) // runs the next middleware (or the intended action if there is no middleware to run left)
    })
    ```
````

Returns **IDisposer** 

# onPatch

Registers a function that will be invoked for each mutation that is applied to the provided model instance, or to any of its children.
See [patches](https://github.com/mobxjs/mobx-state-tree#patches) for more details. onPatch events are emitted immediately and will not await the end of a transaction.
Patches can be used to deep observe a model tree.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the model instance from which to receive patches
-   `boolean` **includeOldValue** if oldValue is included in the patches, they can be inverted. However patches will become much bigger and might not be suitable for efficient transport
-   `callback`  
-   `includeOldValue`  

Returns **IDisposer** function to remove the listener

# onSnapshot

Registeres a function that is invoked whenever a new snapshot for the given model instance is available.
The listener will only be fire at the and of the current MobX (trans)action.
See [snapshots](https://github.com/mobxjs/mobx-state-tree#snapshots) for more details.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `callback`  

Returns **IDisposer** 

# applyPatch

Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied
See [patches](https://github.com/mobxjs/mobx-state-tree#patches) for more details.

Can apply a single past, or an array of patches.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `patch` **IJsonPatch** 

# revertPatch

The inverse function of apply patch.
Given a patch or set of patches, restores the target to the state before the patches where produced.
The inverse patch is computed, and all the patches are applied in reverse order, basically 'rewinding' the target,
so that conceptually the following holds for any set of patches:

`getSnapshot(x) === getSnapshot(revertPatch(applyPatches(x, patches), patches))`

Note: Reverting patches will generate a new set of patches as side effect of applying the patches.
Note: only patches that include `oldValue` information are suitable for reverting. Such patches can be generated by passing `true` as second argument when attaching an `onPatch` listener.

**Parameters**

-   `target`  
-   `patch`  

# recordPatches

Small abstraction around `onPatch` and `applyPatch`, attaches a patch listener to a tree and records all the patches.
Returns an recorder object with the following signature:

```typescript
export interface IPatchRecorder {
     // the recorded patches
     patches: IJsonPatch[]
     // the same set of recorded patches, but without undo information, making them smaller and compliant with json-patch spec
     cleanPatches: IJSonPatch[]
     // stop recording patches
     stop(target?: IStateTreeNode): any
     // apply all the recorded patches on the given target (the original subject if omitted)
     replay(target?: IStateTreeNode): any
     // reverse apply the recorded patches on the given target  (the original subject if omitted)
     // stops the recorder if not already stopped
     undo(): void
}
```

**Parameters**

-   `subject` **IStateTreeNode** 

Returns **IPatchRecorder** 

# applyAction

Applies an action or a series of actions in a single MobX transaction.
Does not return any value
Takes an action description as produced by the `onAction` middleware.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `actions` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;IActionCall>** 
-   `options` **\[IActionCallOptions]** 

# recordActions

Small abstraction around `onAction` and `applyAction`, attaches an action listener to a tree and records all the actions emitted.
Returns an recorder object with the following signature:

```typescript
export interface IActionRecorder {
     // the recorded actions
     actions: ISerializedActionCall[]
     // stop recording actions
     stop(): any
     // apply all the recorded actions on the given object
     replay(target: IStateTreeNode): any
}
```

**Parameters**

-   `subject` **IStateTreeNode** 

Returns **IPatchRecorder** 

# protect

The inverse of `unprotect`

**Parameters**

-   `target` **IStateTreeNode** 

# unprotect

By default it is not allowed to directly modify a model. Models can only be modified through actions.
However, in some cases you don't care about the advantages (like replayability, tracability, etc) this yields.
For example because you are building a PoC or don't have any middleware attached to your tree.

In that case you can disable this protection by calling `unprotect` on the root of your tree.

**Parameters**

-   `target`  

**Examples**

```javascript
const Todo = types.model({
    done: false,
    toggle() {
        this.done = !this.done
    }
})

const todo = new Todo()
todo.done = true // OK
protect(todo)
todo.done = false // throws!
todo.toggle() // OK
```

# isProtected

Returns true if the object is in protected mode, @see protect

**Parameters**

-   `target`  

# applySnapshot

Applies a snapshot to a given model instances. Patch and snapshot listeners will be invoked as usual.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `snapshot` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

# getSnapshot

Calculates a snapshot from the given model instance. The snapshot will always reflect the latest state but use
structural sharing where possible. Doesn't require MobX transactions to be completed.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **Any** 

# hasParent

Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `depth` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** = 1, how far should we look upward?

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

# getParent

Returns the immediate parent of this object, or null.

Note that the immediate parent can be either an object, map or array, and
doesn't necessarily refer to the parent model

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `depth` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** = 1, how far should we look upward?

Returns **Any** 

# getRoot

Given an object in a model tree, returns the root object of that tree

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **Any** 

# getPath

Returns the path of the given object in the model tree

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# getPathParts

Returns the path of the given object as unescaped string array

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** 

# isRoot

Returns true if the given object is the root of a model tree

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

# resolvePath

Resolves a path relatively to a given object.
Returns undefined if no value can be found.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** escaped json path

Returns **Any** 

# resolveIdentifier

Resolves a model instance given a root target, the type and the identifier you are searching for.
Returns undefined if no value can be found.

**Parameters**

-   `type` **IType&lt;any, any>** 
-   `target` **IStateTreeNode** 
-   `identifier` **([string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String) \| [number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number))** 

Returns **Any** 

# tryResolve

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **Any** 

# getRelativePath

Given two state tree nodes that are part of the same tree,
returns the shortest jsonpath needed to navigate from the one to the other

**Parameters**

-   `base` **IStateTreeNode** 
-   `target` **IStateTreeNode** 

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# clone

Returns a deep copy of the given state tree node as new tree.
Short hand for `snapshot(x) = getType(x).create(getSnapshot(x))`

_Tip: clone will create a literal copy, including the same identifiers. To modify identifiers etc during cloning, don't use clone but take a snapshot of the tree, modify it, and create new instance_

**Parameters**

-   `source` **T** 
-   `keepEnvironment` **([boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean) | any)** indicates whether the clone should inherit the same environment (`true`, the default), or not have an environment (`false`). If an object is passed in as second argument, that will act as the environment for the cloned tree.

Returns **T** 

# detach

Removes a model element from the state tree, and let it live on as a new state tree

**Parameters**

-   `thing`  

# destroy

Removes a model element from the state tree, and mark it as end-of-life; the element should not be used anymore

**Parameters**

-   `thing`  

# isAlive

Returns true if the given state tree node is not killed yet.
This means that the node is still a part of a tree, and that `destroy`
has not been called. If a node is not alive anymore, the only thing one can do with it
is requesting it's last path and snapshot

**Parameters**

-   `thing` **IStateTreeNode** 

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

# addDisposer

Use this utility to register a function that should be called whenever the
targeted state tree node is destroyed. This is a useful alternative to managing
cleanup methods yourself using the `beforeDestroy` hook.

**Parameters**

-   `target` **IStateTreeNode** 
-   `disposer`  

**Examples**

````javascript
    ```javascript
    const Todo = types.model({
      title: types.string
    }, {
      afterCreate() {
        const autoSaveDisposer = reaction(
          () => getSnapshot(this),
          snapshot => sendSnapshotToServerSomehow(snapshot)
        )
        // stop sending updates to server if this
        // instance is destroyed
        addDisposer(this, autoSaveDisposer)
      }
    })
    ```
````

# getEnv

Returns the environment of the current state tree. For more info on environments,
see [Dependency injection](https://github.com/mobxjs/mobx-state-tree#dependency-injection)

**Parameters**

-   `thing` **IStateTreeNode** 

Returns **Any** 

# walk

Performs a depth first walk through a tree

**Parameters**

-   `thing`  
-   `processor`  

# escapeJsonPath

escape slashes and backslashes
<http://tools.ietf.org/html/rfc6901>

**Parameters**

-   `str`  

# unescapeJsonPath

unescape slashes and backslashes

**Parameters**

-   `str`  

# onAction

Registers a function that will be invoked for each action that is called on the provided model instance, or to any of its children.
See [actions](https://github.com/mobxjs/mobx-state-tree#actions) for more details. onAction events are emitted only for the outermost called action in the stack.
Action can also be intercepted by middleware using addMiddleware to change the function call before it will be run.

**Parameters**

-   `target` **IStateTreeNode** 
-   `listener`  

Returns **IDisposer** 

# isStateTreeNode

Returns true if the given value is a node in a state tree.
More precisely, that is, if the value is an instance of a
`types.model`, `types.array` or `types.map`.

**Parameters**

-   `value` **Any** 

# asReduxStore

Creates a tiny proxy around a MST tree that conforms to the redux store api.
This makes it possible to use MST inside a redux application.

See the [redux-todomvc example](https://github.com/mobxjs/mobx-state-tree/blob/e9e804c8c43e1edde4aabbd52675544e2b3a905b/examples/redux-todomvc/src/index.js#L20) for more details.

**Parameters**

-   `model` **Any** 
-   `middlewares` **...[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;MiddleWare>** 

Returns **IReduxStore** 

# connectReduxDevtools

Connects a MST tree to the Redux devtools.
See this [example](https://github.com/mobxjs/mobx-state-tree/blob/e9e804c8c43e1edde4aabbd52675544e2b3a905b/examples/redux-todomvc/src/index.js#L21) for a setup example.

**Parameters**

-   `remoteDevDep` **Any** 
-   `model` **Any** 
