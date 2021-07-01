import { RoleForm } from './RoleForm'
import { RoleRoleType } from './RoleRoleType'

/**
 * An interactive component of a graphical user interface (GUI).
 * @see https://www.w3.org/TR/wai-aria-1.1/#widget
 * @abstract
 */
export class RoleWidget extends RoleRoleType
{
  /**
   * @returns {RoleForm|*|null}
   */
  get form() {
    return this.closest(RoleForm)
  }
}
