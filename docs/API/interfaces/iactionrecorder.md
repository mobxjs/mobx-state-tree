> **[mobx-state-tree](../README.md)**

[IActionRecorder](iactionrecorder.md) /

# Interface: IActionRecorder

## Hierarchy

* **IActionRecorder**

## Index

### Properties

* [actions](iactionrecorder.md#actions)
* [recording](iactionrecorder.md#recording)

### Methods

* [replay](iactionrecorder.md#replay)
* [resume](iactionrecorder.md#resume)
* [stop](iactionrecorder.md#stop)

## Properties

###  actions

• **actions**: *`ReadonlyArray<ISerializedActionCall>`*

___

###  recording

• **recording**: *boolean*

## Methods

###  replay

▸ **replay**(`target`: `IAnyStateTreeNode`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`target` | `IAnyStateTreeNode` |

**Returns:** *void*

___

###  resume

▸ **resume**(): *void*

**Returns:** *void*

___

###  stop

▸ **stop**(): *void*

**Returns:** *void*