[mobx-state-tree](../README.md) > [CustomTypeOptions](../interfaces/customtypeoptions.md)

# Interface: CustomTypeOptions

## Type parameters
#### S 
#### T 
## Hierarchy

**CustomTypeOptions**

## Index

### Properties

* [name](customtypeoptions.md#name)

### Methods

* [fromSnapshot](customtypeoptions.md#fromsnapshot)
* [getValidationMessage](customtypeoptions.md#getvalidationmessage)
* [isTargetType](customtypeoptions.md#istargettype)
* [toSnapshot](customtypeoptions.md#tosnapshot)

---

## Properties

<a id="name"></a>

###  name

**● name**: *`string`*

Friendly name

___

## Methods

<a id="fromsnapshot"></a>

###  fromSnapshot

▸ **fromSnapshot**(snapshot: *`S`*): `T`

given a serialized value, how to turn it into the target type

**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `S` |

**Returns:** `T`

___
<a id="getvalidationmessage"></a>

###  getValidationMessage

▸ **getValidationMessage**(snapshot: *`S`*): `string`

a non empty string is assumed to be a validation error

**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `S` |

**Returns:** `string`

___
<a id="istargettype"></a>

###  isTargetType

▸ **isTargetType**(value: *`T` | `S`*): `boolean`

if true, this is a converted value, if false, it's a snapshot

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `T` | `S` |

**Returns:** `boolean`

___
<a id="tosnapshot"></a>

###  toSnapshot

▸ **toSnapshot**(value: *`T`*): `S`

return the serialization of the current value

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `T` |

**Returns:** `S`

___

