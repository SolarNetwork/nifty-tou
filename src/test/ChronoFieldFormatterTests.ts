import test from "ava";
import {
	ALL_MONTHS,
	ALL_DAYS_OF_MONTH,
	ALL_DAYS_OF_WEEK,
	ALL_MINUTES_OF_DAY,
	ChronoField,
	ChronoFieldValue,
	ChronoFieldFormatter,
} from "../main/ChronoFieldFormatter.js";
import IntRange, {
	IntRangeFormatOptions,
	UNBOUNDED_RANGE,
} from "../main/IntRange.js";

test("ChronoFieldValue:construct", (t) => {
	const f = ChronoField.MONTH_OF_YEAR;
	const n = ["January", "Jan"];
	const v = 1;
	const o = new ChronoFieldValue(f, n, v);
	t.is(o.field, f, "field from constructor arg");
	t.is(o.name, n[0], "name from constructor arg");
	t.is(o.shortName, n[1], "shortName from constructor arg");
	t.is(o.value, v, "value from constructor arg");
});

test("ChronoFieldValue:construct:emptyNames", (t) => {
	const f = ChronoField.MONTH_OF_YEAR;
	const v = 1;
	t.throws(
		() => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			new ChronoFieldValue(f, undefined, v);
		},
		{ instanceOf: TypeError },
		"undefined names array throws TypeError"
	);
	t.throws(
		() => {
			new ChronoFieldValue(f, [], v);
		},
		{ instanceOf: TypeError },
		"empty names array throws TypeError"
	);
});

test("ChronoFieldValue:noShortName", (t) => {
	const f = ChronoField.MONTH_OF_YEAR;
	const n = ["January"];
	const v = 1;
	const o = new ChronoFieldValue(f, n, v);
	t.is(o.shortName, n[0], "full name returned when no short name avaialble");
});

test("ChronoFieldFormatter:construct:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);
	t.is(p.locale, locale, "locale from constructor arg");
});

test("ChronoFieldFormatter:factory:en-US", (t) => {
	const en = ChronoFieldFormatter.forLocale("en-US");
	t.is(
		ChronoFieldFormatter.forLocale("en-US"),
		en,
		"cached instance returned for previous locale"
	);
	t.not(
		new ChronoFieldFormatter("en-US"),
		en,
		"new instance differs from cached instance"
	);

	const fr = ChronoFieldFormatter.forLocale("fr-FR");
	t.is(
		ChronoFieldFormatter.forLocale("fr-FR"),
		fr,
		"cached instance returned for previous locale"
	);
	t.not(
		new ChronoFieldFormatter("fr-FR"),
		fr,
		"new instance differs from cached instance"
	);
});

test("ChronoFieldFormatter:parse:unknown", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.throws(
		() => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			p.parse(-1, "Jan");
		},
		{ instanceOf: TypeError },
		"invalid ChronoField value throws TypeError"
	);
});

test("ChronoFieldFormatter:parseRange:bounds", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.is(p.parseRange(ChronoField.YEAR, "*"), UNBOUNDED_RANGE);
	t.is(p.parseRange(ChronoField.MONTH_OF_YEAR, "*"), ALL_MONTHS);
	t.is(p.parseRange(ChronoField.DAY_OF_MONTH, "*"), ALL_DAYS_OF_MONTH);
	t.is(p.parseRange(ChronoField.DAY_OF_WEEK, "*"), ALL_DAYS_OF_WEEK);
	t.is(p.parseRange(ChronoField.MINUTE_OF_DAY, "*"), ALL_MINUTES_OF_DAY);
});

test("ChronoFieldFormatter:parseRange:bounds:custom", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	const opts: IntRangeFormatOptions = { unboundedValue: "!" };
	t.is(p.parseRange(ChronoField.YEAR, "!", opts), UNBOUNDED_RANGE);
	t.is(p.parseRange(ChronoField.MONTH_OF_YEAR, "!", opts), ALL_MONTHS);
	t.is(p.parseRange(ChronoField.DAY_OF_MONTH, "!", opts), ALL_DAYS_OF_MONTH);
	t.is(p.parseRange(ChronoField.DAY_OF_WEEK, "!", opts), ALL_DAYS_OF_WEEK);
	t.is(
		p.parseRange(ChronoField.MINUTE_OF_DAY, "!", opts),
		ALL_MINUTES_OF_DAY
	);
});

test("ChronoFieldFormatter:parse:custom", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	const opts: IntRangeFormatOptions = { unboundedValue: "!" };
	t.like(p.parse(ChronoField.YEAR, "!", opts), { value: Infinity });
	t.like(p.parse(ChronoField.MONTH_OF_YEAR, "!", opts), { value: Infinity });
	t.like(p.parse(ChronoField.DAY_OF_MONTH, "!", opts), { value: Infinity });
	t.like(p.parse(ChronoField.DAY_OF_WEEK, "!", opts), { value: Infinity });
	t.like(p.parse(ChronoField.MINUTE_OF_DAY, "!", opts), { value: Infinity });
});

