[mobx-state-tree](../README.md) > [ISnapshotProcessors](../interfaces/isnapshotprocessors.md)

# Interface: ISnapshotProcessors

Snapshot processors.

## Type parameters
#### C 
#### CustomC 
#### S 
#### CustomS 
## Hierarchy

**ISnapshotProcessors**

## Index

### Methods

* [postProcessor](isnapshotprocessors.md#postprocessor)
* [preProcessor](isnapshotprocessors.md#preprocessor)

---

## Methods

<a id="postprocessor"></a>

### `<Optional>` postProcessor

▸ **postProcessor**(snapshot: *`S`*): `CustomS`

Function that transforms an output snapshot.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| snapshot | `S` |   |

**Returns:** `CustomS`

___
<a id="preprocessor"></a>

### `<Optional>` preProcessor

▸ **preProcessor**(snapshot: *`CustomC`*): `C`

Function that transforms an input snapshot.

**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `CustomC` |

**Returns:** `C`

___

