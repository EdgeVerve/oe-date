/**
 * @license
 * ©2018-2019 EdgeVerve Systems Limited (a fully owned Infosys subsidiary),
 * Bangalore, India. All Rights Reserved.
 */

import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { LegacyElementMixin } from "@polymer/polymer/lib/legacy/legacy-element-mixin.js";
import "@polymer/paper-dialog/paper-dialog.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/iron-flex-layout/iron-flex-layout.js";
import "@polymer/paper-ripple/paper-ripple.js";
import "./oe-datepicker.js";
import "oe-i18n-msg/oe-i18n-msg.js";

/**
 * # oe-datepicker-dlg
 * 
 * `<oe-datepicker-dlg>` is a control used in oe-date to display the date-picker in a dialog box.
 * Raises event `oe-date-picked` when date is selected.
 * 
 * @customElement
 * @polymer
 * 
 */
class OeDatepickerDlg extends LegacyElementMixin(PolymerElement) {
  static get is() { return 'oe-datepicker-dlg'; }

  static get template() {
    return html`
      <style>
        :host {
          --dpg-header-text: var(--primary-background-color);
          --dpg-default-background: var(--primary-background-color);
          --dpg-header-background: var(--default-primary-color);
          --dpg-dark-background: var(--dark-primary-color);
        }
  
        #dialog div.container {
          margin: 0;
          padding: 0;
          background-color: var(--dpg-default-background);
        }
  
        #dialog:host > ::content > *:first-child {
          margin-top: 0;
        }
  
        .vertical {
          @apply --layout-vertical;
        }
  
        .filler {
          @apply --layout-flex;
        }
  
        .horizontal {
          @apply --layout-horizontal;
        }
  
        .header {
          background-color: var(--dpg-header-background);
          color: var(--dpg-header-text);
  
          @apply --layout-vertical;
          @apply --layout-center;
        }
  
        .dayOfWeekContainer {
          width: 100%;
          padding-top: 8px;
          padding-bottom: 8px;
          background-color: var(--dpg-dark-background);
          text-align: center;
          font-size: 18px;
          min-height: 18px;
          font-weight: 300;
        }
  
        .dayOfMonthContainer {
          padding-left: 10px;
          line-height:normal;
          padding-right: 10px;
          font-size: 89px;
          min-height: 89px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
  
        .monthContainer,
        .yearContainer {
          text-transform: none;
          padding: 0;
          font-size: 24px;
          align-items: center;
          justify-content: center;
          min-height: 24px;
        }
  
        .monthContainer {
          padding-top: 10px;
          font-weight: 300;
        }
  
        .yearContainer {
          font-weight: 400;
        }
  
        @media (max-width: 600px) {
          .header {
            display: none !important;
          }
          #dialog {
            min-width: 300px;
          };
        }
  
        @media (min-width: 601px) {
          
            #dialog {
              min-width: 435px;
            };
        }
      </style>
      <paper-dialog aria-modal="true" modal id="dialog" on-keydown="_handleEscape" on-iron-overlay-opened="patchOverlay">
        <div class="container layout horizontal no-padding">
          <div class="header layout vertical">
            <div class="dayOfWeekContainer" id="day"><span>{{day}}</span></div>
            <div class="dayOfMonthContainer flex" id="date" on-tap="_showMonth">
              <paper-ripple></paper-ripple>
              <span>{{date}}</span>
            </div>
            <div class="layout vertical flex">
              <paper-button aria-label$="{{longMonth}}" class="monthContainer" id="month" on-tap="_showYear">{{month}}</paper-button>
              <paper-button class="yearContainer" id="year" on-tap="_showDecade">{{year}}</paper-button>
            </div>
          </div>
          <div class="layout flex">
            <div class="layout vertical flex">
              <oe-datepicker disable-initial-load id="datePicker" value={{localValue}} locale="[[locale]]" start-of-week="[[startOfWeek]]" disabled-days="[[disabledDays]]" holidays="[[holidays]]" 
                max=[[max]] min=[[min]]
                on-selection-changed="_refreshDetails"
                on-selection-double-click="_selectionConfirmed"
                ></oe-datepicker>
              <div class="layout horizontal">
                <div class="filler"></div>
                <paper-button id="cancelBtn" dialog-dismiss on-tap="_onCancel">
                    <oe-i18n-msg msgid="cancel">Cancel</oe-i18n-msg>
                </paper-button>
                <paper-button id="okBtn" dialog-confirm on-tap="_onOK">
                    <oe-i18n-msg msgid="ok">OK</oe-i18n-msg>
                </paper-button>
              </div>
            </div>
          </div>
        </div>
      </paper-dialog>
    `;
  }