test("ChronoFieldFormatter:parse:year:undefined", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.is(
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		p.parse(undefined, undefined),
		undefined,
		"undefined arguments parsed as undefined"
	);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	t.is(p.parse(null, null), undefined, "null arguments parsed as undefined");
	t.is(
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		p.parse(ChronoField.YEAR, undefined),
		undefined,
		"undefined parsed as undefined"
	);
	t.is(
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		p.parse(ChronoField.YEAR, null),
		undefined,
		"null parsed as undefined"
	);
	t.is(p.parse(ChronoField.YEAR, ""), undefined, "empty parsed as undefined");
	t.is(
		p.parse(ChronoField.YEAR, "Not A Year"),
		undefined,
		"unknown parsed as undefined"
	);
});

test("ChronoFieldFormatter:parse:month:undefined", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.is(
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		p.parse(undefined, undefined),
		undefined,
		"undefined arguments parsed as undefined"
	);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	t.is(p.parse(null, null), undefined, "null arguments parsed as undefined");
	t.is(
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		p.parse(ChronoField.MONTH_OF_YEAR, undefined),
		undefined,
		"undefined parsed as undefined"
	);
	t.is(
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		p.parse(ChronoField.MONTH_OF_YEAR, null),
		undefined,
		"null parsed as undefined"
	);
	t.is(
		p.parse(ChronoField.MONTH_OF_YEAR, ""),
		undefined,
		"empty parsed as undefined"
	);
	t.is(
		p.parse(ChronoField.MONTH_OF_YEAR, "Not A Month"),
		undefined,
		"unknown parsed as undefined"
	);
});

test("ChronoFieldFormatter:parse:month:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "January"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "January",
			shortName: "Jan",
			value: 1,
		},
		"full name parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "JaNuAry"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "January",
			shortName: "Jan",
			value: 1,
		},
		"full name parsed in case-insensitive manner"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "Jan"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "January",
			shortName: "Jan",
			value: 1,
		},
		"short name parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "jAn"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "January",
			shortName: "Jan",
			value: 1,
		},
		"short name parsed in case insensitive manner"
	);

	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "February"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "February",
			shortName: "Feb",
			value: 2,
		},
		"February full name parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "March"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "March",
			shortName: "Mar",
			value: 3,
		},
		"March full name parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "April"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "April",
			shortName: "Apr",
			value: 4,
		},
		"April full name parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "May"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "May",
			shortName: "May",
			value: 5,
		},
		"May full name parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "June"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "June",
			shortName: "Jun",
			value: 6,
		},
		"June full name parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "July"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "July",
			shortName: "Jul",
			value: 7,
		},
		"July full name parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "August"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "August",
			shortName: "Aug",
			value: 8,
		},
		"August full name parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "September"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "September",
			shortName: "Sep",
			value: 9,
		},
		"September full name parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "October"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "October",
			shortName: "Oct",
			value: 10,
		},
		"October full name parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "November"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "November",
			shortName: "Nov",
			value: 11,
		},
		"November full name parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "December"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "December",
			shortName: "Dec",
			value: 12,
		},
		"December full name parsed"
	);
});

test("ChronoFieldFormatter:parse:dom:en-US:undefined", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	t.is(
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		p.parse(ChronoField.DAY_OF_MONTH, undefined),
		undefined,
		"undefined returned undefined"
	);
	t.is(
		p.parse(ChronoField.DAY_OF_MONTH, "foo"),
		undefined,
		"NaN returns undefined"
	);
});

test("ChronoFieldFormatter:parse:dom:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	const v = p.parse(ChronoField.DAY_OF_MONTH, "1");
	t.like(v, {
		field: ChronoField.DAY_OF_MONTH,
		name: "D",
		value: 1,
	});

	t.is(
		p.parse(ChronoField.DAY_OF_MONTH, "1"),
		v,
		"cached instance returned for same value"
	);
});

test("ChronoFieldFormatter:parse:weekday:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	t.like(
		p.parse(ChronoField.DAY_OF_WEEK, "Monday"),
		{
			field: ChronoField.DAY_OF_WEEK,
			name: "Monday",
			shortName: "Mon",
			value: 1,
		},
		"full name parsed"
	);
	t.like(
		p.parse(ChronoField.DAY_OF_WEEK, "MonDaY"),
		{
			field: ChronoField.DAY_OF_WEEK,
			name: "Monday",
			shortName: "Mon",
			value: 1,
		},
		"full name parsed in case-insensitive manner"
	);
	t.like(
		p.parse(ChronoField.DAY_OF_WEEK, "Mon"),
		{
			field: ChronoField.DAY_OF_WEEK,
			name: "Monday",
			shortName: "Mon",
			value: 1,
		},
		"short name parsed"
	);
	t.like(
		p.parse(ChronoField.DAY_OF_WEEK, "mOn"),
		{
			field: ChronoField.DAY_OF_WEEK,
			name: "Monday",
			shortName: "Mon",
			value: 1,
		},
		"short name parsed in case insensitive manner"
	);

	t.like(
		p.parse(ChronoField.DAY_OF_WEEK, "Tuesday"),
		{
			field: ChronoField.DAY_OF_WEEK,
			name: "Tuesday",
			shortName: "Tue",
			value: 2,
		},
		"Tuesday full name parsed"
	);
	t.like(
		p.parse(ChronoField.DAY_OF_WEEK, "Wednesday"),
		{
			field: ChronoField.DAY_OF_WEEK,
			name: "Wednesday",
			shortName: "Wed",
			value: 3,
		},
		"Wednesday full name parsed"
	);
	t.like(
		p.parse(ChronoField.DAY_OF_WEEK, "Thursday"),
		{
			field: ChronoField.DAY_OF_WEEK,
			name: "Thursday",
			shortName: "Thu",
			value: 4,
		},
		"Thursday full name parsed"
	);
	t.like(
		p.parse(ChronoField.DAY_OF_WEEK, "Friday"),
		{
			field: ChronoField.DAY_OF_WEEK,
			name: "Friday",
			shortName: "Fri",
			value: 5,
		},
		"Friday full name parsed"
	);
	t.like(
		p.parse(ChronoField.DAY_OF_WEEK, "Saturday"),
		{
			field: ChronoField.DAY_OF_WEEK,
			name: "Saturday",
			shortName: "Sat",
			value: 6,
		},
		"Saturday full name parsed"
	);
	t.like(
		p.parse(ChronoField.DAY_OF_WEEK, "Sunday"),
		{
			field: ChronoField.DAY_OF_WEEK,
			name: "Sunday",
			shortName: "Sun",
			value: 7,
		},
		"Sunday full name parsed"
	);
});

