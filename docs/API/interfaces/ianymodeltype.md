---
id: "ianymodeltype"
title: "IAnyModelType"
sidebar_label: "IAnyModelType"
---

[mobx-state-tree](../index.md) › [IAnyModelType](ianymodeltype.md)

Any model type.

## Hierarchy

  ↳ [IModelType](imodeltype.md)‹any, any, any, any›

  ↳ **IAnyModelType**

## Index

### Properties

* [identifierAttribute](ianymodeltype.md#optional-identifierattribute)
* [name](ianymodeltype.md#name)
* [properties](ianymodeltype.md#properties)

### Methods

* [actions](ianymodeltype.md#actions)
* [create](ianymodeltype.md#create)
* [describe](ianymodeltype.md#describe)
* [extend](ianymodeltype.md#extend)
* [is](ianymodeltype.md#is)
* [named](ianymodeltype.md#named)
* [postProcessSnapshot](ianymodeltype.md#postprocesssnapshot)
* [preProcessSnapshot](ianymodeltype.md#preprocesssnapshot)
* [props](ianymodeltype.md#props)
* [validate](ianymodeltype.md#validate)
* [views](ianymodeltype.md#views)
* [volatile](ianymodeltype.md#volatile)

## Properties

### `Optional` identifierAttribute

• **identifierAttribute**? : *undefined | string*

*Inherited from [IType](itype.md).[identifierAttribute](itype.md#optional-identifierattribute)*

*Defined in [core/type/type.ts:86](https://github.com/mobxjs/mobx-state-tree/blob/19012c2c/packages/mobx-state-tree/src/core/type/type.ts#L86)*

Name of the identifier attribute or null if none.

___

###  name

• **name**: *string*

*Inherited from [IType](itype.md).[name](itype.md#name)*

*Defined in [core/type/type.ts:81](https://github.com/mobxjs/mobx-state-tree/blob/19012c2c/packages/mobx-state-tree/src/core/type/type.ts#L81)*

Friendly type name.

___

###  properties

• **properties**: *any*

*Inherited from [IModelType](imodeltype.md).[properties](imodeltype.md#properties)*

*Defined in [types/complex-types/model.ts:187](https://github.com/mobxjs/mobx-state-tree/blob/19012c2c/packages/mobx-state-tree/src/types/complex-types/model.ts#L187)*

## Methods

###  actions

▸ **actions**<**A**>(`fn`: function): *[IModelType](imodeltype.md)‹any, any & A, any, any›*

*Inherited from [IModelType](imodeltype.md).[actions](imodeltype.md#actions)*

*Defined in [types/complex-types/model.ts:201](https://github.com/mobxjs/mobx-state-tree/blob/19012c2c/packages/mobx-state-tree/src/types/complex-types/model.ts#L201)*

**Type parameters:**

▪ **A**: *ModelActions*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: [Instance](../index.md#instance)‹this›): *A*

**Parameters:**

Name | Type |
------ | ------ |
`self` | [Instance](../index.md#instance)‹this› |

**Returns:** *[IModelType](imodeltype.md)‹any, any & A, any, any›*

___

###  create

▸ **create**(`snapshot?`: [C](undefined), `env?`: any): *this["Type"]*

*Inherited from [IType](itype.md).[create](itype.md#create)*

*Defined in [core/type/type.ts:93](https://github.com/mobxjs/mobx-state-tree/blob/19012c2c/packages/mobx-state-tree/src/core/type/type.ts#L93)*

Creates an instance for the type given an snapshot input.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | [C](undefined) |
`env?` | any |

**Returns:** *this["Type"]*

An instance of that type.

___

###  describe

▸ **describe**(): *string*

*Inherited from [IType](itype.md).[describe](itype.md#describe)*

*Defined in [core/type/type.ts:115](https://github.com/mobxjs/mobx-state-tree/blob/19012c2c/packages/mobx-state-tree/src/core/type/type.ts#L115)*

Gets the textual representation of the type as a string.

**Returns:** *string*

___

###  extend

▸ **extend**<**A**, **V**, **VS**>(`fn`: function): *[IModelType](imodeltype.md)‹any, any & A & V & VS, any, any›*

*Inherited from [IModelType](imodeltype.md).[extend](imodeltype.md#extend)*

*Defined in [types/complex-types/model.ts:209](https://github.com/mobxjs/mobx-state-tree/blob/19012c2c/packages/mobx-state-tree/src/types/complex-types/model.ts#L209)*

**Type parameters:**

▪ **A**: *ModelActions*

▪ **V**: *Object*

▪ **VS**: *Object*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: [Instance](../index.md#instance)‹this›): *object*

**Parameters:**

Name | Type |
------ | ------ |
`self` | [Instance](../index.md#instance)‹this› |

**Returns:** *[IModelType](imodeltype.md)‹any, any & A & V & VS, any, any›*

___

###  is

▸ **is**(`thing`: any): *boolean*

*Inherited from [IType](itype.md).[is](itype.md#is)*

*Defined in [core/type/type.ts:101](https://github.com/mobxjs/mobx-state-tree/blob/19012c2c/packages/mobx-state-tree/src/core/type/type.ts#L101)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *boolean*

true if the value is of the current type, false otherwise.

___

###  named

▸ **named**(`newName`: string): *[IModelType](imodeltype.md)‹any, any, any, any›*

*Inherited from [IModelType](imodeltype.md).[named](imodeltype.md#named)*

*Defined in [types/complex-types/model.ts:189](https://github.com/mobxjs/mobx-state-tree/blob/19012c2c/packages/mobx-state-tree/src/types/complex-types/model.ts#L189)*

**Parameters:**

Name | Type |
------ | ------ |
`newName` | string |

**Returns:** *[IModelType](imodeltype.md)‹any, any, any, any›*

___

###  postProcessSnapshot

▸ **postProcessSnapshot**<**NewS**>(`fn`: function): *[IModelType](imodeltype.md)‹any, any, any, NewS›*

*Inherited from [IModelType](imodeltype.md).[postProcessSnapshot](imodeltype.md#postprocesssnapshot)*

*Defined in [types/complex-types/model.ts:219](https://github.com/mobxjs/mobx-state-tree/blob/19012c2c/packages/mobx-state-tree/src/types/complex-types/model.ts#L219)*

**`deprecated`** See `types.snapshotProcessor`

**Type parameters:**

▪ **NewS**

**Parameters:**

▪ **fn**: *function*

▸ (`snapshot`: ModelSnapshotType2‹any, any›): *NewS*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | ModelSnapshotType2‹any, any› |

**Returns:** *[IModelType](imodeltype.md)‹any, any, any, NewS›*

___

###  preProcessSnapshot

▸ **preProcessSnapshot**<**NewC**>(`fn`: function): *[IModelType](imodeltype.md)‹any, any, NewC, any›*

*Inherited from [IModelType](imodeltype.md).[preProcessSnapshot](imodeltype.md#preprocesssnapshot)*

*Defined in [types/complex-types/model.ts:214](https://github.com/mobxjs/mobx-state-tree/blob/19012c2c/packages/mobx-state-tree/src/types/complex-types/model.ts#L214)*

**`deprecated`** See `types.snapshotProcessor`

**Type parameters:**

▪ **NewC**

**Parameters:**

▪ **fn**: *function*

▸ (`snapshot`: NewC): *ModelCreationType2‹any, any›*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | NewC |

**Returns:** *[IModelType](imodeltype.md)‹any, any, NewC, any›*

___

###  props

▸ **props**<**PROPS2**>(`props`: PROPS2): *[IModelType](imodeltype.md)‹any & ModelPropertiesDeclarationToProperties‹PROPS2›, any, any, any›*

*Inherited from [IModelType](imodeltype.md).[props](imodeltype.md#props)*

*Defined in [types/complex-types/model.ts:193](https://github.com/mobxjs/mobx-state-tree/blob/19012c2c/packages/mobx-state-tree/src/types/complex-types/model.ts#L193)*

**Type parameters:**

▪ **PROPS2**: *ModelPropertiesDeclaration*

**Parameters:**

Name | Type |
------ | ------ |
`props` | PROPS2 |

**Returns:** *[IModelType](imodeltype.md)‹any & ModelPropertiesDeclarationToProperties‹PROPS2›, any, any, any›*

___

###  validate

▸ **validate**(`thing`: ModelCreationType2‹any, any›, `context`: [IValidationContext](../index.md#ivalidationcontext)): *[IValidationResult](../index.md#ivalidationresult)*

*Inherited from [IType](itype.md).[validate](itype.md#validate)*

*Defined in [core/type/type.ts:110](https://github.com/mobxjs/mobx-state-tree/blob/19012c2c/packages/mobx-state-tree/src/core/type/type.ts#L110)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | ModelCreationType2‹any, any› | Value to be checked, either a snapshot or an instance. |
`context` | [IValidationContext](../index.md#ivalidationcontext) | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *[IValidationResult](../index.md#ivalidationresult)*

The validation result, an array with the list of validation errors.

___

###  views

▸ **views**<**V**>(`fn`: function): *[IModelType](imodeltype.md)‹any, any & V, any, any›*

*Inherited from [IModelType](imodeltype.md).[views](imodeltype.md#views)*

*Defined in [types/complex-types/model.ts:197](https://github.com/mobxjs/mobx-state-tree/blob/19012c2c/packages/mobx-state-tree/src/types/complex-types/model.ts#L197)*

**Type parameters:**

▪ **V**: *Object*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: [Instance](../index.md#instance)‹this›): *V*

**Parameters:**

Name | Type |
------ | ------ |
`self` | [Instance](../index.md#instance)‹this› |

**Returns:** *[IModelType](imodeltype.md)‹any, any & V, any, any›*

___

###  volatile

▸ **volatile**<**TP**>(`fn`: function): *[IModelType](imodeltype.md)‹any, any & TP, any, any›*

*Inherited from [IModelType](imodeltype.md).[volatile](imodeltype.md#volatile)*

*Defined in [types/complex-types/model.ts:205](https://github.com/mobxjs/mobx-state-tree/blob/19012c2c/packages/mobx-state-tree/src/types/complex-types/model.ts#L205)*

**Type parameters:**

▪ **TP**: *object*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: [Instance](../index.md#instance)‹this›): *TP*

**Parameters:**

Name | Type |
------ | ------ |
`self` | [Instance](../index.md#instance)‹this› |

**Returns:** *[IModelType](imodeltype.md)‹any, any & TP, any, any›*
