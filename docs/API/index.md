---
id: "index"
title: "mobx-state-tree"
sidebar_label: "Globals"
---

[mobx-state-tree](index.md)

## Index

### Enumerations

* [InternalEvents]()
* [ObservableInstanceLifecycle]()

### Classes

* [BaseIdentifierType]()
* [CollectedMiddlewares]()
* [Late]()
* [MSTMap]()
* [Refinement]()
* [RunningAction]()
* [SnapshotProcessor]()
* [StoredReference]()

### Interfaces

* [CustomTypeOptions]()
* [IActionContext]()
* [IActionRecorder]()
* [IActionTrackingMiddleware2Call]()
* [IActionTrackingMiddleware2Hooks]()
* [IActionTrackingMiddlewareHooks]()
* [IAnyComplexType]()
* [IAnyModelType]()
* [IAnyType]()
* [IHooks]()
* [IJsonPatch]()
* [IMiddlewareEvent]()
* [IModelReflectionData]()
* [IModelReflectionPropertiesData]()
* [IModelType]()
* [IPatchRecorder]()
* [IReversibleJsonPatch]()
* [ISerializedActionCall]()
* [ISimpleType]()
* [ISnapshotProcessor]()
* [ISnapshotProcessors]()
* [IType]()
* [IValidationContextEntry]()
* [IValidationError]()
* [ReferenceOptionsGetSet]()
* [ReferenceOptionsOnInvalidated]()
* [UnionOptions]()

### Type aliases

* [HookSubscribers]()
* [IDisposer]()
* [IFunctionReturn]()
* [IHooksGetter]()
* [IMiddlewareEventType]()
* [IMiddlewareHandler]()
* [IOptionalValue]()
* [ITypeDispatcher]()
* [IValidationContext]()
* [IValidationResult]()
* [Instance]()
* [InternalEventHandlers]()
* [LivelinessMode]()
* [Omit]()
* [OnReferenceInvalidated]()
* [OnReferenceInvalidatedEvent]()
* [ReferenceIdentifier]()
* [ReferenceOptions]()
* [SnapshotIn]()
* [SnapshotOrInstance]()
* [SnapshotOut]()

### Variables

* [DEPRECATION_MESSAGE]()
* [DatePrimitive]()
* [POST_PROCESS_SNAPSHOT]()
* [PRE_PROCESS_SNAPSHOT]()
* [_DatePrimitive]()
* [boolean]()
* [currentActionContext]()
* [identifier]()
* [identifierCacheId]()
* [identifierNumber]()
* [integer]()
* [livelinessChecking]()
* [needsIdentifierError]()
* [nextActionId]()
* [nextNodeId]()
* [nullType]()
* [number]()
* [optionalNullType]()
* [optionalUndefinedType]()
* [plainObjectString]()
* [prototypeHasOwnProperty]()
* [runningActions]()
* [string]()
* [undefinedAsOptionalValues]()
* [undefinedType]()
* [untypedFrozenInstance]()

### Functions

* [_isActionContextThisOrChildOf]()
* [addDisposer]()
* [addMiddleware]()
* [applyAction]()
* [applyPatch]()
* [applySnapshot]()
* [areSame]()
* [array]()
* [baseApplyAction]()
* [cast]()
* [castFlowReturn]()
* [castToReferenceSnapshot]()
* [castToSnapshot]()
* [checkOptionalPreconditions]()
* [clone]()
* [compose]()
* [createActionTrackingMiddleware]()
* [createActionTrackingMiddleware2]()
* [custom]()
* [decorate]()
* [deserializeArgument]()
* [destroy]()
* [detach]()
* [doubleDot]()
* [enumeration]()
* [escapeJsonPath]()
* [flow]()
* [frozen]()
* [getChildType]()
* [getEnv]()
* [getIdentifier]()
* [getInvalidationCause]()
* [getLivelinessChecking]()
* [getMembers]()
* [getNodeId]()
* [getParent]()
* [getParentOfType]()
* [getPath]()
* [getPathParts]()
* [getPropertyMembers]()
* [getRelativePath]()
* [getRoot]()
* [getRunningActionContext]()
* [getSnapshot]()
* [getType]()
* [hasParent]()
* [hasParentOfType]()
* [invertPatch]()
* [isActionContextChildOf]()
* [isActionContextThisOrChildOf]()
* [isAlive]()
* [isArrayType]()
* [isFrozenType]()
* [isIdentifierType]()
* [isLateType]()
* [isLiteralType]()
* [isMapType]()
* [isModelType]()
* [isNumber]()
* [isOptionalType]()
* [isPrimitiveType]()
* [isProtected]()
* [isReferenceType]()
* [isRefinementType]()
* [isRoot]()
* [isStateTreeNode]()
* [isType]()
* [isUnionType]()
* [isValidReference]()
* [joinJsonPath]()
* [late]()
* [literal]()
* [map]()
* [maybe]()
* [maybeNull]()
* [model]()
* [objectTypeToString]()
* [onAction]()
* [onPatch]()
* [onSnapshot]()
* [optional]()
* [protect]()
* [proxyNodeTypeMethods]()
* [reconcileArrayChildren]()
* [recordActions]()
* [recordPatches]()
* [reference]()
* [refinement]()
* [resolveIdentifier]()
* [resolvePath]()
* [runMiddleWares]()
* [safeReference]()
* [safeStringify]()
* [serializeArgument]()
* [serializeTheUnserializable]()
* [setLivelinessChecking]()
* [shortenPrintValue]()
* [snapshotProcessor]()
* [splitJsonPath]()
* [toErrorString]()
* [toGenerator]()
* [toGeneratorFunction]()
* [toPropertiesObject]()
* [tryCollectModelTypes]()
* [tryReference]()
* [tryResolve]()
* [typecheck]()
* [unescapeJsonPath]()
* [union]()
* [unprotect]()
* [validationErrorsToString]()
* [valueAsNode]()
* [walk]()

### Object literals

* [defaultObjectOptions]()
* [snapshotReactionOptions]()
* [types]()

## Enumerations

###  InternalEvents

• **InternalEvents**:

*Defined in [packages/mobx-state-tree/src/core/node/object-node.ts:53](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/object-node.ts#L53)*

###  Dispose

• **Dispose**: = "dispose"

*Defined in [packages/mobx-state-tree/src/core/node/object-node.ts:54](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/object-node.ts#L54)*

###  Patch

• **Patch**: = "patch"

*Defined in [packages/mobx-state-tree/src/core/node/object-node.ts:55](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/object-node.ts#L55)*

###  Snapshot

• **Snapshot**: = "snapshot"

*Defined in [packages/mobx-state-tree/src/core/node/object-node.ts:56](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/object-node.ts#L56)*

___

###  ObservableInstanceLifecycle

• **ObservableInstanceLifecycle**:

*Defined in [packages/mobx-state-tree/src/core/node/object-node.ts:44](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/object-node.ts#L44)*

###  CREATED

• **CREATED**:

*Defined in [packages/mobx-state-tree/src/core/node/object-node.ts:50](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/object-node.ts#L50)*

###  CREATING

• **CREATING**:

*Defined in [packages/mobx-state-tree/src/core/node/object-node.ts:48](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/object-node.ts#L48)*

###  UNINITIALIZED

• **UNINITIALIZED**:

*Defined in [packages/mobx-state-tree/src/core/node/object-node.ts:46](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/object-node.ts#L46)*

## Classes

### `Abstract` BaseIdentifierType

• **BaseIdentifierType**:

*Defined in [packages/mobx-state-tree/src/types/utility-types/identifier.ts:18](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/identifier.ts#L18)*

###  constructor

\+ **new BaseIdentifierType**(`name`: string, `validType`: "string" | "number"): *BaseIdentifierType*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/identifier.ts:19](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/identifier.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`validType` | "string" &#124; "number" |

**Returns:** *BaseIdentifierType*

### `Readonly` C

• **C**: *T*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:286](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L286)*

### `Readonly` N

• **N**: *ScalarNode‹T, T, T›*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:289](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L289)*

### `Readonly` S

• **S**: *T*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:287](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L287)*

### `Readonly` T

• **T**: *T*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:288](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L288)*

###  [$type]

• **[$type]**: *undefined*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:283](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L283)*

### `Readonly` flags

• **flags**: *TypeFlags* = TypeFlags.Identifier

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/identifier.ts:19](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/identifier.ts#L19)*

### `Readonly` isType

• **isType**: *true* = true

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:291](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L291)*

### `Readonly` name

• **name**: *string*

*Implementation of void*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:292](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L292)*

###  CreationType

• **CreationType**:

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:360](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L360)*

###  SnapshotType

• **SnapshotType**:

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:354](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L354)*

###  Type

• **Type**:

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:342](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L342)*

###  TypeWithoutSTN

• **TypeWithoutSTN**:

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:348](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L348)*

###  create

▸ **create**(`snapshot?`: C, `environment?`: any): *any*

*Implementation of void*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:298](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L298)*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | C |
`environment?` | any |

**Returns:** *any*

###  createNewInstance

▸ **createNewInstance**(`snapshot`: T): *T*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:497](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L497)*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | T |

**Returns:** *T*

### `Abstract` describe

▸ **describe**(): *string*

*Implementation of void*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:318](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L318)*

**Returns:** *string*

###  getSnapshot

▸ **getSnapshot**(`node`: this["N"]): *T*

*Inherited from void*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:510](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L510)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | this["N"] |

**Returns:** *T*

###  getSubTypes

▸ **getSubTypes**(): *null*

*Inherited from void*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:524](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L524)*

**Returns:** *null*

###  getValue

▸ **getValue**(`node`: this["N"]): *T*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:501](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L501)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | this["N"] |

**Returns:** *T*

###  instantiate

▸ **instantiate**(`parent`: AnyObjectNode | null, `subpath`: string, `environment`: any, `initialValue`: this["C"]): *this["N"]*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/identifier.ts:25](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/identifier.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | AnyObjectNode &#124; null |
`subpath` | string |
`environment` | any |
`initialValue` | this["C"] |

**Returns:** *this["N"]*

###  is

▸ **is**(`thing`: any): *thing is any*

*Implementation of void*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:338](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L338)*

**Parameters:**

Name | Type |
------ | ------ |
`thing` | any |

**Returns:** *thing is any*

###  isAssignableFrom

▸ **isAssignableFrom**(`type`: IAnyType): *boolean*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:322](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L322)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IAnyType |

**Returns:** *boolean*

###  isValidSnapshot

▸ **isValidSnapshot**(`value`: this["C"], `context`: IValidationContext): *IValidationResult*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/identifier.ts:47](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/identifier.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | this["C"] |
`context` | IValidationContext |

**Returns:** *IValidationResult*

###  reconcile

▸ **reconcile**(`current`: this["N"], `newValue`: this["C"], `parent`: AnyObjectNode, `subpath`: string): *this["N"]*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/identifier.ts:37](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/identifier.ts#L37)*

**Parameters:**

Name | Type |
------ | ------ |
`current` | this["N"] |
`newValue` | this["C"] |
`parent` | AnyObjectNode |
`subpath` | string |

**Returns:** *this["N"]*

###  validate

▸ **validate**(`value`: T | T, `context`: IValidationContext): *IValidationResult*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:326](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L326)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T &#124; T |
`context` | IValidationContext |

**Returns:** *IValidationResult*

___

###  CollectedMiddlewares

• **CollectedMiddlewares**:

*Defined in [packages/mobx-state-tree/src/core/action.ts:207](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/action.ts#L207)*

###  constructor

\+ **new CollectedMiddlewares**(`node`: AnyObjectNode, `fn`: Function): *CollectedMiddlewares*

*Defined in [packages/mobx-state-tree/src/core/action.ts:210](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/action.ts#L210)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | AnyObjectNode |
`fn` | Function |

**Returns:** *CollectedMiddlewares*

###  isEmpty

• **isEmpty**:

*Defined in [packages/mobx-state-tree/src/core/action.ts:225](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/action.ts#L225)*

###  getNextMiddleware

▸ **getNextMiddleware**(): *IMiddleware | undefined*

*Defined in [packages/mobx-state-tree/src/core/action.ts:229](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/action.ts#L229)*

**Returns:** *IMiddleware | undefined*

___

###  Late

• **Late**:

*Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:16](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/late.ts#L16)*

###  constructor

\+ **new Late**(`name`: string, `_definition`: function): *Late*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:54](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/late.ts#L54)*

**Parameters:**

▪ **name**: *string*

▪ **_definition**: *function*

▸ (): *IT*

**Returns:** *Late*

### `Readonly` C

• **C**: *IT["CreationType"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:286](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L286)*

### `Readonly` N

• **N**: *ExtractNodeType‹IT›*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:289](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L289)*

### `Readonly` S

• **S**: *IT["SnapshotType"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:287](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L287)*

### `Readonly` T

• **T**: *IT["TypeWithoutSTN"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:288](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L288)*

###  [$type]

• **[$type]**: *undefined*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:283](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L283)*

### `Readonly` isType

• **isType**: *true* = true

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:291](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L291)*

### `Readonly` name

• **name**: *string*

*Implementation of void*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:292](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L292)*

###  CreationType

• **CreationType**:

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:360](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L360)*

###  SnapshotType

• **SnapshotType**:

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:354](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L354)*

###  Type

• **Type**:

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:342](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L342)*

###  TypeWithoutSTN

• **TypeWithoutSTN**:

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:348](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L348)*

###  flags

• **flags**:

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:24](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/late.ts#L24)*

###  create

▸ **create**(`snapshot?`: C, `environment?`: any): *any*

*Implementation of void*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:298](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L298)*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | C |
`environment?` | any |

**Returns:** *any*

###  describe

▸ **describe**(): *string*

*Implementation of void*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:78](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/late.ts#L78)*

**Returns:** *string*

###  getSnapshot

▸ **getSnapshot**(`node`: ExtractNodeType‹IT›, `applyPostProcess?`: undefined | false | true): *IT["SnapshotType"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:303](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L303)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | ExtractNodeType‹IT› |
`applyPostProcess?` | undefined &#124; false &#124; true |

**Returns:** *IT["SnapshotType"]*

###  getSubType

▸ **getSubType**(`mustSucceed`: true): *IT*

*Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:28](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/late.ts#L28)*

**Parameters:**

Name | Type |
------ | ------ |
`mustSucceed` | true |

**Returns:** *IT*

▸ **getSubType**(`mustSucceed`: false): *IT | undefined*

*Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:29](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/late.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`mustSucceed` | false |

**Returns:** *IT | undefined*

###  getSubTypes

▸ **getSubTypes**(): *"cannotDetermine" | IT*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:97](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/late.ts#L97)*

**Returns:** *"cannotDetermine" | IT*

###  instantiate

▸ **instantiate**(`parent`: AnyObjectNode | null, `subpath`: string, `environment`: any, `initialValue`: this["C"] | this["T"]): *this["N"]*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:60](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/late.ts#L60)*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | AnyObjectNode &#124; null |
`subpath` | string |
`environment` | any |
`initialValue` | this["C"] &#124; this["T"] |

**Returns:** *this["N"]*

###  is

▸ **is**(`thing`: any): *thing is any*

*Implementation of void*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:338](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L338)*

**Parameters:**

Name | Type |
------ | ------ |
`thing` | any |

**Returns:** *thing is any*

###  isAssignableFrom

▸ **isAssignableFrom**(`type`: IAnyType): *boolean*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:92](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/late.ts#L92)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IAnyType |

**Returns:** *boolean*

###  isValidSnapshot

▸ **isValidSnapshot**(`value`: this["C"], `context`: IValidationContext): *IValidationResult*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:83](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/late.ts#L83)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | this["C"] |
`context` | IValidationContext |

**Returns:** *IValidationResult*

###  reconcile

▸ **reconcile**(`current`: this["N"], `newValue`: this["C"] | this["T"], `parent`: AnyObjectNode, `subpath`: string): *this["N"]*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:69](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/late.ts#L69)*

**Parameters:**

Name | Type |
------ | ------ |
`current` | this["N"] |
`newValue` | this["C"] &#124; this["T"] |
`parent` | AnyObjectNode |
`subpath` | string |

**Returns:** *this["N"]*

###  validate

▸ **validate**(`value`: IT["CreationType"] | IT["TypeWithoutSTN"], `context`: IValidationContext): *IValidationResult*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:326](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L326)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | IT["CreationType"] &#124; IT["TypeWithoutSTN"] |
`context` | IValidationContext |

**Returns:** *IValidationResult*

___

###  MSTMap

• **MSTMap**:

*Defined in [packages/mobx-state-tree/src/types/complex-types/map.ts:142](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/map.ts#L142)*

###  constructor

\+ **new MSTMap**(`initialData?`: [string, any][] | IKeyValueMap‹any› | Map‹string, any› | undefined): *MSTMap*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/complex-types/map.ts:142](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/map.ts#L142)*

**Parameters:**

Name | Type |
------ | ------ |
`initialData?` | [string, any][] &#124; IKeyValueMap‹any› &#124; Map‹string, any› &#124; undefined |

**Returns:** *MSTMap*

###  [$mobx]

• **[$mobx]**: *object*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:39

#### Type declaration:

###  changeListeners_

• **changeListeners_**: *any*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:44

###  data_

• **data_**: *Map‹string, ObservableValue‹any››*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:40

###  dehancer

• **dehancer**: *any*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:45

###  enhancer_

• **enhancer_**: *IEnhancer‹any›*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:37

###  hasMap_

• **hasMap_**: *Map‹string, ObservableValue‹boolean››*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:41

###  interceptors_

• **interceptors_**: *any*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:43

###  keysAtom_

• **keysAtom_**: *IAtom*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:42

###  name_

• **name_**: *string*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:38

###  [Symbol.toStringTag]

• **[Symbol.toStringTag]**:

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:68

###  size

• **size**:

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:65

###  [Symbol.iterator]

▸ **[Symbol.iterator]**(): *IterableIterator‹IMapEntry‹string, any››*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:59

**Returns:** *IterableIterator‹IMapEntry‹string, any››*

###  clear

▸ **clear**(): *void*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:63

**Returns:** *void*

###  delete

▸ **delete**(`key`: string): *boolean*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/complex-types/map.ts:156](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/map.ts#L156)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *boolean*

###  entries

▸ **entries**(): *IterableIterator‹IMapEntry‹string, any››*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:58

**Returns:** *IterableIterator‹IMapEntry‹string, any››*

###  forEach

▸ **forEach**(`callback`: function, `thisArg?`: any): *void*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:60

**Parameters:**

▪ **callback**: *function*

▸ (`value`: any, `key`: string, `object`: Map‹string, any›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |
`key` | string |
`object` | Map‹string, any› |

▪`Optional`  **thisArg**: *any*

**Returns:** *void*

###  get

▸ **get**(`key`: string): *IT["Type"] | undefined*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/complex-types/map.ts:147](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/map.ts#L147)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *IT["Type"] | undefined*

###  has

▸ **has**(`key`: string): *boolean*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/complex-types/map.ts:152](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/map.ts#L152)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |

**Returns:** *boolean*

###  intercept_

▸ **intercept_**(`handler`: IInterceptor‹IMapWillChange‹string, any››): *Lambda*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:75

**Parameters:**

Name | Type |
------ | ------ |
`handler` | IInterceptor‹IMapWillChange‹string, any›› |

**Returns:** *Lambda*

###  keys

▸ **keys**(): *IterableIterator‹string›*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:56

**Returns:** *IterableIterator‹string›*

###  merge

▸ **merge**(`other`: ObservableMap‹string, any› | IKeyValueMap‹any› | any): *ObservableMap‹string, any›*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:62

Merge another object into this object, returns this.

**Parameters:**

Name | Type |
------ | ------ |
`other` | ObservableMap‹string, any› &#124; IKeyValueMap‹any› &#124; any |

**Returns:** *ObservableMap‹string, any›*

###  observe_

▸ **observe_**(`listener`: function, `fireImmediately?`: undefined | false | true): *Lambda*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:74

Observes this object. Triggers for the events 'add', 'update' and 'delete'.
See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/observe
for callback details

**Parameters:**

▪ **listener**: *function*

▸ (`changes`: IMapDidChange‹string, any›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`changes` | IMapDidChange‹string, any› |

▪`Optional`  **fireImmediately**: *undefined | false | true*

**Returns:** *Lambda*

###  put

▸ **put**(`value`: ExtractCSTWithSTN‹IT›): *IT["Type"]*

*Defined in [packages/mobx-state-tree/src/types/complex-types/map.ts:164](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/map.ts#L164)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | ExtractCSTWithSTN‹IT› |

**Returns:** *IT["Type"]*

###  replace

▸ **replace**(`values`: ObservableMap‹string, any› | IKeyValueMap‹any› | any): *ObservableMap‹string, any›*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:64

**Parameters:**

Name | Type |
------ | ------ |
`values` | ObservableMap‹string, any› &#124; IKeyValueMap‹any› &#124; any |

**Returns:** *ObservableMap‹string, any›*

###  set

▸ **set**(`key`: string, `value`: ExtractCSTWithSTN‹IT›): *this*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/complex-types/map.ts:160](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/map.ts#L160)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | ExtractCSTWithSTN‹IT› |

**Returns:** *this*

###  toJSON

▸ **toJSON**(): *[string, any][]*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:67

**Returns:** *[string, any][]*

###  toString

▸ **toString**(): *string*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:66

**Returns:** *string*

###  values

▸ **values**(): *IterableIterator‹any›*

*Inherited from void*

Defined in node_modules/mobx/dist/types/observablemap.d.ts:57

**Returns:** *IterableIterator‹any›*

___

###  Refinement

• **Refinement**:

*Defined in [packages/mobx-state-tree/src/types/utility-types/refinement.ts:20](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/refinement.ts#L20)*

###  constructor

\+ **new Refinement**(`name`: string, `_subtype`: IT, `_predicate`: function, `_message`: function): *Refinement*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/refinement.ts:28](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/refinement.ts#L28)*

**Parameters:**

▪ **name**: *string*

▪ **_subtype**: *IT*

▪ **_predicate**: *function*

▸ (`v`: IT["CreationType"]): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`v` | IT["CreationType"] |

▪ **_message**: *function*

▸ (`v`: IT["CreationType"]): *string*

**Parameters:**

Name | Type |
------ | ------ |
`v` | IT["CreationType"] |

**Returns:** *Refinement*

### `Readonly` C

• **C**: *IT["CreationType"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:286](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L286)*

### `Readonly` N

• **N**: *ExtractNodeType‹IT›*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:289](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L289)*

### `Readonly` S

• **S**: *IT["SnapshotType"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:287](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L287)*

### `Readonly` T

• **T**: *IT["TypeWithoutSTN"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:288](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L288)*

###  [$type]

• **[$type]**: *undefined*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:283](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L283)*

### `Readonly` isType

• **isType**: *true* = true

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:291](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L291)*

### `Readonly` name

• **name**: *string*

*Implementation of void*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:292](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L292)*

###  CreationType

• **CreationType**:

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:360](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L360)*

