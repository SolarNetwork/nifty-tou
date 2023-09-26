import { splitRange } from "./utils.js";

/**
 * The default unbounded display value.
 * @public
 */
export const UNBOUNDED_VALUE = "*";

/**
 * Options to use when formatting in the {@link ChronoFieldFormatter.formatRange | formatRange()} method.
 * @public
 */
export interface IntRangeFormatOptions {
	/**
	 * The value to use for an "unbounded" value.
	 * The default value is `"*"`.
	 */
	unboundedValue?: string;
}

/**
 * An immutable number range with min/max values.
 *
 * @remarks
 * The minimum and maximum values can use `null` to represent "none".
 *
 * @public
 */
export default class IntRange {
	#min: number | null;
	#max: number | null;

	/**
	 * Constructor.
	 *
	 * @param min - the mimnimum value or `null` for "no minimum"
	 * @param max - the maximum value or `null` for "no maximum"
	 */
	constructor(min: number | null, max: number | null) {
		this.#min = min === null || max === null || min < max ? min : max;
		this.#max = min === null || max === null || max > min ? max : min;
	}

	/**
	 * Create a singleton range, where the minimum and maximum values are equal.
	 *
	 * @param value - the minimum and maximum value
	 * @returns the new singleton range instance
	 */
	static of(value: number | null): IntRange {
		return new IntRange(value, value);
	}

	/**
	 * Create a range.
	 *
	 * @param min - the minimum value
	 * @param max - the maximum value
	 * @returns the new range instance
	 */
	static rangeOf(min: number | null, max: number | null): IntRange {
		return new IntRange(min, max);
	}

	/**
	 * Parse a range array of number strings into an `IntRange`.
	 *
	 * @param value - the range to parse; can be a string adhering to {@link Utils.splitRange | splitRange()}
	 *     or an array with 1 or 2 number value elements, or `*` to represent "none"
	 * @param bounds - the optional bounds (inclusive) to enforce; if the parsed range
	 * @param options - options to control the formatting
	 * @returns the parsed range, or `undefined` if a range could not be parsed or extends
	 *          beyond the given `bounds` then `undefined` will be returned
	 */
	static parseRange(
		value: string | string[],
		bounds?: IntRange,
		options?: IntRangeFormatOptions
	): IntRange {
		const array = Array.isArray(value) ? value : splitRange(value);
		if (!(array && array.length)) {
			return undefined;
		}
		const ubv =
			options?.unboundedValue !== undefined
				? options?.unboundedValue
				: UNBOUNDED_VALUE;
		const n1 = array[0] === ubv ? null : +array[0];
		const n2 =
			array.length > 1 ? (array[1] === ubv ? null : +array[1]) : n1;
		if (!Number.isNaN(n1) && !Number.isNaN(n2)) {
			const min = n1 === null && bounds ? bounds.min : n1;
			const max = n2 === null && bounds ? bounds.max : n2;
			if (bounds && min === bounds.min && max === bounds.max) {
				return bounds;
			}
			// validate range within given bounds
			if (!bounds || bounds.containsAll(min, max)) {
				return new IntRange(min, max);
			}
		}
		return undefined;
	}

	/**
	 * Get a locale-specific range delimiter to use.
	 * @param locale - the locale of the delimiter to get; defaults to the runtime locale if not provided
	 * @returns the default range delimiter for the given locale
	 */
	static delimiter(locale?: string): string {
		if (!locale) {
			locale = new Intl.NumberFormat().resolvedOptions().locale;
		}
		return locale === "ja-JP" ? "\uff5e" : " - ";
	}

	/**
	 * Get the minimum value.
	 */
	get min(): number | null {
		return this.#min;
	}

	/**
	 * Get the minimum value.
	 */
	get max(): number | null {
		return this.#max;
	}

	/**
	 * Get the number of values between `min` and `max`, inclusive.
	 *
	 * @remarks
	 * This will return `+Inf` if either `min` or `max` is `null`.
	 */
	get length(): number {
		if (this.#min === null || this.#max === null) {
			return Number.POSITIVE_INFINITY;
		}
		return this.#max - this.#min + 1;
	}

	/**
	 * Test if this range represents a singleton value, where the minimum and
	 * maximum values in the range are equal.
	 */
	get isSingleton(): boolean {
		return this.#min === this.#max;
	}

