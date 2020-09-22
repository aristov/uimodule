import { RoleWidget } from './lib'
import './Widget.css'

export class Widget extends RoleWidget
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.tabIndex = this.constructor.tabIndex
    this.on('blur', this.onBlur)
    this.on('click', this.onClick)
    this.on('focus', this.onFocus)
    this.on('focusin', this.onFocusIn)
    this.on('keydown', this.onKeyDown)
    this.on('keyup', this.onKeyUp)
    this.on('mousedown', this.onMouseDown)
  }

  /**
   * @abstract
   */
  activate() {
    void null
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   */
  onBlur(event, elem) {
    this.class.active = false
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onClick(event, elem) {
    if(this.disabled) {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
    event.defaultPrevented || this.activate()
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   * @abstract
   */
  onFocus(event, elem) {
    void null
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   */
  onFocusIn(event, elem) {
    if(this.class.keyboard || !this.doc.docElem.class.keyboard) {
      return
    }
    this.class.keyboard = true
    this.doc.on('mousedown', this._onDocEvent, this)
    this.doc.on('focusin', this._onDocEvent, this)
  }

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyDown(event, elem) {
    super.onKeyDown(event, elem)
    if(this.class.keyboard) {
      return
    }
    this.class.keyboard = true
    this.doc.on('mousedown', this._onDocEvent, this)
    this.doc.on('focusin', this._onDocEvent, this)
  }

  /**
   * @param {MouseEvent|FocusEvent} event
   * @param {DomElem} elem
   * @private
   */
  _onDocEvent(event, elem) {
    if(this.contains(elem) || this.controls.some(item => item.contains(elem))) {
      return
    }
    this.class.keyboard = false
    this.doc.off('mousedown', this._onDocEvent, this)
    this.doc.off('focusin', this._onDocEvent, this)
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onMouseDown(event, elem) {
    if(this.disabled) {
      return
    }
    this.class.active = true
    this.on('mouseleave', this.onMouseLeave, { once : true })
    this.on('mouseup', this.onMouseUp, { once : true })
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onMouseLeave(event, elem) {
    this.class.active = false
    this.off('mouseup', this.onMouseUp)
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onMouseUp(event, elem) {
    this.class.active = false
    this.off('mouseleave', this.onMouseLeave)
  }
}

Widget.prototype.name = null
Widget.abstract = false
Widget.tabIndex = 0
