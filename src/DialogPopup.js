import './oncancel'
import { Popup } from './Popup'

export class DialogPopup extends Popup
{
  /**
   * Drop the popup
   */
  drop() {
    const dialog = this.dialog
    dialog && dialog.emit('close')
    super.drop()
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onDocClick(event, elem) {
    if(this.anchor && this.anchor.contains(elem)) {
      return
    }
    const dialog = this.dialog
    if(dialog.contains(elem)) {
      return
    }
    const popup = elem.closest(Popup)
    // if(popup && popup !== this && popup.modal && !popup.contains(this)) {
    if(popup && popup !== this && !popup.contains(this)) {
      return
    }
    dialog.emit('cancel') && dialog.close()
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   */
  onDocFocusIn(event, elem) {
    if(elem === this) {
      return
    }
    if(this.anchor && this.anchor.contains(elem)) {
      return
    }
    const dialog = this.dialog
    if(dialog.contains(elem)) {
      return
    }
    const popup = elem.closest(Popup)
    // if(popup && popup.modal && !popup.contains(this)) {
    if(popup && !popup.contains(this)) {
      return
    }
    dialog.emit('cancel') && dialog.close()
  }

  /**
   * @param {KeyboardEvent} event
   */
  onDocKeyDown(event) {
    if(event.code === 'Escape') {
      const dialog = this.dialog
      dialog.emit('cancel') && dialog.close()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    if(event.code === 'Escape') {
      event.stopPropagation()
      const dialog = this.dialog
      dialog.emit('cancel') && dialog.close()
    }
  }

  /**
   * @return {Dialog}
   */
  get dialog() {
    return this.find(DialogPopup.Dialog)
  }

  /**
   * @returns {boolean|null}
   */
  get hidden() {
    return super.hidden
  }

  /**
   * @param {boolean|null} hidden
   */
  set hidden(hidden) {
    if(hidden === this.hidden) {
      return
    }
    const dialog = this.dialog
    if(super.hidden = hidden) {
      dialog.close()
      return
    }
    dialog.open = true
    dialog.modal && setTimeout(() => dialog.setFocus())
  }
}
