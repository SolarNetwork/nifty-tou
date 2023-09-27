import test from "ava";
import {
	ChronoField,
	ALL_MONTHS,
	ALL_DAYS_OF_MONTH,
	ALL_DAYS_OF_WEEK,
	ALL_MINUTES_OF_DAY,
} from "../main/ChronoFieldFormatter.js";
import IntRange from "../main/IntRange.js";
import {
	default as TemporalRangesTariff,
	TemporalRangesTariffFormatOptions,
} from "../main/TemporalRangesTariff.js";
import TariffRate from "../main/TariffRate.js";

test("TemporalRangesTariff:construct", (t) => {
	const monthRange = new IntRange(1, 12);
	const dayOfMonthRange = new IntRange(1, 31);
	const dayOfWeekRange = new IntRange(1, 7);
	const minuteOfDayRange = new IntRange(0, 1440);

	const tt = new TemporalRangesTariff(
		monthRange,
		dayOfMonthRange,
		dayOfWeekRange,
		minuteOfDayRange,
		[new TariffRate("a", 1.23)]
	);
	t.is(tt.monthRange, monthRange, "monthRange from constructor arg");
	t.is(
		tt.dayOfMonthRange,
		dayOfMonthRange,
		"dayOfMonthRange from constructor arg"
	);
	t.is(
		tt.dayOfWeekRange,
		dayOfWeekRange,
		"dayOfWeekRange from constructor arg"
	);
	t.is(
		tt.minuteOfDayRange,
		minuteOfDayRange,
		"minuteOfDayRange from constructor arg"
	);
});

test("TemporalRangesTariff:construct:clamped:min", (t) => {
	const monthRange = new IntRange(-99, 2);
	const dayOfMonthRange = new IntRange(-99, 2);
	const dayOfWeekRange = new IntRange(-99, 2);
	const minuteOfDayRange = new IntRange(-99, 2);

	const tt = new TemporalRangesTariff(
		monthRange,
		dayOfMonthRange,
		dayOfWeekRange,
		minuteOfDayRange,
		[new TariffRate("a", 1.23)]
	);
	t.like(tt.monthRange, { min: 1, max: 2 }, "monthRange clamped to bounds");
	t.like(
		tt.dayOfMonthRange,
		{ min: 1, max: 2 },
		"dayOfMonthRange clamped to bounds"
	);
	t.like(
		tt.dayOfWeekRange,
		{ min: 1, max: 2 },
		"dayOfWeekRange clamped to bounds"
	);
	t.like(
		tt.minuteOfDayRange,
		{ min: 0, max: 2 },
		"minuteOfDayRange clamped to bounds"
	);
});

test("TemporalRangesTariff:construct:clamped:bounds", (t) => {
	const monthRange = new IntRange(-99, 99);
	const dayOfMonthRange = new IntRange(-99, 99);
	const dayOfWeekRange = new IntRange(-99, 99);
	const minuteOfDayRange = new IntRange(-99, 9999);

	const tt = new TemporalRangesTariff(
		monthRange,
		dayOfMonthRange,
		dayOfWeekRange,
		minuteOfDayRange,
		[new TariffRate("a", 1.23)]
	);
	t.is(tt.monthRange, ALL_MONTHS, "monthRange clamped to bounds");
	t.is(
		tt.dayOfMonthRange,
		ALL_DAYS_OF_MONTH,
		"dayOfMonthRange clamped to bounds"
	);
	t.is(
		tt.dayOfWeekRange,
		ALL_DAYS_OF_WEEK,
		"dayOfWeekRange clamped to bounds"
	);
	t.is(
		tt.minuteOfDayRange,
		ALL_MINUTES_OF_DAY,
		"minuteOfDayRange clamped to bounds"
	);
});

test("TemporalRangesTariff:construct:frozenRates", (t) => {
	const tt = new TemporalRangesTariff(
		TemporalRangesTariff.ALL_MONTHS,
		TemporalRangesTariff.ALL_DAYS_OF_MONTH,
		TemporalRangesTariff.ALL_DAYS_OF_WEEK,
		TemporalRangesTariff.ALL_MINUTES_OF_DAY,
		[new TariffRate("a", 1.23)]
	);
	t.true(Object.isFrozen(tt.rates), "rates are frozen");
});

