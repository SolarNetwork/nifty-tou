/**
 * An immutable number range with min/max values.
 * @public
 */
export default class IntRange {
    #min;
    #max;
    /**
     * Constructor.
     */
    constructor(min, max) {
        this.#min = min < max ? min : max;
        this.#max = max > min ? max : min;
    }
    /**
     * Create a singleton range, where the minimum and maximum are equal.
     */
    static of(value) {
        return new IntRange(value, value);
    }
    /**
     * Create a range.
     */
    static rangeOf(min, max) {
        return new IntRange(min, max);
    }
    /**
     * Get the minimum value.
     */
    get min() {
        return this.#min;
    }
    /**
     * Get the minimum value.
     */
    get max() {
        return this.#max;
    }
    /**
     * Get the number of values between `min` and `max`, inclusive.
     */
    get length() {
        return this.#max - this.#min + 1;
    }
    /**
     * Test if this range represents a singleton value, where the minimum and
     * maximum values in the range are equal.
     */
    get isSingleton() {
        return this.#min === this.#max;
    }
    /**
     * Test if a value is within this range, inclusive.
     *
     * @param value - the value to test
     * @returns `true` if `min <= value <= max`
     */
    contains(value) {
        if (value === undefined || value === null) {
            return false;
        }
        return value >= this.#min && value <= this.#max;
    }
    /**
     * Test if another range is completely within this range, inclusive.
     *
     * @param min - the minimum of the range to test
     * @param max - the maximum of the range to test
     * @returns `true` if `this.min <= min <= max <= this.max`
     */
    containsAll(min, max) {
        return min <= max && min >= this.#min && max <= this.#max;
    }
    /**
     * Test if another range is completely within this range, inclusive.
     *
     * @param o - the range to test
     * @returns `true` if `this.min <= o.min <= o.max <= this.max`
     */
    containsRange(o) {
        return this.containsAll(o.min, o.max);
    }
    /**
     * Test if this range intersects with a given range.
     *
     * @param o - the range to compare to this range
     * @returns `true` if this range intersects (overlaps) with the given range
     */
    intersects(o) {
        return ((this.#min >= o.min && this.#min <= o.max) ||
            (o.min >= this.#min && o.min <= this.#max));
    }
    /**
     * Test if this range is adjacent to (but not intersecting) a given range.
     *
     * @param o - the range to compare to this range
     * @returns `true` if this range is adjacent to the given range
     */
    adjacentTo(o) {
        return this.#max + 1 === o.min || o.max + 1 === this.#min;
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
    canMergeWith(o) {
        return (o != null &&
            o !== undefined &&
            (this.intersects(o) || this.adjacentTo(o)));
    }
    /**
     * Merge this range with a given range, returning the merged range.
     *
     * @param o - the range to merge with this range
     * @returns the new merged range
     */
    mergeWith(o) {
        if (!this.canMergeWith(o)) {
            throw new Error(`IntRange ${this} cannot be merged with ${o}`);
        }
        const a = this.#min < o.min ? this.#min : o.min;
        const b = this.#max > o.max ? this.#max : o.max;
        return a === this.#min && b === this.#max
            ? this
            : a === o.min && b === o.max
                ? o
                : new IntRange(a, b);
    }
    /**
     * Compares this object with the specified object for order.
     *
     * This implementation only compares the `min` values of each range.
     *
     * @param o - the range to compare to
     * @returns `-1`, `0`, or `1` if `o` is less than, equal to, or greater than this range
     */
    compareTo(o) {
        return this.#min < o.min ? -1 : this.#min > o.min ? 1 : 0;
    }
    /**
     * Test for equality.
     *
     * @param obj - the object to compare to
     * @returns `true` if `obj` is equal to this
     */
    equals(obj) {
        if (this === obj) {
            return true;
        }
        if (!(obj instanceof IntRange)) {
            return false;
        }
        return this.#max == obj.max && this.#min == obj.min;
    }
    /**
     * Get a string representation.
     *
     * @returns the string representation
     */
    toString() {
        return `[${this.#min}..${this.#max}]`;
    }
    /**
     * Generate a description of a range.
     *
     * @param full - the "full" range that defines the bounds of `r`
     * @param r - the range
     * @returns if `r` is not defined or `r` equals `full` then the literal string `*`, otherwise the string representation of `r`
     */
    static description(full, r) {
        return !r || full.equals(r) ? "*" : r.toString();
    }
}
//# sourceMappingURL=IntRange.js.map