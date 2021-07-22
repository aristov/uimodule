import { AriaType } from './AriaType'
import { DomElem } from './DomElem'

/**
 * Reference to the ID of another element in the same document
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_idref
 * @abstract
 */
export class AriaTypeIdRef extends AriaType
{
  /**
   * @param {DomElem} elem
   * @param {DomElem|null} value
   */
  static set(elem, value) {
    if(!value) {
      this.remove(elem)
      return // fixme: refs.delete(this) ???
    }
    const doc = elem.doc
    let refs = doc.__refs.get(elem)
    refs || doc.__refs.set(elem, refs = new Map)
    refs.set(this, value)
    super.set(elem, value.id || (value.id = value.generateId()))
  }

  /**
   * @param {DomElem} elem
   * @returns {DomElem|null}
   */
  static get(elem) {
    const value = super.get(elem)
    if(value) {
      const doc = elem.doc
      const refs = doc.__refs.get(elem)
      return refs?
        refs.get(this) || null :
        doc.getElemById(value)
    }
    return value
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
   * @returns {null}
   */
  static get defaultValue() {
    return null
  }
}
