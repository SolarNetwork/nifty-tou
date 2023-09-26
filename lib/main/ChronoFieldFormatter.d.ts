import { default as IntRange, IntRangeFormatOptions } from "./IntRange.js";
/**
 * An enumeration of supported chronological fields of the Gregorian calendar.
 * @public
 */
export declare enum ChronoField {
    /** Year. */
    YEAR = 1,
    /** The month of year, from January (1) to December (12). */
    MONTH_OF_YEAR = 2,
    /** The day of month, from 1 - 31. */
    DAY_OF_MONTH = 3,
    /** The day of the week, from Monday (1) to Sunday (7). */
    DAY_OF_WEEK = 4,
    /** The minute of the day, from 0 to 1440 (assuming exclusive maximum). */
    MINUTE_OF_DAY = 5
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
    /**
     * Get the value in range form.
     * If `value` is `Infinity` this will return `null`.
     */
    get rangeValue(): number | null;
}
/**
 * Range for all months of a year: 1 - 12 (inclusive).
 * @public
 */
export declare const ALL_MONTHS: IntRange;
/**
 * Range for all days of a month: 1 - 31 (inclusive).
 * @public
 */
export declare const ALL_DAYS_OF_MONTH: IntRange;
/**
 * Range for all days of a week: 1 - 7 (inclusive).
 * @public
 */
export declare const ALL_DAYS_OF_WEEK: IntRange;
/**
 * Range for all minutes of a day: 0 - 1440 (inclusive min, exclusive max).
 * @public
 */
export declare const ALL_MINUTES_OF_DAY: IntRange;
/**
 * Class to parse locale-specific chronological field names of the Gregorian calendar.
 * @public
 */
export declare class ChronoFieldFormatter {
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
    static forLocale(locale: string): ChronoFieldFormatter;
    /**
     * Constructor.
     *
     * @param locale - the desired locale
     * @see {@link ChronoFieldFormatter.forLocale | forLocale()} for a caching factory method
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
    parse(field: ChronoField, value: string, options?: IntRangeFormatOptions): ChronoFieldValue;
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
     * in other words the bounding range for that field. If a field has
     * no implicit bounds (such as `YEAR`) then an unbounded range is returned.
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
     * @param options - the options
     * @returns the parsed range, or `undefined` if not parsable as a range
     * @see {@link Utils.splitRange | splitRange()} for more details on range delimiter handling
     */
    parseRange(field: ChronoField, value: string, options?: IntRangeFormatOptions): IntRange;
    /**
     * Format a field value into a locale-specific string.
     *
     * @param field - the field to format
     * @param value - the field value to format
     * @param options - the options
     * @returns the formatted field value
     */
    format(field: ChronoField, value: number, options?: IntRangeFormatOptions): string;
    /**
     * Format a field range into a locale-specific string.
     *
     * @param field - the field to format
     * @param value - the range to format
     * @param options - options
     * @returns the formatted range
     */
    formatRange(field: ChronoField, value: IntRange, options?: IntRangeFormatOptions): string;
}
//# sourceMappingURL=ChronoFieldFormatter.d.ts.map