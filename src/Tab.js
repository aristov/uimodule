import { Item } from './Item'
import { TabPanel } from './TabPanel'
import { PosInSet } from './lib/AriaPosInSet'
import { Selected } from './lib/AriaSelected'
import { SetSize } from './lib/AriaSetSize'
import './Tab.css'

/**
 * @summary A grouping label providing a mechanism for selecting
 *  the tab content that is to be rendered to the user.
 * @see https://www.w3.org/TR/wai-aria-1.1/#tab
 */
export class Tab extends Item
{
  /**
   * Activate tab
   */
  activate(event) {
    this.selected = true
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Enter(event) {
    this.activate()
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyUp_Space(event) {
    event.preventDefault()
    this.activate()
  }

  /**
   * @return {TabPanel|null}
   */
  get panel() {
    return this.panels[0] || null
  }

  /**
   * @param {TabPanel|null} panel
   */
  set panel(panel) {
    this.panels = panel
  }

  /**
   * @return {TabPanel[]}
   */
  get panels() {
    return this.controls.filter(elem => elem instanceof TabPanel)
  }

  /**
   * @param {TabPanel[]} panels
   */
  set panels(panels) {
    this.controls = panels
    this.panels.forEach(panel => {
      panel.tab === this || (panel.tab = this)
      panel.hidden = !this.selected
    })
  }

  /**
   * @returns {number|null}
   */
  get posInSet() {
    return this.getAttr(PosInSet)
  }

  /**
   * @param {number|null} posInSet
   */
  set posInSet(posInSet) {
    this.setAttr(PosInSet, posInSet)
  }

  /**
   * @returns {boolean}
   */
  get selected() {
    return this.getAttr(Selected) || false
  }

  /**
   * @param {boolean} selected
   */
  set selected(selected) {
    this.panels.forEach(panel => panel.hidden = !selected)
    this.setAttr(Selected, selected)
  }

  /**
   * @returns {number|null}
   */
  get setSize() {
    return this.getAttr(SetSize)
  }

  /**
   * @param {number|null} setSize
   */
  set setSize(setSize) {
    this.setAttr(SetSize, setSize)
  }

  /**
   * @returns {boolean}
   */
  static get abstract() {
    return false
  }
}

TabPanel.Tab = Tab