test("TemporalRangesTariff:applies", (t) => {
	const monthRange = new IntRange(1, 6);
	const dayOfMonthRange = new IntRange(1, 15);
	const dayOfWeekRange = new IntRange(1, 4);
	const minuteOfDayRange = new IntRange(0, 720);

	const tt = new TemporalRangesTariff(
		monthRange,
		dayOfMonthRange,
		dayOfWeekRange,
		minuteOfDayRange,
		[new TariffRate("a", 1.23)]
	);

	// 1 Jan 2024 is Monday
	t.true(
		tt.appliesAt(new Date("2024-01-01T00:00")),
		"Mon, 1 Jan 00:00 applies"
	);
	t.true(
		tt.appliesAt(new Date("2024-01-01T06:00")),
		"Mon, 1 Jan 06:00 applies"
	);
	t.false(
		tt.appliesAt(new Date("2024-01-01T18:00")),
		"Mon, 1 Jan 18:00 outside minute range"
	);
	t.false(
		tt.appliesAt(new Date("2024-01-05T00:00")),
		"Fri, 5 Jan 00:00 outside of DOW range"
	);
	t.false(
		tt.appliesAt(new Date("2024-01-07T00:00")),
		"Sun, 7 Jan 00:00 outside of DOW range"
	);
	t.true(
		tt.appliesAt(new Date("2024-01-10T00:00")),
		"Wed, 10 Jan 00:00 applies"
	);
	t.false(
		tt.appliesAt(new Date("2024-01-17T00:00")),
		"Wed, 17 Jan 00:00 outside of DOM range"
	);
	t.true(
		tt.appliesAt(new Date("2024-03-06T00:00")),
		"Wed, 6 Mar 00:00 applies"
	);
	t.false(
		tt.appliesAt(new Date("2024-06-01T00:00")),
		"Mon, 1 Jul 00:00 outside of month range"
	);
});

test("TemporalRangesTariff:applies:minutes", (t) => {
	const monthRange = new IntRange(1, 6);
	const dayOfMonthRange = new IntRange(1, 15);
	const dayOfWeekRange = new IntRange(1, 4);
	const minuteOfDayRange = new IntRange(0, 720);

	const tt = new TemporalRangesTariff(
		monthRange,
		dayOfMonthRange,
		dayOfWeekRange,
		minuteOfDayRange,
		[new TariffRate("a", 1.23)]
	);

	// 1 Jan 2024 is Monday
	const d = new Date("2024-01-01T00:00");
	for (let h = 0; h < 24; h += 1) {
		for (let m = 0; m < 60; m += 1) {
			d.setHours(h, m);
			if (h < 12) {
				t.true(tt.appliesAt(d), `${d} applies at ${h}:${m}`);
			} else {
				t.false(tt.appliesAt(d), `${d} does not apply at ${h}:${m}`);
			}
		}
	}
});

test("TemporalRangesTariff:applies:utc", (t) => {
	const monthRange = new IntRange(1, 6);
	const dayOfMonthRange = new IntRange(1, 15);
	const dayOfWeekRange = new IntRange(1, 4);
	const minuteOfDayRange = new IntRange(0, 720);

	const tt = new TemporalRangesTariff(
		monthRange,
		dayOfMonthRange,
		dayOfWeekRange,
		minuteOfDayRange,
		[new TariffRate("a", 1.23)]
	);

	// 1 Jan 2024 is Monday
	t.true(
		tt.appliesAt(new Date("2024-01-01T00:00Z"), true),
		"Mon, 1 Jan 00:00 applies"
	);
	t.true(
		tt.appliesAt(new Date("2024-01-01T06:00Z"), true),
		"Mon, 1 Jan 06:00 applies"
	);
	t.false(
		tt.appliesAt(new Date("2024-01-01T18:00Z"), true),
		"Mon, 1 Jan 18:00 outside minute range"
	);
	t.false(
		tt.appliesAt(new Date("2024-01-05T00:00Z"), true),
		"Fri, 5 Jan 00:00 outside of DOW range"
	);
	t.false(
		tt.appliesAt(new Date("2024-01-07T00:00Z"), true),
		"Sun, 7 Jan 00:00 outside of DOW range"
	);
	t.true(
		tt.appliesAt(new Date("2024-01-10T00:00Z"), true),
		"Wed, 10 Jan 00:00 applies"
	);
	t.false(
		tt.appliesAt(new Date("2024-01-17T00:00Z"), true),
		"Wed, 17 Jan 00:00 outside of DOM range"
	);
	t.true(
		tt.appliesAt(new Date("2024-03-06T00:00Z"), true),
		"Wed, 6 Mar 00:00 applies"
	);
	t.false(
		tt.appliesAt(new Date("2024-06-01T00:00Z"), true),
		"Mon, 1 Jul 00:00 outside of month range"
	);
});

