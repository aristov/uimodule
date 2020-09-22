import { AriaType } from './AriaType'

let undefined
const TOKEN_UNDEFINED = 'undefined'

/**
 * One of a limited set of allowed values. An explicit value
 *  of undefined for this type is the equivalent of providing no value.
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_token
 * @abstract
 */
export class AriaTypeToken extends AriaType
{
  /**
   * value = 'token'
   *      => 'token'
   *
   * value = null
   * value = undefined
   * value = 'undefined'
   * value = ''
   *      => no attr
   */

  /**
   * value === 'token'
   *      => 'token'
   *
   * value === 'undefined'
   * value === ''
   * no attr
   *      => undefined
   *
   * @param {DomElem} elem
   * @returns {string|undefined}
   */
  static get(elem) {
    const value = super.get(elem)
    if(value === TOKEN_UNDEFINED) {
      return undefined
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

  /**
   * @returns {string[]}
   */
  static get tokens() {
    // todo
  }
}
