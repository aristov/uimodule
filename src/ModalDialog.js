import { Dialog } from './Dialog'
import './ModalDialog.css'

export class ModalDialog extends Dialog
{
  init(init) {
    super.init(init)
    this.modal = true
  }
}
