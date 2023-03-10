// tslint:disable-next-line:no_unused-variable
import { IObservableArray, ObservableMap } from "mobx"

/* all code is initially loaded through internal, to avoid circular dep issues */
export {
    IModelType,
    IAnyModelType,
    IDisposer,
    IMSTMap,
    IMapType,
    IMSTArray,
    IArrayType,
    IType,
    IAnyType,
    ModelPrimitive,
    ISimpleType,
    IComplexType,
    IAnyComplexType,
    IReferenceType,
    _CustomCSProcessor,
    _CustomOrOther,
    _CustomJoin,
    _NotCustomized,
    typecheck,
    escapeJsonPath,
    unescapeJsonPath,
    joinJsonPath,
    splitJsonPath,
    IJsonPatch,
    IReversibleJsonPatch,
    decorate,
    addMiddleware,
    IMiddlewareEvent,
    IActionTrackingMiddleware2Call,
    IMiddlewareHandler,
    IMiddlewareEventType,
    IActionTrackingMiddlewareHooks,
    IActionTrackingMiddleware2Hooks,
    process,
    isStateTreeNode,
    IStateTreeNode,
    IAnyStateTreeNode,
    flow,
    castFlowReturn,
    applyAction,
    onAction,
    IActionRecorder,
    ISerializedActionCall,
    recordActions,
    createActionTrackingMiddleware,
    createActionTrackingMiddleware2,
    setLivelinessChecking,
    getLivelinessChecking,
    LivelinessMode,
    setLivelynessChecking, // to be deprecated
    LivelynessMode, // to be deprecated
    ModelSnapshotType,
    ModelCreationType,
    ModelSnapshotType2,
    ModelCreationType2,
    ModelInstanceType,
    ModelInstanceTypeProps,
    ModelPropertiesDeclarationToProperties,
    ModelProperties,
    ModelPropertiesDeclaration,
    ModelActions,
    ITypeUnion,
    CustomTypeOptions,
    UnionOptions,
    Instance,
    SnapshotIn,
    SnapshotOut,
    SnapshotOrInstance,
    TypeOrStateTreeNodeToStateTreeNode,
    UnionStringArray,
    getType,
    getChildType,
    onPatch,
    onSnapshot,
    applyPatch,
    IPatchRecorder,
    recordPatches,
    protect,
    unprotect,
    isProtected,
    applySnapshot,
    getSnapshot,
    hasParent,
    getParent,
    hasParentOfType,
    getParentOfType,
    getRoot,
    getPath,
    getPathParts,
    isRoot,
    resolvePath,
    resolveIdentifier,
    getIdentifier,
    tryResolve,
    getRelativePath,
    clone,
    detach,
    destroy,
    isAlive,
    addDisposer,
    getEnv,
    walk,
    IModelReflectionData,
    IModelReflectionPropertiesData,
    IMaybeIType,
    IMaybe,
    IMaybeNull,
    IOptionalIType,
    OptionalDefaultValueOrFunction,
    ValidOptionalValue,
    ValidOptionalValues,
    getMembers,
    getPropertyMembers,
    TypeOfValue,
    cast,
    castToSnapshot,
    castToReferenceSnapshot,
    isType,
    isArrayType,
    isFrozenType,
    isIdentifierType,
    isLateType,
    isLiteralType,
    isMapType,
    isModelType,
    isOptionalType,
    isPrimitiveType,
    isReferenceType,
    isRefinementType,
    isUnionType,
    tryReference,
    isValidReference,
    OnReferenceInvalidated,
    OnReferenceInvalidatedEvent,
    ReferenceOptions,
    ReferenceOptionsGetSet,
    ReferenceOptionsOnInvalidated,
    ReferenceIdentifier,
    ISnapshotProcessor,
    ISnapshotProcessors,
    getNodeId,
    IActionContext,
    getRunningActionContext,
    isActionContextChildOf,
    isActionContextThisOrChildOf,
    types,
    toGeneratorFunction,
    toGenerator
} from "./internal"
