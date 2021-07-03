import { RoleDialog } from './lib'
import { DialogPopup } from './DialogPopup'
// import { ProgressBar } from './ProgressBar'
import './Dialog.css'

let undefined

/**
 * @summary A dialog is a descendant window of the primary window of a web application.
 * @see https://www.w3.org/TR/wai-aria-1.1/#dialog
 */
export class Dialog extends RoleDialog
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.returnValue = null
    this.popup || new this.constructor.Popup(this)
    this.on('keydown', this.onKeyDown)
  }

  /**
   * @param {{}} init
   * @param {boolean} [init.open]
   */
  assign(init) {
    const open = init.open
    delete init.open
    super.assign(init)
    open && (this.open = true)
  }

  /**
   * Show the dialog
   */
  show() {
    if(this.open) {
      return
    }
    this.modal = false
    this.open = true
  }

  /**
   * Show the dialog as a modal
   */
  showModal() {
    if(this.open) {
      return
    }
    this.modal = true
    this.open = true
  }

  /**
   * @param {any} [returnValue]
   */
  close(returnValue) {
    if(!this.open) {
      return
    }
    if(returnValue !== undefined) {
      this.returnValue = returnValue
    }
    this.open = false
  }

  /**
   * Set focus on autofocus elem or the first tab sequence elem
   */
  setFocus() {
    if(!this.node) {
      return
    }
    const elem = this.find('[autofocus]')
    this.removeAttr('tabindex')
    if(elem) {
      elem.focus()
      return
    }
    const elems = this.getTabSequence()
    if(elems[0]) {
      elems[0].focus()
      return
    }
    const pending = this.findAll('.pending')
    this.node.tabIndex = -1
    this.focus()
    if(pending.length) {
      this.busy = true
      Promise.all(pending.map(({ promise }) => promise))
      .then(() => this.setFocus())
      .finally(() => this.busy = false)
    }
  }

  /**
   * @param {DomElem} [elem=this]
   * @returns {DomElem[]}
   */
  getTabSequence(elem = this) {
    const result = []
    for(const child of elem.children) {
      if(child.computedStyle.display === 'none') {
        continue
      }
      const node = child.node
      if(node.isContentEditable) {
        result.push(child)
      }
      else if(node.tabIndex > -1) {
        if(node.disabled) {
          continue
        }
        if(node.localName === 'input' && node.type === 'hidden') {
          continue
        }
        if('href' in node && !node.href) {
          continue
        }
        result.push(child)
      }
      if(node.hasChildNodes()) {
        result.push(...this.getTabSequence(child))
      }
    }
    return result
  }

  /*destroy(keepNode = false) {
    if(keepNode) {
      super.destroy(true)
    }
    else this.popup.destroy()
  }*/

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyDown_Tab(event, elem) {
    if(!this.modal) {
      return
    }
    const elems = this.getTabSequence()
    if(!elems.length) {
      event.preventDefault()
      return
    }
    const first = elems[0]
    const last = elems[elems.length - 1]
    if(event.shiftKey && elem === first) {
      event.preventDefault()
      last.focus()
    }
    else if(!event.shiftKey && elem === last) {
      event.preventDefault()
      first.focus()
    }
  }

  /**
   * @returns {DomElem}
   */
  get anchor() {
    return this.popup.anchor
  }

  /**
   * @param {DomElem} anchor
   */
  set anchor(anchor) {
    this.popup.anchor = anchor
  }

  /**
   * @return {string}
   */
  get direction() {
    return this.popup.direction
  }

  /**
   * @param {string} direction
   */
  set direction(direction) {
    this.popup.direction = direction
  }

  /**
   * @returns {boolean}
   */
  get modal() {
    return super.modal
  }

  /**
   * @param {boolean} modal
   */
  set modal(modal) {
    const popup = this.popup || new this.constructor.Popup(this)
    super.modal = popup.modal = modal
  }

  /**
   * @return {boolean}
   */
  get open() {
    return this.classList.contains('open')
  }

  /**
   * @param {boolean} open
   */
  set open(open) {
    if(open === this.open) {
      return
    }
    this.classList.toggle('open', open)?
      this.popup.show() :
      this.popup.close()
  }

  /**
   * @returns {DomElem}
   */
  get parent() {
    return this.popup.parent
  }

  /**
   * @param {DomElem} parent
   */
  set parent(parent) {
    this.popup.parent = parent
  }

  /**
   * @returns {DialogPopup}
   */
  get popup() {
    return this.closest(this.constructor.Popup)
  }
}

DialogPopup.Dialog = Dialog
Dialog.Popup = DialogPopup
// Dialog.PendingChild = ProgressBar
