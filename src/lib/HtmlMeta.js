import { HtmlElem } from './HtmlElem'

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-meta-element
 */
export class HtmlMeta extends HtmlElem
{
  /**
   * @param {string} httpEquiv
   */
  set httpEquiv(httpEquiv) {
    this.node.httpEquiv = httpEquiv
  }

  /**
   * @returns {string}
   */
  get httpEquiv() {
    return this.node.httpEquiv
  }

  /**
   * @param {string} name
   */
  set name(name) {
    this.node.name = name
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.node.name
  }

  /**
   * @param {string} content
   */
  set content(content) {
    this.node.content = content
  }

  /**
   * @returns {string}
   */
  get content() {
    return this.node.content
  }
}

/**
 * @alias HtmlMeta
 */
export { HtmlMeta as Meta }