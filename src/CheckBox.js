import { AriaChecked, AriaReadOnly } from './lib'
import { Widget } from './Widget'
import { Control } from './Control'
import './CheckBox.css'

/**
 * @summary A checkable input that has three possible values: true, false, or mixed.
 * @see https://www.w3.org/TR/wai-aria-1.1/#checkbox
 */
export class CheckBox extends Widget
{
  build(init) {
    if(!Array.isArray(init.labels)) {
      init.labels = [, init.labels]
    }
    return new Control
  }

  activate() {
    if(this.readOnly) {
      return
    }
    this.checked = !this.checked
    this.emit('change')
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
   * @param {boolean|string} checked
   */
  set checked(checked) {
    this.setAttr(AriaChecked, checked)
  }

  /**
   * @returns {boolean|string}
   */
  get checked() {
    return this.getAttr(AriaChecked) || false
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
}

CheckBox.prototype.value = null
