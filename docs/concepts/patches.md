---
id: patches
title: Patches
---

<div id="codefund"></div>

<details>
    <summary style="color: white; background:#ff7000;padding:5px;margin:5px;border-radius:2px">egghead.io lesson 3: Test mobx-state-tree Models by Recording Snapshots or Patches</summary>
    <br>
    <div style="padding:5px;">
        <iframe style="border: none;" width=760 height=427  src="https://egghead.io/lessons/react-test-mobx-state-tree-models-by-recording-snapshots-or-patches/embed" ></iframe>
    </div>
    <a style="font-style:italic;padding:5px;margin:5px;"  href="https://egghead.io/lessons/react-test-mobx-state-tree-models-by-recording-snapshots-or-patches">Hosted on egghead.io</a>
</details>

Modifying a model does not only result in a new snapshot, but also in a stream of [JSON-patches](http://jsonpatch.com/) describing which modifications were made.
Patches have the following signature:

    export interface IJsonPatch {
        op: "replace" | "add" | "remove"
        path: string
        value?: any
    }

- Patches are constructed according to JSON-Patch, RFC 6902
- Patches are emitted immediately when a mutation is made and don't respect transaction boundaries (like snapshots)
- Patch listeners can be used to achieve deep observing
- The `path` attribute of a patch contains the path of the event relative to the place where the event listener is attached
- A single mutation can result in multiple patches, for example when splicing an array
- Patches can be reverse applied, which enables many powerful patterns like undo / redo

Useful methods:

- `onPatch(model, listener)` attaches a patch listener to the provided model, which will be invoked whenever the model or any of its descendants is mutated
- `applyPatch(model, patch)` applies a patch (or array of patches) to the provided model

### Patches describe a model instance, not a snapshot

Patches are meant to be applied to a model instance of the same type, with `applyPatch`. They are not a diff between two JSON snapshots, so there are two cases where a recorded patch stream does not apply cleanly to serialized JSON.

**`types.maybe` properties.** `getSnapshot` includes a `types.maybe` property whose value is `undefined` as a key with the value `undefined`, and `JSON.stringify` drops that key. Patches follow the snapshot and use `add` when the property goes from `undefined` to a value, and `remove` when it goes back to `undefined`. A `replace` would name a member that does not exist in the JSON, which RFC 6902 rejects.

**Snapshot processors.** A snapshot processor maps whole snapshots, so it cannot translate a patch path. Patch paths and primitive values describe the instance before post-processing, while a node value inside a patch carries that node's post-processed snapshot. In a tree with post-processing, patch paths can therefore point at members that the post-processed snapshot names differently.

With no snapshot processor in the tree, and patches recorded after this release, the recorded patches apply to a JSON snapshot and reproduce the later JSON snapshot. When you do need to move state between snapshots, `applySnapshot` and `getSnapshot` remain the safe pair.
