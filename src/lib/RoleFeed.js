import { RoleArticle } from './RoleArticle'
import { RoleList } from './RoleList'

/**
 * A scrollable list of articles where scrolling may cause
 *  articles to be added to or removed from either end of the list.
 * @see https://www.w3.org/TR/wai-aria-1.1/#feed
 */
export class RoleFeed extends RoleList
{
  /**
   * @returns {array.RoleArticle|*}
   */
  get articles() {
    return this.findAll(RoleArticle)
  }
}

RoleArticle.Feed = RoleFeed
