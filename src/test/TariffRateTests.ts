import test from "ava";
import TariffRate from "../main/TariffRate.js";

test("TariffRate:Construct", (t) => {
	const r = new TariffRate("a", 123, -2, "b");
	t.is(r.id, "a", "id from constructor arg");
	t.is(r.amount, 123, "amount from constructor arg");
	t.is(r.exponent, -2, "exponent from constructor arg");
	t.is(r.description, "b", "description from constructor arg");
});

test("TariffRate:Construct:invalid:id", (t) => {
	t.throws(
		() => {
			new TariffRate(undefined, 1.23);
		},
		{ instanceOf: TypeError },
		"TypeError thrown for undefined id"
	);
	t.throws(
		() => {
			new TariffRate(null, 1.23);
		},
		{ instanceOf: TypeError },
		"TypeError thrown for null id"
	);
	t.throws(
		() => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			new TariffRate(1.23, 1.23);
		},
		{ instanceOf: TypeError },
		"TypeError thrown for non-String id"
	);
});

test("TariffRate:Construct:invalid:amount", (t) => {
	t.throws(
		() => {
			new TariffRate("a", undefined);
		},
		{ instanceOf: TypeError },
		"TypeError thrown for undefined amount"
	);
	t.throws(
		() => {
			new TariffRate("a", null);
		},
		{ instanceOf: TypeError },
		"TypeError thrown for null amount"
	);
});

test("TariffRate:Construct:invalid:exponent", (t) => {
	t.is(
		new TariffRate("a", 1.23, undefined).exponent,
		0,
		"undefined resolved as 0"
	);
	t.is(new TariffRate("a", 1.23, null).exponent, 0, "null resolved as 0");
	t.throws(
		() => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			new TariffRate("a", 1.23, "foo");
		},
		{ instanceOf: TypeError },
		"TypeError thrown for non-number exponent"
	);
});

test("TariffRate:Construct:invalid:description", (t) => {
	t.throws(
		() => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			new TariffRate("a", 1.23, 0, 1.23);
		},
		{ instanceOf: TypeError },
		"TypeError thrown for non-string description"
	);
});

test("TariffRate:toString", (t) => {
	t.is(
		new TariffRate("a", 1.23, 0, "b").toString(),
		"TariffRate{a,1.23}",
		"renders 0 exponent"
	);
});
test("TariffRate:toString:exp:pos", (t) => {
	t.is(
		new TariffRate("a", 123, 2, "b").toString(),
		"TariffRate{a,123*100}",
		"renders positive exponent as division"
	);
});

test("TariffRate:toString:exp:neg", (t) => {
	t.is(
		new TariffRate("a", 123, -2, "b").toString(),
		"TariffRate{a,123/100}",
		"renders negative exponent as multiplication"
	);
});
