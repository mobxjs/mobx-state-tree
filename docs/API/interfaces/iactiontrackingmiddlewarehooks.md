[mobx-state-tree](../README.md) > [IActionTrackingMiddlewareHooks](../interfaces/iactiontrackingmiddlewarehooks.md)

# Interface: IActionTrackingMiddlewareHooks

## Type parameters
#### T 
## Hierarchy

**IActionTrackingMiddlewareHooks**

## Index

### Properties

* [filter](iactiontrackingmiddlewarehooks.md#filter)
* [onFail](iactiontrackingmiddlewarehooks.md#onfail)
* [onResume](iactiontrackingmiddlewarehooks.md#onresume)
* [onStart](iactiontrackingmiddlewarehooks.md#onstart)
* [onSuccess](iactiontrackingmiddlewarehooks.md#onsuccess)
* [onSuspend](iactiontrackingmiddlewarehooks.md#onsuspend)

---

## Properties

<a id="filter"></a>

### `<Optional>` filter

**● filter**: *`undefined` \| `function`*

___
<a id="onfail"></a>

###  onFail

**● onFail**: *`function`*

#### Type declaration
▸(call: *[IMiddlewareEvent](../#imiddlewareevent)*, context: *`T`*, error: *`any`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| call | [IMiddlewareEvent](../#imiddlewareevent) |
| context | `T` |
| error | `any` |

**Returns:** `void`

___
<a id="onresume"></a>

###  onResume

**● onResume**: *`function`*

#### Type declaration
▸(call: *[IMiddlewareEvent](../#imiddlewareevent)*, context: *`T`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| call | [IMiddlewareEvent](../#imiddlewareevent) |
| context | `T` |

**Returns:** `void`

___
<a id="onstart"></a>

###  onStart

**● onStart**: *`function`*

#### Type declaration
▸(call: *[IMiddlewareEvent](../#imiddlewareevent)*): `T`

**Parameters:**

| Name | Type |
| ------ | ------ |
| call | [IMiddlewareEvent](../#imiddlewareevent) |

**Returns:** `T`

___
<a id="onsuccess"></a>

###  onSuccess

**● onSuccess**: *`function`*

#### Type declaration
▸(call: *[IMiddlewareEvent](../#imiddlewareevent)*, context: *`T`*, result: *`any`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| call | [IMiddlewareEvent](../#imiddlewareevent) |
| context | `T` |
| result | `any` |

**Returns:** `void`

___
<a id="onsuspend"></a>

###  onSuspend

**● onSuspend**: *`function`*

#### Type declaration
▸(call: *[IMiddlewareEvent](../#imiddlewareevent)*, context: *`T`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| call | [IMiddlewareEvent](../#imiddlewareevent) |
| context | `T` |

**Returns:** `void`

___

