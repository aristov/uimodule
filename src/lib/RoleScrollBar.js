import { AriaOrientation } from './AriaOrientation'
import { RoleRange } from './RoleRange'

const DEFAULT_VALUE_MAX = 100
const DEFAULT_VALUE_MIN = 0

/**
 * A graphical object that controls the scrolling of content within a viewing area,
 *  regardless of whether the content is fully displayed within the viewing area.
 * @see https://www.w3.org/TR/wai-aria-1.1/#scrollbar
 */
export class RoleScrollBar extends RoleRange
{
  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    this.setAttr(AriaOrientation, orientation)
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return this.getAttr(AriaOrientation) || 'vertical'
  }

  /**
   * @param {number} valueMax
   */
  set valueMax(valueMax) {
    super.valueMax = valueMax
  }

  /**
   * @returns {number}
   */
  get valueMax() {
    const value = super.valueMax
    return value === null? DEFAULT_VALUE_MAX : value
  }

  /**
   * @param {number} valueMin
   */
  set valueMin(valueMin) {
    super.valueMin = valueMin
  }

  /**
   * @returns {number}
   */
  get valueMin() {
    const value = super.valueMin
    return value === null? DEFAULT_VALUE_MIN : value
  }

  /**
   * @param {number} valueNow
   */
  set valueNow(valueNow) {
    super.valueNow = valueNow
  }

  /**
   * @returns {number}
   */
  get valueNow() {
    const { valueMin, valueMax } = this
    const valueNow = super.valueNow
    if(valueNow === null) {
      return valueMin + (valueMax - valueMin) / 2
    }
    return Math.min(Math.max(valueMin, valueNow), valueMax)
  }
}
