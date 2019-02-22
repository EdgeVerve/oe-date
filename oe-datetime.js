/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import { IronFormElementBehavior } from "@polymer/iron-form-element-behavior/iron-form-element-behavior.js";
import { OEFieldMixin } from "oe-mixins/oe-field-mixin.js";
import { OETimeMixin } from "oe-mixins/oe-time-mixin.js";
import { OEDateMixin } from "oe-mixins/oe-date-mixin.js";
import "@polymer/iron-input/iron-input.js";
import "@polymer/iron-flex-layout/iron-flex-layout.js";
import "@polymer/iron-flex-layout/iron-flex-layout-classes.js";
import "@polymer/paper-input/paper-input-container.js";
import "@polymer/paper-styles/default-theme.js";
import "@polymer/paper-styles/typography.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/iron-dropdown/iron-dropdown.js";
import "@polymer/iron-icon/iron-icon.js";
import "./oe-datepicker-dlg.js";
import "oe-i18n-msg/oe-i18n-msg.js";
import "oe-utils/oe-utils.js";
import "oe-utils/date-utils.js";

/**
 * # oe-datetime
 * 
 * `<oe-datetime>` is a control to capture the date-time value.
 * 
 * @customElement
 * @polymer
 * @appliesMixin OEFieldMixin
 * @appliesMixin OETimeMixin
 * @appliesMixin OEDateMixin
 * @demo demo/demo-oe-datetime.html
 */
class OeDatetime extends mixinBehaviors([IronFormElementBehavior], PolymerElement) {
    static get is() { return 'oe-datetime'; }