test("ChronoFieldFormatter:construct:fr-FR", (t) => {
	const locale = "fr-FR";
	const p = new ChronoFieldFormatter(locale);
	t.is(p.locale, locale, "locale from constructor arg");
});

test("ChronoFieldFormatter:parse:year:fr-FR", (t) => {
	const locale = "fr-FR";
	const p = new ChronoFieldFormatter(locale);
	t.like(
		p.parse(ChronoField.YEAR, "2023"),
		{
			field: ChronoField.YEAR,
			value: 2023,
		},
		"year parsed"
	);
});

test("ChronoFieldFormatter:parse:year:fr-FR:unbounded", (t) => {
	const locale = "fr-FR";
	const p = new ChronoFieldFormatter(locale);
	t.like(
		p.parse(ChronoField.YEAR, "*"),
		{
			field: ChronoField.YEAR,
			value: Infinity,
		},
		"unbounded year parsed"
	);
});

test("ChronoFieldFormatter:parse:month:fr-FR", (t) => {
	const locale = "fr-FR";
	const p = new ChronoFieldFormatter(locale);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "janvier"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "janvier",
			shortName: "janv",
			value: 1,
		},
		"full name parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "JanVieR"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "janvier",
			shortName: "janv",
			value: 1,
		},
		"full name parsed in case-insensitive manner"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "janv"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "janvier",
			shortName: "janv",
			value: 1,
		},
		"short name parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "JanV"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "janvier",
			shortName: "janv",
			value: 1,
		},
		"short name parsed in case insensitive manner"
	);
});

test("ChronoFieldFormatter:parse:month:fr-FR:unbounded", (t) => {
	const locale = "fr-FR";
	const p = new ChronoFieldFormatter(locale);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "*"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			value: Infinity,
		},
		"unbounded month parsed"
	);
});

test("ChronoFieldFormatter:parse:month:fr-FR:accents", (t) => {
	const locale = "fr-FR";
	const p = new ChronoFieldFormatter(locale);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "février"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "février",
			shortName: "févr",
			value: 2,
		},
		"full name with accents parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "FÉvRieR"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "février",
			shortName: "févr",
			value: 2,
		},
		"full name with accents parsed in case insensitive manner"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "févr"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "février",
			shortName: "févr",
			value: 2,
		},
		"short name with accents parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "FÉvR"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "février",
			shortName: "févr",
			value: 2,
		},
		"short name with accents parsed in case insensitive manner"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "fevrier"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "février",
			shortName: "févr",
			value: 2,
		},
		"full name without accents parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "FevRieR"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "février",
			shortName: "févr",
			value: 2,
		},
		"full name without accents parsed in case-insensitive manner"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "fevr"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "février",
			shortName: "févr",
			value: 2,
		},
		"short name without accents parsed"
	);
	t.like(
		p.parse(ChronoField.MONTH_OF_YEAR, "FevR"),
		{
			field: ChronoField.MONTH_OF_YEAR,
			name: "février",
			shortName: "févr",
			value: 2,
		},
		"short name without accents parsed in case-insensitive manner"
	);
});

test("ChronoFieldFormatter:parse:mod:en-US:cached", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	const v = p.parse(ChronoField.MINUTE_OF_DAY, "0");
	t.like(v, {
		field: ChronoField.MINUTE_OF_DAY,
		name: "M",
		value: 0,
	});

	t.is(
		p.parse(ChronoField.MINUTE_OF_DAY, "0"),
		v,
		"cached instance returned for same value"
	);
});

test("ChronoFieldFormatter:parse:mod:en-US:unbounded", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);
	t.like(
		p.parse(ChronoField.MINUTE_OF_DAY, "*"),
		{
			field: ChronoField.MINUTE_OF_DAY,
			value: Infinity,
		},
		"unbounded minute parsed"
	);
});

