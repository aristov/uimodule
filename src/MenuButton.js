import { Button } from './Button'
import { PopupMenu } from './PopupMenu'
import './MenuButton.css'

export class MenuButton extends Button
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.expanded = false
    this.hasPopup = 'menu'
  }

  /**
   * Create menu if needed, toggle the menu, focus the first item if shown
   */
  activate() {
    const menu = this.menu || (this.menu = new this.constructor.Menu)
    super.activate()
    if(this.expanded) {
      const item = menu.items.filter(({ disabled }) => !disabled)[0]
      item && item.focus()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    super.onKeyDown(...arguments)
    if(['ArrowUp', 'ArrowDown'].includes(event.key)) {
      this.activate()
      if(event.key === 'ArrowUp') {
        const items = this.items.filter(({ disabled }) => !disabled)
        const item = items[items.length - 1]
        item && item.focus()
      }
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Enter(event) {
    this.activate()
  }

  /**
   * @returns {PopupMenu|null}
   */
  get menu() {
    return this.controls.find(elem => elem instanceof this.constructor.Menu) || null
  }

  /**
   * @param {PopupMenu|null} menu
   */
  set menu(menu) {
    if(menu) {
      this.controls = menu
      this.popup = menu.popup
      return
    }
    this.popup = null
    this.controls = null
  }

  /**
   * @return {MenuItem[]}
   */
  get items() {
    const menu = this.menu
    return menu? menu.items : []
  }

  /**
   * @param {MenuItem[]} items
   */
  set items(items) {
    const menu = this.menu || (this.menu = new this.constructor.Menu)
    menu.children = items
  }
}

MenuButton.Menu = PopupMenu
