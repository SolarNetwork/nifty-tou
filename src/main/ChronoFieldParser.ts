/**
 * An enumeration of supported chronological fields of the Gregorian calendar.
 * @public
 */
export enum ChronoField {
	/** The month of year, from January (1) to December (12). */
	MONTH_OF_YEAR = 0,

	/** The day of the week, from Monday (1) to Sunday (7). */
	DAY_OF_WEEK = 1,
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

const PARSER_CACHE: Map<string, ChronoFieldParser> = new Map();

/**
 * Class to parse locale-specific chronological field names of the Gregorian calendar.
 * @public
 */
export class ChronoFieldParser {
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
			p = new ChronoFieldParser(locale);
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

	/**
	 * Compute a set of keys and names of a date field.
	 *
	 * @param date - the date to use for field formatting
	 * @param names - the array to populate with field names, in the order of the given `formats`
	 * @param formats - the list of formats to apply to date to generate field names
	 * @returns array of date key names
	 */
	static #computeKeysAndNames(
		date: Date,
		names: string[],
		...formats: Intl.DateTimeFormat[]
	): string[] {
		const keys: string[] = [];
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
			const keys = ChronoFieldParser.#computeKeysAndNames(
				date,
				names,
				intlFull,
				intlShort
			);
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
			const keys = ChronoFieldParser.#computeKeysAndNames(
				date,
				names,
				intlFull,
				intlShort
			);
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
		const values = this.#values.get(field);
		if (!values) {
			throw new TypeError(`Unsupported ChronoField [${field}].`);
		}
		const lcValue = value.toLocaleLowerCase(this.#locale);
		return values.get(lcValue);
	}
}