###  SnapshotType

• **SnapshotType**:

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:354](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L354)*

###  Type

• **Type**:

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:342](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L342)*

###  TypeWithoutSTN

• **TypeWithoutSTN**:

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:348](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L348)*

###  flags

• **flags**:

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/refinement.ts:26](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/refinement.ts#L26)*

###  create

▸ **create**(`snapshot?`: C, `environment?`: any): *any*

*Implementation of void*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:298](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L298)*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | C |
`environment?` | any |

**Returns:** *any*

###  describe

▸ **describe**(): *string*

*Implementation of void*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/refinement.ts:39](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/refinement.ts#L39)*

**Returns:** *string*

###  getSnapshot

▸ **getSnapshot**(`node`: ExtractNodeType‹IT›, `applyPostProcess?`: undefined | false | true): *IT["SnapshotType"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:303](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L303)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | ExtractNodeType‹IT› |
`applyPostProcess?` | undefined &#124; false &#124; true |

**Returns:** *IT["SnapshotType"]*

###  getSubTypes

▸ **getSubTypes**(): *IT*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/refinement.ts:79](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/refinement.ts#L79)*

**Returns:** *IT*

###  instantiate

▸ **instantiate**(`parent`: AnyObjectNode | null, `subpath`: string, `environment`: any, `initialValue`: this["C"] | this["T"]): *this["N"]*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/refinement.ts:43](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/refinement.ts#L43)*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | AnyObjectNode &#124; null |
`subpath` | string |
`environment` | any |
`initialValue` | this["C"] &#124; this["T"] |

**Returns:** *this["N"]*

###  is

▸ **is**(`thing`: any): *thing is any*

*Implementation of void*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:338](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L338)*

**Parameters:**

Name | Type |
------ | ------ |
`thing` | any |

**Returns:** *thing is any*

###  isAssignableFrom

▸ **isAssignableFrom**(`type`: IAnyType): *boolean*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/refinement.ts:53](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/refinement.ts#L53)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IAnyType |

**Returns:** *boolean*

###  isValidSnapshot

▸ **isValidSnapshot**(`value`: this["C"], `context`: IValidationContext): *IValidationResult*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/refinement.ts:57](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/refinement.ts#L57)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | this["C"] |
`context` | IValidationContext |

**Returns:** *IValidationResult*

###  reconcile

▸ **reconcile**(`current`: this["N"], `newValue`: this["C"] | this["T"], `parent`: AnyObjectNode, `subpath`: string): *this["N"]*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/refinement.ts:70](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/refinement.ts#L70)*

**Parameters:**

Name | Type |
------ | ------ |
`current` | this["N"] |
`newValue` | this["C"] &#124; this["T"] |
`parent` | AnyObjectNode |
`subpath` | string |

**Returns:** *this["N"]*

###  validate

▸ **validate**(`value`: IT["CreationType"] | IT["TypeWithoutSTN"], `context`: IValidationContext): *IValidationResult*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:326](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L326)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | IT["CreationType"] &#124; IT["TypeWithoutSTN"] |
`context` | IValidationContext |

**Returns:** *IValidationResult*

___

###  RunningAction

• **RunningAction**:

*Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:16](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L16)*

###  constructor

\+ **new RunningAction**(`hooks`: IActionTrackingMiddleware2Hooks‹any› | undefined, `call`: IActionTrackingMiddleware2Call‹any›): *RunningAction*

*Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:18](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`hooks` | IActionTrackingMiddleware2Hooks‹any› &#124; undefined |
`call` | IActionTrackingMiddleware2Call‹any› |

**Returns:** *RunningAction*

### `Readonly` call

• **call**: *IActionTrackingMiddleware2Call‹any›*

*Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:22](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L22)*

### `Readonly` hooks

• **hooks**: *IActionTrackingMiddleware2Hooks‹any› | undefined*

*Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:21](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L21)*

###  hasFlowsPending

• **hasFlowsPending**:

*Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:46](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L46)*

###  decFlowsPending

▸ **decFlowsPending**(): *void*

*Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:42](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L42)*

**Returns:** *void*

###  finish

▸ **finish**(`error?`: any): *void*

*Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:29](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L29)*

**Parameters:**

Name | Type |
------ | ------ |
`error?` | any |

**Returns:** *void*

###  incFlowsPending

▸ **incFlowsPending**(): *void*

*Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:38](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L38)*

**Returns:** *void*

___

###  SnapshotProcessor

• **SnapshotProcessor**:

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:30](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L30)*

###  constructor

\+ **new SnapshotProcessor**(`_subtype`: IT, `_processors`: ISnapshotProcessors‹IT["CreationType"], CustomC, IT["SnapshotType"], CustomS›, `name?`: undefined | string): *SnapshotProcessor*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:38](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`_subtype` | IT |
`_processors` | ISnapshotProcessors‹IT["CreationType"], CustomC, IT["SnapshotType"], CustomS› |
`name?` | undefined &#124; string |

**Returns:** *SnapshotProcessor*

### `Readonly` C

• **C**: *_CustomOrOther‹CustomC, IT["CreationType"]›*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:286](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L286)*

### `Readonly` N

• **N**: *ExtractNodeType‹IT›*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:289](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L289)*

### `Readonly` S

• **S**: *_CustomOrOther‹CustomS, IT["SnapshotType"]›*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:287](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L287)*

### `Readonly` T

• **T**: *IT["TypeWithoutSTN"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:288](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L288)*

###  [$type]

• **[$type]**: *undefined*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:283](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L283)*

### `Readonly` isType

• **isType**: *true* = true

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:291](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L291)*

### `Readonly` name

• **name**: *string*

*Implementation of void*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:292](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L292)*

###  CreationType

• **CreationType**:

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:360](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L360)*

###  SnapshotType

• **SnapshotType**:

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:354](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L354)*

###  Type

• **Type**:

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:342](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L342)*

###  TypeWithoutSTN

• **TypeWithoutSTN**:

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:348](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L348)*

###  flags

• **flags**:

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:36](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L36)*

###  create

▸ **create**(`snapshot?`: C, `environment?`: any): *any*

*Implementation of void*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:298](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L298)*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | C |
`environment?` | any |

**Returns:** *any*

###  describe

▸ **describe**(): *string*

*Implementation of void*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:53](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L53)*

**Returns:** *string*

###  getSnapshot

▸ **getSnapshot**(`node`: this["N"], `applyPostProcess`: boolean): *this["S"]*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:118](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L118)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`node` | this["N"] | - |
`applyPostProcess` | boolean | true |

**Returns:** *this["S"]*

###  getSubTypes

▸ **getSubTypes**(): *IT*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:128](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L128)*

**Returns:** *IT*

###  instantiate

▸ **instantiate**(`parent`: AnyObjectNode | null, `subpath`: string, `environment`: any, `initialValue`: this["C"] | this["T"]): *this["N"]*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:81](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L81)*

**Parameters:**

Name | Type |
------ | ------ |
`parent` | AnyObjectNode &#124; null |
`subpath` | string |
`environment` | any |
`initialValue` | this["C"] &#124; this["T"] |

**Returns:** *this["N"]*

###  is

▸ **is**(`thing`: any): *thing is any*

*Implementation of void*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:132](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L132)*

**Parameters:**

Name | Type |
------ | ------ |
`thing` | any |

**Returns:** *thing is any*

###  isAssignableFrom

▸ **isAssignableFrom**(`type`: IAnyType): *boolean*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:141](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L141)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IAnyType |

**Returns:** *boolean*

###  isMatchingSnapshotId

▸ **isMatchingSnapshotId**(`current`: this["N"], `snapshot`: this["C"]): *boolean*

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:145](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L145)*

**Parameters:**

Name | Type |
------ | ------ |
`current` | this["N"] |
`snapshot` | this["C"] |

**Returns:** *boolean*

###  isValidSnapshot

▸ **isValidSnapshot**(`value`: this["C"], `context`: IValidationContext): *IValidationResult*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:123](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L123)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | this["C"] |
`context` | IValidationContext |

**Returns:** *IValidationResult*

###  reconcile

▸ **reconcile**(`current`: this["N"], `newValue`: this["C"] | this["T"], `parent`: AnyObjectNode, `subpath`: string): *this["N"]*

*Overrides void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:100](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L100)*

**Parameters:**

Name | Type |
------ | ------ |
`current` | this["N"] |
`newValue` | this["C"] &#124; this["T"] |
`parent` | AnyObjectNode |
`subpath` | string |

**Returns:** *this["N"]*

###  validate

▸ **validate**(`value`: _CustomOrOther‹CustomC, IT["CreationType"]› | IT["TypeWithoutSTN"], `context`: IValidationContext): *IValidationResult*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:326](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L326)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | _CustomOrOther‹CustomC, IT["CreationType"]› &#124; IT["TypeWithoutSTN"] |
`context` | IValidationContext |

**Returns:** *IValidationResult*

___

###  StoredReference

• **StoredReference**:

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:62](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L62)*

###  constructor

\+ **new StoredReference**(`value`: ReferenceT‹IT› | ReferenceIdentifier, `targetType`: IT): *StoredReference*

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:69](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L69)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | ReferenceT‹IT› &#124; ReferenceIdentifier |
`targetType` | IT |

**Returns:** *StoredReference*

### `Readonly` identifier

• **identifier**: *ReferenceIdentifier*

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:63](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L63)*

###  node

• **node**: *AnyNode*

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:64](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L64)*

###  resolvedValue

• **resolvedValue**:

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:116](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L116)*

## Interfaces

###  CustomTypeOptions

• **CustomTypeOptions**:

*Defined in [packages/mobx-state-tree/src/types/utility-types/custom.ts:13](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/custom.ts#L13)*

###  name

• **name**: *string*

*Defined in [packages/mobx-state-tree/src/types/utility-types/custom.ts:15](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/custom.ts#L15)*

Friendly name

###  fromSnapshot

▸ **fromSnapshot**(`snapshot`: S, `env?`: any): *T*

*Defined in [packages/mobx-state-tree/src/types/utility-types/custom.ts:17](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/custom.ts#L17)*

given a serialized value and environment, how to turn it into the target type

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | S |
`env?` | any |

**Returns:** *T*

###  getValidationMessage

▸ **getValidationMessage**(`snapshot`: S): *string*

*Defined in [packages/mobx-state-tree/src/types/utility-types/custom.ts:23](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/custom.ts#L23)*

a non empty string is assumed to be a validation error

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | S |

**Returns:** *string*

###  isTargetType

▸ **isTargetType**(`value`: T | S): *boolean*

*Defined in [packages/mobx-state-tree/src/types/utility-types/custom.ts:21](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/custom.ts#L21)*

if true, this is a converted value, if false, it's a snapshot

**Parameters:**

Name | Type |
------ | ------ |
`value` | T &#124; S |

**Returns:** *boolean*

###  toSnapshot

▸ **toSnapshot**(`value`: T): *S*

*Defined in [packages/mobx-state-tree/src/types/utility-types/custom.ts:19](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/custom.ts#L19)*

return the serialization of the current value

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

**Returns:** *S*

___

###  IActionContext

• **IActionContext**:

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:4](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/actionContext.ts#L4)*

### `Readonly` args

• **args**: *any[]*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:20](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/actionContext.ts#L20)*

Event arguments in an array (action arguments for actions)

### `Readonly` context

• **context**: *IAnyStateTreeNode*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:15](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/actionContext.ts#L15)*

Event context (node where the action was invoked)

### `Readonly` id

• **id**: *number*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:9](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/actionContext.ts#L9)*

Event unique id

### `Readonly` name

• **name**: *string*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:6](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/actionContext.ts#L6)*

Event name (action name for actions)

### `Readonly` parentActionEvent

• **parentActionEvent**: *IMiddlewareEvent | undefined*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:12](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/actionContext.ts#L12)*

Parent action event object

### `Readonly` tree

• **tree**: *IAnyStateTreeNode*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:17](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/actionContext.ts#L17)*

Event tree (root node of the node where the action was invoked)

___

###  IActionRecorder

• **IActionRecorder**:

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:36](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/on-action.ts#L36)*

###  actions

• **actions**: *ReadonlyArray‹ISerializedActionCall›*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:37](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/on-action.ts#L37)*

### `Readonly` recording

• **recording**: *boolean*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:38](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/on-action.ts#L38)*

###  replay

▸ **replay**(`target`: IAnyStateTreeNode): *void*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:41](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/on-action.ts#L41)*

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *void*

###  resume

▸ **resume**(): *void*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:40](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/on-action.ts#L40)*

**Returns:** *void*

###  stop

▸ **stop**(): *void*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:39](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/on-action.ts#L39)*

**Returns:** *void*

___

###  IActionTrackingMiddleware2Call

• **IActionTrackingMiddleware2Call**:

*Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:5](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L5)*

###  env

• **env**: *TEnv | undefined*

*Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:6](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L6)*

### `Optional` `Readonly` parentCall

• **parentCall**? : *IActionTrackingMiddleware2Call‹TEnv›*

*Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:7](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L7)*

___

###  IActionTrackingMiddleware2Hooks

• **IActionTrackingMiddleware2Hooks**:

*Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:10](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L10)*

### `Optional` filter

• **filter**? : *undefined | function*

*Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:11](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L11)*

###  onFinish

• **onFinish**: *function*

*Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:13](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L13)*

#### Type declaration:

▸ (`call`: IActionTrackingMiddleware2Call‹TEnv›, `error?`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | IActionTrackingMiddleware2Call‹TEnv› |
`error?` | any |

###  onStart

• **onStart**: *function*

*Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:12](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L12)*

#### Type declaration:

▸ (`call`: IActionTrackingMiddleware2Call‹TEnv›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | IActionTrackingMiddleware2Call‹TEnv› |

___

###  IActionTrackingMiddlewareHooks

• **IActionTrackingMiddlewareHooks**:

*Defined in [packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts:5](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts#L5)*

### `Optional` filter

• **filter**? : *undefined | function*

*Defined in [packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts:6](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts#L6)*

###  onFail

• **onFail**: *function*

*Defined in [packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts:11](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts#L11)*

#### Type declaration:

▸ (`call`: IMiddlewareEvent, `context`: T, `error`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | IMiddlewareEvent |
`context` | T |
`error` | any |

###  onResume

• **onResume**: *function*

*Defined in [packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts:8](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts#L8)*

#### Type declaration:

▸ (`call`: IMiddlewareEvent, `context`: T): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | IMiddlewareEvent |
`context` | T |

###  onStart

• **onStart**: *function*

*Defined in [packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts:7](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts#L7)*

#### Type declaration:

▸ (`call`: IMiddlewareEvent): *T*

**Parameters:**

Name | Type |
------ | ------ |
`call` | IMiddlewareEvent |

###  onSuccess

• **onSuccess**: *function*

*Defined in [packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts:10](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts#L10)*

#### Type declaration:

▸ (`call`: IMiddlewareEvent, `context`: T, `result`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | IMiddlewareEvent |
`context` | T |
`result` | any |

###  onSuspend

• **onSuspend**: *function*

*Defined in [packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts:9](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts#L9)*

#### Type declaration:

▸ (`call`: IMiddlewareEvent, `context`: T): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | IMiddlewareEvent |
`context` | T |

___

###  IAnyComplexType

• **IAnyComplexType**:

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:213](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L213)*

Any kind of complex type.

### `Optional` `Readonly` identifierAttribute

• **identifierAttribute**? : *undefined | string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:86](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L86)*

Name of the identifier attribute or null if none.

###  name

• **name**: *string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:81](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L81)*

Friendly type name.

###  create

▸ **create**(`snapshot?`: C, `env?`: any): *this["Type"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:93](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L93)*

Creates an instance for the type given an snapshot input.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | C |
`env?` | any |

**Returns:** *this["Type"]*

An instance of that type.

###  describe

▸ **describe**(): *string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:115](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L115)*

Gets the textual representation of the type as a string.

**Returns:** *string*

###  is

▸ **is**(`thing`: any): *thing is any | this["Type"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:101](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L101)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *thing is any | this["Type"]*

true if the value is of the current type, false otherwise.

###  validate

▸ **validate**(`thing`: any, `context`: IValidationContext): *IValidationResult*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:110](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L110)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Value to be checked, either a snapshot or an instance. |
`context` | IValidationContext | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *IValidationResult*

The validation result, an array with the list of validation errors.

___

###  IAnyModelType

• **IAnyModelType**:

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:229](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L229)*

Any model type.

### `Optional` `Readonly` identifierAttribute

• **identifierAttribute**? : *undefined | string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:86](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L86)*

Name of the identifier attribute or null if none.

###  name

• **name**: *string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:81](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L81)*

Friendly type name.

### `Readonly` properties

• **properties**: *any*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:189](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L189)*

###  actions

▸ **actions**‹**A**›(`fn`: function): *IModelType‹any, any & A, any, any›*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:203](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L203)*

**Type parameters:**

▪ **A**: *ModelActions*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: Instance‹this›): *A*

**Parameters:**

Name | Type |
------ | ------ |
`self` | Instance‹this› |

**Returns:** *IModelType‹any, any & A, any, any›*

###  create

▸ **create**(`snapshot?`: C, `env?`: any): *this["Type"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:93](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L93)*

Creates an instance for the type given an snapshot input.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | C |
`env?` | any |

