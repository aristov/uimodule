import { AriaActiveDescendant } from './AriaActiveDescendant'
import { AriaLevel } from './AriaLevel'
import { AriaMultiSelectable } from './AriaMultiSelectable'
import { AriaReadOnly } from './AriaReadOnly'
import { RoleCell } from './RoleCell'
import { RoleGridCell } from './RoleGridCell'
import { RoleRow } from './RoleRow'
import { RoleRowGroup } from './RoleRowGroup'
import { RoleTable } from './RoleTable'

/**
 * A composite widget containing a collection of one or more rows with one
 *  or more cells where some or all cells in the grid are focusable by using
 *  methods of two-dimensional navigation, such as directional arrow keys.
 * @see https://www.w3.org/TR/wai-aria-1.1/#grid
 * @mixes RoleComposite
 */
export class RoleGrid extends RoleTable
{
  /**
   * @param {RoleGridCell} activeDescendant
   */
  set activeDescendant(activeDescendant) {
    this.setAttr(AriaActiveDescendant, activeDescendant)
  }

  /**
   * @returns {RoleGridCell}
   */
  get activeDescendant() {
    return this.getAttr(AriaActiveDescendant)
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
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(AriaReadOnly, readOnly)
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(AriaReadOnly)
  }

  /**
   * Gell all selected cells
   * @returns {RoleGridCell[]}
   */
  get selectedCells() {
    return this.gridCells.filter(({ selected }) => selected)
  }
}

export { RoleGrid as Grid }

RoleCell.Grid = RoleGrid
RoleRow.Grid = RoleGrid
RoleRowGroup.Grid = RoleGrid
