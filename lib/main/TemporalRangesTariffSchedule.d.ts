import TariffRate from "./TariffRate.js";
import TemporalRangesTariff from "./TemporalRangesTariff.js";
/**
 * A schedule, or collection, of {@link TemporalRangesTariff} rules that supports
 * resolving rates for dates.
 *
 * @public
 */
export default class TemporalRangesTariffSchedule {
    #private;
    /**
     * Constructor.
     *
     * @param rules - the list of rules to include in the schedule
     * @param multipleMatch - if `true` then support resolving multiple rules for a given date,
     *     otherwise resolve the first matching rule only
     */
    constructor(rules: TemporalRangesTariff[], multipleMatch?: boolean);
    /**
     * Get the multiple-match mode.
     */
    get multipleMatch(): boolean;
    /**
     * Get the rules.
     */
    get rules(): readonly TemporalRangesTariff[];
    /**
     * Find the first rule that applies on a given date.
     *
     * @param date - the date to find the first matching rule at
     * @param utc - if `true` then use UTC date components, otherwise assume the local time zone
     * @returns the first available matching rule, or `undefined` if no rules match
     */
    firstMatch(date: Date, utc?: boolean): TemporalRangesTariff;
    /**
     * Find the rules that apply on a given date, repsecting the `multipleMatch` property.
     *
     * @param date - the date to find the matching rules at
     * @param utc - if `true` then use UTC date components, otherwise assume the local time zone
     * @returns the list of matching rules; at most one if `multipleMatch` is `false`
     */
    matches(date: Date, utc?: boolean): TemporalRangesTariff[];
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
    resolve(date: Date, utc?: boolean): Record<string, TariffRate>;
}
//# sourceMappingURL=TemporalRangesTariffSchedule.d.ts.map