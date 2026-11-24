---
id: "itype"
title: "IType"
sidebar_label: "IType"
---

[mobx-state-tree - v9.0.2](../index.md) › [IType](itype.md)

A type, either complex or simple.

## Type parameters

▪ **C**

▪ **S**

▪ **T**

## Hierarchy

* **IType**

  ↳ [IAnyType](ianytype.md)

  ↳ [ISimpleType](isimpletype.md)

  ↳ [IAnyComplexType](ianycomplextype.md)

  ↳ [ISnapshotProcessor](isnapshotprocessor.md)

  ↳ [IModelType](imodeltype.md)

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

*Defined in [src/core/type/type.ts:90](https://github.com/mobxjs/mobx-state-tree/blob/5e31837d/src/core/type/type.ts#L90)*

Name of the identifier attribute or null if none.

___

###  name

• **name**: *string*

*Defined in [src/core/type/type.ts:85](https://github.com/mobxjs/mobx-state-tree/blob/5e31837d/src/core/type/type.ts#L85)*

Friendly type name.

## Methods

###  create

▸ **create**<**TInstance** = *never*>(`snapshot?`: C | (TInstance extends IStateTreeNode ? TInstance : never), `env?`: any): *this["Type"]*

*Defined in [src/core/type/type.ts:99](https://github.com/mobxjs/mobx-state-tree/blob/5e31837d/src/core/type/type.ts#L99)*

Creates an instance for the type given a snapshot or an existing instance.

**Type parameters:**

▪ **TInstance**: *T*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | C &#124; (TInstance extends IStateTreeNode ? TInstance : never) |
`env?` | any |

**Returns:** *this["Type"]*

An instance of that type.

___

###  describe

▸ **describe**(): *string*

*Defined in [src/core/type/type.ts:124](https://github.com/mobxjs/mobx-state-tree/blob/5e31837d/src/core/type/type.ts#L124)*

Gets the textual representation of the type as a string.

**Returns:** *string*

___

###  is

▸ **is**(`thing`: any): *thing is C | this["Type"]*

*Defined in [src/core/type/type.ts:110](https://github.com/mobxjs/mobx-state-tree/blob/5e31837d/src/core/type/type.ts#L110)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *thing is C | this["Type"]*

true if the value is of the current type, false otherwise.

___

###  validate

▸ **validate**(`thing`: C | T, `context`: [IValidationContext](../index.md#ivalidationcontext)): *[IValidationResult](../index.md#ivalidationresult)*

*Defined in [src/core/type/type.ts:119](https://github.com/mobxjs/mobx-state-tree/blob/5e31837d/src/core/type/type.ts#L119)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | C &#124; T | Value to be checked, either a snapshot or an instance. |
`context` | [IValidationContext](../index.md#ivalidationcontext) | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *[IValidationResult](../index.md#ivalidationresult)*

The validation result, an array with the list of validation errors.
