import test from "ava";
import YearTemporalRangesTariff from "../main/YearTemporalRangesTariff.js";
import YearTemporalRangesTariffSchedule from "../main/YearTemporalRangesTariffSchedule.js";
import TariffRate from "../main/TariffRate.js";

function ruleset01(): YearTemporalRangesTariff[] {
	// weekdays before noon
	const t1 = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2023",
		"Jan-Dec",
		"1-31",
		"Mon-Fri",
		"0-12",
		[new TariffRate("Weekday AM", 1)]
	);

	// weekend all day
	const t2 = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2023",
		"Jan-Dec",
		"1-31",
		"Sat-Sun",
		"0-24",
		[new TariffRate("Weekend", 2)]
	);

	// all days after noon (overlaps t2)
	const t3 = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2023",
		"Jan-Dec",
		"1-31",
		"Mon-Sun",
		"12-24",
		[new TariffRate("PM", 3)]
	);

	// weekdays before noon
	const t1y2 = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2022",
		"Jan-Dec",
		"1-31",
		"Mon-Fri",
		"0-12",
		[new TariffRate("Weekday AM", 1)]
	);

	// weekend all day
	const t2y2 = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2022",
		"Jan-Dec",
		"1-31",
		"Sat-Sun",
		"0-24",
		[new TariffRate("Weekend", 2)]
	);

	// all days after noon (overlaps t2)
	const t3y2 = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2022",
		"Jan-Dec",
		"1-31",
		"Mon-Sun",
		"12-24",
		[new TariffRate("PM", 3)]
	);
	return [t1, t2, t3, t1y2, t2y2, t3y2];
}

test("YearTemporalRangesTariffSchedule:construct:undefined", (t) => {
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
});

test("YearTemporalRangesTariffSchedule:construct:single", (t) => {
	const rules = ruleset01();
	const s = new YearTemporalRangesTariffSchedule(rules);
	t.is(s.rules, rules, "rules from constructor arg");
	t.is(s.options, undefined, "no options defined");
	t.false(s.multipleMatch, "multipleMatch from constructor arg");
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
});
