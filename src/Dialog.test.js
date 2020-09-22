import { Button } from './Button'
import { CloseButton } from './CloseButton'
import { DialogBody } from './DialogBody'
import { DialogButton } from './DialogButton'
import { DialogHead } from './DialogHead'
import { Dialog } from './Dialog'
import { Heading } from './Heading'
import { TextBox } from './TextBox'

export default () => {
  return [
    new Heading('DialogButton + Dialog'),
    new DialogButton({
      dialog : new Dialog({
        children : [
          new DialogHead([
            new Heading('Hello!'),
            new CloseButton,
          ]),
          new DialogBody([
            new TextBox({
              labels : 'Say something',
            }),
            new Button({
              onclick : (event, elem) => {
                elem.closest(Dialog).open = false
              },
              text : 'Close',
            }),
          ]),
        ],
      }),
      children : 'Simple dialog',
    }),
    new DialogButton({
      dialog : new Dialog({
        modal : true,
        children : [
          new DialogHead([
            new Heading('Hello!'),
            new CloseButton,
          ]),
          new DialogBody([
            new TextBox({
              labels : 'Say something',
            }),
            new Button({
              onclick : (event, elem) => {
                elem.closest(Dialog).open = false
              },
              text : 'Close',
            }),
          ]),
        ],
      }),
      children : 'Modal dialog',
    }),
  ]
}

/*import { CancelButton } from './CancelButton'
import { FootGroup } from './FootGroup'
import { Form } from './Form'
import { ModalDialog } from './ModalDialog'
import { UserBadge } from './UserBadge'
import data from '../data/userdata'

new AppMain({
  parent : document.body,
  children : [
    new DialogButton({
      dialog : new ModalDialog({
        children : new Form({
          label : new Heading('Выход'),
          children : [
            new UserBadge({
              data : data[0]
            }),
            new FootGroup([
              new Button({
                onclick : event => location.reload(),
                children : 'Выйти'
              }),
              new CancelButton('Отмена')
            ]),
            new CloseButton
          ]
        })
      }),
      children : 'Выход'
    })
  ]
})*/

