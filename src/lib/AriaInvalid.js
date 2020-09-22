import { AriaTypeToken } from './AriaTypeToken'

const TOKEN_TRUE = 'true'
const TOKEN_FALSE = 'false'

/**
 * Indicates the entered value does not conform to the format expected by the application.
 *
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-invalid
 */
export class AriaInvalid extends AriaTypeToken
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
 * @alias AriaInvalid
 */
export { AriaInvalid as Invalid }
