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
export function cconcat(s1?: string, s2?: string): string {
	if (!s1) {
		return s2;
	} else if (!s2) {
		return s1;
	}
	return s1 + "," + s2;
}

/**
 * Verify that a variable is undefined or of a given type.
 *
 * @param arg - the argument to verify
 * @param name - a descriptive name of `arg`
 * @param type - if `arg` is defined, verify that `arg` is an instanceof this type
 * @returns the passed in `arg` value
 * @public
 */
export function optional<T>(
	arg: T,
	name: string,
	type?: new (...args: any[]) => any
): T {
	if (arg === undefined || arg === null) {
		return arg;
	}
	if (
		(type === String && typeof arg !== "string") ||
		(type === Number && typeof arg !== "number") ||
		(type !== String && type !== Number && !(arg instanceof type))
	) {
		throw new TypeError(
			`The ${name} value type must be ${
				type === String
					? "string"
					: type === Number
					? "number"
					: type.name
			}.`
		);
	}
	return arg;
}

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
export function prefix(prefix?: string, s?: string): string {
	if (!(prefix && s)) {
		return s;
	}
	return prefix + s;
}
/**
 * Verify that a variable is defined and optionally of a given type.
 *
 * @param arg - the argument to verify
 * @param name - a descriptive name of `arg`
 * @param type - if provided, verify that `arg` is an instanceof this type
 * @returns the passed in `arg` value
 * @public
 */
export function required<T>(
	arg: T,
	name: string,
	type?: new (...args: any[]) => any
): T {
	if (arg === undefined || arg === null) {
		throw new TypeError(`The ${name} value must be provided.`);
	}
	if (!type) {
		return arg;
	}
	return optional(arg, name, type);
}

const RANGE_DELIMITER: RegExp = /(?<!\s)\s*[-~\uFF5E]\s*/;

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
export function splitRange(range: string): string[] {
	if (!range) {
		return undefined;
	}
	range = range.trim();
	const a = range.split(RANGE_DELIMITER, 2);
	for (let i = a.length - 1; i >= 0; i -= 1) {
		if (!a[i]) {
			a.splice(i, 1);
		}
	}
	return a.length ? a : undefined;
}
