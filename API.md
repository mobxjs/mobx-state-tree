# props

[src/types/complex-types/object.js:35-35](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/types/complex-types/object.js#L35-L35 "Source code on GitHub")

Parsed description of all properties

# onPatch

[src/core/mst-operations.js:23-25](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/mst-operations.js#L23-L25 "Source code on GitHub")

Registers a function that will be invoked for each that as made to the provided model instance, or any of it's children.
See 'patches' for more details. onPatch events are emitted immediately and will not await the end of a transaction.
Patches can be used to deep observe a model tree.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** the model instance from which to receive patches
-   `callback`  

Returns **IDisposer** function to remove the listener

# applyPatch

[src/core/mst-operations.js:37-42](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/mst-operations.js#L37-L42 "Source code on GitHub")

Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `patch` **IJsonPatch** 

# applyAction

[src/core/mst-operations.js:65-69](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/mst-operations.js#L65-L69 "Source code on GitHub")

Applies a series of actions in a single MobX transaction.
Does not return any value

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `actions` **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;IActionCall>** 
-   `options` **\[IActionCallOptions]** 

# applyAction

[src/core/action.js:104-112](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/action.js#L104-L112 "Source code on GitHub")

Dispatches an Action on a model instance. All middlewares will be triggered.
Returns the value of the last actoin

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `action` **IActionCall** 
-   `options` **\[IActionCallOptions]** 

# protect

[src/core/mst-operations.js:101-106](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/mst-operations.js#L101-L106 "Source code on GitHub")

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

[src/core/mst-operations.js:116-118](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/mst-operations.js#L116-L118 "Source code on GitHub")

Returns true if the object is in protected mode, @see protect

**Parameters**

-   `target`  

# applySnapshot

[src/core/mst-operations.js:127-129](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/mst-operations.js#L127-L129 "Source code on GitHub")

Applies a snapshot to a given model instances. Patch and snapshot listeners will be invoked as usual.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `snapshot` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

# hasParent

[src/core/mst-operations.js:141-152](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/mst-operations.js#L141-L152 "Source code on GitHub")

Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `depth` **[number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number)** = 1, how far should we look upward?

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

# getPath

[src/core/mst-operations.js:176-178](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/mst-operations.js#L176-L178 "Source code on GitHub")

Returns the path of the given object in the model tree

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

# getPathParts

[src/core/mst-operations.js:186-188](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/mst-operations.js#L186-L188 "Source code on GitHub")

Returns the path of the given object as unescaped string array

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)&lt;[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)>** 

# isRoot

[src/core/mst-operations.js:196-198](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/mst-operations.js#L196-L198 "Source code on GitHub")

Returns true if the given object is the root of a model tree

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 

Returns **[boolean](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean)** 

# resolvePath

[src/core/mst-operations.js:207-212](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/mst-operations.js#L207-L212 "Source code on GitHub")

Resolves a path relatively to a given object.

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** escaped json path

Returns **Any** 

# tryResolve

[src/core/mst-operations.js:227-232](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/mst-operations.js#L227-L232 "Source code on GitHub")

**Parameters**

-   `target` **[Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** 
-   `path` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** 

Returns **Any** 

# clone

[src/core/mst-operations.js:244-251](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/mst-operations.js#L244-L251 "Source code on GitHub")

**Parameters**

-   `source` **T** 
-   `keepEnvironment`  

Returns **T** 

# detach

[src/core/mst-operations.js:255-259](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/mst-operations.js#L255-L259 "Source code on GitHub")

Removes a model element from the state tree, and let it live on as a new state tree

**Parameters**

-   `thing`  

# destroy

[src/core/mst-operations.js:263-270](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/mst-operations.js#L263-L270 "Source code on GitHub")

Removes a model element from the state tree, and mark it as end-of-life; the element should not be used anymore

**Parameters**

-   `thing`  

# walk

[src/core/mst-operations.js:287-295](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/mst-operations.js#L287-L295 "Source code on GitHub")

Performs a depth first walk through a tree

**Parameters**

-   `thing`  
-   `processor`  

# escapeJsonPath

[src/core/json-patch.js:7-9](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/json-patch.js#L7-L9 "Source code on GitHub")

escape slashes and backslashes
<http://tools.ietf.org/html/rfc6901>

**Parameters**

-   `str`  

# unescapeJsonPath

[src/core/json-patch.js:13-15](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/json-patch.js#L13-L15 "Source code on GitHub")

unescape slashes and backslashes

**Parameters**

-   `str`  

# get

[src/core/node.js:52-56](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/node.js#L52-L56 "Source code on GitHub")

Returnes (escaped) path representation as string

# pseudoAction

[src/core/node.js:297-302](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/core/node.js#L297-L302 "Source code on GitHub")

Pseudo action is an action that is not named, does not trigger middleware but does unlock the tree.
Used for applying (initial) snapshots and patches

**Parameters**

-   `fn`  

# ComplexType

[src/types/type.js:6-77](https://github.com/mweststrate/mobx-state-tree/blob/3aa62059ae5419bf87545466558beff12f604796/src/types/type.js#L6-L77 "Source code on GitHub")

A complex type produces a MST node (Node in the state tree)
