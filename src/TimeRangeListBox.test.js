import { Heading } from './Heading'
import { Test } from './Test'
import { TimeRangeListBox } from './TimeRangeListBox'

export default async () => {
  return new Test({
    // onchange : (event, elem) => console.log(elem.value),
    children : [
      new Heading('TimeRangeListBox'),
      new TimeRangeListBox({
        labels : 'Simple',
      }),
      new TimeRangeListBox({
        labels : 'Value, interval',
        interval : 'PT30M',
        value : ['09:00', '12:30'],
      }),
      new TimeRangeListBox({
        labels : 'Value, timeFrom, timeTo',
        timeFrom : '10:00',
        timeTo : '20:00',
        value : ['13:00', '17:00'],
      }),
    ]
  })
}
