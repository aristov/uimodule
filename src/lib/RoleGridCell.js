import { AriaReadOnly } from './AriaReadOnly'
import { AriaRequired } from './AriaRequired'
import { AriaSelected } from './AriaSelected'
import { RoleCell } from './RoleCell'

/**
 * A cell in a grid or treegrid.
 * @see https://www.w3.org/TR/wai-aria-1.1/#gridcell
 * @mixes RoleWidget
 */
export class RoleGridCell extends RoleCell
{
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
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(AriaRequired, required)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(AriaRequired)
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
}
