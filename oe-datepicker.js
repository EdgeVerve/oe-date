/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { LegacyElementMixin } from "@polymer/polymer/lib/legacy/legacy-element-mixin.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-styles/paper-styles.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-flex-layout/iron-flex-layout.js";

/**
 * # oe-datepicker
 * 
 * `<oe-datepicker>` is a control  to select `date` from the display.
 * 
 * @customElement
 * @polymer
 * @demo demo/demo-oe-datepicker.html
 */
class OeDatepicker extends LegacyElementMixin(PolymerElement) {
    static get is() { return 'oe-datepicker'; }

    static get template() {
        return html`
            <style>
                :host {
                    display: inline-block;
                    position: relative;
                    width: 300px;
                }

                :host {
                    --dp-default-text: var(--secondary-text-color);
                    --dp-disabled-text: var(--disabled-text-color);
                    --dp-selected-text: var(--primary-background-color);
                    --dp-selected-bg: var(--default-primary-color);
                }

                .items-area {
                    display: -webkit-flex;

                    /* Safari */
                    -webkit-flex-wrap: wrap;

                    /* Safari 6.1+ */
                    /* stylelint-disable-next-line  declaration-block-no-duplicate-properties */
                    display: flex;
                    flex-wrap: wrap;
                    width: 100%;
                    align-content: stretch;
                    min-height: 210px;
                }

                .month,
                .day {
                    text-align: center;
                    margin: 3px;
                    font-size: 13px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: var(--dp-default-text);
                }

                .month {
                    width: calc(25% - 6px);
                }

                .day {
                    width: calc(14% - 6px);
                }

                .day span {
                    display: block;
                    width: 30px;
                    height: 30px;
                    line-height: 30px;
                    cursor: pointer;
                }

                .day.selected span {
                    background-color: var(--dp-selected-bg);
                    color: var(--dp-selected-text);
                    border-radius: 100%;
                }

                .day.title {
                    padding-top: 0;
                    padding-bottom: 4px;
                    font-weight: bold;
                    cursor: default;
                }

                .day.disabled {
                    pointer-events: none;
                    color: var(--dp-disabled-text);
                }

                paper-button {
                    text-transform: none;
                }

                .month-year-bar {
                    min-height: 46px;
                    padding: 3px 0;
                    width: 100%;

                    @apply --layout-flex;
                    @apply --layout-horizontal;
                    @apply --layout-center;
                }

                .title-text {
                    font-size: 18px;
                    min-height: 18px;
                    font-weight: 400;
                    text-align: center;

                    @apply --layout-flex;
                }

            </style>

            <template is="dom-if" if="{{_equals(showing,'decade')}}">

                <div>
                <div class="month-year-bar">
                    <paper-icon-button id="dprev" icon="chevron-left" on-tap="_prevDecade"></paper-icon-button>
                    <span class="title-text">Select Year</span>
                    <paper-icon-button id="dnext" icon="chevron-right" on-tap="_nextDecade"></paper-icon-button>
                </div>
                <div class="items-area">
                    <template is="dom-repeat" items="{{decadeYears}}">
                    <paper-button on-tap="_pickYear" class="month title" data-year$={{item}}>{{_computeLocaleYear(item)}}</paper-button>
                    </template>
                </div>
                </div>

            </template>

            <template is="dom-if" if="{{_equals(showing,'year')}}">

                <div>
                <div class="month-year-bar">
                    <paper-icon-button id="yprev" icon="chevron-left" on-tap="_prevYear"></paper-icon-button>
                    <paper-button id="ymain" class="title-text" on-tap="_showDecade">{{_computeLocaleYear(_activeYear)}}</paper-button>
                    <paper-icon-button id="ynext" icon="chevron-right" on-tap="_nextYear"></paper-icon-button>
                </div>
                <div class="items-area">
                    <template is="dom-repeat" items="{{_monthNames}}">
                    <paper-button on-tap="_pickMonth" class="month title" data-month$={{item.n}}>{{item.name}}</paper-button>
                    </template>
                </div>
                </div>

            </template>

            <template is="dom-if" if="{{_equals(showing,'month')}}">
                <div data-month$="{{month.number}}" data-year$="{{month.year}}">
                <div class="month-year-bar">
                    <paper-icon-button id="mprev" icon="chevron-left" on-tap="_prevMonth"></paper-icon-button>
                    <paper-button id="mmain" on-tap="_showYear" class="title-text">{{month.name}}</paper-button>
                    <paper-icon-button id="mnext" icon="chevron-right" on-tap="_nextMonth"></paper-icon-button>
                </div>
                <div class="items-area">
                    <template is="dom-repeat" items="{{_weekDayNames}}">
                    <div class="day title">{{item}}</div>
                    </template>

                    <template is="dom-repeat" items="{{month.days}}" as="day">

                    <template is="dom-if" if="{{!day.n}}">
                        <div class="day"></div>
                    </template>
                    <template is="dom-if" if="{{day.n}}">
                        <div on-tap="_pickDate" on-dblclick="_doubleClick" class$="day {{_getDateClass(day, month, value)}}" disabled$="{{day.disabled}}"
                        data-date$="{{day.n}}" data-month$="{{month.number}}" data-year$="{{month.year}}">
                        <span>{{day.day}}</span>
                        </div>
                    </template>

                    </template>

                </div>
                </div>
            </template>
        `;
    }

