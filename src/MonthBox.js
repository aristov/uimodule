import moment from 'moment'
import { SelectBox, Option } from './SelectBox'
import './MonthBox.css'

export class MonthBox extends SelectBox
{
  init(init) {
    super.init(init)
    this.options = Array.from(new Array(12)).map((_, i) => {
      const month = moment(i + 1, 'M')
      return new Option({
        value : month.format('MM'),
        children : month.format('MMMM')
      })
    })
  }
}
