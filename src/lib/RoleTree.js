import { AriaMultiSelectable } from './AriaMultiSelectable'
import { AriaRequired } from './AriaRequired'
import { RoleSelect } from './RoleSelect'
import { RoleTreeItem } from './RoleTreeItem'

/**
 * A type of select that may contain sub-level
 *  nested groups that can be collapsed and expanded.
 * @see https://www.w3.org/TR/wai-aria-1.1/#tree
 */
export class RoleTree extends RoleSelect
{
  /**
   * @param {boolean} multiSelectable
   */
  set multiSelectable(multiSelectable) {
    this.setAttr(AriaMultiSelectable, multiSelectable)
  }

  /**
   * @returns {boolean}
   */
  get multiSelectable() {
    return this.getAttr(AriaMultiSelectable)
  }

  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    super.orientation = orientation
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return super.orientation || 'vertical'
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(AriaRequired, required)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(AriaRequired)
  }

  /**
   * @returns {RoleTreeItem[]}
   */
  get items() {
    return this.findAll(RoleTreeItem)
  }
}

RoleTree.abstract = false
