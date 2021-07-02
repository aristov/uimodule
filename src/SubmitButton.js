import { Button } from './Button'
import { SvgIcon } from './SvgIcon'
import './SubmitButton.css'

export class SubmitButton extends Button
{
  build(init) {
    return [super.build(init), new SvgIcon]
  }

  activate() {
    const form = this.form
    form && form.emit('submit')
  }
}
