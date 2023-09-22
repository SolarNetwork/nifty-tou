/**
 * A locale-specific number parser.
 *
 * @remarks
 * This parser supports basic language parsing abilities, but can still parse
 * unexpected results given the right input. For example:
 *
 * ```ts
 * NumberParser.forLcale("de").parse("1.23"); // returns 123
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
export default class NumberParser {
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
    static forLocale(locale: string): NumberParser;
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
}
//# sourceMappingURL=NumberParser.d.ts.map