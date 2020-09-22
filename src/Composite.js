import { AriaActiveDescendant } from './lib'
import { Item } from './Item'
import { Widget } from './Widget'
import './Composite.css'

export class Composite extends Widget
{
  /**
   * @param {{}} init
   */
  init(init) {
    this.on(Item, this.onItem, { subtree : true })
    super.init(init)
  }

  /**
   * Focus the first focusable item
   */
  focus() {
    const item = this.focusableItem
    item && item.focus()
  }

  /**
   * @param {number} offset
   * @param {KeyboardEvent|MouseEvent|TouchEvent} event
   * @return {Item|null}
   */
  shiftFocus(offset, event) {
    const items = this.enabledItems
    if(!items.length) {
      return null
    }
    const activeDescendant = this.activeDescendant
    const index = activeDescendant?
      items.indexOf(activeDescendant) :
      offset < 0? items.length : -1
    const item = items[index + offset]
    item && item.focus()
    return item
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   */
  onFocusIn(event, elem) {
    super.onFocusIn(event, elem)
    if(elem instanceof this.constructor.Item) {
      this.activeDescendant = elem
    }
  }

  /*onMouseDown(event, elem) {
    super.onMouseDown(event, elem)
    const item = elem.closest(this.constructor.Item)
    if(!item) {
      return
    }
    const activeDescendant = this.activeDescendant
    if(activeDescendant !== item) {
      this.activeDescendant = item
    }
  }*/

  /**
   * @param {MutationRecord} record
   */
  onItem(record) {
    if(!this.activeDescendant && this.tabIndex === null) {
      this.activeDescendant = this.focusableItem
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_ArrowUp(event) {
    if(this.orientation === 'vertical') {
      event.preventDefault()
      this.shiftFocus(-1, event)
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_ArrowDown(event) {
    if(this.orientation === 'vertical') {
      event.preventDefault()
      this.shiftFocus(1, event)
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_ArrowLeft(event) {
    if(this.orientation === 'horizontal') {
      event.preventDefault()
      this.shiftFocus(-1, event)
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_ArrowRight(event) {
    if(this.orientation === 'horizontal') {
      event.preventDefault()
      this.shiftFocus(1, event)
    }
  }

  /**
   * @returns {Item|null}
   */
  get activeDescendant() {
    return this.getAttr(AriaActiveDescendant)
  }

  /**
   * @param {Item|null} activeDescendant
   */
  set activeDescendant(activeDescendant) {
    const item = this.activeDescendant
    if(item === activeDescendant) {
      return
    }
    if(item && item.tabIndex !== null) {
      item.tabIndex = -1
    }
    if(activeDescendant && activeDescendant.tabIndex !== null) {
      activeDescendant.tabIndex = 0
    }
    this.setAttr(AriaActiveDescendant, activeDescendant)
  }

  /**
   * @return {Item[]}
   */
  get enabledItems() {
    return this.findAll(this.constructor.Item, item => {
      return !item.disabled && !item.hidden
    })
  }

  /**
   * @return {Item[]}
   */
  get items() {
    return this.findAll(this.constructor.Item)
  }

  /**
   * @return {DomElem}
   */
  get focusableItem() {
    return this.activeDescendant || this.find(this.constructor.Item, item => {
      return !item.disabled && !item.hidden
    })
  }
}

Composite.tabIndex = null
Composite.Item = Item
