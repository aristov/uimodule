import { RoleGroup } from './RoleGroup'
import { RoleMenuItem } from './RoleMenuItem'
import { RoleSelect } from './RoleSelect'

/**
 * A type of widget that offers a list of choices to the user.
 * @see https://www.w3.org/TR/wai-aria-1.1/#menu
 */
export class RoleMenu extends RoleSelect
{
  /**
   * @returns {RoleMenuItem[]}
   */
  get items() {
    return this.findAll(RoleMenuItem, item => item.parentMenu === this)
  }

  /**
   * @param {RoleMenuItem[]} items
   */
  set items(items) {
    this.children = items
  }

  /**
   * @returns {RoleGroup[]}
   */
  get groups() {
    return this.findAll(RoleGroup, group => {
      const menu = group.closest(RoleMenu)
      return !menu || menu === this
    })
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return super.orientation || 'vertical'
  }

  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    super.orientation = orientation
  }
}

RoleMenu.abstract = false

export { RoleMenu as Menu }