**Returns:** *this["Type"]*

An instance of that type.

###  describe

▸ **describe**(): *string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:115](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L115)*

Gets the textual representation of the type as a string.

**Returns:** *string*

###  extend

▸ **extend**‹**A**, **V**, **VS**›(`fn`: function): *IModelType‹any, any & A & V & VS, any, any›*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:211](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L211)*

**Type parameters:**

▪ **A**: *ModelActions*

▪ **V**: *Object*

▪ **VS**: *Object*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: Instance‹this›): *object*

**Parameters:**

Name | Type |
------ | ------ |
`self` | Instance‹this› |

* **actions**? : *A*

* **state**? : *VS*

* **views**? : *V*

**Returns:** *IModelType‹any, any & A & V & VS, any, any›*

###  is

▸ **is**(`thing`: any): *thing is ModelCreationType2‹any, any› | this["Type"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:101](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L101)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *thing is ModelCreationType2‹any, any› | this["Type"]*

true if the value is of the current type, false otherwise.

###  named

▸ **named**(`newName`: string): *IModelType‹any, any, any, any›*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:191](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L191)*

**Parameters:**

Name | Type |
------ | ------ |
`newName` | string |

**Returns:** *IModelType‹any, any, any, any›*

###  postProcessSnapshot

▸ **postProcessSnapshot**‹**NewS**›(`fn`: function): *IModelType‹any, any, any, NewS›*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:221](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L221)*

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

**Returns:** *IModelType‹any, any, any, NewS›*

###  preProcessSnapshot

▸ **preProcessSnapshot**‹**NewC**›(`fn`: function): *IModelType‹any, any, NewC, any›*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:216](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L216)*

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

**Returns:** *IModelType‹any, any, NewC, any›*

###  props

▸ **props**‹**PROPS2**›(`props`: PROPS2): *IModelType‹any & ModelPropertiesDeclarationToProperties‹PROPS2›, any, any, any›*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:195](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L195)*

**Type parameters:**

▪ **PROPS2**: *ModelPropertiesDeclaration*

**Parameters:**

Name | Type |
------ | ------ |
`props` | PROPS2 |

**Returns:** *IModelType‹any & ModelPropertiesDeclarationToProperties‹PROPS2›, any, any, any›*

###  validate

▸ **validate**(`thing`: ModelCreationType2‹any, any›, `context`: IValidationContext): *IValidationResult*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:110](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L110)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | ModelCreationType2‹any, any› | Value to be checked, either a snapshot or an instance. |
`context` | IValidationContext | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *IValidationResult*

The validation result, an array with the list of validation errors.

###  views

▸ **views**‹**V**›(`fn`: function): *IModelType‹any, any & V, any, any›*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:199](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L199)*

**Type parameters:**

▪ **V**: *Object*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: Instance‹this›): *V*

**Parameters:**

Name | Type |
------ | ------ |
`self` | Instance‹this› |

**Returns:** *IModelType‹any, any & V, any, any›*

###  volatile

▸ **volatile**‹**TP**›(`fn`: function): *IModelType‹any, any & TP, any, any›*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:207](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L207)*

**Type parameters:**

▪ **TP**: *object*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: Instance‹this›): *TP*

**Parameters:**

Name | Type |
------ | ------ |
`self` | Instance‹this› |

**Returns:** *IModelType‹any, any & TP, any, any›*

___

###  IAnyType

• **IAnyType**:

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:193](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L193)*

Any kind of type.

### `Optional` `Readonly` identifierAttribute

• **identifierAttribute**? : *undefined | string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:86](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L86)*

Name of the identifier attribute or null if none.

###  name

• **name**: *string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:81](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L81)*

Friendly type name.

###  create

▸ **create**(`snapshot?`: C, `env?`: any): *this["Type"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:93](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L93)*

Creates an instance for the type given an snapshot input.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | C |
`env?` | any |

**Returns:** *this["Type"]*

An instance of that type.

###  describe

▸ **describe**(): *string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:115](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L115)*

Gets the textual representation of the type as a string.

**Returns:** *string*

###  is

▸ **is**(`thing`: any): *thing is any | this["Type"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:101](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L101)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *thing is any | this["Type"]*

true if the value is of the current type, false otherwise.

###  validate

▸ **validate**(`thing`: any, `context`: IValidationContext): *IValidationResult*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:110](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L110)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Value to be checked, either a snapshot or an instance. |
`context` | IValidationContext | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *IValidationResult*

The validation result, an array with the list of validation errors.

___

###  IHooks

• **IHooks**:

*Defined in [packages/mobx-state-tree/src/core/node/Hook.ts:12](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/Hook.ts#L12)*

### `Optional` [Hook.afterAttach]

• **[Hook.afterAttach]**? : *undefined | function*

*Defined in [packages/mobx-state-tree/src/core/node/Hook.ts:14](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/Hook.ts#L14)*

### `Optional` [Hook.afterCreate]

• **[Hook.afterCreate]**? : *undefined | function*

*Defined in [packages/mobx-state-tree/src/core/node/Hook.ts:13](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/Hook.ts#L13)*

### `Optional` [Hook.beforeDestroy]

• **[Hook.beforeDestroy]**? : *undefined | function*

*Defined in [packages/mobx-state-tree/src/core/node/Hook.ts:16](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/Hook.ts#L16)*

### `Optional` [Hook.beforeDetach]

• **[Hook.beforeDetach]**? : *undefined | function*

*Defined in [packages/mobx-state-tree/src/core/node/Hook.ts:15](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/Hook.ts#L15)*

___

###  IJsonPatch

• **IJsonPatch**:

*Defined in [packages/mobx-state-tree/src/core/json-patch.ts:7](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/json-patch.ts#L7)*

https://tools.ietf.org/html/rfc6902
http://jsonpatch.com/

### `Readonly` op

• **op**: *"replace" | "add" | "remove"*

*Defined in [packages/mobx-state-tree/src/core/json-patch.ts:8](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/json-patch.ts#L8)*

### `Readonly` path

• **path**: *string*

*Defined in [packages/mobx-state-tree/src/core/json-patch.ts:9](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/json-patch.ts#L9)*

### `Optional` `Readonly` value

• **value**? : *any*

*Defined in [packages/mobx-state-tree/src/core/json-patch.ts:10](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/json-patch.ts#L10)*

___

###  IMiddlewareEvent

• **IMiddlewareEvent**:

*Defined in [packages/mobx-state-tree/src/core/action.ts:25](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/action.ts#L25)*

### `Readonly` allParentIds

• **allParentIds**: *number[]*

*Defined in [packages/mobx-state-tree/src/core/action.ts:37](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/action.ts#L37)*

Id of all events, from root until current (excluding current)

### `Readonly` args

• **args**: *any[]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:20](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/actionContext.ts#L20)*

Event arguments in an array (action arguments for actions)

### `Readonly` context

• **context**: *IAnyStateTreeNode*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:15](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/actionContext.ts#L15)*

Event context (node where the action was invoked)

### `Readonly` id

• **id**: *number*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:9](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/actionContext.ts#L9)*

Event unique id

### `Readonly` name

• **name**: *string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:6](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/actionContext.ts#L6)*

Event name (action name for actions)

### `Readonly` parentActionEvent

• **parentActionEvent**: *IMiddlewareEvent | undefined*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:12](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/actionContext.ts#L12)*

Parent action event object

### `Readonly` parentEvent

• **parentEvent**: *IMiddlewareEvent | undefined*

*Defined in [packages/mobx-state-tree/src/core/action.ts:32](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/action.ts#L32)*

Parent event object

### `Readonly` parentId

• **parentId**: *number*

*Defined in [packages/mobx-state-tree/src/core/action.ts:30](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/action.ts#L30)*

Parent event unique id

### `Readonly` rootId

• **rootId**: *number*

*Defined in [packages/mobx-state-tree/src/core/action.ts:35](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/action.ts#L35)*

Root event unique id

### `Readonly` tree

• **tree**: *IAnyStateTreeNode*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:17](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/actionContext.ts#L17)*

Event tree (root node of the node where the action was invoked)

### `Readonly` type

• **type**: *IMiddlewareEventType*

*Defined in [packages/mobx-state-tree/src/core/action.ts:27](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/action.ts#L27)*

Event type

___

###  IModelReflectionData

• **IModelReflectionData**:

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:834](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L834)*

###  actions

• **actions**: *string[]*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:835](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L835)*

###  name

• **name**: *string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:805](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L805)*

###  properties

• **properties**: *object*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:806](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L806)*

#### Type declaration:

* \[ **K**: *string*\]: IAnyType

###  views

• **views**: *string[]*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:836](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L836)*

###  volatile

• **volatile**: *string[]*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:837](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L837)*

___

###  IModelReflectionPropertiesData

• **IModelReflectionPropertiesData**:

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:804](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L804)*

###  name

• **name**: *string*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:805](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L805)*

###  properties

• **properties**: *object*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:806](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L806)*

#### Type declaration:

* \[ **K**: *string*\]: IAnyType

___

###  IModelType

• **IModelType**:

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:178](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L178)*

### `Optional` `Readonly` identifierAttribute

• **identifierAttribute**? : *undefined | string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:86](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L86)*

Name of the identifier attribute or null if none.

###  name

• **name**: *string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:81](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L81)*

Friendly type name.

### `Readonly` properties

• **properties**: *PROPS*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:189](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L189)*

###  actions

▸ **actions**‹**A**›(`fn`: function): *IModelType‹PROPS, OTHERS & A, CustomC, CustomS›*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:203](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L203)*

**Type parameters:**

▪ **A**: *ModelActions*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: Instance‹this›): *A*

**Parameters:**

Name | Type |
------ | ------ |
`self` | Instance‹this› |

**Returns:** *IModelType‹PROPS, OTHERS & A, CustomC, CustomS›*

###  create

▸ **create**(`snapshot?`: C, `env?`: any): *this["Type"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:93](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L93)*

Creates an instance for the type given an snapshot input.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | C |
`env?` | any |

**Returns:** *this["Type"]*

An instance of that type.

###  describe

▸ **describe**(): *string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:115](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L115)*

Gets the textual representation of the type as a string.

**Returns:** *string*

###  extend

▸ **extend**‹**A**, **V**, **VS**›(`fn`: function): *IModelType‹PROPS, OTHERS & A & V & VS, CustomC, CustomS›*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:211](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L211)*

**Type parameters:**

▪ **A**: *ModelActions*

▪ **V**: *Object*

▪ **VS**: *Object*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: Instance‹this›): *object*

**Parameters:**

Name | Type |
------ | ------ |
`self` | Instance‹this› |

* **actions**? : *A*

* **state**? : *VS*

* **views**? : *V*

**Returns:** *IModelType‹PROPS, OTHERS & A & V & VS, CustomC, CustomS›*

###  is

▸ **is**(`thing`: any): *thing is ModelCreationType2‹PROPS, CustomC› | this["Type"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:101](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L101)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *thing is ModelCreationType2‹PROPS, CustomC› | this["Type"]*

true if the value is of the current type, false otherwise.

###  named

▸ **named**(`newName`: string): *IModelType‹PROPS, OTHERS, CustomC, CustomS›*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:191](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L191)*

**Parameters:**

Name | Type |
------ | ------ |
`newName` | string |

**Returns:** *IModelType‹PROPS, OTHERS, CustomC, CustomS›*

###  postProcessSnapshot

▸ **postProcessSnapshot**‹**NewS**›(`fn`: function): *IModelType‹PROPS, OTHERS, CustomC, NewS›*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:221](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L221)*

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

**Returns:** *IModelType‹PROPS, OTHERS, CustomC, NewS›*

###  preProcessSnapshot

▸ **preProcessSnapshot**‹**NewC**›(`fn`: function): *IModelType‹PROPS, OTHERS, NewC, CustomS›*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:216](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L216)*

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

**Returns:** *IModelType‹PROPS, OTHERS, NewC, CustomS›*

###  props

▸ **props**‹**PROPS2**›(`props`: PROPS2): *IModelType‹PROPS & ModelPropertiesDeclarationToProperties‹PROPS2›, OTHERS, CustomC, CustomS›*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:195](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L195)*

**Type parameters:**

▪ **PROPS2**: *ModelPropertiesDeclaration*

**Parameters:**

Name | Type |
------ | ------ |
`props` | PROPS2 |

**Returns:** *IModelType‹PROPS & ModelPropertiesDeclarationToProperties‹PROPS2›, OTHERS, CustomC, CustomS›*

###  validate

▸ **validate**(`thing`: ModelCreationType2‹PROPS, CustomC›, `context`: IValidationContext): *IValidationResult*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:110](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L110)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | ModelCreationType2‹PROPS, CustomC› | Value to be checked, either a snapshot or an instance. |
`context` | IValidationContext | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *IValidationResult*

The validation result, an array with the list of validation errors.

###  views

▸ **views**‹**V**›(`fn`: function): *IModelType‹PROPS, OTHERS & V, CustomC, CustomS›*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:199](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L199)*

**Type parameters:**

▪ **V**: *Object*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: Instance‹this›): *V*

**Parameters:**

Name | Type |
------ | ------ |
`self` | Instance‹this› |

**Returns:** *IModelType‹PROPS, OTHERS & V, CustomC, CustomS›*

###  volatile

▸ **volatile**‹**TP**›(`fn`: function): *IModelType‹PROPS, OTHERS & TP, CustomC, CustomS›*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:207](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L207)*

**Type parameters:**

▪ **TP**: *object*

**Parameters:**

▪ **fn**: *function*

▸ (`self`: Instance‹this›): *TP*

**Parameters:**

Name | Type |
------ | ------ |
`self` | Instance‹this› |

**Returns:** *IModelType‹PROPS, OTHERS & TP, CustomC, CustomS›*

___

###  IPatchRecorder

• **IPatchRecorder**:

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:137](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L137)*

###  inversePatches

• **inversePatches**: *ReadonlyArray‹IJsonPatch›*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:139](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L139)*

###  patches

• **patches**: *ReadonlyArray‹IJsonPatch›*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:138](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L138)*

### `Readonly` recording

• **recording**: *boolean*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:141](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L141)*

###  reversedInversePatches

• **reversedInversePatches**: *ReadonlyArray‹IJsonPatch›*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:140](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L140)*

###  replay

▸ **replay**(`target?`: IAnyStateTreeNode): *void*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:144](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L144)*

**Parameters:**

Name | Type |
------ | ------ |
`target?` | IAnyStateTreeNode |

**Returns:** *void*

###  resume

▸ **resume**(): *void*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:143](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L143)*

**Returns:** *void*

###  stop

▸ **stop**(): *void*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:142](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L142)*

**Returns:** *void*

###  undo

▸ **undo**(`target?`: IAnyStateTreeNode): *void*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:145](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L145)*

**Parameters:**

Name | Type |
------ | ------ |
`target?` | IAnyStateTreeNode |

**Returns:** *void*

___

###  IReversibleJsonPatch

• **IReversibleJsonPatch**:

*Defined in [packages/mobx-state-tree/src/core/json-patch.ts:13](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/json-patch.ts#L13)*

### `Readonly` oldValue

• **oldValue**: *any*

*Defined in [packages/mobx-state-tree/src/core/json-patch.ts:14](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/json-patch.ts#L14)*

### `Readonly` op

• **op**: *"replace" | "add" | "remove"*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/json-patch.ts:8](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/json-patch.ts#L8)*

### `Readonly` path

• **path**: *string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/json-patch.ts:9](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/json-patch.ts#L9)*

### `Optional` `Readonly` value

• **value**? : *any*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/json-patch.ts:10](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/json-patch.ts#L10)*

___

###  ISerializedActionCall

• **ISerializedActionCall**:

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:30](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/on-action.ts#L30)*

### `Optional` args

• **args**? : *any[]*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:33](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/on-action.ts#L33)*

###  name

• **name**: *string*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:31](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/on-action.ts#L31)*

### `Optional` path

• **path**? : *undefined | string*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:32](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/on-action.ts#L32)*

___

###  ISimpleType

• **ISimpleType**:

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:198](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L198)*

A simple type, this is, a type where the instance and the snapshot representation are the same.

### `Optional` `Readonly` identifierAttribute

• **identifierAttribute**? : *undefined | string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:86](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L86)*

Name of the identifier attribute or null if none.

###  name

• **name**: *string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:81](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L81)*

Friendly type name.

###  create

▸ **create**(`snapshot?`: C, `env?`: any): *this["Type"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:93](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L93)*

Creates an instance for the type given an snapshot input.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | C |
`env?` | any |

**Returns:** *this["Type"]*

An instance of that type.

###  describe

▸ **describe**(): *string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:115](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L115)*

Gets the textual representation of the type as a string.

**Returns:** *string*

###  is

▸ **is**(`thing`: any): *thing is T | this["Type"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:101](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L101)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *thing is T | this["Type"]*

true if the value is of the current type, false otherwise.

###  validate

▸ **validate**(`thing`: T, `context`: IValidationContext): *IValidationResult*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:110](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L110)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | T | Value to be checked, either a snapshot or an instance. |
`context` | IValidationContext | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *IValidationResult*

The validation result, an array with the list of validation errors.

___

###  ISnapshotProcessor

• **ISnapshotProcessor**:

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:169](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L169)*

A type that has its snapshots processed.

### `Optional` `Readonly` identifierAttribute

• **identifierAttribute**? : *undefined | string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:86](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L86)*

Name of the identifier attribute or null if none.

###  name

• **name**: *string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:81](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L81)*

Friendly type name.

###  create

▸ **create**(`snapshot?`: C, `env?`: any): *this["Type"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:93](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L93)*

Creates an instance for the type given an snapshot input.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | C |
`env?` | any |

**Returns:** *this["Type"]*

An instance of that type.

###  describe

▸ **describe**(): *string*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:115](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L115)*

Gets the textual representation of the type as a string.

**Returns:** *string*

###  is

▸ **is**(`thing`: any): *thing is _CustomOrOther‹CustomC, IT["CreationType"]› | this["Type"]*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:101](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L101)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *thing is _CustomOrOther‹CustomC, IT["CreationType"]› | this["Type"]*

true if the value is of the current type, false otherwise.

###  validate

▸ **validate**(`thing`: _CustomOrOther‹CustomC, IT["CreationType"]›, `context`: IValidationContext): *IValidationResult*

*Inherited from void*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:110](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L110)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | _CustomOrOther‹CustomC, IT["CreationType"]› | Value to be checked, either a snapshot or an instance. |
`context` | IValidationContext | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *IValidationResult*

The validation result, an array with the list of validation errors.

___

###  ISnapshotProcessors

• **ISnapshotProcessors**:

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:179](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L179)*

Snapshot processors.

### `Optional` postProcessor

▸ **postProcessor**(`snapshot`: S): *CustomS*

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:188](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L188)*

Function that transforms an output snapshot.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`snapshot` | S |   |

**Returns:** *CustomS*

### `Optional` preProcessor

▸ **preProcessor**(`snapshot`: CustomC): *C*

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:183](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L183)*

Function that transforms an input snapshot.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | CustomC |

**Returns:** *C*

___

###  IType

• **IType**:

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:73](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L73)*

A type, either complex or simple.

### `Optional` `Readonly` identifierAttribute

• **identifierAttribute**? : *undefined | string*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:86](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L86)*

Name of the identifier attribute or null if none.

###  name

• **name**: *string*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:81](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L81)*

Friendly type name.

###  create

▸ **create**(`snapshot?`: C, `env?`: any): *this["Type"]*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:93](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L93)*

Creates an instance for the type given an snapshot input.

**Parameters:**

Name | Type |
------ | ------ |
`snapshot?` | C |
`env?` | any |

**Returns:** *this["Type"]*

An instance of that type.

###  describe

▸ **describe**(): *string*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:115](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L115)*

Gets the textual representation of the type as a string.

**Returns:** *string*

###  is

▸ **is**(`thing`: any): *thing is C | this["Type"]*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:101](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L101)*

Checks if a given snapshot / instance is of the given type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | any | Snapshot or instance to be checked. |

**Returns:** *thing is C | this["Type"]*

true if the value is of the current type, false otherwise.

###  validate

