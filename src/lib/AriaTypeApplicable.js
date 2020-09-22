import { AriaType } from './AriaType'

let undefined
const TOKEN_FALSE = 'false'
const TOKEN_UNDEFINED = 'undefined'

/**
 * Value representing true, false, or not applicable.
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_true-false-undefined
 * @abstract
 */
export class AriaTypeApplicable extends AriaType
{
  /**
   * value = true
   * value = 'true'
   * value = '*' // non empty string
   *      => 'true'
   *
   * value = false
   * value = 'false'
   *      => 'false'
   *
   * value = undefined
   * value = 'undefined'
   * value = ''
   *      => no attr
   *
   * @param {DomElem} elem
   * @param {*} value {boolean|undefined|string}
   */
  static set(elem, value) {
    super.set(elem, String(Boolean(value) && value !== TOKEN_FALSE))
  }

  /**
   * value === 'true'
   * value === '*' // non empty string
   *      => true
   *
   * value === 'false'
   *      => false
   *
   * value === 'undefined'
   * value === ''
   * no attr
   *      => undefined
   *
   * @param {DomElem} elem
   * @returns {boolean|undefined}
   */
  static get(elem) {
    const value = super.get(elem)
    if(value) {
      return value === TOKEN_UNDEFINED?
        undefined :
        Boolean(value) && value !== TOKEN_FALSE
    }
    return value
  }

  /**
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(elem, value) {
    return String(value) === TOKEN_UNDEFINED?
      !this.remove(elem) :
      super.removeOnValue(elem, value)
  }

  /**
   * @returns {undefined}
   */
  static get defaultValue() {
    return undefined
  }
}
