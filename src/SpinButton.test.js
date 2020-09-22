import { Heading } from './Heading'
import { SpinButton } from './SpinButton'

export default () => {
  return [
    new Heading('SpinButton'),
    new SpinButton({
      labels : 'Simple',
    }),
    new SpinButton({
      labels : 'Disabled',
      disabled : true,
    }),
  ]
}
