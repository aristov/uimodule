// import api from './api'
import { Heading } from './Heading'
// import { HtmlHr } from './lib'
import { SelectBox } from './SelectBox'

export default /*async*/ () => {
  // const assets = await api.findRows('Asset', { limit : null })
  return [
    new Heading('SelectBox'),
    new SelectBox({
      labels : 'Simple',
      options,
    }),
    new SelectBox({
      labels : 'MultiSelectable',
      multiSelectable : true,
      options,
    }),
    new SelectBox({
      labels : 'Checkable',
      checkable : true,
      options : options,
    }),
    new SelectBox({
      labels : 'Checkable + required',
      checkable : true,
      required : true,
      options : options,
    }),
    new SelectBox({
      labels : 'MultiSelectable + checkable',
      multiSelectable : true,
      checkable : true,
      options : options,
    }),
    new SelectBox({
      labels : 'MultiSelectable + checked',
      multiSelectable : true,
      options : options.map(option => Object.assign({ checked : false }, option)),
    }),
    new SelectBox({
      labels : 'Disabled',
      options,
      disabled : true,
    }),
    /*new HtmlHr,
    new SelectBox({
      labels : 'Ресурсы',
      options : assets.map(row => ({ value : row.id, text : row.name })),
    }),*/
  ]
}

const options = [
  {
    value : 'rehearsal',
    text : 'Rehearsal',
  },
  {
    value : 'lesson',
    text : 'Lesson',
  },
  {
    value : 'practice',
    text : 'Practice',
  },
  {
    value : 'masterclass',
    text : 'Master class',
  },
  {
    value : 'concert',
    text : 'Concert',
  },
  {
    value : 'party',
    text : 'Party',
  },
  {
    value : 'parking',
    text : 'Parking',
  },
]
