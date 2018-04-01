import { Textbox } from 'ariamodule'
import { TextArea } from 'htmlmodule'

export class MultiTextbox extends Textbox {
    /**
     * @param {Boolean} multiline
     */
    set multiline(multiline) {}

    /**
     * @returns {Boolean}
     */
    get multiline() {
        return true
    }

    /**
     * @returns {TextArea}
     */
    static get inputAssembler() {
        return TextArea
    }
}
