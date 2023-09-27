import test from "ava";
import IntRange from "../main/IntRange.js";
import { compare } from "../main/utils.js";

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

test("IntRange:equals:unboundedMin", (t) => {
	const r1 = new IntRange(null, 1);
	const r2 = new IntRange(null, 1);
	const r3 = new IntRange(null, 2);
	t.true(r1.equals(r1), "same objects are equal");
	t.true(r1.equals(r2), "identical range values are equal");
	t.false(r1.equals(r3), "different range values are not equal");
	t.false(r1.equals({ a: "b" }), "different object types are not equal");
});

test("IntRange:equals:unboundedMax", (t) => {
	const r1 = new IntRange(1, null);
	const r2 = new IntRange(1, null);
	const r3 = new IntRange(2, null);
	t.true(r1.equals(r1), "same objects are equal");
	t.true(r1.equals(r2), "identical range values are equal");
	t.false(r1.equals(r3), "different range values are not equal");
});

test("IntRange:equals:unbounded", (t) => {
	const r1 = new IntRange(null, null);
	const r2 = new IntRange(null, null);
	const r3 = new IntRange(1, null);
	t.true(r1.equals(r1), "same objects are equal");
	t.true(r1.equals(r2), "identical range values are equal");
	t.false(r1.equals(r3), "different range values are not equal");
});

test("IntRange:compareTo:equal", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(1, 2);
	t.is(r1.compareTo(r2), 0);
	t.is(r2.compareTo(r1), 0);
});

test("IntRange:compareTo", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(2, 2);
	t.is(r1.compareTo(r2), -1);
	t.is(r2.compareTo(r1), 1);
});

test("IntRange:compareTo:unboundedMin:equal", (t) => {
	const r1 = new IntRange(null, 2);
	const r2 = new IntRange(null, 2);
	t.is(r1.compareTo(r2), 0);
	t.is(r2.compareTo(r1), 0);
});

test("IntRange:compareTo:unboundedMin", (t) => {
	const r1 = new IntRange(null, 1);
	const r2 = new IntRange(null, 2);
	t.is(r1.compareTo(r2), -1);
	t.is(r2.compareTo(r1), 1);
});

test("IntRange:compareTo:unboundedMin:maxBoundsMax", (t) => {
	const r1 = new IntRange(null, null);
	const r2 = new IntRange(null, 2);
	t.is(r1.compareTo(r2), -1);
	t.is(r2.compareTo(r1), 1);
});

test("IntRange:compareTo:unboundedMinBounded", (t) => {
	const r1 = new IntRange(null, 1);
	const r2 = new IntRange(1, 1);
	t.is(r1.compareTo(r2), -1);
	t.is(r2.compareTo(r1), 1);
});

test("IntRange:compareTo:unboundedMixed:unboundedMax", (t) => {
	const r1 = new IntRange(null, null);
	const r2 = new IntRange(-1, null);
	t.is(r1.compareTo(r2), -1);
	t.is(r2.compareTo(r1), 1);
});

test("IntRange:compareTo:minEqual", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(1, 3);
	t.is(r1.compareTo(r2), -1);
	t.is(r2.compareTo(r1), 1);
});

test("IntRange:compareTo:minEqual:unboundedMax", (t) => {
	const r1 = new IntRange(1, null);
	const r2 = new IntRange(1, 2);
	t.is(r1.compareTo(r2), -1);
	t.is(r2.compareTo(r1), 1);
});

test("IntRange:compareTo:undefined", (t) => {
	const r1 = new IntRange(1, null);
	t.is(r1.compareTo(undefined), 1);
});

test("IntRange:compareTo:self", (t) => {
	const r1 = new IntRange(1, null);
	t.is(r1.compareTo(r1), 0);
});

