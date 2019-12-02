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

All of the below hooks can be created by returning an action with the given name, like:

```javascript
const Todo = types.model("Todo", { done: true }).actions(self => ({
    afterCreate() {
        console.log("Created a new todo!")
    }
}))
```

_⚠ The section below is outdated, and should be updated to use [`types.snapshotProcessor`](/API/#snapshotprocessor) instead of the snapshot hooks⚠_

The exception to this rule are the `preProcessSnapshot` and `postProcessSnapshot` hooks (see `types.snapshotProcessor` as an alternative):

```javascript
types
    .model("Todo", { done: true })
    .preProcessSnapshot(snapshot => ({
        // auto convert strings to booleans as part of preprocessing
        done: snapshot.done === "true" ? true : snapshot.done === "false" ? false : snapshot.done
    }))
    .actions(self => ({
        afterCreate() {
            console.log("Created a new todo!")
        }
    }))
```

Note: pre and post processing are just meant to convert your data into types that are more acceptable to MST. Typically it should be the case that `postProcess(preProcess(snapshot)) === snapshot. If that isn't the case, consider whether you shouldn't be using a dedicated a view instead to normalize your snapshot to some other format you need.

| Hook                  | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterCreate`         | Immediately after an instance is created and initial values are applied. Children will fire this event before parents. You can't make assumptions about the parent safely, use `afterAttach` if you need to.                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `afterAttach`         | As soon as the _direct_ parent is assigned (this node is attached to another node). If an element is created as part of a parent, `afterAttach` is also fired. Unlike `afterCreate`, `afterAttach` will fire breadth first. So, in `afterAttach` one can safely make assumptions about the parent, but in `afterCreate` not                                                                                                                                                                                                                                                                                                                   |
| `beforeDetach`        | As soon as the node is removed from the _direct_ parent, but only if the node is _not_ destroyed. In other words, when `detach(node)` is used                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `beforeDestroy`       | Called before the node is destroyed, as a result of calling `destroy`, or by removing or replacing the node from the tree. Child destructors will fire before parents                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `preProcessSnapshot`  | Before creating an instance or applying a snapshot to an existing instance, this hook is called to give the option to transform the snapshot before it is applied. The hook should be a _pure_ function that returns a new snapshot. This can be useful to do some data conversion, enrichment, property renames, etc. This hook is not called for individual property updates. _\*\*Note 1: Unlike the other hooks, this one is \_not_ created as part of the `actions` initializer, but directly on the type!**\_ \_**Note 2: The `preProcessSnapshot` transformation must be pure; it should not modify its original input argument!\*\*\_ |
| `postProcessSnapshot` | This hook is called every time a new snapshot is being generated. Typically it is the inverse function of `preProcessSnapshot`. This function should be a pure function that returns a new snapshot. _\*\*Note: Unlike the other hooks, this one is \_not_ created as part of the `actions` initializer, but directly on the type!\*\*\_                                                                                                                                                                                                                                                                                                      |

Note, except for `preProcessSnapshot` and `postProcessSnapshot`, all hooks should be defined as actions.

All hooks can be defined multiple times and can be composed automatically.

## LifeCycle hooks for `types.array`/`types.map`

Hooks for `types.array`/`types.map` can be defined by using the `.hooks(self => ({}))` method.

Calling `.hooks(...)` produces new type, same as calling `.actions()` for `types.model`.

Available hooks are:

| Hook                  | Meaning                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `afterCreate`         | Immediately after an instance is initialized: right after `.create()` for root node or after the first access for the nested one. Children will fire this event before parents. You can't make assumptions about the parent safely, use `afterAttach` if you need to.                                                                                                                                                                                                                                                                                                                                                                         |
| `afterAttach`         | As soon as the _direct_ parent is assigned (this node is attached to another node). If an element is created as part of a parent, `afterAttach` is also fired. Unlike `afterCreate`, `afterAttach` will fire breadth first. So, in `afterAttach` one can safely make assumptions about the parent, but in `afterCreate` not                                                                                                                                                                                                                                                                                                                   |
| `beforeDetach`        | As soon as the node is removed from the _direct_ parent, but only if the node is _not_ destroyed. In other words, when `detach(node)` is used                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `beforeDestroy`       | Called before the node is destroyed, as a result of calling `destroy`, or by removing or replacing the node from the tree. Child destructors will fire before parents
