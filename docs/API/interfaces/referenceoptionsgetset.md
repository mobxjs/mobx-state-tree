[mobx-state-tree](../README.md) › [ReferenceOptionsGetSet](referenceoptionsgetset.md)

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

▸ **get**(`identifier`: [ReferenceIdentifier](../README.md#referenceidentifier), `parent`: IAnyStateTreeNode | null): *ReferenceT‹IT›*

*Defined in [types/utility-types/reference.ts:466](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/types/utility-types/reference.ts#L466)*

**Parameters:**

Name | Type |
------ | ------ |
`identifier` | [ReferenceIdentifier](../README.md#referenceidentifier) |
`parent` | IAnyStateTreeNode &#124; null |

**Returns:** *ReferenceT‹IT›*

___

###  set

▸ **set**(`value`: ReferenceT‹IT›, `parent`: IAnyStateTreeNode | null): *[ReferenceIdentifier](../README.md#referenceidentifier)*

*Defined in [types/utility-types/reference.ts:467](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/types/utility-types/reference.ts#L467)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | ReferenceT‹IT› |
`parent` | IAnyStateTreeNode &#124; null |

**Returns:** *[ReferenceIdentifier](../README.md#referenceidentifier)*
