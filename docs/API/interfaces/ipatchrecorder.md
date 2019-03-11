[mobx-state-tree](../README.md) > [IPatchRecorder](../interfaces/ipatchrecorder.md)

# Interface: IPatchRecorder

## Hierarchy

**IPatchRecorder**

## Index

### Properties

* [inversePatches](ipatchrecorder.md#inversepatches)
* [patches](ipatchrecorder.md#patches)
* [reversedInversePatches](ipatchrecorder.md#reversedinversepatches)

### Methods

* [replay](ipatchrecorder.md#replay)
* [resume](ipatchrecorder.md#resume)
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
<a id="reversedinversepatches"></a>

###  reversedInversePatches

**● reversedInversePatches**: *`ReadonlyArray`<[IJsonPatch](ijsonpatch.md)>*

___

## Methods

<a id="replay"></a>

###  replay

▸ **replay**(target?: *`IAnyStateTreeNode`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` target | `IAnyStateTreeNode` |

**Returns:** `void`

___
<a id="resume"></a>

###  resume

▸ **resume**(): `void`

**Returns:** `void`

___
<a id="stop"></a>

###  stop

▸ **stop**(): `void`

**Returns:** `void`

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

