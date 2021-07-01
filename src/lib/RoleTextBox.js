import { AriaActiveDescendant } from './AriaActiveDescendant'
import { AriaAutoComplete } from './AriaAutoComplete'
import { AriaMultiLine } from './AriaMultiLine'
import { AriaPlaceholder } from './AriaPlaceholder'
import { AriaReadOnly } from './AriaReadOnly'
import { AriaRequired } from './AriaRequired'
import { RoleInput } from './RoleInput'

/**
 * A type of input that allows free-form text as its value.
 * @see https://www.w3.org/TR/wai-aria-1.1/#textbox
 */
export class RoleTextBox extends RoleInput
{
  /**
   * @param {*} activeDescendant
   */
  set activeDescendant(activeDescendant) {
    this.setAttr(AriaActiveDescendant, activeDescendant)
  }

  /**
   * @returns {Role|DomElem|null}
   */
  get activeDescendant() {
    return this.getAttr(AriaActiveDescendant)
  }

  /**
   * @param {string} autoComplete
   */
  set autoComplete(autoComplete) {
    this.setAttr(AriaAutoComplete, autoComplete)
  }

  /**
   * @returns {string}
   */
  get autoComplete() {
    return this.getAttr(AriaAutoComplete)
  }

  /**
   * @param {boolean} multiLine
   */
  set multiLine(multiLine) {
    this.setAttr(AriaMultiLine, multiLine)
  }

  /**
   * @returns {boolean}
   */
  get multiLine() {
    return this.getAttr(AriaMultiLine)
  }

  /**
   * @param {string} placeholder
   */
  set placeholder(placeholder) {
    this.setAttr(AriaPlaceholder, placeholder)
  }

  /**
   * @returns {string}
   */
  get placeholder() {
    return this.getAttr(AriaPlaceholder)
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

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(AriaRequired, required)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(AriaRequired)
  }
}

RoleTextBox.abstract = false
