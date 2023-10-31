import test from "ava";
import {
	default as ChronoTariff,
	ChronoTariffUnit,
} from "../main/ChronoTariff.js";

test("ChronoTariff:construct", (t) => {
	const u = ChronoTariffUnit.DAYS;
	const r = 1.23;
	const n = "Test";
	const o = new ChronoTariff(u, r, n);
	t.is(o.unit, u, "unit from constructor arg");
	t.is(o.rate, r, "rate from constructor arg");
	t.is(o.name, n, "name from constructor arg");
});

test("ChronoTariff:quantity:invalid", (t) => {
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.DAYS, r);

	t.is(
		0,
		o.quantity(new Date("foo"), new Date(2024, 1, 1, 0, 0, 0, 0)),
		"invalid from reesults in 0"
	);
	t.is(
		0,
		o.quantity(new Date(2024, 1, 1, 0, 0, 0, 0), new Date("foo")),
		"invalid to reesults in 0"
	);
});

test("ChronoTariff:quantity:example", (t) => {
	const tariff = new ChronoTariff(ChronoTariffUnit.DAYS, 10);
	t.is(
		70,
		tariff.rate *
			tariff.quantity(
				new Date("2024-01-01T00:00:00Z"),
				new Date("2024-01-08T00:00:00Z"),
				true
			)
	);
});

test("ChronoTariff:quantity:day", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.DAYS, r);

	// WHEN
	const from = new Date(2024, 0, 1, 0, 0, 0, 0);
	const to = new Date(2024, 1, 1, 0, 0, 0, 0);
	const q = o.quantity(from, to);

	t.is(31, q, "days counted");
});

test("ChronoTariff:quantity:day:utc", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.DAYS, r);

	// WHEN
	const from = new Date("2024-01-01T00:00:00Z");
	const to = new Date("2024-02-01T00:00:00Z");
	const q = o.quantity(from, to, true);

	t.is(31, q, "days counted");
});

test("ChronoTariff:quantity:day:fraction", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.DAYS, r);

	// WHEN
	const from = new Date(2024, 0, 1, 6, 0, 0, 0);
	const to = new Date(2024, 0, 31, 18, 0, 0, 0);
	const q = o.quantity(from, to);

	t.is(30.5, q, "days counted with fractional start/end");
});

test("ChronoTariff:quantity:day:fraction:utc", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.DAYS, r);

	// WHEN
	const from = new Date("2024-01-01T06:00:00Z");
	const to = new Date("2024-01-31T18:00:00Z");
	const q = o.quantity(from, to, true);

	t.is(30.5, q, "days counted with fractional start/end");
});

test("ChronoTariff:quantity:day:lessThanOne", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.DAYS, r);

	// WHEN
	const from = new Date(2024, 0, 1, 6, 0, 0, 0);
	const to = new Date(2024, 0, 1, 18, 0, 0, 0);
	const q = o.quantity(from, to);

	t.is(0.5, q, "fractional day counted");
});

test("ChronoTariff:quantity:day:lessThanOne:utc", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.DAYS, r);

	// WHEN
	const from = new Date("2024-01-01T06:00:00Z");
	const to = new Date("2024-01-01T18:00:00Z");
	const q = o.quantity(from, to, true);

	t.is(0.5, q, "fractional day counted");
});

test("ChronoTariff:quantity:day:feb:nonleap", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.DAYS, r);

	// WHEN
	const from = new Date(2023, 1, 1, 0, 0, 0, 0);
	const to = new Date(2023, 2, 1, 0, 0, 0, 0);
	const q = o.quantity(from, to);

	t.is(28, q, "days counted without leap day");
});

test("ChronoTariff:quantity:day:feb:nonleap:utc", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.DAYS, r);

	// WHEN
	const from = new Date("2023-02-01T00:00:00Z");
	const to = new Date("2023-03-01T00:00:00Z");
	const q = o.quantity(from, to, true);

	t.is(28, q, "days counted without leap day");
});

test("ChronoTariff:quantity:day:feb:leap", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.DAYS, r);

	// WHEN
	const from = new Date(2024, 1, 1, 0, 0, 0, 0);
	const to = new Date(2024, 2, 1, 0, 0, 0, 0);
	const q = o.quantity(from, to);

	t.is(29, q, "days counted including leap day");
});

test("ChronoTariff:quantity:day:feb:leap:utc", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.DAYS, r);

	// WHEN
	const from = new Date("2024-02-01T00:00:00Z");
	const to = new Date("2024-03-01T00:00:00Z");
	const q = o.quantity(from, to, true);

	t.is(29, q, "days counted including leap day");
});

