---
id: "isnapshotprocessors"
title: "ISnapshotProcessors"
sidebar_label: "ISnapshotProcessors"
---

[mobx-state-tree - v5.3.alpha.1](../index.md) › [ISnapshotProcessors](isnapshotprocessors.md)

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

▸ **postProcessor**(`snapshot`: S): *CustomS*

*Defined in [src/types/utility-types/snapshotProcessor.ts:212](https://github.com/mobxjs/mobx-state-tree/blob/a411fc10/src/types/utility-types/snapshotProcessor.ts#L212)*

Function that transforms an output snapshot.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`snapshot` | S |   |

**Returns:** *CustomS*

___

### `Optional` preProcessor

▸ **preProcessor**(`snapshot`: CustomC): *C*

*Defined in [src/types/utility-types/snapshotProcessor.ts:207](https://github.com/mobxjs/mobx-state-tree/blob/a411fc10/src/types/utility-types/snapshotProcessor.ts#L207)*

Function that transforms an input snapshot.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | CustomC |

**Returns:** *C*