    static get properties() {
        return {

            value: {
                type: Date,
                value: function () {
                    var t = new Date();
                    t = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()));
                    return t;
                },
                notify: true,
                observer: '_valueChanged'
            },

            /**
             * Start of week, expressed as 0-6
             * 
             */
            startOfWeek: {
                type: Number,
                value: 1
            },

            locale: {
                type: String,
                value: navigator.language
            },

            /**
             * Weekly offs expressed as [0-6]
             *
             */
            disabledDays: {
                type: Array,
                value: function () {
                    return [];
                }
            },
            /**
             *  List of dates that should be disabled for selection,
             *  Should be Date objects or date strings in 'MM-DD-YYYY' format
             */
            holidays: {
                type: Array,
                observer: '_holidayChanged'
            },
            /**
             * Maximum selectable date
             */
            max: {
                type: Date,
                observer: '_renderCurrentMonth'
            },

            /**
             * Minimum selectable date
             */
            min: {
                type: Date,
                observer: '_renderCurrentMonth'
            }

            /**
             * Occurs when a date is selected.
             *
             * @event selection-changed
             */

            /**
             * Occurs when user double-clicks a date to select it.
             *
             * @event selection-double-click
             */
        };
    }

    /**
     * Observer on value changed to create display for month and year.
     */
    _valueChanged() {
        if (typeof this.value == 'string' || this.value instanceof String) {
            this.value = new Date(this.value);
            //we'll visit this function again this time with typeof(value)=Date
            return;
        }
        if (this.value && !isNaN(this.value.getTime())) {
            if (this._activeMonth != this.value.getMonth() || this._activeYear != this.value.getFullYear()) {
                this._activeMonth = this.value.getMonth();
                this._activeYear = this.value.getFullYear();
                this.prepareMonth(this._activeMonth, this._activeYear);
            }
        } else {
            var today = new Date();
            this._activeMonth = today.getMonth();
            this._activeYear = today.getFullYear();
            this.prepareMonth(this._activeMonth, this._activeYear);
        }
    }

    _computeLocaleYear(year){
        this.__localeCache = this.__localeCache || {};
        this.__localeCache[this.locale] = this.__localeCache[this.locale] = {yearLocale:{}};
        var yearLocale = this.__localeCache[this.locale]["yearLocale"];
        if(!yearLocale[year]){
            var newD = new Date();
            newD.setUTCFullYear(year);
            yearLocale[year] = this.intl.year(newD);
        }
        return yearLocale[year];
    }

    /**
     * Renders previous month display
     */
    _prevMonth() {
        this._activeMonth = this._activeMonth - 1;
        if (this._activeMonth < 0) {
            this._activeYear = this._activeYear - 1;
            this._activeMonth = 11;
        }
        this.prepareMonth(this._activeMonth, this._activeYear);
    }

    /**
     * Renders next month display
     */
    _nextMonth() {
        this._activeMonth = this._activeMonth + 1;
        if (this._activeMonth >= 12) {
            this._activeYear = this._activeYear + 1;
            this._activeMonth = 0;
        }
        this.prepareMonth(this._activeMonth, this._activeYear);
    }

    /**
     * Selects previous year
     */
    _prevYear() {
        this._activeYear--;
    }

    /**
     * Selects next year
     */
    _nextYear() {
        this._activeYear++;
    }

    /**
     * On double click of a date set it as selected date.
     */
    _doubleClick(e) {
        this._pickDate(e);
        this.fire('selection-double-click', this.getDetails(this.value));
    }

    /**
     * Sets the selected UTC date as value
     * @param {Event} e 
     */
    _pickDate(e) {
        var data = e.currentTarget.dataset;
        if (data && data.date) {
            var day = data.date;
            var month = data.month;
            var year = data.year;
            if (day && month && year) {
                this.set('value', new Date(Date.UTC(year, month, day)));
                this.fire('selection-changed', this.getDetails(this.value));
            }
        }
    }

    /**
     * Returns a detailed information on the date.
     * @param {Date} dValue date value
     * @return {Object} Containing information like 'day','month',etc.
     */
    getDetails(dValue) {
        if (!dValue) {
            dValue = new Date();
            dValue = new Date(Date.UTC(dValue.getFullYear(), dValue.getMonth(), dValue.getDate(), 0, 0, 0));
        }
        return {
            'value': dValue,
            'day': this.intl.weekDayNamesLong ? this.intl.weekDayNamesLong[dValue.getUTCDay()] : dValue.getUTCDay(),
            'date': dValue.getUTCDate(),
            'month': this.intl.monthNames ? this.intl.monthNames[dValue.getUTCMonth()].name : dValue.getUTCMonth(),
            'year': this.intl.year(dValue)
        };
    }

    /**
     * Selects a month and prepare the display
     * @param {Event} e Event contains the month to select
     */
    _pickMonth(e) {
        var data = e.currentTarget.dataset;
        if (data && data.month) {
            this._activeMonth = parseInt(data.month);
            this.prepareMonth(this._activeMonth, this._activeYear);
            this.set('showing', 'month');
        }
    }

    /**
     * Selects the year and prepares the display
     * @param {Event} e Event contains the year to select
     */
    _pickYear(e) {
        var data = e.currentTarget.dataset;
        if (data && data.year) {
            this._activeYear = parseInt(data.year);
            this.prepareMonth(this._activeMonth, this._activeYear);
            this.set('showing', 'year');
        }
    }

    /**
     * Returns CSS classes for the date components for styling.
     * @param {number} day day value
     * @param {number} month month value
     * @param {Date} selected selected date
     * @return {string} CSS classNames containing 'selected' and 'disabled'
     */
    _getDateClass(day, month, selected) {
        //selected.getDate-> check if selected is date object

        var retClass = '';
        if (selected && selected.getUTCDate && day.n == selected.getUTCDate() && month.number == selected.getUTCMonth() &&
            month.year == selected.getUTCFullYear()) {
            retClass += ' selected';
        }
        if (day.disabled) {
            retClass += ' disabled';
        }

        return retClass;
    }

    /**
     * Prepares the month array with startdate, enddate and padding,
     * so as to position the days correctly using dom-repeat.
     * @param {number} curMonth 
     * @param {number} curYear 
     */
    prepareMonth(curMonth, curYear) {

        if (!this.intl) {
            return;
        }
        var month = {
            days: [],
            name: '',
            number: curMonth,
            year: curYear
        };
        var date = new Date(Date.UTC(curYear, curMonth, 1));
        var startPoint = (date.getUTCDay() - this.startOfWeek + 7) % 7;

        month.name = this.intl.month_name_year(date);
        date = new Date(curYear, curMonth + 1, 0);
        var endPoint = date.getDate();
        for (var i = 0; i < startPoint; i++) {
            month.days.push({});
        }
        for (i = 1; i <= endPoint; i++) {
            var thisDate = Date.UTC(curYear, curMonth, i);
            
            month.days.push({
                n: i,
                day: this.intl.day(thisDate),
                disabled: this._isDateDisabled(thisDate)
            });
        }

        this.set('month', month);
    }

    /**
     * Checks if the input date is diabled based on 
     * 'min','max' and 'disabledDays' list.
     * @param {number} dateValue 
     * @return {boolean} true if date is disabled.
     */
    _isDateDisabled(dateValue) {
        var disabled = false;
        var date = new Date(dateValue);
        if (!disabled && this.min) {
            disabled = (dateValue < this.min);
        }
        if (!disabled && this.max) {
            disabled = (dateValue > this.max);
        }
        if (!disabled && this.disabledDays) {
            disabled = (this.disabledDays.indexOf(date.getUTCDay()) >= 0);
        }
        if (!disabled && this.holidays) {
            disabled = !!this._holidayMap[date.toDateString()];
        }
        return disabled;
    }

    _holidayChanged() {
        var _holidayMap = {};
        if (this.holidays && this.holidays.length > 0) {
            this.holidays.forEach(function (h) {
                if (!(h instanceof Date)) {
                    h = new Date(h);
                }
                _holidayMap[h.toDateString()] = true;
            });
        }
        this.set('_holidayMap', _holidayMap);
        this._renderCurrentMonth();
    }

    /**
     * String compare used in dom-if
     * @param {string} showing 
     * @param {string} mode 
     * @return {boolean} true if strings are equal.
     */
    _equals(showing, mode) {
        return showing == mode;
    }

    /**
     * Displays the list of months of selected year
     */
    _showYear() {
        this.set('showing', 'year');
    }

    /**
     * Displays years from the next decade
     */
    _nextDecade() {
        var years = this.decadeYears.map(function (v) { return v + 10; });
        this.set('decadeYears', years);
    }

    /**
     *  Displays years from the previous decade
     */
    _prevDecade() {
        var years = this.decadeYears.map(function (v) { return v - 10; });
        this.set('decadeYears', years);
    }

    /**
     * Displays the years of the selected decade
     */
    _showDecade() {
        var min = this._activeYear - (this._activeYear % 10);
        var max = min + 10;

        var years = [];
        for (var i = min; i <= max; i++) {
            years.push(i);
        }
        this.set('decadeYears', years);
        this.set('showing', 'decade');
    }

    /**
     * Prepares the internationalized dates list
     * @param {locale} l 
     * @param {*} s 
     * @param {*} d 
     */
    _settingsChanged(l, s, d) { // eslint-disable-line no-unused-vars
        if (!this.locale) return;

        this.intl = this.intls[this.locale];
        if (!this.intl) {
            var intl = this._createIntlSettings(this.locale);
            this.intls[this.locale] = intl;
            this.intl = intl;
        }

        // collect 3-char weekday names in _weekDayNames array
        var weekDayNames = this.intl.weekDayNames.slice(0);
        for (var i = 0; i < this.startOfWeek; i++) {
            weekDayNames.push(weekDayNames.shift());
        }
        this.set('_weekDayNames', weekDayNames);

        this.set('_monthNames', this.intl.monthNames);
        this.prepareMonth(this._activeMonth, this._activeYear);
    }

    /**
     * Creates a default setting for Internationalized date time format
     * @param {locale} locale 
     */
    _createIntlSettings(locale) {
        var intl = {};
        intl.day = Intl.DateTimeFormat(locale, {
            day: 'numeric',
            timeZone: 'UTC'
        }).format;
        intl.month_name_year = Intl.DateTimeFormat(locale, {
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC'
        }).format;
        intl.year = Intl.DateTimeFormat(locale,{
            year: 'numeric',
            timeZone: 'UTC'
        }).format;

        // collect 3-char and long weekday names in arrays
        var weekDayNames = [];
        var weekDayNamesLong = [];
        for (var i = -1; i < 6; i++) {
            var date = new Date(Date.UTC(2000, 1, i, 0, 0, 0));
            weekDayNames.push(Intl.DateTimeFormat(locale, {
                weekday: 'narrow',
                timeZone: 'UTC'
            }).format(date));
            weekDayNamesLong.push(Intl.DateTimeFormat(locale, {
                weekday: 'long',
                timeZone: 'UTC'
            }).format(date));
        }
        intl.weekDayNames = weekDayNames;
        intl.weekDayNamesLong = weekDayNamesLong;

        //_weekDayNames_long

        //long month names in monthNamesLong array
        var monthNamesLong = [];
        var monthNames = [];
        for (var i = 0; i < 12; i++) { // eslint-disable-line no-redeclare
            var date = new Date(Date.UTC(2000, i, 1, 0, 0, 0)); // eslint-disable-line no-redeclare
            monthNames.push({
                name: Intl.DateTimeFormat(this.locale, {
                    month: 'short',
                    timeZone: 'UTC'
                }).format(date),
                n: i
            });

            monthNamesLong.push(
                Intl.DateTimeFormat(this.locale, {
                    month: 'long',
                    timeZone: 'UTC'
                }).format(date));
        }
        intl.monthNames = monthNames;
        intl.monthNamesLong = monthNamesLong;

        return intl;
    }

    /**
     * Constructor to initialize 'intls'
     */
    constructor() {
        super();
        this.intls = {};
        this.intls[navigator.language] = this._createIntlSettings(navigator.language);
    }

    /**
     * Displays list of days by default on attached to DOM.
     */
    connectedCallback() {
        super.connectedCallback();
        this.set('showing', 'month');
        this._settingsChanged();

        if (!this.value) {
            this.set('value', new Date());
        } else if (typeof this.value != 'date') { // eslint-disable-line valid-typeof
            this.set('value', new Date(this.value));
        }
    }

    /**
     * Renders the current month's days
     */
    _renderCurrentMonth() {
        this.prepareMonth(this._activeMonth, this._activeYear);
    }

}

window.customElements.define(OeDatepicker.is, OeDatepicker);