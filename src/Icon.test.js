import { Heading } from './Heading'
import { Icon } from './Icon'
import config from './icons/config.json'

export default () => {
  return [
    new Heading('Icon'),
    config.glyphs.map(item => new Icon(item.css))
  ]
}
