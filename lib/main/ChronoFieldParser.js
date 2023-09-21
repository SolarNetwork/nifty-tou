import IntRange from "./IntRange.js";
import { splitRange } from "./utils.js";
/**
 * An enumeration of supported chronological fields of the Gregorian calendar.
 * @public
 */
export var ChronoField;
(function (ChronoField) {
    /** The month of year, from January (1) to December (12). */
    ChronoField[ChronoField["MONTH_OF_YEAR"] = 1] = "MONTH_OF_YEAR";
    /** The day of the week, from Monday (1) to Sunday (7). */
    ChronoField[ChronoField["DAY_OF_WEEK"] = 2] = "DAY_OF_WEEK";
})(ChronoField || (ChronoField = {}));
/**
 * A chronological field value.
 * @public
 */
export class ChronoFieldValue {
    #field;
    #names;
    #value;
    /**
     * Constructor.
     *
     * @param field - the chronological field
     * @param names - the value names, from longest to shortest
     * @param value - the value
     */
    constructor(field, names, value) {
        this.#field = field;
        this.#names = names;
        this.#value = value;
        if (!names || names.length < 1) {
            throw new TypeError(`The names array must must not be empty.`);
        }
    }
    /** Get the field. */
    get field() {
        return this.#field;
    }
    /** Get the full name. */
    get name() {
        return this.#names[0];
    }
    /** Get the short name. */
    get shortName() {
        return this.#names.length > 1 ? this.#names[1] : this.#names[0];
    }
    /** Get the value. */
    get value() {
        return this.#value;
    }
}
// a cache of parser instance, for locale keys
const PARSER_CACHE = new Map();
const BOUNDS = new Map();
BOUNDS.set(ChronoField.MONTH_OF_YEAR, new IntRange(1, 12));
BOUNDS.set(ChronoField.DAY_OF_WEEK, new IntRange(1, 7));
/**
 * Compute a set of keys and names of a date field.
 *
 * @param date - the date to use for field formatting
 * @param names - the array to populate with field names, in the order of the given `formats`
 * @param formats - the list of formats to apply to date to generate field names
 * @returns array of date key names
 */
function computeKeysAndNames(date, names, ...formats) {
    const keys = [];
    for (const fmt of formats) {
        // generate name and remove all punctuation, e.g. some short names include a period
        const name = fmt.format(date).replace(/\p{P}/gu, "");
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
export class ChronoFieldParser {
    #locale;
    // note the string keys in these maps are locale lower-case values to support
    // case-insensitive matching
    #values;
    /**
     * Get a parser for a given locale.
     *
     * This method will instantiate and cache parsers, returning cached instances
     * if already avaialble.
     *
     * @param locale - the locale of the parser to get
     * @returns the parser
     */
    static forLocale(locale) {
        let p = PARSER_CACHE.get(locale);
        if (!p) {
            p = new ChronoFieldParser(locale);
            PARSER_CACHE.set(locale, p);
        }
        return p;
    }
    /**
     * Constructor.
     *
     * @param locale - the desired locale
     * @see {@link ChronoFieldParser.forLocale | forLocale()} for a caching factory method
     */
    constructor(locale) {
        this.#locale = locale;
        this.#values = new Map();
        this.#computeMonths(locale);
        this.#computeWeekdays(locale);
    }
    /**
     * Get the locale.
     */
    get locale() {
        return this.#locale;
    }
    #computeMonths(locale) {
        const intlFull = new Intl.DateTimeFormat(locale, {
            month: "long",
            timeZone: "UTC",
        });
        const intlShort = new Intl.DateTimeFormat(locale, {
            month: "short",
            timeZone: "UTC",
        });
        const values = new Map();
        for (let i = 0; i < 12; i += 1) {
            const date = new Date(Date.UTC(2024, i, 1));
            const val = i + 1;
            const names = [];
            const keys = computeKeysAndNames(date, names, intlFull, intlShort);
            const value = new ChronoFieldValue(ChronoField.MONTH_OF_YEAR, names, val);
            for (const key of keys) {
                values.set(key.toLocaleLowerCase(locale), value);
            }
        }
        this.#values.set(ChronoField.MONTH_OF_YEAR, values);
    }
    #computeWeekdays(locale) {
        const intlFull = new Intl.DateTimeFormat(locale, {
            weekday: "long",
            timeZone: "UTC",
        });
        const intlShort = new Intl.DateTimeFormat(locale, {
            weekday: "short",
            timeZone: "UTC",
        });
        const values = new Map();
        for (let i = 1; i <= 7; i += 1) {
            const date = new Date(Date.UTC(2024, 0, i)); // 2024-01-01 is a Monday
            const names = [];
            const keys = computeKeysAndNames(date, names, intlFull, intlShort);
            const value = new ChronoFieldValue(ChronoField.DAY_OF_WEEK, names, i);
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
    parse(field, value) {
        if (!value) {
            return undefined;
        }
        const values = this.#values.get(field);
        if (!values) {
            throw new TypeError(`Unsupported ChronoField [${field}].`);
        }
        const lcValue = value.toLocaleLowerCase(this.#locale);
        return values.get(lcValue);
    }
    /**
     * Parse a chronological field range string.
     *
     * A "range string" is a string formatted like `VALUE - VALUE`. Whitespace
     * is ignored, and the `- VALUE` portion can be omitted for a singleton
     * range. For example, in the `en-US` locale, `Jan-Dec` would be parsed as
     * `[1..12]`.
     *
     * @example
     * Here are some basic examples:
     *
     * ```ts
     * const p = ChronoFieldParser.forLocale('en-US');
     * p.parseRange(ChronoField.MONTH_OF_YEAR, 'Jan-Dec'); // [1..12]
     * p.parseRange(ChronoField.MONTH_OF_YEAR, '4-6');     // [4..6]
     * p.parseRange(ChronoField.DAY_OF_WEEK, 'Wednesday'); // [3..3]
     * ```
     *
     * @param field - the field to parse the range values as
     * @param value - the range string to parse
     * @returns the parsed range, or `undefined` if not parsable as a range
     */
    parseRange(field, value) {
        if (!field) {
            return undefined;
        }
        const a = splitRange(value);
        if (!a) {
            return undefined;
        }
        const l = this.parse(field, a[0]);
        const r = a.length > 1 ? this.parse(field, a[1]) : l;
        if (l && r) {
            return new IntRange(l.value, r.value);
        }
        // try as numbers, constrained by field bounds
        return IntRange.parseRange(a, BOUNDS.get(field));
    }
}
//# sourceMappingURL=ChronoFieldParser.js.map