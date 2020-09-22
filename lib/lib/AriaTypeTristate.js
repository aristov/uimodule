import { AriaType } from './AriaType'

let undefined
const TOKEN_FALSE = 'false'
const TOKEN_MIXED = 'mixed'
const TOKEN_UNDEFINED = 'undefined'

/**
 * Value representing true or false, with an intermediate "mixed" value.
 *  The default value for this value type is false unless otherwise specified.
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_tristate
 * @abstract
 */
export class AriaTypeTristate extends AriaType
{
  /**
   * value = true
   * value = 'true'
   * value = '*' // non empty string
   * value = 1
   * value = * // non zero number
   *      => 'true'
   *
   * value = false
   * value = 'false'
   * value = 0
   *      => 'false'
   *
   * value = 'mixed'
   *      => 'mixed'
   *
   * value = null
   * value = undefined
   * value = ''
   *      => no attr
   *
   * @param {DomElem} elem
   * @param {*} value {boolean|string}
   */
  static set(elem, value) {
    if(value === TOKEN_MIXED) {
      super.set(elem, TOKEN_MIXED)
    }
    else super.set(elem, String(Boolean(value) && value !== TOKEN_FALSE))
  }

  /**
   * value === 'true'
   * value === '0'
   * value === '*' // non empty string
   *      => true
   *
   * value === 'false'
   *      => false
   *
   * value === 'mixed'
   *      => 'mixed'
   *
   * value === 'undefined'
   * value === ''
   * no attr
   *      => undefined
   *
   * @param {DomElem} elem
   * @returns {boolean|string}
   */
  static get(elem) {
    const value = super.get(elem)
    if(value) {
      if(value === TOKEN_MIXED) {
        return TOKEN_MIXED
      }
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