    static get template() {
        return html`
        <style include="iron-flex iron-flex-alignment iron-flex-factors">
            :host {
                display: block;
            }
    
            .date-button {
                color: var(--secondary-text-color);
                padding: 0;
                margin: 0;
                min-width: 0;
            }
    
            span.required {
                vertical-align: bottom;
                color: var(--paper-input-container-invalid-color, var(--google-red-500));
                @apply --oe-required-mixin;
            }
            
            paper-input-container {
                display: inline-block;
                width: 100%;
            }
    
            input{
                @apply --paper-input-container-shared-input-style;
            }

            input::-webkit-input-placeholder {
                color: var(--paper-input-container-color, --secondary-text-color);
            }
    
            input:-moz-placeholder {
                color: var(--paper-input-container-color, --secondary-text-color);
            }
    
            input::-moz-placeholder {
                color: var(--paper-input-container-color, --secondary-text-color);
            }
    
            input:-ms-input-placeholder {
                color: var(--paper-input-container-color, --secondary-text-color);
            }
    
            #hour {
                text-align: right;
            }
    
            .filler {
                @apply --layout-flex;
            }
    
            .dropdown-content{
                min-height: 340px;
                min-width: 300px;
            }
        </style>
        <oe-datepicker-dlg value="{{dateValue}}" id="_picker" max=[[max]] min=[[min]] disabled-days="[[disabledDays]]" holidays="[[holidays]]" locale="[[locale]]"></oe-datepicker-dlg>
        <paper-input-container id="container" no-label-float="[[noLabelFloat]]" always-float-label="[[_computeAlwaysFloatLabel(alwaysFloatLabel,placeholder)]]"
            auto-validate$="[[autoValidate]]" disabled$="[[disabled]]" invalid="[[invalid]]">
            <slot name="prefix" slot="prefix"></slot>
            <label slot="label" hidden$="[[!label]]">
                <oe-i18n-msg msgid=[[label]]>[[label]]</oe-i18n-msg>
                <template is="dom-if" if={{required}}>
                    <span class="required"> *</span>
                </template>
            </label>
            <div class="layout horizontal flex center" slot="input">
                <iron-input id="display" class="flex-8" bind-value="{{_dateValue}}" invalid="{{invalid}}" allowed-pattern="[[allowedPattern]]" validator="[[validator]]">
                    <input aria-labelledby$="[[_ariaLabelledBy]]" aria-describedby$="[[_ariaDescribedBy]]" on-focus="_focusHandle"
                        disabled$="[[disabled]]"  prevent-invalid-input="[[preventInvalidInput]]"
                        type$="[[type]]" on-change="_displayChanged" pattern$="[[pattern]]" required$="[[required]]" autocomplete$="[[autocomplete]]"
                        autofocus$="[[autofocus]]" inputmode$="[[inputmode]]" minlength$="[[minlength]]" maxlength$="[[maxlength]]" min$="[[min]]"
                        max$="[[max]]" step$="[[step]]" name$="[[name]]" placeholder$="[[placeholder]]" readonly$="[[readonly]]" list$="[[list]]"
                        size$="[[size]]" autocapitalize$="[[autocapitalize]]" autocorrect$="[[autocorrect]]" tabindex$="[[tabindex]]" autosave$="[[autosave]]"
                        results$="[[results]]" accept$="[[accept]]" multiple$="[[multiple]]">
                </iron-input>
                <paper-button id="btnDatePicker" hidden$=[[hideIcon]] class="date-button" tabindex="-1" on-tap="_showDatePicker">
                    <iron-icon icon$="[[_computeIcon(dropdownMode)]]"></iron-icon>
                </paper-button>
                <span><b>/</b></span>
                <iron-input class="flex-1" id="hour" invalid="{{invalid}}"  bind-value="{{hour:change}}" allowed-pattern="[0-9]">
                    <input aria-labelledby$="[[_computeAriaLabel(ariaLabelPrefix,'hourLabel')]]" required$="[[required]]"
                        maxlength="2" value={{_hoursDisplay(hour,2)}} placeholder="HH" 
                        prevent-invalid-input type="tel" disabled$="[[disabled]]" autofocus$="[[autofocus]]" inputmode$="[[inputmode]]"
                        readonly$="[[readonly]]">
                </iron-input>
                <span><b>:</b></span>
                <iron-input class="flex-1" id="minute" invalid="{{invalid}}"  bind-value="{{minute:change}}" allowed-pattern="[0-9]">
                    <input aria-labelledby$="[[_computeAriaLabel(ariaLabelPrefix,'minuteLabel')]]"
                        required$="[[required]]" maxlength="2" value={{_minutesDisplay(minute,2)}} placeholder="MM"
                         prevent-invalid-input type="tel" disabled$="[[disabled]]" inputmode$="[[inputmode]]"
                        readonly$="[[readonly]]">
                </iron-input>
            </div>
            <paper-button id="btnAMPM" class="date-button" slot="suffix" on-tap="_toggleAMPM">{{txtAMPM}}</paper-button>
            <paper-input-error invalid={{invalid}} slot="add-on">
                <oe-i18n-msg id="i18n-error" msgid={{errorMessage}} placeholders={{placeholders}}></oe-i18n-msg>
            </paper-input-error>
        </paper-input-container>
        <iron-dropdown id="dropdown" horizontal-align="right" vertical-align="{{verticalAlign}}" vertical-offset="{{verticalOffset}}" no-auto-focus opened={{expand}}>
            <paper-card tabindex="-1" slot="dropdown-content" class="dropdown-content layout vertical" disabled$="[[disabled]]">
                <div class="layout vertical flex">
                    <oe-datepicker tabindex="-1" class="flex" id="datePicker" value="{{localValue}}" locale="[[locale]]" start-of-week="[[startOfWeek]]" disabled-days="[[disabledDays]]" holidays="[[holidays]]" 
                    max=[[max]] min=[[min]]></oe-datepicker>
                    <div class="layout horizontal">
                        <div class="filler"></div>
                        <paper-button id="cancelBtn" on-tap="_onCancel">Cancel</paper-button>
                        <paper-button id="okBtn" on-tap="_onOK">OK</paper-button>
                    </div>
                </div>
            </paper-card>
        </iron-dropdown>
    `;
    }

