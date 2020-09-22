import { Dash } from './Dash'
import { SelectBox } from './SelectBox'
import { TimeRangeListBox } from './TimeRangeListBox'
import './TimeRangeBox.css'

export class TimeRangeBox extends SelectBox
{
  /**
   * @param {{timeFrom,timeTo,interval}} init
   * @param {ListBox|{}} [init.listBox]
   */
  init(init) {
    init.listBox = {
      timeFrom : init.timeFrom,
      timeTo : init.timeTo,
      interval : init.interval,
    }
    super.init(init)
  }

  updateText() {
    const value = this.value
    this._inner.children = value && value.length?
      [value[0], new Dash(), value[1]] :
      this._text
  }
}

TimeRangeBox.ListBox = TimeRangeListBox
