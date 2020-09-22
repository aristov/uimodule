import { AriaTypeToken } from './AriaTypeToken'

const TOKEN_OFF = 'off'

/**
 * Indicates that an element will be updated, and describes
 *  the types of updates the user agents, assistive technologies,
 *  and user can expect from the live region.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-live
 */
export class AriaLive extends AriaTypeToken
{
  /**
   * @param {DomElem} element
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(element, value) {
    return value === TOKEN_OFF?
      !this.remove(element) :
      super.removeOnValue(element, value)
  }
}

/**
 * @alias AriaLive
 */
export { AriaLive as Live }
