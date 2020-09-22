import { AriaChecked, AriaDisabled, RoleRadio, RoleRadioGroup } from './lib'
import { Radio } from './Radio'
import './RadioGroup.css'

/**
 * @summary A group of radio buttons.
 * @see https://www.w3.org/TR/wai-aria-1.1/#radiogroup
 */
class RadioGroup extends RoleRadioGroup
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this._radios = this.radios
    this.resetTabIndex()
    this.on(AriaChecked, this.onChecked, { subtree : true })
    this.on(AriaDisabled, this.onDisabled, { subtree : true })
    this.on(Radio, this.onRadio, { subtree : true })
  }

  /**
   * @param {MutationRecord} record
   * @param {Radio} elem
   */
  onChecked(record, elem) {
    if(!elem.checked) {
      return
    }
    for(const radio of this._radios) {
      radio === elem || (radio.checked = false)
    }
    this.resetTabIndex()
    this.emit('change')
  }

  /**
   * @param {MutationRecord} record
   * @param {Radio} elem
   */
  onDisabled(record, elem) {
    this.resetTabIndex()
  }

  /**
   * @param {MutationRecord} record
   * @param {Radio} elem
   */
  onRadio(record, elem) {
    if(record.addedNodes.length) {
      for(const item of this.radios) {
        if(!this._radios.includes(item) && item.checked) {
          const radio = this.find(Radio, ({ checked }) => checked)
          radio.checked = false
          break
        }
      }
    }
    this._radios = this.radios
    this.resetTabIndex()
  }

  /**
   * Reset the tabIndex value of descendant radios
   */
  resetTabIndex() {
    if(this.disabled) {
      for(const radio of this._radios) {
        radio.tabIndex = null
      }
      return
    }
    const radios = this.findAll(Radio, ({ disabled }) => !disabled)
    const radio = radios.find(({ checked }) => checked) || radios[0]
    if(!radio) {
      return
    }
    for(const item of radios) {
      item.tabIndex = item === radio? 0 : -1
    }
  }

  /**
   * @param radios
   */
  set radios(radios) {
    this.children = radios
  }

  /**
   * @returns {RoleRadio[]}
   */
  get radios() {
    return super.radios
  }

  /**
   * @param {string} value
   */
  set value(value) {
    if(value === this.value) {
      return
    }
    const radio = this.find(Radio, radio => radio.value === value)
    if(radio) {
      radio.checked = true
    }
  }

  /**
   * @returns {string}
   */
  get value() {
    const radio = this.find(Radio, ({ checked }) => checked)
    return radio && radio.value
  }
}

export { RadioGroup, Radio }
