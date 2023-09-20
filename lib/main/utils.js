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
export function cconcat(s1, s2) {
    if (!s1) {
        return s2;
    }
    else if (!s2) {
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
export function optional(arg, name, type) {
    if (arg === undefined || arg === null) {
        return arg;
    }
    if ((type === String && typeof arg !== "string") ||
        (type === Number && typeof arg !== "number") ||
        (type !== String && type !== Number && !(arg instanceof type))) {
        throw new TypeError(`The ${name} value type must be ${type === String
            ? "string"
            : type === Number
                ? "number"
                : type.name}.`);
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
export function prefix(prefix, s) {
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
export function required(arg, name, type) {
    if (arg === undefined || arg === null) {
        throw new TypeError(`The ${name} value must be provided.`);
    }
    if (!type) {
        return arg;
    }
    return optional(arg, name, type);
}
//# sourceMappingURL=utils.js.map