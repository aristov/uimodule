import { Heading } from './Heading'
import { TextBox } from './TextBox'

export default () => {
  return [
    new Heading('TextBox'),
    new TextBox({
      labels : 'Simple',
    }),
    new TextBox({
      labels : 'Value',
      value : 'Hello world!',
    }),
    new TextBox({
      labels : 'Value',
      placeholder : 'Placeholder',
    }),
    new TextBox({
      labels : 'Disabled',
      value : 'Hello world!',
      disabled : true,
    }),
    new TextBox({
      labels : 'MultiLine',
      value : 'Hello world!',
      multiLine : true,
    }),
  ]
}