test("ChronoFieldFormatter:parse:mod:en-US:hours", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	t.like(
		p.parse(ChronoField.MINUTE_OF_DAY, "1"),
		{
			field: ChronoField.MINUTE_OF_DAY,
			name: "M",
			value: 60,
		},
		"hour parsed"
	);
	t.like(
		p.parse(ChronoField.MINUTE_OF_DAY, "12"),
		{
			field: ChronoField.MINUTE_OF_DAY,
			name: "M",
			value: 720,
		},
		"middle hour parsed"
	);
	t.like(
		p.parse(ChronoField.MINUTE_OF_DAY, "24"),
		{
			field: ChronoField.MINUTE_OF_DAY,
			name: "M",
			value: 1440,
		},
		"max hour parsed"
	);
});

test("ChronoFieldFormatter:parse:mod:en-US:minutes", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	t.like(
		p.parse(ChronoField.MINUTE_OF_DAY, "01:23"),
		{
			field: ChronoField.MINUTE_OF_DAY,
			name: "M",
			value: 83,
		},
		"minutes parsed"
	);
	t.like(
		p.parse(ChronoField.MINUTE_OF_DAY, "1:2"),
		{
			field: ChronoField.MINUTE_OF_DAY,
			name: "M",
			value: 62,
		},
		"short minutes parsed"
	);
	t.like(
		p.parse(ChronoField.MINUTE_OF_DAY, "12:34"),
		{
			field: ChronoField.MINUTE_OF_DAY,
			name: "M",
			value: 754,
		},
		"middle minutes parsed"
	);
	t.like(
		p.parse(ChronoField.MINUTE_OF_DAY, "24:00"),
		{
			field: ChronoField.MINUTE_OF_DAY,
			name: "M",
			value: 1440,
		},
		"max minutes parsed"
	);
});

test("ChronoFieldFormatter:parse:mod:en-US:undefined", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	t.is(
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		p.parse(ChronoField.MINUTE_OF_DAY, undefined),
		undefined,
		"undefined returned undefined"
	);
	t.is(
		p.parse(ChronoField.MINUTE_OF_DAY, "foo"),
		undefined,
		"NaN returns undefined"
	);
});

test("ChronoFieldFormatter:parseRange:en-US:undefined", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.is(
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		p.parseRange(undefined, undefined),
		undefined,
		"all undefined returns undefined"
	);
	t.is(
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		p.parseRange(undefined, "Jan-Feb"),
		undefined,
		"undefined field returns undefined"
	);
	t.is(
		p.parseRange(ChronoField.MONTH_OF_YEAR, undefined),
		undefined,
		"undefined value for month returns undefined"
	);
	t.is(
		p.parseRange(ChronoField.DAY_OF_WEEK, undefined),
		undefined,
		"undefined value for week returns undefined"
	);
});

test("ChronoFieldFormatter:parseRange:year:en-US", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.like(
		p.parseRange(ChronoField.YEAR, "2000 - 2023"),
		{
			min: 2000,
			max: 2023,
		},
		"year range with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.YEAR, "2000"),
		{
			min: 2000,
			max: 2000,
		},
		"singleton range parsed"
	);
});

test("ChronoFieldFormatter:parseRange:year:en-US:unbounded", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.like(
		p.parseRange(ChronoField.YEAR, "2000 - *"),
		{
			min: 2000,
			max: null,
		},
		"year range with unbounded min parsed"
	);
	t.like(
		p.parseRange(ChronoField.YEAR, "* - 2023"),
		{
			min: null,
			max: 2023,
		},
		"year range with unboudned max parsed"
	);
	t.like(
		p.parseRange(ChronoField.YEAR, "* - *"),
		{
			min: null,
			max: null,
		},
		"unbounded year range parsed"
	);
	t.like(
		p.parseRange(ChronoField.YEAR, "*"),
		{
			min: null,
			max: null,
		},
		"unbounded year range parsed as shortcut"
	);
});

test("ChronoFieldFormatter:parseRange:month:en-US", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "February - December"),
		{
			min: 2,
			max: 12,
		},
		"full name range with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "Feb-Dec"),
		{
			min: 2,
			max: 12,
		},
		"short name range without whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "Feb-Jul"),
		{
			min: 2,
			max: 7,
		},
		"mixed name range with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "Jul-Feb"),
		{
			min: 2,
			max: 7,
		},
		"mixed name range reversed with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "Jul"),
		{
			min: 7,
			max: 7,
		},
		"singleton range parsed"
	);
});

test("ChronoFieldFormatter:parseRange:month:nums:en-US", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "1-12"),
		{
			min: 1,
			max: 12,
		},
		"number range without whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "2 - 11"),
		{
			min: 2,
			max: 11,
		},
		"number range with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "11 - 2"),
		{
			min: 2,
			max: 11,
		},
		"number range reversed with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "7"),
		{
			min: 7,
			max: 7,
		},
		"singleton range parsed"
	);
	t.is(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "0 - 99"),
		undefined,
		"number range outside of bounds returns undefined"
	);
	t.is(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "0 - 1"),
		undefined,
		"number range leading outside of bounds returns undefined"
	);
	t.is(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "1 - 99"),
		undefined,
		"number range trailing outside of bounds returns undefined"
	);
});

