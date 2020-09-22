import { AriaChecked } from './AriaChecked'
import { AriaPosInSet } from './AriaPosInSet'
import { AriaSelected } from './AriaSelected'
import { AriaSetSize } from './AriaSetSize'
import { RoleInput } from './RoleInput'
import { RoleListBox } from './RoleListBox'

/**
 * A selectable item in a select list.
 * @see https://www.w3.org/TR/wai-aria-1.1/#option
 */
export class RoleOption extends RoleInput
{
  /**
   * @param {boolean|string|undefined} checked
   */
  set checked(checked) {
    this.setAttr(AriaChecked, checked)
  }

  /**
   * @returns {boolean|string|undefined}
   */
  get checked() {
    return this.getAttr(AriaChecked)
  }

  /**
   * @returns {RoleListBox|*|null}
   */
  get listBox() {
    return this.closest(RoleListBox)
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
  get posInSet() {
    return this.getAttr(AriaPosInSet)
  }

  /**
   * @param {boolean} selected
   */
  set selected(selected) {
    this.setAttr(AriaSelected, selected)
  }

  /**
   * @returns {boolean}
   */
  get selected() {
    return this.getAttr(AriaSelected) || false
  }

  /**
   * @param {number} setSize
   */
  set setSize(setSize) {
    this.setAttr(AriaSetSize, setSize)
  }

  /**
   * @returns {number}
   */
  get setSize() {
    return this.getAttr(AriaSetSize)
  }
}

RoleOption.abstract = false
