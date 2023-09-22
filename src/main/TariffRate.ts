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
	#id: string;
	#description: string;
	#amount: number;
	#exponent: number;

	/**
	 * Constructor.
	 *
	 * @param id - the identifier
	 * @param amount - an amount
	 * @param exponent - a base-10 exponent to interpret `amount` in; if not provided then `0` is assumed
	 * @param description - a description
	 */
	constructor(
		id: string,
		amount: number,
		exponent?: number,
		description?: string
	) {
		this.#id = required(id, "id", String);
		this.#description = optional(description, "description", String);
		this.#amount = required(amount, "amount");
		const exp = optional(exponent, "exponent", Number);
		this.#exponent = exp !== undefined ? Math.trunc(exp) : 0;
	}

	/**
	 * Get the identifier.
	 */
	get id(): string {
		return this.#id;
	}

	/**
	 * Get the description.
	 */
	get description(): string {
		return this.#description;
	}

	/**
	 * Get the amount.
	 */
	get amount(): number {
		return this.#amount;
	}

	/**
	 * Get the exponent.
	 */
	get exponent(): number {
		return this.#exponent;
	}

	/**
	 * Get a string representation.
	 *
	 * @returns the string representation
	 */
	toString(): string {
		let s = `TariffRate{${this.#id},${this.#amount}`;
		if (this.#exponent < 0) {
			s += "/" + Math.pow(10, Math.abs(this.#exponent));
		} else if (this.#exponent > 0) {
			s += "*" + Math.pow(10, this.#exponent);
		}
		return s + "}";
	}
}
