> **[mobx-state-tree](../README.md)**

[IActionTrackingMiddlewareHooks](iactiontrackingmiddlewarehooks.md) /

# Interface: IActionTrackingMiddlewareHooks <**T**>

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

___

###  onFail

• **onFail**: *function*

#### Type declaration:

▸ (`call`: [IMiddlewareEvent](imiddlewareevent.md), `context`: `T`, `error`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | [IMiddlewareEvent](imiddlewareevent.md) |
`context` | `T` |
`error` | any |

___

###  onResume

• **onResume**: *function*

#### Type declaration:

▸ (`call`: [IMiddlewareEvent](imiddlewareevent.md), `context`: `T`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | [IMiddlewareEvent](imiddlewareevent.md) |
`context` | `T` |

___

###  onStart

• **onStart**: *function*

#### Type declaration:

▸ (`call`: [IMiddlewareEvent](imiddlewareevent.md)): *`T`*

**Parameters:**

Name | Type |
------ | ------ |
`call` | [IMiddlewareEvent](imiddlewareevent.md) |

___

###  onSuccess

• **onSuccess**: *function*

#### Type declaration:

▸ (`call`: [IMiddlewareEvent](imiddlewareevent.md), `context`: `T`, `result`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | [IMiddlewareEvent](imiddlewareevent.md) |
`context` | `T` |
`result` | any |

___

###  onSuspend

• **onSuspend**: *function*

#### Type declaration:

▸ (`call`: [IMiddlewareEvent](imiddlewareevent.md), `context`: `T`): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | [IMiddlewareEvent](imiddlewareevent.md) |
`context` | `T` |