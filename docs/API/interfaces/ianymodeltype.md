---
id: "ianymodeltype"
title: "IAnyModelType"
sidebar_label: "IAnyModelType"
---

[mobx-state-tree - v7.0.2](../index.md) › [IAnyModelType](ianymodeltype.md)

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

*Defined in [src/core/type/type.ts:92](https://github.com/mobxjs/mobx-state-tree/blob/1be40a3e/src/core/type/type.ts#L92)*

Name of the identifier attribute or null if none.

___

###  name

• **name**: *string*

*Inherited from [IType](itype.md).[name](itype.md#name)*

*Defined in [src/core/type/type.ts:87](https://github.com/mobxjs/mobx-state-tree/blob/1be40a3e/src/core/type/type.ts#L87)*

Friendly type name.

___

###  properties

• **properties**: *any*

*Inherited from [IModelType](imodeltype.md).[properties](imodeltype.md#properties)*

*Defined in [src/types/complex-types/model.ts:195](https://github.com/mobxjs/mobx-state-tree/blob/1be40a3e/src/types/complex-types/model.ts#L195)*

## Methods

###  actions

▸ **actions**<**A**>(`fn`: function): *[IModelType](imodeltype.md)‹any, any & A, any, any›*

*Inherited from [IModelType](imodeltype.md).[actions](imodeltype.md#actions)*

*Defined in [src/types/complex-types/model.ts:209](https://github.com/mobxjs/mobx-state-tree/blob/1be40a3e/src/types/complex-types/model.ts#L209)*

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

▸ **create**(`snapshot?`: ModelCreationType2‹any, any› | ExcludeReadonly‹ModelInstanceType‹any, any››, `env?`: any): *this["Type"]*

*Inherited from [IType](itype.md).[create](itype.md#create)*

*Defined in [src/core/type/type.ts:99](https://github.com/mobxjs/mobx-state-tree/blob/1be40a3e/src/core/type/type.ts#L99)*

Creates an instance for the type given an snapshot input.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | ModelCreationType2‹any, any› &#124; ExcludeReadonly‹ModelInstanceType‹any, any›› |
`env?` | any |

**Returns:** *this["Type"]*

An instance of that type.

___

###  describe

▸ **describe**(): *string*

*Inherited from [IType](itype.md).[describe](itype.md#describe)*

*Defined in [src/core/type/type.ts:121](https://github.com/mobxjs/mobx-state-tree/blob/1be40a3e/src/core/type/type.ts#L121)*

Gets the textual representation of the type as a string.

**Returns:** *string*

___

###  extend

▸ **extend**<**A**, **V**, **VS**>(`fn`: function): *[IModelType](imodeltype.md)‹any, any & A & V & VS, any, any›*

*Inherited from [IModelType](imodeltype.md).[extend](imodeltype.md#extend)*

*Defined in [src/types/complex-types/model.ts:217](https://github.com/mobxjs/mobx-state-tree/blob/1be40a3e/src/types/complex-types/model.ts#L217)*

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

▸ **is**(`thing`: any): *thing is ModelCreationType2<any, any> | this["Type"]*

*Inherited from [IType](itype.md).[is](itype.md#is)*

*Defined in [src/core/type/type.ts:107](https://github.com/mobxjs/mobx-state-tree/blob/1be40a3e/src/core/type/type.ts#L107)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *thing is ModelCreationType2<any, any> | this["Type"]*

true if the value is of the current type, false otherwise.

___

###  named

▸ **named**(`newName`: string): *[IModelType](imodeltype.md)‹any, any, any, any›*

*Inherited from [IModelType](imodeltype.md).[named](imodeltype.md#named)*

*Defined in [src/types/complex-types/model.ts:197](https://github.com/mobxjs/mobx-state-tree/blob/1be40a3e/src/types/complex-types/model.ts#L197)*

**Parameters:**

Name | Type |
------ | ------ |
`newName` | string |

**Returns:** *[IModelType](imodeltype.md)‹any, any, any, any›*

___

###  postProcessSnapshot

▸ **postProcessSnapshot**<**NewS**>(`fn`: function): *[IModelType](imodeltype.md)‹any, any, any, NewS›*

*Inherited from [IModelType](imodeltype.md).[postProcessSnapshot](imodeltype.md#postprocesssnapshot)*

*Defined in [src/types/complex-types/model.ts:225](https://github.com/mobxjs/mobx-state-tree/blob/1be40a3e/src/types/complex-types/model.ts#L225)*

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

*Defined in [src/types/complex-types/model.ts:221](https://github.com/mobxjs/mobx-state-tree/blob/1be40a3e/src/types/complex-types/model.ts#L221)*

**Type parameters:**

▪ **NewC**

**Parameters:**

▪ **fn**: *function*

▸ (`snapshot`: NewC): *WithAdditionalProperties‹ModelCreationType2‹any, any››*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | NewC |

**Returns:** *[IModelType](imodeltype.md)‹any, any, NewC, any›*

___

###  props

▸ **props**<**PROPS2**>(`props`: PROPS2): *[IModelType](imodeltype.md)‹any & ModelPropertiesDeclarationToProperties‹PROPS2›, any, any, any›*

*Inherited from [IModelType](imodeltype.md).[props](imodeltype.md#props)*

*Defined in [src/types/complex-types/model.ts:201](https://github.com/mobxjs/mobx-state-tree/blob/1be40a3e/src/types/complex-types/model.ts#L201)*

**Type parameters:**

▪ **PROPS2**: *ModelPropertiesDeclaration*

**Parameters:**

Name | Type |
------ | ------ |
`props` | PROPS2 |

**Returns:** *[IModelType](imodeltype.md)‹any & ModelPropertiesDeclarationToProperties‹PROPS2›, any, any, any›*

___

###  validate

▸ **validate**(`thing`: ModelCreationType2‹any, any› | ModelInstanceType‹any, any›, `context`: [IValidationContext](../index.md#ivalidationcontext)): *[IValidationResult](../index.md#ivalidationresult)*

*Inherited from [IType](itype.md).[validate](itype.md#validate)*

*Defined in [src/core/type/type.ts:116](https://github.com/mobxjs/mobx-state-tree/blob/1be40a3e/src/core/type/type.ts#L116)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | ModelCreationType2‹any, any› &#124; ModelInstanceType‹any, any› | Value to be checked, either a snapshot or an instance. |
`context` | [IValidationContext](../index.md#ivalidationcontext) | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *[IValidationResult](../index.md#ivalidationresult)*

The validation result, an array with the list of validation errors.

___

###  views

▸ **views**<**V**>(`fn`: function): *[IModelType](imodeltype.md)‹any, any & V, any, any›*

*Inherited from [IModelType](imodeltype.md).[views](imodeltype.md#views)*

*Defined in [src/types/complex-types/model.ts:205](https://github.com/mobxjs/mobx-state-tree/blob/1be40a3e/src/types/complex-types/model.ts#L205)*

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

*Defined in [src/types/complex-types/model.ts:213](https://github.com/mobxjs/mobx-state-tree/blob/1be40a3e/src/types/complex-types/model.ts#L213)*

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
