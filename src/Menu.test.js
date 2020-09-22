import { Heading } from './Heading'
import { MenuItem } from './Menu'
import { MenuButton } from './MenuButton'
import { PopupMenu } from './PopupMenu'

export default () => {
  return [
    new Heading('MenuButton + PopupMenu'),
    new MenuButton({
      menu : new PopupMenu([
        new MenuItem('Events'),
        new MenuItem('Groups'),
        new MenuItem('Friends'),
        new MenuItem('Equipment'),
        new MenuItem('Rooms'),
        new MenuItem('Schedule'),
        new MenuItem('Information'),
        new MenuItem('Rules'),
        new MenuItem('Exit'),
      ]),
      text : 'User menu',
    }),
  ]
}
