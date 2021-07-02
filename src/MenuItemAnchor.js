import { MenuItem } from './MenuItem'
import './MenuItemAnchor.css'

export class MenuItemAnchor extends MenuItem
{
  get href() {
    return this.node.href
  }

  set href(href) {
    this.node.href = href
  }

  static get localName() {
    return 'a'
  }
}
