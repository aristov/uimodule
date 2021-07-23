import { Button } from './Button'
import { Popup } from './Popup'
import { Inner } from './Inner'

export default () => {
  let popup = null
  return [
    new Button({
      onclick : (e, elem) => {
        if(popup) {
          popup.close()
          return
        }
        popup = new Popup({
          anchor : elem,
          children : new Inner({
            style : {
              padding : '20px',
              background : '#fff',
              boxShadow : 'var(--popup-box-shadow)',
              borderRadius : 'var(--control-border-radius)',
            },
            children : new Button({
              text : 'Close the popup',
              onclick : () => popup.close(),
            }),
          }),
        })
        popup.addAttrObserver('hidden', () => popup.hidden && (popup = null))
        popup.show()
      },
      onkeydown : e => e.code === 'Escape' && popup.close(),
      text : 'Popup',
    }),
  ]
}
