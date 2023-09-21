import test from "ava";
import IntRange from "../main/IntRange.js";

test("IntRange:Construct", (t) => {
	const r = new IntRange(1, 2);
	t.is(r.min, 1, "min from constructor arg");
	t.is(r.max, 2, "max from constructor arg");
});

test("IntRange:Construct:reversed", (t) => {
	const r = new IntRange(2, 1);
	t.is(r.min, 1, "min from max constructor arg");
	t.is(r.max, 2, "max from min constructor arg");
});

test("IntRange:Construct:singleton", (t) => {
	const r = new IntRange(1, 1);
	t.is(r.min, 1, "min from constructor arg");
	t.is(r.max, 1, "max from constructor arg");
});

test("IntRange:Create", (t) => {
	const r = IntRange.rangeOf(1, 2);
	t.is(r.min, 1, "min from factory arg");
	t.is(r.max, 2, "max from factory arg");
});

test("IntRange:Create:singleton", (t) => {
	const r = IntRange.of(1);
	t.is(r.min, 1, "min from factory arg");
	t.is(r.max, 1, "max from factory arg");
});

test("IntRange:isSingleton", (t) => {
	const s = IntRange.of(1);
	const r = IntRange.rangeOf(1, 2);
	t.is(s.isSingleton, true, "singleton is singleton");
	t.is(r.isSingleton, false, "range is not singleton");
});

test("IntRange:equals", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(1, 2);
	const r3 = new IntRange(1, 3);
	t.true(r1.equals(r1), "same objects are equal");
	t.true(r1.equals(r2), "identical range values are equal");
	t.false(r1.equals(r3), "different range values are not equal");
	t.false(r1.equals({ a: "b" }), "different object types are not equal");
});

test("IntRange:compareTo:lessThan", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(2, 2);
	t.is(r1.compareTo(r2), -1);
	t.is(r2.compareTo(r1), 1);
});

test("IntRange:compareTo:greaterThan", (t) => {
	const r1 = new IntRange(2, 2);
	const r2 = new IntRange(1, 2);
	t.is(r1.compareTo(r2), 1);
	t.is(r2.compareTo(r1), -1);
});

test("IntRange:compareTo:equal", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(1, 2);
	t.is(r1.compareTo(r2), 0);
	t.is(r2.compareTo(r1), 0);
});

test("IntRange:compareTo:equal:minOnly", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(1, 3);
	t.is(r1.compareTo(r2), 0, "compares only min value");
	t.is(r2.compareTo(r1), 0, "compares only min value");
});

test("IntRange:length", (t) => {
	const r = new IntRange(1, 10);
	t.is(r.length, 10);
});

test("IntRange:length:singleton", (t) => {
	const r = new IntRange(1, 1);
	t.is(r.length, 1);
});

test("IntRange:contains", (t) => {
	const r = new IntRange(1, 10);
	for (let i = 1; i < 10; i += 1) {
		t.true(r.contains(i), `contains ${i}`);
	}
	t.false(r.contains(0), "does not contain < min");
	t.false(r.contains(11), "does not contain > max");
});

test("IntRange:contains:undefined", (t) => {
	const r = new IntRange(1, 10);
	t.false(r.contains(undefined), `does not contain undefined`);
	t.false(r.contains(null), `does not contain null`);
});

test("IntRange:containsRange", (t) => {
	const r = new IntRange(1, 10);

	t.true(r.containsRange(new IntRange(1, 1)), "contains min singleton");
	t.true(r.containsRange(new IntRange(10, 10)), "contains max singleton");
	t.true(r.containsRange(new IntRange(1, 10)), "contains same");
	t.true(r.containsRange(new IntRange(1, 5)), "contains head");
	t.true(r.containsRange(new IntRange(5, 10)), "contains tail");
	t.true(r.containsRange(new IntRange(4, 6)), "contains middle");

	t.false(r.containsRange(new IntRange(-1, 0)), "does not contain left");
	t.false(r.containsRange(new IntRange(11, 12)), "does not contain right");
	t.false(
		r.containsRange(new IntRange(0, 1)),
		"does not contain left overlap"
	);
	t.false(
		r.containsRange(new IntRange(10, 11)),
		"does not contain right overlap"
	);
	t.false(r.containsRange(new IntRange(0, 11)), "does not contain larger");
});

test("IntRange:adjacent", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(3, 4);

	t.true(r1.adjacentTo(r2), "ranges adjacent");
	t.true(r2.adjacentTo(r1), "ranges adjacent reverse");
});

test("IntRange:adjacent:gap", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(4, 5);

	t.false(r1.adjacentTo(r2), "ranges not adjacent");
	t.false(r2.adjacentTo(r1), "ranges not adjacent reverse");
});

test("IntRange:adjacent:overlap", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(2, 3);

	t.false(r1.adjacentTo(r2), "ranges not adjacent");
	t.false(r2.adjacentTo(r1), "ranges not adjacent reverse");
});

