[mobx-state-tree](../README.md) > [ReferenceOptionsGetSet](../interfaces/referenceoptionsgetset.md)

# Interface: ReferenceOptionsGetSet

## Type parameters
#### IT :  [IAnyComplexType](../#ianycomplextype)
## Hierarchy

**ReferenceOptionsGetSet**

## Index

### Methods

* [get](referenceoptionsgetset.md#get)
* [set](referenceoptionsgetset.md#set)

---

## Methods

<a id="get"></a>

###  get

▸ **get**(identifier: *[ReferenceIdentifier](../#referenceidentifier)*, parent: *`IAnyStateTreeNode` \| `null`*): `ExtractT`<`IT`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| identifier | [ReferenceIdentifier](../#referenceidentifier) |
| parent | `IAnyStateTreeNode` \| `null` |

**Returns:** `ExtractT`<`IT`>

___
<a id="set"></a>

###  set

▸ **set**(value: *`ExtractT`<`IT`>*, parent: *`IAnyStateTreeNode` \| `null`*): [ReferenceIdentifier](../#referenceidentifier)

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `ExtractT`<`IT`> |
| parent | `IAnyStateTreeNode` \| `null` |

**Returns:** [ReferenceIdentifier](../#referenceidentifier)

___

