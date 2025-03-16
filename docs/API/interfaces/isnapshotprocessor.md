---
id: "isnapshotprocessor"
title: "ISnapshotProcessor"
sidebar_label: "ISnapshotProcessor"
---

[mobx-state-tree - v7.0.2](../index.md) › [ISnapshotProcessor](isnapshotprocessor.md)

A type that has its snapshots processed.

## Type parameters

▪ **IT**: *[IAnyType](ianytype.md)*

▪ **CustomC**

▪ **CustomS**

## Hierarchy

* [IType](itype.md)‹_CustomOrOther‹CustomC, IT["CreationType"]›, _CustomOrOther‹CustomS, IT["SnapshotType"]›, IT["TypeWithoutSTN"]›

  ↳ **ISnapshotProcessor**

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

*Defined in [src/core/type/type.ts:92](https://github.com/mobxjs/mobx-state-tree/blob/84c63895/src/core/type/type.ts#L92)*

Name of the identifier attribute or null if none.

___

###  name

• **name**: *string*

*Inherited from [IType](itype.md).[name](itype.md#name)*

*Defined in [src/core/type/type.ts:87](https://github.com/mobxjs/mobx-state-tree/blob/84c63895/src/core/type/type.ts#L87)*

Friendly type name.

## Methods

###  create

▸ **create**(`snapshot?`: _CustomOrOther‹CustomC, IT["CreationType"]› | ExcludeReadonly‹IT["TypeWithoutSTN"]›, `env?`: any): *this["Type"]*

*Inherited from [IType](itype.md).[create](itype.md#create)*

*Defined in [src/core/type/type.ts:99](https://github.com/mobxjs/mobx-state-tree/blob/84c63895/src/core/type/type.ts#L99)*

Creates an instance for the type given an snapshot input.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | _CustomOrOther‹CustomC, IT["CreationType"]› &#124; ExcludeReadonly‹IT["TypeWithoutSTN"]› |
`env?` | any |

**Returns:** *this["Type"]*

An instance of that type.

___

###  describe

▸ **describe**(): *string*

*Inherited from [IType](itype.md).[describe](itype.md#describe)*

*Defined in [src/core/type/type.ts:121](https://github.com/mobxjs/mobx-state-tree/blob/84c63895/src/core/type/type.ts#L121)*

Gets the textual representation of the type as a string.

**Returns:** *string*

___

###  is

▸ **is**(`thing`: any): *thing is _CustomOrOther<CustomC, IT["CreationType"]> | this["Type"]*

*Inherited from [IType](itype.md).[is](itype.md#is)*

*Defined in [src/core/type/type.ts:107](https://github.com/mobxjs/mobx-state-tree/blob/84c63895/src/core/type/type.ts#L107)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *thing is _CustomOrOther<CustomC, IT["CreationType"]> | this["Type"]*

true if the value is of the current type, false otherwise.

___

###  validate

▸ **validate**(`thing`: _CustomOrOther‹CustomC, IT["CreationType"]› | IT["TypeWithoutSTN"], `context`: [IValidationContext](../index.md#ivalidationcontext)): *[IValidationResult](../index.md#ivalidationresult)*

*Inherited from [IType](itype.md).[validate](itype.md#validate)*

*Defined in [src/core/type/type.ts:116](https://github.com/mobxjs/mobx-state-tree/blob/84c63895/src/core/type/type.ts#L116)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | _CustomOrOther‹CustomC, IT["CreationType"]› &#124; IT["TypeWithoutSTN"] | Value to be checked, either a snapshot or an instance. |
`context` | [IValidationContext](../index.md#ivalidationcontext) | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *[IValidationResult](../index.md#ivalidationresult)*

The validation result, an array with the list of validation errors.
