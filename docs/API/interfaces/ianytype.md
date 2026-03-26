---
id: "ianytype"
title: "IAnyType"
sidebar_label: "IAnyType"
---

[mobx-state-tree - v7.1.0](../index.md) › [IAnyType](ianytype.md)

Any kind of type.

## Hierarchy

* [IType](itype.md)‹any, any, any›

  ↳ **IAnyType**

## Index

### Properties

* [identifierAttribute](ianytype.md#optional-identifierattribute)
* [name](ianytype.md#name)

### Methods

* [create](ianytype.md#create)
* [describe](ianytype.md#describe)
* [is](ianytype.md#is)
* [validate](ianytype.md#validate)

## Properties

### `Optional` identifierAttribute

• **identifierAttribute**? : *undefined | string*

*Inherited from [IType](itype.md).[identifierAttribute](itype.md#optional-identifierattribute)*

*Defined in [src/core/type/type.ts:93](https://github.com/mobxjs/mobx-state-tree/blob/b5b44ed6/src/core/type/type.ts#L93)*

Name of the identifier attribute or null if none.

___

###  name

• **name**: *string*

*Inherited from [IType](itype.md).[name](itype.md#name)*

*Defined in [src/core/type/type.ts:88](https://github.com/mobxjs/mobx-state-tree/blob/b5b44ed6/src/core/type/type.ts#L88)*

Friendly type name.

## Methods

###  create

▸ **create**(`snapshot?`: any | ExcludeReadonly‹any›, `env?`: any): *this["Type"]*

*Inherited from [IType](itype.md).[create](itype.md#create)*

*Defined in [src/core/type/type.ts:100](https://github.com/mobxjs/mobx-state-tree/blob/b5b44ed6/src/core/type/type.ts#L100)*

Creates an instance for the type given an snapshot input.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | any &#124; ExcludeReadonly‹any› |
`env?` | any |

**Returns:** *this["Type"]*

An instance of that type.

___

###  describe

▸ **describe**(): *string*

*Inherited from [IType](itype.md).[describe](itype.md#describe)*

*Defined in [src/core/type/type.ts:122](https://github.com/mobxjs/mobx-state-tree/blob/b5b44ed6/src/core/type/type.ts#L122)*

Gets the textual representation of the type as a string.

**Returns:** *string*

___

###  is

▸ **is**(`thing`: any): *thing is any | this["Type"]*

*Inherited from [IType](itype.md).[is](itype.md#is)*

*Defined in [src/core/type/type.ts:108](https://github.com/mobxjs/mobx-state-tree/blob/b5b44ed6/src/core/type/type.ts#L108)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *thing is any | this["Type"]*

true if the value is of the current type, false otherwise.

___

###  validate

▸ **validate**(`thing`: any | any, `context`: [IValidationContext](../index.md#ivalidationcontext)): *[IValidationResult](../index.md#ivalidationresult)*

*Inherited from [IType](itype.md).[validate](itype.md#validate)*

*Defined in [src/core/type/type.ts:117](https://github.com/mobxjs/mobx-state-tree/blob/b5b44ed6/src/core/type/type.ts#L117)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any &#124; any | Value to be checked, either a snapshot or an instance. |
`context` | [IValidationContext](../index.md#ivalidationcontext) | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *[IValidationResult](../index.md#ivalidationresult)*

The validation result, an array with the list of validation errors.
