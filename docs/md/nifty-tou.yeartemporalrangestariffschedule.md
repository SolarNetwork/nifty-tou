<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [nifty-tou](./nifty-tou.md) &gt; [YearTemporalRangesTariffSchedule](./nifty-tou.yeartemporalrangestariffschedule.md)

## YearTemporalRangesTariffSchedule class

A schedule, or collection, of [YearTemporalRangesTariff](./nifty-tou.yeartemporalrangestariff.md) rules that supports resolving rates for dates.

**Signature:**

```typescript
export default class YearTemporalRangesTariffSchedule<T extends YearTemporalRangesTariff, O extends YearTemporalRangesTariffScheduleOptions> extends TemporalRangesTariffSchedule<T, O> 
```
**Extends:** [TemporalRangesTariffSchedule](./nifty-tou.temporalrangestariffschedule.md)<!-- -->&lt;T, O&gt;

## Remarks

By default this schedule works similarly to the [TemporalRangesTariffSchedule](./nifty-tou.temporalrangestariffschedule.md)<!-- -->, except using [YearTemporalRangesTariff](./nifty-tou.yeartemporalrangestariff.md) instances that include a year criteria for matching dates. The [yearExtend](./nifty-tou.yeartemporalrangestariffscheduleoptions.yearextend.md) option changes the matching to treat the "most recent" year rules as having unbounded maximum values. The idea here is that the most recently defined rules remain applicable into future years, until another set of rules for some future year overrides them.

## Properties

|  Property | Modifiers | Type | Description |
|  --- | --- | --- | --- |
|  [yearExtend](./nifty-tou.yeartemporalrangestariffschedule.yearextend.md) | <code>readonly</code> | boolean | Get the year-extend mode. |

## Methods

|  Method | Modifiers | Description |
|  --- | --- | --- |
|  [firstMatch(date, utc)](./nifty-tou.yeartemporalrangestariffschedule.firstmatch.md) |  | Find the first rule that applies on a given date. |
|  [matches(date, utc)](./nifty-tou.yeartemporalrangestariffschedule.matches.md) |  | Find the rules that apply on a given date, repsecting the <code>multipleMatch</code> property. |

