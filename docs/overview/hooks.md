---
id: hooks
title: Lifecycle hooks overview
---

<div id="codefund"></div>

<details>
    <summary style="color: white; background:#ff7000;padding:5px;margin:5px;border-radius:2px">egghead.io lesson 14: Loading Data from the Server after model creation</summary>
    <br>
    <div style="padding:5px;">
        <iframe style="border: none;" width=760 height=427  src="https://egghead.io/lessons/react-loading-data-from-the-server/embed" ></iframe>
    </div>
    <a style="font-style:italic;padding:5px;margin:5px;"  href="https://egghead.io/lessons/react-loading-data-from-the-server">Hosted on egghead.io</a>
</details>

`mobx-state-tree` supports passing a variety of hooks that are called throughout a node's lifecycle. Hooks are passes as actions with the name of the hook, like:

```javascript
const Todo = types.model("Todo", { done: true }).actions((self) => ({
  afterCreate() {
    console.log("Created a new todo!")
  }
}))
```

| Hook                  | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterCreate`         | Immediately after an instance is created and initial values are applied. Children will fire this event before parents. You can't make assumptions about the parent safely, use `afterAttach` if you need to.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `afterAttach`         | As soon as the _direct_ parent is assigned (this node is attached to another node). If an element is created as part of a parent, `afterAttach` is also fired. Unlike `afterCreate`, `afterAttach` will fire breadth first. So, in `afterAttach` one can safely make assumptions about the parent, but in `afterCreate` not                                                                                                                                                                                                                                                                                                                                                                 |
| `beforeDetach`        | As soon as the node is removed from the _direct_ parent, but only if the node is _not_ destroyed. In other words, when `detach(node)` is used                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `beforeDestroy`       | Called before the node is destroyed, as a result of calling `destroy`, or by removing or replacing the node from the tree. Child destructors will fire before parents                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `preProcessSnapshot`  | Deprecated, prefer `types.snapshotProcessor`. Before creating an instance or applying a snapshot to an existing instance, this hook is called to give the option to transform the snapshot before it is applied. The hook should be a _pure_ function that returns a new snapshot. This can be useful to do some data conversion, enrichment, property renames, etc. This hook is not called for individual property updates. _\*\*Note 1: Unlike the other hooks, this one is \_not_ created as part of the `actions` initializer, but directly on the type!**\_ \_**Note 2: The `preProcessSnapshot` transformation must be pure; it should not modify its original input argument!\*\*\_ |
| `postProcessSnapshot` | Deprecated, prefer `types.snapshotProcessor`. This hook is called every time a new snapshot is being generated. Typically it is the inverse function of `preProcessSnapshot`. This function should be a pure function that returns a new snapshot. _\*\*Note: Unlike the other hooks, this one is \_not_ created as part of the `actions` initializer, but directly on the type!\*\*\_                                                                                                                                                                                                                                                                                                      |

All hooks can be defined multiple times and can be composed automatically.

## Lifecycle hooks for `types.array`/`types.map`

Hooks for `types.array`/`types.map` can be defined by using the `.hooks(self => ({}))` method.

Calling `.hooks(...)` produces new type, same as calling `.actions()` for `types.model`.

Available hooks are:

| Hook            | Meaning                                                                                                                                                                                                                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterCreate`   | Immediately after an instance is initialized: right after `.create()` for root node or after the first access for the nested one. Children will fire this event before parents. You can't make assumptions about the parent safely, use `afterAttach` if you need to.                                                       |
| `afterAttach`   | As soon as the _direct_ parent is assigned (this node is attached to another node). If an element is created as part of a parent, `afterAttach` is also fired. Unlike `afterCreate`, `afterAttach` will fire breadth first. So, in `afterAttach` one can safely make assumptions about the parent, but in `afterCreate` not |
| `beforeDetach`  | As soon as the node is removed from the _direct_ parent, but only if the node is _not_ destroyed. In other words, when `detach(node)` is used                                                                                                                                                                               |
| `beforeDestroy` | Called before the node is destroyed, as a result of calling `destroy`, or by removing or replacing the node from the tree. Child destructors will fire before parents                                                                                                                                                       |

