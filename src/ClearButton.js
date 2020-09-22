import { Button } from './Button'
import './ClearButton.css'

export class ClearButton extends Button
{
  activate() {
    const widget = this.widget
    if(!widget || !widget.value) {
      return
    }
    widget.value = ''
    widget.emit('change')
  }

  onValue(record, elem) {
    this.disabled = !elem.value
  }

  get widget() {
    return this.controls[0] || null
  }

  set widget(widget) {
    const oldWidget = this.widget
    oldWidget && oldWidget.removeAttrObserver('data-value', this.onValue, this)
    widget && widget.addAttrObserver('data-value', this.onValue, this)
    super.controls = widget
  }
}

ClearButton.tabIndex = null
