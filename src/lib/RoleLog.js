import { AriaLive } from './AriaLive'
import { RoleSection } from './RoleSection'

/**
 * A type of live region where new information is added
 *  in meaningful order and old information may disappear.
 * @see https://www.w3.org/TR/wai-aria-1.1/#log
 */
export class RoleLog extends RoleSection
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
}

RoleLog.abstract = false

export { RoleLog as Log }
