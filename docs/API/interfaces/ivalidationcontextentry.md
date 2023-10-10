---
id: "ivalidationcontextentry"
title: "IValidationContextEntry"
sidebar_label: "IValidationContextEntry"
---

[mobx-state-tree - v5.3.0-alpha.1](../index.md) › [IValidationContextEntry](ivalidationcontextentry.md)

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

*Defined in [src/core/type/type-checker.ts:17](https://github.com/mobxjs/mobx-state-tree/blob/a397be56/src/core/type/type-checker.ts#L17)*

Subpath where the validation should be run, or an empty string to validate it all

___

###  type

• **type**: *[IAnyType](ianytype.md)*

*Defined in [src/core/type/type-checker.ts:19](https://github.com/mobxjs/mobx-state-tree/blob/a397be56/src/core/type/type-checker.ts#L19)*

Type to validate the subpath against
