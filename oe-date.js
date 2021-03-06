/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { mixinBehaviors } from "@polymer/polymer/lib/legacy/class.js";
import { PaperInputBehavior } from "@polymer/paper-input/paper-input-behavior.js";
import { IronFormElementBehavior } from "@polymer/iron-form-element-behavior/iron-form-element-behavior.js";
import { OEFieldMixin } from "oe-mixins/oe-field-mixin.js";
import { OEDateMixin } from "./oe-date-mixin.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/iron-dropdown/iron-dropdown.js";
import '@polymer/polymer/lib/elements/dom-if.js';

import "oe-input/oe-input.js";
import "./oe-datepicker.js";
import "./oe-datepicker-dlg.js";



/**
 * # oe-date
 * 
 * `<oe-date>` is a control  to capture `date` data. `value` property exposes the selected date always in midnight UTC.
 * 
 * @customElement
 * @polymer
 * @appliesMixin OEFieldMixin
 * @appliesMixin OEDateMixin
 * @demo demo/demo-oe-date.html
 */
class OeDate extends mixinBehaviors([IronFormElementBehavior, PaperInputBehavior], PolymerElement) {
  static get is() { return 'oe-date'; }

  static get template() {
    return html`
      <style>
        .suffix-btn {
          color: var(--paper-input-container-color,  var(--secondary-text-color));
          padding: 0;
          margin: 0;
          min-width: 0;
          @apply --oe-date-suffix;
        }

        .vertical {
          height: 100%;
          @apply --layout-vertical;
        }

        .filler {
          @apply --layout-flex;
        }

        .horizontal {
          @apply --layout-horizontal;
          height: 46px;
        }
        .dropdown-content{
          min-height: 340px;
          min-width: 300px;
        }
        .date-button:focus{
          color: var(--paper-input-container-focus-color, --primary-color);
        }
        oe-input {
          @apply --oe-input-date;
        }
       
      </style>
      <dom-if if=[[_computeAttachDialog(dropdownMode,dialogAttached)]]>
        <template>
          <oe-datepicker-dlg value="{{value}}" id="_picker" 
              max=[[max]] min=[[min]]  start-of-week="[[startOfWeek]]" 
              disabled-days="[[disabledDays]]" holidays="[[holidays]]" 
              locale="[[locale]]" on-oe-date-picked="_datePicked"
              default-date=[[_resolveReferenceDate(referenceDate,referenceTimezone)]]></oe-datepicker-dlg>
        </template>
      </dom-if>
      <oe-input id="display" label=[[label]] required$=[[required]] readonly="[[readonly]]" disabled=[[disabled]] validator=[[validator]] no-label-float=[[noLabelFloat]]
      always-float-label="[[alwaysFloatLabel]]" invalid={{invalid}} value={{_dateValue}} error-message={{errorMessage}} error-placeholders={{errorPlaceholders}} max=[[max]] min=[[min]]>
  
        <paper-button aria-label="clear date from calendar" hidden$=[[!disableTextInput]] slot="suffix" class="suffix-btn" on-tap="_clearDate">
          <iron-icon icon="clear"></iron-icon>
        </paper-button>
        <paper-button aria-label="Select date from calendar" hidden$=[[hideIcon]] slot="suffix" class="suffix-btn date-button" disabled=[[disabled]] on-tap="_showDatePicker">
          <iron-icon icon="today"></iron-icon>
        </paper-button>
      </oe-input>

      <dom-if if=[[_computeAttachDropdown(dropdownMode,dropdownAttached)]]>
        <template>
          <iron-dropdown id="dropdown" 
          no-cancel-on-outside-click=[[openOnFocus]]
          no-animations horizontal-align="right" 
          vertical-align="{{verticalAlign}}" vertical-offset="{{verticalOffset}}"  no-auto-focus opened={{expand}}>
            <paper-card tabindex="-1" slot="dropdown-content" class="dropdown-content layout vertical" disabled$="[[disabled]]">
              <div class="vertical flex">
                <oe-datepicker tabindex="-1" disable-initial-load class="flex" id="datePicker" value="{{localValue}}" locale="[[locale]]" start-of-week="[[startOfWeek]]"
                disabled-days="[[disabledDays]]" holidays="[[holidays]]" 
                  max=[[max]] min=[[min]]
                  on-selection-double-click="_onOK"></oe-datepicker>
                <div class="horizontal">
                  <div class="filler"></div>
                  <paper-button id="cancelBtn" on-tap="_onCancel">Cancel</paper-button>
                  <paper-button id="okBtn" on-tap="_onOK">OK</paper-button>
                </div>
              </div>
            </paper-card>
          </iron-dropdown>
        </template>
      </dom-if>
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

      /**
       * vertical offset for date picker dropdown
       */
      verticalOffset: {
        type: String,
        value: 62
      },

      /**
       * vertical alignment for date picker dropdown
       */
      verticalAlign: {
        type: String,
        value: 'top'
      },

      /**
       * Setting to true makes the datepicker open as a dropdown on focus of this element.
       * This will work only if the oe-date component is in dropdown-mode.
       */
      openOnFocus: {
        type: Boolean,
        value: false
      },

      /**
       * Maximum allowed date (accepts date shorthands)
       */
      max: {
        type: Object,
        observer: '_maxChanged'
      },

      /**
       * Minimum allowed date (accepts date shorthands)
       */
      min: {
        type: Object,
        observer: '_minChanged'
      },

      /**
       * flag allows enabling/disabling the control
       */
      disabled: {
        type: Boolean,
        value: false
      },

      /**
       * Start of the week for calendar display [0(Sunday)-6(Saturday)]
       */
      startOfWeek: {
        type: Number,
        value: 1
      },

      /**
       * Weekly off days [0(Sunday)-6(Saturday)]
       */
      disabledDays: {
        type: Array
      },

      /**
       * control's validity flag
       */
      invalid: {
        type: Boolean,
        value: false, 
        notify: true,
        reflectToAttribute: true
      },

      /**
       * Fired when a date is selected by pressing the Ok button.
       *
       * @event oe-date-picked
       */

      /**
       * Fired when the value is changed by the user.
       *
       * @event oe-field-changed
       */
    };
  }

  _computeAttachDialog(dropdownMode, dialogAttached) {
    return !dropdownMode && dialogAttached;
  }

  _computeAttachDropdown(dropdownMode, dropdownAttached) {
    return dropdownMode && dropdownAttached;
  }

  constructor() {
    super();
    this._hasUserTabIndex = this.hasAttribute('tabindex');
    this.dialogAttached = false;
    this.dropdownAttached = false;
  }

  /**
  * Connected Callback to initiate 'change' listener with validation function.
  */
  connectedCallback() {
    super.connectedCallback();
    if (!this._hasUserTabIndex) {
      //Removing the tabindex=0 set by paper-input-behavior 
      //This prevents the focus from moving to the next field in FireFox
      this.removeAttribute('tabindex');
    }
    this.inputElement.addEventListener('change', e => this._displayChanged(e));
    this.$.display.addEventListener('focus', e => this._focusHandle(e));
    this.addEventListener('blur', e => this._blurHandle(e));
    //if value is set instead of date-value, trigger parsing of init-value
    if (!this.value && this.init) {
      this.$.display.set('value', this.init);
      this.$.display.inputElement.fire('change');
    }
    this.set('expand', false);
    //this.set('localValue', new Date());
    if (this.max && typeof this.max === 'string') {
      var newDate = this._parseShorthand(this.max);
      if (newDate) {
        this.set('max', newDate);
      } else {
        console.warn("Invalid 'max' date value", this.max);
      }
    }
    if (this.min && typeof this.max === 'string') {
      var newDate = this._parseShorthand(this.min); // eslint-disable-line no-redeclare
      if (newDate) {
        this.set('min', newDate);
      } else {
        console.warn("Invalid 'min' date value", this.min);
      }
    }
    if (!this.dropdownMode && this.openOnFocus) {
      console.warn("open-on-focus is only available in dropdown-mode.");
    }

    /** oe-input.Iron-Input.inputElement remains undefined 
     * (looks like _initSlottedInput only for subsequent dom-change) 
    */
    this.inputElement._initSlottedInput();

  }
  _forwardFocus(e) {
    this.$.display.focus();
  }


  _focusHandle(e) { // eslint-disable-line no-unused-vars
    if (this.openOnFocus && this.dropdownMode && !this.expand) {
      this.__expandDropDown();
    }
  }


  _blurHandle(e) { // eslint-disable-line no-unused-vars
    if (this.openOnFocus && this.dropdownMode) {
      this.set('expand', false);
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
   * Returns a reference to the input element.
   */
  get inputElement() {
    return this.$.display.inputElement;
  }

  /**
   * Launches date-picker as dialog or a dropdown
   * 
   */
  _showDatePicker(e) { // eslint-disable-line no-unused-vars
    if (!this.readonly && !this.disabled) {
      if (this.dropdownMode) {
        if (!this.expand && !this.openOnFocus) {
          this.__expandDropDown();
        }
      } else {
        if (!this.dialogAttached) {
          this.set('dialogAttached', true);
          this.async(function () {
            this.$$('#_picker').open();
          }.bind(this), 0);
        } else {
          this.$$('#_picker').open();
        }
      }
    }
  }

  __expandDropDown() {
    if (!this.dropdownAttached) {
      this.set('dropdownAttached', true);
      this.async(function () {
        this.set('expand', true);
        this.set('localValue', this.value || this._resolveReferenceDate(this.referenceDate, this.referenceTimezone));
      }.bind(this), 0);
    } else {
      this.set('expand', true);
      this.set('localValue', this.value || this._resolveReferenceDate(this.referenceDate, this.referenceTimezone));
    }
  }

  /**
   * Called when date is selected using dialog
   */
  _datePicked(e) { // eslint-disable-line no-unused-vars
    if(this.fieldId) {
      this.fire('oe-field-changed', {fieldId: this.fieldId, value: e.detail});      
    }
  }

  // /**
  //  * Selects the icon to display inside the oe-date input
  //  * @param {boolean} dropdownMode 
  //  * @return {string} icon for dropdown or calendar
  //  */
  // _computeIcon(dropdownMode) {
  //   return dropdownMode ? "arrow-drop-down" : "today";
  // }

  /**
   * Sets the selected value and closes the dropdown
   */
  _onOK() {
    this.set('value', this.localValue);
    this.fire('oe-date-picked', this.value);
    this.set('expand', false);
    if(this.fieldId) {
      this.fire('oe-field-changed', {fieldId: this.fieldId, value: this.value});      
    }
  }

  /**
   * Closes the dropdown
   */
  _onCancel() {
    //this.set('localValue', this.value);
    this.set('expand', false);
  }

  /**
   * Parses the shorthand for "max" and validates the value.
   * @param {Object} newMax 
   */
  _maxChanged(newMax) {
    if (newMax && typeof newMax === 'string') {
      var newDate = this._parseShorthand(newMax);
      if (newDate) {
        this.set('max', newDate);
        this.value && this.validate();
      } else {
        console.warn("Invalid 'max' date value", this.max);
      }
    }
  }

  /**
   * Parses the shorthand for "min" and validates the value.
   * @param {Object} newMin 
   */
  _minChanged(newMin) {
    if (newMin && typeof newMin === 'string') {
      var newDate = this._parseShorthand(newMin);
      if (newDate) {
        this.set('min', newDate);
        this.value && this.validate();
      } else {
        console.warn("Invalid 'min' date value", this.max);
      }
    }
  }


}

window.customElements.define(OeDate.is, OEDateMixin(OEFieldMixin(OeDate)));