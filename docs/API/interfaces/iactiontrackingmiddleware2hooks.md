---
id: "iactiontrackingmiddleware2hooks"
title: "IActionTrackingMiddleware2Hooks"
sidebar_label: "IActionTrackingMiddleware2Hooks"
---

[mobx-state-tree - v6.0.1](../index.md) › [IActionTrackingMiddleware2Hooks](iactiontrackingmiddleware2hooks.md)

## Type parameters

▪ **TEnv**

## Hierarchy

* **IActionTrackingMiddleware2Hooks**

## Index

### Properties

* [filter](iactiontrackingmiddleware2hooks.md#optional-filter)
* [onFinish](iactiontrackingmiddleware2hooks.md#onfinish)
* [onStart](iactiontrackingmiddleware2hooks.md#onstart)

## Properties

### `Optional` filter

• **filter**? : *undefined | function*

*Defined in [src/middlewares/createActionTrackingMiddleware2.ts:9](https://github.com/mobxjs/mobx-state-tree/blob/7097c4d6/src/middlewares/createActionTrackingMiddleware2.ts#L9)*

___

###  onFinish

• **onFinish**: *function*

*Defined in [src/middlewares/createActionTrackingMiddleware2.ts:11](https://github.com/mobxjs/mobx-state-tree/blob/7097c4d6/src/middlewares/createActionTrackingMiddleware2.ts#L11)*

#### Type declaration:

▸ (`call`: [IActionTrackingMiddleware2Call](iactiontrackingmiddleware2call.md)‹TEnv›, `error?`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | [IActionTrackingMiddleware2Call](iactiontrackingmiddleware2call.md)‹TEnv› |
`error?` | any |

___

###  onStart

• **onStart**: *function*

*Defined in [src/middlewares/createActionTrackingMiddleware2.ts:10](https://github.com/mobxjs/mobx-state-tree/blob/7097c4d6/src/middlewares/createActionTrackingMiddleware2.ts#L10)*

#### Type declaration:

▸ (`call`: [IActionTrackingMiddleware2Call](iactiontrackingmiddleware2call.md)‹TEnv›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | [IActionTrackingMiddleware2Call](iactiontrackingmiddleware2call.md)‹TEnv› |
