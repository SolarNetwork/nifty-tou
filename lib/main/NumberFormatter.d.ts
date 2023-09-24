/**
 * Default number format options to use.
 * @public
 */
export declare const DEFAULT_FORMAT_OPTIONS: Intl.NumberFormatOptions;
/**
 * A locale-specific number parser.
 *
 * @remarks
 * This parser supports basic language parsing abilities, but can still parse
 * unexpected results given the right input. For example:
 *
 * ```ts
 * NumberFormatter.forLcale("de").parse("1.23"); // returns 123
 * ```
 *
 * That example produces `123` instead of the (perhaps?) expected `1.23` because
 * `.` is a thousands delimiter character in German and the parser simply removes
 * that from the input, resulting in the string `"123"` that is then parsed into
 * the number result `123`.
 *
 * Adapted from Mike Bostock's
 * {@link https://observablehq.com/@mbostock/localized-number-parsing | lovely code}
 * (thanks, Mike!).
 *
 * @public
 */
export default class NumberFormatter {
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
    static forLocale(locale: string): NumberFormatter;
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
     * @returns the parsed number, or `undefined` if `s` is `undefined`
     */
    parse(s: string): number;
    /**
     * Format a number into a string.
     *
     * This will return `"NaN"` if `n` is `NaN` or an empty string if `n` is `undefined` or `null`.
     * Otherwise, `n` will be formatted with `format` if provided, falling back to
     * a format with {@link DEFAULT_FORMAT_OPTIONS}.
     *
     * @param n - the number to format
     * @param format - the format to use, or else a default format will be used
     * @returns the formatted number
     */
    format(n: number, format?: Intl.NumberFormat): string;
}
//# sourceMappingURL=NumberFormatter.d.ts.map