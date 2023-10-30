/**
 * An enumeration of supported chronological tariff units of the Gregorian calendar.
 * @public
 */
export declare enum ChronoTariffUnit {
    /** Days */
    DAYS = 0,
    /** Weeks */
    WEEKS = 1,
    /** Months */
    MONTHS = 2
}
/**
 * A chronologically-based tariff, such as a "daily" charge.
 * @public
 */
export default class ChronoTariff {
    #private;
    /**
     * Constructor.
     *
     * @param chronoUnit - the chrono unit
     * @param rate - the rate per chrono unit
     * @param name - an optional description
     */
    constructor(chronoUnit: ChronoTariffUnit, rate: number, name?: string);
    /** Get the unit. */
    get unit(): ChronoTariffUnit;
    /** Get the rate. */
    get rate(): number;
    /** Get the optional name. */
    get name(): string | undefined;
    /**
     * Calcualte the count of units between two dates.
     *
     * The cost of this tariff can be calculated by multiplying the `rate` by the result
     * of this method, for example:
     *
     * ```ts
     * const tariff = new ChronoTariff(ChronoTariffUnit.DAYS, 10);
     * tariff.rate * tariff.quantity(
     *     new Date('2024-01-01T00:00:00Z'),
     *     new Date('2024-01-08T00:00:00Z'),
     *     true) === 70; // 7 days @ 10/day
     * ```
     *
     * @param from - the starting date
     * @param to - the ending date (exclusive)
     * @param utc - if `true` then use UTC date components, otherwise assume the local time zone
     * @returns the count of units between `from` and `to`, including any fractional component
     */
    quantity(from: Date, to: Date, utc?: boolean): number;
}
//# sourceMappingURL=ChronoTariff.d.ts.map