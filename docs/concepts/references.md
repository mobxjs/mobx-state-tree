---
id: references
title: Identifiers and references
---

<div id="codefund"></div>

### References and identifiers

<i><a style="color: white; background:cornflowerblue;padding:5px;margin:5px;border-radius:2px" href="https://egghead.io/lessons/react-create-relationships-in-your-data-with-mobx-state-tree-using-references-and-identifiers">egghead.io lesson 13: Create Relationships in your Data with mobx-state-tree Using References and Identifiers</a></i>

References and identifiers are a first-class concept in MST.
This makes it possible to declare references and keep the data normalized in the background, while you interact with it in a denormalized manner.

Example:

```javascript
const Todo = types.model({
    id: types.identifier,
    title: types.string
})

const TodoStore = types.model({
    todos: types.array(Todo),
    selectedTodo: types.reference(Todo)
})

// create a store with a normalized snapshot
const storeInstance = TodoStore.create({
    todos: [
        {
            id: "47",
            title: "Get coffee"
        }
    ],
    selectedTodo: "47"
})

// because `selectedTodo` is declared to be a reference, it returns the actual Todo node with the matching identifier
console.log(storeInstance.selectedTodo.title)
// prints "Get coffee"
```

#### Identifiers

-   Each model can define zero or one `identifier()` properties
-   The identifier property of an object cannot be modified after initialization
-   Each identifier / type combination should be unique within the entire tree
-   Identifiers are used to reconcile items inside arrays and maps - wherever possible - when applying snapshots
-   The `map.put()` method can be used to simplify adding objects that have identifiers to [maps](docs/API/README.md#typesmap)
-   The primary goal of identifiers is not validation, but reconciliation and reference resolving. For this reason identifiers cannot be defined or updated after creation. If you want to check if some value just looks as an identifier, without providing the above semantics; use something like: `types.refinement(types.string, v => v.match(/someregex/))`

_Tip: If you know the format of the identifiers in your application, leverage `types.refinement` to actively check this, for example the following definition enforces that identifiers of `Car` always start with the string `"Car_"`:

```javascript
const Car = types.model("Car", {
    id: types.refinement(types.identifier, identifier => identifier.indexOf("Car_") === 0)
})
```

#### References

References are defined by mentioning the type they should resolve to. The targeted type should have exactly one attribute of the type `identifier`.
References are looked up through the entire tree but per type, so identifiers need to be unique in the entire tree.

#### Customizable references

The default implementation uses the `identifier` cache to resolve references (See [`resolveIdentifier`](docs/API/README.md#resolveIdentifier)).
However, it is also possible to override the resolve logic and provide your own custom resolve logic.
This also makes it possible to, for example, trigger a data fetch when trying to resolve the reference ([example](https://github.com/mobxjs/mobx-state-tree/blob/master/packages/mobx-state-tree/__tests__/core/reference-custom.test.ts#L148)).

Example:

```javascript
const User = types.model({
    id: types.identifier,
    name: types.string
})

const UserByNameReference = types.maybeNull(
    types.reference(User, {
        // given an identifier, find the user
        get(identifier /* string */, parent: any /*Store*/) {
            return parent.users.find(u => u.name === identifier) || null
        },
        // given a user, produce the identifier that should be stored
        set(value /* User */) {
            return value.name
        }
    })
)

const Store = types.model({
    users: types.array(User),
    selection: UserByNameReference
})

const s = Store.create({
    users: [{ id: "1", name: "Michel" }, { id: "2", name: "Mattia" }],
    selection: "Mattia"
})
```

#### Reference validation: `isValidReference`, `tryReference`, `onInvalidated` hook and `types.safeReference`

Accessing an invalid reference (a reference to a dead/detached node) triggers an exception.

In order to check if a reference is valid, MST offers the `isValidReference(() => ref): boolean` function:

```ts
const isValid = isValidReference(() => store.myRef)
```

Also, if you are unsure if a reference is valid or not you can use the `tryReference(() => ref): ref | undefined` function:

```ts
// the result will be the passed ref if ok, or undefined if invalid
const maybeValidRef = tryReference(() => store.myRef)
```

The options parameter for references also accepts an optional `onInvalidated` hook, which will be called when the reference target node that the reference is pointing to is about to be detached/destroyed. It has the following signature:

```ts
const refWithOnInvalidated = types.reference(Todo, {
    onInvalidated(event: {
        // what is causing the target to become invalidated
        cause: "detach" | "destroy" | "invalidSnapshotReference"
        // the target that is about to become invalidated (undefined if "invalidSnapshotReference")
        invalidTarget: STN | undefined
        // the identifier that is about to become invalidated
        invalidId: string | number
        // parent node of the reference (not the reference target)
        parent: IAnyStateTreeNode
        // a function to remove the reference from its parent (or set to undefined in the case of models)
        removeRef: () => void
        // a function to set our reference to a new target
        replaceRef: (newRef: STN | null | undefined) => void
    }) {
        // do something
    }
})
```

Note that invalidation will only trigger while the reference is attached to a parent (be it a model, an array, a map, etc.).

A default implementation of such `onInvalidated` hook is provided by the `types.safeReference` type. It is like a standard reference, except that once the target node becomes invalidated it will:

-   If its parent is a model: Set its own property to `undefined`
-   If its parent is an array: Remove itself from the array
-   If its parent is a map: Remove itself from the map

In addition to the options possible for a plain reference type, the optional options parameter object also accepts a parameter named `acceptsUndefined`, which is set to true by default, so it is suitable for model properties.
When used inside collections (arrays/maps) it is recommended to set this option to false so it can't take undefined as value, which is usually the desired in those cases.

Strictly speaking, `safeReference` with `acceptsUndefined` set to true (the default) is implemented as

```js
types.maybe(
    types.reference(Type, {
        ...customGetSetIfAvailable,
        onInvalidated(ev) {
            ev.removeRef()
        }
    })
)
```

and with `acceptsUndefined` set to false as

```js
types.reference(Type, {
    ...customGetSetIfAvailable,
    onInvalidated(ev) {
        ev.removeRef()
    }
})
```

```js
const Todo = types.model({ id: types.identifier })
const Store = types.model({
    todos: types.array(Todo),
    selectedTodo: types.safeReference(Todo),
    multipleSelectedTodos: types.array(types.safeReference(Todo, { acceptsUndefined: false }))
})

// given selectedTodo points to a valid Todo and that Todo is later removed from the todos
// array, then selectedTodo will automatically become undefined, and if it is included in multipleSelectedTodos
// then it will be removed from the array
```
