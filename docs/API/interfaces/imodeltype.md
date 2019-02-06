[mobx-state-tree](../README.md) > [IModelType](../interfaces/imodeltype.md)

# Interface: IModelType

## Type parameters
#### PROPS :  `ModelProperties`
#### OTHERS 
#### CustomC 
#### CustomS 
## Hierarchy

 [IType](itype.md)<`ModelCreationType2`<`PROPS`, `CustomC`>, `ModelSnapshotType2`<`PROPS`, `CustomS`>, `ModelInstanceType`<`PROPS`, `OTHERS`, `CustomC`, `CustomS`>>

**↳ IModelType**

↳  [IAnyModelType](ianymodeltype.md)

## Index

### Properties

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

---

## Properties

<a id="name"></a>

###  name

**● name**: *`string`*

The type name.

___
<a id="properties"></a>

###  properties

**● properties**: *`PROPS`*

___

## Methods

<a id="actions"></a>

###  actions

▸ **actions**<`A`>(fn: *`function`*): [IModelType](imodeltype.md)<`PROPS`, `OTHERS` & `A`, `CustomC`, `CustomS`>

**Type parameters:**

#### A :  `ModelActions`
**Parameters:**

| Name | Type |
| ------ | ------ |
| fn | `function` |

**Returns:** [IModelType](imodeltype.md)<`PROPS`, `OTHERS` & `A`, `CustomC`, `CustomS`>

___
<a id="create"></a>

###  create

▸ **create**(...args: *`CreateParams`<`ModelCreationType2`<`PROPS`, `CustomC`>>*): `ModelInstanceType`<`PROPS`, `OTHERS`, `CustomC`, `CustomS`>

▸ **create**(snapshot: *`ModelCreationType2`<`PROPS`, `CustomC`>*, env?: *`any`*): `ModelInstanceType`<`PROPS`, `OTHERS`, `CustomC`, `CustomS`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` args | `CreateParams`<`ModelCreationType2`<`PROPS`, `CustomC`>> |

**Returns:** `ModelInstanceType`<`PROPS`, `OTHERS`, `CustomC`, `CustomS`>

Creates an instance for the type given an snapshot input.

**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `ModelCreationType2`<`PROPS`, `CustomC`> |
| `Optional` env | `any` |

**Returns:** `ModelInstanceType`<`PROPS`, `OTHERS`, `CustomC`, `CustomS`>
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

▸ **extend**<`A`,`V`,`VS`>(fn: *`function`*): [IModelType](imodeltype.md)<`PROPS`, `OTHERS` & `A` & `V` & `VS`, `CustomC`, `CustomS`>

**Type parameters:**

#### A :  `ModelActions`
#### V :  `Object`
#### VS :  `Object`
**Parameters:**

| Name | Type |
| ------ | ------ |
| fn | `function` |

**Returns:** [IModelType](imodeltype.md)<`PROPS`, `OTHERS` & `A` & `V` & `VS`, `CustomC`, `CustomS`>

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

▸ **named**(newName: *`string`*): [IModelType](imodeltype.md)<`PROPS`, `OTHERS`, `CustomC`, `CustomS`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| newName | `string` |

**Returns:** [IModelType](imodeltype.md)<`PROPS`, `OTHERS`, `CustomC`, `CustomS`>

___
<a id="postprocesssnapshot"></a>

###  postProcessSnapshot

▸ **postProcessSnapshot**<`NewS`>(fn: *`function`*): [IModelType](imodeltype.md)<`PROPS`, `OTHERS`, `CustomC`, `NewS`>

*__deprecated__*:
 See `types.snapshotProcessor`

**Type parameters:**

#### NewS 
**Parameters:**

| Name | Type |
| ------ | ------ |
| fn | `function` |

**Returns:** [IModelType](imodeltype.md)<`PROPS`, `OTHERS`, `CustomC`, `NewS`>

___
<a id="preprocesssnapshot"></a>

###  preProcessSnapshot

▸ **preProcessSnapshot**<`NewC`>(fn: *`function`*): [IModelType](imodeltype.md)<`PROPS`, `OTHERS`, `NewC`, `CustomS`>

*__deprecated__*:
 See `types.snapshotProcessor`

**Type parameters:**

#### NewC 
**Parameters:**

| Name | Type |
| ------ | ------ |
| fn | `function` |

**Returns:** [IModelType](imodeltype.md)<`PROPS`, `OTHERS`, `NewC`, `CustomS`>

___
<a id="props"></a>

###  props

▸ **props**<`PROPS2`>(props: *`PROPS2`*): [IModelType](imodeltype.md)<`PROPS` & `ModelPropertiesDeclarationToProperties`<`PROPS2`>, `OTHERS`, `CustomC`, `CustomS`>

**Type parameters:**

#### PROPS2 :  `ModelPropertiesDeclaration`
**Parameters:**

| Name | Type |
| ------ | ------ |
| props | `PROPS2` |

**Returns:** [IModelType](imodeltype.md)<`PROPS` & `ModelPropertiesDeclarationToProperties`<`PROPS2`>, `OTHERS`, `CustomC`, `CustomS`>

___
<a id="validate"></a>

###  validate

▸ **validate**(thing: *`ModelCreationType2`<`PROPS`, `CustomC`>*, context: *[IValidationContext](../#ivalidationcontext)*): [IValidationResult](../#ivalidationresult)

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| thing | `ModelCreationType2`<`PROPS`, `CustomC`> |  Value to be checked, either a snapshot or an instance. |
| context | [IValidationContext](../#ivalidationcontext) |  Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** [IValidationResult](../#ivalidationresult)
The validation result, an array with the list of validation errors.

___
<a id="views"></a>

###  views

▸ **views**<`V`>(fn: *`function`*): [IModelType](imodeltype.md)<`PROPS`, `OTHERS` & `V`, `CustomC`, `CustomS`>

**Type parameters:**

#### V :  `Object`
**Parameters:**

| Name | Type |
| ------ | ------ |
| fn | `function` |

**Returns:** [IModelType](imodeltype.md)<`PROPS`, `OTHERS` & `V`, `CustomC`, `CustomS`>

___
<a id="volatile"></a>

###  volatile

▸ **volatile**<`TP`>(fn: *`function`*): [IModelType](imodeltype.md)<`PROPS`, `OTHERS` & `TP`, `CustomC`, `CustomS`>

**Type parameters:**

#### TP :  `object`
**Parameters:**

| Name | Type |
| ------ | ------ |
| fn | `function` |

**Returns:** [IModelType](imodeltype.md)<`PROPS`, `OTHERS` & `TP`, `CustomC`, `CustomS`>

___

