import { DurationGroupBox } from './DurationGroupBox'
import { Heading } from './Heading'

export default () => {
  return [
    new Heading('DurationGroupBox'),
    new DurationGroupBox({
      labels : 'Simple',
      value : {
        months : 3,
        days : 5,
        minutes : 45,
      },
    }),
    /*new DurationGroupBox({
      labels : 'Simple',
      value : {
        years : 2,
        weeks : 3,
        hours : 12,
      },
    }),
    new DurationGroupBox({
      labels : 'Simple',
      value : {
        months : 12,
        days : 14,
        minutes : 180,
      },
    }),
    new DurationGroupBox({
      labels : 'Simple',
      value : {
        months : 13,
        days : 20,
        minutes : 75,
      },
    }),*/
  ]
}
