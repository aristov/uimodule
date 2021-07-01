import moment from 'moment'
import { RoleColumnHeader, RoleRowGroup } from './lib/ariamodule'
import { DateCell } from './DateCell'
import { Grid, Row } from './Grid'
import './DateGrid.css'

const WEEK_DAY_NAMES = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

export class DateGrid extends Grid
{
  init(init) {
    super.init(init)
    this._month = null
    this._weekday = NaN
    this.on('focusin', this.onFocusIn)
  }

  onFocusIn(event, elem) {
    const cell = this.find(DateCell, ({ selected }) => selected)
    if(elem === cell) {
      return
    }
    const date = moment(elem.value)
    if(!date.isSame(this.month, 'month')) {
      event.stopPropagation()
      this.month = date.format('YYYY-MM')
      this.value = date.format('YYYY-MM-DD')
      const cell = this.activeDescendant = this.find(DateCell, ({ selected }) => selected)
      cell.focus()
      this.emit('change')
      return
    }
    cell && (cell.selected = false)
    elem.selected = true
    this.activeDescendant = elem
    this.emit('change')
  }

  resetTabIndex() {
    const cells = this.gridCells.filter(({ disabled }) => !disabled)
    const selectedCells = cells.filter(({ selected }) => selected)
    const targetCell = selectedCells[0] || cells[0]
    for(const cell of cells) {
      cell.tabIndex = cell === targetCell? 0 : -1
    }
  }

  get month() {
    return this._month
  }

  set month(month) {
    const time = moment(month, 'YYYY-MM').utcOffset(180)
    const start = time.clone().startOf('month').startOf('week')
    const end = start.clone().add(6, 'week')
    const weekday = this._weekday
    const rows = []
    while(start.isBefore(end)) {
      const row = new Row
      WEEK_DAY_NAMES.forEach(() => {
        row.append(new DateCell({
          value : start.format('YYYY-MM-DD'),
          selected : false,
          current : start.isSame(moment().utcOffset(180), 'date')? 'date' : false,
          disabled : !isNaN(weekday) && start.weekday() !== weekday,
          class : { current : start.isSame(time, 'month') },
          text : start.format('D'),
        }))
        start.add(1, 'day')
      })
      rows.push(row)
    }
    this.children = [
      new RoleRowGroup(new Row(WEEK_DAY_NAMES.map(name => new RoleColumnHeader(name)))),
      new RoleRowGroup(rows),
    ]
    this._month = month
    this.resetTabIndex()
  }

  get value() {
    const cell = this.find(DateCell, ({ selected }) => selected)
    return cell? cell.value : ''
  }

  set value(value) {
    if(value) {
      if(!moment(value, 'YYYY-MM-DD').utcOffset(180).isSame(this.value, 'month')) {
        this.month = value
      }
    }
    for(const cell of this.gridCells) {
      cell.selected = !!value && cell.value === value
    }
    this.resetTabIndex()
  }

  get weekday() {
    return this._weekday
  }

  set weekday(weekday) {
    for(const cell of this.gridCells) {
      const date = moment(cell.value)
      if(cell.disabled = !isNaN(weekday) && date.weekday() !== weekday) {
        cell.selected && (cell.selected = false)
      }
    }
    this._weekday = weekday
    this.resetTabIndex()
  }
}
