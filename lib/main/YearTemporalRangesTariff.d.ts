import { default as IntRange } from "./IntRange.js";
import TariffRate from "./TariffRate.js";
import { default as TemporalRangesTariff, TemporalRangesTariffFormatOptions } from "./TemporalRangesTariff.js";
/**
 * An extension of {@link TemporalRangesTariff} with support for an additional year range constraint.
 *
 * @public
 */
export default class YearTemporalRangesTariff extends TemporalRangesTariff {
    #private;
    /**
     * Constructor.
     *
     * @param yearRange - the year range
     * @param monthRange - the month range (1-12, inclusive)
     * @param dayOfMonthRange - the day of month range (1-31, inclusive)
     * @param dayOfWeekRange - the day of week range (1-7, with 1 = Monday, 7 = Sunday, inclusive)
     * @param minuteOfDayRange - the minute of day range (0-1440, inclusive minimum, exclusive maximum)
     * @param rates - the rates, as an array of `TariffRate` objects
     */
    constructor(yearRange?: IntRange, monthRange?: IntRange, dayOfMonthRange?: IntRange, dayOfWeekRange?: IntRange, minuteOfDayRange?: IntRange, rates?: TariffRate[]);
    /**
     * Get the month of year range.
     */
    get yearRange(): IntRange;
    /**
     * @override
     * @inheritdoc
     */
    appliesAt(date: Date, utc?: boolean): boolean;
    /**
     * @override
     * @inheritdoc
     */
    protected componentsDescription(): string;
    /**
     * Parse time range criteria into a `YearTemporalRangesTariff` instance.
     *
     * @remarks
     * Note that the `minuteOfDayRange` can be specified as a range of `HH:MM` 24-hour hour and minute
     * values, <b>or</b> whole hours. For example `01:00-08:00` and `1-8` are equivalent.
     *
     * Additionally, all range values may be specified as `*` to mean "all possible values", in which
     * that range will be resolved to `undefined`.
     *
     * @param locale - the locale to parse the ranges as
     * @param yearRange - the year range to parse, for example `2000-2023`
     * @param monthRange - the month range to parse, for example `January-December`, `Jan-Dec`, or `1-12`
     * @param dayOfMonthRange - the day of month range to parse, for example `1-31`
     * @param dayOfWeekRange - the day of week range to parse, for example `Monday-Sunday`, `Mon-Sun`, or `1-7`
     * @param minuteOfDayRange - the minute of day range to parse, for example `00:00-24:00` or `0-24`
     * @param rates - the tariff rates to associate with the time range criteria
     * @param options - the formatting options
     * @returns the new instance
     */
    static parseYears(locale: string, yearRange?: string, monthRange?: string, dayOfMonthRange?: string, dayOfWeekRange?: string, minuteOfDayRange?: string, rates?: TariffRate[], options?: TemporalRangesTariffFormatOptions): YearTemporalRangesTariff;
}
//# sourceMappingURL=YearTemporalRangesTariff.d.ts.map