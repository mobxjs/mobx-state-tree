> **[mobx-state-tree](../README.md)**

[ReferenceOptionsGetSet](referenceoptionsgetset.md) /

# Interface: ReferenceOptionsGetSet <**IT**>

## Type parameters

▪ **IT**: *[IAnyComplexType](ianycomplextype.md)*

## Hierarchy

* **ReferenceOptionsGetSet**

## Index

### Methods

* [get](referenceoptionsgetset.md#get)
* [set](referenceoptionsgetset.md#set)

## Methods

###  get

▸ **get**(`identifier`: [ReferenceIdentifier](../README.md#referenceidentifier), `parent`: `IAnyStateTreeNode` | null): *`ReferenceT<IT>`*

**Parameters:**

Name | Type |
------ | ------ |
`identifier` | [ReferenceIdentifier](../README.md#referenceidentifier) |
`parent` | `IAnyStateTreeNode` \| null |

**Returns:** *`ReferenceT<IT>`*

___

###  set

▸ **set**(`value`: `ReferenceT<IT>`, `parent`: `IAnyStateTreeNode` | null): *[ReferenceIdentifier](../README.md#referenceidentifier)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | `ReferenceT<IT>` |
`parent` | `IAnyStateTreeNode` \| null |

**Returns:** *[ReferenceIdentifier](../README.md#referenceidentifier)*