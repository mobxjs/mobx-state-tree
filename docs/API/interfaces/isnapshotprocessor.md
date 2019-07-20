> **[mobx-state-tree](../README.md)**

[ISnapshotProcessor](isnapshotprocessor.md) /

# Interface: ISnapshotProcessor <**IT, CustomC, CustomS**>

A type that has its snapshots processed.

## Type parameters

▪ **IT**: *[IAnyType](ianytype.md)*

▪ **CustomC**

▪ **CustomS**

## Hierarchy

* [IType](itype.md)‹*`_CustomOrOther<CustomC, IT["CreationType"]>`*, *`_CustomOrOther<CustomS, IT["SnapshotType"]>`*, *`IT["TypeWithoutSTN"]`*›

  * **ISnapshotProcessor**

## Index

### Properties

* [identifierAttribute](isnapshotprocessor.md#optional-identifierattribute)
* [name](isnapshotprocessor.md#name)

### Methods

* [create](isnapshotprocessor.md#create)
* [describe](isnapshotprocessor.md#describe)
* [is](isnapshotprocessor.md#is)
* [validate](isnapshotprocessor.md#validate)

## Properties

### `Optional` identifierAttribute

• **identifierAttribute**? : *undefined | string*

*Inherited from [IType](itype.md).[identifierAttribute](itype.md#optional-identifierattribute)*

Name of the identifier attribute or null if none.

___

###  name

• **name**: *string*

*Inherited from [IType](itype.md).[name](itype.md#name)*

Friendly type name.

## Methods

###  create

▸ **create**(`snapshot?`: [C](), `env?`: any): *`this["Type"]`*

*Inherited from [IType](itype.md).[create](itype.md#create)*

Creates an instance for the type given an snapshot input.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | [C]() |
`env?` | any |

**Returns:** *`this["Type"]`*

An instance of that type.

___

###  describe

▸ **describe**(): *string*

*Inherited from [IType](itype.md).[describe](itype.md#describe)*

Gets the textual representation of the type as a string.

**Returns:** *string*

___

###  is

▸ **is**(`thing`: any): *boolean*

*Inherited from [IType](itype.md).[is](itype.md#is)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *boolean*

true if the value is of the current type, false otherwise.

___

###  validate

▸ **validate**(`thing`: `_CustomOrOther<CustomC, IT["CreationType"]>`, `context`: [IValidationContext](../README.md#ivalidationcontext)): *[IValidationResult](../README.md#ivalidationresult)*

*Inherited from [IType](itype.md).[validate](itype.md#validate)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | `_CustomOrOther<CustomC, IT["CreationType"]>` | Value to be checked, either a snapshot or an instance. |
`context` | [IValidationContext](../README.md#ivalidationcontext) | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *[IValidationResult](../README.md#ivalidationresult)*

The validation result, an array with the list of validation errors.