---
id: "errorformattingoptions"
title: "ErrorFormattingOptions"
sidebar_label: "ErrorFormattingOptions"
---

[mobx-state-tree - v7.3.1](../index.md) › [ErrorFormattingOptions](errorformattingoptions.md)

Options that control how snapshots/values and type shapes are rendered inside
type-checking error messages (see [setErrorFormatting](../index.md#seterrorformatting)).

## Hierarchy

* **ErrorFormattingOptions**

## Index

### Properties

* [enabled](errorformattingoptions.md#enabled)
* [indent](errorformattingoptions.md#indent)
* [maxArrayLength](errorformattingoptions.md#maxarraylength)
* [maxDepth](errorformattingoptions.md#maxdepth)
* [maxPropertyCount](errorformattingoptions.md#maxpropertycount)
* [maxStringLength](errorformattingoptions.md#maxstringlength)

## Properties

###  enabled

• **enabled**: *boolean*

*Defined in [src/core/type/errorFormatting.ts:13](https://github.com/mobxjs/mobx-state-tree/blob/65595e81/src/core/type/errorFormatting.ts#L13)*

When `false` (the default), error messages are rendered exactly as they
always have been: the offending value is serialized to a single
`JSON.stringify` line and the message is capped in length. When `true`,
the value is truncated (using the limits below) and, when `indent > 0`,
pretty-printed across multiple lines.

___

###  indent

• **indent**: *number*

*Defined in [src/core/type/errorFormatting.ts:19](https://github.com/mobxjs/mobx-state-tree/blob/65595e81/src/core/type/errorFormatting.ts#L19)*

Number of spaces to indent each nesting level by when pretty-printing.
Use `0` to keep everything on a single line while still truncating
(handy when you only want to bound the message size, not reflow it).

___

###  maxArrayLength

• **maxArrayLength**: *number*

*Defined in [src/core/type/errorFormatting.ts:23](https://github.com/mobxjs/mobx-state-tree/blob/65595e81/src/core/type/errorFormatting.ts#L23)*

Arrays with more than this many items are clipped, with a note of how many items were omitted.

___

###  maxDepth

• **maxDepth**: *number*

*Defined in [src/core/type/errorFormatting.ts:27](https://github.com/mobxjs/mobx-state-tree/blob/65595e81/src/core/type/errorFormatting.ts#L27)*

Values nested deeper than this are summarized as `{…}` / `[…]`.

___

###  maxPropertyCount

• **maxPropertyCount**: *number*

*Defined in [src/core/type/errorFormatting.ts:25](https://github.com/mobxjs/mobx-state-tree/blob/65595e81/src/core/type/errorFormatting.ts#L25)*

Objects with more than this many keys are clipped, with a note of how many keys were omitted.

___

###  maxStringLength

• **maxStringLength**: *number*

*Defined in [src/core/type/errorFormatting.ts:21](https://github.com/mobxjs/mobx-state-tree/blob/65595e81/src/core/type/errorFormatting.ts#L21)*

Strings longer than this are clipped, with a note of how many characters were omitted.
