import { Button } from './Button'

export class ShortcutButton extends Button
{
  activate() {
    const elem = this.controls[0]
    if(!elem) {
      return
    }
    const value = elem.value
    elem.value = this.value
    elem.focus()
    value === elem.value || elem.emit('change')
  }
}

ShortcutButton.prototype.value = null
