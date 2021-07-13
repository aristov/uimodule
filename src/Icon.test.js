import { HtmlSpan } from './lib'
import { Heading } from './Heading'
import { Icon } from './Icon'
import config from './icons/config.json'

export default () => {
  return [
    new Heading('Icon'),
    config.glyphs.map(item => new HtmlSpan({
      style : { display : 'inline-block', margin : '6px' },
      children : new Icon(item.css),
    })),
  ]
}
