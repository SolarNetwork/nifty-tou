import test from "ava";

import Comparable from "../main/Comparable.js";
import * as Utils from "../main/utils.js";

test("utils:cconcat:empty", (t) => {
	t.is(
		Utils.cconcat(undefined, undefined),
		undefined,
		"undefined returned when both undefined"
	);
	t.is(Utils.cconcat(null, null), null, "null returned when both null");
	t.is(Utils.cconcat(undefined, null), null, "right returned when left null");
	t.is(
		Utils.cconcat(null, undefined),
		undefined,
		"right returned when left undefined"
	);
});

test("utils:cconcat:leftEmpty", (t) => {
	t.is(
		Utils.cconcat(undefined, "a"),
		"a",
		"right returned when left undefined"
	);
	t.is(Utils.cconcat(null, "a"), "a", "right returned when left null");
	t.is(Utils.cconcat("", "a"), "a", "right returned when left empty");
});

test("utils:cconcat:rightEmpty", (t) => {
	t.is(Utils.cconcat("a"), "a", "left returned when right undefined");
	t.is(Utils.cconcat("a", null), "a", "left returned when right null");
	t.is(Utils.cconcat("a", ""), "a", "left returned when right empty");
});

test("utils:cconcat:join", (t) => {
	t.is(
		Utils.cconcat("a", "b"),
		"a,b",
		"joined with comma when both non-empty"
	);
});

test("utils:prefix:empty", (t) => {
	t.is(Utils.prefix(), undefined, "both undefined returns undefined");
	t.is(Utils.prefix(undefined, "a"), "a", "left undefined returns right");
	t.is(
		Utils.prefix("a", undefined),
		undefined,
		"right undefined returns right"
	);
	t.is(Utils.prefix("a", null), null, "right null returns right");
	t.is(Utils.prefix("a", ""), "", "right empty returns right");
});

test("utils:prefix:join", (t) => {
	t.is(Utils.prefix("a", "b"), "ab", "joined when both non-empty");
});

test("utils:optional:undefined", (t) => {
	const arg = undefined;
	const n = "a";
	const ty = String;
	t.is(Utils.optional(arg, n, ty), arg, "argument returned when undefined");
});

test("utils:optional:null", (t) => {
	const arg = null;
	const n = "a";
	const ty = String;
	t.is(Utils.optional(arg, n, ty), arg, "argument returned when null");
});

test("utils:optional:defined:string", (t) => {
	const arg = "s";
	const n = "a";
	const ty = String;
	t.is(Utils.optional(arg, n, ty), arg, "argument returned when defined");
});

test("utils:optional:defined:number", (t) => {
	const arg = 1.2;
	const n = "a";
	const ty = Number;
	t.is(Utils.optional(arg, n, ty), arg, "argument returned when defined");
});

test("utils:optional:defined:object", (t) => {
	const arg = { a: "b" };
	const n = "a";
	const ty = Object;
	t.is(Utils.optional(arg, n, ty), arg, "argument returned when defined");
});

class TestClass {
	a: string;
	constructor(a: string) {
		this.a = a;
	}
}

test("utils:optional:defined:TestClass", (t) => {
	const arg = new TestClass("a");
	const n = "a";
	const ty = TestClass;
	t.is(Utils.optional(arg, n, ty), arg, "argument returned when defined");
	t.is(
		Utils.optional(arg, n, Object),
		arg,
		"argument returned when defined and superclass"
	);
});

function optTypeErrorMessage(name, type) {
	return `The ${name} value type must be ${type}.`;
}

test("utils:optional:mistyped:string", (t) => {
	const arg = 1.2;
	const n = "a";
	const ty = String;
	t.throws(
		() => {
			Utils.optional(arg, n, ty);
		},
		{ instanceOf: TypeError, message: optTypeErrorMessage(n, "string") },
		"TypeError thrown when mis-typed"
	);
});

test("utils:optional:mistyped:number", (t) => {
	const arg = "1.2";
	const n = "a";
	const ty = Number;
	t.throws(
		() => {
			Utils.optional(arg, n, ty);
		},
		{ instanceOf: TypeError, message: optTypeErrorMessage(n, "number") },
		"TypeError thrown when mis-typed"
	);
});

