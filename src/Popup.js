import debounce from 'lodash/debounce'
import { HtmlDiv, Role } from './lib'
import './Popup.css'

const DEBOUNCE_WAIT = 200

export class Popup extends HtmlDiv
{
  /**
   * @param {{}} init
   * @param {HtmlElem|Role} [init.anchor]
   * @param {string} [init.direction='bottom-right'] (bottom-right, right-bottom)
   */
  init(init) {
    super.init(init)
    this._parent = null
    this._position = [null, null]
    this._timeoutId = null
    this.anchor = init.anchor || null
    this.updatePositionDebounce = debounce(this.updatePosition.bind(this), DEBOUNCE_WAIT)
    this.tabIndex = -1
    this.hidden = true
    this.on('keydown', this.onKeyDown)
    // this._observer = new IntersectionObserver(entry => this.updatePosition(), { threshold : 1 })
  }

  /**
   * Open the popup
   */
  show() {
    if(!this.hidden) {
      return
    }
    const { doc, win } = this
    this.hidden = false
    if(this._parent && !this.parent) {
      this.parent = this._parent
    }
    else if(this.parent) {
      this._parent = this.parent
    }
    else if(this.anchor && !this.modal) {
      this.anchor.after(this)
    }
    else this.parent = this.doc.body
    this.updatePosition()
    setTimeout(() => {
      if(!this.node) {
        return
      }
      this.hidden = null
      doc.on('click', this.onDocClick, this)
      doc.on('focusin', this.onDocFocusIn, this)
      // doc.on('keydown', this.onDocKeyDown, this)
      doc.on('scroll', this.onDocScroll, {
        context : this,
        capture : true,
      })
      win.on('resize', this.onWinResize, this)
      // this._observer.observe(this.node)
    })
  }

  /**
   * Close the popup
   */
  close() {
    if(this.hidden) {
      return
    }
    const handler = () => {
      clearTimeout(timeoutId)
      if(this.node) {
        this.off('transitionend', handler)
        this.drop()
      }
    }
    const timeoutId = setTimeout(handler, Math.max(...this.durations))
    const doc = this.doc
    if(this.anchor) {
      if(this.modal || this.contains(doc.activeElem)) {
        this.anchor.focus()
      }
    }
    this._timeoutId && clearTimeout(this._timeoutId)
    doc.off('click', this.onDocClick, this)
    doc.off('focusin', this.onDocFocusIn, this)
    // doc.off('keydown', this.onDocKeyDown, this)
    doc.off('scroll', this.onDocScroll, {
      context : this,
      capture : true,
    })
    this.win.off('resize', this.onWinResize, this)
    // this._observer.disconnect()
    this.on('transitionend', handler)
    this.hidden = true
  }

  /**
   * Drop the popup
   */
  drop() {
    if(Array.from(this.doc.__refs.keys()).some(elem => elem.controls.includes(this))) {
      this.remove()
      this.updatePosition()
    }
    else this.destroy()
  }

