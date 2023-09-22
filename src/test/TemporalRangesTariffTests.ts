import test from "ava";
import IntRange from "../main/IntRange.js";
import TemporalRangesTariff from "../main/TemporalRangesTariff.js";
import TariffRate from "../main/TariffRate.js";

test("TemporalRangesTariff:Construct", (t) => {
	const monthRange = new IntRange(1, 12);
	const dayOfMonthRange = new IntRange(1, 31);
	const dayOfWeekRange = new IntRange(1, 7);
	const minuteOfDayRange = new IntRange(0, 1440);

	const tt = new TemporalRangesTariff(
		monthRange,
		dayOfMonthRange,
		dayOfWeekRange,
		minuteOfDayRange,
		[new TariffRate("a", "1.23", "b")]
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
		[new TariffRate("a", "1.23", "b")]
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
		[new TariffRate("a", "1.23", "b")]
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
		[new TariffRate("a", "1.23", "b")]
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
		[new TariffRate("a", "1.23", "b")]
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
		[new TariffRate("a", "1.23", "b"), new TariffRate("b", "2.34", "c")]
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
		[new TariffRate("a", "1.23", "b")]
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
		[new TariffRate("a", "1.23", "b")]
	);

	t.like(tt.rates, { a: { id: "a", description: "b", amount: "1.23" } });
});

test("TemporalRangesTariff:rates:multi", (t) => {
	const tt = new TemporalRangesTariff(
		TemporalRangesTariff.ALL_MONTHS,
		TemporalRangesTariff.ALL_DAYS_OF_MONTH,
		TemporalRangesTariff.ALL_DAYS_OF_WEEK,
		TemporalRangesTariff.ALL_MINUTES_OF_DAY,
		[new TariffRate("a", "1.23", "b"), new TariffRate("b", "2.34", "c")]
	);

	t.like(tt.rates, {
		a: { id: "a", description: "b", amount: "1.23" },
		b: { id: "b", description: "c", amount: "2.34" },
	});
});

test("TemporalRangesTariff:rates:clash", (t) => {
	const tt = new TemporalRangesTariff(
		TemporalRangesTariff.ALL_MONTHS,
		TemporalRangesTariff.ALL_DAYS_OF_MONTH,
		TemporalRangesTariff.ALL_DAYS_OF_WEEK,
		TemporalRangesTariff.ALL_MINUTES_OF_DAY,
		[new TariffRate("a", "1.23", "b"), new TariffRate("a", "2.34", "c")]
	);

	t.like(
		tt.rates,
		{
			a: { id: "a", description: "c", amount: "2.34" },
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
		[new TariffRate("a", "1.23")]
	);

	t.like(
		tt,
		{
			monthRange: { min: 1, max: 12 },
			dayOfMonthRange: { min: 1, max: 31 },
			dayOfWeekRange: { min: 1, max: 7 },
			minuteOfDayRange: { min: 0, max: 1440 },
			rates: {
				a: { id: "a", amount: "1.23" },
			},
		},
		"range tariff values parsed"
	);
});

test("TemporalRangesTariff:parse:en-US:bounds", (t) => {
	const tt = TemporalRangesTariff.parse("en-US", "*", "*", "*", "*", [
		new TariffRate("a", "1.23"),
	]);

	t.like(
		tt,
		{
			monthRange: { min: 1, max: 12 },
			dayOfMonthRange: { min: 1, max: 31 },
			dayOfWeekRange: { min: 1, max: 7 },
			minuteOfDayRange: { min: 0, max: 1440 },
			rates: {
				a: { id: "a", amount: "1.23" },
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
		[new TariffRate("a", "1.23")]
	);

	t.like(
		tt,
		{
			monthRange: undefined,
			dayOfMonthRange: { min: 1, max: 31 },
			dayOfWeekRange: undefined,
			minuteOfDayRange: { min: 0, max: 1440 },
			rates: {
				a: { id: "a", amount: "1.23" },
			},
		},
		"range tariff values parsed"
	);
});
