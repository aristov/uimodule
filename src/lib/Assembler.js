import window from 'window'

let undefined
const storage = window.env === 'development'? new Map : new WeakMap

/**
 * @summary Assembler is a simple class, which helps to assemble another JavaScript objects.
 */
export class Assembler
{
  /**
   * Create and initialize target by specified initialing object
   * @param {{}} [init]
   */
  constructor(init = {}) {
    this.create(init)
    this.init(init)
    this.assign(init)
  }

  /**
   * Create a target and associate it with an assembler instance
   * @param {{}} init
   */
  create(init) {
    this.node = init.node || {}
    storage.set(this.node, this)
    delete init.node
  }

  /**
   * @param {{}} init
   */
  init(init) {
    void null
  }

  /**
   * Initialize target by specified initializing object
   * @param {{}} init
   */
  assign(init) {
    for(const name in init) {
      if(init.hasOwnProperty(name)) {
        this.setProperty(name, init[name])
      }
    }
  }

  /**
   * Set a single property if it is in this and is not undefined or fallback otherwise
   * @param {string} name
   * @param {*} value
   */
  setProperty(name, value) {
    if(value === undefined) {
      return
    }
    if(name in this) {
      this[name] = value
    }
    else if(name in this.node) {
      this.node[name] = value
    }
  }

  /**
   * Destroy this instance
   */
  destroy() {
    storage.delete(this.node)
    this.node = null
  }

  /**
   * Get an instance of the target or the instance itself or new instance for this target if it has no one
   * @param {Assembler|Object|*} object
   * @returns {Assembler|*|null}
   */
  static get(object) {
    if(!object) {
      return null
    }
    return object instanceof Assembler?
      object :
      storage.get(object) || new this({ node : object })
  }
}

Assembler.__storage = storage
