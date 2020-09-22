import { RoleMenu } from './lib/ariamodule'
import { MenuItem } from './MenuItem'
import './Menu.css'

/**
 * @summary A type of widget that offers a list of choices to the user.
 * @see https://www.w3.org/TR/wai-aria-1.1/#menu
 */
class Menu extends RoleMenu
{
  /**
   * @return {MenuItem|null}
   */
  get currentItem() {
    return this.find(MenuItem, ({ current }) => current)
  }
}

export { Menu, MenuItem }
