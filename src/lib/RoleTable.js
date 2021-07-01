import { AriaColCount } from './AriaColCount'
import { AriaRowCount } from './AriaRowCount'
import { RoleCaption } from './RoleCaption'
import { RoleCell } from './RoleCell'
import { RoleRow } from './RoleRow'
import { RoleRowGroup } from './RoleRowGroup'
import { RoleSection } from './RoleSection'

/**
 * A section containing data arranged in rows and columns.
 * @see https://www.w3.org/TR/wai-aria-1.1/#table
 */
export class RoleTable extends RoleSection
{
  /**
   * @returns {RoleCaption|*}
   */
  get caption() {
    return this.find(RoleCaption)
  }

  /**
   * @returns {RoleCell[]}
   */
  get cells() {
    return this.findAll(RoleCell)
  }

  /**
   * @param {number} colCount
   */
  set colCount(colCount) {
    this.setAttr(AriaColCount, colCount)
  }

  /**
   * @returns {number}
   */
  get colCount() {
    return this.getAttr(AriaColCount)
  }

  /**
   * @param {number} rowCount
   */
  set rowCount(rowCount) {
    this.setAttr(AriaRowCount, rowCount)
  }

  /**
   * @returns {number}
   */
  get rowCount() {
    return this.getAttr(AriaRowCount)
  }

  /**
   * @returns {RoleRowGroup[]}
   */
  get rowGroups() {
    return this.findAll(RoleRowGroup)
  }

  /**
   * @returns {RoleRow[]}
   */
  get rows() {
    return this.findAll(RoleRow)
  }
}

RoleTable.abstract = false

RoleCaption.Table = RoleTable
RoleCell.Table = RoleTable
RoleRow.Table = RoleTable
RoleRowGroup.Table = RoleTable
