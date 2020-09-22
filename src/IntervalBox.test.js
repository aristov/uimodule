import moment from 'moment'
import { Heading } from './Heading'
import { IntervalBox } from './IntervalBox'

export default () => {
  return [
    new Heading('IntervalBox'),
    new IntervalBox({
      labels : 'Simple',
    }),
    new IntervalBox({
      labels : 'Value',
      value : [moment().startOf('hour').format(), 'PT3H'].join('/'),
    }),
    new IntervalBox({
      labels : 'Value, step',
      value : [moment().startOf('hour').format(), 'PT3H'].join('/'),
      step : '00:30',
    }),
  ]
}
