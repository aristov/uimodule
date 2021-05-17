import moment from 'moment'
import { Control } from './Control'
import { DateGrid } from './DateGrid'
import { Button } from './Button'
import { MonthYearBox } from './MonthYearBox'
import { TodayButton } from './TodayButton'
import { Widget } from './Widget'
import './DatePicker.css'

export class DatePicker extends Widget
{
  build(init) {
    this._value = null
    return new Control([
      this._monthYearBox = new MonthYearBox({
        required : true,
        onchange : event => this.onMonthYearBoxChange(event)
      }),
      this._todayButton = new TodayButton({
        onclick : this.onShortcutButtonClick.bind(this),
        children : 'today'
      }),
      this._grid = new DateGrid({
        onchange : event => this.onGridChange(event)
      })
    ])
  }

  init(init) {
    super.init(init)
    if(!init.value) {
      this._monthYearBox.value = this._grid.month = moment().format('YYYY-MM')
    }
  }

  onMonthYearBoxChange(event) {
    event.stopPropagation()
    const grid = this._grid
    const value = this.value
    const month = this._monthYearBox.value
    month && (grid.month = month)
    if(value) {
      for(const cell of grid.gridCells) {
        cell.selected = cell.value === value
      }
    }
  }

  onShortcutButtonClick(event, elem) {
    this.value = elem.value
    this.emit('change')
  }

  onGridChange(event) {
    event.stopPropagation()
    this._monthYearBox.value = moment(this._grid.value).format('YYYY-MM')
    this._value = this._grid.value
    this.emit('change')
  }

  get disabled() {
    return super.disabled
  }

  set disabled(disabled) {
    for(const button of this.findAll(Button)) {
      button.disabled = disabled
    }
    this._grid.disabled = disabled
    super.disabled = disabled
  }

  get value() {
    return this._value
  }

  set value(value) {
    this._value = this._grid.value = value
    this._monthYearBox.value = this._grid.month
  }

  get weekday() {
    return this._grid.weekday
  }

  set weekday(weekday) {
    this._grid.weekday = weekday
    this._todayButton.disabled = !isNaN(weekday) && moment().weekday() !== weekday
  }
}

DatePicker.tabIndex = -1
