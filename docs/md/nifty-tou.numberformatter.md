<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [nifty-tou](./nifty-tou.md) &gt; [NumberFormatter](./nifty-tou.numberformatter.md)

## NumberFormatter class

A locale-specific number parser.

**Signature:**

```typescript
export default class NumberFormatter 
```

## Remarks

This parser supports basic language parsing abilities, but can still parse unexpected results given the right input. For example:

```ts
NumberFormatter.forLcale("de").parse("1.23"); // returns 123
```
That example produces `123` instead of the (perhaps?) expected `1.23` because `.` is a thousands delimiter character in German and the parser simply removes that from the input, resulting in the string `"123"` that is then parsed into the number result `123`<!-- -->.

Adapted from Mike Bostock's [lovely code](https://observablehq.com/@mbostock/localized-number-parsing) (thanks, Mike!).

## Constructors

|  Constructor | Modifiers | Description |
|  --- | --- | --- |
|  [(constructor)(locale)](./nifty-tou.numberformatter._constructor_.md) |  | Constructor. |

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [locale](./nifty-tou.numberformatter.locale.md) | <code>readonly</code> | string | Get the locale. |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [forLocale(locale)](./nifty-tou.numberformatter.forlocale.md) | <code>static</code> | <p>Get a parser for a given locale.</p><p>This method will instantiate and cache parsers, returning cached instances if already avaialble.</p> |
|  [format(n, format)](./nifty-tou.numberformatter.format.md) |  | <p>Format a number into a string.</p><p>This will return <code>&quot;NaN&quot;</code> if <code>n</code> is <code>NaN</code> or an empty string if <code>n</code> is <code>undefined</code> or <code>null</code>. Otherwise, <code>n</code> will be formatted with <code>format</code> if provided, falling back to a format with [DEFAULT\_FORMAT\_OPTIONS](./nifty-tou.default_format_options.md)<!-- -->.</p> |
|  [norm(s)](./nifty-tou.numberformatter.norm.md) |  | Normalize a locale-specific number string. |
|  [parse(s)](./nifty-tou.numberformatter.parse.md) |  | Parse a locale-specific number string. |

