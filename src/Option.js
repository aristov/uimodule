import { Item } from './Item'
import { AriaChecked, AriaPosInSet, AriaSelected, AriaSetSize, RoleListBox } from './lib'
import './Option.css'

/**
 * @summary A selectable item in a select list.
 * @see https://www.w3.org/TR/wai-aria-1.1/#option
 *
 * Not to be confused with the native Option constructor of the HTML standard
 * @see https://www.w3.org/TR/html/single-page.html#dom-htmloptionelement-option
 */
export class Option extends Item
{
  /**
   * @param {{}} init
   */
  init(init) {
    this._value = null
    super.init(init)
  }

  /**
   * Focus option
   */
  focus() {
    this.emit('focusin')
  }

  /**
   * @returns {boolean|string|undefined}
   */
  get checked() {
    return this.getAttr(AriaChecked)
  }

  /**
   * @param {boolean|string|undefined} checked
   */
  set checked(checked) {
    this.setAttr(AriaChecked, checked)
  }

  /**
   * @returns {RoleListBox|*|null}
   */
  get listBox() {
    return this.closest(RoleListBox)
  }

  /**
   * @returns {number}
   */
  get posInSet() {
    return this.getAttr(AriaPosInSet)
  }

  /**
   * @param {number} posInSet
   */
  set posInSet(posInSet) {
    this.setAttr(AriaPosInSet, posInSet)
  }

  /**
   * @returns {number}
   */
  get setSize() {
    return this.getAttr(AriaSetSize)
  }

  /**
   * @param {number} setSize
   */
  set setSize(setSize) {
    this.setAttr(AriaSetSize, setSize)
  }

  /**
   * @returns {boolean}
   */
  get selected() {
    return this.getAttr(AriaSelected) || false
  }

  /**
   * @param {boolean} selected
   */
  set selected(selected) {
    if(!selected) {
      this.class.active = false
    }
    this.setAttr(AriaSelected, selected)
  }

  /**
   * @return {any}
   */
  get value() {
    return /*this._value === null? this.text : */this._value
  }

  /**
   * @param {any} value
   */
  set value(value) {
    this._value = value
  }
}

Option.prototype.abbr = null
Option.prototype.index = -1
Option.tabIndex = null