▸ **validate**(`thing`: C, `context`: IValidationContext): *IValidationResult*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:110](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L110)*

Run's the type's typechecker on the given value with the given validation context.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`thing` | C | Value to be checked, either a snapshot or an instance. |
`context` | IValidationContext | Validation context, an array of { subpaths, subtypes } that should be validated |

**Returns:** *IValidationResult*

The validation result, an array with the list of validation errors.

___

###  IValidationContextEntry

• **IValidationContextEntry**:

*Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:15](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type-checker.ts#L15)*

Validation context entry, this is, where the validation should run against which type

###  path

• **path**: *string*

*Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:17](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type-checker.ts#L17)*

Subpath where the validation should be run, or an empty string to validate it all

###  type

• **type**: *IAnyType*

*Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:19](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type-checker.ts#L19)*

Type to validate the subpath against

___

###  IValidationError

• **IValidationError**:

*Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:26](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type-checker.ts#L26)*

Type validation error

###  context

• **context**: *IValidationContext*

*Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:28](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type-checker.ts#L28)*

Validation context

### `Optional` message

• **message**? : *undefined | string*

*Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:32](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type-checker.ts#L32)*

Error message

###  value

• **value**: *any*

*Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:30](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type-checker.ts#L30)*

Value that was being validated, either a snapshot or an instance

___

###  ReferenceOptionsGetSet

• **ReferenceOptionsGetSet**:

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:463](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L463)*

###  get

▸ **get**(`identifier`: ReferenceIdentifier, `parent`: IAnyStateTreeNode | null): *ReferenceT‹IT›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:464](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L464)*

**Parameters:**

Name | Type |
------ | ------ |
`identifier` | ReferenceIdentifier |
`parent` | IAnyStateTreeNode &#124; null |

**Returns:** *ReferenceT‹IT›*

###  set

▸ **set**(`value`: ReferenceT‹IT›, `parent`: IAnyStateTreeNode | null): *ReferenceIdentifier*

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:465](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L465)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | ReferenceT‹IT› |
`parent` | IAnyStateTreeNode &#124; null |

**Returns:** *ReferenceIdentifier*

___

###  ReferenceOptionsOnInvalidated

• **ReferenceOptionsOnInvalidated**:

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:468](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L468)*

###  onInvalidated

• **onInvalidated**: *OnReferenceInvalidated‹ReferenceT‹IT››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:470](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L470)*

___

###  UnionOptions

• **UnionOptions**:

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:29](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L29)*

### `Optional` dispatcher

• **dispatcher**? : *ITypeDispatcher*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:31](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L31)*

### `Optional` eager

• **eager**? : *undefined | false | true*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:30](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L30)*

## Type aliases

###  HookSubscribers

Ƭ **HookSubscribers**: *object*

*Defined in [packages/mobx-state-tree/src/core/node/BaseNode.ts:13](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/BaseNode.ts#L13)*

#### Type declaration:

* **[Hook.afterAttach]**: *function*

* **[Hook.afterCreate]**: *function*

* **[Hook.afterCreationFinalization]**: *function*

* **[Hook.beforeDestroy]**: *function*

* **[Hook.beforeDetach]**: *function*

___

###  IDisposer

Ƭ **IDisposer**: *function*

*Defined in [packages/mobx-state-tree/src/utils.ts:41](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/utils.ts#L41)*

A generic disposer.

#### Type declaration:

▸ (): *void*

___

###  IFunctionReturn

Ƭ **IFunctionReturn**: *function*

*Defined in [packages/mobx-state-tree/src/types/utility-types/optional.ts:19](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/optional.ts#L19)*

#### Type declaration:

▸ (): *T*

___

###  IHooksGetter

Ƭ **IHooksGetter**: *function*

*Defined in [packages/mobx-state-tree/src/core/node/Hook.ts:19](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/Hook.ts#L19)*

#### Type declaration:

▸ (`self`: T): *IHooks*

**Parameters:**

Name | Type |
------ | ------ |
`self` | T |

___

###  IMiddlewareEventType

Ƭ **IMiddlewareEventType**: *"action" | "flow_spawn" | "flow_resume" | "flow_resume_error" | "flow_return" | "flow_throw"*

*Defined in [packages/mobx-state-tree/src/core/action.ts:16](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/action.ts#L16)*

___

###  IMiddlewareHandler

Ƭ **IMiddlewareHandler**: *function*

*Defined in [packages/mobx-state-tree/src/core/action.ts:49](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/action.ts#L49)*

#### Type declaration:

▸ (`actionCall`: IMiddlewareEvent, `next`: function, `abort`: function): *any*

**Parameters:**

▪ **actionCall**: *IMiddlewareEvent*

▪ **next**: *function*

▸ (`actionCall`: IMiddlewareEvent, `callback?`: undefined | function): *void*

**Parameters:**

Name | Type |
------ | ------ |
`actionCall` | IMiddlewareEvent |
`callback?` | undefined &#124; function |

▪ **abort**: *function*

▸ (`value`: any): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

___

###  IOptionalValue

Ƭ **IOptionalValue**: *C | IFunctionReturn‹C | T›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/optional.ts:21](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/optional.ts#L21)*

___

###  ITypeDispatcher

Ƭ **ITypeDispatcher**: *function*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:27](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L27)*

#### Type declaration:

▸ (`snapshot`: any): *IAnyType*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | any |

___

###  IValidationContext

Ƭ **IValidationContext**: *IValidationContextEntry[]*

*Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:23](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type-checker.ts#L23)*

Array of validation context entries

___

###  IValidationResult

Ƭ **IValidationResult**: *IValidationError[]*

*Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:36](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type-checker.ts#L36)*

Type validation result, which is an array of type validation errors

___

###  Instance

Ƭ **Instance**: *T extends object ? T["Type"] : T*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:227](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L227)*

The instance representation of a given type.

___

###  InternalEventHandlers

Ƭ **InternalEventHandlers**: *object*

*Defined in [packages/mobx-state-tree/src/core/node/object-node.ts:73](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/object-node.ts#L73)*

#### Type declaration:

* **[InternalEvents.Dispose]**: *IDisposer*

* **[InternalEvents.Patch]**: *function*

* **[InternalEvents.Snapshot]**: *function*

___

###  LivelinessMode

Ƭ **LivelinessMode**: *"warn" | "error" | "ignore"*

*Defined in [packages/mobx-state-tree/src/core/node/livelinessChecking.ts:7](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/livelinessChecking.ts#L7)*

Defines what MST should do when running into reads / writes to objects that have died.
- `"warn"`: Print a warning (default).
- `"error"`: Throw an exception.
- "`ignore`": Do nothing.

___

###  Omit

Ƭ **Omit**: *Pick‹T, Exclude‹keyof T, K››*

*Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:3](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L3)*

___

###  OnReferenceInvalidated

Ƭ **OnReferenceInvalidated**: *function*

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:43](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L43)*

#### Type declaration:

▸ (`event`: OnReferenceInvalidatedEvent‹STN›): *void*

**Parameters:**

Name | Type |
------ | ------ |
`event` | OnReferenceInvalidatedEvent‹STN› |

___

###  OnReferenceInvalidatedEvent

Ƭ **OnReferenceInvalidatedEvent**: *object*

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:34](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L34)*

#### Type declaration:

* **cause**: *"detach" | "destroy" | "invalidSnapshotReference"*

* **invalidId**: *ReferenceIdentifier*

* **invalidTarget**: *STN | undefined*

* **parent**: *IAnyStateTreeNode*

* **removeRef**: *function*

* **replaceRef**: *function*

___

###  ReferenceIdentifier

Ƭ **ReferenceIdentifier**: *string | number*

*Defined in [packages/mobx-state-tree/src/types/utility-types/identifier.ts:142](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/identifier.ts#L142)*

Valid types for identifiers.

___

###  ReferenceOptions

Ƭ **ReferenceOptions**: *ReferenceOptionsGetSet‹IT› | ReferenceOptionsOnInvalidated‹IT› | ReferenceOptionsGetSet‹IT› & ReferenceOptionsOnInvalidated‹IT›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:473](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L473)*

___

###  SnapshotIn

Ƭ **SnapshotIn**: *T extends object ? T["CreationType"] : T extends IStateTreeNode‹infer IT› ? IT["CreationType"] : T*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:232](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L232)*

The input (creation) snapshot representation of a given type.

___

###  SnapshotOrInstance

Ƭ **SnapshotOrInstance**: *SnapshotIn‹T› | Instance‹T›*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:273](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L273)*

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

Ƭ **SnapshotOut**: *T extends object ? T["SnapshotType"] : T extends IStateTreeNode‹infer IT› ? IT["SnapshotType"] : T*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:241](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L241)*

The output snapshot representation of a given type.

## Variables

### `Const` DEPRECATION_MESSAGE

• **DEPRECATION_MESSAGE**: *string* = "See https://github.com/mobxjs/mobx-state-tree/issues/399 for more information. " +
    "Note that the middleware event types starting with `process` now start with `flow`."

*Defined in [packages/mobx-state-tree/src/core/process.ts:13](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/process.ts#L13)*

___

### `Const` DatePrimitive

• **DatePrimitive**: *IType‹number | Date, number, Date›* = _DatePrimitive

*Defined in [packages/mobx-state-tree/src/types/primitives.ts:178](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/primitives.ts#L178)*

`types.Date` - Creates a type that can only contain a javascript Date value.

Example:
```ts
const LogLine = types.model({
  timestamp: types.Date,
})

LogLine.create({ timestamp: new Date() })
```

___

### `Const` POST_PROCESS_SNAPSHOT

• **POST_PROCESS_SNAPSHOT**: *"postProcessSnapshot"* = "postProcessSnapshot"

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:61](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L61)*

___

### `Const` PRE_PROCESS_SNAPSHOT

• **PRE_PROCESS_SNAPSHOT**: *"preProcessSnapshot"* = "preProcessSnapshot"

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:60](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L60)*

___

### `Const` _DatePrimitive

• **_DatePrimitive**: *CoreType‹number | Date, number, Date›* = new CoreType<number | Date, number, Date>(
    "Date",
    TypeFlags.Date,
    (v) => typeof v === "number" || v instanceof Date,
    (v) => (v instanceof Date ? v : new Date(v))
)

