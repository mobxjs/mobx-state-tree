---
id: "ianycomplextype"
title: "IAnyComplexType"
sidebar_label: "IAnyComplexType"
---

[mobx-state-tree - v9.0.2](../index.md) › [IAnyComplexType](ianycomplextype.md)

Any kind of complex type.

## Hierarchy

* [IType](itype.md)‹any, any, object›

  ↳ **IAnyComplexType**

## Index

### Properties

* [identifierAttribute](ianycomplextype.md#optional-identifierattribute)
* [name](ianycomplextype.md#name)

### Methods

* [create](ianycomplextype.md#create)
* [describe](ianycomplextype.md#describe)
* [is](ianycomplextype.md#is)
* [validate](ianycomplextype.md#validate)

## Properties

### `Optional` identifierAttribute

• **identifierAttribute**? : *undefined | string*

*Inherited from [IType](itype.md).[identifierAttribute](itype.md#optional-identifierattribute)*

*Defined in [src/core/type/type.ts:90](https://github.com/mobxjs/mobx-state-tree/blob/c6fea910/src/core/type/type.ts#L90)*

Name of the identifier attribute or null if none.

___

###  name

• **name**: *string*

*Inherited from [IType](itype.md).[name](itype.md#name)*

*Defined in [src/core/type/type.ts:85](https://github.com/mobxjs/mobx-state-tree/blob/c6fea910/src/core/type/type.ts#L85)*

Friendly type name.

## Methods

###  create

▸ **create**<**TInstance**>(`snapshot`: TInstance extends IStateTreeNode ? TInstance : never, `env?`: any): *this["Type"]*

*Inherited from [IType](itype.md).[create](itype.md#create)*

*Defined in [src/core/type/type.ts:99](https://github.com/mobxjs/mobx-state-tree/blob/c6fea910/src/core/type/type.ts#L99)*

Creates an instance for the type given a snapshot or an existing instance.

**Type parameters:**

▪ **TInstance**: *object*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | TInstance extends IStateTreeNode ? TInstance : never |
`env?` | any |

**Returns:** *this["Type"]*

An instance of that type.

▸ **create**(`snapshot?`: any, `env?`: any): *this["Type"]*

*Inherited from [IType](itype.md).[create](itype.md#create)*

*Defined in [src/core/type/type.ts:104](https://github.com/mobxjs/mobx-state-tree/blob/c6fea910/src/core/type/type.ts#L104)*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | any |
`env?` | any |

**Returns:** *this["Type"]*

___

###  describe

▸ **describe**(): *string*

*Inherited from [IType](itype.md).[describe](itype.md#describe)*

*Defined in [src/core/type/type.ts:126](https://github.com/mobxjs/mobx-state-tree/blob/c6fea910/src/core/type/type.ts#L126)*

Gets the textual representation of the type as a string.

**Returns:** *string*

___

###  is

▸ **is**(`thing`: any): *thing is any | this["Type"]*

*Inherited from [IType](itype.md).[is](itype.md#is)*

*Defined in [src/core/type/type.ts:112](https://github.com/mobxjs/mobx-state-tree/blob/c6fea910/src/core/type/type.ts#L112)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *thing is any | this["Type"]*

true if the value is of the current type, false otherwise.

___

###  validate

▸ **validate**(`thing`: any | object, `context`: [IValidationContext](../index.md#ivalidationcontext)): *[IValidationResult](../index.md#ivalidationresult)*

*Inherited from [IType](itype.md).[validate](itype.md#validate)*

*Defined in [src/core/type/type.ts:121](https://github.com/mobxjs/mobx-state-tree/blob/c6fea910/src/core/type/type.ts#L121)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any &#124; object | Value to be checked, either a snapshot or an instance. |
`context` | [IValidationContext](../index.md#ivalidationcontext) | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *[IValidationResult](../index.md#ivalidationresult)*

The validation result, an array with the list of validation errors.
