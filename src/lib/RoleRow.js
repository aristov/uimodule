import { AriaColIndex } from './AriaColIndex'
import { AriaLevel } from './AriaLevel'
import { AriaMultiSelectable } from './AriaMultiSelectable'
import { AriaRowIndex } from './AriaRowIndex'
import { AriaSelected } from './AriaSelected'
import { RoleCell } from './RoleCell'
import { RoleGridCell } from './RoleGridCell'
import { RoleGroup } from './RoleGroup'
import { RoleRowHeader } from './RoleRowHeader'

/**
 * A row of cells in a tabular container.
 * @see https://www.w3.org/TR/wai-aria-1.1/#row
 * @mixes RoleWidget
 */
export class RoleRow extends RoleGroup
{
  /**
   * @returns {RoleCell[]}
   */
  get cells() {
    return this.findAll(RoleCell)
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
    return this.getAttr(AriaColIndex) || 0
  }

  /**
   * @returns {RoleGridCell[]}
   */
  get gridCells() {
    return this.findAll(RoleGridCell)
  }

  /**
   * @param {number} level
   */
  set level(level) {
    this.setAttr(AriaLevel, level)
  }

  /**
   * @returns {number}
   */
  get level() {
    return this.getAttr(AriaLevel)
  }

  /**
   * @param {boolean} multiSelectable
   */
  set multiSelectable(multiSelectable) {
    this.setAttr(AriaMultiSelectable, multiSelectable)
  }

  /**
   * @returns {boolean}
   */
  get multiSelectable() {
    return this.getAttr(AriaMultiSelectable)
  }

  /**
   * @returns {RoleRow}
   */
  get nextRow() {
    const owner = this.rowGroup || this.table
    return owner.rows[this.rowIndex + 1] || null
  }

  /**
   * @returns {RoleRow}
   */
  get prevRow() {
    const owner = this.rowGroup || this.table
    return owner.rows[this.rowIndex - 1] || null
  }

  /**
   * @returns {RoleRowGroup}
   */
  get rowGroup() {
    return this.closest(RoleRow.RowGroup)
  }

  /**
   * @returns {RoleRowHeader|null}
   */
  get rowHeader() {
    return this.find(RoleRowHeader)
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
    if(isNaN(index)) {
      const rows = (this.rowGroup || this.table).rows
      return rows.indexOf(this)
    }
    return index
  }

  /**
   * @param {boolean|undefined} selected
   */
  set selected(selected) {
    this.setAttr(AriaSelected, selected)
  }

  /**
   * @returns {boolean|undefined}
   */
  get selected() {
    return this.getAttr(AriaSelected)
  }

  /**
   * @returns {RoleTable|null}
   */
  get table() {
    return this.closest(RoleRow.Table)
  }

  /**
   * @return {RoleGrid|null}
   */
  get grid() {
    return this.closest(RoleRow.Grid)
  }
}

export { RoleRow as Row }

RoleCell.Row = RoleRow
