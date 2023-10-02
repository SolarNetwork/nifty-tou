/**
 * API for a comparison between similar objects.
 * @public
 */
export default interface Comparable<T> {
	/**
	 * Compare this instance to another.
	 *
	 * @param o - the object to compare to
	 * @returns `-1`, `0`, or `1` if this is less than, equal to, or greater than `o`
	 */
	compareTo(o: T | undefined): number;
}
