import IntRange from "./IntRange.js";
import TariffRate from "./TariffRate.js";
/**
 * Range for all months of a year: 1 - 12.
 * @public
 */
export declare const ALL_MONTHS: IntRange;
/**
 * Range for all days of a month: 1 - 31.
 * @public
 */
export declare const ALL_DAYS_OF_MONTH: IntRange;
/**
 * Range for all days of a week: 1 - 7.
 * @public
 */
export declare const ALL_DAYS_OF_WEEK: IntRange;
/**
 * Range for all minutes of a day: 0 - 1440.
 * @public
 */
export declare const ALL_MINUTES_OF_DAY: IntRange;
/**
 * A tariff with time-based range rules.
 *
 * The rules associated with this tariff are represented by a set of date ranges
 * that serve as the constraints that must be satisfied by a given date for the
 * rule to apply.
 * @public
 */
export default class TemporalRangesTariff {
    #private;
    /**
     * Range for all months of a year: 1 - 12.
     */
    static get ALL_MONTHS(): IntRange;
    /**
     * Range for all days of a month: 1 - 31.
     */
    static get ALL_DAYS_OF_MONTH(): IntRange;
    /**
     * Range for all days of a week: 1 - 7.
     */
    static get ALL_DAYS_OF_WEEK(): IntRange;
    /**
     * Range for all minutes of a day: 0 - 1440.
     */
    static get ALL_MINUTES_OF_DAY(): IntRange;
    /**
     * Constructor.
     *
     * @param monthRange - the month range (1-12)
     * @param dayOfMonthRange - the day of month range (1-31)
     * @param dayOfWeekRange - the day of week range (1-7, with 1 = Monday, 7 = Sunday)
     * @param minuteOfDayRange - the minute of day range (0-1440)
     * @param rates - the rates, as an array of `TariffRate` objects
     */
    constructor(monthRange?: IntRange, dayOfMonthRange?: IntRange, dayOfWeekRange?: IntRange, minuteOfDayRange?: IntRange, rates?: Array<TariffRate>);
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
     * @param date - the date to test if this rate applies at
     * @param utc - if `true` then use UTC date components, otherwise assume the local time zone
     * @returns `true` if this tariff applies on the given date
     */
    appliesAt(date: Date, utc?: boolean): boolean;
    /**
     * Get a string representation.
     *
     * @returns the string representation
     */
    toString(): string;
}
//# sourceMappingURL=TemporalRangesTariff.d.ts.map