*Defined in [packages/mobx-state-tree/src/types/primitives.ts:156](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/primitives.ts#L156)*

___

### `Const` boolean

• **boolean**: *ISimpleType‹boolean›* = new CoreType<boolean, boolean, boolean>(
    "boolean",
    TypeFlags.Boolean,
    (v) => typeof v === "boolean"
)

*Defined in [packages/mobx-state-tree/src/types/primitives.ts:132](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/primitives.ts#L132)*

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

### `Let` currentActionContext

• **currentActionContext**: *IMiddlewareEvent | undefined*

*Defined in [packages/mobx-state-tree/src/core/action.ts:56](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/action.ts#L56)*

___

### `Const` identifier

• **identifier**: *ISimpleType‹string›* = new IdentifierType()

*Defined in [packages/mobx-state-tree/src/types/utility-types/identifier.ts:110](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/identifier.ts#L110)*

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

### `Let` identifierCacheId

• **identifierCacheId**: *number* = 0

*Defined in [packages/mobx-state-tree/src/core/node/identifier-cache.ts:4](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/identifier-cache.ts#L4)*

___

### `Const` identifierNumber

• **identifierNumber**: *ISimpleType‹number›* = new IdentifierNumberType()

*Defined in [packages/mobx-state-tree/src/types/utility-types/identifier.ts:125](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/identifier.ts#L125)*

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

• **integer**: *ISimpleType‹number›* = new CoreType<number, number, number>(
    "integer",
    TypeFlags.Integer,
    (v) => isInteger(v)
)

*Defined in [packages/mobx-state-tree/src/types/primitives.ts:113](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/primitives.ts#L113)*

`types.integer` - Creates a type that can only contain an integer value.
This type is used for integer values by default

Example:
```ts
const Size = types.model({
  width: types.integer,
  height: 10
})
```

___

### `Let` livelinessChecking

• **livelinessChecking**: *LivelinessMode* = "warn"

*Defined in [packages/mobx-state-tree/src/core/node/livelinessChecking.ts:9](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/livelinessChecking.ts#L9)*

___

### `Const` needsIdentifierError

• **needsIdentifierError**: *"Map.put can only be used to store complex values that have an identifier type attribute"* = `Map.put can only be used to store complex values that have an identifier type attribute`

*Defined in [packages/mobx-state-tree/src/types/complex-types/map.ts:113](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/map.ts#L113)*

___

### `Let` nextActionId

• **nextActionId**: *number* = 1

*Defined in [packages/mobx-state-tree/src/core/action.ts:55](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/action.ts#L55)*

___

### `Let` nextNodeId

• **nextNodeId**: *number* = 1

*Defined in [packages/mobx-state-tree/src/core/node/object-node.ts:42](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/object-node.ts#L42)*

___

### `Const` nullType

• **nullType**: *ISimpleType‹null›* = new CoreType<null, null, null>(
    "null",
    TypeFlags.Null,
    (v) => v === null
)

*Defined in [packages/mobx-state-tree/src/types/primitives.ts:141](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/primitives.ts#L141)*

`types.null` - The type of the value `null`

___

### `Const` number

• **number**: *ISimpleType‹number›* = new CoreType<number, number, number>(
    "number",
    TypeFlags.Number,
    (v) => typeof v === "number"
)

*Defined in [packages/mobx-state-tree/src/types/primitives.ts:94](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/primitives.ts#L94)*

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

### `Const` optionalNullType

• **optionalNullType**: *IOptionalIType‹ISimpleType‹null›, [undefined]›* = optional(nullType, null)

*Defined in [packages/mobx-state-tree/src/types/utility-types/maybe.ts:12](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/maybe.ts#L12)*

___

### `Const` optionalUndefinedType

• **optionalUndefinedType**: *IOptionalIType‹ISimpleType‹undefined›, [undefined]›* = optional(undefinedType, undefined)

*Defined in [packages/mobx-state-tree/src/types/utility-types/maybe.ts:11](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/maybe.ts#L11)*

___

### `Const` plainObjectString

• **plainObjectString**: *string* = Object.toString()

*Defined in [packages/mobx-state-tree/src/utils.ts:9](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/utils.ts#L9)*

___

### `Const` prototypeHasOwnProperty

• **prototypeHasOwnProperty**: *hasOwnProperty* = Object.prototype.hasOwnProperty

*Defined in [packages/mobx-state-tree/src/utils.ts:347](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/utils.ts#L347)*

___

### `Const` runningActions

• **runningActions**: *Map‹number, object›* = new Map<number, { async: boolean; call: IMiddlewareEvent; context: any }>()

*Defined in [packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts:3](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts#L3)*

___

### `Const` string

• **string**: *ISimpleType‹string›* = new CoreType<string, string, string>(
    "string",
    TypeFlags.String,
    (v) => typeof v === "string"
)

*Defined in [packages/mobx-state-tree/src/types/primitives.ts:75](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/primitives.ts#L75)*

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

### `Const` undefinedAsOptionalValues

• **undefinedAsOptionalValues**: *[undefined]* = [undefined]

*Defined in [packages/mobx-state-tree/src/types/utility-types/optional.ts:225](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/optional.ts#L225)*

___

### `Const` undefinedType

• **undefinedType**: *ISimpleType‹undefined›* = new CoreType<undefined, undefined, undefined>(
    "undefined",
    TypeFlags.Undefined,
    (v) => v === undefined
)

*Defined in [packages/mobx-state-tree/src/types/primitives.ts:150](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/primitives.ts#L150)*

`types.undefined` - The type of the value `undefined`

___

### `Const` untypedFrozenInstance

• **untypedFrozenInstance**: *Frozen‹unknown›* = new Frozen()

*Defined in [packages/mobx-state-tree/src/types/utility-types/frozen.ts:56](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/frozen.ts#L56)*

## Functions

###  _isActionContextThisOrChildOf

▸ **_isActionContextThisOrChildOf**(`actionContext`: IActionContext, `sameOrParent`: number | IActionContext | IMiddlewareEvent, `includeSame`: boolean): *boolean*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:34](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/actionContext.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`actionContext` | IActionContext |
`sameOrParent` | number &#124; IActionContext &#124; IMiddlewareEvent |
`includeSame` | boolean |

**Returns:** *boolean*

___

###  addDisposer

▸ **addDisposer**(`target`: IAnyStateTreeNode, `disposer`: IDisposer): *IDisposer*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:753](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L753)*

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
`disposer` | IDisposer |

**Returns:** *IDisposer*

The same disposer that was passed as argument

___

###  addMiddleware

▸ **addMiddleware**(`target`: IAnyStateTreeNode, `handler`: IMiddlewareHandler, `includeHooks`: boolean): *IDisposer*

*Defined in [packages/mobx-state-tree/src/core/action.ts:157](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/action.ts#L157)*

Middleware can be used to intercept any action is invoked on the subtree where it is attached.
If a tree is protected (by default), this means that any mutation of the tree will pass through your middleware.

For more details, see the [middleware docs](concepts/middleware.md)

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`target` | IAnyStateTreeNode | - | Node to apply the middleware to. |
`handler` | IMiddlewareHandler | - | - |
`includeHooks` | boolean | true | - |

**Returns:** *IDisposer*

A callable function to dispose the middleware.

___

###  applyAction

▸ **applyAction**(`target`: IAnyStateTreeNode, `actions`: ISerializedActionCall | ISerializedActionCall[]): *void*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:89](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/on-action.ts#L89)*

Applies an action or a series of actions in a single MobX transaction.
Does not return any value
Takes an action description as produced by the `onAction` middleware.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | IAnyStateTreeNode | - |
`actions` | ISerializedActionCall &#124; ISerializedActionCall[] |   |

**Returns:** *void*

___

###  applyPatch

▸ **applyPatch**(`target`: IAnyStateTreeNode, `patch`: IJsonPatch | ReadonlyArray‹IJsonPatch›): *void*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:126](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L126)*

Applies a JSON-patch to the given model instance or bails out if the patch couldn't be applied
See [patches](https://github.com/mobxjs/mobx-state-tree#patches) for more details.

Can apply a single past, or an array of patches.

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |
`patch` | IJsonPatch &#124; ReadonlyArray‹IJsonPatch› |

**Returns:** *void*

___

###  applySnapshot

▸ **applySnapshot**‹**C**›(`target`: IStateTreeNode‹IType‹C, any, any››, `snapshot`: C): *void*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:323](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L323)*

Applies a snapshot to a given model instances. Patch and snapshot listeners will be invoked as usual.

**Type parameters:**

▪ **C**

**Parameters:**

Name | Type |
------ | ------ |
`target` | IStateTreeNode‹IType‹C, any, any›› |
`snapshot` | C |

**Returns:** *void*

___

###  areSame

▸ **areSame**(`oldNode`: AnyNode, `newValue`: any): *undefined | false | true | ""*

*Defined in [packages/mobx-state-tree/src/types/complex-types/array.ts:462](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/array.ts#L462)*

Check if a node holds a value.

**Parameters:**

Name | Type |
------ | ------ |
`oldNode` | AnyNode |
`newValue` | any |

**Returns:** *undefined | false | true | ""*

___

###  array

▸ **array**‹**IT**›(`subtype`: IT): *IArrayType‹IT›*

*Defined in [packages/mobx-state-tree/src/types/complex-types/array.ts:336](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/array.ts#L336)*

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

▪ **IT**: *IAnyType*

**Parameters:**

Name | Type |
------ | ------ |
`subtype` | IT |

**Returns:** *IArrayType‹IT›*

___

###  baseApplyAction

▸ **baseApplyAction**(`target`: IAnyStateTreeNode, `action`: ISerializedActionCall): *any*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:102](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/on-action.ts#L102)*

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |
`action` | ISerializedActionCall |

**Returns:** *any*

___

###  cast

▸ **cast**‹**O**›(`snapshotOrInstance`: O): *O*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:872](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L872)*

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

The same object casted as an instance

▸ **cast**‹**O**›(`snapshotOrInstance`: TypeOfValue‹O›["CreationType"] | TypeOfValue‹O›["SnapshotType"] | TypeOfValue‹O›["Type"]): *O*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:875](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L875)*

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

Name | Type |
------ | ------ |
`snapshotOrInstance` | TypeOfValue‹O›["CreationType"] &#124; TypeOfValue‹O›["SnapshotType"] &#124; TypeOfValue‹O›["Type"] |

**Returns:** *O*

The same object casted as an instance

___

###  castFlowReturn

▸ **castFlowReturn**‹**T**›(`val`: T): *T*

*Defined in [packages/mobx-state-tree/src/core/flow.ts:33](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/flow.ts#L33)*

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

▸ **castToReferenceSnapshot**‹**I**›(`instance`: I): *Extract‹I, IAnyStateTreeNode› extends never ? I : ReferenceIdentifier*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:975](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L975)*

Casts a node instance type to a reference snapshot type so it can be assigned to a refernence snapshot (e.g. to be used inside a create call).
Note that this is just a cast for the type system, this is, it won't actually convert an instance to a refererence snapshot,
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

**Returns:** *Extract‹I, IAnyStateTreeNode› extends never ? I : ReferenceIdentifier*

The same object casted as an reference snapshot (string or number)

___

###  castToSnapshot

▸ **castToSnapshot**‹**I**›(`snapshotOrInstance`: I): *Extract‹I, IAnyStateTreeNode› extends never ? I : TypeOfValue‹I›["CreationType"]*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:941](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L941)*

Casts a node instance type to an snapshot type so it can be assigned to a type snapshot (e.g. to be used inside a create call).
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

**Returns:** *Extract‹I, IAnyStateTreeNode› extends never ? I : TypeOfValue‹I›["CreationType"]*

The same object casted as an input (creation) snapshot

___

###  checkOptionalPreconditions

▸ **checkOptionalPreconditions**‹**IT**›(`type`: IAnyType, `defaultValueOrFunction`: OptionalDefaultValueOrFunction‹IT›): *void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/optional.ts:138](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/optional.ts#L138)*

**Type parameters:**

▪ **IT**: *IAnyType*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IAnyType |
`defaultValueOrFunction` | OptionalDefaultValueOrFunction‹IT› |

**Returns:** *void*

___

###  clone

▸ **clone**‹**T**›(`source`: T, `keepEnvironment`: boolean | any): *T*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:668](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L668)*

Returns a deep copy of the given state tree node as new tree.
Short hand for `snapshot(x) = getType(x).create(getSnapshot(x))`

_Tip: clone will create a literal copy, including the same identifiers. To modify identifiers etc during cloning, don't use clone but take a snapshot of the tree, modify it, and create new instance_

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

▸ **compose**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**›(`name`: string, `A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›): *IModelType‹PA & PB, OA & OB, _CustomJoin‹FCA, FCB›, _CustomJoin‹FSA, FSB››*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:753](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L753)*

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |

**Returns:** *IModelType‹PA & PB, OA & OB, _CustomJoin‹FCA, FCB›, _CustomJoin‹FSA, FSB››*

▸ **compose**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**›(`A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›): *IModelType‹PA & PB, OA & OB, _CustomJoin‹FCA, FCB›, _CustomJoin‹FSA, FSB››*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:755](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L755)*

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |

**Returns:** *IModelType‹PA & PB, OA & OB, _CustomJoin‹FCA, FCB›, _CustomJoin‹FSA, FSB››*

▸ **compose**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**›(`name`: string, `A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›): *IModelType‹PA & PB & PC, OA & OB & OC, _CustomJoin‹FCA, _CustomJoin‹FCB, FCC››, _CustomJoin‹FSA, _CustomJoin‹FSB, FSC›››*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:757](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L757)*

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |

**Returns:** *IModelType‹PA & PB & PC, OA & OB & OC, _CustomJoin‹FCA, _CustomJoin‹FCB, FCC››, _CustomJoin‹FSA, _CustomJoin‹FSB, FSC›››*

▸ **compose**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**›(`A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›): *IModelType‹PA & PB & PC, OA & OB & OC, _CustomJoin‹FCA, _CustomJoin‹FCB, FCC››, _CustomJoin‹FSA, _CustomJoin‹FSB, FSC›››*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:759](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L759)*

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |

**Returns:** *IModelType‹PA & PB & PC, OA & OB & OC, _CustomJoin‹FCA, _CustomJoin‹FCB, FCC››, _CustomJoin‹FSA, _CustomJoin‹FSB, FSC›››*

▸ **compose**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**›(`name`: string, `A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›): *IModelType‹PA & PB & PC & PD, OA & OB & OC & OD, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, FCD›››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, FSD››››*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:761](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L761)*

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |

**Returns:** *IModelType‹PA & PB & PC & PD, OA & OB & OC & OD, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, FCD›››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, FSD››››*

▸ **compose**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**›(`A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›): *IModelType‹PA & PB & PC & PD, OA & OB & OC & OD, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, FCD›››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, FSD››››*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:763](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L763)*

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |

**Returns:** *IModelType‹PA & PB & PC & PD, OA & OB & OC & OD, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, FCD›››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, FSD››››*

▸ **compose**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**›(`name`: string, `A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›): *IModelType‹PA & PB & PC & PD & PE, OA & OB & OC & OD & OE, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, FCE››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, FSE›››››*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:765](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L765)*

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |

**Returns:** *IModelType‹PA & PB & PC & PD & PE, OA & OB & OC & OD & OE, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, FCE››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, FSE›››››*

▸ **compose**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**›(`A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›): *IModelType‹PA & PB & PC & PD & PE, OA & OB & OC & OD & OE, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, FCE››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, FSE›››››*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:767](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L767)*

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |

**Returns:** *IModelType‹PA & PB & PC & PD & PE, OA & OB & OC & OD & OE, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, FCE››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, FSE›››››*

▸ **compose**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**›(`name`: string, `A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›, `F`: IModelType‹PF, OF, FCF, FSF›): *IModelType‹PA & PB & PC & PD & PE & PF, OA & OB & OC & OD & OE & OF, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, FCF›››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, FSF››››››*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:771](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L771)*

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |
`F` | IModelType‹PF, OF, FCF, FSF› |

**Returns:** *IModelType‹PA & PB & PC & PD & PE & PF, OA & OB & OC & OD & OE & OF, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, FCF›››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, FSF››››››*

▸ **compose**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**›(`A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›, `F`: IModelType‹PF, OF, FCF, FSF›): *IModelType‹PA & PB & PC & PD & PE & PF, OA & OB & OC & OD & OE & OF, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, FCF›››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, FSF››››››*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:774](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L774)*

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |
`F` | IModelType‹PF, OF, FCF, FSF› |

**Returns:** *IModelType‹PA & PB & PC & PD & PE & PF, OA & OB & OC & OD & OE & OF, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, FCF›››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, FSF››››››*

▸ **compose**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**›(`name`: string, `A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›, `F`: IModelType‹PF, OF, FCF, FSF›, `G`: IModelType‹PG, OG, FCG, FSG›): *IModelType‹PA & PB & PC & PD & PE & PF & PG, OA & OB & OC & OD & OE & OF & OG, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, FCG››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, FSG›››››››*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:777](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L777)*

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |
`F` | IModelType‹PF, OF, FCF, FSF› |
`G` | IModelType‹PG, OG, FCG, FSG› |

**Returns:** *IModelType‹PA & PB & PC & PD & PE & PF & PG, OA & OB & OC & OD & OE & OF & OG, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, FCG››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, FSG›››››››*

▸ **compose**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**›(`A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›, `F`: IModelType‹PF, OF, FCF, FSF›, `G`: IModelType‹PG, OG, FCG, FSG›): *IModelType‹PA & PB & PC & PD & PE & PF & PG, OA & OB & OC & OD & OE & OF & OG, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, FCG››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, FSG›››››››*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:780](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L780)*

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |
`F` | IModelType‹PF, OF, FCF, FSF› |
`G` | IModelType‹PG, OG, FCG, FSG› |

**Returns:** *IModelType‹PA & PB & PC & PD & PE & PF & PG, OA & OB & OC & OD & OE & OF & OG, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, FCG››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, FSG›››››››*

▸ **compose**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**›(`name`: string, `A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›, `F`: IModelType‹PF, OF, FCF, FSF›, `G`: IModelType‹PG, OG, FCG, FSG›, `H`: IModelType‹PH, OH, FCH, FSH›): *IModelType‹PA & PB & PC & PD & PE & PF & PG & PH, OA & OB & OC & OD & OE & OF & OG & OH, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, _CustomJoin‹FCG, FCH›››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, _CustomJoin‹FSG, FSH››››››››*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:783](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L783)*

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |
`F` | IModelType‹PF, OF, FCF, FSF› |
`G` | IModelType‹PG, OG, FCG, FSG› |
`H` | IModelType‹PH, OH, FCH, FSH› |

**Returns:** *IModelType‹PA & PB & PC & PD & PE & PF & PG & PH, OA & OB & OC & OD & OE & OF & OG & OH, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, _CustomJoin‹FCG, FCH›››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, _CustomJoin‹FSG, FSH››››››››*

▸ **compose**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**›(`A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›, `F`: IModelType‹PF, OF, FCF, FSF›, `G`: IModelType‹PG, OG, FCG, FSG›, `H`: IModelType‹PH, OH, FCH, FSH›): *IModelType‹PA & PB & PC & PD & PE & PF & PG & PH, OA & OB & OC & OD & OE & OF & OG & OH, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, _CustomJoin‹FCG, FCH›››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, _CustomJoin‹FSG, FSH››››››››*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:786](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L786)*

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |
`F` | IModelType‹PF, OF, FCF, FSF› |
`G` | IModelType‹PG, OG, FCG, FSG› |
`H` | IModelType‹PH, OH, FCH, FSH› |

**Returns:** *IModelType‹PA & PB & PC & PD & PE & PF & PG & PH, OA & OB & OC & OD & OE & OF & OG & OH, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, _CustomJoin‹FCG, FCH›››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, _CustomJoin‹FSG, FSH››››››››*

▸ **compose**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**, **PI**, **OI**, **FCI**, **FSI**›(`name`: string, `A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›, `F`: IModelType‹PF, OF, FCF, FSF›, `G`: IModelType‹PG, OG, FCG, FSG›, `H`: IModelType‹PH, OH, FCH, FSH›, `I`: IModelType‹PI, OI, FCI, FSI›): *IModelType‹PA & PB & PC & PD & PE & PF & PG & PH & PI, OA & OB & OC & OD & OE & OF & OG & OH & OI, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, _CustomJoin‹FCG, _CustomJoin‹FCH, FCI››››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, _CustomJoin‹FSG, _CustomJoin‹FSH, FSI›››››››››*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:789](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L789)*

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |
`F` | IModelType‹PF, OF, FCF, FSF› |
`G` | IModelType‹PG, OG, FCG, FSG› |
`H` | IModelType‹PH, OH, FCH, FSH› |
`I` | IModelType‹PI, OI, FCI, FSI› |

**Returns:** *IModelType‹PA & PB & PC & PD & PE & PF & PG & PH & PI, OA & OB & OC & OD & OE & OF & OG & OH & OI, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, _CustomJoin‹FCG, _CustomJoin‹FCH, FCI››››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, _CustomJoin‹FSG, _CustomJoin‹FSH, FSI›››››››››*

▸ **compose**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**, **PI**, **OI**, **FCI**, **FSI**›(`A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›, `F`: IModelType‹PF, OF, FCF, FSF›, `G`: IModelType‹PG, OG, FCG, FSG›, `H`: IModelType‹PH, OH, FCH, FSH›, `I`: IModelType‹PI, OI, FCI, FSI›): *IModelType‹PA & PB & PC & PD & PE & PF & PG & PH & PI, OA & OB & OC & OD & OE & OF & OG & OH & OI, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, _CustomJoin‹FCG, _CustomJoin‹FCH, FCI››››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, _CustomJoin‹FSG, _CustomJoin‹FSH, FSI›››››››››*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:792](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L792)*

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |
`F` | IModelType‹PF, OF, FCF, FSF› |
`G` | IModelType‹PG, OG, FCG, FSG› |
`H` | IModelType‹PH, OH, FCH, FSH› |
`I` | IModelType‹PI, OI, FCI, FSI› |

**Returns:** *IModelType‹PA & PB & PC & PD & PE & PF & PG & PH & PI, OA & OB & OC & OD & OE & OF & OG & OH & OI, _CustomJoin‹FCA, _CustomJoin‹FCB, _CustomJoin‹FCC, _CustomJoin‹FCD, _CustomJoin‹FCE, _CustomJoin‹FCF, _CustomJoin‹FCG, _CustomJoin‹FCH, FCI››››››››, _CustomJoin‹FSA, _CustomJoin‹FSB, _CustomJoin‹FSC, _CustomJoin‹FSD, _CustomJoin‹FSE, _CustomJoin‹FSF, _CustomJoin‹FSG, _CustomJoin‹FSH, FSI›››››››››*

___

###  createActionTrackingMiddleware

▸ **createActionTrackingMiddleware**‹**T**›(`hooks`: IActionTrackingMiddlewareHooks‹T›): *IMiddlewareHandler*

*Defined in [packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts:28](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/create-action-tracking-middleware.ts#L28)*

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
`hooks` | IActionTrackingMiddlewareHooks‹T› |

**Returns:** *IMiddlewareHandler*

___

###  createActionTrackingMiddleware2

▸ **createActionTrackingMiddleware2**‹**TEnv**›(`middlewareHooks`: IActionTrackingMiddleware2Hooks‹TEnv›): *IMiddlewareHandler*

*Defined in [packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts:74](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/createActionTrackingMiddleware2.ts#L74)*

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
`middlewareHooks` | IActionTrackingMiddleware2Hooks‹TEnv› |

**Returns:** *IMiddlewareHandler*

___

###  custom

▸ **custom**‹**S**, **T**›(`options`: CustomTypeOptions‹S, T›): *IType‹S | T, S, T›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/custom.ts:74](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/custom.ts#L74)*

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
`options` | CustomTypeOptions‹S, T› |

**Returns:** *IType‹S | T, S, T›*

___

###  decorate

▸ **decorate**‹**T**›(`handler`: IMiddlewareHandler, `fn`: T, `includeHooks`: boolean): *T*

*Defined in [packages/mobx-state-tree/src/core/action.ts:196](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/action.ts#L196)*

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
`handler` | IMiddlewareHandler | - |
`fn` | T | - |
`includeHooks` | boolean | true |

**Returns:** *T*

The original function

___

###  deserializeArgument

▸ **deserializeArgument**(`adm`: AnyNode, `value`: any): *any*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:68](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/on-action.ts#L68)*

**Parameters:**

Name | Type |
------ | ------ |
`adm` | AnyNode |
`value` | any |

**Returns:** *any*

___

###  destroy

▸ **destroy**(`target`: IAnyStateTreeNode): *void*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:700](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L700)*

Removes a model element from the state tree, and mark it as end-of-life; the element should not be used anymore

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *void*

___

###  detach

▸ **detach**‹**T**›(`target`: T): *T*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:689](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L689)*

Removes a model element from the state tree, and let it live on as a new state tree

**Type parameters:**

▪ **T**: *IAnyStateTreeNode*

**Parameters:**

Name | Type |
------ | ------ |
`target` | T |

**Returns:** *T*

___

### `Const` doubleDot

▸ **doubleDot**(`_`: any): *string*

*Defined in [packages/mobx-state-tree/src/core/node/node-utils.ts:113](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/node-utils.ts#L113)*

**Parameters:**

Name | Type |
------ | ------ |
`_` | any |

**Returns:** *string*

___

###  enumeration

▸ **enumeration**‹**T**›(`options`: T[]): *ISimpleType‹UnionStringArray‹T[]››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/enumeration.ts:11](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/enumeration.ts#L11)*

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
`options` | T[] | possible values this enumeration can have |

**Returns:** *ISimpleType‹UnionStringArray‹T[]››*

▸ **enumeration**‹**T**›(`name`: string, `options`: T[]): *ISimpleType‹UnionStringArray‹T[]››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/enumeration.ts:12](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/enumeration.ts#L12)*

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

Name | Type |
------ | ------ |
`name` | string |
`options` | T[] |

**Returns:** *ISimpleType‹UnionStringArray‹T[]››*

___

###  escapeJsonPath

▸ **escapeJsonPath**(`path`: string): *string*

*Defined in [packages/mobx-state-tree/src/core/json-patch.ts:77](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/json-patch.ts#L77)*

Escape slashes and backslashes.

http://tools.ietf.org/html/rfc6901

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *string*

___

###  flow

▸ **flow**‹**R**, **Args**›(`generator`: function): *function*

*Defined in [packages/mobx-state-tree/src/core/flow.ts:20](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/flow.ts#L20)*

See [asynchronous actions](concepts/async-actions.md).

**Type parameters:**

▪ **R**

▪ **Args**: *any[]*

**Parameters:**

▪ **generator**: *function*

▸ (...`args`: Args): *Generator‹Promise‹any›, R, any›*

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

▸ **frozen**‹**C**›(`subType`: IType‹C, any, any›): *IType‹C, C, C›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/frozen.ts:58](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/frozen.ts#L58)*

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
`subType` | IType‹C, any, any› |

**Returns:** *IType‹C, C, C›*

▸ **frozen**‹**T**›(`defaultValue`: T): *IType‹T | undefined | null, T, T›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/frozen.ts:59](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/frozen.ts#L59)*

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

**Returns:** *IType‹T | undefined | null, T, T›*

▸ **frozen**‹**T**›(): *IType‹T, T, T›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/frozen.ts:60](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/frozen.ts#L60)*

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

**Returns:** *IType‹T, T, T›*

___

###  getChildType

▸ **getChildType**(`object`: IAnyStateTreeNode, `propertyName?`: undefined | string): *IAnyType*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:70](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L70)*

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

**Returns:** *IAnyType*

___

###  getEnv

▸ **getEnv**‹**T**›(`target`: IAnyStateTreeNode): *T*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:775](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L775)*

Returns the environment of the current state tree. For more info on environments,
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

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:551](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L551)*

Returns the identifier of the target node.
This is the *string normalized* identifier, which might not match the type of the identifier attribute

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *string | null*

___

###  getInvalidationCause

▸ **getInvalidationCause**(`hook`: Hook): *"detach" | "destroy" | undefined*

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:47](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`hook` | Hook |

**Returns:** *"detach" | "destroy" | undefined*

___

###  getLivelinessChecking

▸ **getLivelinessChecking**(): *LivelinessMode*

*Defined in [packages/mobx-state-tree/src/core/node/livelinessChecking.ts:27](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/livelinessChecking.ts#L27)*

Returns the current liveliness checking mode.

**Returns:** *LivelinessMode*

`"warn"`, `"error"` or `"ignore"`

___

###  getMembers

▸ **getMembers**(`target`: IAnyStateTreeNode): *IModelReflectionData*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:846](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L846)*

Returns a reflection of the model node, including name, properties, views, volatile and actions.

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *IModelReflectionData*

___

###  getNodeId

▸ **getNodeId**(`target`: IAnyStateTreeNode): *number*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:990](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L990)*

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

▸ **getParent**‹**IT**›(`target`: IAnyStateTreeNode, `depth`: number): *TypeOrStateTreeNodeToStateTreeNode‹IT›*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:384](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L384)*

Returns the immediate parent of this object, or throws.

Note that the immediate parent can be either an object, map or array, and
doesn't necessarily refer to the parent model.

Please note that in child nodes access to the root is only possible
once the `afterAttach` hook has fired.

**Type parameters:**

▪ **IT**: *IAnyStateTreeNode | IAnyComplexType*

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`target` | IAnyStateTreeNode | - | - |
`depth` | number | 1 | How far should we look upward? 1 by default. |

**Returns:** *TypeOrStateTreeNodeToStateTreeNode‹IT›*

___

###  getParentOfType

▸ **getParentOfType**‹**IT**›(`target`: IAnyStateTreeNode, `type`: IT): *IT["Type"]*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:428](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L428)*

Returns the target's parent of a given type, or throws.

**Type parameters:**

▪ **IT**: *IAnyComplexType*

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |
`type` | IT |

**Returns:** *IT["Type"]*

___

###  getPath

▸ **getPath**(`target`: IAnyStateTreeNode): *string*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:468](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L468)*

Returns the path of the given object in the model tree

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *string*

___

###  getPathParts

▸ **getPathParts**(`target`: IAnyStateTreeNode): *string[]*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:481](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L481)*

Returns the path of the given object as unescaped string array.

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *string[]*

___

###  getPropertyMembers

▸ **getPropertyMembers**(`typeOrNode`: IAnyModelType | IAnyStateTreeNode): *IModelReflectionPropertiesData*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:815](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L815)*

Returns a reflection of the model type properties and name for either a model type or model node.

**Parameters:**

Name | Type |
------ | ------ |
`typeOrNode` | IAnyModelType &#124; IAnyStateTreeNode |

**Returns:** *IModelReflectionPropertiesData*

___

###  getRelativePath

▸ **getRelativePath**(`base`: IAnyStateTreeNode, `target`: IAnyStateTreeNode): *string*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:650](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L650)*

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

▸ **getRoot**‹**IT**›(`target`: IAnyStateTreeNode): *TypeOrStateTreeNodeToStateTreeNode‹IT›*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:453](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L453)*

Given an object in a model tree, returns the root object of that tree.

Please note that in child nodes access to the root is only possible
once the `afterAttach` hook has fired.

**Type parameters:**

▪ **IT**: *IAnyComplexType | IAnyStateTreeNode*

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *TypeOrStateTreeNodeToStateTreeNode‹IT›*

___

###  getRunningActionContext

▸ **getRunningActionContext**(): *IActionContext | undefined*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:26](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/actionContext.ts#L26)*

Returns the currently executing MST action context, or undefined if none.

**Returns:** *IActionContext | undefined*

___

###  getSnapshot

▸ **getSnapshot**‹**S**›(`target`: IStateTreeNode‹IType‹any, S, any››, `applyPostProcess`: boolean): *S*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:338](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L338)*

Calculates a snapshot from the given model instance. The snapshot will always reflect the latest state but use
structural sharing where possible. Doesn't require MobX transactions to be completed.

**Type parameters:**

▪ **S**

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`target` | IStateTreeNode‹IType‹any, S, any›› | - | - |
`applyPostProcess` | boolean | true | If true (the default) then postProcessSnapshot gets applied. |

**Returns:** *S*

___

###  getType

▸ **getType**(`object`: IAnyStateTreeNode): *IAnyComplexType*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:48](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L48)*

Returns the _actual_ type of the given tree node. (Or throws)

**Parameters:**

Name | Type |
------ | ------ |
`object` | IAnyStateTreeNode |

**Returns:** *IAnyComplexType*

___

###  hasParent

▸ **hasParent**(`target`: IAnyStateTreeNode, `depth`: number): *boolean*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:358](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L358)*

Given a model instance, returns `true` if the object has a parent, that is, is part of another object, map or array.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`target` | IAnyStateTreeNode | - | - |
`depth` | number | 1 | How far should we look upward? 1 by default. |

**Returns:** *boolean*

___

###  hasParentOfType

▸ **hasParentOfType**(`target`: IAnyStateTreeNode, `type`: IAnyComplexType): *boolean*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:408](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L408)*

