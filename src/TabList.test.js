import { Heading } from './Heading'
import { Tab, TabList } from './TabList'
import { TabPanel } from './TabPanel'
import { Test } from './Test'

export default () => {
  const panels = [
    new TabPanel('1'),
    new TabPanel('2'),
    new TabPanel('3'),
  ]
  return new Test([
    new Heading('TabList'),
    new TabList([
      new Tab({
        panels : panels[0],
        children : 'First',
      }),
      new Tab({
        selected : true,
        panels : panels[1],
        children : 'Second',
      }),
      new Tab({
        panels : panels[2],
        children : 'Third',
      }),
    ]),
    panels,
  ])
}
