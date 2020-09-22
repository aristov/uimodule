/**
 * The HTMLElement.prototype.oncancel event handler polyfill
 */
if(!HTMLElement.prototype.hasOwnProperty('oncancel')) {
  const key = Symbol('oncancel')
  Object.defineProperty(HTMLElement.prototype, 'oncancel', {
    /**
     * @param {function|null} oncancel
     */
    set(oncancel) {
      const handler = this[key]
      if(handler) {
        this.removeEventListener('cancel', handler)
      }
      if(oncancel) {
        this.addEventListener('cancel', oncancel)
      }
      this[key] = oncancel || null
    },

    /**
     * @returns {function|null}
     */
    get() {
      return this[key] || null
    }
  })
}
