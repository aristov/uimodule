import { RoleGridCell } from './lib/ariamodule'

let undefined

const TABINDEX_INITIAL_VALUE = -1

/**
 * @summary A cell in a grid or treegrid.
 * @see https://www.w3.org/TR/wai-aria-1.1/#gridcell
 */
export class GridCell extends RoleGridCell
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.tabIndex = TABINDEX_INITIAL_VALUE
    this.on('focus', this.onFocus)
    this.on('keydown', this.onKeyDown)
    this.on('mousemove', this.onMouseMove)
    this.on('mousedown', this.onMouseDown)
  }

  /**
   * @param {FocusEvent} event
   */
  onFocus(event) {
    const grid = this.grid
    if(this.selected !== undefined) {
      grid.gridCells.forEach(cell => cell.selected = false)
      this.selected = true
    }
    grid.activeDescendant = this
    grid.gridCells.forEach(cell => cell.tabIndex = cell === this? 0 : -1)
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseDown(event) {
    if(!event.shiftKey) return
    const grid = this.grid
    const focusedCell = grid.focusedCell
    if(!focusedCell) return
    event.preventDefault()
    if(this.disabled) return
    const row = this.row
    if(grid.multiSelectable) {
      if(row.multiSelectable) {
        grid.updateSelection(this)
      }
      else grid.updateSelection(focusedCell.column[this.rowIndex])
    }
    else if(row.multiSelectable) {
      grid.updateSelection(focusedCell.row.cells[this.colIndex])
    }
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseMove(event) {
    if(event.buttons !== 1 || this.disabled) return
    const grid = this.grid
    const row = this.row
    const focusedCell = grid.focusedCell
    if(!focusedCell) return
    if(grid.multiSelectable) {
      if(row.multiSelectable) {
        grid.updateSelection(this)
      }
      else grid.updateSelection(focusedCell.column[this.rowIndex])
    }
    else if(row.multiSelectable) {
      grid.updateSelection(focusedCell.row.cells[this.colIndex])
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    if(event.code.startsWith('Arrow')) {
      this.onArrowKeyDown(event)
    }
    else if(event.code === 'KeyA') {
      this.onKeyDown_KeyA(event)
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowKeyDown(event) {
    event.preventDefault()
    switch(event.code) {
      case 'ArrowUp':
        this.onArrowUpKeyDown(event)
        break
      case 'ArrowDown':
        this.onArrowDownKeyDown(event)
        break
      case 'ArrowLeft':
        this.onArrowLeftKeyDown(event)
        break
      case 'ArrowRight':
        this.onArrowRightKeyDown(event)
        break
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowUpKeyDown(event) {
    const shiftKey = event.shiftKey
    const grid = this.grid
    const activeDescendant = grid.activeDescendant
    const column = shiftKey && this.row.multiSelectable?
      activeDescendant.column :
      this.column
    const rowIndex = shiftKey?
      activeDescendant.rowIndex :
      this.rowIndex
    const cell = column[rowIndex - 1]
    if(cell && cell instanceof GridCell && !cell.disabled) {
      if(shiftKey && grid.multiSelectable) {
        grid.updateSelection(cell)
      }
      else cell.focus()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowDownKeyDown(event) {
    const shiftKey = event.shiftKey
    const grid = this.grid
    const activeDescendant = grid.activeDescendant
    const column = shiftKey && this.row.multiSelectable?
      activeDescendant.column :
      this.column
    const rowIndex = shiftKey?
      activeDescendant.rowIndex :
      this.rowIndex
    const cell = column[rowIndex + 1]
    if(cell && cell instanceof GridCell && !cell.disabled) {
      if(shiftKey && grid.multiSelectable) {
        grid.updateSelection(cell)
      }
      else cell.focus()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowLeftKeyDown(event) {
    const shiftKey = event.shiftKey
    const grid = this.grid
    const activeDescendant = grid.activeDescendant
    const row = shiftKey && grid.multiSelectable?
      activeDescendant.row :
      this.row
    const colIndex = shiftKey?
      grid.activeDescendant.colIndex :
      this.colIndex
    const cell = row.cells[colIndex - 1]
    if(cell && cell instanceof GridCell && !cell.disabled) {
      if(shiftKey && row.multiSelectable) {
        grid.updateSelection(cell)
      }
      else cell.focus()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowRightKeyDown(event) {
    const shiftKey = event.shiftKey
    const grid = this.grid
    const activeDescendant = grid.activeDescendant
    const row = shiftKey && grid.multiSelectable?
      activeDescendant.row :
      this.row
    const colIndex = shiftKey?
      grid.activeDescendant.colIndex :
      this.colIndex
    const cell = row.cells[colIndex + 1]
    if(cell && cell instanceof GridCell && !cell.disabled) {
      if(shiftKey && row.multiSelectable) {
        grid.updateSelection(cell)
      }
      else cell.focus()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_KeyA(event) {
    if(event.metaKey || event.ctrlKey) {
      event.preventDefault()
      const grid = this.grid
      let cells
      if(grid.multiSelectable) {
        cells = this.row.multiSelectable?
          grid.gridCells :
          this.column
      }
      else if(this.row.multiSelectable) {
        cells = this.row.gridCells
      }
      if(cells && !cells.some(({ disabled }) => disabled)) {
        cells.forEach(cell => cell.selected = true)
      }
    }
  }

  /*/!**
   * @param {boolean} disabled
   *!/
  set disabled(disabled) {
    this.tabIndex = disabled? null : -1
    super.disabled = disabled
  }

  /!**
   * @returns {boolean}
   *!/
  get disabled() {
    return super.disabled
  }*/
}
