import { HtmlSpan } from './lib'
import './Icon.css'

const PREFIX = 'Icon_'

export class Icon extends HtmlSpan
{
  constructor(init) {
    super(typeof init === 'string'? { name : init } : init)
  }

  build({ name }) {
    this.classList.add(PREFIX + name)
  }
}
