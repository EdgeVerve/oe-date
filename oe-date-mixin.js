/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */
import {
  dedupingMixin
} from "@polymer/polymer/lib/utils/mixin.js";
import "oe-utils/date-utils.js";
import "oe-utils/oe-utils.js";

var OEUtils = window.OEUtils || {};
/**
 * `OEDateMixin`
 * This is the Mixin that takes care of default validation of oe-ui input components
 * 
 * @polymer
 * @mixinFunction
 */
const DateMixin = function (BaseClass) {
  let errorDate = new Date("error");
  /**
   * @polymer
   * @mixinClass
   */
  return class extends BaseClass {

    static get properties() {
      return {
        /**
         * Property to be binded for the value
         */
        value: {
          type: Date,
          notify: true,
          observer: '_valueChanged'
        },

        /**
         * String to specify the format in which the data needs to be displayed in the input.
         */
        format: {
          type: String,
          value: 'DD MMM YYYY',
          observer: '_formattingChanged'
        },
        /**
         *  List of dates that should be disabled for selection,
         *  Should be Date objects or date strings in 'MM-DD-YYYY' format
         */
        holidays: {
          type: Array
        },
        /**
         * Weekly offs expressed as [0-6]
         *
         * @attribute disabledDays
         * @type Array
         */
        disabledDays: {
          type: Array
        },

        /**
         * Locale to be used by oe-date-picker
         */
        locale: {
          type: String,
          value: navigator.language
        },

        /**
         * Prevent manual entry of date value
         */
        disableTextInput: {
          type: Boolean,
          value: false,
          observer: '__disableInput'
        },
        /**
         * reference for date calculation is `today` in user's TZ (represented as UTC00:00).
         *    i.e. At 02:30 AM IST on 5th-Nov-2019. 
         *    The reference date would be 2019-11-05 00:00:00Z
         * At the same moment, person sitting in PST (GMT -7:00) sees 
         *    current date and time as 2019-11-04 14:00 PM.
         *    For her the reference date would be 2019-11-04 00:00:00Z
         *
         * If `referenceTimezone` is specified
         *    Reference date is current-date in reference-TZ (with time set to UTC00:00)
         *    i.e. setting referenceTimezone = -420 (minutes) means 
         *    users in anytimezone will see the reference date to be (2019-11-04 00:00:00Z)
         * Default value `OEUtils.componentDefaults["oe-date"].referenceTimezone`
         */
        referenceTimezone: {
          type: Number,
          value: function () {
            var OEUtils = window.OEUtils || {};
            OEUtils.componentDefaults = OEUtils.componentDefaults || {};
            let oeDateDefaults = OEUtils.componentDefaults[this.tagName.toLowerCase()] || {};
            return oeDateDefaults.referenceTimezone;
          }
        },
        /**
         * Reference for date calculation. Defaults to global component-defaults.
         * If no global defaults are provided, current 'date' in user's timezone
         * adjusted to `referenceTimezone` (if specified) is used.
         */
        referenceDate: {
          type: Object,
          value: function () {
            var OEUtils = window.OEUtils || {};
            OEUtils.componentDefaults = OEUtils.componentDefaults || {};
            let oeDateDefaults = OEUtils.componentDefaults[this.tagName.toLowerCase()] || {};
            return oeDateDefaults.referenceDate;
          }
        }

      };
    }

    connectedCallback() {
      super.connectedCallback();
      this.addEventListener('iron-overlay-opened', e => this._handleOverlayOpen(e));
      this.addEventListener('iron-overlay-closed', e => this._handleOverlayClose(e));
    }

    /**
     * Set oe-input to readonly on disableTextInput flag
     */
    __disableInput() {
      if (!this.readonly && this.disableTextInput) {
        this.$.display.set('readonly', true);
      }
    }

    /**
     * When overlay is opened set the oe-input to readonly and disabled to
     * prevent the Mobile keyboard from launching
     */
    _handleOverlayOpen() {
      if (this.dropdownMode) {
        return;
      }
      this.$.display.set('readonly', true);
      this.$.display.set('disabled', true);
    }

    /**
     * When overlay is closed reset back to original settings
     */
    _handleOverlayClose() {
      if (this.dropdownMode) {
        return;
      }
      this.$.display.set('readonly', this.readonly);
      this.$.display.set('disabled', this.disabled);
      this.__disableInput();
    }

    /**
     * Clear the date value entered 
     */
    _clearDate() {
      this.value = undefined;
      this.display = '';
    }

    /**
     * Observer on 'format' property to update the display based on the format.
     * @param {string} newFormat 
     * @param {string} oldFormat 
     */
    _formattingChanged(newFormat, oldFormat) { //eslint-disable-line no-unused-vars
      //Setting it to a variable so each component can bind it differently
      this.set('_dateValue', this._format(this.value));
    }

    /**
     * Converts the user shortHand inputs to Date values.
     * computes values for 'today' , 3y , -7M etc.
     * @param {string} input input shortHand string
     * @return {Date} parsed Date value
     */
    _parseShorthand(input) {
      if (!input || input.trim().length === 0) {
        return undefined;
      }
      var tuInput = input.trim().toUpperCase();

      var retDate;

      var mDate = this._resolveReferenceDate(this.referenceDate, this.referenceTimezone);

      if (tuInput === 'T' || tuInput === 'TOD' || tuInput === 'TODAY') {
        retDate = mDate;
      } else if (tuInput == 'TOM') {
        retDate = mDate.setUTCDate(mDate.getUTCDate() + 1);
      } else if (tuInput[tuInput.length - 1] === 'D') {
        retDate = this._calcDate(mDate, tuInput, 'days');
      } else if (tuInput[tuInput.length - 1] === 'W') {
        retDate = this._calcDate(mDate, tuInput, 'weeks');
      } else if (tuInput[tuInput.length - 1] === 'M') {
        retDate = this._calcDate(mDate, tuInput, 'months');
      } else if (tuInput[tuInput.length - 1] === 'Q') {
        retDate = this._calcDate(mDate, tuInput, 'quarters');
      } else if (tuInput[tuInput.length - 1] === 'Y') {
        retDate = this._calcDate(mDate, tuInput, 'years');
      } else {
        retDate = OEUtils.DateUtils.parse(tuInput, this.format);
      }

      return retDate;
    }


    /**
     * Parses the input string into a float after validation
     * @param {string} input 
     * @return {Float|undefined} parsed float value or undefined if the input cannot be parsed. 
     */
    _parseDecimal(input) {
      if (!input || input.length === 0) {
        return undefined;
      }
      var tmp = input;

      var isInvalid = tmp.split('.').length > 2 || tmp.lastIndexOf('+') > 0 || tmp.lastIndexOf('-') > 0 || tmp.replace( /* eslint-disable no-useless-escape */
        /[\+\-0-9\.]/g, '').length > 0;
      if (isInvalid) {
        return undefined;
      }
      return parseFloat(tmp);
    }

    /**
     * Computes a date based on given parameters.
     * converts a date , 1 ,'year' to return a new Date which is date+1year.
     * @param {Date} mDate input Date
     * @param {string} tuInput variation value
     * @param {string} type variation type
     * @return {Date} computed date
     */
    _calcDate(mDate, tuInput, type) {
      var retDate;
      var topup = tuInput.length === 1 ? 1 : this._parseDecimal(tuInput.slice(0, tuInput.length - 1));
      if (!isNaN(topup)) {
        retDate = new Date(mDate.getTime());
        switch (type) {
          case 'days':
            var newDay = retDate.getUTCDate() + topup;
            retDate.setUTCDate(newDay);
            break;

          case 'weeks':
            var newDay = retDate.getUTCDate() + 7 * topup; //eslint-disable-line no-redeclare
            retDate.setUTCDate(newDay);
            break;

          case 'months':
            var newMonth = retDate.getUTCMonth() + topup;
            retDate.setUTCMonth(newMonth);
            break;

          case 'quarters':
            var newMonth = retDate.getUTCMonth() + 3 * topup; //eslint-disable-line no-redeclare
            retDate.setUTCMonth(newMonth);
            break;

          case 'years':
            var newyear = retDate.getUTCFullYear() + topup;
            retDate.setUTCFullYear(newyear);
            break;

          default:
            break;
        }
      }
      return retDate;
    }

    /**
     * Formats the input Date and returns a formatted string
     * @param {Date} dateVal Date to format.
     * @return {string} formatted date string
     */
    _format(dateVal) {
      var retVal = '';
      if (dateVal) {
        retVal = OEUtils.DateUtils.format(dateVal, this.format, this.locale);
      }
      return retVal;
    }

    /**
     * Observer on value property.
     * @param {Date} newValue 
     * @param {Date} oldValue 
     */
    _valueChanged(newValue, oldValue) { //eslint-disable-line no-unused-vars

      if (typeof super._valueChanged == "function") {
        super._valueChanged(newValue, oldValue);
        return;
      }

      if (newValue && !(newValue instanceof Date)) {
        var v = new Date(newValue);
        this.value = v;
        return;
      }

      if ((newValue instanceof Date) && !isNaN(newValue.getTime())) {
        this._dateValue = this._format(newValue);
        this.validate();
      } else if (newValue === undefined || newValue === null) {
        this._dateValue = '';
        this.validate();
      }
    }

    /**
     * Event listener for changes to input
     * @param {Event} evt 
     */
    _displayChanged(evt) { //eslint-disable-line no-unused-vars
      evt.stopImmediatePropagation();
      evt.stopPropagation();
      if (typeof super._displayChanged == "function") {
        super._displayChanged(evt);
        return;
      }
      var newstr = this._dateValue;
      var newDate;

      newstr = newstr.trim();
      if (newstr !== '') {
        newDate = this._parseShorthand(newstr);
        if (!newDate) {
          this.value = errorDate;
          this.setValidity(false, 'dateFormat');
          return;
        }
        this.set('value', newDate);
        this._dateValue = this._format(newDate);
      } else {
        this.value = undefined;
        this._dateValue = '';
        /*Retain the original entered text*/
        this._dateValue = newstr;
      }
      if (this.fieldId) {
        this.fire('oe-field-changed', {
          fieldId: this.fieldId,
          value: this.value
        });
      }
    }

    _resolveReferenceDate(refDate, refTZ){
      let rDate;
      
      if(refDate && typeof refDate.getTime === 'function'){
        rDate = refDate;
      } else {
        // If referenceDate is NOT specified,
        // reference for date calculation is today in user's TZ (represented as UTC00:00).
        // i.e. At 02:30 AM IST on 5th-Nov-2019. 
        //      The reference date is 2019-11-05 00:00:00Z
        // At the same moment, person sitting in PST (GMT -7:00) sees 
        //      current date and time as 2019-11-04 14:00 PM.
        //      For her the reference date would be 2019-11-04 00:00:00Z
        // 
        // If referenceTimezone is specified
        //      Reference date is current-date in biz-TZ (with time set to UTC00:00)
        //      i.e. setting referenceTimezone = -420 (minutes) means 
        //      users in anytimezone will see the reference date to be (2019-11-04 00:00:00Z)
        rDate = new Date();
    
        /* If reference timezone offset is specified, arrive date in that timezone */
        if(typeof refTZ === 'number') {
          rDate.setMinutes(rDate.getMinutes() + (refTZ +((new Date()).getTimezoneOffset())));
        }
      }
      rDate = new Date(Date.UTC(rDate.getFullYear(), rDate.getMonth(), rDate.getDate()));
      return rDate;
    }

    /**
     * Custom validation to check if entered values is not a
     * disabled day or a holiday.
     * @return {boolean} validity
     */
    _validate() {
      if (!this.value) {
        if (this._dateValue) {
          this.setValidity(false, 'dateFormat');
          return false;
        }
        return true;
      }
      if (this.holidays && this.holidays.length > 0) {
        var selectedDate = this.value;
        var inValid = this.holidays.find(function (h) {
          var d = h;
          if (typeof h !== Date) {
            d = new Date(h);
          }
          return (d.toDateString() === selectedDate.toDateString());
        });
        if (inValid) {
          this.setValidity(false, 'dateIsHoliday');
          return false;
        }
      }
      if (this.disabledDays && this.disabledDays.length > 0) {
        var selectedDay = this.value.getUTCDay();
        if (this.disabledDays.indexOf(selectedDay) !== -1) {
          this.setValidity(false, 'dateIsHoliday');
          return false;
        }
      }
      if (this.max && this.value > this.max) {
        this.setValidity(false, 'rangeOverflow');
        return false;
      }
      if (this.min && this.value < this.min) {
        this.setValidity(false, 'rangeUnderflow');
        return false;
      }
      return true;
    }
  };
};

export const OEDateMixin = dedupingMixin(DateMixin);