test("ChronoTariff:quantity:week", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.WEEKS, r);

	// WHEN
	const from = new Date(2024, 0, 1, 0, 0, 0, 0);
	const to = new Date(2024, 1, 5, 0, 0, 0, 0);
	const q = o.quantity(from, to);

	t.is(5, q, "weeks counted");
});

test("ChronoTariff:quantity:week:utc", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.WEEKS, r);

	// WHEN
	const from = new Date("2024-01-01T00:00:00Z");
	const to = new Date("2024-02-05T00:00:00Z");
	const q = o.quantity(from, to, true);

	t.is(5, q, "weeks counted");
});

test("ChronoTariff:quantity:week:fraction", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.WEEKS, r);

	// WHEN
	const from = new Date(2024, 1, 1, 0, 0, 0, 0);
	const to = new Date(2024, 1, 14, 0, 0, 0, 0);
	const q = o.quantity(from, to);

	t.is(
		1 + 6 / 7,
		q,
		"weeks counted with fractional start + end (4d/7d + 2d/7d)"
	);
});

test("ChronoTariff:quantity:week:fraction:utc", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.WEEKS, r);

	// WHEN
	const from = new Date("2024-02-01T00:00:00Z");
	const to = new Date("2024-02-14T00:00:00Z");
	const q = o.quantity(from, to, true);

	t.is(
		1 + 6 / 7,
		q,
		"weeks counted with fractional start + end (4d/7d + 2d/7d)"
	);
});

test("ChronoTariff:quantity:week:lessThanOne", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.WEEKS, r);

	// WHEN
	const from = new Date(2024, 0, 30, 0, 0, 0, 0);
	const to = new Date(2024, 1, 3, 0, 0, 0, 0);
	const q = o.quantity(from, to);

	t.is(4 / 7, q, "fractional week counted (4 days of 7 day week)");
});

test("ChronoTariff:quantity:week:lessThanOne:utc", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.WEEKS, r);

	// WHEN
	const from = new Date("2024-01-30T00:00:00Z");
	const to = new Date("2024-02-03T00:00:00Z");
	const q = o.quantity(from, to, true);

	t.is(4 / 7, q, "fractional week counted (4 days of 7 day week)");
});

test("ChronoTariff:quantity:month", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.MONTHS, r);

	// WHEN
	const from = new Date(2024, 0, 1, 0, 0, 0, 0);
	const to = new Date(2025, 0, 1, 0, 0, 0, 0);
	const q = o.quantity(from, to);

	t.is(12, q, "months counted");
});

test("ChronoTariff:quantity:month:utc", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.MONTHS, r);

	// WHEN
	const from = new Date("2024-01-01T00:00:00Z");
	const to = new Date("2025-01-01T00:00:00Z");
	const q = o.quantity(from, to, true);

	t.is(12, q, "months counted");
});

test("ChronoTariff:quantity:month:fraction", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.MONTHS, r);

	// WHEN
	const from = new Date(2024, 5, 21, 0, 0, 0, 0);
	const to = new Date(2024, 10, 6, 0, 0, 0, 0);
	const q = o.quantity(from, to);

	t.is(
		4.5,
		q,
		"months counted with fractional start + end (10d/30d + 5d/30d)"
	);
});

test("ChronoTariff:quantity:month:fraction:utc", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.MONTHS, r);

	// WHEN
	const from = new Date("2024-06-21T00:00:00Z");
	const to = new Date("2024-11-06T00:00:00Z");
	const q = o.quantity(from, to, true);

	t.is(
		4.5,
		q,
		"months counted with fractional start + end (10d/30d + 5d/30d)"
	);
});

test("ChronoTariff:quantity:month:lessThanOne", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.MONTHS, r);

	// WHEN
	const from = new Date(2024, 5, 5, 0, 0, 0, 0);
	const to = new Date(2024, 5, 20, 0, 0, 0, 0);
	const q = o.quantity(from, to);

	t.is(0.5, q, "fractional month counted (15 days of 30 day month)");
});

test("ChronoTariff:quantity:month:lessThanOne:utc", (t) => {
	// GIVEN
	const r = 1.23;
	const o = new ChronoTariff(ChronoTariffUnit.MONTHS, r);

	// WHEN
	const from = new Date("2024-06-05T00:00:00Z");
	const to = new Date("2024-06-20T00:00:00Z");
	const q = o.quantity(from, to, true);

	t.is(0.5, q, "fractional month counted (15 days of 30 day month)");
});
