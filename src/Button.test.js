import { Button } from './Button'
import { Heading } from './Heading'

export default () => {
  return [
    new Heading('Button'),
    new Button('Simple'),
    new Button({
      pressed : true,
      text : 'Pressed',
    }),
    new Button({
      disabled : true,
      text : 'Disabled',
    }),
  ]
}
