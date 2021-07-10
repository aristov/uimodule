import { Heading } from './Heading'
import { TimeRangeDurationBox } from './TimeRangeDurationBox'

export default () => {
  return [
    new Heading('TimeRangeDurationBox'),
    new TimeRangeDurationBox({
      labels : 'Время',
      interval : 'PT30M',
      units : ['hours'],
      timeFrom : '09:00',
    }),
    new TimeRangeDurationBox({
      labels : 'Время',
      interval : 'PT30M',
      units : ['hours'],
      timeFrom : '09:00',
      value : ['21:00', '24:00'],
    }),
  ]
}
