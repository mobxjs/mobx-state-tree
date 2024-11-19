---
id: "unionoptions"
title: "UnionOptions"
sidebar_label: "UnionOptions"
---

[mobx-state-tree - v7.0.0](../index.md) › [UnionOptions](unionoptions.md)

## Type parameters

▪ **Types**: *[IAnyType](ianytype.md)[]*

## Hierarchy

* **UnionOptions**

## Index

### Properties

* [dispatcher](unionoptions.md#optional-dispatcher)
* [eager](unionoptions.md#optional-eager)

## Properties

### `Optional` dispatcher

• **dispatcher**? : *[ITypeDispatcher](../index.md#itypedispatcher)‹Types›*

*Defined in [src/types/utility-types/union.ts:38](https://github.com/mobxjs/mobx-state-tree/blob/d5d9f75f/src/types/utility-types/union.ts#L38)*

A function that returns the type to be used given an input snapshot.

___

### `Optional` eager

• **eager**? : *undefined | false | true*

*Defined in [src/types/utility-types/union.ts:33](https://github.com/mobxjs/mobx-state-tree/blob/d5d9f75f/src/types/utility-types/union.ts#L33)*

Whether or not to use eager validation.

When `true`, the first matching type will be used. Otherwise, all types will be checked and the
validation will pass if and only if a single type matches.
