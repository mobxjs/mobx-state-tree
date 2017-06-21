!(function(e, t) {
    "object" == typeof exports && "object" == typeof module
        ? (module.exports = t(require("mobx")))
        : "function" == typeof define && define.amd
          ? define(["mobx"], t)
          : "object" == typeof exports ? (exports.mobxStateTree = t(require("mobx"))) : (e.mobxStateTree = t(e.mobx))
})(this, function(e) {
    return (function(e) {
        function t(r) {
            if (n[r]) return n[r].exports
            var o = (n[r] = { exports: {}, id: r, loaded: !1 })
            return e[r].call(o.exports, o, o.exports, t), (o.loaded = !0), o.exports
        }
        var n = {}
        return (t.m = e), (t.c = n), (t.p = ""), t(0)
    })([
        function(e, t, n) {
            "use strict"
            function r(e) {
                for (var n in e) t.hasOwnProperty(n) || (t[n] = e[n])
            }
            Object.defineProperty(t, "__esModule", { value: !0 }), n(7), n(4)
            var o = n(21)
            ;(t.types = o.types), r(n(6)), r(n(8))
            var i = n(2)
            ;(t.isStateTreeNode = i.isStateTreeNode), (t.getType = i.getType), (t.getChildType =
                i.getChildType), (t.onAction = i.onAction), (t.applyAction = i.applyAction)
            var a = n(17)
            ;(t.asReduxStore = a.asReduxStore), (t.connectReduxDevtools = a.connectReduxDevtools)
        },
        function(e, t) {
            "use strict"
            function n(e) {
                throw (void 0 === e && (e = "Illegal state"), new Error("[mobx-state-tree] " + e))
            }
            function r(e) {
                return e
            }
            function o() {
                return null
            }
            function i() {}
            function a(e) {
                for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n]
                for (var r = 0; r < t.length; r++) {
                    var o = t[r]
                    for (var i in o) e[i] = o[i]
                }
                return e
            }
            function s(e) {
                for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n]
                for (var r = 0; r < t.length; r++) {
                    var o = t[r]
                    for (var i in o) {
                        var a = Object.getOwnPropertyDescriptor(o, i)
                        "get" in a ? Object.defineProperty(e, i, a) : (e[i] = o[i])
                    }
                }
                return e
            }
            function u(e) {
                if (null === e || "object" != typeof e) return !1
                var t = Object.getPrototypeOf(e)
                return t === Object.prototype || null === t
            }
            function p(e) {
                return !(null === e || "object" != typeof e || e instanceof Date || e instanceof RegExp)
            }
            function c(e) {
                return (
                    null === e ||
                    void 0 === e ||
                    "string" == typeof e ||
                    "number" == typeof e ||
                    "boolean" == typeof e ||
                    e instanceof Date
                )
            }
            function l(e) {
                return c(e) ? e : Object.freeze(e)
            }
            function f(e) {
                return l(e), u(e) &&
                    Object.keys(e).forEach(function(t) {
                        Object.isFrozen(e[t]) || f(e[t])
                    }), e
            }
            function h(e) {
                return "function" != typeof e
            }
            function d(e, t, n) {
                Object.defineProperty(e, t, { enumerable: !1, writable: !1, configurable: !0, value: n })
            }
            function y(e, t, n) {
                Object.defineProperty(e, t, { enumerable: !1, writable: !0, configurable: !0, value: n })
            }
            function v(e, t, n) {
                Object.defineProperty(e, t, { enumerable: !0, writable: !1, configurable: !0, value: n })
            }
            function b(e, t) {
                return e.push(t), function() {
                    var n = e.indexOf(t)
                    n !== -1 && e.splice(n, 1)
                }
            }
            function g(e, t) {
                return P.call(e, t)
            }
            function m(e) {
                for (var t = new Array(e.length), n = 0; n < e.length; n++) t[n] = e[n]
                return t
            }
            function _(e, t) {
                return new Function("f", "return function " + e + "() { return f.apply(this, arguments)}")(t)
            }
            Object.defineProperty(t, "__esModule", { value: !0 }), (t.EMPTY_ARRAY = Object.freeze(
                []
            )), (t.fail = n), (t.identity = r), (t.nothing = o), (t.noop = i), (t.extend = a), (t.extendKeepGetter = s), (t.isPlainObject = u), (t.isMutable = p), (t.isPrimitive = c), (t.freeze = l), (t.deepFreeze = f), (t.isSerializable = h), (t.addHiddenFinalProp = d), (t.addHiddenWritableProp = y), (t.addReadOnlyProp = v), (t.registerEventHandler = b)
            var P = Object.prototype.hasOwnProperty
            ;(t.hasOwnProperty = g), (t.argsToArray = m), (t.createNamedFunction = _)
        },
        function(e, t, n) {
            "use strict"
            function r(e) {
                for (var n in e) t.hasOwnProperty(n) || (t[n] = e[n])
            }
            Object.defineProperty(t, "__esModule", { value: !0 }), r(n(7)), r(n(12)), r(n(8)), r(n(6))
        },
        function(e, t, n) {
            "use strict"
            function r(e) {
                return "function" == typeof e
                    ? "<function" + (e.name ? " " + e.name : "") + ">"
                    : f.isStateTreeNode(e) ? "<" + e + ">" : "`" + JSON.stringify(e) + "`"
            }
            function o(e) {
                var t = e.value,
                    n = e.context[e.context.length - 1].type,
                    o = e.context
                        .map(function(e) {
                            var t = e.path
                            return t
                        })
                        .filter(function(e) {
                            return e.length > 0
                        })
                        .join("/"),
                    i = o.length > 0 ? 'at path "/' + o + '" ' : "",
                    a = f.isStateTreeNode(t)
                        ? "value of type " + f.getStateTreeNode(t).type.name + ":"
                        : l.isPrimitive(t) ? "value" : "snapshot",
                    s = n && f.isStateTreeNode(t) && n.is(f.getStateTreeNode(t).snapshot)
                return (
                    "" +
                    i +
                    a +
                    " " +
                    r(t) +
                    " is not assignable " +
                    (n ? "to type: `" + n.name + "`" : "") +
                    (e.message ? " (" + e.message + ")" : "") +
                    (n
                        ? h.isPrimitiveType(n) || (n instanceof d.OptionalValue && h.isPrimitiveType(n.type))
                          ? "."
                          : ", expected an instance of `" +
                                n.name +
                                "` or a snapshot like `" +
                                n.describe() +
                                "` instead." +
                                (s
                                    ? " (Note that a snapshot of the provided value is compatible with the targeted type)"
                                    : "")
                        : ".")
                )
            }
            function i(e) {
                return [{ type: e, path: "" }]
            }
            function a(e, t, n) {
                return e.concat([{ path: t, type: n }])
            }
            function s() {
                return l.EMPTY_ARRAY
            }
            function u(e, t, n) {
                return [{ context: e, value: t, message: n }]
            }
            function p(e) {
                return e.reduce(function(e, t) {
                    return e.concat(t)
                }, [])
            }
            function c(e, t) {
                var n = e.validate(t, [{ path: "", type: e }])
                n.length > 0 &&
                    l.fail("Error while converting " + r(t) + " to `" + e.name + "`:\n" + n.map(o).join("\n"))
            }
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), (t.prettyPrintValue = r), (t.getDefaultContext = i), (t.getContextForPath = a), (t.typeCheckSuccess = s), (t.typeCheckFailure = u), (t.flattenTypeErrors = p), (t.typecheck = c)
            var l = n(1),
                f = n(2),
                h = n(9),
                d = n(11)
        },
        function(e, t, n) {
            "use strict"
            function r(e) {
                return "object" == typeof e && e && e.isType === !0
            }
            var o =
                (this && this.__extends) ||
                (function() {
                    var e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function(e, t) {
                                e.__proto__ = t
                            }) ||
                        function(e, t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }
                    return function(t, n) {
                        function r() {
                            this.constructor = t
                        }
                        e(t, n), (t.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
                    }
                })(),
                i =
                    (this && this.__decorate) ||
                    function(e, t, n, r) {
                        var o,
                            i = arguments.length,
                            a = i < 3 ? t : null === r ? (r = Object.getOwnPropertyDescriptor(t, n)) : r
                        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                            a = Reflect.decorate(e, t, n, r)
                        else
                            for (var s = e.length - 1; s >= 0; s--)
                                (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a)
                        return i > 3 && a && Object.defineProperty(t, n, a), a
                    }
            Object.defineProperty(t, "__esModule", { value: !0 })
            var a,
                s = n(5)
            !(function(e) {
                ;(e[(e.String = 1)] = "String"), (e[(e.Number = 2)] = "Number"), (e[(e.Boolean = 4)] = "Boolean"), (e[
                    (e.Date = 8)
                ] =
                    "Date"), (e[(e.Literal = 16)] = "Literal"), (e[(e.Array = 32)] = "Array"), (e[(e.Map = 64)] =
                    "Map"), (e[(e.Object = 128)] = "Object"), (e[(e.Frozen = 256)] = "Frozen"), (e[(e.Optional = 512)] =
                    "Optional"), (e[(e.Reference = 1024)] = "Reference"), (e[(e.Identifier = 2048)] = "Identifier")
            })((a = t.TypeFlags || (t.TypeFlags = {}))), (t.isType = r)
            var u = (function() {
                function e(e) {
                    ;(this.isType = !0), (this.name = e)
                }
                return (e.prototype.create = function(e, t) {
                    return void 0 === e && (e = this.getDefaultSnapshot()), f.typecheck(this, e), this.instantiate(
                        null,
                        "",
                        t,
                        e
                    ).value
                }), (e.prototype.isAssignableFrom = function(e) {
                    return e === this
                }), (e.prototype.validate = function(e, t) {
                    return l.isStateTreeNode(e)
                        ? h.getType(e) === this || this.isAssignableFrom(h.getType(e))
                          ? f.typeCheckSuccess()
                          : f.typeCheckFailure(t, e)
                        : this.isValidSnapshot(e, t)
                }), (e.prototype.is = function(e) {
                    return 0 === this.validate(e, [{ path: "", type: this }]).length
                }), (e.prototype.reconcile = function(e, t) {
                    if (l.isStateTreeNode(t) && l.getStateTreeNode(t) === e) return e
                    if (
                        e.type === this &&
                        c.isMutable(t) &&
                        !l.isStateTreeNode(t) &&
                        (!e.identifierAttribute || e.identifier === t[e.identifierAttribute])
                    )
                        return e.applySnapshot(t), e
                    if ((e.die(), l.isStateTreeNode(t) && this.isAssignableFrom(h.getType(t)))) {
                        var n = l.getStateTreeNode(t)
                        return n.setParent(e.parent, e.path), n
                    }
                    return this.instantiate(e.parent, e.path, e._environment, t)
                }), Object.defineProperty(e.prototype, "Type", {
                    get: function() {
                        return c.fail(
                            "Factory.Type should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.Type`"
                        )
                    },
                    enumerable: !0,
                    configurable: !0
                }), Object.defineProperty(e.prototype, "SnapshotType", {
                    get: function() {
                        return c.fail(
                            "Factory.SnapshotType should not be actually called. It is just a Type signature that can be used at compile time with Typescript, by using `typeof type.SnapshotType`"
                        )
                    },
                    enumerable: !0,
                    configurable: !0
                }), e
            })()
            i([s.action], u.prototype, "create", null), (t.ComplexType = u)
            var p = (function(e) {
                function t(t) {
                    return e.call(this, t) || this
                }
                return o(t, e), (t.prototype.getValue = function(e) {
                    return e.storedValue
                }), (t.prototype.getSnapshot = function(e) {
                    return e.storedValue
                }), (t.prototype.getDefaultSnapshot = function() {}), (t.prototype.applySnapshot = function(e, t) {
                    c.fail("Immutable types do not support applying snapshots")
                }), (t.prototype.applyPatchLocally = function(e, t, n) {
                    c.fail("Immutable types do not support applying patches")
                }), (t.prototype.getChildren = function(e) {
                    return c.EMPTY_ARRAY
                }), (t.prototype.getChildNode = function(e, t) {
                    return c.fail("No child '" + t + "' available in type: " + this.name)
                }), (t.prototype.getChildType = function(e) {
                    return c.fail("No child '" + e + "' available in type: " + this.name)
                }), (t.prototype.reconcile = function(e, t) {
                    if (e.type === this && e.storedValue === t) return e
                    var n = this.instantiate(e.parent, e.subpath, e._environment, t)
                    return e.die(), n
                }), (t.prototype.removeChild = function(e, t) {
                    return c.fail("No child '" + t + "' available in type: " + this.name)
                }), t
            })(u)
            t.Type = p
            var c = n(1),
                l = n(7),
                f = n(3),
                h = n(6)
        },
        function(t, n) {
            t.exports = e
        },
        function(e, t, n) {
            "use strict"
            function r(e) {
                return I.getStateTreeNode(e).type
            }
            function o(e, t) {
                return I.getStateTreeNode(e).getChildType(t)
            }
            function i(e, t) {
                var n = I.getStateTreeNode(e)
                return n.isProtectionEnabled ||
                    console.warn(
                        "It is recommended to protect the state tree before attaching action middleware, as otherwise it cannot be guaranteed that all changes are passed through middleware. See `protect`"
                    ), n.addMiddleWare(t)
            }
            function a(e, t) {
                return I.getStateTreeNode(e).onPatch(t)
            }
            function s(e, t) {
                return I.getStateTreeNode(e).onSnapshot(t)
            }
            function u(e, t) {
                return I.getStateTreeNode(e).applyPatch(t)
            }
            function p(e, t) {
                var n = I.getStateTreeNode(e)
                E.runInAction(function() {
                    t.forEach(function(e) {
                        return n.applyPatch(e)
                    })
                })
            }
            function c(e) {
                var t = {
                    patches: [],
                    stop: function() {
                        return n()
                    },
                    replay: function(e) {
                        p(e, t.patches)
                    }
                },
                    n = a(e, function(e) {
                        t.patches.push(e)
                    })
                return t
            }
            function l(e, t) {
                E.runInAction(function() {
                    t.forEach(function(t) {
                        return M.applyAction(e, t)
                    })
                })
            }
            function f(e) {
                var t = {
                    actions: [],
                    stop: function() {
                        return n()
                    },
                    replay: function(e) {
                        l(e, t.actions)
                    }
                },
                    n = M.onAction(e, t.actions.push.bind(t.actions))
                return t
            }
            function h(e) {
                I.getStateTreeNode(e).isProtectionEnabled = !0
            }
            function d(e) {
                I.getStateTreeNode(e).isProtectionEnabled = !1
            }
            function y(e) {
                return I.getStateTreeNode(e).isProtectionEnabled
            }
            function v(e, t) {
                return I.getStateTreeNode(e).applySnapshot(t)
            }
            function b(e) {
                return I.getStateTreeNode(e).snapshot
            }
            function g(e, t) {
                void 0 === t && (t = 1), t < 0 && z.fail("Invalid depth: " + t + ", should be >= 1")
                for (var n = I.getStateTreeNode(e).parent; n; ) {
                    if (0 === --t) return !0
                    n = n.parent
                }
                return !1
            }
            function m(e, t) {
                void 0 === t && (t = 1), t < 0 && z.fail("Invalid depth: " + t + ", should be >= 1")
                for (var n = t, r = I.getStateTreeNode(e).parent; r; ) {
                    if (0 === --n) return r.storedValue
                    r = r.parent
                }
                return z.fail("Failed to find the parent of " + I.getStateTreeNode(e) + " at depth " + t)
            }
            function _(e) {
                return I.getStateTreeNode(e).root.storedValue
            }
            function P(e) {
                return I.getStateTreeNode(e).path
            }
            function T(e) {
                return D.splitJsonPath(I.getStateTreeNode(e).path)
            }
            function j(e) {
                return I.getStateTreeNode(e).isRoot
            }
            function O(e, t) {
                var n = I.getStateTreeNode(e).resolve(t)
                return n ? n.value : void 0
            }
            function w(e, t, n) {
                J.isType(e) || z.fail("Expected a type as first argument")
                var r = I.getStateTreeNode(t).root.identifierCache.resolve(e, "" + n)
                return r ? r.value : void 0
            }
            function S(e, t) {
                var n = I.getStateTreeNode(e).resolve(t, !1)
                if (void 0 !== n) return n ? n.value : void 0
            }
            function N(e, t) {
                return I.getStateTreeNode(e).getRelativePathTo(I.getStateTreeNode(t))
            }
            function A(e, t) {
                void 0 === t && (t = !0)
                var n = I.getStateTreeNode(e)
                return n.type.create(n.snapshot, t === !0 ? n.root._environment : t === !1 ? void 0 : t)
            }
            function C(e) {
                return I.getStateTreeNode(e).detach(), e
            }
            function x(e) {
                var t = I.getStateTreeNode(e)
                t.isRoot ? t.die() : t.parent.removeChild(t.subpath)
            }
            function V(e) {
                return I.getStateTreeNode(e).isAlive
            }
            function F(e, t) {
                I.getStateTreeNode(e).addDisposer(t)
            }
            function k(e) {
                var t = I.getStateTreeNode(e),
                    n = t.root._environment
                return n ||
                    z.fail(
                        "Node '" +
                            t +
                            "' is not part of state tree that was initialized with an environment. Environment can be passed as second argumentt to .create()"
                    ), n
            }
            function R(e, t) {
                var n = I.getStateTreeNode(e)
                n.getChildren().forEach(function(e) {
                    I.isStateTreeNode(e.storedValue) && R(e.storedValue, t)
                }), t(n.storedValue)
            }
            Object.defineProperty(t, "__esModule", { value: !0 })
            var M = n(12),
                E = n(5),
                I = n(7),
                D = n(8),
                z = n(1),
                J = n(4)
            ;(t.getType = r), (t.getChildType = o), (t.addMiddleware = i), (t.onPatch = a), (t.onSnapshot = s), (t.applyPatch = u), (t.applyPatches = p), (t.recordPatches = c), (t.applyActions = l), (t.recordActions = f), (t.protect = h), (t.unprotect = d), (t.isProtected = y), (t.applySnapshot = v), (t.getSnapshot = b), (t.hasParent = g), (t.getParent = m), (t.getRoot = _), (t.getPath = P), (t.getPathParts = T), (t.isRoot = j), (t.resolvePath = O), (t.resolveIdentifier = w), (t.tryResolve = S), (t.getRelativePath = N), (t.clone = A), (t.detach = C), (t.destroy = x), (t.isAlive = V), (t.addDisposer = F), (t.getEnv = k), (t.walk = R)
        },
        function(e, t, n) {
            "use strict"
            function r(e) {
                return !(!e || !e.$treenode)
            }
            function o(e) {
                return r(e) ? e.$treenode : y.fail("element has no Node")
            }
            function i(e) {
                return e && "object" == typeof e && !r(e) && !Object.isFrozen(e)
            }
            function a() {
                return o(this).snapshot
            }
            function s(e, t, n, s, u, p, c) {
                if ((void 0 === p && (p = y.identity), void 0 === c && (c = y.noop), r(u))) {
                    var f = o(u)
                    return f.isRoot ||
                        y.fail(
                            "Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '" +
                                (t ? t.path : "") +
                                "/" +
                                n +
                                "', but it lives already at '" +
                                f.path +
                                "'"
                        ), f.setParent(t, n), f
                }
                var h = p(u),
                    d = i(h),
                    b = new l(e, t, n, s, h)
                t || (b.identifierCache = new v.IdentifierCache()), d && y.addHiddenFinalProp(h, "$treenode", b)
                var g = !0
                try {
                    return d && y.addReadOnlyProp(h, "toJSON", a), b.pseudoAction(function() {
                        c(b, u)
                    }), t ? t.root.identifierCache.addNodeToCache(b) : b.identifierCache.addNodeToCache(b), b.fireHook(
                        "afterCreate"
                    ), t && b.fireHook("afterAttach"), (g = !1), b
                } finally {
                    g && (b._isAlive = !1)
                }
            }
            var u =
                (this && this.__decorate) ||
                function(e, t, n, r) {
                    var o,
                        i = arguments.length,
                        a = i < 3 ? t : null === r ? (r = Object.getOwnPropertyDescriptor(t, n)) : r
                    if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                        a = Reflect.decorate(e, t, n, r)
                    else
                        for (var s = e.length - 1; s >= 0; s--)
                            (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a)
                    return i > 3 && a && Object.defineProperty(t, n, a), a
                }
            Object.defineProperty(t, "__esModule", { value: !0 })
            var p = n(5),
                c = 1,
                l = (function() {
                    function e(e, t, n, r, o) {
                        var i = this
                        ;(this.nodeId = ++c), (this._parent = null), (this.subpath =
                            ""), (this.isProtectionEnabled = !0), (this.identifierAttribute = void 0), (this._environment = void 0), (this._isRunningAction = !1), (this._autoUnbox = !0), (this._isAlive = !0), (this._isDetaching = !1), (this.middlewares = []), (this.snapshotSubscribers = []), (this.patchSubscribers = []), (this.disposers = []), (this.type = e), (this._parent = t), (this.subpath = n), (this.storedValue = o), (this._environment = r), (this.unbox = this.unbox.bind(
                            this
                        ))
                        var a = p.reaction(
                            function() {
                                return i.snapshot
                            },
                            function(e) {
                                i.emitSnapshot(e)
                            }
                        )
                        a.onError(function(e) {
                            throw e
                        }), this.addDisposer(a)
                    }
                    return Object.defineProperty(e.prototype, "identifier", {
                        get: function() {
                            return this.identifierAttribute ? this.storedValue[this.identifierAttribute] : null
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(e.prototype, "path", {
                        get: function() {
                            return this.parent ? this.parent.path + "/" + f.escapeJsonPath(this.subpath) : ""
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(e.prototype, "isRoot", {
                        get: function() {
                            return null === this.parent
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(e.prototype, "parent", {
                        get: function() {
                            return this._parent
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(e.prototype, "root", {
                        get: function() {
                            for (var e, t = this; (e = t.parent); ) t = e
                            return t
                        },
                        enumerable: !0,
                        configurable: !0
                    }), (e.prototype.getRelativePathTo = function(e) {
                        this.root !== e.root &&
                            y.fail(
                                "Cannot calculate relative path: objects '" +
                                    this +
                                    "' and '" +
                                    e +
                                    "' are not part of the same object tree"
                            )
                        for (
                            var t = f.splitJsonPath(this.path), n = f.splitJsonPath(e.path), r = 0;
                            r < t.length && t[r] === n[r];
                            r++
                        );
                        return (
                            t
                                .slice(r)
                                .map(function(e) {
                                    return ".."
                                })
                                .join("/") + f.joinJsonPath(n.slice(r))
                        )
                    }), (e.prototype.resolve = function(e, t) {
                        return void 0 === t && (t = !0), this.resolvePath(f.splitJsonPath(e), t)
                    }), (e.prototype.resolvePath = function(e, t) {
                        void 0 === t && (t = !0)
                        for (var n = this, r = 0; r < e.length; r++) {
                            if ("" === e[r]) n = n.root
                            else if (".." === e[r]) n = n.parent
                            else {
                                if ("." === e[r] || "" === e[r]) continue
                                if (n) {
                                    n = n.getChildNode(e[r])
                                    continue
                                }
                            }
                            if (!n)
                                return t
                                    ? y.fail(
                                          "Could not resolve '" +
                                              e[r] +
                                              "' in '" +
                                              f.joinJsonPath(e.slice(0, r - 1)) +
                                              "', path of the patch does not resolve"
                                      )
                                    : void 0
                        }
                        return n
                    }), Object.defineProperty(e.prototype, "value", {
                        get: function() {
                            if (this._isAlive) return this.type.getValue(this)
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(e.prototype, "isAlive", {
                        get: function() {
                            return this._isAlive
                        },
                        enumerable: !0,
                        configurable: !0
                    }), (e.prototype.die = function() {
                        this._isDetaching ||
                            (r(this.storedValue) &&
                                (
                                    d.walk(this.storedValue, function(e) {
                                        return o(e).aboutToDie()
                                    }),
                                    d.walk(this.storedValue, function(e) {
                                        return o(e).finalizeDeath()
                                    })
                                ))
                    }), (e.prototype.aboutToDie = function() {
                        this.disposers.splice(0).forEach(function(e) {
                            return e()
                        }), this.fireHook("beforeDestroy")
                    }), (e.prototype.finalizeDeath = function() {
                        this.root.identifierCache.notifyDied(this)
                        var e = this,
                            t = this.path
                        y.addReadOnlyProp(this, "snapshot", this.snapshot), this.patchSubscribers.splice(
                            0
                        ), this.snapshotSubscribers.splice(0), this.patchSubscribers.splice(
                            0
                        ), (this._isAlive = !1), (this._parent = null), (this.subpath = ""), Object.defineProperty(
                            this.storedValue,
                            "$mobx",
                            {
                                get: function() {
                                    y.fail(
                                        "This object has died and is no longer part of a state tree. It cannot be used anymore. The object (of type '" +
                                            e.type.name +
                                            "') used to live at '" +
                                            t +
                                            "'. It is possible to access the last snapshot of this object using 'getSnapshot', or to create a fresh copy using 'clone'. If you want to remove an object from the tree without killing it, use 'detach' instead."
                                    )
                                }
                            }
                        )
                    }), (e.prototype.assertAlive = function() {
                        this._isAlive ||
                            y.fail(
                                this +
                                    " cannot be used anymore as it has died; it has been removed from a state tree. If you want to remove an element from a tree and let it live on, use 'detach' or 'clone' the value"
                            )
                    }), Object.defineProperty(e.prototype, "snapshot", {
                        get: function() {
                            if (this._isAlive) return y.freeze(this.type.getSnapshot(this))
                        },
                        enumerable: !0,
                        configurable: !0
                    }), (e.prototype.onSnapshot = function(e) {
                        return y.registerEventHandler(this.snapshotSubscribers, e)
                    }), (e.prototype.applySnapshot = function(e) {
                        return h.typecheck(this.type, e), this.type.applySnapshot(this, e)
                    }), (e.prototype.emitSnapshot = function(e) {
                        this.snapshotSubscribers.forEach(function(t) {
                            return t(e)
                        })
                    }), (e.prototype.applyPatch = function(e) {
                        var t = f.splitJsonPath(e.path),
                            n = this.resolvePath(t.slice(0, -1))
                        n.pseudoAction(function() {
                            n.applyPatchLocally(t[t.length - 1], e)
                        })
                    }), (e.prototype.applyPatchLocally = function(e, t) {
                        this.assertWritable(), this.type.applyPatchLocally(this, e, t)
                    }), (e.prototype.onPatch = function(e) {
                        return y.registerEventHandler(this.patchSubscribers, e)
                    }), (e.prototype.emitPatch = function(e, t) {
                        if (this.patchSubscribers.length) {
                            var n = y.extend({}, e, { path: t.path.substr(this.path.length) + "/" + e.path })
                            this.patchSubscribers.forEach(function(e) {
                                return e(n)
                            })
                        }
                        this.parent && this.parent.emitPatch(e, t)
                    }), (e.prototype.setParent = function(e, t) {
                        void 0 === t && (t = null), (this.parent === e && this.subpath === t) ||
                            (
                                this._parent &&
                                    e &&
                                    e !== this._parent &&
                                    y.fail(
                                        "A node cannot exists twice in the state tree. Failed to add " +
                                            this +
                                            " to path '" +
                                            e.path +
                                            "/" +
                                            t +
                                            "'."
                                    ),
                                !this._parent &&
                                    e &&
                                    e.root === this &&
                                    y.fail(
                                        "A state tree is not allowed to contain itself. Cannot assign " +
                                            this +
                                            " to path '" +
                                            e.path +
                                            "/" +
                                            t +
                                            "'"
                                    ),
                                !this._parent &&
                                    this._environment &&
                                    y.fail(
                                        "A state tree that has been initialized with an environment cannot be made part of another state tree."
                                    ),
                                this.parent && !e
                                    ? this.die()
                                    : (
                                          (this.subpath = t || ""),
                                          e &&
                                              e !== this._parent &&
                                              (
                                                  e.root.identifierCache.mergeCache(this),
                                                  (this._parent = e),
                                                  this.fireHook("afterAttach")
                                              )
                                      )
                            )
                    }), (e.prototype.addDisposer = function(e) {
                        this.disposers.unshift(e)
                    }), (e.prototype.reconcileChildren = function(e, t, n, i, a) {
                        function s(e) {
                            for (var t in l) {
                                var n = e[t]
                                if (("string" == typeof n || "number" == typeof n) && l[t][n]) return l[t][n]
                            }
                            return null
                        }
                        var u = this,
                            p = new Array(i.length),
                            c = {},
                            l = {}
                        n.forEach(function(e) {
                            e.identifierAttribute &&
                                ((l[e.identifierAttribute] || (l[e.identifierAttribute] = {}))[
                                    e.identifier
                                ] = e), (c[e.nodeId] = e)
                        }), i.forEach(function(n, i) {
                            var l = "" + a[i]
                            if (r(n)) {
                                var f = o(n)
                                f.assertAlive(), f.parent === e
                                    ? (
                                          c[f.nodeId] ||
                                              y.fail(
                                                  "Cannot add an object to a state tree if it is already part of the same or another state tree. Tried to assign an object to '" +
                                                      e.path +
                                                      "/" +
                                                      l +
                                                      "', but it lives already at '" +
                                                      f.path +
                                                      "'"
                                              ),
                                          (c[f.nodeId] = void 0),
                                          f.setParent(e, l),
                                          (p[i] = f)
                                      )
                                    : (p[i] = t.instantiate(u, l, void 0, n))
                            } else if (y.isMutable(n)) {
                                var h = s(n)
                                if (h) {
                                    var f = t.reconcile(h, n)
                                    ;(c[h.nodeId] = void 0), f.setParent(u, l), (p[i] = f)
                                } else p[i] = t.instantiate(u, l, void 0, n)
                            } else p[i] = t.instantiate(u, l, void 0, n)
                        })
                        for (var f in c) void 0 !== c[f] && c[f].die()
                        return p
                    }), (e.prototype.isRunningAction = function() {
                        return !!this._isRunningAction || (!this.isRoot && this.parent.isRunningAction())
                    }), (e.prototype.addMiddleWare = function(e) {
                        return y.registerEventHandler(this.middlewares, e)
                    }), (e.prototype.getChildNode = function(e) {
                        this.assertAlive(), (this._autoUnbox = !1)
                        var t = this.type.getChildNode(this, e)
                        return (this._autoUnbox = !0), t
                    }), (e.prototype.getChildren = function() {
                        this.assertAlive(), (this._autoUnbox = !1)
                        var e = this.type.getChildren(this)
                        return (this._autoUnbox = !0), e
                    }), (e.prototype.getChildType = function(e) {
                        return this.type.getChildType(e)
                    }), Object.defineProperty(e.prototype, "isProtected", {
                        get: function() {
                            for (var e = this; e; ) {
                                if (e.isProtectionEnabled === !1) return !1
                                e = e.parent
                            }
                            return !0
                        },
                        enumerable: !0,
                        configurable: !0
                    }), (e.prototype.pseudoAction = function(e) {
                        var t = this._isRunningAction
                        ;(this._isRunningAction = !0), e(), (this._isRunningAction = t)
                    }), (e.prototype.assertWritable = function() {
                        this.assertAlive(), !this.isRunningAction() &&
                            this.isProtected &&
                            y.fail(
                                "Cannot modify '" +
                                    this +
                                    "', the object is protected and can only be modified by using an action."
                            )
                    }), (e.prototype.removeChild = function(e) {
                        this.type.removeChild(this, e)
                    }), (e.prototype.detach = function() {
                        this._isAlive || y.fail("Error while detaching, node is not alive."), this.isRoot ||
                            (
                                this.fireHook("beforeDetach"),
                                (this._environment = this.root._environment),
                                (this._isDetaching = !0),
                                (this.identifierCache = this.root.identifierCache.splitCache(this)),
                                this.parent.removeChild(this.subpath),
                                (this._parent = null),
                                (this.subpath = ""),
                                (this._isDetaching = !1)
                            )
                    }), (e.prototype.unbox = function(e) {
                        return e && this._autoUnbox === !0 ? e.value : e
                    }), (e.prototype.fireHook = function(e) {
                        var t = this.storedValue && "object" == typeof this.storedValue && this.storedValue[e]
                        "function" == typeof t && t.apply(this.storedValue)
                    }), (e.prototype.toString = function() {
                        var e = this.identifier ? "(id: " + this.identifier + ")" : ""
                        return this.type.name + "@" + (this.path || "<root>") + e + (this.isAlive ? "" : "[dead]")
                    }), e
                })()
            u([p.observable], l.prototype, "_parent", void 0), u([p.observable], l.prototype, "subpath", void 0), u(
                [p.computed],
                l.prototype,
                "path",
                null
            ), u([p.computed], l.prototype, "value", null), u([p.computed], l.prototype, "snapshot", null), u(
                [p.action],
                l.prototype,
                "applyPatch",
                null
            ), (t.Node = l), (t.isStateTreeNode = r), (t.getStateTreeNode = o), (t.createNode = s)
            var f = n(8),
                h = n(3),
                d = n(6),
                y = n(1),
                v = n(16)
        },
        function(e, t) {
            "use strict"
            function n(e) {
                return e.replace(/~/g, "~1").replace(/\//g, "~0")
            }
            function r(e) {
                return e.replace(/~0/g, "\\").replace(/~1/g, "~")
            }
            function o(e) {
                return 0 === e.length ? "" : "/" + e.map(n).join("/")
            }
            function i(e) {
                var t = e.split("/").map(r)
                return "" === t[0] ? t.slice(1) : t
            }
            Object.defineProperty(t, "__esModule", {
                value: !0
            }), (t.escapeJsonPath = n), (t.unescapeJsonPath = r), (t.joinJsonPath = o), (t.splitJsonPath = i)
        },
        function(e, t, n) {
            "use strict"
            function r(e) {
                switch (typeof e) {
                    case "string":
                        return t.string
                    case "number":
                        return t.number
                    case "boolean":
                        return t.boolean
                    case "object":
                        if (e instanceof Date) return t.DatePrimitive
                }
                return u.fail("Cannot determine primtive type from value " + e)
            }
            function o(e) {
                return (
                    (e.flags & (a.TypeFlags.String | a.TypeFlags.Number | a.TypeFlags.Boolean | a.TypeFlags.Date)) > 0
                )
            }
            var i =
                (this && this.__extends) ||
                (function() {
                    var e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function(e, t) {
                                e.__proto__ = t
                            }) ||
                        function(e, t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }
                    return function(t, n) {
                        function r() {
                            this.constructor = t
                        }
                        e(t, n), (t.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
                    }
                })()
            Object.defineProperty(t, "__esModule", { value: !0 })
            var a = n(4),
                s = n(3),
                u = n(1),
                p = n(2),
                c = (function(e) {
                    function t(t, n, r) {
                        var o = e.call(this, t) || this
                        return (o.flags = n), (o.checker = r), o
                    }
                    return i(t, e), (t.prototype.describe = function() {
                        return this.name
                    }), (t.prototype.instantiate = function(e, t, n, r) {
                        return p.createNode(this, e, t, n, r)
                    }), (t.prototype.isValidSnapshot = function(e, t) {
                        return u.isPrimitive(e) && this.checker(e) ? s.typeCheckSuccess() : s.typeCheckFailure(t, e)
                    }), t
                })(a.Type)
            ;(t.CoreType = c), (t.string = new c("string", a.TypeFlags.String, function(e) {
                return "string" == typeof e
            })), (t.number = new c("number", a.TypeFlags.Number, function(e) {
                return "number" == typeof e
            })), (t.boolean = new c("boolean", a.TypeFlags.Boolean, function(e) {
                return "boolean" == typeof e
            })), (t.DatePrimitive = new c("Date", a.TypeFlags.Date, function(e) {
                return e instanceof Date
            })), (t.DatePrimitive.getSnapshot = function(e) {
                return e.storedValue.getTime()
            }), (t.getPrimitiveFactoryFromValue = r), (t.isPrimitiveType = o)
        },
        function(e, t) {
            "use strict"
            Object.defineProperty(t, "__esModule", { value: !0 })
            var n = (function() {
                function e(e) {
                    this.name = e
                }
                return (e.prototype.initializePrototype = function(e) {}), (e.prototype.initialize = function(
                    e,
                    t
                ) {}), (e.prototype.willChange = function(e) {
                    return null
                }), (e.prototype.didChange = function(e) {}), (e.prototype.serialize = function(
                    e,
                    t
                ) {}), (e.prototype.deserialize = function(e, t) {}), e
            })()
            t.Property = n
        },
        function(e, t, n) {
            "use strict"
            function r(e, t) {
                var n = "function" == typeof t ? t() : t,
                    r = s.isStateTreeNode(n) ? s.getStateTreeNode(n).snapshot : n
                return a.typecheck(e, r), new u(e, t)
            }
            var o =
                (this && this.__extends) ||
                (function() {
                    var e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function(e, t) {
                                e.__proto__ = t
                            }) ||
                        function(e, t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }
                    return function(t, n) {
                        function r() {
                            this.constructor = t
                        }
                        e(t, n), (t.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
                    }
                })()
            Object.defineProperty(t, "__esModule", { value: !0 })
            var i = n(4),
                a = n(3),
                s = n(2),
                u = (function(e) {
                    function t(t, n) {
                        var r = e.call(this, t.name) || this
                        return (r.type = t), (r.defaultValue = n), r
                    }
                    return o(t, e), Object.defineProperty(t.prototype, "flags", {
                        get: function() {
                            return this.type.flags | i.TypeFlags.Optional
                        },
                        enumerable: !0,
                        configurable: !0
                    }), (t.prototype.describe = function() {
                        return this.type.describe() + "?"
                    }), (t.prototype.instantiate = function(e, t, n, r) {
                        if ("undefined" == typeof r) {
                            var o = this.getDefaultValue(),
                                i = s.isStateTreeNode(o) ? s.getStateTreeNode(o).snapshot : o
                            return this.type.instantiate(e, t, n, i)
                        }
                        return this.type.instantiate(e, t, n, r)
                    }), (t.prototype.reconcile = function(e, t) {
                        return this.type.reconcile(e, this.type.is(t) ? t : this.getDefaultValue())
                    }), (t.prototype.getDefaultValue = function() {
                        var e = "function" == typeof this.defaultValue ? this.defaultValue() : this.defaultValue
                        return "function" == typeof this.defaultValue && a.typecheck(this, e), e
                    }), (t.prototype.isValidSnapshot = function(e, t) {
                        return void 0 === e || this.type.is(e) ? a.typeCheckSuccess() : a.typeCheckFailure(t, e)
                    }), t
                })(i.Type)
            ;(t.OptionalValue = u), (t.optional = r)
        },
        function(e, t, n) {
            "use strict"
            function r(e) {
                return e.object[e.name].apply(e.object, e.args)
            }
            function o(e) {
                for (var t = e.middlewares.slice(), n = e; n.parent; ) (n = n.parent), (t = t.concat(n.middlewares))
                return t
            }
            function i(e, t) {
                function n(e) {
                    var t = i.shift()
                    return t ? t(e, n) : r(e)
                }
                var i = o(e)
                return i.length ? n(t) : r(t)
            }
            function a(e, t) {
                var n = l.action(e, t),
                    r = function() {
                        var t = f.getStateTreeNode(this)
                        if ((t.assertAlive(), t.isRunningAction())) return n.apply(this, arguments)
                        var r = { name: e, object: t.storedValue, args: d.argsToArray(arguments) },
                            o = t.root
                        o._isRunningAction = !0
                        try {
                            return i(t, r)
                        } finally {
                            o._isRunningAction = !1
                        }
                    }
                return d.createNamedFunction(e, r)
            }
            function s(e, t, n, r) {
                if (d.isPrimitive(r)) return r
                if (f.isStateTreeNode(r)) {
                    var o = f.getStateTreeNode(r)
                    if (e.root !== o.root)
                        throw new Error(
                            "Argument " +
                                n +
                                " that was passed to action '" +
                                t +
                                "' is a model that is not part of the same state tree. Consider passing a snapshot or some representative ID instead"
                        )
                    return { $ref: e.getRelativePathTo(f.getStateTreeNode(r)) }
                }
                if ("function" == typeof r)
                    throw new Error(
                        "Argument " +
                            n +
                            " that was passed to action '" +
                            t +
                            "' should be a primitive, model object or plain object, received a function"
                    )
                if ("object" == typeof r && !d.isPlainObject(r) && !Array.isArray(r))
                    throw new Error(
                        "Argument " +
                            n +
                            " that was passed to action '" +
                            t +
                            "' should be a primitive, model object or plain object, received a " +
                            (r && r.constructor ? r.constructor.name : "Complex Object")
                    )
                if (l.isObservable(r))
                    throw new Error(
                        "Argument " +
                            n +
                            " that was passed to action '" +
                            t +
                            "' should be a primitive, model object or plain object, received an mobx observable."
                    )
                try {
                    return JSON.stringify(r), r
                } catch (e) {
                    throw new Error("Argument " + n + " that was passed to action '" + t + "' is not serializable.")
                }
            }
            function u(e, t) {
                if ("object" == typeof t) {
                    var n = Object.keys(t)
                    if (1 === n.length && "$ref" === n[0]) return h.resolvePath(e.storedValue, t.$ref)
                }
                return t
            }
            function p(e, t) {
                var n = h.tryResolve(e, t.path || "")
                if (!n) return d.fail("Invalid action path: " + (t.path || ""))
                var r = f.getStateTreeNode(n)
                return "function" != typeof n[t.name] &&
                    d.fail("Action '" + t.name + "' does not exist in '" + r.path + "'"), n[t.name].apply(
                    n,
                    t.args
                        ? t.args.map(function(e) {
                              return u(r, e)
                          })
                        : []
                )
            }
            function c(e, t) {
                return h.addMiddleware(e, function(n, r) {
                    var o = f.getStateTreeNode(n.object)
                    return t({
                        name: n.name,
                        path: f.getStateTreeNode(e).getRelativePathTo(o),
                        args: n.args.map(function(e, t) {
                            return s(o, n.name, t, e)
                        })
                    }), r(n)
                })
            }
            Object.defineProperty(t, "__esModule", { value: !0 })
            var l = n(5)
            ;(t.createActionInvoker = a), (t.applyAction = p), (t.onAction = c)
            var f = n(7),
                h = n(6),
                d = n(1)
        },
        function(e, t, n) {
            "use strict"
            function r(e) {
                return a.isPrimitive(e) || a.fail("Literal types can be built only on top of primitives"), new p(e)
            }
            var o =
                (this && this.__extends) ||
                (function() {
                    var e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function(e, t) {
                                e.__proto__ = t
                            }) ||
                        function(e, t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }
                    return function(t, n) {
                        function r() {
                            this.constructor = t
                        }
                        e(t, n), (t.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
                    }
                })()
            Object.defineProperty(t, "__esModule", { value: !0 })
            var i = n(4),
                a = n(1),
                s = n(3),
                u = n(2),
                p = (function(e) {
                    function t(t) {
                        var n = e.call(this, "" + t) || this
                        return (n.flags = i.TypeFlags.Literal), (n.value = t), n
                    }
                    return o(t, e), (t.prototype.instantiate = function(e, t, n, r) {
                        return u.createNode(this, e, t, n, r)
                    }), (t.prototype.describe = function() {
                        return JSON.stringify(this.value)
                    }), (t.prototype.isValidSnapshot = function(e, t) {
                        return a.isPrimitive(e) && e === this.value ? s.typeCheckSuccess() : s.typeCheckFailure(t, e)
                    }), t
                })(i.Type)
            ;(t.Literal = p), (t.literal = r)
        },
        function(e, t, n) {
            "use strict"
            function r(e, t) {
                var n = "string" == typeof e ? e : "<late>",
                    r = "string" == typeof e ? t : e
                return new s(n, r)
            }
            var o =
                (this && this.__extends) ||
                (function() {
                    var e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function(e, t) {
                                e.__proto__ = t
                            }) ||
                        function(e, t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }
                    return function(t, n) {
                        function r() {
                            this.constructor = t
                        }
                        e(t, n), (t.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
                    }
                })()
            Object.defineProperty(t, "__esModule", { value: !0 })
            var i = n(1),
                a = n(4),
                s = (function(e) {
                    function t(t, n) {
                        var r = e.call(this, t) || this
                        return (r._subType = null), ("function" == typeof n && 0 === n.length) ||
                            i.fail(
                                "Invalid late type, expected a function with zero arguments that returns a type, got: " +
                                    n
                            ), (r.definition = n), r
                    }
                    return o(t, e), Object.defineProperty(t.prototype, "flags", {
                        get: function() {
                            return this.subType.flags
                        },
                        enumerable: !0,
                        configurable: !0
                    }), Object.defineProperty(t.prototype, "subType", {
                        get: function() {
                            return null === this._subType && (this._subType = this.definition()), this._subType
                        },
                        enumerable: !0,
                        configurable: !0
                    }), (t.prototype.instantiate = function(e, t, n, r) {
                        return this.subType.instantiate(e, t, n, r)
                    }), (t.prototype.reconcile = function(e, t) {
                        return this.subType.reconcile(e, t)
                    }), (t.prototype.describe = function() {
                        return this.subType.name
                    }), (t.prototype.isValidSnapshot = function(e, t) {
                        return this.subType.validate(e, t)
                    }), (t.prototype.isAssignableFrom = function(e) {
                        return this.subType.isAssignableFrom(e)
                    }), t
                })(a.Type)
            ;(t.Late = s), (t.late = r)
        },
        function(e, t, n) {
            "use strict"
            function r(e) {
                for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n]
                var r = i.isType(e) ? null : e,
                    o = i.isType(e) ? t.concat(e) : t,
                    a = o
                        .map(function(e) {
                            return e.name
                        })
                        .join(" | ")
                return new u(a, o, r)
            }
            var o =
                (this && this.__extends) ||
                (function() {
                    var e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function(e, t) {
                                e.__proto__ = t
                            }) ||
                        function(e, t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }
                    return function(t, n) {
                        function r() {
                            this.constructor = t
                        }
                        e(t, n), (t.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
                    }
                })()
            Object.defineProperty(t, "__esModule", { value: !0 })
            var i = n(4),
                a = n(3),
                s = n(1),
                u = (function(e) {
                    function t(t, n, r) {
                        var o = e.call(this, t) || this
                        return (o.dispatcher = null), (o.dispatcher = r), (o.types = n), o
                    }
                    return o(t, e), Object.defineProperty(t.prototype, "flags", {
                        get: function() {
                            var e = 0
                            return this.types.forEach(function(t) {
                                e |= t.flags
                            }), e
                        },
                        enumerable: !0,
                        configurable: !0
                    }), (t.prototype.isAssignableFrom = function(e) {
                        return this.types.some(function(t) {
                            return t.isAssignableFrom(e)
                        })
                    }), (t.prototype.describe = function() {
                        return (
                            "(" +
                            this.types
                                .map(function(e) {
                                    return e.describe()
                                })
                                .join(" | ") +
                            ")"
                        )
                    }), (t.prototype.instantiate = function(e, t, n, r) {
                        return this.determineType(r).instantiate(e, t, n, r)
                    }), (t.prototype.reconcile = function(e, t) {
                        return this.determineType(t).reconcile(e, t)
                    }), (t.prototype.determineType = function(e) {
                        if (null !== this.dispatcher) return this.dispatcher(e)
                        var t = this.types.filter(function(t) {
                            return t.is(e)
                        })
                        return t.length > 1
                            ? s.fail(
                                  "Ambiguos snapshot " +
                                      JSON.stringify(e) +
                                      " for union " +
                                      this.name +
                                      ". Please provide a dispatch in the union declaration."
                              )
                            : t[0]
                    }), (t.prototype.isValidSnapshot = function(e, t) {
                        if (null !== this.dispatcher) return this.dispatcher(e).validate(e, t)
                        var n = this.types.map(function(n) {
                            return n.validate(e, t)
                        }),
                            r = n.filter(function(e) {
                                return 0 === e.length
                            })
                        return r.length > 1
                            ? a.typeCheckFailure(
                                  t,
                                  e,
                                  "Multiple types are applicable and no dispatch method is defined for the union"
                              )
                            : r.length < 1
                              ? a
                                    .typeCheckFailure(
                                        t,
                                        e,
                                        "No type is applicable and no dispatch method is defined for the union"
                                    )
                                    .concat(a.flattenTypeErrors(n))
                              : a.typeCheckSuccess()
                    }), t
                })(i.Type)
            ;(t.Union = u), (t.union = r)
        },
        function(e, t, n) {
            "use strict"
            Object.defineProperty(t, "__esModule", { value: !0 })
            var r = n(1),
                o = n(5),
                i = (function() {
                    function e() {
                        this.cache = o.observable.map()
                    }
                    return (e.prototype.addNodeToCache = function(e) {
                        if (e.identifierAttribute) {
                            var t = e.identifier
                            this.cache.has(t) || this.cache.set(t, o.observable.shallowArray())
                            var n = this.cache.get(t)
                            n.indexOf(e) !== -1 && r.fail("Already registered"), n.push(e)
                        }
                        return this
                    }), (e.prototype.mergeCache = function(e) {
                        var t = this
                        e.identifierCache.cache.values().forEach(function(e) {
                            return e.forEach(function(e) {
                                t.addNodeToCache(e)
                            })
                        })
                    }), (e.prototype.notifyDied = function(e) {
                        if (e.identifierAttribute) {
                            var t = this.cache.get(e.identifier)
                            t && t.remove(e)
                        }
                    }), (e.prototype.splitCache = function(t) {
                        var n = new e(),
                            r = t.path
                        return this.cache.values().forEach(function(e) {
                            for (var t = e.length - 1; t >= 0; t--)
                                0 === e[t].path.indexOf(r) && (n.addNodeToCache(e[t]), e.splice(t, 1))
                        }), n
                    }), (e.prototype.resolve = function(e, t) {
                        var n = this.cache.get(t)
                        if (!n) return null
                        var o = n.filter(function(t) {
                            return e.isAssignableFrom(t.type)
                        })
                        switch (o.length) {
                            case 0:
                                return null
                            case 1:
                                return o[0]
                            default:
                                return r.fail(
                                    "Cannot resolve a reference to type '" +
                                        e.name +
                                        "' with id: '" +
                                        t +
                                        "' unambigously, there are multiple candidates: " +
                                        o
                                            .map(function(e) {
                                                return e.path
                                            })
                                            .join(", ")
                                )
                        }
                    }), e
                })()
            t.IdentifierCache = i
        },
        function(e, t, n) {
            "use strict"
            function r(e) {
                for (var t = [], n = 1; n < arguments.length; n++) t[n - 1] = arguments[n]
                s.isStateTreeNode(e) || c.fail("Expected model object")
                var r = {
                    getState: function() {
                        return u.getSnapshot(e)
                    },
                    dispatch: function(t) {
                        i(t, a.slice(), function(t) {
                            return p.applyAction(e, o(t))
                        })
                    },
                    subscribe: function(t) {
                        return u.onSnapshot(e, t)
                    }
                },
                    a = t.map(function(e) {
                        return e(r)
                    })
                return r
            }
            function o(e) {
                var t = c.extend({}, e)
                return delete t.type, { name: e.type, args: [t] }
            }
            function i(e, t, n) {
                function r(e) {
                    var o = t.shift()
                    o ? o(r)(e) : n(e)
                }
                r(e)
            }
            function a(e, t) {
                var n = e.connectViaExtension(),
                    r = !1
                n.subscribe(function(n) {
                    var o = e.extractState(n)
                    o && ((r = !0), u.applySnapshot(t, o), (r = !1))
                }), p.onAction(t, function(e) {
                    if (!r) {
                        var o = {}
                        ;(o.type = e.name), e.args &&
                            e.args.forEach(function(e, t) {
                                return (o[t] = e)
                            }), n.send(o, u.getSnapshot(t))
                    }
                })
            }
            Object.defineProperty(t, "__esModule", { value: !0 })
            var s = n(2),
                u = n(6),
                p = n(12),
                c = n(1)
            ;(t.asReduxStore = r), (t.connectReduxDevtools = a)
        },
        function(e, t, n) {
            "use strict"
            function r() {
                return p.getStateTreeNode(this) + "(" + this.length + " items)"
            }
            function o(e) {
                return new h(e.name + "[]", e)
            }
            function i(e) {
                return l.isType(e) && (e.flags & l.TypeFlags.Array) > 0
            }
            var a =
                (this && this.__extends) ||
                (function() {
                    var e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function(e, t) {
                                e.__proto__ = t
                            }) ||
                        function(e, t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }
                    return function(t, n) {
                        function r() {
                            this.constructor = t
                        }
                        e(t, n), (t.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
                    }
                })(),
                s =
                    (this && this.__decorate) ||
                    function(e, t, n, r) {
                        var o,
                            i = arguments.length,
                            a = i < 3 ? t : null === r ? (r = Object.getOwnPropertyDescriptor(t, n)) : r
                        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                            a = Reflect.decorate(e, t, n, r)
                        else
                            for (var s = e.length - 1; s >= 0; s--)
                                (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a)
                        return i > 3 && a && Object.defineProperty(t, n, a), a
                    }
            Object.defineProperty(t, "__esModule", { value: !0 })
            var u = n(5),
                p = n(2),
                c = n(1),
                l = n(4),
                f = n(3)
            t.arrayToString = r
            var h = (function(e) {
                function t(t, n) {
                    var o = e.call(this, t) || this
                    return (o.shouldAttachNode = !0), (o.flags = l.TypeFlags.Array), (o.createNewInstance = function() {
                        var e = u.observable.shallowArray()
                        return c.addHiddenFinalProp(e, "toString", r), e
                    }), (o.finalizeNewInstance = function(e, t) {
                        var n = e.storedValue
                        ;(u.extras.getAdministration(n).dehancer = e.unbox), u.intercept(n, function(e) {
                            return o.willChange(e)
                        }), u.observe(n, o.didChange), e.applySnapshot(t)
                    }), (o.subType = n), o
                }
                return a(t, e), (t.prototype.describe = function() {
                    return this.subType.describe() + "[]"
                }), (t.prototype.instantiate = function(e, t, n, r) {
                    return p.createNode(this, e, t, n, r, this.createNewInstance, this.finalizeNewInstance)
                }), (t.prototype.getChildren = function(e) {
                    return e.storedValue.peek()
                }), (t.prototype.getChildNode = function(e, t) {
                    var n = parseInt(t, 10)
                    return n < e.storedValue.length ? e.storedValue[n] : c.fail("Not a child: " + t)
                }), (t.prototype.willChange = function(e) {
                    var t = p.getStateTreeNode(e.object)
                    t.assertWritable()
                    var n = t.getChildren()
                    switch (e.type) {
                        case "update":
                            if (e.newValue === e.object[e.index]) return null
                            e.newValue = t.reconcileChildren(t, this.subType, [n[e.index]], [e.newValue], [e.index])[0]
                            break
                        case "splice":
                            var r = e.index,
                                o = e.removedCount,
                                i = e.added
                            e.added = t.reconcileChildren(
                                t,
                                this.subType,
                                n.slice(r, r + o),
                                i,
                                i.map(function(e, t) {
                                    return r + t
                                })
                            )
                            for (var a = r + o; a < n.length; a++) n[a].setParent(t, "" + (a + i.length - o))
                    }
                    return e
                }), (t.prototype.getValue = function(e) {
                    return e.storedValue
                }), (t.prototype.getSnapshot = function(e) {
                    return e.getChildren().map(function(e) {
                        return e.snapshot
                    })
                }), (t.prototype.didChange = function(e) {
                    var t = p.getStateTreeNode(e.object)
                    switch (e.type) {
                        case "update":
                            return void t.emitPatch(
                                { op: "replace", path: "" + e.index, value: t.getChildNode("" + e.index).snapshot },
                                t
                            )
                        case "splice":
                            for (var n = e.index + e.removedCount - 1; n >= e.index; n--)
                                t.emitPatch({ op: "remove", path: "" + n }, t)
                            for (var n = 0; n < e.addedCount; n++)
                                t.emitPatch(
                                    {
                                        op: "add",
                                        path: "" + (e.index + n),
                                        value: t.getChildNode("" + (e.index + n)).snapshot
                                    },
                                    t
                                )
                            return
                    }
                }), (t.prototype.applyPatchLocally = function(e, t, n) {
                    var r = e.storedValue,
                        o = "-" === t ? r.length : parseInt(t)
                    switch (n.op) {
                        case "replace":
                            r[o] = n.value
                            break
                        case "add":
                            r.splice(o, 0, n.value)
                            break
                        case "remove":
                            r.splice(o, 1)
                    }
                }), (t.prototype.applySnapshot = function(e, t) {
                    e.pseudoAction(function() {
                        var n = e.storedValue
                        n.replace(t)
                    })
                }), (t.prototype.getChildType = function(e) {
                    return this.subType
                }), (t.prototype.isValidSnapshot = function(e, t) {
                    var n = this
                    return Array.isArray(e)
                        ? f.flattenTypeErrors(
                              e.map(function(e, r) {
                                  return n.subType.validate(e, f.getContextForPath(t, "" + r, n.subType))
                              })
                          )
                        : f.typeCheckFailure(t, e)
                }), (t.prototype.getDefaultSnapshot = function() {
                    return []
                }), (t.prototype.removeChild = function(e, t) {
                    e.storedValue.splice(parseInt(t, 10), 1)
                }), t
            })(l.ComplexType)
            s([u.action], h.prototype, "applySnapshot", null), (t.ArrayType = h), (t.array = o), (t.isArrayFactory = i)
        },
        function(e, t, n) {
            "use strict"
            function r() {
                return c.getStateTreeNode(this) + "(" + this.size + " items)"
            }
            function o(e) {
                e || l.fail("Map.put cannot be used to set empty values")
                var t
                if (c.isStateTreeNode(e)) t = c.getStateTreeNode(e)
                else {
                    if (!l.isMutable(e)) return l.fail("Map.put can only be used to store complex values")
                    var n = c.getStateTreeNode(this).type.subType
                    t = c.getStateTreeNode(n.create(e))
                }
                return t.identifierAttribute ||
                    l.fail(
                        "Map.put can only be used to store complex values that have an identifier type attribute"
                    ), this.set(t.identifier, t.value), this
            }
            function i(e) {
                return new d("map<string, " + e.name + ">", e)
            }
            function a(e) {
                return f.isType(e) && (e.flags & f.TypeFlags.Map) > 0
            }
            var s =
                (this && this.__extends) ||
                (function() {
                    var e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function(e, t) {
                                e.__proto__ = t
                            }) ||
                        function(e, t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }
                    return function(t, n) {
                        function r() {
                            this.constructor = t
                        }
                        e(t, n), (t.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
                    }
                })(),
                u =
                    (this && this.__decorate) ||
                    function(e, t, n, r) {
                        var o,
                            i = arguments.length,
                            a = i < 3 ? t : null === r ? (r = Object.getOwnPropertyDescriptor(t, n)) : r
                        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                            a = Reflect.decorate(e, t, n, r)
                        else
                            for (var s = e.length - 1; s >= 0; s--)
                                (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a)
                        return i > 3 && a && Object.defineProperty(t, n, a), a
                    }
            Object.defineProperty(t, "__esModule", { value: !0 })
            var p = n(5),
                c = n(2),
                l = n(1),
                f = n(4),
                h = n(3)
            t.mapToString = r
            var d = (function(e) {
                function t(t, n) {
                    var i = e.call(this, t) || this
                    return (i.shouldAttachNode = !0), (i.flags = f.TypeFlags.Map), (i.createNewInstance = function() {
                        var e = p.observable.shallowMap()
                        return l.addHiddenFinalProp(e, "put", o), l.addHiddenFinalProp(e, "toString", r), e
                    }), (i.finalizeNewInstance = function(e, t) {
                        var n = e.storedValue
                        p.extras.interceptReads(n, e.unbox), p.intercept(n, function(e) {
                            return i.willChange(e)
                        }), p.observe(n, i.didChange), e.applySnapshot(t)
                    }), (i.subType = n), i
                }
                return s(t, e), (t.prototype.instantiate = function(e, t, n, r) {
                    return c.createNode(this, e, t, n, r, this.createNewInstance, this.finalizeNewInstance)
                }), (t.prototype.describe = function() {
                    return "Map<string, " + this.subType.describe() + ">"
                }), (t.prototype.getChildren = function(e) {
                    return e.storedValue.values()
                }), (t.prototype.getChildNode = function(e, t) {
                    var n = e.storedValue.get(t)
                    return n || l.fail("Not a child" + t), n
                }), (t.prototype.willChange = function(e) {
                    var t = c.getStateTreeNode(e.object)
                    switch ((t.assertWritable(), e.type)) {
                        case "update":
                            var n = e.newValue,
                                r = e.object.get(e.name)
                            if (n === r) return null
                            ;(e.newValue = this.subType.reconcile(
                                t.getChildNode(e.name),
                                e.newValue
                            )), this.verifyIdentifier(e.name, e.newValue)
                            break
                        case "add":
                            ;(e.newValue = this.subType.instantiate(
                                t,
                                e.name,
                                void 0,
                                e.newValue
                            )), this.verifyIdentifier(e.name, e.newValue)
                            break
                        case "delete":
                            t.getChildNode(e.name).die()
                    }
                    return e
                }), (t.prototype.verifyIdentifier = function(e, t) {
                    var n = t.identifier
                    null !== n &&
                        n !== e &&
                        l.fail(
                            "A map of objects containing an identifier should always store the object under their own identifier. Trying to store key '" +
                                n +
                                "', but expected: '" +
                                e +
                                "'"
                        )
                }), (t.prototype.getValue = function(e) {
                    return e.storedValue
                }), (t.prototype.getSnapshot = function(e) {
                    var t = {}
                    return e.getChildren().forEach(function(e) {
                        t[e.subpath] = e.snapshot
                    }), t
                }), (t.prototype.didChange = function(e) {
                    var t = c.getStateTreeNode(e.object)
                    switch (e.type) {
                        case "update":
                        case "add":
                            return void t.emitPatch(
                                {
                                    op: "add" === e.type ? "add" : "replace",
                                    path: c.escapeJsonPath(e.name),
                                    value: t.getChildNode(e.name).snapshot
                                },
                                t
                            )
                        case "delete":
                            return void t.emitPatch({ op: "remove", path: c.escapeJsonPath(e.name) }, t)
                    }
                }), (t.prototype.applyPatchLocally = function(e, t, n) {
                    var r = e.storedValue
                    switch (n.op) {
                        case "add":
                        case "replace":
                            r.set(t, n.value)
                            break
                        case "remove":
                            r.delete(t)
                    }
                }), (t.prototype.applySnapshot = function(e, t) {
                    e.pseudoAction(function() {
                        var n = e.storedValue,
                            r = {}
                        n.keys().forEach(function(e) {
                            r[e] = !1
                        }), Object.keys(t).forEach(function(e) {
                            n.set(e, t[e]), (r[e] = !0)
                        }), Object.keys(r).forEach(function(e) {
                            r[e] === !1 && n.delete(e)
                        })
                    })
                }), (t.prototype.getChildType = function(e) {
                    return this.subType
                }), (t.prototype.isValidSnapshot = function(e, t) {
                    var n = this
                    return l.isPlainObject(e)
                        ? h.flattenTypeErrors(
                              Object.keys(e).map(function(r) {
                                  return n.subType.validate(e[r], h.getContextForPath(t, r, n.subType))
                              })
                          )
                        : h.typeCheckFailure(t, e)
                }), (t.prototype.getDefaultSnapshot = function() {
                    return {}
                }), (t.prototype.removeChild = function(e, t) {
                    e.storedValue.delete(t)
                }), t
            })(f.ComplexType)
            u([p.action], d.prototype, "applySnapshot", null), (t.MapType = d), (t.map = i), (t.isMapFactory = a)
        },
        function(e, t, n) {
            "use strict"
            function r() {
                return d.getStateTreeNode(this).toString()
            }
            function o(e, t, n) {
                var r = "string" == typeof e ? e : "AnonymousModel",
                    o = "string" == typeof e ? t : e,
                    i = "string" == typeof e ? n : t
                return new T(r, o, i || {})
            }
            function i(e) {
                var t = h.isType(e) ? e : d.getType(e)
                return u(t) ? t.baseModel : {}
            }
            function a(e) {
                var t = h.isType(e) ? e : d.getType(e)
                return u(t) ? t.baseActions : {}
            }
            function s() {
                for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t]
                console.warn(
                    "[mobx-state-tree] `extend` is an experimental feature and it's behavior will probably change in the future"
                )
                var n = "string" == typeof e[0] ? e.slice(1) : e,
                    r = "string" == typeof e[0]
                        ? e[0]
                        : n
                              .map(function(e) {
                                  return e.name
                              })
                              .join("_"),
                    s = f.extendKeepGetter.apply(null, [{}].concat(n.map(i))),
                    u = f.extend.apply(null, [{}].concat(n.map(a)))
                return o(r, s, u)
            }
            function u(e) {
                return h.isType(e) && (e.flags & h.TypeFlags.Object) > 0
            }
            var p =
                (this && this.__extends) ||
                (function() {
                    var e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function(e, t) {
                                e.__proto__ = t
                            }) ||
                        function(e, t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }
                    return function(t, n) {
                        function r() {
                            this.constructor = t
                        }
                        e(t, n), (t.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
                    }
                })(),
                c =
                    (this && this.__decorate) ||
                    function(e, t, n, r) {
                        var o,
                            i = arguments.length,
                            a = i < 3 ? t : null === r ? (r = Object.getOwnPropertyDescriptor(t, n)) : r
                        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
                            a = Reflect.decorate(e, t, n, r)
                        else
                            for (var s = e.length - 1; s >= 0; s--)
                                (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a)
                        return i > 3 && a && Object.defineProperty(t, n, a), a
                    }
            Object.defineProperty(t, "__esModule", { value: !0 })
            var l = n(5),
                f = n(1),
                h = n(4),
                d = n(2),
                y = n(3),
                v = n(9),
                b = n(11),
                g = n(23),
                m = n(24),
                _ = n(22),
                P = n(25),
                T = (function(e) {
                    function t(t, n, o) {
                        var i = e.call(this, t) || this
                        return (i.shouldAttachNode = !0), (i.flags =
                            h.TypeFlags.Object), (i.props = {}), (i.createNewInstance = function() {
                            var e = new i.modelConstructor()
                            return l.extendShallowObservable(e, {}), e
                        }), (i.finalizeNewInstance = function(e, t) {
                            var n = e.storedValue
                            i.forAllProps(function(e) {
                                return e.initialize(n, t)
                            }), l.intercept(n, function(e) {
                                return i.willChange(e)
                            }), l.observe(n, i.didChange)
                        }), (i.didChange = function(e) {
                            i.props[e.name].didChange(e)
                        }), Object.freeze(n), Object.freeze(
                            o
                        ), (i.baseModel = n), (i.baseActions = o), /^\w[\w\d_]*$/.test(t) ||
                            f.fail("Typename should be a valid identifier: " + t), (i.modelConstructor = new Function(
                            "return function " + t + " (){}"
                        )()), (i.modelConstructor.prototype.toString = r), i.parseModelProps(), i.forAllProps(function(
                            e
                        ) {
                            return e.initializePrototype(i.modelConstructor.prototype)
                        }), i
                    }
                    return p(t, e), (t.prototype.instantiate = function(e, t, n, r) {
                        return d.createNode(this, e, t, n, r, this.createNewInstance, this.finalizeNewInstance)
                    }), (t.prototype.willChange = function(e) {
                        var t = d.getStateTreeNode(e.object)
                        return t.assertWritable(), this.props[e.name].willChange(e)
                    }), (t.prototype.parseModelProps = function() {
                        var e = this,
                            t = e.baseModel,
                            n = e.baseActions
                        for (var r in t)
                            if (f.hasOwnProperty(t, r)) {
                                var o = Object.getOwnPropertyDescriptor(t, r)
                                if ("get" in o) {
                                    this.props[r] = new g.ComputedProperty(r, o.get, o.set)
                                    continue
                                }
                                var i = o.value
                                if (null === i)
                                    f.fail(
                                        "The default value of an attribute cannot be null or undefined as the type cannot be inferred. Did you mean `types.maybe(someType)`?"
                                    )
                                else if (f.isPrimitive(i)) {
                                    var a = v.getPrimitiveFactoryFromValue(i)
                                    this.props[r] = new m.ValueProperty(r, b.optional(a, i))
                                } else
                                    h.isType(i)
                                        ? (this.props[r] = new m.ValueProperty(r, i))
                                        : "function" == typeof i
                                          ? (this.props[r] = new P.ViewProperty(r, i))
                                          : "object" == typeof i
                                            ? f.fail(
                                                  "In property '" +
                                                      r +
                                                      "': base model's should not contain complex values: '" +
                                                      i +
                                                      "'"
                                              )
                                            : f.fail("Unexpected value for property '" + r + "'")
                            }
                        for (var r in n)
                            if (f.hasOwnProperty(n, r)) {
                                var i = n[r]
                                r in this.baseModel &&
                                    f.fail(
                                        "Property '" +
                                            r +
                                            "' was also defined as action. Actions and properties should not collide"
                                    ), "function" == typeof i
                                    ? (this.props[r] = new _.ActionProperty(r, i))
                                    : f.fail(
                                          "Unexpected value for action '" + r + "'. Expected function, got " + typeof i
                                      )
                            }
                    }), (t.prototype.getChildren = function(e) {
                        var t = []
                        return this.forAllProps(function(n) {
                            n instanceof m.ValueProperty && t.push(n.getValueNode(e.storedValue))
                        }), t
                    }), (t.prototype.getChildNode = function(e, t) {
                        return this.props[t] instanceof m.ValueProperty
                            ? this.props[t].getValueNode(e.storedValue)
                            : f.fail("Not a value property: " + t)
                    }), (t.prototype.getValue = function(e) {
                        return e.storedValue
                    }), (t.prototype.getSnapshot = function(e) {
                        var t = {}
                        return this.forAllProps(function(n) {
                            return n.serialize(e.storedValue, t)
                        }), t
                    }), (t.prototype.applyPatchLocally = function(e, t, n) {
                        "replace" !== n.op &&
                            "add" !== n.op &&
                            f.fail("object does not support operation " + n.op), (e.storedValue[t] = n.value)
                    }), (t.prototype.applySnapshot = function(e, t) {
                        var n = this
                        e.pseudoAction(function() {
                            for (var r in n.props) n.props[r].deserialize(e.storedValue, t)
                        })
                    }), (t.prototype.getChildType = function(e) {
                        return this.props[e].type
                    }), (t.prototype.isValidSnapshot = function(e, t) {
                        var n = this
                        return f.isPlainObject(e)
                            ? y.flattenTypeErrors(
                                  Object.keys(this.props).map(function(r) {
                                      return n.props[r].validate(e, t)
                                  })
                              )
                            : y.typeCheckFailure(t, e)
                    }), (t.prototype.forAllProps = function(e) {
                        var t = this
                        Object.keys(this.props).forEach(function(n) {
                            return e(t.props[n])
                        })
                    }), (t.prototype.describe = function() {
                        var e = this
                        return (
                            "{ " +
                            Object.keys(this.props)
                                .map(function(t) {
                                    var n = e.props[t]
                                    return n instanceof m.ValueProperty ? t + ": " + n.type.describe() : ""
                                })
                                .filter(Boolean)
                                .join("; ") +
                            " }"
                        )
                    }), (t.prototype.getDefaultSnapshot = function() {
                        return {}
                    }), (t.prototype.removeChild = function(e, t) {
                        e.storedValue[t] = null
                    }), t
                })(h.ComplexType)
            c(
                [l.action],
                T.prototype,
                "applySnapshot",
                null
            ), (t.ObjectType = T), (t.model = o), (t.extend = s), (t.isObjectFactory = u)
        },
        function(e, t, n) {
            "use strict"
            Object.defineProperty(t, "__esModule", { value: !0 })
            var r = n(19),
                o = n(18),
                i = n(27),
                a = n(20),
                s = n(29),
                u = n(15),
                p = n(11),
                c = n(13),
                l = n(28),
                f = n(30),
                h = n(26),
                d = n(9),
                y = n(14)
            t.types = {
                model: a.model,
                extend: a.extend,
                reference: s.reference,
                union: u.union,
                optional: p.optional,
                literal: c.literal,
                maybe: l.maybe,
                refinement: f.refinement,
                string: d.string,
                boolean: d.boolean,
                number: d.number,
                Date: d.DatePrimitive,
                map: r.map,
                array: o.array,
                frozen: h.frozen,
                identifier: i.identifier,
                late: y.late
            }
        },
        function(e, t, n) {
            "use strict"
            var r =
                (this && this.__extends) ||
                (function() {
                    var e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function(e, t) {
                                e.__proto__ = t
                            }) ||
                        function(e, t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }
                    return function(t, n) {
                        function r() {
                            this.constructor = t
                        }
                        e(t, n), (t.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
                    }
                })()
            Object.defineProperty(t, "__esModule", { value: !0 })
            var o = n(1),
                i = n(2),
                a = n(10),
                s = n(3),
                u = (function(e) {
                    function t(t, n) {
                        var r = e.call(this, t) || this
                        return (r.invokeAction = i.createActionInvoker(t, n)), r
                    }
                    return r(t, e), (t.prototype.initialize = function(e) {
                        o.addHiddenFinalProp(e, this.name, this.invokeAction.bind(e))
                    }), (t.prototype.validate = function(e, t) {
                        return this.name in e
                            ? s.typeCheckFailure(
                                  s.getContextForPath(t, this.name),
                                  e[this.name],
                                  "Action properties should not be provided in the snapshot"
                              )
                            : s.typeCheckSuccess()
                    }), t
                })(a.Property)
            t.ActionProperty = u
        },
        function(e, t, n) {
            "use strict"
            var r =
                (this && this.__extends) ||
                (function() {
                    var e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function(e, t) {
                                e.__proto__ = t
                            }) ||
                        function(e, t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }
                    return function(t, n) {
                        function r() {
                            this.constructor = t
                        }
                        e(t, n), (t.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
                    }
                })()
            Object.defineProperty(t, "__esModule", { value: !0 })
            var o = n(5),
                i = n(10),
                a = n(3),
                s = (function(e) {
                    function t(t, n, r) {
                        var o = e.call(this, t) || this
                        return (o.getter = n), (o.setter = r), o
                    }
                    return r(t, e), (t.prototype.initializePrototype = function(e) {
                        Object.defineProperty(
                            e,
                            this.name,
                            o.computed(e, this.name, {
                                get: this.getter,
                                set: this.setter,
                                configurable: !0,
                                enumerable: !1
                            })
                        )
                    }), (t.prototype.validate = function(e, t) {
                        return this.name in e
                            ? a.typeCheckFailure(
                                  a.getContextForPath(t, this.name),
                                  e[this.name],
                                  "Computed properties should not be provided in the snapshot"
                              )
                            : a.typeCheckSuccess()
                    }), t
                })(i.Property)
            t.ComputedProperty = s
        },
        function(e, t, n) {
            "use strict"
            var r =
                (this && this.__extends) ||
                (function() {
                    var e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function(e, t) {
                                e.__proto__ = t
                            }) ||
                        function(e, t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }
                    return function(t, n) {
                        function r() {
                            this.constructor = t
                        }
                        e(t, n), (t.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
                    }
                })()
            Object.defineProperty(t, "__esModule", { value: !0 })
            var o = n(5),
                i = n(10),
                a = n(2),
                s = n(3),
                u = n(1),
                p = n(13),
                c = p.literal(void 0),
                l = (function(e) {
                    function t(t, n) {
                        var r = e.call(this, t) || this
                        return (r.type = n), r
                    }
                    return r(t, e), (t.prototype.initializePrototype = function(e) {
                        o.observable.ref(e, this.name, { value: c.instantiate(null, "", null, void 0) })
                    }), (t.prototype.initialize = function(e, t) {
                        var n = a.getStateTreeNode(e)
                        ;(e[this.name] = this.type.instantiate(
                            n,
                            this.name,
                            n._environment,
                            t[this.name]
                        )), o.extras.interceptReads(e, this.name, n.unbox)
                    }), (t.prototype.getValueNode = function(e) {
                        var t = e.$mobx.values[this.name].value
                        return t ? t : u.fail("Node not available for property " + this.name)
                    }), (t.prototype.willChange = function(e) {
                        var t = a.getStateTreeNode(e.object)
                        return s.typecheck(this.type, e.newValue), (e.newValue = this.type.reconcile(
                            t.getChildNode(e.name),
                            e.newValue
                        )), e
                    }), (t.prototype.didChange = function(e) {
                        var t = a.getStateTreeNode(e.object)
                        t.emitPatch(
                            {
                                op: "replace",
                                path: a.escapeJsonPath(this.name),
                                value: this.getValueNode(e.object).snapshot
                            },
                            t
                        )
                    }), (t.prototype.serialize = function(e, t) {
                        o.extras.getAtom(e, this.name).reportObserved(), (t[this.name] = this.getValueNode(e).snapshot)
                    }), (t.prototype.deserialize = function(e, t) {
                        e[this.name] = t[this.name]
                    }), (t.prototype.validate = function(e, t) {
                        return this.type.validate(e[this.name], s.getContextForPath(t, this.name, this.type))
                    }), t
                })(i.Property)
            t.ValueProperty = l
        },
        function(e, t, n) {
            "use strict"
            function r(e, t) {
                var n = function() {
                    var e = this,
                        n = arguments,
                        r = s.getStateTreeNode(this)
                    return r.assertAlive(), i.extras.allowStateChanges(!1, function() {
                        return t.apply(e, n)
                    })
                }
                return a.createNamedFunction(e, n)
            }
            var o =
                (this && this.__extends) ||
                (function() {
                    var e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function(e, t) {
                                e.__proto__ = t
                            }) ||
                        function(e, t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }
                    return function(t, n) {
                        function r() {
                            this.constructor = t
                        }
                        e(t, n), (t.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
                    }
                })()
            Object.defineProperty(t, "__esModule", { value: !0 })
            var i = n(5),
                a = n(1),
                s = n(2),
                u = n(10),
                p = n(3),
                c = (function(e) {
                    function t(t, n) {
                        var o = e.call(this, t) || this
                        return (o.invokeView = r(t, n)), o
                    }
                    return o(t, e), (t.prototype.initialize = function(e) {
                        a.addHiddenFinalProp(e, this.name, this.invokeView.bind(e))
                    }), (t.prototype.validate = function(e, t) {
                        return this.name in e
                            ? p.typeCheckFailure(
                                  p.getContextForPath(t, this.name),
                                  e[this.name],
                                  "View properties should not be provided in the snapshot"
                              )
                            : p.typeCheckSuccess()
                    }), t
                })(u.Property)
            ;(t.ViewProperty = c), (t.createViewInvoker = r)
        },
        function(e, t, n) {
            "use strict"
            var r =
                (this && this.__extends) ||
                (function() {
                    var e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function(e, t) {
                                e.__proto__ = t
                            }) ||
                        function(e, t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }
                    return function(t, n) {
                        function r() {
                            this.constructor = t
                        }
                        e(t, n), (t.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
                    }
                })()
            Object.defineProperty(t, "__esModule", { value: !0 })
            var o = n(4),
                i = n(3),
                a = n(1),
                s = n(2),
                u = (function(e) {
                    function t() {
                        var t = e.call(this, "frozen") || this
                        return (t.flags = o.TypeFlags.Frozen), t
                    }
                    return r(t, e), (t.prototype.describe = function() {
                        return "<any immutable value>"
                    }), (t.prototype.instantiate = function(e, t, n, r) {
                        return s.createNode(this, e, t, n, a.deepFreeze(r))
                    }), (t.prototype.isValidSnapshot = function(e, t) {
                        return a.isSerializable(e) ? i.typeCheckSuccess() : i.typeCheckFailure(t, e)
                    }), t
                })(o.Type)
            ;(t.Frozen = u), (t.frozen = new u())
        },
        function(e, t, n) {
            "use strict"
            function r(e) {
                return void 0 === e && (e = p.string), e !== p.string &&
                    e !== p.number &&
                    s.fail(
                        "Only 'types.number' and 'types.string' are acceptable as type specification for identifiers"
                    ), new l(e)
            }
            function o(e) {
                return !(e instanceof c.Late) && (e.flags & a.TypeFlags.Identifier) > 0
            }
            var i =
                (this && this.__extends) ||
                (function() {
                    var e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function(e, t) {
                                e.__proto__ = t
                            }) ||
                        function(e, t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }
                    return function(t, n) {
                        function r() {
                            this.constructor = t
                        }
                        e(t, n), (t.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
                    }
                })()
            Object.defineProperty(t, "__esModule", { value: !0 })
            var a = n(4),
                s = n(1),
                u = n(2),
                p = n(9),
                c = n(14),
                l = (
                    (function() {
                        function e(e) {
                            this.identifier = e
                        }
                        return (e.prototype.toString = function() {
                            return "identifier(" + this.identifier + ")"
                        }), e
                    })(),
                    (function(e) {
                        function t(t) {
                            var n = e.call(this, "identifier(" + t.name + ")") || this
                            return (n.identifierType = t), (n.flags = a.TypeFlags.Identifier), n
                        }
                        return i(t, e), (t.prototype.instantiate = function(e, t, n, r) {
                            return e && u.isStateTreeNode(e.storedValue)
                                ? (
                                      e.identifierAttribute &&
                                          s.fail(
                                              "Cannot define property '" +
                                                  t +
                                                  "' as object identifier, property '" +
                                                  e.identifierAttribute +
                                                  "' is already defined as identifier property"
                                          ),
                                      (e.identifierAttribute = t),
                                      u.createNode(this, e, t, n, r)
                                  )
                                : s.fail("Identifier types can only be instantiated as direct child of a model type")
                        }), (t.prototype.reconcile = function(e, t) {
                            return e.storedValue !== t
                                ? s.fail(
                                      "Tried to change identifier from '" +
                                          e.storedValue +
                                          "' to '" +
                                          t +
                                          "'. Changing identifiers is not allowed."
                                  )
                                : e
                        }), (t.prototype.describe = function() {
                            return "identifier(" + this.identifierType.describe() + ")"
                        }), (t.prototype.isValidSnapshot = function(e, t) {
                            return this.identifierType.validate(e, t)
                        }), t
                    })(a.Type)
                )
            ;(t.IdentifierType = l), (t.identifier = r), (t.isIdentifierType = o)
        },
        function(e, t, n) {
            "use strict"
            function r(e) {
                return o.union(s, e)
            }
            Object.defineProperty(t, "__esModule", { value: !0 })
            var o = n(15),
                i = n(13),
                a = n(11),
                s = a.optional(i.literal(null), null)
            t.maybe = r
        },
        function(e, t, n) {
            "use strict"
            function r(e) {
                return 2 === arguments.length &&
                    "string" == typeof arguments[1] &&
                    p.fail("References with base path are no longer supported. Please remove the base path."), new l(e)
            }
            function o(e) {
                return (e.flags & s.TypeFlags.Reference) > 0
            }
            var i =
                (this && this.__extends) ||
                (function() {
                    var e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function(e, t) {
                                e.__proto__ = t
                            }) ||
                        function(e, t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }
                    return function(t, n) {
                        function r() {
                            this.constructor = t
                        }
                        e(t, n), (t.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
                    }
                })()
            Object.defineProperty(t, "__esModule", { value: !0 })
            var a = n(2),
                s = n(4),
                u = n(3),
                p = n(1),
                c = (function() {
                    function e(e, t) {
                        if (((this.mode = e), (this.value = t), "object" === e)) {
                            if (!a.isStateTreeNode(t))
                                return p.fail("Can only store references to tree nodes, got: '" + t + "'")
                            var n = a.getStateTreeNode(t)
                            if (!n.identifierAttribute)
                                return p.fail("Can only store references with a defined identifier attribute.")
                        }
                    }
                    return e
                })(),
                l = (function(e) {
                    function t(t) {
                        var n = e.call(this, "reference(" + t.name + ")") || this
                        return (n.targetType = t), (n.flags = s.TypeFlags.Reference), n
                    }
                    return i(t, e), (t.prototype.describe = function() {
                        return this.name
                    }), (t.prototype.getValue = function(e) {
                        var t = e.storedValue
                        if ("object" === t.mode) return t.value
                        if (e.isAlive) {
                            var n = e.root.identifierCache.resolve(this.targetType, t.value)
                            return n
                                ? n.value
                                : p.fail(
                                      "Failed to resolve reference of type " +
                                          this.targetType.name +
                                          ": '" +
                                          t.value +
                                          "' (in: " +
                                          e.path +
                                          ")"
                                  )
                        }
                    }), (t.prototype.getSnapshot = function(e) {
                        var t = e.storedValue
                        switch (t.mode) {
                            case "identifier":
                                return t.value
                            case "object":
                                return a.getStateTreeNode(t.value).identifier
                        }
                    }), (t.prototype.instantiate = function(e, t, n, r) {
                        var o = a.isStateTreeNode(r)
                        return a.createNode(this, e, t, n, new c(o ? "object" : "identifier", r))
                    }), (t.prototype.reconcile = function(e, t) {
                        var n = a.isStateTreeNode(t) ? "object" : "identifier"
                        if (o(e.type)) {
                            var r = e.storedValue
                            if (n === r.mode && r.value === t) return e
                        }
                        var i = this.instantiate(e.parent, e.subpath, e._environment, t)
                        return e.die(), i
                    }), (t.prototype.isAssignableFrom = function(e) {
                        return this.targetType.isAssignableFrom(e)
                    }), (t.prototype.isValidSnapshot = function(e, t) {
                        return "string" == typeof e || "number" == typeof e
                            ? u.typeCheckSuccess()
                            : u.typeCheckFailure(
                                  t,
                                  e,
                                  "Value '" +
                                      u.prettyPrintValue(e) +
                                      "' is not a valid reference. Expected a string or number."
                              )
                    }), t
                })(s.Type)
            ;(t.ReferenceType = l), (t.reference = r), (t.isReferenceType = o)
        },
        function(e, t, n) {
            "use strict"
            function r(e, t, n) {
                var r = t.create()
                return n(s.isStateTreeNode(r) ? s.getStateTreeNode(r).snapshot : r) ||
                    a.fail("Default value for refinement type " + e + " does not pass the predicate."), new p(e, t, n)
            }
            var o =
                (this && this.__extends) ||
                (function() {
                    var e =
                        Object.setPrototypeOf ||
                        ({ __proto__: [] } instanceof Array &&
                            function(e, t) {
                                e.__proto__ = t
                            }) ||
                        function(e, t) {
                            for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n])
                        }
                    return function(t, n) {
                        function r() {
                            this.constructor = t
                        }
                        e(t, n), (t.prototype = null === n ? Object.create(n) : ((r.prototype = n.prototype), new r()))
                    }
                })()
            Object.defineProperty(t, "__esModule", { value: !0 })
            var i = n(4),
                a = n(1),
                s = n(2),
                u = n(3),
                p = (function(e) {
                    function t(t, n, r) {
                        var o = e.call(this, t) || this
                        return (o.type = n), (o.predicate = r), o
                    }
                    return o(t, e), Object.defineProperty(t.prototype, "flags", {
                        get: function() {
                            return this.type.flags
                        },
                        enumerable: !0,
                        configurable: !0
                    }), (t.prototype.describe = function() {
                        return this.name
                    }), (t.prototype.instantiate = function(e, t, n, r) {
                        var o = this.type.instantiate(e, t, n, r)
                        return o
                    }), (t.prototype.isAssignableFrom = function(e) {
                        return this.type.isAssignableFrom(e)
                    }), (t.prototype.isValidSnapshot = function(e, t) {
                        if (this.type.is(e)) {
                            var n = s.isStateTreeNode(e) ? s.getStateTreeNode(e).snapshot : e
                            if (this.predicate(n)) return u.typeCheckSuccess()
                        }
                        return u.typeCheckFailure(t, e)
                    }), t
                })(i.Type)
            ;(t.Refinement = p), (t.refinement = r)
        }
    ])
})
