# Nifty ToU (Time of Use)

Nifty ToU is a delightful little JavaScript library for working with time-of-use based tariffs.
It aims to be easy to use, reliable, and without any external dependencies.

A central class in Nifty ToU is [TemporalRangesTariff](./docs/md/nifty-tou.temporalrangestariff.md),
that defines a set of tariff values with a set of time-based constraints. The implication is that the
tariff values apply only when all the time-based constraints are valid.

The time-based constraints are encoded as [IntRange](docs/md/nifty-tou.intrange.md) objects,
that are integer ranges with minimum and maximum values that define the bounds of the constraint.
The supported time-based constraints are:

| Constraint              | Example         | Bounds                                          |
| :---------------------- | :-------------- | :---------------------------------------------- |
| **month** range         | January - March | 1 - 12 (January - December, inclusive)          |
| **day of month** range  | 1 - 31          | 1 - 31 (inclusive)                              |
| **day of week** range   | Monday - Friday | 1 - 7 (Monday - Sunday, inclusive)              |
| **minute of day** range | 00:00 - 08:30   | 0 - 1440 (inclusive minimum, exclusive maximum) |

Here are some example uses of the `TemporalRangesTariff` class:

```ts
// a tariff that applies in the morning of any day of the year
const tt = new TemporalRangesTariff(
	TemporalRangesTariff.ALL_MONTHS,
	TemporalRangesTariff.ALL_DAYS_OF_MONTH,
	TemporalRangesTariff.ALL_DAYS_OF_WEEK,
	new IntRange(0, 720), // midnight - noon
	[
		new TariffRate("Morning Fixed", 1.25),
		new TariffRate("Morning Variable", 0.1),
	]
);

tt.appliesAt(new Date("2024-01-05T01:00")); // true, in the morning
tt.appliesAt(new Date("2024-01-05T13:00")); // false, in the afternoon
```

# Tariff schedules

The [TemporalRangesTariffSchedule](./docs/md/nifty-tou.temporalrangestariffschedule.md) class
defines a schedule, or _collection_ of date-based tariff rules that allows you resolve a
set of tariff rates for a given date. For example, imagine we add another tariff to
the previous example, and then resolve the rates for a date:

```ts
// a tariff that applies after noon of any day of the year
const tt2 = new TemporalRangesTariff(
	TemporalRangesTariff.ALL_MONTHS,
	TemporalRangesTariff.ALL_DAYS_OF_MONTH,
	TemporalRangesTariff.ALL_DAYS_OF_WEEK,
	new IntRange(720, 1440), // noon - midnight
	[new TariffRate("Afternoon Fixed", 2.34)]
);

// create a scheule with our two tariff rules
const schedule = new TemporalRangesTariffSchedule([tt, tt2]);

// resolve the rates that apply on a morning date (8 AM)
const rates = schedule.resolve(new Date("2024-01-05T08:00"));

// rates like:
{
  "Morning Fixed":    {amount: 1.25},
  "Morning Variable": {amount: 0.10}
}
```

## Multiple rules matching

By default, a schedule will resolve the rates for the **first** available tariff matching
a given date. You can turn on _multiple match mode_ by passing an additional `true`
argument to the constructor. For example, imagine we add another tariff to the previous
examples, and then resolve the rates for a date:

```ts
// a tariff that applies after noon of any day of the year
const tt3 = new TemporalRangesTariff(
	TemporalRangesTariff.ALL_MONTHS,
	TemporalRangesTariff.ALL_DAYS_OF_MONTH,
	TemporalRangesTariff.ALL_DAYS_OF_WEEK,
	TemporalRangesTariff.ALL_MINUTES_OF_DAY,
	[new TariffRate("Any Time", 3.45)]
);

// create a scheule with our three tariff rules, allowing mutiple matches
const schedule = new TemporalRangesTariffSchedule([tt, tt2, tt3], true);

// resolve the rates that apply on a morning date (8 AM)
const rates = schedule.resolve(new Date("2024-01-05T08:00"));

// rates like:
{
  "Morning Fixed":    {amount: 1.25},
  "Morning Variable": {amount: 0.10},
  "All Time":         {amount: 3.45}
}
```

