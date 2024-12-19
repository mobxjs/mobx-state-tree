---
id: "index"
title: "mobx-state-tree - v7.0.1"
sidebar_label: "Globals"
---

[mobx-state-tree - v7.0.1](index.md)

## Index

### Interfaces

* [CustomTypeOptions](interfaces/customtypeoptions.md)
* [FunctionWithFlag](interfaces/functionwithflag.md)
* [IActionContext](interfaces/iactioncontext.md)
* [IActionRecorder](interfaces/iactionrecorder.md)
* [IActionTrackingMiddleware2Call](interfaces/iactiontrackingmiddleware2call.md)
* [IActionTrackingMiddleware2Hooks](interfaces/iactiontrackingmiddleware2hooks.md)
* [IActionTrackingMiddlewareHooks](interfaces/iactiontrackingmiddlewarehooks.md)
* [IAnyComplexType](interfaces/ianycomplextype.md)
* [IAnyModelType](interfaces/ianymodeltype.md)
* [IAnyType](interfaces/ianytype.md)
* [IHooks](interfaces/ihooks.md)
* [IJsonPatch](interfaces/ijsonpatch.md)
* [IMiddlewareEvent](interfaces/imiddlewareevent.md)
* [IModelReflectionData](interfaces/imodelreflectiondata.md)
* [IModelReflectionPropertiesData](interfaces/imodelreflectionpropertiesdata.md)
* [IModelType](interfaces/imodeltype.md)
* [IPatchRecorder](interfaces/ipatchrecorder.md)
* [IReversibleJsonPatch](interfaces/ireversiblejsonpatch.md)
* [ISerializedActionCall](interfaces/iserializedactioncall.md)
* [ISimpleType](interfaces/isimpletype.md)
* [ISnapshotProcessor](interfaces/isnapshotprocessor.md)
* [ISnapshotProcessors](interfaces/isnapshotprocessors.md)
* [IType](interfaces/itype.md)
* [IValidationContextEntry](interfaces/ivalidationcontextentry.md)
* [IValidationError](interfaces/ivalidationerror.md)
* [ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)
* [ReferenceOptionsOnInvalidated](interfaces/referenceoptionsoninvalidated.md)
* [UnionOptions](interfaces/unionoptions.md)

### Type aliases

