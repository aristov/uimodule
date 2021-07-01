import { RoleSection } from './RoleSection'

/**
 * On-screen descriptive text for a figure or table in the page.
 * @see https://www.w3.org/TR/wai-aria-1.2/#caption
 */
export class RoleCaption extends RoleSection
{
  /**
   * @returns {RoleTable|*}
   */
  get table() {
    return this.closest(RoleCaption.Table)
  }
}

RoleCaption.abstract = false