Given a model instance, returns `true` if the object has a parent of given type, that is, is part of another object, map or array

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |
`type` | IAnyComplexType |

**Returns:** *boolean*

___

###  invertPatch

▸ **invertPatch**(`patch`: IReversibleJsonPatch): *IJsonPatch*

*Defined in [packages/mobx-state-tree/src/core/json-patch.ts:43](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/json-patch.ts#L43)*

**Parameters:**

Name | Type |
------ | ------ |
`patch` | IReversibleJsonPatch |

**Returns:** *IJsonPatch*

___

###  isActionContextChildOf

▸ **isActionContextChildOf**(`actionContext`: IActionContext, `parent`: number | IActionContext | IMiddlewareEvent): *boolean*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:56](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/actionContext.ts#L56)*

Returns if the given action context is a parent of this action context.

**Parameters:**

Name | Type |
------ | ------ |
`actionContext` | IActionContext |
`parent` | number &#124; IActionContext &#124; IMiddlewareEvent |

**Returns:** *boolean*

___

###  isActionContextThisOrChildOf

▸ **isActionContextThisOrChildOf**(`actionContext`: IActionContext, `parentOrThis`: number | IActionContext | IMiddlewareEvent): *boolean*

*Defined in [packages/mobx-state-tree/src/core/actionContext.ts:66](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/actionContext.ts#L66)*

Returns if the given action context is this or a parent of this action context.

**Parameters:**

Name | Type |
------ | ------ |
`actionContext` | IActionContext |
`parentOrThis` | number &#124; IActionContext &#124; IMiddlewareEvent |

**Returns:** *boolean*

___

###  isAlive

▸ **isAlive**(`target`: IAnyStateTreeNode): *boolean*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:718](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L718)*

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

▸ **isArrayType**‹**Items**›(`type`: IAnyType): *type is IArrayType‹Items›*

*Defined in [packages/mobx-state-tree/src/types/complex-types/array.ts:496](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/array.ts#L496)*

Returns if a given value represents an array type.

**Type parameters:**

▪ **Items**: *IAnyType*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IAnyType |

**Returns:** *type is IArrayType‹Items›*

`true` if the type is an array type.

___

###  isFrozenType

▸ **isFrozenType**‹**IT**, **T**›(`type`: IT): *type is IT*

*Defined in [packages/mobx-state-tree/src/types/utility-types/frozen.ts:113](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/frozen.ts#L113)*

Returns if a given value represents a frozen type.

**Type parameters:**

▪ **IT**: *IType‹T | any, T, T›*

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |

**Returns:** *type is IT*

___

###  isIdentifierType

▸ **isIdentifierType**‹**IT**›(`type`: IT): *type is IT*

*Defined in [packages/mobx-state-tree/src/types/utility-types/identifier.ts:133](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/identifier.ts#L133)*

Returns if a given value represents an identifier type.

**Type parameters:**

▪ **IT**: *typeof identifier | typeof identifierNumber*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |

**Returns:** *type is IT*

___

###  isLateType

▸ **isLateType**‹**IT**›(`type`: IT): *type is IT*

*Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:141](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/late.ts#L141)*

Returns if a given value represents a late type.

**Type parameters:**

▪ **IT**: *IAnyType*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |

**Returns:** *type is IT*

___

###  isLiteralType

▸ **isLiteralType**‹**IT**›(`type`: IT): *type is IT*

*Defined in [packages/mobx-state-tree/src/types/utility-types/literal.ts:86](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/literal.ts#L86)*

Returns if a given value represents a literal type.

**Type parameters:**

▪ **IT**: *ISimpleType‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |

**Returns:** *type is IT*

___

###  isMapType

▸ **isMapType**‹**Items**›(`type`: IAnyType): *type is IMapType‹Items›*

*Defined in [packages/mobx-state-tree/src/types/complex-types/map.ts:515](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/map.ts#L515)*

Returns if a given value represents a map type.

**Type parameters:**

▪ **Items**: *IAnyType*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IAnyType |

**Returns:** *type is IMapType‹Items›*

`true` if it is a map type.

___

###  isModelType

▸ **isModelType**‹**IT**›(`type`: IAnyType): *type is IT*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:838](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L838)*

Returns if a given value represents a model type.

**Type parameters:**

▪ **IT**: *IAnyModelType*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IAnyType |

**Returns:** *type is IT*

___

###  isNumber

▸ **isNumber**(`x`: string): *boolean*

*Defined in [packages/mobx-state-tree/src/core/json-patch.ts:68](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/json-patch.ts#L68)*

Simple simple check to check it is a number.

**Parameters:**

Name | Type |
------ | ------ |
`x` | string |

**Returns:** *boolean*

___

###  isOptionalType

▸ **isOptionalType**‹**IT**›(`type`: IT): *type is IT*

*Defined in [packages/mobx-state-tree/src/types/utility-types/optional.ts:234](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/optional.ts#L234)*

Returns if a value represents an optional type.

**Type parameters:**

▪ **IT**: *IAnyType*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |

**Returns:** *type is IT*

___

###  isPrimitiveType

▸ **isPrimitiveType**‹**IT**›(`type`: IT): *type is IT*

*Defined in [packages/mobx-state-tree/src/types/primitives.ts:204](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/primitives.ts#L204)*

Returns if a given value represents a primitive type.

**Type parameters:**

▪ **IT**: *ISimpleType‹string› | ISimpleType‹number› | ISimpleType‹boolean› | typeof DatePrimitive*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |

**Returns:** *type is IT*

___

###  isProtected

▸ **isProtected**(`target`: IAnyStateTreeNode): *boolean*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:312](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L312)*

Returns true if the object is in protected mode, @see protect

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *boolean*

___

###  isReferenceType

▸ **isReferenceType**‹**IT**›(`type`: IT): *type is IT*

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:533](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L533)*

Returns if a given value represents a reference type.

**Type parameters:**

▪ **IT**: *IReferenceType‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |

**Returns:** *type is IT*

___

###  isRefinementType

▸ **isRefinementType**‹**IT**›(`type`: IT): *type is IT*

*Defined in [packages/mobx-state-tree/src/types/utility-types/refinement.ts:126](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/refinement.ts#L126)*

Returns if a given value is a refinement type.

**Type parameters:**

▪ **IT**: *IAnyType*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |

**Returns:** *type is IT*

___

###  isRoot

▸ **isRoot**(`target`: IAnyStateTreeNode): *boolean*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:494](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L494)*

Returns true if the given object is the root of a model tree.

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |

**Returns:** *boolean*

___

###  isStateTreeNode

▸ **isStateTreeNode**‹**IT**›(`value`: any): *value is STNValue‹Instance‹IT›, IT›*

*Defined in [packages/mobx-state-tree/src/core/node/node-utils.ts:68](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/node-utils.ts#L68)*

Returns true if the given value is a node in a state tree.
More precisely, that is, if the value is an instance of a
`types.model`, `types.array` or `types.map`.

**Type parameters:**

▪ **IT**: *IAnyComplexType*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *value is STNValue‹Instance‹IT›, IT›*

true if the value is a state tree node.

___

###  isType

▸ **isType**(`value`: any): *value is IAnyType*

*Defined in [packages/mobx-state-tree/src/core/type/type.ts:535](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type.ts#L535)*

Returns if a given value represents a type.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`value` | any | Value to check. |

**Returns:** *value is IAnyType*

`true` if the value is a type.

___

###  isUnionType

▸ **isUnionType**‹**IT**›(`type`: IT): *type is IT*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:282](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L282)*

Returns if a given value represents a union type.

**Type parameters:**

▪ **IT**: *IAnyType*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |

**Returns:** *type is IT*

___

###  isValidReference

▸ **isValidReference**‹**N**›(`getter`: function, `checkIfAlive`: boolean): *boolean*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:598](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L598)*

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

*Defined in [packages/mobx-state-tree/src/core/json-patch.ts:98](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/json-patch.ts#L98)*

Generates a json-path compliant json path from path parts.

**Parameters:**

Name | Type |
------ | ------ |
`path` | string[] |

**Returns:** *string*

___

###  late

▸ **late**‹**T**›(`type`: function): *T*

*Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:103](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/late.ts#L103)*

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

▪ **T**: *IAnyType*

**Parameters:**

▪ **type**: *function*

A function that returns the type that will be defined.

▸ (): *T*

**Returns:** *T*

▸ **late**‹**T**›(`name`: string, `type`: function): *T*

*Defined in [packages/mobx-state-tree/src/types/utility-types/late.ts:104](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/late.ts#L104)*

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

▪ **T**: *IAnyType*

**Parameters:**

▪ **name**: *string*

▪ **type**: *function*

▸ (): *T*

**Returns:** *T*

___

###  literal

▸ **literal**‹**S**›(`value`: S): *ISimpleType‹S›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/literal.ts:73](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/literal.ts#L73)*

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

**Returns:** *ISimpleType‹S›*

___

###  map

▸ **map**‹**IT**›(`subtype`: IT): *IMapType‹IT›*

*Defined in [packages/mobx-state-tree/src/types/complex-types/map.ts:505](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/map.ts#L505)*

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

▪ **IT**: *IAnyType*

**Parameters:**

Name | Type |
------ | ------ |
`subtype` | IT |

**Returns:** *IMapType‹IT›*

___

###  maybe

▸ **maybe**‹**IT**›(`type`: IT): *IMaybe‹IT›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/maybe.ts:31](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/maybe.ts#L31)*

`types.maybe` - Maybe will make a type nullable, and also optional.
The value `undefined` will be used to represent nullability.

**Type parameters:**

▪ **IT**: *IAnyType*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |

**Returns:** *IMaybe‹IT›*

___

###  maybeNull

▸ **maybeNull**‹**IT**›(`type`: IT): *IMaybeNull‹IT›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/maybe.ts:44](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/maybe.ts#L44)*

`types.maybeNull` - Maybe will make a type nullable, and also optional.
The value `null` will be used to represent no value.

**Type parameters:**

▪ **IT**: *IAnyType*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |

**Returns:** *IMaybeNull‹IT›*

___

###  model

▸ **model**‹**P**›(`name`: string, `properties?`: P): *IModelType‹ModelPropertiesDeclarationToProperties‹P›, object›*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:728](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L728)*

`types.model` - Creates a new model type by providing a name, properties, volatile state and actions.

See the [model type](/concepts/trees#creating-models) description or the [getting started](intro/getting-started.md#getting-started-1) tutorial.

**Type parameters:**

▪ **P**: *ModelPropertiesDeclaration*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`properties?` | P |

**Returns:** *IModelType‹ModelPropertiesDeclarationToProperties‹P›, object›*

▸ **model**‹**P**›(`properties?`: P): *IModelType‹ModelPropertiesDeclarationToProperties‹P›, object›*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:732](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L732)*

`types.model` - Creates a new model type by providing a name, properties, volatile state and actions.

See the [model type](/concepts/trees#creating-models) description or the [getting started](intro/getting-started.md#getting-started-1) tutorial.

**Type parameters:**

▪ **P**: *ModelPropertiesDeclaration*

**Parameters:**

Name | Type |
------ | ------ |
`properties?` | P |

**Returns:** *IModelType‹ModelPropertiesDeclarationToProperties‹P›, object›*

___

###  objectTypeToString

▸ **objectTypeToString**(`this`: any): *string*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:240](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L240)*

**Parameters:**

Name | Type |
------ | ------ |
`this` | any |

**Returns:** *string*

___

###  onAction

▸ **onAction**(`target`: IAnyStateTreeNode, `listener`: function, `attachAfter`: boolean): *IDisposer*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:226](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/on-action.ts#L226)*

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

▸ (`call`: ISerializedActionCall): *void*

**Parameters:**

Name | Type |
------ | ------ |
`call` | ISerializedActionCall |

▪`Default value`  **attachAfter**: *boolean*= false

(default false) fires the listener *after* the action has executed instead of before.

**Returns:** *IDisposer*

___

###  onPatch

▸ **onPatch**(`target`: IAnyStateTreeNode, `callback`: function): *IDisposer*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:85](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L85)*

Registers a function that will be invoked for each mutation that is applied to the provided model instance, or to any of its children.
See [patches](https://github.com/mobxjs/mobx-state-tree#patches) for more details. onPatch events are emitted immediately and will not await the end of a transaction.
Patches can be used to deep observe a model tree.

**Parameters:**

▪ **target**: *IAnyStateTreeNode*

the model instance from which to receive patches

▪ **callback**: *function*

the callback that is invoked for each patch. The reversePatch is a patch that would actually undo the emitted patch

▸ (`patch`: IJsonPatch, `reversePatch`: IJsonPatch): *void*

**Parameters:**

Name | Type |
------ | ------ |
`patch` | IJsonPatch |
`reversePatch` | IJsonPatch |

**Returns:** *IDisposer*

function to remove the listener

___

###  onSnapshot

▸ **onSnapshot**‹**S**›(`target`: IStateTreeNode‹IType‹any, S, any››, `callback`: function): *IDisposer*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:105](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L105)*

Registers a function that is invoked whenever a new snapshot for the given model instance is available.
The listener will only be fire at the end of the current MobX (trans)action.
See [snapshots](https://github.com/mobxjs/mobx-state-tree#snapshots) for more details.

**Type parameters:**

▪ **S**

**Parameters:**

▪ **target**: *IStateTreeNode‹IType‹any, S, any››*

▪ **callback**: *function*

▸ (`snapshot`: S): *void*

**Parameters:**

Name | Type |
------ | ------ |
`snapshot` | S |

**Returns:** *IDisposer*

___

###  optional

▸ **optional**‹**IT**›(`type`: IT, `defaultValueOrFunction`: OptionalDefaultValueOrFunction‹IT›): *IOptionalIType‹IT, [undefined]›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/optional.ts:160](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/optional.ts#L160)*

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

▪ **IT**: *IAnyType*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |
`defaultValueOrFunction` | OptionalDefaultValueOrFunction‹IT› |

**Returns:** *IOptionalIType‹IT, [undefined]›*

▸ **optional**‹**IT**, **OptionalVals**›(`type`: IT, `defaultValueOrFunction`: OptionalDefaultValueOrFunction‹IT›, `optionalValues`: OptionalVals): *IOptionalIType‹IT, OptionalVals›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/optional.ts:164](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/optional.ts#L164)*

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

▪ **IT**: *IAnyType*

▪ **OptionalVals**: *ValidOptionalValues*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |
`defaultValueOrFunction` | OptionalDefaultValueOrFunction‹IT› |
`optionalValues` | OptionalVals |

**Returns:** *IOptionalIType‹IT, OptionalVals›*

___

###  protect

▸ **protect**(`target`: IAnyStateTreeNode): *void*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:267](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L267)*

The inverse of `unprotect`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | IAnyStateTreeNode |   |

**Returns:** *void*

___

###  proxyNodeTypeMethods

▸ **proxyNodeTypeMethods**(`nodeType`: any, `snapshotProcessorType`: any, ...`methods`: keyof SnapshotProcessor‹any, any, any›[]): *void*

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:154](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L154)*

**Parameters:**

Name | Type |
------ | ------ |
`nodeType` | any |
`snapshotProcessorType` | any |
`...methods` | keyof SnapshotProcessor‹any, any, any›[] |

**Returns:** *void*

___

###  reconcileArrayChildren

▸ **reconcileArrayChildren**‹**TT**›(`parent`: AnyObjectNode, `childType`: IType‹any, any, TT›, `oldNodes`: AnyNode[], `newValues`: TT[], `newPaths`: (string | number)[]): *AnyNode[] | null*

*Defined in [packages/mobx-state-tree/src/types/complex-types/array.ts:342](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/array.ts#L342)*

**Type parameters:**

▪ **TT**

**Parameters:**

Name | Type |
------ | ------ |
`parent` | AnyObjectNode |
`childType` | IType‹any, any, TT› |
`oldNodes` | AnyNode[] |
`newValues` | TT[] |
`newPaths` | (string &#124; number)[] |

**Returns:** *AnyNode[] | null*

___

###  recordActions

▸ **recordActions**(`subject`: IAnyStateTreeNode, `filter?`: undefined | function): *IActionRecorder*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:148](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/on-action.ts#L148)*

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

**Returns:** *IActionRecorder*

___

###  recordPatches

▸ **recordPatches**(`subject`: IAnyStateTreeNode, `filter?`: undefined | function): *IPatchRecorder*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:179](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L179)*

Small abstraction around `onPatch` and `applyPatch`, attaches a patch listener to a tree and records all the patches.
Returns an recorder object with the following signature:

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

**Returns:** *IPatchRecorder*

___

###  reference

▸ **reference**‹**IT**›(`subType`: IT, `options?`: ReferenceOptions‹IT›): *IReferenceType‹IT›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:486](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L486)*

`types.reference` - Creates a reference to another type, which should have defined an identifier.
See also the [reference and identifiers](https://github.com/mobxjs/mobx-state-tree#references-and-identifiers) section.

**Type parameters:**

▪ **IT**: *IAnyComplexType*

**Parameters:**

Name | Type |
------ | ------ |
`subType` | IT |
`options?` | ReferenceOptions‹IT› |

**Returns:** *IReferenceType‹IT›*

___

###  refinement

▸ **refinement**‹**IT**›(`name`: string, `type`: IT, `predicate`: function, `message?`: string | function): *IT*

*Defined in [packages/mobx-state-tree/src/types/utility-types/refinement.ts:84](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/refinement.ts#L84)*

`types.refinement` - Creates a type that is more specific than the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.

**Type parameters:**

▪ **IT**: *IAnyType*

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

▸ **refinement**‹**IT**›(`type`: IT, `predicate`: function, `message?`: string | function): *IT*

*Defined in [packages/mobx-state-tree/src/types/utility-types/refinement.ts:90](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/refinement.ts#L90)*

`types.refinement` - Creates a type that is more specific than the base type, e.g. `types.refinement(types.string, value => value.length > 5)` to create a type of strings that can only be longer then 5.

**Type parameters:**

▪ **IT**: *IAnyType*

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

▸ **resolveIdentifier**‹**IT**›(`type`: IT, `target`: IAnyStateTreeNode, `identifier`: ReferenceIdentifier): *IT["Type"] | undefined*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:527](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L527)*

Resolves a model instance given a root target, the type and the identifier you are searching for.
Returns undefined if no value can be found.

**Type parameters:**

▪ **IT**: *IAnyModelType*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |
`target` | IAnyStateTreeNode |
`identifier` | ReferenceIdentifier |

**Returns:** *IT["Type"] | undefined*

___

###  resolvePath

▸ **resolvePath**(`target`: IAnyStateTreeNode, `path`: string): *any*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:509](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L509)*

Resolves a path relatively to a given object.
Returns undefined if no value can be found.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`target` | IAnyStateTreeNode | - |
`path` | string | escaped json path |

**Returns:** *any*

___

###  runMiddleWares

▸ **runMiddleWares**(`node`: AnyObjectNode, `baseCall`: IMiddlewareEvent, `originalFn`: Function): *any*

*Defined in [packages/mobx-state-tree/src/core/action.ts:242](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/action.ts#L242)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | AnyObjectNode |
`baseCall` | IMiddlewareEvent |
`originalFn` | Function |

**Returns:** *any*

___

###  safeReference

▸ **safeReference**‹**IT**›(`subType`: IT, `options`: ReferenceOptionsGetSet‹IT› | object & object): *IReferenceType‹IT›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:537](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L537)*

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

▪ **IT**: *IAnyComplexType*

**Parameters:**

Name | Type |
------ | ------ |
`subType` | IT |
`options` | ReferenceOptionsGetSet‹IT› &#124; object & object |

**Returns:** *IReferenceType‹IT›*

▸ **safeReference**‹**IT**›(`subType`: IT, `options?`: ReferenceOptionsGetSet‹IT› | object & object): *IMaybe‹IReferenceType‹IT››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/reference.ts:544](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/reference.ts#L544)*

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

▪ **IT**: *IAnyComplexType*

**Parameters:**

Name | Type |
------ | ------ |
`subType` | IT |
`options?` | ReferenceOptionsGetSet‹IT› &#124; object & object |

**Returns:** *IMaybe‹IReferenceType‹IT››*

___

###  safeStringify

▸ **safeStringify**(`value`: any): *string*

*Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:38](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type-checker.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`value` | any |

**Returns:** *string*

___

###  serializeArgument

▸ **serializeArgument**(`node`: AnyNode, `actionName`: string, `index`: number, `arg`: any): *any*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:44](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/on-action.ts#L44)*

**Parameters:**

Name | Type |
------ | ------ |
`node` | AnyNode |
`actionName` | string |
`index` | number |
`arg` | any |

**Returns:** *any*

___

###  serializeTheUnserializable

▸ **serializeTheUnserializable**(`baseType`: string): *object*

*Defined in [packages/mobx-state-tree/src/middlewares/on-action.ts:74](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/middlewares/on-action.ts#L74)*

**Parameters:**

Name | Type |
------ | ------ |
`baseType` | string |

**Returns:** *object*

* **$MST_UNSERIALIZABLE**: *boolean* = true

* **type**: *string* = baseType

___

###  setLivelinessChecking

▸ **setLivelinessChecking**(`mode`: LivelinessMode): *void*

*Defined in [packages/mobx-state-tree/src/core/node/livelinessChecking.ts:18](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/livelinessChecking.ts#L18)*

Defines what MST should do when running into reads / writes to objects that have died.
By default it will print a warning.
Use the `"error"` option to easy debugging to see where the error was thrown and when the offending read / write took place

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`mode` | LivelinessMode | `"warn"`, `"error"` or `"ignore"`  |

**Returns:** *void*

___

###  shortenPrintValue

▸ **shortenPrintValue**(`valueInString`: string): *string*

*Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:59](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type-checker.ts#L59)*

**Parameters:**

Name | Type |
------ | ------ |
`valueInString` | string |

**Returns:** *string*

___

###  snapshotProcessor

▸ **snapshotProcessor**‹**IT**, **CustomC**, **CustomS**›(`type`: IT, `processors`: ISnapshotProcessors‹IT["CreationType"], CustomC, IT["SnapshotType"], CustomS›, `name?`: undefined | string): *ISnapshotProcessor‹IT, CustomC, CustomS›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts:222](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/snapshotProcessor.ts#L222)*

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
    preProcessor(sn: BackendTodo) {
        return {
            text: sn.text || "";
        }
    },
    // from instance to snapshot
    postProcessor(sn): BackendTodo {
        return {
            text: !sn.text ? null : sn.text
        }
    }
})
```

**Type parameters:**

▪ **IT**: *IAnyType*

▪ **CustomC**

▪ **CustomS**

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | IT | Type to run the processors over. |
`processors` | ISnapshotProcessors‹IT["CreationType"], CustomC, IT["SnapshotType"], CustomS› | Processors to run. |
`name?` | undefined &#124; string | Type name, or undefined to inherit the inner type one. |

**Returns:** *ISnapshotProcessor‹IT, CustomC, CustomS›*

___

###  splitJsonPath

▸ **splitJsonPath**(`path`: string): *string[]*

*Defined in [packages/mobx-state-tree/src/core/json-patch.ts:118](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/json-patch.ts#L118)*

Splits and decodes a json path into several parts.

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *string[]*

___

###  toErrorString

▸ **toErrorString**(`error`: IValidationError): *string*

*Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:67](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type-checker.ts#L67)*

**Parameters:**

Name | Type |
------ | ------ |
`error` | IValidationError |

**Returns:** *string*

___

###  toGenerator

▸ **toGenerator**‹**R**›(`p`: Promise‹R›): *Generator‹Promise‹R›, R, R›*

*Defined in [packages/mobx-state-tree/src/core/flow.ts:86](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/flow.ts#L86)*

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

▸ **toGeneratorFunction**‹**R**, **Args**›(`p`: function): *(Anonymous function)*

*Defined in [packages/mobx-state-tree/src/core/flow.ts:59](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/flow.ts#L59)*

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

###  toPropertiesObject

▸ **toPropertiesObject**(`declaredProps`: ModelPropertiesDeclaration): *ModelProperties*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:262](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L262)*

**Parameters:**

Name | Type |
------ | ------ |
`declaredProps` | ModelPropertiesDeclaration |

**Returns:** *ModelProperties*

___

###  tryCollectModelTypes

▸ **tryCollectModelTypes**(`type`: IAnyType, `modelTypes`: Array‹IAnyModelType›): *boolean*

*Defined in [packages/mobx-state-tree/src/types/complex-types/map.ts:115](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/map.ts#L115)*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IAnyType |
`modelTypes` | Array‹IAnyModelType› |

**Returns:** *boolean*

___

###  tryReference

▸ **tryReference**‹**N**›(`getter`: function, `checkIfAlive`: boolean): *N | undefined*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:566](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L566)*

Tests if a reference is valid (pointing to an existing node and optionally if alive) and returns such reference if it the check passes,
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

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:626](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L626)*

Try to resolve a given path relative to a given node.

**Parameters:**

Name | Type |
------ | ------ |
`target` | IAnyStateTreeNode |
`path` | string |

**Returns:** *any*

___

###  typecheck

▸ **typecheck**‹**IT**›(`type`: IT, `value`: ExtractCSTWithSTN‹IT›): *void*

*Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:166](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type-checker.ts#L166)*

Run's the typechecker for the given type on the given value, which can be a snapshot or an instance.
Throws if the given value is not according the provided type specification.
Use this if you need typechecks even in a production build (by default all automatic runtime type checks will be skipped in production builds)

**Type parameters:**

▪ **IT**: *IAnyType*

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`type` | IT | Type to check against. |
`value` | ExtractCSTWithSTN‹IT› | Value to be checked, either a snapshot or an instance.  |

**Returns:** *void*

___

###  unescapeJsonPath

▸ **unescapeJsonPath**(`path`: string): *string*

*Defined in [packages/mobx-state-tree/src/core/json-patch.ts:88](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/json-patch.ts#L88)*

Unescape slashes and backslashes.

**Parameters:**

Name | Type |
------ | ------ |
`path` | string |

**Returns:** *string*

___

###  union

▸ **union**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**›(`A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›): *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:159](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L159)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |

**Returns:** *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB››*

▸ **union**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**›(`options`: UnionOptions, `A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›): *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:161](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L161)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

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
`options` | UnionOptions |
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |

**Returns:** *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB››*

▸ **union**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**›(`A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›): *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:164](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L164)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |

**Returns:** *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC››*

▸ **union**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**›(`options`: UnionOptions, `A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›): *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:166](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L166)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

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
`options` | UnionOptions |
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |

**Returns:** *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC››*

▸ **union**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**›(`A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›): *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:168](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L168)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |

**Returns:** *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD››*

▸ **union**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**›(`options`: UnionOptions, `A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›): *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:171](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L171)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

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
`options` | UnionOptions |
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |

**Returns:** *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD››*

▸ **union**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**›(`A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›): *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:174](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L174)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |

**Returns:** *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE››*

▸ **union**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**›(`options`: UnionOptions, `A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›): *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:177](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L177)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

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
`options` | UnionOptions |
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |

**Returns:** *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE››*

▸ **union**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**›(`A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›, `F`: IModelType‹PF, OF, FCF, FSF›): *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:180](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L180)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |
`F` | IModelType‹PF, OF, FCF, FSF› |

**Returns:** *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF››*

▸ **union**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**›(`options`: UnionOptions, `A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›, `F`: IModelType‹PF, OF, FCF, FSF›): *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:183](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L183)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

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
`options` | UnionOptions |
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |
`F` | IModelType‹PF, OF, FCF, FSF› |

**Returns:** *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF››*

▸ **union**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**›(`A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›, `F`: IModelType‹PF, OF, FCF, FSF›, `G`: IModelType‹PG, OG, FCG, FSG›): *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:186](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L186)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |
`F` | IModelType‹PF, OF, FCF, FSF› |
`G` | IModelType‹PG, OG, FCG, FSG› |

