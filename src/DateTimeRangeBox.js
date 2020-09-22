import moment from 'moment'
import { ClearButton } from './ClearButton'
import { Complex } from './Complex'
import { Control } from './Control'
import { Dash } from './Dash'
import { DateBox } from './DateBox'
import { TimeBox } from './TimeBox'
import './DateTimeRangeBox.css'

export class DateTimeRangeBox extends Complex
{
  build({ compact, required }) {
    this._value = null
    this._step = '00:05'
    return new Control([
      this._beginDateBox = new DateBox({
        title : 'Дата начала',
        text : '____',
        compact,
      }),
      this._beginTimeBox = new TimeBox({
        title : 'Время начала',
      }),
      new Dash,
      this._endTimeBox = new TimeBox({
        title : 'Время окончания',
      }),
      this._endDateBox = new DateBox({
        title : 'Дата окончания',
        text : '____',
        compact,
      }),
      this._clearButton = required? null : new ClearButton({
        title : 'Очистить',
        disabled : true,
        onclick : event => {
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

  get step() {
    return this._step
  }

  set step(step) {
    this._step = this._endTimeBox.step = this._beginTimeBox.step = step
  }

  get value() {
    const beginDateVal = this._beginDateBox.value
    const beginTimeVal = this._beginTimeBox.value
    const endDateVal = this._endDateBox.value
    const endTimeVal = this._endTimeBox.value
    let begin, end
    if(endDateVal) {
      end = endTimeVal?
        moment(endDateVal + 'T' + endTimeVal) :
        moment(endDateVal).add(1, 'day')
    }
    if(beginDateVal) {
      begin = beginTimeVal?
        moment(beginDateVal + 'T' + beginTimeVal) :
        moment(beginDateVal)
      /*if(!end) {
        end = endTimeVal?
          moment(beginDateVal + 'T' + endTimeVal) :
          moment(beginDateVal).add(1, 'day')
      }*/
    }
    return begin || end?
      [begin? begin.format() : null, end? end.format() : null] :
      null
  }

  set value(value) {
    const beginAt = value && value[0] && value[0].value
    const endAt = value && value[1] && value[1].value
    const begin = beginAt && moment(beginAt)
    const end = endAt && moment(endAt)
    this._beginDateBox.value = begin && begin.format('YYYY-MM-DD')
    this._beginTimeBox.value = begin && begin.format('HH:mm')
    this._endDateBox.value = end && end.format('YYYY-MM-DD')
    this._endTimeBox.value = end && end.format('HH:mm')
    if(this._clearButton) {
      this._clearButton.disabled = !value
    }
  }
}

DateTimeRangeBox.prototype.name = null
DateTimeRangeBox.tabIndex = null
