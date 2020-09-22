import { GridCell } from './GridCell'
import './DateCell.css'

export class DateCell extends GridCell
{
  init(init) {
    this.on('click', this.onClick)
    super.init(init)
  }

  onClick(event) {
    if(this.disabled) {
      event.stopImmediatePropagation()
    }
  }

  onFocus() {
    void null
  }

  onKeyDown(event) {
    super.onKeyDown(...arguments)
    if(event.code === 'Space' || event.code === 'Enter') {
      this.click()
    }
  }

  onArrowKeyDown(event) {
    event.stopPropagation()
    super.onArrowKeyDown(...arguments)
  }

  set value(value) {
    this.dataset.value = value
  }

  get value() {
    return this.dataset.value
  }
}