    static get properties() {
        return {
            /**
             *  Initial/default value for the control
             */
            init: {
                type: String
            },

            /**
             * Minimum allowed value
             */
            min: {
                type: String
            },

            /**
             * Maximum allowed value
             */
            max: {
                type: String
            },

            /**
             * The date component of time displayed.
             */
            dateValue: {
                type: Date,
                observer: '_dateValueChanged'
            },

            /**
             * The hour component of the time displayed.
             */
            hour: {
                type: Number
            },

            /**
             * The minute component of the time displayed.
             */
            minute: {
                type: Number
            },

            /**
             * currently displayed value on AM/PM toggle
             */
            txtAMPM: {
                type: String,
                value: 'AM'
            },


            value: {
                type: Object,
                notify: true,
                observer: '_valueChanged'
            },


            format: {
                type: String,
                value: 'DD MMM YYYY',
                observer: '_formattingChanged'
            },

            label: {
                type: String
            },

            ariaLabelPrefix: {
                type: String
            },

            /**
             * Setting to true hides the calender icon in the control which open the datepicker dialog
             */
            hideIcon: {
                type: Boolean,
                value: false
            },
            /**
             * Setting to true makes the datepicker open as a dropdown instead of a dialog
             */
            dropdownMode: {
                type: Boolean,
                value: false
            },
            verticalOffset: {
                type: String,
                value: 62
            },
            verticalAlign: {
                type: String,
                value: 'top'
            },
            /**
             * Setting to true makes the datepicker open as a dropdown on focus of this element.
             * This will work only if the oe-datetime component is in dropdown-mode.
             */
            openOnFocus: {
                type: Boolean,
                value: false
            }

            /**
             * Occurs when a date is selected by pressing the Ok button.
             *
             * @event oe-date-picked
             */
        };
    }

    static get observers() {
        return [
            '_computeValue(dateValue,hour,minute)'
        ];
    }

    /**
     * Checks if the min and max values are valid , then attaches event listerners.
     */
    connectedCallback() {
        super.connectedCallback();
        if (this.max) {
            var maxD = this._parseShorthand(this.max);
            if (maxD) {
                /* _parseShorthand already returns a UTC date, don't trim the time part again 
                as this will make calculated max/min western timezones (UTC -something)
                to go 1 day off.
                */
                this.set('max', maxD);
            } else {
                console.warn("Invalid 'max' date value", this.max);
            }
        }
        this.set('expand', false);
        this.set('localValue', new Date());
        if (this.min) {
            var minD = this._parseShorthand(this.min);
            if (minD) {
                /* _parseShorthand already returns a UTC date, don't trim the time part again 
                as this will make calculated max/min western timezones (UTC -something)
                to go 1 day off.
                */
                this.set('min', minD);
            } else {
                console.warn("Invalid 'min' date value", this.min);
            }
        }
        this.$._picker.addEventListener('oe-date-picked', e => this._datePicked(e));
        this.$.display.addEventListener('change', e => this._displayChanged(e));
        this.$.datePicker.addEventListener('selection-double-click', e => this._onOK(e));
    }

    /**
     * Handles opening the dropdown on focus of input based on 'openOnFocus' flag
     */
    _focusHandle() { // eslint-disable-line no-unused-vars
        if (this.openOnFocus && this.dropdownMode && !this.expand) {
            this.set('expand', true);
            this.set('localValue', this.dateValue || new Date());
        }
    }

    /**
     * Returns a reference to the focusable element. Overridden from
     * PaperInputBehavior to correctly focus the native input.
     *
     * @return {HTMLElement}
     */
    get _focusableElement() {
        return PolymerElement ? this.inputElement._inputElement :
        this.inputElement;
    }

    /**
     * Observer on value change to set the hour and minute from Date time.
     * @param {DateTime} newValue 
     * @param {DateTime} oldValue 
     */
    _valueChanged(newValue, oldValue) { // eslint-disable-line no-unused-vars
        if (newValue && !(newValue instanceof Date)) {
            var v = new Date(newValue);
            this.value = v;
            newValue = v;
        }

        if ((newValue instanceof Date) && !isNaN(newValue.getTime())) {
            this.hour = newValue.getHours();
            this.minute = newValue.getMinutes();
            this.dateValue = new Date(Date.UTC(newValue.getFullYear(), newValue.getMonth(), newValue.getDate()));
        }

        if (newValue == undefined || newValue === null) {
            this.hour = null;
            this.minute = null;
            this.dateValue = null;
        }

        this.validate();
    }

