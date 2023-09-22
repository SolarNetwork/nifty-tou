import test from "ava";
import {
	ALL_MONTHS,
	ALL_DAYS_OF_MONTH,
	ALL_DAYS_OF_WEEK,
	ALL_MINUTES_OF_DAY,
	ChronoField,
	ChronoFieldValue,
	ChronoFieldParser,
} from "../main/ChronoFieldParser.js";

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

test("ChronoFieldParser:construct:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldParser(locale);
	t.is(p.locale, locale, "locale from constructor arg");
});

test("ChronoFieldParser:factory:en-US", (t) => {
	const en = ChronoFieldParser.forLocale("en-US");
	t.is(
		ChronoFieldParser.forLocale("en-US"),
		en,
		"cached instance returned for previous locale"
	);
	t.not(
		new ChronoFieldParser("en-US"),
		en,
		"new instance differs from cached instance"
	);

	const fr = ChronoFieldParser.forLocale("fr-FR");
	t.is(
		ChronoFieldParser.forLocale("fr-FR"),
		fr,
		"cached instance returned for previous locale"
	);
	t.not(
		new ChronoFieldParser("fr-FR"),
		fr,
		"new instance differs from cached instance"
	);
});

test("ChronoFieldParser:parse:unknown", (t) => {
	const p = new ChronoFieldParser("en-US");
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

test("ChronoFieldParser:parseRange:bounds", (t) => {
	const p = new ChronoFieldParser("en-US");
	t.is(p.parseRange(ChronoField.MONTH_OF_YEAR, "*"), ALL_MONTHS);
	t.is(p.parseRange(ChronoField.DAY_OF_MONTH, "*"), ALL_DAYS_OF_MONTH);
	t.is(p.parseRange(ChronoField.DAY_OF_WEEK, "*"), ALL_DAYS_OF_WEEK);
	t.is(p.parseRange(ChronoField.MINUTE_OF_DAY, "*"), ALL_MINUTES_OF_DAY);
});

test("ChronoFieldParser:parse:month:undefined", (t) => {
	const p = new ChronoFieldParser("en-US");
	t.is(
		p.parse(undefined, undefined),
		undefined,
		"undefined arguments parsed as undefined"
	);
	t.is(p.parse(null, null), undefined, "null arguments parsed as undefined");
	t.is(
		p.parse(ChronoField.MONTH_OF_YEAR, undefined),
		undefined,
		"undefined parsed as undefined"
	);
	t.is(
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

test("ChronoFieldParser:parse:month:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldParser(locale);
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

test("ChronoFieldParser:parse:dom:en-US:undefined", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldParser(locale);

	t.is(
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

test("ChronoFieldParser:parse:dom:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldParser(locale);

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

test("ChronoFieldParser:parse:weekday:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldParser(locale);

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

test("ChronoFieldParser:construct:fr-FR", (t) => {
	const locale = "fr-FR";
	const p = new ChronoFieldParser(locale);
	t.is(p.locale, locale, "locale from constructor arg");
});

test("ChronoFieldParser:parse:month:fr-FR", (t) => {
	const locale = "fr-FR";
	const p = new ChronoFieldParser(locale);
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

test("ChronoFieldParser:parse:month:fr-FR:accents", (t) => {
	const locale = "fr-FR";
	const p = new ChronoFieldParser(locale);
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

test("ChronoFieldParser:parse:mod:en-US:cached", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldParser(locale);

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

test("ChronoFieldParser:parse:mod:en-US:hours", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldParser(locale);

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

test("ChronoFieldParser:parse:mod:en-US:minutes", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldParser(locale);

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

test("ChronoFieldParser:parse:mod:en-US:undefined", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldParser(locale);

	t.is(
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

test("ChronoFieldParser:parseRange:en-US:undefined", (t) => {
	const p = new ChronoFieldParser("en-US");
	t.is(
		p.parseRange(undefined, undefined),
		undefined,
		"all undefined returns undefined"
	);
	t.is(
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

test("ChronoFieldParser:parseRange:month:en-US", (t) => {
	const p = new ChronoFieldParser("en-US");
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

test("ChronoFieldParser:parseRange:month:nums:en-US", (t) => {
	const p = new ChronoFieldParser("en-US");
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

test("ChronoFieldParser:parseRange:month:fr-FR", (t) => {
	const p = new ChronoFieldParser("fr-FR");
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

test("ChronoFieldParser:parseRange:month:nums:fr-FR", (t) => {
	const p = new ChronoFieldParser("fr-FR");
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

test("ChronoFieldParser:parseRange:dom:en-US", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldParser(locale);

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

test("ChronoFieldParser:parseRange:week:en-US", (t) => {
	const p = new ChronoFieldParser("en-US");
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

test("ChronoFieldParser:parseRange:week:nums:en-US", (t) => {
	const p = new ChronoFieldParser("en-US");
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

test("ChronoFieldParser:parseRange:week:fr-FR", (t) => {
	const p = new ChronoFieldParser("fr-FR");
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

test("ChronoFieldParser:parseRange:week:nums:fr-FR", (t) => {
	const p = new ChronoFieldParser("fr-FR");
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

test("ChronoFieldParser:parseRange:mod:en-US:hours", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldParser(locale);

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

test("ChronoFieldParser:parseRange:mod:en-US:minutes", (t) => {
	const locale = "en-US";
	const p = new ChronoFieldParser(locale);

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
