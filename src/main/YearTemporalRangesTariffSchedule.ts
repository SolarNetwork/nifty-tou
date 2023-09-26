import {
	default as TemporalRangesTariffSchedule,
	TemporalRangesTariffScheduleOptions,
} from "./TemporalRangesTariffSchedule.js";
import YearTemporalRangesTariff from "./YearTemporalRangesTariff.js";

/**
 * A schedule, or collection, of {@link YearTemporalRangesTariff} rules that supports
 * resolving rates for dates.
 *
 * @param <T> the tariff type
 * @param <O> the options type
 * @public */
export default class YearTemporalRangesTariffSchedule<
	T extends YearTemporalRangesTariff,
	O extends TemporalRangesTariffScheduleOptions
> extends TemporalRangesTariffSchedule<T, O> {}
