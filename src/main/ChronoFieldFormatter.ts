import IntRange from "./IntRange.js";
import { splitRange } from "./utils.js";

/**
 * An enumeration of supported chronological fields of the Gregorian calendar.
 * @public
 */
export enum ChronoField {
	/** The month of year, from January (1) to December (12). */
	MONTH_OF_YEAR = 1,

	/** The day of month, from 1 - 31. */
	DAY_OF_MONTH = 2,

	/** The day of the week, from Monday (1) to Sunday (7). */
	DAY_OF_WEEK = 3,

	/** The minute of the day, from 0 to 1440 (assuming exclusive maximum). */
	MINUTE_OF_DAY = 4,
}

/**
 * A chronological field value.
 * @public
 */
export class ChronoFieldValue {
	#field: ChronoField;
	#names: string[];
	#value;

	/**
	 * Constructor.
	 *
	 * @param field - the chronological field
	 * @param names - the value names, from longest to shortest
	 * @param value - the value
	 */
	constructor(field: ChronoField, names: string[], value: number) {
		this.#field = field;
		this.#names = names;
		this.#value = value;
		if (!names || names.length < 1) {
			throw new TypeError(`The names array must must not be empty.`);
		}
	}

	/** Get the field. */
	get field(): ChronoField {
		return this.#field;
	}

	/** Get the full name. */
	get name(): string {
		return this.#names[0];
	}

	/** Get the short name. */
	get shortName(): string {
		return this.#names.length > 1 ? this.#names[1] : this.#names[0];
	}

	/** Get the value. */
	get value(): number {
		return this.#value;
	}
}

/**
 * Range for all months of a year: 1 - 12 (inclusive).
 * @public
 */
export const ALL_MONTHS = new IntRange(1, 12);

/**
 * Range for all days of a month: 1 - 31 (inclusive).
 * @public
 */
export const ALL_DAYS_OF_MONTH = new IntRange(1, 31);

/**
 * Range for all days of a week: 1 - 7 (inclusive).
 * @public
 */
export const ALL_DAYS_OF_WEEK = new IntRange(1, 7);

/**
 * Range for all minutes of a day: 0 - 1440 (inclusive min, exclusive max).
 * @public
 */
export const ALL_MINUTES_OF_DAY = new IntRange(0, 1440);

// a cache of parser instance, for locale keys
const PARSER_CACHE: Map<string, ChronoFieldFormatter> = new Map();

// a cache of field bounds
const BOUNDS: Map<ChronoField, IntRange> = new Map();
BOUNDS.set(ChronoField.MONTH_OF_YEAR, ALL_MONTHS);
BOUNDS.set(ChronoField.DAY_OF_MONTH, ALL_DAYS_OF_MONTH);
BOUNDS.set(ChronoField.DAY_OF_WEEK, ALL_DAYS_OF_WEEK);
BOUNDS.set(ChronoField.MINUTE_OF_DAY, ALL_MINUTES_OF_DAY);

// a cache of day-of-month values
const DOM_CACHE: Map<number, ChronoFieldValue> = new Map();
const DOM_NAME = "D";

/**
 * Get a (possibly cached) day-of-month chronologial field value.
 *
 * @param n - the number to get a day-of-month field value for
 * @returns the field value
 */
function dayOfMonthChronoFieldValue(n: number): ChronoFieldValue {
	let v = DOM_CACHE.get(Math.trunc(n));
	if (!v) {
		v = new ChronoFieldValue(ChronoField.DAY_OF_MONTH, [DOM_NAME], n);
		DOM_CACHE.set(n, v);
	}
	return v;
}

// a cache of minute-of-day values
const MOD_CACHE: Map<number, ChronoFieldValue> = new Map();
const MOD_NAME = "M";

/**
 * Get a (possibly cached) minute-of-day chronologial field value.
 *
 * @param n - the number to get a minute-of-day field value for
 * @returns the field value
 */
function minuteOfDayChronoFieldValue(n: number): ChronoFieldValue {
	let v = MOD_CACHE.get(Math.trunc(n));
	if (!v) {
		v = new ChronoFieldValue(ChronoField.MINUTE_OF_DAY, [MOD_NAME], n);
		MOD_CACHE.set(n, v);
	}
	return v;
}

