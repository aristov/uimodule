import { Role, RoleForm, AriaBusy } from './lib'
import './Form.css'

export class Form extends RoleForm
{
  init(init) {
    super.init(init)
    this.on('keydown', this.onKeyDown)
    this.on(AriaBusy, this.onBusy)
  }

  serialize() {
    const data = {}
    for(let { name, value } of this.elems) {
      if(typeof value === 'string') {
        value = value.trim()
      }
      data[name] = value || null
    }
    return data
  }

  onBusy() {
    const busy = this.busy
    this.elems.forEach(elem => elem.disabled = busy)
  }

  onKeyDown_Enter(event) {
    this.emit('submit')
  }

  get elems() {
    return this.findAll(Role, ({ name }) => name)
  }
}
