// import api from './api'
import { Heading } from './Heading'
// import { HtmlHr } from './lib'
import { ListBox } from './ListBox'

const options = [
  'Rehearsal',
  'Lesson',
  'Practice',
  'Master class',
  'Concert',
  'Party',
  'Parking',
]

export default async () => {
  // const rows = await api.findRows('Asset', { limit : null })
  return [
    new Heading('ListBox'),
    /*new ListBox({
      labels : 'Ресурсы',
      multiSelectable : true,
      options : rows.map(row => ({ value : row.id, text : row.name })),
    }),
    new HtmlHr,*/
    /*new ListBox({
      labels : 'simple',
      readOnly : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
        selected : i === 3,
      })),
    }),
    new ListBox({
      labels : 'multiSelectable',
      multiSelectable : true,
      readOnly : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
        selected : 2 < i && i < 5,
      })),
    }),
    new ListBox({
      labels : 'checkable',
      checkable : true,
      readOnly : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
        checked : i === 4,
      })),
    }),
    new ListBox({
      labels : 'checkable + required',
      checkable : true,
      required : true,
      readOnly : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
        checked : i === 4,
      })),
    }),
    new ListBox({
      labels : 'multiSelectable + checked',
      multiSelectable : true,
      readOnly : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
        checked : i === 1 || i === 4,
      })),
    }),
    new ListBox({
      labels : 'checkable + multiSelectable',
      checkable : true,
      multiSelectable : true,
      readOnly : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
        checked : i === 1 || i === 4,
      })),
    }),
    new HtmlHr,
    new ListBox({
      labels : 'simple',
      value : 'Практика',
      options : options.map(value => ({
        value,
        text : value,
      })),
    }),
    new ListBox({
      labels : 'multiSelectable',
      multiSelectable : true,
      value : ['Урок', 'Мастер-класс', 'Концерт'],
      options : options.map(value => ({
        value,
        text : value,
      })),
    }),
    new ListBox({
      labels : 'checkable',
      checkable : true,
      value : 'Практика',
      options : options.map(value => ({
        value,
        text : value,
      })),
    }),
    new ListBox({
      labels : 'checkable + required',
      checkable : true,
      required : true,
      value : 'Практика',
      options : options.map(value => ({
        value,
        text : value,
      })),
    }),
    new ListBox({
      labels : 'multiSelectable + checked',
      multiSelectable : true,
      value : ['Репетиция', 'Практика', 'Вечеринка'],
      options : options.map(value => ({
        value,
        text : value,
        checked : false,
      })),
    }),
    new ListBox({
      labels : 'checkable + multiSelectable',
      checkable : true,
      multiSelectable : true,
      value : ['Репетиция', 'Практика', 'Вечеринка'],
      options : options.map(value => ({
        value,
        text : value,
      })),
    }),
    new HtmlHr,*/
    new ListBox({
      labels : 'Simple',
      options : options.map((value, i) => ({
        // value : i + 1,
        text : value,
      })),
    }),
    new ListBox({
      labels : 'MultiSelectable',
      multiSelectable : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
      })),
    }),
    new ListBox({
      labels : 'Checkable',
      checkable : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
      })),
    }),
    new ListBox({
      labels : 'Checkable + required',
      checkable : true,
      required : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
      })),
    }),
    new ListBox({
      labels : 'MultiSelectable + checked',
      multiSelectable : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
        checked : false,
      })),
    }),
    new ListBox({
      labels : 'MultiSelectable + checkable',
      checkable : true,
      multiSelectable : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
      })),
    }),
    /*new ListBox({
      labels : 'Disabled',
      options : options.map((value, i) => ({
        text : value,
      })),
      disabled : true,
    }),*/
  ]
}