/**
 * Compute a set of keys and names of a date field.
 *
 * @param date - the date to use for field formatting
 * @param names - the array to populate with field names, in the order of the given `formats`
 * @param formats - the list of formats to apply to date to generate field names
 * @returns array of date key names
 */
function computeKeysAndNames(
	date: Date,
	names: string[],
	...formats: Intl.DateTimeFormat[]
): string[] {
	const keys: string[] = [];
	for (const fmt of formats) {
		// generate name and remove all punctuation, e.g. some short names include a period
		const name = fmt.format(date).replace(/\p{P}/gu, "");
		if (names.indexOf(name) >= 0) {
			continue;
		}
		names.splice(names.length, 0, name);
		keys.splice(keys.length, 0, name);

		// generate a key version with diacritic characters replaced with non-accented version
		// e.g. replace é with e
		const norm = name.normalize("NFD").replace(/\p{Diacritic}/gu, "");
		if (norm !== name) {
			keys.splice(keys.length, 0, norm);
		}
	}
	return keys;
}

/**
 * Class to parse locale-specific chronological field names of the Gregorian calendar.
 * @public
 */
export class ChronoFieldFormatter {
	#locale: string;

	// note the string keys in these maps are locale lower-case values to support
	// case-insensitive matching
	#values: Map<ChronoField, Map<string, ChronoFieldValue>>;

	/**
	 * Get a parser for a given locale.
	 *
	 * This method will instantiate and cache parsers, returning cached instances
	 * if already avaialble.
	 *
	 * @param locale - the locale of the parser to get
	 * @returns the parser
	 */
	static forLocale(locale: string) {
		let p = PARSER_CACHE.get(locale);
		if (!p) {
			p = new ChronoFieldFormatter(locale);
			PARSER_CACHE.set(locale, p);
		}
		return p;
	}

	/**
	 * Constructor.
	 *
	 * @param locale - the desired locale
	 * @see {@link ChronoFieldFormatter.forLocale | forLocale()} for a caching factory method
	 */
	constructor(locale: string) {
		this.#locale = locale;
		this.#values = new Map();

		this.#computeMonths(locale);
		this.#computeWeekdays(locale);
	}

	/**
	 * Get the locale.
	 */
	get locale(): string {
		return this.#locale;
	}

