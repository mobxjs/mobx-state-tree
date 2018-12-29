[mobx-state-tree](../README.md) > [IType](../interfaces/itype.md)

# Interface: IType

A type, either complex or simple.

## Type parameters
#### C 
#### S 
#### T 
## Hierarchy

**IType**

↳  [ISimpleType](isimpletype.md)

↳  [IModelType](imodeltype.md)

## Index

### Properties

* [name](itype.md#name)

### Methods

* [create](itype.md#create)
* [describe](itype.md#describe)
* [is](itype.md#is)
* [validate](itype.md#validate)

---

## Properties

<a id="name"></a>

###  name

**● name**: *`string`*

___

## Methods

<a id="create"></a>

###  create

▸ **create**(...args: *`CreateParams`<`C`>*): `T`

▸ **create**(snapshot: *`C`*, env?: *`any`*): `T`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` args | `CreateParams`<`C`> |

**Returns:** `T`

**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `C` |
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

