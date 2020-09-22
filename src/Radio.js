import { RoleRadio } from './lib/ariamodule'
import './Radio.css'

/**
 * @summary A checkable input in a group of elements with the same role,
 *  only one of which can be checked at a time.
 * @see https://www.w3.org/TR/wai-aria-1.1/#radio
 */
export class Radio extends RoleRadio
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.value = init.hasOwnProperty('value')? init.value : null
    this.tabIndex = -1
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
    else if(!this.checked) {
      this.checked = true
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
    if(event.key.startsWith('Arrow')) {
      this.onArrowKeyDown(event)
    }
    else if(event.key === ' ') {
      this.onKeyDown_Space(event)
    }
    this.on('keyup', this.onKeyUp, { once : true })
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowKeyDown(event) {
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
    this.classList.add('active')
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
