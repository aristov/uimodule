import { AriaLabelledBy, RoleRoleType } from './lib'
import { Label } from './Label'

Object.defineProperty(RoleRoleType.prototype, 'labels', {
  configurable : true,
  /**
   * @param {string|DomElem|array|*} labels
   */
  set(labels) {
    if(!Array.isArray(labels)) {
      labels = [labels]
    }
    const labelledBy = []
    let label
    for(let i = 0; i < 2; i++) {
      label = labels[i]
      if(label) {
        label = typeof label === 'string'? new Label(label) : label
        this[i? 'append' : 'prepend'](label)
        labelledBy.push(label)
      }
    }
    this.setAttr(AriaLabelledBy, labelledBy)
  },

  /**
   * @returns {DomElem[]}
   */
  get() {
    return this.getAttr(AriaLabelledBy)
  }
})
