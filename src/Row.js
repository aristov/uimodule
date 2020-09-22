import { RoleRow } from './lib/ariamodule'

/**
 * @summary A row of cells in a tabular container.
 * @see https://www.w3.org/TR/wai-aria-1.1/#row
 */
export class Row extends RoleRow
{
  /**
   * @param {FocusEvent} event
   */
  onFocus(event) {
    const parent = this.rowGroup || this.table
    for(const row of parent.rows) {
      row.tabIndex = row === this? 0 : -1
      if(row.selected !== undefined) {
        row.selected = row === this
      }
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    if(event.target === this.node) {
      switch(event.key) {
        case ' ':
          this.onKeyDown_Space(event)
          break
        case 'Enter':
          this.onKeyDown_Enter(event)
          break
        case 'ArrowUp':
          this.onArrowUpKeyDown(event)
          break
        case 'ArrowDown':
          this.onArrowDownKeyDown(event)
          break
      }
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Space(event) {
    event.preventDefault()
    const handler = event => {
      this.classList.remove('active')
      this.click()
      this.off('keyup', handler)
    }
    this.classList.add('active')
    this.on('keyup', handler)
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Enter(event) {
    this.click()
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowUpKeyDown(event) {
    event.preventDefault()
    const parent = this.rowGroup || this.table
    const rows = parent.rows.filter(({ node, disabled }) => {
      return !disabled && getComputedStyle(node).display !== 'none'
    })
    const row = rows[rows.indexOf(this) - 1]
    row && row.focus()
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowDownKeyDown(event) {
    event.preventDefault()
    const parent = this.rowGroup || this.table
    const rows = parent.rows.filter(({ node, disabled }) => {
      return !disabled && getComputedStyle(node).display !== 'none'
    })
    const row = rows[rows.indexOf(this) + 1]
    row && row.focus()
  }

  /**
   * @param {number|null} tabIndex
   */
  set tabIndex(tabIndex) {
    if(tabIndex !== null) {
      this.on('focus', this.onFocus)
      this.on('keydown', this.onKeyDown)
    }
    super.tabIndex = tabIndex
  }

  /**
   * @returns {number|null}
   */
  get tabIndex() {
    return super.tabIndex
  }
}
