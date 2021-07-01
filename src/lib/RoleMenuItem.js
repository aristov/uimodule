import { AriaExpanded } from './AriaExpanded'
import { RoleCommand } from './RoleCommand'
import { RoleMenu } from './RoleMenu'

/**
 * An option in a set of choices contained by a menu or menubar.
 * @see https://www.w3.org/TR/wai-aria-1.1/#menuitem
 */
export class RoleMenuItem extends RoleCommand
{
  /**
   * @param {boolean|undefined} expanded
   */
  set expanded(expanded) {
    this.setAttr(AriaExpanded, expanded)
  }

  /**
   * @returns {boolean|undefined}
   */
  get expanded() {
    return this.getAttr(AriaExpanded)
  }

  /**
   * @returns {RoleMenuBar|null}
   */
  get menuBar() {
    return this.closest(RoleMenuItem.MenuBar)
  }

  /**
   * @returns {RoleMenuBar|RoleMenu|null}
   */
  get parentMenu() {
    return this.closest(RoleMenu)
  }
}

RoleMenuItem.abstract = false
