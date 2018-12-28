[mobx-state-tree](../README.md) > [ISimpleType](../interfaces/isimpletype.md)

# Interface: ISimpleType

A simple type, this is, a type where the instance and the snapshot representation are the same.

## Type parameters
#### T 
## Hierarchy

 [IType](itype.md)<`T`, `T`, `T`>

**↳ ISimpleType**

## Index

### Properties

* [name](isimpletype.md#name)

### Methods

* [create](isimpletype.md#create)
* [describe](isimpletype.md#describe)
* [is](isimpletype.md#is)
* [validate](isimpletype.md#validate)

---

## Properties

<a id="name"></a>

###  name

**● name**: *`string`*

___

## Methods

<a id="create"></a>

###  create

▸ **create**(...args: *`CreateParams`<`T`>*): `T`

▸ **create**(snapshot: *`T`*, env?: *`any`*): `T`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` args | `CreateParams`<`T`> |

**Returns:** `T`

**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `T` |
| `Optional` env | `any` |

**Returns:** `T`

___
<a id="describe"></a>

###  describe

▸ **describe**(): `string`

**Returns:** `string`

___
<a id="is"></a>

###  is

▸ **is**(thing: *`any`*): `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| thing | `any` |

**Returns:** `boolean`

___
<a id="validate"></a>

###  validate

▸ **validate**(thing: *`any`*, context: *[IContext](../#icontext)*): [IValidationResult](../#ivalidationresult)

**Parameters:**

| Name | Type |
| ------ | ------ |
| thing | `any` |
| context | [IContext](../#icontext) |

**Returns:** [IValidationResult](../#ivalidationresult)

___

