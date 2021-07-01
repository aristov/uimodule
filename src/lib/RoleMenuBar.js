import { AriaOrientation } from './AriaOrientation'
import { RoleMenu } from './RoleMenu'
import { RoleMenuItem } from './RoleMenuItem'

/**
 * A presentation of menu that usually remains visible
 *  and is usually presented horizontally.
 * @see https://www.w3.org/TR/wai-aria-1.1/#menubar
 */
export class RoleMenuBar extends RoleMenu
{
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
    return this.hasAttr(AriaOrientation)? this.getAttr(AriaOrientation) : 'horizontal'
  }
}

RoleMenuItem.MenuBar = RoleMenuBar
