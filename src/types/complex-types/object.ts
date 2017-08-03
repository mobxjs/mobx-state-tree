import {
    action,
    extendShallowObservable,
    IObjectChange,
    IObjectWillChange,
    intercept,
    observe,
    computed,
    observable
} from "mobx"
import {
    extendKeepGetter,
    fail,
    hasOwnProperty,
    isPlainObject,
    isPrimitive,
    EMPTY_ARRAY,
    addHiddenFinalProp
} from "../../utils"
import { ComplexType, IComplexType, IType } from "../type"
import { TypeFlags, isType, isObjectType } from "../type-flags"
import {
    createNode,
    getStateTreeNode,
    IStateTreeNode,
    IJsonPatch,
    Node,
    createActionInvoker,
    escapeJsonPath
} from "../../core"
import {
    flattenTypeErrors,
    IContext,
    IValidationResult,
    typecheck,
    typeCheckFailure
} from "../type-checker"
import { getPrimitiveFactoryFromValue } from "../primitives"
import { optional } from "../utility-types/optional"
import { Property } from "../property-types/property"
import { ComputedProperty } from "../property-types/computed-property"
import { ValueProperty } from "../property-types/value-property"
import { ActionProperty } from "../property-types/action-property"
import { ViewProperty } from "../property-types/view-property"
import { VolatileProperty } from "../property-types/volatile-property"

const HOOK_NAMES = [
    "preProcessSnapshot",
    "afterCreate",
    "afterAttach",
    "postProcessSnapshot",
    "beforeDetach",
    "beforeDestroy"
]

function objectTypeToString(this: any) {
    return getStateTreeNode(this).toString()
}

// TODO: rename to Model
export class ObjectType<S, T> extends ComplexType<S, T> implements IModelType<S, T> {
    readonly flags = TypeFlags.Object

    /*
     * The original object definition
     */
    public readonly initializers: ((instance: any) => any)[]
    public readonly properties: { [K: string]: IType<any, any> }

    modelConstructor: new () => any

    constructor(
        name: string,
        properties: { [K: string]: IType<any, any> },
        initializers?: ((instance: any) => any)[]
    ) {
        super(name)
        Object.freeze(properties) // make sure nobody messes with it
        this.properties = properties
        this.initializers = initializers ? initializers : EMPTY_ARRAY as any
        if (!/^\w[\w\d_]*$/.test(name)) fail(`Typename should be a valid identifier: ${name}`)
        // Fancy trick to get a named constructor
        this.modelConstructor = class {}
        Object.defineProperty(this.modelConstructor, "name", {
            value: name,
            writable: false
        })
        const proto = this.modelConstructor.prototype
        proto.toString = objectTypeToString
        // attach computeds on prototype
        Object.keys(this.properties).forEach(key => {
            observable.ref(proto, key, {
                value: undefinedType.instantiate(null, "", null, undefined)
            })
        })
    }

    actions<A extends { [name: string]: Function }>(fn: (self: T) => A): IModelType<S, T & A> {
        const actionInitializer = (self: T) => {
            const actions = fn(self)
            if (actions && isPlainObject(actions)) {
                Object.keys(actions).forEach(name => {
                    addHiddenFinalProp(self, name, createActionInvoker(name, actions[name]))
                })
            }
            return self
        }
        return new ObjectType(
            this.name,
            this.properties,
            this.initializers.concat(actionInitializer)
        )
    }

    named(name: string): IModelType<S, T> {
        return new ObjectType(name, this.properties, this.initializers)
    }

    props<SP, TP>(
        props: { [K in keyof TP]: IType<any, TP[K]> } & { [K in keyof SP]: IType<SP[K], any> }
    ): IModelType<S & SP, T & TP> {
        return new ObjectType(
            this.name,
            Object.assign({} as any, this.properties, props),
            this.initializers
        )
    }

    views<V extends Object>(fn: (self: T) => V): IModelType<S, T & V> {
        const viewInitializer = (self: T) => {
            const views = fn(self)

            Object.keys(views).forEach(key => {
                // is this a computed property?
                const descriptor = Object.getOwnPropertyDescriptor(views, key)
                const { value } = descriptor
                if ("get" in descriptor) {
                    Object.defineProperty(
                        this.modelConstructor.prototype,
                        key,
                        computed(this.modelConstructor.prototype, key, {
                            get: descriptor.get,
                            set: descriptor.set,
                            configurable: true,
                            enumerable: false
                        }) as any
                    )
                } else if (typeof value === "function") {
                    // this is a view function, merge as is!
                    addHiddenFinalProp(self, key, value)
                } else {
                    // TODO: throw!
                }
            })

            return self
        }

        return new ObjectType(this.name, this.properties, this.initializers.concat(viewInitializer))
    }

    willChange(change: IObjectWillChange): IObjectWillChange | null {
        const node = getStateTreeNode(change.object) // TODO: pass node in from object property
        typecheck(this.properties[change.name], change.newValue)
        change.newValue = this.properties[change.name].reconcile(
            node.getChildNode(change.name),
            change.newValue
        )
        return change
    }

    didChange(change: IObjectChange) {
        const node = getStateTreeNode(change.object)
        node.emitPatch(
            {
                op: "replace",
                path: escapeJsonPath(change.name),
                value: change.newValue.snapshot,
                oldValue: change.oldValue ? change.oldValue.snapshot : undefined
            },
            node
        )
    }
}

export interface IModelType<S, T> extends IType<S, T> {
    named(newName: string): IModelType<S, T>
    props<SP, TP>(
        props: { [K in keyof TP]: IType<any, TP[K]> } & { [K in keyof SP]: IType<SP[K], any> }
    ): IModelType<S & SP, T & TP>
    views<V extends Object>(fn: (self: T) => V): IModelType<S, T & V>
    actions<A extends { [name: string]: Function }>(fn: (self: T) => A): IModelType<S, T & A>
}
