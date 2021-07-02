import {
  AriaActiveDescendant,
  AriaAutoComplete,
  AriaExpanded,
  AriaMultiLine,
  AriaPlaceholder,
  AriaReadOnly,
  AriaRequired,
} from './lib'
import { Control } from './Control'
import { Edit } from './Edit'
import { Placeholder } from './Placeholder'
import { Popup } from './Popup'
import { Widget } from './Widget'
import './TextBox.css'

let undefined

/**
 * @summary A type of input that allows free-form text as its value.
 * @see https://www.w3.org/TR/wai-aria-1.1/#textbox
 */
export class TextBox extends Widget
{
  /**
   * @param {{}} init
   */
  build(init) {
    return this._control = new Control(this._edit = new this.constructor.Edit)
  }

  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this._value = ''
    this._placeholder = null
    this.class.blank = true
    this.on('input', this.onInput)
    this.on('focusin', this.onFocusIn)
    this.on('focusout', this.onFocusOut)
    this._observer = new MutationObserver(this.onEditUpdate.bind(this))
    this._observer.observe(this._edit.node, {
      childList : true,
      characterData : true,
      subtree : true,
    })
  }

  /**
   * @param {boolean} [keepNode=false]
   */
  destroy(keepNode = false) {
    this._observer.disconnect()
    super.destroy(keepNode)
  }

  /**
   * Activate widget
   */
  activate() {
    const expanded = this.expanded
    if(expanded !== undefined) {
      this.expanded = !expanded
    }
  }

  checkValidity() {
    return !this.required || !!this.value
  }

  reportValidity() {
    return !(this.invalid = !this.checkValidity())
  }

  /**
   * @param {MutationRecord[]} records
   */
  onEditUpdate(records) {
    this.class.blank = !this._edit.text
  }

  /**
   * @param {FocusEvent} event
   */
  onFocus(event) {
    this._edit.focus()
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   */
  onFocusIn(event, elem) {
    this._value = this.value
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   */
  onFocusOut(event, elem) {
    if(this.value !== this._value) {
      this.emit('change')
    }
  }

  /**
   * @param {InputEvent} event
   * @param {DomElem} elem
   */
  onInput(event, elem) {
    this.invalid = false
  }

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyDown_Enter(event, elem) {
    this.multiLine? event.stopPropagation() : event.preventDefault()
    if(this.value === this._value) {
      return
    }
    this._value = this.value
    this.emit('change')
  }

  /**
   * @param {MutationRecord} record
   */
  onPopupHidden(record) {
    this.expanded = !this.popup.hidden
  }

  /**
   * @returns {DomElem|null}
   */
  get activeDescendant() {
    return this.getAttr(AriaActiveDescendant)
  }

  /**
   * @param {DomElem|null} activeDescendant
   */
  set activeDescendant(activeDescendant) {
    this.setAttr(AriaActiveDescendant, activeDescendant)
  }

  /**
   * @returns {string}
   */
  get autoComplete() {
    return this.getAttr(AriaAutoComplete)
  }

  /**
   * @param {string} autoComplete
   */
  set autoComplete(autoComplete) {
    this.setAttr(AriaAutoComplete, autoComplete)
  }

  /**
   * @returns {*[]}
   */
  get controls() {
    return super.controls
  }

  /**
   * @param {*} controls
   */
  set controls(controls) {
    const oldPopup = this.popup
    super.controls = controls
    const newPopup = this.popup
    if(oldPopup !== newPopup) {
      oldPopup && oldPopup.destroy()
      newPopup && newPopup.addAttrObserver('hidden', this.onPopupHidden, this)
    }
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return super.disabled
  }

  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    super.disabled = this._edit.disabled = disabled
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
   * @return {string}
   */
  get inputMode() {
    return this._edit.inputMode
  }

  /**
   * @param {string} inputMode
   */
  set inputMode(inputMode) {
    this._edit.inputMode = inputMode
  }

  /**
   * @returns {boolean}
   */
  get multiLine() {
    return this.getAttr(AriaMultiLine)
  }

  /**
   * @param {boolean} multiLine
   */
  set multiLine(multiLine) {
    this.setAttr(AriaMultiLine, multiLine)
  }

  /**
   * @returns {string}
   */
  get placeholder() {
    return this.getAttr(AriaPlaceholder)
  }

  /**
   * @param {string} placeholder
   */
  set placeholder(placeholder) {
    this.setAttr(AriaPlaceholder, placeholder)
    if(this._placeholder) {
      this._placeholder.text = placeholder
      return
    }
    this._edit.before(this._placeholder = new this.constructor.Placeholder(placeholder))
  }

  /**
   * @returns {Popup|null}
   */
  get popup() {
    return this.controls.find(elem => elem instanceof Popup) || null
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(AriaReadOnly)
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(AriaReadOnly, this._edit.readOnly = readOnly)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(AriaRequired)
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(AriaRequired, required)
  }

  /**
   * @return {string}
   */
  get text() {
    return this._edit.text
  }

  /**
   * @param {string} text
   */
  set text(text) {
    this._edit.text = this.multiLine?
      text :
      text && String(text).replace(/\s/g, ' ')
  }

  /**
   * @returns {string}
   */
  get value() {
    return this.text
  }

  /**
   * @param {string} value
   */
  set value(value) {
    this.text = this._value = value
  }
}

TextBox.tabIndex = -1
TextBox.Edit = Edit
TextBox.Placeholder = Placeholder
TextBox.Popup = Popup
