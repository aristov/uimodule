import { AriaExpanded } from './AriaExpanded'
import { RoleStructure } from './RoleStructure'

/**
 * A renderable structural containment unit in a document or application.
 * @see https://www.w3.org/TR/wai-aria-1.1/#section
 * @abstract
 */
export class RoleSection extends RoleStructure
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
}

export { RoleSection as Section }
