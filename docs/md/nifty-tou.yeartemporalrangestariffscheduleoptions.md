<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [nifty-tou](./nifty-tou.md) &gt; [YearTemporalRangesTariffScheduleOptions](./nifty-tou.yeartemporalrangestariffscheduleoptions.md)

## YearTemporalRangesTariffScheduleOptions interface

Year schedule options.

**Signature:**

```typescript
export interface YearTemporalRangesTariffScheduleOptions extends TemporalRangesTariffScheduleOptions 
```
**Extends:** [TemporalRangesTariffScheduleOptions](./nifty-tou.temporalrangestariffscheduleoptions.md)

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [yearExtend?](./nifty-tou.yeartemporalrangestariffscheduleoptions.yearextend.md) |  | boolean | <p>_(Optional)_ Extend year constraints into the furture.</p><p>If <code>true</code> then extend the most recent year constraints into unbounded maximums. This is like defining a rule as "from year X onwards". <b>Note</b> this assumes that the rules being compared are already sorted in their natural order (see [compareTo()](./nifty-tou.yeartemporalrangestariff.compareto.md)<!-- -->).</p> |

