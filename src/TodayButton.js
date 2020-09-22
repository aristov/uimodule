import moment from 'moment'
import { ShortcutButton } from './ShortcutButton'
import './TodayButton.css'

export class TodayButton extends ShortcutButton
{
  init(init) {
    super.init(init)
    this.value = moment().format('YYYY-MM-DD')
  }
}
