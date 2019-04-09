[mobx-state-tree](../README.md) > [IActionRecorder](../interfaces/iactionrecorder.md)

# Interface: IActionRecorder

## Hierarchy

**IActionRecorder**

## Index

### Properties

* [actions](iactionrecorder.md#actions)
* [recording](iactionrecorder.md#recording)

### Methods

* [replay](iactionrecorder.md#replay)
* [resume](iactionrecorder.md#resume)
* [stop](iactionrecorder.md#stop)

---

## Properties

<a id="actions"></a>

###  actions

**● actions**: *`ReadonlyArray`<[ISerializedActionCall](iserializedactioncall.md)>*

___
<a id="recording"></a>

###  recording

**● recording**: *`boolean`*

___

## Methods

<a id="replay"></a>

###  replay

▸ **replay**(target: *`IAnyStateTreeNode`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| target | `IAnyStateTreeNode` |

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

