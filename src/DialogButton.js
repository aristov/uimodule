import { Dialog } from './Dialog'
import { Button } from './Button'

export class DialogButton extends Button
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.expanded = false
    this.hasPopup = 'dialog'
  }

  /**
   * Create dialog if needed, toggle the dialog
   */
  activate() {
    if(!this.dialog) {
      this.dialog = new this.constructor.Dialog
    }
    super.activate()
  }

  /**
   * @returns {Dialog|null}
   */
  get dialog() {
    return this.controls.find(elem => elem instanceof Dialog) || null
  }

  /**
   * @param {Dialog} dialog
   */
  set dialog(dialog) {
    if(dialog) {
      this.controls = dialog
      this.popup = dialog.popup
      return
    }
    this.popup = null
    this.controls = null
  }
}

DialogButton.Dialog = Dialog
