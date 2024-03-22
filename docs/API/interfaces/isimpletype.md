---
id: "isimpletype"
title: "ISimpleType"
sidebar_label: "ISimpleType"
---

[mobx-state-tree - v5.4.1](../index.md) › [ISimpleType](isimpletype.md)

A simple type, this is, a type where the instance and the snapshot representation are the same.

## Type parameters

▪ **T**

## Hierarchy

* [IType](itype.md)‹T, T, T›

  ↳ **ISimpleType**

## Index

### Properties

* [identifierAttribute](isimpletype.md#optional-identifierattribute)
* [name](isimpletype.md#name)

### Methods

* [create](isimpletype.md#create)
* [describe](isimpletype.md#describe)
* [is](isimpletype.md#is)
* [validate](isimpletype.md#validate)

## Properties

### `Optional` identifierAttribute

• **identifierAttribute**? : *undefined | string*

*Inherited from [IType](itype.md).[identifierAttribute](itype.md#optional-identifierattribute)*

*Defined in [src/core/type/type.ts:89](https://github.com/mobxjs/mobx-state-tree/blob/fb4f34de/src/core/type/type.ts#L89)*

Name of the identifier attribute or null if none.

___

###  name

• **name**: *string*

*Inherited from [IType](itype.md).[name](itype.md#name)*

*Defined in [src/core/type/type.ts:84](https://github.com/mobxjs/mobx-state-tree/blob/fb4f34de/src/core/type/type.ts#L84)*

Friendly type name.

## Methods

###  create

▸ **create**(`snapshot?`: [C](undefined), `env?`: any): *this["Type"]*

*Inherited from [IType](itype.md).[create](itype.md#create)*

*Defined in [src/core/type/type.ts:96](https://github.com/mobxjs/mobx-state-tree/blob/fb4f34de/src/core/type/type.ts#L96)*

Creates an instance for the type given an snapshot input.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | [C](undefined) |
`env?` | any |

**Returns:** *this["Type"]*

An instance of that type.

___

###  describe

▸ **describe**(): *string*

*Inherited from [IType](itype.md).[describe](itype.md#describe)*

*Defined in [src/core/type/type.ts:118](https://github.com/mobxjs/mobx-state-tree/blob/fb4f34de/src/core/type/type.ts#L118)*

Gets the textual representation of the type as a string.

**Returns:** *string*

___

###  is

▸ **is**(`thing`: any): *thing is T | this["Type"]*

*Inherited from [IType](itype.md).[is](itype.md#is)*

*Defined in [src/core/type/type.ts:104](https://github.com/mobxjs/mobx-state-tree/blob/fb4f34de/src/core/type/type.ts#L104)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *thing is T | this["Type"]*

true if the value is of the current type, false otherwise.

___

###  validate

▸ **validate**(`thing`: T, `context`: [IValidationContext](../index.md#ivalidationcontext)): *[IValidationResult](../index.md#ivalidationresult)*

*Inherited from [IType](itype.md).[validate](itype.md#validate)*

*Defined in [src/core/type/type.ts:113](https://github.com/mobxjs/mobx-state-tree/blob/fb4f34de/src/core/type/type.ts#L113)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | T | Value to be checked, either a snapshot or an instance. |
`context` | [IValidationContext](../index.md#ivalidationcontext) | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *[IValidationResult](../index.md#ivalidationresult)*

The validation result, an array with the list of validation errors.
