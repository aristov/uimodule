import { AriaActiveDescendant } from './AriaActiveDescendant'
import { AriaExpanded } from './AriaExpanded'
import { RoleBanner } from './RoleBanner'
import { RoleStructure } from './RoleStructure'

/**
 * A structure containing one or more focusable elements requiring user input,
 *  such as keyboard or gesture events, that do not follow a standard interaction
 *  pattern supported by a widget role.
 * @see https://www.w3.org/TR/wai-aria-1.1/#application
 */
export class RoleApplication extends RoleStructure
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

RoleApplication.abstract = false

RoleBanner.Application = RoleApplication
