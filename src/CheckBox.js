import { RoleCheckBox } from './lib/ariamodule'
import './CheckBox.css'

/**
 * @summary A checkable input that has three possible values: true, false, or mixed.
 * @see https://www.w3.org/TR/wai-aria-1.1/#checkbox
 */
export class CheckBox extends RoleCheckBox
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.value = null
    this.tabIndex = 0
    this.on('blur', this.onBlur)
    this.on('click', this.onClick)
    this.on('focus', this.onFocus)
    this.on('mousedown', this.onMouseDown)
  }

  /**
   * @param {FocusEvent} event
   */
  onBlur(event) {
    this.classList.remove('active')
    this.off('keydown', this.onKeyDown)
    this.off('keyup', this.onKeyUp)
  }

  /**
   * @param {MouseEvent} event
   */
  onClick(event) {
    if(this.disabled) {
      event.stopImmediatePropagation()
    }
    else if(!event.defaultPrevented && !this.readOnly) {
      this.checked = !this.checked
      this.emit('change')
    }
  }

  /**
   * @param {FocusEvent} event
   */
  onFocus(event) {
    this.on('keydown', this.onKeyDown)
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    if(event.key === ' ') {
      event.preventDefault()
      this.classList.add('active')
    }
    this.on('keyup', this.onKeyUp, { once : true })
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyUp(event) {
    if(event.key === ' ') {
      this.classList.remove('active')
      this.click()
    }
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseDown(event) {
    if(this.disabled) {
      return
    }
    this.classList.add('active')
    this.on('mouseleave', this.onMouseLeave, { once : true })
    this.on('mouseup', this.onMouseUp, { once : true })
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseLeave(event) {
    this.classList.remove('active')
    this.off('mouseup', this.onMouseUp)
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseUp(event) {
    this.classList.remove('active')
    this.off('mouseleave', this.onMouseLeave)
  }
}
