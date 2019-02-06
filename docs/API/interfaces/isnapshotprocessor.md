[mobx-state-tree](../README.md) > [ISnapshotProcessor](../interfaces/isnapshotprocessor.md)

# Interface: ISnapshotProcessor

A type that has its snapshots processed.

## Type parameters
#### IT :  [IAnyType](../#ianytype)
#### CustomC 
#### CustomS 
## Hierarchy

 [IType](itype.md)<`_CustomOrOther`<`CustomC`, `ExtractC`<`IT`>>, `_CustomOrOther`<`CustomS`, `ExtractS`<`IT`>>, `SnapshotProcessorT`<`IT`, `CustomC`, `CustomS`>>

**↳ ISnapshotProcessor**

## Index

### Properties

* [name](isnapshotprocessor.md#name)

### Methods

* [create](isnapshotprocessor.md#create)
* [describe](isnapshotprocessor.md#describe)
* [is](isnapshotprocessor.md#is)
* [validate](isnapshotprocessor.md#validate)

---

## Properties

<a id="name"></a>

###  name

**● name**: *`string`*

The type name.

___

## Methods

<a id="create"></a>

###  create

▸ **create**(...args: *`CreateParams`<`_CustomOrOther`<`CustomC`, `ExtractC`<`IT`>>>*): `SnapshotProcessorT`<`IT`, `CustomC`, `CustomS`>

▸ **create**(snapshot: *`_CustomOrOther`<`CustomC`, `ExtractC`<`IT`>>*, env?: *`any`*): `SnapshotProcessorT`<`IT`, `CustomC`, `CustomS`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` args | `CreateParams`<`_CustomOrOther`<`CustomC`, `ExtractC`<`IT`>>> |

**Returns:** `SnapshotProcessorT`<`IT`, `CustomC`, `CustomS`>

Creates an instance for the type given an snapshot input.

**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `_CustomOrOther`<`CustomC`, `ExtractC`<`IT`>> |
| `Optional` env | `any` |

**Returns:** `SnapshotProcessorT`<`IT`, `CustomC`, `CustomS`>
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

▸ **validate**(thing: *`_CustomOrOther`<`CustomC`, `ExtractC`<`IT`>>*, context: *[IValidationContext](../#ivalidationcontext)*): [IValidationResult](../#ivalidationresult)

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| thing | `_CustomOrOther`<`CustomC`, `ExtractC`<`IT`>> |  Value to be checked, either a snapshot or an instance. |
| context | [IValidationContext](../#ivalidationcontext) |  Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** [IValidationResult](../#ivalidationresult)
The validation result, an array with the list of validation errors.

___

