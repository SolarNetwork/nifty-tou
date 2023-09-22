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

# Language support

Nifty ToU supports parsing text-based range values, in different languages. For example
the following produce the same range constraints (only the `TariffRate` names remain
language specific):

```ts
// US English
const tt = TemporalRangesTariff.parse(
	"en-US",
	"Jan - Dec",
	"1 - 31",
	"Mon - Fri",
	"0 - 24",
	[new TariffRate("Morning Fixed", "1.23")]
);

// German
const tt = TemporalRangesTariff.parse(
	"de",
	"Januar - Dezember",
	"1 - 31",
	"Montag - Freitag",
	"00:00 - 24:00",
	[new TariffRate("Morgen behoben", "1,23")]
);

// Japanese
const tt = TemporalRangesTariff.parse(
	"ja-JP",
	"1月 ～ 12月",
	"1 ～ 31",
	"月曜日 ～ 金曜日",
	"0 ～ 24",
	[new TariffRate("午前固定", "1.23")]
);
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
