import { RoleCell } from './RoleCell'
import { RoleGridCell } from './RoleGridCell'
import { RoleRow } from './RoleRow'
import { RoleStructure } from './RoleStructure'

/**
 * A structure containing one or more row elements in a tabular container.
 * @see https://www.w3.org/TR/wai-aria-1.1/#rowgroup
 */
export class RoleRowGroup extends RoleStructure
{
  /**
   * @returns {RoleTable|*|null}
   */
  get table() {
    return this.closest(RoleRowGroup.Table)
  }

  /**
   * @returns {RoleGrid|*|null}
   */
  get grid() {
    return this.closest(RoleRowGroup.Grid)
  }

  /**
   * @returns {RoleCell[]}
   */
  get cells() {
    return this.findAll(RoleCell)
  }

  /**
   * @returns {RoleGridCell[]}
   */
  get gridCells() {
    return this.findAll(RoleGridCell)
  }

  /**
   * @returns {RoleRow[]}
   */
  get rows() {
    return this.findAll(RoleRow)
  }
}

RoleRowGroup.abstract = false

RoleCell.RowGroup = RoleRowGroup
RoleRow.RowGroup = RoleRowGroup
