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

* [postSnapshotProcessor](isnapshotprocessors.md#postsnapshotprocessor)
* [preSnapshotProcessor](isnapshotprocessors.md#presnapshotprocessor)

---

## Methods

<a id="postsnapshotprocessor"></a>

### `<Optional>` postSnapshotProcessor

▸ **postSnapshotProcessor**(snapshot: *`S`*): `CustomS`

Function that transforms an output snapshot.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| snapshot | `S` |   |

**Returns:** `CustomS`

___
<a id="presnapshotprocessor"></a>

### `<Optional>` preSnapshotProcessor

▸ **preSnapshotProcessor**(snapshot: *`CustomC`*): `C`

Function that transforms an input snapshot.

**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `CustomC` |

**Returns:** `C`

___

