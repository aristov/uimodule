import moment from 'moment'
import { AriaRequired } from './lib'
import { ClearButton } from './ClearButton'
import { Complex } from './Complex'
import { Control } from './Control'
import { DateBox } from './DateBox'
import { TimeBox } from './TimeBox'
import './DateTimeBox.css'

let undefined

export class DateTimeBox extends Complex
{
  init(init) {
    super.init(init)
    init.value === undefined || (this.dataset.value = '')
  }

  build({ compact }) {
    return new Control([
      this._dateBox = new DateBox({
        title : 'Дата',
        text : '____',
        compact,
      }),
      this._timeBox = new TimeBox({
        title : 'Время',
      }),
      new ClearButton({
        title : 'Очистить',
        disabled : true,
        widget : this,
      }),
    ])
  }

  onWidgetChange(event, elem) {
    const value = this.value
    if(value === this.dataset.value) {
      return
    }
    this.dataset.value = value
    super.onWidgetChange(event, elem)
  }

  get required() {
    return this.getAttr(AriaRequired)
  }

  set required(required) {
    this.setAttr(AriaRequired, this._dateBox.required = this._timeBox.required = required)
  }

  get step() {
    this._timeBox.step
  }

  set step(step) {
    this._timeBox.step = step
  }

  get value() {
    const date = this._dateBox.value
    const time = this._timeBox.value
    return date && time? moment(date + 'T' + time).format() : ''
  }

  set value(value) {
    const dateTime = value && moment(value)
    this._dateBox.value = dateTime && dateTime.format('YYYY-MM-DD')
    this._timeBox.value = dateTime && dateTime.format('HH:mm')
    this.dataset.value = value || ''
  }
}
