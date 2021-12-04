---
id: "referenceoptionsgetset"
title: "ReferenceOptionsGetSet"
sidebar_label: "ReferenceOptionsGetSet"
---

[mobx-state-tree - v5.0.5](../index.md) › [ReferenceOptionsGetSet](referenceoptionsgetset.md)

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

▸ **get**(`identifier`: [ReferenceIdentifier](../index.md#referenceidentifier), `parent`: IAnyStateTreeNode | null): *ReferenceT‹IT›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:464](https://github.com/mobxjs/mobx-state-tree/blob/7b52c9ca/packages/mobx-state-tree/src/types/utility-types/reference.ts#L464)*

**Parameters:**

Name | Type |
------ | ------ |
`identifier` | [ReferenceIdentifier](../index.md#referenceidentifier) |
`parent` | IAnyStateTreeNode &#124; null |

**Returns:** *ReferenceT‹IT›*

___

###  set

▸ **set**(`value`: ReferenceT‹IT›, `parent`: IAnyStateTreeNode | null): *[ReferenceIdentifier](../index.md#referenceidentifier)*

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:465](https://github.com/mobxjs/mobx-state-tree/blob/7b52c9ca/packages/mobx-state-tree/src/types/utility-types/reference.ts#L465)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | ReferenceT‹IT› |
`parent` | IAnyStateTreeNode &#124; null |

**Returns:** *[ReferenceIdentifier](../index.md#referenceidentifier)*