	/**
	 * Test if a value is within this range, inclusive.
	 *
	 * @param value - the value to test (`null` represents infinity)
	 * @returns `true` if `min <= value <= max`
	 */
	contains(value: number): boolean {
		if (value === undefined) {
			return false;
		}
		return (
			(this.#min === null || (value !== null && value >= this.#min)) &&
			(this.#max === null || (value !== null && value <= this.#max))
		);
	}

	/**
	 * Test if another range is completely within this range, inclusive.
	 *
	 * @param min - the minimum of the range to test
	 * @param max - the maximum of the range to test
	 * @returns `true` if `this.min <= min <= max <= this.max`
	 */
	containsAll(min: number, max: number): boolean {
		return this.contains(min) && this.contains(max);
	}

	/**
	 * Test if another range is completely within this range, inclusive.
	 *
	 * @param o - the range to test
	 * @returns `true` if `this.min <= o.min <= o.max <= this.max`
	 */
	containsRange(o: IntRange): boolean {
		return this.containsAll(o.#min, o.#max);
	}

	/**
	 * Test if this range intersects with a given range.
	 *
	 * @param o - the range to compare to this range
	 * @returns `true` if this range intersects (overlaps) with the given range
	 */
	intersects(o: IntRange): boolean {
		return (
			this.contains(o.#min) ||
			this.contains(o.#max) ||
			o.contains(this.#min) ||
			o.contains(this.#max)
		);
	}

	/**
	 * Test if this range is adjacent to (but not intersecting) a given range.
	 *
	 * @param o - the range to compare to this range
	 * @returns `true` if this range is adjacent to the given range
	 */
	adjacentTo(o: IntRange): boolean {
		return (
			(this.#max !== null &&
				o.#min !== null &&
				this.#max + 1 === o.#min) ||
			(o.#max !== null && this.#min !== null && o.#max + 1 === this.#min)
		);
	}

	/**
	 * Test if this range could be merged with another range.
	 *
	 * Two ranges can be merged if they are either adjacent to or intersect with
	 * each other.
	 *
	 * @param o - the range to test
	 * @returns `true` if this range is either adjacent to or intersects with the given range
	 */
	canMergeWith(o: IntRange): boolean {
		return (
			o != null &&
			o !== undefined &&
			(this.intersects(o) || this.adjacentTo(o))
		);
	}

	/**
	 * Merge this range with a given range, returning the merged range.
	 *
	 * @param o - the range to merge with this range
	 * @returns the new merged range
	 */
	mergeWith(o: IntRange): IntRange {
		if (!this.canMergeWith(o)) {
			throw new Error(`IntRange ${this} cannot be merged with ${o}`);
		}
		const a =
			this.#min === null || o.min === null
				? null
				: this.#min < o.#min
				? this.#min
				: o.#min;
		const b =
			this.#max === null || o.#max === null
				? null
				: this.#max > o.#max
				? this.#max
				: o.#max;
		return a === this.#min && b === this.#max
			? this
			: a === o.#min && b === o.#max
			? o
			: new IntRange(a, b);
	}

	/**
	 * Compares this object with the specified object for order.
	 *
	 * Unbounded (`null`) values are ordered before bounded (non-`null`) values.
	 *
	 * @param o - the range to compare to
	 * @returns `-1`, `0`, or `1` if this is less than, equal to, or greater than `o`
	 */
	compareTo(o: IntRange): number {
		if (this === o) {
			return 0;
		} else if (!o) {
			return 1;
		}
		const cmp = this.#compareRangeComponent(this.#min, o.#min);
		if (cmp !== 0) {
			return cmp;
		}
		return this.#compareRangeComponent(this.#max, o.#max);
	}

	/**
	 * Compare two ranges.
	 *
	 * This function is useful for sorting arrays, for example:
	 *
	 * ```ts
	 * const data = [new IntRange(2, 3), new IntRange(0, 2)];
	 * data.sort(IntRange.compare);
	 *
	 * // now data like [ [0..2], [2..3] ]
	 * ```
	 *
	 * @param l - the left value
	 * @param r - the right value
	 * @returns `-1`, `0`, or `1` if `l` is less than, equal to, or greater than `r`
	 * @see {@link IntRange.compareTo | compareTo()}
	 */
	static compare(l: IntRange, r: IntRange): number {
		if (l === r) {
			return 0;
		} else if (!l) {
			return -1;
		}
		return l.compareTo(r);
	}

	/**
	 * Compare two range values.
	 *
	 * @param l the left value
	 * @param r  the right value
	 * @returns `-1`, `0`, or `1` if `l` is less than, equal to, or greater than `r`
	 */
	#compareRangeComponent(l: number | null, r: number | null) {
		return l === r ? 0 : l === null ? -1 : r === null ? 1 : l < r ? -1 : 1;
	}

	/**
	 * Test for equality.
	 *
	 * This method tests if `obj` is an instance of `IntRange` and compares the
	 * `min` and `max` values for strict equality.
	 *
	 * @param obj - the object to compare to
	 * @returns `true` if `obj` is equal to this
	 */
	equals(obj: any): boolean {
		if (this === obj) {
			return true;
		}
		if (!(obj instanceof IntRange)) {
			return false;
		}
		return this.#max === obj.#max && this.#min === obj.#min;
	}

	/**
	 * Get a string representation.
	 *
	 * The format returned by this method is `[min..max]`. Any `null` value will be represented as an empty string.
	 *
	 * @returns the string representation
	 */
	toString(): string {
		return `[${this.#min === null ? "" : this.#min}..${
			this.#max === null ? "" : this.#max
		}]`;
	}

	/**
	 * Generate a description of a range.
	 *
	 * @remarks
	 * This method is similar to {@link IntRange.toString | toString()}, except that it compares a given range
	 * with a bounding range. If the given range is equal to the bounding range, or the given range
	 * is undefined, then the given range is taken to mean "all possible values" and a `*` character
	 * is returned instead of the normal `[min..max]` representation.
	 *
	 * @param bounds - the "full" range that defines the bounds of `r`
	 * @param r - the range
	 * @param options - options to control formatting
	 * @returns if `r` represents "all possible values" then the literal string `*`,
	 *     otherwise the string representation of `r`
	 */
	static description(
		bounds: IntRange,
		r?: IntRange,
		options?: IntRangeFormatOptions
	): string {
		return !r || bounds.equals(r)
			? options?.unboundedValue !== undefined
				? options?.unboundedValue
				: UNBOUNDED_VALUE
			: r.toString();
	}
}

/**
 * An unbounded range constant.
 * @public
 */
export const UNBOUNDED_RANGE = new IntRange(null, null);
