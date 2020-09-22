import { Heading } from './Heading'
import { TimeBox } from './TimeBox'

export default () => {
  return [
    new Heading('TimeBox'),
    new TimeBox({
      labels : 'Simple',
    }),
    new TimeBox({
      labels : 'Required',
      required : true,
    }),
    new TimeBox({
      labels : 'Min, max',
      min : '09:00',
      max : '18:00',
    }),
    new TimeBox({
      labels : 'Min, max, value, step',
      min : '9:00',
      max : '24:00',
      value : '15:30',
      step : '00:30',
    }),
  ]
}
