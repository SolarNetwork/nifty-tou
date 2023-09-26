import { ALL_DAYS_OF_MONTH, ChronoField, ChronoFieldFormatter, } from "./ChronoFieldFormatter.js";
import { default as IntRange, UNBOUNDED_RANGE } from "./IntRange.js";
import { default as TemporalRangesTariff, } from "./TemporalRangesTariff.js";
import { cconcat, prefix } from "./utils.js";
/**
 * An extension of {@link TemporalRangesTariff} with support for an additional year range constraint.
 *
 * @public
 */
export default class YearTemporalRangesTariff extends TemporalRangesTariff {
    #yearRange;
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
    constructor(yearRange, monthRange, dayOfMonthRange, dayOfWeekRange, minuteOfDayRange, rates) {
        super(monthRange, dayOfMonthRange, dayOfWeekRange, minuteOfDayRange, rates);
        this.#yearRange = yearRange;
    }
    /**
     * Get the month of year range.
     */
    get yearRange() {
        return this.#yearRange;
    }
    /**
     * @override
     * @inheritdoc
     */
    appliesAt(date, utc) {
        return (date &&
            this.#yearRangeApplies(utc ? date.getUTCFullYear() : date.getFullYear(), this.#yearRange) &&
            super.appliesAt(date, utc));
    }
    /**
     * Test if an optional year range contains a value.
     *
     * @param value - the number to test if the range contains
     * @param range - the range to test
     * @returns `true` if the given range is not defined, or it contains the given value
     */
    #yearRangeApplies(value, range) {
        return !range || range.contains(value);
    }
    /**
     * @override
     * @inheritdoc
     */
    componentsDescription() {
        return cconcat(prefix("y=", this.#yearRange.toString()), super.componentsDescription());
    }
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
    static parseYears(locale, yearRange, monthRange, dayOfMonthRange, dayOfWeekRange, minuteOfDayRange, rates, options) {
        const p = ChronoFieldFormatter.forLocale(locale);
        return new YearTemporalRangesTariff(IntRange.parseRange(yearRange, UNBOUNDED_RANGE, options), p.parseRange(ChronoField.MONTH_OF_YEAR, monthRange, options), IntRange.parseRange(dayOfMonthRange, ALL_DAYS_OF_MONTH, options), p.parseRange(ChronoField.DAY_OF_WEEK, dayOfWeekRange), p.parseRange(ChronoField.MINUTE_OF_DAY, minuteOfDayRange), rates);
    }
}
//# sourceMappingURL=YearTemporalRangesTariff.js.map