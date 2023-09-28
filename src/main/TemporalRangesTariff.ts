import {
	ALL_MONTHS,
	ALL_DAYS_OF_MONTH,
	ALL_DAYS_OF_WEEK,
	ALL_MINUTES_OF_DAY,
	ChronoField,
	ChronoFieldFormatter,
} from "./ChronoFieldFormatter.js";
import Comparable from "./Comparable.js";
import {
	default as IntRange,
	IntRangeFormatOptions,
	UNBOUNDED_RANGE,
	UNBOUNDED_VALUE,
} from "./IntRange.js";
import TariffRate from "./TariffRate.js";
import { cconcat, compare, optional, prefix, required } from "./utils.js";

/**
 * The default "all values" representation.
 * @public
 */
export const ALL_VALUES = UNBOUNDED_VALUE;

/**
 * Options to use when formatting in the {@link TemporalRangesTariff.formatRange | formatRange()} method.
 * @public
 */
export interface TemporalRangesTariffFormatOptions
	extends IntRangeFormatOptions {
	/**
	 * The value to use for a range equal to a field's bounding range, that is "all possible values".
	 * The default value is `"*"`.
	 */
	allValue?: string;

	/**
	 * Format the minutes-of-day as whole hours, rather than the `HH:MM` format.
	 */
	wholeHours?: boolean;
}