  /**
   * @param {boolean} [keepNode=false]
   */
  destroy(keepNode = false) {
    this.anchor = null
    this._timeoutId && clearTimeout(this._timeoutId)
    super.destroy(keepNode)
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onDocClick(event, elem) {
    if(this.anchor && this.anchor.contains(elem)) {
      return
    }
    /*if(this.modal) {
      elem === this && this.close()*/
    if(elem === this) {
      this.close()
      return
    }
    this.contains(elem) || this.close()
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   */
  onDocFocusIn(event, elem) {
    if(this.anchor && this.anchor.contains(elem)) {
      return
    }
    const popup = elem.closest(Popup)
    if(popup && popup.modal && !popup.contains(this)) {
      return
    }
    this.contains(elem) || this.close()
  }

  /**
   * @param {KeyboardEvent} event
   */
  onDocKeyDown(event) {
    if(event.key === 'Escape') {
      this.close()
    }
  }

  /**
   * @param {Event} event
   * @param {DomNode} target
   */
  onDocScroll(event, target) {
    if(!this.anchor
      || this.modal
      || this.direction === 'none'
      || !this.parent
      || !target.contains(this)) {
      return
    }
    const style = this.style
    const popup = this.rect
    const anchor = this.anchor.rect
    const [top, left] = this._position
    clearTimeout(this._timeoutId)
    style.transition = 'none'
    style.top = popup.top + anchor.top - top + 'px'
    style.left = popup.left + anchor.left - left + 'px'
    this._position = [anchor.top, anchor.left]
    this.updatePositionDebounce()
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    if(event.code === 'Escape') {
      event.stopPropagation()
      this.close()
    }
  }

  /**
   * @param {Event} event
   */
  onWinResize(event) {
    this.updatePositionDebounce()
  }

  /**
   * Update the popup position
   */
  updatePosition() {
    const direction = this.direction
    if(direction === 'none' || !this.anchor || this.modal || !this.parent) {
      return this.setPosition(this._position = [null, null])
    }
    const anchor = this.anchor.rect
    const popup = this.rect
    const { alternatives, fallback } = directions[direction]
    let item, position
    this._timeoutId = setTimeout(() => this.node && this.updatePosition(), 1000)
    for(item of [direction, ...alternatives]) {
      if(position = directions[item].handler(anchor, popup)) {
        this.setPosition(position)
        this._position = [anchor.top, anchor.left]
        return
      }
    }
    this.setPosition(fallback())
    this._position = [anchor.top, anchor.left]
  }

  /**
   * @param {array} position
   */
  setPosition([top, left]) {
    const style = this.style
    style.transition = null
    style.top = top === null?
      null :
      Math.min(Math.max(top, 0), innerHeight - this.rect.height) + 'px'
    style.left = left === null?
      null :
      Math.min(Math.max(left, 0), innerWidth - this.rect.width) + 'px'
  }

  /**
   * @return {string}
   */
  get direction() {
    return this.dataset.direction || 'bottom-right'
  }

  /**
   * @param {string} direction
   */
  set direction(direction) {
    this.dataset.direction = direction
    this.updatePosition()
  }

  /**
   * @returns {number[]}
   */
  get durations() {
    if(!this.parent) {
      return [0]
    }
    const durations = this.computedStyle.transitionDuration.split(', ')
    return durations.map(duration => parseFloat(duration) * 1000)
  }

  /**
   * @returns {boolean|null}
   */
  get hidden() {
    const hidden = this.getAttr('hidden')
    return hidden? hidden === 'true' : null
  }

  /**
   * @param {boolean|null} hidden
   */
  set hidden(hidden) {
    if(hidden === this.hidden) {
      return
    }
    this.setAttr('hidden', hidden)
  }

  /**
   * @returns {boolean}
   */
  get modal() {
    return this.classList.contains('modal')
  }

  /**
   * @param {boolean} modal
   */
  set modal(modal) {
    this.classList.toggle('modal', modal)
    this.updatePosition()
  }
}

const directions = {
  'top-left' : {
    handler : (anchor, popup) => {
      if(anchor.top - popup.height > 0) {
        return [anchor.top - popup.height, anchor.right - popup.width]
      }
    },
    fallback : () => [0, 0],
    alternatives : ['bottom-left', 'left-top', 'right-top'],
  },
  'top-right' : {
    handler : (anchor, popup) => {
      if(anchor.top - popup.height > 0) {
        return [anchor.top - popup.height, anchor.left]
      }
    },
    fallback : () => [0, innerWidth],
    alternatives : ['bottom-right', 'right-top', 'left-top'],
  },
  'right-top' : {
    handler : (anchor, popup) => {
      if(anchor.right + popup.width < innerWidth) {
        return [anchor.bottom - popup.height, anchor.right]
      }
    },
    fallback : () => [0, innerWidth],
    alternatives : ['left-top', 'top-right', 'bottom-right'],
  },
  'right-bottom' : {
    handler : (anchor, popup) => {
      if(anchor.right + popup.width < innerWidth) {
        return [anchor.top, anchor.right]
      }
    },
    fallback : () => [innerHeight, innerWidth],
    alternatives : ['left-bottom', 'bottom-right', 'top-right'],
  },
  'bottom-right' : {
    handler : (anchor, popup) => {
      if(anchor.bottom + popup.height < innerHeight) {
        return [anchor.bottom, anchor.left]
      }
    },
    fallback : () => [innerHeight, innerWidth],
    alternatives : ['top-right', 'right-bottom', 'left-bottom'],
  },
  'bottom-left' : {
    handler : (anchor, popup) => {
      if(anchor.bottom + popup.height < innerHeight) {
        return [anchor.bottom, anchor.right - popup.width]
      }
    },
    fallback : () => [innerHeight, 0],
    alternatives : ['top-left', 'left-bottom', 'right-bottom'],
  },
  'left-bottom' : {
    handler : (anchor, popup) => {
      if(anchor.left - popup.width > 0) {
        return [anchor.top, anchor.left - popup.width]
      }
    },
    fallback : () => [innerHeight, 0],
    alternatives : ['right-bottom', 'bottom-left', 'top-left'],
  },
  'left-top' : {
    handler : (anchor, popup) => {
      if(anchor.left - popup.width > 0) {
        return [anchor.bottom - popup.height, anchor.left - popup.width]
      }
    },
    fallback : () => [0, 0],
    alternatives : ['right-top', 'top-left', 'bottom-left'],
  },
}
