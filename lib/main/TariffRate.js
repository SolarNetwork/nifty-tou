import NumberFormatter from "./NumberFormatter.js";
import { optional, required } from "./utils.js";
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
    #id;
    #amount;
    #description;
    #exponent;
    /**
     * Constructor.
     *
     * @param id - the identifier
     * @param amount - the amount
     * @param exponent - a base-10 exponent to interpret `amount` in; if not provided then `0` is assumed
     * @param description - a description
     */
    constructor(id, amount, exponent, description) {
        this.#id = required(id, "id", String);
        this.#description = optional(description, "description", String);
        this.#amount = required(amount, "amount");
        const exp = optional(exponent, "exponent", Number);
        this.#exponent = exp !== undefined ? Math.trunc(exp) : 0;
    }
    /**
     * Get the identifier.
     */
    get id() {
        return this.#id;
    }
    /**
     * Get the amount.
     */
    get amount() {
        return this.#amount;
    }
    /**
     * Get the description.
     */
    get description() {
        return this.#description;
    }
    /**
     * Get the exponent.
     */
    get exponent() {
        return this.#exponent;
    }
    /**
     * Get a string representation.
     *
     * @returns the string representation
     */
    toString() {
        let s = `TariffRate{${this.#id},${this.#amount}`;
        if (this.#exponent < 0) {
            s += "/" + Math.pow(10, Math.abs(this.#exponent));
        }
        else if (this.#exponent > 0) {
            s += "*" + Math.pow(10, this.#exponent);
        }
        return s + "}";
    }
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
    static parse(locale, id, amount, exponent, description) {
        const p = NumberFormatter.forLocale(locale);
        const a = p.parse(amount);
        if (Number.isNaN(a)) {
            throw new TypeError(`The amount value is not a valid number in the ${locale} locale.`);
        }
        const e = exponent ? p.parse(exponent) : undefined;
        if (Number.isNaN(e)) {
            throw new TypeError(`The exponent value is not a valid number in the ${locale} locale.`);
        }
        return new TariffRate(id, a, e, description);
    }
}
//# sourceMappingURL=TariffRate.js.map