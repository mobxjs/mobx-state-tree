---
id: "ipatchrecorder"
title: "IPatchRecorder"
sidebar_label: "IPatchRecorder"
---

[mobx-state-tree - v6.0.0](../index.md) › [IPatchRecorder](ipatchrecorder.md)

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

• **inversePatches**: *ReadonlyArray‹[IJsonPatch](ijsonpatch.md)›*

*Defined in [src/core/mst-operations.ts:137](https://github.com/mobxjs/mobx-state-tree/blob/72f4f644/src/core/mst-operations.ts#L137)*

___

###  patches

• **patches**: *ReadonlyArray‹[IJsonPatch](ijsonpatch.md)›*

*Defined in [src/core/mst-operations.ts:136](https://github.com/mobxjs/mobx-state-tree/blob/72f4f644/src/core/mst-operations.ts#L136)*

___

###  recording

• **recording**: *boolean*

*Defined in [src/core/mst-operations.ts:139](https://github.com/mobxjs/mobx-state-tree/blob/72f4f644/src/core/mst-operations.ts#L139)*

___

###  reversedInversePatches

• **reversedInversePatches**: *ReadonlyArray‹[IJsonPatch](ijsonpatch.md)›*

*Defined in [src/core/mst-operations.ts:138](https://github.com/mobxjs/mobx-state-tree/blob/72f4f644/src/core/mst-operations.ts#L138)*

## Methods

###  replay

▸ **replay**(`target?`: IAnyStateTreeNode): *void*

*Defined in [src/core/mst-operations.ts:142](https://github.com/mobxjs/mobx-state-tree/blob/72f4f644/src/core/mst-operations.ts#L142)*

**Parameters:**

Name | Type |
------ | ------ |
`target?` | IAnyStateTreeNode |

**Returns:** *void*

___

###  resume

▸ **resume**(): *void*

*Defined in [src/core/mst-operations.ts:141](https://github.com/mobxjs/mobx-state-tree/blob/72f4f644/src/core/mst-operations.ts#L141)*

**Returns:** *void*

___

###  stop

▸ **stop**(): *void*

*Defined in [src/core/mst-operations.ts:140](https://github.com/mobxjs/mobx-state-tree/blob/72f4f644/src/core/mst-operations.ts#L140)*

**Returns:** *void*

___

###  undo

▸ **undo**(`target?`: IAnyStateTreeNode): *void*

*Defined in [src/core/mst-operations.ts:143](https://github.com/mobxjs/mobx-state-tree/blob/72f4f644/src/core/mst-operations.ts#L143)*

**Parameters:**

Name | Type |
------ | ------ |
`target?` | IAnyStateTreeNode |

**Returns:** *void*
