<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [nifty-tou](./nifty-tou.md) &gt; [TemporalRangesTariff](./nifty-tou.temporalrangestariff.md) &gt; [parse](./nifty-tou.temporalrangestariff.parse.md)

## TemporalRangesTariff.parse() method

Parse time range criteria into a `TemporalRangesTariff` instance.

**Signature:**

```typescript
static parse(locale: string, monthRange?: string, dayOfMonthRange?: string, dayOfWeekRange?: string, minuteOfDayRange?: string, rates?: TariffRate[], options?: TemporalRangesTariffFormatOptions): TemporalRangesTariff;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  locale | string | the locale to parse the ranges as |
|  monthRange | string | _(Optional)_ the month range to parse, for example <code>January-December</code>, <code>Jan-Dec</code>, or <code>1-12</code> |
|  dayOfMonthRange | string | _(Optional)_ the day of month range to parse, for example <code>1-31</code> |
|  dayOfWeekRange | string | _(Optional)_ the day of week range to parse, for example <code>Monday-Sunday</code>, <code>Mon-Sun</code>, or <code>1-7</code> |
|  minuteOfDayRange | string | _(Optional)_ the minute of day range to parse, for example <code>00:00-24:00</code> or <code>0-24</code> |
|  rates | [TariffRate](./nifty-tou.tariffrate.md)<!-- -->\[\] | _(Optional)_ the tariff rates to associate with the time range criteria |
|  options | [TemporalRangesTariffFormatOptions](./nifty-tou.temporalrangestariffformatoptions.md) | _(Optional)_ the formatting options to use |

**Returns:**

[TemporalRangesTariff](./nifty-tou.temporalrangestariff.md)

the new instance

## Remarks

Note that the `minuteOfDayRange` can be specified as a range of `HH:MM` 24-hour hour and minute values, <b>or</b> whole hours. For example `01:00-08:00` and `1-8` are equivalent.

Additionally, all range values may be specified as `*` to mean "all possible values", in which that range will be resolved to `undefined`<!-- -->.

