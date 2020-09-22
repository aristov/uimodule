import { CheckBox } from './CheckBox'
import { Heading } from './Heading'

export default () => {
  return [
    new Heading('CheckBox'),
    new CheckBox({
      labels : 'Simple',
    }),
    new CheckBox({
      labels : 'Checked',
      checked : true,
    }),
    new CheckBox({
      labels : 'Mixed',
      checked : 'mixed',
    }),
    new CheckBox({
      labels : 'Disabled',
      disabled : true,
    }),
  ]
}
