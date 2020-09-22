import moment from 'moment'
import { Complex } from './Complex'
import { Control } from './Control'
import { DurationBox } from './DurationBox'
import './DurationGroupBox.css'

export class DurationGroupBox extends Complex
{
  build(init) {
    return new Control([
      this._myBox = new DurationBox({
        units : ['months', 'years'],
      }),
      this._dwBox = new DurationBox({
        units : ['days', 'weeks'],
      }),
      this._mhBox = new DurationBox({
        units : ['minutes', 'hours'],
      }),
    ])
  }

  get value() {
    const duration = moment.duration(this._myBox.value)
    duration.add(this._dwBox.value)
    duration.add(this._mhBox.value)
    return duration.toISOString()
  }

  /**
   * @param {string|{years,months,weeks,days,hours,minutes}|null} value
   */
  set value(value) {
    const duration = value && moment.duration(value)
    const years = duration && duration.years() || 0
    const months = duration && duration.months() || 0
    const weeks = duration && duration.weeks() || 0
    const days = duration && duration.days() || 0
    const hours = duration && duration.hours() || 0
    const minutes = duration && duration.minutes() || 0
    if(months && months % 12) {
      this._myBox.unit = 'months'
      this._myBox.value = months + years * 12
    }
    else if(years) {
      this._myBox.unit = 'years'
      this._myBox.value = years
    }
    else this._myBox.value = null
    if(days && days % 7) {
      this._dwBox.unit = 'days'
      this._dwBox.value = days
    }
    else if(weeks) {
      this._dwBox.unit = 'weeks'
      this._dwBox.value = weeks
    }
    else this._dwBox.value = null
    if(minutes && minutes % 60) {
      this._mhBox.unit = 'minutes'
      this._mhBox.value = minutes + hours * 60
    }
    else if(hours) {
      this._mhBox.unit = 'hours'
      this._mhBox.value = hours
    }
    else this._mhBox.value = null
  }
}
