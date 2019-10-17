[mobx-state-tree](../README.md) › [IValidationContextEntry](ivalidationcontextentry.md)

# Interface: IValidationContextEntry

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

*Defined in [core/type/type-checker.ts:17](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/core/type/type-checker.ts#L17)*

Subpath where the validation should be run, or an empty string to validate it all

___

###  type

• **type**: *[IAnyType](ianytype.md)*

*Defined in [core/type/type-checker.ts:19](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/core/type/type-checker.ts#L19)*

Type to validate the subpath against
