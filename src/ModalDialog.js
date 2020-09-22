import { Dialog } from './Dialog'

export class ModalDialog extends Dialog
{
  init(init) {
    super.init(init)
    this.modal = true
  }
}
