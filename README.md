# uimodule

**Unstable, do not use in production!**

This is a library of accessible UI components.

Based on the [DOM](https://dom.spec.whatwg.org), [HTML](https://html.spec.whatwg.org),
and [WAI-ARIA](https://www.w3.org/TR/wai-aria-1.2) web standards.

- [Showcase](https://aristov.github.io/uimodule)
- [Usage example](https://fusionstudio-v2.herokuapp.com)

_Work in progress_

## Code examples

Button

```js
import { Button } from 'uimodule'

new Button('Simple')

new Button({ pressed : true, text : 'Pressed' })

new Button({ disabled : true, text : 'Disabled' })
```

CheckBox

```js
import { CheckBox } from 'uimodule'

new CheckBox({ labels : 'Simple' })

new CheckBox({ labels : 'Checked', checked : true })

new CheckBox({ labels : 'Mixed', checked : 'mixed' })

new CheckBox({ labels : 'Disabled', disabled : true })
```

RadioGroup + Radio

```js
import { Radio, RadioGroup } from 'uimodule'

new RadioGroup({
  labels : 'Simple',
  children : [
    new Radio({
      checked : true,
      value : '-1',
      labels : 'This event only'
    }),
    new Radio({
      value : '1',
      labels : 'This and all the following'
    }),
    new Radio({
      value : '0',
      labels : 'No more repeats'
    })
  ]
})
```

ListBox

```js
import { ListBox } from 'uimodule'

const options = ['Rehearsal', 'Lesson', 'Practice']

new ListBox({
  labels : 'Simple',
  options : options.map((value, i) => ({ text : value })),
})

new ListBox({
  labels : 'MultiSelectable',
  multiSelectable : true,
  options : options.map((value, i) => ({ value : i + 1, text : value })),
})

new ListBox({
  labels : 'Checkable',
  checkable : true,
  options : options.map((value, i) => ({ value : i + 1, text : value })),
})
```

SelectBox

```js
import { SelectBox } from 'uimodule'

const options = ['Rehearsal', 'Lesson', 'Practice']

new SelectBox({
  labels : 'Simple',
  options : options.map((value, i) => ({ text : value })),
})
new SelectBox({
  labels : 'MultiSelectable',
  multiSelectable : true,
  options : options.map((value, i) => ({ value : i + 1, text : value })),
})
new SelectBox({
  labels : 'Checkable',
  checkable : true,
  options : options.map((value, i) => ({ value : i + 1, text : value })),
})
```

TextBox

```js
import { TextBox } from 'uimodule'

new TextBox({ labels : 'Simple' })

new TextBox({ labels : 'Value', value : 'Hello world!' })

new TextBox({
  labels : 'Disabled',
  value : 'Hello world!',
  disabled : true,
})

new TextBox({
  labels : 'MultiLine',
  value : 'Hello world!',
  multiLine : true,
})
```

SpinButton

```js
import { SpinButton } from 'uimodule'

new SpinButton({ labels : 'Simple' })

new SpinButton({ labels : 'Disabled', disabled : true })
```

MenuButton + PopupMenu

```js
import { MenuButton, PopupMenu } from 'uimodule'

new MenuButton({
  text : 'User menu',
  menu : new PopupMenu([
    new MenuItem('Friends'),
    new MenuItem('Groups'),
    new MenuItem('Events'),
    new MenuItem('Rules'),
    new MenuItem('Exit'),
  ]),
})
```

DialogButton + Dialog

```js
import { 
  Button, CloseButton, DialogBody, DialogButton, 
  DialogHead, Dialog, Heading, TextBox, 
} from 'uimodule'

new DialogButton({
  text : 'Simple dialog',
  dialog : new Dialog([
    new DialogHead([new Heading('Hello!'), new CloseButton]),
    new DialogBody([
      new TextBox({ labels : 'Say something', }),
      new Button({
        text : 'Close',
        onclick : (event, elem) => {
          elem.closest(Dialog).open = false
        },
      }),
    ]),
  ]),
})
```

TabList

```js
import { Tab, TabList, TabPanel, HtmlDiv } from 'uimodule'

const panels = [new TabPanel('1'), new TabPanel('2'), new TabPanel('3')]

new HtmlDiv([
  new TabList([
    new Tab({ panels : panels[0], text : 'First' }),
    new Tab({ panels : panels[1], text : 'Second', selected : true }),
    new Tab({ panels : panels[2], text : 'Third' }),
  ]),
  panels,
])
```

TimeBox

```js
import { TimeBox } from 'uimodule'

new TimeBox({ labels : 'Simple' })

new TimeBox({ labels : 'Required', required : true })

new TimeBox({ labels : 'Min, max', min : '09:00', max : '18:00' })

new TimeBox({
  labels : 'Min, max, value, step',
  min : '9:00',
  max : '24:00',
  value : '15:30',
  step : '00:30',
})
```

DatePicker

```js
import { DatePicker } from 'uimodule'

new DatePicker({ labels : 'Simple' })
```

DateBox

```js
import { DateBox } from 'uimodule'

new DateBox({ labels : 'Simple' })

new DateBox({ labels : 'Required', required : true })

new DateBox({ labels : 'Disabled', disabled : true })
```

For more code examples, see `*.test.js` files located in the [/src](https://github.com/aristov/uimodule/tree/master/src) folder.

## License

[The MIT License (MIT)](https://raw.githubusercontent.com/aristov/uimodule/master/LICENSE)
