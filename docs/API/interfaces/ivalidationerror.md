---
id: "ivalidationerror"
title: "IValidationError"
sidebar_label: "IValidationError"
---

[mobx-state-tree - v7.3.1](../index.md) › [IValidationError](ivalidationerror.md)

Type validation error

## Hierarchy

* **IValidationError**

## Index

### Properties

* [context](ivalidationerror.md#context)
* [message](ivalidationerror.md#optional-message)
* [value](ivalidationerror.md#value)

## Properties

###  context

• **context**: *[IValidationContext](../index.md#ivalidationcontext)*

*Defined in [src/core/type/type-checker.ts:31](https://github.com/mobxjs/mobx-state-tree/blob/65595e81/src/core/type/type-checker.ts#L31)*

Validation context

___

### `Optional` message

• **message**? : *undefined | string*

*Defined in [src/core/type/type-checker.ts:35](https://github.com/mobxjs/mobx-state-tree/blob/65595e81/src/core/type/type-checker.ts#L35)*

Error message

___

###  value

• **value**: *any*

*Defined in [src/core/type/type-checker.ts:33](https://github.com/mobxjs/mobx-state-tree/blob/65595e81/src/core/type/type-checker.ts#L33)*

Value that was being validated, either a snapshot or an instance
