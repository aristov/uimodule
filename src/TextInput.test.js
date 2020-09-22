import { Label } from './Label'
import { AppMain } from './AppMain'
import { Button } from './Button'
import { MultiTextInput } from './MultiTextInput'
import { TextInput } from './TextInput'

new AppMain({
  parent : document.body,
  children : [
    new TextInput({
      label : new Label('Комментарий')
    }),
    new Button('Отправить')
  ]
})
new AppMain({
  parent : document.body,
  children : [
    new MultiTextInput({
      label : new Label('Многострочный')
    })
  ]
})
