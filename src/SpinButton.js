import {
  AriaReadOnly, AriaRequired, AriaValueMax, AriaValueMin, AriaValueNow, AriaValueText,
} from './lib'
import { Button } from './Button'
import { Complex } from './Complex'
import { Control } from './Control'
import { Inner } from './Inner'
import './SpinButton.css'

const MINUS = '−'

/**
 * @summary A form of range that expects the user to select from among discrete choices.
 * @see https://www.w3.org/TR/wai-aria-1.1/#spinbutton
 */
export class SpinButton extends Complex
{
  /**
   * @param {{}} init
   * @return {Control}
   */
  build(init) {
    return new Control([
      this._decrButton = new Button({
        tabIndex : null,
        onmousedown : () => {
          this._decrButton.disabled || this._startTimeout(() => this.decrement())
        },
      }),
      this._inner = new Inner,
      this._incrButton = new Button({
        tabIndex : null,
        onmousedown : () => {
          this._incrButton.disabled || this._startTimeout(() => this.increment())
        },
      }),
    ])
  }

  /**
   * @return {boolean}
   */
  increment() {
    if(this.readOnly) {
      return false
    }
    let valueNow = this.valueNow || 0
    if(valueNow === this.valueMax) {
      return false
    }
    this.valueNow = valueNow + this.step
    return true
  }

  /**
   * @return {boolean}
   */
  decrement() {
    if(this.readOnly) {
      return false
    }
    let valueNow = this.valueNow || 0
    if(valueNow === this.valueMin) {
      return false
    }
    this.valueNow = valueNow - this.step
    return true
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Home(event) {
    event.preventDefault()
    const valueMin = this.valueMin
    if(this.readOnly || valueMin === -Infinity || this.valueNow === valueMin) {
      return
    }
    this.valueNow = valueMin
    this.emit('change')
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_End(event) {
    event.preventDefault()
    const valueMax = this.valueMax
    if(this.readOnly || valueMax === Infinity || this.valueNow === valueMax) {
      return
    }
    this.valueNow = valueMax
    this.emit('change')
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_ArrowUp(event) {
    event.preventDefault()
    this.increment() && this.emit('change')
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_ArrowDown(event) {
    event.preventDefault()
    this.decrement() && this.emit('change')
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Backspace(event) {
    event.preventDefault()
    if(this.required || isNaN(this.valueNow)) {
      return
    }
    this.valueNow = NaN
    this.emit('change')
  }

  updateState() {
    const { disabled, valueNow } = this
    this._decrButton.disabled = disabled || !isNaN(valueNow) && valueNow <= this.valueMin
    this._incrButton.disabled = disabled || !isNaN(valueNow) && valueNow >= this.valueMax
  }

  /**
   * @param {function} callback
   * @param {number} [delay]
   * @private
   */
  _startTimeout(callback, delay) {
    if(!callback()) {
      return
    }
    const id = setTimeout(() => this._startTimeout(callback, 50), delay || 500)
    const stopTimeout = () => {
      clearTimeout(id)
      this.off('mouseout', stopTimeout)
      this.off('mouseup', stopTimeout)
      delay || this.emit('change')
    }
    this.on('mouseout', stopTimeout)
    this.on('mouseup', stopTimeout)
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return super.disabled
  }

  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    super.disabled = disabled
    this.updateState()
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
   * @return {string}
   */
  get text() {
    return this._inner.text
  }

  /**
   * @param {string} text
   */
  set text(text) {
    this._inner.text = text
  }

  /**
   * @return {string}
   */
  get value() {
    const valueNow = this.valueNow
    return isNaN(valueNow)? '' : String(valueNow)
  }

  /**
   * @param {string} value
   */
  set value(value) {
    this.valueNow = +value
  }

  /**
   * @returns {number}
   */
  get valueNow() {
    return this.getAttr(AriaValueNow)
  }

  /**
   * @param {number} valueNow
   */
  set valueNow(valueNow) {
    if(isNaN(valueNow)) {
      this.setAttr(AriaValueNow, NaN)
      this._inner.text = null
    }
    else {
      const value = Math.min(Math.max(+valueNow.toFixed(10), this.valueMin), this.valueMax)
      this.setAttr(AriaValueNow, value)
      this._inner.text = String(value).replace(/-/, MINUS)
    }
    this.updateState()
  }

  /**
   * @returns {number}
   */
  get valueMin() {
    const valueMin = this.getAttr(AriaValueMin)
    return isNaN(valueMin)? -Infinity : valueMin
  }

  /**
   * @param {number} valueMin
   */
  set valueMin(valueMin) {
    this.setAttr(AriaValueMin, valueMin)
    this.updateState()
  }

  /**
   * @returns {number}
   */
  get valueMax() {
    const valueMax = this.getAttr(AriaValueMax)
    return isNaN(valueMax)? Infinity : valueMax
  }

  /**
   * @param {number} valueMax
   */
  set valueMax(valueMax) {
    this.setAttr(AriaValueMax, valueMax)
    this.updateState()
  }

  /**
   * @returns {string}
   */
  get valueText() {
    return this.getAttr(AriaValueText)
  }

  /**
   * @param {string} valueText
   */
  set valueText(valueText) {
    this.setAttr(AriaValueText, valueText)
  }
}

SpinButton.prototype.name = null
SpinButton.prototype.step = 1
SpinButton.tabIndex = 0
