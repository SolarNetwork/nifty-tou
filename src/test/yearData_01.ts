import YearTemporalRangesTariff from "../main/YearTemporalRangesTariff.js";
import TariffRate from "../main/TariffRate.js";

/**
 * A schedule for years 2023, 2024.
 *
 * @returns the rule set
 */
export function ruleset01(): YearTemporalRangesTariff[] {
	// weekdays before noon
	const t1 = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2024",
		"Jan-Dec",
		"1-31",
		"Mon-Fri",
		"0-12",
		[new TariffRate("Weekday AM", 1)]
	);

	// weekend all day
	const t2 = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2024",
		"Jan-Dec",
		"1-31",
		"Sat-Sun",
		"0-24",
		[new TariffRate("Weekend", 2)]
	);

	// all days after noon (overlaps t2)
	const t3 = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2024",
		"Jan-Dec",
		"1-31",
		"Mon-Sun",
		"12-24",
		[new TariffRate("PM", 3)]
	);

	// weekdays before noon
	const t1y2 = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2023",
		"Jan-Dec",
		"1-31",
		"Mon-Fri",
		"0-12",
		[new TariffRate("Weekday AM", 4)]
	);

	// weekend all day
	const t2y2 = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2023",
		"Jan-Dec",
		"1-31",
		"Sat-Sun",
		"0-24",
		[new TariffRate("Weekend", 5)]
	);

	// all days after noon (overlaps t2)
	const t3y2 = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2023",
		"Jan-Dec",
		"1-31",
		"Mon-Sun",
		"12-24",
		[new TariffRate("PM", 6)]
	);
	return [t1, t2, t3, t1y2, t2y2, t3y2];
}

/**
 * A schedule with a year gap: 2022, 2024.
 *
 * @returns the ruleset
 */
export function ruleset02(): YearTemporalRangesTariff[] {
	// weekdays before noon
	const t1 = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2024",
		"Jan-Dec",
		"1-31",
		"Mon-Fri",
		"0-12",
		[new TariffRate("Weekday AM", 1)]
	);

	// weekend all day
	const t2 = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2024",
		"Jan-Dec",
		"1-31",
		"Sat-Sun",
		"0-24",
		[new TariffRate("Weekend", 2)]
	);

	// all days after noon (overlaps t2)
	const t3 = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2024",
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
		[new TariffRate("Weekday AM", 4)]
	);

	// weekend all day
	const t2y2 = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2022",
		"Jan-Dec",
		"1-31",
		"Sat-Sun",
		"0-24",
		[new TariffRate("Weekend", 5)]
	);

	// all days after noon (overlaps t2)
	const t3y2 = YearTemporalRangesTariff.parseYears(
		"en-US",
		"2022",
		"Jan-Dec",
		"1-31",
		"Mon-Sun",
		"12-24",
		[new TariffRate("PM", 6)]
	);
	return [t1, t2, t3, t1y2, t2y2, t3y2];
}
