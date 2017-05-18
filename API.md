# ComplexType

[lib/types/complex-types/complex-type.js:23-69](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/types/complex-types/complex-type.js#L23-L69 "Source code on GitHub")

A complex type produces a MST node (Node in the state tree)

# get

[lib/core/mst-node-administration.js:55-59](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-node-administration.js#L55-L59 "Source code on GitHub")

Returnes (escaped) path representation as string

# pseudoAction

[lib/core/mst-node-administration.js:325-330](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-node-administration.js#L325-L330 "Source code on GitHub")

Pseudo action is an action that is not named, does not trigger middleware but does unlock the tree.
Used for applying (initial) snapshots and patches

**Parameters**

-   `fn`  

# props

[lib/types/complex-types/object.js:47-47](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/types/complex-types/object.js#L47-L47 "Source code on GitHub")

Parsed description of all properties

# addMiddleware

[lib/core/mst-operations.js:50-55](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L50-L55 "Source code on GitHub")

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

[lib/core/mst-operations.js:67-69](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L67-L69 "Source code on GitHub")

Registers a function that will be invoked for each that as made to the provided model instance, or any of it's children.
See 'patches' for more details. onPatch events are emitted immediately and will not await the end of a transaction.
Patches can be used to deep observe a model tree.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the model instance from which to receive patches
-   `callback`  

Returns **IDisposer** function to remove the listener

# applyPatch

[lib/core/mst-operations.js:83-85](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L83-L85 "Source code on GitHub")

Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `patch` **IJsonPatch** 

# applyPatches

[lib/core/mst-operations.js:94-99](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L94-L99 "Source code on GitHub")

Applies a number of JSON patches in a single MobX transaction
TODO: merge with applyPatch

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `patches` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;IJsonPatch>** 

# applyActions

[lib/core/mst-operations.js:126-130](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L126-L130 "Source code on GitHub")

Applies a series of actions in a single MobX transaction.
TODO: just merge with applyAction

Does not return any value

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `actions` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;IActionCall>** 
-   `options` **\[IActionCallOptions]** 

# protect

[lib/core/mst-operations.js:164-167](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L164-L167 "Source code on GitHub")

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

[lib/core/mst-operations.js:177-179](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L177-L179 "Source code on GitHub")

Returns true if the object is in protected mode, @see protect

**Parameters**

-   `target`  

# applySnapshot

[lib/core/mst-operations.js:189-191](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L189-L191 "Source code on GitHub")

Applies a snapshot to a given model instances. Patch and snapshot listeners will be invoked as usual.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `snapshot` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

# hasParent

[lib/core/mst-operations.js:205-215](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L205-L215 "Source code on GitHub")

Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `depth` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** = 1, how far should we look upward?

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

# getPath

[lib/core/mst-operations.js:241-243](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L241-L243 "Source code on GitHub")

Returns the path of the given object in the model tree

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# getPathParts

[lib/core/mst-operations.js:252-254](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L252-L254 "Source code on GitHub")

Returns the path of the given object as unescaped string array

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** 

# isRoot

[lib/core/mst-operations.js:263-265](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L263-L265 "Source code on GitHub")

Returns true if the given object is the root of a model tree

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

# resolve

[lib/core/mst-operations.js:275-280](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L275-L280 "Source code on GitHub")

Resolves a path relatively to a given object.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** escaped json path

Returns **Any** 

# tryResolve

[lib/core/mst-operations.js:290-295](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L290-L295 "Source code on GitHub")

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **Any** 

# clone

[lib/core/mst-operations.js:309-318](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L309-L318 "Source code on GitHub")

**Parameters**

-   `source` **T** 
-   `keepEnvironment`  

Returns **T** 

# detach

[lib/core/mst-operations.js:323-327](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L323-L327 "Source code on GitHub")

Removes a model element from the state tree, and let it live on as a new state tree

**Parameters**

-   `thing`  

# destroy

[lib/core/mst-operations.js:332-339](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L332-L339 "Source code on GitHub")

Removes a model element from the state tree, and mark it as end-of-life; the element should not be used anymore

**Parameters**

-   `thing`  

# walk

[lib/core/mst-operations.js:359-367](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-operations.js#L359-L367 "Source code on GitHub")

Performs a depth first walk through a tree

**Parameters**

-   `thing`  
-   `processor`  

# applyAction

[lib/core/action.js:107-114](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/action.js#L107-L114 "Source code on GitHub")

Dispatches an Action on a model instance. All middlewares will be triggered.
Returns the value of the last actoin

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `action` **IActionCall** 
-   `options` **\[IActionCallOptions]** 

# maybeMST

[lib/core/mst-node.js:28-40](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/mst-node.js#L28-L40 "Source code on GitHub")

Tries to convert a value to a TreeNode. If possible or already done,
the first callback is invoked, otherwise the second.
The result of this function is the return value of the callbacks, or the original value if the second callback is omitted

**Parameters**

-   `value`  
-   `asNodeCb`  
-   `asPrimitiveCb`  

# escapeJsonPath

[lib/core/json-patch.js:9-11](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/json-patch.js#L9-L11 "Source code on GitHub")

escape slashes and backslashes
<http://tools.ietf.org/html/rfc6901>

**Parameters**

-   `str`  

# unescapeJsonPath

[lib/core/json-patch.js:16-18](https://github.com/mweststrate/mobx-state-tree/blob/7271053430fc96b6c81944f60702543b69767c23/lib/core/json-patch.js#L16-L18 "Source code on GitHub")

unescape slashes and backslashes

**Parameters**

-   `str`  
