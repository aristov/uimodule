import { AriaValueMax } from './AriaValueMax'
import { AriaValueMin } from './AriaValueMin'
import { AriaValueNow } from './AriaValueNow'
import { AriaValueText } from './AriaValueText'
import { RoleWidget } from './RoleWidget'

/**
 * An input representing a range of values that can be set by the user.
 * @see https://www.w3.org/TR/wai-aria-1.1/#range
 * @abstract
 */
export class RoleRange extends RoleWidget
{
  /**
   * @param {number} valueMax
   */
  set valueMax(valueMax) {
    this.setAttr(AriaValueMax, valueMax)
  }

  /**
   * @returns {number}
   */
  get valueMax() {
    return this.getAttr(AriaValueMax)
  }

  /**
   * @param {number} valueMin
   */
  set valueMin(valueMin) {
    this.setAttr(AriaValueMin, valueMin)
  }

  /**
   * @returns {number}
   */
  get valueMin() {
    return this.getAttr(AriaValueMin)
  }

  /**
   * @param {number} valueNow
   */
  set valueNow(valueNow) {
    this.setAttr(AriaValueNow, valueNow)
  }

  /**
   * @returns {number}
   */
  get valueNow() {
    return this.getAttr(AriaValueNow)
  }

  /**
   * @param {string} valueText
   */
  set valueText(valueText) {
    this.setAttr(AriaValueText, valueText)
  }

  /**
   * @returns {string}
   */
  get valueText() {
    return this.getAttr(AriaValueText)
  }
}