test("ChronoFieldFormatter:parseRange:month:en-US:unbounded", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "Jan - *"),
		{
			min: 1,
			max: 12,
		},
		"month range with min bound and unbounded max is field bounds"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "* - Dec"),
		{
			min: 1,
			max: 12,
		},
		"month range with unbounded min and max bound is field bounds"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "Feb - *"),
		{
			min: 2,
			max: 12,
		},
		"month range with unboudned max parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "* - Nov"),
		{
			min: 1,
			max: 11,
		},
		"month range with unboudned min parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "* - *"),
		{
			min: 1,
			max: 12,
		},
		"unbounded month range parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "*"),
		{
			min: 1,
			max: 12,
		},
		"unbounded month range parsed as shortcut"
	);
});

test("ChronoFieldFormatter:parseRange:month:en-US:nums:unbounded", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "1 - *"),
		{
			min: 1,
			max: 12,
		},
		"month range with min bound and unbounded max is field bounds"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "* - 12"),
		{
			min: 1,
			max: 12,
		},
		"month range with unbounded min and max bound is field bounds"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "2 - *"),
		{
			min: 2,
			max: 12,
		},
		"month range with unboudned max parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "* - 11"),
		{
			min: 1,
			max: 11,
		},
		"month range with unboudned min parsed"
	);
});

test("ChronoFieldFormatter:parseRange:month:fr-FR", (t) => {
	const p = new ChronoFieldFormatter("fr-FR");
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "février - décembre"),
		{
			min: 2,
			max: 12,
		},
		"full name range with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "févr-déc"),
		{
			min: 2,
			max: 12,
		},
		"short name range without whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "févr-juillet"),
		{
			min: 2,
			max: 7,
		},
		"mixed name range with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "juillet-févr"),
		{
			min: 2,
			max: 7,
		},
		"mixed name range reversed with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "juillet"),
		{
			min: 7,
			max: 7,
		},
		"singleton range parsed"
	);
});

test("ChronoFieldFormatter:parseRange:month:nums:fr-FR", (t) => {
	const p = new ChronoFieldFormatter("fr-FR");
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "1-12"),
		{
			min: 1,
			max: 12,
		},
		"number range without whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "2 - 11"),
		{
			min: 2,
			max: 11,
		},
		"number range with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "11 - 2"),
		{
			min: 2,
			max: 11,
		},
		"number range reversed with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "7"),
		{
			min: 7,
			max: 7,
		},
		"singleton range parsed"
	);
	t.is(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "0 - 99"),
		undefined,
		"number range outside of bounds returns undefined"
	);
	t.is(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "0 - 1"),
		undefined,
		"number range leading outside of bounds returns undefined"
	);
	t.is(
		p.parseRange(ChronoField.MONTH_OF_YEAR, "1 - 99"),
		undefined,
		"number range trailing outside of bounds returns undefined"
	);
});

test("ChronoFieldFormatter:parseRange:dom:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	t.like(
		p.parseRange(ChronoField.DAY_OF_MONTH, "1-31"),
		{
			min: 1,
			max: 31,
		},
		"range parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_MONTH, "1 - 31"),
		{
			min: 1,
			max: 31,
		},
		"range with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_MONTH, "10"),
		{
			min: 10,
			max: 10,
		},
		"singleton parsed"
	);
});

test("ChronoFieldFormatter:parseRange:dom:en-US:unbounded", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.like(
		p.parseRange(ChronoField.DAY_OF_MONTH, "1 - *"),
		{
			min: 1,
			max: 31,
		},
		"day range with min bound and unbounded max is field bounds"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_MONTH, "* - 31"),
		{
			min: 1,
			max: 31,
		},
		"day range with unbounded min and max bound is field bounds"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_MONTH, "2 - *"),
		{
			min: 2,
			max: 31,
		},
		"day range with unboudned max parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_MONTH, "* - 30"),
		{
			min: 1,
			max: 30,
		},
		"day range with unboudned min parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_MONTH, "* - *"),
		{
			min: 1,
			max: 31,
		},
		"unbounded day range parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_MONTH, "*"),
		{
			min: 1,
			max: 31,
		},
		"unbounded day range parsed as shortcut"
	);
});

test("ChronoFieldFormatter:parseRange:weekday:en-US", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "Tuesday - Sunday"),
		{
			min: 2,
			max: 7,
		},
		"full name range with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "Tue-Sun"),
		{
			min: 2,
			max: 7,
		},
		"short name range without whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "Tue-Wed"),
		{
			min: 2,
			max: 3,
		},
		"mixed name range with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "Wed-Tue"),
		{
			min: 2,
			max: 3,
		},
		"mixed name range reversed with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "Wed"),
		{
			min: 3,
			max: 3,
		},
		"singleton range parsed"
	);
});

