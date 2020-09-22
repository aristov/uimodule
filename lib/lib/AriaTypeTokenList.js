import { AriaType } from './AriaType'

const { isArray } = Array

/**
 * A list of one or more tokens.
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_token_list
 * @abstract
 */
export class AriaTypeTokenList extends AriaType
{
  /**
   * @param {DomElem} elem
   * @param {*} value {string[]|string}
   */
  static set(elem, value) {
    if(isArray(value)) {
      const list = value.filter(Boolean)
      if(list.length) {
        super.set(elem, list.join(' '))
      }
      else elem.node.removeAttribute(this.localName)
    }
    else super.set(elem, value)
  }

  /**
   * @param {DomElem} elem
   * @returns {string[]}
   */
  static get(elem) {
    const value = elem.node.getAttribute(this.localName)
    return value? value.split(' ') : this.defaultValue
  }

  /**
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(elem, value) {
    return isArray(value) && !value.length?
      !this.remove(elem) :
      super.removeOnValue(elem, value)
  }

  /**
   * @returns {array}
   */
  static get defaultValue() {
    return []
  }
}
