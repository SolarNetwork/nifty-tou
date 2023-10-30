/**
 * An enumeration of supported chronological tariff units of the Gregorian calendar.
 * @public
 */
export var ChronoTariffUnit;
(function (ChronoTariffUnit) {
    /** Days */
    ChronoTariffUnit[ChronoTariffUnit["DAYS"] = 0] = "DAYS";
    /** Weeks */
    ChronoTariffUnit[ChronoTariffUnit["WEEKS"] = 1] = "WEEKS";
    /** Months */
    ChronoTariffUnit[ChronoTariffUnit["MONTHS"] = 2] = "MONTHS";
})(ChronoTariffUnit || (ChronoTariffUnit = {}));
/**
 * A chronologically-based tariff, such as a "daily" charge.
 * @public
 */
export default class ChronoTariff {
    /** The tariff time unit. */
    #unit;
    /** The rate applied per time unit. */
    #rate;
    /** An optional name to associate with the tariff. */
    #name;
    /**
     * Constructor.
     *
     * @param chronoUnit - the chrono unit
     * @param rate - the rate per chrono unit
     * @param name - an optional description
     */
    constructor(chronoUnit, rate, name) {
        this.#unit = chronoUnit;
        this.#rate = rate;
        this.#name = name;
    }
    /** Get the unit. */
    get unit() {
        return this.#unit;
    }
    /** Get the rate. */
    get rate() {
        return this.#rate;
    }
    /** Get the optional name. */
    get name() {
        return this.#name;
    }
    /**
     * Calcualte the count of units between two dates.
     *
     * The cost of this tariff can be calculated by multiplying the `rate` by the result
     * of this method, for example:
     *
     * ```ts
     * const tariff = new ChronoTariff(ChronoTariffUnit.DAYS, 10);
     * tariff.rate * tariff.quantity(
     *     new Date('2024-01-01T00:00:00Z'),
     *     new Date('2024-01-08T00:00:00Z'),
     *     true) === 70; // 7 days @ 10/day
     * ```
     *
     * @param from - the starting date
     * @param to - the ending date (exclusive)
     * @param utc - if `true` then use UTC date components, otherwise assume the local time zone
     * @returns the count of units between `from` and `to`, including any fractional component
     */
    quantity(from, to, utc) {
        if (isNaN(+from) || isNaN(+to)) {
            return 0;
        }
        let q = 0;
        switch (this.#unit) {
            case ChronoTariffUnit.DAYS:
                q = this.#dayQuantity(from, to, utc);
                break;
            case ChronoTariffUnit.WEEKS:
                q = this.#weekQuantity(from, to, utc);
                break;
            case ChronoTariffUnit.MONTHS:
                q = this.#monthQuantity(from, to, utc);
                break;
        }
        return q;
    }
    #timeFraction(from, to, refFrom, refTo) {
        if (!(refFrom && refTo)) {
            return 0;
        }
        const den = refTo.getTime() - refFrom.getTime();
        if (den === 0) {
            return 0;
        }
        return (to.getTime() - from.getTime()) / den;
    }
    #dayQuantity(from, to, utc) {
        let q = 0;
        let ref;
        // get the starting day-aligned date
        const s = new Date(from);
        if (utc) {
            s.setUTCHours(0, 0, 0, 0);
            ref = new Date(s);
            if (s < from) {
                s.setUTCDate(s.getUTCDate() + 1);
            }
        }
        else {
            s.setHours(0, 0, 0, 0);
            ref = new Date(s);
            if (s < from) {
                s.setDate(s.getDate() + 1);
            }
        }
        if (s > to) {
            // less than one day
            return this.#timeFraction(from, to, ref, s);
        }
        // add start fraction
        q += this.#timeFraction(from, s, ref, s);
        // get the ending day-aligned date
        const e = new Date(to);
        if (utc) {
            e.setUTCHours(0, 0, 0, 0);
            ref = new Date(e);
            ref.setUTCDate(ref.getUTCDate() + 1);
        }
        else {
            e.setHours(0, 0, 0, 0);
            ref = new Date(e);
            ref.setDate(ref.getDate() + 1);
        }
        // add end fraction
        q += this.#timeFraction(e, to, e, ref);
        // count days
        while (s < e) {
            q += 1;
            if (utc) {
                s.setUTCDate(s.getUTCDate() + 1);
            }
            else {
                s.setDate(s.getDate() + 1);
            }
        }
        return q;
    }
    #weekQuantity(from, to, utc) {
        let q = 0;
        let ref;
        // get the starting Monday-aligned date
        const s = new Date(from);
        if (utc) {
            s.setUTCHours(0, 0, 0, 0);
            while (s.getUTCDay() !== 1) {
                s.setUTCDate(s.getUTCDate() - 1);
            }
            if (s < from) {
                ref = new Date(s);
                s.setUTCDate(s.getUTCDate() + 7);
            }
        }
        else {
            s.setHours(0, 0, 0, 0);
            while (s.getDay() !== 1) {
                s.setDate(s.getDate() - 1);
            }
            if (s < from) {
                ref = new Date(s);
                s.setDate(s.getDate() + 7);
            }
        }
        if (s > to) {
            // less than one week
            return this.#timeFraction(from, to, ref, s);
        }
        // add start fraction (of days)
        q += this.#timeFraction(from, s, ref, s);
        // get the ending Monday-aligned date
        const e = new Date(to);
        if (utc) {
            e.setUTCHours(0, 0, 0, 0);
            while (e.getUTCDay() !== 1) {
                e.setUTCDate(e.getUTCDate() - 1);
            }
            if (e < to) {
                ref = new Date(e);
                ref.setUTCDate(ref.getUTCDate() + 7);
            }
            else {
                ref = to;
            }
        }
        else {
            e.setHours(0, 0, 0, 0);
            while (e.getDay() !== 1) {
                e.setDate(e.getDate() - 1);
            }
            if (e < to) {
                ref = new Date(e);
                ref.setDate(ref.getDate() + 7);
            }
            else {
                ref = to;
            }
        }
        // add end fraction
        q += this.#timeFraction(e, to, e, ref);
        // count weeks
        while (s < e) {
            q += 1;
            if (utc) {
                s.setUTCDate(s.getUTCDate() + 7);
            }
            else {
                s.setDate(s.getDate() + 7);
            }
        }
        return q;
    }
    #monthQuantity(from, to, utc) {
        let q = 0;
        let ref;
        // get the starting day-aligned date
        const s = new Date(from);
        if (utc) {
            s.setUTCHours(0, 0, 0, 0);
            s.setUTCDate(1);
            if (s < from) {
                ref = new Date(s);
                s.setUTCMonth(s.getUTCMonth() + 1);
            }
        }
        else {
            s.setHours(0, 0, 0, 0);
            s.setDate(1);
            if (s < from) {
                ref = new Date(s);
                s.setMonth(s.getMonth() + 1);
            }
        }
        if (s > to) {
            // less than one month
            return this.#timeFraction(from, to, ref, s);
        }
        // add start fraction (of days)
        q += this.#timeFraction(from, s, ref, s);
        // get the ending month-aligned date
        const e = new Date(to);
        if (utc) {
            e.setUTCHours(0, 0, 0, 0);
            e.setUTCDate(1);
            if (e < to) {
                ref = new Date(e);
                ref.setUTCMonth(ref.getUTCMonth() + 1);
            }
            else {
                ref = to;
            }
        }
        else {
            e.setHours(0, 0, 0, 0);
            e.setDate(1);
            if (e < to) {
                ref = new Date(e);
                ref.setMonth(ref.getMonth() + 1);
            }
            else {
                ref = to;
            }
        }
        // add end fraction
        q += this.#timeFraction(e, to, e, ref);
        // count months
        while (s < e) {
            q += 1;
            if (utc) {
                s.setUTCMonth(s.getUTCMonth() + 1);
            }
            else {
                s.setMonth(s.getMonth() + 1);
            }
        }
        return q;
    }
}
//# sourceMappingURL=ChronoTariff.js.map