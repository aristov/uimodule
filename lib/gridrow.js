import { Row } from 'ariamodule'

export class GridRow extends Row {
    /**
     * @param {*} [init]
     */
    init(init) {
        this.tabIndex = -1
        this.on('keydown', this.onKeyDown.bind(this))
        this.on('focus', this.onFocus.bind(this))
        this.on('blur', this.onBlur.bind(this))
        super.init(init)
    }

    /**
     * @param {FocusEvent} event
     */
    onFocus(event) {
        if(this.selected) this.selected = 'true'
    }

    /**
     * @param {FocusEvent} event
     */
    onBlur(event) {
        if(this.selected) this.selected = 'false'
    }

    /**
     * @param {KeyboardEvent} event
     */
    onKeyDown(event) {
        if(event.key.startsWith('Arrow')) {
            this.onArrowKeyDown(event)
        }
        if(['Enter', ' '].includes(event.key)) {
            event.preventDefault()
            this.emit('click', { bubbles : true, cancelable : true })
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onArrowKeyDown(event) {
        let row
        if(event.key === 'ArrowUp') row = this.previousRow
        if(event.key === 'ArrowDown') row = this.nextRow
        if(row) {
            event.preventDefault()
            this.tabIndex = -1
            row.tabIndex = 0
            row.focus()
        }
    }

    /**
     * @param {*} parentNode
     */
    set parentNode(parentNode) {
        super.parentNode = parentNode
        if(!this.elementIndex) this.tabIndex = 0
    }

    /**
     * @returns {ParentNodeAssembler|*}
     */
    get parentNode() {
        return super.parentNode
    }
}

/**
 * @param {*} [init]
 * @returns {GridRow}
 */
export function gridRow(...init) {
    return new GridRow(...init)
}
