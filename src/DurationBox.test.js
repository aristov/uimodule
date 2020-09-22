import { DurationBox } from './DurationBox'
import { Heading } from './Heading'

export default () => {
  return [
    new Heading('DurationBox'),
    new DurationBox({
      labels : 'Simple',
    }),
    new DurationBox({
      labels : 'Value',
      value : '03:45',
    }),
    new DurationBox({
      labels : 'Value, units',
      value : '06:37',
      units : ['hours', 'minutes'],
    }),
    new DurationBox({
      labels : 'Value, units',
      value : '18:30',
      units : ['hours', 'minutes'],
    }),
    new DurationBox({
      labels : 'Value, units, step',
      value : '09:30',
      units : ['hours', 'minutes'],
      step : '00:30',
    }),
  ]
}
