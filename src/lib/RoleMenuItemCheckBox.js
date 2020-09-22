import { AriaChecked } from './AriaChecked'
import { RoleMenuItem } from './RoleMenuItem'

/**
 * A menuitem with a checkable state whose possible values are true, false, or mixed.
 * @see https://www.w3.org/TR/wai-aria-1.1/#menuitemcheckbox
 * @mixes RoleCheckBox
 */
export class RoleMenuItemCheckBox extends RoleMenuItem
{
  /**
   * @param {boolean} checked
   */
  set checked(checked) {
    this.setAttr(AriaChecked, checked)
  }

  /**
   * @returns {boolean}
   */
  get checked() {
    return this.getAttr(AriaChecked) || false
  }
}

export { RoleMenuItemCheckBox as MenuItemCheckBox }
