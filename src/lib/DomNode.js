import window from 'window'
import { AttrType } from './AttrType'
import { DomTarget } from './DomTarget'

let undefined
const map = Array.prototype.map
const { MutationObserver, Node } = window
const ATTR_KEY_PREFIX = 'attr:'

/**
 * @see https://www.w3.org/TR/dom/#interface-node
 * @abstract
 */
export class DomNode extends DomTarget
{
  /**
   * @param {*} [init]
   * @override
   */
  constructor(init = {}) {
    if(!init || init.constructor !== Object) {
      init = { children : init }
    }
    super(init)
  }

  /**
   * @param {{}} init
   * @param {Node|*} [init.node]
   * @override
   */
  create(init) {
    if(init.node) {
      this.__children = Array.from(init.node.childNodes).map(node => DomNode.get(node))
    }
    else this.__children = []
    super.create(init)
  }

  /**
   * @param {{}} init
   * @param {any} [init.children]
   * @override
   */
  init(init) {
    this.setProperty('children', this.build(init))
    delete init.children
  }

  /**
   * @param {{}} init
   * @return {any}
   */
  build(init) {
    return init.children
  }

  /**
   * Append child nodes to the node
   * @param {string|DomNode|array|*} children
   */
  append(...children) {
    const elems = this.flatChildren(children)
    this.node.append(...elems.map(child => child.node || child))
    this.__children.push(...elems)
  }

  /**
   * Prepend child nodes to the node
   * @param {string|DomNode|array|*} children
   */
  prepend(...children) {
    const elems = this.flatChildren(children)
    this.node.prepend(...elems.map(child => child.node || child))
    this.__children = elems.concat(this.__children)
  }

  /**
   * @param {array} items
   * @returns {array}
   */
  flatChildren(items) {
    const result = []
    let item, parent
    for(item of items.flat(Infinity)) {
      if(item === null || item === false || item === undefined || item === '') {
        continue
      }
      if(item.then) {
        result.push(new this.constructor.PendingChild({ promise : item, host : this }))
        continue
      }
      parent = item.parent
      if(parent) {
        result.includes(parent) || result.push(parent)
      }
      else result.push(item)
    }
    return result
  }

  /**
   * @param {DomNode|Node|*} object
   * @returns {boolean}
   */
  contains(object) {
    return this.node.contains(object.node || object)
  }

  /**
   * @param {constructor|string} subject - DomElem
   * @param {string} [subject.selector]
   * @param {function} [subject.get]
   * @param {function} [filter]
   * @returns {DomElem|*|null}
   */
  find(subject, filter) {
    const selector = subject.selector || subject
    const constructor = typeof subject === 'function'?
      subject :
      DomNode.DomElem
    if(!filter) {
      return constructor.get(this.node.querySelector(selector))
    }
    const nodeList = this.node.querySelectorAll(selector)
    for(const node of nodeList) {
      const elem = constructor.get(node)
      if(filter(elem)) {
        return elem
      }
    }
    return null
  }

  /**
   * @param {constructor|string} subject - DomElem
   * @param {string} [subject.selector]
   * @param {function} [subject.get]
   * @param {function} [filter]
   * @returns {DomElem[]}
   */
  findAll(subject, filter) {
    const selector = subject.selector || subject
    const nodeList = this.node.querySelectorAll(selector)
    const constructor = typeof subject === 'function'?
      subject :
      DomNode.DomElem
    const elems = []
    let node, elem
    for(node of nodeList) {
      elem = constructor.get(node)
      if(!filter || filter(elem)) {
        elems.push(elem)
      }
    }
    return elems
  }

  /**
   * @param {string|constructor|DomElem} type
   * @param {function} callback
   * @param {{}|DomTarget|boolean} [options]
   * @override
   */
  on(type, callback, options) {
    if(typeof type === 'string') {
      super.on(type, callback, options)
    }
    else if(type === AttrType || AttrType.isPrototypeOf(type)) {
      this.addAttrObserver(type, callback, options)
    }
    else this.addChildObserver(type, callback, options)
  }

