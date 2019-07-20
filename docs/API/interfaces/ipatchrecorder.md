> **[mobx-state-tree](../README.md)**

[IPatchRecorder](ipatchrecorder.md) /

# Interface: IPatchRecorder

## Hierarchy

* **IPatchRecorder**

## Index

### Properties

* [inversePatches](ipatchrecorder.md#inversepatches)
* [patches](ipatchrecorder.md#patches)
* [recording](ipatchrecorder.md#recording)
* [reversedInversePatches](ipatchrecorder.md#reversedinversepatches)

### Methods

* [replay](ipatchrecorder.md#replay)
* [resume](ipatchrecorder.md#resume)
* [stop](ipatchrecorder.md#stop)
* [undo](ipatchrecorder.md#undo)

## Properties

###  inversePatches

• **inversePatches**: *`ReadonlyArray<IJsonPatch>`*

___

###  patches

• **patches**: *`ReadonlyArray<IJsonPatch>`*

___

###  recording

• **recording**: *boolean*

___

###  reversedInversePatches

• **reversedInversePatches**: *`ReadonlyArray<IJsonPatch>`*

## Methods

###  replay

▸ **replay**(`target?`: `IAnyStateTreeNode`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`target?` | `IAnyStateTreeNode` |

**Returns:** *void*

___

###  resume

▸ **resume**(): *void*

**Returns:** *void*

___

###  stop

▸ **stop**(): *void*

**Returns:** *void*

___

###  undo

▸ **undo**(`target?`: `IAnyStateTreeNode`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`target?` | `IAnyStateTreeNode` |

**Returns:** *void*