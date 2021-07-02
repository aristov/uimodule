import { Role, RoleForm } from './lib'
import './Form.css'

export class Form extends RoleForm
{
  init(init) {
    super.init(init)
    this.on('keydown', this.onKeyDown)
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

  onKeyDown_Enter(event) {
    this.emit('submit')
  }

  get busy() {
    return super.busy
  }

  set busy(busy) {
    super.busy = busy
    for(const elem of this.elems) {
      elem.disabled = busy
    }
  }

  get elems() {
    return this.findAll(Role, ({ name }) => name)
  }
}
