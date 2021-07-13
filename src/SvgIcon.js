import { HtmlSpan } from './lib'
import './SvgIcon.css'

export class SvgIcon extends HtmlSpan
{
  init(init) {
    super.init(init)
    this.doc.on(this, this.onDocThis, {
      context : this,
      subtree : true,
      removedNodes : false,
    })
  }

  onDocThis(record) {
    const match = this.computedStyle.backgroundImage.match(/%3Csvg\s.*%3C\/svg%3E/)
    if(match) {
      this.style.backgroundImage = 'none'
      this.html = decodeURIComponent(match[0])
    }
    this.doc.off(this, this.onDocThis, this)
  }
}
