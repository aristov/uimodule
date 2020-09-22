import { AriaPosInSet } from './AriaPosInSet'
import { AriaSetSize } from './AriaSetSize'
import { RoleDocument } from './RoleDocument'

/**
 * A section of a page that consists of a composition that forms
 *  an independent part of a document, page, or site.
 * @see https://www.w3.org/TR/wai-aria-1.1/#article
 */
export class RoleArticle extends RoleDocument
{
  /**
   * @returns {RoleFeed|*|null}
   */
  get feed() {
    return this.closest(RoleArticle.Feed)
  }

  /**
   * @param {number} posInSet
   */
  set posInSet(posInSet) {
    this.setAttr(AriaPosInSet, posInSet)
  }

  /**
   * @returns {number}
   */
  get posInSet() {
    return this.getAttr(AriaPosInSet)
  }

  /**
   * @param {number} setSize
   */
  set setSize(setSize) {
    this.setAttr(AriaSetSize, setSize)
  }

  /**
   * @returns {number}
   */
  get setSize() {
    return this.getAttr(AriaSetSize)
  }
}

export { RoleArticle as Article }