function clamped(bounds: IntRange, r?: IntRange): IntRange | undefined {
	if (r === undefined) {
		return undefined;
	}
	if (UNBOUNDED_RANGE.equals(r)) {
		return bounds;
	}
	if (bounds.containsRange(r)) {
		return r;
	}
	const min =
		r.min === null || (bounds.min !== null && r.min < bounds.min)
			? bounds.min
			: r.min;
	const max =
		r.max === null || (bounds.max !== null && r.max > bounds.max)
			? bounds.max
			: r.max;
	if (min == bounds.min && max == bounds.max) {
		return bounds;
	}
	return new IntRange(min, max);
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
 *   [new TariffRate("Weekday AM", "1.23")]
 * );
 *
 * // a tariff for weekday evenings
 * const tt = TemporalRangesTariff.parse(
 *   "en-US",
 *   "*",
 *   "*",
 *   "Mon - Fri",
 *   "12 - 24",
 *   [new TariffRate("Weekday PM", "2.34")]
 * );
 * ```
 *
 * @public
 */
export default class TemporalRangesTariff
	implements Comparable<TemporalRangesTariff>
{
	#monthRange?: IntRange;
	#dayOfMonthRange?: IntRange;
	#dayOfWeekRange?: IntRange;
	#minuteOfDayRange?: IntRange;
	#rates: Record<string, TariffRate>;

	/**
	 * Range for all months of a year: 1 - 12 (inclusive).
	 */
	static get ALL_MONTHS(): IntRange {
		return ALL_MONTHS;
	}

	/**
	 * Range for all days of a month: 1 - 31 (inclusive).
	 */
	static get ALL_DAYS_OF_MONTH(): IntRange {
		return ALL_DAYS_OF_MONTH;
	}

	/**
	 * Range for all days of a week: 1 - 7 (inclusive).
	 */
	static get ALL_DAYS_OF_WEEK(): IntRange {
		return ALL_DAYS_OF_WEEK;
	}

	/**
	 * Range for all minutes of a day: 0 - 1440 (inclusive min, exclusive max).
	 */
	static get ALL_MINUTES_OF_DAY(): IntRange {
		return ALL_MINUTES_OF_DAY;
	}

	/**
	 * Constructor.
	 *
	 * @param monthRange - the month range (1-12, inclusive)
	 * @param dayOfMonthRange - the day of month range (1-31, inclusive)
	 * @param dayOfWeekRange - the day of week range (1-7, with 1 = Monday, 7 = Sunday, inclusive)
	 * @param minuteOfDayRange - the minute of day range (0-1440, inclusive minimum, exclusive maximum)
	 * @param rates - the rates, as an array of `TariffRate` objects
	 */
	constructor(
		monthRange?: IntRange,
		dayOfMonthRange?: IntRange,
		dayOfWeekRange?: IntRange,
		minuteOfDayRange?: IntRange,
		rates?: TariffRate[]
	) {
		this.#monthRange = clamped(
			ALL_MONTHS,
			optional(monthRange, "monthRange", IntRange)
		);
		this.#dayOfMonthRange = clamped(
			ALL_DAYS_OF_MONTH,
			optional(dayOfMonthRange, "dayOfMonthRange", IntRange)
		);
		this.#dayOfWeekRange = clamped(
			ALL_DAYS_OF_WEEK,
			optional(dayOfWeekRange, "dayOfWeekRange", IntRange)
		);
		this.#minuteOfDayRange = clamped(
			ALL_MINUTES_OF_DAY,
			optional(minuteOfDayRange, "minuteOfDayRange", IntRange)
		);

		// turn array of rates into Object of id -> rate
		const r: Record<string, TariffRate> = {};
		if (Array.isArray(rates)) {
			for (let i = 0; i < rates.length; i += 1) {
				const rate = required(rates[i], `rate[${i}]`, TariffRate);
				r[rate.id] = rate;
			}
		}
		this.#rates = Object.freeze(r);
	}

	/**
	 * Get the month of year range.
	 */
	get monthRange(): IntRange | undefined {
		return this.#monthRange;
	}

	/**
	 * Get the day of month range.
	 */
	get dayOfMonthRange(): IntRange | undefined {
		return this.#dayOfMonthRange;
	}

	/**
	 * Get the day of week range.
	 */
	get dayOfWeekRange(): IntRange | undefined {
		return this.#dayOfWeekRange;
	}

	/**
	 * Get the minute of day range.
	 */
	get minuteOfDayRange(): IntRange | undefined {
		return this.#minuteOfDayRange;
	}

	/**
	 * Get the rates, as an object of rate ID to `TariffRate` objects.
	 */
	get rates(): Record<string, TariffRate> {
		return this.#rates;
	}

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
	appliesAt(date: Date, utc?: boolean): boolean {
		return (
			date &&
			this.#rangeApplies(
				this.#dateMonth(utc ? date.getUTCMonth() : date.getMonth()),
				this.#monthRange
			) &&
			this.#rangeApplies(
				utc ? date.getUTCDate() : date.getDate(),
				this.#dayOfMonthRange
			) &&
			this.#rangeApplies(
				this.#dateDow(utc ? date.getUTCDay() : date.getDay()),
				this.#dayOfWeekRange
			) &&
			this.#rangeApplies(
				utc
					? date.getUTCHours() * 60 + date.getUTCMinutes()
					: date.getHours() * 60 + date.getMinutes(),
				this.#minuteOfDayRange,
				true
			)
		);
	}

	/**
	 * Test if an optional range contains a value.
	 *
	 * @param value - the number to test if the range contains
	 * @param range - the range to test
	 * @param exclusiveEnd - if `true` then treat the range end as an exclusive bound
	 * @returns `true` if the given range is not defined, or it contains the given value
	 */
	#rangeApplies(
		value: number,
		range?: IntRange,
		exclusiveEnd?: boolean
	): boolean {
		return (
			!range ||
			(range.contains(value) &&
				(!exclusiveEnd || range.max === null
					? true
					: value < range.max))
		);
	}

	/**
	 * Translate a `Date` month value into a range between 1..12.
	 *
	 * @param value - the Date month value to translate
	 * @returns the month value with January == 1, December == 12
	 */
	#dateMonth(value: number): number {
		return value + 1;
	}

	/**
	 * Translate a `Date` day value into a range between 1..7.
	 *
	 * @param value - the Date day value to translate
	 * @returns the day-of-week value with Monday == 1, Sunday == 7
	 */
	#dateDow(value: number): number {
		return value === 0 ? 7 : value;
	}

	/**
	 * Compares this object with the specified object for order.
	 *
	 * Unbounded (`null`) values are ordered before bounded (non-`null`) values.
	 *
	 * @param o - the tariff to compare to
	 * @returns `-1`, `0`, or `1` if this is less than, equal to, or greater than `o`
	 * @override
	 */
	compareTo(o: TemporalRangesTariff): number {
		if (this === o) {
			return 0;
		} else if (!o) {
			return 1;
		}
		let cmp = compare(this.#monthRange, o.#monthRange);
		if (cmp !== 0) {
			return cmp;
		}
		cmp = compare(this.#dayOfMonthRange, o.#dayOfMonthRange);
		if (cmp !== 0) {
			return cmp;
		}
		cmp = compare(this.#dayOfWeekRange, o.#dayOfWeekRange);
		if (cmp !== 0) {
			return cmp;
		}
		return compare(this.#minuteOfDayRange, o.#minuteOfDayRange);
	}

	/**
	 * Get a string representation of the components of this description.
	 *
	 * @remarks
	 * The {@link TemporalRangesTariff.toString | toString()} method will call this
	 * to generate a string representation of this tariff. Extending classes can
	 * override this method (possibly invoking this implementation to pick up the
	 * components rendered by this class).
	 *
	 * @returns string representation of the components of this tariff
	 */
	protected componentsDescription(): string {
		let s = "";
		s = cconcat(
			s,
			prefix("m=", IntRange.description(ALL_MONTHS, this.#monthRange))
		);
		s = cconcat(
			s,
			prefix(
				"dom=",
				IntRange.description(ALL_DAYS_OF_MONTH, this.#dayOfMonthRange)
			)
		);
		s = cconcat(
			s,
			prefix(
				"dow=",
				IntRange.description(ALL_DAYS_OF_WEEK, this.#dayOfWeekRange)
			)
		);
		s = cconcat(
			s,
			prefix(
				"mod=",
				IntRange.description(ALL_MINUTES_OF_DAY, this.#minuteOfDayRange)
			)
		);
		s = cconcat(s, "r=[" + Object.values(this.#rates).join(",") + "]");
		return s;
	}

	/**
	 * Get a string representation.
	 *
	 * @remarks
	 * This method will call the {@link TemporalRangesTariff.componentsDescription | componentsDescription()}
	 * method to generate a string representation of this tariff.
	 *
	 * @returns the string representation
	 */
	toString(): string {
		const s = this.componentsDescription();
		return this.constructor.name + "{" + s + "}";
	}

	/**
	 * Format a field range into a locale-specific string.
	 *
	 * @param locale - the desired locale
	 * @param field - the field to format
	 * @param options - the formatting options
	 * @returns the formatted field range value
	 * @throws `TypeError` if `field` is not supported
	 */
	format(
		locale: string,
		field: ChronoField,
		options?: TemporalRangesTariffFormatOptions
	): string {
		let range: IntRange | undefined;
		if (field === ChronoField.MONTH_OF_YEAR) {
			range = this.#monthRange;
		} else if (field === ChronoField.DAY_OF_MONTH) {
			range = this.#dayOfMonthRange;
		} else if (field === ChronoField.DAY_OF_WEEK) {
			range = this.#dayOfWeekRange;
		} else if (field === ChronoField.MINUTE_OF_DAY) {
			range = this.#minuteOfDayRange;
		}
		return TemporalRangesTariff.formatRange(locale, field, range, options);
	}

	/**
	 * Format a field range value into a locale-specific string.
	 *
	 * @param locale - the desired locale
	 * @param field - the field to format
	 * @param value - the field value to format; if undefined then "all possible values" will be assumed
	 * @param options - the options
	 * @returns the formatted field range value
	 * @throws `TypeError` if `field` is not supported
	 */
	static formatRange(
		locale: string,
		field: ChronoField,
		value?: IntRange,
		options?: TemporalRangesTariffFormatOptions
	) {
		let bounds: IntRange | undefined;
		if (field === ChronoField.YEAR) {
			bounds = UNBOUNDED_RANGE;
		} else if (field === ChronoField.MONTH_OF_YEAR) {
			bounds = ALL_MONTHS;
		} else if (field === ChronoField.DAY_OF_MONTH) {
			bounds = ALL_DAYS_OF_MONTH;
		} else if (field === ChronoField.DAY_OF_WEEK) {
			bounds = ALL_DAYS_OF_WEEK;
		} else if (field === ChronoField.MINUTE_OF_DAY) {
			bounds = ALL_MINUTES_OF_DAY;
		}
		if (!bounds) {
			throw new TypeError("Unsupported field value.");
		}
		if (!value || value.equals(bounds) || UNBOUNDED_RANGE.equals(value)) {
			return options?.allValue !== undefined
				? options?.allValue
				: ALL_VALUES;
		}
		if (
			field === ChronoField.MINUTE_OF_DAY &&
			options?.wholeHours &&
			(value.min !== null || value.max !== null)
		) {
			const min =
				value.min !== null
					? Math.trunc(value.min / 60).toString()
					: options?.unboundedValue !== undefined
					? options?.unboundedValue
					: UNBOUNDED_VALUE;
			const max =
				value.max !== null
					? Math.trunc(value.max / 60)
					: options?.unboundedValue !== undefined
					? options?.unboundedValue
					: UNBOUNDED_VALUE;
			return min + IntRange.delimiter(locale) + max;
		}

		const fmt = ChronoFieldFormatter.forLocale(locale);
		return fmt.formatRange(field, value, options);
	}

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
	 * @param options - the formatting options to use
	 * @returns the new instance
	 */
	static parse(
		locale: string,
		monthRange?: string,
		dayOfMonthRange?: string,
		dayOfWeekRange?: string,
		minuteOfDayRange?: string,
		rates?: TariffRate[],
		options?: TemporalRangesTariffFormatOptions
	): TemporalRangesTariff {
		const p = ChronoFieldFormatter.forLocale(locale);
		return new TemporalRangesTariff(
			p.parseRange(ChronoField.MONTH_OF_YEAR, monthRange, options),
			IntRange.parseRange(dayOfMonthRange, ALL_DAYS_OF_MONTH, options),
			p.parseRange(ChronoField.DAY_OF_WEEK, dayOfWeekRange, options),
			p.parseRange(ChronoField.MINUTE_OF_DAY, minuteOfDayRange, options),
			rates
		);
	}
}