**Returns:** *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG››*

▸ **union**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**›(`options`: UnionOptions, `A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›, `F`: IModelType‹PF, OF, FCF, FSF›, `G`: IModelType‹PG, OG, FCG, FSG›): *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:189](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L189)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

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
`options` | UnionOptions |
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |
`F` | IModelType‹PF, OF, FCF, FSF› |
`G` | IModelType‹PG, OG, FCG, FSG› |

**Returns:** *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG››*

▸ **union**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**›(`A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›, `F`: IModelType‹PF, OF, FCF, FSF›, `G`: IModelType‹PG, OG, FCG, FSG›, `H`: IModelType‹PH, OH, FCH, FSH›): *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG› | ModelCreationType2‹PH, FCH›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG› | ModelSnapshotType2‹PH, FSH›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG› | ModelInstanceType‹PH, OH››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:193](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L193)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |
`F` | IModelType‹PF, OF, FCF, FSF› |
`G` | IModelType‹PG, OG, FCG, FSG› |
`H` | IModelType‹PH, OH, FCH, FSH› |

**Returns:** *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG› | ModelCreationType2‹PH, FCH›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG› | ModelSnapshotType2‹PH, FSH›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG› | ModelInstanceType‹PH, OH››*

▸ **union**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**›(`options`: UnionOptions, `A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›, `F`: IModelType‹PF, OF, FCF, FSF›, `G`: IModelType‹PG, OG, FCG, FSG›, `H`: IModelType‹PH, OH, FCH, FSH›): *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG› | ModelCreationType2‹PH, FCH›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG› | ModelSnapshotType2‹PH, FSH›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG› | ModelInstanceType‹PH, OH››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:196](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L196)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

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
`options` | UnionOptions |
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |
`F` | IModelType‹PF, OF, FCF, FSF› |
`G` | IModelType‹PG, OG, FCG, FSG› |
`H` | IModelType‹PH, OH, FCH, FSH› |

**Returns:** *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG› | ModelCreationType2‹PH, FCH›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG› | ModelSnapshotType2‹PH, FSH›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG› | ModelInstanceType‹PH, OH››*

▸ **union**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**, **PI**, **OI**, **FCI**, **FSI**›(`A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›, `F`: IModelType‹PF, OF, FCF, FSF›, `G`: IModelType‹PG, OG, FCG, FSG›, `H`: IModelType‹PH, OH, FCH, FSH›, `I`: IModelType‹PI, OI, FCI, FSI›): *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG› | ModelCreationType2‹PH, FCH› | ModelCreationType2‹PI, FCI›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG› | ModelSnapshotType2‹PH, FSH› | ModelSnapshotType2‹PI, FSI›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG› | ModelInstanceType‹PH, OH› | ModelInstanceType‹PI, OI››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:200](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L200)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

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
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |
`F` | IModelType‹PF, OF, FCF, FSF› |
`G` | IModelType‹PG, OG, FCG, FSG› |
`H` | IModelType‹PH, OH, FCH, FSH› |
`I` | IModelType‹PI, OI, FCI, FSI› |

**Returns:** *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG› | ModelCreationType2‹PH, FCH› | ModelCreationType2‹PI, FCI›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG› | ModelSnapshotType2‹PH, FSH› | ModelSnapshotType2‹PI, FSI›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG› | ModelInstanceType‹PH, OH› | ModelInstanceType‹PI, OI››*

▸ **union**‹**PA**, **OA**, **FCA**, **FSA**, **PB**, **OB**, **FCB**, **FSB**, **PC**, **OC**, **FCC**, **FSC**, **PD**, **OD**, **FCD**, **FSD**, **PE**, **OE**, **FCE**, **FSE**, **PF**, **OF**, **FCF**, **FSF**, **PG**, **OG**, **FCG**, **FSG**, **PH**, **OH**, **FCH**, **FSH**, **PI**, **OI**, **FCI**, **FSI**›(`options`: UnionOptions, `A`: IModelType‹PA, OA, FCA, FSA›, `B`: IModelType‹PB, OB, FCB, FSB›, `C`: IModelType‹PC, OC, FCC, FSC›, `D`: IModelType‹PD, OD, FCD, FSD›, `E`: IModelType‹PE, OE, FCE, FSE›, `F`: IModelType‹PF, OF, FCF, FSF›, `G`: IModelType‹PG, OG, FCG, FSG›, `H`: IModelType‹PH, OH, FCH, FSH›, `I`: IModelType‹PI, OI, FCI, FSI›): *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG› | ModelCreationType2‹PH, FCH› | ModelCreationType2‹PI, FCI›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG› | ModelSnapshotType2‹PH, FSH› | ModelSnapshotType2‹PI, FSI›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG› | ModelInstanceType‹PH, OH› | ModelInstanceType‹PI, OI››*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:203](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L203)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

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
`options` | UnionOptions |
`A` | IModelType‹PA, OA, FCA, FSA› |
`B` | IModelType‹PB, OB, FCB, FSB› |
`C` | IModelType‹PC, OC, FCC, FSC› |
`D` | IModelType‹PD, OD, FCD, FSD› |
`E` | IModelType‹PE, OE, FCE, FSE› |
`F` | IModelType‹PF, OF, FCF, FSF› |
`G` | IModelType‹PG, OG, FCG, FSG› |
`H` | IModelType‹PH, OH, FCH, FSH› |
`I` | IModelType‹PI, OI, FCI, FSI› |

**Returns:** *ITypeUnion‹ModelCreationType2‹PA, FCA› | ModelCreationType2‹PB, FCB› | ModelCreationType2‹PC, FCC› | ModelCreationType2‹PD, FCD› | ModelCreationType2‹PE, FCE› | ModelCreationType2‹PF, FCF› | ModelCreationType2‹PG, FCG› | ModelCreationType2‹PH, FCH› | ModelCreationType2‹PI, FCI›, ModelSnapshotType2‹PA, FSA› | ModelSnapshotType2‹PB, FSB› | ModelSnapshotType2‹PC, FSC› | ModelSnapshotType2‹PD, FSD› | ModelSnapshotType2‹PE, FSE› | ModelSnapshotType2‹PF, FSF› | ModelSnapshotType2‹PG, FSG› | ModelSnapshotType2‹PH, FSH› | ModelSnapshotType2‹PI, FSI›, ModelInstanceType‹PA, OA› | ModelInstanceType‹PB, OB› | ModelInstanceType‹PC, OC› | ModelInstanceType‹PD, OD› | ModelInstanceType‹PE, OE› | ModelInstanceType‹PF, OF› | ModelInstanceType‹PG, OG› | ModelInstanceType‹PH, OH› | ModelInstanceType‹PI, OI››*

▸ **union**‹**CA**, **SA**, **TA**, **CB**, **SB**, **TB**›(`A`: IType‹CA, SA, TA›, `B`: IType‹CB, SB, TB›): *ITypeUnion‹CA | CB, SA | SB, TA | TB›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:207](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L207)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

**Parameters:**

Name | Type |
------ | ------ |
`A` | IType‹CA, SA, TA› |
`B` | IType‹CB, SB, TB› |

**Returns:** *ITypeUnion‹CA | CB, SA | SB, TA | TB›*

▸ **union**‹**CA**, **SA**, **TA**, **CB**, **SB**, **TB**›(`options`: UnionOptions, `A`: IType‹CA, SA, TA›, `B`: IType‹CB, SB, TB›): *ITypeUnion‹CA | CB, SA | SB, TA | TB›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:209](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L209)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

**Parameters:**

Name | Type |
------ | ------ |
`options` | UnionOptions |
`A` | IType‹CA, SA, TA› |
`B` | IType‹CB, SB, TB› |

**Returns:** *ITypeUnion‹CA | CB, SA | SB, TA | TB›*

▸ **union**‹**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**›(`A`: IType‹CA, SA, TA›, `B`: IType‹CB, SB, TB›, `C`: IType‹CC, SC, TC›): *ITypeUnion‹CA | CB | CC, SA | SB | SC, TA | TB | TC›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:211](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L211)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

**Parameters:**

Name | Type |
------ | ------ |
`A` | IType‹CA, SA, TA› |
`B` | IType‹CB, SB, TB› |
`C` | IType‹CC, SC, TC› |

**Returns:** *ITypeUnion‹CA | CB | CC, SA | SB | SC, TA | TB | TC›*

▸ **union**‹**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**›(`options`: UnionOptions, `A`: IType‹CA, SA, TA›, `B`: IType‹CB, SB, TB›, `C`: IType‹CC, SC, TC›): *ITypeUnion‹CA | CB | CC, SA | SB | SC, TA | TB | TC›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:213](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L213)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

**Parameters:**

Name | Type |
------ | ------ |
`options` | UnionOptions |
`A` | IType‹CA, SA, TA› |
`B` | IType‹CB, SB, TB› |
`C` | IType‹CC, SC, TC› |

**Returns:** *ITypeUnion‹CA | CB | CC, SA | SB | SC, TA | TB | TC›*

▸ **union**‹**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**›(`A`: IType‹CA, SA, TA›, `B`: IType‹CB, SB, TB›, `C`: IType‹CC, SC, TC›, `D`: IType‹CD, SD, TD›): *ITypeUnion‹CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:215](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L215)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

**Parameters:**