test("ChronoFieldFormatter:parseRange:weekday:nums:en-US", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "1-7"),
		{
			min: 1,
			max: 7,
		},
		"number range without whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "2 - 6"),
		{
			min: 2,
			max: 6,
		},
		"number range with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "6 - 2"),
		{
			min: 2,
			max: 6,
		},
		"number range reversed with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "7"),
		{
			min: 7,
			max: 7,
		},
		"singleton range parsed"
	);
	t.is(
		p.parseRange(ChronoField.DAY_OF_WEEK, "0 - 99"),
		undefined,
		"number range outside of bounds returns undefined"
	);
	t.is(
		p.parseRange(ChronoField.DAY_OF_WEEK, "0 - 1"),
		undefined,
		"number range leading outside of bounds returns undefined"
	);
	t.is(
		p.parseRange(ChronoField.DAY_OF_WEEK, "1 - 99"),
		undefined,
		"number range trailing outside of bounds returns undefined"
	);
});

test("ChronoFieldFormatter:parseRange:weekday:en-US:unbounded", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "Mon - *"),
		{
			min: 1,
			max: 7,
		},
		"weekday range with min bound and unbounded max is field bounds"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "* - Sun"),
		{
			min: 1,
			max: 7,
		},
		"weekday range with unbounded min and max bound is field bounds"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "Tue - *"),
		{
			min: 2,
			max: 7,
		},
		"weekday range with unboudned max parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "* - Sat"),
		{
			min: 1,
			max: 6,
		},
		"weekday range with unboudned min parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "* - *"),
		{
			min: 1,
			max: 7,
		},
		"unbounded weekday range parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "*"),
		{
			min: 1,
			max: 7,
		},
		"unbounded weekday range parsed as shortcut"
	);
});

test("ChronoFieldFormatter:parseRange:weekday:en-US:unbounded:nums", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "1 - *"),
		{
			min: 1,
			max: 7,
		},
		"month range with min bound and unbounded max is field bounds"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "* - 7"),
		{
			min: 1,
			max: 7,
		},
		"weekday range with unbounded min and max bound is field bounds"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "2 - *"),
		{
			min: 2,
			max: 7,
		},
		"weekday range with unboudned max parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "* - 6"),
		{
			min: 1,
			max: 6,
		},
		"weekday range with unboudned min parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "* - *"),
		{
			min: 1,
			max: 7,
		},
		"unbounded weekday range parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "*"),
		{
			min: 1,
			max: 7,
		},
		"unbounded weekday range parsed as shortcut"
	);
});

test("ChronoFieldFormatter:parseRange:weekday:fr-FR", (t) => {
	const p = new ChronoFieldFormatter("fr-FR");
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "mar - dim"),
		{
			min: 2,
			max: 7,
		},
		"full name range with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "mar-dim"),
		{
			min: 2,
			max: 7,
		},
		"short name range without whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "mar-mer"),
		{
			min: 2,
			max: 3,
		},
		"mixed name range with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "mer-mar"),
		{
			min: 2,
			max: 3,
		},
		"mixed name range reversed with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "mer"),
		{
			min: 3,
			max: 3,
		},
		"singleton range parsed"
	);
});

test("ChronoFieldFormatter:parseRange:weekday:nums:fr-FR", (t) => {
	const p = new ChronoFieldFormatter("fr-FR");
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "1-7"),
		{
			min: 1,
			max: 7,
		},
		"number range without whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "2 - 6"),
		{
			min: 2,
			max: 6,
		},
		"number range with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "6 - 2"),
		{
			min: 2,
			max: 6,
		},
		"number range reversed with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.DAY_OF_WEEK, "7"),
		{
			min: 7,
			max: 7,
		},
		"singleton range parsed"
	);
	t.is(
		p.parseRange(ChronoField.DAY_OF_WEEK, "0 - 99"),
		undefined,
		"number range outside of bounds returns undefined"
	);
	t.is(
		p.parseRange(ChronoField.DAY_OF_WEEK, "0 - 1"),
		undefined,
		"number range leading outside of bounds returns undefined"
	);
	t.is(
		p.parseRange(ChronoField.DAY_OF_WEEK, "1 - 99"),
		undefined,
		"number range trailing outside of bounds returns undefined"
	);
});

test("ChronoFieldFormatter:parseRange:mod:en-US:hours", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	t.like(
		p.parseRange(ChronoField.MINUTE_OF_DAY, "0-24"),
		{
			min: 0,
			max: 1440,
		},
		"range parsed"
	);
	t.like(
		p.parseRange(ChronoField.MINUTE_OF_DAY, "6 - 12"),
		{
			min: 360,
			max: 720,
		},
		"range with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.MINUTE_OF_DAY, "10"),
		{
			min: 600,
			max: 600,
		},
		"singleton parsed"
	);
});

test("ChronoFieldFormatter:parseRange:hours:en-US:unbounded", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.like(
		p.parseRange(ChronoField.MINUTE_OF_DAY, "0 - *"),
		{
			min: 0,
			max: 24 * 60,
		},
		"hours range with min bound and unbounded max is field bounds"
	);
	t.like(
		p.parseRange(ChronoField.MINUTE_OF_DAY, "* - 24"),
		{
			min: 0,
			max: 24 * 60,
		},
		"hours range with unbounded min and max bound is field bounds"
	);
	t.like(
		p.parseRange(ChronoField.MINUTE_OF_DAY, "2 - *"),
		{
			min: 2 * 60,
			max: 24 * 60,
		},
		"hours range with unboudned max parsed"
	);
	t.like(
		p.parseRange(ChronoField.MINUTE_OF_DAY, "* - 6"),
		{
			min: 0,
			max: 6 * 60,
		},
		"hours range with unboudned min parsed"
	);
	t.like(
		p.parseRange(ChronoField.MINUTE_OF_DAY, "* - *"),
		{
			min: 0,
			max: 24 * 60,
		},
		"hours weekday range parsed"
	);
	t.like(
		p.parseRange(ChronoField.MINUTE_OF_DAY, "*"),
		{
			min: 0,
			max: 24 * 60,
		},
		"hours weekday range parsed as shortcut"
	);
});

