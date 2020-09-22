import { Complex } from './Complex'
import { Dash } from './Dash'
import { Control } from './Control'
import { TextInputBox } from './TextInputBox'
import './NumberRangeBox.css'

export class NumberRangeBox extends Complex
{
  build(init) {
    return new Control([
      this._fromInput = new TextInputBox({
        type : 'number',
        min : 0,
        step : 1,
      }),
      new Dash,
      this._toInput = new TextInputBox({
        type : 'number',
        min : 0,
        step : 1,
      }),
    ])
  }

  get from() {
    const value = this._fromInput.valueAsNumber
    return isNaN(value)? null : value
  }

  get to() {
    const value = this._toInput.valueAsNumber
    return isNaN(value)? null : value
  }

  get value() {
    const from = this.from
    const to = this.to
    return from === null && to === null? null : [this.from, this.to]
  }

  set value(value) {
    this._fromInput.valueAsNumber = value[0]
    this._toInput.valueAsNumber = value[1]
  }
}

NumberRangeBox.tabIndex = null