test("TemporalRangesTariff:toString", (t) => {
	const tt = new TemporalRangesTariff(
		new IntRange(1, 6),
		new IntRange(1, 15),
		new IntRange(1, 4),
		new IntRange(0, 720),
		[new TariffRate("a", 1.23)]
	);

	t.is(
		tt.toString(),
		"TemporalRangesTariff{m=[1..6],dom=[1..15],dow=[1..4],mod=[0..720],r=[TariffRate{a,1.23}]}"
	);
});

test("TemporalRangesTariff:toString:multiRates", (t) => {
	const tt = new TemporalRangesTariff(
		new IntRange(1, 6),
		new IntRange(1, 15),
		new IntRange(1, 4),
		new IntRange(0, 720),
		[new TariffRate("a", 1.23), new TariffRate("b", 2.34)]
	);

	t.is(
		tt.toString(),
		"TemporalRangesTariff{m=[1..6],dom=[1..15],dow=[1..4],mod=[0..720],r=[TariffRate{a,1.23},TariffRate{b,2.34}]}"
	);
});

test("TemporalRangesTariff:fullRanges", (t) => {
	const tt = new TemporalRangesTariff(
		TemporalRangesTariff.ALL_MONTHS,
		TemporalRangesTariff.ALL_DAYS_OF_MONTH,
		TemporalRangesTariff.ALL_DAYS_OF_WEEK,
		TemporalRangesTariff.ALL_MINUTES_OF_DAY,
		[new TariffRate("a", 1.23)]
	);

	t.is(
		tt.toString(),
		"TemporalRangesTariff{m=*,dom=*,dow=*,mod=*,r=[TariffRate{a,1.23}]}"
	);
});

test("TemporalRangesTariff:rates:single", (t) => {
	const tt = new TemporalRangesTariff(
		TemporalRangesTariff.ALL_MONTHS,
		TemporalRangesTariff.ALL_DAYS_OF_MONTH,
		TemporalRangesTariff.ALL_DAYS_OF_WEEK,
		TemporalRangesTariff.ALL_MINUTES_OF_DAY,
		[new TariffRate("a", 1.23)]
	);

	t.like(tt.rates, { a: { id: "a", amount: 1.23 } });
});

test("TemporalRangesTariff:rates:multi", (t) => {
	const tt = new TemporalRangesTariff(
		TemporalRangesTariff.ALL_MONTHS,
		TemporalRangesTariff.ALL_DAYS_OF_MONTH,
		TemporalRangesTariff.ALL_DAYS_OF_WEEK,
		TemporalRangesTariff.ALL_MINUTES_OF_DAY,
		[new TariffRate("a", 1.23), new TariffRate("b", 2.34)]
	);

	t.like(tt.rates, {
		a: { id: "a", amount: 1.23 },
		b: { id: "b", amount: 2.34 },
	});
});

