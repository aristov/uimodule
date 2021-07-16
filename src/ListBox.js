import {
  AriaChecked,
  AriaMultiSelectable,
  AriaOrientation,
  AriaReadOnly,
  AriaRequired,
  AriaSelected,
  DomElem,
} from './lib'
import { Composite } from './Composite'
import { Control } from './Control'
import { Option } from './Option'
import './ListBox.css'

let undefined
const map = Array.prototype.map
const sort = (i, j) => i - j

/**
 * @summary A widget that allows the user to select one or more items from a list of choices.
 * @see https://www.w3.org/TR/wai-aria-1.1/#listbox
 * todo Home + End + PageDown + PageUp
 * todo Type-ahead
 */
class ListBox extends Composite
{
  /**
   * @param {any} init
   */
  constructor(init) {
    if(init && init.constructor !== Object) {
      init = { options : init }
    }
    super(init)
  }

  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this._anchor = null
    this._indexes = []
    this._checkable = false
    this._options = []
    this.children = this._control = new Control({
      onfocus : () => this.focus(), // scrollable element can receive focus in Firefox
    })
    this.on('touchstart', this.onMouseDown)
    if(!init.multiSelectable) {
      this.on(AriaSelected, this.onSelected, { subtree : true })
      this.on(AriaChecked, this.onChecked, { subtree : true })
    }
  }

  /**
   * @param {MutationRecord} record
   * @param {Option} elem
   */
  onSelected(record, elem) {
    if(!elem.selected) {
      return
    }
    const option = this._options.find(option => option !== elem && option.selected)
    option && (option.selected = false)
    this.activeDescendant = elem
  }

  /**
   * @param {MutationRecord} record
   * @param {Option} elem
   */
  onChecked(record, elem) {
    if(!elem.checked) {
      return
    }
    const option = this._options.find(option => option !== elem && option.checked)
    option && (option.checked = false)
  }

  /**
   * @param {{options,value}} init
   */
  assign(init) {
    const { options, value, ...rest } = init
    super.assign(rest)
    this.setProperty('options', options)
    this.setProperty('value', value)
  }

  /**
   * @param {array.Option|array.Object} options
   */
  appendOptions(options) {
    const multiSelectable = this.multiSelectable
    let i = this._options.length
    let checkable = this._checkable
    let anchor = this._anchor
    let activeDescendant
    this._control.append(options.map(option => {
      if(!option) {
        return
      }
      if(!(option instanceof DomElem)) {
        option = new this.constructor.Option(option)
      }
      option.index = i++
      this._options.push(option)
      if(multiSelectable && !anchor && option.selected) {
        anchor = option
      }
      option.selected && (activeDescendant = option)
      if(checkable) {
        if(option.checked === undefined) {
          option.checked = false
        }
      }
      else if(option.checked !== undefined) {
        checkable = true
      }
      return option
    }))
    anchor && (this._anchor = anchor)
    if(activeDescendant) {
      if(!multiSelectable) {
        const option = this.activeDescendant
        option && (option.selected = false)
      }
      this.activeDescendant = activeDescendant
    }
    this._checkable = checkable
  }

  /**
   * @param {boolean} [keepNode]
   */
  destroy(keepNode = false) {
    this._options = []
    super.destroy(keepNode)
  }

  /**
   * @param {number} offset
   * @param {KeyboardEvent|MouseEvent|TouchEvent} event
   * @return {Item|null}
   */
  shiftFocus(offset, event) {
    if(!this._checkable && this.readOnly) {
      return null
    }
    const option = super.shiftFocus(offset, event)
    if(!option) {
      return null
    }
    if(this._anchor) {
      const [i, j] = [this._anchor.index, option.index].sort(sort)
      for(const item of this._options) {
        if(!item.disabled && !item.hidden) {
          item.selected = i <= item.index && item.index <= j
        }
      }
    }
    else for(const item of this._options) {
      if(!item.disabled && !item.hidden) {
        item.selected = item === option
      }
    }
    if(this._control.scrollHeight === this._control.clientHeight) {
      return null
    }
    if(event instanceof KeyboardEvent) {
      this.scrollToOption(option, event.repeat? 'auto' : 'smooth')
      return null
    }
    const { top, bottom, height } = option.rect
    const rect = this._control.rect
    if(bottom + height > rect.bottom) {
      this._control.scrollBy({ top : height, behavior : 'smooth' })
    }
    else if(top - height < rect.top) {
      this._control.scrollBy({ top : -height, behavior : 'smooth' })
    }
    return option
  }

  scrollToOption(option = this.activeDescendant, behavior = 'auto') {
    if(!option) {
      return
    }
    const clientHeight = this._control.clientHeight
    if(this._control.scrollHeight === clientHeight) {
      return
    }
    const { top, bottom, height } = option.rect
    const rect = this._control.rect
    if(bottom + height > rect.bottom || top - height < rect.top) {
      this._control.scrollTo({
        top : option.offsetTop + height / 2 - clientHeight / 2,
        behavior,
      })
    }
  }

  /**
   * @param {MutationRecord} record
   */
  onItem(record) {
    const options = map.call(record.addedNodes, node => Option.get(node)).reverse()
    const selectedOption = options.find(({ selected }) => selected)
    if(selectedOption) {
      this.activeDescendant = selectedOption
    }
    if(this.multiSelectable) {
      return
    }
    if(selectedOption) {
      for(const option of this._options) {
        option === selectedOption || (option.selected = false)
      }
    }
    if(this._checkable) {
      const checkedOption = options.find(({ checked }) => checked)
      if(checkedOption) {
        for(const option of this._options) {
          option === checkedOption || (option.checked = false)
        }
      }
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @param {ListBox} elem
   */
  onKeyDown(event, elem) {
    if(event.code.startsWith('Arrow')) {
      const activeDescendant = this.activeDescendant
      if(this.multiSelectable) {
        this._anchor = event.shiftKey? this._anchor || activeDescendant : null
      }
      if(!this._checkable) {
        super.onKeyDown(event, elem)
        this.activeDescendant === activeDescendant || this.emit('change')
        return
      }
    }
    super.onKeyDown(event, elem)
  }

  /**
   * @param {KeyboardEvent} event
   * @param {ListBox} elem
   */
  onKeyDown_KeyA(event, elem) {
    if(!event.ctrlKey && !event.metaKey) {
      return
    }
    event.preventDefault()
    if(!this._checkable && this.readOnly) {
      return
    }
    if(!this.multiSelectable) {
      return
    }
    let anchor, activeDescendant
    for(const option of this._options) {
      if(!option.disabled && !option.hidden && !option.selected) {
        option.selected = true
        anchor || (anchor = option)
        activeDescendant = option
      }
    }
    if(!anchor) {
      return
    }
    this._anchor = anchor
    this.activeDescendant = activeDescendant
    this._checkable || this.emit('change')
  }

  /**
   * @param {KeyboardEvent} event
   * @param {ListBox} elem
   */
  onKeyDown_Space(event, elem) {
    event.preventDefault()
    if(!this.multiSelectable) {
      const activeDescendant = this.activeDescendant
      activeDescendant && (activeDescendant.class.active = true)
      return
    }
    for(const option of this._options) {
      if(option.selected) {
        option.class.active = true
      }
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @param {ListBox} elem
   */
  onKeyUp_Space(event, elem) {
    if(this.multiSelectable) {
      let change = false
      for(const option of this._options) {
        if(option.selected) {
          option.class.active = false
          if(this._checkable && !this.readOnly) {
            option.checked = !option.checked
            change = true
          }
        }
      }
      change && this.emit('change')
      return
    }
    const activeDescendant = this.activeDescendant
    if(!activeDescendant) {
      return
    }
    activeDescendant.class.active = false
    if(!this._checkable || this.readOnly) {
      return
    }
    const option = this._options.find(({ checked }) => checked)
    if(option === activeDescendant) {
      if(!this.required) {
        option.checked = false
        this.emit('change')
      }
      return
    }
    option && (option.checked = false)
    activeDescendant.checked = true
    this.emit('change')
  }

  /**
   * @param {MouseEvent|TouchEvent} event
   * @param {DomElem} elem
   */
  onMouseDown(event, elem) {
    super.onMouseDown(event, elem)
    if(!this._checkable && this.readOnly) {
      return
    }
    const option = elem.closest(Option)
    if(!option || option.disabled) {
      return
    }
    let activeDescendant = this.activeDescendant
    if(this.multiSelectable) {
      event.type === 'touchstart' && event.preventDefault()
      activeDescendant || (activeDescendant = option)
      if(!this._checkable) {
        this._indexes = [this._anchor? this._anchor.index : -1, activeDescendant.index]
      }
      if(!event.shiftKey) {
        this._anchor = option
        this._options.forEach(item => item.selected = item === option)
      }
      else this.shiftFocus(option.index - activeDescendant.index, event)
    }
    else {
      if(this._checkable) {
        const option = this._options.find(({ checked }) => checked)
        this._indexes = [option? option.index : -1]
        activeDescendant && (activeDescendant.selected = false)
      }
      else if(activeDescendant) {
        this._indexes = [activeDescendant.index]
        activeDescendant.selected = false
      }
      else this._indexes = [-1]
      option.selected || (option.selected = true)
    }
    this.activeDescendant = option
    if(event.type === 'touchstart') {
      this.on('touchmove', this.onMouseOver)
      this.doc.on('touchend', this.onDocMouseUp, this)
    }
    else {
      this.on('mouseover', this.onMouseOver)
      this.doc.on('mouseup', this.onDocMouseUp, this)
    }
  }

  /**
   * @param {MouseEvent|TouchEvent} event
   * @param {DomElem} elem
   */
  onMouseOver(event, elem) {
    if(event.type === 'touchmove') {
      const { clientX, clientY } = event.touches[0]
      const node = document.elementFromPoint(clientX, clientY)?.closest('[role~=Option]')
      if(!node) {
        return
      }
      elem = Option.get(node)
    }
    if(!(elem instanceof Option) || elem.disabled) {
      return
    }
    this.shiftFocus(elem.index - this.activeDescendant.index, event)
  }

  /**
   * @param {MouseEvent|TouchEvent} event
   * @param {DomElem} elem
   */
  onDocMouseUp(event, elem) {
    if(event.type === 'touchend') {
      this.off('touchmove', this.onMouseOver)
      this.doc.off('touchend', this.onDocMouseUp, this)
    }
    else {
      this.off('mouseover', this.onMouseOver)
      this.doc.off('mouseup', this.onDocMouseUp, this)
    }
    const { activeDescendant, multiSelectable } = this
    const indexes = multiSelectable?
      [this._anchor.index, activeDescendant.index].sort(sort) :
      [activeDescendant.index]
    if(this._checkable) {
      if(this.readOnly) {
        return
      }
      if(multiSelectable) {
        const options = this.options
        let [i, j] = indexes
        do options[i].checked = !options[i].checked
        while(i++ < j)
        this.emit('change')
        return
      }
      const option = this._options[this._indexes[0]]
      if(option === activeDescendant) {
        if(option.checked) {
          if(!this.required) {
            option.checked = false
            this.emit('change')
          }
          return
        }
        option.checked = true
        this.emit('change')
        return
      }
      option && (option.checked = false)
      activeDescendant.checked = true
      this.emit('change')
      return
    }
    String(indexes) === String(this._indexes.sort(sort)) || this.emit('change')
  }

  /**
   * @return {boolean}
   */
  get checkable() {
    return this._checkable
  }

  /**
   * @param {boolean} checkable
   */
  set checkable(checkable) {
    if(this._checkable = checkable) {
      // this.multiSelectable = true
    }
    for(const option of this._options) {
      if(checkable) {
        if(option.checked === undefined) {
          option.checked = false
        }
      }
      else if(option.checked !== undefined) {
        option.checked = undefined
      }
    }
  }

  /**
   * @returns {object[]}
   */
  get options() {
    return this._options
  }

  /**
   * @param {object[]} options
   */
  set options(options) {
    this._anchor = null
    this.activeDescendant = null
    this._options = []
    this._control.children = null
    this.appendOptions(options)
  }

  /**
   * @returns {any|array.any|null}
   */
  get value() {
    if(this.multiSelectable) {
      const value = []
      const attr = this._checkable? 'checked' : 'selected'
      for(const option of this._options) {
        option[attr] && value.push(option.value)
      }
      return value.length? value : null
    }
    if(this._checkable) {
      const option = this._options.find(({ checked }) => checked)
      return option? option.value : null
    }
    const activeDescendant = this.activeDescendant
    return activeDescendant && activeDescendant.value
  }

  /**
   * @param {any|array.any|null} value
   */
  set value(value) {
    const attr = this._checkable? 'checked' : 'selected'
    if(this.multiSelectable) {
      if(!Array.isArray(value)) {
        value = value === null? [] : [value]
      }
      let anchor, activeDescendant
      for(const option of this._options) {
        if(option[attr] = value.includes(option.value)) {
          anchor || (anchor = option)
          activeDescendant = option
        }
      }
      this._anchor = anchor
      this.activeDescendant = activeDescendant
      return
    }
    const oldOption = this._checkable?
      this._options.find(({ checked }) => checked) :
      this.activeDescendant
    const newOption = this._options.find(option => option.value === value)
    if(newOption === oldOption) {
      return
    }
    oldOption && (oldOption[attr] = false)
    newOption && (newOption[attr] = true)
    if(!this._checkable) {
      this.activeDescendant = newOption || null
    }
  }

  /**
   * @return {*[]}
   */
  get values() {
    const value = this.value
    if(value === null) {
      return []
    }
    return this.multiSelectable? value : [value]
  }

  /**
   * @returns {boolean}
   */
  get multiSelectable() {
    return this.getAttr(AriaMultiSelectable)
  }

  /**
   * @param {boolean} multiSelectable
   */
  set multiSelectable(multiSelectable) {
    this.setAttr(AriaMultiSelectable, multiSelectable)
    if(multiSelectable) {
      this.off(AriaSelected, this.onSelected)
      this.off(AriaChecked, this.onChecked)
      return
    }
    this.on(AriaSelected, this.onSelected, { subtree : true })
    this.on(AriaChecked, this.onChecked, { subtree : true })
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return this.getAttr(AriaOrientation) || 'vertical'
  }

  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    this.setAttr(AriaOrientation, orientation)
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(AriaReadOnly)
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(AriaReadOnly, readOnly)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(AriaRequired)
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(AriaRequired, required)
  }

  /**
   * @returns {Option[]}
   */
  get selectedOptions() {
    return this.findAll(Option, ({ selected }) => selected)
  }

  /**
   * @returns {Option[]}
   */
  get checkedOptions() {
    return this.findAll(Option, ({ checked }) => checked)
  }
}

ListBox.Option = ListBox.Item = Option
ListBox.tabIndex = 0

export { ListBox, Option }
