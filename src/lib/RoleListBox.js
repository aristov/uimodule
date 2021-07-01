import { AriaMultiSelectable } from './AriaMultiSelectable'
import { AriaReadOnly } from './AriaReadOnly'
import { AriaRequired } from './AriaRequired'
import { RoleOption } from './RoleOption'
import { RoleSelect } from './RoleSelect'

/**
 * A widget that allows the user to select one or more items from a list of choices.
 * @see https://www.w3.org/TR/wai-aria-1.1/#listbox
 */
export class RoleListBox extends RoleSelect
{
  /**
   * @param {boolean} multiSelectable
   */
  set multiSelectable(multiSelectable) {
    this.setAttr(AriaMultiSelectable, multiSelectable)
  }

  /**
   * @returns {boolean}
   */
  get multiSelectable() {
    return this.getAttr(AriaMultiSelectable)
  }

  /**
   * @param {RoleOption[]} options
   */
  set options(options) {
    this.children = options
  }

  /**
   * @returns {RoleOption[]}
   */
  get options() {
    return this.findAll(RoleOption)
  }

  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    super.orientation = orientation
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return super.orientation || 'vertical'
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

  /**
   * @returns {RoleOption[]}
   */
  get selectedOptions() {
    return this.findAll(RoleOption, ({ selected }) => selected)
  }

  /**
   * @returns {RoleOption[]}
   */
  get checkedOptions() {
    return this.findAll(RoleOption, ({ checked }) => checked)
  }
}

RoleListBox.abstract = false
