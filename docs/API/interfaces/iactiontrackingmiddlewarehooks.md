---
id: "iactiontrackingmiddlewarehooks"
title: "IActionTrackingMiddlewareHooks"
sidebar_label: "IActionTrackingMiddlewareHooks"
---

[mobx-state-tree - v5.3.0](../index.md) › [IActionTrackingMiddlewareHooks](iactiontrackingmiddlewarehooks.md)

## Type parameters

▪ **T**

## Hierarchy

* **IActionTrackingMiddlewareHooks**

## Index

### Properties

* [filter](iactiontrackingmiddlewarehooks.md#optional-filter)
* [onFail](iactiontrackingmiddlewarehooks.md#onfail)
* [onResume](iactiontrackingmiddlewarehooks.md#onresume)
* [onStart](iactiontrackingmiddlewarehooks.md#onstart)
* [onSuccess](iactiontrackingmiddlewarehooks.md#onsuccess)
* [onSuspend](iactiontrackingmiddlewarehooks.md#onsuspend)

## Properties

### `Optional` filter

• **filter**? : *undefined | function*

*Defined in [src/middlewares/create-action-tracking-middleware.ts:6](https://github.com/mobxjs/mobx-state-tree/blob/3e437f73/src/middlewares/create-action-tracking-middleware.ts#L6)*

___

###  onFail

• **onFail**: *function*

*Defined in [src/middlewares/create-action-tracking-middleware.ts:11](https://github.com/mobxjs/mobx-state-tree/blob/3e437f73/src/middlewares/create-action-tracking-middleware.ts#L11)*

#### Type declaration:

▸ (`call`: [IMiddlewareEvent](imiddlewareevent.md), `context`: T, `error`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | [IMiddlewareEvent](imiddlewareevent.md) |
`context` | T |
`error` | any |

___

###  onResume

• **onResume**: *function*

*Defined in [src/middlewares/create-action-tracking-middleware.ts:8](https://github.com/mobxjs/mobx-state-tree/blob/3e437f73/src/middlewares/create-action-tracking-middleware.ts#L8)*

#### Type declaration:

▸ (`call`: [IMiddlewareEvent](imiddlewareevent.md), `context`: T): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | [IMiddlewareEvent](imiddlewareevent.md) |
`context` | T |

___

###  onStart

• **onStart**: *function*

*Defined in [src/middlewares/create-action-tracking-middleware.ts:7](https://github.com/mobxjs/mobx-state-tree/blob/3e437f73/src/middlewares/create-action-tracking-middleware.ts#L7)*

#### Type declaration:

▸ (`call`: [IMiddlewareEvent](imiddlewareevent.md)): *T*

**Parameters:**

Name | Type |
------ | ------ |
`call` | [IMiddlewareEvent](imiddlewareevent.md) |

___

###  onSuccess

• **onSuccess**: *function*

*Defined in [src/middlewares/create-action-tracking-middleware.ts:10](https://github.com/mobxjs/mobx-state-tree/blob/3e437f73/src/middlewares/create-action-tracking-middleware.ts#L10)*

#### Type declaration:

▸ (`call`: [IMiddlewareEvent](imiddlewareevent.md), `context`: T, `result`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | [IMiddlewareEvent](imiddlewareevent.md) |
`context` | T |
`result` | any |

___

###  onSuspend

• **onSuspend**: *function*

*Defined in [src/middlewares/create-action-tracking-middleware.ts:9](https://github.com/mobxjs/mobx-state-tree/blob/3e437f73/src/middlewares/create-action-tracking-middleware.ts#L9)*

#### Type declaration:

▸ (`call`: [IMiddlewareEvent](imiddlewareevent.md), `context`: T): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | [IMiddlewareEvent](imiddlewareevent.md) |
`context` | T |
