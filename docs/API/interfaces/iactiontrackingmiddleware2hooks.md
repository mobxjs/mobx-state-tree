[mobx-state-tree](../README.md) › [IActionTrackingMiddleware2Hooks](iactiontrackingmiddleware2hooks.md)

# Interface: IActionTrackingMiddleware2Hooks <**TEnv**>

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

*Defined in [middlewares/createActionTrackingMiddleware2.ts:11](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L11)*

___

###  onFinish

• **onFinish**: *function*

*Defined in [middlewares/createActionTrackingMiddleware2.ts:13](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L13)*

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

*Defined in [middlewares/createActionTrackingMiddleware2.ts:12](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L12)*

#### Type declaration:

▸ (`call`: [IActionTrackingMiddleware2Call](iactiontrackingmiddleware2call.md)‹TEnv›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | [IActionTrackingMiddleware2Call](iactiontrackingmiddleware2call.md)‹TEnv› |
