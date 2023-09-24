import test from "ava";
import NumberFormatter from "../main/NumberFormatter.js";

test("NumberFormatter:construct", (t) => {
	const locale = "en-US";
	const p = new NumberFormatter(locale);
	t.is(p.locale, locale, "locale from constructor arg");
});

test("NumberFormatter:factory:en-US", (t) => {
	const en = NumberFormatter.forLocale("en-US");
	t.is(
		NumberFormatter.forLocale("en-US"),
		en,
		"cached instance returned for previous locale"
	);
	t.not(
		new NumberFormatter("en-US"),
		en,
		"new instance differs from cached instance"
	);

	const fr = NumberFormatter.forLocale("fr-FR");
	t.is(
		NumberFormatter.forLocale("fr-FR"),
		fr,
		"cached instance returned for previous locale"
	);
	t.not(
		new NumberFormatter("fr-FR"),
		fr,
		"new instance differs from cached instance"
	);
});

test("NumberFormatter:parse:NaN", (t) => {
	const locale = "en-US";
	const p = new NumberFormatter(locale);
	t.is(p.parse(undefined), NaN, "undefined returns NaN");
	t.is(p.parse(null), NaN, "null returns NaN");
	t.is(p.parse("foo"), NaN, "unparsable returns NaN");
	t.is(p.parse(""), NaN, "empty returns undefined");
});

test("NumberFormatter:parse:en-US:integer", (t) => {
	const locale = "en-US";
	const p = new NumberFormatter(locale);
	t.is(p.parse("123"), 123, "simple integer parsed");
	t.is(p.parse("+123"), 123, "signed positive integer parsed");
	t.is(p.parse("-123"), -123, "signed negative integer parsed");
});

test("NumberFormatter:parse:en-US:delimitedInteger", (t) => {
	const locale = "en-US";
	const p = new NumberFormatter(locale);
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

test("NumberFormatter:parse:en-US:decimal", (t) => {
	const locale = "en-US";
	const p = new NumberFormatter(locale);
	t.is(p.parse("12.34"), 12.34, "simple decimal parsed");
	t.is(p.parse("+12.34"), 12.34, "signed decimal integer parsed");
	t.is(p.parse("-12.34"), -12.34, "signed negative decimal parsed");
});

test("NumberFormatter:parse:en-US:delimitedDecimal", (t) => {
	const locale = "en-US";
	const p = new NumberFormatter(locale);
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

test("NumberFormatter:parse:de:integer", (t) => {
	const locale = "de";
	const p = new NumberFormatter(locale);
	t.is(p.parse("123"), 123, "simple integer parsed");
	t.is(p.parse("+123"), 123, "signed positive integer parsed");
	t.is(p.parse("-123"), -123, "signed negative integer parsed");
});

test("NumberFormatter:parse:de:delimitedInteger", (t) => {
	const locale = "de";
	const p = new NumberFormatter(locale);
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

test("NumberFormatter:parse:de:decimal", (t) => {
	const locale = "de";
	const p = new NumberFormatter(locale);
	t.is(p.parse("12,34"), 12.34, "simple decimal parsed");
	t.is(p.parse("+12,34"), 12.34, "signed decimal integer parsed");
	t.is(p.parse("-12,34"), -12.34, "signed negative decimal parsed");
});

test("NumberFormatter:norm:de:delimitedDecimal", (t) => {
	const locale = "de";
	const p = new NumberFormatter(locale);
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

test("NumberFormatter:parse:de:delimitedDecimal", (t) => {
	const locale = "de";
	const p = new NumberFormatter(locale);
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

test("NumberFormatter:format:en-US:undefined", (t) => {
	const f = new NumberFormatter("en-US");
	t.is(f.format(undefined), "", "undefined formatted as empty string");
	t.is(f.format(null), "", "null formatted as empty string");
	t.is(f.format(NaN), "NaN", "NaN formatted as NaN");
});

test("NumberFormatter:format:en-US:defaultOptions", (t) => {
	const f = new NumberFormatter("en-US");
	t.is(f.format(123), "123", "small number formatted");
	t.is(
		f.format(1234567.89),
		"1,234,567.89",
		"large number formatted with grouping"
	);
});

test("NumberFormatter:format:en-US:custom", (t) => {
	const f = new NumberFormatter("en-US");
	const fmt = new Intl.NumberFormat(f.locale, {
		useGrouping: true,
		style: "currency",
		currency: "USD",
		maximumFractionDigits: 2,
	});
	t.is(f.format(123, fmt), "$123.00", "small number formatted");
	t.is(
		f.format(1234567.89, fmt),
		"$1,234,567.89",
		"large number formatted with grouping"
	);
});
