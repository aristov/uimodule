import { AriaPosInSet } from './AriaPosInSet'
import { AriaSelected } from './AriaSelected'
import { AriaSetSize } from './AriaSetSize'
import { RoleWidget } from './RoleWidget'

/**
 * A grouping label providing a mechanism for selecting
 *  the tab content that is to be rendered to the user.
 * @see https://www.w3.org/TR/wai-aria-1.1/#tab
 * @mixes RoleSectionHead
 */
export class RoleTab extends RoleWidget
{
  /**
   * @param {number|null} posInSet
   */
  set posInSet(posInSet) {
    this.setAttr(AriaPosInSet, posInSet)
  }

  /**
   * @returns {number|null}
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
   * @param {number|null} setSize
   */
  set setSize(setSize) {
    this.setAttr(AriaSetSize, setSize)
  }

  /**
   * @returns {number|null}
   */
  get setSize() {
    return this.getAttr(AriaSetSize)
  }
}

RoleTab.abstract = false