  /**
   * @param {string|constructor|DomElem} type
   * @param {function} callback
   * @param {{}|DomTarget|boolean} [options]
   * @override
   */
  off(type, callback, options) {
    if(typeof type === 'string') {
      super.off(type, callback, options)
    }
    else if(type === AttrType || AttrType.isPrototypeOf(type)) {
      this.removeAttrObserver(type, callback, options)
    }
    else this.removeChildObserver(type, callback, options)
  }

  /**
   * @param {constructor|string} attr AttrType class or selector
   * @param {string} [attr.localName]
   * @param {function} callback
   * @param {{context,subtree,attributeOldValue}|DomNode} [options]
   */
  addAttrObserver(attr, callback, options = {}) {
    if(options instanceof DomNode) {
      options = { context : options }
    }
    const context = options.context || (options.context = this)
    const key = typeof attr === 'string'? ATTR_KEY_PREFIX + attr : attr
    if(!context.__handlers) {
      context.__handlers = new Map
    }
    let observers = context.__handlers.get(key)
    observers || context.__handlers.set(key, observers = new Map)
    if(!observers.has(callback)) {
      const observer = new MutationObserver(records => {
        this.handleAttrMutation(records, attr, callback, options)
      })
      const name = attr === AttrType? '' : attr.localName || attr
      observer.__options = options
      observers.set(callback, observer)
      observer.observe(this.node, {
        attributeFilter : name? [name] : undefined,
        attributeOldValue : options.attributeOldValue || false,
        subtree : options.subtree || false,
      })
    }
  }

  /**
   * @param {constructor|string} attr AttrType class or selector
   * @param {function} callback
   * @param {{context}|DomNode} [options]
   */
  removeAttrObserver(attr, callback, options = {}) {
    if(options instanceof DomNode) {
      options = { context : options }
    }
    const context = options.context || this
    const key = typeof attr === 'string'? ATTR_KEY_PREFIX + attr : attr
    let observers = context.__handlers && context.__handlers.get(key)
    const observer = observers && observers.get(callback)
    if(observer) {
      this.handleAttrMutation(observer.takeRecords(), attr, callback, observer.__options)
      observer.disconnect()
      observers.delete(callback)
      observers.size || context.__handlers.delete(key)
    }
  }

  /**
   * @param {MutationRecord[]} records
   * @param {constructor|string} attr
   * @param {function} callback
   * @param {{context,subtree,attributeOldValue}} [options]
   */
  handleAttrMutation(records, attr, callback, options) {
    records.forEach(record => {
      callback.call(options.context, record, DomNode.DomElem.get(record.target))
    })
  }

  /**
   * @param {constructor|DomElem} child
   * @param {function} callback
   * @param {{context,subtree,addedNodes,removedNodes}|DomNode} [options]
   */
  addChildObserver(child, callback, options = {}) {
    if(options instanceof DomNode) {
      options = { context : options }
    }
    const context = options.context || (options.context = this)
    if(!context.__handlers) {
      context.__handlers = new Map
    }
    let observers = context.__handlers.get(child)
    observers || context.__handlers.set(child, observers = new Map)
    if(!observers.has(callback)) {
      const observer = new MutationObserver(records => {
        this.handleChildMutation(records, child, callback, options)
      })
      observer.__options = options
      observers.set(callback, observer)
      observer.observe(this.node, {
        childList : true,
        subtree : options.subtree || false,
      })
    }
  }

  /**
   * @param {constructor|DomElem} child
   * @param {function} callback
   * @param {{context}|DomNode} [options]
   */
  removeChildObserver(child, callback, options = {}) {
    if(options instanceof DomNode) {
      options = { context : options }
    }
    const context = options.context || this
    let observers = context.__handlers && context.__handlers.get(child)
    const observer = observers && observers.get(callback)
    if(observer) {
      this.handleChildMutation(observer.takeRecords(), child, callback, observer.__options)
      observer.disconnect()
      observers.delete(callback)
      observers.size || context.__handlers.delete(child)
    }
  }

