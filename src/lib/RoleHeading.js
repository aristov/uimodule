import { AriaLevel } from './AriaLevel'
import { RoleSectionHead } from './RoleSectionHead'

const DEFAULT_LEVEL = 2

/**
 * A heading for a section of the page.
 * @see https://www.w3.org/TR/wai-aria-1.1/#heading
 */
export class RoleHeading extends RoleSectionHead
{
  /**
   * @param {number} level
   */
  set level(level) {
    this.setAttr(AriaLevel, level)
  }

  /**
   * @returns {number}
   */
  get level() {
    return this.getAttr(AriaLevel) || DEFAULT_LEVEL
  }
}

RoleHeading.abstract = false
