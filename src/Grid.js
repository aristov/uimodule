import { RoleGrid } from './lib/ariamodule'
import { RoleCaption } from './lib/ariamodule'
import { RoleColumnHeader } from './lib/ariamodule'
import { RoleRowGroup } from './lib/ariamodule'
import { RoleRowHeader } from './lib/ariamodule'
import { GridCell } from './GridCell'
import { Row } from './Row'

/**
 * @summary A composite widget containing a collection of one or more rows with one
 *  or more cells where some or all cells in the grid are focusable by using
 *  methods of two-dimensional navigation, such as directional arrow keys.
 * @see https://www.w3.org/TR/wai-aria-1.1/#grid
 */
class Grid extends RoleGrid
{
  /**
   * Reset grid tabIndex
   */
  resetTabIndex() {
    const cells = this.gridCells.filter(({ disabled }) => !disabled)
    if(!cells.some(({ tabIndex }) => tabIndex === 0)) {
      const first = cells[0]
      if(first) {
        first.tabIndex = 0
      }
    }
  }

  /**
   * Update selection according to the focused and active descendant cell
   */
  updateSelection(targetCell) {
    const focusedCell = this.focusedCell
    if(focusedCell && focusedCell.selected) {
      const rowIndex1 = focusedCell.rowIndex
      const rowIndex2 = targetCell.rowIndex
      const colIndex1 = focusedCell.colIndex
      const colIndex2 = targetCell.colIndex
      const rowIndexMin = Math.min(rowIndex1, rowIndex2)
      const rowIndexMax = Math.max(rowIndex1, rowIndex2)
      const colIndexMin = Math.min(colIndex1, colIndex2)
      const colIndexMax = Math.max(colIndex1, colIndex2)
      const cells = []
      for(const cell of this.gridCells) {
        const { rowIndex, colIndex } = cell
        if(rowIndex >= rowIndexMin && rowIndex <= rowIndexMax) {
          if(colIndex >= colIndexMin && colIndex <= colIndexMax) {
            if(cell.disabled) return
            cells.push(cell)
          }
        }
      }
      this.gridCells.forEach(cell => cell.selected = cells.includes(cell))
      this.activeDescendant = targetCell
    }
  }

  /**
   * @param {*} children
   */
  set children(children) {
    super.children = children
    this.resetTabIndex()
  }

  /**
   * @returns {DomElem[]|*}
   */
  get children() {
    return super.children
  }

  /**
   * @returns {GridCell}
   */
  get focusedCell() {
    const activeElem = this.doc.activeElem
    return this.find(GridCell, cell => cell === activeElem)
  }
}

export { Grid, GridCell, Row, RoleRowGroup, RoleRowHeader, RoleColumnHeader, RoleCaption }
