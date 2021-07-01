import { AriaOrientation } from './AriaOrientation'
import { RoleGroup } from './RoleGroup'

/**
 * A collection of commonly used function buttons
 *  or controls represented in compact visual form.
 * @see https://www.w3.org/TR/wai-aria-1.1/#toolbar
 */
export class RoleToolBar extends RoleGroup
{
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
}
