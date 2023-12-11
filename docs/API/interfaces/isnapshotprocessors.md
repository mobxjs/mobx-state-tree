---
id: "isnapshotprocessors"
title: "ISnapshotProcessors"
sidebar_label: "ISnapshotProcessors"
---

[mobx-state-tree - v5.4.0](../index.md) › [ISnapshotProcessors](isnapshotprocessors.md)

Snapshot processors.

## Type parameters

▪ **IT**: *[IAnyType](ianytype.md)*

▪ **CustomC**

▪ **CustomS**

## Hierarchy

* **ISnapshotProcessors**

## Index

### Methods

* [postProcessor](isnapshotprocessors.md#optional-postprocessor)
* [preProcessor](isnapshotprocessors.md#optional-preprocessor)

## Methods

### `Optional` postProcessor

▸ **postProcessor**(`snapshot`: IT["SnapshotType"], `node`: [Instance](../index.md#instance)‹IT›): *CustomS*

*Defined in [src/types/utility-types/snapshotProcessor.ts:210](https://github.com/mobxjs/mobx-state-tree/blob/68b756ba/src/types/utility-types/snapshotProcessor.ts#L210)*

Function that transforms an output snapshot.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`snapshot` | IT["SnapshotType"] |   |
`node` | [Instance](../index.md#instance)‹IT› | - |

**Returns:** *CustomS*

___

### `Optional` preProcessor

▸ **preProcessor**(`snapshot`: CustomC): *IT["CreationType"]*

*Defined in [src/types/utility-types/snapshotProcessor.ts:205](https://github.com/mobxjs/mobx-state-tree/blob/68b756ba/src/types/utility-types/snapshotProcessor.ts#L205)*

Function that transforms an input snapshot.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | CustomC |

**Returns:** *IT["CreationType"]*