# Year-based tariff schedules

If you would like to model a tariff schedule with rules that change over the time, the
[YearTemporalRangesTariffSchedule](./docs/md/nifty-tou.yeartemporalrangestariffschedule.md)
class extends the `TemporalRangesTariffSchedule` with support for year-based rules.
For example, imagine a tariff schedule like this:

| Year | Months | Days | Weekdays | Hours | Name | Rate |
| :--- | :----- | :--- | :------- | :---- | :--- | :--- |
| 2023 | \*     | \*   | \*       | 0-12  | AM   | 1.23 |
| 2023 | \*     | \*   | \*       | 12-24 | PM   | 2.34 |
| 2022 | \*     | \*   | \*       | 0-12  | AM   | 1.12 |
| 2022 | \*     | \*   | \*       | 12-24 | PM   | 2.23 |
| 2000 | \*     | \*   | \*       | 0-12  | AM   | 0.12 |
| 2000 | \*     | \*   | \*       | 12-24 | PM   | 0.23 |

You can model this schedule like this:

```ts
// define the schedule rules with year constraints
const rules = [
	YearTemporalRangesTariff.parseYears(
		"en-US",
		"2023",
		"Jan-Dec",
		"1-31",
		"Mon-Sun",
		"0-12",
		[new TariffRate("AM", 1.23)]
	),
	YearTemporalRangesTariff.parseYears(
		"en-US",
		"2023",
		"Jan-Dec",
		"1-31",
		"Mon-Sun",
		"12-24",
		[new TariffRate("AM", 2.34)]
	),
	YearTemporalRangesTariff.parseYears(
		"en-US",
		"2022",
		"Jan-Dec",
		"1-31",
		"Mon-Sun",
		"0-12",
		[new TariffRate("AM", 1.12)]
	),
	YearTemporalRangesTariff.parseYears(
		"en-US",
		"2022",
		"Jan-Dec",
		"1-31",
		"Mon-Sun",
		"12-24",
		[new TariffRate("AM", 2.23)]
	),
	YearTemporalRangesTariff.parseYears(
		"en-US",
		"2000",
		"Jan-Dec",
		"1-31",
		"Mon-Sun",
		"0-12",
		[new TariffRate("AM", 0.12)]
	),
	YearTemporalRangesTariff.parseYears(
		"en-US",
		"2000",
		"Jan-Dec",
		"1-31",
		"Mon-Sun",
		"12-24",
		[new TariffRate("AM", 0.23)]
	),
];

// define the schedule, with the `yearExtend` option set
const s = new YearTemporalRangesTariffSchedule(rules, {
	yearExtend: true, // allow "gap fill" year matching
});

// exact match rules
s.resolve(new Date("2023-01-01T08:00")) === { AM: 1.23 };
s.resolve(new Date("2022-01-01T08:00")) === { AM: 1.12 };
s.resolve(new Date("2000-01-01T08:00")) === { AM: 0.12 };

// gap-fill match a future date, based on previously avaialble year rule
s.resolve(new Date("2050-01-01T08:00")) === { AM: 1.23 }; // 2023 rule

// gap-fill match inbetween year rules, based on previously avaialble year
s.resolve(new Date("2010-01-01T08:00")) === { AM: 1.12 }; // 2000 rule
```

# Integer amounts

The [TariffRate](./docs/md/nifty-tou.tariffrate.md) class can be constructed with an `exponent`
property to avoid floating-point values if desired. For example:

```ts
// these floating point rates:
new TariffRate("Morning Fixed", 1.25);
new TariffRate("Morning Variable", 0.1);

// could be expressed in integer form:
new TariffRate("Morning Fixed", 125, -2);
new TariffRate("Morning Variable", 1, -1);
```

# Language support

Nifty ToU supports parsing and formatting text-based range values, in different languages. For
example the following produce the same range constraints and rate values (only the rate names remain
language specific):

