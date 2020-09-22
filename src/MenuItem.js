import { RoleMenuItem } from './lib'
import { Role } from './lib'
import { Popup } from './Popup'
import './MenuItem.css'

/**
 * @summary An option in a set of choices contained by a menu or menubar.
 * @see https://www.w3.org/TR/wai-aria-1.1/#menuitem
 */
export class MenuItem extends RoleMenuItem
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.tabIndex = -1
    this.on('click', this.onClick)
    this.on('focus', this.onFocus)
    this.on('keydown', this.onKeyDown)
    // this.on('mouseenter', this.onMouseEnter)
  }

  /**
   * Activate the menu item
   */
  activate() {
    void null
  }

  /**
   * @param {Event} event
   */
  onClick(event) {
    if(this.disabled) {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
    else {
      event.stopPropagation()
      this.activate()
    }
  }

  /**
   * @param {FocusEvent} event
   */
  onFocus(event) {
    const menuBar = this.menuBar
    if(!menuBar) {
      return
    }
    for(const item of menuBar.items) {
      if(!item.disabled) {
        item.tabIndex = item === this? 0 : -1
      }
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    switch(event.key) {
      case ' ':
        this.onKeyDown_Space(event)
        break
      case 'Enter':
        this.onKeyDown_Enter(event)
        break
      default:
        event.key.startsWith('Arrow') && this.onArrowKeyDown(event)
    }
    this.on('keyup', this.onKeyUp, { once : true })
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowKeyDown(event) {
    event.preventDefault()
    switch(event.key) {
      case 'ArrowUp':
        this.onArrowUpKeyDown(event)
        break
      case 'ArrowRight':
        this.onArrowRightKeyDown(event)
        break
      case 'ArrowDown':
        this.onArrowDownKeyDown(event)
        break
      case 'ArrowLeft':
        this.onArrowLeftKeyDown(event)
        break
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowUpKeyDown(event) {
    const parentMenu = this.parentMenu
    if(parentMenu.orientation === 'vertical') {
      const items = parentMenu.items.filter(({ disabled }) => !disabled)
      const index = items.indexOf(this) - 1
      items[index < 0? items.length - 1 : index].focus()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowDownKeyDown(event) {
    const parentMenu = this.parentMenu
    if(parentMenu.orientation === 'vertical') {
      const items = parentMenu.items.filter(({ disabled }) => !disabled)
      const index = items.indexOf(this) + 1
      items[index === items.length? 0 : index].focus()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowLeftKeyDown(event) {
    const parentMenu = this.parentMenu
    if(parentMenu.orientation === 'horizontal') {
      const items = parentMenu.items.filter(({ disabled }) => !disabled)
      const index = items.indexOf(this) - 1
      items[index < 0? items.length - 1 : index].focus()
      return
    }
    if(parentMenu instanceof Role.MenuBar) {
      return
    }
    const ancestorMenu = parentMenu.parentMenu
    if(!ancestorMenu) {
      return
    }
    const item = ancestorMenu.find(MenuItem, ({ expanded }) => expanded)
    if(!item) {
      return
    }
    if(ancestorMenu.orientation === 'horizontal') {
      const items = ancestorMenu.items.filter(({ disabled }) => !disabled)
      const index = items.indexOf(item) - 1
      items[index < 0? items.length - 1 : index].focus()
      return
    }
    item.focus()
    parentMenu.closest(Popup).anchor.expanded = false
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowRightKeyDown(event) {
    const parentMenu = this.parentMenu
    if(parentMenu.orientation === 'horizontal') {
      const items = parentMenu.items.filter(({ disabled }) => !disabled)
      const index = items.indexOf(this) + 1
      items[index === items.length? 0 : index].focus()
      return
    }
    if(parentMenu instanceof Role.MenuBar) {
      return
    }
    const menuBar = this.closest(Role.MenuBar)
    if(menuBar && menuBar.orientation === 'horizontal') {
      const items = menuBar.items.filter(({ disabled }) => !disabled)
      const item = menuBar.find(MenuItem, ({ expanded }) => expanded)
      const index = items.indexOf(item) + 1
      items[index === items.length? 0 : index].focus()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Space(event) {
    event.preventDefault()
    this.classList.add('active')
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
  onKeyUp(event) {
    if(event.key === ' ') {
      this.classList.remove('active')
      this.click()
    }
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseEnter(event) {
    if(this.disabled) {
      return
    }
    const parentMenu = this.parentMenu
    if(parentMenu.contains(this.doc.activeElem)) {
      this.focus()
    }
  }
}
