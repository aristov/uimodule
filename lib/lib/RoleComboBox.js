import { AriaAutoComplete } from './AriaAutoComplete'
import { AriaExpanded } from './AriaExpanded'
import { AriaReadOnly } from './AriaReadOnly'
import { AriaRequired } from './AriaRequired'
import { RoleInput } from './RoleInput'
import { RoleTextBox } from './RoleTextBox'

/**
 * A composite widget containing a single-line textbox and another element,
 *  such as a listbox or grid, that can dynamically pop up to help the user
 *  set the value of the textbox.
 * @see https://www.w3.org/TR/wai-aria-1.1/#combobox
 */
export class RoleComboBox extends RoleInput
{
  /**
   * @param {string} autoComplete
   */
  set autoComplete(autoComplete) {
    this.setAttr(AriaAutoComplete, autoComplete)
  }

  /**
   * @returns {string}
   */
  get autoComplete() {
    return this.getAttr(AriaAutoComplete)
  }

  /**
   * @param {boolean|undefined} expanded
   */
  set expanded(expanded) {
    this.setAttr(AriaExpanded, expanded)
  }

  /**
   * @returns {boolean|undefined}
   */
  get expanded() {
    return this.getAttr(AriaExpanded) || false
  }

  /**
   * @param {string} hasPopup
   */
  set hasPopup(hasPopup) {
    super.hasPopup = hasPopup
  }

  /**
   * @returns {string}
   */
  get hasPopup() {
    return super.hasPopup || 'listbox'
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
  get readOnly() {
    return this.getAttr(AriaReadOnly)
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(AriaRequired, required)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(AriaRequired)
  }

  /**
   * @returns {RoleTextBox|*}
   */
  get textBox() {
    return this.find(RoleTextBox)
  }
}

RoleComboBox.abstract = false

export { RoleComboBox as ComboBox }
