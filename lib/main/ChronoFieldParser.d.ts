import IntRange from "./IntRange.js";
/**
 * An enumeration of supported chronological fields of the Gregorian calendar.
 * @public
 */
export declare enum ChronoField {
    /** The month of year, from January (1) to December (12). */
    MONTH_OF_YEAR = 1,
    /** The day of the week, from Monday (1) to Sunday (7). */
    DAY_OF_WEEK = 2
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
    parseRange(field: ChronoField, value: string): IntRange;
}
//# sourceMappingURL=ChronoFieldParser.d.ts.map