/**
 * An immutable number range with min/max values.
 * @public
 */
export default class IntRange {
    #private;
    /**
     * Constructor.
     *
     * @param min - the mimnimum value
     * @param max - the maximum value
     */
    constructor(min: number, max: number);
    /**
     * Create a singleton range, where the minimum and maximum values are equal.
     *
     * @param value - the minimum and maximum value
     * @returns the new singleton range instance
     */
    static of(value: number): IntRange;
    /**
     * Create a range.
     *
     * @param min - the minimum value
     * @param max - the maximum value
     * @returns the new range instance
     */
    static rangeOf(min: number, max: number): IntRange;
    /**
     * Parse a range array of number strings into an `IntRange`.
     *
     * @param value - the range to parse; can be a string adhering to {@link Utils.splitRange | splitRange()}
     *     or an array with 1 or 2 number value elements
     * @param bounds - the optional bounds (inclusive) to enforce; if the parsed range
     * @returns the parsed range, or `undefined` if a range could not be parsed or extends
     *          beyond the given `bounds` then `undefined` will be returned
     */
    static parseRange(value: string | string[], bounds?: IntRange): IntRange;
    /**
     * Get a locale-specific range delimiter to use.
     * @param locale - the locale of the delimiter to get; defaults to the runtime locale if not provided
     * @returns the default range delimiter for the given locale
     */
    static delimiter(locale?: string): string;
    /**
     * Get the minimum value.
     */
    get min(): number;
    /**
     * Get the minimum value.
     */
    get max(): number;
    /**
     * Get the number of values between `min` and `max`, inclusive.
     */
    get length(): number;
    /**
     * Test if this range represents a singleton value, where the minimum and
     * maximum values in the range are equal.
     */
    get isSingleton(): boolean;
    /**
     * Test if a value is within this range, inclusive.
     *
     * @param value - the value to test
     * @returns `true` if `min <= value <= max`
     */
    contains(value: number): boolean;
    /**
     * Test if another range is completely within this range, inclusive.
     *
     * @param min - the minimum of the range to test
     * @param max - the maximum of the range to test
     * @returns `true` if `this.min <= min <= max <= this.max`
     */
    containsAll(min: number, max: number): boolean;
    /**
     * Test if another range is completely within this range, inclusive.
     *
     * @param o - the range to test
     * @returns `true` if `this.min <= o.min <= o.max <= this.max`
     */
    containsRange(o: IntRange): boolean;
    /**
     * Test if this range intersects with a given range.
     *
     * @param o - the range to compare to this range
     * @returns `true` if this range intersects (overlaps) with the given range
     */
    intersects(o: IntRange): boolean;
    /**
     * Test if this range is adjacent to (but not intersecting) a given range.
     *
     * @param o - the range to compare to this range
     * @returns `true` if this range is adjacent to the given range
     */
    adjacentTo(o: IntRange): boolean;
    /**
     * Test if this range could be merged with another range.
     *
     * Two ranges can be merged if they are either adjacent to or intersect with
     * each other.
     *
     * @param o - the range to test
     * @returns `true` if this range is either adjacent to or intersects with the given range
     */
    canMergeWith(o: IntRange): boolean;
    /**
     * Merge this range with a given range, returning the merged range.
     *
     * @param o - the range to merge with this range
     * @returns the new merged range
     */
    mergeWith(o: IntRange): IntRange;
    /**
     * Compares this object with the specified object for order.
     *
     * This implementation only compares the `min` values of each range.
     *
     * @param o - the range to compare to
     * @returns `-1`, `0`, or `1` if `o` is less than, equal to, or greater than this range
     */
    compareTo(o: IntRange): number;
    /**
     * Test for equality.
     *
     * This method tests if `obj` is an instance of `IntRange` and compares the
     * `min` and `max` values for strict equality.
     *
     * @param obj - the object to compare to
     * @returns `true` if `obj` is equal to this
     */
    equals(obj: any): boolean;
    /**
     * Get a string representation.
     *
     * The format returned by this method is `[min..max]`.
     *
     * @returns the string representation
     */
    toString(): string;
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
     * @returns if `r` represents "all possible values" then the literal string `*`,
     *     otherwise the string representation of `r`
     */
    static description(bounds: IntRange, r?: IntRange): string;
}
//# sourceMappingURL=IntRange.d.ts.map