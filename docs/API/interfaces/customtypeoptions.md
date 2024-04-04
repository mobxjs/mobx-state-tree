---
id: "customtypeoptions"
title: "CustomTypeOptions"
sidebar_label: "CustomTypeOptions"
---

[mobx-state-tree - v5.4.1](../index.md) › [CustomTypeOptions](customtypeoptions.md)

## Type parameters

▪ **S**

▪ **T**

## Hierarchy

* **CustomTypeOptions**

## Index

### Properties

* [name](customtypeoptions.md#name)

### Methods

* [fromSnapshot](customtypeoptions.md#fromsnapshot)
* [getValidationMessage](customtypeoptions.md#getvalidationmessage)
* [isTargetType](customtypeoptions.md#istargettype)
* [toSnapshot](customtypeoptions.md#tosnapshot)

## Properties

###  name

• **name**: *string*

*Defined in [src/types/utility-types/custom.ts:15](https://github.com/mobxjs/mobx-state-tree/blob/0215cc54/src/types/utility-types/custom.ts#L15)*

Friendly name

## Methods

###  fromSnapshot

▸ **fromSnapshot**(`snapshot`: S, `env?`: any): *T*

*Defined in [src/types/utility-types/custom.ts:17](https://github.com/mobxjs/mobx-state-tree/blob/0215cc54/src/types/utility-types/custom.ts#L17)*

given a serialized value and environment, how to turn it into the target type

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | S |
`env?` | any |

**Returns:** *T*

___

###  getValidationMessage

▸ **getValidationMessage**(`snapshot`: S): *string*

*Defined in [src/types/utility-types/custom.ts:23](https://github.com/mobxjs/mobx-state-tree/blob/0215cc54/src/types/utility-types/custom.ts#L23)*

a non empty string is assumed to be a validation error

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | S |

**Returns:** *string*

___

###  isTargetType

▸ **isTargetType**(`value`: T | S): *boolean*

*Defined in [src/types/utility-types/custom.ts:21](https://github.com/mobxjs/mobx-state-tree/blob/0215cc54/src/types/utility-types/custom.ts#L21)*

if true, this is a converted value, if false, it's a snapshot

**Parameters:**

Name | Type |
------ | ------ |
`value` | T &#124; S |

**Returns:** *boolean*

___

###  toSnapshot

▸ **toSnapshot**(`value`: T): *S*

*Defined in [src/types/utility-types/custom.ts:19](https://github.com/mobxjs/mobx-state-tree/blob/0215cc54/src/types/utility-types/custom.ts#L19)*

return the serialization of the current value

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

**Returns:** *S*
