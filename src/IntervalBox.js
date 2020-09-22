import moment from 'moment'
import { Complex } from './Complex'
import { Control } from './Control'
import { DateTimeBox } from './DateTimeBox'
import { DurationBox } from './DurationBox'
import './IntervalBox.css'

export class IntervalBox extends Complex
{
  constructor(init) {
    super(init)
    this._value = null
    this._dateTimeBox.labelledBy = this.labels
  }

  build({ step }) {
    return new Control([
      this._dateTimeBox = new DateTimeBox({ step }),
      this._durationBox = new DurationBox({
        title : 'Интервал',
        units : ['hours', 'minutes'],
        step,
      }),
    ])
  }

  onWidgetChange(event, elem) {
    if(elem === this._dateTimeBox && !this.duration) {
      return
    }
    if(elem === this._durationBox && !this.dateTime) {
      return
    }
    super.onWidgetChange(event, elem)
  }

  get dateTime() {
    return this._dateTimeBox.value
  }

  get duration() {
    return this._durationBox.value
  }

  get range() {
    const { dateTime, duration } = this
    if(!dateTime) {
      return null
    }
    const interval = duration && moment.duration(duration)
    const end = interval && moment(dateTime).add(interval)
    return [{ value : dateTime }, end && { value : end.format() }]
  }

  set range(range) {
    const dateTime = range && range[0] && range[0].value
    const end = range && range[1] && moment(range[1].value)
    const duration = dateTime && end && moment.duration(end.diff(dateTime))
    this._dateTimeBox.value = dateTime
    this._durationBox.value = duration && duration.toISOString()
  }

  get value() {
    const { dateTime, duration } = this
    return dateTime && duration && [dateTime, duration].join('/')
  }

  set value(value) {
    let dateTime, duration
    if(value) {
      [dateTime, duration] = value.split('/')
    }
    this._dateTimeBox.value = dateTime || null
    this._durationBox.value = duration || null
  }
}