```ts
// US English
const tt = TemporalRangesTariff.parse(
	"en-US",
	"Jan - Dec",
	"1 - 31",
	"Mon - Fri",
	"0 - 24",
	[TariffRate.parse("en-US", "Morning Fixed", "1.23")]
);
TemporalRangesTariff.format(
	"en-US",
	ChronoField.MONTH_OF_YEAR,
	new IntRange(1, 3)
) === "Jan - Mar";

// German
const tt = TemporalRangesTariff.parse(
	"de",
	"Januar - Dezember",
	"1 - 31",
	"Montag - Freitag",
	"00:00 - 24:00",
	[TariffRate.parse("de", "Morgen behoben", "1,23")]
);
TemporalRangesTariff.format(
	"de",
	ChronoField.MONTH_OF_YEAR,
	new IntRange(1, 3)
) === "Jan - Mär";

// Japanese
const tt = TemporalRangesTariff.parse(
	"ja-JP",
	"1月～12月",
	"1～31",
	"月曜日～金曜日",
	"0～24",
	[TariffRate.parse("ja-JP", "固定価格(午前中)", "1.23")]
);
TemporalRangesTariff.format(
	"ja-JP",
	ChronoField.MONTH_OF_YEAR,
	new IntRange(1, 3)
) === "1月～3月";
```

# Documentation

The API documentation is published to <https://solarnetwork.github.io/nifty-tou/>, and is also
available in Markdown form in the [docs/md](./docs/md/index.md) directory.

# Building from source

To build Nifty ToU yourself, clone or download this repository. You need to have
Node 16+ installed. Then:

```sh
# initialize dependencies
npm ci

# build
npm run build
```

Running the `build` script will execute the TypeScript compiler and generate JavaScript files
in `lib/` directory.

# Building API documentation

To build the API documentation, you must first [build](#building-from-source) the package
and then run `npm run apidocs`. For example:

```sh
npm run apidocs
```

# Unit tests

You can run the unit tests with `npm test`. For example:

```sh
npm test

...
  ✔ ChronoFieldParserTests › ChronoFieldParser:parseRange:month:fr-FR
  ✔ ChronoFieldParserTests › ChronoFieldParser:parseRange:month:nums:fr-FR
  ✔ ChronoFieldParserTests › ChronoFieldParser:parseRange:week:en-US
  ✔ ChronoFieldParserTests › ChronoFieldParser:parseRange:week:nums:en-US
  ✔ ChronoFieldParserTests › ChronoFieldParser:parseRange:week:fr-FR
  ✔ ChronoFieldParserTests › ChronoFieldParser:parseRange:week:nums:fr-FR
  ─

  107 tests passed
-------------------------|---------|----------|---------|---------|-------------------
File                     | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------------|---------|----------|---------|---------|-------------------
All files                |     100 |      100 |     100 |     100 |
 ChronoFieldParser.ts    |     100 |      100 |     100 |     100 |
 IntRange.ts             |     100 |      100 |     100 |     100 |
 NumberParser.ts         |     100 |      100 |     100 |     100 |
 TariffRate.ts           |     100 |      100 |     100 |     100 |
 TemporalRangesTariff.ts |     100 |      100 |     100 |     100 |
 utils.ts                |     100 |      100 |     100 |     100 |
-------------------------|---------|----------|---------|---------|-------------------
```

# Test coverage

[![codecov](https://codecov.io/gh/SolarNetwork/nifty-tou/graph/badge.svg?token=IyYZDIk9rj)](https://codecov.io/github/SolarNetwork/nifty-tou)

Having a well-tested and reliable library is a core goal of this project. Unit tests are executed
automatically after every push into the `main` branch of this repository and their associated code
coverage is uploaded to [Codecov](https://codecov.io/github/SolarNetwork/nifty-tou/).

[![codecov](https://codecov.io/gh/SolarNetwork/nifty-tou/graphs/sunburst.svg?token=IyYZDIk9rj)](https://codecov.io/github/SolarNetwork/nifty-tou)
