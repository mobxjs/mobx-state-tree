> **[mobx-state-tree](../README.md)**

[CustomTypeOptions](customtypeoptions.md) /

# Interface: CustomTypeOptions <**S, T**>

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

Friendly name

## Methods

###  fromSnapshot

▸ **fromSnapshot**(`snapshot`: `S`): *`T`*

given a serialized value, how to turn it into the target type

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | `S` |

**Returns:** *`T`*

___

###  getValidationMessage

▸ **getValidationMessage**(`snapshot`: `S`): *string*

a non empty string is assumed to be a validation error

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | `S` |

**Returns:** *string*

___

###  isTargetType

▸ **isTargetType**(`value`: `T` | `S`): *boolean*

if true, this is a converted value, if false, it's a snapshot

**Parameters:**

Name | Type |
------ | ------ |
`value` | `T` \| `S` |

**Returns:** *boolean*

___

###  toSnapshot

▸ **toSnapshot**(`value`: `T`): *`S`*

return the serialization of the current value

**Parameters:**

Name | Type |
------ | ------ |
`value` | `T` |

**Returns:** *`S`*