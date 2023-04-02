import moment from 'moment'
import { DateRangeBox } from './DateRangeBox'
import { Heading } from './Heading'

export default () => {
  return [
    new Heading('DateRangeBox'),
    new DateRangeBox({
      labels : 'Simple',
      onchange : (e, elem) => console.warn(elem.value),
    }),
    new DateRangeBox({
      labels : 'Simple',
      value : [
        { value : moment().format('YYYY-MM-DD') },
        { value : moment().add(1, 'week').format('YYYY-MM-DD') },
      ],
      onchange : (e, elem) => console.warn(elem.value),
    }),
    new DateRangeBox({
      labels : 'Disabled',
      disabled : true,
    }),
  ]
}
