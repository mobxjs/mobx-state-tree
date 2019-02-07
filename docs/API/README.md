# Mobx-State-Tree API reference guide

_This reference guide lists all methods exposed by MST. Contributions like linguistic improvements, adding more details to the descriptions or additional examples are highly appreciated! Please note that the docs are generated from source. Most methods are declared in the [mst-operations.ts](https://github.com/mobxjs/mobx-state-tree/blob/master/packages/mobx-state-tree/src/core/mst-operations.ts) file._


#  mobx-state-tree

## Index

### Interfaces

* [CustomTypeOptions](interfaces/customtypeoptions.md)
* [IActionRecorder](interfaces/iactionrecorder.md)
* [IActionTrackingMiddlewareHooks](interfaces/iactiontrackingmiddlewarehooks.md)
* [IAnyModelType](interfaces/ianymodeltype.md)
* [IJsonPatch](interfaces/ijsonpatch.md)
* [IModelReflectionData](interfaces/imodelreflectiondata.md)
* [IModelReflectionPropertiesData](interfaces/imodelreflectionpropertiesdata.md)
* [IModelType](interfaces/imodeltype.md)
* [IPatchRecorder](interfaces/ipatchrecorder.md)
* [IReversibleJsonPatch](interfaces/ireversiblejsonpatch.md)
* [ISerializedActionCall](interfaces/iserializedactioncall.md)
* [ISimpleType](interfaces/isimpletype.md)
* [IType](interfaces/itype.md)
* [IValidationContextEntry](interfaces/ivalidationcontextentry.md)
* [IValidationError](interfaces/ivalidationerror.md)
* [ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)
* [ReferenceOptionsOnInvalidated](interfaces/referenceoptionsoninvalidated.md)
* [UnionOptions](interfaces/unionoptions.md)

### Type aliases

* [IAnyComplexType](#ianycomplextype)
* [IAnyType](#ianytype)
* [IDisposer](#idisposer)
* [IMiddlewareEvent](#imiddlewareevent)
* [IMiddlewareEventType](#imiddlewareeventtype)
* [IMiddlewareHandler](#imiddlewarehandler)
* [ITypeDispatcher](#itypedispatcher)
* [IValidationContext](#ivalidationcontext)
* [IValidationResult](#ivalidationresult)
* [Instance](#instance)
* [LivelinessMode](#livelinessmode)
* [OnReferenceInvalidated](#onreferenceinvalidated)
* [OnReferenceInvalidatedEvent](#onreferenceinvalidatedevent)
* [ReferenceIdentifier](#referenceidentifier)
* [ReferenceOptions](#referenceoptions)
* [SnapshotIn](#snapshotin)
* [SnapshotOrInstance](#snapshotorinstance)
* [SnapshotOut](#snapshotout)

### Variables

* [DatePrimitive](#dateprimitive)
* [boolean](#boolean)
* [identifier](#identifier)
* [identifierNumber](#identifiernumber)
* [integer](#integer)
* [nullType](#nulltype)
* [number](#number)
* [string](#string)
* [undefinedType](#undefinedtype)

### Functions

* [addDisposer](#adddisposer)
* [addMiddleware](#addmiddleware)
* [applyAction](#applyaction)
* [applyPatch](#applypatch)
* [applySnapshot](#applysnapshot)
* [array](#array)
* [cast](#cast)
* [castFlowReturn](#castflowreturn)
* [castToReferenceSnapshot](#casttoreferencesnapshot)
* [castToSnapshot](#casttosnapshot)
* [clone](#clone)
* [compose](#compose)
* [createActionTrackingMiddleware](#createactiontrackingmiddleware)
* [custom](#custom)
* [decorate](#decorate)
* [destroy](#destroy)
* [detach](#detach)
* [enumeration](#enumeration)
* [escapeJsonPath](#escapejsonpath)
* [flow](#flow)
* [frozen](#frozen)
* [getChildType](#getchildtype)
* [getEnv](#getenv)
* [getIdentifier](#getidentifier)
* [getLivelinessChecking](#getlivelinesschecking)
* [getMembers](#getmembers)
* [getParent](#getparent)
* [getParentOfType](#getparentoftype)
* [getPath](#getpath)
* [getPathParts](#getpathparts)
* [getPropertyMembers](#getpropertymembers)
* [getRelativePath](#getrelativepath)
* [getRoot](#getroot)
* [getSnapshot](#getsnapshot)
* [getType](#gettype)
* [hasParent](#hasparent)
* [hasParentOfType](#hasparentoftype)
* [isAlive](#isalive)
* [isArrayType](#isarraytype)
* [isFrozenType](#isfrozentype)
* [isIdentifierType](#isidentifiertype)
* [isLateType](#islatetype)
* [isLiteralType](#isliteraltype)
* [isMapType](#ismaptype)
* [isModelType](#ismodeltype)
* [isOptionalType](#isoptionaltype)
* [isPrimitiveType](#isprimitivetype)
* [isProtected](#isprotected)
* [isReferenceType](#isreferencetype)
* [isRefinementType](#isrefinementtype)
* [isRoot](#isroot)
* [isStateTreeNode](#isstatetreenode)
* [isType](#istype)
* [isUnionType](#isuniontype)
* [isValidReference](#isvalidreference)
* [joinJsonPath](#joinjsonpath)
* [late](#late)
* [literal](#literal)
* [map](#map)
* [maybe](#maybe)
* [maybeNull](#maybenull)
* [model](#model)
* [onAction](#onaction)
* [onPatch](#onpatch)
* [onSnapshot](#onsnapshot)
* [optional](#optional)
* [protect](#protect)
* [recordActions](#recordactions)
* [recordPatches](#recordpatches)
* [reference](#reference)
* [refinement](#refinement)
* [resolveIdentifier](#resolveidentifier)
* [resolvePath](#resolvepath)
* [safeReference](#safereference)
* [setLivelinessChecking](#setlivelinesschecking)
* [splitJsonPath](#splitjsonpath)
* [tryReference](#tryreference)
* [tryResolve](#tryresolve)
* [typecheck](#typecheck)
* [unescapeJsonPath](#unescapejsonpath)
* [union](#union)
* [unprotect](#unprotect)
* [walk](#walk)

### Object literals

* [types](#types)

---

## Type aliases

<a id="ianycomplextype"></a>

###  IAnyComplexType

**Ƭ IAnyComplexType**: *[IType](interfaces/itype.md)<`any`, `any`, `IAnyStateTreeNode`>*

Any kind of complex type.

___
<a id="ianytype"></a>

###  IAnyType

**Ƭ IAnyType**: *[IType](interfaces/itype.md)<`any`, `any`, `any`>*

Any kind of type.

___
<a id="idisposer"></a>

###  IDisposer

**Ƭ IDisposer**: *`function`*

#### Type declaration
▸(): `void`

**Returns:** `void`

___
<a id="imiddlewareevent"></a>

###  IMiddlewareEvent

**Ƭ IMiddlewareEvent**: *`object`*

#### Type declaration

___
<a id="imiddlewareeventtype"></a>

###  IMiddlewareEventType

**Ƭ IMiddlewareEventType**: *"action" \| "flow_spawn" \| "flow_resume" \| "flow_resume_error" \| "flow_return" \| "flow_throw"*

___
<a id="imiddlewarehandler"></a>

###  IMiddlewareHandler

**Ƭ IMiddlewareHandler**: *`function`*

#### Type declaration
▸(actionCall: *[IMiddlewareEvent](#imiddlewareevent)*, next: *`function`*, abort: *`function`*): `any`

**Parameters:**

| Name | Type |
| ------ | ------ |
| actionCall | [IMiddlewareEvent](#imiddlewareevent) |
| next | `function` |
| abort | `function` |

**Returns:** `any`

___
<a id="itypedispatcher"></a>

###  ITypeDispatcher

**Ƭ ITypeDispatcher**: *`function`*

#### Type declaration
▸(snapshot: *`any`*): [IAnyType](#ianytype)

**Parameters:**

| Name | Type |
| ------ | ------ |
| snapshot | `any` |

**Returns:** [IAnyType](#ianytype)

___
<a id="ivalidationcontext"></a>

###  IValidationContext

**Ƭ IValidationContext**: *[IValidationContextEntry](interfaces/ivalidationcontextentry.md)[]*

Array of validation context entries

___
<a id="ivalidationresult"></a>

###  IValidationResult

**Ƭ IValidationResult**: *[IValidationError](interfaces/ivalidationerror.md)[]*

Type validation result, which is an array of type validation errors

___
<a id="instance"></a>

###  Instance

**Ƭ Instance**: *`Instance<T>`*

The instance representation of a given type.

___
<a id="livelinessmode"></a>

###  LivelinessMode

**Ƭ LivelinessMode**: *"warn" \| "error" \| "ignore"*

Defines what MST should do when running into reads / writes to objects that have died.

*   `"warn"`: Print a warning (default).
*   `"error"`: Throw an exception.
*   "`ignore`": Do nothing.

___
<a id="onreferenceinvalidated"></a>

###  OnReferenceInvalidated

**Ƭ OnReferenceInvalidated**: *`function`*

#### Type declaration
▸(event: *[OnReferenceInvalidatedEvent](#onreferenceinvalidatedevent)<`STN`>*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | [OnReferenceInvalidatedEvent](#onreferenceinvalidatedevent)<`STN`> |

**Returns:** `void`

___
<a id="onreferenceinvalidatedevent"></a>

###  OnReferenceInvalidatedEvent

**Ƭ OnReferenceInvalidatedEvent**: *`object`*

#### Type declaration

___
<a id="referenceidentifier"></a>

###  ReferenceIdentifier

**Ƭ ReferenceIdentifier**: *`string` \| `number`*

Valid types for identifiers.

___
<a id="referenceoptions"></a>

###  ReferenceOptions

**Ƭ ReferenceOptions**: *[ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)<`IT`> \| [ReferenceOptionsOnInvalidated](interfaces/referenceoptionsoninvalidated.md)<`IT`> \| [ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)<`IT`> & [ReferenceOptionsOnInvalidated](interfaces/referenceoptionsoninvalidated.md)<`IT`>*

___
<a id="snapshotin"></a>

###  SnapshotIn

**Ƭ SnapshotIn**: *`SnapshotIn<T>`*

The input (creation) snapshot representation of a given type.

___
<a id="snapshotorinstance"></a>

###  SnapshotOrInstance

**Ƭ SnapshotOrInstance**: *[SnapshotIn](#snapshotin)<`T`> \| [Instance](#instance)<`T`>*

A type which is equivalent to the union of SnapshotIn and Instance types of a given typeof TYPE or typeof VARIABLE. For primitives it defaults to the primitive itself.

For example:

*   `SnapshotOrInstance<typeof ModelA> = SnapshotIn<typeof ModelA> | Instance<typeof ModelA>`
*   `SnapshotOrInstance<typeof self.a (where self.a is a ModelA)> = SnapshotIn<typeof ModelA> | Instance<typeof ModelA>`

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
<a id="snapshotout"></a>

###  SnapshotOut

**Ƭ SnapshotOut**: *`SnapshotOut<T>`*

The output snapshot representation of a given type.

___

## Variables

<a id="dateprimitive"></a>

### `<Const>` DatePrimitive

**● DatePrimitive**: *[IType](interfaces/itype.md)<`number` \| `Date`, `number`, `Date`>* =  new CoreType<
    number | Date,
    number,
    Date
>(
    "Date",
    TypeFlags.Date,
    v => typeof v === "number" || v instanceof Date,
    v => (v instanceof Date ? v : new Date(v))
)

`types.Date` - Creates a type that can only contain a javascript Date value.

Example:

```ts
const LogLine = types.model({
  timestamp: types.Date,
})

LogLine.create({ timestamp: new Date() })
```

___
<a id="boolean"></a>

### `<Const>` boolean

**● boolean**: *[ISimpleType](interfaces/isimpletype.md)<`boolean`>* =  new CoreType<boolean, boolean, boolean>(
    "boolean",
    TypeFlags.Boolean,
    v => typeof v === "boolean"
)

`types.boolean` - Creates a type that can only contain a boolean value. This type is used for boolean values by default

Example:

```ts
const Thing = types.model({
  isCool: types.boolean,
  isAwesome: false
})
```

___
<a id="identifier"></a>

### `<Const>` identifier

**● identifier**: *[ISimpleType](interfaces/isimpletype.md)<`string`>* =  new IdentifierType()

`types.identifier` - Identifiers are used to make references, lifecycle events and reconciling works. Inside a state tree, for each type can exist only one instance for each given identifier. For example there couldn't be 2 instances of user with id 1. If you need more, consider using references. Identifier can be used only as type property of a model. This type accepts as parameter the value type of the identifier field that can be either string or number.

Example:

```ts
 const Todo = types.model("Todo", {
     id: types.identifier,
     title: types.string
 })
```
*__returns__*: 

___
<a id="identifiernumber"></a>

### `<Const>` identifierNumber

**● identifierNumber**: *[ISimpleType](interfaces/isimpletype.md)<`number`>* =  new IdentifierNumberType()

`types.identifierNumber` - Similar to `types.identifier`. This one will serialize from / to a number when applying snapshots

Example:

```ts
 const Todo = types.model("Todo", {
     id: types.identifierNumber,
     title: types.string
 })
```
*__returns__*: 

___
<a id="integer"></a>

### `<Const>` integer

**● integer**: *[ISimpleType](interfaces/isimpletype.md)<`number`>* =  new CoreType<number, number, number>(
    "integer",
    TypeFlags.Integer,
    v => isInteger(v)
)

`types.integer` - Creates a type that can only contain an integer value. This type is used for integer values by default

Example:

```ts
const Size = types.model({
  width: types.integer,
  height: 10
})
```

___
<a id="nulltype"></a>

### `<Const>` nullType

**● nullType**: *[ISimpleType](interfaces/isimpletype.md)<`null`>* =  new CoreType<null, null, null>(
    "null",
    TypeFlags.Null,
    v => v === null
)

`types.null` - The type of the value `null`

___
<a id="number"></a>

### `<Const>` number

**● number**: *[ISimpleType](interfaces/isimpletype.md)<`number`>* =  new CoreType<number, number, number>(
    "number",
    TypeFlags.Number,
    v => typeof v === "number"
)

`types.number` - Creates a type that can only contain a numeric value. This type is used for numeric values by default

Example:

```ts
const Vector = types.model({
  x: types.number,
  y: 1.5
})
```

___
<a id="string"></a>

### `<Const>` string

**● string**: *[ISimpleType](interfaces/isimpletype.md)<`string`>* =  new CoreType<string, string, string>(
    "string",
    TypeFlags.String,
    v => typeof v === "string"
)

`types.string` - Creates a type that can only contain a string value. This type is used for string values by default

Example:

```ts
const Person = types.model({
  firstName: types.string,
  lastName: "Doe"
})
```

___
<a id="undefinedtype"></a>

### `<Const>` undefinedType

**● undefinedType**: *[ISimpleType](interfaces/isimpletype.md)<`undefined`>* =  new CoreType<undefined, undefined, undefined>(
    "undefined",
    TypeFlags.Undefined,
    v => v === undefined
)

`types.undefined` - The type of the value `undefined`

___

## Functions

<a id="adddisposer"></a>

###  addDisposer

▸ **addDisposer**(target: *`IAnyStateTreeNode`*, disposer: *`function`*): `function`

Use this utility to register a function that should be called whenever the targeted state tree node is destroyed. This is a useful alternative to managing cleanup methods yourself using the `beforeDestroy` hook.

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

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IAnyStateTreeNode` |  \- |
| disposer | `function` |  \- |

**Returns:** `function`
The same disposer that was passed as argument

___
<a id="addmiddleware"></a>

###  addMiddleware

▸ **addMiddleware**(target: *`IAnyStateTreeNode`*, handler: *[IMiddlewareHandler](#imiddlewarehandler)*, includeHooks?: *`boolean`*): [IDisposer](#idisposer)

Middleware can be used to intercept any action is invoked on the subtree where it is attached. If a tree is protected (by default), this means that any mutation of the tree will pass through your middleware.

For more details, see the [middleware docs](../middleware.md)

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| target | `IAnyStateTreeNode` | - |  Node to apply the middleware to. |
| handler | [IMiddlewareHandler](#imiddlewarehandler) | - |
| `Default value` includeHooks | `boolean` | true |

**Returns:** [IDisposer](#idisposer)
A callable function to dispose the middleware.

___
<a id="applyaction"></a>

###  applyAction

▸ **applyAction**(target: *`IAnyStateTreeNode`*, actions: *[ISerializedActionCall](interfaces/iserializedactioncall.md) \| [ISerializedActionCall](interfaces/iserializedactioncall.md)[]*): `void`

Applies an action or a series of actions in a single MobX transaction. Does not return any value Takes an action description as produced by the `onAction` middleware.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IAnyStateTreeNode` |  \- |
| actions | [ISerializedActionCall](interfaces/iserializedactioncall.md) \| [ISerializedActionCall](interfaces/iserializedactioncall.md)[] |   |

**Returns:** `void`

___
<a id="applypatch"></a>

###  applyPatch

▸ **applyPatch**(target: *`IAnyStateTreeNode`*, patch: *[IJsonPatch](interfaces/ijsonpatch.md) \| `ReadonlyArray`<[IJsonPatch](interfaces/ijsonpatch.md)>*): `void`

Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied See [patches](https://github.com/mobxjs/mobx-state-tree#patches) for more details.

Can apply a single past, or an array of patches.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IAnyStateTreeNode` |  \- |
| patch | [IJsonPatch](interfaces/ijsonpatch.md) \| `ReadonlyArray`<[IJsonPatch](interfaces/ijsonpatch.md)> |  \- |

**Returns:** `void`

___
<a id="applysnapshot"></a>

###  applySnapshot

▸ **applySnapshot**<`C`>(target: *`IStateTreeNode`<`C`, `any`>*, snapshot: *`C`*): `void`

Applies a snapshot to a given model instances. Patch and snapshot listeners will be invoked as usual.

**Type parameters:**

#### C 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IStateTreeNode`<`C`, `any`> |  \- |
| snapshot | `C` |  \- |

**Returns:** `void`

___
<a id="array"></a>

###  array

▸ **array**<`IT`>(subtype: *`IT`*): `IArrayType`<`IT`>

`types.array` - Creates an index based collection type who's children are all of a uniform declared type.

This type will always produce [observable arrays](https://mobx.js.org/refguide/array.html)

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

#### IT :  [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| subtype | `IT` |  \- |

**Returns:** `IArrayType`<`IT`>

___
<a id="cast"></a>

###  cast

▸ **cast**<`O`>(snapshotOrInstance: *`O`*): `O`

▸ **cast**<`I`,`O`>(snapshotOrInstance: *`I`*): `O`

▸ **cast**<`I`,`O`>(snapshotOrInstance: *`I` \| `O`*): `O`

Casts a node snapshot or instance type to an instance type so it can be assigned to a type instance. Note that this is just a cast for the type system, this is, it won't actually convert a snapshot to an instance, but just fool typescript into thinking so. Either way, casting when outside an assignation operation won't compile.

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

#### O :  `ModelPrimitive`
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| snapshotOrInstance | `O` |  Snapshot or instance |

**Returns:** `O`
The same object casted as an instance

Casts a node snapshot or instance type to an instance type so it can be assigned to a type instance. Note that this is just a cast for the type system, this is, it won't actually convert a snapshot to an instance, but just fool typescript into thinking so. Either way, casting when outside an assignation operation won't compile.

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

#### I :  `ExtractNodeC`<`O`>
#### O 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| snapshotOrInstance | `I` |  Snapshot or instance |

**Returns:** `O`
The same object casted as an instance

Casts a node snapshot or instance type to an instance type so it can be assigned to a type instance. Note that this is just a cast for the type system, this is, it won't actually convert a snapshot to an instance, but just fool typescript into thinking so. Either way, casting when outside an assignation operation won't compile.

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

#### I :  `ExtractNodeC`<`O`>
#### O 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| snapshotOrInstance | `I` \| `O` |  Snapshot or instance |

**Returns:** `O`
The same object casted as an instance

___
<a id="castflowreturn"></a>

###  castFlowReturn

▸ **castFlowReturn**<`T`>(val: *`T`*): `FlowReturn`<`T`>

Used for TypeScript to make flows that return a promise return the actual promise result.

**Type parameters:**

#### T 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| val | `T` |  \- |

**Returns:** `FlowReturn`<`T`>

___
<a id="casttoreferencesnapshot"></a>

###  castToReferenceSnapshot

▸ **castToReferenceSnapshot**<`I`>(instance: *`I`*): `Extract<I, IAnyStateTreeNode> extends never ? I : ReferenceIdentifier`

Casts a node instance type to a reference snapshot type so it can be assigned to a refernence snapshot (e.g. to be used inside a create call). Note that this is just a cast for the type system, this is, it won't actually convert an instance to a refererence snapshot, but just fool typescript into thinking so.

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
const b = ModelB.create({ refA: castToReference(a)})
```

**Type parameters:**

#### I 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| instance | `I` |  Instance |

**Returns:** `Extract<I, IAnyStateTreeNode> extends never ? I : ReferenceIdentifier`
The same object casted as an reference snapshot (string or number)

___
<a id="casttosnapshot"></a>

###  castToSnapshot

▸ **castToSnapshot**<`I`>(snapshotOrInstance: *`I`*): `Extract<I, IAnyStateTreeNode> extends never ? I : ExtractNodeC<I>`

Casts a node instance type to an snapshot type so it can be assigned to a type snapshot (e.g. to be used inside a create call). Note that this is just a cast for the type system, this is, it won't actually convert an instance to a snapshot, but just fool typescript into thinking so.

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

#### I 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| snapshotOrInstance | `I` |  Snapshot or instance |

**Returns:** `Extract<I, IAnyStateTreeNode> extends never ? I : ExtractNodeC<I>`
The same object casted as an input (creation) snapshot

___
<a id="clone"></a>

###  clone

▸ **clone**<`T`>(source: *`T`*, keepEnvironment?: *`boolean` \| `any`*): `T`

Returns a deep copy of the given state tree node as new tree. Short hand for `snapshot(x) = getType(x).create(getSnapshot(x))`

_Tip: clone will create a literal copy, including the same identifiers. To modify identifiers etc during cloning, don't use clone but take a snapshot of the tree, modify it, and create new instance_

**Type parameters:**

#### T :  `IAnyStateTreeNode`
**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| source | `T` | - |  \- |
| `Default value` keepEnvironment | `boolean` \| `any` | true |  indicates whether the clone should inherit the same environment (\`true\`, the default), or not have an environment (\`false\`). If an object is passed in as second argument, that will act as the environment for the cloned tree. |

**Returns:** `T`

___
<a id="compose"></a>

###  compose

▸ **compose**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`>(name: *`string`*, A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*): [IModelType](interfaces/imodeltype.md)<`PA` & `PB`, `OA` & `OB`, `_CustomJoin`<`FCA`, `FCB`>, `_CustomJoin`<`FSA`, `FSB`>>

▸ **compose**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`>(A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*): [IModelType](interfaces/imodeltype.md)<`PA` & `PB`, `OA` & `OB`, `_CustomJoin`<`FCA`, `FCB`>, `_CustomJoin`<`FSA`, `FSB`>>

▸ **compose**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`>(name: *`string`*, A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*): [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC`, `OA` & `OB` & `OC`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `FCC`>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `FSC`>>>

▸ **compose**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`>(A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*): [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC`, `OA` & `OB` & `OC`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `FCC`>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `FSC`>>>

▸ **compose**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`>(name: *`string`*, A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*): [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD`, `OA` & `OB` & `OC` & `OD`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `FCD`>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `FSD`>>>>

▸ **compose**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`>(A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*): [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD`, `OA` & `OB` & `OC` & `OD`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `FCD`>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `FSD`>>>>

▸ **compose**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`>(name: *`string`*, A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*): [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE`, `OA` & `OB` & `OC` & `OD` & `OE`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `FCE`>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `FSE`>>>>>

▸ **compose**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`>(A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*): [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE`, `OA` & `OB` & `OC` & `OD` & `OE`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `FCE`>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `FSE`>>>>>

▸ **compose**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`,`PF`,`OF`,`FCF`,`FSF`>(name: *`string`*, A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*, F: *[IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`>*): [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE` & `PF`, `OA` & `OB` & `OC` & `OD` & `OE` & `OF`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `_CustomJoin`<`FCE`, `FCF`>>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `_CustomJoin`<`FSE`, `FSF`>>>>>>

▸ **compose**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`,`PF`,`OF`,`FCF`,`FSF`>(A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*, F: *[IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`>*): [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE` & `PF`, `OA` & `OB` & `OC` & `OD` & `OE` & `OF`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `_CustomJoin`<`FCE`, `FCF`>>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `_CustomJoin`<`FSE`, `FSF`>>>>>>

▸ **compose**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`,`PF`,`OF`,`FCF`,`FSF`,`PG`,`OG`,`FCG`,`FSG`>(name: *`string`*, A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*, F: *[IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`>*, G: *[IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`>*): [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE` & `PF` & `PG`, `OA` & `OB` & `OC` & `OD` & `OE` & `OF` & `OG`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `_CustomJoin`<`FCE`, `_CustomJoin`<`FCF`, `FCG`>>>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `_CustomJoin`<`FSE`, `_CustomJoin`<`FSF`, `FSG`>>>>>>>

▸ **compose**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`,`PF`,`OF`,`FCF`,`FSF`,`PG`,`OG`,`FCG`,`FSG`>(A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*, F: *[IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`>*, G: *[IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`>*): [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE` & `PF` & `PG`, `OA` & `OB` & `OC` & `OD` & `OE` & `OF` & `OG`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `_CustomJoin`<`FCE`, `_CustomJoin`<`FCF`, `FCG`>>>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `_CustomJoin`<`FSE`, `_CustomJoin`<`FSF`, `FSG`>>>>>>>

▸ **compose**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`,`PF`,`OF`,`FCF`,`FSF`,`PG`,`OG`,`FCG`,`FSG`,`PH`,`OH`,`FCH`,`FSH`>(name: *`string`*, A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*, F: *[IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`>*, G: *[IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`>*, H: *[IModelType](interfaces/imodeltype.md)<`PH`, `OH`, `FCH`, `FSH`>*): [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE` & `PF` & `PG` & `PH`, `OA` & `OB` & `OC` & `OD` & `OE` & `OF` & `OG` & `OH`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `_CustomJoin`<`FCE`, `_CustomJoin`<`FCF`, `_CustomJoin`<`FCG`, `FCH`>>>>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `_CustomJoin`<`FSE`, `_CustomJoin`<`FSF`, `_CustomJoin`<`FSG`, `FSH`>>>>>>>>

▸ **compose**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`,`PF`,`OF`,`FCF`,`FSF`,`PG`,`OG`,`FCG`,`FSG`,`PH`,`OH`,`FCH`,`FSH`>(A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*, F: *[IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`>*, G: *[IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`>*, H: *[IModelType](interfaces/imodeltype.md)<`PH`, `OH`, `FCH`, `FSH`>*): [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE` & `PF` & `PG` & `PH`, `OA` & `OB` & `OC` & `OD` & `OE` & `OF` & `OG` & `OH`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `_CustomJoin`<`FCE`, `_CustomJoin`<`FCF`, `_CustomJoin`<`FCG`, `FCH`>>>>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `_CustomJoin`<`FSE`, `_CustomJoin`<`FSF`, `_CustomJoin`<`FSG`, `FSH`>>>>>>>>

▸ **compose**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`,`PF`,`OF`,`FCF`,`FSF`,`PG`,`OG`,`FCG`,`FSG`,`PH`,`OH`,`FCH`,`FSH`,`PI`,`OI`,`FCI`,`FSI`>(name: *`string`*, A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*, F: *[IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`>*, G: *[IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`>*, H: *[IModelType](interfaces/imodeltype.md)<`PH`, `OH`, `FCH`, `FSH`>*, I: *[IModelType](interfaces/imodeltype.md)<`PI`, `OI`, `FCI`, `FSI`>*): [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE` & `PF` & `PG` & `PH` & `PI`, `OA` & `OB` & `OC` & `OD` & `OE` & `OF` & `OG` & `OH` & `OI`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `_CustomJoin`<`FCE`, `_CustomJoin`<`FCF`, `_CustomJoin`<`FCG`, `_CustomJoin`<`FCH`, `FCI`>>>>>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `_CustomJoin`<`FSE`, `_CustomJoin`<`FSF`, `_CustomJoin`<`FSG`, `_CustomJoin`<`FSH`, `FSI`>>>>>>>>>

▸ **compose**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`,`PF`,`OF`,`FCF`,`FSF`,`PG`,`OG`,`FCG`,`FSG`,`PH`,`OH`,`FCH`,`FSH`,`PI`,`OI`,`FCI`,`FSI`>(A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*, F: *[IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`>*, G: *[IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`>*, H: *[IModelType](interfaces/imodeltype.md)<`PH`, `OH`, `FCH`, `FSH`>*, I: *[IModelType](interfaces/imodeltype.md)<`PI`, `OI`, `FCI`, `FSI`>*): [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE` & `PF` & `PG` & `PH` & `PI`, `OA` & `OB` & `OC` & `OD` & `OE` & `OF` & `OG` & `OH` & `OI`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `_CustomJoin`<`FCE`, `_CustomJoin`<`FCF`, `_CustomJoin`<`FCG`, `_CustomJoin`<`FCH`, `FCI`>>>>>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `_CustomJoin`<`FSE`, `_CustomJoin`<`FSF`, `_CustomJoin`<`FSG`, `_CustomJoin`<`FSH`, `FSI`>>>>>>>>>

`types.compose` - Composes a new model from one or more existing model types. This method can be invoked in two forms: Given 2 or more model types, the types are composed into a new Type. Given first parameter as a string and 2 or more model types, the types are composed into a new Type with the given name

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |

**Returns:** [IModelType](interfaces/imodeltype.md)<`PA` & `PB`, `OA` & `OB`, `_CustomJoin`<`FCA`, `FCB`>, `_CustomJoin`<`FSA`, `FSB`>>

`types.compose` - Composes a new model from one or more existing model types. This method can be invoked in two forms: Given 2 or more model types, the types are composed into a new Type. Given first parameter as a string and 2 or more model types, the types are composed into a new Type with the given name

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |

**Returns:** [IModelType](interfaces/imodeltype.md)<`PA` & `PB`, `OA` & `OB`, `_CustomJoin`<`FCA`, `FCB`>, `_CustomJoin`<`FSA`, `FSB`>>

`types.compose` - Composes a new model from one or more existing model types. This method can be invoked in two forms: Given 2 or more model types, the types are composed into a new Type. Given first parameter as a string and 2 or more model types, the types are composed into a new Type with the given name

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |

**Returns:** [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC`, `OA` & `OB` & `OC`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `FCC`>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `FSC`>>>

`types.compose` - Composes a new model from one or more existing model types. This method can be invoked in two forms: Given 2 or more model types, the types are composed into a new Type. Given first parameter as a string and 2 or more model types, the types are composed into a new Type with the given name

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |

**Returns:** [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC`, `OA` & `OB` & `OC`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `FCC`>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `FSC`>>>

`types.compose` - Composes a new model from one or more existing model types. This method can be invoked in two forms: Given 2 or more model types, the types are composed into a new Type. Given first parameter as a string and 2 or more model types, the types are composed into a new Type with the given name

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |

**Returns:** [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD`, `OA` & `OB` & `OC` & `OD`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `FCD`>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `FSD`>>>>

`types.compose` - Composes a new model from one or more existing model types. This method can be invoked in two forms: Given 2 or more model types, the types are composed into a new Type. Given first parameter as a string and 2 or more model types, the types are composed into a new Type with the given name

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |

**Returns:** [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD`, `OA` & `OB` & `OC` & `OD`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `FCD`>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `FSD`>>>>

`types.compose` - Composes a new model from one or more existing model types. This method can be invoked in two forms: Given 2 or more model types, the types are composed into a new Type. Given first parameter as a string and 2 or more model types, the types are composed into a new Type with the given name

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |

**Returns:** [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE`, `OA` & `OB` & `OC` & `OD` & `OE`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `FCE`>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `FSE`>>>>>

`types.compose` - Composes a new model from one or more existing model types. This method can be invoked in two forms: Given 2 or more model types, the types are composed into a new Type. Given first parameter as a string and 2 or more model types, the types are composed into a new Type with the given name

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |

**Returns:** [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE`, `OA` & `OB` & `OC` & `OD` & `OE`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `FCE`>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `FSE`>>>>>

`types.compose` - Composes a new model from one or more existing model types. This method can be invoked in two forms: Given 2 or more model types, the types are composed into a new Type. Given first parameter as a string and 2 or more model types, the types are composed into a new Type with the given name

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
#### PF :  `ModelProperties`
#### OF 
#### FCF 
#### FSF 
**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |
| F | [IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`> |

**Returns:** [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE` & `PF`, `OA` & `OB` & `OC` & `OD` & `OE` & `OF`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `_CustomJoin`<`FCE`, `FCF`>>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `_CustomJoin`<`FSE`, `FSF`>>>>>>

`types.compose` - Composes a new model from one or more existing model types. This method can be invoked in two forms: Given 2 or more model types, the types are composed into a new Type. Given first parameter as a string and 2 or more model types, the types are composed into a new Type with the given name

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
#### PF :  `ModelProperties`
#### OF 
#### FCF 
#### FSF 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |
| F | [IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`> |

**Returns:** [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE` & `PF`, `OA` & `OB` & `OC` & `OD` & `OE` & `OF`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `_CustomJoin`<`FCE`, `FCF`>>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `_CustomJoin`<`FSE`, `FSF`>>>>>>

`types.compose` - Composes a new model from one or more existing model types. This method can be invoked in two forms: Given 2 or more model types, the types are composed into a new Type. Given first parameter as a string and 2 or more model types, the types are composed into a new Type with the given name

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
#### PF :  `ModelProperties`
#### OF 
#### FCF 
#### FSF 
#### PG :  `ModelProperties`
#### OG 
#### FCG 
#### FSG 
**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |
| F | [IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`> |
| G | [IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`> |

**Returns:** [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE` & `PF` & `PG`, `OA` & `OB` & `OC` & `OD` & `OE` & `OF` & `OG`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `_CustomJoin`<`FCE`, `_CustomJoin`<`FCF`, `FCG`>>>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `_CustomJoin`<`FSE`, `_CustomJoin`<`FSF`, `FSG`>>>>>>>

`types.compose` - Composes a new model from one or more existing model types. This method can be invoked in two forms: Given 2 or more model types, the types are composed into a new Type. Given first parameter as a string and 2 or more model types, the types are composed into a new Type with the given name

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
#### PF :  `ModelProperties`
#### OF 
#### FCF 
#### FSF 
#### PG :  `ModelProperties`
#### OG 
#### FCG 
#### FSG 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |
| F | [IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`> |
| G | [IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`> |

**Returns:** [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE` & `PF` & `PG`, `OA` & `OB` & `OC` & `OD` & `OE` & `OF` & `OG`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `_CustomJoin`<`FCE`, `_CustomJoin`<`FCF`, `FCG`>>>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `_CustomJoin`<`FSE`, `_CustomJoin`<`FSF`, `FSG`>>>>>>>

`types.compose` - Composes a new model from one or more existing model types. This method can be invoked in two forms: Given 2 or more model types, the types are composed into a new Type. Given first parameter as a string and 2 or more model types, the types are composed into a new Type with the given name

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
#### PF :  `ModelProperties`
#### OF 
#### FCF 
#### FSF 
#### PG :  `ModelProperties`
#### OG 
#### FCG 
#### FSG 
#### PH :  `ModelProperties`
#### OH 
#### FCH 
#### FSH 
**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |
| F | [IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`> |
| G | [IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`> |
| H | [IModelType](interfaces/imodeltype.md)<`PH`, `OH`, `FCH`, `FSH`> |

**Returns:** [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE` & `PF` & `PG` & `PH`, `OA` & `OB` & `OC` & `OD` & `OE` & `OF` & `OG` & `OH`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `_CustomJoin`<`FCE`, `_CustomJoin`<`FCF`, `_CustomJoin`<`FCG`, `FCH`>>>>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `_CustomJoin`<`FSE`, `_CustomJoin`<`FSF`, `_CustomJoin`<`FSG`, `FSH`>>>>>>>>

`types.compose` - Composes a new model from one or more existing model types. This method can be invoked in two forms: Given 2 or more model types, the types are composed into a new Type. Given first parameter as a string and 2 or more model types, the types are composed into a new Type with the given name

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
#### PF :  `ModelProperties`
#### OF 
#### FCF 
#### FSF 
#### PG :  `ModelProperties`
#### OG 
#### FCG 
#### FSG 
#### PH :  `ModelProperties`
#### OH 
#### FCH 
#### FSH 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |
| F | [IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`> |
| G | [IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`> |
| H | [IModelType](interfaces/imodeltype.md)<`PH`, `OH`, `FCH`, `FSH`> |

**Returns:** [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE` & `PF` & `PG` & `PH`, `OA` & `OB` & `OC` & `OD` & `OE` & `OF` & `OG` & `OH`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `_CustomJoin`<`FCE`, `_CustomJoin`<`FCF`, `_CustomJoin`<`FCG`, `FCH`>>>>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `_CustomJoin`<`FSE`, `_CustomJoin`<`FSF`, `_CustomJoin`<`FSG`, `FSH`>>>>>>>>

`types.compose` - Composes a new model from one or more existing model types. This method can be invoked in two forms: Given 2 or more model types, the types are composed into a new Type. Given first parameter as a string and 2 or more model types, the types are composed into a new Type with the given name

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
#### PF :  `ModelProperties`
#### OF 
#### FCF 
#### FSF 
#### PG :  `ModelProperties`
#### OG 
#### FCG 
#### FSG 
#### PH :  `ModelProperties`
#### OH 
#### FCH 
#### FSH 
#### PI :  `ModelProperties`
#### OI 
#### FCI 
#### FSI 
**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |
| F | [IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`> |
| G | [IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`> |
| H | [IModelType](interfaces/imodeltype.md)<`PH`, `OH`, `FCH`, `FSH`> |
| I | [IModelType](interfaces/imodeltype.md)<`PI`, `OI`, `FCI`, `FSI`> |

**Returns:** [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE` & `PF` & `PG` & `PH` & `PI`, `OA` & `OB` & `OC` & `OD` & `OE` & `OF` & `OG` & `OH` & `OI`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `_CustomJoin`<`FCE`, `_CustomJoin`<`FCF`, `_CustomJoin`<`FCG`, `_CustomJoin`<`FCH`, `FCI`>>>>>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `_CustomJoin`<`FSE`, `_CustomJoin`<`FSF`, `_CustomJoin`<`FSG`, `_CustomJoin`<`FSH`, `FSI`>>>>>>>>>

`types.compose` - Composes a new model from one or more existing model types. This method can be invoked in two forms: Given 2 or more model types, the types are composed into a new Type. Given first parameter as a string and 2 or more model types, the types are composed into a new Type with the given name

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
#### PF :  `ModelProperties`
#### OF 
#### FCF 
#### FSF 
#### PG :  `ModelProperties`
#### OG 
#### FCG 
#### FSG 
#### PH :  `ModelProperties`
#### OH 
#### FCH 
#### FSH 
#### PI :  `ModelProperties`
#### OI 
#### FCI 
#### FSI 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |
| F | [IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`> |
| G | [IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`> |
| H | [IModelType](interfaces/imodeltype.md)<`PH`, `OH`, `FCH`, `FSH`> |
| I | [IModelType](interfaces/imodeltype.md)<`PI`, `OI`, `FCI`, `FSI`> |

**Returns:** [IModelType](interfaces/imodeltype.md)<`PA` & `PB` & `PC` & `PD` & `PE` & `PF` & `PG` & `PH` & `PI`, `OA` & `OB` & `OC` & `OD` & `OE` & `OF` & `OG` & `OH` & `OI`, `_CustomJoin`<`FCA`, `_CustomJoin`<`FCB`, `_CustomJoin`<`FCC`, `_CustomJoin`<`FCD`, `_CustomJoin`<`FCE`, `_CustomJoin`<`FCF`, `_CustomJoin`<`FCG`, `_CustomJoin`<`FCH`, `FCI`>>>>>>>>, `_CustomJoin`<`FSA`, `_CustomJoin`<`FSB`, `_CustomJoin`<`FSC`, `_CustomJoin`<`FSD`, `_CustomJoin`<`FSE`, `_CustomJoin`<`FSF`, `_CustomJoin`<`FSG`, `_CustomJoin`<`FSH`, `FSI`>>>>>>>>>

___
<a id="createactiontrackingmiddleware"></a>

###  createActionTrackingMiddleware

▸ **createActionTrackingMiddleware**<`T`>(hooks: *[IActionTrackingMiddlewareHooks](interfaces/iactiontrackingmiddlewarehooks.md)<`T`>*): [IMiddlewareHandler](#imiddlewarehandler)

Convenience utility to create action based middleware that supports async processes more easily. All hooks are called for both synchronous and asynchronous actions. Except that either `onSuccess` or `onFail` is called

The create middleware tracks the process of an action (assuming it passes the `filter`). `onResume` can return any value, which will be passed as second argument to any other hook. This makes it possible to keep state during a process.

See the `atomic` middleware for an example

**Type parameters:**

#### T 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| hooks | [IActionTrackingMiddlewareHooks](interfaces/iactiontrackingmiddlewarehooks.md)<`T`> |  \- |

**Returns:** [IMiddlewareHandler](#imiddlewarehandler)

___
<a id="custom"></a>

###  custom

▸ **custom**<`S`,`T`>(options: *[CustomTypeOptions](interfaces/customtypeoptions.md)<`S`, `T`>*): [IType](interfaces/itype.md)<`S` \| `T`, `S`, `T`>

`types.custom` - Creates a custom type. Custom types can be used for arbitrary immutable values, that have a serializable representation. For example, to create your own Date representation, Decimal type etc.

The signature of the options is:

```ts
export interface CustomTypeOptions<S, T> {
    // Friendly name
    name: string
    // given a serialized value, how to turn it into the target type
    fromSnapshot(snapshot: S): T
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

#### S 
#### T 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| options | [CustomTypeOptions](interfaces/customtypeoptions.md)<`S`, `T`> |  \- |

**Returns:** [IType](interfaces/itype.md)<`S` \| `T`, `S`, `T`>

___
<a id="decorate"></a>

###  decorate

▸ **decorate**<`T`>(handler: *[IMiddlewareHandler](#imiddlewarehandler)*, fn: *`T`*): `T`

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

#### T :  `Function`
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| handler | [IMiddlewareHandler](#imiddlewarehandler) |  \- |
| fn | `T` |  \- |

**Returns:** `T`
The original function

___
<a id="destroy"></a>

###  destroy

▸ **destroy**(target: *`IAnyStateTreeNode`*): `void`

Removes a model element from the state tree, and mark it as end-of-life; the element should not be used anymore

**Parameters:**

| Name | Type |
| ------ | ------ |
| target | `IAnyStateTreeNode` |

**Returns:** `void`

___
<a id="detach"></a>

###  detach

▸ **detach**<`T`>(target: *`T`*): `T`

Removes a model element from the state tree, and let it live on as a new state tree

**Type parameters:**

#### T :  `IAnyStateTreeNode`
**Parameters:**

| Name | Type |
| ------ | ------ |
| target | `T` |

**Returns:** `T`

___
<a id="enumeration"></a>

###  enumeration

▸ **enumeration**<`T`>(options: *`T`[]*): [ISimpleType](interfaces/isimpletype.md)<`UnionStringArray`<`T`[]>>

▸ **enumeration**<`T`>(name: *`string`*, options: *`T`[]*): [ISimpleType](interfaces/isimpletype.md)<`UnionStringArray`<`T`[]>>

`types.enumeration` - Can be used to create an string based enumeration. (note: this methods is just sugar for a union of string literals)

Example:

```ts
const TrafficLight = types.model({
  color: types.enumeration("Color", ["Red", "Orange", "Green"])
})
```

**Type parameters:**

#### T :  `string`
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| options | `T`[] |  possible values this enumeration can have |

**Returns:** [ISimpleType](interfaces/isimpletype.md)<`UnionStringArray`<`T`[]>>

`types.enumeration` - Can be used to create an string based enumeration. (note: this methods is just sugar for a union of string literals)

Example:

```ts
const TrafficLight = types.model({
  color: types.enumeration("Color", ["Red", "Orange", "Green"])
})
```

**Type parameters:**

#### T :  `string`
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  descriptive name of the enumeration (optional) |
| options | `T`[] |  possible values this enumeration can have |

**Returns:** [ISimpleType](interfaces/isimpletype.md)<`UnionStringArray`<`T`[]>>

___
<a id="escapejsonpath"></a>

###  escapeJsonPath

▸ **escapeJsonPath**(path: *`string`*): `string`

Escape slashes and backslashes.

[http://tools.ietf.org/html/rfc6901](http://tools.ietf.org/html/rfc6901)

**Parameters:**

| Name | Type |
| ------ | ------ |
| path | `string` |

**Returns:** `string`

___
<a id="flow"></a>

###  flow

▸ **flow**<`R`,`Args`>(generator: *`function`*): `function`

See [asynchronous actions](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/async-actions.md).

**Type parameters:**

#### R 
#### Args :  `any`[]
**Parameters:**

| Name | Type |
| ------ | ------ |
| generator | `function` |

**Returns:** `function`
The flow as a promise.

___
<a id="frozen"></a>

###  frozen

▸ **frozen**<`C`>(subType: *[IType](interfaces/itype.md)<`C`, `any`, `any`>*): [IType](interfaces/itype.md)<`C`, `C`, `C`>

▸ **frozen**<`T`>(defaultValue: *`T`*): [IType](interfaces/itype.md)<`T` \| `undefined` \| `null`, `T`, `T`> & `OptionalProperty`

▸ **frozen**<`T`>(): [IType](interfaces/itype.md)<`T`, `T`, `T`>

`types.frozen` - Frozen can be used to store any value that is serializable in itself (that is valid JSON). Frozen values need to be immutable or treated as if immutable. They need be serializable as well. Values stored in frozen will snapshotted as-is by MST, and internal changes will not be tracked.

This is useful to store complex, but immutable values like vectors etc. It can form a powerful bridge to parts of your application that should be immutable, or that assume data to be immutable.

Note: if you want to store free-form state that is mutable, or not serializeable, consider using volatile state instead.

Frozen properties can be defined in three different ways

1.  `types.frozen(SubType)` - provide a valid MST type and frozen will check if the provided data conforms the snapshot for that type
2.  `types.frozen({ someDefaultValue: true})` - provide a primitive value, object or array, and MST will infer the type from that object, and also make it the default value for the field
3.  `types.frozen<TypeScriptType>()` - provide a typescript type, to help in strongly typing the field (design time only)

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

#### C 
**Parameters:**

| Name | Type |
| ------ | ------ |
| subType | [IType](interfaces/itype.md)<`C`, `any`, `any`> |

**Returns:** [IType](interfaces/itype.md)<`C`, `C`, `C`>

`types.frozen` - Frozen can be used to store any value that is serializable in itself (that is valid JSON). Frozen values need to be immutable or treated as if immutable. They need be serializable as well. Values stored in frozen will snapshotted as-is by MST, and internal changes will not be tracked.

This is useful to store complex, but immutable values like vectors etc. It can form a powerful bridge to parts of your application that should be immutable, or that assume data to be immutable.

Note: if you want to store free-form state that is mutable, or not serializeable, consider using volatile state instead.

Frozen properties can be defined in three different ways

1.  `types.frozen(SubType)` - provide a valid MST type and frozen will check if the provided data conforms the snapshot for that type
2.  `types.frozen({ someDefaultValue: true})` - provide a primitive value, object or array, and MST will infer the type from that object, and also make it the default value for the field
3.  `types.frozen<TypeScriptType>()` - provide a typescript type, to help in strongly typing the field (design time only)

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

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| defaultValue | `T` |

**Returns:** [IType](interfaces/itype.md)<`T` \| `undefined` \| `null`, `T`, `T`> & `OptionalProperty`

`types.frozen` - Frozen can be used to store any value that is serializable in itself (that is valid JSON). Frozen values need to be immutable or treated as if immutable. They need be serializable as well. Values stored in frozen will snapshotted as-is by MST, and internal changes will not be tracked.

This is useful to store complex, but immutable values like vectors etc. It can form a powerful bridge to parts of your application that should be immutable, or that assume data to be immutable.

Note: if you want to store free-form state that is mutable, or not serializeable, consider using volatile state instead.

Frozen properties can be defined in three different ways

1.  `types.frozen(SubType)` - provide a valid MST type and frozen will check if the provided data conforms the snapshot for that type
2.  `types.frozen({ someDefaultValue: true})` - provide a primitive value, object or array, and MST will infer the type from that object, and also make it the default value for the field
3.  `types.frozen<TypeScriptType>()` - provide a typescript type, to help in strongly typing the field (design time only)

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

#### T 

**Returns:** [IType](interfaces/itype.md)<`T`, `T`, `T`>

___
<a id="getchildtype"></a>

###  getChildType

▸ **getChildType**(object: *`IAnyStateTreeNode`*, child: *`string`*): [IAnyType](#ianytype)

Returns the _declared_ type of the given sub property of an object, array or map.

Example:

```ts
const Box = types.model({ x: 0, y: 0 })
const box = Box.create()

console.log(getChildType(box, "x").name) // 'number'
```

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| object | `IAnyStateTreeNode` |  \- |
| child | `string` |  \- |

**Returns:** [IAnyType](#ianytype)

___
<a id="getenv"></a>

###  getEnv

▸ **getEnv**<`T`>(target: *`IAnyStateTreeNode`*): `T`

Returns the environment of the current state tree. For more info on environments, see [Dependency injection](https://github.com/mobxjs/mobx-state-tree#dependency-injection)

Please note that in child nodes access to the root is only possible once the `afterAttach` hook has fired

Returns an empty environment if the tree wasn't initialized with an environment

**Type parameters:**

#### T 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IAnyStateTreeNode` |  \- |

**Returns:** `T`

___
<a id="getidentifier"></a>

###  getIdentifier

▸ **getIdentifier**(target: *`IAnyStateTreeNode`*): `string` \| `null`

Returns the identifier of the target node. This is the _string normalized_ identifier, which might not match the type of the identifier attribute

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IAnyStateTreeNode` |  \- |

**Returns:** `string` \| `null`

___
<a id="getlivelinesschecking"></a>

###  getLivelinessChecking

▸ **getLivelinessChecking**(): [LivelinessMode](#livelinessmode)

Returns the current liveliness checking mode.

**Returns:** [LivelinessMode](#livelinessmode)
`"warn"`, `"error"` or `"ignore"`

___
<a id="getmembers"></a>

###  getMembers

▸ **getMembers**(target: *`IAnyStateTreeNode`*): [IModelReflectionData](interfaces/imodelreflectiondata.md)

Returns a reflection of the model node, including name, properties, views, volatile and actions.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IAnyStateTreeNode` |  \- |

**Returns:** [IModelReflectionData](interfaces/imodelreflectiondata.md)

___
<a id="getparent"></a>

###  getParent

▸ **getParent**<`IT`>(target: *`IAnyStateTreeNode`*, depth?: *`number`*): `TypeOrStateTreeNodeToStateTreeNode`<`IT`>

Returns the immediate parent of this object, or throws.

Note that the immediate parent can be either an object, map or array, and doesn't necessarily refer to the parent model.

Please note that in child nodes access to the root is only possible once the `afterAttach` hook has fired.

**Type parameters:**

#### IT :  `IAnyStateTreeNode` \| [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| target | `IAnyStateTreeNode` | - |  \- |
| `Default value` depth | `number` | 1 |  How far should we look upward? 1 by default. |

**Returns:** `TypeOrStateTreeNodeToStateTreeNode`<`IT`>

___
<a id="getparentoftype"></a>

###  getParentOfType

▸ **getParentOfType**<`IT`>(target: *`IAnyStateTreeNode`*, type: *`IT`*): `ExtractT`<`IT`>

Returns the target's parent of a given type, or throws.

**Type parameters:**

#### IT :  [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IAnyStateTreeNode` |  \- |
| type | `IT` |  \- |

**Returns:** `ExtractT`<`IT`>

___
<a id="getpath"></a>

###  getPath

▸ **getPath**(target: *`IAnyStateTreeNode`*): `string`

Returns the path of the given object in the model tree

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IAnyStateTreeNode` |  \- |

**Returns:** `string`

___
<a id="getpathparts"></a>

###  getPathParts

▸ **getPathParts**(target: *`IAnyStateTreeNode`*): `string`[]

Returns the path of the given object as unescaped string array.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IAnyStateTreeNode` |  \- |

**Returns:** `string`[]

___
<a id="getpropertymembers"></a>

###  getPropertyMembers

▸ **getPropertyMembers**(typeOrNode: *[IAnyModelType](interfaces/ianymodeltype.md) \| `IStateTreeNode`*): [IModelReflectionPropertiesData](interfaces/imodelreflectionpropertiesdata.md)

Returns a reflection of the model type properties and name for either a model type or model node.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| typeOrNode | [IAnyModelType](interfaces/ianymodeltype.md) \| `IStateTreeNode` |  \- |

**Returns:** [IModelReflectionPropertiesData](interfaces/imodelreflectionpropertiesdata.md)

___
<a id="getrelativepath"></a>

###  getRelativePath

▸ **getRelativePath**(base: *`IAnyStateTreeNode`*, target: *`IAnyStateTreeNode`*): `string`

Given two state tree nodes that are part of the same tree, returns the shortest jsonpath needed to navigate from the one to the other

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| base | `IAnyStateTreeNode` |  \- |
| target | `IAnyStateTreeNode` |  \- |

**Returns:** `string`

___
<a id="getroot"></a>

###  getRoot

▸ **getRoot**<`IT`>(target: *`IAnyStateTreeNode`*): `TypeOrStateTreeNodeToStateTreeNode`<`IT`>

Given an object in a model tree, returns the root object of that tree.

Please note that in child nodes access to the root is only possible once the `afterAttach` hook has fired.

**Type parameters:**

#### IT :  [IAnyType](#ianytype) \| `IAnyStateTreeNode`
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IAnyStateTreeNode` |  \- |

**Returns:** `TypeOrStateTreeNodeToStateTreeNode`<`IT`>

___
<a id="getsnapshot"></a>

###  getSnapshot

▸ **getSnapshot**<`S`>(target: *`IStateTreeNode`<`any`, `S`>*, applyPostProcess?: *`boolean`*): `S`

Calculates a snapshot from the given model instance. The snapshot will always reflect the latest state but use structural sharing where possible. Doesn't require MobX transactions to be completed.

**Type parameters:**

#### S 
**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| target | `IStateTreeNode`<`any`, `S`> | - |  \- |
| `Default value` applyPostProcess | `boolean` | true |  If true (the default) then postProcessSnapshot gets applied. |

**Returns:** `S`

___
<a id="gettype"></a>

###  getType

▸ **getType**(object: *`IAnyStateTreeNode`*): [IAnyType](#ianytype)

Returns the _actual_ type of the given tree node. (Or throws)

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| object | `IAnyStateTreeNode` |  \- |

**Returns:** [IAnyType](#ianytype)

___
<a id="hasparent"></a>

###  hasParent

▸ **hasParent**(target: *`IAnyStateTreeNode`*, depth?: *`number`*): `boolean`

Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| target | `IAnyStateTreeNode` | - |  \- |
| `Default value` depth | `number` | 1 |  How far should we look upward? 1 by default. |

**Returns:** `boolean`

___
<a id="hasparentoftype"></a>

###  hasParentOfType

▸ **hasParentOfType**(target: *`IAnyStateTreeNode`*, type: *[IAnyType](#ianytype)*): `boolean`

Given a model instance, returns `true` if the object has a parent of given type, that is, is part of another object, map or array

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IAnyStateTreeNode` |  \- |
| type | [IAnyType](#ianytype) |  \- |

**Returns:** `boolean`

___
<a id="isalive"></a>

###  isAlive

▸ **isAlive**(target: *`IAnyStateTreeNode`*): `boolean`

Returns true if the given state tree node is not killed yet. This means that the node is still a part of a tree, and that `destroy` has not been called. If a node is not alive anymore, the only thing one can do with it is requesting it's last path and snapshot

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IAnyStateTreeNode` |  \- |

**Returns:** `boolean`

___
<a id="isarraytype"></a>

###  isArrayType

▸ **isArrayType**<`Items`>(type: *[IAnyType](#ianytype)*): `boolean`

Returns if a given value represents an array type.

**Type parameters:**

#### Items :  [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | [IAnyType](#ianytype) |  \- |

**Returns:** `boolean`
`true` if the type is an array type.

___
<a id="isfrozentype"></a>

###  isFrozenType

▸ **isFrozenType**<`IT`,`T`>(type: *`IT`*): `boolean`

Returns if a given value represents a frozen type.

**Type parameters:**

#### IT :  [IType](interfaces/itype.md)<`T` \| `any`, `T`, `T`>
#### T 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | `IT` |  \- |

**Returns:** `boolean`

___
<a id="isidentifiertype"></a>

###  isIdentifierType

▸ **isIdentifierType**<`IT`>(type: *`IT`*): `boolean`

Returns if a given value represents an identifier type.

**Type parameters:**

#### IT :  [ISimpleType](interfaces/isimpletype.md) \| [ISimpleType](interfaces/isimpletype.md)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | `IT` |  \- |

**Returns:** `boolean`

___
<a id="islatetype"></a>

###  isLateType

▸ **isLateType**<`IT`>(type: *`IT`*): `boolean`

Returns if a given value represents a late type.

**Type parameters:**

#### IT :  [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | `IT` |  \- |

**Returns:** `boolean`

___
<a id="isliteraltype"></a>

###  isLiteralType

▸ **isLiteralType**<`IT`>(type: *`IT`*): `boolean`

Returns if a given value represents a literal type.

**Type parameters:**

#### IT :  [ISimpleType](interfaces/isimpletype.md)<`any`>
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | `IT` |  \- |

**Returns:** `boolean`

___
<a id="ismaptype"></a>

###  isMapType

▸ **isMapType**<`Items`>(type: *[IAnyType](#ianytype)*): `boolean`

Returns if a given value represents a map type.

**Type parameters:**

#### Items :  [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | [IAnyType](#ianytype) |  \- |

**Returns:** `boolean`
`true` if it is a map type.

___
<a id="ismodeltype"></a>

###  isModelType

▸ **isModelType**<`IT`>(type: *[IAnyType](#ianytype)*): `boolean`

Returns if a given value represents a model type.

**Type parameters:**

#### IT :  [IAnyModelType](interfaces/ianymodeltype.md)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | [IAnyType](#ianytype) |  \- |

**Returns:** `boolean`

___
<a id="isoptionaltype"></a>

###  isOptionalType

▸ **isOptionalType**<`IT`>(type: *`IT`*): `boolean`

Returns if a value represents an optional type.
*__template__*: IT

**Type parameters:**

#### IT :  [IType](interfaces/itype.md)<`any` \| `undefined`, `any`, `any`> & `OptionalProperty`
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | `IT` |  \- |

**Returns:** `boolean`

___
<a id="isprimitivetype"></a>

###  isPrimitiveType

▸ **isPrimitiveType**<`IT`>(type: *`IT`*): `boolean`

Returns if a given value represents a primitive type.

**Type parameters:**

#### IT :  [ISimpleType](interfaces/isimpletype.md)<`string`> \| [ISimpleType](interfaces/isimpletype.md)<`number`> \| [ISimpleType](interfaces/isimpletype.md)<`boolean`> \| [IType](interfaces/itype.md)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | `IT` |  \- |

**Returns:** `boolean`

___
<a id="isprotected"></a>

###  isProtected

▸ **isProtected**(target: *`IAnyStateTreeNode`*): `boolean`

Returns true if the object is in protected mode, @see protect

**Parameters:**

| Name | Type |
| ------ | ------ |
| target | `IAnyStateTreeNode` |

**Returns:** `boolean`

___
<a id="isreferencetype"></a>

###  isReferenceType

▸ **isReferenceType**<`IT`>(type: *`IT`*): `boolean`

Returns if a given value represents a reference type.

**Type parameters:**

#### IT :  `IReferenceType`<`any`>
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | `IT` |  \- |

**Returns:** `boolean`

___
<a id="isrefinementtype"></a>

###  isRefinementType

▸ **isRefinementType**<`IT`>(type: *`IT`*): `boolean`

Returns if a given value is a refinement type.

**Type parameters:**

#### IT :  [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | `IT` |  \- |

**Returns:** `boolean`

___
<a id="isroot"></a>

###  isRoot

▸ **isRoot**(target: *`IAnyStateTreeNode`*): `boolean`

Returns true if the given object is the root of a model tree.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IAnyStateTreeNode` |  \- |

**Returns:** `boolean`

___
<a id="isstatetreenode"></a>

###  isStateTreeNode

▸ **isStateTreeNode**<`C`,`S`>(value: *`any`*): `boolean`

Returns true if the given value is a node in a state tree. More precisely, that is, if the value is an instance of a `types.model`, `types.array` or `types.map`.

**Type parameters:**

#### C 
#### S 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| value | `any` |  \- |

**Returns:** `boolean`
true if the value is a state tree node.

___
<a id="istype"></a>

###  isType

▸ **isType**(value: *`any`*): `boolean`

Returns if a given value represents a type.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| value | `any` |  Value to check. |

**Returns:** `boolean`
`true` if the value is a type.

___
<a id="isuniontype"></a>

###  isUnionType

▸ **isUnionType**<`IT`>(type: *`IT`*): `boolean`

Returns if a given value represents a union type.

**Type parameters:**

#### IT :  [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | `IT` |  \- |

**Returns:** `boolean`

___
<a id="isvalidreference"></a>

###  isValidReference

▸ **isValidReference**<`N`>(getter: *`function`*, checkIfAlive?: *`boolean`*): `boolean`

Tests if a reference is valid (pointing to an existing node and optionally if alive) and returns if the check passes or not.

**Type parameters:**

#### N :  `IAnyStateTreeNode`
**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| getter | `function` | - |  Function to access the reference. |
| `Default value` checkIfAlive | `boolean` | true |  true to also make sure the referenced node is alive (default), false to skip this check. |

**Returns:** `boolean`

___
<a id="joinjsonpath"></a>

###  joinJsonPath

▸ **joinJsonPath**(path: *`string`[]*): `string`

Generates a json-path compliant json path from path parts.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| path | `string`[] |  \- |

**Returns:** `string`

___
<a id="late"></a>

###  late

▸ **late**<`T`>(type: *`function`*): `T`

▸ **late**<`T`>(name: *`string`*, type: *`function`*): `T`

`types.late` - Defines a type that gets implemented later. This is useful when you have to deal with circular dependencies. Please notice that when defining circular dependencies TypeScript isn't smart enough to inference them.

Example:

```ts
  // TypeScript isn't smart enough to infer self referencing types.
 const Node = types.model({
      children: types.array(types.late((): IAnyModelType => Node)) // then typecast each array element to Instance<typeof Node>
 })
```

**Type parameters:**

#### T :  [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | `function` |  A function that returns the type that will be defined. |

**Returns:** `T`

`types.late` - Defines a type that gets implemented later. This is useful when you have to deal with circular dependencies. Please notice that when defining circular dependencies TypeScript isn't smart enough to inference them.

Example:

```ts
  // TypeScript isn't smart enough to infer self referencing types.
 const Node = types.model({
      children: types.array(types.late((): IAnyModelType => Node)) // then typecast each array element to Instance<typeof Node>
 })
```

**Type parameters:**

#### T :  [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  The name to use for the type that will be returned. |
| type | `function` |  A function that returns the type that will be defined. |

**Returns:** `T`

___
<a id="literal"></a>

###  literal

▸ **literal**<`S`>(value: *`S`*): [ISimpleType](interfaces/isimpletype.md)<`S`>

`types.literal` - The literal type will return a type that will match only the exact given type. The given value must be a primitive, in order to be serialized to a snapshot correctly. You can use literal to match exact strings for example the exact male or female string.

Example:

```ts
const Person = types.model({
    name: types.string,
    gender: types.union(types.literal('male'), types.literal('female'))
})
```

**Type parameters:**

#### S :  `Primitives`
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| value | `S` |  The value to use in the strict equal check |

**Returns:** [ISimpleType](interfaces/isimpletype.md)<`S`>

___
<a id="map"></a>

###  map

▸ **map**<`IT`>(subtype: *`IT`*): `IMapType`<`IT`>

`types.map` - Creates a key based collection type who's children are all of a uniform declared type. If the type stored in a map has an identifier, it is mandatory to store the child under that identifier in the map.

This type will always produce [observable maps](https://mobx.js.org/refguide/map.html)

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

#### IT :  [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| subtype | `IT` |  \- |

**Returns:** `IMapType`<`IT`>

___
<a id="maybe"></a>

###  maybe

▸ **maybe**<`IT`>(type: *`IT`*): `IMaybe`<`IT`>

`types.maybe` - Maybe will make a type nullable, and also optional. The value `undefined` will be used to represent nullability.

**Type parameters:**

#### IT :  [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | `IT` |  \- |

**Returns:** `IMaybe`<`IT`>

___
<a id="maybenull"></a>

###  maybeNull

▸ **maybeNull**<`IT`>(type: *`IT`*): `IMaybeNull`<`IT`>

`types.maybeNull` - Maybe will make a type nullable, and also optional. The value `null` will be used to represent no value.

**Type parameters:**

#### IT :  [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | `IT` |  \- |

**Returns:** `IMaybeNull`<`IT`>

___
<a id="model"></a>

###  model

▸ **model**<`P`>(name: *`string`*, properties?: *[P]()*): [IModelType](interfaces/imodeltype.md)<`ModelPropertiesDeclarationToProperties`<`P`>, `__type`>

▸ **model**<`P`>(properties?: *[P]()*): [IModelType](interfaces/imodeltype.md)<`ModelPropertiesDeclarationToProperties`<`P`>, `__type`>

`types.model` - Creates a new model type by providing a name, properties, volatile state and actions.

See the [model type](https://github.com/mobxjs/mobx-state-tree#creating-models) description or the [getting started](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/getting-started.md#getting-started-1) tutorial.

**Type parameters:**

#### P :  `ModelPropertiesDeclaration`
**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| `Optional` properties | [P]() |

**Returns:** [IModelType](interfaces/imodeltype.md)<`ModelPropertiesDeclarationToProperties`<`P`>, `__type`>

`types.model` - Creates a new model type by providing a name, properties, volatile state and actions.

See the [model type](https://github.com/mobxjs/mobx-state-tree#creating-models) description or the [getting started](https://github.com/mobxjs/mobx-state-tree/blob/master/docs/getting-started.md#getting-started-1) tutorial.

**Type parameters:**

#### P :  `ModelPropertiesDeclaration`
**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` properties | [P]() |

**Returns:** [IModelType](interfaces/imodeltype.md)<`ModelPropertiesDeclarationToProperties`<`P`>, `__type`>

___
<a id="onaction"></a>

###  onAction

▸ **onAction**(target: *`IAnyStateTreeNode`*, listener: *`function`*, attachAfter?: *`boolean`*): [IDisposer](#idisposer)

Registers a function that will be invoked for each action that is called on the provided model instance, or to any of its children. See [actions](https://github.com/mobxjs/mobx-state-tree#actions) for more details. onAction events are emitted only for the outermost called action in the stack. Action can also be intercepted by middleware using addMiddleware to change the function call before it will be run.

Not all action arguments might be serializable. For unserializable arguments, a struct like `{ $MST_UNSERIALIZABLE: true, type: "someType" }` will be generated. MST Nodes are considered non-serializable as well (they could be serialized as there snapshot, but it is uncertain whether an replaying party will be able to handle such a non-instantiated snapshot). Rather, when using `onAction` middleware, one should consider in passing arguments which are 1: an id, 2: a (relative) path, or 3: a snapshot. Instead of a real MST node.

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

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| target | `IAnyStateTreeNode` | - |  \- |
| listener | `function` | - |  \- |
| `Default value` attachAfter | `boolean` | false |  (default false) fires the listener _after_ the action has executed instead of before. |

**Returns:** [IDisposer](#idisposer)

___
<a id="onpatch"></a>

###  onPatch

▸ **onPatch**(target: *`IAnyStateTreeNode`*, callback: *`function`*): [IDisposer](#idisposer)

Registers a function that will be invoked for each mutation that is applied to the provided model instance, or to any of its children. See [patches](https://github.com/mobxjs/mobx-state-tree#patches) for more details. onPatch events are emitted immediately and will not await the end of a transaction. Patches can be used to deep observe a model tree.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IAnyStateTreeNode` |  the model instance from which to receive patches |
| callback | `function` |  the callback that is invoked for each patch. The reversePatch is a patch that would actually undo the emitted patch |

**Returns:** [IDisposer](#idisposer)
function to remove the listener

___
<a id="onsnapshot"></a>

###  onSnapshot

▸ **onSnapshot**<`S`>(target: *`IStateTreeNode`<`any`, `S`>*, callback: *`function`*): [IDisposer](#idisposer)

Registers a function that is invoked whenever a new snapshot for the given model instance is available. The listener will only be fire at the end of the current MobX (trans)action. See [snapshots](https://github.com/mobxjs/mobx-state-tree#snapshots) for more details.

**Type parameters:**

#### S 
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IStateTreeNode`<`any`, `S`> |  \- |
| callback | `function` |  \- |

**Returns:** [IDisposer](#idisposer)

___
<a id="optional"></a>

###  optional

▸ **optional**<`IT`>(type: *`IT`*, defaultValueOrFunction: *`OptionalDefaultValueOrFunction`<`IT`>*): `IT extends OptionalProperty ? IT : IOptionalIType<IT>`

`types.optional` - Can be used to create a property with a default value. If the given value is not provided in the snapshot, it will default to the provided `defaultValue`. If `defaultValue` is a function, the function will be invoked for every new instance. Applying a snapshot in which the optional value is _not_ present, causes the value to be reset

Example:

```ts
const Todo = types.model({
  title: types.optional(types.string, "Test"),
  done: types.optional(types.boolean, false),
  created: types.optional(types.Date, () => new Date())
})

// it is now okay to omit 'created' and 'done'. created will get a freshly generated timestamp
const todo = Todo.create({ title: "Get coffee "})
```

**Type parameters:**

#### IT :  [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | `IT` |  \- |
| defaultValueOrFunction | `OptionalDefaultValueOrFunction`<`IT`> |  \- |

**Returns:** `IT extends OptionalProperty ? IT : IOptionalIType<IT>`

___
<a id="protect"></a>

###  protect

▸ **protect**(target: *`IAnyStateTreeNode`*): `void`

The inverse of `unprotect`.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IAnyStateTreeNode` |   |

**Returns:** `void`

___
<a id="recordactions"></a>

###  recordActions

▸ **recordActions**(subject: *`IAnyStateTreeNode`*): [IActionRecorder](interfaces/iactionrecorder.md)

Small abstraction around `onAction` and `applyAction`, attaches an action listener to a tree and records all the actions emitted. Returns an recorder object with the following signature:

Example:

```ts
export interface IActionRecorder {
     // the recorded actions
     actions: ISerializedActionCall[]
     // stop recording actions
     stop(): any
     // apply all the recorded actions on the given object
     replay(target: IStateTreeNode): any
}
```

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| subject | `IAnyStateTreeNode` |  \- |

**Returns:** [IActionRecorder](interfaces/iactionrecorder.md)

___
<a id="recordpatches"></a>

###  recordPatches

▸ **recordPatches**(subject: *`IAnyStateTreeNode`*): [IPatchRecorder](interfaces/ipatchrecorder.md)

Small abstraction around `onPatch` and `applyPatch`, attaches a patch listener to a tree and records all the patches. Returns an recorder object with the following signature:

Example:

```ts
export interface IPatchRecorder {
     // the recorded patches
     patches: IJsonPatch[]
     // the inverse of the recorded patches
     inversePatches: IJsonPatch[]
     // stop recording patches
     stop(): void
     // resume recording patches
     resume()
     // apply all the recorded patches on the given target (the original subject if omitted)
     replay(target?: IAnyStateTreeNode): void
     // reverse apply the recorded patches on the given target  (the original subject if omitted)
     // stops the recorder if not already stopped
     undo(): void
}
```

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| subject | `IAnyStateTreeNode` |  \- |

**Returns:** [IPatchRecorder](interfaces/ipatchrecorder.md)

___
<a id="reference"></a>

###  reference

▸ **reference**<`IT`>(subType: *`IT`*, options?: *[ReferenceOptions](#referenceoptions)<`IT`>*): `IReferenceType`<`IT`>

`types.reference` - Creates a reference to another type, which should have defined an identifier. See also the [reference and identifiers](https://github.com/mobxjs/mobx-state-tree#references-and-identifiers) section.

**Type parameters:**

#### IT :  [IAnyComplexType](#ianycomplextype)
**Parameters:**

| Name | Type |
| ------ | ------ |
| subType | `IT` |
| `Optional` options | [ReferenceOptions](#referenceoptions)<`IT`> |

**Returns:** `IReferenceType`<`IT`>

___
<a id="refinement"></a>

###  refinement

▸ **refinement**<`IT`>(name: *`string`*, type: *`IT`*, predicate: *`function`*, message?: *`string` \| `function`*): `IT`

▸ **refinement**<`IT`>(type: *`IT`*, predicate: *`function`*, message?: *`string` \| `function`*): `IT`

`types.refinement` - Creates a type that is more specific than the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.

**Type parameters:**

#### IT :  [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| name | `string` |  \- |
| type | `IT` |  \- |
| predicate | `function` |  \- |
| `Optional` message | `string` \| `function` |

**Returns:** `IT`

`types.refinement` - Creates a type that is more specific than the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.

**Type parameters:**

#### IT :  [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | `IT` |  \- |
| predicate | `function` |  \- |
| `Optional` message | `string` \| `function` |

**Returns:** `IT`

___
<a id="resolveidentifier"></a>

###  resolveIdentifier

▸ **resolveIdentifier**<`IT`>(type: *`IT`*, target: *`IAnyStateTreeNode`*, identifier: *[ReferenceIdentifier](#referenceidentifier)*): `ExtractT`<`IT`> \| `undefined`

Resolves a model instance given a root target, the type and the identifier you are searching for. Returns undefined if no value can be found.

**Type parameters:**

#### IT :  [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | `IT` |  \- |
| target | `IAnyStateTreeNode` |  \- |
| identifier | [ReferenceIdentifier](#referenceidentifier) |  \- |

**Returns:** `ExtractT`<`IT`> \| `undefined`

___
<a id="resolvepath"></a>

###  resolvePath

▸ **resolvePath**(target: *`IAnyStateTreeNode`*, path: *`string`*): `any`

Resolves a path relatively to a given object. Returns undefined if no value can be found.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IAnyStateTreeNode` |  \- |
| path | `string` |  escaped json path |

**Returns:** `any`

___
<a id="safereference"></a>

###  safeReference

▸ **safeReference**<`IT`>(subType: *`IT`*, options?: *[ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)<`IT`>*): `IMaybe`<`IReferenceType`<`IT`>>

`types.safeReference` - A safe reference is like a standard reference, except that it accepts the undefined value by default and automatically sets itself to undefined (when the parent is a model) / removes itself from arrays and maps when the reference it is pointing to gets detached/destroyed.

Strictly speaking it is a `types.maybe(types.reference(X))` with a customized `onInvalidate` option.

**Type parameters:**

#### IT :  [IAnyComplexType](#ianycomplextype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| subType | `IT` |  \- |
| `Optional` options | [ReferenceOptionsGetSet](interfaces/referenceoptionsgetset.md)<`IT`> |  \- |

**Returns:** `IMaybe`<`IReferenceType`<`IT`>>

___
<a id="setlivelinesschecking"></a>

###  setLivelinessChecking

▸ **setLivelinessChecking**(mode: *[LivelinessMode](#livelinessmode)*): `void`

Defines what MST should do when running into reads / writes to objects that have died. By default it will print a warning. Use the `"error"` option to easy debugging to see where the error was thrown and when the offending read / write took place

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| mode | [LivelinessMode](#livelinessmode) |  \`"warn"\`, \`"error"\` or \`"ignore"\` |

**Returns:** `void`

___
<a id="splitjsonpath"></a>

###  splitJsonPath

▸ **splitJsonPath**(path: *`string`*): `string`[]

Splits and decodes a json path into several parts.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| path | `string` |  \- |

**Returns:** `string`[]

___
<a id="tryreference"></a>

###  tryReference

▸ **tryReference**<`N`>(getter: *`function`*, checkIfAlive?: *`boolean`*): `N` \| `undefined`

Tests if a reference is valid (pointing to an existing node and optionally if alive) and returns such reference if it the check passes, else it returns undefined.

**Type parameters:**

#### N :  `IAnyStateTreeNode`
**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| getter | `function` | - |  Function to access the reference. |
| `Default value` checkIfAlive | `boolean` | true |  true to also make sure the referenced node is alive (default), false to skip this check. |

**Returns:** `N` \| `undefined`

___
<a id="tryresolve"></a>

###  tryResolve

▸ **tryResolve**(target: *`IAnyStateTreeNode`*, path: *`string`*): `any`

Try to resolve a given path relative to a given node.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| target | `IAnyStateTreeNode` |  \- |
| path | `string` |  \- |

**Returns:** `any`

___
<a id="typecheck"></a>

###  typecheck

▸ **typecheck**<`IT`>(type: *[IAnyType](#ianytype)*, value: *`ExtractC`<`IT`> \| `ExtractS`<`IT`> \| `ExtractT`<`IT`>*): `void`

Run's the typechecker for the given type on the given value, which can be a snapshot or an instance. Throws if the given value is not according the provided type specification. Use this if you need typechecks even in a production build (by default all automatic runtime type checks will be skipped in production builds)

**Type parameters:**

#### IT :  [IAnyType](#ianytype)
**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| type | [IAnyType](#ianytype) |  Type to check against. |
| value | `ExtractC`<`IT`> \| `ExtractS`<`IT`> \| `ExtractT`<`IT`> |  Value to be checked, either a snapshot or an instance. |

**Returns:** `void`

___
<a id="unescapejsonpath"></a>

###  unescapeJsonPath

▸ **unescapeJsonPath**(path: *`string`*): `string`

Unescape slashes and backslashes.

**Parameters:**

| Name | Type |
| ------ | ------ |
| path | `string` |

**Returns:** `string`

___
<a id="union"></a>

###  union

▸ **union**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`>(A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*): `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`>>

▸ **union**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`>(options: *[UnionOptions](interfaces/unionoptions.md)*, A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*): `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`>>

▸ **union**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`>(A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*): `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`>>

▸ **union**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`>(options: *[UnionOptions](interfaces/unionoptions.md)*, A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*): `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`>>

▸ **union**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`>(A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*): `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`>>

▸ **union**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`>(options: *[UnionOptions](interfaces/unionoptions.md)*, A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*): `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`>>

▸ **union**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`>(A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*): `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`>>

▸ **union**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`>(options: *[UnionOptions](interfaces/unionoptions.md)*, A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*): `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`>>

▸ **union**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`,`PF`,`OF`,`FCF`,`FSF`>(A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*, F: *[IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`>*): `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`> \| `ModelCreationType2`<`PF`, `FCF`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`> \| `ModelSnapshotType2`<`PF`, `FSF`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`> \| `ModelInstanceType`<`PF`, `OF`, `FCF`, `FSF`>>

▸ **union**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`,`PF`,`OF`,`FCF`,`FSF`>(options: *[UnionOptions](interfaces/unionoptions.md)*, A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*, F: *[IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`>*): `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`> \| `ModelCreationType2`<`PF`, `FCF`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`> \| `ModelSnapshotType2`<`PF`, `FSF`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`> \| `ModelInstanceType`<`PF`, `OF`, `FCF`, `FSF`>>

▸ **union**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`,`PF`,`OF`,`FCF`,`FSF`,`PG`,`OG`,`FCG`,`FSG`>(A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*, F: *[IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`>*, G: *[IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`>*): `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`> \| `ModelCreationType2`<`PF`, `FCF`> \| `ModelCreationType2`<`PG`, `FCG`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`> \| `ModelSnapshotType2`<`PF`, `FSF`> \| `ModelSnapshotType2`<`PG`, `FSG`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`> \| `ModelInstanceType`<`PF`, `OF`, `FCF`, `FSF`> \| `ModelInstanceType`<`PG`, `OG`, `FCG`, `FSG`>>

▸ **union**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`,`PF`,`OF`,`FCF`,`FSF`,`PG`,`OG`,`FCG`,`FSG`>(options: *[UnionOptions](interfaces/unionoptions.md)*, A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*, F: *[IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`>*, G: *[IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`>*): `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`> \| `ModelCreationType2`<`PF`, `FCF`> \| `ModelCreationType2`<`PG`, `FCG`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`> \| `ModelSnapshotType2`<`PF`, `FSF`> \| `ModelSnapshotType2`<`PG`, `FSG`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`> \| `ModelInstanceType`<`PF`, `OF`, `FCF`, `FSF`> \| `ModelInstanceType`<`PG`, `OG`, `FCG`, `FSG`>>

▸ **union**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`,`PF`,`OF`,`FCF`,`FSF`,`PG`,`OG`,`FCG`,`FSG`,`PH`,`OH`,`FCH`,`FSH`>(A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*, F: *[IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`>*, G: *[IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`>*, H: *[IModelType](interfaces/imodeltype.md)<`PH`, `OH`, `FCH`, `FSH`>*): `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`> \| `ModelCreationType2`<`PF`, `FCF`> \| `ModelCreationType2`<`PG`, `FCG`> \| `ModelCreationType2`<`PH`, `FCH`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`> \| `ModelSnapshotType2`<`PF`, `FSF`> \| `ModelSnapshotType2`<`PG`, `FSG`> \| `ModelSnapshotType2`<`PH`, `FSH`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`> \| `ModelInstanceType`<`PF`, `OF`, `FCF`, `FSF`> \| `ModelInstanceType`<`PG`, `OG`, `FCG`, `FSG`> \| `ModelInstanceType`<`PH`, `OH`, `FCH`, `FSH`>>

▸ **union**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`,`PF`,`OF`,`FCF`,`FSF`,`PG`,`OG`,`FCG`,`FSG`,`PH`,`OH`,`FCH`,`FSH`>(options: *[UnionOptions](interfaces/unionoptions.md)*, A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*, F: *[IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`>*, G: *[IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`>*, H: *[IModelType](interfaces/imodeltype.md)<`PH`, `OH`, `FCH`, `FSH`>*): `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`> \| `ModelCreationType2`<`PF`, `FCF`> \| `ModelCreationType2`<`PG`, `FCG`> \| `ModelCreationType2`<`PH`, `FCH`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`> \| `ModelSnapshotType2`<`PF`, `FSF`> \| `ModelSnapshotType2`<`PG`, `FSG`> \| `ModelSnapshotType2`<`PH`, `FSH`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`> \| `ModelInstanceType`<`PF`, `OF`, `FCF`, `FSF`> \| `ModelInstanceType`<`PG`, `OG`, `FCG`, `FSG`> \| `ModelInstanceType`<`PH`, `OH`, `FCH`, `FSH`>>

▸ **union**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`,`PF`,`OF`,`FCF`,`FSF`,`PG`,`OG`,`FCG`,`FSG`,`PH`,`OH`,`FCH`,`FSH`,`PI`,`OI`,`FCI`,`FSI`>(A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*, F: *[IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`>*, G: *[IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`>*, H: *[IModelType](interfaces/imodeltype.md)<`PH`, `OH`, `FCH`, `FSH`>*, I: *[IModelType](interfaces/imodeltype.md)<`PI`, `OI`, `FCI`, `FSI`>*): `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`> \| `ModelCreationType2`<`PF`, `FCF`> \| `ModelCreationType2`<`PG`, `FCG`> \| `ModelCreationType2`<`PH`, `FCH`> \| `ModelCreationType2`<`PI`, `FCI`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`> \| `ModelSnapshotType2`<`PF`, `FSF`> \| `ModelSnapshotType2`<`PG`, `FSG`> \| `ModelSnapshotType2`<`PH`, `FSH`> \| `ModelSnapshotType2`<`PI`, `FSI`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`> \| `ModelInstanceType`<`PF`, `OF`, `FCF`, `FSF`> \| `ModelInstanceType`<`PG`, `OG`, `FCG`, `FSG`> \| `ModelInstanceType`<`PH`, `OH`, `FCH`, `FSH`> \| `ModelInstanceType`<`PI`, `OI`, `FCI`, `FSI`>>

▸ **union**<`PA`,`OA`,`FCA`,`FSA`,`PB`,`OB`,`FCB`,`FSB`,`PC`,`OC`,`FCC`,`FSC`,`PD`,`OD`,`FCD`,`FSD`,`PE`,`OE`,`FCE`,`FSE`,`PF`,`OF`,`FCF`,`FSF`,`PG`,`OG`,`FCG`,`FSG`,`PH`,`OH`,`FCH`,`FSH`,`PI`,`OI`,`FCI`,`FSI`>(options: *[UnionOptions](interfaces/unionoptions.md)*, A: *[IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`>*, B: *[IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`>*, C: *[IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`>*, D: *[IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`>*, E: *[IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`>*, F: *[IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`>*, G: *[IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`>*, H: *[IModelType](interfaces/imodeltype.md)<`PH`, `OH`, `FCH`, `FSH`>*, I: *[IModelType](interfaces/imodeltype.md)<`PI`, `OI`, `FCI`, `FSI`>*): `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`> \| `ModelCreationType2`<`PF`, `FCF`> \| `ModelCreationType2`<`PG`, `FCG`> \| `ModelCreationType2`<`PH`, `FCH`> \| `ModelCreationType2`<`PI`, `FCI`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`> \| `ModelSnapshotType2`<`PF`, `FSF`> \| `ModelSnapshotType2`<`PG`, `FSG`> \| `ModelSnapshotType2`<`PH`, `FSH`> \| `ModelSnapshotType2`<`PI`, `FSI`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`> \| `ModelInstanceType`<`PF`, `OF`, `FCF`, `FSF`> \| `ModelInstanceType`<`PG`, `OG`, `FCG`, `FSG`> \| `ModelInstanceType`<`PH`, `OH`, `FCH`, `FSH`> \| `ModelInstanceType`<`PI`, `OI`, `FCI`, `FSI`>>

▸ **union**<`CA`,`SA`,`TA`,`CB`,`SB`,`TB`>(A: *[IType](interfaces/itype.md)<`CA`, `SA`, `TA`>*, B: *[IType](interfaces/itype.md)<`CB`, `SB`, `TB`>*): `ITypeUnion`<`CA` \| `CB`, `SA` \| `SB`, `TA` \| `TB`>

▸ **union**<`CA`,`SA`,`TA`,`CB`,`SB`,`TB`>(options: *[UnionOptions](interfaces/unionoptions.md)*, A: *[IType](interfaces/itype.md)<`CA`, `SA`, `TA`>*, B: *[IType](interfaces/itype.md)<`CB`, `SB`, `TB`>*): `ITypeUnion`<`CA` \| `CB`, `SA` \| `SB`, `TA` \| `TB`>

▸ **union**<`CA`,`SA`,`TA`,`CB`,`SB`,`TB`,`CC`,`SC`,`TC`>(A: *[IType](interfaces/itype.md)<`CA`, `SA`, `TA`>*, B: *[IType](interfaces/itype.md)<`CB`, `SB`, `TB`>*, C: *[IType](interfaces/itype.md)<`CC`, `SC`, `TC`>*): `ITypeUnion`<`CA` \| `CB` \| `CC`, `SA` \| `SB` \| `SC`, `TA` \| `TB` \| `TC`>

▸ **union**<`CA`,`SA`,`TA`,`CB`,`SB`,`TB`,`CC`,`SC`,`TC`>(options: *[UnionOptions](interfaces/unionoptions.md)*, A: *[IType](interfaces/itype.md)<`CA`, `SA`, `TA`>*, B: *[IType](interfaces/itype.md)<`CB`, `SB`, `TB`>*, C: *[IType](interfaces/itype.md)<`CC`, `SC`, `TC`>*): `ITypeUnion`<`CA` \| `CB` \| `CC`, `SA` \| `SB` \| `SC`, `TA` \| `TB` \| `TC`>

▸ **union**<`CA`,`SA`,`TA`,`CB`,`SB`,`TB`,`CC`,`SC`,`TC`,`CD`,`SD`,`TD`>(A: *[IType](interfaces/itype.md)<`CA`, `SA`, `TA`>*, B: *[IType](interfaces/itype.md)<`CB`, `SB`, `TB`>*, C: *[IType](interfaces/itype.md)<`CC`, `SC`, `TC`>*, D: *[IType](interfaces/itype.md)<`CD`, `SD`, `TD`>*): `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD`, `SA` \| `SB` \| `SC` \| `SD`, `TA` \| `TB` \| `TC` \| `TD`>

▸ **union**<`CA`,`SA`,`TA`,`CB`,`SB`,`TB`,`CC`,`SC`,`TC`,`CD`,`SD`,`TD`>(options: *[UnionOptions](interfaces/unionoptions.md)*, A: *[IType](interfaces/itype.md)<`CA`, `SA`, `TA`>*, B: *[IType](interfaces/itype.md)<`CB`, `SB`, `TB`>*, C: *[IType](interfaces/itype.md)<`CC`, `SC`, `TC`>*, D: *[IType](interfaces/itype.md)<`CD`, `SD`, `TD`>*): `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD`, `SA` \| `SB` \| `SC` \| `SD`, `TA` \| `TB` \| `TC` \| `TD`>

▸ **union**<`CA`,`SA`,`TA`,`CB`,`SB`,`TB`,`CC`,`SC`,`TC`,`CD`,`SD`,`TD`,`CE`,`SE`,`TE`>(A: *[IType](interfaces/itype.md)<`CA`, `SA`, `TA`>*, B: *[IType](interfaces/itype.md)<`CB`, `SB`, `TB`>*, C: *[IType](interfaces/itype.md)<`CC`, `SC`, `TC`>*, D: *[IType](interfaces/itype.md)<`CD`, `SD`, `TD`>*, E: *[IType](interfaces/itype.md)<`CE`, `SE`, `TE`>*): `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE`, `SA` \| `SB` \| `SC` \| `SD` \| `SE`, `TA` \| `TB` \| `TC` \| `TD` \| `TE`>

▸ **union**<`CA`,`SA`,`TA`,`CB`,`SB`,`TB`,`CC`,`SC`,`TC`,`CD`,`SD`,`TD`,`CE`,`SE`,`TE`>(options: *[UnionOptions](interfaces/unionoptions.md)*, A: *[IType](interfaces/itype.md)<`CA`, `SA`, `TA`>*, B: *[IType](interfaces/itype.md)<`CB`, `SB`, `TB`>*, C: *[IType](interfaces/itype.md)<`CC`, `SC`, `TC`>*, D: *[IType](interfaces/itype.md)<`CD`, `SD`, `TD`>*, E: *[IType](interfaces/itype.md)<`CE`, `SE`, `TE`>*): `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE`, `SA` \| `SB` \| `SC` \| `SD` \| `SE`, `TA` \| `TB` \| `TC` \| `TD` \| `TE`>

▸ **union**<`CA`,`SA`,`TA`,`CB`,`SB`,`TB`,`CC`,`SC`,`TC`,`CD`,`SD`,`TD`,`CE`,`SE`,`TE`,`CF`,`SF`,`TF`>(A: *[IType](interfaces/itype.md)<`CA`, `SA`, `TA`>*, B: *[IType](interfaces/itype.md)<`CB`, `SB`, `TB`>*, C: *[IType](interfaces/itype.md)<`CC`, `SC`, `TC`>*, D: *[IType](interfaces/itype.md)<`CD`, `SD`, `TD`>*, E: *[IType](interfaces/itype.md)<`CE`, `SE`, `TE`>*, F: *[IType](interfaces/itype.md)<`CF`, `SF`, `TF`>*): `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE` \| `CF`, `SA` \| `SB` \| `SC` \| `SD` \| `SE` \| `SF`, `TA` \| `TB` \| `TC` \| `TD` \| `TE` \| `TF`>

▸ **union**<`CA`,`SA`,`TA`,`CB`,`SB`,`TB`,`CC`,`SC`,`TC`,`CD`,`SD`,`TD`,`CE`,`SE`,`TE`,`CF`,`SF`,`TF`>(options: *[UnionOptions](interfaces/unionoptions.md)*, A: *[IType](interfaces/itype.md)<`CA`, `SA`, `TA`>*, B: *[IType](interfaces/itype.md)<`CB`, `SB`, `TB`>*, C: *[IType](interfaces/itype.md)<`CC`, `SC`, `TC`>*, D: *[IType](interfaces/itype.md)<`CD`, `SD`, `TD`>*, E: *[IType](interfaces/itype.md)<`CE`, `SE`, `TE`>*, F: *[IType](interfaces/itype.md)<`CF`, `SF`, `TF`>*): `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE` \| `CF`, `SA` \| `SB` \| `SC` \| `SD` \| `SE` \| `SF`, `TA` \| `TB` \| `TC` \| `TD` \| `TE` \| `TF`>

▸ **union**<`CA`,`SA`,`TA`,`CB`,`SB`,`TB`,`CC`,`SC`,`TC`,`CD`,`SD`,`TD`,`CE`,`SE`,`TE`,`CF`,`SF`,`TF`,`CG`,`SG`,`TG`>(A: *[IType](interfaces/itype.md)<`CA`, `SA`, `TA`>*, B: *[IType](interfaces/itype.md)<`CB`, `SB`, `TB`>*, C: *[IType](interfaces/itype.md)<`CC`, `SC`, `TC`>*, D: *[IType](interfaces/itype.md)<`CD`, `SD`, `TD`>*, E: *[IType](interfaces/itype.md)<`CE`, `SE`, `TE`>*, F: *[IType](interfaces/itype.md)<`CF`, `SF`, `TF`>*, G: *[IType](interfaces/itype.md)<`CG`, `SG`, `TG`>*): `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE` \| `CF` \| `CG`, `SA` \| `SB` \| `SC` \| `SD` \| `SE` \| `SF` \| `SG`, `TA` \| `TB` \| `TC` \| `TD` \| `TE` \| `TF` \| `TG`>

▸ **union**<`CA`,`SA`,`TA`,`CB`,`SB`,`TB`,`CC`,`SC`,`TC`,`CD`,`SD`,`TD`,`CE`,`SE`,`TE`,`CF`,`SF`,`TF`,`CG`,`SG`,`TG`>(options: *[UnionOptions](interfaces/unionoptions.md)*, A: *[IType](interfaces/itype.md)<`CA`, `SA`, `TA`>*, B: *[IType](interfaces/itype.md)<`CB`, `SB`, `TB`>*, C: *[IType](interfaces/itype.md)<`CC`, `SC`, `TC`>*, D: *[IType](interfaces/itype.md)<`CD`, `SD`, `TD`>*, E: *[IType](interfaces/itype.md)<`CE`, `SE`, `TE`>*, F: *[IType](interfaces/itype.md)<`CF`, `SF`, `TF`>*, G: *[IType](interfaces/itype.md)<`CG`, `SG`, `TG`>*): `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE` \| `CF` \| `CG`, `SA` \| `SB` \| `SC` \| `SD` \| `SE` \| `SF` \| `SG`, `TA` \| `TB` \| `TC` \| `TD` \| `TE` \| `TF` \| `TG`>

▸ **union**<`CA`,`SA`,`TA`,`CB`,`SB`,`TB`,`CC`,`SC`,`TC`,`CD`,`SD`,`TD`,`CE`,`SE`,`TE`,`CF`,`SF`,`TF`,`CG`,`SG`,`TG`,`CH`,`SH`,`TH`>(A: *[IType](interfaces/itype.md)<`CA`, `SA`, `TA`>*, B: *[IType](interfaces/itype.md)<`CB`, `SB`, `TB`>*, C: *[IType](interfaces/itype.md)<`CC`, `SC`, `TC`>*, D: *[IType](interfaces/itype.md)<`CD`, `SD`, `TD`>*, E: *[IType](interfaces/itype.md)<`CE`, `SE`, `TE`>*, F: *[IType](interfaces/itype.md)<`CF`, `SF`, `TF`>*, G: *[IType](interfaces/itype.md)<`CG`, `SG`, `TG`>*, H: *[IType](interfaces/itype.md)<`CH`, `SH`, `TH`>*): `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE` \| `CF` \| `CG` \| `CH`, `SA` \| `SB` \| `SC` \| `SD` \| `SE` \| `SF` \| `SG` \| `SH`, `TA` \| `TB` \| `TC` \| `TD` \| `TE` \| `TF` \| `TG` \| `TH`>

▸ **union**<`CA`,`SA`,`TA`,`CB`,`SB`,`TB`,`CC`,`SC`,`TC`,`CD`,`SD`,`TD`,`CE`,`SE`,`TE`,`CF`,`SF`,`TF`,`CG`,`SG`,`TG`,`CH`,`SH`,`TH`>(options: *[UnionOptions](interfaces/unionoptions.md)*, A: *[IType](interfaces/itype.md)<`CA`, `SA`, `TA`>*, B: *[IType](interfaces/itype.md)<`CB`, `SB`, `TB`>*, C: *[IType](interfaces/itype.md)<`CC`, `SC`, `TC`>*, D: *[IType](interfaces/itype.md)<`CD`, `SD`, `TD`>*, E: *[IType](interfaces/itype.md)<`CE`, `SE`, `TE`>*, F: *[IType](interfaces/itype.md)<`CF`, `SF`, `TF`>*, G: *[IType](interfaces/itype.md)<`CG`, `SG`, `TG`>*, H: *[IType](interfaces/itype.md)<`CH`, `SH`, `TH`>*): `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE` \| `CF` \| `CG` \| `CH`, `SA` \| `SB` \| `SC` \| `SD` \| `SE` \| `SF` \| `SG` \| `SH`, `TA` \| `TB` \| `TC` \| `TD` \| `TE` \| `TF` \| `TG` \| `TH`>

▸ **union**<`CA`,`SA`,`TA`,`CB`,`SB`,`TB`,`CC`,`SC`,`TC`,`CD`,`SD`,`TD`,`CE`,`SE`,`TE`,`CF`,`SF`,`TF`,`CG`,`SG`,`TG`,`CH`,`SH`,`TH`,`CI`,`SI`,`TI`>(A: *[IType](interfaces/itype.md)<`CA`, `SA`, `TA`>*, B: *[IType](interfaces/itype.md)<`CB`, `SB`, `TB`>*, C: *[IType](interfaces/itype.md)<`CC`, `SC`, `TC`>*, D: *[IType](interfaces/itype.md)<`CD`, `SD`, `TD`>*, E: *[IType](interfaces/itype.md)<`CE`, `SE`, `TE`>*, F: *[IType](interfaces/itype.md)<`CF`, `SF`, `TF`>*, G: *[IType](interfaces/itype.md)<`CG`, `SG`, `TG`>*, H: *[IType](interfaces/itype.md)<`CH`, `SH`, `TH`>*, I: *[IType](interfaces/itype.md)<`CI`, `SI`, `TI`>*): `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE` \| `CF` \| `CG` \| `CH` \| `CI`, `SA` \| `SB` \| `SC` \| `SD` \| `SE` \| `SF` \| `SG` \| `SH` \| `SI`, `TA` \| `TB` \| `TC` \| `TD` \| `TE` \| `TF` \| `TG` \| `TH` \| `TI`>

▸ **union**<`CA`,`SA`,`TA`,`CB`,`SB`,`TB`,`CC`,`SC`,`TC`,`CD`,`SD`,`TD`,`CE`,`SE`,`TE`,`CF`,`SF`,`TF`,`CG`,`SG`,`TG`,`CH`,`SH`,`TH`,`CI`,`SI`,`TI`>(options: *[UnionOptions](interfaces/unionoptions.md)*, A: *[IType](interfaces/itype.md)<`CA`, `SA`, `TA`>*, B: *[IType](interfaces/itype.md)<`CB`, `SB`, `TB`>*, C: *[IType](interfaces/itype.md)<`CC`, `SC`, `TC`>*, D: *[IType](interfaces/itype.md)<`CD`, `SD`, `TD`>*, E: *[IType](interfaces/itype.md)<`CE`, `SE`, `TE`>*, F: *[IType](interfaces/itype.md)<`CF`, `SF`, `TF`>*, G: *[IType](interfaces/itype.md)<`CG`, `SG`, `TG`>*, H: *[IType](interfaces/itype.md)<`CH`, `SH`, `TH`>*, I: *[IType](interfaces/itype.md)<`CI`, `SI`, `TI`>*): `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE` \| `CF` \| `CG` \| `CH` \| `CI`, `SA` \| `SB` \| `SC` \| `SD` \| `SE` \| `SF` \| `SG` \| `SH` \| `SI`, `TA` \| `TB` \| `TC` \| `TD` \| `TE` \| `TF` \| `TG` \| `TH` \| `TI`>

▸ **union**(...types: *[IAnyType](#ianytype)[]*): [IAnyType](#ianytype)

▸ **union**(dispatchOrType: *[UnionOptions](interfaces/unionoptions.md) \| [IAnyType](#ianytype)*, ...otherTypes: *[IAnyType](#ianytype)[]*): [IAnyType](#ianytype)

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |

**Returns:** `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`>>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UnionOptions](interfaces/unionoptions.md) |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |

**Returns:** `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`>>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |

**Returns:** `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`>>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UnionOptions](interfaces/unionoptions.md) |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |

**Returns:** `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`>>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |

**Returns:** `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`>>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UnionOptions](interfaces/unionoptions.md) |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |

**Returns:** `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`>>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |

**Returns:** `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`>>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UnionOptions](interfaces/unionoptions.md) |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |

**Returns:** `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`>>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
#### PF :  `ModelProperties`
#### OF 
#### FCF 
#### FSF 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |
| F | [IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`> |

**Returns:** `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`> \| `ModelCreationType2`<`PF`, `FCF`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`> \| `ModelSnapshotType2`<`PF`, `FSF`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`> \| `ModelInstanceType`<`PF`, `OF`, `FCF`, `FSF`>>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
#### PF :  `ModelProperties`
#### OF 
#### FCF 
#### FSF 
**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UnionOptions](interfaces/unionoptions.md) |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |
| F | [IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`> |

**Returns:** `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`> \| `ModelCreationType2`<`PF`, `FCF`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`> \| `ModelSnapshotType2`<`PF`, `FSF`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`> \| `ModelInstanceType`<`PF`, `OF`, `FCF`, `FSF`>>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
#### PF :  `ModelProperties`
#### OF 
#### FCF 
#### FSF 
#### PG :  `ModelProperties`
#### OG 
#### FCG 
#### FSG 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |
| F | [IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`> |
| G | [IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`> |

**Returns:** `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`> \| `ModelCreationType2`<`PF`, `FCF`> \| `ModelCreationType2`<`PG`, `FCG`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`> \| `ModelSnapshotType2`<`PF`, `FSF`> \| `ModelSnapshotType2`<`PG`, `FSG`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`> \| `ModelInstanceType`<`PF`, `OF`, `FCF`, `FSF`> \| `ModelInstanceType`<`PG`, `OG`, `FCG`, `FSG`>>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
#### PF :  `ModelProperties`
#### OF 
#### FCF 
#### FSF 
#### PG :  `ModelProperties`
#### OG 
#### FCG 
#### FSG 
**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UnionOptions](interfaces/unionoptions.md) |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |
| F | [IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`> |
| G | [IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`> |

**Returns:** `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`> \| `ModelCreationType2`<`PF`, `FCF`> \| `ModelCreationType2`<`PG`, `FCG`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`> \| `ModelSnapshotType2`<`PF`, `FSF`> \| `ModelSnapshotType2`<`PG`, `FSG`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`> \| `ModelInstanceType`<`PF`, `OF`, `FCF`, `FSF`> \| `ModelInstanceType`<`PG`, `OG`, `FCG`, `FSG`>>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
#### PF :  `ModelProperties`
#### OF 
#### FCF 
#### FSF 
#### PG :  `ModelProperties`
#### OG 
#### FCG 
#### FSG 
#### PH :  `ModelProperties`
#### OH 
#### FCH 
#### FSH 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |
| F | [IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`> |
| G | [IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`> |
| H | [IModelType](interfaces/imodeltype.md)<`PH`, `OH`, `FCH`, `FSH`> |

**Returns:** `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`> \| `ModelCreationType2`<`PF`, `FCF`> \| `ModelCreationType2`<`PG`, `FCG`> \| `ModelCreationType2`<`PH`, `FCH`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`> \| `ModelSnapshotType2`<`PF`, `FSF`> \| `ModelSnapshotType2`<`PG`, `FSG`> \| `ModelSnapshotType2`<`PH`, `FSH`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`> \| `ModelInstanceType`<`PF`, `OF`, `FCF`, `FSF`> \| `ModelInstanceType`<`PG`, `OG`, `FCG`, `FSG`> \| `ModelInstanceType`<`PH`, `OH`, `FCH`, `FSH`>>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
#### PF :  `ModelProperties`
#### OF 
#### FCF 
#### FSF 
#### PG :  `ModelProperties`
#### OG 
#### FCG 
#### FSG 
#### PH :  `ModelProperties`
#### OH 
#### FCH 
#### FSH 
**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UnionOptions](interfaces/unionoptions.md) |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |
| F | [IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`> |
| G | [IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`> |
| H | [IModelType](interfaces/imodeltype.md)<`PH`, `OH`, `FCH`, `FSH`> |

**Returns:** `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`> \| `ModelCreationType2`<`PF`, `FCF`> \| `ModelCreationType2`<`PG`, `FCG`> \| `ModelCreationType2`<`PH`, `FCH`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`> \| `ModelSnapshotType2`<`PF`, `FSF`> \| `ModelSnapshotType2`<`PG`, `FSG`> \| `ModelSnapshotType2`<`PH`, `FSH`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`> \| `ModelInstanceType`<`PF`, `OF`, `FCF`, `FSF`> \| `ModelInstanceType`<`PG`, `OG`, `FCG`, `FSG`> \| `ModelInstanceType`<`PH`, `OH`, `FCH`, `FSH`>>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
#### PF :  `ModelProperties`
#### OF 
#### FCF 
#### FSF 
#### PG :  `ModelProperties`
#### OG 
#### FCG 
#### FSG 
#### PH :  `ModelProperties`
#### OH 
#### FCH 
#### FSH 
#### PI :  `ModelProperties`
#### OI 
#### FCI 
#### FSI 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |
| F | [IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`> |
| G | [IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`> |
| H | [IModelType](interfaces/imodeltype.md)<`PH`, `OH`, `FCH`, `FSH`> |
| I | [IModelType](interfaces/imodeltype.md)<`PI`, `OI`, `FCI`, `FSI`> |

**Returns:** `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`> \| `ModelCreationType2`<`PF`, `FCF`> \| `ModelCreationType2`<`PG`, `FCG`> \| `ModelCreationType2`<`PH`, `FCH`> \| `ModelCreationType2`<`PI`, `FCI`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`> \| `ModelSnapshotType2`<`PF`, `FSF`> \| `ModelSnapshotType2`<`PG`, `FSG`> \| `ModelSnapshotType2`<`PH`, `FSH`> \| `ModelSnapshotType2`<`PI`, `FSI`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`> \| `ModelInstanceType`<`PF`, `OF`, `FCF`, `FSF`> \| `ModelInstanceType`<`PG`, `OG`, `FCG`, `FSG`> \| `ModelInstanceType`<`PH`, `OH`, `FCH`, `FSH`> \| `ModelInstanceType`<`PI`, `OI`, `FCI`, `FSI`>>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### PA :  `ModelProperties`
#### OA 
#### FCA 
#### FSA 
#### PB :  `ModelProperties`
#### OB 
#### FCB 
#### FSB 
#### PC :  `ModelProperties`
#### OC 
#### FCC 
#### FSC 
#### PD :  `ModelProperties`
#### OD 
#### FCD 
#### FSD 
#### PE :  `ModelProperties`
#### OE 
#### FCE 
#### FSE 
#### PF :  `ModelProperties`
#### OF 
#### FCF 
#### FSF 
#### PG :  `ModelProperties`
#### OG 
#### FCG 
#### FSG 
#### PH :  `ModelProperties`
#### OH 
#### FCH 
#### FSH 
#### PI :  `ModelProperties`
#### OI 
#### FCI 
#### FSI 
**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UnionOptions](interfaces/unionoptions.md) |
| A | [IModelType](interfaces/imodeltype.md)<`PA`, `OA`, `FCA`, `FSA`> |
| B | [IModelType](interfaces/imodeltype.md)<`PB`, `OB`, `FCB`, `FSB`> |
| C | [IModelType](interfaces/imodeltype.md)<`PC`, `OC`, `FCC`, `FSC`> |
| D | [IModelType](interfaces/imodeltype.md)<`PD`, `OD`, `FCD`, `FSD`> |
| E | [IModelType](interfaces/imodeltype.md)<`PE`, `OE`, `FCE`, `FSE`> |
| F | [IModelType](interfaces/imodeltype.md)<`PF`, `OF`, `FCF`, `FSF`> |
| G | [IModelType](interfaces/imodeltype.md)<`PG`, `OG`, `FCG`, `FSG`> |
| H | [IModelType](interfaces/imodeltype.md)<`PH`, `OH`, `FCH`, `FSH`> |
| I | [IModelType](interfaces/imodeltype.md)<`PI`, `OI`, `FCI`, `FSI`> |

**Returns:** `ITypeUnion`<`ModelCreationType2`<`PA`, `FCA`> \| `ModelCreationType2`<`PB`, `FCB`> \| `ModelCreationType2`<`PC`, `FCC`> \| `ModelCreationType2`<`PD`, `FCD`> \| `ModelCreationType2`<`PE`, `FCE`> \| `ModelCreationType2`<`PF`, `FCF`> \| `ModelCreationType2`<`PG`, `FCG`> \| `ModelCreationType2`<`PH`, `FCH`> \| `ModelCreationType2`<`PI`, `FCI`>, `ModelSnapshotType2`<`PA`, `FSA`> \| `ModelSnapshotType2`<`PB`, `FSB`> \| `ModelSnapshotType2`<`PC`, `FSC`> \| `ModelSnapshotType2`<`PD`, `FSD`> \| `ModelSnapshotType2`<`PE`, `FSE`> \| `ModelSnapshotType2`<`PF`, `FSF`> \| `ModelSnapshotType2`<`PG`, `FSG`> \| `ModelSnapshotType2`<`PH`, `FSH`> \| `ModelSnapshotType2`<`PI`, `FSI`>, `ModelInstanceType`<`PA`, `OA`, `FCA`, `FSA`> \| `ModelInstanceType`<`PB`, `OB`, `FCB`, `FSB`> \| `ModelInstanceType`<`PC`, `OC`, `FCC`, `FSC`> \| `ModelInstanceType`<`PD`, `OD`, `FCD`, `FSD`> \| `ModelInstanceType`<`PE`, `OE`, `FCE`, `FSE`> \| `ModelInstanceType`<`PF`, `OF`, `FCF`, `FSF`> \| `ModelInstanceType`<`PG`, `OG`, `FCG`, `FSG`> \| `ModelInstanceType`<`PH`, `OH`, `FCH`, `FSH`> \| `ModelInstanceType`<`PI`, `OI`, `FCI`, `FSI`>>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### CA 
#### SA 
#### TA 
#### CB 
#### SB 
#### TB 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IType](interfaces/itype.md)<`CA`, `SA`, `TA`> |
| B | [IType](interfaces/itype.md)<`CB`, `SB`, `TB`> |

**Returns:** `ITypeUnion`<`CA` \| `CB`, `SA` \| `SB`, `TA` \| `TB`>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### CA 
#### SA 
#### TA 
#### CB 
#### SB 
#### TB 
**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UnionOptions](interfaces/unionoptions.md) |
| A | [IType](interfaces/itype.md)<`CA`, `SA`, `TA`> |
| B | [IType](interfaces/itype.md)<`CB`, `SB`, `TB`> |

**Returns:** `ITypeUnion`<`CA` \| `CB`, `SA` \| `SB`, `TA` \| `TB`>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### CA 
#### SA 
#### TA 
#### CB 
#### SB 
#### TB 
#### CC 
#### SC 
#### TC 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IType](interfaces/itype.md)<`CA`, `SA`, `TA`> |
| B | [IType](interfaces/itype.md)<`CB`, `SB`, `TB`> |
| C | [IType](interfaces/itype.md)<`CC`, `SC`, `TC`> |

**Returns:** `ITypeUnion`<`CA` \| `CB` \| `CC`, `SA` \| `SB` \| `SC`, `TA` \| `TB` \| `TC`>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### CA 
#### SA 
#### TA 
#### CB 
#### SB 
#### TB 
#### CC 
#### SC 
#### TC 
**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UnionOptions](interfaces/unionoptions.md) |
| A | [IType](interfaces/itype.md)<`CA`, `SA`, `TA`> |
| B | [IType](interfaces/itype.md)<`CB`, `SB`, `TB`> |
| C | [IType](interfaces/itype.md)<`CC`, `SC`, `TC`> |

**Returns:** `ITypeUnion`<`CA` \| `CB` \| `CC`, `SA` \| `SB` \| `SC`, `TA` \| `TB` \| `TC`>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### CA 
#### SA 
#### TA 
#### CB 
#### SB 
#### TB 
#### CC 
#### SC 
#### TC 
#### CD 
#### SD 
#### TD 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IType](interfaces/itype.md)<`CA`, `SA`, `TA`> |
| B | [IType](interfaces/itype.md)<`CB`, `SB`, `TB`> |
| C | [IType](interfaces/itype.md)<`CC`, `SC`, `TC`> |
| D | [IType](interfaces/itype.md)<`CD`, `SD`, `TD`> |

**Returns:** `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD`, `SA` \| `SB` \| `SC` \| `SD`, `TA` \| `TB` \| `TC` \| `TD`>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### CA 
#### SA 
#### TA 
#### CB 
#### SB 
#### TB 
#### CC 
#### SC 
#### TC 
#### CD 
#### SD 
#### TD 
**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UnionOptions](interfaces/unionoptions.md) |
| A | [IType](interfaces/itype.md)<`CA`, `SA`, `TA`> |
| B | [IType](interfaces/itype.md)<`CB`, `SB`, `TB`> |
| C | [IType](interfaces/itype.md)<`CC`, `SC`, `TC`> |
| D | [IType](interfaces/itype.md)<`CD`, `SD`, `TD`> |

**Returns:** `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD`, `SA` \| `SB` \| `SC` \| `SD`, `TA` \| `TB` \| `TC` \| `TD`>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### CA 
#### SA 
#### TA 
#### CB 
#### SB 
#### TB 
#### CC 
#### SC 
#### TC 
#### CD 
#### SD 
#### TD 
#### CE 
#### SE 
#### TE 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IType](interfaces/itype.md)<`CA`, `SA`, `TA`> |
| B | [IType](interfaces/itype.md)<`CB`, `SB`, `TB`> |
| C | [IType](interfaces/itype.md)<`CC`, `SC`, `TC`> |
| D | [IType](interfaces/itype.md)<`CD`, `SD`, `TD`> |
| E | [IType](interfaces/itype.md)<`CE`, `SE`, `TE`> |

**Returns:** `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE`, `SA` \| `SB` \| `SC` \| `SD` \| `SE`, `TA` \| `TB` \| `TC` \| `TD` \| `TE`>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### CA 
#### SA 
#### TA 
#### CB 
#### SB 
#### TB 
#### CC 
#### SC 
#### TC 
#### CD 
#### SD 
#### TD 
#### CE 
#### SE 
#### TE 
**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UnionOptions](interfaces/unionoptions.md) |
| A | [IType](interfaces/itype.md)<`CA`, `SA`, `TA`> |
| B | [IType](interfaces/itype.md)<`CB`, `SB`, `TB`> |
| C | [IType](interfaces/itype.md)<`CC`, `SC`, `TC`> |
| D | [IType](interfaces/itype.md)<`CD`, `SD`, `TD`> |
| E | [IType](interfaces/itype.md)<`CE`, `SE`, `TE`> |

**Returns:** `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE`, `SA` \| `SB` \| `SC` \| `SD` \| `SE`, `TA` \| `TB` \| `TC` \| `TD` \| `TE`>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### CA 
#### SA 
#### TA 
#### CB 
#### SB 
#### TB 
#### CC 
#### SC 
#### TC 
#### CD 
#### SD 
#### TD 
#### CE 
#### SE 
#### TE 
#### CF 
#### SF 
#### TF 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IType](interfaces/itype.md)<`CA`, `SA`, `TA`> |
| B | [IType](interfaces/itype.md)<`CB`, `SB`, `TB`> |
| C | [IType](interfaces/itype.md)<`CC`, `SC`, `TC`> |
| D | [IType](interfaces/itype.md)<`CD`, `SD`, `TD`> |
| E | [IType](interfaces/itype.md)<`CE`, `SE`, `TE`> |
| F | [IType](interfaces/itype.md)<`CF`, `SF`, `TF`> |

**Returns:** `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE` \| `CF`, `SA` \| `SB` \| `SC` \| `SD` \| `SE` \| `SF`, `TA` \| `TB` \| `TC` \| `TD` \| `TE` \| `TF`>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### CA 
#### SA 
#### TA 
#### CB 
#### SB 
#### TB 
#### CC 
#### SC 
#### TC 
#### CD 
#### SD 
#### TD 
#### CE 
#### SE 
#### TE 
#### CF 
#### SF 
#### TF 
**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UnionOptions](interfaces/unionoptions.md) |
| A | [IType](interfaces/itype.md)<`CA`, `SA`, `TA`> |
| B | [IType](interfaces/itype.md)<`CB`, `SB`, `TB`> |
| C | [IType](interfaces/itype.md)<`CC`, `SC`, `TC`> |
| D | [IType](interfaces/itype.md)<`CD`, `SD`, `TD`> |
| E | [IType](interfaces/itype.md)<`CE`, `SE`, `TE`> |
| F | [IType](interfaces/itype.md)<`CF`, `SF`, `TF`> |

**Returns:** `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE` \| `CF`, `SA` \| `SB` \| `SC` \| `SD` \| `SE` \| `SF`, `TA` \| `TB` \| `TC` \| `TD` \| `TE` \| `TF`>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### CA 
#### SA 
#### TA 
#### CB 
#### SB 
#### TB 
#### CC 
#### SC 
#### TC 
#### CD 
#### SD 
#### TD 
#### CE 
#### SE 
#### TE 
#### CF 
#### SF 
#### TF 
#### CG 
#### SG 
#### TG 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IType](interfaces/itype.md)<`CA`, `SA`, `TA`> |
| B | [IType](interfaces/itype.md)<`CB`, `SB`, `TB`> |
| C | [IType](interfaces/itype.md)<`CC`, `SC`, `TC`> |
| D | [IType](interfaces/itype.md)<`CD`, `SD`, `TD`> |
| E | [IType](interfaces/itype.md)<`CE`, `SE`, `TE`> |
| F | [IType](interfaces/itype.md)<`CF`, `SF`, `TF`> |
| G | [IType](interfaces/itype.md)<`CG`, `SG`, `TG`> |

**Returns:** `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE` \| `CF` \| `CG`, `SA` \| `SB` \| `SC` \| `SD` \| `SE` \| `SF` \| `SG`, `TA` \| `TB` \| `TC` \| `TD` \| `TE` \| `TF` \| `TG`>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### CA 
#### SA 
#### TA 
#### CB 
#### SB 
#### TB 
#### CC 
#### SC 
#### TC 
#### CD 
#### SD 
#### TD 
#### CE 
#### SE 
#### TE 
#### CF 
#### SF 
#### TF 
#### CG 
#### SG 
#### TG 
**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UnionOptions](interfaces/unionoptions.md) |
| A | [IType](interfaces/itype.md)<`CA`, `SA`, `TA`> |
| B | [IType](interfaces/itype.md)<`CB`, `SB`, `TB`> |
| C | [IType](interfaces/itype.md)<`CC`, `SC`, `TC`> |
| D | [IType](interfaces/itype.md)<`CD`, `SD`, `TD`> |
| E | [IType](interfaces/itype.md)<`CE`, `SE`, `TE`> |
| F | [IType](interfaces/itype.md)<`CF`, `SF`, `TF`> |
| G | [IType](interfaces/itype.md)<`CG`, `SG`, `TG`> |

**Returns:** `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE` \| `CF` \| `CG`, `SA` \| `SB` \| `SC` \| `SD` \| `SE` \| `SF` \| `SG`, `TA` \| `TB` \| `TC` \| `TD` \| `TE` \| `TF` \| `TG`>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### CA 
#### SA 
#### TA 
#### CB 
#### SB 
#### TB 
#### CC 
#### SC 
#### TC 
#### CD 
#### SD 
#### TD 
#### CE 
#### SE 
#### TE 
#### CF 
#### SF 
#### TF 
#### CG 
#### SG 
#### TG 
#### CH 
#### SH 
#### TH 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IType](interfaces/itype.md)<`CA`, `SA`, `TA`> |
| B | [IType](interfaces/itype.md)<`CB`, `SB`, `TB`> |
| C | [IType](interfaces/itype.md)<`CC`, `SC`, `TC`> |
| D | [IType](interfaces/itype.md)<`CD`, `SD`, `TD`> |
| E | [IType](interfaces/itype.md)<`CE`, `SE`, `TE`> |
| F | [IType](interfaces/itype.md)<`CF`, `SF`, `TF`> |
| G | [IType](interfaces/itype.md)<`CG`, `SG`, `TG`> |
| H | [IType](interfaces/itype.md)<`CH`, `SH`, `TH`> |

**Returns:** `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE` \| `CF` \| `CG` \| `CH`, `SA` \| `SB` \| `SC` \| `SD` \| `SE` \| `SF` \| `SG` \| `SH`, `TA` \| `TB` \| `TC` \| `TD` \| `TE` \| `TF` \| `TG` \| `TH`>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### CA 
#### SA 
#### TA 
#### CB 
#### SB 
#### TB 
#### CC 
#### SC 
#### TC 
#### CD 
#### SD 
#### TD 
#### CE 
#### SE 
#### TE 
#### CF 
#### SF 
#### TF 
#### CG 
#### SG 
#### TG 
#### CH 
#### SH 
#### TH 
**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UnionOptions](interfaces/unionoptions.md) |
| A | [IType](interfaces/itype.md)<`CA`, `SA`, `TA`> |
| B | [IType](interfaces/itype.md)<`CB`, `SB`, `TB`> |
| C | [IType](interfaces/itype.md)<`CC`, `SC`, `TC`> |
| D | [IType](interfaces/itype.md)<`CD`, `SD`, `TD`> |
| E | [IType](interfaces/itype.md)<`CE`, `SE`, `TE`> |
| F | [IType](interfaces/itype.md)<`CF`, `SF`, `TF`> |
| G | [IType](interfaces/itype.md)<`CG`, `SG`, `TG`> |
| H | [IType](interfaces/itype.md)<`CH`, `SH`, `TH`> |

**Returns:** `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE` \| `CF` \| `CG` \| `CH`, `SA` \| `SB` \| `SC` \| `SD` \| `SE` \| `SF` \| `SG` \| `SH`, `TA` \| `TB` \| `TC` \| `TD` \| `TE` \| `TF` \| `TG` \| `TH`>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### CA 
#### SA 
#### TA 
#### CB 
#### SB 
#### TB 
#### CC 
#### SC 
#### TC 
#### CD 
#### SD 
#### TD 
#### CE 
#### SE 
#### TE 
#### CF 
#### SF 
#### TF 
#### CG 
#### SG 
#### TG 
#### CH 
#### SH 
#### TH 
#### CI 
#### SI 
#### TI 
**Parameters:**

| Name | Type |
| ------ | ------ |
| A | [IType](interfaces/itype.md)<`CA`, `SA`, `TA`> |
| B | [IType](interfaces/itype.md)<`CB`, `SB`, `TB`> |
| C | [IType](interfaces/itype.md)<`CC`, `SC`, `TC`> |
| D | [IType](interfaces/itype.md)<`CD`, `SD`, `TD`> |
| E | [IType](interfaces/itype.md)<`CE`, `SE`, `TE`> |
| F | [IType](interfaces/itype.md)<`CF`, `SF`, `TF`> |
| G | [IType](interfaces/itype.md)<`CG`, `SG`, `TG`> |
| H | [IType](interfaces/itype.md)<`CH`, `SH`, `TH`> |
| I | [IType](interfaces/itype.md)<`CI`, `SI`, `TI`> |

**Returns:** `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE` \| `CF` \| `CG` \| `CH` \| `CI`, `SA` \| `SB` \| `SC` \| `SD` \| `SE` \| `SF` \| `SG` \| `SH` \| `SI`, `TA` \| `TB` \| `TC` \| `TD` \| `TE` \| `TF` \| `TG` \| `TH` \| `TI`>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

#### CA 
#### SA 
#### TA 
#### CB 
#### SB 
#### TB 
#### CC 
#### SC 
#### TC 
#### CD 
#### SD 
#### TD 
#### CE 
#### SE 
#### TE 
#### CF 
#### SF 
#### TF 
#### CG 
#### SG 
#### TG 
#### CH 
#### SH 
#### TH 
#### CI 
#### SI 
#### TI 
**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [UnionOptions](interfaces/unionoptions.md) |
| A | [IType](interfaces/itype.md)<`CA`, `SA`, `TA`> |
| B | [IType](interfaces/itype.md)<`CB`, `SB`, `TB`> |
| C | [IType](interfaces/itype.md)<`CC`, `SC`, `TC`> |
| D | [IType](interfaces/itype.md)<`CD`, `SD`, `TD`> |
| E | [IType](interfaces/itype.md)<`CE`, `SE`, `TE`> |
| F | [IType](interfaces/itype.md)<`CF`, `SF`, `TF`> |
| G | [IType](interfaces/itype.md)<`CG`, `SG`, `TG`> |
| H | [IType](interfaces/itype.md)<`CH`, `SH`, `TH`> |
| I | [IType](interfaces/itype.md)<`CI`, `SI`, `TI`> |

**Returns:** `ITypeUnion`<`CA` \| `CB` \| `CC` \| `CD` \| `CE` \| `CF` \| `CG` \| `CH` \| `CI`, `SA` \| `SB` \| `SC` \| `SD` \| `SE` \| `SF` \| `SG` \| `SH` \| `SI`, `TA` \| `TB` \| `TC` \| `TD` \| `TE` \| `TF` \| `TG` \| `TH` \| `TI`>

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` types | [IAnyType](#ianytype)[] |

**Returns:** [IAnyType](#ianytype)

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| dispatchOrType | [UnionOptions](interfaces/unionoptions.md) \| [IAnyType](#ianytype) |
| `Rest` otherTypes | [IAnyType](#ianytype)[] |  \- |

**Returns:** [IAnyType](#ianytype)

___
<a id="unprotect"></a>

###  unprotect

▸ **unprotect**(target: *`IAnyStateTreeNode`*): `void`

By default it is not allowed to directly modify a model. Models can only be modified through actions. However, in some cases you don't care about the advantages (like replayability, traceability, etc) this yields. For example because you are building a PoC or don't have any middleware attached to your tree.

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

| Name | Type |
| ------ | ------ |
| target | `IAnyStateTreeNode` |

**Returns:** `void`

___
<a id="walk"></a>

###  walk

▸ **walk**(target: *`IAnyStateTreeNode`*, processor: *`function`*): `void`

Performs a depth first walk through a tree.

**Parameters:**

| Name | Type |
| ------ | ------ |
| target | `IAnyStateTreeNode` |
| processor | `function` |

**Returns:** `void`

___

## Object literals

<a id="types"></a>

### `<Const>` types

**types**: *`object`*

<a id="types.date"></a>

####  Date

**● Date**: *[IType](interfaces/itype.md)<`number` \| `Date`, `number`, `Date`>* =  DatePrimitive

___
<a id="types.array"></a>

####  array

**● array**: *[array](#array)*

___
<a id="types.boolean"></a>

####  boolean

**● boolean**: *[ISimpleType](interfaces/isimpletype.md)<`boolean`>*

___
<a id="types.compose"></a>

####  compose

**● compose**: *[compose](#compose)*

___
<a id="types.custom"></a>

####  custom

**● custom**: *[custom](#custom)*

___
<a id="types.enumeration"></a>

####  enumeration

**● enumeration**: *[enumeration](#enumeration)*

___
<a id="types.frozen"></a>

####  frozen

**● frozen**: *[frozen](#frozen)*

___
<a id="types.identifier"></a>

####  identifier

**● identifier**: *[ISimpleType](interfaces/isimpletype.md)<`string`>*

___
<a id="types.identifiernumber"></a>

####  identifierNumber

**● identifierNumber**: *[ISimpleType](interfaces/isimpletype.md)<`number`>*

___
<a id="types.integer"></a>

####  integer

**● integer**: *[ISimpleType](interfaces/isimpletype.md)<`number`>*

___
<a id="types.late"></a>

####  late

**● late**: *[late](#late)*

___
<a id="types.literal"></a>

####  literal

**● literal**: *[literal](#literal)*

___
<a id="types.map"></a>

####  map

**● map**: *[map](#map)*

___
<a id="types.maybe"></a>

####  maybe

**● maybe**: *[maybe](#maybe)*

___
<a id="types.maybenull"></a>

####  maybeNull

**● maybeNull**: *[maybeNull](#maybenull)*

___
<a id="types.model"></a>

####  model

**● model**: *[model](#model)*

___
<a id="types.null"></a>

####  null

**● null**: *[ISimpleType](interfaces/isimpletype.md)<`null`>* =  nullType

___
<a id="types.number"></a>

####  number

**● number**: *[ISimpleType](interfaces/isimpletype.md)<`number`>*

___
<a id="types.optional"></a>

####  optional

**● optional**: *[optional](#optional)*

___
<a id="types.reference"></a>

####  reference

**● reference**: *[reference](#reference)*

___
<a id="types.refinement"></a>

####  refinement

**● refinement**: *[refinement](#refinement)*

___
<a id="types.safereference"></a>

####  safeReference

**● safeReference**: *[safeReference](#safereference)*

___
<a id="types.string"></a>

####  string

**● string**: *[ISimpleType](interfaces/isimpletype.md)<`string`>*

___
<a id="types.undefined"></a>

####  undefined

**● undefined**: *[ISimpleType](interfaces/isimpletype.md)<`undefined`>* =  undefinedType

___
<a id="types.union"></a>

####  union

**● union**: *[union](#union)*

___

___

