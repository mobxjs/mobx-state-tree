> **[mobx-state-tree](../README.md)**

[ISnapshotProcessors](isnapshotprocessors.md) /

# Interface: ISnapshotProcessors <**C, CustomC, S, CustomS**>

Snapshot processors.

## Type parameters

▪ **C**

▪ **CustomC**

▪ **S**

▪ **CustomS**

## Hierarchy

* **ISnapshotProcessors**

## Index

### Methods

* [postProcessor](isnapshotprocessors.md#optional-postprocessor)
* [preProcessor](isnapshotprocessors.md#optional-preprocessor)

## Methods

### `Optional` postProcessor

▸ **postProcessor**(`snapshot`: `S`): *`CustomS`*

Function that transforms an output snapshot.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`snapshot` | `S` |   |

**Returns:** *`CustomS`*

___

### `Optional` preProcessor

▸ **preProcessor**(`snapshot`: `CustomC`): *`C`*

Function that transforms an input snapshot.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | `CustomC` |

**Returns:** *`C`*