import { AriaSort } from './AriaSort'
import { RoleCell } from './RoleCell'

/**
 * A cell containing header information for a column.
 * @see https://www.w3.org/TR/wai-aria-1.1/#columnheader
 * @mixes RoleGridCell
 * @mixes RoleSectionHead
 */
export class RoleColumnHeader extends RoleCell
{
  /**
   * @param {string} sort
   */
  set sort(sort) {
    this.setAttr(AriaSort, sort)
  }

  /**
   * @returns {string}
   */
  get sort() {
    return this.getAttr(AriaSort)
  }
}

export { RoleColumnHeader as ColumnHeader }

RoleCell.ColumnHeader = RoleColumnHeader