test("ChronoFieldFormatter:parseRange:mod:en-US:minutes", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	t.like(
		p.parseRange(ChronoField.MINUTE_OF_DAY, "00:00-24:00"),
		{
			min: 0,
			max: 1440,
		},
		"range parsed"
	);
	t.like(
		p.parseRange(ChronoField.MINUTE_OF_DAY, "06:30 - 18:45"),
		{
			min: 390,
			max: 1125,
		},
		"range with whitespace parsed"
	);
	t.like(
		p.parseRange(ChronoField.MINUTE_OF_DAY, "10:01"),
		{
			min: 601,
			max: 601,
		},
		"singleton parsed"
	);
});

test("ChronoFieldFormatter:parseRange:mod:en-US:unbounded", (t) => {
	const p = new ChronoFieldFormatter("en-US");
	t.like(
		p.parseRange(ChronoField.MINUTE_OF_DAY, "00:00 - *"),
		{
			min: 0,
			max: 24 * 60,
		},
		"hours range with min bound and unbounded max is field bounds"
	);
	t.like(
		p.parseRange(ChronoField.MINUTE_OF_DAY, "* - 24:00"),
		{
			min: 0,
			max: 24 * 60,
		},
		"hours range with unbounded min and max bound is field bounds"
	);
	t.like(
		p.parseRange(ChronoField.MINUTE_OF_DAY, "02:00 - *"),
		{
			min: 2 * 60,
			max: 24 * 60,
		},
		"hours range with unboudned max parsed"
	);
	t.like(
		p.parseRange(ChronoField.MINUTE_OF_DAY, "* - 06:00"),
		{
			min: 0,
			max: 6 * 60,
		},
		"hours range with unboudned min parsed"
	);
});

test("ChronoFieldFormatter:format:undefined", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	t.is(p.format(undefined, undefined), "*", "undefined field returns *");
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	t.is(p.format(null, undefined), "*", "null field returns *");
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	t.is(
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		p.format(ChronoField.MONTH_OF_YEAR, undefined),
		"*",
		"undefined value returns empty string"
	);
	t.is(
		p.format(ChronoField.MONTH_OF_YEAR, null),
		"*",
		"null value returns *"
	);
});

test("ChronoFieldFormatter:format:infinity", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	t.is(p.format(ChronoField.YEAR, Infinity), "*", "Infinity value returns *");
});

test("ChronoFieldFormatter:format:month:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	const expected = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];
	const result: string[] = [];
	for (let i = 0; i < expected.length; i += 1) {
		result[i] = p.format(ChronoField.MONTH_OF_YEAR, i + 1);
	}
	t.deepEqual(result, expected, "months formatted");
});

test("ChronoFieldFormatter:format:month:fr-FR", (t) => {
	const locale = "fr-FR";
	const p = new ChronoFieldFormatter(locale);

	const expected = [
		"janv",
		"févr",
		"mars",
		"avr",
		"mai",
		"juin",
		"juil",
		"août",
		"sept",
		"oct",
		"nov",
		"déc",
	];
	const result: string[] = [];
	for (let i = 0; i < expected.length; i += 1) {
		result[i] = p.format(ChronoField.MONTH_OF_YEAR, i + 1);
	}
	t.deepEqual(result, expected, "months formatted");
});

test("ChronoFieldFormatter:format:dom:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	for (let i = 1; i <= 31; i += 1) {
		t.is(
			p.format(ChronoField.DAY_OF_MONTH, i),
			"" + i,
			`day of month ${i} formatted`
		);
	}
});

test("ChronoFieldFormatter:format:weekday:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	const expected = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	const result: string[] = [];
	for (let i = 0; i < expected.length; i += 1) {
		result[i] = p.format(ChronoField.DAY_OF_WEEK, i + 1);
	}
	t.deepEqual(result, expected, "weedays formatted");
});

test("ChronoFieldFormatter:format:weekday:fr-FR", (t) => {
	const locale = "fr-FR";
	const p = new ChronoFieldFormatter(locale);

	const expected = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
	const result: string[] = [];
	for (let i = 0; i < expected.length; i += 1) {
		result[i] = p.format(ChronoField.DAY_OF_WEEK, i + 1);
	}
	t.deepEqual(result, expected, "weekdays formatted");
});

test("ChronoFieldFormatter:format:mod:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	t.is(p.format(ChronoField.MINUTE_OF_DAY, 0), "00:00", "midnight formatted");

	t.is(p.format(ChronoField.MINUTE_OF_DAY, 510), "08:30", "8:30am formatted");

	t.is(
		p.format(ChronoField.MINUTE_OF_DAY, 1155),
		"19:15",
		"7:15pm formatted"
	);

	t.is(
		p.format(ChronoField.MINUTE_OF_DAY, 1440),
		"24:00",
		"midnight (end) formatted"
	);
});

