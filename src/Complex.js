import { Widget } from './Widget'
import './Complex.css'

export class Complex extends Widget
{
  init(init) {
    super.init(init)
    this.on('change', this.onChange)
  }

  focus() {
    const widget = this.find(Widget, ({ disabled, hidden }) => !disabled && !hidden)
    widget && widget.focus()
  }

  onChange(event, elem) {
    if(elem === this) {
      return
    }
    event.stopImmediatePropagation()
    this.onWidgetChange(event, elem)
  }

  onWidgetChange(event, elem) {
    this.emit('change')
  }

  get disabled() {
    return super.disabled
  }

  set disabled(disabled) {
    this.findAll(Widget).forEach(widget => widget.disabled = disabled)
    super.disabled = disabled
  }
}

Complex.tabIndex = null
