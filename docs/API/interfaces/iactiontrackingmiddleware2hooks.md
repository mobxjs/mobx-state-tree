[mobx-state-tree](../README.md) > [IActionTrackingMiddleware2Hooks](../interfaces/iactiontrackingmiddleware2hooks.md)

# Interface: IActionTrackingMiddleware2Hooks

## Type parameters
#### TEnv 
## Hierarchy

**IActionTrackingMiddleware2Hooks**

## Index

### Properties

* [filter](iactiontrackingmiddleware2hooks.md#filter)
* [onFinish](iactiontrackingmiddleware2hooks.md#onfinish)
* [onStart](iactiontrackingmiddleware2hooks.md#onstart)

---

## Properties

<a id="filter"></a>

### `<Optional>` filter

**● filter**: *`undefined` \| `function`*

___
<a id="onfinish"></a>

###  onFinish

**● onFinish**: *`function`*

#### Type declaration
▸(call: *[IActionTrackingMiddleware2Call](iactiontrackingmiddleware2call.md)<`TEnv`>*, error?: *`any`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| call | [IActionTrackingMiddleware2Call](iactiontrackingmiddleware2call.md)<`TEnv`> |
| `Optional` error | `any` |

**Returns:** `void`

___
<a id="onstart"></a>

###  onStart

**● onStart**: *`function`*

#### Type declaration
▸(call: *[IActionTrackingMiddleware2Call](iactiontrackingmiddleware2call.md)<`TEnv`>*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| call | [IActionTrackingMiddleware2Call](iactiontrackingmiddleware2call.md)<`TEnv`> |

**Returns:** `void`

___