	#computeMonths(locale: string) {
		const intlFull = new Intl.DateTimeFormat(locale, {
			month: "long",
			timeZone: "UTC",
		});
		const intlShort = new Intl.DateTimeFormat(locale, {
			month: "short",
			timeZone: "UTC",
		});
		const values = new Map<string, ChronoFieldValue>();
		for (let i = 0; i < 12; i += 1) {
			const date = new Date(Date.UTC(2024, i, 1));
			const val = i + 1;
			const names = [];
			const keys = computeKeysAndNames(date, names, intlFull, intlShort);
			const value = new ChronoFieldValue(
				ChronoField.MONTH_OF_YEAR,
				names,
				val
			);
			for (const key of keys) {
				values.set(key.toLocaleLowerCase(locale), value);
			}
		}
		this.#values.set(ChronoField.MONTH_OF_YEAR, values);
	}

	#computeWeekdays(locale: string) {
		const intlFull = new Intl.DateTimeFormat(locale, {
			weekday: "long",
			timeZone: "UTC",
		});
		const intlShort = new Intl.DateTimeFormat(locale, {
			weekday: "short",
			timeZone: "UTC",
		});
		const values = new Map<string, ChronoFieldValue>();
		for (let i = 1; i <= 7; i += 1) {
			const date = new Date(Date.UTC(2024, 0, i)); // 2024-01-01 is a Monday
			const names = [];
			const keys = computeKeysAndNames(date, names, intlFull, intlShort);
			const value = new ChronoFieldValue(
				ChronoField.DAY_OF_WEEK,
				names,
				i
			);
			for (const key of keys) {
				values.set(key.toLocaleLowerCase(locale), value);
			}
		}
		this.#values.set(ChronoField.DAY_OF_WEEK, values);
	}

	/**
	 * Parse a field value.
	 *
	 * @param field - the field to treat `val` as
	 * @param value - the field value to parse
	 * @returns the associated field value, or undefined if not found
	 */
	parse(field: ChronoField, value: string): ChronoFieldValue {
		if (!value) {
			return undefined;
		}
		if (field === ChronoField.MINUTE_OF_DAY) {
			return this.#parseMinuteOfDay(value);
		} else if (field === ChronoField.DAY_OF_MONTH) {
			return this.#parseDayOfMonth(value);
		}

		const values = this.#values.get(field);
		if (!values) {
			throw new TypeError(`Unsupported ChronoField [${field}].`);
		}
		const lcValue = value.toLocaleLowerCase(this.#locale);
		return values.get(lcValue);
	}

	/**
	 * Parse a day-of-month value in string number form.
	 *
	 * @param value = the value to parse as a day-of-month number
	 * @returns the field value, or `undefined` if not parsable
	 */
	#parseDayOfMonth(value: string): ChronoFieldValue {
		const n = Number(value);
		if (Number.isNaN(n)) {
			return undefined;
		}
		return dayOfMonthChronoFieldValue(n);
	}

	/**
	 * Parse a minute-of-day value in `HH:MM` or `HH` form.
	 *
	 * @param value - the value to parse as a minute-of-day number
	 * @returns the field value, or `undefined` if not parsable
	 */
	#parseMinuteOfDay(value: string): ChronoFieldValue {
		let h = 0;
		let m = 0;
		const idx = value.indexOf(":");
		if (idx > 0) {
			// found : character, so treat as HH:MM
			h = Number(value.substring(0, idx));
			m = Number(value.substring(idx + 1));
		} else {
			// no : so treat as whole hour
			h = Number(value);
		}
		if (Number.isNaN(h) || Number.isNaN(m)) {
			return undefined;
		}
		const n = h * 60 + m;
		return minuteOfDayChronoFieldValue(n);
	}

	/**
	 * Parse a chronological field range string.
	 *
	 * A "range string" is a string formatted like `VALUE - VALUE`. Whitespace
	 * is ignored, and the `- VALUE` portion can be omitted for a singleton
	 * range. For example, in the `en-US` locale, `Jan-Dec` would be parsed as
	 * `[1..12]`.
	 *
	 * @remarks
	 * If `value` is `*` then a range of "all possible values" is returned,
	 * in other words the bounding range for that field.
	 *
	 * @example
	 * Here are some basic examples:
	 *
	 * ```ts
	 * const p = ChronoFieldFormatter.forLocale("en-US");
	 * p.parseRange(ChronoField.MONTH_OF_YEAR, "Jan-Dec");     // [1..12]
	 * p.parseRange(ChronoField.MONTH_OF_YEAR, "4-6");         // [4..6]
	 * p.parseRange(ChronoField.DAY_OF_MONTH, "1-31");         // [1..31]
	 * p.parseRange(ChronoField.DAY_OF_WEEK, "Wednesday");     // [3..3]
	 * p.parseRange(ChronoField.MINUTE_OF_DAY, "00:00-08:30"); // [0..510]
	 * ```
	 *
	 * @param field - the field to parse the range values as
	 * @param value - the range string to parse
	 * @returns the parsed range, or `undefined` if not parsable as a range
	 * @see {@link Utils.splitRange | splitRange()} for more details on range delimiter handling
	 */
	parseRange(field: ChronoField, value: string): IntRange {
		if (!field) {
			return undefined;
		}
		const b = BOUNDS.get(field);
		if (value === "*") {
			return b;
		}
		const a = splitRange(value);
		if (!a) {
			return undefined;
		}
		const l = this.parse(field, a[0]);
		const r = a.length > 1 ? this.parse(field, a[1]) : l;
		let result: IntRange;
		if (l && r) {
			result = new IntRange(l.value, r.value);
		} else {
			// try as numbers, constrained by field bounds
			result = IntRange.parseRange(a, BOUNDS.get(field));
		}
		if (result && b.equals(result)) {
			// return known bounds instance to free up memory
			return b;
		}
		return result;
	}
}
