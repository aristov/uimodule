import { AriaOrientation, AriaMultiSelectable, AriaLevel, AriaSelected, RoleGroup } from './lib'
import { Composite } from './Composite'
import { Tab } from './Tab'
import { TabPanel } from './TabPanel'
import './TabList.css'

/**
 * @summary A list of tab elements, which are references to tabpanel elements.
 * @see https://www.w3.org/TR/wai-aria-1.1/#tablist
 */
export class TabList extends Composite
{
  /**
   * @param {{}} [init]
   */
  init(init) {
    super.init(init)
    this.on(AriaSelected, this.onSelected, { subtree : true })
  }

  /**
   * @param {MutationRecord} record
   * @param {Tab} elem
   */
  onSelected(record, elem) {
    if(!elem.selected) {
      return
    }
    for(const tab of this.tabs) {
      tab === elem || (tab.selected = false)
    }
  }

  /**
   * @return {DomElem}
   */
  get focusableItem() {
    return this.selectedTabs[0] || super.focusableItem
  }

  /**
   * @returns {RoleGroup[]}
   */
  get groups() {
    return this.controls.filter(elem => elem instanceof RoleGroup)
  }

  /**
   * @param {RoleGroup[]} groups
   */
  set groups(groups) {
    this.controls = groups
    groups = this.groups
    if(!groups.length) {
      return
    }
    this.tabs.forEach((tab, i) => {
      tab.controls = groups.map(group => group.findAll(TabPanel)[i])
    })
  }

  /**
   * @returns {number}
   */
  get level() {
    return this.getAttr(AriaLevel)
  }

  /**
   * @param {number} level
   */
  set level(level) {
    this.setAttr(AriaLevel, level)
  }

  /**
   * @returns {boolean}
   */
  get multiSelectable() {
    return this.getAttr(AriaMultiSelectable)
  }

  /**
   * @param {boolean} multiSelectable
   */
  set multiSelectable(multiSelectable) {
    this.setAttr(AriaMultiSelectable, multiSelectable)
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return this.getAttr(AriaOrientation) || 'horizontal'
  }

  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    this.setAttr(AriaOrientation, orientation)
  }

  /**
   * @returns {Tab|*}
   */
  get selectedTabs() {
    return this.findAll(Tab, ({ selected }) => selected)
  }

  /**
   * @returns {Tab[]}
   */
  get tabs() {
    return this.findAll(Tab)
  }

  /**
   * @return {TabPanel[]}
   */
  get panels() {
    return this.tabs.map(tab => tab.panel)
  }

  /**
   * @returns {boolean}
   */
  static get abstract() {
    return false
  }
}

TabList.Item = Tab

export { Tab, TabPanel }