  /**
   * @param {MutationRecord[]} records
   * @param {constructor|DomElem} child
   * @param {string} [child.selector]
   * @param {function} callback
   * @param {{context,subtree,addedNodes,removedNodes}} [options]
   */
  handleChildMutation(records, child, callback, options) {
    records.forEach(record => {
      const nodes = []
      if(options.addedNodes !== false) {
        nodes.push(...record.addedNodes)
      }
      if(options.removedNodes !== false) {
        nodes.push(...record.removedNodes)
      }
      for(const node of nodes) {
        if(node.nodeType === Node.ELEMENT_NODE) {
          if(typeof child === 'function') {
            const selector = child.selector
            if(node.matches(selector) || options.subtree && node.querySelector(selector)) {
              callback.call(options.context, record, DomNode.DomElem.get(record.target))
              return
            }
          }
          else if(options.subtree? node.contains(child.node) : node === child.node) {
            callback.call(options.context, record, DomNode.DomElem.get(record.target))
            return
          }
        }
      }
    })
  }

  /**
   * @param {string|constructor|DomElem} [type]
   */
  removeAllObservers(type) {
    if(!this.__handlers) {
      return
    }
    const key = typeof type === 'string'? ATTR_KEY_PREFIX + type : type
    const entries = key?
      [[key, this.__handlers.get(key)]] :
      this.__handlers.entries()
    for(const [key, observers] of entries) {
      if(typeof key !== 'string' || key.startsWith(ATTR_KEY_PREFIX)) {
        for(const observer of observers.values()) {
          observer.disconnect()
        }
        observers.clear()
        this.__handlers.delete(key)
      }
    }
  }

  /**
   * Destroy this instance
   */
  destroy() {
    this.removeAllObservers()
    super.destroy()
  }

  /**
   * @param {boolean} [keepNodes=false]
   */
  destroyChildren(keepNodes = false) {
    if(!this.node.hasChildNodes()) {
      return
    }
    let child, elem
    for(child of Array.from(this.node.childNodes)) {
      elem = DomNode.__storage.get(child)
      if(elem) {
        elem.destroy(keepNodes)
      }
      else keepNodes || child.remove()
    }
    this.__children = []
  }

  UNSTABLE_destroyChildren(keepNodes = false) {
    const childNodes = Array.from(this.node.childNodes)
    const children = this.__children
    let i, child
    for(i = 0; i < children.length; i++) {
      child = children[i]
      if(child.node) {
        child.destroy(keepNodes)
      }
      else keepNodes || childNodes[i]?.remove()
    }
    if(children.length !== childNodes.length) {
      console.warn('!==', children, childNodes)
      if(this.node.childNodes.length) {
        console.warn('> 0', childNodes)
        keepNodes || Array.from(this.node.childNodes).forEach(node => node.remove())
      }
    }
    this.__children = []
  }

  /**
   * Append children to the element
   * @param {*} children
   */
  set children(children) {
    this.destroyChildren()
    this.append(children)
  }

  /**
   * Get all children of the element as an array
   * @returns {[]}
   */
  get children() {
    // return this.__children.filter(child => child.node)
    return map.call(this.node.children, node => {
      return DomNode.DomElem.get(node)
    })
  }
}

/**
 * @param {Promise|{then,catch}} promise
 * @param {DomNode} host
 * @constructor
 */
DomNode.PendingChild = function({ promise, host }) {
  const node = new Text('Loading...')
  this.node = node
  promise.then(res => {
    if(!this.node || !node.parentNode) {
      return
    }
    const children = host.__children
    const index = children.indexOf(this)
    const items = DomNode.prototype.flatChildren([res])
    node.replaceWith(...items.map(child => child.node || child))
    host.__children = [...children.slice(0, index), ...items, ...children.slice(index + 1)]
  })
  .catch(err => console.error(node.data = err))
}

DomNode.PendingChild.prototype.destroy = function(keepNode = false) {
  keepNode || this.node.remove()
  this.node = null
}