    /**
     * Computes the DateTime value for given date, hour and minute.
     * @param {Date} dVal 
     * @param {number} hVal 
     * @param {number} mVal 
     */
    _computeValue(dVal, hVal, mVal) {
        if (!(dVal instanceof Date)) {
            return;
        }
        if (hVal == null || hVal == undefined || mVal == null || mVal == undefined) {
            return;
        }

        if (!this.value || this.value.getFullYear() != dVal.getUTCFullYear() || this.value.getMonth() != dVal.getUTCMonth() ||
            this.value.getDate() != dVal.getUTCDate() || this.value.getHours() != hVal || this.value.getMinutes() !=
            mVal) {
            this.value = new Date(dVal.getUTCFullYear(), dVal.getUTCMonth(), dVal.getUTCDate(), hVal, mVal);
        }
    }


    /**
     * Validates the date selected from date-picker and sets the value
     * @param {Date} newValue 
     * @param {Date} oldValue 
     */
    _dateValueChanged(newValue, oldValue) { // eslint-disable-line no-unused-vars
        if (newValue && !(newValue instanceof Date)) {
            var v = new Date(newValue);
            this.dateValue = v;
            newValue = v;
        }

        if ((newValue instanceof Date) && !isNaN(newValue.getTime())) {
            this.set('_dateValue', this._format(newValue));
            this.validate();
        }

        if (newValue == undefined || newValue === null) {
            this.set('_dateValue', '');
            this.validate();
        }
        this.$.container._handleValue(this.$.display);
    }

    /**
     * Change event listener that parses the shorthand values given in input like 'tom' or 'today',
     * and sets the parsed DateTime on the 'value' property.
     * @param {*} e 
     */
    _displayChanged(e) { // eslint-disable-line no-unused-vars
        var el = e.currentTarget.inputElement ? e.currentTarget.inputElement : e.currentTarget;
        var newstr = el.value;
        var newDate = undefined;

        newstr = newstr.trim();
        if (newstr != '') {
            newDate = this._parseShorthand(newstr);
            if (!newDate) {
                this.dateValue = undefined;
                this.setValidity(false, 'dateFormat');
                return;
            }
            if (this.hour === undefined) {
                this.hour = 0;
            }
            if (this.minute === undefined) {
                this.minute = 0;
            }

            this.set('dateValue', newDate);
            this.set('_dateValue', this._format(newDate));
        } else {
            this.dateValue = undefined;
            this.set('_dateValue', '');
        }
        this.validate();
        this.$.container._handleValue(this.$.display);
    }

    /**
     * Displays the datepicker in dropdown or dialog-box
     * @param {Event} e 
     */
    _showDatePicker(e) { // eslint-disable-line no-unused-vars
        if (!this.readonly && !this.disabled) {
            if (this.dropdownMode) {
                if (!this.expand) {
                    this.set('expand', true);
                    this.set('localValue', this.dateValue || new Date());
                }
            } else {
                this.$._picker.open();
            }
        }
    }

    /**
     * Sets the date selected in datePicker as the date value
     * and closes the date-picker.
     */
    _onOK() {
        this.set('dateValue', this.localValue);
        this.fire('oe-date-picked', this.dateValue);
        this._datePicked();
        this.set('expand', false);
    }

    /**
     * Resets datepicker selection and closes the date-picker
     */
    _onCancel() {
        this.set('localValue', this.dateValue);
        this.set('expand', false);
    }

    /**
     * Selects the icon to display on the input.
     * @param {boolean} dropdownMode 
     * @return {string} icon name 
     */
    _computeIcon(dropdownMode) {
        return dropdownMode ? "arrow-drop-down" : "today";
    }

    /**
     * Sets the value for hour and minute once the date is selected
     * @param {Event} e 
     */
    _datePicked(e) { // eslint-disable-line no-unused-vars
        if (this.hour === undefined) {
            this.hour = 0;
        }
        if (this.minute === undefined) {
            this.minute = 0;
        }
        this.$.hour.inputElement.focus();
        this.validate();
    }

    /**
     * Returns a reference to the input element.
     */
    get inputElement() {
        return this.$.display;
    }

    /**
     * Generates new aria label be joining two input labels
     * @param {string} prefixLabel 
     * @param {string} suffixLabel 
     * @return {string} combined aria-label
     */
    _computeAriaLabel(prefixLabel, suffixLabel) {
        return prefixLabel + ' ' + suffixLabel;
    }

}

window.customElements.define(OeDatetime.is, OEFieldMixin(OEDateMixin(OETimeMixin(OeDatetime))));