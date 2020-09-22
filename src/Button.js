import { AriaExpanded, AriaPressed } from './lib'
import { Control } from './Control'
import { Popup } from './Popup'
import { Widget } from './Widget'
import './Button.css'

let undefined

/**
 * @summary An input that allows for user-triggered actions when clicked or pressed.
 * @see https://www.w3.org/TR/wai-aria-1.1/#button
 */
export class Button extends Widget
{
  /**
   * @param {{}} init
   * @return {Control}
   */
  build(init) {
    return this._control = new Control(super.build(init))
  }

  /**
   * Toggle expanded and pressed states if applicable
   */
  activate() {
    const { expanded, pressed } = this
    if(expanded !== undefined) {
      this.expanded = !expanded
    }
    if(pressed !== undefined) {
      this.pressed = !pressed
    }
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onClick(event, elem) {
    if(elem !== this) {
      event.stopImmediatePropagation()
      this.emit('click')
    }
    else super.onClick(event)
  }

  /**
   * @param {MutationRecord} record
   */
  onPopupHidden(record) {
    this.expanded = !this.popup.hidden
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Space(event) {
    event.preventDefault()
    this.class.active = true
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyUp_Space(event) {
    this.class.active = false
    this.click()
  }

  /**
   * @returns {boolean|undefined}
   */
  get expanded() {
    return this.getAttr(AriaExpanded)
  }

  /**
   * @param {boolean|undefined} expanded
   */
  set expanded(expanded) {
    if(expanded === this.expanded) {
      return
    }
    if(this.hasPopup) {
      const popup = this.popup
      if(popup) {
        expanded? popup.show() : popup.close()
      }
    }
    this.setAttr(AriaExpanded, expanded)
  }

  /**
   * @returns {boolean|string|undefined}
   */
  get pressed() {
    return this.getAttr(AriaPressed)
  }

  /**
   * @param {boolean|string|undefined} pressed
   */
  set pressed(pressed) {
    this.setAttr(AriaPressed, pressed)
  }

  /**
   * @returns {Popup|null}
   */
  get popup() {
    return this.controls.find(elem => elem instanceof Popup) || null
  }

  /**
   * @param {Popup|null} popup
   * @param {DomElem|null} [popup.anchor]
   */
  set popup(popup) {
    const _popup = this.popup
    if(_popup) {
      _popup.anchor = null
      _popup.removeAttrObserver('hidden', this.onPopupHidden, this)
      this.controls = this.controls.filter(elem => elem !== _popup)
    }
    if(popup) {
      popup.anchor = this
      popup.addAttrObserver('hidden', this.onPopupHidden, this)
      this.controls = this.controls.concat([popup])
    }
  }

  /**
   * @return {string}
   */
  get text() {
    return this._control? this._control.text : super.text
  }

  /**
   * @param {string} text
   */
  set text(text) {
    if(this._control) {
      this._control.text = text
    }
    else super.text = text
  }
}
