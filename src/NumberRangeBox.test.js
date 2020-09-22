import { Heading } from './Heading'
import { NumberRangeBox } from './NumberRangeBox'

export default () => {
  return [
    new Heading('NumberRangeBox'),
    new NumberRangeBox({
      labels : 'Simple',
    }),
  ]
}
