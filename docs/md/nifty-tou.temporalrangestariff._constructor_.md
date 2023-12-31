<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [nifty-tou](./nifty-tou.md) &gt; [TemporalRangesTariff](./nifty-tou.temporalrangestariff.md) &gt; [(constructor)](./nifty-tou.temporalrangestariff._constructor_.md)

## TemporalRangesTariff.(constructor)

Constructor.

**Signature:**

```typescript
constructor(monthRange?: IntRange, dayOfMonthRange?: IntRange, dayOfWeekRange?: IntRange, minuteOfDayRange?: IntRange, rates?: TariffRate[]);
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  monthRange | [IntRange](./nifty-tou.intrange.md) | _(Optional)_ the month range (1-12, inclusive) |
|  dayOfMonthRange | [IntRange](./nifty-tou.intrange.md) | _(Optional)_ the day of month range (1-31, inclusive) |
|  dayOfWeekRange | [IntRange](./nifty-tou.intrange.md) | _(Optional)_ the day of week range (1-7, with 1 = Monday, 7 = Sunday, inclusive) |
|  minuteOfDayRange | [IntRange](./nifty-tou.intrange.md) | _(Optional)_ the minute of day range (0-1440, inclusive minimum, exclusive maximum) |
|  rates | [TariffRate](./nifty-tou.tariffrate.md)<!-- -->\[\] | _(Optional)_ the rates, as an array of <code>TariffRate</code> objects |

