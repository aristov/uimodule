import moment from 'moment'
import { Presentation } from './lib'
import { Label } from './Label'
import { ListBox } from './ListBox'
import './TimeRangeListBox.css'

export class TimeRangeListBox extends ListBox
{
  /**
   * @param {{}} init
   * @param {string} [init.timeFrom]
   * @param {string} [init.timeTo]
   * @param {string} [init.interval]
   */
  init(init) {
    super.init(init)
    const { timeFrom = '00:00', timeTo = '24:00', interval = 'PT1H' } = init
    const range = moment(timeFrom, 'HH:mm').twix(timeTo, 'HH:mm')
    const duration = moment.duration(interval)
    this.multiSelectable = true
    this.options = range.split(duration).map(interval => {
      const start = interval.start().format('HH:mm')
      const end = interval.end().format('HH:mm')
      return {
        value : [start, end === '00:00'? '24:00' : end],
        children : new Label(start),
      }
    })
    this._control.append(new Presentation({
      class : 'Option',
      children : new Label(timeTo),
    }))
  }

  /**
   * @return {string[]|null}
   */
  get value() {
    const value = super.value
    if(value && value.length) {
      return [value[0][0], value[value.length - 1][1]]
    }
    return null
  }

  /**
   * @param {string[]|null} value
   */
  set value(value) {
    if(!value || !value.length) {
      super.value = value
      return
    }
    const start = value[0] && moment(value[0], 'HH:mm')
    const stop = value[1] && moment(value[1], 'HH:mm')
    const values = []
    for(const option of this.options) {
      const from = moment(option.value[0], 'HH:mm')
      const to = moment(option.value[1], 'HH:mm')
      from.isSameOrAfter(start) && values.push(option.value)
      if(to.isSameOrAfter(stop)) {
        break
      }
    }
    if(values.length) {
      super.value = values
    }
  }
}
