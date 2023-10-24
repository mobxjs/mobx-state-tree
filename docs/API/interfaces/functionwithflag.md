---
id: "functionwithflag"
title: "FunctionWithFlag"
sidebar_label: "FunctionWithFlag"
---

[mobx-state-tree - v5.3.0](../index.md) › [FunctionWithFlag](functionwithflag.md)

## Hierarchy

* Function

  ↳ **FunctionWithFlag**

## Index

### Properties

* [Function](functionwithflag.md#function)
* [_isFlowAction](functionwithflag.md#optional-_isflowaction)
* [_isMSTAction](functionwithflag.md#optional-_ismstaction)
* [arguments](functionwithflag.md#arguments)
* [caller](functionwithflag.md#caller)
* [length](functionwithflag.md#length)
* [name](functionwithflag.md#name)
* [prototype](functionwithflag.md#prototype)

### Methods

* [[Symbol.hasInstance]](functionwithflag.md#[symbol.hasinstance])
* [apply](functionwithflag.md#apply)
* [bind](functionwithflag.md#bind)
* [call](functionwithflag.md#call)
* [toString](functionwithflag.md#tostring)

## Properties

###  Function

• **Function**: *FunctionConstructor*

Defined in node_modules/typescript/lib/lib.es5.d.ts:316

___

### `Optional` _isFlowAction

• **_isFlowAction**? : *undefined | false | true*

*Defined in [src/core/action.ts:42](https://github.com/mobxjs/mobx-state-tree/blob/73343f6b/src/core/action.ts#L42)*

___

### `Optional` _isMSTAction

• **_isMSTAction**? : *undefined | false | true*

*Defined in [src/core/action.ts:41](https://github.com/mobxjs/mobx-state-tree/blob/73343f6b/src/core/action.ts#L41)*

___

###  arguments

• **arguments**: *any*

*Inherited from void*

Defined in node_modules/typescript/lib/lib.es5.d.ts:302

___

###  caller

• **caller**: *Function*

*Inherited from void*

Defined in node_modules/typescript/lib/lib.es5.d.ts:303

___

###  length

• **length**: *number*

*Inherited from void*

Defined in node_modules/typescript/lib/lib.es5.d.ts:299

___

###  name

• **name**: *string*

*Inherited from void*

Defined in node_modules/typescript/lib/lib.es2015.core.d.ts:97

Returns the name of the function. Function names are read-only and can not be changed.

___

###  prototype

• **prototype**: *any*

*Inherited from void*

Defined in node_modules/typescript/lib/lib.es5.d.ts:298

## Methods

###  [Symbol.hasInstance]

▸ **[Symbol.hasInstance]**(`value`: any): *boolean*

*Inherited from void*

Defined in node_modules/typescript/lib/lib.es2015.symbol.wellknown.d.ts:157

Determines whether the given value inherits from this function if this function was used
as a constructor function.

A constructor function can control which objects are recognized as its instances by
'instanceof' by overriding this method.

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *boolean*

___

###  apply

▸ **apply**(`this`: Function, `thisArg`: any, `argArray?`: any): *any*

*Inherited from void*

Defined in node_modules/typescript/lib/lib.es5.d.ts:278

Calls the function, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`this` | Function | - |
`thisArg` | any | The object to be used as the this object. |
`argArray?` | any | A set of arguments to be passed to the function.  |

**Returns:** *any*

___

###  bind

▸ **bind**(`this`: Function, `thisArg`: any, ...`argArray`: any[]): *any*

*Inherited from void*

Defined in node_modules/typescript/lib/lib.es5.d.ts:293

For a given function, creates a bound function that has the same body as the original function.
The this object of the bound function is associated with the specified object, and has the specified initial parameters.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`this` | Function | - |
`thisArg` | any | An object to which the this keyword can refer inside the new function. |
`...argArray` | any[] | A list of arguments to be passed to the new function.  |

**Returns:** *any*

___

###  call

▸ **call**(`this`: Function, `thisArg`: any, ...`argArray`: any[]): *any*

*Inherited from void*

Defined in node_modules/typescript/lib/lib.es5.d.ts:285

Calls a method of an object, substituting another object for the current object.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`this` | Function | - |
`thisArg` | any | The object to be used as the current object. |
`...argArray` | any[] | A list of arguments to be passed to the method.  |

**Returns:** *any*

___

###  toString

▸ **toString**(): *string*

*Inherited from void*

Defined in node_modules/typescript/lib/lib.es5.d.ts:296

Returns a string representation of a function.

**Returns:** *string*
