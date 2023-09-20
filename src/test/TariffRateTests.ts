import test from "ava";
import TariffRate from "../main/TariffRate.js";

test("TariffRate:Construct", (t) => {
	const r = new TariffRate("a", "1.23", "b");
	t.is(r.id, "a", "id from constructor arg");
	t.is(r.description, "b", "description from constructor arg");
	t.is(r.amount, "1.23", "amount from constructor arg");
});

test("TariffRate:Construct:invalid:id", (t) => {
	t.throws(
		() => {
			new TariffRate(undefined, "abc", "b");
		},
		{ instanceOf: TypeError },
		"TypeError thrown for undefined id"
	);
	t.throws(
		() => {
			new TariffRate(null, "abc", "b");
		},
		{ instanceOf: TypeError },
		"TypeError thrown for null id"
	);
	t.throws(
		() => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			new TariffRate(1.23, "abc", "b");
		},
		{ instanceOf: TypeError },
		"TypeError thrown for non-String id"
	);
});

test("TariffRate:Construct:invalid:description", (t) => {
	t.throws(
		() => {
			new TariffRate("a", "abc", undefined);
		},
		{ instanceOf: TypeError },
		"TypeError thrown for undefined description"
	);
	t.throws(
		() => {
			new TariffRate("a", "abc", null);
		},
		{ instanceOf: TypeError },
		"TypeError thrown for null description"
	);
	t.throws(
		() => {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			new TariffRate("a", "abc", 1.23);
		},
		{ instanceOf: TypeError },
		"TypeError thrown for non-String description"
	);
});

test("TariffRate:Construct:invalid:amount", (t) => {
	t.throws(
		() => {
			new TariffRate("a", undefined, "b");
		},
		{ instanceOf: TypeError },
		"TypeError thrown for undefined amount"
	);
	t.throws(
		() => {
			new TariffRate("a", null, "b");
		},
		{ instanceOf: TypeError },
		"TypeError thrown for null amount"
	);
	t.throws(
		() => {
			new TariffRate("a", "abc", "b");
		},
		{ instanceOf: TypeError },
		"TypeError thrown for non-number amount"
	);
});

test("TariffRate:val", (t) => {
	const r = new TariffRate("a", "1.23", "b");
	t.is(r.val, 1.23, "val from amount");
});

function tariffRateString(id, amount) {
	return `TariffRate{${id},${amount}}`;
}

test("TariffRate:toString", (t) => {
	const id = "a";
	const am = "1.23";
	const r = new TariffRate(id, am, "b");
	t.is(r.toString(), tariffRateString(id, am));
});
