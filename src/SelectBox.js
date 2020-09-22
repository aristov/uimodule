import { Control } from './Control'
import { ComboBox } from './ComboBox'
import { Inner } from './Inner'
import { ListBox } from './ListBox'
import { Option } from './Option'
import './SelectBox.css'

const NBSP = ' '

class SelectBox extends ComboBox
{
  /**
   * @param {{}} init
   * @param {string} [init.text]
   * @param {ListBox|{}} [init.listBox]
   */
  init(init) {
    super.init(init)
    this._text = init.text || NBSP
    this.expanded = false
    this.hasPopup = 'listbox'
    this.children = new Control(this._inner = new Inner(NBSP))
    if(!init.listBox) {
      this.listBox = new this.constructor.ListBox
    }
  }

  /**
   * @param {{}} init
   * @param {ListBox|{}} [init.listBox]
   * @param {Option[]} [init.options]
   */
  assign(init) {
    const { listBox, options, ...rest } = init
    this.setProperty('listBox', listBox)
    this.setProperty('options', options)
    super.assign(rest)
  }

  /**
   * Update widget content
   */
  updateText() {
    const options = this.checkable? this.checkedOptions : this.selectedOptions
    this.text = options.length?
      options.map(({ abbr, text }) => abbr || text).join(this.constructor.TEXT_DELIMITER) :
      this._text
  }

  /**
   * Activate widget
   */
  activate() {
    if(!this.listBox) {
      this.listBox = new this.constructor.ListBox
    }
    super.activate()
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    super.onKeyDown(...arguments)
    if(!event.code.startsWith('Arrow')) {
      return
    }
    event.preventDefault()
    if(!this.expanded) {
      this.expanded = true
      return
    }
    this.listBox.emit('keydown', {
      code : event.code,
      shiftKey : event.shiftKey,
    })
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Backspace(event) {
    if(this.required || !this.value) {
      return
    }
    this.value = null
    this.emit('change')
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Enter(event) {
    if(this.expanded && this.checkable) {
      this.listBox.emit('keyup', { code : 'Space' })
    }
    super.onKeyDown_Enter(...arguments)
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_KeyA(event) {
    this.listBox.emit('keydown', { code : event.code })
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Space(event) {
    event.preventDefault()
    if(event.repeat) {
      return
    }
    if(this.expanded && this.checkable && this.selectedOptions.length) {
      this.listBox.emit('keydown', { code : event.code })
    }
    else super.onKeyDown_Space(...arguments)
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyUp_Space(event) {
    if(this.expanded && this.checkable && this.selectedOptions.length) {
      this.listBox.emit('keyup', { code : event.code })
      this.class.active = false
      if(this.multiSelectable || !this.required) {
        return
      }
    }
    super.onKeyUp_Space(...arguments)
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Escape(event) {
    if(!this.expanded) {
      return
    }
    event.stopPropagation()
    this.expanded = false
  }

  /**
   * @param {MouseEvent} event
   */
  onListBoxClick(event) {
    event.stopPropagation()
    this.focus()
    if(this.multiSelectable) {
      return
    }
    if(this.checkable && !this.required) {
      return
    }
    this.expanded = false
  }

  /**
   * @param {Event} event
   */
  onListBoxChange(event) {
    event.stopPropagation()
    this.updateText()
    this.emit('change')
  }

  /**
   * @return {boolean}
   */
  get checkable() {
    return this.listBox.checkable
  }

  /**
   * @param checkable
   */
  set checkable(checkable) {
    this.listBox.checkable = true
  }

  /**
   * @return {boolean}
   */
  get expanded() {
    return super.expanded
  }

  /**
   * @param {boolean} expanded
   */
  set expanded(expanded) {
    if(super.expanded = expanded) {
      this.listBox.scrollToOption()
    }
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return super.disabled
  }

  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    super.disabled = this.listBox.disabled = disabled
  }

  /**
   * @returns {ListBox|null}
   */
  get listBox() {
    return this.controls.find(elem => elem instanceof this.constructor.ListBox) || null
  }

  /**
   * @param {ListBox|null} listBox
   */
  set listBox(listBox) {
    if(!listBox) {
      this.controls = null
      return
    }
    if(listBox.constructor === Object) {
      listBox = new this.constructor.ListBox(listBox)
    }
    this.controls = [
      listBox,
      new this.constructor.Popup({
        anchor : this,
        children : listBox,
      }),
    ]
    listBox.tabIndex = null
    listBox.on('click', this.onListBoxClick, this)
    listBox.on('change', this.onListBoxChange, this)
  }

  /**
   * @returns {boolean}
   */
  get multiSelectable() {
    return this.listBox.multiSelectable
  }

  /**
   * @param {boolean} multiSelectable
   */
  set multiSelectable(multiSelectable) {
    this.listBox.multiSelectable = multiSelectable
  }

  /**
   * @returns {Option[]}
   */
  get options() {
    const listBox = this.listBox
    return listBox? listBox.options : []
  }

  /**
   * @param {Option[]} options
   */
  set options(options) {
    const listBox = this.listBox
    listBox.options = options
    this.updateText()
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return super.readOnly
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    super.readOnly = this.listBox.readOnly = readOnly
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return super.required
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    super.required = this.listBox.required = required
  }

  /**
   * @returns {Option[]}
   */
  get selectedOptions() {
    return this.listBox.selectedOptions
  }

  /**
   * @returns {Option[]}
   */
  get checkedOptions() {
    return this.listBox.checkedOptions
  }

  /**
   * @return {string}
   */
  get text() {
    return this._inner.text
  }

  /**
   * @param {string} text
   */
  set text(text) {
    this._inner.text = text
  }

  /**
   * @returns {string|array}
   */
  get value() {
    return this.listBox.value
  }

  /**
   * @param {string|array} value
   */
  set value(value) {
    this.listBox.value = value
    this.updateText()
  }

  /**
   * @return {string[]}
   */
  get values() {
    return this.listBox.values
  }
}

SelectBox.ListBox = ListBox
SelectBox.TEXT_DELIMITER = ', '

export { SelectBox, ListBox, Option }