test("TemporalRangesTariff:rates:clash", (t) => {
	const tt = new TemporalRangesTariff(
		TemporalRangesTariff.ALL_MONTHS,
		TemporalRangesTariff.ALL_DAYS_OF_MONTH,
		TemporalRangesTariff.ALL_DAYS_OF_WEEK,
		TemporalRangesTariff.ALL_MINUTES_OF_DAY,
		[new TariffRate("a", 1.23), new TariffRate("a", 2.34)]
	);

	t.like(
		tt.rates,
		{
			a: { id: "a", amount: 2.34 },
		},
		"duplicate rate IDs override each other"
	);
});

test("TemporalRangesTariff:parse:en-US", (t) => {
	const tt = TemporalRangesTariff.parse(
		"en-US",
		"Jan-Dec",
		"1-31",
		"Mon-Sun",
		"0-24",
		[TariffRate.parse("en-US", "a", "1.23")]
	);

	t.like(
		tt,
		{
			monthRange: { min: 1, max: 12 },
			dayOfMonthRange: { min: 1, max: 31 },
			dayOfWeekRange: { min: 1, max: 7 },
			minuteOfDayRange: { min: 0, max: 1440 },
			rates: {
				a: { id: "a", amount: 1.23 },
			},
		},
		"range tariff values parsed"
	);
});

test("TemporalRangesTariff:parse:de", (t) => {
	const tt = TemporalRangesTariff.parse(
		"de",
		"Januar - Dezember",
		"1 - 31",
		"Montag - Freitag",
		"00:00 - 24:00",
		[TariffRate.parse("de", "Morgen behoben", "1,23")]
	);
	t.like(
		tt,
		{
			monthRange: { min: 1, max: 12 },
			dayOfMonthRange: { min: 1, max: 31 },
			dayOfWeekRange: { min: 1, max: 5 },
			minuteOfDayRange: { min: 0, max: 1440 },
			rates: {
				"Morgen behoben": { id: "Morgen behoben", amount: 1.23 },
			},
		},
		"range tariff values parsed"
	);
});

test("TemporalRangesTariff:parse:ja-JP", (t) => {
	const tt = TemporalRangesTariff.parse(
		"ja-JP",
		"1月～12月",
		"1-31",
		"月曜日～金曜日",
		"0-24",
		[TariffRate.parse("ja-JP", "午前固定", "1.23")]
	);

	t.like(
		tt,
		{
			monthRange: { min: 1, max: 12 },
			dayOfMonthRange: { min: 1, max: 31 },
			dayOfWeekRange: { min: 1, max: 5 },
			minuteOfDayRange: { min: 0, max: 1440 },
			rates: {
				午前固定: { id: "午前固定", amount: 1.23 },
			},
		},
		"range tariff values parsed"
	);
});

test("TemporalRangesTariff:parse:ja-JP:short", (t) => {
	const tt = TemporalRangesTariff.parse(
		"ja-JP",
		"1 - 12",
		"1-31",
		"月 - 金",
		"0-24",
		[new TariffRate("a", 1.23)]
	);

	t.like(
		tt,
		{
			monthRange: { min: 1, max: 12 },
			dayOfMonthRange: { min: 1, max: 31 },
			dayOfWeekRange: { min: 1, max: 5 },
			minuteOfDayRange: { min: 0, max: 1440 },
			rates: {
				a: { id: "a", amount: 1.23 },
			},
		},
		"range tariff values parsed"
	);
});

test("TemporalRangesTariff:parse:en-US:bounds", (t) => {
	const tt = TemporalRangesTariff.parse("en-US", "*", "*", "*", "*", [
		new TariffRate("a", 1.23),
	]);

	t.like(
		tt,
		{
			monthRange: { min: 1, max: 12 },
			dayOfMonthRange: { min: 1, max: 31 },
			dayOfWeekRange: { min: 1, max: 7 },
			minuteOfDayRange: { min: 0, max: 1440 },
			rates: {
				a: { id: "a", amount: 1.23 },
			},
		},
		"range tariff values parsed"
	);
});

