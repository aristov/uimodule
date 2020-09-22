import { Heading } from './Heading'
import { Test } from './Test'
import { TimeRangeBox } from './TimeRangeBox'

export default () => {
  return new Test({
    // onchange : (event, elem) => console.log(elem.value),
    children : [
      new Heading('TimeRangeBox'),
      new TimeRangeBox({
        labels : 'Simple',
      }),
      new TimeRangeBox({
        labels : 'Value, interval',
        interval : 'PT30M',
        value : ['09:00', '12:30'],
      }),
      new TimeRangeBox({
        labels : 'Value, timeFrom, timeTo',
        timeFrom : '10:00',
        timeTo : '20:00',
        value : ['13:00', '17:00'],
      }),
    ]
  })
}
