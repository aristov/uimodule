import { AriaTypeToken } from './AriaTypeToken'

const TOKEN_TRUE = 'true'
const TOKEN_FALSE = 'false'

/**
 * Indicates the element that represents the current item
 *  within a container or set of related elements.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-current
 */
export class AriaCurrent extends AriaTypeToken
{
  /**
   * @param {DomElem} elem
   * @param {*} value {boolean|string}
   */
  static set(elem, value) {
    super.set(elem, String(value))
  }

  /**
   * @param {DomElem} elem
   * @returns {boolean|string}
   */
  static get(elem) {
    const value = elem.node.getAttribute(this.localName)
    return !value || value === TOKEN_FALSE?
      false :
      value === TOKEN_TRUE || value
  }

  /**
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(elem, value) {
    return String(value) === TOKEN_FALSE?
      !this.remove(elem) :
      super.removeOnValue(elem, value)
  }

  /**
   * @returns {boolean}
   */
  static get defaultValue() {
    return false
  }
}

/**
 * @alias AriaCurrent
 */
export { AriaCurrent as Current }
