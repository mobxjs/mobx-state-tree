---
id: "isnapshotprocessors"
title: "ISnapshotProcessors"
sidebar_label: "ISnapshotProcessors"
---

[mobx-state-tree - v7.0.0](../index.md) › [ISnapshotProcessors](isnapshotprocessors.md)

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

▸ **postProcessor**(`snapshot`: IT["SnapshotType"], `node`: [Instance](../index.md#instance)‹IT›): *_CustomOrOther‹CustomS, IT["SnapshotType"]›*

*Defined in [src/types/utility-types/snapshotProcessor.ts:230](https://github.com/mobxjs/mobx-state-tree/blob/96f2e469/src/types/utility-types/snapshotProcessor.ts#L230)*

Function that transforms an output snapshot.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`snapshot` | IT["SnapshotType"] |   |
`node` | [Instance](../index.md#instance)‹IT› | - |

**Returns:** *_CustomOrOther‹CustomS, IT["SnapshotType"]›*

___

### `Optional` preProcessor

▸ **preProcessor**(`snapshot`: _CustomOrOther‹CustomC, IT["CreationType"]›): *IT["CreationType"]*

*Defined in [src/types/utility-types/snapshotProcessor.ts:224](https://github.com/mobxjs/mobx-state-tree/blob/96f2e469/src/types/utility-types/snapshotProcessor.ts#L224)*

Function that transforms an input snapshot.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | _CustomOrOther‹CustomC, IT["CreationType"]› |

**Returns:** *IT["CreationType"]*
