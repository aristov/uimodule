import { AttrType } from './AttrType'

const ARIA_ATTR_PREFIX = 'aria-'

/**
 * @see https://www.w3.org/TR/wai-aria-1.1/#host_general_attrs
 * @see https://www.w3.org/TR/html/dom.html#state-and-property-attributes
 * @see http://www.w3.org/ns/wai-aria/
 * @abstract
 */
export class AriaType extends AttrType
{
  /**
   * @param {DomElem} elem
   * @returns {string|null|*}
   * @override
   */
  static get(elem) {
    const value = super.get(elem)
    return value || this.defaultValue
  }

  /**
   * @see https://www.w3.org/TR/wai-aria-1.1/#state_property_processing
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   * @override
   */
  static removeOnValue(elem, value) {
    return value === ''?
      !this.remove(elem) :
      super.removeOnValue(elem, value)
  }

  /**
   * @returns {string}
   * @override
   */
  static get attrName() {
    const name = this.name.slice(4)
    return name[0].toLowerCase() + name.slice(1)
  }

  /**
   * @returns {string}
   * @override
   */
  static get localName() {
    return ARIA_ATTR_PREFIX + this.name.slice(4).toLowerCase()
  }
}