test("ChronoFieldFormatter:formatRange:undefined", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	t.is(p.formatRange(undefined, undefined), "*", "undefined field returns *");
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	t.is(p.formatRange(null, undefined), "*", "null field returns *");
	t.is(
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		p.formatRange(ChronoField.MONTH_OF_YEAR, undefined),
		"*",
		"undefined value returns *"
	);
	t.is(
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		p.formatRange(ChronoField.MONTH_OF_YEAR, null),
		"*",
		"null value returns *"
	);
});

test("ChronoFieldFormatter:formatRange:unbounded", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	t.is(
		p.formatRange(ChronoField.YEAR, UNBOUNDED_RANGE),
		"*",
		"unbounded range returns *"
	);
	t.is(
		p.formatRange(ChronoField.YEAR, new IntRange(2000, null)),
		"2000 - *",
		"unbounded max range uses *"
	);
	t.is(
		p.formatRange(ChronoField.YEAR, new IntRange(null, 2000)),
		"* - 2000",
		"unbounded max range uses *"
	);
});

test("ChronoFieldFormatter:formatRange:unbounded:custom", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);
	const opts: IntRangeFormatOptions = { unboundedValue: "!" };

	t.is(
		p.formatRange(ChronoField.YEAR, UNBOUNDED_RANGE, opts),
		"!",
		"unbounded range returns *"
	);
	t.is(
		p.formatRange(ChronoField.YEAR, new IntRange(2000, null), opts),
		"2000 - !",
		"unbounded max range uses *"
	);
	t.is(
		p.formatRange(ChronoField.YEAR, new IntRange(null, 2000), opts),
		"! - 2000",
		"unbounded max range uses *"
	);
});

test("ChronoFieldFormatter:formatRange:month:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	t.is(
		p.formatRange(ChronoField.MONTH_OF_YEAR, new IntRange(1, 7)),
		"Jan - Jul",
		"range formatted"
	);

	t.is(
		p.formatRange(ChronoField.MONTH_OF_YEAR, IntRange.of(1)),
		"Jan",
		"singleton formatted"
	);
});

test("ChronoFieldFormatter:formatRange:month:fr-FR", (t) => {
	const locale = "fr-FR";
	const p = new ChronoFieldFormatter(locale);

	t.is(
		p.formatRange(ChronoField.MONTH_OF_YEAR, new IntRange(1, 7)),
		"janv - juil",
		"range formatted"
	);

	t.is(
		p.formatRange(ChronoField.MONTH_OF_YEAR, IntRange.of(1)),
		"janv",
		"singleton formatted"
	);
});

test("ChronoFieldFormatter:formatRange:month:ja-JP", (t) => {
	const locale = "ja-JP";
	const p = new ChronoFieldFormatter(locale);

	t.is(
		p.formatRange(ChronoField.MONTH_OF_YEAR, new IntRange(1, 7)),
		"1月\uff5e7月",
		"range formatted"
	);

	t.is(
		p.formatRange(ChronoField.MONTH_OF_YEAR, IntRange.of(1)),
		"1月",
		"singleton formatted"
	);
});

test("ChronoFieldFormatter:formatRange:dom:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	t.is(
		p.formatRange(ChronoField.DAY_OF_MONTH, new IntRange(1, 7)),
		"1 - 7",
		"range formatted"
	);

	t.is(
		p.formatRange(ChronoField.DAY_OF_MONTH, IntRange.of(1)),
		"1",
		"singleton formatted"
	);
});

test("ChronoFieldFormatter:formatRange:weekday:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	t.is(
		p.formatRange(ChronoField.DAY_OF_WEEK, new IntRange(1, 7)),
		"Mon - Sun",
		"range formatted"
	);

	t.is(
		p.formatRange(ChronoField.DAY_OF_WEEK, IntRange.of(1)),
		"Mon",
		"singleton formatted"
	);
});

test("ChronoFieldFormatter:formatRange:weekday:fr-FR", (t) => {
	const locale = "fr-FR";
	const p = new ChronoFieldFormatter(locale);

	t.is(
		p.formatRange(ChronoField.DAY_OF_WEEK, new IntRange(1, 7)),
		"lun - dim",
		"range formatted"
	);

	t.is(
		p.formatRange(ChronoField.DAY_OF_WEEK, IntRange.of(1)),
		"lun",
		"singleton formatted"
	);
});

test("ChronoFieldFormatter:formatRange:mod:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldFormatter(locale);

	t.is(
		p.formatRange(ChronoField.MINUTE_OF_DAY, new IntRange(0, 1440)),
		"00:00 - 24:00",
		"full range formatted"
	);

	t.is(
		p.formatRange(ChronoField.MINUTE_OF_DAY, new IntRange(510, 930)),
		"08:30 - 15:30",
		"range formatted"
	);

	t.is(
		p.formatRange(ChronoField.MINUTE_OF_DAY, IntRange.of(1234)),
		"20:34",
		"singleton formatted"
	);
});
