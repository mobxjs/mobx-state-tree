---
id: "referenceoptionsgetset"
title: "ReferenceOptionsGetSet"
sidebar_label: "ReferenceOptionsGetSet"
---

[mobx-state-tree - v6.0.0](../index.md) › [ReferenceOptionsGetSet](referenceoptionsgetset.md)

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

*Defined in [src/types/utility-types/reference.ts:442](https://github.com/mobxjs/mobx-state-tree/blob/72f4f644/src/types/utility-types/reference.ts#L442)*

**Parameters:**

Name | Type |
------ | ------ |
`identifier` | [ReferenceIdentifier](../index.md#referenceidentifier) |
`parent` | IAnyStateTreeNode &#124; null |

**Returns:** *ReferenceT‹IT›*

___

###  set

▸ **set**(`value`: ReferenceT‹IT›, `parent`: IAnyStateTreeNode | null): *[ReferenceIdentifier](../index.md#referenceidentifier)*

*Defined in [src/types/utility-types/reference.ts:443](https://github.com/mobxjs/mobx-state-tree/blob/72f4f644/src/types/utility-types/reference.ts#L443)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | ReferenceT‹IT› |
`parent` | IAnyStateTreeNode &#124; null |

**Returns:** *[ReferenceIdentifier](../index.md#referenceidentifier)*
