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

Friendly type name.

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

Creates an instance for the type given an snapshot input.

**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `T` |
| `Optional` env | `any` |

**Returns:** `T`
An instance of that type.

___
<a id="describe"></a>

###  describe

▸ **describe**(): `string`

Gets the textual representation of the type as a string.

**Returns:** `string`

___
<a id="is"></a>

###  is

▸ **is**(thing: *`any`*): `boolean`

Checks if a given snapshot / instance is of the given type.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| thing | `any` |  Snapshot or instance to be checked. |

**Returns:** `boolean`
true if the value is of the current type, false otherwise.

___
<a id="validate"></a>

###  validate

▸ **validate**(thing: *`any`*, context: *[IValidationContext](../#ivalidationcontext)*): [IValidationResult](../#ivalidationresult)

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| thing | `any` |  Value to be checked, either a snapshot or an instance. |
| context | [IValidationContext](../#ivalidationcontext) |  Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** [IValidationResult](../#ivalidationresult)
The validation result, an array with the list of validation errors.

___

