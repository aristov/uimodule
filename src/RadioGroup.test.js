import { Heading } from './Heading'
import { Radio, RadioGroup } from './RadioGroup'

export default () => {
  return [
    new Heading('RadioGroup'),
    new RadioGroup({
      labels : 'Simple',
      children : [
        new Radio({
          checked : true,
          value : '-1',
          labels : 'This event only'
        }),
        new Radio({
          value : '1',
          labels : 'This and all the following'
        }),
        new Radio({
          value : '0',
          labels : 'No more repeats'
        })
      ]
    })
  ]
}
