import './clipboardData'
import { HtmlDiv } from './lib'

const NBSP = ' '

export class Edit extends HtmlDiv
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.tabIndex = 0
    this.contentEditable = 'true'
    this.on('paste', this.onPaste)
  }

  /**
   * @param {ClipboardEvent} event
   */
  onPaste(event) {
    event.preventDefault()
    if(this.readOnly) {
      return
    }
    const text = this.text
    const selection = getSelection()
    const { anchorOffset, focusOffset } = selection
    const startOffset = Math.min(anchorOffset, focusOffset)
    const endOffset = Math.max(anchorOffset, focusOffset)
    const beforeText = text.slice(0, startOffset)
    const afterText = text.slice(endOffset, text.length)
    const data = event.clipboardData.getData('text')
    this.value = beforeText + data + afterText
    selection.collapse(this.node.firstChild, beforeText.length + data.length)
    this.emit('input')
  }

  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    this._disabled = disabled
    this.contentEditable = String(!disabled)
    this.tabIndex = disabled? null : 0
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return this._disabled
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this._readOnly = readOnly
    this.contentEditable = String(!readOnly)
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this._readOnly
  }

  /**
   * @param {string|*} value
   */
  set value(value) {
    this.text = value === null? '' : String(value).replace(/\s\s/g, ' ' + NBSP)
  }

  /**
   * @returns {string}
   */
  get value() {
    return this.text.replace(/\s/g, ' ')
  }
}
