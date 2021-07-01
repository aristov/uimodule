import { AriaAtomic } from './AriaAtomic'
import { AriaLive } from './AriaLive'
import { RoleSection } from './RoleSection'

/**
 * A type of live region with important, and usually time-sensitive, information.
 * @see https://www.w3.org/TR/wai-aria-1.1/#alert
 */
export class RoleAlert extends RoleSection
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
    return this.hasAttr(AriaLive)? super.live : 'assertive'
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

RoleAlert.abstract = false
