import { DateBox } from './DateBox'
import { Heading } from './Heading'

export default () => {
  return [
    new Heading('DateBox'),
    new DateBox({
      labels : 'Simple',
    }),
    new DateBox({
      labels : 'Simple',
      value : '2023-04-02',
    }),
    new DateBox({
      labels : 'Required',
      required : true,
    }),
    new DateBox({
      labels : 'Disabled',
      disabled : true,
    }),
  ]
}
