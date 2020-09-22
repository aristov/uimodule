import { DateTimeRangeBox } from './DateTimeRangeBox'
import { Heading } from './Heading'

export default () => {
  return [
    new Heading('DateTimeRangeBox'),
    new DateTimeRangeBox({
      labels : 'Simple',
    }),
    new DateTimeRangeBox({
      labels : 'Disabled',
      disabled : true,
    }),
  ]
}
