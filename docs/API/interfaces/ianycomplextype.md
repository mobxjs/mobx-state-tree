[mobx-state-tree](../README.md) > [IAnyComplexType](../interfaces/ianycomplextype.md)

# Interface: IAnyComplexType

Any kind of complex type.

## Hierarchy

 [IType](itype.md)<`any`, `any`, `object`>

**↳ IAnyComplexType**

## Index

### Properties

* [identifierAttribute](ianycomplextype.md#identifierattribute)
* [name](ianycomplextype.md#name)

### Methods

* [create](ianycomplextype.md#create)
* [describe](ianycomplextype.md#describe)
* [is](ianycomplextype.md#is)
* [validate](ianycomplextype.md#validate)

---

## Properties

<a id="identifierattribute"></a>

### `<Optional>` identifierAttribute

**● identifierAttribute**: *`undefined` \| `string`*

Name of the identifier attribute or null if none.

___
<a id="name"></a>

###  name

**● name**: *`string`*

Friendly type name.

___

## Methods

<a id="create"></a>

###  create

▸ **create**(snapshot?: *[C]()*, env?: *`any`*): `this["Type"]`

Creates an instance for the type given an snapshot input.

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` snapshot | [C]() |
| `Optional` env | `any` |

**Returns:** `this["Type"]`
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

