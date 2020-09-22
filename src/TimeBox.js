import moment from 'moment'
import { ListBox, Option } from './ListBox'
import { TextBox } from './TextBox'
import './TimeBox.css'

export class TimeBox extends TextBox
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this._edit.inputMode = 'numeric'
    this.expanded = false
    this.hasPopup = 'listbox'
    init.value || (this.text = '––:––')
  }

  activate() {
    if(!this.listBox) {
      const range = moment(this.min, 'HH:mm').twix(this.max, 'HH:mm')
      const interval = moment.duration(this.step)
      const value = this.value
      this.listBox = new this.constructor.ListBox(range.split(interval).map(item => {
        const time = item.start().format('HH:mm')
        return new this.constructor.Option({
          value : time,
          text : time,
          selected : time === value,
        })
      }))
    }
    super.activate()
    this.expanded && this.listBox.scrollToOption()
  }

  /**
   * @return {boolean}
   */
  checkValidity() {
    return this.text? !!this.value : !this.required
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   */
  onFocusIn(event, elem) {
    if(!this.value) {
      this.text = ''
    }
    super.onFocusIn(event, elem)
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   */
  onFocusOut(event, elem) {
    const { value, _value } = this
    if(value) {
      this.value = value
    }
    else {
      this.value = this.required? this._value : null
      this.invalid = false
    }
    value === _value || this.emit('change')
  }

  /**
   * @param {InputEvent} event
   * @param {DomElem} elem
   */
  onInput(event, elem) {
    const listBox = this.listBox
    if(listBox) {
      listBox.value = this.value
      this.expanded && listBox.scrollToOption()
    }
    this.invalid = this.text? !this.value : false
  }

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyDown_ArrowUp(event, elem) {
    event.preventDefault()
    this.expanded || this.activate()
    this.listBox.emit('keydown', { code : event.code, repeat : event.repeat })
  }

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyDown_ArrowDown(event, elem) {
    event.preventDefault()
    this.expanded || this.activate()
    this.listBox.emit('keydown', { code : event.code, repeat : event.repeat })
  }

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyDown_Enter(event, elem) {
    event.stopPropagation()
    super.onKeyDown_Enter(event, elem)
    this.activate()
  }

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyDown_Escape(event, elem) {
    event.stopPropagation()
    this.expanded = false
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onListBoxClick(event, elem) {
    event.stopPropagation()
    this.focus()
    this.expanded = false
    this.reportValidity()
  }

  /**
   * @param {Event} event
   * @param {DomElem} elem
   */
  onListBoxChange(event, elem) {
    event.stopPropagation()
    this.value = this.listBox.value
    this.reportValidity()
    this.emit('change')
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
   * @return {string|null}
   */
  get value() {
    const value = super.value.trim()
    const time = moment(value, 'HH:mm')
    return time.isValid()? time.format('HH:mm') : null
  }

  /**
   * @param {string|null} value
   */
  set value(value) {
    if(!value) {
      super.value = null
      this.text = '––:––'
      return
    }
    const time = moment(value.trim(), 'HH:mm')
    super.value = time.isValid()? time.format('HH:mm') : null
  }
}

TimeBox.prototype.min = '00:00'
TimeBox.prototype.max = '24:00'
TimeBox.prototype.step = '00:15'
TimeBox.ListBox = ListBox
TimeBox.Option = Option
