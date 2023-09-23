import test from "ava";
import TemporalRangesTariff from "../main/TemporalRangesTariff.js";
import TemporalRangesTariffSchedule from "../main/TemporalRangesTariffSchedule.js";
import TariffRate from "../main/TariffRate.js";

function ruleset01(): TemporalRangesTariff[] {
	// weekdays before noon
	const t1 = TemporalRangesTariff.parse(
		"en-US",
		"Jan-Dec",
		"1-31",
		"Mon-Fri",
		"0-12",
		[new TariffRate("Weekday AM", 1)]
	);

	// weekend all day
	const t2 = TemporalRangesTariff.parse(
		"en-US",
		"Jan-Dec",
		"1-31",
		"Sat-Sun",
		"0-24",
		[new TariffRate("Weekend", 2)]
	);

	// all days after noon (overlaps t2)
	const t3 = TemporalRangesTariff.parse(
		"en-US",
		"Jan-Dec",
		"1-31",
		"Mon-Sun",
		"12-24",
		[new TariffRate("PM", 3)]
	);
	return [t1, t2, t3];
}

test("TemporalRangesSchedule:construct:undefined", (t) => {
	const s = new TemporalRangesTariffSchedule(undefined, undefined);
	t.deepEqual(
		s.rules,
		[],
		"undefined rules from constructor arg resolved as empty array"
	);
	t.false(
		s.multipleMatch,
		"undefined multipleMatch from constructor arg resolved as false"
	);
});

test("TemporalRangesSchedule:construct:single", (t) => {
	const rules = ruleset01();
	const s = new TemporalRangesTariffSchedule(rules);
	t.is(s.rules, rules, "rules from constructor arg");
	t.false(s.multipleMatch, "multipleMatch from constructor arg");
});

test("TemporalRangesSchedule:construct:frozen", (t) => {
	const rules = ruleset01();
	const s = new TemporalRangesTariffSchedule(rules);
	t.true(Object.isFrozen(s.rules), "rules are froze");
});

test("TemporalRangesSchedule:construct:multi", (t) => {
	const rules = ruleset01();
	const s = new TemporalRangesTariffSchedule(rules, true);
	t.is(s.rules, rules, "rules from constructor arg");
	t.true(s.multipleMatch, "multipleMatch from constructor arg");
});

test("TemporalRangesSchedule:firstMatch", (t) => {
	const rules = ruleset01();
	const s = new TemporalRangesTariffSchedule(rules);

	// 1 Jan 2024 is a Monday
	t.is(
		s.firstMatch(new Date("2024-01-01T00:00")),
		rules[0],
		"Monday @ midnight matches first Weekday AM"
	);
	t.is(
		s.firstMatch(new Date("2024-01-01T12:00")),
		rules[2],
		"Monday @ noon matches first PM"
	);
	t.is(
		s.firstMatch(new Date("2024-01-06T12:00")),
		rules[1],
		"Saturday @ noon matches first Weekend"
	);
});

test("TemporalRangesSchedule:firstMatch:single:noMatch", (t) => {
	const s = new TemporalRangesTariffSchedule([]);

	// 1 Jan 2024 is a Monday
	const m = s.firstMatch(new Date("2024-01-06T12:00"));
	t.deepEqual(m, undefined, "no match returns empty array");
});

test("TemporalRangesSchedule:matches:single:oneMatchOnly", (t) => {
	const rules = ruleset01();
	const s = new TemporalRangesTariffSchedule(rules);

	// 1 Jan 2024 is a Monday
	const m = s.matches(new Date("2024-01-01T00:00"));
	t.is(m.length, 1, "first match returned");
	t.is(m[0], rules[0], "Monday @ midnight matches only Weekday AM");
});

test("TemporalRangesSchedule:matches:single:multipleMatches", (t) => {
	const rules = ruleset01();
	const s = new TemporalRangesTariffSchedule(rules);

	// 1 Jan 2024 is a Monday
	const m = s.matches(new Date("2024-01-06T12:00"));
	t.is(m.length, 1, "first match returned");
	t.is(m[0], rules[1], "Saturday @ noon matches Weekend first, ignoring PM");
});

test("TemporalRangesSchedule:matches:multi:oneMatches", (t) => {
	const rules = ruleset01();
	const s = new TemporalRangesTariffSchedule(rules, true);

	// 1 Jan 2024 is a Monday
	const m = s.matches(new Date("2024-01-01T00:00"));
	t.is(m.length, 1, "all matches returned");
	t.is(m[0], rules[0], "Monday @ midnight matches Weekday AM only");
});

test("TemporalRangesSchedule:matches:multi:multipleMatches", (t) => {
	const rules = ruleset01();
	const s = new TemporalRangesTariffSchedule(rules, true);

	// 1 Jan 2024 is a Monday
	const m = s.matches(new Date("2024-01-06T12:00"));
	t.is(m.length, 2, "all matches returned");
	t.is(m[0], rules[1], "Saturday @ noon matches Weekend first");
	t.is(m[1], rules[2], "Saturday @ noon matches PM second");
});

test("TemporalRangesSchedule:resolve:noMatches", (t) => {
	const s = new TemporalRangesTariffSchedule([]);

	// 1 Jan 2024 is a Monday
	const r = s.resolve(new Date("2024-01-06T12:00"));
	t.deepEqual(r, {}, "empty rates record returned");
});

test("TemporalRangesSchedule:resolve:oneMatch", (t) => {
	const rules = ruleset01();
	const s = new TemporalRangesTariffSchedule(rules, true);

	// 1 Jan 2024 is a Monday
	const r = s.resolve(new Date("2024-01-01T00:00"));
	t.is(
		r,
		rules[0].rates,
		"Monday @ midnight resolves Weekday AM tariff rates"
	);
});

test("TemporalRangesSchedule:resolve:multipleMatches", (t) => {
	const rules = ruleset01();
	const s = new TemporalRangesTariffSchedule(rules, true);

	// 1 Jan 2024 is a Monday
	const r = s.resolve(new Date("2024-01-06T12:00"));
	t.like(
		r,
		{ Weekend: { amount: 2 }, PM: { amount: 3 } },
		"Saturday @ noon resolves merged Weekend and PM tariff rates"
	);
});
