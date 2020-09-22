/**
 * The DragEvent.prototype.clipboardData getter polyfill (MSIE11)
 */
if(window.DragEvent && !DragEvent.prototype.clipboardData && window.clipboardData) {
  Object.defineProperty(DragEvent.prototype, 'clipboardData', {
    /**
     * @returns {DataTransfer}
     */
    get() {
      return window.clipboardData
    }
  })
}
