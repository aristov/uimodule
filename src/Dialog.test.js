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
          new DialogBody([
            new Heading('Hello!'),
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
          new CloseButton,
        ],
      }),
      children : 'Simple dialog',
    }),
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
