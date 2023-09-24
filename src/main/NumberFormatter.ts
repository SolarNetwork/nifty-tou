// a cache of parser instance, for locale keys
const PARSER_CACHE: Map<string, NumberFormatter> = new Map();

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
	#locale: string;
	#group: RegExp;
	#decimal: RegExp;
	#numeral: RegExp;
	#index: (d: string) => string;

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
			p = new NumberFormatter(locale);
			PARSER_CACHE.set(locale, p);
		}
		return p;
	}

	/**
	 * Constructor.
	 *
	 * @param locale - the desired locale
	 */
	constructor(locale: string) {
		const parts = new Intl.NumberFormat(locale).formatToParts(12345.6);
		const numerals = [
			...new Intl.NumberFormat(locale, { useGrouping: false }).format(
				9876543210
			),
		].reverse();
		const index = new Map<string, string>(
			numerals.map((d, i) => [d, i.toString()])
		);
		this.#locale = locale;
		this.#group = new RegExp(
			`[${parts.find((d) => d.type === "group").value}]`,
			"g"
		);
		this.#decimal = new RegExp(
			`[${parts.find((d) => d.type === "decimal").value}]`
		);
		this.#numeral = new RegExp(`[${numerals.join("")}]`, "g");
		this.#index = (d) => index.get(d);
	}

	/** Get the locale. */
	get locale(): string {
		return this.#locale;
	}

	/**
	 * Normalize a locale-specific number string.
	 *
	 * @param s - the number string to parse in this instance's locale
	 * @returns the number string normalized into a JavaScript number string
	 */
	norm(s: string): string {
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
	 * @returns the parsed number, or `undefined` if `s` is `undefined`
	 */
	parse(s: string): number {
		s = this.norm(s);
		return s ? +s : NaN;
	}
}
