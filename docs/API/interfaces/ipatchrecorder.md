[mobx-state-tree](../README.md) > [IPatchRecorder](../interfaces/ipatchrecorder.md)

# Interface: IPatchRecorder

## Hierarchy

**IPatchRecorder**

## Index

### Properties

* [inversePatches](ipatchrecorder.md#inversepatches)
* [patches](ipatchrecorder.md#patches)

### Methods

* [replay](ipatchrecorder.md#replay)
* [stop](ipatchrecorder.md#stop)
* [undo](ipatchrecorder.md#undo)

---

## Properties

<a id="inversepatches"></a>

###  inversePatches

**● inversePatches**: *`ReadonlyArray`<[IJsonPatch](ijsonpatch.md)>*

___
<a id="patches"></a>

###  patches

**● patches**: *`ReadonlyArray`<[IJsonPatch](ijsonpatch.md)>*

___

## Methods

<a id="replay"></a>

###  replay

▸ **replay**(target?: *`IAnyStateTreeNode`*): `any`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` target | `IAnyStateTreeNode` |

**Returns:** `any`

___
<a id="stop"></a>

###  stop

▸ **stop**(): `any`

**Returns:** `any`

___
<a id="undo"></a>

###  undo

▸ **undo**(target?: *`IAnyStateTreeNode`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` target | `IAnyStateTreeNode` |

**Returns:** `void`

___