test("TemporalRangesTariff:parse:en-US:sparse", (t) => {
	const tt = TemporalRangesTariff.parse(
		"en-US",
		undefined,
		"*",
		undefined,
		"*",
		[new TariffRate("a", 1.23)]
	);

	t.like(
		tt,
		{
			monthRange: undefined,
			dayOfMonthRange: { min: 1, max: 31 },
			dayOfWeekRange: undefined,
			minuteOfDayRange: { min: 0, max: 1440 },
			rates: {
				a: { id: "a", amount: 1.23 },
			},
		},
		"range tariff values parsed"
	);
});

test("TemporalRangesTariff:formatRange:en-US:year", (t) => {
	const locale = "en-US";
	t.is(
		TemporalRangesTariff.formatRange(
			locale,
			ChronoField.YEAR,
			new IntRange(2000, 3000)
		),
		"2000 - 3000",
		"year range formatted"
	);
	t.is(
		TemporalRangesTariff.formatRange(
			locale,
			ChronoField.YEAR,
			new IntRange(2000, null)
		),
		"2000 - *",
		"unbounded max year range formatted"
	);
	t.is(
		TemporalRangesTariff.formatRange(
			locale,
			ChronoField.YEAR,
			new IntRange(null, 2000)
		),
		"* - 2000",
		"unbounded min year range formatted"
	);
	t.is(
		TemporalRangesTariff.formatRange(
			locale,
			ChronoField.YEAR,
			new IntRange(null, null)
		),
		"*",
		"unbounded year range formatted"
	);
});

test("TemporalRangesTariff:formatRange:year:delimiter", (t) => {
	const locale = "en-US";
	const opts: TemporalRangesTariffFormatOptions = {
		allValue: "!",
		unboundedValue: "~",
	};
	t.is(
		TemporalRangesTariff.formatRange(
			locale,
			ChronoField.YEAR,
			new IntRange(2000, 3000),
			opts
		),
		"2000 - 3000",
		"year range formatted"
	);
	t.is(
		TemporalRangesTariff.formatRange(
			locale,
			ChronoField.YEAR,
			new IntRange(2000, null),
			opts
		),
		"2000 - ~",
		"unbounded max year range formatted"
	);
	t.is(
		TemporalRangesTariff.formatRange(
			locale,
			ChronoField.YEAR,
			new IntRange(null, 2000),
			opts
		),
		"~ - 2000",
		"unbounded min year range formatted"
	);
	t.is(
		TemporalRangesTariff.formatRange(
			locale,
			ChronoField.YEAR,
			new IntRange(null, null),
			opts
		),
		"!",
		"unbounded year range formatted"
	);
});

test("TemporalRangesTariff:format:en-US:all", (t) => {
	const tt = new TemporalRangesTariff(
		TemporalRangesTariff.ALL_MONTHS,
		TemporalRangesTariff.ALL_DAYS_OF_MONTH,
		TemporalRangesTariff.ALL_DAYS_OF_WEEK,
		TemporalRangesTariff.ALL_MINUTES_OF_DAY,
		[new TariffRate("a", 1.23)]
	);
	const locale = "en-US";

	t.is(tt.format(locale, ChronoField.MONTH_OF_YEAR), "*", "bounds formatted");
	t.is(tt.format(locale, ChronoField.DAY_OF_MONTH), "*", "bounds formatted");
	t.is(tt.format(locale, ChronoField.DAY_OF_WEEK), "*", "bounds formatted");
	t.is(tt.format(locale, ChronoField.MINUTE_OF_DAY), "*", "bounds formatted");
});

test("TemporalRangesTariff:format:en-US:all:undefined", (t) => {
	const tt = new TemporalRangesTariff(
		undefined,
		undefined,
		undefined,
		undefined,
		[new TariffRate("a", 1.23)]
	);
	const locale = "en-US";

	t.is(tt.format(locale, ChronoField.MONTH_OF_YEAR), "*", "bounds formatted");
	t.is(tt.format(locale, ChronoField.DAY_OF_MONTH), "*", "bounds formatted");
	t.is(tt.format(locale, ChronoField.DAY_OF_WEEK), "*", "bounds formatted");
	t.is(tt.format(locale, ChronoField.MINUTE_OF_DAY), "*", "bounds formatted");
});

