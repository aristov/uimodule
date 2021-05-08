import { AriaTypeToken } from './AriaTypeToken'

const TOKEN_NONE = 'none'

/**
 * Indicates if items in a table or grid are sorted in ascending or descending order.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-sort
 */
export class AriaSort extends AriaTypeToken
{
  /**
   * @param {DomElem} element
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(element, value) {
    return value === TOKEN_NONE?
      !this.remove(element) :
      super.removeOnValue(element, value)
  }
}
