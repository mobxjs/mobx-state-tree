---
id: more-tips
title: Miscellaneous Tips
---

<div id="codefund"></div>

### Generate MST models from JSON

The following service can generate MST models based on JSON: https://transform.now.sh/json-to-mobx-state-tree

### `optionals` and default value functions

`types.optional` can take an optional function parameter which will be invoked each time a default value is needed. This is useful to generate timestamps, identifiers or even complex objects, for example:

`createdDate: types.optional(types.Date, () => new Date())`

### `toJSON()` for debugging

For debugging you might want to use `getSnapshot(model, applyPostProcess)` to print the state of a model. If you didn't import `getSnapshot` while debugging in some debugger, don't worry, `model.toJSON()` will produce the same snapshot. (For API consistency, this feature is not part of the typed API).

#### Optional/empty maps/arrays

Since v3, maps and arrays are optional by default, this is:

```javascript
types.map(OtherType)
// is the same as
types.optional(types.map(OtherType), {})

types.array(OtherType)
// is the same as
types.optional(types.array(OtherType), [])
```

#### Complex union types

Union types works well when the types are primitives. Unions might cause bugs when complex types are involved. For Example

```javascript
const Foo = types.model({ foo: types.array(types.string) })
const Bar = types.model({ bar: types.array(types.number) })
const FooBar = types.union(Foo, Bar)

const test_foo = { foo: ["test"] }
const test_bar = { bar: [200] }

const unionStore = Store.create({
    foobars: [test_foo, test_bar]
})

const foo = unionStore.foobars[0]
const bar = unionStore.foobars[1]
console.log(foo, bar)

// Expected: { foo: ["test"], bar: [200] }
// Actual: { foo: ["test"], foo: [] }
```

This can be solved in two ways

**Using Dispatcher:**

You can provide first arg with a _dispatcher_ that provides _snapshot_ which can be used to explicitly return the `type` of the model

```javascript
const FooBar = types.union(
    {
        dispatcher: (snapshot) => {
            console.log({ snapshot })
            if (snapshot.foo) {
                return Foo
            }
            return Bar
        }
    },
    Foo,
    Bar
)
```

**Using Literals:**

Adding type literal to the Base Models to identify the type

```javascript
const Foo = types.model({
    foo: types.array(types.string),
    type: types.literal("foo")
})

const Bar = types.model({
    bar: types.array(types.number),
    type: types.literal("bar")
})
```

### Building with production environment

MobX-state-tree provides a lot of dev-only checks. They check the correctness of function calls and perform runtime type-checks over your models. It is recommended to disable them in production builds. To do so, you should use webpack's DefinePlugin to set environment as production and remove them. More information could be found in the [official webpack guides](https://webpack.js.org/plugins/environment-plugin/#usage).
