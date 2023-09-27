import { default as TemporalRangesTariffSchedule, } from "./TemporalRangesTariffSchedule.js";
/**
 * A schedule, or collection, of {@link YearTemporalRangesTariff} rules that supports
 * resolving rates for dates.
 *
 * @remarks
 * By default this schedule works similarly to the {@link TemporalRangesTariffSchedule},
 * except using {@link YearTemporalRangesTariff} instances that include a year criteria
 * for matching dates. The {@link YearTemporalRangesTariffScheduleOptions.yearExtend | yearExtend}
 * option changes the matching to treat the "most recent" year rules as having unbounded
 * maximum values. The idea here is that the most recently defined rules remain applicable
 * into future years, until another set of rules for some future year overrides them.
 *
 * @typeParam T - the tariff type
 * @typeParam O - the options type
 * @public */
export default class YearTemporalRangesTariffSchedule extends TemporalRangesTariffSchedule {
    /**
     * Get the year-extend mode.
     */
    get yearExtend() {
        return !!this.options?.yearExtend;
    }
    /**
     * Find the first rule that applies on a given date.
     *
     * @param date - the date to find the first matching rule at
     * @param utc - if `true` then use UTC date components, otherwise assume the local time zone
     * @returns the first available matching rule, or `undefined` if no rules match
     * @override
     */
    firstMatch(date, utc) {
        const result = this.#matchesAt(date, true, this.yearExtend, utc);
        return result.length ? result[0] : undefined;
    }
    /**
     * Find the rules that apply on a given date, repsecting the `multipleMatch` property.
     *
     * @param date - the date to find the matching rules at
     * @param utc - if `true` then use UTC date components, otherwise assume the local time zone
     * @returns the list of matching rules; at most one if `multipleMatch` is `false`
     * @override
     */
    matches(date, utc) {
        return this.#matchesAt(date, !this.multipleMatch, this.yearExtend, utc);
    }
    /**
     * Find the rules that apply on a given date.
     *
     * @param date - the date to find the matching rules at
     * @param first - `true` to return the first match, `false` to return all matches
     * @param yearExtend - `true` to extend the most recent available year
     * @param utc - if `true` then use UTC date components, otherwise assume the local time zone
     * @returns the list of matching rules
     */
    #matchesAt(date, first, yearExtend, utc) {
        const result = [];
        const dateYear = utc ? date.getUTCFullYear() : date.getFullYear();
        let matchingYear;
        for (const r of this.rules) {
            let applies; // starts undefined
            if (yearExtend) {
                const currYear = r.yearRange?.min !== undefined
                    ? r.yearRange.min
                    : undefined;
                if (currYear !== undefined && currYear <= dateYear) {
                    if (matchingYear === undefined) {
                        matchingYear = currYear;
                    }
                    if (currYear === matchingYear) {
                        applies = r.appliesAtYearExtended(date, utc);
                    }
                }
                else if (currYear !== undefined) {
                    continue;
                }
            }
            // if applies has been defined, that is our answer from above,
            //  otherwise call r.appliesAt() here to test
            if (applies || (applies === undefined && r.appliesAt(date, utc))) {
                result.push(r);
                if (first) {
                    break;
                }
            }
        }
        return result;
    }
}
//# sourceMappingURL=YearTemporalRangesTariffSchedule.js.map