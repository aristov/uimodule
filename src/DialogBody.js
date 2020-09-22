import { HtmlDiv } from './lib'
import './DialogBody.css'

export class DialogBody extends HtmlDiv
{
  init(init) {
    super.init(init)
    this.on('scroll', event => this.class.scrolled = !!this.scrollTop)
  }
}
