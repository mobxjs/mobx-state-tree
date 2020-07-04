---
id: "ianytype"
title: "IAnyType"
sidebar_label: "IAnyType"
---

[mobx-state-tree - v3.16.0](../index.md) › [IAnyType](ianytype.md)

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

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:86](https://github.com/mobxjs/mobx-state-tree/blob/f6ac9160/packages/mobx-state-tree/src/core/type/type.ts#L86)*

Name of the identifier attribute or null if none.

___

###  name

• **name**: *string*

*Inherited from [IType](itype.md).[name](itype.md#name)*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:81](https://github.com/mobxjs/mobx-state-tree/blob/f6ac9160/packages/mobx-state-tree/src/core/type/type.ts#L81)*

Friendly type name.

## Methods

###  create

▸ **create**(`snapshot?`: [C](undefined), `env?`: any): *this["Type"]*

*Inherited from [IType](itype.md).[create](itype.md#create)*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:93](https://github.com/mobxjs/mobx-state-tree/blob/f6ac9160/packages/mobx-state-tree/src/core/type/type.ts#L93)*

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

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:115](https://github.com/mobxjs/mobx-state-tree/blob/f6ac9160/packages/mobx-state-tree/src/core/type/type.ts#L115)*

Gets the textual representation of the type as a string.

**Returns:** *string*

___

###  is

▸ **is**(`thing`: any): *thing is any | this["Type"]*

*Inherited from [IType](itype.md).[is](itype.md#is)*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:101](https://github.com/mobxjs/mobx-state-tree/blob/f6ac9160/packages/mobx-state-tree/src/core/type/type.ts#L101)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *thing is any | this["Type"]*

true if the value is of the current type, false otherwise.

___

###  validate

▸ **validate**(`thing`: any, `context`: [IValidationContext](../index.md#ivalidationcontext)): *[IValidationResult](../index.md#ivalidationresult)*

*Inherited from [IType](itype.md).[validate](itype.md#validate)*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:110](https://github.com/mobxjs/mobx-state-tree/blob/f6ac9160/packages/mobx-state-tree/src/core/type/type.ts#L110)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Value to be checked, either a snapshot or an instance. |
`context` | [IValidationContext](../index.md#ivalidationcontext) | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *[IValidationResult](../index.md#ivalidationresult)*

The validation result, an array with the list of validation errors.
