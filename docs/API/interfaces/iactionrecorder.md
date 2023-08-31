---
id: "iactionrecorder"
title: "IActionRecorder"
sidebar_label: "IActionRecorder"
---

[mobx-state-tree - v5.2.0-alpha.2](../index.md) › [IActionRecorder](iactionrecorder.md)

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

• **actions**: *ReadonlyArray‹[ISerializedActionCall](iserializedactioncall.md)›*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:37](https://github.com/mobxjs/mobx-state-tree/blob/9757a738/packages/mobx-state-tree/src/middlewares/on-action.ts#L37)*

___

###  recording

• **recording**: *boolean*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:38](https://github.com/mobxjs/mobx-state-tree/blob/9757a738/packages/mobx-state-tree/src/middlewares/on-action.ts#L38)*

## Methods

###  replay

▸ **replay**(`target`: IAnyStateTreeNode): *void*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:41](https://github.com/mobxjs/mobx-state-tree/blob/9757a738/packages/mobx-state-tree/src/middlewares/on-action.ts#L41)*

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *void*

___

###  resume

▸ **resume**(): *void*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:40](https://github.com/mobxjs/mobx-state-tree/blob/9757a738/packages/mobx-state-tree/src/middlewares/on-action.ts#L40)*

**Returns:** *void*

___

###  stop

▸ **stop**(): *void*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:39](https://github.com/mobxjs/mobx-state-tree/blob/9757a738/packages/mobx-state-tree/src/middlewares/on-action.ts#L39)*

**Returns:** *void*
