import { AriaType } from './AriaType'
import { DomElem } from './DomElem'

const { isArray } = Array

/**
 * A list of one or more ID references.
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_idref_list
 * @abstract
 */
export class AriaTypeIdRefList extends AriaType
{
  /**
   * @param {DomElem} elem
   * @param {DomElem|array.DomElem} value
   */
  static set(elem, value) {
    if(!Array.isArray(value)) {
      value = [value]
    }
    const items = value.filter(Boolean)
    if(!items.length) {
      this.remove(elem)
    }
    const doc = elem.doc
    const storage = {}
    let refs = doc.__refs.get(elem)
    refs || doc.__refs.set(elem, refs = new Map)
    refs.set(this, storage)
    const ids = items.map(item => {
      const id = item.id || (item.id = item.generateId())
      storage[id] = item
      return id
    })
    super.set(elem, ids.join(' '))
  }

  /**
   * @param {DomElem} elem
   * @returns {DomElem[]}
   */
  static get(elem) {
    const value = elem.node.getAttribute(this.localName)
    if(value) {
      const doc = elem.doc
      const refs = doc.__refs.get(elem)
      const ids = value.split(' ')
      if(refs) {
        const storage = refs.get(this)
        if(storage) {
          return ids.map(id => storage[id] || null)
        }
      }
      return ids.map(id => doc.getElementById(id))
    }
    return this.defaultValue
  }

  /**
   * @param {DomElem} elem
   */
  static remove(elem) {
    const doc = elem.doc
    const refs = doc.__refs.get(elem)
    if(refs) {
      refs.delete(this)
      refs.size || doc.__refs.delete(elem)
    }
    super.remove(elem)
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
