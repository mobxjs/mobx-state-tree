---
id: auto-generated-property-setter-actions
title: Auto-Generated Property Setter Actions
---

This recipe was [originally developed by Infinite Red](https://shift.infinite.red/a-mobx-state-tree-shortcut-for-setter-actions-ac88353df060).

If you want to modify your MobX-State-Tree model properties, you usually have to write one setter per-property. In a model with two fields, that looks like this:

```ts
import { types } from "mobx-state-tree"

const UserModel = types
  .model("User", {
    name: types.string,
    age: types.number
  })
  .actions((self) => ({
    setName(newName: string) {
      self.name = newName
    },
    setAge(newAge: number) {
      self.age = newAge
    }
  }))
```

As your model grows in size and complexity, these setter actions can be tedious to write, and increase your source file size, making it harder to read through the actual logic of your model.

You can write a generic action in your model, like this:

```ts
import { types, SnapshotIn } from "mobx-state-tree"
const UserModel = types
  .model("User", {
    name: types.string,
    age: types.number
  })
  .actions((self) => ({
    setProp<K extends keyof SnapshotIn<typeof self>, V extends SnapshotIn<typeof self>[K]>(
      field: K,
      newValue: V
    ) {
      self[field] = newValue
    }
  }))
const user = UserModel.create({ name: "Jamon", age: 40 })
user.setProp("name", "Joe") // all good!
// typescript will error, like it's supposed to
user.setProp("age", "shouldn't work")
```

Or, if you want to extract that for easier reuse across different models, you can write a helper, like this:

```ts
import { IStateTreeNode, SnapshotIn } from "mobx-state-tree"

// This custom type helps TS know what properties can be modified by our returned function. It excludes actions and views, but still correctly infers model properties for auto-complete and type safety.
type OnlyProperties<T> = {
  [K in keyof SnapshotIn<T>]: K extends keyof T ? T[K] : never
}

/**
 * If you include this in your model in an action() block just under your props,
 * it'll allow you to set property values directly while retaining type safety
 * and also is executed in an action. This is useful because often you find yourself
 * making a lot of repetitive setter actions that only update one prop.
 *
 * E.g.:
 *
 *  const UserModel = types.model("User")
 *    .props({
 *      name: types.string,
 *      age: types.number
 *    })
 *    .actions(withSetPropAction)
 *
 *   const user = UserModel.create({ name: "Jamon", age: 40 })
 *
 *   user.setProp("name", "John") // no type error
 *   user.setProp("age", 30)      // no type error
 *   user.setProp("age", "30")    // type error -- must be number
 */
export const withSetPropAction = <T extends IStateTreeNode>(mstInstance: T) => ({
  setProp<K extends keyof OnlyProperties<T>, V extends SnapshotIn<T>[K]>(field: K, newValue: V) {
    ;(mstInstance as T & OnlyProperties<T>)[field] = newValue
  }
})
```

You can use the helper in a model like so:

```ts
import { t } from "mobx-state-tree"
import { withSetPropAction } from "./withSetPropAction"

const Person = t
  .model("Person", {
    name: t.string
  })
  .views((self) => ({
    get lowercaseName() {
      return self.name.toLowerCase()
    }
  }))
  .actions((self) => ({
    setName(name: string) {
      self.name = name
    }
  }))
  .actions(withSetPropAction)

const you = Person.create({
  name: "your name"
})

you.setProp("name", "Another Name")

// These will all trigger runtime errors. They are included to demonstrate TS support for
// withSetPropAction.
try {
  // @ts-expect-error - this should error because it's the wrong type for name.
  you.setProp("name", 123)
  // @ts-expect-error - this should error since 'nah' is not a property.
  you.setProp("nah", 123)
  // @ts-expect-error - we cannot set views like we can with properties.
  you.setProp("lowercaseName", "your name")
  // @ts-expect-error - we cannot set actions like we can with properties.
  you.setProp("setName", "your name")
} catch (e) {
  console.error(e)
}
```

[See this working in CodeSandbox](https://codesandbox.io/p/sandbox/set-prop-action-ts-fix-p5psk7?file=%2Fsrc%2Findex.ts%3A9%2C23).

This is a type-safe way to reduce boilerplate and make your MobX-State-Tree models more readable.
