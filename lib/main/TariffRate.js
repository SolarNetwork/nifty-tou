import { optional, required } from "./utils.js";
/**
 * An identifiable tariff rate.
 *
 * @remarks
 * Note that `amount` is stored as a string to maintain precision.
 *
 * @public
 */
export default class TariffRate {
    #id;
    #description;
    #amount;
    /**
     * Constructor.
     *
     * @param id - the identifier
     * @param amount - an amount, assumed to be parsable as a number
     * @param description - a description
     */
    constructor(id, amount, description) {
        this.#id = required(id, "id", String);
        this.#amount = required(amount, "amount");
        this.#description = optional(description, "description", String);
    }
    /**
     * Get the identifier.
     */
    get id() {
        return this.#id;
    }
    /**
     * Get the description.
     */
    get description() {
        return this.#description;
    }
    /**
     * Get the amount.
     */
    get amount() {
        return this.#amount;
    }
    /**
     * Get the amount as a number value.
     *
     * @remarks
     * Note this does <b>not</b> perform any locale-specific parsing.
     * This method will return `NaN` if the amount does not parse as
     * a JavaScript decimal number.
     */
    get val() {
        return Number(this.#amount);
    }
    /**
     * Get a string representation.
     *
     * @returns the string representation
     */
    toString() {
        return `TariffRate{${this.#id},${this.#amount}}`;
    }
}
//# sourceMappingURL=TariffRate.js.map