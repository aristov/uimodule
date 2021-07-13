import { Control } from './Control'
import { HtmlInput } from './lib'
import { TextInput } from './TextInput'
import { Widget } from './Widget'
import './TextInputBox.css'

export class TextInputBox extends Widget
{
  init(init) {
    super.init(init)
    this.on('change', this.onChange)
  }

  /**
   * @param {{}} init
   * @return {Control}
   */
  build(init) {
    return this._control = new Control(this._input = new TextInput)
  }

  focus() {
    this._input.focus()
  }

  onChange(event, elem) {
    if(elem === this) {
      return
    }
    event.stopImmediatePropagation()
    this.emit('change')
  }

  onMouseDown(event, elem) {
    super.onMouseDown(event, elem)
    elem === this._input || setTimeout(() => this._input.focus())
  }
}

TextInputBox.tabIndex = null

const names = [
  'type',
  'name',
  'value',
  'valueAsNumber',
  'min',
  'max',
  'step',
  'placeholder',
]
for(const name of names) {
  const descriptor = Object.getOwnPropertyDescriptor(HtmlInput.prototype, name)
  if(typeof descriptor.value === 'function') {
    descriptor.value = function(...args) {
      return this._input[name](...args)
    }
  }
  if(descriptor.get) {
    descriptor.get = function() {
      return this._input[name]
    }
  }
  if(descriptor.set) {
    descriptor.set = function(value) {
      this._input[name] = value
    }
  }
  Object.defineProperty(TextInputBox.prototype, name, descriptor)
}