### Snapshot processing hooks

You can also modify snapshots as they are generated from your nodes, or applied to your nodes with `types.snapshotProcessor`. This type wraps an existing type and allows defining custom hooks for snapshot modifications.

For example, you can wrap an existing model in a snapshot processor which transforms a snapshot from the server into the shape your model expects with `preProcess`:

```javascript
const TodoModel = types.model("Todo", {
  done: types.boolean,
});

const Todo = types.snapshotProcessor(TodoModel, {
  preProcessor(snapshot) {
    return {
        // auto convert strings to booleans as part of preprocessing
        done: snapshot.done === "true" ? true : snapshot.done === "false" ? false : snapshot.done
    }
});

const todo = Todo.create({ done: "true" }) // snapshot will be transformed on the way in
```

Snapshots can also be transformed from the base shape generated by `mobx-quick-tree` using the `postProcess` hook. For example, we can format a date object in the snapshot with a specific date format that a backend might accept:

```javascript
const TodoModel = types.model("Todo", {
  done: types.boolean,
  createdAt: types.Date
});

const Todo = types.snapshotProcessor(TodoModel, {
  postProcessor(snapshot, node) {
    return {
        ...snapshot,
        createdAt: node.createdAt.getTime()
    }
});

const todo = Todo.create({done: true, createdAt: new Date()});
const snapshot = getSnapshot(todo);
// { done: true, createdAt: 1699504649386 }
```

| Hook                                  | Meaning                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `preProcessor(inputSnapshot)`         | Transform a snapshot before it is applied to a node. The output snapshot must be valid for application to the wrapped type. The `preProcess` hook is passed the input snapshot, but not passed the node, as it is not done being constructed yet, and not attached to the tree. If you need to modify the node in the context of the tree, use the `afterCreate` hook. |
| `postProcessor(outputSnapshot, node)` | Transform a snapshot after it has been generated from a node. The transformed value will be returned by `getSnapshot`. The `postProcess` hook is passed the initial outputSnapshot, as well as the instance object the snapshot has been generated for. It is safe to access properties of the node or other nodes when post processing snapshots.                     |

#### When to use snapshot hooks

`preProcess` and `postProcess` hooks should be used to convert your data into types that are more acceptable to MST. Snapshots are often JSON serialized, so if you need to use richly typed objects like `URL`s or `Date`s that can't be JSON serialized, you can use snapshot processors to convert to and from the serialized form.

Typically, it should be the case that `postProcessor(preProcessor(snapshot)) === snapshot`. If your snapshot processor hooks are non-deterministic, or rely on state beyond just the base snapshot, it's easy to introduce subtle bugs and is best avoided.

If you are considering adding a snapshot processor that is non-deterministic or relies on other state, consider using a dedicated property or view that produces the same information. Like snapshots, properties and views are observable and memoized, but they don't need to have an inverse for serializing back to a snapshot.

For example, if you want to capture the current time a snapshot was generated, you may be tempted to use a snapshot processor:

```javascript
const TodoModel = types.model("Todo", {
  done: types.boolean,
});

const Todo = types.snapshotProcessor(TodoModel, {
  // discouraged, try not to do this
  postProcessor(snapshot, node) {
    return {
        ...snapshot,
        createdAt: new Date().toISOString();
    }
});

const todo = Todo.create({ done: false })
getSnapshot(todo) // will have a `createdAt property`
```

Instead, this data could be better represented as a property right on the model, which is included in the snapshot by default:

```javascript
const Todo = types.model("Todo", {
  done: types.boolean,
  createdAt: types.optional(types.Date, () => new Date())
});

const todo = Todo.create({ done: false })
getSnapshot(todo) // will also have a `createdAt property`
```

Advanced use-cases that require impure or otherwise inconsistent snapshot processors are however supported by MST.
