# maybeMST

[lib/core/mst-node.js:28-40](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-node.js#L28-L40 "Source code on GitHub")

Tries to convert a value to a TreeNode. If possible or already done,
the first callback is invoked, otherwise the second.
The result of this function is the return value of the callbacks, or the original value if the second callback is omitted

**Parameters**

-   `value`  
-   `asNodeCb`  
-   `asPrimitiveCb`  

# ComplexType

[lib/types/complex-types/complex-type.js:18-53](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/types/complex-types/complex-type.js#L18-L53 "Source code on GitHub")

A complex type produces a MST node (Node in the state tree)

# get

[lib/core/mst-node-administration.js:51-55](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-node-administration.js#L51-L55 "Source code on GitHub")

Returnes (escaped) path representation as string

# pseudoAction

[lib/core/mst-node-administration.js:316-321](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-node-administration.js#L316-L321 "Source code on GitHub")

Pseudo action is an action that is not named, does not trigger middleware but does unlock the tree.
Used for applying (initial) snapshots and patches

**Parameters**

-   `fn`  

# map

[lib/types/index.js:24-26](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/types/index.js#L24-L26 "Source code on GitHub")

**Parameters**

-   `subFactory` **\[ModelFactory]**  (optional, default `primitiveFactory`)

# array

[lib/types/index.js:34-36](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/types/index.js#L34-L36 "Source code on GitHub")

**Parameters**

-   `subFactory` **\[ModelFactory]**  (optional, default `primitiveFactory`)

# props

[lib/types/complex-types/object.js:45-45](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/types/complex-types/object.js#L45-L45 "Source code on GitHub")

Parsed description of all properties

# addMiddleware

[lib/core/mst-operations.js:50-55](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L50-L55 "Source code on GitHub")

TODO: update docs
Registers middleware on a model instance that is invoked whenever one of it's actions is called, or an action on one of it's children.
Will only be invoked on 'root' actions, not on actions called from existing actions.

The callback receives two parameter: the `action` parameter describes the action being invoked. The `next()` function can be used
to kick off the next middleware in the chain. Not invoking `next()` prevents the action from actually being executed!

Action calls have the following signature:

    export type IActionCall = {
       name: string;
       path?: string;
       args?: any[];
    }

Example of a logging middleware:

    function logger(action, next) {
      console.dir(action)
      return next()
    }

    onAction(myStore, logger)

    myStore.user.setAge(17)

    // emits:
    {
       name: "setAge"
       path: "/user",
       args: [17]
    }

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** model to intercept actions on
-   `middleware`  

Returns **IDisposer** function to remove the middleware

# onPatch

[lib/core/mst-operations.js:67-69](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L67-L69 "Source code on GitHub")

Registers a function that will be invoked for each that as made to the provided model instance, or any of it's children.
See 'patches' for more details. onPatch events are emitted immediately and will not await the end of a transaction.
Patches can be used to deep observe a model tree.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the model instance from which to receive patches
-   `callback`  

Returns **IDisposer** function to remove the listener

# applyPatch

[lib/core/mst-operations.js:83-85](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L83-L85 "Source code on GitHub")

Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `patch` **IJsonPatch** 

# applyPatches

[lib/core/mst-operations.js:94-99](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L94-L99 "Source code on GitHub")

Applies a number of JSON patches in a single MobX transaction

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `patches` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;IJsonPatch>** 

# applyActions

[lib/core/mst-operations.js:125-129](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L125-L129 "Source code on GitHub")

Applies a series of actions in a single MobX transaction.

Does not return any value

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `actions` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;IActionCall>** 
-   `options` **\[IActionCallOptions]** 

# protect

[lib/core/mst-operations.js:163-165](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L163-L165 "Source code on GitHub")

By default it is allowed to both directly modify a model or through an action.
However, in some cases you want to guarantee that the state tree is only modified through actions.
So that replaying action will reflect everything that can possible have happened to your objects, or that every mutation passes through your action middleware etc.
To disable modifying data in the tree without action, simple call `protect(model)`. Protect protects the passed model an all it's children

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

[lib/core/mst-operations.js:174-176](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L174-L176 "Source code on GitHub")

Returns true if the object is in protected mode, @see protect

**Parameters**

-   `target`  

# applySnapshot

[lib/core/mst-operations.js:186-188](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L186-L188 "Source code on GitHub")

Applies a snapshot to a given model instances. Patch and snapshot listeners will be invoked as usual.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `snapshot` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

# hasParent

[lib/core/mst-operations.js:202-212](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L202-L212 "Source code on GitHub")

Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `depth` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** = 1, how far should we look upward?

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

# getPath

[lib/core/mst-operations.js:238-240](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L238-L240 "Source code on GitHub")

Returns the path of the given object in the model tree

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# getPathParts

[lib/core/mst-operations.js:249-251](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L249-L251 "Source code on GitHub")

Returns the path of the given object as unescaped string array

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** 

# isRoot

[lib/core/mst-operations.js:260-262](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L260-L262 "Source code on GitHub")

Returns true if the given object is the root of a model tree

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

# resolve

[lib/core/mst-operations.js:272-276](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L272-L276 "Source code on GitHub")

Resolves a path relatively to a given object.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** escaped json path

Returns **Any** 

# tryResolve

[lib/core/mst-operations.js:286-291](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L286-L291 "Source code on GitHub")

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **Any** 

# clone

[lib/core/mst-operations.js:305-314](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L305-L314 "Source code on GitHub")

**Parameters**

-   `source` **T** 
-   `keepEnvironment`  

Returns **T** 

# detach

[lib/core/mst-operations.js:319-322](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L319-L322 "Source code on GitHub")

Removes a model element from the state tree, and let it live on as a new state tree

**Parameters**

-   `thing`  

# destroy

[lib/core/mst-operations.js:327-333](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L327-L333 "Source code on GitHub")

Removes a model element from the state tree, and mark it as end-of-life; the element should not be used anymore

**Parameters**

-   `thing`  

# walk

[lib/core/mst-operations.js:353-361](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/mst-operations.js#L353-L361 "Source code on GitHub")

Performs a depth first walk through a tree

**Parameters**

-   `thing`  
-   `processor`  

# applyAction

[lib/core/action.js:107-114](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/action.js#L107-L114 "Source code on GitHub")

Dispatches an Action on a model instance. All middlewares will be triggered.
Returns the value of the last actoin

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `action` **IActionCall** 
-   `options` **\[IActionCallOptions]** 

# escapeJsonPath

[lib/core/json-patch.js:9-11](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/json-patch.js#L9-L11 "Source code on GitHub")

escape slashes and backslashes
<http://tools.ietf.org/html/rfc6901>

**Parameters**

-   `str`  

# unescapeJsonPath

[lib/core/json-patch.js:16-18](https://github.com/mweststrate/mobx-state-tree/blob/daca22a164cea51037b1be571b96d98ab5ff3988/lib/core/json-patch.js#L16-L18 "Source code on GitHub")

unescape slashes and backslashes

**Parameters**

-   `str`  
