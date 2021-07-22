import { AriaChecked } from './lib'
import { Item } from './Item'
import { Control } from './Control'
import { RadioGroup } from './RadioGroup'
import './Radio.css'

/**
 * @summary A checkable input in a group of elements with the same role,
 *  only one of which can be checked at a time.
 * @see https://www.w3.org/TR/wai-aria-1.1/#radio
 */
export class Radio extends Item
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
    this.checked = true
    this.emit('change')
  }

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyDown(event, elem) {
    super.onKeyDown(event, elem)
    if(!event.code.startsWith('Arrow')) {
      return
    }
    event.preventDefault()
    const radios = this.group.radios
    let radio = this
    do {
      if(['ArrowLeft', 'ArrowUp'].includes(event.key)) {
        radio = radios[radios.indexOf(this) - 1] || radios[radios.length - 1]
      }
      else radio = radios[radios.indexOf(this) + 1] || radios[0]
    }
    while(radio.disabled)
    if(radio !== this) {
      radio.checked = true
      radio.focus()
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
   * @param {boolean} checked
   */
  set checked(checked) {
    this.setAttr(AriaChecked, checked)
  }

  /**
   * @returns {boolean}
   */
  get checked() {
    return this.getAttr(AriaChecked) || false
  }

  /**
   * @returns {RadioGroup|*|null}
   */
  get group() {
    return this.closest(RadioGroup)
  }
}

Radio.prototype.value = null