test("IntRange:compare", (t) => {
	const r = new IntRange(1, 4);
	const a = [
		new IntRange(1, 2),
		new IntRange(3, null),
		r,
		new IntRange(null, null),
		new IntRange(10, 100),
		new IntRange(-1, 1),
		new IntRange(null, 1000),
		new IntRange(0, 5),
		new IntRange(null, 10),
		r,
		new IntRange(-10, null),
		new IntRange(3, 8),
	];
	a.sort(compare);
	t.like(a, [
		{ min: null, max: null },
		{ min: null, max: 10 },
		{ min: null, max: 1000 },
		{ min: -10, max: null },
		{ min: -1, max: 1 },
		{ min: 0, max: 5 },
		{ min: 1, max: 2 },
		{ min: 1, max: 4 },
		{ min: 1, max: 4 },
		{ min: 3, max: null },
		{ min: 3, max: 8 },
		{ min: 10, max: 100 },
	]);
});

test("IntRange:compare:undefined", (t) => {
	const r = new IntRange(1, 4);
	t.is(compare(r, undefined), 1);
	t.is(compare(undefined, r), -1);
});

test("IntRange:length", (t) => {
	const r = new IntRange(1, 10);
	t.is(r.length, 10);
});

test("IntRange:length:singleton", (t) => {
	const r = new IntRange(1, 1);
	t.is(r.length, 1);
});

test("IntRange:length:unboundedMin", (t) => {
	const r = new IntRange(null, 1);
	t.is(r.length, Infinity);
});

test("IntRange:length:unboundedMax", (t) => {
	const r = new IntRange(1, null);
	t.is(r.length, Infinity);
});

