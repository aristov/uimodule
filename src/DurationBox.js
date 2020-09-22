import moment from 'moment'
import { Complex } from './Complex'
import { Control } from './Control'
import { SelectBox } from './SelectBox'
import { TextInputBox } from './TextInputBox'
import './DurationBox.css'

export class DurationBox extends Complex
{
  init(init) {
    super.init(init)
    init.value || this.updateUnits()
  }

  /**
   * @param {{}} init
   * @return {Control}
   */
  build(init) {
    const units = init.units || this.units
    return this._control = new Control([
      this._numberBox = new TextInputBox({
        type : 'number',
        min : 0,
      }),
      this._unitBox = new SelectBox({
        title : 'Единица времени',
        value : this._unit = init.unit || units[0],
        // onchange : this.onUnitBoxChange.bind(this),
        options : units.map(value => ({ value })),
      }),
    ])
  }

  updateUnits() {
    for(const option of this._unitBox.options) {
      const unit = option.value
      const key = unit === 'months'? 'M' : unit.slice(0, 1)
      const duration = moment.duration(this._numberBox.valueAsNumber || 0, key)
      option.text = duration.format(key + ' _', 1).split(' ')[1]
      this._unitBox.updateText()
    }
  }

  /**
   * @param {Event} event
   * @param {DomElem} elem
   */
  onWidgetChange(event, elem) {
    if(elem === this._unitBox && !this._numberBox.value) {
      return
    }
    if(elem === this._numberBox) {
      this.updateUnits()
    }
    super.onWidgetChange(event, elem)
  }

  /**
   * @param {Event} event
   */
  onUnitBoxChange(event) {
    const unit = this._unitBox.value
    const value = this._numberBox.valueAsNumber
    const step = this._numberBox.step
    if(!isNaN(value)) {
      const duration = moment.duration(value, this._unit)
      const number = duration.as(unit)
      this._numberBox.value = number % 1? number.toFixed(2) : number
    }
    if(step) {
      this._numberBox.step = moment.duration(+step, this._unit).as(unit)
    }
    this._unit = unit
  }

  /**
   * @return {string}
   */
  get step() {
    return moment.duration(this._numberBox.step || 1, this._unit).toISOString()
  }

  /**
   * @param {string} step
   */
  set step(step) {
    this._numberBox.step = moment.duration(step).as(this._unit)
  }

  /**
   * @return {string|null}
   */
  get value() {
    const value = this._numberBox.valueAsNumber
    if(isNaN(value)) {
      return null
    }
    const duration = moment.duration(value, this._unitBox.value)
    return duration.asSeconds()? duration.toISOString() : null
  }

  /**
   * @param {string|number|null} value
   */
  set value(value) {
    const duration = typeof value === 'number'?
      moment.duration(value, this._unitBox.value) :
      value && moment.duration(value)
    if(duration) {
      const units = DurationBox.prototype.units.slice().reverse()
      let unit, number, remainder
      for(const item of units) {
        if(!this.units.includes(item)) {
          continue
        }
        number = duration.as(unit = item)
        remainder = number % 1
        if(!remainder || remainder === .5) {
          break
        }
      }
      this._unitBox.value = this._unit = unit
      this._numberBox.value = number
    }
    else this._numberBox.value = ''
    this.updateUnits()
  }
}

DurationBox.prototype.units = ['minutes', 'hours', 'days', 'weeks', 'months', 'years']
