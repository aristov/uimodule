import { AriaLevel } from './AriaLevel'
import { AriaPosInSet } from './AriaPosInSet'
import { AriaSetSize } from './AriaSetSize'
import { RoleSection } from './RoleSection'

/**
 * A single item in a list or directory.
 * @see https://www.w3.org/TR/wai-aria-1.1/#listitem
 */
export class RoleListItem extends RoleSection
{
  /**
   * @param {number} level
   */
  set level(level) {
    this.setAttr(AriaLevel, level)
  }

  /**
   * @returns {number}
   */
  get level() {
    return this.getAttr(AriaLevel)
  }

  /**
   * @returns {RoleList|*}
   */
  get list() {
    return this.closest(RoleListItem.List)
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

RoleListItem.abstract = false
