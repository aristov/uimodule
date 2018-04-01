import { Select, Option, Button, Listbox, Expanded, ReadOnly } from 'ariamodule'
import { Label, Span } from 'htmlmodule'

export class Selectbox extends Select {
    /**
     * @param {*} [init]
     */
    init(init) {
        this.children = [
            new Button({
                hasPopup : 'listbox',
                onclick : this.onButtonClick.bind(this)
            }),
            new Listbox({
                tabIndex : NaN,
                classList : 'popup',
                onchange : this.onListBoxChange.bind(this)
            })
        ]
        this.on('keydown', this.onKeyDown.bind(this))
        this.on('keyup', this.onKeyUp.bind(this))
        this.onDocumentClick = this.onDocumentClick.bind(this)
        this.onDocumentFocus = this.onDocumentFocus.bind(this)
        super.init(init)
    }

    /**
     * Focus the selectbox
     */
    focus() {
        this.button.focus()
    }

    /**
     * @param {MouseEvent} event
     */
    onButtonClick(event) {
        const expanded = this.expanded
        if(expanded === 'true') {
            if(!this.multiselectable || !this.find(Option, '[aria-checked]')) {
                this.expanded = 'false'
            }
        }
        else this.expanded = 'true'
    }

    /**
     * @param {MouseEvent} event
     */
    onDocumentClick(event) {
        const target = event.target
        if(!this.contains(target)) {
            this.expanded = 'false'
        }
        if(this.listbox.contains(target)) {
            if(this.multiselectable) {
                this.focus()
            }
            else {
                this.expanded = 'false'
                this.focus()
            }
        }
    }

    /**
     * @param {FocusEvent} event
     */
    onDocumentFocus(event) {
        if(!this.contains(event.target)) {
            this.expanded = 'false'
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onKeyDown(event) {
        const key = event.key
        if(key === 'Enter') event.stopPropagation()
        if(key === 'Escape' && this.expanded === 'true') {
            event.stopPropagation()
            this.expanded = 'false'
        }
        else if(key === ' ' && !event.repeat) {
            this.onSpaceKeyDown(event)
        }
        else if(key.startsWith('Arrow')) {
            event.preventDefault()
            if(this.expanded === 'false') {
                this.expanded = 'true'
            }
            else this.listbox.onArrowKeyDown(event)
        }
    }

    /**
     * @param {KeyboardEvent} event
     */
    onKeyUp(event) {
        if(event.key === ' ') {
            if(this.expanded === 'false' || this.multiselectable) {
                this.listbox.onSpaceKeyUp(event)
            }
        }
    }

    /**
     * @param {CustomEvent} event
     */
    onListBoxChange(event) {
        event.stopPropagation()
        this.button.textContent = this.listbox.text || '—'
        this.emit('change', { bubbles : true, detail : event.detail })
    }

    /**
     * @param event
     */
    onSpaceKeyDown(event) {
        if(this.expanded === 'true' && this.find(Option, '[aria-checked]')) {
            this.listbox.onSpaceKeyDown(event)
        }
    }

    /**
     * @returns {Button|null}
     */
    get button() {
        return this.find(Button)
    }

    set disabled(disabled) {
        this.button.disabled = disabled
        this.listbox.disabled = disabled
        super.disabled = disabled
    }

    get disabled() {
        return super.disabled
    }

    /**
     * @param {String} expanded
     */
    set expanded(expanded) {
        const doc = this.ownerDocument
        if(expanded === 'true') {
            const listbox = this.listbox
            if(!listbox.selectedOption) {
                listbox.options[0].selected = 'true'
            }
            doc.on('click', this.onDocumentClick)
            doc.on('focus', this.onDocumentFocus, true)
        }
        else {
            doc.un('click', this.onDocumentClick)
            doc.un('focus', this.onDocumentFocus, true)
        }
        this.setAttribute(Expanded, expanded)
    }

    /**
     * @returns {String}
     */
    get expanded() {
        return this.hasAttribute(Expanded)?
            this.getAttribute(Expanded) :
            'false'
    }

    /**
     * @param {String} label
     */
    set label(label) {
        const instance = this.labelledBy[0]
        if(instance) instance.textContent = label
        else {
            const instance = new Label({
                id : this.id + '-label',
                onclick : () => this.focus(),
                children : label
            })
            this.labelledBy = [instance]
            this.ownerElement.prepend(instance)
        }
    }

    /**
     * @returns {String}
     */
    get label() {
        const instance = this.labelledBy[0]
        return instance? instance.textContent : ''
    }

    /**
     * @returns {Listbox|null}
     */
    get listbox() {
        return this.find(Listbox)
    }

    /**
     * @param {Boolean} multiselectable
     */
    set multiselectable(multiselectable) {
        this.listbox.multiselectable = multiselectable
    }

    /**
     * @returns {Boolean}
     */
    get multiselectable() {
        return this.listbox.multiselectable
    }

    /**
     * @param {String} name
     */
    set name(name) {
        this.listbox.name = name
    }

    /**
     * @returns {String}
     */
    get name() {
        return this.listbox.name
    }

    /**
     * @param {Option[]} options
     */
    set options(options) {
        const listbox = this.listbox
        listbox.options = options
        const option = this.find(Option, '[aria-checked]')?
            listbox.checkedOption :
            listbox.selectedOption || options[0]
        this.text = option? option.textContent : '—'
    }

    /**
     * @returns {Option[]}
     */
    get options() {
        return this.listbox.options
    }

    /**
     * @param {Boolean} readOnly
     */
    set readOnly(readOnly) {
        this.listbox.readOnly = readOnly
        this.setAttribute(ReadOnly, readOnly)
    }

    /**
     * @returns {Boolean}
     */
    get readOnly() {
        return this.getAttribute(ReadOnly)
    }

    /**
     * @param {String} text
     */
    set text(text) {
        this.button.textContent = text
    }

    /**
     * @returns {String}
     */
    get text() {
        return this.button.textContent
    }

    /**
     * @param {String} value
     */
    set value(value) {
        this.listbox.options.forEach(option => {
            option.selected = String(option.value === value)
        })
        this.listbox.value = value
    }

    /**
     * @returns {String}
     */
    get value() {
        return this.listbox.value
    }

    /**
     * @returns {Boolean}
     */
    static get abstract() {
        return false
    }

    /**
     * @returns {Function} Span
     */
    static get elementAssembler() {
        return Span
    }
}

/**
 * @param {...*} [init]
 * @returns {Selectbox}
 */
export function selectbox(...init) {
    return new Selectbox(...init)
}
