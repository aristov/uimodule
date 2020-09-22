import 'focus-visible'
import './root.css'
import { Showcase } from './Showcase'
import { Test } from './Test'

new Showcase({
  parent : document.body,
  children : [
    require('./Heading.test').default(),
    require('./Button.test').default(),
    require('./CheckBox.test').default(),
    require('./RadioGroup.test').default(),
    require('./ListBox.test').default(),
    require('./SelectBox.test').default(),
    require('./TextBox.test').default(),
    require('./SpinButton.test').default(),

    require('./Menu.test').default(),
    require('./Dialog.test').default(),
    require('./TabList.test').default(),

    require('./NumberRangeBox.test').default(),

    require('./TimeBox.test').default(),
    require('./TimeRangeListBox.test').default(),
    require('./TimeRangeBox.test').default(),

    require('./DurationBox.test').default(),
    require('./IntervalBox.test').default(),
    require('./DurationGroupBox.test').default(),

    require('./MonthYearBox.test').default(),
    require('./DatePicker.test').default(),
    require('./DateBox.test').default(),

    require('./DateTimeBox.test').default(),
    require('./DateTimeRangeBox.test').default(),
  ]
  .map(test => test instanceof Test? test : new Test(test))
})
