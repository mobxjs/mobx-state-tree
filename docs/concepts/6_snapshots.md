
### Snapshots

<i><a style="color: white; background:cornflowerblue;padding:5px;margin:5px;border-radius:2px" href="https://egghead.io/lessons/react-test-mobx-state-tree-models-by-recording-snapshots-or-patches">egghead.io lesson 3: Test mobx-state-tree Models by Recording Snapshots or Patches</a></i><br>
<i><a style="color: white; background:cornflowerblue;padding:5px;margin:5px;border-radius:2px" href="https://egghead.io/lessons/react-store-store-in-local-storage">egghead.io lesson 9: Store Store in Local Storage</a></i><br>
<i><a style="color: white; background:cornflowerblue;padding:5px;margin:5px;border-radius:2px" href="https://egghead.io/lessons/react-automatically-send-changes-to-the-server-by-using-onsnapshot">egghead.io lesson 16: Automatically Send Changes to the Server by Using onSnapshot</a></i>

Snapshots are the immutable serialization, in plain objects, of a tree at a specific point in time.
Snapshots can be inspected through `getSnapshot(node, applyPostProcess)`.
Snapshots don't contain any type information and are stripped from all actions, etc., so they are perfectly suitable for transportation.
Requesting a snapshot is cheap as MST always maintains a snapshot of each node in the background and uses structural sharing.

```javascript
coffeeTodo.setTitle("Tea instead plz")

console.dir(getSnapshot(coffeeTodo))
// prints `{ title: "Tea instead plz" }`
```

Some interesting properties of snapshots:

-   Snapshots are immutable
-   Snapshots can be transported
-   Snapshots can be used to update models or restore them to a particular state
-   Snapshots are automatically converted to models when needed. So, the two following statements are equivalent: `store.todos.push(Todo.create({ title: "test" }))` and `store.todos.push({ title: "test" })`.

Useful methods:

-   `getSnapshot(model, applyPostProcess)`: returns a snapshot representing the current state of the model
-   `onSnapshot(model, callback)`: creates a listener that fires whenever a new snapshot is available (but only one per MobX transaction).
-   `applySnapshot(model, snapshot)`: updates the state of the model and all its descendants to the state represented by the snapshot
