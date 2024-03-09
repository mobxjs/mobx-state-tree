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
