> **[mobx-state-tree](../README.md)**

[IType](itype.md) /

# Interface: IType <**C, S, T**>

A type, either complex or simple.

## Type parameters

▪ **C**

▪ **S**

▪ **T**

## Hierarchy

* **IType**

  * [IAnyType](ianytype.md)

  * [ISimpleType](isimpletype.md)

  * [IAnyComplexType](ianycomplextype.md)

  * [ISnapshotProcessor](isnapshotprocessor.md)

  * [IModelType](imodeltype.md)

## Index

### Properties

* [identifierAttribute](itype.md#optional-identifierattribute)
* [name](itype.md#name)

### Methods

* [create](itype.md#create)
* [describe](itype.md#describe)
* [is](itype.md#is)
* [validate](itype.md#validate)

## Properties

### `Optional` identifierAttribute

• **identifierAttribute**? : *undefined | string*

Name of the identifier attribute or null if none.

___

###  name

• **name**: *string*

Friendly type name.

## Methods

###  create

▸ **create**(`snapshot?`: [C](), `env?`: any): *`this["Type"]`*

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

Gets the textual representation of the type as a string.

**Returns:** *string*

___

###  is

▸ **is**(`thing`: any): *boolean*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *boolean*

true if the value is of the current type, false otherwise.

___

###  validate

▸ **validate**(`thing`: `C`, `context`: [IValidationContext](../README.md#ivalidationcontext)): *[IValidationResult](../README.md#ivalidationresult)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | `C` | Value to be checked, either a snapshot or an instance. |
`context` | [IValidationContext](../README.md#ivalidationcontext) | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *[IValidationResult](../README.md#ivalidationresult)*

The validation result, an array with the list of validation errors.