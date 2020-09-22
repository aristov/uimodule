import { AriaType } from './AriaType'

/**
 * A numerical value without a fractional component.
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_integer
 * @abstract
 */
export class AriaTypeInteger extends AriaType
{
  /**
   * value = .0
   * value = .0e-1
   * value = '.0'
   * value = '.0e-1'
   * value = []
   * value = [.0]
   * value = ['.0e-1']
   * value = false
   *      => '0'
   *
   * value = 1.1
   * value = 11e-1
   * value = '1.1'
   * value = '11e-1'
   * value = [1.1]
   * value = ['11e-1']
   * value = true
   *      => '1'
   *
   * value = 4.2
   * value = 42e-1
   * value = '4.2'
   * value = '42e-1'
   * value = [4.2]
   * value = ['4.2']
   *      => '4'
   *
   * value = NaN
   * value = 'NaN'
   * value = 'xyz' // non empty string
   * value = {}
   * value = [.0, 4.2, 1.1]
   * value = function() {}
   * value = undefined
   *      => 'NaN'
   *
   * value = Infinity
   * value = 'Infinity'
   *      => 'Infinity'
   *
   * value = null
   * value = ''
   *      => no attr
   *
   * @param {DomElem} elem
   * @param {number} value {number}
   */
  static set(elem, value) {
    super.set(elem, String(Math.floor(value)))
  }

  /**
   * value === '.0'
   * value === '.0e-1'
   *      => 0
   *
   * value === '1.1'
   * value === '11e-1'
   *      => 1
   *
   * value === '4.2'
   * value === '42e-1'
   *      => 4
   *
   * value === 'NaN'
   * value === 'true'
   * value === 'false'
   * value === 'undefined'
   * value === 'xyz' // non empty string
   *      => NaN
   *
   * value === 'Infinity'
   *      => Infinity
   *
   * value === ''
   * no attr
   *      => null
   *
   * @param {DomElem} elem
   * @returns {number}
   */
  static get(elem) {
    return Math.floor(Number(super.get(elem)))
  }

  /**
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   * @override
   */
  static removeOnValue(elem, value) {
    return isNaN(value)?
      !this.remove(elem) :
      super.removeOnValue(elem, value)
  }

  /**
   * @return {number}
   */
  static get defaultValue() {
    return NaN
  }
}
