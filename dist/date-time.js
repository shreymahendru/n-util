"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DateTime = void 0;
const tslib_1 = require("tslib");
const n_defensive_1 = require("@nivinjoseph/n-defensive");
const luxon_1 = require("luxon");
const serializable_1 = require("./serializable");
const duration_1 = require("./duration");
const type_helper_1 = require("./type-helper");
class DateTime extends serializable_1.Serializable {
    constructor(data) {
        super(data);
        let { value, zone } = data;
        (0, n_defensive_1.given)(value, "value").ensureHasValue().ensureIsString();
        value = value.trim();
        (0, n_defensive_1.given)(zone, "zone").ensureHasValue().ensureIsString();
        zone = zone.trim();
        if (zone.toLowerCase() === "utc")
            zone = zone.toLowerCase();
        DateTime._validateZone(zone);
        const dateTime = luxon_1.DateTime.fromFormat(value, DateTime._format, { zone });
        (0, n_defensive_1.given)(data, "data").ensure(_ => dateTime.isValid, `value and zone is invalid (${dateTime.invalidReason}: ${dateTime.invalidExplanation})`);
        this._value = value;
        this._zone = zone;
        this._dateTime = dateTime;
        this._timestamp = this._dateTime.toUnixInteger();
        const [date, time] = this._value.split(" ");
        (0, n_defensive_1.given)(time, "time").ensure(t => t !== "24:00", "Time should not be 24:00");
        this._dateCode = date.split("-").join("");
        this._timeCode = time.split(":").join("");
        this._dateValue = date;
        this._timeValue = time;
    }
    /**
     * @returns system's local timezone
     */
    static get currentZone() { return luxon_1.DateTime.local().zoneName; }
    get value() { return this._value; }
    get zone() { return this._zone; }
    get timestamp() { return this._timestamp; }
    get dateCode() { return this._dateCode; }
    get timeCode() { return this._timeCode; }
    get dateValue() { return this._dateValue; }
    get timeValue() { return this._timeValue; }
    get isPast() { return this.isBefore(DateTime.now()); }
    get isFuture() { return this.isAfter(DateTime.now()); }
    /**
     * @param zone :  a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the string 'utc'.
     * If none specified, will use UTC
     */
    static now(zone) {
        (0, n_defensive_1.given)(zone, "zone").ensureIsString();
        if (zone != null) {
            return new DateTime({
                value: luxon_1.DateTime.now().setZone(zone).toFormat(DateTime._format),
                zone
            });
        }
        else {
            return new DateTime({
                value: luxon_1.DateTime.utc().toFormat(DateTime._format),
                zone: "utc"
            });
        }
    }
    /**
    * Create a DateTime from a number of seconds since the epoch (meaning since 1 January 1970 00:00:00 UTC).
    *
    * @param timestamp - number of seconds since 1970 UTC
    * @param zone - a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the string 'utc'.
    */
    static createFromTimestamp(timestamp, zone) {
        (0, n_defensive_1.given)(timestamp, "timestamp").ensureHasValue().ensureIsNumber();
        (0, n_defensive_1.given)(zone, "zone").ensureHasValue().ensureIsString();
        const dateTimeString = luxon_1.DateTime.fromSeconds(timestamp).setZone(zone).toFormat(this._format);
        return new DateTime({
            value: dateTimeString,
            zone
        });
    }
    /**
    * Create a DateTime from a number of seconds since the epoch (meaning since 1 January 1970 00:00:00 UTC).
    *
    * @param milliseconds -  number of milliseconds since the epoch (meaning since 1 January 1970 00:00:00 UTC)
    * @param zone - a zone identifier. As a string, that can be any IANA zone supported by the host environment,
    *  or a fixed-offset name of the form 'UTC+3', or the string 'utc'.
    */
    static createFromMilliSecondsSinceEpoch(milliseconds, zone) {
        (0, n_defensive_1.given)(milliseconds, "milliseconds").ensureHasValue().ensureIsNumber();
        (0, n_defensive_1.given)(zone, "zone").ensureHasValue().ensureIsString();
        const dateTimeString = luxon_1.DateTime.fromMillis(milliseconds).setZone(zone).toFormat(this._format);
        return new DateTime({
            value: dateTimeString,
            zone
        });
    }
    /**
    * Create a DateTime from dateCode and timeCode.
    *
    * @param dateCode - dateCode as 8 digit number first four represent year, next two the month and last two day
    * @param timeCode - timeCode as 4 digit number first two represent hour and last two minute
    * @param zone - a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the string 'utc'.
    */
    static createFromCodes(dateCode, timeCode, zone) {
        (0, n_defensive_1.given)(dateCode, "dateCode").ensureHasValue().ensureIsString()
            .ensure(t => t.matchesFormat("########"));
        (0, n_defensive_1.given)(timeCode, "timeCode").ensureHasValue().ensureIsString()
            .ensure(t => t.matchesFormat("####"));
        (0, n_defensive_1.given)(zone, "zone").ensureHasValue().ensureIsString();
        const dateCodeSplit = dateCode.split("");
        const timeCodeSplit = timeCode.split("");
        const year = dateCodeSplit.take(4).join("");
        const month = dateCodeSplit.skip(4).take(2).join("");
        const day = dateCodeSplit.skip(6).join("");
        const hour = timeCodeSplit.take(2).join("");
        const minute = timeCodeSplit.skip(2).join("");
        const dateTimeString = `${year}-${month}-${day} ${hour}:${minute}`;
        return new DateTime({
            value: dateTimeString,
            zone
        });
    }
    /**
    * Create a DateTime from date and time.
    *
    * @param dateValue - date in the format YYYY-MM-DD
    * @param timeCode - time in the format hh:mm
    * @param zone - a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the string 'utc'.
    */
    static createFromValues(dateValue, timeValue, zone) {
        (0, n_defensive_1.given)(dateValue, "dateValue").ensureHasValue().ensureIsString()
            .ensure(t => t.matchesFormat("####-##-##"));
        (0, n_defensive_1.given)(timeValue, "timeValue").ensureHasValue().ensureIsString()
            .ensure(t => t.matchesFormat("##:##"));
        (0, n_defensive_1.given)(zone, "zone").ensureHasValue().ensureIsString();
        const dateTimeString = `${dateValue} ${timeValue}`;
        return new DateTime({
            value: dateTimeString,
            zone
        });
    }
    static min(dateTime1, dateTime2) {
        (0, n_defensive_1.given)(dateTime1, "dateTime1").ensureHasValue().ensureIsType(DateTime);
        (0, n_defensive_1.given)(dateTime2, "dateTime2").ensureHasValue().ensureIsType(DateTime);
        if (dateTime1.valueOf() < dateTime2.valueOf())
            return dateTime1;
        return dateTime2;
    }
    static max(dateTime1, dateTime2) {
        (0, n_defensive_1.given)(dateTime1, "dateTime1").ensureHasValue().ensureIsType(DateTime);
        (0, n_defensive_1.given)(dateTime2, "dateTime2").ensureHasValue().ensureIsType(DateTime);
        if (dateTime1.valueOf() > dateTime2.valueOf())
            return dateTime1;
        return dateTime2;
    }
    static validateDateTimeFormat(value) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (value == null || value.isEmptyOrWhiteSpace())
            return false;
        return luxon_1.DateTime.fromFormat(value, DateTime._format).isValid;
    }
    static validateDateFormat(value) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (value == null || value.isEmptyOrWhiteSpace())
            return false;
        return luxon_1.DateTime.fromFormat(value, "yyyy-MM-dd").isValid;
    }
    static validateTimeFormat(value) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (value == null || value.isEmptyOrWhiteSpace())
            return false;
        return luxon_1.DateTime.fromFormat(value, "HH:mm").isValid;
    }
    static validateTimeZone(zone) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (zone == null || zone.isEmptyOrWhiteSpace())
            return false;
        try {
            DateTime._validateZone(zone);
        }
        catch (_a) {
            return false;
        }
        return luxon_1.DateTime.now().setZone(zone).isValid;
    }
    static _validateZone(zone) {
        zone = zone.trim();
        if (zone.toLowerCase() === "utc")
            return;
        (0, n_defensive_1.given)(zone, "zone")
            .ensureWhen(zone.toLowerCase() === "local", _ => false, "should not use local zone")
            .ensureWhen(zone.toLowerCase().startsWith("utc+"), t => {
            // range is +00:00 to +14:00 (https://en.wikipedia.org/wiki/List_of_UTC_offsets)
            let offset = t.split("+").takeLast().trim();
            if (!offset.contains(":"))
                offset = `${offset}:00`;
            const [hour, minute] = offset.split(":").map(t => type_helper_1.TypeHelper.parseNumber(t));
            if (hour == null || minute == null)
                return false;
            return (hour >= 0 && hour < 14 && minute >= 0 && minute < 60)
                || (hour === 14 && minute === 0);
        }, "Invalid UTC offset for zone")
            .ensureWhen(zone.toLowerCase().startsWith("utc-"), t => {
            // range is -00:00 to -12:00 (https://en.wikipedia.org/wiki/List_of_UTC_offsets)
            let offset = t.split("-").takeLast();
            if (!offset.contains(":"))
                offset = `${offset}:00`;
            const [hour, minute] = offset.split(":").map(t => type_helper_1.TypeHelper.parseNumber(t));
            if (hour == null || minute == null)
                return false;
            return hour >= 0 && hour < 12 && minute >= 0 && minute < 60
                || (hour === 12 && minute === 0);
        }, "Invalid UTC offset for zone");
    }
    valueOf() {
        return this._dateTime.valueOf();
    }
    equals(value) {
        (0, n_defensive_1.given)(value, "value").ensureIsType(DateTime);
        if (value == null)
            return false;
        if (value === this)
            return true;
        return value.value === this._value && value.zone === this._zone;
    }
    toString() {
        return `${this._value} ${this._zone}`;
    }
    toStringDateTime() {
        return this._value;
    }
    toStringISO() {
        return this._dateTime.toISO({ format: "extended", includeOffset: true });
    }
    /**
     * @param value
     * @returns true if this is the same instant in time as value, otherwise false
     */
    isSame(value) {
        (0, n_defensive_1.given)(value, "value").ensureHasValue().ensureIsType(DateTime);
        return this.valueOf() === value.valueOf();
    }
    /**
     * @param value
     * @returns true if this occurs before value, otherwise false
     */
    isBefore(value) {
        (0, n_defensive_1.given)(value, "value").ensureHasValue().ensureIsType(DateTime);
        return this.valueOf() < value.valueOf();
    }
    /**
     * @param value
     * @returns true if this is the same instant in time as value or occurs before, otherwise false
     */
    isSameOrBefore(value) {
        (0, n_defensive_1.given)(value, "value").ensureHasValue().ensureIsType(DateTime);
        return this.valueOf() <= value.valueOf();
    }
    /**
     * @param value
     * @returns true if this occurs after value, otherwise false
     */
    isAfter(value) {
        (0, n_defensive_1.given)(value, "value").ensureHasValue().ensureIsType(DateTime);
        return this.valueOf() > value.valueOf();
    }
    /**
     * @param value
     * @returns true if this is the same instant in time as value or occurs after, otherwise false
     */
    isSameOrAfter(value) {
        (0, n_defensive_1.given)(value, "value").ensureHasValue().ensureIsType(DateTime);
        return this.valueOf() >= value.valueOf();
    }
    isBetween(start, end) {
        (0, n_defensive_1.given)(start, "start").ensureHasValue().ensureIsType(DateTime);
        (0, n_defensive_1.given)(end, "end").ensureHasValue().ensureIsType(DateTime)
            .ensure(t => t.isSameOrAfter(start), "must be same or after start");
        return this.isSameOrAfter(start) && this.isSameOrBefore(end);
    }
    /**
     *
     * @returns the difference in instant seconds
     */
    timeDiff(value) {
        (0, n_defensive_1.given)(value, "value").ensureHasValue().ensureIsType(DateTime);
        return duration_1.Duration.fromMilliSeconds(Math.abs(this.valueOf() - value.valueOf()));
    }
    /**
     *
     * @returns the difference in calendar days
     */
    daysDiff(value) {
        (0, n_defensive_1.given)(value, "value").ensureHasValue().ensureIsType(DateTime);
        return Math.abs(Number.parseInt(this._dateTime.diff(value._dateTime, ["days"]).days.toString()));
    }
    isSameDay(value) {
        (0, n_defensive_1.given)(value, "value").ensureHasValue().ensureIsType(DateTime);
        const daysDiff = this._dateTime.diff(value._dateTime, ["days"]).days;
        return Math.abs(daysDiff) < 1;
    }
    /**
    * Adds duration in milliseconds and increases the timestamp by the right number of milliseconds.
    * this accounts for shift in DST
    */
    addTime(time) {
        (0, n_defensive_1.given)(time, "time").ensureHasValue().ensureIsObject().ensureIsInstanceOf(duration_1.Duration);
        return new DateTime({
            value: this._dateTime.plus({ milliseconds: time.toMilliSeconds() }).toFormat(DateTime._format),
            zone: this._zone
        });
    }
    /**
     * Subtracts duration in milliseconds and decreases the timestamp by the right number of milliseconds.
     * this accounts for shift in DST
     */
    subtractTime(time) {
        (0, n_defensive_1.given)(time, "time").ensureHasValue().ensureIsObject().ensureIsInstanceOf(duration_1.Duration);
        return new DateTime({
            value: this._dateTime.minus({ milliseconds: time.toMilliSeconds() }).toFormat(DateTime._format),
            zone: this._zone
        });
    }
    /**
     * Adds number of days in calendar days, this doesn't change time based on DST
     * @param days number of calendar days to add
     */
    addDays(days) {
        (0, n_defensive_1.given)(days, "days").ensureHasValue().ensureIsNumber()
            .ensure(t => t >= 0 && Number.isInteger(t), "days should be positive integer");
        return new DateTime({
            value: this._dateTime.plus({ days }).toFormat(DateTime._format),
            zone: this._zone
        });
    }
    /**
    * Subtracts number of days in calendar days, this doesn't change time based on DST
    * @param days number of calendar days to subtract
    */
    subtractDays(days) {
        (0, n_defensive_1.given)(days, "days").ensureHasValue().ensureIsNumber()
            .ensure(t => t >= 0 && Number.isInteger(t), "days should be positive integer");
        return new DateTime({
            value: this._dateTime.minus({ days }).toFormat(DateTime._format),
            zone: this._zone
        });
    }
    /**
    *
    * @returns array of DateTime objects.
    * First element is the start of the month (Eg: 2023-06-01 00:00)
    * Last element is the end of the month (Eg: 2023-06-30 23:59)
    * Element in between represent the start of the day of the month (Eg: 2023-06-11 00:00)
    */
    getDaysOfMonth() {
        const startOfMonth = this._dateTime.startOf("month");
        const endOfMonth = this._dateTime.endOf("month");
        const luxonDays = luxon_1.Interval.fromDateTimes(startOfMonth, endOfMonth).splitBy({ days: 1 })
            .map((t) => t.start);
        luxonDays[0] = startOfMonth;
        luxonDays[luxonDays.length - 1] = endOfMonth;
        return luxonDays.map(t => new DateTime({
            value: t.toFormat(DateTime._format),
            zone: this._zone
        }));
    }
    /**
     * @description Converts the current date time to a different time zone
     * @param zone  a zone identifier. As a string, that can be any IANA zone supported by the host environment, or a fixed-offset name of the form 'UTC+3', or the string 'utc'.
     * @returns a new DateTime object with the new zone
     */
    convertToZone(zone) {
        (0, n_defensive_1.given)(zone, "zone").ensureHasValue().ensureIsString()
            .ensure(t => DateTime.validateTimeZone(t));
        if (zone === this.zone)
            return this;
        const newDateTime = this._dateTime.setZone(zone).toFormat(DateTime._format);
        return new DateTime({
            value: newDateTime,
            zone
        });
    }
    /**
     *
     * @param startTimeCode inclusive
     * @param endTimeCode inclusive
     */
    isWithinTimeRange(startTimeCode, endTimeCode) {
        (0, n_defensive_1.given)(startTimeCode, "startTimeCode").ensureHasValue().ensureIsString()
            .ensure(t => t.matchesFormat("####"))
            .ensure(t => Number.parseInt(t) >= 0 && Number.parseInt(t) <= 2359);
        (0, n_defensive_1.given)(endTimeCode, "endTimeCode").ensureHasValue().ensureIsString()
            .ensure(t => t.matchesFormat("####"))
            .ensure(t => Number.parseInt(t) >= 0 && Number.parseInt(t) <= 2359)
            .ensure(t => Number.parseInt(t) >= Number.parseInt(startTimeCode), "must be >= startTimeCode");
        const startDateTime = DateTime.createFromCodes(this.dateCode, startTimeCode, this.zone);
        const endDateTime = DateTime.createFromCodes(this.dateCode, endTimeCode, this.zone);
        return this.isBetween(startDateTime, endDateTime);
    }
}
DateTime._format = "yyyy-MM-dd HH:mm";
tslib_1.__decorate([
    serializable_1.serialize,
    tslib_1.__metadata("design:type", String),
    tslib_1.__metadata("design:paramtypes", [])
], DateTime.prototype, "value", null);
tslib_1.__decorate([
    serializable_1.serialize,
    tslib_1.__metadata("design:type", String),
    tslib_1.__metadata("design:paramtypes", [])
], DateTime.prototype, "zone", null);
exports.DateTime = DateTime;
//# sourceMappingURL=date-time.js.map