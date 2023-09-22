/**
 * A delightful little library for working with time-of-use tariffs.
 *
 * @packageDocumentation
 */

/**
 * Concatenate two strings with a comma.
 *
 * If `s1` has no length then `s2` is returned as-is. If `s2` has no length
 * then `s1` is returned as-is. Otherwise the strings are concatenated with
 * a comma delimiter.
 *
 * @param s1 - the string to append to
 * @param s2 - the string to append
 * @returns the comma-concatenated string
 * @public
 */
declare function cconcat(s1?: string, s2?: string): string;

/**
 * An enumeration of supported chronological fields of the Gregorian calendar.
 * @public
 */
export declare enum ChronoField {
    /** The month of year, from January (1) to December (12). */
    MONTH_OF_YEAR = 1,
    /** The day of month, from 1 - 31. */
    DAY_OF_MONTH = 2,
    /** The day of the week, from Monday (1) to Sunday (7). */
    DAY_OF_WEEK = 3,
    /** The minute of the day, from 0 to 1440 (assuming exclusive maximum). */
    MINUTE_OF_DAY = 4
}

/**
 * Class to parse locale-specific chronological field names of the Gregorian calendar.
 * @public
 */
export declare class ChronoFieldParser {
    #private;
    /**
     * Get a parser for a given locale.
     *
     * This method will instantiate and cache parsers, returning cached instances
     * if already avaialble.
     *
     * @param locale - the locale of the parser to get
     * @returns the parser
     */
    static forLocale(locale: string): ChronoFieldParser;
    /**
     * Constructor.
     *
     * @param locale - the desired locale
     * @see {@link ChronoFieldParser.forLocale | forLocale()} for a caching factory method
     */
    constructor(locale: string);
    /**
     * Get the locale.
     */
    get locale(): string;
    /**
     * Parse a field value.
     *
     * @param field - the field to treat `val` as
     * @param value - the field value to parse
     * @returns the associated field value, or undefined if not found
     */
    parse(field: ChronoField, value: string): ChronoFieldValue;
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
     * const p = ChronoFieldParser.forLocale('en-US');
     * p.parseRange(ChronoField.MONTH_OF_YEAR, 'Jan-Dec');    // [1..12]
     * p.parseRange(ChronoField.MONTH_OF_YEAR, '4-6');        // [4..6]
     * p.parseRange(ChronoField.DAY_OF_MONTH, '1-31');        // [1..31]
     * p.parseRange(ChronoField.DAY_OF_WEEK, 'Wednesday');    // [3..3]
     * p.parseRange(ChronoField.MINUTE_OF_DAY, '00:00-08:30); // [0..510]
     * ```
     *
     * @param field - the field to parse the range values as
     * @param value - the range string to parse
     * @returns the parsed range, or `undefined` if not parsable as a range
     */
    parseRange(field: ChronoField, value: string): IntRange;
}

/**
 * A chronological field value.
 * @public
 */
export declare class ChronoFieldValue {
    #private;
    /**
     * Constructor.
     *
     * @param field - the chronological field
     * @param names - the value names, from longest to shortest
     * @param value - the value
     */
    constructor(field: ChronoField, names: string[], value: number);
    /** Get the field. */
    get field(): ChronoField;
    /** Get the full name. */
    get name(): string;
    /** Get the short name. */
    get shortName(): string;
    /** Get the value. */
    get value(): number;
}

/**
 * An immutable number range with min/max values.
 * @public
 */
export declare class IntRange {
    #private;
    /**
     * Constructor.
     *
     * @param min - the mimnimum value
     * @param max - the maximum value
     */
    constructor(min: number, max: number);
    /**
     * Create a singleton range, where the minimum and maximum values are equal.
     *
     * @param value - the minimum and maximum value
     * @returns the new singleton range instance
     */
    static of(value: number): IntRange;
    /**
     * Create a range.
     *
     * @param min - the minimum value
     * @param max - the maximum value
     * @returns the new range instance
     */
    static rangeOf(min: number, max: number): IntRange;
    /**
     * Parse a range array of number strings into an `IntRange`.
     *
     * @param value - the range array to parse; can have 1 or 2 elements;
     *     all elements must have number values
     * @param bounds - the optional bounds (inclusive) to enforce; if the parsed range
     * @returns the parsed range, or `undefined` if a range could not be parsed or extends
     *          beyond the given `bounds` then `undefined` will be returned
     */
    static parseRange(array: string[], bounds?: IntRange): IntRange;
    /**
     * Get the minimum value.
     */
    get min(): number;
    /**
     * Get the minimum value.
     */
    get max(): number;
    /**
     * Get the number of values between `min` and `max`, inclusive.
     */
    get length(): number;
    /**
     * Test if this range represents a singleton value, where the minimum and
     * maximum values in the range are equal.
     */
    get isSingleton(): boolean;
    /**
     * Test if a value is within this range, inclusive.
     *
     * @param value - the value to test
     * @returns `true` if `min <= value <= max`
     */
    contains(value: number): boolean;
    /**
     * Test if another range is completely within this range, inclusive.
     *
     * @param min - the minimum of the range to test
     * @param max - the maximum of the range to test
     * @returns `true` if `this.min <= min <= max <= this.max`
     */
    containsAll(min: number, max: number): boolean;
    /**
     * Test if another range is completely within this range, inclusive.
     *
     * @param o - the range to test
     * @returns `true` if `this.min <= o.min <= o.max <= this.max`
     */
    containsRange(o: IntRange): boolean;
    /**
     * Test if this range intersects with a given range.
     *
     * @param o - the range to compare to this range
     * @returns `true` if this range intersects (overlaps) with the given range
     */
    intersects(o: IntRange): boolean;
    /**
     * Test if this range is adjacent to (but not intersecting) a given range.
     *
     * @param o - the range to compare to this range
     * @returns `true` if this range is adjacent to the given range
     */
    adjacentTo(o: IntRange): boolean;
    /**
     * Test if this range could be merged with another range.
     *
     * Two ranges can be merged if they are either adjacent to or intersect with
     * each other.
     *
     * @param o - the range to test
     * @returns `true` if this range is either adjacent to or intersects with the given range
     */
    canMergeWith(o: IntRange): boolean;
    /**
     * Merge this range with a given range, returning the merged range.
     *
     * @param o - the range to merge with this range
     * @returns the new merged range
     */
    mergeWith(o: IntRange): IntRange;
    /**
     * Compares this object with the specified object for order.
     *
     * This implementation only compares the `min` values of each range.
     *
     * @param o - the range to compare to
     * @returns `-1`, `0`, or `1` if `o` is less than, equal to, or greater than this range
     */
    compareTo(o: IntRange): number;
    /**
     * Test for equality.
     *
     * This method tests if `obj` is an instance of `IntRange` and compares the
     * `min` and `max` values for strict equality.
     *
     * @param obj - the object to compare to
     * @returns `true` if `obj` is equal to this
     */
    equals(obj: any): boolean;
    /**
     * Get a string representation.
     *
     * The format returned by this method is `[min..max]`.
     *
     * @returns the string representation
     */
    toString(): string;
    /**
     * Generate a description of a range.
     *
     * @remarks
     * This method is similar to {@link IntRange.toString | toString()}, except that it compares a given range
     * with a bounding range. If the given range is equal to the bounding range, or the given range
     * is undefined, then the given range is taken to mean "all possible values" and a `*` character
     * is returned instead of the normal `[min..max]` representation.
     *
     * @param bounds - the "full" range that defines the bounds of `r`
     * @param r - the range
     * @returns if `r` represents "all possible values" then the literal string `*`,
     *     otherwise the string representation of `r`
     */
    static description(bounds: IntRange, r?: IntRange): string;
}

/**
 * A locale-specific number parser.
 *
 * Adapted from Mike Bostock's
 * {@link https://observablehq.com/@mbostock/localized-number-parsing | lovely code}
 * (thanks, Mike!).
 *
 * @public
 */
export declare class NumberParser {
    #private;
    /**
     * Constructor.
     *
     * @param locale - the desired locale
     */
    constructor(locale: string);
    /** Get the locale. */
    get locale(): string;
    /**
     * Normalize a locale-specific number string.
     *
     * @param s - the number string to parse in this instance's locale
     * @returns the number string normalized into a JavaScript number string
     */
    norm(s: string): string;
    /**
     * Parse a locale-specific number string.
     *
     * @param s - the number string to parse in this instance's locale
     * @returns the parsed number, or `undefined`
     */
    parse(s: string): number;
}

/**
 * Verify that a variable is undefined or of a given type.
 *
 * @param arg - the argument to verify
 * @param name - a descriptive name of `arg`
 * @param type - if `arg` is defined, verify that `arg` is an instanceof this type
 * @returns the passed in `arg` value
 * @public
 */
declare function optional<T>(arg: T, name: string, type?: new (...args: any[]) => any): T;

/**
 * Prefix an optional string.
 *
 * If `prefix` or `s` have no length then `s` is returned as-is. Otherwise the strings are concatenated.
 *
 * @param prefix - the prefix to prepend to `s`
 * @param s - the string to append to `prefix`
 * @returns the concatenated string
 * @public
 */
declare function prefix(prefix?: string, s?: string): string;

/**
 * Verify that a variable is defined and optionally of a given type.
 *
 * @param arg - the argument to verify
 * @param name - a descriptive name of `arg`
 * @param type - if provided, verify that `arg` is an instanceof this type
 * @returns the passed in `arg` value
 * @public
 */
declare function required<T>(arg: T, name: string, type?: new (...args: any[]) => any): T;

/**
 * Split a string based on a range delimiter pattern.
 *
 * A range delimited string has the pattern `VALUE - VALUE`, where whitespace
 * at the start, around the `-` delimiter, and at the end is not significant.
 *
 * @param range - the range string to split into components, whitespace trimmed
 * @returns the split range, of length 1 or 2, or `undefined` if `range` is undefined
 * @public
 */
declare function splitRange(range: string): string[];

/**
 * An identifiable tariff rate.
 *
 * @remarks
 * The `exponent` property can be used to maintain precision in `amount`. For example
 * an amount of `1.23` could be expressed as `123` with an `exponent` of `-2`.
 *
 * @public
 */
export declare class TariffRate {
    #private;
    /**
     * Constructor.
     *
     * @param id - the identifier
     * @param amount - an amount
     * @param exponent - a base-10 exponent to interpret `amount` in; if not provided then `0` is assumed
     * @param description - a description
     */
    constructor(id: string, amount: number, exponent?: number, description?: string);
    /**
     * Get the identifier.
     */
    get id(): string;
    /**
     * Get the description.
     */
    get description(): string;
    /**
     * Get the amount.
     */
    get amount(): number;
    /**
     * Get the exponent.
     */
    get exponent(): number;
    /**
     * Get a string representation.
     *
     * @returns the string representation
     */
    toString(): string;
}

/**
 * A tariff with time-based range rules.
 *
 * The rules associated with this tariff are represented by a set of date ranges
 * that serve as the constraints that must be satisfied by a given date for the
 * rule to apply.
 *
 * @remarks
 * The date range constraints use inclusive minimum/maximum matching semantics,
 * <b>except</b> for the `minuteOfDayRange` constraint, that uses inclusive
 * minimum and <b>exclusive</b> maximum semantics.
 *
 * The time-based constraints supported are:
 *
 * <table>
 * <tr><th>Constraint</th><th>Bounds</th><th>Description</th></tr>
 * <tr><td>monthRange</td><td>1 - 12</td><td>January - December</td></tr>
 * <tr><td>dayOfMonthRange</td><td>1 - 31</td><td></td></tr>
 * <tr><td>dayOfWeekRange</td><td>1 - 7</td><td>Monday - Friday</td></tr>
 * <tr><td>minuteOfDayRange</td><td>0 - 1440</td><td>00:00 - 24:00</td></tr>
 * </table>
 *
 * @example
 * The {@link TemporalRangesTariff.parse | parse()} method provides an easy way
 * to parse instances from language-specific time range values:
 *
 * ```ts
 * // a tariff for weekday mornings
 * const tt = TemporalRangesTariff.parse(
 *   "en-US",
 *   "*",
 *   "*",
 *   "Mon - Fri",
 *   "0 - 12",
 *   [new TariffRate("Morning Fixed", "1.23")]
 * );
 *
 * // a tariff for weekday evenings
 * const tt = TemporalRangesTariff.parse(
 *   "en-US",
 *   "*",
 *   "*",
 *   "Mon - Fri",
 *   "12 - 24",
 *   [new TariffRate("Morning Fixed", "2.34")]
 * );
 * ```
 *
 * @public
 */
export declare class TemporalRangesTariff {
    #private;
    /**
     * Range for all months of a year: 1 - 12 (inclusive).
     */
    static get ALL_MONTHS(): IntRange;
    /**
     * Range for all days of a month: 1 - 31 (inclusive).
     */
    static get ALL_DAYS_OF_MONTH(): IntRange;
    /**
     * Range for all days of a week: 1 - 7 (inclusive).
     */
    static get ALL_DAYS_OF_WEEK(): IntRange;
    /**
     * Range for all minutes of a day: 0 - 1440 (inclusive min, exclusive max).
     */
    static get ALL_MINUTES_OF_DAY(): IntRange;
    /**
     * Constructor.
     *
     * @param monthRange - the month range (1-12, inclusive)
     * @param dayOfMonthRange - the day of month range (1-31, inclusive)
     * @param dayOfWeekRange - the day of week range (1-7, with 1 = Monday, 7 = Sunday, inclusive)
     * @param minuteOfDayRange - the minute of day range (0-1440, inclusive minimum, exclusive maximum)
     * @param rates - the rates, as an array of `TariffRate` objects
     */
    constructor(monthRange?: IntRange, dayOfMonthRange?: IntRange, dayOfWeekRange?: IntRange, minuteOfDayRange?: IntRange, rates?: Array<TariffRate>);
    /**
     * Get the month of year range.
     */
    get monthRange(): IntRange;
    /**
     * Get the day of month range.
     */
    get dayOfMonthRange(): IntRange;
    /**
     * Get the day of week range.
     */
    get dayOfWeekRange(): IntRange;
    /**
     * Get the minute of day range.
     */
    get minuteOfDayRange(): IntRange;
    /**
     * Get the rates, as an object of rate ID to `TariffRate` objects.
     */
    get rates(): Record<string, TariffRate>;
    /**
     * Test if this tariff applies on a given date.
     *
     * All range constraints are treated as inclusive bounds, except for
     * the `minuteOfDayRange` that is treated as an inclusive minimum and
     * exclusive maximum.
     *
     * @param date - the date to test if this rate applies at
     * @param utc - if `true` then use UTC date components, otherwise assume the local time zone
     * @returns `true` if this tariff applies on the given date
     */
    appliesAt(date: Date, utc?: boolean): boolean;
    /**
     * Get a string representation.
     *
     * @returns the string representation
     */
    toString(): string;
    /**
     * Parse time range criteria into a `TemporalRangesTariff` instance.
     *
     * @remarks
     * Note that the `minuteOfDayRange` can be specified as a range of `HH:MM` 24-hour hour and minute
     * values, <b>or</b> whole hours. For example `01:00-08:00` and `1-8` are equivalent.
     *
     * Additionally, all range values may be specified as `*` to mean "all possible values", in which
     * that range will be resolved to `undefined`.
     *
     * @param locale - the locale to parse the ranges as
     * @param monthRange - the month range to parse, for example `January-December`, `Jan-Dec`, or `1-12`
     * @param dayOfMonthRange - the day of month range to parse, for example `1-31`
     * @param dayOfWeekRange - the day of week range to parse, for example `Monday-Sunday`, `Mon-Sun`, or `1-7`
     * @param minuteOfDayRange - the minute of day range to parse, for example `00:00-24:00` or `0-24`
     * @param rates - the tariff rates to associate with the time range criteria
     * @returns the new instance
     */
    static parse(locale: string, monthRange?: string, dayOfMonthRange?: string, dayOfWeekRange?: string, minuteOfDayRange?: string, rates?: Array<TariffRate>): TemporalRangesTariff;
}

declare namespace Utils {
    export {
        cconcat,
        optional,
        prefix,
        required,
        splitRange
    }
}
export { Utils }

export { }
