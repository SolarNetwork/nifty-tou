<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [nifty-tou](./nifty-tou.md) &gt; [TemporalRangesTariffSchedule](./nifty-tou.temporalrangestariffschedule.md) &gt; [firstMatch](./nifty-tou.temporalrangestariffschedule.firstmatch.md)

## TemporalRangesTariffSchedule.firstMatch() method

Find the first rule that applies on a given date.

**Signature:**

```typescript
firstMatch(date: Date, utc?: boolean): TemporalRangesTariff;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  date | Date | the date to find the first matching rule at |
|  utc | boolean | _(Optional)_ if <code>true</code> then use UTC date components, otherwise assume the local time zone |

**Returns:**

[TemporalRangesTariff](./nifty-tou.temporalrangestariff.md)

the first available matching rule, or `undefined` if no rules match
