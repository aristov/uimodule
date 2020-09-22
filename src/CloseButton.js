import { Button } from './Button'
import { Popup } from './Popup'
import './CloseButton.css'

export class CloseButton extends Button
{
  init(init) {
    super.init(init)
    this.tabIndex = -1
    this.node.title = 'Закрыть'
  }

  activate() {
    this.closest(Popup).close()
  }
}
