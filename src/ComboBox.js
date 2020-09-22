import { AriaAutoComplete, AriaExpanded, AriaReadOnly, AriaRequired } from './lib'
import { Popup } from './Popup'
import { Widget } from './Widget'

export class ComboBox extends Widget
{
  /**
   * Activate widget
   */
  activate() {
    this.expanded = !this.expanded
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Enter(event) {
    event.stopPropagation()
    this.activate()
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Escape(event) {
    if(this.expanded) {
      event.stopPropagation()
      this.expanded = false
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Space(event) {
    event.preventDefault()
    this.class.active = true
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyUp_Space(event) {
    this.class.active = false
    this.click()
  }

  /**
   * @param {MutationRecord} record
   */
  onPopupHidden(record) {
    this.expanded = !this.popup.hidden
  }

  /**
   * @returns {string}
   */
  get autoComplete() {
    return this.getAttr(AriaAutoComplete)
  }

  /**
   * @param {string} autoComplete
   */
  set autoComplete(autoComplete) {
    this.setAttr(AriaAutoComplete, autoComplete)
  }

  /**
   * @param {*} controls
   */
  set controls(controls) {
    const oldPopup = this.popup
    super.controls = controls
    const newPopup = this.popup
    if(oldPopup !== newPopup) {
      oldPopup && oldPopup.destroy()
      newPopup && newPopup.addAttrObserver('hidden', this.onPopupHidden, this)
    }
  }

  /**
   * @returns {*[]}
   */
  get controls() {
    return super.controls
  }

  /**
   * @returns {boolean}
   */
  get expanded() {
    return this.getAttr(AriaExpanded) || false
  }

  /**
   * @param {boolean} expanded
   */
  set expanded(expanded) {
    if(expanded === this.expanded) {
      return
    }
    if(this.hasPopup) {
      const popup = this.popup
      if(popup) {
        expanded? popup.show() : popup.close()
      }
    }
    this.setAttr(AriaExpanded, expanded)
  }

  /**
   * @returns {string}
   */
  get hasPopup() {
    return super.hasPopup || 'listbox'
  }

  /**
   * @param {string} hasPopup
   */
  set hasPopup(hasPopup) {
    super.hasPopup = hasPopup
  }

  /**
   * @returns {Popup|null}
   */
  get popup() {
    return this.controls.find(elem => elem instanceof Popup) || null
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(AriaReadOnly)
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(AriaReadOnly, readOnly)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(AriaRequired)
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(AriaRequired, required)
  }
}

ComboBox.Popup = Popup
