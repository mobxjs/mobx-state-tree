---
id: "isnapshotprocessors"
title: "ISnapshotProcessors"
sidebar_label: "ISnapshotProcessors"
---

[mobx-state-tree - v5.1.8](../index.md) › [ISnapshotProcessors](isnapshotprocessors.md)

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

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:213](https://github.com/mobxjs/mobx-state-tree/blob/279154a4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L213)*

Function that transforms an output snapshot.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`snapshot` | S |   |

**Returns:** *CustomS*

___

### `Optional` preProcessor

▸ **preProcessor**(`snapshot`: CustomC): *C*

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:208](https://github.com/mobxjs/mobx-state-tree/blob/279154a4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L208)*

Function that transforms an input snapshot.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | CustomC |

**Returns:** *C*
