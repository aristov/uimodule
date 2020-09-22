import { DateTimeBox } from './DateTimeBox'
import { Heading } from './Heading'

export default () => {
  return [
    new Heading('DateTimeBox'),
    new DateTimeBox({
      labels : 'Simple',
    }),
    new DateTimeBox({
      labels : 'Required',
      required : true,
    }),
    new DateTimeBox({
      labels : 'Disabled',
      disabled : true,
    }),
  ]
}
