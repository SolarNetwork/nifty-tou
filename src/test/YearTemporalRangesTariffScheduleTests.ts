import test from "ava";
import YearTemporalRangesTariff from "../main/YearTemporalRangesTariff.js";
import YearTemporalRangesTariffSchedule from "../main/YearTemporalRangesTariffSchedule.js";
import TariffRate from "../main/TariffRate.js";
import { ruleset01, ruleset02 } from "./yearData_01.js";

test("YearTemporalRangesTariffSchedule:construct:undefined", (t) => {
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const s = new YearTemporalRangesTariffSchedule(undefined, undefined);
	t.deepEqual(
		s.rules,
		[],
		"undefined rules from constructor arg resolved as empty array"
	);
	t.is(s.options, undefined, "no options defined");
	t.false(
		s.multipleMatch,
		"undefined multipleMatch from constructor arg resolved as false"
	);
	t.false(
		s.yearExtend,
		"undefined yearExtend from constructor arg resolved as false"
	);
});

test("YearTemporalRangesTariffSchedule:construct:single", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules);
	t.is(s.rules, rules, "rules from constructor arg");
	t.is(s.options, undefined, "no options defined");
	t.false(s.multipleMatch, "multipleMatch from constructor arg");
	t.false(s.yearExtend, "yearExtend from constructor arg");
});

test("YearTemporalRangesTariffSchedule:construct:frozen", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules);
	t.true(Object.isFrozen(s.rules), "rules are froze");
});

test("YearTemporalRangesTariffSchedule:construct:multi", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules, true);
	t.is(s.rules, rules, "rules from constructor arg");
	t.like(s.options, { multipleMatch: true }, "options defined");
	t.true(s.multipleMatch, "multipleMatch from constructor arg");
	t.false(s.yearExtend, "yearExtend from constructor arg");
});

test("YearTemporalRangesTariffSchedule:construct:options", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules, {
		multipleMatch: true,
		yearExtend: true,
	});
	t.is(s.rules, rules, "rules from constructor arg");
	t.like(s.options, { multipleMatch: true }, "options defined");
	t.true(s.multipleMatch, "multipleMatch from constructor arg");
	t.true(s.yearExtend, "yearExtend from constructor arg");
});

test("YearTemporalRangesTariffSchedule:firstMatch:single:noMatch", (t) => {
	const s = new YearTemporalRangesTariffSchedule([]);

	// 1 Jan 2024 is a Monday
	const m = s.firstMatch(new Date("2024-01-06T12:00"));
	t.deepEqual(m, undefined, "no match returns empty array");
});

test("YearTemporalRangesTariffSchedule:firstMatch:single:match", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules);

	// 1 Jan 2024 is a Monday
	const m = s.firstMatch(new Date("2024-01-01T00:00"));
	t.is(m, rules[0], "Monday @ midnight matches Weekday AM");
});

test("YearTemporalRangesTariffSchedule:matches:single:oneMatchOnly", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules);

	// 1 Jan 2024 is a Monday
	const m = s.matches(new Date("2024-01-01T00:00"));
	t.is(m.length, 1, "first match returned");
	t.is(m[0], rules[0], "Monday @ midnight matches only Weekday AM");
});

test("YearTemporalRangesTariffSchedule:matches:single:multipleMatches", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules);

	// 1 Jan 2024 is a Monday
	const m = s.matches(new Date("2024-01-06T12:00"));
	t.is(m.length, 1, "first match returned");
	t.is(m[0], rules[1], "Saturday @ noon matches Weekend first, ignoring PM");
});

test("YearTemporalRangesTariffSchedule:matches:single:multipleMatches:explicitOption", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules, false);

	// 1 Jan 2024 is a Monday
	const m = s.matches(new Date("2024-01-06T12:00"));
	t.is(m.length, 1, "first match returned");
	t.is(m[0], rules[1], "Saturday @ noon matches Weekend first, ignoring PM");
});