test("utils:optional:mistyped:object", (t) => {
	const arg = "a";
	const n = "a";
	const ty = Object;
	t.throws(
		() => {
			Utils.optional(arg, n, ty);
		},
		{ instanceOf: TypeError, message: optTypeErrorMessage(n, "Object") },
		"TypeError thrown when mis-typed"
	);
});

test("utils:optional:mistyped:TestClass", (t) => {
	const arg = { a: "b" };
	const n = "a";
	const ty = TestClass;
	t.throws(
		() => {
			Utils.optional(arg, n, ty);
		},
		{ instanceOf: TypeError, message: optTypeErrorMessage(n, "TestClass") },
		"TypeError thrown when mis-typed"
	);
});

function reqTypeErrorMessage(name) {
	return `The ${name} value must be provided.`;
}

test("utils:required:undefined", (t) => {
	const arg = undefined;
	const n = "a";
	t.throws(
		() => {
			Utils.required(arg, n);
		},
		{ instanceOf: TypeError, message: reqTypeErrorMessage(n) },
		"undefined argument throws exception"
	);
});

test("utils:required:null", (t) => {
	const arg = null;
	const n = "a";
	t.throws(
		() => {
			Utils.required(arg, n);
		},
		{ instanceOf: TypeError, message: reqTypeErrorMessage(n) },
		"undefined argument throws exception"
	);
});

test("utils:required:mistyped:TestClass", (t) => {
	const arg = { a: "b" };
	const n = "a";
	t.throws(
		() => {
			Utils.required(arg, n, TestClass);
		},
		{ instanceOf: TypeError, message: optTypeErrorMessage(n, "TestClass") },
		"undefined argument throws exception"
	);
});

test("utils:splitRange:undefined", (t) => {
	t.is(
		Utils.splitRange(undefined),
		undefined,
		"undefined returned for undefined"
	);
	t.is(Utils.splitRange(null), undefined, "undefined returned for null");
	t.is(Utils.splitRange(""), undefined, "undefined returned for empty");
	t.is(Utils.splitRange("-"), undefined, "undefined returned for dash");
	t.is(
		Utils.splitRange(" - "),
		undefined,
		"undefined returned for dash with whitespace"
	);
});

test("utils:splitRange:singleton", (t) => {
	t.deepEqual(
		Utils.splitRange("a"),
		["a"],
		"singleton returned for non-range"
	);
	t.deepEqual(
		Utils.splitRange("a-"),
		["a"],
		"singleton returned for trailing dash"
	);
	t.deepEqual(
		Utils.splitRange(" a - "),
		["a"],
		"singleton returned for trailing dash with whitespace"
	);
	t.deepEqual(
		Utils.splitRange("-a"),
		["a"],
		"singleton returned for leading dash"
	);
	t.deepEqual(
		Utils.splitRange(" - a "),
		["a"],
		"singleton returned for leading dash with whitespace"
	);
});

test("utils:splitRange:range", (t) => {
	t.deepEqual(
		Utils.splitRange("a-b"),
		["a", "b"],
		"range returned for range"
	);
	t.deepEqual(
		Utils.splitRange(" a - b "),
		["a", "b"],
		"range returned for range with whitespace"
	);
});

class ComparableNumber extends Number implements Comparable<ComparableNumber> {
	compareTo(o: ComparableNumber): number {
		if (o === undefined) {
			return 1;
		}
		return this.valueOf() < o.valueOf()
			? -1
			: this.valueOf() > o.valueOf()
			? 1
			: 0;
	}
}

test("utils:compare", (t) => {
	const n1 = new ComparableNumber(1);
	const n2 = new ComparableNumber(1);
	const n3 = new ComparableNumber(2);
	t.is(n1.compareTo(n1), 0, "comparison to self");
	t.is(n1.compareTo(n2), 0, "comparison to equal value");
	t.is(n1.compareTo(n3), -1, "comparison to greater value");
	t.is(n3.compareTo(n1), 1, "comparison to lesser value");
});
