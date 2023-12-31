/**
 * A schedule, or collection, of {@link TemporalRangesTariff} rules that supports
 * resolving rates for dates.
 *
 * @typeParam T - the tariff type
 * @typeParam O - the options type
 * @public
 */
export default class TemporalRangesTariffSchedule {
    #rules;
    #options;
    /**
     * Constructor.
     *
     * @param rules - the list of rules to include in the schedule
     * @param options - the options, or a boolean shortcut to set the `multipleMatch` option
     */
    constructor(rules, options) {
        this.#rules = Object.freeze(rules || []);
        this.#options =
            typeof options === "boolean"
                ? { multipleMatch: options }
                : options;
    }
    /**
     * Get the rules.
     */
    get rules() {
        return this.#rules;
    }
    /**
     * Get the options.
     */
    get options() {
        return this.#options;
    }
    /**
     * Get the multiple-match mode.
     */
    get multipleMatch() {
        return !!this.#options?.multipleMatch;
    }
    /**
     * Find the first rule that applies on a given date.
     *
     * @param date - the date to find the first matching rule at
     * @param utc - if `true` then use UTC date components, otherwise assume the local time zone
     * @returns the first available matching rule, or `undefined` if no rules match
     */
    firstMatch(date, utc) {
        const result = this.#matchesAt(date, true, utc);
        return result.length ? result[0] : undefined;
    }
    /**
     * Find the rules that apply on a given date, repsecting the `multipleMatch` property.
     *
     * @param date - the date to find the matching rules at
     * @param utc - if `true` then use UTC date components, otherwise assume the local time zone
     * @returns the list of matching rules; at most one if `multipleMatch` is `false`
     */
    matches(date, utc) {
        return this.#matchesAt(date, !this.multipleMatch, utc);
    }
    /**
     * Find the rules that apply on a given date.
     *
     * @param date - the date to find the matching rules at
     * @param first - `true` to return the first match, `false` to return all matches
     * @param utc - if `true` then use UTC date components, otherwise assume the local time zone
     * @returns the list of matching rules
     */
    #matchesAt(date, first, utc) {
        const result = [];
        for (const r of this.#rules) {
            if (r.appliesAt(date, utc)) {
                result.splice(result.length, 0, r);
                if (first) {
                    break;
                }
            }
        }
        return result;
    }
    /**
     * Resolve the tariff rates that apply on a given date, respecting the `multipleMatch` property.
     *
     * Duplicate rate `id` values will override existing rates, so that the last-seen rate for
     * a given `id` is the one returned.
     *
     * @param date - the date to resolve
     * @param utc - if `true` then use UTC date components, otherwise assume the local time zone
     * @returns all tariff rates tha apply on the given date, as a `Record` of rate `id` values
     *     to associated rate instances
     */
    resolve(date, utc) {
        const matches = this.matches(date, utc);
        if (!matches.length) {
            return {};
        }
        if (matches.length == 1) {
            return matches[0].rates;
        }
        // combine into a single record
        const result = {};
        for (const tt of matches) {
            Object.assign(result, tt.rates);
        }
        return result;
    }
}
//# sourceMappingURL=TemporalRangesTariffSchedule.js.map