Name | Type |
------ | ------ |
`A` | IType‹CA, SA, TA› |
`B` | IType‹CB, SB, TB› |
`C` | IType‹CC, SC, TC› |
`D` | IType‹CD, SD, TD› |

**Returns:** *ITypeUnion‹CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD›*

▸ **union**‹**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**›(`options`: UnionOptions, `A`: IType‹CA, SA, TA›, `B`: IType‹CB, SB, TB›, `C`: IType‹CC, SC, TC›, `D`: IType‹CD, SD, TD›): *ITypeUnion‹CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:218](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L218)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

**Parameters:**

Name | Type |
------ | ------ |
`options` | UnionOptions |
`A` | IType‹CA, SA, TA› |
`B` | IType‹CB, SB, TB› |
`C` | IType‹CC, SC, TC› |
`D` | IType‹CD, SD, TD› |

**Returns:** *ITypeUnion‹CA | CB | CC | CD, SA | SB | SC | SD, TA | TB | TC | TD›*

▸ **union**‹**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**›(`A`: IType‹CA, SA, TA›, `B`: IType‹CB, SB, TB›, `C`: IType‹CC, SC, TC›, `D`: IType‹CD, SD, TD›, `E`: IType‹CE, SE, TE›): *ITypeUnion‹CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:220](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L220)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

**Parameters:**

Name | Type |
------ | ------ |
`A` | IType‹CA, SA, TA› |
`B` | IType‹CB, SB, TB› |
`C` | IType‹CC, SC, TC› |
`D` | IType‹CD, SD, TD› |
`E` | IType‹CE, SE, TE› |

**Returns:** *ITypeUnion‹CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE›*

▸ **union**‹**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**›(`options`: UnionOptions, `A`: IType‹CA, SA, TA›, `B`: IType‹CB, SB, TB›, `C`: IType‹CC, SC, TC›, `D`: IType‹CD, SD, TD›, `E`: IType‹CE, SE, TE›): *ITypeUnion‹CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:222](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L222)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

**Parameters:**

Name | Type |
------ | ------ |
`options` | UnionOptions |
`A` | IType‹CA, SA, TA› |
`B` | IType‹CB, SB, TB› |
`C` | IType‹CC, SC, TC› |
`D` | IType‹CD, SD, TD› |
`E` | IType‹CE, SE, TE› |

**Returns:** *ITypeUnion‹CA | CB | CC | CD | CE, SA | SB | SC | SD | SE, TA | TB | TC | TD | TE›*

▸ **union**‹**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**, **CF**, **SF**, **TF**›(`A`: IType‹CA, SA, TA›, `B`: IType‹CB, SB, TB›, `C`: IType‹CC, SC, TC›, `D`: IType‹CD, SD, TD›, `E`: IType‹CE, SE, TE›, `F`: IType‹CF, SF, TF›): *ITypeUnion‹CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:224](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L224)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

▪ **CF**

▪ **SF**

▪ **TF**

**Parameters:**

Name | Type |
------ | ------ |
`A` | IType‹CA, SA, TA› |
`B` | IType‹CB, SB, TB› |
`C` | IType‹CC, SC, TC› |
`D` | IType‹CD, SD, TD› |
`E` | IType‹CE, SE, TE› |
`F` | IType‹CF, SF, TF› |

**Returns:** *ITypeUnion‹CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF›*

▸ **union**‹**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**, **CF**, **SF**, **TF**›(`options`: UnionOptions, `A`: IType‹CA, SA, TA›, `B`: IType‹CB, SB, TB›, `C`: IType‹CC, SC, TC›, `D`: IType‹CD, SD, TD›, `E`: IType‹CE, SE, TE›, `F`: IType‹CF, SF, TF›): *ITypeUnion‹CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:226](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L226)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

▪ **CF**

▪ **SF**

▪ **TF**

**Parameters:**

Name | Type |
------ | ------ |
`options` | UnionOptions |
`A` | IType‹CA, SA, TA› |
`B` | IType‹CB, SB, TB› |
`C` | IType‹CC, SC, TC› |
`D` | IType‹CD, SD, TD› |
`E` | IType‹CE, SE, TE› |
`F` | IType‹CF, SF, TF› |

**Returns:** *ITypeUnion‹CA | CB | CC | CD | CE | CF, SA | SB | SC | SD | SE | SF, TA | TB | TC | TD | TE | TF›*

▸ **union**‹**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**, **CF**, **SF**, **TF**, **CG**, **SG**, **TG**›(`A`: IType‹CA, SA, TA›, `B`: IType‹CB, SB, TB›, `C`: IType‹CC, SC, TC›, `D`: IType‹CD, SD, TD›, `E`: IType‹CE, SE, TE›, `F`: IType‹CF, SF, TF›, `G`: IType‹CG, SG, TG›): *ITypeUnion‹CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:228](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L228)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

▪ **CF**

▪ **SF**

▪ **TF**

▪ **CG**

▪ **SG**

▪ **TG**

**Parameters:**

Name | Type |
------ | ------ |
`A` | IType‹CA, SA, TA› |
`B` | IType‹CB, SB, TB› |
`C` | IType‹CC, SC, TC› |
`D` | IType‹CD, SD, TD› |
`E` | IType‹CE, SE, TE› |
`F` | IType‹CF, SF, TF› |
`G` | IType‹CG, SG, TG› |

**Returns:** *ITypeUnion‹CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG›*

▸ **union**‹**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**, **CF**, **SF**, **TF**, **CG**, **SG**, **TG**›(`options`: UnionOptions, `A`: IType‹CA, SA, TA›, `B`: IType‹CB, SB, TB›, `C`: IType‹CC, SC, TC›, `D`: IType‹CD, SD, TD›, `E`: IType‹CE, SE, TE›, `F`: IType‹CF, SF, TF›, `G`: IType‹CG, SG, TG›): *ITypeUnion‹CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:231](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L231)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

▪ **CF**

▪ **SF**

▪ **TF**

▪ **CG**

▪ **SG**

▪ **TG**

**Parameters:**

Name | Type |
------ | ------ |
`options` | UnionOptions |
`A` | IType‹CA, SA, TA› |
`B` | IType‹CB, SB, TB› |
`C` | IType‹CC, SC, TC› |
`D` | IType‹CD, SD, TD› |
`E` | IType‹CE, SE, TE› |
`F` | IType‹CF, SF, TF› |
`G` | IType‹CG, SG, TG› |

**Returns:** *ITypeUnion‹CA | CB | CC | CD | CE | CF | CG, SA | SB | SC | SD | SE | SF | SG, TA | TB | TC | TD | TE | TF | TG›*

▸ **union**‹**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**, **CF**, **SF**, **TF**, **CG**, **SG**, **TG**, **CH**, **SH**, **TH**›(`A`: IType‹CA, SA, TA›, `B`: IType‹CB, SB, TB›, `C`: IType‹CC, SC, TC›, `D`: IType‹CD, SD, TD›, `E`: IType‹CE, SE, TE›, `F`: IType‹CF, SF, TF›, `G`: IType‹CG, SG, TG›, `H`: IType‹CH, SH, TH›): *ITypeUnion‹CA | CB | CC | CD | CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:233](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L233)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

▪ **CF**

▪ **SF**

▪ **TF**

▪ **CG**

▪ **SG**

▪ **TG**

▪ **CH**

▪ **SH**

▪ **TH**

**Parameters:**

Name | Type |
------ | ------ |
`A` | IType‹CA, SA, TA› |
`B` | IType‹CB, SB, TB› |
`C` | IType‹CC, SC, TC› |
`D` | IType‹CD, SD, TD› |
`E` | IType‹CE, SE, TE› |
`F` | IType‹CF, SF, TF› |
`G` | IType‹CG, SG, TG› |
`H` | IType‹CH, SH, TH› |

**Returns:** *ITypeUnion‹CA | CB | CC | CD | CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH›*

▸ **union**‹**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**, **CF**, **SF**, **TF**, **CG**, **SG**, **TG**, **CH**, **SH**, **TH**›(`options`: UnionOptions, `A`: IType‹CA, SA, TA›, `B`: IType‹CB, SB, TB›, `C`: IType‹CC, SC, TC›, `D`: IType‹CD, SD, TD›, `E`: IType‹CE, SE, TE›, `F`: IType‹CF, SF, TF›, `G`: IType‹CG, SG, TG›, `H`: IType‹CH, SH, TH›): *ITypeUnion‹CA | CB | CC | CD | CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:236](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L236)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

▪ **CF**

▪ **SF**

▪ **TF**

▪ **CG**

▪ **SG**

▪ **TG**

▪ **CH**

▪ **SH**

▪ **TH**

**Parameters:**

Name | Type |
------ | ------ |
`options` | UnionOptions |
`A` | IType‹CA, SA, TA› |
`B` | IType‹CB, SB, TB› |
`C` | IType‹CC, SC, TC› |
`D` | IType‹CD, SD, TD› |
`E` | IType‹CE, SE, TE› |
`F` | IType‹CF, SF, TF› |
`G` | IType‹CG, SG, TG› |
`H` | IType‹CH, SH, TH› |

**Returns:** *ITypeUnion‹CA | CB | CC | CD | CE | CF | CG | CH, SA | SB | SC | SD | SE | SF | SG | SH, TA | TB | TC | TD | TE | TF | TG | TH›*

▸ **union**‹**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**, **CF**, **SF**, **TF**, **CG**, **SG**, **TG**, **CH**, **SH**, **TH**, **CI**, **SI**, **TI**›(`A`: IType‹CA, SA, TA›, `B`: IType‹CB, SB, TB›, `C`: IType‹CC, SC, TC›, `D`: IType‹CD, SD, TD›, `E`: IType‹CE, SE, TE›, `F`: IType‹CF, SF, TF›, `G`: IType‹CG, SG, TG›, `H`: IType‹CH, SH, TH›, `I`: IType‹CI, SI, TI›): *ITypeUnion‹CA | CB | CC | CD | CE | CF | CG | CH | CI, SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:239](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L239)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

▪ **CF**

▪ **SF**

▪ **TF**

▪ **CG**

▪ **SG**

▪ **TG**

▪ **CH**

▪ **SH**

▪ **TH**

▪ **CI**

▪ **SI**

▪ **TI**

**Parameters:**

Name | Type |
------ | ------ |
`A` | IType‹CA, SA, TA› |
`B` | IType‹CB, SB, TB› |
`C` | IType‹CC, SC, TC› |
`D` | IType‹CD, SD, TD› |
`E` | IType‹CE, SE, TE› |
`F` | IType‹CF, SF, TF› |
`G` | IType‹CG, SG, TG› |
`H` | IType‹CH, SH, TH› |
`I` | IType‹CI, SI, TI› |

**Returns:** *ITypeUnion‹CA | CB | CC | CD | CE | CF | CG | CH | CI, SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI›*

▸ **union**‹**CA**, **SA**, **TA**, **CB**, **SB**, **TB**, **CC**, **SC**, **TC**, **CD**, **SD**, **TD**, **CE**, **SE**, **TE**, **CF**, **SF**, **TF**, **CG**, **SG**, **TG**, **CH**, **SH**, **TH**, **CI**, **SI**, **TI**›(`options`: UnionOptions, `A`: IType‹CA, SA, TA›, `B`: IType‹CB, SB, TB›, `C`: IType‹CC, SC, TC›, `D`: IType‹CD, SD, TD›, `E`: IType‹CE, SE, TE›, `F`: IType‹CF, SF, TF›, `G`: IType‹CG, SG, TG›, `H`: IType‹CH, SH, TH›, `I`: IType‹CI, SI, TI›): *ITypeUnion‹CA | CB | CC | CD | CE | CF | CG | CH | CI, SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI›*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:242](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L242)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Type parameters:**

▪ **CA**

▪ **SA**

▪ **TA**

▪ **CB**

▪ **SB**

▪ **TB**

▪ **CC**

▪ **SC**

▪ **TC**

▪ **CD**

▪ **SD**

▪ **TD**

▪ **CE**

▪ **SE**

▪ **TE**

▪ **CF**

▪ **SF**

▪ **TF**

▪ **CG**

▪ **SG**

▪ **TG**

▪ **CH**

▪ **SH**

▪ **TH**

▪ **CI**

▪ **SI**

▪ **TI**

**Parameters:**

Name | Type |
------ | ------ |
`options` | UnionOptions |
`A` | IType‹CA, SA, TA› |
`B` | IType‹CB, SB, TB› |
`C` | IType‹CC, SC, TC› |
`D` | IType‹CD, SD, TD› |
`E` | IType‹CE, SE, TE› |
`F` | IType‹CF, SF, TF› |
`G` | IType‹CG, SG, TG› |
`H` | IType‹CH, SH, TH› |
`I` | IType‹CI, SI, TI› |

**Returns:** *ITypeUnion‹CA | CB | CC | CD | CE | CF | CG | CH | CI, SA | SB | SC | SD | SE | SF | SG | SH | SI, TA | TB | TC | TD | TE | TF | TG | TH | TI›*

▸ **union**(...`types`: IAnyType[]): *IAnyType*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:245](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L245)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Parameters:**

Name | Type |
------ | ------ |
`...types` | IAnyType[] |

**Returns:** *IAnyType*

▸ **union**(`dispatchOrType`: UnionOptions | IAnyType, ...`otherTypes`: IAnyType[]): *IAnyType*

*Defined in [packages/mobx-state-tree/src/types/utility-types/union.ts:246](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/utility-types/union.ts#L246)*

`types.union` - Create a union of multiple types. If the correct type cannot be inferred unambiguously from a snapshot, provide a dispatcher function of the form `(snapshot) => Type`.

**Parameters:**

Name | Type |
------ | ------ |
`dispatchOrType` | UnionOptions &#124; IAnyType |
`...otherTypes` | IAnyType[] |

**Returns:** *IAnyType*

___

###  unprotect

▸ **unprotect**(`target`: IAnyStateTreeNode): *void*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:300](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L300)*

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

###  validationErrorsToString

▸ **validationErrorsToString**‹**IT**›(`type`: IT, `value`: ExtractCSTWithSTN‹IT›, `errors`: IValidationError[]): *string | undefined*

*Defined in [packages/mobx-state-tree/src/core/type/type-checker.ts:174](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/type/type-checker.ts#L174)*

**Type parameters:**

▪ **IT**: *IAnyType*

**Parameters:**

Name | Type |
------ | ------ |
`type` | IT |
`value` | ExtractCSTWithSTN‹IT› |
`errors` | IValidationError[] |

**Returns:** *string | undefined*

___

###  valueAsNode

▸ **valueAsNode**(`childType`: IAnyType, `parent`: AnyObjectNode, `subpath`: string, `newValue`: any, `oldNode?`: AnyNode): *BaseNode‹any, any, any›*

*Defined in [packages/mobx-state-tree/src/types/complex-types/array.ts:416](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/array.ts#L416)*

Convert a value to a node at given parent and subpath. Attempts to reuse old node if possible and given.

**Parameters:**

Name | Type |
------ | ------ |
`childType` | IAnyType |
`parent` | AnyObjectNode |
`subpath` | string |
`newValue` | any |
`oldNode?` | AnyNode |

**Returns:** *BaseNode‹any, any, any›*

___

###  walk

▸ **walk**(`target`: IAnyStateTreeNode, `processor`: function): *void*

*Defined in [packages/mobx-state-tree/src/core/mst-operations.ts:788](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/mst-operations.ts#L788)*

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

### `Const` defaultObjectOptions

### ▪ **defaultObjectOptions**: *object*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:256](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L256)*

###  initializers

• **initializers**: *ReadonlyArray‹any›* = EMPTY_ARRAY

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:259](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L259)*

###  name

• **name**: *string* = "AnonymousModel"

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:257](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L257)*

###  properties

• **properties**: *object*

*Defined in [packages/mobx-state-tree/src/types/complex-types/model.ts:258](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/complex-types/model.ts#L258)*

#### Type declaration:

___

### `Const` snapshotReactionOptions

### ▪ **snapshotReactionOptions**: *object*

*Defined in [packages/mobx-state-tree/src/core/node/object-node.ts:67](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/object-node.ts#L67)*

###  onError

▸ **onError**(`e`: any): *never*

*Defined in [packages/mobx-state-tree/src/core/node/object-node.ts:68](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/core/node/object-node.ts#L68)*

**Parameters:**

Name | Type |
------ | ------ |
`e` | any |

**Returns:** *never*

___

### `Const` types

### ▪ **types**: *object*

*Defined in [packages/mobx-state-tree/src/types/index.ts:31](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L31)*

###  Date

• **Date**: *IType‹number | Date, number, Date›* = DatePrimitive

*Defined in [packages/mobx-state-tree/src/types/index.ts:48](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L48)*

###  array

• **array**: *array*

*Defined in [packages/mobx-state-tree/src/types/index.ts:50](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L50)*

###  boolean

• **boolean**: *ISimpleType‹boolean›*

*Defined in [packages/mobx-state-tree/src/types/index.ts:45](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L45)*

###  compose

• **compose**: *compose*

*Defined in [packages/mobx-state-tree/src/types/index.ts:34](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L34)*

###  custom

• **custom**: *custom*

*Defined in [packages/mobx-state-tree/src/types/index.ts:35](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L35)*

###  enumeration

• **enumeration**: *enumeration*

*Defined in [packages/mobx-state-tree/src/types/index.ts:32](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L32)*

###  frozen

• **frozen**: *frozen*

*Defined in [packages/mobx-state-tree/src/types/index.ts:51](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L51)*

###  identifier

• **identifier**: *ISimpleType‹string›*

*Defined in [packages/mobx-state-tree/src/types/index.ts:52](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L52)*

###  identifierNumber

• **identifierNumber**: *ISimpleType‹number›*

*Defined in [packages/mobx-state-tree/src/types/index.ts:53](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L53)*

###  integer

• **integer**: *ISimpleType‹number›*

*Defined in [packages/mobx-state-tree/src/types/index.ts:47](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L47)*

###  late

• **late**: *late*

*Defined in [packages/mobx-state-tree/src/types/index.ts:54](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L54)*

###  literal

• **literal**: *literal*

*Defined in [packages/mobx-state-tree/src/types/index.ts:40](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L40)*

###  map

• **map**: *map*

*Defined in [packages/mobx-state-tree/src/types/index.ts:49](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L49)*

###  maybe

• **maybe**: *maybe*

*Defined in [packages/mobx-state-tree/src/types/index.ts:41](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L41)*

###  maybeNull

• **maybeNull**: *maybeNull*

*Defined in [packages/mobx-state-tree/src/types/index.ts:42](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L42)*

###  model

• **model**: *model*

*Defined in [packages/mobx-state-tree/src/types/index.ts:33](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L33)*

###  null

• **null**: *ISimpleType‹null›* = nullType

*Defined in [packages/mobx-state-tree/src/types/index.ts:56](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L56)*

###  number

• **number**: *ISimpleType‹number›*

*Defined in [packages/mobx-state-tree/src/types/index.ts:46](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L46)*

###  optional

• **optional**: *optional*

*Defined in [packages/mobx-state-tree/src/types/index.ts:39](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L39)*

###  reference

• **reference**: *reference*

*Defined in [packages/mobx-state-tree/src/types/index.ts:36](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L36)*

###  refinement

• **refinement**: *refinement*

*Defined in [packages/mobx-state-tree/src/types/index.ts:43](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L43)*

###  safeReference

• **safeReference**: *safeReference*

*Defined in [packages/mobx-state-tree/src/types/index.ts:37](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L37)*

###  snapshotProcessor

• **snapshotProcessor**: *snapshotProcessor*

*Defined in [packages/mobx-state-tree/src/types/index.ts:57](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L57)*

###  string

• **string**: *ISimpleType‹string›*

*Defined in [packages/mobx-state-tree/src/types/index.ts:44](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L44)*

###  undefined

• **undefined**: *ISimpleType‹undefined›* = undefinedType

*Defined in [packages/mobx-state-tree/src/types/index.ts:55](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L55)*

###  union

• **union**: *union*

*Defined in [packages/mobx-state-tree/src/types/index.ts:38](https://github.com/mobxjs/mobx-state-tree/blob/84743ce4/packages/mobx-state-tree/src/types/index.ts#L38)*
