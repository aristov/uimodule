import moment from 'moment'
import { Label } from './Label'
import { AppMain } from './AppMain'
import { MonthBox } from './MonthBox'

new AppMain({
  parent : document.body,
  children : [
    new MonthBox({
      label : new Label('Месяц')
    }),
    new MonthBox({
      label : new Label('Месяц'),
      value : moment().format('MM')
    })
  ]
})
