import { AriaColIndex } from './AriaColIndex'
import { AriaColSpan } from './AriaColSpan'
import { AriaRowIndex } from './AriaRowIndex'
import { AriaRowSpan } from './AriaRowSpan'
import { RoleSection } from './RoleSection'

/**
 * A cell in a tabular container.
 * @see https://www.w3.org/TR/wai-aria-1.1/#cell
 */
export class RoleCell extends RoleSection
{
  /**
   * @returns {RoleGridCell[]}
   */
  get column() {
    const owner = this.rowGroup || this.grid
    const index = this.colIndex
    return owner.findAll(RoleCell, ({ colIndex }) => colIndex === index)
  }

  /**
   * @param {number} colIndex
   */
  set colIndex(colIndex) {
    this.setAttr(AriaColIndex, colIndex)
  }

  /**
   * @returns {number}
   */
  get colIndex() {
    const index = this.getAttr(AriaColIndex)
    return isNaN(index)?
      this.row.cells.indexOf(this) :
      index
  }

  /**
   * @param {number} colSpan
   */
  set colSpan(colSpan) {
    this.setAttr(AriaColSpan, colSpan)
  }

  /**
   * @returns {number}
   */
  get colSpan() {
    return this.getAttr(AriaColSpan)
  }

  /**
   * @returns {RoleColumnHeader|null}
   */
  get columnHeader() {
    const index = this.colIndex
    return this.table.find(RoleCell.ColumnHeader, ({ colIndex }) => colIndex === index)
  }

  /**
   * @returns {RoleGrid}
   */
  get grid() {
    return this.closest(RoleCell.Grid)
  }

  /**
   * @returns {RoleRow|null}
   */
  get row() {
    return this.closest(RoleCell.Row)
  }

  /**
   * @returns {RoleRowGroup|null}
   */
  get rowGroup() {
    return this.closest(RoleCell.RowGroup)
  }

  /**
   * @returns {RoleRowHeader}
   */
  get rowHeader() {
    return this.row.rowHeader
  }

  /**
   * @param {number} rowIndex
   */
  set rowIndex(rowIndex) {
    this.setAttr(AriaRowIndex, rowIndex)
  }

  /**
   * @returns {number}
   */
  get rowIndex() {
    const index = this.getAttr(AriaRowIndex)
    return isNaN(index)?
      this.row.rowIndex :
      index
  }

  /**
   * @param {number} rowSpan
   */
  set rowSpan(rowSpan) {
    this.setAttr(AriaRowSpan, rowSpan)
  }

  /**
   * @returns {number}
   */
  get rowSpan() {
    return this.getAttr(AriaRowSpan)
  }

  /**
   * @returns {RoleTable|null}
   */
  get table() {
    return this.closest(RoleCell.Table)
  }
}

RoleCell.abstract = false
