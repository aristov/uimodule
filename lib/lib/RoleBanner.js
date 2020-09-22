import { RoleLandmark } from './RoleLandmark'

/**
 * A region that contains mostly site-oriented content, rather than page-specific content.
 * @see https://www.w3.org/TR/wai-aria-1.1/#banner
 */
export class RoleBanner extends RoleLandmark
{
  /**
   * @returns {RoleApplication|*}
   */
  get application() {
    return this.closest(RoleBanner.Application)
  }

  /**
   * @returns {RoleDocument|*}
   */
  get document() {
    return this.closest(RoleBanner.Document)
  }
}

RoleBanner.abstract = false

export { RoleBanner as Banner }
