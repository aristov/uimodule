import 'focus-visible'
import '../src/root.css'
import { Showcase } from '../src/Showcase'
import { Test } from '../src/Test'

new Showcase({
  parent : document.body,
  children : [
    require('../src/Heading.test').default(),
    require('../src/Button.test').default(),
    require('../src/CheckBox.test').default(),
    require('../src/RadioGroup.test').default(),
    require('../src/ListBox.test').default(),
    require('../src/SelectBox.test').default(),
    require('../src/TextBox.test').default(),
    require('../src/SpinButton.test').default(),

    require('../src/Menu.test').default(),
    require('../src/Dialog.test').default(),
    require('../src/TabList.test').default(),

    require('../src/NumberRangeBox.test').default(),

    require('../src/TimeBox.test').default(),
    require('../src/TimeRangeListBox.test').default(),
    require('../src/TimeRangeBox.test').default(),

    require('../src/DurationBox.test').default(),
    require('../src/IntervalBox.test').default(),
    require('../src/DurationGroupBox.test').default(),

    require('../src/MonthYearBox.test').default(),
    require('../src/DatePicker.test').default(),
    require('../src/DateBox.test').default(),

    require('../src/DateTimeBox.test').default(),
    require('../src/DateTimeRangeBox.test').default(),
  ]
  .map(test => test instanceof Test? test : new Test(test))
})
