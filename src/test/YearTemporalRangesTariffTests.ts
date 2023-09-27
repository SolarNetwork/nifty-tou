import test from "ava";

import {
	ALL_MONTHS,
	ALL_DAYS_OF_MONTH,
	ALL_DAYS_OF_WEEK,
	ALL_MINUTES_OF_DAY,
} from "../main/ChronoFieldFormatter.js";
import { default as IntRange, UNBOUNDED_RANGE } from "../main/IntRange.js";
import YearTemporalRangesTariff from "../main/YearTemporalRangesTariff.js";
import TariffRate from "../main/TariffRate.js";

test("YearTemporalRangesTariff:construct", (t) => {
	const yearRange = new IntRange(2022, 2023);
	const monthRange = new IntRange(1, 12);
	const dayOfMonthRange = new IntRange(1, 31);
	const dayOfWeekRange = new IntRange(1, 7);
	const minuteOfDayRange = new IntRange(0, 1440);

	const tt = new YearTemporalRangesTariff(
		yearRange,
		monthRange,
		dayOfMonthRange,
		dayOfWeekRange,
		minuteOfDayRange,
		[new TariffRate("a", 1.23)]
	);
	t.is(tt.yearRange, yearRange, "yearRange from constructor arg");
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

test("YearTemporalRangesTariff:toString", (t) => {
	const tt = new YearTemporalRangesTariff(
		new IntRange(2022, 2023),
		new IntRange(1, 6),
		new IntRange(1, 15),
		new IntRange(1, 4),
		new IntRange(0, 720),
		[new TariffRate("a", 1.23)]
	);

	t.is(
		tt.toString(),
		"YearTemporalRangesTariff{y=[2022..2023],m=[1..6],dom=[1..15],dow=[1..4],mod=[0..720],r=[TariffRate{a,1.23}]}"
	);
});

test("YearTemporalRangesTariff:applies:years", (t) => {
	const yearRange = new IntRange(2024, 2024);
	const monthRange = new IntRange(1, 6);
	const dayOfMonthRange = new IntRange(1, 15);
	const dayOfWeekRange = new IntRange(1, 4);
	const minuteOfDayRange = new IntRange(0, 720);

	const tt = new YearTemporalRangesTariff(
		yearRange,
		monthRange,
		dayOfMonthRange,
		dayOfWeekRange,
		minuteOfDayRange,
		[new TariffRate("a", 1.23)]
	);

	// 1 Jan 2024 is Monday
	const d = new Date("2024-01-01T00:00");
	const d2 = new Date("2023-01-01T00:00");
	for (let h = 0; h < 24; h += 1) {
		for (let m = 0; m < 60; m += 1) {
			d.setHours(h, m);
			if (h < 12) {
				t.true(tt.appliesAt(d), `${d} applies at ${h}:${m}`);
			} else {
				t.false(tt.appliesAt(d), `${d} does not apply at ${h}:${m}`);
			}
			d2.setHours(h, m);
			t.false(tt.appliesAt(d2), `${d2} never applies in wrong year`);
		}
	}
});

test("YearTemporalRangesTariff:applies:utc", (t) => {
	const yearRange = new IntRange(2024, null);
	const monthRange = new IntRange(1, 6);
	const dayOfMonthRange = new IntRange(1, 15);
	const dayOfWeekRange = new IntRange(1, 4);
	const minuteOfDayRange = new IntRange(0, 720);

	const tt = new YearTemporalRangesTariff(
		yearRange,
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

test("YearTemporalRangesTariff:parse:en-US", (t) => {
	const tt = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2000-2020",
		"Jan-Dec",
		"1-31",
		"Mon-Sun",
		"0-24",
		[TariffRate.parse("en-US", "a", "1.23")]
	);

	t.like(
		tt,
		{
			yearRange: { min: 2000, max: 2020 },
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

test("YearTemporalRangesTariff:parse:en-US:unbounded", (t) => {
	const tt = YearTemporalRangesTariff.parseYears(
		"en-US",
		"*",
		"*",
		"*",
		"*",
		"*",
		[TariffRate.parse("en-US", "a", "1.23")]
	);

	t.is(tt.yearRange, UNBOUNDED_RANGE);
	t.is(tt.monthRange, ALL_MONTHS);
	t.is(tt.dayOfMonthRange, ALL_DAYS_OF_MONTH);
	t.is(tt.dayOfWeekRange, ALL_DAYS_OF_WEEK);
	t.is(tt.minuteOfDayRange, ALL_MINUTES_OF_DAY);
});

test("YearTemporalRangesTariff:compare:same", (t) => {
	const tt = new YearTemporalRangesTariff(
		IntRange.of(2022),
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	t.is(tt.compareTo(tt), 0);
});

test("YearTemporalRangesTariff:compare:undefined", (t) => {
	const tt = new YearTemporalRangesTariff(
		IntRange.of(2022),
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	t.is(tt.compareTo(undefined), 1);
});

test("YearTemporalRangesTariff:compare:year", (t) => {
	const tt1 = new YearTemporalRangesTariff(
		IntRange.of(2022),
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	const tt2 = new YearTemporalRangesTariff(
		IntRange.of(2023),
		new IntRange(4, 6),
		new IntRange(4, 6),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	t.is(tt1.compareTo(tt2), -1, "ordered by year");
	t.is(tt2.compareTo(tt1), 1, "ordered by year");
});

test("YearTemporalRangesTariff:compare:month", (t) => {
	const tt1 = new YearTemporalRangesTariff(
		IntRange.of(2022),
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	const tt2 = new YearTemporalRangesTariff(
		IntRange.of(2022),
		new IntRange(4, 6),
		new IntRange(4, 6),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	t.is(tt1.compareTo(tt2), -1, "ordered by month");
	t.is(tt2.compareTo(tt1), 1, "ordered by month");
});

test("YearTemporalRangesTariff:compare:day", (t) => {
	const tt1 = new YearTemporalRangesTariff(
		IntRange.of(2022),
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	const tt2 = new YearTemporalRangesTariff(
		IntRange.of(2022),
		new IntRange(1, 3),
		new IntRange(7, 10),
		new IntRange(5, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	t.is(tt1.compareTo(tt2), -1, "ordered by day");
	t.is(tt2.compareTo(tt1), 1, "ordered by day");
});

test("YearTemporalRangesTariff:compare:weekday", (t) => {
	const tt1 = new YearTemporalRangesTariff(
		IntRange.of(2022),
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(1, 5),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	const tt2 = new YearTemporalRangesTariff(
		IntRange.of(2022),
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(6, 7),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	t.is(tt1.compareTo(tt2), -1, "ordered by weekday");
	t.is(tt2.compareTo(tt1), 1, "ordered by weekday");
});

test("YearTemporalRangesTariff:compare:time", (t) => {
	const tt1 = new YearTemporalRangesTariff(
		IntRange.of(2022),
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(1, 5),
		new IntRange(0, 845),
		[new TariffRate("a", 1.23)]
	);
	const tt2 = new YearTemporalRangesTariff(
		IntRange.of(2022),
		new IntRange(1, 3),
		new IntRange(4, 6),
		new IntRange(1, 5),
		new IntRange(845, 1145),
		[new TariffRate("a", 1.23)]
	);
	t.is(tt1.compareTo(tt2), -1, "ordered by time");
	t.is(tt2.compareTo(tt1), 1, "ordered by time");
});

test("YearTemporalRangesTariff:applies:yearExtended", (t) => {
	const tt = new YearTemporalRangesTariff(
		IntRange.of(2024),
		ALL_MONTHS,
		ALL_DAYS_OF_MONTH,
		ALL_DAYS_OF_WEEK,
		ALL_MINUTES_OF_DAY,
		[new TariffRate("a", 1.23)]
	);

	const d = new Date("2024-01-01T00:00");
	t.true(tt.appliesAtYearExtended(d), "same year matches");

	const d2 = new Date("2025-01-01T00:00");
	t.true(tt.appliesAtYearExtended(d2), "future year year matches");

	const d3 = new Date("2023-01-01T00:00");
	t.false(tt.appliesAtYearExtended(d3), "past year year does not match");
});

test("YearTemporalRangesTariff:applies:yearExtended:unbounded", (t) => {
	const tt = new YearTemporalRangesTariff(
		new IntRange(null, 2024),
		ALL_MONTHS,
		ALL_DAYS_OF_MONTH,
		ALL_DAYS_OF_WEEK,
		ALL_MINUTES_OF_DAY,
		[new TariffRate("a", 1.23)]
	);

	const d = new Date("2024-01-01T00:00");
	t.true(tt.appliesAtYearExtended(d), "max year matches unbounded min");

	const d2 = new Date("2025-01-01T00:00");
	t.true(
		tt.appliesAtYearExtended(d2),
		"future year year matches unbounded min"
	);

	const d3 = new Date("2023-01-01T00:00");
	t.true(tt.appliesAtYearExtended(d3), "past year matches unbounded min");
});
