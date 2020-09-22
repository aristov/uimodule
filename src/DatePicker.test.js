import { DatePicker } from './DatePicker'
import { Heading } from './Heading'

export default () => {
  return [
    new Heading('DatePicker'),
    new DatePicker({
      labels : 'Simple',
    }),
  ]
}
