import test from "ava";
import NumberParser from "../main/NumberParser.js";

test("NumberParser:construct", (t) => {
	const locale = "en-US";
	const p = new NumberParser(locale);
	t.is(p.locale, locale, "locale from constructor arg");
});

test("NumberParser:factory:en-US", (t) => {
	const en = NumberParser.forLocale("en-US");
	t.is(
		NumberParser.forLocale("en-US"),
		en,
		"cached instance returned for previous locale"
	);
	t.not(
		new NumberParser("en-US"),
		en,
		"new instance differs from cached instance"
	);

	const fr = NumberParser.forLocale("fr-FR");
	t.is(
		NumberParser.forLocale("fr-FR"),
		fr,
		"cached instance returned for previous locale"
	);
	t.not(
		new NumberParser("fr-FR"),
		fr,
		"new instance differs from cached instance"
	);
});

test("NumberParser:parse:NaN", (t) => {
	const locale = "en-US";
	const p = new NumberParser(locale);
	t.is(p.parse(undefined), NaN, "undefined returns NaN");
	t.is(p.parse(null), NaN, "null returns NaN");
	t.is(p.parse("foo"), NaN, "unparsable returns NaN");
	t.is(p.parse(""), NaN, "empty returns undefined");
});

test("NumberParser:parse:en-US:integer", (t) => {
	const locale = "en-US";
	const p = new NumberParser(locale);
	t.is(p.parse("123"), 123, "simple integer parsed");
	t.is(p.parse("+123"), 123, "signed positive integer parsed");
	t.is(p.parse("-123"), -123, "signed negative integer parsed");
});

test("NumberParser:parse:en-US:delimitedInteger", (t) => {
	const locale = "en-US";
	const p = new NumberParser(locale);
	t.is(p.parse("1,234,567"), 1234567, "delimited integer parsed");
	t.is(
		p.parse("+1,234,567"),
		1234567,
		"signed positive delimited integer parsed"
	);
	t.is(
		p.parse("-1,234,567"),
		-1234567,
		"signed negative delimited integer parsed"
	);
});

test("NumberParser:parse:en-US:decimal", (t) => {
	const locale = "en-US";
	const p = new NumberParser(locale);
	t.is(p.parse("12.34"), 12.34, "simple decimal parsed");
	t.is(p.parse("+12.34"), 12.34, "signed decimal integer parsed");
	t.is(p.parse("-12.34"), -12.34, "signed negative decimal parsed");
});

test("NumberParser:parse:en-US:delimitedDecimal", (t) => {
	const locale = "en-US";
	const p = new NumberParser(locale);
	t.is(p.parse("1,234.567"), 1234.567, "delimited decimal parsed");
	t.is(
		p.parse("+1,234.567"),
		1234.567,
		"signed positive delimited decimal parsed"
	);
	t.is(
		p.parse("-1,234.567"),
		-1234.567,
		"signed negative delimited decimal parsed"
	);
});

test("NumberParser:parse:de:integer", (t) => {
	const locale = "de";
	const p = new NumberParser(locale);
	t.is(p.parse("123"), 123, "simple integer parsed");
	t.is(p.parse("+123"), 123, "signed positive integer parsed");
	t.is(p.parse("-123"), -123, "signed negative integer parsed");
});

test("NumberParser:parse:de:delimitedInteger", (t) => {
	const locale = "de";
	const p = new NumberParser(locale);
	t.is(p.parse("1.234.567"), 1234567, "delimited integer parsed");
	t.is(
		p.parse("+1.234.567"),
		1234567,
		"signed positive delimited integer parsed"
	);
	t.is(
		p.parse("-1.234.567"),
		-1234567,
		"signed negative delimited integer parsed"
	);
});

test("NumberParser:parse:de:decimal", (t) => {
	const locale = "de";
	const p = new NumberParser(locale);
	t.is(p.parse("12,34"), 12.34, "simple decimal parsed");
	t.is(p.parse("+12,34"), 12.34, "signed decimal integer parsed");
	t.is(p.parse("-12,34"), -12.34, "signed negative decimal parsed");
});

test("NumberParser:norm:de:delimitedDecimal", (t) => {
	const locale = "de";
	const p = new NumberParser(locale);
	t.is(p.norm("1.234,567"), "1234.567", "delimited decimal normalized");
	t.is(
		p.norm("+1.234,567"),
		"1234.567",
		"signed positive delimited decimal normalized"
	);
	t.is(
		p.norm("-1.234,567"),
		"-1234.567",
		"signed negative delimited decimal normalized"
	);
});

test("NumberParser:parse:de:delimitedDecimal", (t) => {
	const locale = "de";
	const p = new NumberParser(locale);
	t.is(p.parse("1.234,567"), 1234.567, "delimited decimal parsed");
	t.is(
		p.parse("+1.234,567"),
		1234.567,
		"signed positive delimited decimal parsed"
	);
	t.is(
		p.parse("-1.234,567"),
		-1234.567,
		"signed negative delimited decimal parsed"
	);
});
