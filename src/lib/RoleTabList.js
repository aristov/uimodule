import { AriaLevel } from './AriaLevel'
import { AriaMultiSelectable } from './AriaMultiSelectable'
import { AriaOrientation } from './AriaOrientation'
import { RoleComposite } from './RoleComposite'
import { RoleTab } from './RoleTab'

/**
 * A list of tab elements, which are references to tabpanel elements.
 * @see https://www.w3.org/TR/wai-aria-1.1/#tablist
 */
export class RoleTabList extends RoleComposite
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
    this.setAttr(AriaOrientation, orientation)
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return this.getAttr(AriaOrientation) || 'horizontal'
  }

  /**
   * @returns {RoleTab|*}
   */
  get selectedTab() {
    return this.find(RoleTab, ({ selected }) => selected)
  }

  /**
   * @returns {RoleTab[]}
   */
  get tabs() {
    return this.findAll(RoleTab)
  }
}

RoleTabList.abstract = false

export { RoleTabList as TabList }
