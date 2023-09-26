import { ChronoField } from "./ChronoFieldFormatter.js";
import { default as IntRange, IntRangeFormatOptions } from "./IntRange.js";
import TariffRate from "./TariffRate.js";
/**
 * The default "all values" representation.
 * @public
 */
export declare const ALL_VALUES = "*";
/**
 * Options to use when formatting in the {@link TemporalRangesTariff.formatRange | formatRange()} method.
 * @public
 */
export interface TemporalRangesTariffFormatOptions extends IntRangeFormatOptions {
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
export default class TemporalRangesTariff {
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
    constructor(monthRange?: IntRange, dayOfMonthRange?: IntRange, dayOfWeekRange?: IntRange, minuteOfDayRange?: IntRange, rates?: TariffRate[]);
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
     * Get a string representation of the components of this description.
     * @returns string representation of the components of this tariff
     */
    protected componentsDescription(): string;
    /**
     * Get a string representation.
     *
     * @returns the string representation
     */
    toString(): string;
    /**
     * Format a field range into a locale-specific string.
     *
     * @param locale - the desired locale
     * @param field - the field to format
     * @param options - the formatting options
     * @returns the formatted field range value
     * @throws `TypeError` if `field` is not supported
     */
    format(locale: string, field: ChronoField, options?: TemporalRangesTariffFormatOptions): string;
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
    static formatRange(locale: string, field: ChronoField, value?: IntRange, options?: TemporalRangesTariffFormatOptions): string;
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
    static parse(locale: string, monthRange?: string, dayOfMonthRange?: string, dayOfWeekRange?: string, minuteOfDayRange?: string, rates?: TariffRate[], options?: TemporalRangesTariffFormatOptions): TemporalRangesTariff;
}
//# sourceMappingURL=TemporalRangesTariff.d.ts.map