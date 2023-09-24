<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [nifty-tou](./nifty-tou.md) &gt; [TemporalRangesTariff](./nifty-tou.temporalrangestariff.md) &gt; [format](./nifty-tou.temporalrangestariff.format.md)

## TemporalRangesTariff.format() method

Format a field range into a locale-specific string.

**Signature:**

```typescript
format(field: ChronoField, locale: string, options?: TemporalRangesTariffFormatOptions): string;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  field | [ChronoField](./nifty-tou.chronofield.md) | the field to format |
|  locale | string | the desired locale |
|  options | [TemporalRangesTariffFormatOptions](./nifty-tou.temporalrangestariffformatoptions.md) | _(Optional)_ the options |

**Returns:**

string

the formatted field range value

## Exceptions

`TypeError` if `field` is not supported
