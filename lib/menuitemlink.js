import { MenuItem } from 'ariamodule'
import { A } from 'htmlmodule'

export class MenuItemLink extends MenuItem {
    /**
     * @param {KeyboardEvent} event
     */
    onKeyDown(event) {
        if(event.key !== 'Enter') {
            super.onKeyDown(event)
        }
    }

    /**
     * @param { KeyboardEvent } event
     */
    onKeyUp(event) {
        super.onKeyUp(event)
        if(event.key === ' ') {
            if(this.href) location = this.href
        }
    }

    /**
     * @param {String} href
     */
    set href(href) {
        this.ownerElement.href = href
    }

    /**
     * @returns {String}
     */
    get href() {
        return this.ownerElement.href
    }

    /**
     * @param {String} target
     */
    set target(target) {
        this.ownerElement.target = target
    }

    /**
     * @returns {String}
     */
    get target() {
        return this.ownerElement.target
    }

    /**
     * @returns {Function}
     */
    static get elementAssembler() {
        return A
    }
}

/**
 * @param {*} [init]
 * @returns {MenuItemLink}
 */
export function menuItemLink(...init) {
    return new MenuItemLink(...init)
}
