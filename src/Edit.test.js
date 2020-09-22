import { Edit } from './Edit'
import { HtmlBr, HtmlDiv } from './lib'

export default () => {
  return [
    new Edit({ style : { border : '1px solid' } }),
    new HtmlBr,
    new HtmlDiv({
      contentEditable : 'true',
      style : { border : '1px solid' },
    }),
    new HtmlBr,
    new HtmlDiv({
      contentEditable : 'plaintext-only',
      style : { border : '1px solid' },
    }),
    new HtmlBr,
    new HtmlDiv({
      contentEditable : 'plaintext-only',
      style : {
        border : '1px solid',
        whiteSpace : 'nowrap',
      },
    }),
  ]
}
