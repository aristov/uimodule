import { AriaAtomic } from './AriaAtomic'
import { AriaBusy } from './AriaBusy'
import { AriaControls } from './AriaControls'
import { AriaCurrent } from './AriaCurrent'
import { AriaDescribedBy } from './AriaDescribedBy'
import { AriaDetails } from './AriaDetails'
import { AriaDisabled } from './AriaDisabled'
import { AriaDropEffect } from './AriaDropEffect'
import { AriaErrorMessage } from './AriaErrorMessage'
import { AriaFlowTo } from './AriaFlowTo'
import { AriaGrabbed } from './AriaGrabbed'
import { AriaHasPopup } from './AriaHasPopup'
import { AriaHidden } from './AriaHidden'
import { AriaInvalid } from './AriaInvalid'
import { AriaKeyShortcuts } from './AriaKeyShortcuts'
import { AriaLabel } from './AriaLabel'
import { AriaLabelledBy } from './AriaLabelledBy'
import { AriaLive } from './AriaLive'
import { AriaOwns } from './AriaOwns'
import { AriaRelevant } from './AriaRelevant'
import { AriaRoleDescription } from './AriaRoleDescription'
import { Role } from './Role'

/**
 * The base role from which all other roles in this taxonomy inherit.
 * @see https://www.w3.org/TR/wai-aria-1.1/#roletype
 * @abstract
 */
export class RoleRoleType extends Role
{
  /**
   * @param {constructor|string} object
   * @returns {*|null}
   */
  closest(object) {
    const elem = super.closest(object)
    if(elem) {
      return elem
    }
    return this.doc.find(object, elem => elem.getAttr(AriaOwns).includes(this))
  }

  /**
   * @param {boolean} atomic
   */
  set atomic(atomic) {
    this.setAttr(AriaAtomic, atomic)
  }

  /**
   * @returns {boolean}
   */
  get atomic() {
    return this.getAttr(AriaAtomic)
  }

  /**
   * @param {boolean} busy
   */
  set busy(busy) {
    this.setAttr(AriaBusy, busy)
  }

  /**
   * @returns {boolean}
   */
  get busy() {
    return this.getAttr(AriaBusy)
  }

  /**
   * @param {*} controls
   */
  set controls(controls) {
    this.setAttr(AriaControls, controls)
  }

  /**
   * @returns {*[]}
   */
  get controls() {
    return this.getAttr(AriaControls)
  }

  /**
   * @param {string} current
   */
  set current(current) {
    this.setAttr(AriaCurrent, current)
  }

  /**
   * @returns {string}
   */
  get current() {
    return this.getAttr(AriaCurrent)
  }

  /**
   * @param {*} describedBy
   */
  set describedBy(describedBy) {
    this.setAttr(AriaDescribedBy, describedBy)
  }

  /**
   * @returns {*[]}
   */
  get describedBy() {
    return this.getAttr(AriaDescribedBy)
  }

  /**
   * @param {*} details
   */
  set details(details) {
    this.setAttr(AriaDetails, details)
  }

  /**
   * @returns {DomElem|*|null}
   */
  get details() {
    return this.getAttr(AriaDetails)
  }

  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    this.setAttr(AriaDisabled, disabled)
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return this.getAttr(AriaDisabled)
  }

  /**
   * @param {array|string|null} dropEffect
   * @deprecated
   */
  set dropEffect(dropEffect) {
    this.setAttr(AriaDropEffect, dropEffect)
  }

  /**
   * @returns {array|string|null}
   * @deprecated
   */
  get dropEffect() {
    return this.getAttr(AriaDropEffect)
  }

  /**
   * @param {*} errorMessage
   */
  set errorMessage(errorMessage) {
    this.setAttr(AriaErrorMessage, errorMessage)
  }

  /**
   * @returns {DomElem|*|null}
   */
  get errorMessage() {
    return this.getAttr(AriaErrorMessage)
  }

  /**
   * @param {*} flowTo
   */
  set flowTo(flowTo) {
    this.setAttr(AriaFlowTo, flowTo)
  }

  /**
   * @returns {DomElem|*|null}
   */
  get flowTo() {
    return this.getAttr(AriaFlowTo)
  }

  /**
   * @param {boolean|undefined} grabbed
   * @deprecated
   */
  set grabbed(grabbed) {
    this.setAttr(AriaGrabbed, grabbed)
  }

  /**
   * @returns {boolean|undefined}
   * @deprecated
   */
  get grabbed() {
    return this.getAttr(AriaGrabbed)
  }

  /**
   * @param {string} hasPopup
   */
  set hasPopup(hasPopup) {
    this.setAttr(AriaHasPopup, hasPopup)
  }

  /**
   * @returns {string}
   */
  get hasPopup() {
    return this.getAttr(AriaHasPopup)
  }

  /**
   * @param {boolean|undefined} hidden
   */
  set hidden(hidden) {
    this.setAttr(AriaHidden, hidden)
  }

  /**
   * @returns {boolean|undefined}
   */
  get hidden() {
    return this.getAttr(AriaHidden)
  }

  /**
   * @param {boolean|string} invalid
   */
  set invalid(invalid) {
    this.setAttr(AriaInvalid, invalid)
  }

  /**
   * @returns {boolean|string}
   */
  get invalid() {
    return this.getAttr(AriaInvalid)
  }

  /**
   * @param {string} keyShortcuts
   */
  set keyShortcuts(keyShortcuts) {
    this.setAttr(AriaKeyShortcuts, keyShortcuts)
  }

  /**
   * @returns {string}
   */
  get keyShortcuts() {
    return this.getAttr(AriaKeyShortcuts)
  }

  /**
   * @param {string} label
   */
  set label(label) {
    this.setAttr(AriaLabel, label)
  }

  /**
   * @returns {string}
   */
  get label() {
    return this.getAttr(AriaLabel)
  }

  /**
   * @param {*} labelledBy {*[]}
   */
  set labelledBy(labelledBy) {
    this.setAttr(AriaLabelledBy, labelledBy)
  }

  /**
   * @returns {*[]}
   */
  get labelledBy() {
    return this.getAttr(AriaLabelledBy)
  }

  /**
   * @param {string} live
   */
  set live(live) {
    this.setAttr(AriaLive, live)
  }

  /**
   * @returns {string}
   */
  get live() {
    return this.getAttr(AriaLive)
  }

  /**
   * @param {DomNode[]|*} owns
   */
  set owns(owns) {
    this.setAttr(AriaOwns, owns)
  }

  /**
   * @returns {DomNode[]|*}
   */
  get owns() {
    return this.getAttr(AriaOwns)
  }

  /**
   * @param {string[]} relevant
   */
  set relevant(relevant) {
    this.setAttr(AriaRelevant, relevant)
  }

  /**
   * @returns {string[]}
   */
  get relevant() {
    return this.getAttr(AriaRelevant)
  }

  /**
   * @param {string} roleDescription
   */
  set roleDescription(roleDescription) {
    this.setAttr(AriaRoleDescription, roleDescription)
  }

  /**
   * @returns {string}
   */
  get roleDescription() {
    return this.getAttr(AriaRoleDescription)
  }
}
