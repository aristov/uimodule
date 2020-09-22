import { Dataset } from './Dataset'
import { DomElem } from './DomElem'
import { Style } from './Style'
import { TabIndex } from './TabIndex'

/**
 * @see https://www.w3.org/TR/wai-aria-1.1/#host_general_role
 * @see https://www.w3.org/TR/html/dom.html#aria-role-attribute
 * @see https://www.w3.org/TR/role-attribute
 * @abstract
 */
export class Role extends DomElem
{
  /**
   * @param {{}} init
   * @override
   */
  create(init) {
    if(this.constructor.abstract) {
      throw TypeError(`Could not create an abstract ${ this.constructor.name } instance`)
    }
    super.create(init)
    this.setAttr('role', this.constructor.roleList.join(' '))
  }

  /**
   * Blur the owner element
   */
  blur() {
    this.node.blur()
  }

  /**
   * Click the owner element
   */
  click() {
    this.node.click()
  }

  /**
   * Focus the owner element
   */
  focus() {
    this.node.focus()
  }

  /**
   * @param {boolean} autofocus
   */
  set autofocus(autofocus) {
    this.node.autofocus = autofocus
  }

  /**
   * @returns {boolean}
   */
  get autofocus() {
    return this.node.autofocus
  }

  /**
   * @param {{}} dataset
   */
  set dataset(dataset) {
    this.setAttr(Dataset, dataset)
  }

  /**
   * @returns {DOMStringMap}
   */
  get dataset() {
    return this.getAttr(Dataset)
  }

  /**
   * @param {*} style {string|{}}
   */
  set style(style) {
    this.setAttr(Style, style)
  }

  /**
   * @returns {CSSStyleDeclaration}
   */
  get style() {
    return this.getAttr(Style)
  }

  /**
   * @param {number|null} tabIndex
   */
  set tabIndex(tabIndex) {
    this.setAttr(TabIndex, tabIndex)
  }

  /**
   * @returns {number|null}
   */
  get tabIndex() {
    return this.getAttr(TabIndex)
  }

  /**
   * @returns {string[]}
   */
  static get classList() {
    const list = []
    let object = this, token
    do if(object.abstract === false) {
      token = object.classToken
      list.includes(token) || list.push(token)
    }
    while((object = Object.getPrototypeOf(object)) && 'classToken' in object)
    return list
  }

  /**
   * @returns {string}
   */
  static get classToken() {
    return this.role
  }

  /**
   * @returns {string}
   * @override
   */
  static get localName() {
    return 'div'
  }

  /**
   * @returns {string}
   */
  static get role() {
    return this.name.replace(/^Role/, '')
  }

  /**
   * @returns {string[]}
   */
  static get roleList() {
    const list = []
    let object = this
    do if(object.abstract === false) {
      const role = object.role
      list.includes(role) || list.push(role)
    }
    while((object = Object.getPrototypeOf(object)) && 'role' in object)
    return list
  }

  /**
   * @returns {string}
   * @override
   */
  static get selector() {
    return this.abstract? '[role]' : `[role~=${ this.role }]`
  }
}

/**
 * @see https://www.w3.org/TR/wai-aria-1.1/#isAbstract
 * @abstract
 */
Role.abstract = true

Role.defineGetters([
  'offsetLeft',
  'offsetTop',
  'offsetWidth',
  'offsetHeight'
])