test("IntRange:length:unbounded", (t) => {
	const r = new IntRange(null, null);
	t.is(r.length, Infinity);
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

test("IntRange:containsRangeunbounded", (t) => {
	const r = new IntRange(1, 10);

	let r2 = new IntRange(5, null);
	t.false(r.containsRange(r2), "does not contain unbounded max");
	t.false(r2.containsRange(r), "does not contain unbounded max reversed");

	r2 = new IntRange(null, 5);
	t.false(r.containsRange(r2), "does not contain unbounded min");
	t.false(r2.containsRange(r), "does not contain unbounded min reversed");

	r2 = new IntRange(null, null);
	t.false(r.containsRange(r2), "does not contain unbounded");
	t.true(r2.containsRange(r), "does contain unbounded reversed");
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

test("IntRange:adjacent:unboundedMin", (t) => {
	const r1 = new IntRange(null, 2);
	const r2 = new IntRange(3, 4);

	t.true(r1.adjacentTo(r2), "ranges adjacent");
	t.true(r2.adjacentTo(r1), "ranges adjacent reverse");
});

test("IntRange:adjacent:unboundedMin:gap", (t) => {
	const r1 = new IntRange(null, 2);
	const r2 = new IntRange(4, 5);

	t.false(r1.adjacentTo(r2), "ranges not adjacent");
	t.false(r2.adjacentTo(r1), "ranges not adjacent reverse");
});

test("IntRange:adjacent:unboundedMin:unboundedMax", (t) => {
	const r1 = new IntRange(null, 2);
	const r2 = new IntRange(3, null);

	t.true(r1.adjacentTo(r2), "ranges adjacent");
	t.true(r2.adjacentTo(r1), "ranges adjacent reverse");
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

test("IntRange:intersects:unboundedMin:overlap", (t) => {
	const r1 = new IntRange(null, 2);
	const r2 = new IntRange(1, 3);

	t.true(r1.intersects(r2), "ranges intersect");
	t.true(r2.intersects(r1), "ranges intersect reverse");
});

test("IntRange:intersects:unboundedMin:gap", (t) => {
	const r1 = new IntRange(null, 2);
	const r2 = new IntRange(3, 4);

	t.false(r1.intersects(r2), "ranges do not intersect");
	t.false(r2.intersects(r1), "ranges do not intersect reverse");
});

test("IntRange:intersects:unboundedMin:touch", (t) => {
	const r1 = new IntRange(null, 2);
	const r2 = new IntRange(2, 3);

	t.true(r1.intersects(r2), "ranges intersect");
	t.true(r2.intersects(r1), "ranges intersect reverse");
});

test("IntRange:intersects:unboundedMax:overlap", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(1, null);

	t.true(r1.intersects(r2), "ranges intersect");
	t.true(r2.intersects(r1), "ranges intersect reverse");
});

test("IntRange:intersects:unboundedMax:gap", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(3, null);

	t.false(r1.intersects(r2), "ranges do not intersect");
	t.false(r2.intersects(r1), "ranges do not intersect reverse");
});

test("IntRange:intersects:unboundedMax:touch", (t) => {
	const r1 = new IntRange(1, 2);
	const r2 = new IntRange(2, null);

	t.true(r1.intersects(r2), "ranges intersect");
	t.true(r2.intersects(r1), "ranges intersect reverse");
});

test("IntRange:intersects:unbounded:all", (t) => {
	const r1 = new IntRange(null, null);
	const r2 = new IntRange(null, null);

	t.true(r1.intersects(r2), "ranges intersect");
	t.true(r2.intersects(r1), "ranges intersect reverse");
});

test("IntRange:intersects:unbounded:min", (t) => {
	const r1 = new IntRange(null, null);
	const r2 = new IntRange(1, null);

	t.true(r1.intersects(r2), "ranges intersect");
	t.true(r2.intersects(r1), "ranges intersect reverse");
});

test("IntRange:intersects:unbounded:max", (t) => {
	const r1 = new IntRange(null, null);
	const r2 = new IntRange(null, 1);

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

test("IntRange:merge:unboundedMin:adjacent", (t) => {
	const r1 = new IntRange(null, 10);
	const r2 = new IntRange(11, 15);

	t.like(r1.mergeWith(r2), { min: null, max: 15 }, "ranges merged");
	t.like(r2.mergeWith(r1), { min: null, max: 15 }, "ranges merged reverse");
});

test("IntRange:merge:unboundedMin:adjacent:unboundedMax", (t) => {
	const r1 = new IntRange(null, 10);
	const r2 = new IntRange(11, null);

	t.like(r1.mergeWith(r2), { min: null, max: null }, "ranges merged");
	t.like(r2.mergeWith(r1), { min: null, max: null }, "ranges merged reverse");
});

test("IntRange:merge:unboundedMin:subset", (t) => {
	const r1 = new IntRange(null, 10);
	const r2 = new IntRange(1, 5);

	t.like(r1.mergeWith(r2), { min: null, max: 10 }, "ranges merged");
	t.like(r2.mergeWith(r1), { min: null, max: 10 }, "ranges merged reverse");
});

test("IntRange:merge:unboundedMin:overlap", (t) => {
	const r1 = new IntRange(null, 10);
	const r2 = new IntRange(1, 15);

	t.like(r1.mergeWith(r2), { min: null, max: 15 }, "ranges merged");
	t.like(r2.mergeWith(r1), { min: null, max: 15 }, "ranges merged reverse");
});

test("IntRange:merge:unboundedMin:overlap:unboundedMax", (t) => {
	const r1 = new IntRange(null, 10);
	const r2 = new IntRange(1, null);

	t.like(r1.mergeWith(r2), { min: null, max: null }, "ranges merged");
	t.like(r2.mergeWith(r1), { min: null, max: null }, "ranges merged reverse");
});

test("IntRange:toString:undefined", (t) => {
	t.is(new IntRange(1, 5).toString(), "[1..5]", "string returned");
});

test("IntRange:toString:singleton", (t) => {
	t.is(new IntRange(1, 1).toString(), "[1..1]", "string returned");
});

test("IntRange:toString:unboundedMin", (t) => {
	t.is(new IntRange(null, 1).toString(), "[..1]", "string returned");
});

test("IntRange:toString:unboundedMax", (t) => {
	t.is(new IntRange(1, null).toString(), "[1..]", "string returned");
});

test("IntRange:toString:unbounded", (t) => {
	t.is(new IntRange(null, null).toString(), "[..]", "string returned");
});

test("IntRange:description:undefined", (t) => {
	t.is(
		IntRange.description(new IntRange(1, 5), undefined),
		"*",
		"asterix returned when range is not defined"
	);
});

test("IntRange:description:undefined:custom", (t) => {
	t.is(
		IntRange.description(new IntRange(1, 5), undefined, {
			unboundedValue: "!",
		}),
		"!",
		"custom unbounded value returned when range is not defined"
	);
});

test("IntRange:description:full", (t) => {
	t.is(
		IntRange.description(new IntRange(1, 5), new IntRange(1, 5)),
		"*",
		"asterix returned when range is equal to full range"
	);
});

test("IntRange:description:full:custom", (t) => {
	t.is(
		IntRange.description(new IntRange(1, 5), new IntRange(1, 5), {
			unboundedValue: "!",
		}),
		"!",
		"custom unbounded value returned when range is equal to full range"
	);
});

test("IntRange:description:notFull", (t) => {
	t.is(
		IntRange.description(new IntRange(1, 5), new IntRange(1, 2)),
		"[1..2]",
		"range string returned when range is not equal to full range"
	);
});

test("IntRange:description:unboudned:unboundedMin", (t) => {
	t.is(
		IntRange.description(new IntRange(null, null), new IntRange(null, 2)),
		"[..2]",
		"range string returned"
	);
});

test("IntRange:description:unboudned:unboundedMax", (t) => {
	t.is(
		IntRange.description(new IntRange(null, null), new IntRange(1, null)),
		"[1..]",
		"range string returned"
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

test("IntRange:parseRange:stringSingleton", (t) => {
	t.like(
		IntRange.parseRange("123"),
		{ min: 123, max: 123 },
		"string range reverse parsed"
	);
});

test("IntRange:parseRange:stringRange", (t) => {
	t.like(
		IntRange.parseRange("123-234"),
		{ min: 123, max: 234 },
		"string range reverse parsed"
	);
});

test("IntRange:parseRange:stringRange:reverse", (t) => {
	t.like(
		IntRange.parseRange("234-123"),
		{ min: 123, max: 234 },
		"string range reverse parsed"
	);
});

test("IntRange:parseRange:stringRange:unboundedMin", (t) => {
	t.like(
		IntRange.parseRange("*-234"),
		{ min: null, max: 234 },
		"string range parsed"
	);
});

test("IntRange:parseRange:stringRange:unboundedMin:custom", (t) => {
	t.like(
		IntRange.parseRange("!-234", undefined, { unboundedValue: "!" }),
		{ min: null, max: 234 },
		"string range parsed with custom unbounded value"
	);
});

test("IntRange:parseRange:stringRange:unboundedMax", (t) => {
	t.like(
		IntRange.parseRange("123-*"),
		{ min: 123, max: null },
		"string range parsed"
	);
});

test("IntRange:parseRange:stringRange:unboundedMax:custom", (t) => {
	t.like(
		IntRange.parseRange("123-!", undefined, { unboundedValue: "!" }),
		{ min: 123, max: null },
		"string range parsed with custom unbounded value"
	);
});

test("IntRange:parseRange:stringRange:unbounded", (t) => {
	t.like(
		IntRange.parseRange("*-*"),
		{ min: null, max: null },
		"string range parsed"
	);
});

test("IntRange:parseRange:stringRange:unbounded:short:custom", (t) => {
	t.like(
		IntRange.parseRange("!", undefined, { unboundedValue: "!" }),
		{ min: null, max: null },
		"string range parsed with custom unbounded value"
	);
});

test("IntRange:delimiter:default", (t) => {
	t.is(
		IntRange.delimiter(),
		IntRange.delimiter(new Intl.NumberFormat().resolvedOptions().locale),
		"delimiter for default locale returned if no locale provided"
	);
});

test("IntRange:delimiter:en-US", (t) => {
	t.is(IntRange.delimiter("en-US"), " - ", "delimiter for locale returned");
});

test("IntRange:delimiter:ja-JP", (t) => {
	t.is(
		IntRange.delimiter("ja-JP"),
		"\uff5e",
		"delimiter for locale returned"
	);
});
