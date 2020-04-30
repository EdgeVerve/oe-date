/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import { IronValidatableBehavior } from "@polymer/iron-validatable-behavior/iron-validatable-behavior.js";
import { OETimeMixin } from "./oe-time-mixin.js";
import "@polymer/iron-input/iron-input.js";
import "@polymer/iron-flex-layout/iron-flex-layout.js";
import "@polymer/paper-input/paper-input-container.js";
import "@polymer/paper-styles/default-theme.js";
import "@polymer/paper-styles/typography.js";
import "@polymer/paper-button/paper-button.js";


/**
 * # oe-time
 * 
 * `<oe-time>` is a control  to capture `time` data.
 * 
 * @customElement
 * @polymer
 * @appliesMixin OETimeMixin
 */
class OeTime extends mixinBehaviors([IronValidatableBehavior], PolymerElement) {
    static get is() { return 'oe-time'; }

    static get template() {
        return html`
        <style>
                span {
                    text-align: center;
                    padding-top: 2px;
                    @apply --paper-input-container-font;
                }

                input[is="iron-input"] {
                    position: relative;
                    /* to make a stacking context */
                    outline: none;
                    box-shadow: none;
                    padding: 0;
                    width: 100%;
                    background: transparent;
                    border: none;
                    color: var(--paper-input-container-input-color, --primary-text-color);
                    text-align: center;

                    @apply --layout-flex;
                    @apply --paper-font-subhead;
                    @apply --paper-input-container-input;
                }

                .container {
                    @apply --layout-horizontal;
                }

                .date-button {
                    color: var(--secondary-text-color);
                    padding: 0;
                    margin: 0;
                    min-width: 0;
                }

        </style>
        <span aria-hidden id="hourLabel" hidden>Hour</span>
        <span aria-hidden id="minuteLabel" hidden>Minute</span>
        <paper-input-container id="container" no-label-float="[[noLabelFloat]]" always-float-label="[[alwaysFloatLabel]]" disabled$="[[disabled]]"
          invalid="[[invalid]]">
          <div slot="input" class="container">
            <iron-input  id="hour" invalid="{{invalid}}"  bind-value="{{txtHour}}" allowed-pattern="[0-9]">
                <input aria-labelledby$="[[_computeAriaLabel(ariaLabelPrefix,'hourLabel')]]" required$="[[required]]"
                maxlength="2" value="{{txtHour}}" placeholder="HH" prevent-invalid-input autocomplete="cc-exp-month"
                type="tel" disabled$="[[disabled]]" autofocus$="[[autofocus]]" inputmode$="[[inputmode]]" readonly$="[[readonly]]">
            </iron-input>
            <span><b>:</b></span>
            <iron-input id="minute" invalid="{{invalid}}"  bind-value="{{txtMinute}}" allowed-pattern="[0-9]">
                <input aria-labelledby$="[[_computeAriaLabel(ariaLabelPrefix,'minuteLabel')]]" required$="[[required]]"
                maxlength="2" value="{{txtMinute}}" placeholder="MM" prevent-invalid-input autocomplete="cc-exp-year"
                type="tel" disabled$="[[disabled]]" inputmode$="[[inputmode]]" readonly$="[[readonly]]">
            </iron-input>
          </div>
          <paper-button class="date-button" slot="suffix" on-tap="_toggleAMPM">{{txtAMPM}}</paper-button>
        </paper-input-container>
    `;
    }

    static get properties() {
        return {

            /**
             * Set to true to mark the input as required.
             */
            required: {
                type: Boolean,
                value: false
            },

            /**
             * The hour component of the time displayed.
             */
            hour: {
                type: Number,
                notify: true
            },

            /**
             * The minute component of the time displayed.
             */
            minute: {
                type: Number,
                notify: true
            },

            txtAMPM: {
                type: String,
                value: 'AM'
            },

            ariaLabelPrefix: {
                type: String
            },

            /**
             * Set to true to disable the hour and minute input elements.
             */
            disabled: {
                type: Boolean,
                value: false
            },

            /**
             * Set to true to autofocus the month input element.
             */
            autofocus: {
                type: Boolean
            },

            /**
             * Bound to the hour and minute input elements' `inputmode` property.
             */
            inputmode: {
                type: String
            },

            /**
             * Set to true to mark the hour and minute inputs as not editable.
             */
            readonly: {
                type: Boolean,
                value: false
            },

            txtHour: {
                type: String
            },

            txtMinute: {
                type: String
            }
        };
    }

    /**
    * Connected Callback to initiate event listeners.
    */
    connectedCallback() {
        super.connectedCallback();
        this.$.hour.dataMax = 12;
        this.$.hour.dataMin = 1;
        this.$.minute.dataMax = 59;
        this.$.minute.dataMin = 0;
    }


    /**
     * Sets the AM/PM and pads the hour and minute values.
     * @param {number} newHour 
     * @param {number} newMinute 
     */
    _valuesChanged(newHour, newMinute) {
        this.$.hour.value = this._hoursDisplay(newHour);
        this.$.minute.value = this._minutesDisplay(newMinute);
    }


    /**
     * Custom validation
     */
    validate() {
        // Empty, non-required input is valid.
        if (!this.required && this.minute && this.hour == '') {
            return true;
        }
        return !this.invalid;
    }

    /**
     * Computes aria-label
     * @param {string} hourLabel 
     * @param {string} minuteLabel 
     * @return {string}
     */
    _computeAriaLabel(hourLabel, minuteLabel) {
        return hourLabel + ' ' + minuteLabel;
    }

}

window.customElements.define(OeTime.is, OETimeMixin(OeTime));