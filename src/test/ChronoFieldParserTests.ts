import test from "ava";
import {
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
