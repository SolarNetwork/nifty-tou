/**
 * A locale-specific number parser.
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
//# sourceMappingURL=NumberParser.d.ts.map