/**
 * An identifiable tariff rate.
 *
 * @remarks
 * The `exponent` property can be used to maintain precision in `amount`. For example
 * an amount of `1.23` could be expressed as `123` with an `exponent` of `-2`.
 *
 * @public
 */
export default class TariffRate {
    #private;
    /**
     * Constructor.
     *
     * @param id - the identifier
     * @param amount - the amount
     * @param exponent - a base-10 exponent to interpret `amount` in; if not provided then `0` is assumed
     * @param description - a description
     */
    constructor(id: string, amount: number, exponent?: number, description?: string);
    /**
     * Get the identifier.
     */
    get id(): string;
    /**
     * Get the description.
     */
    get description(): string;
    /**
     * Get the amount.
     */
    get amount(): number;
    /**
     * Get the exponent.
     */
    get exponent(): number;
    /**
     * Get a string representation.
     *
     * @returns the string representation
     */
    toString(): string;
    /**
     * Parse locale string values into a `TariffRate` instance.
     *
     * @param locale - the locale to parse the `amount` and `exponent` string values as
     * @param id - the identifier
     * @param amount - the amount, as a number string in the `locale` locale
     * @param exponent - a base-10 exponent to interpret `amount` in, as a number string
     *     in the `locale` locale; if not provided then `0` is assumed
     * @param description - a description
     * @returns the new instance
     * @throws TypeError if the amount or exponent can not be parsed as numbers
     */
    static parse(locale: string, id: string, amount: string, exponent?: string, description?: string): TariffRate;
}
//# sourceMappingURL=TariffRate.d.ts.map