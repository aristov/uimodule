import moment from 'moment'
import { ClearButton } from './ClearButton'
import { Complex } from './Complex'
import { Control } from './Control'
import { Dash } from './Dash'
import { DateBox } from './DateBox'
import './DateRangeBox.css'

export class DateRangeBox extends Complex
{
  build({ compact, required }) {
    this._value = null
    return new Control([
      this._beginDateBox = new DateBox({
        title : 'Дата начала',
        text : '____',
        compact,
      }),
      new Dash,
      this._endDateBox = new DateBox({
        title : 'Дата окончания',
        text : '____',
        compact,
      }),
      this._clearButton = required? null : new ClearButton({
        title : 'Очистить',
        disabled : true,
        onclick : () => {
          this._value = this.value = null
          this._clearButton.disabled = true
          this.emit('change')
        },
      }),
    ])
  }

  onWidgetChange(event, elem) {
    if(this.value === this._value) {
      return
    }
    this._value = this.value
    if(this._clearButton) {
      this._clearButton.disabled = !this._value
    }
    super.onWidgetChange(event, elem)
  }

  get value() {
    const beginDateVal = this._beginDateBox.value
    const endDateVal = this._endDateBox.value
    let begin, end
    if(endDateVal) {
      end = moment(endDateVal).add(1, 'day')
    }
    if(beginDateVal) {
      begin = moment(beginDateVal)
    }
    return begin || end?
      [begin? begin.format('YYYY-MM-DD') : null, end? end.format('YYYY-MM-DD') : null] :
      null
  }

  set value(value) {
    const beginAt = value && value[0] && value[0].value
    const endAt = value && value[1] && value[1].value
    const begin = beginAt && moment(beginAt)
    const end = endAt && moment(endAt)
    this._beginDateBox.value = begin && begin.format('YYYY-MM-DD')
    this._endDateBox.value = end && end.format('YYYY-MM-DD')
    if(this._clearButton) {
      this._clearButton.disabled = !value
    }
  }
}

DateRangeBox.prototype.name = null
DateRangeBox.tabIndex = null
