import { RoleMenuItemCheckBox } from './RoleMenuItemCheckBox'

/**
 * A checkable menuitem in a set of elements with the same role,
 *  only one of which can be checked at a time.
 * @see https://www.w3.org/TR/wai-aria-1.1/#menuitemradio
 * @mixes RoleRadio
 */
export class RoleMenuItemRadio extends RoleMenuItemCheckBox
{
}

export { RoleMenuItemRadio as MenuItemRadio }
