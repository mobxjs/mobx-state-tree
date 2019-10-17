[mobx-state-tree](../README.md) › [IModelType](imodeltype.md)

# Interface: IModelType <**PROPS, OTHERS, CustomC, CustomS**>

## Type parameters

▪ **PROPS**: *ModelProperties*

▪ **OTHERS**

▪ **CustomC**

▪ **CustomS**

## Hierarchy

* [IType](itype.md)‹ModelCreationType2‹PROPS, CustomC›, ModelSnapshotType2‹PROPS, CustomS›, ModelInstanceType‹PROPS, OTHERS››

  ↳ **IModelType**

  ↳ [IAnyModelType](ianymodeltype.md)

## Index

### Properties

* [identifierAttribute](imodeltype.md#optional-identifierattribute)
* [name](imodeltype.md#name)
* [properties](imodeltype.md#properties)

### Methods

* [actions](imodeltype.md#actions)
* [create](imodeltype.md#create)
* [describe](imodeltype.md#describe)
* [extend](imodeltype.md#extend)
* [is](imodeltype.md#is)
* [named](imodeltype.md#named)
* [postProcessSnapshot](imodeltype.md#postprocesssnapshot)
* [preProcessSnapshot](imodeltype.md#preprocesssnapshot)
* [props](imodeltype.md#props)
* [validate](imodeltype.md#validate)
* [views](imodeltype.md#views)
* [volatile](imodeltype.md#volatile)

## Properties

### `Optional` identifierAttribute

• **identifierAttribute**? : *undefined | string*

*Inherited from [IType](itype.md).[identifierAttribute](itype.md#optional-identifierattribute)*

*Defined in [core/type/type.ts:86](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/core/type/type.ts#L86)*

Name of the identifier attribute or null if none.

___

###  name

• **name**: *string*

*Inherited from [IType](itype.md).[name](itype.md#name)*

*Defined in [core/type/type.ts:81](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/core/type/type.ts#L81)*

Friendly type name.

___

###  properties

• **properties**: *PROPS*

*Defined in [types/complex-types/model.ts:187](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/types/complex-types/model.ts#L187)*

## Methods

###  actions

▸ **actions**<**A**>(`fn`: function): *[IModelType](imodeltype.md)‹PROPS, OTHERS & A, CustomC, CustomS›*

*Defined in [types/complex-types/model.ts:201](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/types/complex-types/model.ts#L201)*

**Type parameters:**

▪ **A**: *ModelActions*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: [Instance](../README.md#instance)‹this›): *A*

**Parameters:**

Name | Type |
------ | ------ |
`self` | [Instance](../README.md#instance)‹this› |

**Returns:** *[IModelType](imodeltype.md)‹PROPS, OTHERS & A, CustomC, CustomS›*

___

###  create

▸ **create**(`snapshot?`: [C](undefined), `env?`: any): *this["Type"]*

*Inherited from [IType](itype.md).[create](itype.md#create)*

*Defined in [core/type/type.ts:93](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/core/type/type.ts#L93)*

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

*Defined in [core/type/type.ts:115](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/core/type/type.ts#L115)*

Gets the textual representation of the type as a string.

**Returns:** *string*

___

###  extend

▸ **extend**<**A**, **V**, **VS**>(`fn`: function): *[IModelType](imodeltype.md)‹PROPS, OTHERS & A & V & VS, CustomC, CustomS›*

*Defined in [types/complex-types/model.ts:209](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/types/complex-types/model.ts#L209)*

**Type parameters:**

▪ **A**: *ModelActions*

▪ **V**: *Object*

▪ **VS**: *Object*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: [Instance](../README.md#instance)‹this›): *object*

**Parameters:**

Name | Type |
------ | ------ |
`self` | [Instance](../README.md#instance)‹this› |

**Returns:** *[IModelType](imodeltype.md)‹PROPS, OTHERS & A & V & VS, CustomC, CustomS›*

___

###  is

▸ **is**(`thing`: any): *boolean*

*Inherited from [IType](itype.md).[is](itype.md#is)*

*Defined in [core/type/type.ts:101](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/core/type/type.ts#L101)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *boolean*

true if the value is of the current type, false otherwise.

___

###  named

▸ **named**(`newName`: string): *[IModelType](imodeltype.md)‹PROPS, OTHERS, CustomC, CustomS›*

*Defined in [types/complex-types/model.ts:189](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/types/complex-types/model.ts#L189)*

**Parameters:**

Name | Type |
------ | ------ |
`newName` | string |

**Returns:** *[IModelType](imodeltype.md)‹PROPS, OTHERS, CustomC, CustomS›*

___

###  postProcessSnapshot

▸ **postProcessSnapshot**<**NewS**>(`fn`: function): *[IModelType](imodeltype.md)‹PROPS, OTHERS, CustomC, NewS›*

*Defined in [types/complex-types/model.ts:219](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/types/complex-types/model.ts#L219)*

**`deprecated`** See `types.snapshotProcessor`

**Type parameters:**

▪ **NewS**

**Parameters:**

▪ **fn**: *function*

▸ (`snapshot`: ModelSnapshotType2‹PROPS, CustomS›): *NewS*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | ModelSnapshotType2‹PROPS, CustomS› |

**Returns:** *[IModelType](imodeltype.md)‹PROPS, OTHERS, CustomC, NewS›*

___

###  preProcessSnapshot

▸ **preProcessSnapshot**<**NewC**>(`fn`: function): *[IModelType](imodeltype.md)‹PROPS, OTHERS, NewC, CustomS›*

*Defined in [types/complex-types/model.ts:214](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/types/complex-types/model.ts#L214)*

**`deprecated`** See `types.snapshotProcessor`

**Type parameters:**

▪ **NewC**

**Parameters:**

▪ **fn**: *function*

▸ (`snapshot`: NewC): *ModelCreationType2‹PROPS, CustomC›*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | NewC |

**Returns:** *[IModelType](imodeltype.md)‹PROPS, OTHERS, NewC, CustomS›*

___

###  props

▸ **props**<**PROPS2**>(`props`: PROPS2): *[IModelType](imodeltype.md)‹PROPS & ModelPropertiesDeclarationToProperties‹PROPS2›, OTHERS, CustomC, CustomS›*

*Defined in [types/complex-types/model.ts:193](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/types/complex-types/model.ts#L193)*

**Type parameters:**

▪ **PROPS2**: *ModelPropertiesDeclaration*

**Parameters:**

Name | Type |
------ | ------ |
`props` | PROPS2 |

**Returns:** *[IModelType](imodeltype.md)‹PROPS & ModelPropertiesDeclarationToProperties‹PROPS2›, OTHERS, CustomC, CustomS›*

___

###  validate

▸ **validate**(`thing`: ModelCreationType2‹PROPS, CustomC›, `context`: [IValidationContext](../README.md#ivalidationcontext)): *[IValidationResult](../README.md#ivalidationresult)*

*Inherited from [IType](itype.md).[validate](itype.md#validate)*

*Defined in [core/type/type.ts:110](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/core/type/type.ts#L110)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | ModelCreationType2‹PROPS, CustomC› | Value to be checked, either a snapshot or an instance. |
`context` | [IValidationContext](../README.md#ivalidationcontext) | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *[IValidationResult](../README.md#ivalidationresult)*

The validation result, an array with the list of validation errors.

___

###  views

▸ **views**<**V**>(`fn`: function): *[IModelType](imodeltype.md)‹PROPS, OTHERS & V, CustomC, CustomS›*

*Defined in [types/complex-types/model.ts:197](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/types/complex-types/model.ts#L197)*

**Type parameters:**

▪ **V**: *Object*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: [Instance](../README.md#instance)‹this›): *V*

**Parameters:**

Name | Type |
------ | ------ |
`self` | [Instance](../README.md#instance)‹this› |

**Returns:** *[IModelType](imodeltype.md)‹PROPS, OTHERS & V, CustomC, CustomS›*

___

###  volatile

▸ **volatile**<**TP**>(`fn`: function): *[IModelType](imodeltype.md)‹PROPS, OTHERS & TP, CustomC, CustomS›*

*Defined in [types/complex-types/model.ts:205](https://github.com/mobxjs/mobx-state-tree/blob/6b966be0/packages/mobx-state-tree/src/types/complex-types/model.ts#L205)*

**Type parameters:**

▪ **TP**: *object*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: [Instance](../README.md#instance)‹this›): *TP*

**Parameters:**

Name | Type |
------ | ------ |
`self` | [Instance](../README.md#instance)‹this› |

**Returns:** *[IModelType](imodeltype.md)‹PROPS, OTHERS & TP, CustomC, CustomS›*
