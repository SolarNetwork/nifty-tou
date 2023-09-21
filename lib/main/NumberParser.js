/**
 * A locale-specific number parser.
 *
 * Adapted from Mike Bostock's https://observablehq.com/\@mbostock/localized-number-parsing
 * @public
 */
export default class NumberParser {
    #locale;
    #group;
    #decimal;
    #numeral;
    #index;
    /**
     * Constructor.
     *
     * @param locale - the desired locale
     */
    constructor(locale) {
        const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
        const numerals = [
            ...new Intl.NumberFormat(locale, { useGrouping: false }).format(9876543210),
        ].reverse();
        const index = new Map(numerals.map((d, i) => [d, i.toString()]));
        this.#locale = locale;
        this.#group = new RegExp(`[${parts.find((d) => d.type === "group").value}]`, "g");
        this.#decimal = new RegExp(`[${parts.find((d) => d.type === "decimal").value}]`);
        this.#numeral = new RegExp(`[${numerals.join("")}]`, "g");
        this.#index = (d) => index.get(d);
    }
    /** Get the locale. */
    get locale() {
        return this.#locale;
    }
    /**
     * Normalize a locale-specific number string.
     *
     * @param s - the number string to parse in this instance's locale
     * @returns the number string normalized into a JavaScript number string
     */
    norm(s) {
        if (s === undefined || s === null) {
            return undefined;
        }
        s = s
            .trim()
            .replaceAll("+", "")
            .replace(this.#group, "")
            .replace(this.#decimal, ".")
            .replace(this.#numeral, this.#index);
        return s || undefined;
    }
    /**
     * Parse a locale-specific number string.
     *
     * @param s - the number string to parse in this instance's locale
     * @returns the parsed number, or `undefined`
     */
    parse(s) {
        s = this.norm(s);
        return s ? +s : NaN;
    }
}
//# sourceMappingURL=NumberParser.js.map