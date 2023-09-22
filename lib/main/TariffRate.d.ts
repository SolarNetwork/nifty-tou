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
     * @param amount - an amount
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
}
//# sourceMappingURL=TariffRate.d.ts.map