"use strict";
exports.__esModule = true;
var ava_1 = require("ava");
var _1 = require("../");
var createTestFactories = function () {
    var Box = _1.types.model({
        width: 0,
        height: 0
    });
    var Square = _1.types.model({
        width: 0,
        height: 0
    });
    var Cube = _1.types.model({
        width: 0,
        height: 0,
        depth: 0
    });
    return { Box: Box, Square: Square, Cube: Cube };
};
ava_1.test("it should recognize a valid snapshot", function (t) {
    var Box = createTestFactories().Box;
    t.deepEqual(Box.is({ width: 1, height: 2 }), true);
    t.deepEqual(Box.is({ width: 1, height: 2, depth: 3 }), true);
});
ava_1.test("it should recognize an invalid snapshot", function (t) {
    var Box = createTestFactories().Box;
    t.deepEqual(Box.is({ width: "1", height: "2" }), false);
});
ava_1.test("it should check valid nodes as well", function (t) {
    var Box = createTestFactories().Box;
    var doc = Box.create();
    t.deepEqual(Box.is(doc), true);
});
ava_1.test("it should check invalid nodes as well", function (t) {
    var Box = createTestFactories().Box;
    var doc = Box.create();
    t.deepEqual(_1.types.model({ anotherAttr: _1.types.number }).is(doc), false);
});
ava_1.test("it should do typescript type inference correctly", function (t) {
    var A = _1.types.model({
        x: _1.types.number,
        y: _1.types.maybe(_1.types.string),
        get z() { return "hi"; },
        set z(v) { }
    }, {
        method: function () {
            // Correct this. Requires typescript 2.3
            var x = this.y + this.x + this.z;
            this.anotherMethod(x);
        },
        anotherMethod: function (x) {
        }
    });
    // factory is invokable
    var a = A.create({ x: 2, y: "7" });
    // property can be used as proper type
    var z = a.x;
    // property can be assigned to crrectly
    a.x = 7;
    // wrong type cannot be assigned
    // MANUAL TEST: not ok: a.x = "stuff"
    // sub factories work
    var B = _1.types.model({
        sub: _1.types.maybe(A)
    });
    var b = B.create();
    // sub fields can be reassigned
    b.sub = A.create({
        // MANUAL TEST not ok: z: 4
        x: 3
    });
    // sub fields have proper type
    b.sub.x = 4;
    var d = b.sub.y;
    a.y = null;
    var zz = a.z;
    a.z = "test";
    b.sub.method();
    t.is(true, true); // supress no asserts warning
});
ava_1.test("#66 - it should accept superfluous fields", function (t) {
    var Item = _1.types.model({
        id: _1.types.number,
        name: _1.types.string
    });
    t.is(Item.is({}), false);
    t.is(Item.is({ id: 3 }), false);
    t.is(Item.is({ id: 3, name: "" }), true);
    t.is(Item.is({ id: 3, name: "", description: "" }), true);
    var a = Item.create({ id: 3, name: "", description: "bla" });
    t.is(a.description, undefined);
});
ava_1.test("#66 - it should not require defaulted fields", function (t) {
    var Item = _1.types.model({
        id: _1.types.number,
        name: _1.types.withDefault(_1.types.string, "boo")
    });
    t.is(Item.is({}), false);
    t.is(Item.is({ id: 3 }), true);
    t.is(Item.is({ id: 3, name: "" }), true);
    t.is(Item.is({ id: 3, name: "", description: "" }), true);
    var a = Item.create({ id: 3, description: "bla" });
    t.is(a.description, undefined);
    t.is(a.name, "boo");
});
ava_1.test("#66 - it should be possible to omit defaulted fields", function (t) {
    var Item = _1.types.model({
        id: _1.types.number,
        name: "boo"
    });
    t.is(Item.is({}), false);
    t.is(Item.is({ id: 3 }), true);
    t.is(Item.is({ id: 3, name: "" }), true);
    t.is(Item.is({ id: 3, name: "", description: "" }), true);
    var a = Item.create({ id: 3, description: "bla" });
    t.is(a.description, undefined);
    t.is(a.name, "boo");
});
ava_1.test("#66 - it should pick the correct type of defaulted fields", function (t) {
    var Item = _1.types.model({
        id: _1.types.number,
        name: "boo"
    });
    var a = Item.create({ id: 3 });
    t.is(a.name, "boo");
    t.throws(function () { return a.name = 3; }, "[mobx-state-tree] Value '3' is not assignable to type: string.");
});
ava_1.test("cannot create factories with null values", function (t) {
    t.throws(function () { return _1.types.model({ x: null }); }, /The default value of an attribute cannot be null or undefined as the type cannot be inferred. Did you mean `types.maybe\(someType\)`?/);
});
ava_1.test("can create factories with maybe primitives", function (t) {
    var F = _1.types.model({
        x: _1.types.maybe(_1.types.string)
    });
    t.is(F.is(undefined), false);
    t.is(F.is({}), true);
    t.is(F.is({ x: null }), true);
    t.is(F.is({ x: "test" }), true);
    t.is(F.is({ x: 3 }), false);
    t.is(F.create().x, null);
    t.is(F.create({ x: undefined }).x, null);
    t.is(F.create({ x: "" }).x, "");
    t.is(F.create({ x: "3" }).x, "3");
});
ava_1.test("it is possible to refer to a type", function (t) {
    var Todo = _1.types.model({
        title: _1.types.string,
        setTitle: function (v) {
        }
    });
    function x() {
        return Todo.create({ title: "test" }); // as any to make sure the type is not inferred accidentally
    }
    var z = x();
    z.setTitle("bla");
    z.title = "bla";
    // z.title = 3 // Test manual: should give compile error
    t.is(true, true); // supress no asserts warning
});
ava_1.test(".Type should not be callable", function (t) {
    var Todo = _1.types.model({
        title: _1.types.string,
        setTitle: function (v) {
        }
    });
    t.throws(function () { return Todo.Type; });
});
ava_1.test(".SnapshotType should not be callable", function (t) {
    var Todo = _1.types.model({
        title: _1.types.string,
        setTitle: function (v) {
        }
    });
    t.throws(function () { return Todo.SnapshotType; });
});
ava_1.test("types instances with compatible snapshots should not be interchangeable", function (t) {
    var A = _1.types.model("A", {
        doA: function () { }
    });
    var B = _1.types.model("B", {
        doB: function () { }
    });
    var C = _1.types.model("C", {
        x: _1.types.maybe(A)
    });
    t.is(A.is({}), true);
    t.is(A.is(B.create()), false); // if thies yielded true, then `B.create().doA()` should work!
    t.is(A.is(_1.getSnapshot(B.create())), true);
    var c = C.create();
    t.notThrows(function () { c.x = null; });
    t.notThrows(function () { c.x = {}; });
    t.notThrows(function () { c.x = A.create(); });
    // TODO: in this test, use constant identifiers, and try this again when maybe supports identifiers. Should not reconcile even though identifier is the same! (throw or new instance, what is the correct behavior?)
    // t.throws(
    //     () => { c.x = B.create() as any },
    //     "[mobx-state-tree] Value of type B: '{}' is not assignable to type: A | null, expected an instance of A | null or a snapshot like '({  } | null)' instead. (Note that a snapshot of the provided value is compatible with the targeted type)"
    // )
});