test("YearTemporalRangesTariffSchedule:matches:single:multipleMatches:explicitOptions", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules, {
		multipleMatch: false,
	});

	// 1 Jan 2024 is a Monday
	const m = s.matches(new Date("2024-01-06T12:00"));
	t.is(m.length, 1, "first match returned");
	t.is(m[0], rules[1], "Saturday @ noon matches Weekend first, ignoring PM");
});

test("YearTemporalRangesTariffSchedule:matches:multi:oneMatches", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules, true);

	// 1 Jan 2024 is a Monday
	const m = s.matches(new Date("2024-01-01T00:00"));
	t.is(m.length, 1, "all matches returned");
	t.is(m[0], rules[0], "Monday @ midnight matches Weekday AM only");
});

test("YearTemporalRangesTariffSchedule:matches:multi:multipleMatches", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules, true);

	// 1 Jan 2024 is a Monday
	const m = s.matches(new Date("2024-01-06T12:00"));
	t.is(m.length, 2, "all matches returned");
	t.is(m[0], rules[1], "Saturday @ noon matches Weekend first");
	t.is(m[1], rules[2], "Saturday @ noon matches PM second");
});

test("YearTemporalRangesTariffSchedule:matches:multi:multipleMatches:explicitOptions", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules, {
		multipleMatch: true,
	});

	// 1 Jan 2024 is a Monday
	const m = s.matches(new Date("2024-01-06T12:00"));
	t.is(m.length, 2, "all matches returned");
	t.is(m[0], rules[1], "Saturday @ noon matches Weekend first");
	t.is(m[1], rules[2], "Saturday @ noon matches PM second");
});

test("YearTemporalRangesTariffSchedule:resolve:noMatches", (t) => {
	const s = new YearTemporalRangesTariffSchedule([]);

	// 1 Jan 2024 is a Monday
	const r = s.resolve(new Date("2024-01-06T12:00"));
	t.deepEqual(r, {}, "empty rates record returned");
});

test("YearTemporalRangesTariffSchedule:resolve:oneMatch", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules, true);

	// 1 Jan 2024 is a Monday
	const r = s.resolve(new Date("2024-01-01T00:00"));
	t.is(
		r,
		rules[0].rates,
		"Monday @ midnight resolves Weekday AM tariff rates"
	);
});

test("YearTemporalRangesTariffSchedule:resolve:multipleMatches", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules, true);

	// 1 Jan 2024 is a Monday
	const r = s.resolve(new Date("2024-01-06T12:00"));
	t.like(
		r,
		{ Weekend: { amount: 2 }, PM: { amount: 3 } },
		"Saturday @ noon resolves merged Weekend and PM tariff rates"
	);
});

test("YearTemporalRangesTariffSchedule:year:resolve:multipleMatches", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules, true);

	// 2 Jan 2023 is a Monday
	const r = s.resolve(new Date("2023-01-07T12:00"));
	t.like(
		r,
		{ Weekend: { amount: 5 }, PM: { amount: 6 } },
		"Saturday @ noon resolves merged Weekend and PM tariff rates"
	);
});

test("YearTemporalRangesTariffSchedule:year:resolve:future", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules);

	// 6 Jan 2025 is a Monday
	const r = s.resolve(new Date("2025-01-06T12:00"));
	t.deepEqual(r, {}, "No rates match 2025");
});

test("YearTemporalRangesTariffSchedule:year:resolve:future:yearExtend", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules, {
		multipleMatch: false,
		yearExtend: true,
	});

	// 6 Jan 2025 is a Monday
	// 6 Jan 2024 is a Saturday
	const r = s.resolve(new Date("2025-01-06T12:00"));
	t.like(
		r,
		{ Weekend: { amount: 2 } },
		"Saturday @ noon resolves to 2024 Weekend rate"
	);
});

