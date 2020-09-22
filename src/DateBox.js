import moment from 'moment'
import { ClearButton } from './ClearButton'
import { ComboBox } from './ComboBox'
import { Control } from './Control'
import { DateCell } from './DateCell'
import { DatePicker } from './DatePicker'
import { Dialog } from './Dialog'
import { Inner } from './Inner'
import { Popup } from './Popup'
import { ShortcutButton } from './ShortcutButton'
import './DateBox.css'

const NBSP = ' '

export class DateBox extends ComboBox
{
  build(init) {
    this._value = null
    this._text = init.text || NBSP
    this._weekday = NaN
    this.expanded = false
    this.hasPopup = 'dialog'
    return this._control = new Control([
      this._inner = new Inner(NBSP),
      this._clearButton = new ClearButton({
        disabled : !init.value,
        onclick : this.onClearButtonClick.bind(this),
        onmousedown : event => event.stopPropagation(),
      }),
    ])
  }

  activate() {
    if(!this.datePicker) {
      this.datePicker = new this.constructor.DatePicker({ value : this.value })
    }
    super.activate()
  }

  onClearButtonClick(event) {
    event.stopPropagation()
    if(this._value) {
      this.value = null
      this.emit('change')
    }
  }

  onDatePickerChange(event) {
    event.stopPropagation()
  }

  onDatePickerClick(event) {
    if(event.target.closest([DateCell.selector, ShortcutButton.selector])) {
      const value = this.value
      this.value = this.datePicker.value
      this.focus()
      this.expanded = false
      value === this.value || this.emit('change')
    }
  }

  onKeyDown(event) {
    super.onKeyDown(...arguments)
    if(!event.key.startsWith('Arrow')) {
      return
    }
    event.preventDefault()
    const key = event.key
    const value = this.value
    const date = value? moment(value, 'YYYY-MM-DD') : moment()
    const method = ['ArrowDown', 'ArrowRight'].includes(key)? 'add' : 'subtract'
    const unit = ['ArrowDown', 'ArrowUp'].includes(key)?
      event.altKey? 'year' : 'week' :
      event.altKey? 'month' : 'day'
    this.expanded || this.activate()
    this.datePicker.value = this.value = date[method](1, unit).format('YYYY-MM-DD')
    this.emit('change')
  }

  onKeyDown_Backspace(event) {
    if(!this.required && this.value) {
      this.value = null
      this.emit('change')
    }
  }

  /**
   * @returns {DatePicker|null}
   */
  get datePicker() {
    return this.controls.find(elem => elem instanceof this.constructor.DatePicker) || null
  }

  /**
   * @param {DatePicker|null} datePicker
   */
  set datePicker(datePicker) {
    if(!datePicker) {
      this.controls = null
      return
    }
    /*this.controls = [
      datePicker,
      new this.constructor.Popup({
        anchor : this,
        children : datePicker
      })
    ]*/
    const dialog = new Dialog({
      anchor : this,
      children : datePicker,
    })
    this.controls = [
      datePicker,
      // dialog,
      dialog.popup,
    ]
    datePicker.tabIndex = null
    datePicker.weekday = this._weekday
    datePicker.on('click', this.onDatePickerClick, this)
    datePicker.on('change', this.onDatePickerChange, this)
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

  get value() {
    return this._value
  }

  set value(value) {
    const datePicker = this.datePicker
    this._clearButton.disabled = !value
    if(this._value = value) {
      const date = moment(value)
      const format = date.isSame(moment(), 'year')?
        (this.compact? 'D.MM' : 'D MMMM') :
        (this.compact? 'D.MM.YYYY' : 'D MMMM YYYY')
      datePicker && (datePicker.value = value)
      this.text = date.format(format)
      return
    }
    datePicker && (datePicker.value = null)
    this.text = this._text
  }

  get weekday() {
    return this._weekday
  }

  set weekday(weekday) {
    this._weekday = weekday
    const datePicker = this.datePicker
    const date = moment(this._value)
    datePicker && (datePicker.weekday = weekday)
    if(date.weekday() !== weekday) {
      this.value = null
    }
  }
}

DateBox.prototype.compact = false
DateBox.DatePicker = DatePicker
DateBox.Popup = Popup
