import { AriaLive } from './AriaLive'
import { RoleStatus } from './RoleStatus'

/**
 * A type of live region containing a numerical counter which indicates an amount
 *  of elapsed time from a start point, or the time remaining until an end point.
 * @see https://www.w3.org/TR/wai-aria-1.1/#timer
 */
export class RoleTimer extends RoleStatus
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
    return this.hasAttr(AriaLive)? super.live : 'off'
  }
}
