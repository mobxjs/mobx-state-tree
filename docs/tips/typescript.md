---
id: typescript
title: TypeScript and MST
---

<div id="codefund"></div>

TypeScript support is best-effort as not all patterns can be expressed in TypeScript. Except for assigning snapshots to properties we get pretty close! As MST uses the latest fancy TypeScript features it is required to use TypeScript 3.0 or later with `noImplicitThis` and `strictNullChecks` enabled.
Actually, the more strict options that are enabled, the better the type system will behave.

#### Recommend compiler flags

The recommended compiler flags (against which all our tests are written) are:

```json
{
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitAny": true,
    "noImplicitReturns": true,
    "noImplicitThis": true
}
```

Or shorter by leveraging `strict`:

```json
{
  "strict": true,
  "noImplicitReturns": true
}
```

Flow is not supported.

#### Using a MST type at design time

When using models, you write an interface, along with its property types, that will be used to perform type checks at runtime.
What about compile time? You can use TypeScript interfaces to perform those checks, but that would require writing again all the properties and their actions!

Good news! You don't need to write it twice!

There are four kinds of types available, plus one helper type:

-   `Instance<typeof TYPE>` or `Instance<typeof VARIABLE>` is the node instance type. (Legacy form is `typeof MODEL.Type`).
-   `SnapshotIn<typeof TYPE>` or `SnapshotIn<typeof VARIABLE>` is the input (creation) snapshot type. (Legacy form is `typeof MODEL.CreationType`).
-   `SnapshotOut<typeof TYPE>` or `SnapshotOut<typeof VARIABLE>` is the output (creation) snapshot type. (Legacy form is `typeof MODEL.SnapshotType`).
-   `SnapshotOrInstance<typeof TYPE>` or `SnapshotOrInstance<typeof VARIABLE>` is `SnapshotIn<T> | Instance<T>`. This type is useful when you want to declare an input parameter that is able consume both types.
-   `TypeOfValue<typeof VARIABLE>` gets the original type for the given instance. Note that this only works for complex values (models, arrays, maps...) but not for simple values (number, string, boolean, string, undefined).

```typescript
import { types, Instance, SnapshotIn, SnapshotOut } from "mobx-state-tree";

const Todo = types
    .model({
        title: "hello"
    })
    .actions(self => ({
        setTitle(v: string) {
            self.title = v
        }
    }))

interface ITodo extends Instance<typeof Todo> {} // => { title: string; setTitle: (v: string) => void }
interface ITodoSnapshotIn extends SnapshotIn<typeof Todo> {} // => { title?: string }
interface ITodoSnapshotOut extends SnapshotOut<typeof Todo> {} // => { title: string }
```

Note, it is important to use `interface` and not `type` when constructing those types! Although `type`s will work exactly the same, due to their nature they will be [much more expensive for the compiler to typecheck](https://github.com/microsoft/TypeScript/wiki/Performance#preferring-interfaces-over-intersections).

For further performance tips, read the [official TypeScript performance wiki](https://github.com/microsoft/TypeScript/wiki/Performance).

#### Typing `self` in actions and views

The type of `self` is what `self` was **before the action or views blocks starts**, and only after that part finishes, the actions will be added to the type of `self`.

Sometimes you'll need to take into account where your typings are available and where they aren't. The code below will not compile: TypeScript will complain that `self.upperProp` is not a known property. Computed properties are only available after `.views` is evaluated.

For example:

```typescript
const Example = types
    .model("Example", {
        prop: types.string
    })
    .views(self => ({
        get upperProp(): string {
            return self.prop.toUpperCase()
        },
        get twiceUpperProp(): string {
            return self.upperProp + self.upperProp // Compile error: `self.upperProp` is not yet defined
        }
    }))
```

You can circumvent this situation by using `this` whenever you intend to use the newly declared computed values that are local to the current object:

```typescript
const Example = types.model("Example", { prop: types.string }).views(self => ({
    get upperProp(): string {
        return self.prop.toUpperCase()
    },
    get twiceUpperProp(): string {
        return this.upperProp + this.upperProp
    }
}))
```

Alternatively you can also declare multiple `.views` block, in which case the `self` parameter gets extended after each block.

```typescript
const Example = types
  .model('Example', { prop: types.string })
  .views(self => {
    get upperProp(): string {
      return self.prop.toUpperCase();
    },
  }))
  .views(self => ({
    get twiceUpperProp(): string {
      return self.upperProp + self.upperProp;
    },
  }));
```

As a last resort, although not recommended due to the performance penalty (see the note below), you may declare the views in two steps:

```typescript
const Example = types
  .model('Example', { prop: types.string })
  .views(self => {
      const views = {
        get upperProp(): string {
            return self.prop.toUpperCase();
        },
        get twiceUpperProp(): string {
            return views.upperProp + views.upperProp;
        }
      }
      return views
  }))
```

_**NOTE: the last approach will incur runtime performance penalty as accessing such computed values (e.g. inside `render()` method of an observed component) always leads to full recompute (see [this issue](https://github.com/mobxjs/mobx-state-tree/issues/818#issue-323164363) for details). For a heavily used computed properties it's recommended to use one of above approaches.**_

Similarly, when writing actions or views one can use helper functions:

```typescript
import { types, flow } from "mobx-state-tree"

const Example = types.model("Example", { prop: types.string }).actions(self => {
    // Don't forget that async operations HAVE
    // to use `flow( ... )`.
    const fetchData = flow(function* fetchData() {
        yield doSomething()
    })

    return {
        fetchData,
        afterCreate() {
            // Notice that we call the function directly
            // instead of using `self.fetchData()`. This is
            // because Typescript doesn't know yet about `fetchData()`
            // being part of `self` in this context.
            fetchData()
        }
    }
})
```
