import { Complex } from './Complex'
import { Control } from './Control'
import { TimeRangeBox } from './TimeRangeBox'
import { DurationBox } from './DurationBox'
import './TimeRangeDurationBox.css'

export class TimeRangeDurationBox extends Complex
{
  build({ units, interval, timeFrom = this.timeFrom, timeTo = this.timeTo }) {
    const from = moment(timeFrom, 'HH:mm')
    const to = moment(timeTo, 'HH:mm')
    const max = moment.duration(to.diff(from))
    return new Control([
      this._timeRangeBox = new TimeRangeBox({
        timeFrom,
        timeTo,
        interval,
      }),
      this._durationBox = new DurationBox({
        units : units || ['minutes', 'hours'],
        step : interval,
        max : max.toISOString(),
      }),
    ])
  }

  onWidgetChange(event, elem) {
    if(elem === this._timeRangeBox) {
      this.updateDurationBox()
    }
    else if(elem === this._durationBox) {
      this.updateTimeRangeBox()
    }
    super.onWidgetChange(event, elem)
  }

  updateDurationBox() {
    const value = this.value
    if(value) {
      const start = moment(value[0], 'HH:mm')
      const end = moment(value[1], 'HH:mm')
      const duration = moment.duration(end.diff(start))
      this._durationBox.value = duration.toISOString()
    }
    else this._durationBox.value = null
  }

  updateTimeRangeBox() {
    const duration = moment.duration(this.duration)
    if(!duration.asSeconds()) {
      this._timeRangeBox.value = null
      return
    }
    const value = this.value
    const to = moment(this.timeTo, 'HH:mm')
    let start = moment(value?.[0] || this.timeFrom, 'HH:mm')
    let end = start.clone().add(duration)
    if(to.isBefore(end)) {
      end = to
      start = to.clone().subtract(duration)
    }
    this._timeRangeBox.value = [
      start.format('HH:mm'),
      end.format('HH:mm').replace('00:00', '24:00'),
    ]
  }

  get duration() {
    return this._durationBox.value
  }

  get value() {
    return this._timeRangeBox.value
  }

  set value(value) {
    this._timeRangeBox.value = value
    this.updateDurationBox()
  }
}

TimeRangeDurationBox.prototype.timeFrom = '00:00'
TimeRangeDurationBox.prototype.timeTo = '24:00'