test("YearTemporalRangesTariffSchedule:year:resolve:future:yearExtend:noYearCriteria", (t) => {
	const t1 = YearTemporalRangesTariff.parseYears(
		"en-US",
		undefined,
		"Jan-Dec",
		"1-31",
		"Mon-Sun",
		"0-12",
		[new TariffRate("AM", 1)]
	);
	const rules = [t1];
	const s = new YearTemporalRangesTariffSchedule(rules, {
		multipleMatch: false,
		yearExtend: true,
	});

	// 6 Jan 2025 is a Monday
	let r = s.resolve(new Date("2025-01-06T00:00"));
	t.like(r, { AM: { amount: 1 } }, "2025 @ midnight resolves to AM rate");

	r = s.resolve(new Date("2025-01-06T13:00"));
	t.deepEqual(r, {}, "2025 @ 1pm resolves to nothing");

	r = s.resolve(new Date("2023-01-01T00:00"));
	t.like(r, { AM: { amount: 1 } }, "2023 @ midnight resolves to AM rate");
});

test("YearTemporalRangesTariffSchedule:year:resolve:past:yearExtend", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules, {
		multipleMatch: false,
		yearExtend: true,
	});

	// 6 Jan 2023 is a Friday
	const r = s.resolve(new Date("2023-01-06T12:00"));
	t.like(
		r,
		{ PM: { amount: 6 } },
		"Friday @ noon resolves to 2023 Weekend rate"
	);
});

test("YearTemporalRangesTariffSchedule:year:resolve:future:multipleMatches:yearExtend", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules, {
		multipleMatch: true,
		yearExtend: true,
	});

	// 6 Jan 2025 is a Monday
	// 6 Jan 2024 is a Saturday
	const r = s.resolve(new Date("2025-01-06T12:00"));
	t.like(
		r,
		{ Weekend: { amount: 2 }, PM: { amount: 3 } },
		"2024 Saturday @ noon resolves merged 2024 Weekend and PM tariff rates"
	);
});

test("YearTemporalRangesTariffSchedule:year:resolve:future:utc", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules);

	// 6 Jan 2025 is a Monday
	const r = s.resolve(new Date("2025-01-06T12:00Z"), true);
	t.deepEqual(r, {}, "No rates match 2025");
});

test("YearTemporalRangesTariffSchedule:year:resolve:future:yearExtend:utc", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules, {
		multipleMatch: false,
		yearExtend: true,
	});

	// 6 Jan 2025 is a Monday
	// 6 Jan 2024 is a Saturday
	const r = s.resolve(new Date("2025-01-06T12:00Z"), true);
	t.like(
		r,
		{ Weekend: { amount: 2 } },
		"Saturday @ noon resolves to 2024 Weekend rate"
	);
});

test("YearTemporalRangesTariffSchedule:year:resolve:past:yearExtend:utc", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules, {
		multipleMatch: false,
		yearExtend: true,
	});

	// 6 Jan 2023 is a Friday
	const r = s.resolve(new Date("2023-01-06T12:00Z"), true);
	t.like(
		r,
		{ PM: { amount: 6 } },
		"Friday @ noon resolves to 2023 Weekend rate"
	);
});

test("YearTemporalRangesTariffSchedule:year:resolve:future:multipleMatches:yearExtend:utc", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules, {
		multipleMatch: true,
		yearExtend: true,
	});

	// 6 Jan 2025 is a Monday
	// 6 Jan 2024 is a Saturday
	const r = s.resolve(new Date("2025-01-06T12:00Z"), true);
	t.like(
		r,
		{ Weekend: { amount: 2 }, PM: { amount: 3 } },
		"2024 Saturday @ noon resolves merged 2024 Weekend and PM tariff rates"
	);
});

test("YearTemporalRangesTariffSchedule:matches:multi:multipleMatches:yearExtend:gapYear", (t) => {
	const rules = ruleset02();
	const s = new YearTemporalRangesTariffSchedule(rules, {
		multipleMatch: true,
		yearExtend: true,
	});

	// 1 Jan 2022 is a Saturday
	const m = s.matches(new Date("2023-01-01T12:00"));
	t.is(m.length, 2, "all matches returned");
	t.is(m[0], rules[4], "Saturday @ noon matches 2022 Weekend first");
	t.is(m[1], rules[5], "Saturday @ noon matches 2022 PM second");
});
