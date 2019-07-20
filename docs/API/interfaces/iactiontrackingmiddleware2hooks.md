> **[mobx-state-tree](../README.md)**

[IActionTrackingMiddleware2Hooks](iactiontrackingmiddleware2hooks.md) /

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

___

###  onFinish

• **onFinish**: *function*

#### Type declaration:

▸ (`call`: [IActionTrackingMiddleware2Call](iactiontrackingmiddleware2call.md)‹*`TEnv`*›, `error?`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | [IActionTrackingMiddleware2Call](iactiontrackingmiddleware2call.md)‹*`TEnv`*› |
`error?` | any |

___

###  onStart

• **onStart**: *function*

#### Type declaration:

▸ (`call`: [IActionTrackingMiddleware2Call](iactiontrackingmiddleware2call.md)‹*`TEnv`*›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | [IActionTrackingMiddleware2Call](iactiontrackingmiddleware2call.md)‹*`TEnv`*› |