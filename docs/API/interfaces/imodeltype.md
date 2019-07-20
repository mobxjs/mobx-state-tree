> **[mobx-state-tree](../README.md)**

[IModelType](imodeltype.md) /

# Interface: IModelType <**PROPS, OTHERS, CustomC, CustomS**>

## Type parameters

▪ **PROPS**: *`ModelProperties`*

▪ **OTHERS**

▪ **CustomC**

▪ **CustomS**

## Hierarchy

* [IType](itype.md)‹*`ModelCreationType2<PROPS, CustomC>`*, *`ModelSnapshotType2<PROPS, CustomS>`*, *`ModelInstanceType<PROPS, OTHERS>`*›

  * **IModelType**

  * [IAnyModelType](ianymodeltype.md)

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

Name of the identifier attribute or null if none.

___

###  name

• **name**: *string*

*Inherited from [IType](itype.md).[name](itype.md#name)*

Friendly type name.

___

###  properties

• **properties**: *`PROPS`*

## Methods

###  actions

▸ **actions**<**A**>(`fn`: function): *[IModelType](imodeltype.md)‹*`PROPS`*, *`OTHERS` & `A`*, *`CustomC`*, *`CustomS`*›*

**Type parameters:**

▪ **A**: *`ModelActions`*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: [Instance](../README.md#instance)‹*this*›): *`A`*

**Parameters:**

Name | Type |
------ | ------ |
`self` | [Instance](../README.md#instance)‹*this*› |

**Returns:** *[IModelType](imodeltype.md)‹*`PROPS`*, *`OTHERS` & `A`*, *`CustomC`*, *`CustomS`*›*

___

###  create

▸ **create**(`snapshot?`: [C](), `env?`: any): *`this["Type"]`*

*Inherited from [IType](itype.md).[create](itype.md#create)*

Creates an instance for the type given an snapshot input.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | [C]() |
`env?` | any |

**Returns:** *`this["Type"]`*

An instance of that type.

___

###  describe

▸ **describe**(): *string*

*Inherited from [IType](itype.md).[describe](itype.md#describe)*

Gets the textual representation of the type as a string.

**Returns:** *string*

___

###  extend

▸ **extend**<**A**, **V**, **VS**>(`fn`: function): *[IModelType](imodeltype.md)‹*`PROPS`*, *`OTHERS` & `A` & `V` & `VS`*, *`CustomC`*, *`CustomS`*›*

**Type parameters:**

▪ **A**: *`ModelActions`*

▪ **V**: *`Object`*

▪ **VS**: *`Object`*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: [Instance](../README.md#instance)‹*this*›): *object*

**Parameters:**

Name | Type |
------ | ------ |
`self` | [Instance](../README.md#instance)‹*this*› |

**Returns:** *[IModelType](imodeltype.md)‹*`PROPS`*, *`OTHERS` & `A` & `V` & `VS`*, *`CustomC`*, *`CustomS`*›*

___

###  is

▸ **is**(`thing`: any): *boolean*

*Inherited from [IType](itype.md).[is](itype.md#is)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *boolean*

true if the value is of the current type, false otherwise.

___

###  named

▸ **named**(`newName`: string): *[IModelType](imodeltype.md)‹*`PROPS`*, *`OTHERS`*, *`CustomC`*, *`CustomS`*›*

**Parameters:**

Name | Type |
------ | ------ |
`newName` | string |

**Returns:** *[IModelType](imodeltype.md)‹*`PROPS`*, *`OTHERS`*, *`CustomC`*, *`CustomS`*›*

___

###  postProcessSnapshot

▸ **postProcessSnapshot**<**NewS**>(`fn`: function): *[IModelType](imodeltype.md)‹*`PROPS`*, *`OTHERS`*, *`CustomC`*, *`NewS`*›*

**`deprecated`** See `types.snapshotProcessor`

**Type parameters:**

▪ **NewS**

**Parameters:**

▪ **fn**: *function*

▸ (`snapshot`: `ModelSnapshotType2<PROPS, CustomS>`): *`NewS`*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | `ModelSnapshotType2<PROPS, CustomS>` |

**Returns:** *[IModelType](imodeltype.md)‹*`PROPS`*, *`OTHERS`*, *`CustomC`*, *`NewS`*›*

___

###  preProcessSnapshot

▸ **preProcessSnapshot**<**NewC**>(`fn`: function): *[IModelType](imodeltype.md)‹*`PROPS`*, *`OTHERS`*, *`NewC`*, *`CustomS`*›*

**`deprecated`** See `types.snapshotProcessor`

**Type parameters:**

▪ **NewC**

**Parameters:**

▪ **fn**: *function*

▸ (`snapshot`: `NewC`): *`ModelCreationType2<PROPS, CustomC>`*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | `NewC` |

**Returns:** *[IModelType](imodeltype.md)‹*`PROPS`*, *`OTHERS`*, *`NewC`*, *`CustomS`*›*

___

###  props

▸ **props**<**PROPS2**>(`props`: `PROPS2`): *[IModelType](imodeltype.md)‹*`PROPS` & `ModelPropertiesDeclarationToProperties<PROPS2>`*, *`OTHERS`*, *`CustomC`*, *`CustomS`*›*

**Type parameters:**

▪ **PROPS2**: *`ModelPropertiesDeclaration`*

**Parameters:**

Name | Type |
------ | ------ |
`props` | `PROPS2` |

**Returns:** *[IModelType](imodeltype.md)‹*`PROPS` & `ModelPropertiesDeclarationToProperties<PROPS2>`*, *`OTHERS`*, *`CustomC`*, *`CustomS`*›*

___

###  validate

▸ **validate**(`thing`: `ModelCreationType2<PROPS, CustomC>`, `context`: [IValidationContext](../README.md#ivalidationcontext)): *[IValidationResult](../README.md#ivalidationresult)*

*Inherited from [IType](itype.md).[validate](itype.md#validate)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | `ModelCreationType2<PROPS, CustomC>` | Value to be checked, either a snapshot or an instance. |
`context` | [IValidationContext](../README.md#ivalidationcontext) | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *[IValidationResult](../README.md#ivalidationresult)*

The validation result, an array with the list of validation errors.

___

###  views

▸ **views**<**V**>(`fn`: function): *[IModelType](imodeltype.md)‹*`PROPS`*, *`OTHERS` & `V`*, *`CustomC`*, *`CustomS`*›*

**Type parameters:**

▪ **V**: *`Object`*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: [Instance](../README.md#instance)‹*this*›): *`V`*

**Parameters:**

Name | Type |
------ | ------ |
`self` | [Instance](../README.md#instance)‹*this*› |

**Returns:** *[IModelType](imodeltype.md)‹*`PROPS`*, *`OTHERS` & `V`*, *`CustomC`*, *`CustomS`*›*

___

###  volatile

▸ **volatile**<**TP**>(`fn`: function): *[IModelType](imodeltype.md)‹*`PROPS`*, *`OTHERS` & `TP`*, *`CustomC`*, *`CustomS`*›*

**Type parameters:**

▪ **TP**: *object*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: [Instance](../README.md#instance)‹*this*›): *`TP`*

**Parameters:**

Name | Type |
------ | ------ |
`self` | [Instance](../README.md#instance)‹*this*› |

**Returns:** *[IModelType](imodeltype.md)‹*`PROPS`*, *`OTHERS` & `TP`*, *`CustomC`*, *`CustomS`*›*