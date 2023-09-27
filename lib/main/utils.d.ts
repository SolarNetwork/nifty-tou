import Comparable from "./Comparable.js";
/**
 * Concatenate two strings with a comma.
 *
 * If `s1` has no length then `s2` is returned as-is. If `s2` has no length
 * then `s1` is returned as-is. Otherwise the strings are concatenated with
 * a comma delimiter.
 *
 * @param s1 - the string to append to
 * @param s2 - the string to append
 * @returns the comma-concatenated string
 * @public
 */
export declare function cconcat(s1?: string, s2?: string): string;
/**
 * Verify that a variable is undefined or of a given type.
 *
 * @param arg - the argument to verify
 * @param name - a descriptive name of `arg`
 * @param type - if `arg` is defined, verify that `arg` is an instanceof this type
 * @returns the passed in `arg` value
 * @public
 */
export declare function optional<T>(arg: T, name: string, type?: new (...args: any[]) => any): T;
/**
 * Prefix an optional string.
 *
 * If `prefix` or `s` have no length then `s` is returned as-is. Otherwise the strings are concatenated.
 *
 * @param prefix - the prefix to prepend to `s`
 * @param s - the string to append to `prefix`
 * @returns the concatenated string
 * @public
 */
export declare function prefix(prefix?: string, s?: string): string;
/**
 * Verify that a variable is defined and optionally of a given type.
 *
 * @param arg - the argument to verify
 * @param name - a descriptive name of `arg`
 * @param type - if provided, verify that `arg` is an instanceof this type
 * @returns the passed in `arg` value
 * @public
 */
export declare function required<T>(arg: T, name: string, type?: new (...args: any[]) => any): T;
/**
 * Split a string based on a range delimiter pattern.
 *
 * A range delimited string has the pattern `VALUE - VALUE`, where whitespace
 * at the start, around the `-` delimiter, and at the end is not significant.
 * The delimited can be any one of `-`, `~`, or `～` (0xFF5E).
 *
 * @param range - the range string to split into components, whitespace trimmed
 * @returns the split range, of length 1 or 2, or `undefined` if `range` is undefined
 * @public
 */
export declare function splitRange(range: string): string[];
/**
 * Compare two ranges.
 *
 * This function is useful for sorting arrays of {@link Comparable} objects.
 *
 * @param l - the left value
 * @param r - the right value
 * @returns `-1`, `0`, or `1` if `l` is less than, equal to, or greater than `r`
 * @public
 */
export declare function compare<T extends Comparable<T>>(l: T, r: T): number;
//# sourceMappingURL=utils.d.ts.map