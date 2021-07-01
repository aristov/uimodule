import { AriaExpanded } from './AriaExpanded'
import { RoleCommand } from './RoleCommand'

/**
 * An interactive reference to an internal or external resource that,
 *  when activated, causes the user agent to navigate to that resource.
 * @see https://www.w3.org/TR/wai-aria-1.1/#link
 */
export class RoleLink extends RoleCommand
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

RoleLink.abstract = false
