---
id: "ivalidationerror"
title: "IValidationError"
sidebar_label: "IValidationError"
---

[mobx-state-tree - v3.16.0](../index.md) › [IValidationError](ivalidationerror.md)

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

*Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:28](https://github.com/mobxjs/mobx-state-tree/blob/f6ac9160/packages/mobx-state-tree/src/core/type/type-checker.ts#L28)*

Validation context

___

### `Optional` message

• **message**? : *undefined | string*

*Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:32](https://github.com/mobxjs/mobx-state-tree/blob/f6ac9160/packages/mobx-state-tree/src/core/type/type-checker.ts#L32)*

Error message

___

###  value

• **value**: *any*

*Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:30](https://github.com/mobxjs/mobx-state-tree/blob/f6ac9160/packages/mobx-state-tree/src/core/type/type-checker.ts#L30)*

Value that was being validated, either a snapshot or an instance
