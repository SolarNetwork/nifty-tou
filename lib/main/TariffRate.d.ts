/**
 * An identifiable tariff rate.
 *
 * Note that `amount` is stored as a string to maintain precision.
 *
 * @public
 */
export default class TariffRate {
    #private;
    /**
     * Constructor.
     *
     * @param id - the identifier
     * @param amount - an amount, assumed to be parsable as a number
     * @param description - a description
     */
    constructor(id: string, amount: string, description?: string);
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
    get amount(): string;
    /**
     * Get the amount as a number value.
     */
    get val(): number;
    /**
     * Get a string representation.
     *
     * @returns the string representation
     */
    toString(): string;
}
//# sourceMappingURL=TariffRate.d.ts.map