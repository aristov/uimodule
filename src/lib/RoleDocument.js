import { AriaExpanded } from './AriaExpanded'
import { RoleBanner } from './RoleBanner'
import { RoleContentInfo } from './RoleContentInfo'
import { RoleMain } from './RoleMain'
import { RoleStructure } from './RoleStructure'

/**
 * An element containing content that assistive
 *  technology users may want to browse in a reading mode.
 * @see https://www.w3.org/TR/wai-aria-1.1/#document
 */
export class RoleDocument extends RoleStructure
{
  /**
   * @returns {RoleBanner|*|null}
   */
  get banner() {
    return this.find(RoleBanner)
  }

  /**
   * @returns {RoleContentInfo|*|null}
   */
  get contentInfo() {
    return this.find(RoleContentInfo)
  }

  /**
   * @returns {RoleMain|*|null}
   */
  get main() {
    return this.find(RoleMain)
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

RoleDocument.abstract = false

RoleBanner.Document = RoleDocument
