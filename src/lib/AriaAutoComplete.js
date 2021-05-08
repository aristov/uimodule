import { AriaTypeToken } from './AriaTypeToken'

const TOKEN_NONE = 'none'

/**
 * Indicates whether inputting text could trigger display
 *  of one or more predictions of the user's intended value for an input
 *  and specifies how predictions would be presented if they are made.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-autocomplete
 */
export class AriaAutoComplete extends AriaTypeToken
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
