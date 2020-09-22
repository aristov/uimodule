import { Heading } from './Heading'
import { MonthYearBox } from './MonthYearBox'

export default () => {
  return [
    new Heading('MonthYearBox'),
    new MonthYearBox({
      labels : 'Simple',
    }),
  ]
}
