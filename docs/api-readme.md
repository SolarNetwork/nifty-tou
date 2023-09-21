# Nifty ToU (Time of Use)

Nifty ToU is a delightful little JavaScript library for working with time-of-use based tariffs.
It aims to be easy to use, reliable, and without any external dependencies.

A central class in Nifty ToU is [TemporalRangesTariff](./classes/TemporalRangesTariff.html),
that defines a set of tariff values with a set of time-based constraints. The implication is that the
tariff values apply only when all the time-based constraints are valid.

The time-based constraints are encoded as [IntRange](./classes/IntRange.html) objects,
that are integer ranges with minimum and maximum values that define the bounds of the constraint.
The supported time-based constraints are:

| Constraint              | Example         | Bounds                                          |
| :---------------------- | :-------------- | :---------------------------------------------- |
| **month** range         | January - March | 1 - 12 (January - December, inclusive)          |
| **day of month** range  | 1 - 31          | 1 - 31 (inclusive)                              |
| **day of week** range   | Monday - Friday | 1 - 7 (Monday - Sunday, inclusive)              |
| **minute of day** range | 00:00 - 08:30   | 0 - 1440 (inclusive minimum, exclusive maximum) |

Here are some example uses:

```ts
// a tariff that applies in the morning of any day of the year
const tt = new TemporalRangesTariff(
	TemporalRangesTariff.ALL_MONTHS,
	TemporalRangesTariff.ALL_DAYS_OF_MONTH,
	TemporalRangesTariff.ALL_DAYS_OF_WEEK,
	new IntRange(0, 720), // midnight - noon
	[
		new TariffRate("Morning Fixed", "1.25"),
		new TariffRate("Morning Variable", "0.10"),
	]
);

tt.appliesAt(new Date("2024-01-05T01:00")); // true, in the morning
tt.appliesAt(new Date("2024-01-05T13:00")); // false, in the afternoon
```
