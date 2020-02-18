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
                    height: 64px;
                }

                .day {
                    min-width: 0px;
                    width: calc(14% - 6px);
                }

                .day span {
                    display: block;
                    width: 30px;
                    height: 30px;
                    line-height: 30px;
                    cursor: pointer;
                }
                
                 .day:focus {
                     outline:none;
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
                   /* font-weight: 400; */
                    text-align: center;

                    @apply --layout-flex;
                }
                .items-area:focus {
                    font-weight: bold;
                  }
                div.items-area:focus { outline: none; }

            </style>

            <template is="dom-if" if="{{_equals(showing,'decade')}}">

                <div>
                <div class="month-year-bar">
                    <paper-icon-button aria-label="Previous decade" id="dprev" icon="chevron-left" on-tap="_prevDecade"></paper-icon-button>
                    <span class="title-text">Select Year</span>
                    <paper-icon-button  aria-label="Next decade" id="dnext" icon="chevron-right" on-tap="_nextDecade"></paper-icon-button>
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
                    <paper-icon-button aria-label="Previous year" id="yprev" icon="chevron-left" on-tap="_prevYear"></paper-icon-button>
                    <paper-button id="ymain" class="title-text" on-tap="_showDecade"  aria-label$="{{_activeYear}}, open year selector" area-pressed="false">{{_computeLocaleYear(_activeYear)}}</paper-button>
                    <paper-icon-button aria-label="Next year" id="ynext" icon="chevron-right" on-tap="_nextYear"></paper-icon-button>
                </div>
                <div class="items-area">
                    <template is="dom-repeat" items="{{_monthNames}}">
                    <paper-button on-tap="_pickMonth" class="month title" data-month$={{item.n}} aria-label$={{item.longName}}>{{item.name}}</paper-button>
                    </template>
                </div>
                </div>

            </template>

            <template is="dom-if" if="{{_equals(showing,'month')}}">
                <div role="application" data-month$="{{month.number}}" data-year$="{{month.year}}">
                <div class="month-year-bar">
                    <paper-icon-button aria-label="Previous month" id="mprev" icon="chevron-left" on-tap="_prevMonth"></paper-icon-button>
                    <paper-button id="mmain" on-tap="_showYear" class="title-text" aria-label$="{{month.name}}, open month selector" area-pressed="false" >{{month.name}}</paper-button>
                    <paper-icon-button aria-label="Next month" id="mnext" icon="chevron-right" on-tap="_nextMonth"></paper-icon-button>
                </div>
                <div class="items-area" on-keydown="_handleDateArrowNavigation" aria-label$="{{month.name}}, Use arrow keys to select date" tabindex$="{{_canTabInOnCalendar(month, value)}}">
                    <template is="dom-repeat" items="{{_weekDayNames}}">
                    <div class="day title" aria-label$="{{getName(index)}}">
                    <span>{{item}}</span>
                    </div>
                    </template>

                    <template is="dom-repeat" items="{{month.days}}" as="day">

                    <div role="button" tabindex$="{{_canTabInOnDate(day, month, value)}}" aria-label$="{{day.day}} {{month.name}}" on-tap="_pickDate" on-dblclick="_doubleClick" class$="day {{_getDateClass(day, month, value)}}" disabled$="{{day.disabled}}" data-date$="{{day.n}}" data-month$="{{month.number}}" data-year$="{{month.year}}">
              <span>{{day.day}}</span>
            </div>
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
                // value: function () {
                //     var t = new Date();
                //     t = new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()));
                //     return t;
                // },
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
            },

            /**
             * 
             */
            disableInitialLoad: {
                type: Boolean,
                value: false
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
            if (this._activeMonth != this.value.getUTCMonth() || this._activeYear != this.value.getUTCFullYear()) {
                this._activeMonth = this.value.getUTCMonth();
                this._activeYear = this.value.getUTCFullYear();
                this.prepareMonth(this._activeMonth, this._activeYear);
            }
        } else {
            if(this.value !== undefined){
                var today = new Date();
                this._activeMonth = today.getMonth();
                this._activeYear = today.getFullYear();
                this.prepareMonth(this._activeMonth, this._activeYear);
            }
        }
    }
    getName(index){
        return this._weekDayNamesLong[index];
    }
    _computeLocaleYear(year) {
        this.__localeCache = this.__localeCache || {};
        this.__localeCache[this.locale] = this.__localeCache[this.locale] = { yearLocale: {} };
        var yearLocale = this.__localeCache[this.locale]["yearLocale"];
        if (!yearLocale[year]) {
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
        var data = e.currentTarget.dataset;
        if (data && data.date) {

            this._pickDate(e);
            this.fire('selection-double-click', this.getDetails(this.value));
        }
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
            'longMonth': this.intl.monthNames ? this.intl.monthNames[dValue.getUTCMonth()].longName : dValue.getUTCMonth(),
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
    _canTabInOnCalendar(month, selected) {
        /* If selected date is not in current month we should allow tabbing into calendar */
        var tabIndex = -1;
        if (month && selected) {
            if (!selected || month.number !== selected.getUTCMonth() ||
                month.year !== selected.getUTCFullYear()) {
                tabIndex = 0;
            }
        }
        return tabIndex;
    }
    _canTabInOnDate(day, month, selected) {

        var tabIndex = -1;
        if (selected && selected.getUTCDate && day.n === selected.getUTCDate() && month.number == selected.getUTCMonth() &&
            month.year === selected.getUTCFullYear()) {
            tabIndex = 0;
        }
        return tabIndex;
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
        if (!this.intl || typeof curMonth === 'undefined' || typeof curYear === 'undefined') {
            return;
        }
        var date = new Date(Date.UTC(curYear, curMonth, 1));
        var startPoint = (date.getUTCDay() - this.startOfWeek + 7) % 7;
        date = new Date(curYear, curMonth + 1, 0);
        var endPoint = date.getDate();
        var month = {
            days: new Array(startPoint + endPoint),
            name: this.intl.month_name_year(date),
            number: curMonth,
            year: curYear
        };
        
        for (var i = 0; i < startPoint; i++) {
            month.days[i] = {};
        }
        for (i = 1; i <= endPoint; i++) {
            var thisDate = Date.UTC(curYear, curMonth, i);

            month.days[startPoint + i - 1] = {
                n: i,
                day: this.intl.day(thisDate),
                disabled: this._isDateDisabled(thisDate)
            };
        }
        
        this.set('month', month);
    }
    __prepareMonth(curMonth, curYear) {
        if (!this.intl || typeof curMonth === 'undefined' || typeof curYear === 'undefined') {
            return;
        }
        var date = new Date(Date.UTC(curYear, curMonth, 1));
        var startPoint = (date.getUTCDay() - this.startOfWeek + 7) % 7;
        date = new Date(curYear, curMonth + 1, 0);
        var endPoint = date.getDate();
        var month = {
            days: new Array(startPoint + endPoint),
            name: this.intl.month_name_year(date),
            number: curMonth,
            year: curYear
        };
        
        for (var i = 0; i < startPoint; i++) {
            month.days[i] = {};
        }
        for (i = 1; i <= endPoint; i++) {
            var thisDate = Date.UTC(curYear, curMonth, i);

            month.days[startPoint + i - 1] = {
                n: i,
                day: this.intl.day(thisDate),
                disabled: this._isDateDisabled(thisDate)
            };
        }

        return month;
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
            disabled = this._holidayMap && !!this._holidayMap[date.toISOString()];
        }
        return disabled;
    }

    _holidayChanged() {
        var _holidayMap = {};
        if (this.holidays && this.holidays.length > 0) {
            this.holidays.forEach(function (h) {
                if (!(h instanceof Date)) {
                    var temp = new Date(h);
                    h = new Date(Date.UTC(temp.getFullYear(), temp.getMonth(), temp.getDate()));
                }
                _holidayMap[h.toISOString()] = true;
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
        /* _activeYear is 1985, min will be 1980 and we show 11 records from 1980 - 1990 both inclusive */
        var years = [min, min + 1, min + 2, min + 3, min + 4, min + 5, min + 6, min + 7, min + 8, min + 9, min + 10];
        this.set('decadeYears', years);
        this.set('showing', 'decade');
    }
    monthToMap(month){
        var dayWeekMap = [];
        month.days.forEach((d,i) => {
            let week = Math.floor(i/7);
            let day = i%7;
            if(!dayWeekMap[week]){
                dayWeekMap[week] = [];
            }
        dayWeekMap[week][day] = d;
        });
        return dayWeekMap;

    }
    _handleDateArrowNavigation(e) {
       // e.preventDefault();
        if (this.disabled || ['Enter', 'ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown', 'Home', 'End', 'PageUp', 'PageDown'].indexOf(e.code) < 0) {
            return;
        }
        var dayIndex,weekIndex;
        var targetDiv = e.currentTarget;
        var newDate;
        var isValid = false;
        var currentSelection = targetDiv.querySelector('div.day.selected');
        var data = currentSelection && currentSelection.dataset;
        var month = this.__prepareMonth(this._activeMonth, this._activeYear);
        var dayWeekMap = this.monthToMap(month);
        dayWeekMap.forEach((elem,wIndex) => {
            elem.forEach((ele,dIndex) => {
                if(data.date === ele.day){
                    weekIndex = wIndex;
                    dayIndex = dIndex;
                }
            })
        });
        if (data && data.date && data.month && data.year) {
            var day = parseInt(data.date);
            if (day) {
                // on Enter it select the current focused date
                if (e.code === 'Enter') {
                    newDate = new Date(Date.UTC(data.year, data.month, data.date));
                    if (!this._isDateDisabled(newDate)) {
                        this.set('value', newDate);
                        this.fire('selection-double-click', this.getDetails(this.value));
                        e.preventDefault();
                    }
                } else {
                    // on ArrowLeft goto to one day before
                    if (e.code === 'ArrowLeft') {
                        newDate = new Date(Date.UTC(data.year, data.month, day - 1));
                    }
                    // on ArrowUp goto same day previous week
                    else if (e.code === 'ArrowUp') {
                        newDate = new Date(Date.UTC(data.year, data.month, day - 7));
                    }
                    //on ArrowRight goto next day.
                    else if (e.code === 'ArrowRight') {
                        newDate = new Date(Date.UTC(data.year, data.month, day + 1));
                    }
                    //on ArrowDown goto next week same day.
                    else if (e.code === 'ArrowDown') {
                        newDate = new Date(Date.UTC(data.year, data.month, day + 7));
                    }
                     // On press of End key if last day of week is not of month then goto next available last day of week.
                    else if(e.code === 'End'){
                        if(dayWeekMap[weekIndex][6]){
                            day = parseInt(dayWeekMap[weekIndex][6].day);
                        }
                        else {
                            var m = this.__prepareMonth(this._activeMonth + 1, this._activeYear);
                            var mMap = this.monthToMap(m);
                            day = parseInt(mMap[0][6].day);
                            this.prepareMonth(this._activeMonth + 1, this._activeYear);
                        }
                        newDate = new Date(Date.UTC(data.year, data.month, day));
                    }
                    // On press of home key if first day of week is not of month then goto first available day of week.
                    else if(e.code === 'Home'){
                        day = parseInt(dayWeekMap[weekIndex][0].day);
                        if(!day){
                            var m = this.__prepareMonth(this._activeMonth - 1, this._activeYear);
                            var mMap = this.monthToMap(m);
                            mMap.forEach((elem,wIndex) => {
                                elem.forEach((ele,dIndex) => {
                                    if(ele.day){
                                        weekIndex = wIndex;
                                        dayIndex = dIndex;
                                    }
                                })
                            });
                            day = parseInt(mMap[weekIndex][0].day);
                            this.prepareMonth(this._activeMonth - 1, this._activeYear);
                    }
                    newDate = new Date(Date.UTC(data.year, data.month, day));
                }
                //On press of PageUp if there is no same day for previous month then goto next available day of the month.
                    else if(e.code === 'PageUp'){
                        currentSelection.blur();
                        //On press of shift + PageUp goto the same day of previous year 
                        if(e.shiftKey){
                            this._activeYear = this._activeYear - 1;
                            var prevYearMonth = this.__prepareMonth(this._activeMonth, this._activeYear);
                            var prevYearMonthMap = this.monthToMap(prevYearMonth); 
                            if(prevYearMonthMap[weekIndex] && prevYearMonthMap[weekIndex][dayIndex] && prevYearMonthMap[weekIndex][dayIndex].day){
                                day = parseInt(prevYearMonthMap[weekIndex][dayIndex].day);
                            }
                            else {
                                prevYearMonthMap.find((elem,wIndex) => {
                                    elem.find((ele,dIndex) => {
                                        if(ele.day && !ele.disabled){
                                            weekIndex = wIndex;
                                            dayIndex = dIndex;
                                            if(day < 15){
                                                isValid = true;
                                            }
                                        }
                                        return isValid;
                                    })
                                    return isValid;
                                });
                                day = parseInt(prevYearMonthMap[weekIndex][dayIndex].day);
                            }
                            this.prepareMonth(this._activeMonth, this._activeYear);
                            newDate = new Date(Date.UTC(data.year, data.month, day));
                        }
                        else {
                            this._activeMonth = this._activeMonth - 1;
                            var prevMonth = this.__prepareMonth(this._activeMonth, this._activeYear);
                            var prevMonthMap = this.monthToMap(prevMonth); 
                            if(prevMonthMap[weekIndex] && prevMonthMap[weekIndex][dayIndex] && prevMonthMap[weekIndex][dayIndex].day){
                                day = parseInt(prevMonthMap[weekIndex][dayIndex].day);
                            }
                            else {
                                prevMonthMap.find((elem,wIndex) => {
                                    elem.find((ele,dIndex) => {
                                        if(ele.day && !ele.disabled){
                                            weekIndex = wIndex;
                                            dayIndex = dIndex;
                                            if(day < 15){
                                                isValid = true;
                                            }
                                        }
                                        return isValid;
                                    })
                                    return isValid;
                                });
                                day = parseInt(prevMonthMap[weekIndex][dayIndex].day);
                            }
                            this.prepareMonth(this._activeMonth, this._activeYear);
                            newDate = new Date(Date.UTC(data.year, data.month, day));
                        }
                    }
                    //On press of pageDown if there is no same day in next month then goto day nearer in that month.
                    else if(e.code === 'PageDown'){
                        currentSelection.blur();
                        //On press of shift + pageDown goto the same day of next year 
                        if(e.shiftKey){
                            this._activeYear = this._activeYear + 1;
                            var nextYearMonth = this.__prepareMonth(this._activeMonth, this._activeYear);
                            var nextYearMonthMap = this.monthToMap(nextYearMonth); 
                            if(nextYearMonthMap[weekIndex] && nextYearMonthMap[weekIndex][dayIndex] && nextYearMonthMap[weekIndex][dayIndex].day){
                                day = parseInt(nextYearMonthMap[weekIndex][dayIndex].day);
                            }
                            else {
                                nextYearMonthMap.find((elem,wIndex) => {
                                    elem.find((ele,dIndex) => {
                                        if(ele.day && !ele.disabled){
                                            weekIndex = wIndex;
                                            dayIndex = dIndex;
                                            if(day < 15){
                                                isValid = true;
                                            }
                                        }
                                        return isValid;
                                    })
                                    return isValid;
                                });
                                day = parseInt(nextYearMonthMap[weekIndex][dayIndex].day);
                            }
                            this.prepareMonth(this._activeMonth, this._activeYear);
                            newDate = new Date(Date.UTC(data.year, data.month, day));
                        }
                        else {
                            this._activeMonth = this._activeMonth + 1;
                            var nextMonth = this.__prepareMonth(this._activeMonth, this._activeYear);
                            var nextMonthMap = this.monthToMap(nextMonth); 
                            if(nextMonthMap[weekIndex] && nextMonthMap[weekIndex][dayIndex] && nextMonthMap[weekIndex][dayIndex].day){
                                day = parseInt(nextMonthMap[weekIndex][dayIndex].day);
                            }
                            else {
                                nextMonthMap.find((elem,wIndex) => {
                                    elem.find((ele,dIndex) => {
                                        if(ele.day && !ele.disabled){
                                            weekIndex = wIndex;
                                            dayIndex = dIndex;
                                            if(day < 15){
                                                isValid = true;
                                            }
                                        }
                                        return isValid;
                                    })
                                    return isValid;
                                });
                                day = parseInt(nextMonthMap[weekIndex][dayIndex].day);
                            }
                            this.prepareMonth(this._activeMonth, this._activeYear);
                            newDate = new Date(Date.UTC(data.year, data.month, day));
                        }
                    }
                    var tryCount = 15;
                    //on ArrowRight,ArrowDown,End,PageDown, if date is disabled or holiday then goto next available date
                    while (this._isDateDisabled(newDate) && tryCount > 0) {
                        if (e.code === 'ArrowRight' || e.code === 'ArrowDown' || e.code === 'End' || e.code ==='PageDown') {
                            newDate.setUTCDate(newDate.getUTCDate() + 1);
                        }
                         //on ArrowLeft,ArrowUp,Home,PageUp, if date is disabled or holiday then goto previous available date
                        else {
                            newDate.setUTCDate(newDate.getUTCDate() - 1);
                        }
                        tryCount--;
                    }
                    if (!this._isDateDisabled(newDate)) {
                        this.set('value', newDate);
                        this.fire('selection-changed', this.getDetails(newDate));
                        e.preventDefault();
                    }
                }
            }
        } else if (this.month && (e.code === 'ArrowRight')) {
            this.set('value', new Date(Date.UTC(this.month.year, this.month.number, 1)));
            this.fire('selection-changed', this.getDetails(this.value));
            e.preventDefault();
        }
        this.async(function(){
            currentSelection = targetDiv.querySelector('div.day.selected');
            currentSelection && currentSelection.focus();
        },300);
    }

    /**
     * Prepares the internationalized dates list
     * @param {locale} l 
     * @param {*} s 
     * @param {*} d 
     */
    _settingsChanged(l, s, d) { // eslint-disable-line no-unused-vars
        if (!this.locale) return;
        this.intl = OeDatepicker.intls(this.locale);
        if (!this.intl) return;

        // collect 3-char weekday names in _weekDayNames array
        var weekDayNames = this.intl.weekDayNames.slice(0);
        for (var i = 0; i < this.startOfWeek; i++) {
            weekDayNames.push(weekDayNames.shift());
        }
        var weekDayNamesLong = this.intl.weekDayNamesLong.slice(0);
        for (var i = 0; i < this.startOfWeek; i++) {
            weekDayNamesLong.push(weekDayNamesLong.shift());
        }
        this.set('_weekDayNames', weekDayNames);
        this.set('_weekDayNamesLong',weekDayNamesLong);

        this.set('_monthNames', this.intl.monthNames);
        this.prepareMonth(this._activeMonth, this._activeYear);
    }

    /**
     * Creates a default setting for Internationalized date time format
     * @param {string} locale locale to create Intl
     * @return {Object} intl
     */
    static _createIntlSettings(locale) {
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
        intl.year = Intl.DateTimeFormat(locale, {
            year: 'numeric',
            timeZone: 'UTC'
        }).format;

        // collect 3-char and long weekday names in arrays
        var weekDayNames = new Array(7);
        var weekDayNamesLong = new Array(7);
        for (var i = 0; i < 7; i++) {
            var date = new Date(Date.UTC(2000, 1, i - 1, 0, 0, 0));
            weekDayNames[i] = Intl.DateTimeFormat(locale, {
                weekday: 'narrow',
                timeZone: 'UTC'
            }).format(date);
            weekDayNamesLong[i] = Intl.DateTimeFormat(locale, {
                weekday: 'long',
                timeZone: 'UTC'
            }).format(date);
        }
        intl.weekDayNames = weekDayNames;
        intl.weekDayNamesLong = weekDayNamesLong;

        var monthNames = new Array(12);
        for (var i = 0; i < 12; i++) { // eslint-disable-line no-redeclare
            var date = new Date(Date.UTC(2000, i, 1, 0, 0, 0)); // eslint-disable-line no-redeclare
            monthNames[i] = {
                name: Intl.DateTimeFormat(locale, {
                    month: 'short',
                    timeZone: 'UTC'
                }).format(date),
                longName: Intl.DateTimeFormat(locale, {
                    month: 'long',
                    timeZone: 'UTC'
                }).format(date),
                n: i
            };
        }
        intl.monthNames = monthNames;
        return intl;
    }

    static intls(locale) {
        if (!OeDatepicker._intls) {
            OeDatepicker._intls = {};
        }

        var intl = OeDatepicker._intls[locale];
        if (!intl) {
            intl = OeDatepicker._createIntlSettings(locale);
            OeDatepicker._intls[locale] = intl;
        }
        return intl;
    }
    /**
     * Constructor to initialize 'intls'
     */
    constructor() {
        super();
        this.intl = OeDatepicker.intls(navigator.language);
    }

    /**
     * Displays list of days by default on attached to DOM.
     */
    connectedCallback() {
        super.connectedCallback();
        this.set('showing', 'month');
        this._settingsChanged();

        if (!this.value && !this.disableInitialLoad) {
            this.set('value', new Date());
        } else if (this.value && typeof this.value != 'date') { // eslint-disable-line valid-typeof
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