* [IDisposer](index.md#idisposer)
* [IHooksGetter](index.md#ihooksgetter)
* [IMiddlewareEventType](index.md#imiddlewareeventtype)
* [IMiddlewareHandler](index.md#imiddlewarehandler)
* [ITypeDispatcher](index.md#itypedispatcher)
* [IUnionType](index.md#iuniontype)
* [IValidationContext](index.md#ivalidationcontext)
* [IValidationResult](index.md#ivalidationresult)
* [Instance](index.md#instance)
* [LivelinessMode](index.md#livelinessmode)
* [OnReferenceInvalidated](index.md#onreferenceinvalidated)
* [OnReferenceInvalidatedEvent](index.md#onreferenceinvalidatedevent)
* [ReferenceIdentifier](index.md#referenceidentifier)
* [ReferenceOptions](index.md#referenceoptions)
* [SnapshotIn](index.md#snapshotin)
* [SnapshotOrInstance](index.md#snapshotorinstance)
* [SnapshotOut](index.md#snapshotout)

### Variables

* [DatePrimitive](index.md#const-dateprimitive)
* [boolean](index.md#const-boolean)
* [finite](index.md#const-finite)
* [float](index.md#const-float)
* [identifier](index.md#const-identifier)
* [identifierNumber](index.md#const-identifiernumber)
* [integer](index.md#const-integer)
* [nullType](index.md#const-nulltype)
* [number](index.md#const-number)
* [string](index.md#const-string)
* [undefinedType](index.md#const-undefinedtype)

### Functions

* [addDisposer](index.md#adddisposer)
* [addMiddleware](index.md#addmiddleware)
* [applyAction](index.md#applyaction)
* [applyPatch](index.md#applypatch)
* [applySnapshot](index.md#applysnapshot)
* [array](index.md#array)
* [cast](index.md#cast)
* [castFlowReturn](index.md#castflowreturn)
* [castToReferenceSnapshot](index.md#casttoreferencesnapshot)
* [castToSnapshot](index.md#casttosnapshot)
* [clone](index.md#clone)
* [compose](index.md#compose)
* [createActionTrackingMiddleware](index.md#createactiontrackingmiddleware)
* [createActionTrackingMiddleware2](index.md#createactiontrackingmiddleware2)
* [custom](index.md#custom)
* [decorate](index.md#decorate)
* [destroy](index.md#destroy)
* [detach](index.md#detach)
* [enumeration](index.md#enumeration)
* [escapeJsonPath](index.md#escapejsonpath)
* [flow](index.md#flow)
* [frozen](index.md#frozen)
* [getChildType](index.md#getchildtype)
* [getEnv](index.md#getenv)
* [getIdentifier](index.md#getidentifier)
* [getLivelinessChecking](index.md#getlivelinesschecking)
* [getMembers](index.md#getmembers)
* [getNodeId](index.md#getnodeid)
* [getParent](index.md#getparent)
* [getParentOfType](index.md#getparentoftype)
* [getPath](index.md#getpath)
* [getPathParts](index.md#getpathparts)
* [getPropertyMembers](index.md#getpropertymembers)
* [getRelativePath](index.md#getrelativepath)
* [getRoot](index.md#getroot)
* [getRunningActionContext](index.md#getrunningactioncontext)
* [getSnapshot](index.md#getsnapshot)
* [getType](index.md#gettype)
* [hasEnv](index.md#hasenv)
* [hasParent](index.md#hasparent)
* [hasParentOfType](index.md#hasparentoftype)
* [isActionContextChildOf](index.md#isactioncontextchildof)
* [isActionContextThisOrChildOf](index.md#isactioncontextthisorchildof)
* [isAlive](index.md#isalive)
* [isArrayType](index.md#isarraytype)
* [isFrozenType](index.md#isfrozentype)
* [isIdentifierType](index.md#isidentifiertype)
* [isLateType](index.md#islatetype)
* [isLiteralType](index.md#isliteraltype)
* [isMapType](index.md#ismaptype)
* [isModelType](index.md#ismodeltype)
* [isOptionalType](index.md#isoptionaltype)
* [isPrimitiveType](index.md#isprimitivetype)
* [isProtected](index.md#isprotected)
* [isReferenceType](index.md#isreferencetype)
* [isRefinementType](index.md#isrefinementtype)
* [isRoot](index.md#isroot)
* [isStateTreeNode](index.md#isstatetreenode)
* [isType](index.md#istype)
* [isUnionType](index.md#isuniontype)
* [isValidReference](index.md#isvalidreference)
* [joinJsonPath](index.md#joinjsonpath)
* [late](index.md#late)
* [lazy](index.md#lazy)
* [literal](index.md#literal)
* [map](index.md#map)
* [maybe](index.md#maybe)
* [maybeNull](index.md#maybenull)
* [model](index.md#model)
* [onAction](index.md#onaction)
* [onPatch](index.md#onpatch)
* [onSnapshot](index.md#onsnapshot)
* [optional](index.md#optional)
* [protect](index.md#protect)
* [recordActions](index.md#recordactions)
* [recordPatches](index.md#recordpatches)
* [reference](index.md#reference)
* [refinement](index.md#refinement)
* [resolveIdentifier](index.md#resolveidentifier)
* [resolvePath](index.md#resolvepath)
* [safeReference](index.md#safereference)
* [setLivelinessChecking](index.md#setlivelinesschecking)
* [snapshotProcessor](index.md#snapshotprocessor)
* [splitJsonPath](index.md#splitjsonpath)
* [toGenerator](index.md#togenerator)
* [toGeneratorFunction](index.md#togeneratorfunction)
* [tryReference](index.md#tryreference)
* [tryResolve](index.md#tryresolve)
* [typecheck](index.md#typecheck)
* [unescapeJsonPath](index.md#unescapejsonpath)
* [union](index.md#union)
* [unprotect](index.md#unprotect)
* [walk](index.md#walk)

### Object literals

* [types](index.md#const-types)

## Type aliases

###  IDisposer

Ƭ **IDisposer**: *function*

*Defined in [src/utils.ts:35](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/utils.ts#L35)*

A generic disposer.

#### Type declaration:

▸ (): *void*

___

###  IHooksGetter

Ƭ **IHooksGetter**: *function*

*Defined in [src/core/node/Hook.ts:19](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/node/Hook.ts#L19)*

#### Type declaration:

▸ (`self`: T): *[IHooks](interfaces/ihooks.md)*

**Parameters:**

Name | Type |
------ | ------ |
`self` | T |

___

###  IMiddlewareEventType

Ƭ **IMiddlewareEventType**: *"action" | "flow_spawn" | "flow_resume" | "flow_resume_error" | "flow_return" | "flow_throw"*

*Defined in [src/core/action.ts:16](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/action.ts#L16)*

___

###  IMiddlewareHandler

Ƭ **IMiddlewareHandler**: *function*

*Defined in [src/core/action.ts:54](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/action.ts#L54)*

#### Type declaration:

▸ (`actionCall`: [IMiddlewareEvent](interfaces/imiddlewareevent.md), `next`: function, `abort`: function): *any*

**Parameters:**

▪ **actionCall**: *[IMiddlewareEvent](interfaces/imiddlewareevent.md)*

▪ **next**: *function*

▸ (`actionCall`: [IMiddlewareEvent](interfaces/imiddlewareevent.md), `callback?`: undefined | function): *void*

**Parameters:**

Name | Type |
------ | ------ |
`actionCall` | [IMiddlewareEvent](interfaces/imiddlewareevent.md) |
`callback?` | undefined &#124; function |

▪ **abort**: *function*

▸ (`value`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

___

###  ITypeDispatcher

Ƭ **ITypeDispatcher**: *function*

*Defined in [src/types/utility-types/union.ts:22](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/union.ts#L22)*

#### Type declaration:

▸ (`snapshot`: Types[number]["SnapshotType"]): *Types[number]*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | Types[number]["SnapshotType"] |

___

###  IUnionType

Ƭ **IUnionType**: *ITypeUnion‹Types[number]["CreationType"], Types[number]["SnapshotType"], Types[number]["TypeWithoutSTN"]›*

*Defined in [src/types/utility-types/union.ts:169](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/union.ts#L169)*

___

###  IValidationContext

Ƭ **IValidationContext**: *[IValidationContextEntry](interfaces/ivalidationcontextentry.md)[]*

*Defined in [src/core/type/type-checker.ts:23](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/type/type-checker.ts#L23)*

Array of validation context entries

___

###  IValidationResult

Ƭ **IValidationResult**: *[IValidationError](interfaces/ivalidationerror.md)[]*

*Defined in [src/core/type/type-checker.ts:36](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/type/type-checker.ts#L36)*

Type validation result, which is an array of type validation errors

___

###  Instance

Ƭ **Instance**: *T extends object ? T["Type"] : T*

*Defined in [src/core/type/type.ts:233](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/type/type.ts#L233)*

The instance representation of a given type.

___

###  LivelinessMode

Ƭ **LivelinessMode**: *"warn" | "error" | "ignore"*

*Defined in [src/core/node/livelinessChecking.ts:7](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/node/livelinessChecking.ts#L7)*

Defines what MST should do when running into reads / writes to objects that have died.
- `"warn"`: Print a warning (default).
- `"error"`: Throw an exception.
- "`ignore`": Do nothing.

___

###  OnReferenceInvalidated

Ƭ **OnReferenceInvalidated**: *function*

*Defined in [src/types/utility-types/reference.ts:45](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/reference.ts#L45)*

#### Type declaration:

▸ (`event`: [OnReferenceInvalidatedEvent](index.md#onreferenceinvalidatedevent)‹STN›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | [OnReferenceInvalidatedEvent](index.md#onreferenceinvalidatedevent)‹STN› |

___

###  OnReferenceInvalidatedEvent

Ƭ **OnReferenceInvalidatedEvent**: *object*

*Defined in [src/types/utility-types/reference.ts:36](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/reference.ts#L36)*

#### Type declaration:

___

###  ReferenceIdentifier

Ƭ **ReferenceIdentifier**: *string | number*

*Defined in [src/types/utility-types/identifier.ts:147](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/identifier.ts#L147)*

Valid types for identifiers.

___

###  ReferenceOptions

Ƭ **ReferenceOptions**: *[ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)‹IT› | [ReferenceOptionsOnInvalidated](interfaces/referenceoptionsoninvalidated.md)‹IT› | [ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)‹IT› & [ReferenceOptionsOnInvalidated](interfaces/referenceoptionsoninvalidated.md)‹IT›*

*Defined in [src/types/utility-types/reference.ts:481](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/reference.ts#L481)*

___

###  SnapshotIn

Ƭ **SnapshotIn**: *T extends object ? T["CreationType"] : T extends IStateTreeNode<infer IT> ? IT["CreationType"] : T*

*Defined in [src/core/type/type.ts:238](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/type/type.ts#L238)*

The input (creation) snapshot representation of a given type.

___

###  SnapshotOrInstance

Ƭ **SnapshotOrInstance**: *[SnapshotIn](index.md#snapshotin)‹T› | [Instance](index.md#instance)‹T›*

*Defined in [src/core/type/type.ts:279](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/type/type.ts#L279)*

A type which is equivalent to the union of SnapshotIn and Instance types of a given typeof TYPE or typeof VARIABLE.
For primitives it defaults to the primitive itself.

For example:
- `SnapshotOrInstance<typeof ModelA> = SnapshotIn<typeof ModelA> | Instance<typeof ModelA>`
- `SnapshotOrInstance<typeof self.a (where self.a is a ModelA)> = SnapshotIn<typeof ModelA> | Instance<typeof ModelA>`

Usually you might want to use this when your model has a setter action that sets a property.

Example:
```ts
const ModelA = types.model({
  n: types.number
})

const ModelB = types.model({
  innerModel: ModelA
}).actions(self => ({
  // this will accept as property both the snapshot and the instance, whichever is preferred
  setInnerModel(m: SnapshotOrInstance<typeof self.innerModel>) {
    self.innerModel = cast(m)
  }
}))
```

___

###  SnapshotOut

Ƭ **SnapshotOut**: *T extends object ? T["SnapshotType"] : T extends IStateTreeNode<infer IT> ? IT["SnapshotType"] : T*

*Defined in [src/core/type/type.ts:247](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/type/type.ts#L247)*

The output snapshot representation of a given type.

## Variables

### `Const` DatePrimitive

• **DatePrimitive**: *[IType](interfaces/itype.md)‹number | Date, number, Date›* =  _DatePrimitive

*Defined in [src/types/primitives.ts:215](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/primitives.ts#L215)*

`types.Date` - Creates a type that can only contain a javascript Date value.

Example:
```ts
const LogLine = types.model({
  timestamp: types.Date,
})

LogLine.create({ timestamp: new Date() })
```

___

### `Const` boolean

• **boolean**: *[ISimpleType](interfaces/isimpletype.md)‹boolean›* =  new CoreType<boolean, boolean, boolean>(
    "boolean",
    TypeFlags.Boolean,
    v => typeof v === "boolean"
)

*Defined in [src/types/primitives.ts:169](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/primitives.ts#L169)*

`types.boolean` - Creates a type that can only contain a boolean value.
This type is used for boolean values by default

Example:
```ts
const Thing = types.model({
  isCool: types.boolean,
  isAwesome: false
})
```

___

### `Const` finite

• **finite**: *[ISimpleType](interfaces/isimpletype.md)‹number›* =  new CoreType<number, number, number>(
    "finite",
    TypeFlags.Finite,
    v => isFinite(v)
)

*Defined in [src/types/primitives.ts:150](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/primitives.ts#L150)*

`types.finite` - Creates a type that can only contain an finite value.

Example:
```ts
const Size = types.model({
  width: types.finite,
  height: 10
})
```

___

### `Const` float

• **float**: *[ISimpleType](interfaces/isimpletype.md)‹number›* =  new CoreType<number, number, number>(
    "float",
    TypeFlags.Float,
    v => isFloat(v)
)

*Defined in [src/types/primitives.ts:132](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/primitives.ts#L132)*

`types.float` - Creates a type that can only contain an float value.

Example:
```ts
const Size = types.model({
  width: types.float,
  height: 10
})
```

___

### `Const` identifier

• **identifier**: *[ISimpleType](interfaces/isimpletype.md)‹string›* =  new IdentifierType()

*Defined in [src/types/utility-types/identifier.ts:115](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/identifier.ts#L115)*

`types.identifier` - Identifiers are used to make references, lifecycle events and reconciling works.
Inside a state tree, for each type can exist only one instance for each given identifier.
For example there couldn't be 2 instances of user with id 1. If you need more, consider using references.
Identifier can be used only as type property of a model.
This type accepts as parameter the value type of the identifier field that can be either string or number.

Example:
```ts
 const Todo = types.model("Todo", {
     id: types.identifier,
     title: types.string
 })
```

**`returns`** 

___

### `Const` identifierNumber

• **identifierNumber**: *[ISimpleType](interfaces/isimpletype.md)‹number›* =  new IdentifierNumberType()

*Defined in [src/types/utility-types/identifier.ts:130](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/identifier.ts#L130)*

`types.identifierNumber` - Similar to `types.identifier`. This one will serialize from / to a number when applying snapshots

Example:
```ts
 const Todo = types.model("Todo", {
     id: types.identifierNumber,
     title: types.string
 })
```

**`returns`** 

___

### `Const` integer

• **integer**: *[ISimpleType](interfaces/isimpletype.md)‹number›* =  new CoreType<number, number, number>(
    "integer",
    TypeFlags.Integer,
    v => isInteger(v)
)

*Defined in [src/types/primitives.ts:114](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/primitives.ts#L114)*

`types.integer` - Creates a type that can only contain an integer value.

Example:
```ts
const Size = types.model({
  width: types.integer,
  height: 10
})
```

___

### `Const` nullType

• **nullType**: *[ISimpleType](interfaces/isimpletype.md)‹null›* =  new CoreType<null, null, null>(
    "null",
    TypeFlags.Null,
    v => v === null
)

*Defined in [src/types/primitives.ts:178](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/primitives.ts#L178)*

`types.null` - The type of the value `null`

___

### `Const` number

• **number**: *[ISimpleType](interfaces/isimpletype.md)‹number›* =  new CoreType<number, number, number>(
    "number",
    TypeFlags.Number,
    v => typeof v === "number"
)

*Defined in [src/types/primitives.ts:96](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/primitives.ts#L96)*

`types.number` - Creates a type that can only contain a numeric value.
This type is used for numeric values by default

Example:
```ts
const Vector = types.model({
  x: types.number,
  y: 1.5
})
```

___

### `Const` string

• **string**: *[ISimpleType](interfaces/isimpletype.md)‹string›* =  new CoreType<string, string, string>(
    "string",
    TypeFlags.String,
    v => typeof v === "string"
)

*Defined in [src/types/primitives.ts:77](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/primitives.ts#L77)*

`types.string` - Creates a type that can only contain a string value.
This type is used for string values by default

Example:
```ts
const Person = types.model({
  firstName: types.string,
  lastName: "Doe"
})
```

___

### `Const` undefinedType

• **undefinedType**: *[ISimpleType](interfaces/isimpletype.md)‹undefined›* =  new CoreType<undefined, undefined, undefined>(
    "undefined",
    TypeFlags.Undefined,
    v => v === undefined
)

*Defined in [src/types/primitives.ts:187](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/primitives.ts#L187)*

`types.undefined` - The type of the value `undefined`

## Functions

###  addDisposer

▸ **addDisposer**(`target`: IAnyStateTreeNode, `disposer`: [IDisposer](index.md#idisposer)): *[IDisposer](index.md#idisposer)*

*Defined in [src/core/mst-operations.ts:751](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L751)*

Use this utility to register a function that should be called whenever the
targeted state tree node is destroyed. This is a useful alternative to managing
cleanup methods yourself using the `beforeDestroy` hook.

This methods returns the same disposer that was passed as argument.

Example:
```ts
const Todo = types.model({
  title: types.string
}).actions(self => ({
  afterCreate() {
    const autoSaveDisposer = reaction(
      () => getSnapshot(self),
      snapshot => sendSnapshotToServerSomehow(snapshot)
    )
    // stop sending updates to server if this
    // instance is destroyed
    addDisposer(self, autoSaveDisposer)
  }
}))
```

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |
`disposer` | [IDisposer](index.md#idisposer) |

**Returns:** *[IDisposer](index.md#idisposer)*

The same disposer that was passed as argument

___

###  addMiddleware

▸ **addMiddleware**(`target`: IAnyStateTreeNode, `handler`: [IMiddlewareHandler](index.md#imiddlewarehandler), `includeHooks`: boolean): *[IDisposer](index.md#idisposer)*

*Defined in [src/core/action.ts:174](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/action.ts#L174)*

Middleware can be used to intercept any action is invoked on the subtree where it is attached.
If a tree is protected (by default), this means that any mutation of the tree will pass through your middleware.

For more details, see the [middleware docs](concepts/middleware.md)

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`target` | IAnyStateTreeNode | - | Node to apply the middleware to. |
`handler` | [IMiddlewareHandler](index.md#imiddlewarehandler) | - | - |
`includeHooks` | boolean | true | - |

**Returns:** *[IDisposer](index.md#idisposer)*

A callable function to dispose the middleware.

___

###  applyAction

▸ **applyAction**(`target`: IAnyStateTreeNode, `actions`: [ISerializedActionCall](interfaces/iserializedactioncall.md) | [ISerializedActionCall](interfaces/iserializedactioncall.md)[]): *void*

*Defined in [src/middlewares/on-action.ts:89](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/middlewares/on-action.ts#L89)*

Applies an action or a series of actions in a single MobX transaction.
Does not return any value
Takes an action description as produced by the `onAction` middleware.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | IAnyStateTreeNode | - |
`actions` | [ISerializedActionCall](interfaces/iserializedactioncall.md) &#124; [ISerializedActionCall](interfaces/iserializedactioncall.md)[] |   |

**Returns:** *void*

___

###  applyPatch

▸ **applyPatch**(`target`: IAnyStateTreeNode, `patch`: [IJsonPatch](interfaces/ijsonpatch.md) | ReadonlyArray‹[IJsonPatch](interfaces/ijsonpatch.md)›): *void*

*Defined in [src/core/mst-operations.ts:124](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L124)*

Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied
See [patches](https://github.com/mobxjs/mobx-state-tree#patches) for more details.

Can apply a single past, or an array of patches.

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |
`patch` | [IJsonPatch](interfaces/ijsonpatch.md) &#124; ReadonlyArray‹[IJsonPatch](interfaces/ijsonpatch.md)› |

**Returns:** *void*

___

###  applySnapshot

▸ **applySnapshot**<**C**>(`target`: IStateTreeNode‹[IType](interfaces/itype.md)‹C, any, any››, `snapshot`: C): *void*

*Defined in [src/core/mst-operations.ts:321](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L321)*

Applies a snapshot to a given model instances. Patch and snapshot listeners will be invoked as usual.

**Type parameters:**

▪ **C**

**Parameters:**

Name | Type |
------ | ------ |
`target` | IStateTreeNode‹[IType](interfaces/itype.md)‹C, any, any›› |
`snapshot` | C |

**Returns:** *void*

___

###  array

▸ **array**<**IT**>(`subtype`: IT): *IArrayType‹IT›*

*Defined in [src/types/complex-types/array.ts:348](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/array.ts#L348)*

`types.array` - Creates an index based collection type who's children are all of a uniform declared type.

This type will always produce [observable arrays](https://mobx.js.org/api.html#observablearray)

Example:
```ts
const Todo = types.model({
  task: types.string
})

const TodoStore = types.model({
  todos: types.array(Todo)
})

const s = TodoStore.create({ todos: [] })
unprotect(s) // needed to allow modifying outside of an action
s.todos.push({ task: "Grab coffee" })
console.log(s.todos[0]) // prints: "Grab coffee"
```

**Type parameters:**

▪ **IT**: *[IAnyType](interfaces/ianytype.md)*

**Parameters:**

Name | Type |
------ | ------ |
`subtype` | IT |

**Returns:** *IArrayType‹IT›*

___

###  cast

▸ **cast**<**O**>(`snapshotOrInstance`: O): *O*

*Defined in [src/core/mst-operations.ts:908](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L908)*

Casts a node snapshot or instance type to an instance type so it can be assigned to a type instance.
Note that this is just a cast for the type system, this is, it won't actually convert a snapshot to an instance,
but just fool typescript into thinking so.
Either way, casting when outside an assignation operation won't compile.

Example:
```ts
const ModelA = types.model({
  n: types.number
}).actions(self => ({
  setN(aNumber: number) {
    self.n = aNumber
  }
}))

const ModelB = types.model({
  innerModel: ModelA
}).actions(self => ({
  someAction() {
    // this will allow the compiler to assign a snapshot to the property
    self.innerModel = cast({ a: 5 })
  }
}))
```

**Type parameters:**

▪ **O**: *string | number | boolean | null | undefined*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`snapshotOrInstance` | O | Snapshot or instance |

**Returns:** *O*

The same object cast as an instance

▸ **cast**<**O**>(`snapshotOrInstance`: TypeOfValue<O>["CreationType"] | TypeOfValue<O>["SnapshotType"] | TypeOfValue<O>["Type"]): *O*

*Defined in [src/core/mst-operations.ts:911](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L911)*

Casts a node snapshot or instance type to an instance type so it can be assigned to a type instance.
Note that this is just a cast for the type system, this is, it won't actually convert a snapshot to an instance,
but just fool typescript into thinking so.
Either way, casting when outside an assignation operation won't compile.

Example:
```ts
const ModelA = types.model({
  n: types.number
}).actions(self => ({
  setN(aNumber: number) {
    self.n = aNumber
  }
}))

const ModelB = types.model({
  innerModel: ModelA
}).actions(self => ({
  someAction() {
    // this will allow the compiler to assign a snapshot to the property
    self.innerModel = cast({ a: 5 })
  }
}))
```

**Type parameters:**

▪ **O**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`snapshotOrInstance` | TypeOfValue<O>["CreationType"] &#124; TypeOfValue<O>["SnapshotType"] &#124; TypeOfValue<O>["Type"] | Snapshot or instance |

**Returns:** *O*

The same object cast as an instance

___

###  castFlowReturn

▸ **castFlowReturn**<**T**>(`val`: T): *T*

*Defined in [src/core/flow.ts:34](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/flow.ts#L34)*

**`deprecated`** Not needed since TS3.6.
Used for TypeScript to make flows that return a promise return the actual promise result.

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`val` | T |

**Returns:** *T*

___

###  castToReferenceSnapshot

▸ **castToReferenceSnapshot**<**I**>(`instance`: I): *Extract<I, IAnyStateTreeNode> extends never ? I : ReferenceIdentifier*

*Defined in [src/core/mst-operations.ts:1011](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L1011)*

Casts a node instance type to a reference snapshot type so it can be assigned to a reference snapshot (e.g. to be used inside a create call).
Note that this is just a cast for the type system, this is, it won't actually convert an instance to a reference snapshot,
but just fool typescript into thinking so.

Example:
```ts
const ModelA = types.model({
  id: types.identifier,
  n: types.number
}).actions(self => ({
  setN(aNumber: number) {
    self.n = aNumber
  }
}))

const ModelB = types.model({
  refA: types.reference(ModelA)
})

const a = ModelA.create({ id: 'someId', n: 5 });
// this will allow the compiler to use a model as if it were a reference snapshot
const b = ModelB.create({ refA: castToReferenceSnapshot(a)})
```

**Type parameters:**

▪ **I**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`instance` | I | Instance |

**Returns:** *Extract<I, IAnyStateTreeNode> extends never ? I : ReferenceIdentifier*

The same object cast as a reference snapshot (string or number)

___

###  castToSnapshot

▸ **castToSnapshot**<**I**>(`snapshotOrInstance`: I): *Extract<I, IAnyStateTreeNode> extends never ? I : TypeOfValue<I>["CreationType"]*

*Defined in [src/core/mst-operations.ts:977](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L977)*

Casts a node instance type to a snapshot type so it can be assigned to a type snapshot (e.g. to be used inside a create call).
Note that this is just a cast for the type system, this is, it won't actually convert an instance to a snapshot,
but just fool typescript into thinking so.

Example:
```ts
const ModelA = types.model({
  n: types.number
}).actions(self => ({
  setN(aNumber: number) {
    self.n = aNumber
  }
}))

const ModelB = types.model({
  innerModel: ModelA
})

const a = ModelA.create({ n: 5 });
// this will allow the compiler to use a model as if it were a snapshot
const b = ModelB.create({ innerModel: castToSnapshot(a)})
```

**Type parameters:**

▪ **I**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`snapshotOrInstance` | I | Snapshot or instance |

**Returns:** *Extract<I, IAnyStateTreeNode> extends never ? I : TypeOfValue<I>["CreationType"]*

The same object cast as an input (creation) snapshot

___

###  clone

▸ **clone**<**T**>(`source`: T, `keepEnvironment`: boolean | any): *T*

*Defined in [src/core/mst-operations.ts:666](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L666)*

Returns a deep copy of the given state tree node as new tree.
Shorthand for `snapshot(x) = getType(x).create(getSnapshot(x))`

_Tip: clone will create a literal copy, including the same identifiers. To modify identifiers etc. during cloning, don't use clone but take a snapshot of the tree, modify it, and create new instance_

**Type parameters:**

▪ **T**: *IAnyStateTreeNode*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`source` | T | - | - |
`keepEnvironment` | boolean &#124; any | true | indicates whether the clone should inherit the same environment (`true`, the default), or not have an environment (`false`). If an object is passed in as second argument, that will act as the environment for the cloned tree. |

**Returns:** *T*

___

###  compose

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**>(`name`: string, `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›): *[IModelType](interfaces/imodeltype.md)‹PA & PB, OA & OB, _CustomJoin‹FCA, FCB›, _CustomJoin‹FSA, FSB››*

*Defined in [src/types/complex-types/model.ts:812](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L812)*

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: *ModelProperties*

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: *ModelProperties*

▪ **OB**

▪ **FCB**

▪ **FSB**

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`A` | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
`B` | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹PA & PB, OA & OB, _CustomJoin‹FCA, FCB›, _CustomJoin‹FSA, FSB››*

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›): *[IModelType](interfaces/imodeltype.md)‹PA & PB, OA & OB, _CustomJoin‹FCA, FCB›, _CustomJoin‹FSA, FSB››*

*Defined in [src/types/complex-types/model.ts:814](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L814)*

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: *ModelProperties*

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: *ModelProperties*

▪ **OB**

▪ **FCB**

▪ **FSB**

**Parameters:**

Name | Type |
------ | ------ |
`A` | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
`B` | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹PA & PB, OA & OB, _CustomJoin‹FCA, FCB›, _CustomJoin‹FSA, FSB››*

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**>(`name`: string, `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›): *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC, OA & OB & OC, _CustomJoin‹FCA, _CustomJoin‹FCB, FCC››, _CustomJoin‹FSA, _CustomJoin‹FSB, FSC›››*

*Defined in [src/types/complex-types/model.ts:816](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L816)*

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: *ModelProperties*

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: *ModelProperties*

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: *ModelProperties*

▪ **OC**

▪ **FCC**

▪ **FSC**

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`A` | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
`B` | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
`C` | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC, OA & OB & OC, _CustomJoin‹FCA, _CustomJoin‹FCB, FCC››, _CustomJoin‹FSA, _CustomJoin‹FSB, FSC›››*

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›): *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC, OA & OB & OC, _CustomJoin‹FCA, _CustomJoin‹FCB, FCC››, _CustomJoin‹FSA, _CustomJoin‹FSB, FSC›››*

*Defined in [src/types/complex-types/model.ts:818](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L818)*

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: *ModelProperties*

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: *ModelProperties*

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: *ModelProperties*

▪ **OC**

▪ **FCC**

▪ **FSC**

**Parameters:**

Name | Type |
------ | ------ |
`A` | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
`B` | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
`C` | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC, OA & OB & OC, _CustomJoin‹FCA, _CustomJoin‹FCB, FCC››, _CustomJoin‹FSA, _CustomJoin‹FSB, FSC›››*

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**>(`name`: string, `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›): *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD, OA & OB & OC & OD, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, FCD›››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, FSD››››*

*Defined in [src/types/complex-types/model.ts:820](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L820)*

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: *ModelProperties*

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: *ModelProperties*

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: *ModelProperties*

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: *ModelProperties*

▪ **OD**

▪ **FCD**

▪ **FSD**

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`A` | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
`B` | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
`C` | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
`D` | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD, OA & OB & OC & OD, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, FCD›››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, FSD››››*

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›): *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD, OA & OB & OC & OD, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, FCD›››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, FSD››››*

*Defined in [src/types/complex-types/model.ts:822](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L822)*

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: *ModelProperties*

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: *ModelProperties*

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: *ModelProperties*

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: *ModelProperties*

▪ **OD**

▪ **FCD**

▪ **FSD**

**Parameters:**

Name | Type |
------ | ------ |
`A` | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
`B` | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
`C` | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
`D` | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD, OA & OB & OC & OD, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, FCD›››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, FSD››››*

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**>(`name`: string, `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›): *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE, OA & OB & OC & OD & OE, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, FCE››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, FSE›››››*

*Defined in [src/types/complex-types/model.ts:824](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L824)*

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: *ModelProperties*

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: *ModelProperties*

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: *ModelProperties*

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: *ModelProperties*

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: *ModelProperties*

▪ **OE**

▪ **FCE**

▪ **FSE**

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`A` | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
`B` | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
`C` | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
`D` | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
`E` | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE, OA & OB & OC & OD & OE, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, FCE››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, FSE›››››*

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›): *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE, OA & OB & OC & OD & OE, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, FCE››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, FSE›››››*

*Defined in [src/types/complex-types/model.ts:826](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L826)*

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: *ModelProperties*

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: *ModelProperties*

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: *ModelProperties*

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: *ModelProperties*

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: *ModelProperties*

▪ **OE**

▪ **FCE**

▪ **FSE**

**Parameters:**

Name | Type |
------ | ------ |
`A` | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
`B` | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
`C` | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
`D` | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
`E` | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE, OA & OB & OC & OD & OE, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, FCE››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, FSE›››››*

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**>(`name`: string, `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›): *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF, OA & OB & OC & OD & OE & OF, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, FCF›››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, FSF››››››*

*Defined in [src/types/complex-types/model.ts:830](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L830)*

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: *ModelProperties*

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: *ModelProperties*

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: *ModelProperties*

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: *ModelProperties*

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: *ModelProperties*

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: *ModelProperties*

▪ **OF**

▪ **FCF**

▪ **FSF**

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`A` | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
`B` | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
`C` | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
`D` | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
`E` | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
`F` | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF, OA & OB & OC & OD & OE & OF, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, FCF›››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, FSF››››››*

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›): *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF, OA & OB & OC & OD & OE & OF, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, FCF›››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, FSF››››››*

*Defined in [src/types/complex-types/model.ts:833](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L833)*

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: *ModelProperties*

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: *ModelProperties*

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: *ModelProperties*

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: *ModelProperties*

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: *ModelProperties*

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: *ModelProperties*

▪ **OF**

▪ **FCF**

▪ **FSF**

**Parameters:**

Name | Type |
------ | ------ |
`A` | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
`B` | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
`C` | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
`D` | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
`E` | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
`F` | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF, OA & OB & OC & OD & OE & OF, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, FCF›››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, FSF››››››*

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**>(`name`: string, `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›): *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG, OA & OB & OC & OD & OE & OF & OG, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, FCG››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, FSG›››››››*

*Defined in [src/types/complex-types/model.ts:836](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L836)*

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: *ModelProperties*

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: *ModelProperties*

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: *ModelProperties*

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: *ModelProperties*

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: *ModelProperties*

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: *ModelProperties*

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: *ModelProperties*

▪ **OG**

▪ **FCG**

▪ **FSG**

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`A` | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
`B` | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
`C` | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
`D` | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
`E` | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
`F` | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
`G` | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG, OA & OB & OC & OD & OE & OF & OG, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, FCG››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, FSG›››››››*

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›): *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG, OA & OB & OC & OD & OE & OF & OG, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, FCG››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, FSG›››››››*

*Defined in [src/types/complex-types/model.ts:839](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L839)*

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: *ModelProperties*

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: *ModelProperties*

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: *ModelProperties*

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: *ModelProperties*

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: *ModelProperties*

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: *ModelProperties*

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: *ModelProperties*

▪ **OG**

▪ **FCG**

▪ **FSG**

**Parameters:**

Name | Type |
------ | ------ |
`A` | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
`B` | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
`C` | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
`D` | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
`E` | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
`F` | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
`G` | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG, OA & OB & OC & OD & OE & OF & OG, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, FCG››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, FSG›››››››*

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**>(`name`: string, `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›, `H`: [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH›): *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG & PH, OA & OB & OC & OD & OE & OF & OG & OH, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, _CustomJoin‹FCG, FCH›››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, _CustomJoin‹FSG, FSH››››››››*

*Defined in [src/types/complex-types/model.ts:842](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L842)*

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: *ModelProperties*

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: *ModelProperties*

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: *ModelProperties*

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: *ModelProperties*

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: *ModelProperties*

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: *ModelProperties*

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: *ModelProperties*

▪ **OG**

▪ **FCG**

▪ **FSG**

▪ **PH**: *ModelProperties*

▪ **OH**

▪ **FCH**

▪ **FSH**

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`A` | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
`B` | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
`C` | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
`D` | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
`E` | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
`F` | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
`G` | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |
`H` | [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH› |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG & PH, OA & OB & OC & OD & OE & OF & OG & OH, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, _CustomJoin‹FCG, FCH›››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, _CustomJoin‹FSG, FSH››››››››*

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›, `H`: [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH›): *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG & PH, OA & OB & OC & OD & OE & OF & OG & OH, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, _CustomJoin‹FCG, FCH›››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, _CustomJoin‹FSG, FSH››››››››*

*Defined in [src/types/complex-types/model.ts:845](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L845)*

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: *ModelProperties*

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: *ModelProperties*

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: *ModelProperties*

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: *ModelProperties*

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: *ModelProperties*

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: *ModelProperties*

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: *ModelProperties*

▪ **OG**

▪ **FCG**

▪ **FSG**

▪ **PH**: *ModelProperties*

▪ **OH**

▪ **FCH**

▪ **FSH**

**Parameters:**

Name | Type |
------ | ------ |
`A` | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
`B` | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
`C` | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
`D` | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
`E` | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
`F` | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
`G` | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |
`H` | [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH› |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG & PH, OA & OB & OC & OD & OE & OF & OG & OH, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, _CustomJoin‹FCG, FCH›››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, _CustomJoin‹FSG, FSH››››››››*

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**, **PI**, **OI**, **FCI**, **FSI**>(`name`: string, `A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›, `H`: [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH›, `I`: [IModelType](interfaces/imodeltype.md)‹PI, OI, FCI, FSI›): *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG & PH & PI, OA & OB & OC & OD & OE & OF & OG & OH & OI, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, _CustomJoin‹FCG, _CustomJoin‹FCH, FCI››››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, _CustomJoin‹FSG, _CustomJoin‹FSH, FSI›››››››››*

*Defined in [src/types/complex-types/model.ts:848](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L848)*

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: *ModelProperties*

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: *ModelProperties*

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: *ModelProperties*

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: *ModelProperties*

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: *ModelProperties*

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: *ModelProperties*

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: *ModelProperties*

▪ **OG**

▪ **FCG**

▪ **FSG**

▪ **PH**: *ModelProperties*

▪ **OH**

▪ **FCH**

▪ **FSH**

▪ **PI**: *ModelProperties*

▪ **OI**

▪ **FCI**

▪ **FSI**

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`A` | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
`B` | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
`C` | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
`D` | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
`E` | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
`F` | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
`G` | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |
`H` | [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH› |
`I` | [IModelType](interfaces/imodeltype.md)‹PI, OI, FCI, FSI› |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG & PH & PI, OA & OB & OC & OD & OE & OF & OG & OH & OI, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, _CustomJoin‹FCG, _CustomJoin‹FCH, FCI››››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, _CustomJoin‹FSG, _CustomJoin‹FSH, FSI›››››››››*

▸ **compose**<**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**, **PI**, **OI**, **FCI**, **FSI**>(`A`: [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA›, `B`: [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB›, `C`: [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC›, `D`: [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD›, `E`: [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE›, `F`: [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF›, `G`: [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG›, `H`: [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH›, `I`: [IModelType](interfaces/imodeltype.md)‹PI, OI, FCI, FSI›): *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG & PH & PI, OA & OB & OC & OD & OE & OF & OG & OH & OI, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, _CustomJoin‹FCG, _CustomJoin‹FCH, FCI››››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, _CustomJoin‹FSG, _CustomJoin‹FSH, FSI›››››››››*

*Defined in [src/types/complex-types/model.ts:851](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L851)*

`types.compose` - Composes a new model from one or more existing model types.
This method can be invoked in two forms:
Given 2 or more model types, the types are composed into a new Type.
Given first parameter as a string and 2 or more model types,
the types are composed into a new Type with the given name

**Type parameters:**

▪ **PA**: *ModelProperties*

▪ **OA**

▪ **FCA**

▪ **FSA**

▪ **PB**: *ModelProperties*

▪ **OB**

▪ **FCB**

▪ **FSB**

▪ **PC**: *ModelProperties*

▪ **OC**

▪ **FCC**

▪ **FSC**

▪ **PD**: *ModelProperties*

▪ **OD**

▪ **FCD**

▪ **FSD**

▪ **PE**: *ModelProperties*

▪ **OE**

▪ **FCE**

▪ **FSE**

▪ **PF**: *ModelProperties*

▪ **OF**

▪ **FCF**

▪ **FSF**

▪ **PG**: *ModelProperties*

▪ **OG**

▪ **FCG**

▪ **FSG**

▪ **PH**: *ModelProperties*

▪ **OH**

▪ **FCH**

▪ **FSH**

▪ **PI**: *ModelProperties*

▪ **OI**

▪ **FCI**

▪ **FSI**

**Parameters:**

Name | Type |
------ | ------ |
`A` | [IModelType](interfaces/imodeltype.md)‹PA, OA, FCA, FSA› |
`B` | [IModelType](interfaces/imodeltype.md)‹PB, OB, FCB, FSB› |
`C` | [IModelType](interfaces/imodeltype.md)‹PC, OC, FCC, FSC› |
`D` | [IModelType](interfaces/imodeltype.md)‹PD, OD, FCD, FSD› |
`E` | [IModelType](interfaces/imodeltype.md)‹PE, OE, FCE, FSE› |
`F` | [IModelType](interfaces/imodeltype.md)‹PF, OF, FCF, FSF› |
`G` | [IModelType](interfaces/imodeltype.md)‹PG, OG, FCG, FSG› |
`H` | [IModelType](interfaces/imodeltype.md)‹PH, OH, FCH, FSH› |
`I` | [IModelType](interfaces/imodeltype.md)‹PI, OI, FCI, FSI› |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹PA & PB & PC & PD & PE & PF & PG & PH & PI, OA & OB & OC & OD & OE & OF & OG & OH & OI, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, _CustomJoin‹FCG, _CustomJoin‹FCH, FCI››››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, _CustomJoin‹FSG, _CustomJoin‹FSH, FSI›››››››››*

___

###  createActionTrackingMiddleware

▸ **createActionTrackingMiddleware**<**T**>(`hooks`: [IActionTrackingMiddlewareHooks](interfaces/iactiontrackingmiddlewarehooks.md)‹T›): *[IMiddlewareHandler](index.md#imiddlewarehandler)*

*Defined in [src/middlewares/create-action-tracking-middleware.ts:28](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/middlewares/create-action-tracking-middleware.ts#L28)*

Note: Consider migrating to `createActionTrackingMiddleware2`, it is easier to use.

Convenience utility to create action based middleware that supports async processes more easily.
All hooks are called for both synchronous and asynchronous actions. Except that either `onSuccess` or `onFail` is called

The create middleware tracks the process of an action (assuming it passes the `filter`).
`onResume` can return any value, which will be passed as second argument to any other hook. This makes it possible to keep state during a process.

See the `atomic` middleware for an example

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`hooks` | [IActionTrackingMiddlewareHooks](interfaces/iactiontrackingmiddlewarehooks.md)‹T› |

**Returns:** *[IMiddlewareHandler](index.md#imiddlewarehandler)*

___

###  createActionTrackingMiddleware2

▸ **createActionTrackingMiddleware2**<**TEnv**>(`middlewareHooks`: [IActionTrackingMiddleware2Hooks](interfaces/iactiontrackingmiddleware2hooks.md)‹TEnv›): *[IMiddlewareHandler](index.md#imiddlewarehandler)*

*Defined in [src/middlewares/createActionTrackingMiddleware2.ts:72](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/middlewares/createActionTrackingMiddleware2.ts#L72)*

Convenience utility to create action based middleware that supports async processes more easily.
The flow is like this:
- for each action: if filter passes -> `onStart` -> (inner actions recursively) -> `onFinish`

Example: if we had an action `a` that called inside an action `b1`, then `b2` the flow would be:
- `filter(a)`
- `onStart(a)`
  - `filter(b1)`
  - `onStart(b1)`
  - `onFinish(b1)`
  - `filter(b2)`
  - `onStart(b2)`
  - `onFinish(b2)`
- `onFinish(a)`

The flow is the same no matter if the actions are sync or async.

See the `atomic` middleware for an example

**Type parameters:**

▪ **TEnv**

**Parameters:**

Name | Type |
------ | ------ |
`middlewareHooks` | [IActionTrackingMiddleware2Hooks](interfaces/iactiontrackingmiddleware2hooks.md)‹TEnv› |

**Returns:** *[IMiddlewareHandler](index.md#imiddlewarehandler)*

___

###  custom

▸ **custom**<**S**, **T**>(`options`: [CustomTypeOptions](interfaces/customtypeoptions.md)‹S, T›): *[IType](interfaces/itype.md)‹S | T, S, T›*

*Defined in [src/types/utility-types/custom.ts:74](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/custom.ts#L74)*

`types.custom` - Creates a custom type. Custom types can be used for arbitrary immutable values, that have a serializable representation. For example, to create your own Date representation, Decimal type etc.

The signature of the options is:
```ts
export interface CustomTypeOptions<S, T> {
    // Friendly name
    name: string
    // given a serialized value and environment, how to turn it into the target type
    fromSnapshot(snapshot: S, env: any): T
    // return the serialization of the current value
    toSnapshot(value: T): S
    // if true, this is a converted value, if false, it's a snapshot
    isTargetType(value: T | S): value is T
    // a non empty string is assumed to be a validation error
    getValidationMessage?(snapshot: S): string
}
```

Example:
```ts
const DecimalPrimitive = types.custom<string, Decimal>({
    name: "Decimal",
    fromSnapshot(value: string) {
        return new Decimal(value)
    },
    toSnapshot(value: Decimal) {
        return value.toString()
    },
    isTargetType(value: string | Decimal): boolean {
        return value instanceof Decimal
    },
    getValidationMessage(value: string): string {
        if (/^-?\d+\.\d+$/.test(value)) return "" // OK
        return `'${value}' doesn't look like a valid decimal number`
    }
})

const Wallet = types.model({
    balance: DecimalPrimitive
})
```

**Type parameters:**

▪ **S**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`options` | [CustomTypeOptions](interfaces/customtypeoptions.md)‹S, T› |

**Returns:** *[IType](interfaces/itype.md)‹S | T, S, T›*

___

###  decorate

▸ **decorate**<**T**>(`handler`: [IMiddlewareHandler](index.md#imiddlewarehandler), `fn`: T, `includeHooks`: boolean): *T*

*Defined in [src/core/action.ts:213](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/action.ts#L213)*

Binds middleware to a specific action.

Example:
```ts
type.actions(self => {
  function takeA____() {
      self.toilet.donate()
      self.wipe()
      self.wipe()
      self.toilet.flush()
  }
  return {
    takeA____: decorate(atomic, takeA____)
  }
})
```

**Type parameters:**

▪ **T**: *Function*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`handler` | [IMiddlewareHandler](index.md#imiddlewarehandler) | - |
`fn` | T | - |
`includeHooks` | boolean | true |

**Returns:** *T*

The original function

___

###  destroy

▸ **destroy**(`target`: IAnyStateTreeNode): *void*

*Defined in [src/core/mst-operations.ts:698](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L698)*

Removes a model element from the state tree, and mark it as end-of-life; the element should not be used anymore

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *void*

___

###  detach

▸ **detach**<**T**>(`target`: T): *T*

*Defined in [src/core/mst-operations.ts:687](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L687)*

Removes a model element from the state tree, and let it live on as a new state tree

**Type parameters:**

▪ **T**: *IAnyStateTreeNode*

**Parameters:**

Name | Type |
------ | ------ |
`target` | T |

**Returns:** *T*

___

###  enumeration

▸ **enumeration**<**T**>(`options`: keyof T[]): *[ISimpleType](interfaces/isimpletype.md)‹UnionStringArray‹T[]››*

*Defined in [src/types/utility-types/enumeration.ts:11](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/enumeration.ts#L11)*

`types.enumeration` - Can be used to create an string based enumeration.
(note: this methods is just sugar for a union of string literals)

Example:
```ts
const TrafficLight = types.model({
  color: types.enumeration("Color", ["Red", "Orange", "Green"])
})
```

**Type parameters:**

▪ **T**: *string*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`options` | keyof T[] | possible values this enumeration can have |

**Returns:** *[ISimpleType](interfaces/isimpletype.md)‹UnionStringArray‹T[]››*

▸ **enumeration**<**T**>(`name`: string, `options`: keyof T[]): *[ISimpleType](interfaces/isimpletype.md)‹UnionStringArray‹T[]››*

*Defined in [src/types/utility-types/enumeration.ts:14](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/enumeration.ts#L14)*

`types.enumeration` - Can be used to create an string based enumeration.
(note: this methods is just sugar for a union of string literals)

Example:
```ts
const TrafficLight = types.model({
  color: types.enumeration("Color", ["Red", "Orange", "Green"])
})
```

**Type parameters:**

▪ **T**: *string*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | descriptive name of the enumeration (optional) |
`options` | keyof T[] | possible values this enumeration can have |

**Returns:** *[ISimpleType](interfaces/isimpletype.md)‹UnionStringArray‹T[]››*

___

###  escapeJsonPath

▸ **escapeJsonPath**(`path`: string): *string*

*Defined in [src/core/json-patch.ts:78](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/json-patch.ts#L78)*

Escape slashes and backslashes.

http://tools.ietf.org/html/rfc6901

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *string*

___

###  flow

▸ **flow**<**R**, **Args**>(`generator`: function): *function*

*Defined in [src/core/flow.ts:21](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/flow.ts#L21)*

See [asynchronous actions](concepts/async-actions.md).

**Type parameters:**

▪ **R**

▪ **Args**: *any[]*

**Parameters:**

▪ **generator**: *function*

▸ (...`args`: Args): *Generator‹PromiseLike‹any›, R, any›*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | Args |

**Returns:** *function*

The flow as a promise.

▸ (...`args`: Args): *Promise‹FlowReturn‹R››*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | Args |

___

###  frozen

▸ **frozen**<**C**>(`subType`: [IType](interfaces/itype.md)‹C, any, any›): *[IType](interfaces/itype.md)‹C, C, C›*

*Defined in [src/types/utility-types/frozen.ts:59](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/frozen.ts#L59)*

`types.frozen` - Frozen can be used to store any value that is serializable in itself (that is valid JSON).
Frozen values need to be immutable or treated as if immutable. They need be serializable as well.
Values stored in frozen will snapshotted as-is by MST, and internal changes will not be tracked.

This is useful to store complex, but immutable values like vectors etc. It can form a powerful bridge to parts of your application that should be immutable, or that assume data to be immutable.

Note: if you want to store free-form state that is mutable, or not serializeable, consider using volatile state instead.

Frozen properties can be defined in three different ways
1. `types.frozen(SubType)` - provide a valid MST type and frozen will check if the provided data conforms the snapshot for that type
2. `types.frozen({ someDefaultValue: true})` - provide a primitive value, object or array, and MST will infer the type from that object, and also make it the default value for the field
3. `types.frozen<TypeScriptType>()` - provide a typescript type, to help in strongly typing the field (design time only)

Example:
```ts
const GameCharacter = types.model({
  name: string,
  location: types.frozen({ x: 0, y: 0})
})

const hero = GameCharacter.create({
  name: "Mario",
  location: { x: 7, y: 4 }
})

hero.location = { x: 10, y: 2 } // OK
hero.location.x = 7 // Not ok!
```

```ts
type Point = { x: number, y: number }
   const Mouse = types.model({
        loc: types.frozen<Point>()
   })
```

**Type parameters:**

▪ **C**

**Parameters:**

Name | Type |
------ | ------ |
`subType` | [IType](interfaces/itype.md)‹C, any, any› |

**Returns:** *[IType](interfaces/itype.md)‹C, C, C›*

▸ **frozen**<**T**>(`defaultValue`: T): *[IType](interfaces/itype.md)‹T | undefined | null, T, T›*

*Defined in [src/types/utility-types/frozen.ts:60](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/frozen.ts#L60)*

`types.frozen` - Frozen can be used to store any value that is serializable in itself (that is valid JSON).
Frozen values need to be immutable or treated as if immutable. They need be serializable as well.
Values stored in frozen will snapshotted as-is by MST, and internal changes will not be tracked.

This is useful to store complex, but immutable values like vectors etc. It can form a powerful bridge to parts of your application that should be immutable, or that assume data to be immutable.

Note: if you want to store free-form state that is mutable, or not serializeable, consider using volatile state instead.

Frozen properties can be defined in three different ways
1. `types.frozen(SubType)` - provide a valid MST type and frozen will check if the provided data conforms the snapshot for that type
2. `types.frozen({ someDefaultValue: true})` - provide a primitive value, object or array, and MST will infer the type from that object, and also make it the default value for the field
3. `types.frozen<TypeScriptType>()` - provide a typescript type, to help in strongly typing the field (design time only)

Example:
```ts
const GameCharacter = types.model({
  name: string,
  location: types.frozen({ x: 0, y: 0})
})

const hero = GameCharacter.create({
  name: "Mario",
  location: { x: 7, y: 4 }
})

hero.location = { x: 10, y: 2 } // OK
hero.location.x = 7 // Not ok!
```

```ts
type Point = { x: number, y: number }
   const Mouse = types.model({
        loc: types.frozen<Point>()
   })
```

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`defaultValue` | T |

**Returns:** *[IType](interfaces/itype.md)‹T | undefined | null, T, T›*

▸ **frozen**<**T**>(): *[IType](interfaces/itype.md)‹T, T, T›*

*Defined in [src/types/utility-types/frozen.ts:61](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/frozen.ts#L61)*

`types.frozen` - Frozen can be used to store any value that is serializable in itself (that is valid JSON).
Frozen values need to be immutable or treated as if immutable. They need be serializable as well.
Values stored in frozen will snapshotted as-is by MST, and internal changes will not be tracked.

This is useful to store complex, but immutable values like vectors etc. It can form a powerful bridge to parts of your application that should be immutable, or that assume data to be immutable.

Note: if you want to store free-form state that is mutable, or not serializeable, consider using volatile state instead.

Frozen properties can be defined in three different ways
1. `types.frozen(SubType)` - provide a valid MST type and frozen will check if the provided data conforms the snapshot for that type
2. `types.frozen({ someDefaultValue: true})` - provide a primitive value, object or array, and MST will infer the type from that object, and also make it the default value for the field
3. `types.frozen<TypeScriptType>()` - provide a typescript type, to help in strongly typing the field (design time only)

Example:
```ts
const GameCharacter = types.model({
  name: string,
  location: types.frozen({ x: 0, y: 0})
})

const hero = GameCharacter.create({
  name: "Mario",
  location: { x: 7, y: 4 }
})

hero.location = { x: 10, y: 2 } // OK
hero.location.x = 7 // Not ok!
```

```ts
type Point = { x: number, y: number }
   const Mouse = types.model({
        loc: types.frozen<Point>()
   })
```

**Type parameters:**

▪ **T**

**Returns:** *[IType](interfaces/itype.md)‹T, T, T›*

___

###  getChildType

▸ **getChildType**(`object`: IAnyStateTreeNode, `propertyName?`: undefined | string): *[IAnyType](interfaces/ianytype.md)*

*Defined in [src/core/mst-operations.ts:68](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L68)*

Returns the _declared_ type of the given sub property of an object, array or map.
In the case of arrays and maps the property name is optional and will be ignored.

Example:
```ts
const Box = types.model({ x: 0, y: 0 })
const box = Box.create()

console.log(getChildType(box, "x").name) // 'number'
```

**Parameters:**

Name | Type |
------ | ------ |
`object` | IAnyStateTreeNode |
`propertyName?` | undefined &#124; string |

**Returns:** *[IAnyType](interfaces/ianytype.md)*

___

###  getEnv

▸ **getEnv**<**T**>(`target`: IAnyStateTreeNode): *T*

*Defined in [src/core/mst-operations.ts:773](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L773)*

Returns the environment of the current state tree, or throws. For more info on environments,
see [Dependency injection](https://github.com/mobxjs/mobx-state-tree#dependency-injection)

Please note that in child nodes access to the root is only possible
once the `afterAttach` hook has fired

Returns an empty environment if the tree wasn't initialized with an environment

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *T*

___

###  getIdentifier

▸ **getIdentifier**(`target`: IAnyStateTreeNode): *string | null*

*Defined in [src/core/mst-operations.ts:549](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L549)*

Returns the identifier of the target node.
This is the *string normalized* identifier, which might not match the type of the identifier attribute

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *string | null*

___

###  getLivelinessChecking

▸ **getLivelinessChecking**(): *[LivelinessMode](index.md#livelinessmode)*

*Defined in [src/core/node/livelinessChecking.ts:27](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/node/livelinessChecking.ts#L27)*

Returns the current liveliness checking mode.

**Returns:** *[LivelinessMode](index.md#livelinessmode)*

`"warn"`, `"error"` or `"ignore"`

___

###  getMembers

▸ **getMembers**(`target`: IAnyStateTreeNode): *[IModelReflectionData](interfaces/imodelreflectiondata.md)*

*Defined in [src/core/mst-operations.ts:874](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L874)*

Returns a reflection of the model node, including name, properties, views, volatile state,
and actions. `flowActions` is also provided as a separate array of names for any action that
came from a flow generator as well.

In the case where a model has two actions: `doSomething` and `doSomethingWithFlow`, where
`doSomethingWithFlow` is a flow generator, the `actions` array will contain both actions,
i.e. ["doSomething", "doSomethingWithFlow"], and the `flowActions` array will contain only
the flow action, i.e. ["doSomethingWithFlow"].

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *[IModelReflectionData](interfaces/imodelreflectiondata.md)*

___

###  getNodeId

▸ **getNodeId**(`target`: IAnyStateTreeNode): *number*

*Defined in [src/core/mst-operations.ts:1026](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L1026)*

Returns the unique node id (not to be confused with the instance identifier) for a
given instance.
This id is a number that is unique for each instance.

**`export`** 

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *number*

___

###  getParent

▸ **getParent**<**IT**>(`target`: IAnyStateTreeNode, `depth`: number): *TypeOrStateTreeNodeToStateTreeNode‹IT›*

*Defined in [src/core/mst-operations.ts:382](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L382)*

Returns the immediate parent of this object, or throws.

Note that the immediate parent can be either an object, map or array, and
doesn't necessarily refer to the parent model.

Please note that in child nodes access to the root is only possible
once the `afterAttach` hook has fired.

**Type parameters:**

▪ **IT**: *IAnyStateTreeNode | [IAnyComplexType](interfaces/ianycomplextype.md)*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`target` | IAnyStateTreeNode | - | - |
`depth` | number | 1 | How far should we look upward? 1 by default. |

**Returns:** *TypeOrStateTreeNodeToStateTreeNode‹IT›*

___

###  getParentOfType

▸ **getParentOfType**<**IT**>(`target`: IAnyStateTreeNode, `type`: IT): *IT["Type"]*

*Defined in [src/core/mst-operations.ts:426](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L426)*

Returns the target's parent of a given type, or throws.

**Type parameters:**

▪ **IT**: *[IAnyComplexType](interfaces/ianycomplextype.md)*

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |
`type` | IT |

**Returns:** *IT["Type"]*

___

###  getPath

▸ **getPath**(`target`: IAnyStateTreeNode): *string*

*Defined in [src/core/mst-operations.ts:466](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L466)*

Returns the path of the given object in the model tree

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *string*

___

###  getPathParts

▸ **getPathParts**(`target`: IAnyStateTreeNode): *string[]*

*Defined in [src/core/mst-operations.ts:479](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L479)*

Returns the path of the given object as unescaped string array.

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *string[]*

___

###  getPropertyMembers

▸ **getPropertyMembers**(`typeOrNode`: [IAnyModelType](interfaces/ianymodeltype.md) | IAnyStateTreeNode): *[IModelReflectionPropertiesData](interfaces/imodelreflectionpropertiesdata.md)*

*Defined in [src/core/mst-operations.ts:835](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L835)*

Returns a reflection of the model type properties and name for either a model type or model node.

**Parameters:**

Name | Type |
------ | ------ |
`typeOrNode` | [IAnyModelType](interfaces/ianymodeltype.md) &#124; IAnyStateTreeNode |

**Returns:** *[IModelReflectionPropertiesData](interfaces/imodelreflectionpropertiesdata.md)*

___

###  getRelativePath

▸ **getRelativePath**(`base`: IAnyStateTreeNode, `target`: IAnyStateTreeNode): *string*

*Defined in [src/core/mst-operations.ts:648](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L648)*

Given two state tree nodes that are part of the same tree,
returns the shortest jsonpath needed to navigate from the one to the other

**Parameters:**

Name | Type |
------ | ------ |
`base` | IAnyStateTreeNode |
`target` | IAnyStateTreeNode |

**Returns:** *string*

___

###  getRoot

▸ **getRoot**<**IT**>(`target`: IAnyStateTreeNode): *TypeOrStateTreeNodeToStateTreeNode‹IT›*

*Defined in [src/core/mst-operations.ts:451](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L451)*

Given an object in a model tree, returns the root object of that tree.

Please note that in child nodes access to the root is only possible
once the `afterAttach` hook has fired.

**Type parameters:**

▪ **IT**: *[IAnyComplexType](interfaces/ianycomplextype.md) | IAnyStateTreeNode*

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *TypeOrStateTreeNodeToStateTreeNode‹IT›*

___

###  getRunningActionContext

▸ **getRunningActionContext**(): *[IActionContext](interfaces/iactioncontext.md) | undefined*

*Defined in [src/core/actionContext.ts:26](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/actionContext.ts#L26)*

Returns the currently executing MST action context, or undefined if none.

**Returns:** *[IActionContext](interfaces/iactioncontext.md) | undefined*

___

###  getSnapshot

▸ **getSnapshot**<**S**>(`target`: IStateTreeNode‹[IType](interfaces/itype.md)‹any, S, any››, `applyPostProcess`: boolean): *S*

*Defined in [src/core/mst-operations.ts:336](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L336)*

Calculates a snapshot from the given model instance. The snapshot will always reflect the latest state but use
structural sharing where possible. Doesn't require MobX transactions to be completed.

**Type parameters:**

▪ **S**

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`target` | IStateTreeNode‹[IType](interfaces/itype.md)‹any, S, any›› | - | - |
`applyPostProcess` | boolean | true | If true (the default) then postProcessSnapshot gets applied. |

**Returns:** *S*

___

###  getType

▸ **getType**(`object`: IAnyStateTreeNode): *[IAnyComplexType](interfaces/ianycomplextype.md)*

*Defined in [src/core/mst-operations.ts:46](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L46)*

Returns the _actual_ type of the given tree node. (Or throws)

**Parameters:**

Name | Type |
------ | ------ |
`object` | IAnyStateTreeNode |

**Returns:** *[IAnyComplexType](interfaces/ianycomplextype.md)*

___

###  hasEnv

▸ **hasEnv**(`target`: IAnyStateTreeNode): *boolean*

*Defined in [src/core/mst-operations.ts:790](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L790)*

Returns whether the current state tree has environment or not.

**`export`** 

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *boolean*

___

###  hasParent

▸ **hasParent**(`target`: IAnyStateTreeNode, `depth`: number): *boolean*

*Defined in [src/core/mst-operations.ts:356](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L356)*

Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`target` | IAnyStateTreeNode | - | - |
`depth` | number | 1 | How far should we look upward? 1 by default. |

**Returns:** *boolean*

___

###  hasParentOfType

▸ **hasParentOfType**(`target`: IAnyStateTreeNode, `type`: [IAnyComplexType](interfaces/ianycomplextype.md)): *boolean*

*Defined in [src/core/mst-operations.ts:406](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L406)*

Given a model instance, returns `true` if the object has a parent of given type, that is, is part of another object, map or array

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |
`type` | [IAnyComplexType](interfaces/ianycomplextype.md) |

**Returns:** *boolean*

___

###  isActionContextChildOf

▸ **isActionContextChildOf**(`actionContext`: [IActionContext](interfaces/iactioncontext.md), `parent`: number | [IActionContext](interfaces/iactioncontext.md) | [IMiddlewareEvent](interfaces/imiddlewareevent.md)): *boolean*

*Defined in [src/core/actionContext.ts:56](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/actionContext.ts#L56)*

Returns if the given action context is a parent of this action context.

**Parameters:**

Name | Type |
------ | ------ |
`actionContext` | [IActionContext](interfaces/iactioncontext.md) |
`parent` | number &#124; [IActionContext](interfaces/iactioncontext.md) &#124; [IMiddlewareEvent](interfaces/imiddlewareevent.md) |

**Returns:** *boolean*

___

###  isActionContextThisOrChildOf

▸ **isActionContextThisOrChildOf**(`actionContext`: [IActionContext](interfaces/iactioncontext.md), `parentOrThis`: number | [IActionContext](interfaces/iactioncontext.md) | [IMiddlewareEvent](interfaces/imiddlewareevent.md)): *boolean*

*Defined in [src/core/actionContext.ts:66](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/actionContext.ts#L66)*

Returns if the given action context is this or a parent of this action context.

**Parameters:**

Name | Type |
------ | ------ |
`actionContext` | [IActionContext](interfaces/iactioncontext.md) |
`parentOrThis` | number &#124; [IActionContext](interfaces/iactioncontext.md) &#124; [IMiddlewareEvent](interfaces/imiddlewareevent.md) |

**Returns:** *boolean*

___

###  isAlive

▸ **isAlive**(`target`: IAnyStateTreeNode): *boolean*

*Defined in [src/core/mst-operations.ts:716](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L716)*

Returns true if the given state tree node is not killed yet.
This means that the node is still a part of a tree, and that `destroy`
has not been called. If a node is not alive anymore, the only thing one can do with it
is requesting it's last path and snapshot

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *boolean*

___

###  isArrayType

▸ **isArrayType**(`type`: unknown): *type is IArrayType<IAnyType>*

*Defined in [src/types/complex-types/array.ts:512](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/array.ts#L512)*

Returns if a given value represents an array type.

**Parameters:**

Name | Type |
------ | ------ |
`type` | unknown |

**Returns:** *type is IArrayType<IAnyType>*

`true` if the type is an array type.

___

###  isFrozenType

▸ **isFrozenType**(`type`: unknown): *type is ISimpleType<any>*

*Defined in [src/types/utility-types/frozen.ts:114](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/frozen.ts#L114)*

Returns if a given value represents a frozen type.

**Parameters:**

Name | Type |
------ | ------ |
`type` | unknown |

**Returns:** *type is ISimpleType<any>*

___

###  isIdentifierType

▸ **isIdentifierType**(`type`: unknown): *type is ISimpleType | ISimpleType*

*Defined in [src/types/utility-types/identifier.ts:138](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/identifier.ts#L138)*

Returns if a given value represents an identifier type.

**Parameters:**

Name | Type |
------ | ------ |
`type` | unknown |

**Returns:** *type is ISimpleType | ISimpleType*

___

###  isLateType

▸ **isLateType**(`type`: unknown): *type is IAnyType*

*Defined in [src/types/utility-types/late.ts:144](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/late.ts#L144)*

Returns if a given value represents a late type.

**Parameters:**

Name | Type |
------ | ------ |
`type` | unknown |

**Returns:** *type is IAnyType*

___

###  isLiteralType

▸ **isLiteralType**(`type`: unknown): *type is ISimpleType<any>*

*Defined in [src/types/utility-types/literal.ts:85](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/literal.ts#L85)*

Returns if a given value represents a literal type.

**Parameters:**

Name | Type |
------ | ------ |
`type` | unknown |

**Returns:** *type is ISimpleType<any>*

___

###  isMapType

▸ **isMapType**(`type`: unknown): *type is IMapType<IAnyType>*

*Defined in [src/types/complex-types/map.ts:521](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/map.ts#L521)*

Returns if a given value represents a map type.

**Parameters:**

Name | Type |
------ | ------ |
`type` | unknown |

**Returns:** *type is IMapType<IAnyType>*

`true` if it is a map type.

___

###  isModelType

▸ **isModelType**(`type`: unknown): *type is IAnyModelType*

*Defined in [src/types/complex-types/model.ts:897](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L897)*

Returns if a given value represents a model type.

**Parameters:**

Name | Type |
------ | ------ |
`type` | unknown |

**Returns:** *type is IAnyModelType*

___

###  isOptionalType

▸ **isOptionalType**(`type`: unknown): *type is IOptionalIType<IAnyType, []>*

*Defined in [src/types/utility-types/optional.ts:234](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/optional.ts#L234)*

Returns if a value represents an optional type.

**`template`** IT

**Parameters:**

Name | Type |
------ | ------ |
`type` | unknown |

**Returns:** *type is IOptionalIType<IAnyType, []>*

___

###  isPrimitiveType

▸ **isPrimitiveType**(`type`: unknown): *type is ISimpleType<string> | ISimpleType<number> | ISimpleType<boolean> | IType*

*Defined in [src/types/primitives.ts:241](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/primitives.ts#L241)*

Returns if a given value represents a primitive type.

**Parameters:**

Name | Type |
------ | ------ |
`type` | unknown |

**Returns:** *type is ISimpleType<string> | ISimpleType<number> | ISimpleType<boolean> | IType*

___

###  isProtected

▸ **isProtected**(`target`: IAnyStateTreeNode): *boolean*

*Defined in [src/core/mst-operations.ts:310](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L310)*

Returns true if the object is in protected mode, @see protect

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *boolean*

___

###  isReferenceType

▸ **isReferenceType**(`type`: unknown): *type is IReferenceType<IAnyComplexType>*

*Defined in [src/types/utility-types/reference.ts:541](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/reference.ts#L541)*

Returns if a given value represents a reference type.

**Parameters:**

Name | Type |
------ | ------ |
`type` | unknown |

**Returns:** *type is IReferenceType<IAnyComplexType>*

___

###  isRefinementType

▸ **isRefinementType**(`type`: unknown): *type is IAnyType*

*Defined in [src/types/utility-types/refinement.ts:125](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/refinement.ts#L125)*

Returns if a given value is a refinement type.

**Parameters:**

Name | Type |
------ | ------ |
`type` | unknown |

**Returns:** *type is IAnyType*

___

###  isRoot

▸ **isRoot**(`target`: IAnyStateTreeNode): *boolean*

*Defined in [src/core/mst-operations.ts:492](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L492)*

Returns true if the given object is the root of a model tree.

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *boolean*

___

###  isStateTreeNode

▸ **isStateTreeNode**<**IT**>(`value`: any): *value is STNValue<Instance<IT>, IT>*

*Defined in [src/core/node/node-utils.ts:67](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/node/node-utils.ts#L67)*

Returns true if the given value is a node in a state tree.
More precisely, that is, if the value is an instance of a
`types.model`, `types.array` or `types.map`.

**Type parameters:**

▪ **IT**: *[IAnyComplexType](interfaces/ianycomplextype.md)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is STNValue<Instance<IT>, IT>*

true if the value is a state tree node.

___

###  isType

▸ **isType**(`value`: any): *value is IAnyType*

*Defined in [src/core/type/type.ts:541](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/type/type.ts#L541)*

Returns if a given value represents a type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value to check. |

**Returns:** *value is IAnyType*

`true` if the value is a type.

___

###  isUnionType

▸ **isUnionType**(`type`: unknown): *type is IUnionType<IAnyType[]>*

*Defined in [src/types/utility-types/union.ts:218](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/union.ts#L218)*

Returns if a given value represents a union type.

**Parameters:**

Name | Type |
------ | ------ |
`type` | unknown |

**Returns:** *type is IUnionType<IAnyType[]>*

___

###  isValidReference

▸ **isValidReference**<**N**>(`getter`: function, `checkIfAlive`: boolean): *boolean*

*Defined in [src/core/mst-operations.ts:596](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L596)*

Tests if a reference is valid (pointing to an existing node and optionally if alive) and returns if the check passes or not.

**Type parameters:**

▪ **N**: *IAnyStateTreeNode*

**Parameters:**

▪ **getter**: *function*

Function to access the reference.

▸ (): *N | null | undefined*

▪`Default value`  **checkIfAlive**: *boolean*= true

true to also make sure the referenced node is alive (default), false to skip this check.

**Returns:** *boolean*

___

###  joinJsonPath

▸ **joinJsonPath**(`path`: string[]): *string*

*Defined in [src/core/json-patch.ts:99](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/json-patch.ts#L99)*

Generates a json-path compliant json path from path parts.

**Parameters:**

Name | Type |
------ | ------ |
`path` | string[] |

**Returns:** *string*

___

###  late

▸ **late**<**T**>(`type`: function): *T*

*Defined in [src/types/utility-types/late.ts:106](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/late.ts#L106)*

`types.late` - Defines a type that gets implemented later. This is useful when you have to deal with circular dependencies.
Please notice that when defining circular dependencies TypeScript isn't smart enough to inference them.

Example:
```ts
  // TypeScript isn't smart enough to infer self referencing types.
 const Node = types.model({
      children: types.array(types.late((): IAnyModelType => Node)) // then typecast each array element to Instance<typeof Node>
 })
```

**Type parameters:**

▪ **T**: *[IAnyType](interfaces/ianytype.md)*

**Parameters:**

▪ **type**: *function*

A function that returns the type that will be defined.

▸ (): *T*

**Returns:** *T*

▸ **late**<**T**>(`name`: string, `type`: function): *T*

*Defined in [src/types/utility-types/late.ts:107](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/late.ts#L107)*

`types.late` - Defines a type that gets implemented later. This is useful when you have to deal with circular dependencies.
Please notice that when defining circular dependencies TypeScript isn't smart enough to inference them.

Example:
```ts
  // TypeScript isn't smart enough to infer self referencing types.
 const Node = types.model({
      children: types.array(types.late((): IAnyModelType => Node)) // then typecast each array element to Instance<typeof Node>
 })
```

**Type parameters:**

▪ **T**: *[IAnyType](interfaces/ianytype.md)*

**Parameters:**

▪ **name**: *string*

The name to use for the type that will be returned.

▪ **type**: *function*

A function that returns the type that will be defined.

▸ (): *T*

**Returns:** *T*

___

###  lazy

▸ **lazy**<**T**, **U**>(`name`: string, `options`: LazyOptions‹T, U›): *T*

*Defined in [src/types/utility-types/lazy.ts:22](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/lazy.ts#L22)*

**Type parameters:**

▪ **T**: *[IType](interfaces/itype.md)‹any, any, any›*

▪ **U**

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`options` | LazyOptions‹T, U› |

**Returns:** *T*

___

###  literal

▸ **literal**<**S**>(`value`: S): *[ISimpleType](interfaces/isimpletype.md)‹S›*

*Defined in [src/types/utility-types/literal.ts:72](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/literal.ts#L72)*

`types.literal` - The literal type will return a type that will match only the exact given type.
The given value must be a primitive, in order to be serialized to a snapshot correctly.
You can use literal to match exact strings for example the exact male or female string.

Example:
```ts
const Person = types.model({
    name: types.string,
    gender: types.union(types.literal('male'), types.literal('female'))
})
```

**Type parameters:**

▪ **S**: *Primitives*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | S | The value to use in the strict equal check |

**Returns:** *[ISimpleType](interfaces/isimpletype.md)‹S›*

___

###  map

▸ **map**<**IT**>(`subtype`: IT): *IMapType‹IT›*

*Defined in [src/types/complex-types/map.ts:511](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/map.ts#L511)*

`types.map` - Creates a key based collection type who's children are all of a uniform declared type.
If the type stored in a map has an identifier, it is mandatory to store the child under that identifier in the map.

This type will always produce [observable maps](https://mobx.js.org/api.html#observablemap)

Example:
```ts
const Todo = types.model({
  id: types.identifier,
  task: types.string
})

const TodoStore = types.model({
  todos: types.map(Todo)
})

const s = TodoStore.create({ todos: {} })
unprotect(s)
s.todos.set(17, { task: "Grab coffee", id: 17 })
s.todos.put({ task: "Grab cookie", id: 18 }) // put will infer key from the identifier
console.log(s.todos.get(17).task) // prints: "Grab coffee"
```

**Type parameters:**

▪ **IT**: *[IAnyType](interfaces/ianytype.md)*

**Parameters:**

Name | Type |
------ | ------ |
`subtype` | IT |

**Returns:** *IMapType‹IT›*

___

###  maybe

▸ **maybe**<**IT**>(`type`: IT): *IMaybe‹IT›*

*Defined in [src/types/utility-types/maybe.ts:31](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/maybe.ts#L31)*

`types.maybe` - Maybe will make a type nullable, and also optional.
The value `undefined` will be used to represent nullability.

**Type parameters:**

▪ **IT**: *[IAnyType](interfaces/ianytype.md)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |

**Returns:** *IMaybe‹IT›*

___

###  maybeNull

▸ **maybeNull**<**IT**>(`type`: IT): *IMaybeNull‹IT›*

*Defined in [src/types/utility-types/maybe.ts:44](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/maybe.ts#L44)*

`types.maybeNull` - Maybe will make a type nullable, and also optional.
The value `null` will be used to represent no value.

**Type parameters:**

▪ **IT**: *[IAnyType](interfaces/ianytype.md)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |

**Returns:** *IMaybeNull‹IT›*

___

###  model

▸ **model**<**P**>(`name`: string, `properties?`: [P](undefined)): *[IModelType](interfaces/imodeltype.md)‹ModelPropertiesDeclarationToProperties‹P›, __type›*

*Defined in [src/types/complex-types/model.ts:781](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L781)*

`types.model` - Creates a new model type by providing a name, properties, volatile state and actions.

See the [model type](/concepts/trees#creating-models) description or the [getting started](intro/getting-started.md#getting-started-1) tutorial.

**Type parameters:**

▪ **P**: *ModelPropertiesDeclaration*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`properties?` | [P](undefined) |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹ModelPropertiesDeclarationToProperties‹P›, __type›*

▸ **model**<**P**>(`properties?`: [P](undefined)): *[IModelType](interfaces/imodeltype.md)‹ModelPropertiesDeclarationToProperties‹P›, __type›*

*Defined in [src/types/complex-types/model.ts:785](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/complex-types/model.ts#L785)*

`types.model` - Creates a new model type by providing a name, properties, volatile state and actions.

See the [model type](/concepts/trees#creating-models) description or the [getting started](intro/getting-started.md#getting-started-1) tutorial.

**Type parameters:**

▪ **P**: *ModelPropertiesDeclaration*

**Parameters:**

Name | Type |
------ | ------ |
`properties?` | [P](undefined) |

**Returns:** *[IModelType](interfaces/imodeltype.md)‹ModelPropertiesDeclarationToProperties‹P›, __type›*

___

###  onAction

▸ **onAction**(`target`: IAnyStateTreeNode, `listener`: function, `attachAfter`: boolean): *[IDisposer](index.md#idisposer)*

*Defined in [src/middlewares/on-action.ts:226](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/middlewares/on-action.ts#L226)*

Registers a function that will be invoked for each action that is called on the provided model instance, or to any of its children.
See [actions](https://github.com/mobxjs/mobx-state-tree#actions) for more details. onAction events are emitted only for the outermost called action in the stack.
Action can also be intercepted by middleware using addMiddleware to change the function call before it will be run.

Not all action arguments might be serializable. For unserializable arguments, a struct like `{ $MST_UNSERIALIZABLE: true, type: "someType" }` will be generated.
MST Nodes are considered non-serializable as well (they could be serialized as there snapshot, but it is uncertain whether an replaying party will be able to handle such a non-instantiated snapshot).
Rather, when using `onAction` middleware, one should consider in passing arguments which are 1: an id, 2: a (relative) path, or 3: a snapshot. Instead of a real MST node.

Example:
```ts
const Todo = types.model({
  task: types.string
})

const TodoStore = types.model({
  todos: types.array(Todo)
}).actions(self => ({
  add(todo) {
    self.todos.push(todo);
  }
}))

const s = TodoStore.create({ todos: [] })

let disposer = onAction(s, (call) => {
  console.log(call);
})

s.add({ task: "Grab a coffee" })
// Logs: { name: "add", path: "", args: [{ task: "Grab a coffee" }] }
```

**Parameters:**

▪ **target**: *IAnyStateTreeNode*

▪ **listener**: *function*

▸ (`call`: [ISerializedActionCall](interfaces/iserializedactioncall.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | [ISerializedActionCall](interfaces/iserializedactioncall.md) |

▪`Default value`  **attachAfter**: *boolean*= false

(default false) fires the listener *after* the action has executed instead of before.

**Returns:** *[IDisposer](index.md#idisposer)*

___

###  onPatch

▸ **onPatch**(`target`: IAnyStateTreeNode, `callback`: function): *[IDisposer](index.md#idisposer)*

*Defined in [src/core/mst-operations.ts:83](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L83)*

Registers a function that will be invoked for each mutation that is applied to the provided model instance, or to any of its children.
See [patches](https://github.com/mobxjs/mobx-state-tree#patches) for more details. onPatch events are emitted immediately and will not await the end of a transaction.
Patches can be used to deeply observe a model tree.

**Parameters:**

▪ **target**: *IAnyStateTreeNode*

the model instance from which to receive patches

▪ **callback**: *function*

the callback that is invoked for each patch. The reversePatch is a patch that would actually undo the emitted patch

▸ (`patch`: [IJsonPatch](interfaces/ijsonpatch.md), `reversePatch`: [IJsonPatch](interfaces/ijsonpatch.md)): *void*

**Parameters:**

Name | Type |
------ | ------ |
`patch` | [IJsonPatch](interfaces/ijsonpatch.md) |
`reversePatch` | [IJsonPatch](interfaces/ijsonpatch.md) |

**Returns:** *[IDisposer](index.md#idisposer)*

function to remove the listener

___

###  onSnapshot

▸ **onSnapshot**<**S**>(`target`: IStateTreeNode‹[IType](interfaces/itype.md)‹any, S, any››, `callback`: function): *[IDisposer](index.md#idisposer)*

*Defined in [src/core/mst-operations.ts:103](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L103)*

Registers a function that is invoked whenever a new snapshot for the given model instance is available.
The listener will only be fire at the end of the current MobX (trans)action.
See [snapshots](https://github.com/mobxjs/mobx-state-tree#snapshots) for more details.

**Type parameters:**

▪ **S**

**Parameters:**

▪ **target**: *IStateTreeNode‹[IType](interfaces/itype.md)‹any, S, any››*

▪ **callback**: *function*

▸ (`snapshot`: S): *void*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | S |

**Returns:** *[IDisposer](index.md#idisposer)*

___

###  optional

▸ **optional**<**IT**>(`type`: IT, `defaultValueOrFunction`: OptionalDefaultValueOrFunction‹IT›): *IOptionalIType‹IT, []›*

*Defined in [src/types/utility-types/optional.ts:160](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/optional.ts#L160)*

`types.optional` - Can be used to create a property with a default value.

Depending on the third argument (`optionalValues`) there are two ways of operation:
- If the argument is not provided, then if a value is not provided in the snapshot (`undefined` or missing),
  it will default to the provided `defaultValue`
- If the argument is provided, then if the value in the snapshot matches one of the optional values inside the array then it will
  default to the provided `defaultValue`. Additionally, if one of the optional values inside the array is `undefined` then a missing
  property is also valid.

  Note that it is also possible to include values of the same type as the intended subtype as optional values,
  in this case the optional value will be transformed into the `defaultValue` (e.g. `types.optional(types.string, "unnamed", [undefined, ""])`
  will transform the snapshot values `undefined` (and therefore missing) and empty strings into the string `"unnamed"` when it gets
  instantiated).

If `defaultValue` is a function, the function will be invoked for every new instance.
Applying a snapshot in which the optional value is one of the optional values (or `undefined`/_not_ present if none are provided) causes the
value to be reset.

Example:
```ts
const Todo = types.model({
  title: types.string,
  subtitle1: types.optional(types.string, "", [null]),
  subtitle2: types.optional(types.string, "", [null, undefined]),
  done: types.optional(types.boolean, false),
  created: types.optional(types.Date, () => new Date()),
})

// if done is missing / undefined it will become false
// if created is missing / undefined it will get a freshly generated timestamp
// if subtitle1 is null it will default to "", but it cannot be missing or undefined
// if subtitle2 is null or undefined it will default to ""; since it can be undefined it can also be missing
const todo = Todo.create({ title: "Get coffee", subtitle1: null })
```

**Type parameters:**

▪ **IT**: *[IAnyType](interfaces/ianytype.md)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |
`defaultValueOrFunction` | OptionalDefaultValueOrFunction‹IT› |

**Returns:** *IOptionalIType‹IT, []›*

▸ **optional**<**IT**, **OptionalVals**>(`type`: IT, `defaultValueOrFunction`: OptionalDefaultValueOrFunction‹IT›, `optionalValues`: OptionalVals): *IOptionalIType‹IT, OptionalVals›*

*Defined in [src/types/utility-types/optional.ts:164](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/optional.ts#L164)*

`types.optional` - Can be used to create a property with a default value.

Depending on the third argument (`optionalValues`) there are two ways of operation:
- If the argument is not provided, then if a value is not provided in the snapshot (`undefined` or missing),
  it will default to the provided `defaultValue`
- If the argument is provided, then if the value in the snapshot matches one of the optional values inside the array then it will
  default to the provided `defaultValue`. Additionally, if one of the optional values inside the array is `undefined` then a missing
  property is also valid.

  Note that it is also possible to include values of the same type as the intended subtype as optional values,
  in this case the optional value will be transformed into the `defaultValue` (e.g. `types.optional(types.string, "unnamed", [undefined, ""])`
  will transform the snapshot values `undefined` (and therefore missing) and empty strings into the string `"unnamed"` when it gets
  instantiated).

If `defaultValue` is a function, the function will be invoked for every new instance.
Applying a snapshot in which the optional value is one of the optional values (or `undefined`/_not_ present if none are provided) causes the
value to be reset.

Example:
```ts
const Todo = types.model({
  title: types.string,
  subtitle1: types.optional(types.string, "", [null]),
  subtitle2: types.optional(types.string, "", [null, undefined]),
  done: types.optional(types.boolean, false),
  created: types.optional(types.Date, () => new Date()),
})

// if done is missing / undefined it will become false
// if created is missing / undefined it will get a freshly generated timestamp
// if subtitle1 is null it will default to "", but it cannot be missing or undefined
// if subtitle2 is null or undefined it will default to ""; since it can be undefined it can also be missing
const todo = Todo.create({ title: "Get coffee", subtitle1: null })
```

**Type parameters:**

▪ **IT**: *[IAnyType](interfaces/ianytype.md)*

▪ **OptionalVals**: *ValidOptionalValues*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | IT | - |
`defaultValueOrFunction` | OptionalDefaultValueOrFunction‹IT› | - |
`optionalValues` | OptionalVals | an optional array with zero or more primitive values (string, number, boolean, null or undefined)                       that will be converted into the default. `[ undefined ]` is assumed when none is provided |

**Returns:** *IOptionalIType‹IT, OptionalVals›*

___

###  protect

▸ **protect**(`target`: IAnyStateTreeNode): *void*

*Defined in [src/core/mst-operations.ts:265](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L265)*

The inverse of `unprotect`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | IAnyStateTreeNode |   |

**Returns:** *void*

___

###  recordActions

▸ **recordActions**(`subject`: IAnyStateTreeNode, `filter?`: undefined | function): *[IActionRecorder](interfaces/iactionrecorder.md)*

*Defined in [src/middlewares/on-action.ts:148](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/middlewares/on-action.ts#L148)*

Small abstraction around `onAction` and `applyAction`, attaches an action listener to a tree and records all the actions emitted.
Returns an recorder object with the following signature:

Example:
```ts
export interface IActionRecorder {
     // the recorded actions
     actions: ISerializedActionCall[]
     // true if currently recording
     recording: boolean
     // stop recording actions
     stop(): void
     // resume recording actions
     resume(): void
     // apply all the recorded actions on the given object
     replay(target: IAnyStateTreeNode): void
}
```

The optional filter function allows to skip recording certain actions.

**Parameters:**

Name | Type |
------ | ------ |
`subject` | IAnyStateTreeNode |
`filter?` | undefined &#124; function |

**Returns:** *[IActionRecorder](interfaces/iactionrecorder.md)*

___

###  recordPatches

▸ **recordPatches**(`subject`: IAnyStateTreeNode, `filter?`: undefined | function): *[IPatchRecorder](interfaces/ipatchrecorder.md)*

*Defined in [src/core/mst-operations.ts:177](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L177)*

Small abstraction around `onPatch` and `applyPatch`, attaches a patch listener to a tree and records all the patches.
Returns a recorder object with the following signature:

Example:
```ts
export interface IPatchRecorder {
     // the recorded patches
     patches: IJsonPatch[]
     // the inverse of the recorded patches
     inversePatches: IJsonPatch[]
     // true if currently recording
     recording: boolean
     // stop recording patches
     stop(): void
     // resume recording patches
     resume(): void
     // apply all the recorded patches on the given target (the original subject if omitted)
     replay(target?: IAnyStateTreeNode): void
     // reverse apply the recorded patches on the given target  (the original subject if omitted)
     // stops the recorder if not already stopped
     undo(): void
}
```

The optional filter function allows to skip recording certain patches.

**Parameters:**

Name | Type |
------ | ------ |
`subject` | IAnyStateTreeNode |
`filter?` | undefined &#124; function |

**Returns:** *[IPatchRecorder](interfaces/ipatchrecorder.md)*

___

###  reference

▸ **reference**<**IT**>(`subType`: IT, `options?`: [ReferenceOptions](index.md#referenceoptions)‹IT›): *IReferenceType‹IT›*

*Defined in [src/types/utility-types/reference.ts:494](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/reference.ts#L494)*

`types.reference` - Creates a reference to another type, which should have defined an identifier.
See also the [reference and identifiers](https://github.com/mobxjs/mobx-state-tree#references-and-identifiers) section.

**Type parameters:**

▪ **IT**: *[IAnyComplexType](interfaces/ianycomplextype.md)*

**Parameters:**

Name | Type |
------ | ------ |
`subType` | IT |
`options?` | [ReferenceOptions](index.md#referenceoptions)‹IT› |

**Returns:** *IReferenceType‹IT›*

___

###  refinement

▸ **refinement**<**IT**>(`name`: string, `type`: IT, `predicate`: function, `message?`: string | function): *IT*

*Defined in [src/types/utility-types/refinement.ts:83](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/refinement.ts#L83)*

`types.refinement` - Creates a type that is more specific than the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.

**Type parameters:**

▪ **IT**: *[IAnyType](interfaces/ianytype.md)*

**Parameters:**

▪ **name**: *string*

▪ **type**: *IT*

▪ **predicate**: *function*

▸ (`snapshot`: IT["CreationType"]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | IT["CreationType"] |

▪`Optional`  **message**: *string | function*

**Returns:** *IT*

▸ **refinement**<**IT**>(`type`: IT, `predicate`: function, `message?`: string | function): *IT*

*Defined in [src/types/utility-types/refinement.ts:89](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/refinement.ts#L89)*

`types.refinement` - Creates a type that is more specific than the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.

**Type parameters:**

▪ **IT**: *[IAnyType](interfaces/ianytype.md)*

**Parameters:**

▪ **type**: *IT*

▪ **predicate**: *function*

▸ (`snapshot`: IT["CreationType"]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | IT["CreationType"] |

▪`Optional`  **message**: *string | function*

**Returns:** *IT*

___

###  resolveIdentifier

▸ **resolveIdentifier**<**IT**>(`type`: IT, `target`: IAnyStateTreeNode, `identifier`: [ReferenceIdentifier](index.md#referenceidentifier)): *IT["Type"] | undefined*

*Defined in [src/core/mst-operations.ts:525](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L525)*

Resolves a model instance given a root target, the type and the identifier you are searching for.
Returns undefined if no value can be found.

**Type parameters:**

▪ **IT**: *[IAnyModelType](interfaces/ianymodeltype.md)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |
`target` | IAnyStateTreeNode |
`identifier` | [ReferenceIdentifier](index.md#referenceidentifier) |

**Returns:** *IT["Type"] | undefined*

___

###  resolvePath

▸ **resolvePath**(`target`: IAnyStateTreeNode, `path`: string): *any*

*Defined in [src/core/mst-operations.ts:507](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L507)*

Resolves a path relatively to a given object.
Returns undefined if no value can be found.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | IAnyStateTreeNode | - |
`path` | string | escaped json path |

**Returns:** *any*

___

###  safeReference

▸ **safeReference**<**IT**>(`subType`: IT, `options`: __type | [ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)‹IT› & object): *IReferenceType‹IT›*

*Defined in [src/types/utility-types/reference.ts:545](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/reference.ts#L545)*

`types.safeReference` - A safe reference is like a standard reference, except that it accepts the undefined value by default
and automatically sets itself to undefined (when the parent is a model) / removes itself from arrays and maps
when the reference it is pointing to gets detached/destroyed.

The optional options parameter object accepts a parameter named `acceptsUndefined`, which is set to true by default, so it is suitable
for model properties.
When used inside collections (arrays/maps), it is recommended to set this option to false so it can't take undefined as value,
which is usually the desired in those cases.
Additionally, the optional options parameter object accepts a parameter named `onInvalidated`, which will be called when the reference target node that the reference is pointing to is about to be detached/destroyed

Strictly speaking it is a `types.maybe(types.reference(X))` (when `acceptsUndefined` is set to true, the default) and
`types.reference(X)` (when `acceptsUndefined` is set to false), both of them with a customized `onInvalidated` option.

**Type parameters:**

▪ **IT**: *[IAnyComplexType](interfaces/ianycomplextype.md)*

**Parameters:**

Name | Type |
------ | ------ |
`subType` | IT |
`options` | __type &#124; [ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)‹IT› & object |

**Returns:** *IReferenceType‹IT›*

▸ **safeReference**<**IT**>(`subType`: IT, `options?`: __type | [ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)‹IT› & object): *IMaybe‹IReferenceType‹IT››*

*Defined in [src/types/utility-types/reference.ts:552](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/reference.ts#L552)*

`types.safeReference` - A safe reference is like a standard reference, except that it accepts the undefined value by default
and automatically sets itself to undefined (when the parent is a model) / removes itself from arrays and maps
when the reference it is pointing to gets detached/destroyed.

The optional options parameter object accepts a parameter named `acceptsUndefined`, which is set to true by default, so it is suitable
for model properties.
When used inside collections (arrays/maps), it is recommended to set this option to false so it can't take undefined as value,
which is usually the desired in those cases.
Additionally, the optional options parameter object accepts a parameter named `onInvalidated`, which will be called when the reference target node that the reference is pointing to is about to be detached/destroyed

Strictly speaking it is a `types.maybe(types.reference(X))` (when `acceptsUndefined` is set to true, the default) and
`types.reference(X)` (when `acceptsUndefined` is set to false), both of them with a customized `onInvalidated` option.

**Type parameters:**

▪ **IT**: *[IAnyComplexType](interfaces/ianycomplextype.md)*

**Parameters:**

Name | Type |
------ | ------ |
`subType` | IT |
`options?` | __type &#124; [ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)‹IT› & object |

**Returns:** *IMaybe‹IReferenceType‹IT››*

___

###  setLivelinessChecking

▸ **setLivelinessChecking**(`mode`: [LivelinessMode](index.md#livelinessmode)): *void*

*Defined in [src/core/node/livelinessChecking.ts:18](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/node/livelinessChecking.ts#L18)*

Defines what MST should do when running into reads / writes to objects that have died.
By default it will print a warning.
Use the `"error"` option to easy debugging to see where the error was thrown and when the offending read / write took place

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`mode` | [LivelinessMode](index.md#livelinessmode) | `"warn"`, `"error"` or `"ignore"`  |

**Returns:** *void*

___

###  snapshotProcessor

▸ **snapshotProcessor**<**IT**, **CustomC**, **CustomS**>(`type`: IT, `processors`: [ISnapshotProcessors](interfaces/isnapshotprocessors.md)‹IT, CustomC, CustomS›, `name?`: undefined | string): *[ISnapshotProcessor](interfaces/isnapshotprocessor.md)‹IT, CustomC, CustomS›*

*Defined in [src/types/utility-types/snapshotProcessor.ts:269](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/snapshotProcessor.ts#L269)*

`types.snapshotProcessor` - Runs a pre/post snapshot processor before/after serializing a given type.

Example:
```ts
const Todo1 = types.model({ text: types.string })
// in the backend the text type must be null when empty
interface BackendTodo {
    text: string | null
}

const Todo2 = types.snapshotProcessor(Todo1, {
    // from snapshot to instance
    preProcessor(snapshot: BackendTodo) {
        return {
            text: sn.text || "";
        }
    },

    // from instance to snapshot
    postProcessor(snapshot, node): BackendTodo {
        return {
            text: !sn.text ? null : sn.text
        }
    }
})
```

**Type parameters:**

▪ **IT**: *[IAnyType](interfaces/ianytype.md)*

▪ **CustomC**

▪ **CustomS**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | IT | Type to run the processors over. |
`processors` | [ISnapshotProcessors](interfaces/isnapshotprocessors.md)‹IT, CustomC, CustomS› | Processors to run. |
`name?` | undefined &#124; string | Type name, or undefined to inherit the inner type one. |

**Returns:** *[ISnapshotProcessor](interfaces/isnapshotprocessor.md)‹IT, CustomC, CustomS›*

___

###  splitJsonPath

▸ **splitJsonPath**(`path`: string): *string[]*

*Defined in [src/core/json-patch.ts:119](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/json-patch.ts#L119)*

Splits and decodes a json path into several parts.

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *string[]*

___

###  toGenerator

▸ **toGenerator**<**R**>(`p`: Promise‹R›): *Generator‹Promise‹R›, R, R›*

*Defined in [src/core/flow.ts:87](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/flow.ts#L87)*

**`experimental`** 
experimental api - might change on minor/patch releases

Convert a promise to a generator yielding that promise
This is intended to allow for usage of `yield*` in async actions to
retain the promise return type.

Example:
```ts
function getDataAsync(input: string): Promise<number> { ... }

const someModel.actions(self => ({
  someAction: flow(function*() {
    // value is typed as number
    const value = yield* toGenerator(getDataAsync("input value"));
    ...
  })
}))
```

**Type parameters:**

▪ **R**

**Parameters:**

Name | Type |
------ | ------ |
`p` | Promise‹R› |

**Returns:** *Generator‹Promise‹R›, R, R›*

___

###  toGeneratorFunction

▸ **toGeneratorFunction**<**R**, **Args**>(`p`: function): *(Anonymous function)*

*Defined in [src/core/flow.ts:60](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/flow.ts#L60)*

**`experimental`** 
experimental api - might change on minor/patch releases

Convert a promise-returning function to a generator-returning one.
This is intended to allow for usage of `yield*` in async actions to
retain the promise return type.

Example:
```ts
function getDataAsync(input: string): Promise<number> { ... }
const getDataGen = toGeneratorFunction(getDataAsync);

const someModel.actions(self => ({
  someAction: flow(function*() {
    // value is typed as number
    const value = yield* getDataGen("input value");
    ...
  })
}))
```

**Type parameters:**

▪ **R**

▪ **Args**: *any[]*

**Parameters:**

▪ **p**: *function*

▸ (...`args`: Args): *Promise‹R›*

**Parameters:**

Name | Type |
------ | ------ |
`...args` | Args |

**Returns:** *(Anonymous function)*

___

###  tryReference

▸ **tryReference**<**N**>(`getter`: function, `checkIfAlive`: boolean): *N | undefined*

*Defined in [src/core/mst-operations.ts:564](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L564)*

Tests if a reference is valid (pointing to an existing node and optionally if alive) and returns such reference if the check passes,
else it returns undefined.

**Type parameters:**

▪ **N**: *IAnyStateTreeNode*

**Parameters:**

▪ **getter**: *function*

Function to access the reference.

▸ (): *N | null | undefined*

▪`Default value`  **checkIfAlive**: *boolean*= true

true to also make sure the referenced node is alive (default), false to skip this check.

**Returns:** *N | undefined*

___

###  tryResolve

▸ **tryResolve**(`target`: IAnyStateTreeNode, `path`: string): *any*

*Defined in [src/core/mst-operations.ts:624](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L624)*

Try to resolve a given path relative to a given node.

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |
`path` | string |

**Returns:** *any*

___

###  typecheck

▸ **typecheck**<**IT**>(`type`: IT, `value`: ExtractCSTWithSTN‹IT›): *void*

*Defined in [src/core/type/type-checker.ts:164](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/type/type-checker.ts#L164)*

Run's the typechecker for the given type on the given value, which can be a snapshot or an instance.
Throws if the given value is not according the provided type specification.
Use this if you need typechecks even in a production build (by default all automatic runtime type checks will be skipped in production builds)

**Type parameters:**

▪ **IT**: *[IAnyType](interfaces/ianytype.md)*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | IT | Type to check against. |
`value` | ExtractCSTWithSTN‹IT› | Value to be checked, either a snapshot or an instance.  |

**Returns:** *void*

___

###  unescapeJsonPath

▸ **unescapeJsonPath**(`path`: string): *string*

*Defined in [src/core/json-patch.ts:89](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/json-patch.ts#L89)*

Unescape slashes and backslashes.

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *string*

___

###  union

▸ **union**<**Types**>(...`types`: Types): *[IUnionType](index.md#iuniontype)‹Types›*

*Defined in [src/types/utility-types/union.ts:175](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/union.ts#L175)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **Types**: *[IAnyType](interfaces/ianytype.md)[]*

**Parameters:**

Name | Type |
------ | ------ |
`...types` | Types |

**Returns:** *[IUnionType](index.md#iuniontype)‹Types›*

▸ **union**<**Types**>(`options`: [UnionOptions](interfaces/unionoptions.md)‹Types›, ...`types`: Types): *[IUnionType](index.md#iuniontype)‹Types›*

*Defined in [src/types/utility-types/union.ts:176](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/utility-types/union.ts#L176)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **Types**: *[IAnyType](interfaces/ianytype.md)[]*

**Parameters:**

Name | Type |
------ | ------ |
`options` | [UnionOptions](interfaces/unionoptions.md)‹Types› |
`...types` | Types |

**Returns:** *[IUnionType](index.md#iuniontype)‹Types›*

___

###  unprotect

▸ **unprotect**(`target`: IAnyStateTreeNode): *void*

*Defined in [src/core/mst-operations.ts:298](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L298)*

By default it is not allowed to directly modify a model. Models can only be modified through actions.
However, in some cases you don't care about the advantages (like replayability, traceability, etc) this yields.
For example because you are building a PoC or don't have any middleware attached to your tree.

In that case you can disable this protection by calling `unprotect` on the root of your tree.

Example:
```ts
const Todo = types.model({
    done: false
}).actions(self => ({
    toggle() {
        self.done = !self.done
    }
}))

const todo = Todo.create()
todo.done = true // throws!
todo.toggle() // OK
unprotect(todo)
todo.done = false // OK
```

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *void*

___

###  walk

▸ **walk**(`target`: IAnyStateTreeNode, `processor`: function): *void*

*Defined in [src/core/mst-operations.ts:808](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/core/mst-operations.ts#L808)*

Performs a depth first walk through a tree.

**Parameters:**

▪ **target**: *IAnyStateTreeNode*

▪ **processor**: *function*

▸ (`item`: IAnyStateTreeNode): *void*

**Parameters:**

Name | Type |
------ | ------ |
`item` | IAnyStateTreeNode |

**Returns:** *void*

## Object literals

### `Const` types

### ▪ **types**: *object*

*Defined in [src/types/index.ts:34](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L34)*

###  Date

• **Date**: *[IType](interfaces/itype.md)‹number | Date, number, Date›* =  DatePrimitive

*Defined in [src/types/index.ts:53](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L53)*

###  array

• **array**: *[array](index.md#array)*

*Defined in [src/types/index.ts:55](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L55)*

###  boolean

• **boolean**: *[ISimpleType](interfaces/isimpletype.md)‹boolean›*

*Defined in [src/types/index.ts:48](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L48)*

###  compose

• **compose**: *[compose](index.md#compose)*

*Defined in [src/types/index.ts:37](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L37)*

###  custom

• **custom**: *[custom](index.md#custom)*

*Defined in [src/types/index.ts:38](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L38)*

###  enumeration

• **enumeration**: *[enumeration](index.md#enumeration)*

*Defined in [src/types/index.ts:35](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L35)*

###  finite

• **finite**: *[ISimpleType](interfaces/isimpletype.md)‹number›*

*Defined in [src/types/index.ts:52](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L52)*

###  float

• **float**: *[ISimpleType](interfaces/isimpletype.md)‹number›*

*Defined in [src/types/index.ts:51](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L51)*

###  frozen

• **frozen**: *[frozen](index.md#frozen)*

*Defined in [src/types/index.ts:56](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L56)*

###  identifier

• **identifier**: *[ISimpleType](interfaces/isimpletype.md)‹string›*

*Defined in [src/types/index.ts:57](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L57)*

###  identifierNumber

• **identifierNumber**: *[ISimpleType](interfaces/isimpletype.md)‹number›*

*Defined in [src/types/index.ts:58](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L58)*

###  integer

• **integer**: *[ISimpleType](interfaces/isimpletype.md)‹number›*

*Defined in [src/types/index.ts:50](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L50)*

###  late

• **late**: *[late](index.md#late)*

*Defined in [src/types/index.ts:59](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L59)*

###  lazy

• **lazy**: *[lazy](index.md#lazy)*

*Defined in [src/types/index.ts:60](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L60)*

###  literal

• **literal**: *[literal](index.md#literal)*

*Defined in [src/types/index.ts:43](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L43)*

###  map

• **map**: *[map](index.md#map)*

*Defined in [src/types/index.ts:54](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L54)*

###  maybe

• **maybe**: *[maybe](index.md#maybe)*

*Defined in [src/types/index.ts:44](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L44)*

###  maybeNull

• **maybeNull**: *[maybeNull](index.md#maybenull)*

*Defined in [src/types/index.ts:45](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L45)*

###  model

• **model**: *[model](index.md#model)*

*Defined in [src/types/index.ts:36](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L36)*

###  null

• **null**: *[ISimpleType](interfaces/isimpletype.md)‹null›* =  nullType

*Defined in [src/types/index.ts:62](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L62)*

###  number

• **number**: *[ISimpleType](interfaces/isimpletype.md)‹number›*

*Defined in [src/types/index.ts:49](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L49)*

###  optional

• **optional**: *[optional](index.md#optional)*

*Defined in [src/types/index.ts:42](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L42)*

###  reference

• **reference**: *[reference](index.md#reference)*

*Defined in [src/types/index.ts:39](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L39)*

###  refinement

• **refinement**: *[refinement](index.md#refinement)*

*Defined in [src/types/index.ts:46](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L46)*

###  safeReference

• **safeReference**: *[safeReference](index.md#safereference)*

*Defined in [src/types/index.ts:40](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L40)*

###  snapshotProcessor

• **snapshotProcessor**: *[snapshotProcessor](index.md#snapshotprocessor)*

*Defined in [src/types/index.ts:63](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L63)*

###  string

• **string**: *[ISimpleType](interfaces/isimpletype.md)‹string›*

*Defined in [src/types/index.ts:47](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L47)*

###  undefined

• **undefined**: *[ISimpleType](interfaces/isimpletype.md)‹undefined›* =  undefinedType

*Defined in [src/types/index.ts:61](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L61)*

###  union

• **union**: *[union](index.md#union)*

*Defined in [src/types/index.ts:41](https://github.com/mobxjs/mobx-state-tree/blob/f8bb1472/src/types/index.ts#L41)*
