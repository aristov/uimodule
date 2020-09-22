import { AriaType } from './AriaType'

const TOKEN_TRUE = 'true'
const TOKEN_FALSE = 'false'

/**
 * Value representing either true or false.
 *  The default value for this value type is false unless otherwise specified.
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_true-false
 * @abstract
 */
export class AriaTypeBoolean extends AriaType
{
  /**
   * value = true
   * value = 'true'
   * value = '*' // non empty string
   * value = 1
   * value = * // non zero
   *      => 'true'
   *
   * value = false
   * value = 'false'
   * value = ''
   * value = null
   * value = undefined
   * value = 0
   *      => no attr
   *
   * @param {DomElem} elem
   * @param {*} value {boolean|string|number|null|undefined}
   */
  static set(elem, value) {
    super.set(elem, TOKEN_TRUE)
  }

  /**
   * value === 'true'
   * value === '*' // non empty string
   *      => true
   *
   * value === 'false'
   * value === ''
   * no attr
   *      => false
   *
   * @param {DomElem} elem
   * @returns {boolean}
   */
  static get(elem) {
    const value = super.get(elem)
    return Boolean(value) && value !== TOKEN_FALSE
  }

  /**
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(elem, value) {
    return (!value || value === TOKEN_FALSE) && !this.remove(elem)
  }

  /**
   * @returns {boolean}
   */
  static get defaultValue() {
    return false
  }
}
