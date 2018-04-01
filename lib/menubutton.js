import { Button } from 'ariamodule'

export class MenuButton extends Button {
    /**
     * @param {*} init
     */
    init(init) {
        super.init(init)
        this.hasPopup = 'menu'
        this.expanded = 'false'
        this.menu.classList.add('popup')
        this.menu.on('keydown', this.onMenuKeyDown.bind(this))
        this.onDocumentClick = this.onDocumentClick.bind(this)
        this.onDocumentFocus = this.onDocumentFocus.bind(this)
    }

    /**
     * Activate the menu button
     */
    activate() {
        this.expanded = String(this.expanded === 'false')
    }

    /**
     * @param {HTMLElement} target
     */
    onDocumentClick({ target }) {
        if(!this.contains(target) && !this.menu.contains(target)) {
            this.expanded = 'false'
        }
    }

    /**
     * @param {HTMLElement} target
     */
    onDocumentFocus({ target }) {
        const node = this.ownerElement.node
        const menu = this.menu
        if(target !== node && !menu.contains(target)) {
            this.expanded = 'false'
        }
    }

    /**
     * @param {String} key
     */
    onMenuKeyDown({ key }) {
        if(key === 'Escape') {
            this.expanded = 'false'
            this.focus()
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onKeyDown(event) {
        super.onKeyDown(event)
        const key = event.key
        if(key === 'ArrowDown' || key === 'ArrowUp') {
            if(this.expanded === 'false') this.expanded = 'true'
            const items = this.menu.items
            items[key === 'ArrowDown'? 0 : items.length - 1].focus()
            event.preventDefault()
        }
        if(key === 'Escape') this.expanded = 'false'
    }

    /**
     * @param {String} expanded
     */
    set expanded(expanded) {
        const document = this.ownerDocument
        super.expanded = expanded
        this.menu.hidden = expanded === 'false'
        if(expanded === 'true') {
            document.on('click', this.onDocumentClick)
            document.on('focus', this.onDocumentFocus, true)
        } else {
            document.un('click', this.onDocumentClick)
            document.un('focus', this.onDocumentFocus, true)
        }
    }

    /**
     * @returns {String}
     */
    get expanded() {
        return super.expanded
    }

    /**
     * @param {Menu} menu
     */
    set menu(menu) {
        menu.trigger = this
        this.controls = this._menu = menu
    }

    /**
     * @returns {Menu}
     */
    get menu() {
        return this._menu
    }

    /**
     * @param {*} parentNode
     */
    set parentNode(parentNode) {
        super.parentNode = parentNode
        this.ownerElement.after(this.menu.ownerElement)
    }

    /**
     * @returns {*}
     */
    get parentNode() {
        return super.parentNode
    }
}

/**
 * @param {*} [init]
 * @returns {MenuButton}
 */
export function menuButton(...init) {
    return new MenuButton(...init)
}
