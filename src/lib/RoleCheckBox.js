import { AriaChecked } from './AriaChecked'
import { AriaReadOnly } from './AriaReadOnly'
import { RoleInput } from './RoleInput'

/**
 * A checkable input that has three possible values: true, false, or mixed.
 * @see https://www.w3.org/TR/wai-aria-1.1/#checkbox
 */
export class RoleCheckBox extends RoleInput
{
  /**
   * @param {boolean|string} checked
   */
  set checked(checked) {
    this.setAttr(AriaChecked, checked)
  }

  /**
   * @returns {boolean|string}
   */
  get checked() {
    return this.getAttr(AriaChecked) || false
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(AriaReadOnly, readOnly)
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(AriaReadOnly)
  }
}

RoleCheckBox.abstract = false