test("IntRange:intersects:overlap", (t) => {
	const r1 = new IntRange(1, 3);
	const r2 = new IntRange(2, 5);

	t.true(r1.intersects(r2), "ranges intersect");
	t.true(r2.intersects(r1), "ranges intersect reverse");
});

test("IntRange:intersects:gap", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(4, 5);

	t.false(r1.intersects(r2), "ranges do not intersect");
	t.false(r2.intersects(r1), "ranges do not intersect reverse");
});

test("IntRange:intersects:touch", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(2, 3);

	t.true(r1.intersects(r2), "ranges intersect");
	t.true(r2.intersects(r1), "ranges intersect reverse");
});

test("IntRange:canMerge:adjacent", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(3, 4);

	t.true(r1.canMergeWith(r2), "ranges can be merged");
	t.true(r2.canMergeWith(r1), "ranges can be merged reverse");
});

test("IntRange:canMerge:overlap", (t) => {
	const r1 = new IntRange(1, 3);
	const r2 = new IntRange(2, 5);

	t.true(r1.canMergeWith(r2), "ranges can be merged");
	t.true(r2.canMergeWith(r1), "ranges can be merged reverse");
});

test("IntRange:canMerge:subset", (t) => {
	const r1 = new IntRange(1, 10);
	const r2 = new IntRange(3, 6);

	t.true(r1.canMergeWith(r2), "ranges can be merged");
	t.true(r2.canMergeWith(r1), "ranges can be merged reverse");
});

test("IntRange:canMerge:gap", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(4, 5);

	t.false(r1.canMergeWith(r2), "ranges can not be merged");
	t.false(r2.canMergeWith(r1), "ranges can not be merged reverse");
});

test("IntRange:merge:adjacent", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(3, 4);

	t.like(r1.mergeWith(r2), { min: 1, max: 4 }, "ranges merged");
	t.like(r2.mergeWith(r1), { min: 1, max: 4 }, "ranges merged reverse");
});

test("IntRange:merge:overlap", (t) => {
	const r1 = new IntRange(1, 3);
	const r2 = new IntRange(2, 5);

	t.like(r1.mergeWith(r2), { min: 1, max: 5 }, "ranges merged");
	t.like(r2.mergeWith(r1), { min: 1, max: 5 }, "ranges merged reverse");
});

test("IntRange:merge:subset", (t) => {
	const r1 = new IntRange(1, 10);
	const r2 = new IntRange(3, 6);

	t.is(r1.mergeWith(r2), r1, "ranges merged");
	t.is(r2.mergeWith(r1), r1, "ranges merged reverse");
});

test("IntRange:merge:gap", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(4, 5);

	t.throws(
		() => {
			r1.mergeWith(r2);
		},
		undefined,
		"incompatible ranges not merged"
	);
	t.throws(
		() => {
			r2.mergeWith(r1);
		},
		undefined,
		"incompatible ranges not merged reverse"
	);
});

test("IntRange:description:undefined", (t) => {
	t.is(
		IntRange.description(new IntRange(1, 5), undefined),
		"*",
		"asterix returned when range is not defined"
	);
});

test("IntRange:description:full", (t) => {
	t.is(
		IntRange.description(new IntRange(1, 5), new IntRange(1, 5)),
		"*",
		"asterix returned when range is equal to full range"
	);
});

test("IntRange:description:notFull", (t) => {
	t.is(
		IntRange.description(new IntRange(1, 5), new IntRange(1, 2)),
		"[1..2]",
		"range string returned when range is not equal to full range"
	);
});

test("IntRange:parseRange:undefined", (t) => {
	t.is(
		IntRange.parseRange(undefined),
		undefined,
		"undefined returns undefined"
	);
	t.is(IntRange.parseRange(null), undefined, "null returns undefined");
	t.is(IntRange.parseRange([]), undefined, "empty array returns undefined");
});

test("IntRange:parseRange:NaN", (t) => {
	t.is(
		IntRange.parseRange(["a", "b"]),
		undefined,
		"non-number values returns undefined"
	);
	t.is(
		IntRange.parseRange(["a", "2"]),
		undefined,
		"non-number first value returns undefined"
	);
	t.is(
		IntRange.parseRange(["1", "b"]),
		undefined,
		"non-number second value returns undefined"
	);
});

test("IntRange:parseRange:singleton", (t) => {
	t.like(
		IntRange.parseRange(["123"]),
		{ min: 123, max: 123 },
		"singleton parsed"
	);
});

test("IntRange:parseRange:range", (t) => {
	t.like(
		IntRange.parseRange(["123", "234"]),
		{ min: 123, max: 234 },
		"range parsed"
	);
});

test("IntRange:parseRange:range:reverse", (t) => {
	t.like(
		IntRange.parseRange(["234", "123"]),
		{ min: 123, max: 234 },
		"range reverse parsed"
	);
});
