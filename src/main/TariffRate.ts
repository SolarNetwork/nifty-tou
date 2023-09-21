import { optional, required } from "./utils.js";

/**
 * An identifiable tariff rate.
 *
 * Note that `amount` is stored as a string to maintain precision.
 *
 * @public
 */
export default class TariffRate {
	#id: string;
	#description: string;
	#amount: string;

	/**
	 * Constructor.
	 *
	 * @param id - the identifier
	 * @param amount - an amount, assumed to be parsable as a number
	 * @param description - a description
	 * @throws TypeError if `amount` is not parsable as a number
	 */
	constructor(id: string, amount: string, description?: string) {
		this.#id = required(id, "id", String);
		this.#amount = required(amount, "amount");
		this.#description = optional(description, "description", String);
		if (Number.isNaN(Number(amount))) {
			throw new TypeError("Amount must be parsable as a number.");
		}
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
	get amount(): string {
		return this.#amount;
	}

	/**
	 * Get the amount as a number value.
	 */
	get val(): number {
		return Number(this.#amount);
	}

	/**
	 * Get a string representation.
	 *
	 * @returns the string representation
	 */
	toString(): string {
		return `TariffRate{${this.#id},${this.#amount}}`;
	}
}
