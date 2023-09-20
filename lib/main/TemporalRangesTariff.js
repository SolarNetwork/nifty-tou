import IntRange from "./IntRange.js";
import TariffRate from "./TariffRate.js";
import { cconcat, optional, prefix, required } from "./utils.js";
/**
 * Range for all months of a year: 1 - 12.
 * @public
 */
export const ALL_MONTHS = new IntRange(1, 12);
/**
 * Range for all days of a month: 1 - 31.
 * @public
 */
export const ALL_DAYS_OF_MONTH = new IntRange(1, 31);
/**
 * Range for all days of a week: 1 - 7.
 * @public
 */
export const ALL_DAYS_OF_WEEK = new IntRange(1, 7);
/**
 * Range for all minutes of a day: 0 - 1440.
 * @public
 */
export const ALL_MINUTES_OF_DAY = new IntRange(0, 1440);
/**
 * A tariff with time-based range rules.
 *
 * The rules associated with this tariff are represented by a set of date ranges
 * that serve as the constraints that must be satisfied by a given date for the
 * rule to apply.
 * @public
 */
export default class TemporalRangesTariff {
    #monthRange;
    #dayOfMonthRange;
    #dayOfWeekRange;
    #minuteOfDayRange;
    #rates;
    /**
     * Range for all months of a year: 1 - 12.
     */
    static get ALL_MONTHS() {
        return ALL_MONTHS;
    }
    /**
     * Range for all days of a month: 1 - 31.
     */
    static get ALL_DAYS_OF_MONTH() {
        return ALL_DAYS_OF_MONTH;
    }
    /**
     * Range for all days of a week: 1 - 7.
     */
    static get ALL_DAYS_OF_WEEK() {
        return ALL_DAYS_OF_WEEK;
    }
    /**
     * Range for all minutes of a day: 0 - 1440.
     */
    static get ALL_MINUTES_OF_DAY() {
        return ALL_MINUTES_OF_DAY;
    }
    /**
     * Constructor.
     *
     * @param monthRange - the month range (1-12)
     * @param dayOfMonthRange - the day of month range (1-31)
     * @param dayOfWeekRange - the day of week range (1-7, with 1 = Monday, 7 = Sunday)
     * @param minuteOfDayRange - the minute of day range (0-1440)
     * @param rates - the rates, as an array of `TariffRate` objects
     */
    constructor(monthRange, dayOfMonthRange, dayOfWeekRange, minuteOfDayRange, rates) {
        this.#monthRange = optional(monthRange, "monthRange", IntRange);
        this.#dayOfMonthRange = optional(dayOfMonthRange, "dayOfMonthRange", IntRange);
        this.#dayOfWeekRange = optional(dayOfWeekRange, "dayOfWeekRange", IntRange);
        this.#minuteOfDayRange = optional(minuteOfDayRange, "minuteOfDayRange", IntRange);
        // turn array of rates into Object of id -> rate
        const r = {};
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
    get monthRange() {
        return this.#monthRange;
    }
    /**
     * Get the day of month range.
     */
    get dayOfMonthRange() {
        return this.#dayOfMonthRange;
    }
    /**
     * Get the day of week range.
     */
    get dayOfWeekRange() {
        return this.#dayOfWeekRange;
    }
    /**
     * Get the minute of day range.
     */
    get minuteOfDayRange() {
        return this.#minuteOfDayRange;
    }
    /**
     * Get the rates, as an object of rate ID to `TariffRate` objects.
     */
    get rates() {
        return this.#rates;
    }
    /**
     * Test if this tariff applies on a given date.
     *
     * @param date - the date to test if this rate applies at
     * @param utc - if `true` then use UTC date components, otherwise assume the local time zone
     * @returns `true` if this tariff applies on the given date
     */
    appliesAt(date, utc) {
        return (date &&
            this.#rangeApplies(this.#dateMonth(utc ? date.getUTCMonth() : date.getMonth()), this.#monthRange) &&
            this.#rangeApplies(utc ? date.getUTCDate() : date.getDate(), this.#dayOfMonthRange) &&
            this.#rangeApplies(this.#dateDow(utc ? date.getUTCDay() : date.getDay()), this.#dayOfWeekRange) &&
            this.#rangeApplies(utc
                ? date.getUTCHours() * 60 + date.getUTCMinutes()
                : date.getHours() * 60 + date.getMinutes(), this.#minuteOfDayRange));
    }
    /**
     * Test if an optional range contains a value.
     *
     * @param value - the number to test if the range contains
     * @param range - the range to test
     * @returns `true` if the given range is not defined, or it contains the given value
     */
    #rangeApplies(value, range) {
        return !range || range.contains(value);
    }
    /**
     * Translate a `Date` month value into a range between 1..12.
     *
     * @param value - the Date month value to translate
     * @returns the month value with January == 1, December == 12
     */
    #dateMonth(value) {
        return value + 1;
    }
    /**
     * Translate a `Date` day value into a range between 1..7.
     *
     * @param value - the Date day value to translate
     * @returns the day-of-week value with Monday == 1, Sunday == 7
     */
    #dateDow(value) {
        return value === 0 ? 7 : value;
    }
    /**
     * Get a string representation.
     *
     * @returns the string representation
     */
    toString() {
        let s = "";
        s = cconcat(s, prefix("m=", IntRange.description(ALL_MONTHS, this.#monthRange)));
        s = cconcat(s, prefix("dom=", IntRange.description(ALL_DAYS_OF_MONTH, this.#dayOfMonthRange)));
        s = cconcat(s, prefix("dow=", IntRange.description(ALL_DAYS_OF_WEEK, this.#dayOfWeekRange)));
        s = cconcat(s, prefix("mod=", IntRange.description(ALL_MINUTES_OF_DAY, this.#minuteOfDayRange)));
        s = cconcat(s, "r=[" + Object.values(this.#rates).join(",") + "]");
        return "TemporalRangesTariff{" + s + "}";
    }
}
//# sourceMappingURL=TemporalRangesTariff.js.map