  static get properties() {
    return {

      value: {
        type: Date,
        notify: true
      },

      /**
       * Denotes the day to be used as the start of week
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
       * Array of days of the week to set as disabled.
       * Example [5,6] to set 5th and 6th day of week as disabled.
       */
      disabledDays: {
        type: Array
      },
      /**
       *  List of dates that should be disabled for selection,
       *  Should be Date objects or date strings in 'MM-DD-YYYY' format
       */
      holidays: {
        type: Array
      },
      /**
       * Maximum selectable date
       */
      max: Date,

      /**
       * Minimum selectable date
       */
      min: Date

      /**
       * Occurs when a date is selected by pressing the Ok button.
       *
       * @event oe-date-picked
       */
    };
  }

  /**
   * Opens the dialog box by setting the value aor current Date in UTC
   */
  open() {
    if (this.value) {
      this.set('localValue', this.value);
    } else {
      var now = new Date();
      now = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
      if (now > this.max) {
        now = this.max;
      } else if (now < this.min) {
        now = this.min;
      }
      this.set('localValue', now );
    }
    this._refreshDetails({
      detail: this.$.datePicker.getDetails(this.localValue)
    });
    this.$.dialog.open();
  }

  /**
   * Displays all the days of the selected month
   */
  _showMonth() {
    this.$.datePicker.set('showing', 'month');
  }

  /**
   * Displays all the months of the selected year
   */
  _showYear() {
    this.$.datePicker._showYear();
  }

  /**
   * Displays all the years of the selected decade.
   */
  _showDecade() {
    this.$.datePicker._showDecade();
  }

  /**
   * Refreshes the display with date from the event.
   * @param {Event} e 
   */
  _refreshDetails(e) {
    this.set('day', e.detail.day);
    this.set('date', new Intl.NumberFormat(this.locale, {
      minimumIntegerDigits: 2
    }).format(e.detail.date));
    this.set('longMonth', e.detail.longMonth);
    this.set('month', e.detail.month);
    this.set('year', e.detail.year);
  }

  /**
   * Listener to double-click of a date in datepicker.
   * Sets day,month,year and 'value'.
   * @param {Event} e 
   */
  _selectionConfirmed(e) {
    this._refreshDetails(e);
    this._onOK();
  }

  /**
   * Sets the selected value and closes the dialog.
   */
  _onOK() {
    this.set('value', this.localValue);
    this.fire('oe-date-picked', this.value);
    this.$.dialog.close();
  }

  /**
   * Closes the dialog box
   */
  _onCancel() {
    this.set('localValue', this.value);
    this.$.dialog.close();
  }
  _handleEscape(e){
    if(e.key === 'Escape' || e.keyCode === 27){
      this._onCancel();
    }
  }

  /**
   * Pactch to move the backdrop behind the dialog box.
   * @param {Event} e 
   */
  patchOverlay(e) {
    if (e.target.withBackdrop) {
      e.target.parentNode.insertBefore(e.target._backdrop || e.target.backdropElement, e.target);
    }
  }
}

window.customElements.define(OeDatepickerDlg.is, OeDatepickerDlg);