test("TemporalRangesTariff:format:en-US:all:custom", (t) => {
	const tt = new TemporalRangesTariff(
		TemporalRangesTariff.ALL_MONTHS,
		TemporalRangesTariff.ALL_DAYS_OF_MONTH,
		TemporalRangesTariff.ALL_DAYS_OF_WEEK,
		TemporalRangesTariff.ALL_MINUTES_OF_DAY,
		[new TariffRate("a", 1.23)]
	);
	const locale = "en-US";
	const opts: TemporalRangesTariffFormatOptions = { allValue: "ALL" };
	t.is(
		tt.format(locale, ChronoField.MONTH_OF_YEAR, opts),
		"ALL",
		"bounds formatted"
	);
	t.is(
		tt.format(locale, ChronoField.DAY_OF_MONTH, opts),
		"ALL",
		"bounds formatted"
	);
	t.is(
		tt.format(locale, ChronoField.DAY_OF_WEEK, opts),
		"ALL",
		"bounds formatted"
	);
	t.is(
		tt.format(locale, ChronoField.MINUTE_OF_DAY, opts),
		"ALL",
		"bounds formatted"
	);
});

test("TemporalRangesTariff:format:en-US", (t) => {
	const tt = new TemporalRangesTariff(
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	const locale = "en-US";

	t.is(
		tt.format(locale, ChronoField.MONTH_OF_YEAR),
		"Jan - Mar",
		"months formatted"
	);
	t.is(
		TemporalRangesTariff.formatRange(
			locale,
			ChronoField.MONTH_OF_YEAR,
			new IntRange(1, 11)
		),
		"Jan - Nov",
		"months formatted statically"
	);
	t.is(
		tt.format(locale, ChronoField.DAY_OF_MONTH),
		"4 - 6",
		"days formatted"
	);
	t.is(
		TemporalRangesTariff.formatRange(
			locale,
			ChronoField.DAY_OF_MONTH,
			new IntRange(1, 12)
		),
		"1 - 12",
		"days formatted statically"
	);
	t.is(
		tt.format(locale, ChronoField.DAY_OF_WEEK),
		"Fri - Sun",
		"weedays formatted"
	);
	t.is(
		TemporalRangesTariff.formatRange(
			locale,
			ChronoField.DAY_OF_WEEK,
			new IntRange(1, 6)
		),
		"Mon - Sat",
		"weekdays formatted statically"
	);
	t.is(
		tt.format(locale, ChronoField.MINUTE_OF_DAY),
		"14:05 - 19:05",
		"minutes formatted"
	);
	t.is(
		TemporalRangesTariff.formatRange(
			locale,
			ChronoField.MINUTE_OF_DAY,
			new IntRange(0, 720)
		),
		"00:00 - 12:00",
		"minutes formatted statically"
	);
});

test("TemporalRangesTariff:format:en-US:custom", (t) => {
	const tt = new TemporalRangesTariff(
		new IntRange(null, null),
		new IntRange(null, 6),
		new IntRange(5, null),
		new IntRange(845, null),
		[new TariffRate("a", 1.23)]
	);
	const locale = "en-US";
	const opts: TemporalRangesTariffFormatOptions = {
		allValue: "!",
		unboundedValue: "~",
	};

	t.is(
		tt.format(locale, ChronoField.MONTH_OF_YEAR, opts),
		"!",
		"months formatted"
	);
	t.is(
		TemporalRangesTariff.formatRange(
			locale,
			ChronoField.MONTH_OF_YEAR,
			new IntRange(1, 11)
		),
		"Jan - Nov",
		"months formatted statically"
	);
	t.is(
		tt.format(locale, ChronoField.DAY_OF_MONTH, opts),
		"1 - 6",
		"days formatted"
	);
	t.is(
		TemporalRangesTariff.formatRange(
			locale,
			ChronoField.DAY_OF_MONTH,
			new IntRange(1, 12),
			opts
		),
		"1 - 12",
		"days formatted statically"
	);
	t.is(
		tt.format(locale, ChronoField.DAY_OF_WEEK, opts),
		"Fri - Sun",
		"weedays formatted"
	);
	t.is(
		TemporalRangesTariff.formatRange(
			locale,
			ChronoField.DAY_OF_WEEK,
			new IntRange(1, 6),
			opts
		),
		"Mon - Sat",
		"weekdays formatted statically"
	);
	t.is(
		tt.format(locale, ChronoField.MINUTE_OF_DAY, opts),
		"14:05 - 24:00",
		"minutes formatted"
	);
	t.is(
		TemporalRangesTariff.formatRange(
			locale,
			ChronoField.MINUTE_OF_DAY,
			new IntRange(0, 720),
			opts
		),
		"00:00 - 12:00",
		"minutes formatted statically"
	);
});

test("TemporalRangesTariff:format:en-US:wholeHours", (t) => {
	const tt = new TemporalRangesTariff(
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	const locale = "en-US";
	const opts: TemporalRangesTariffFormatOptions = { wholeHours: true };
	t.is(
		tt.format(locale, ChronoField.MINUTE_OF_DAY, opts),
		"14 - 19",
		"minutes formatted as whole hours"
	);
});

test("TemporalRangesTariff:format:en-US:unsupportedRange", (t) => {
	const tt = new TemporalRangesTariff(
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	const locale = "en-US";
	const opts: TemporalRangesTariffFormatOptions = { wholeHours: true };
	t.throws(
		() => {
			tt.format(locale, -1 as ChronoField, opts);
		},
		{ instanceOf: TypeError },
		"TypeError thrown for unsupported ChronoField"
	);
});

test("TemporalRangesTariff:format:ja-JP", (t) => {
	const tt = new TemporalRangesTariff(
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	const locale = "ja-JP";

	t.is(
		tt.format(locale, ChronoField.MONTH_OF_YEAR),
		"1月～3月",
		"months formatted"
	);
	t.is(tt.format(locale, ChronoField.DAY_OF_MONTH), "4～6", "days formatted");
	t.is(
		tt.format(locale, ChronoField.DAY_OF_WEEK),
		"金～日",
		"weedays formatted"
	);
	t.is(
		tt.format(locale, ChronoField.MINUTE_OF_DAY),
		"14:05～19:05",
		"minutes formatted"
	);
});

test("TemporalRangesTariff:compare:same", (t) => {
	const tt = new TemporalRangesTariff(
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	t.is(tt.compareTo(tt), 0);
});

test("TemporalRangesTariff:compare:undefined", (t) => {
	const tt = new TemporalRangesTariff(
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	t.is(tt.compareTo(undefined), 1);
});

test("TemporalRangesTariff:compare:month", (t) => {
	const tt1 = new TemporalRangesTariff(
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	const tt2 = new TemporalRangesTariff(
		new IntRange(4, 6),
		new IntRange(4, 6),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	t.is(tt1.compareTo(tt2), -1, "ordered by month");
	t.is(tt2.compareTo(tt1), 1, "ordered by month");
});

test("TemporalRangesTariff:compare:day", (t) => {
	const tt1 = new TemporalRangesTariff(
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	const tt2 = new TemporalRangesTariff(
		new IntRange(1, 3),
		new IntRange(7, 10),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	t.is(tt1.compareTo(tt2), -1, "ordered by day");
	t.is(tt2.compareTo(tt1), 1, "ordered by day");
});

test("TemporalRangesTariff:compare:weekday", (t) => {
	const tt1 = new TemporalRangesTariff(
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(1, 5),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	const tt2 = new TemporalRangesTariff(
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(6, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	t.is(tt1.compareTo(tt2), -1, "ordered by weekday");
	t.is(tt2.compareTo(tt1), 1, "ordered by weekday");
});

test("TemporalRangesTariff:compare:time", (t) => {
	const tt1 = new TemporalRangesTariff(
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(1, 5),
		new IntRange(0, 845),
		[new TariffRate("a", 1.23)]
	);
	const tt2 = new TemporalRangesTariff(
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(1, 5),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	t.is(tt1.compareTo(tt2), -1, "ordered by time");
	t.is(tt2.compareTo(tt1), 1, "ordered by time");
});
