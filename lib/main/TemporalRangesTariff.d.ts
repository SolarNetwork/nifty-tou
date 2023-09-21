import IntRange from "./IntRange.js";
import TariffRate from "./TariffRate.js";
/**
 * Range for all months of a year: 1 - 12 (inclusive).
 * @public
 */
export declare const ALL_MONTHS: IntRange;
/**
 * Range for all days of a month: 1 - 31 (inclusive).
 * @public
 */
export declare const ALL_DAYS_OF_MONTH: IntRange;
/**
 * Range for all days of a week: 1 - 7 (inclusive).
 * @public
 */
export declare const ALL_DAYS_OF_WEEK: IntRange;
/**
 * Range for all minutes of a day: 0 - 1440 (inclusive min, exclusive max).
 * @public
 */
export declare const ALL_MINUTES_OF_DAY: IntRange;
/**
 * A tariff with time-based range rules.
 *
 * The rules associated with this tariff are represented by a set of date ranges
 * that serve as the constraints that must be satisfied by a given date for the
 * rule to apply.
 *
 * @remarks
 * The date range constraints use inclusive minimum/maximum matching semantics,
 * **except** for the `minuteOfDayRange` constraint, that uses inclusive
 * minimum and **exclusive** maximum semantics.
 *
 * The time-based constraints supported are:
 *
 * | Constraint         | Bounds          | Description |
 * | :------------------| :-------------- | :---------- |
 * | `monthRange`       | 1 - 12     | January - December |
 * | `dayOfMonthRange`  | 1 - 31     |                    |
 * | `dayOfWeekRange`   | 1 - 7      | Monday - Friday    |
 * | `minuteOfDayRange` | 0 - 1440   | 00:00 - 24:00      |
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
     * Get a string representation.
     *
     * @returns the string representation
     */
    toString(): string;
}
//# sourceMappingURL=TemporalRangesTariff.d.ts.map