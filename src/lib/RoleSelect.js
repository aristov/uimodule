import { AriaExpanded } from './AriaExpanded'
import { AriaOrientation } from './AriaOrientation'
import { RoleComposite } from './RoleComposite'

/**
 * A form widget that allows the user to make selections from a set of choices.
 * @see https://www.w3.org/TR/wai-aria-1.1/#select
 * @mixes RoleGroup
 * @abstract
 */
export class RoleSelect extends RoleComposite
{
  /**
   * @param {boolean|undefined} expanded
   */
  set expanded(expanded) {
    this.setAttr(AriaExpanded, expanded)
  }

  /**
   * @returns {boolean|undefined}
   */
  get expanded() {
    return this.getAttr(AriaExpanded)
  }

  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    this.setAttr(AriaOrientation, orientation)
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return this.getAttr(AriaOrientation)
  }
}
