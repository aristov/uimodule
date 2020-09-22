import { Menu } from './Menu'
import { Popup } from './Popup'
import './PopupMenu.css'

export class PopupMenu extends Menu
{
  init(init) {
    super.init(init)
    this.popup || new this.constructor.Popup(this)
  }

  get popup() {
    return this.closest(Popup)
  }

  get open() {
    return !this.popup.hidden
  }

  set open(open) {
    if(open) {
      this.popup.show()
    }
    else this.popup.close()
  }
}

PopupMenu.Popup = Popup
