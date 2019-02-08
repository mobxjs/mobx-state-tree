[mobx-state-tree](../README.md) > [IAnyModelType](../interfaces/ianymodeltype.md)

# Interface: IAnyModelType

Any model type.

## Hierarchy

↳  [IModelType](imodeltype.md)<`any`, `any`, `any`, `any`>

**↳ IAnyModelType**

## Index

### Properties

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

---

## Properties

<a id="name"></a>

###  name

**● name**: *`string`*

The type name.

___
<a id="properties"></a>

###  properties

**● properties**: *`any`*

___

## Methods

<a id="actions"></a>

###  actions

▸ **actions**<`A`>(fn: *`function`*): [IModelType](imodeltype.md)<`any`, `any` & `A`, `any`, `any`>

**Type parameters:**

#### A :  `ModelActions`
**Parameters:**

| Name | Type |
| ------ | ------ |
| fn | `function` |

**Returns:** [IModelType](imodeltype.md)<`any`, `any` & `A`, `any`, `any`>

___
<a id="create"></a>

###  create

▸ **create**(...args: *`CreateParams`<`ModelCreationType2`<`any`, `any`>>*): `ModelInstanceType`<`any`, `any`, `any`, `any`>

▸ **create**(snapshot: *`ModelCreationType2`<`any`, `any`>*, env?: *`any`*): `ModelInstanceType`<`any`, `any`, `any`, `any`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` args | `CreateParams`<`ModelCreationType2`<`any`, `any`>> |

**Returns:** `ModelInstanceType`<`any`, `any`, `any`, `any`>

Creates an instance for the type given an snapshot input.

**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `ModelCreationType2`<`any`, `any`> |
| `Optional` env | `any` |

**Returns:** `ModelInstanceType`<`any`, `any`, `any`, `any`>
An instance of that type.

___
<a id="describe"></a>

###  describe

▸ **describe**(): `string`

Gets the textual representation of the type as a string.

**Returns:** `string`

___
<a id="extend"></a>

###  extend

▸ **extend**<`A`,`V`,`VS`>(fn: *`function`*): [IModelType](imodeltype.md)<`any`, `any` & `A` & `V` & `VS`, `any`, `any`>

**Type parameters:**

#### A :  `ModelActions`
#### V :  `Object`
#### VS :  `Object`
**Parameters:**

| Name | Type |
| ------ | ------ |
| fn | `function` |

**Returns:** [IModelType](imodeltype.md)<`any`, `any` & `A` & `V` & `VS`, `any`, `any`>

___
<a id="is"></a>

###  is

▸ **is**(thing: *`any`*): `boolean`

Checks if a given snapshot / instance is of the given type.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| thing | `any` |  Snapshot or instance to be checked. |

**Returns:** `boolean`
true if the value is of the current type, false otherwise.

___
<a id="named"></a>

###  named

▸ **named**(newName: *`string`*): [IModelType](imodeltype.md)<`any`, `any`, `any`, `any`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| newName | `string` |

**Returns:** [IModelType](imodeltype.md)<`any`, `any`, `any`, `any`>

___
<a id="postprocesssnapshot"></a>

###  postProcessSnapshot

▸ **postProcessSnapshot**<`NewS`>(fn: *`function`*): [IModelType](imodeltype.md)<`any`, `any`, `any`, `NewS`>

*__deprecated__*: See `types.snapshotProcessor`

**Type parameters:**

#### NewS 
**Parameters:**

| Name | Type |
| ------ | ------ |
| fn | `function` |

**Returns:** [IModelType](imodeltype.md)<`any`, `any`, `any`, `NewS`>

___
<a id="preprocesssnapshot"></a>

###  preProcessSnapshot

▸ **preProcessSnapshot**<`NewC`>(fn: *`function`*): [IModelType](imodeltype.md)<`any`, `any`, `NewC`, `any`>

*__deprecated__*: See `types.snapshotProcessor`

**Type parameters:**

#### NewC 
**Parameters:**

| Name | Type |
| ------ | ------ |
| fn | `function` |

**Returns:** [IModelType](imodeltype.md)<`any`, `any`, `NewC`, `any`>

___
<a id="props"></a>

###  props

▸ **props**<`PROPS2`>(props: *`PROPS2`*): [IModelType](imodeltype.md)<`any` & `ModelPropertiesDeclarationToProperties`<`PROPS2`>, `any`, `any`, `any`>

**Type parameters:**

#### PROPS2 :  `ModelPropertiesDeclaration`
**Parameters:**

| Name | Type |
| ------ | ------ |
| props | `PROPS2` |

**Returns:** [IModelType](imodeltype.md)<`any` & `ModelPropertiesDeclarationToProperties`<`PROPS2`>, `any`, `any`, `any`>

___
<a id="validate"></a>

###  validate

▸ **validate**(thing: *`ModelCreationType2`<`any`, `any`>*, context: *[IValidationContext](../#ivalidationcontext)*): [IValidationResult](../#ivalidationresult)

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| thing | `ModelCreationType2`<`any`, `any`> |  Value to be checked, either a snapshot or an instance. |
| context | [IValidationContext](../#ivalidationcontext) |  Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** [IValidationResult](../#ivalidationresult)
The validation result, an array with the list of validation errors.

___
<a id="views"></a>

###  views

▸ **views**<`V`>(fn: *`function`*): [IModelType](imodeltype.md)<`any`, `any` & `V`, `any`, `any`>

**Type parameters:**

#### V :  `Object`
**Parameters:**

| Name | Type |
| ------ | ------ |
| fn | `function` |

**Returns:** [IModelType](imodeltype.md)<`any`, `any` & `V`, `any`, `any`>

___
<a id="volatile"></a>

###  volatile

▸ **volatile**<`TP`>(fn: *`function`*): [IModelType](imodeltype.md)<`any`, `any` & `TP`, `any`, `any`>

**Type parameters:**

#### TP :  `object`
**Parameters:**

| Name | Type |
| ------ | ------ |
| fn | `function` |

**Returns:** [IModelType](imodeltype.md)<`any`, `any` & `TP`, `any`, `any`>

___

