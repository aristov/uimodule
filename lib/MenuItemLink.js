import { MenuItem } from 'ariamodule'
import { A } from 'htmlmodule'

export class MenuItemLink extends MenuItem {
    /**
     * @returns {class}
     */
    static get elementAssembler() {
        return A
    }
}
