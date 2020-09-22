import { AppMain } from './AppMain'
import { Button } from './Button'
import { Popup } from './Popup'
import { Inner } from './Inner'

new AppMain({
  parent : document.body,
  children : [
    new Button({
      onclick : event => new Popup({
        anchor : Button.get(event.target),
        expanded : true,
        children : new Inner('Попап')
      }),
      children : 'Попап'
    })
  ]
})
