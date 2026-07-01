---
id: "ivalidationcontextentry"
title: "IValidationContextEntry"
sidebar_label: "IValidationContextEntry"
---

[mobx-state-tree - v7.3.1](../index.md) › [IValidationContextEntry](ivalidationcontextentry.md)

Validation context entry, this is, where the validation should run against which type

## Hierarchy

* **IValidationContextEntry**

## Index

### Properties

* [path](ivalidationcontextentry.md#path)
* [type](ivalidationcontextentry.md#type)

## Properties

###  path

• **path**: *string*

*Defined in [src/core/type/type-checker.ts:20](https://github.com/mobxjs/mobx-state-tree/blob/65595e81/src/core/type/type-checker.ts#L20)*

Subpath where the validation should be run, or an empty string to validate it all

___

###  type

• **type**: *[IAnyType](ianytype.md)*

*Defined in [src/core/type/type-checker.ts:22](https://github.com/mobxjs/mobx-state-tree/blob/65595e81/src/core/type/type-checker.ts#L22)*

Type to validate the subpath against
