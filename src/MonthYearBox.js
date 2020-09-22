import moment from 'moment'
import { Complex } from './Complex'
import { Control } from './Control'
import { MonthBox } from './MonthBox'
import { Button } from './Button'
import { TextInputBox } from './TextInputBox'
import './MonthYearBox.css'

export class MonthYearBox extends Complex
{
  build(init) {
    return new Control([
      this._decrButton = new DecrButton({
        tabIndex : null,
        onclick : event => this.shiftMonth('subtract'),
      }),
      this._incrButton = new IncrButton({
        tabIndex : null,
        onclick : event => this.shiftMonth('add'),
      }),
      this._monthBox = new MonthBox({
        text : '____'
      }),
      this._yearBox = new TextInputBox({
        type : 'number',
        value : moment().format('YYYY'),
        min : 1970,
        max : 2100
      })
    ])
  }

  shiftMonth(method) {
    let value = this.value
    const month = value? moment(value, 'YYYY-MM') : moment()
    month[method](1, 'month')
    this.value = month.format('YYYY-MM')
    this.emit('change')
  }

  get required() {
    return this._monthBox.required
  }

  set required(required) {
    this._monthBox.required = required
  }

  get value() {
    const month = this._monthBox.value
    const year = this._yearBox.value
    return month && year? year + '-' + month : null
  }

  set value(value) {
    const [year, month] = value? value.split('-') : ''
    this._yearBox.value = year || null
    this._monthBox.value = month || null
  }
}

MonthYearBox.tabIndex = null

class IncrButton extends Button
{
}

class DecrButton extends Button
{
}
