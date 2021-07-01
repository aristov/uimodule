import { AriaAtomic } from './AriaAtomic'
import { AriaLive } from './AriaLive'
import { RoleSection } from './RoleSection'

/**
 * A type of live region whose content is advisory information
 *  for the user but is not important enough to justify an alert,
 *  often but not necessarily presented as a status bar.
 * @see https://www.w3.org/TR/wai-aria-1.1/#status
 */
export class RoleStatus extends RoleSection
{
  /**
   * @param {string} live
   */
  set live(live) {
    super.live = live
  }

  /**
   * @returns {string}
   */
  get live() {
    return this.hasAttr(AriaLive)? super.live : 'polite'
  }

  /**
   * @param {boolean} atomic
   */
  set atomic(atomic) {
    super.atomic = atomic
  }

  /**
   * @returns {boolean}
   */
  get atomic() {
    return this.hasAttr(AriaAtomic)? super.atomic : true
  }
}

RoleStatus.abstract = false
