import { AriaActiveDescendant } from './AriaActiveDescendant'
import { RoleWidget } from './RoleWidget'

/**
 * A widget that may contain navigable descendants or owned children.
 * @see https://www.w3.org/TR/wai-aria-1.1/#composite
 * @abstract
 */
export class RoleComposite extends RoleWidget
{
  /**
   * @param {*} activeDescendant
   */
  set activeDescendant(activeDescendant) {
    this.setAttr(AriaActiveDescendant, activeDescendant)
  }

  /**
   * @returns {DomElem|null}
   */
  get activeDescendant() {
    return this.getAttr(AriaActiveDescendant)
  }
}
