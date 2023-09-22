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
	 */
	constructor(id: string, amount: string, description?: string) {
		this.#id = required(id, "id", String);
		this.#amount = required(amount, "amount");
		this.#description = optional(description, "description", String);
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
	 *
	 * Note this does <b>not</b> perform any locale-specific parsing.
	 * This method will return `NaN` if the amount does not parse as
	 * a JavaScript decimal number.
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
