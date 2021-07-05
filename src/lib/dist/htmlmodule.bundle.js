(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("window"));
	else if(typeof define === 'function' && define.amd)
		define(["window"], factory);
	else if(typeof exports === 'object')
		exports["htmlmodule"] = factory(require("window"));
	else
		root["htmlmodule"] = factory(root["window"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE__2__) {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Assembler": () => (/* binding */ Assembler)
/* harmony export */ });
/* harmony import */ var window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var window__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(window__WEBPACK_IMPORTED_MODULE_0__);


let undefined
const storage = (window__WEBPACK_IMPORTED_MODULE_0___default().env) === 'development'? new Map : new WeakMap

/**
 * @summary Assembler is a simple class, which helps to assemble another JavaScript objects.
 */
class Assembler
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


/***/ }),
/* 2 */
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE__2__;

/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AttrType": () => (/* reexport safe */ _AttrType__WEBPACK_IMPORTED_MODULE_0__.AttrType),
/* harmony export */   "DomDoc": () => (/* reexport safe */ _DomDoc__WEBPACK_IMPORTED_MODULE_1__.DomDoc),
/* harmony export */   "DomElem": () => (/* reexport safe */ _DomElem__WEBPACK_IMPORTED_MODULE_2__.DomElem),
/* harmony export */   "DomFragment": () => (/* reexport safe */ _DomFragment__WEBPACK_IMPORTED_MODULE_3__.DomFragment),
/* harmony export */   "DomNode": () => (/* reexport safe */ _DomNode__WEBPACK_IMPORTED_MODULE_4__.DomNode),
/* harmony export */   "DomTarget": () => (/* reexport safe */ _DomTarget__WEBPACK_IMPORTED_MODULE_5__.DomTarget)
/* harmony export */ });
/* harmony import */ var _AttrType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _DomDoc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5);
/* harmony import */ var _DomElem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);
/* harmony import */ var _DomFragment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(39);
/* harmony import */ var _DomNode__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8);
/* harmony import */ var _DomTarget__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(9);
/**
 * @module dommodule
 * @author Vyacheslav Aristov <vv.aristov@gmail.com>
 * @license MIT
 * @see https://www.w3.org/TR/dom
 * @see https://dom.spec.whatwg.org
 */








/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AttrType": () => (/* binding */ AttrType)
/* harmony export */ });
/**
 * @see https://www.w3.org/TR/dom/#interface-attr
 */
class AttrType
{
  /**
   * @param {constructor} constructor (DomElem)
   * @param {prototype} constructor.prototype
   * @param {string|constructor} [attr]
   * @param {string} [attr.attrName]
   * @override
   */
  static define(constructor, attr = this) {
    const name = attr.attrName || attr
    Object.defineProperty(constructor.prototype, name, {
      configurable : true,
      get() {
        return this.getAttr(attr)
      },
      set(value) {
        this.setAttr(attr, value)
      }
    })
  }

  /**
   * @param {DomElem} elem
   * @returns {string|*}
   */
  static get(elem) {
    return elem.node.getAttribute(this.localName)
  }

  /**
   * @param {DomElem} elem
   * @returns {boolean}
   */
  static has(elem) {
    return elem.node.hasAttribute(this.localName)
  }

  /**
   * @param {DomElem} elem
   */
  static remove(elem) {
    elem.node.removeAttribute(this.localName)
  }

  /**
   * @param {DomElem} elem
   * @param {string|*} value
   */
  static set(elem, value) {
    elem.node.setAttribute(this.localName, value)
  }

  /**
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(elem, value) {
    return value === null && !this.remove(elem)
  }

  /**
   * @returns {string}
   * @override
   */
  static get attrName() {
    return this.name[0].toLowerCase() + this.name.slice(1)
  }

  /**
   * @returns {null|*}
   */
  static get defaultValue() {
    return null
  }

  /**
   * @returns {string}
   */
  static get localName() {
    return this === AttrType? '' : this.name.toLowerCase()
  }

  /**
   * @returns {string}
   */
  static get selector() {
    return `[${ this.localName }]`
  }
}


/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DomDoc": () => (/* binding */ DomDoc)
/* harmony export */ });
/* harmony import */ var window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var window__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(window__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _DomElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _DomNode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);
/* harmony import */ var _DomTarget__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);
/* harmony import */ var _HtmlBody__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(10);
/* harmony import */ var _HtmlHead__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(37);
/* harmony import */ var _HtmlHtml__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(38);








const { document, XMLSerializer } = (window__WEBPACK_IMPORTED_MODULE_0___default())
let serializer

/**
 * @see https://www.w3.org/TR/dom/#interface-document
 */
class DomDoc extends _DomNode__WEBPACK_IMPORTED_MODULE_2__.DomNode
{
  /**
   * @param {{}} init
   * @param {Document} [init.node]
   */
  create(init) {
    if(!init.node) {
      init.node = document.implementation.createHTMLDocument()
    }
    super.create(init)
  }

  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.__refs = new Map
    new _HtmlHtml__WEBPACK_IMPORTED_MODULE_6__.HtmlHtml({ node : this.node.documentElement })
    this.on('keydown', this.onKeyDown, { once : true })
  }

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyDown(event, elem) {
    this.docElem.class.keyboard = true
    this.on('mousedown', this.onMouseDown)
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onMouseDown(event, elem) {
    const activeElem = this.activeElem
    if(activeElem !== this.body && activeElem.contains(elem)) {
      return
    }
    this.docElem.class.keyboard = false
    this.off('mousedown', this.onMouseDown)
    this.on('keydown', this.onKeyDown, { once : true })
  }

  /**
   * @param {string} id
   * @returns {DomElem}
   */
  getElementById(id) {
    return _DomElem__WEBPACK_IMPORTED_MODULE_1__.DomElem.get(this.node.getElementById(id))
  }

  /**
   * @param {boolean} [keepTree=false]
   */
  destroy(keepTree = false) {
    const elem = this.docElem
    this.removeAllObservers()
    this.removeAllListeners()
    elem.class.keyboard = false
    elem.destroy(keepTree)
    super.destroy()
  }

  /**
   * @returns {DomElem}
   */
  get activeElem() {
    return _DomElem__WEBPACK_IMPORTED_MODULE_1__.DomElem.get(this.node.activeElement)
  }

  /**
   * @param {*} body {HtmlBody|HTMLBodyElement}
   */
  set body(body) {
    this.node.body = body.node || body
  }

  /**
   * @returns {HtmlBody}
   */
  get body() {
    return _HtmlBody__WEBPACK_IMPORTED_MODULE_4__.HtmlBody.get(this.node.body)
  }

  /**
   * @return {string}
   */
  toString() {
    const { documentElement, doctype } = this.node
    const html = documentElement? documentElement.outerHTML : ''
    if(!doctype) {
      return html
    }
    serializer || (serializer = new XMLSerializer)
    return serializer.serializeToString(doctype) + html
  }

  /**
   * @returns {HtmlHead}
   */
  get head() {
    return _HtmlHead__WEBPACK_IMPORTED_MODULE_5__.HtmlHead.get(this.node.head)
  }

  /**
   * @param {string} lang
   */
  set lang(lang) {
    const node = this.node.documentElement
    node && (node.lang = lang)
  }

  /**
   * @return {string}
   */
  get lang() {
    const node = this.node.documentElement
    return node? node.lang : ''
  }

  /**
   * @param {string} title
   */
  set title(title) {
    this.node.title = title
  }

  /**
   * @returns {string}
   */
  get title() {
    return this.node.title
  }

  /**
   * @returns {Win|null}
   */
  get win() {
    return _DomTarget__WEBPACK_IMPORTED_MODULE_3__.DomTarget.Win.get(this.node.defaultView)
  }

  /**
   * @returns {HtmlHtml|null}
   */
  get docElem() {
    return _HtmlHtml__WEBPACK_IMPORTED_MODULE_6__.HtmlHtml.get(this.node.documentElement)
  }
}

_DomTarget__WEBPACK_IMPORTED_MODULE_3__.DomTarget.DomDoc = DomDoc


/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DomElem": () => (/* binding */ DomElem)
/* harmony export */ });
/* harmony import */ var window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var window__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(window__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AttrType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _Class__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
/* harmony import */ var _DomNode__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8);
/* harmony import */ var _DomTarget__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9);






const map = Array.prototype.map
const { document, DocumentFragment } = (window__WEBPACK_IMPORTED_MODULE_0___default())
let counter = 0

/**
 * @see https://www.w3.org/TR/dom/#interface-element
 */
class DomElem extends _DomNode__WEBPACK_IMPORTED_MODULE_3__.DomNode
{
  /**
   * @param {{}} init
   * @param {Element} [init.node]
   */
  create(init) {
    if(!init.node) {
      init.node = document.createElement(this.constructor.localName)
    }
    super.create(init)
    const classList = this.constructor.classList
    if(classList.length) {
      this.classList = classList.join(' ')
    }
  }

  /**
   * @param {{}} init
   * @param {string} [init.text]
   * @param {string} [init.html]
   * @override
   */

  /*init(init) {
    if(init.text) {
      this.text = init.text
      delete init.text
      return
    }
    if(init.html) {
      this.html = init.html
      delete init.html
      return
    }
    super.init(init)
  }*/

  /**
   * @param {DomNode|string|*} siblings
   */
  before(...siblings) {
    if(!this.node.parentNode) {
      this.parent = new DocumentFragment
    }
    this.node.before(...this.flatChildren(siblings))
  }

  /**
   * @param {DomNode|string|*} siblings
   */
  after(...siblings) {
    if(!this.node.parentNode) {
      this.parent = new DocumentFragment
    }
    this.node.after(...this.flatChildren(siblings))
  }

  /**
   * Remove node from tree
   */
  remove() {
    this.node.remove()
  }

  /**
   * @param {DomNode|string|*} objects
   */
  replaceWith(...objects) {
    this.node.replaceWith(...this.flatChildren(objects))
  }

  /**
   * @param {constructor|string} object - DomElem
   * @param {string} [object.selector]
   * @param {function} [object.get]
   * @returns {DomElem|*|null}
   */
  closest(object) {
    return typeof object === 'function'?
      object.get(this.node.closest(object.selector)) :
      DomElem.get(this.node.closest(object))
  }

  /**
   * Generate a unique identifier among the document's tree
   * @returns {String}
   */
  generateId() {
    const doc = this.doc
    let id, str
    do {
      str = (counter++).toString(36)
      id = 'ID_' + '0'.repeat(Math.max(0, 7 - str.length)) + str
    }
    while(doc.getElementById(id))
    return id
  }

  /**
   * @param {constructor|string} attr
   * @param {function} [attr.get]
   * @param {function} [attr.has]
   * @param {*|null} [attr.defaultValue]
   * @returns {string|*|null}
   */
  getAttr(attr) {
    if(typeof attr === 'function') {
      return attr.has(this)? attr.get(this) : attr.defaultValue
    }
    return this.node.getAttribute(attr)
  }

  /**
   * @param {constructor|string} attr
   * @param {function} [attr.has]
   * @returns {boolean}
   */
  hasAttr(attr) {
    return typeof attr === 'function'?
      attr.has(this) :
      this.node.hasAttribute(attr)
  }

  /**
   * @param {constructor|string} attr
   * @param {function} [attr.remove]
   */
  removeAttr(attr) {
    if(typeof attr === 'function') {
      attr.remove(this)
    }
    else this.node.removeAttribute(attr)
  }

  /**
   * @param {constructor|string} attr
   * @param {function} [attr.removeOnValue]
   * @param {function} [attr.set]
   * @param {string|null|*} value
   */
  setAttr(attr, value) {
    if(typeof attr === 'function') {
      if(!attr.removeOnValue(this, value)) {
        attr.set(this, value)
      }
    }
    else if(value === null) {
      this.node.removeAttribute(attr)
    }
    else this.node.setAttribute(attr, value)
  }

  scrollTo(...args) {
    this.node.scrollTo(...args)
  }

  scrollBy(...args) {
    this.node.scrollBy(...args)
  }

  /**
   * Destroy elem references
   */
  destroyRefs() {
    const doc = this.doc
    const refs = doc.__refs.get(this)
    if(!refs) {
      return
    }
    doc.__refs.delete(this)
    for(const ref of refs.values()) {
      const elems = ref instanceof DomElem? [ref] : Object.values(ref)
      for(const elem of elems) {
        this.contains(elem) || elem.contains(this) || elem.destroy()
      }
    }
    refs.clear()
  }

  /**
   * Remove elem from someone else's references
   */
  clearRefs() {
    for(const [elem, refs] of this.doc.__refs.entries()) {
      for(const type of refs.keys()) {
        const ref = elem.getAttr(type)
        if(Array.isArray(ref)) {
          ref.includes(this) && elem.setAttr(type, ref.filter(item => item !== this))
        }
        else ref === this && elem.removeAttr(type)
      }
    }
  }

  /**
   * Destroy this instance
   * @param {boolean} [keepNode=false]
   */
  destroy(keepNode = false) {
    const node = this.node
    this.clearRefs()
    this.destroyRefs()
    this.destroyChildren(true)
    super.destroy()
    keepNode || node.remove()
  }

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyDown(event, elem) {
    const handler = this['onKeyDown_' + event.code]
    if(typeof handler === 'function') {
      handler.apply(this, arguments)
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyUp(event, elem) {
    const handler = this['onKeyUp_' + event.code]
    if(typeof handler === 'function') {
      handler.apply(this, arguments)
    }
  }

  /**
   * @return {string}
   */
  toString() {
    return this.node.outerHTML
  }

  /**
   * Set content attributes on the element
   * @param {{}} attrs
   */
  set attrs(attrs) {
    for(const [name, value] of Object.entries(attrs)) {
      value === null?
        this.removeAttr(name, value) :
        this.setAttr(name, value)
    }
  }

  /**
   * Get all attributes of the element as an array
   * @returns {{}}
   */
  get attrs() {
    const attrs = {}
    for(const { name, value } of this.node.attributes) {
      attrs[name] = value
    }
    return attrs
  }

  /**
   * @return {Proxy<DOMTokenList>}
   */
  get class() {
    return this.getAttr(_Class__WEBPACK_IMPORTED_MODULE_2__.Class)
  }

  /**
   * @param {array.string|{}|string} value
   */
  set class(value) {
    this.setAttr(_Class__WEBPACK_IMPORTED_MODULE_2__.Class, value)
  }

  /**
   * Set the class list of the element
   * @param {*} classList token / token list / token-boolean dict {string|string[]|{}}
   */
  set classList(classList) {
    const node = this.node
    if(Array.isArray(classList)) {
      classList.forEach(token => node.classList.add(token))
    }
    else if(classList.constructor === Object) {
      Object.keys(classList).forEach(token => {
        node.classList.toggle(token, classList[token])
      })
    }
    else node.classList = classList
  }

  /**
   * Get the class list of the element as an array
   * @returns {DOMTokenList} classList interface
   */
  get classList() {
    return this.node.classList
  }

  /**
   * @returns {CSSStyleDeclaration}
   */
  get computedStyle() {
    return this.win.node.getComputedStyle(this.node)
  }

  /**
   * @returns {DomDoc}
   */
  get doc() {
    return _DomNode__WEBPACK_IMPORTED_MODULE_3__.DomNode.DomDoc.get(this.node.ownerDocument)
  }

  /**
   * @param {string} html
   */
  set html(html) {
    this.destroyChildren(true)
    this.node.innerHTML = html
  }

  /**
   * @returns {string}
   */
  get html() {
    return this.node.innerHTML
  }

  /**
   * Set the unique identifier on the element
   * @param {string} id
   */
  set id(id) {
    this.node.id = id
  }

  /**
   * Get the unique identifier of the element
   * @returns {string}
   */
  get id() {
    return this.node.id
  }

  /**
   * Append element parent
   * @param {DomNode|Element|Document|DocumentFragment|null} parent
   */
  set parent(parent) {
    if(parent) {
      parent.append(this.node)
    }
    else this.remove()
  }

  /**
   * Get parent
   * @returns {DomNode|*|null}
   */
  get parent() {
    return _DomNode__WEBPACK_IMPORTED_MODULE_3__.DomNode.get(this.node.parentNode)
  }

  /**
   * @returns {DOMRect}
   */
  get rect() {
    return this.node.getBoundingClientRect()
  }

  /**
   * @return {{}}
   */
  get storage() {
    const json = localStorage.getItem(this.constructor.name)
    return json? JSON.parse(json) : {}
  }

  /**
   * @param {{}} storage
   */
  set storage(storage) {
    storage = Object.assign(this.storage, storage)
    localStorage.setItem(this.constructor.name, JSON.stringify(storage))
  }

  /**
   * Set a text content of the node
   * @param {string} text
   */
  set text(text) {
    this.destroyChildren()
    this.node.textContent = text
  }

  /**
   * Get a text content of the node
   * @returns {string}
   */
  get text() {
    return this.node.textContent
  }

  /**
   * @returns {Win}
   */
  get win() {
    return this.doc.win
  }


  get about() {
    return this.getAttr('about')
  }

  set about(about) {
    this.setAttr('about', about)
  }

  get content() {
    return this.getAttr('content')
  }

  set content(content) {
    this.setAttr('content', content)
  }

  get dataType() {
    return this.getAttr('datatype')
  }

  set dataType(dataType) {
    this.setAttr('datatype', dataType)
  }

  get property() {
    return this.getAttr('property')
  }

  set property(property) {
    this.setAttr('property', property)
  }

  get rel() {
    return this.getAttr('rel')
  }

  set rel(rel) {
    this.setAttr('rel', rel)
  }

  get resource() {
    return this.getAttr('resource')
  }

  set resource(resource) {
    this.setAttr('resource', resource)
  }

  get typeOf() {
    return this.getAttr('typeof')
  }

  set typeOf(typeOf) {
    this.setAttr('typeof', typeOf)
  }


  /**
   * @param {array.(string|constructor)} attrs
   */
  static defineAttrs(attrs) {
    for(const item of attrs) {
      _AttrType__WEBPACK_IMPORTED_MODULE_1__.AttrType.define(this, item)
    }
  }

  /**
   * @param {string[]} getters
   */
  static defineGetters(getters) {
    for(const name of getters) {
      Object.defineProperty(this.prototype, name, {
        configurable : true,
        get() {
          return this.node[name]
        },
      })
    }
  }

  /**
   * @param {string|Element|Document|DocumentFragment} [selectorOrContext=this.selector]
   * @param {Element|Document|DocumentFragment} [context=window.document]
   * @returns {DomElem[]} array of initialized instances
   */
  static init(selectorOrContext = this.selector, context = document) {
    if(selectorOrContext.nodeType) {
      context = selectorOrContext
      selectorOrContext = this.selector
    }
    return map.call(context.querySelectorAll(selectorOrContext), node => {
      return new this({ node })
    })
  }

  /**
   * @returns {string[]}
   */
  static get classList() {
    return []
  }

  /**
   * The local name of the element node
   * @returns {string}
   */
  static get localName() {
    return this === this.superAssembler? '' : this.name
  }

  /**
   * @returns {string}
   */
  static get selector() {
    return this.localName || '*'
  }

  /**
   * @returns {constructor} DomElem
   */
  static get superAssembler() {
    return DomElem
  }
}

DomElem.defineGetters([
  'clientLeft',
  'clientTop',
  'clientWidth',
  'clientHeight',
  'scrollLeft',
  'scrollTop',
  'scrollWidth',
  'scrollHeight',
])

DomElem.prototype.data = null

_DomTarget__WEBPACK_IMPORTED_MODULE_4__.DomTarget.DomElem = DomElem


/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Class": () => (/* binding */ Class)
/* harmony export */ });
/* harmony import */ var _AttrType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);


class Class extends _AttrType__WEBPACK_IMPORTED_MODULE_0__.AttrType
{
  /**
   * @param {DomElem} elem
   * @param {Proxy<DOMTokenList>} [elem.__class]
   * @return {{}}
   */
  static get(elem) {
    return elem.__class || (elem.__class = new Proxy(elem.node.classList, handler))
  }

  /**
   * @param {DomElem} elem
   * @return {boolean}
   */
  static has(elem) {
    return true
  }

  /**
   * @param {DomElem} elem
   * @param {[]|{}|any} value
   */
  static set(elem, value) {
    if(Array.isArray(value)) {
      elem.node.classList.add(...value)
    }
    else if(value.constructor === Object) {
      for(const token of Object.keys(value)) {
        elem.node.classList.toggle(token, !!value[token])
      }
    }
    else elem.node.classList = value
  }
}

const handler = {
  /**
   * @param {DOMTokenList} target
   * @param {string|Symbol} p
   * @return {boolean|function}
   */
  get(target, p) {
    return p === Symbol.toPrimitive?
      hint => hint === 'number'? target.length : target.value :
      target.contains(p)
  },
  /**
   * @param {DOMTokenList} target
   * @param {string|Symbol} p
   * @param {boolean} value
   * @return {boolean}
   */
  set(target, p, value) {
    return target.toggle(p, value) || true
  },
  /**
   * @param {DOMTokenList} target
   * @param {string|Symbol} p
   * @return {boolean}
   */
  has(target, p) {
    return target.contains(p)
  },
  /**
   * @param {DOMTokenList} target
   * @param {string|Symbol} p
   * @return {true}
   */
  deleteProperty(target, p) {
    return !target.remove(p)
  },
  /**
   * @param {DOMTokenList} target
   * @return {string[]}
   */
  ownKeys(target) {
    return Array.from(target.values())
  },
  /**
   * @return {PropertyDescriptor}
   */
  getOwnPropertyDescriptor() {
    return {
      configurable : true,
      enumerable : true
    }
  }
}


/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DomNode": () => (/* binding */ DomNode)
/* harmony export */ });
/* harmony import */ var window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var window__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(window__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _AttrType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _DomTarget__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9);




let undefined
const map = Array.prototype.map
const { MutationObserver, Node } = (window__WEBPACK_IMPORTED_MODULE_0___default())
const ATTR_KEY_PREFIX = 'attr:'

/**
 * @see https://www.w3.org/TR/dom/#interface-node
 * @abstract
 */
class DomNode extends _DomTarget__WEBPACK_IMPORTED_MODULE_2__.DomTarget
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
    this.node.append(...this.flatChildren(children))
  }

  /**
   * Prepend child nodes to the node
   * @param {string|DomNode|array|*} children
   */
  prepend(...children) {
    this.node.prepend(...this.flatChildren(children))
  }

  /**
   * @param {array} items
   * @returns {array}
   */
  flatChildren(items) {
    const result = []
    for(const item of items.flat(Infinity)) {
      if(item === null || item === false || item === undefined) {
        continue
      }
      if(item.then) {
        const pending = new this.constructor.PendingChild({ promise : item })
        result.push(pending.node || pending)
        continue
      }
      const node = item.node || item
      const parentNode = node.parentNode
      if(parentNode/* && parentNode.nodeType === Node.DOCUMENT_FRAGMENT_NODE*/) {
        result.includes(parentNode) || result.push(parentNode)
      }
      else result.push(node)
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
    const elems = map.call(nodeList, node => constructor.get(node))
    return filter? elems.filter(filter) : elems
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
    else if(type === _AttrType__WEBPACK_IMPORTED_MODULE_1__.AttrType || _AttrType__WEBPACK_IMPORTED_MODULE_1__.AttrType.isPrototypeOf(type)) {
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
    else if(type === _AttrType__WEBPACK_IMPORTED_MODULE_1__.AttrType || _AttrType__WEBPACK_IMPORTED_MODULE_1__.AttrType.isPrototypeOf(type)) {
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
      const name = attr === _AttrType__WEBPACK_IMPORTED_MODULE_1__.AttrType? '' : attr.localName || attr
      observer.__options = options
      observers.set(callback, observer)
      observer.observe(this.node, {
        attributeFilter : name? [name] : undefined,
        attributeOldValue : options.attributeOldValue || false,
        subtree : options.subtree || false
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
        subtree : options.subtree || false
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
    if(this.node.hasChildNodes()) {
      for(const child of Array.from(this.node.childNodes)) {
        const elem = DomNode.__storage.get(child)
        if(elem) {
          elem.destroy(keepNodes)
        }
        else keepNodes || child.remove()
      }
    }
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
   * @returns {DomElem[]}
   */
  get children() {
    return map.call(this.node.children, node => {
      return DomNode.DomElem.get(node)
    })
  }
}

/**
 * @param {Promise|{then,catch}} promise
 * @constructor
 */
DomNode.PendingChild = function({ promise }) {
  const node = new Text('Loading...')
  promise.then(res => {
    node.parentNode && node.replaceWith(...DomNode.prototype.flatChildren([res]))
  })
  .catch(err => console.error(node.data = err))
  return node
}


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DomTarget": () => (/* binding */ DomTarget)
/* harmony export */ });
/* harmony import */ var window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var window__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(window__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Assembler__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(1);



const { CustomEvent, EventTarget, Node } = (window__WEBPACK_IMPORTED_MODULE_0___default())
const EVENT_KEY_PREFIX = 'event:'

/**
 * @see https://www.w3.org/TR/dom/#interface-eventtarget
 */
class DomTarget extends _Assembler__WEBPACK_IMPORTED_MODULE_1__.Assembler // DomEmitter
{
  /**
   * @param {{}} init
   * @param {EventTarget} [init.node]
   */
  create(init) {
    this.__handlers = null
    if(!init.node) {
      init.node = new EventTarget
    }
    super.create(init)
  }

  /**
   * @param {{}} init
   * @param {{}} [init.on]
   */
  assign(init) {
    if(init.on) {
      for(const [type, callback] of Object.entries(init.on)) {
        this.on(type, callback, this)
      }
      delete init.on
    }
    super.assign(init)
  }

  /**
   * @param {Event|string|*} event
   * @param {CustomEventInit|EventInit|{}} [dict]
   * @param {boolean} [dict.bubbles=false]
   * @param {boolean} [dict.cancelable=false]
   * @param {*} [dict.detail]
   * @returns {boolean}
   */
  emit(event, dict) {
    if(typeof event === 'string') {
      const events = this.constructor.events
      const description = events[event] || [CustomEvent]
      const [constructor, bubbles, cancelable] = description
      if(!dict) {
        dict = {
          bubbles : bubbles || false,
          cancelable : cancelable || false,
        }
      }
      event = new constructor(event, dict)
    }
    return this.node.dispatchEvent(event)
  }

  /**
   * @param {string} eventName
   * @param {function} callback
   * @param {{context,capture,once,passive}|boolean|DomTarget|*} [options]
   * @param {DomTarget} [options.context=this]
   * @param {boolean} [options.capture=false]
   * @param {boolean} [options.once=false]
   * @param {boolean} [options.passive=false]
   */
  on(eventName, callback, options = {}) {
    if(typeof options === 'boolean') {
      options = { capture : options }
    }
    else if(options instanceof DomTarget) {
      options = { context : options }
    }
    const context = options.context || this
    const key = EVENT_KEY_PREFIX + eventName
    if(!context.__handlers) {
      context.__handlers = new Map
    }
    let listeners = context.__handlers.get(key)
    listeners || context.__handlers.set(key, listeners = new Map)
    if(!listeners.has(callback)) {
      const listener = event => {
        options.once && listeners.delete(callback)
        callback.call(context, event, get(event.target))
      }
      listener.__target = this.node
      listener.__options = options
      listeners.set(callback, listener)
      this.node.addEventListener(eventName, listener, {
        capture : options.capture || false,
        once : options.once || false,
        passive : options.passive || false,
      })
    }
  }

  /**
   * @param {string} eventName
   * @param {function} callback
   * @param {{context,capture}|boolean|DomTarget|*} [options]
   * @param {DomTarget} [options.context=this]
   * @param {boolean} [options.capture=false]
   */
  off(eventName, callback, options = {}) {
    if(typeof options === 'boolean') {
      options = { capture : options }
    }
    else if(options instanceof DomTarget) {
      options = { context : options }
    }
    const context = options.context || this
    const key = EVENT_KEY_PREFIX + eventName
    let listeners = context.__handlers && context.__handlers.get(key)
    if(listeners && listeners.has(callback)) {
      this.node.removeEventListener(eventName, listeners.get(callback), {
        capture : options.capture,
      })
      listeners.delete(callback)
      listeners.size || context.__handlers.delete(key)
    }
  }

  /**
   * @param {string} [eventName]
   */
  removeAllListeners(eventName) {
    if(!this.__handlers) {
      return
    }
    const key = eventName && EVENT_KEY_PREFIX + eventName
    const entries = key?
      [[key, this.__handlers.get(key)]] :
      this.__handlers.entries()
    for(const [key, listeners] of entries) {
      if(typeof key === 'string' && key.startsWith(EVENT_KEY_PREFIX)) {
        const eventName = key.slice(EVENT_KEY_PREFIX.length)
        for(const listener of listeners.values()) {
          listener.__target.removeEventListener(eventName, listener, {
            capture : listener.__options.capture,
          })
        }
        listeners.clear()
        this.__handlers.delete(key)
      }
    }
  }

  /**
   * Destroy this instance
   */
  destroy() {
    this.removeAllListeners()
    if(this.__handlers && this.__handlers.size) {
      console.warn('Memory leak: %d handlers are not removed', this.__handlers.size)
      console.log(this, Array.from(this.__handlers.entries()))
      this.__handlers.clear()
    }
    this.__handlers = null
    super.destroy()
  }

  static defineEvent(type) {
    // todo
  }

  /**
   * @param {string} request
   * @param {RequestInit} init
   * @returns {Promise<any>}
   */
  async fetch(request, init) {
    const res = await window__WEBPACK_IMPORTED_MODULE_0___default().fetch(request, init)
    if(!res.ok) {
      throw Error(res.statusText)
    }
    return res.json()
  }

  /**
   * @param {string} request
   * @returns {Promise<any>}
   */
  async get(request) {
    return this.fetch(request, {
      headers : { 'Accept' : JSON_MIME_TYPE },
    })
  }

  /**
   * @param {string} url
   * @param {any} data
   * @returns {Promise<any>}
   */
  async post(url, data) {
    const init = {
      method : 'POST',
      headers : {
        'Accept' : JSON_MIME_TYPE,
        'Content-Type' : JSON_MIME_TYPE,
      },
    }
    if(typeof data !== 'undefined') {
      init.body = JSON.stringify(data)
    }
    return this.fetch(url, init)
  }
}

function get(target) {
  if(!target) {
    return null
  }
  switch(target.nodeType) {
    case Node.ELEMENT_NODE:
      return DomTarget.DomElem.get(target)
    case Node.DOCUMENT_NODE:
      return DomTarget.DomDoc.get(target)
    default:
      return DomTarget.Win.get(target)
  }
}

/**
 * type : [constructor, bubbles, cancelable]
 */
DomTarget.events = {
  blur : [(window__WEBPACK_IMPORTED_MODULE_0___default().FocusEvent)],
  cancel : [(window__WEBPACK_IMPORTED_MODULE_0___default().Event), false, true],
  change : [(window__WEBPACK_IMPORTED_MODULE_0___default().Event), true],
  click : [(window__WEBPACK_IMPORTED_MODULE_0___default().MouseEvent), true, true],
  close : [(window__WEBPACK_IMPORTED_MODULE_0___default().Event)],
  contextmenu : [(window__WEBPACK_IMPORTED_MODULE_0___default().MouseEvent), true, true],
  dblclick : [(window__WEBPACK_IMPORTED_MODULE_0___default().MouseEvent), true, true],
  error : [(window__WEBPACK_IMPORTED_MODULE_0___default().Event)],
  focus : [(window__WEBPACK_IMPORTED_MODULE_0___default().FocusEvent)],
  focusin : [(window__WEBPACK_IMPORTED_MODULE_0___default().FocusEvent), true],
  focusout : [(window__WEBPACK_IMPORTED_MODULE_0___default().FocusEvent), true],
  input : [(window__WEBPACK_IMPORTED_MODULE_0___default().InputEvent), true],
  invalid : [(window__WEBPACK_IMPORTED_MODULE_0___default().Event), false, true],
  keydown : [(window__WEBPACK_IMPORTED_MODULE_0___default().KeyboardEvent), true, true],
  keyup : [(window__WEBPACK_IMPORTED_MODULE_0___default().KeyboardEvent), true, true],
  load : [(window__WEBPACK_IMPORTED_MODULE_0___default().Event)],
  mousedown : [(window__WEBPACK_IMPORTED_MODULE_0___default().MouseEvent), true, true],
  mouseenter : [(window__WEBPACK_IMPORTED_MODULE_0___default().MouseEvent)],
  mouseleave : [(window__WEBPACK_IMPORTED_MODULE_0___default().MouseEvent)],
  mousemove : [(window__WEBPACK_IMPORTED_MODULE_0___default().MouseEvent), true, true],
  mouseout : [(window__WEBPACK_IMPORTED_MODULE_0___default().MouseEvent), true, true],
  mouseover : [(window__WEBPACK_IMPORTED_MODULE_0___default().MouseEvent), true, true],
  mouseup : [(window__WEBPACK_IMPORTED_MODULE_0___default().MouseEvent), true, true],
  reset : [(window__WEBPACK_IMPORTED_MODULE_0___default().Event), true, true],
  resize : [(window__WEBPACK_IMPORTED_MODULE_0___default().UIEvent)],
  scroll : [(window__WEBPACK_IMPORTED_MODULE_0___default().Event), true],
  submit : [(window__WEBPACK_IMPORTED_MODULE_0___default().Event), true, true],
  touchcancel : [(window__WEBPACK_IMPORTED_MODULE_0___default().TouchEvent), true],
  touchend : [(window__WEBPACK_IMPORTED_MODULE_0___default().TouchEvent), true, true],
  touchmove : [(window__WEBPACK_IMPORTED_MODULE_0___default().TouchEvent), true, true],
  touchstart : [(window__WEBPACK_IMPORTED_MODULE_0___default().TouchEvent), true, true],
}

/**
 * todo remove handlers on destroy
 */
for(const type of Object.keys(DomTarget.events)) {
  const name = 'on' + type
  Object.defineProperty(DomTarget.prototype, name, {
    configurable : true,
    /**
     * @param {function|null} callback
     */
    set(callback) {
      this.node[name] = callback && (event => {
        callback.call(this, event, DomTarget.get(event.target))
      })
    },
    /**
     * @returns {function|null}
     */
    get() {
      return this.node[name]
    },
  })
}

const JSON_MIME_TYPE = 'application/json'


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlBody": () => (/* binding */ HtmlBody)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-body-element
 */
class HtmlBody extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlElem": () => (/* binding */ HtmlElem)
/* harmony export */ });
/* harmony import */ var _AriaAtomic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _AriaBusy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15);
/* harmony import */ var _AriaControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(16);
/* harmony import */ var _AriaCurrent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(18);
/* harmony import */ var _AriaDescribedBy__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(20);
/* harmony import */ var _AriaDetails__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(21);
/* harmony import */ var _AriaFlowTo__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(23);
/* harmony import */ var _AriaKeyShortcuts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(24);
/* harmony import */ var _AriaLabel__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(26);
/* harmony import */ var _AriaLabelledBy__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(27);
/* harmony import */ var _AriaLive__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(28);
/* harmony import */ var _AriaOwns__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(29);
/* harmony import */ var _AriaRelevant__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(30);
/* harmony import */ var _AriaRoleDescription__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(32);
/* harmony import */ var _Dataset__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(33);
/* harmony import */ var _DomElem__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(6);
/* harmony import */ var _Style__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(34);
/* harmony import */ var _TabIndex__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(35);



















/**
 * @see https://www.w3.org/TR/html/single-page.html#htmlelement
 * @abstract
 */
class HtmlElem extends _DomElem__WEBPACK_IMPORTED_MODULE_15__.DomElem
{
  /**
   * Click the element
   */
  click() {
    this.node.click()
  }

  /**
   * Focus the element
   */
  focus() {
    this.node.focus()
  }

  /**
   * Blur the element
   */
  blur() {
    this.node.blur()
  }

  /**
   * @param {string} accessKey
   */
  set accessKey(accessKey) {
    this.node.accessKey = accessKey
  }

  /**
   * @returns {string}
   */
  get accessKey() {
    return this.node.accessKey
  }

  /**
   * @param {boolean} autofocus
   */
  set autofocus(autofocus) {
    this.node.autofocus = autofocus
  }

  /**
   * @returns {boolean}
   */
  get autofocus() {
    return this.node.autofocus
  }

  /**
   * @param {string} contentEditable
   */
  set contentEditable(contentEditable) {
    this.node.contentEditable = contentEditable
  }

  /**
   * @returns {string}
   */
  get contentEditable() {
    return this.node.contentEditable
  }

  /**
   * @param {{}} dataset
   */
  set dataset(dataset) {
    this.setAttr(_Dataset__WEBPACK_IMPORTED_MODULE_14__.Dataset, dataset)
  }

  /**
   * @returns {DOMStringMap}
   */
  get dataset() {
    return this.getAttr(_Dataset__WEBPACK_IMPORTED_MODULE_14__.Dataset)
  }

  /**
   * @param {string} dir
   */
  set dir(dir) {
    this.node.dir = dir
  }

  /**
   * @returns {string}
   */
  get dir() {
    return this.node.dir
  }

  /**
   * @return {string}
   */
  get inputMode() {
    return this.node.inputMode
  }

  /**
   * @param {string} inputMode
   */
  set inputMode(inputMode) {
    this.node.inputMode = inputMode
  }

  /**
   * @return {boolean}
   */
  get isContentEditable() {
    return this.node.isContentEditable
  }

  /**
   * @param {string} lang
   */
  set lang(lang) {
    this.node.lang = lang
  }

  /**
   * @returns {string}
   */
  get lang() {
    return this.node.lang
  }

  /**
   * @param {string} role
   */
  set role(role) {
    this.setAttr('role', role)
  }

  /**
   * @returns {string}
   */
  get role() {
    return this.getAttr('role')
  }

  /**
   * @param {*} style {string|{}}
   */
  set style(style) {
    this.setAttr(_Style__WEBPACK_IMPORTED_MODULE_16__.Style, style)
  }

  /**
   * @returns {CSSStyleDeclaration}
   */
  get style() {
    return this.getAttr(_Style__WEBPACK_IMPORTED_MODULE_16__.Style)
  }

  /**
   * @param {number|null} tabIndex
   */
  set tabIndex(tabIndex) {
    this.setAttr(_TabIndex__WEBPACK_IMPORTED_MODULE_17__.TabIndex, tabIndex)
  }

  /**
   * @returns {number|null}
   */
  get tabIndex() {
    return this.getAttr(_TabIndex__WEBPACK_IMPORTED_MODULE_17__.TabIndex)
  }

  /**
   * @param {string} title
   */
  set title(title) {
    this.node.title = title
  }

  /**
   * @returns {string}
   */
  get title() {
    return this.node.title
  }

  /**
   * @param {boolean} translate
   */
  set translate(translate) {
    this.node.translate = translate
  }

  /**
   * @returns {boolean}
   */
  get translate() {
    return this.node.translate
  }

  /**
   * @param {boolean} hidden
   */
  set hidden(hidden) {
    this.node.hidden = hidden
  }

  /**
   * @returns {boolean}
   */
  get hidden() {
    return this.node.hidden
  }

  /**
   * @returns {string[]}
   */
  static get classList() {
    const { superAssembler } = this
    const classList = []
    let object = this
    let proto
    if(this !== superAssembler) {
      while(proto = Object.getPrototypeOf(object)) {
        if(proto !== superAssembler) {
          const classToken = object.classToken
          classToken && !classList.includes(classToken) && classList.push(classToken)
          object = proto
        }
        else break
      }
    }
    return classList
  }

  /**
   * @returns {string}
   */
  static get classToken() {
    return Object.getPrototypeOf(this) === this.superAssembler? '' : this.name
  }

  /**
   * @returns {string}
   * @override
   */
  static get localName() {
    const { superAssembler } = this
    let object = this
    let proto
    if(this === superAssembler) {
      return ''
    }
    while(proto = Object.getPrototypeOf(object)) {
      if(proto === superAssembler) {
        break
      }
      else object = proto
    }
    return object.name.slice(4).toLowerCase()
  }

  /**
   * @returns {string}
   */
  static get selector() {
    const classToken = this.classToken
    return classToken?
      super.selector + '.' + classToken :
      super.selector
  }

  /**
   * @returns {constructor} HtmlElem
   * @override
   */
  static get superAssembler() {
    return HtmlElem
  }
}

HtmlElem.defineAttrs([
  _AriaAtomic__WEBPACK_IMPORTED_MODULE_0__.AriaAtomic,
  _AriaBusy__WEBPACK_IMPORTED_MODULE_1__.AriaBusy,
  _AriaControls__WEBPACK_IMPORTED_MODULE_2__.AriaControls,
  _AriaCurrent__WEBPACK_IMPORTED_MODULE_3__.AriaCurrent,
  _AriaDescribedBy__WEBPACK_IMPORTED_MODULE_4__.AriaDescribedBy,
  _AriaDetails__WEBPACK_IMPORTED_MODULE_5__.AriaDetails,
  _AriaFlowTo__WEBPACK_IMPORTED_MODULE_6__.AriaFlowTo,
  _AriaKeyShortcuts__WEBPACK_IMPORTED_MODULE_7__.AriaKeyShortcuts,
  _AriaLabel__WEBPACK_IMPORTED_MODULE_8__.AriaLabel,
  _AriaLabelledBy__WEBPACK_IMPORTED_MODULE_9__.AriaLabelledBy,
  _AriaLive__WEBPACK_IMPORTED_MODULE_10__.AriaLive,
  _AriaOwns__WEBPACK_IMPORTED_MODULE_11__.AriaOwns,
  _AriaRelevant__WEBPACK_IMPORTED_MODULE_12__.AriaRelevant,
  _AriaRoleDescription__WEBPACK_IMPORTED_MODULE_13__.AriaRoleDescription
])

HtmlElem.defineGetters([
  'offsetLeft',
  'offsetTop',
  'offsetWidth',
  'offsetHeight'
])


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaAtomic": () => (/* binding */ AriaAtomic)
/* harmony export */ });
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);


/**
 * Indicates whether assistive technologies will present all,
 *  or only parts of, the changed region based on the change
 *  notifications defined by the aria-relevant attribute.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-atomic
 */
class AriaAtomic extends _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__.AriaTypeBoolean
{
}


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeBoolean": () => (/* binding */ AriaTypeBoolean)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


const TOKEN_TRUE = 'true'
const TOKEN_FALSE = 'false'

/**
 * Value representing either true or false.
 *  The default value for this value type is false unless otherwise specified.
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_true-false
 * @abstract
 */
class AriaTypeBoolean extends _AriaType__WEBPACK_IMPORTED_MODULE_0__.AriaType
{
  /**
   * value = true
   * value = 'true'
   * value = '*' // non empty string
   * value = 1
   * value = * // non zero
   *      => 'true'
   *
   * value = false
   * value = 'false'
   * value = ''
   * value = null
   * value = undefined
   * value = 0
   *      => no attr
   *
   * @param {DomElem} elem
   * @param {*} value {boolean|string|number|null|undefined}
   */
  static set(elem, value) {
    super.set(elem, TOKEN_TRUE)
  }

  /**
   * value === 'true'
   * value === '*' // non empty string
   *      => true
   *
   * value === 'false'
   * value === ''
   * no attr
   *      => false
   *
   * @param {DomElem} elem
   * @returns {boolean}
   */
  static get(elem) {
    const value = super.get(elem)
    return Boolean(value) && value !== TOKEN_FALSE
  }

  /**
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(elem, value) {
    return (!value || value === TOKEN_FALSE) && !this.remove(elem)
  }

  /**
   * @returns {boolean}
   */
  static get defaultValue() {
    return false
  }
}


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaType": () => (/* binding */ AriaType)
/* harmony export */ });
/* harmony import */ var _AttrType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);


const ARIA_ATTR_PREFIX = 'aria-'

/**
 * @see https://www.w3.org/TR/wai-aria-1.1/#host_general_attrs
 * @see https://www.w3.org/TR/html/dom.html#state-and-property-attributes
 * @see http://www.w3.org/ns/wai-aria/
 * @abstract
 */
class AriaType extends _AttrType__WEBPACK_IMPORTED_MODULE_0__.AttrType
{
  /**
   * @param {DomElem} elem
   * @returns {string|null|*}
   * @override
   */
  static get(elem) {
    const value = super.get(elem)
    return value || this.defaultValue
  }

  /**
   * @see https://www.w3.org/TR/wai-aria-1.1/#state_property_processing
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   * @override
   */
  static removeOnValue(elem, value) {
    return value === ''?
      !this.remove(elem) :
      super.removeOnValue(elem, value)
  }

  /**
   * @returns {string}
   * @override
   */
  static get attrName() {
    const name = this.name.slice(4)
    return name[0].toLowerCase() + name.slice(1)
  }

  /**
   * @returns {string}
   * @override
   */
  static get localName() {
    return ARIA_ATTR_PREFIX + this.name.slice(4).toLowerCase()
  }
}


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaBusy": () => (/* binding */ AriaBusy)
/* harmony export */ });
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);


/**
 * Indicates an element is being modified and that assistive technologies MAY want
 *  to wait until the modifications are complete before exposing them to the user.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-busy
 */
class AriaBusy extends _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__.AriaTypeBoolean
{
}


/***/ }),
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaControls": () => (/* binding */ AriaControls)
/* harmony export */ });
/* harmony import */ var _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);


/**
 * Identifies the element (or elements) whose contents
 *  or presence are controlled by the current element.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-controls
 */
class AriaControls extends _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__.AriaTypeIdRefList
{
}


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeIdRefList": () => (/* binding */ AriaTypeIdRefList)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _DomElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);



const { isArray } = Array

/**
 * A list of one or more ID references.
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_idref_list
 * @abstract
 */
class AriaTypeIdRefList extends _AriaType__WEBPACK_IMPORTED_MODULE_0__.AriaType
{
  /**
   * @param {DomElem} elem
   * @param {DomElem|array.DomElem} value
   */
  static set(elem, value) {
    if(!Array.isArray(value)) {
      value = [value]
    }
    const items = value.filter(Boolean)
    if(!items.length) {
      this.remove(elem)
    }
    const doc = elem.doc
    const storage = {}
    let refs = doc.__refs.get(elem)
    refs || doc.__refs.set(elem, refs = new Map)
    refs.set(this, storage)
    const ids = items.map(item => {
      const id = item.id || (item.id = item.generateId())
      storage[id] = item
      return id
    })
    super.set(elem, ids.join(' '))
  }

  /**
   * @param {DomElem} elem
   * @returns {DomElem[]}
   */
  static get(elem) {
    const value = elem.node.getAttribute(this.localName)
    if(value) {
      const doc = elem.doc
      const refs = doc.__refs.get(elem)
      const ids = value.split(' ')
      if(refs) {
        const storage = refs.get(this)
        if(storage) {
          return ids.map(id => storage[id] || null)
        }
      }
      return ids.map(id => doc.getElementById(id))
    }
    return this.defaultValue
  }

  /**
   * @param {DomElem} elem
   */
  static remove(elem) {
    const doc = elem.doc
    const refs = doc.__refs.get(elem)
    if(refs) {
      refs.delete(this)
      refs.size || doc.__refs.delete(elem)
    }
    super.remove(elem)
  }

  /**
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(elem, value) {
    return isArray(value) && !value.length?
      !this.remove(elem) :
      super.removeOnValue(elem, value)
  }

  /**
   * @returns {array}
   */
  static get defaultValue() {
    return []
  }
}


/***/ }),
/* 18 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaCurrent": () => (/* binding */ AriaCurrent)
/* harmony export */ });
/* harmony import */ var _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);


const TOKEN_TRUE = 'true'
const TOKEN_FALSE = 'false'

/**
 * Indicates the element that represents the current item
 *  within a container or set of related elements.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-current
 */
class AriaCurrent extends _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__.AriaTypeToken
{
  /**
   * @param {DomElem} elem
   * @param {*} value {boolean|string}
   */
  static set(elem, value) {
    super.set(elem, String(value))
  }

  /**
   * @param {DomElem} elem
   * @returns {boolean|string}
   */
  static get(elem) {
    const value = elem.node.getAttribute(this.localName)
    return !value || value === TOKEN_FALSE?
      false :
      value === TOKEN_TRUE || value
  }

  /**
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(elem, value) {
    return String(value) === TOKEN_FALSE?
      !this.remove(elem) :
      super.removeOnValue(elem, value)
  }

  /**
   * @returns {boolean}
   */
  static get defaultValue() {
    return false
  }
}


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeToken": () => (/* binding */ AriaTypeToken)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


let undefined
const TOKEN_UNDEFINED = 'undefined'

/**
 * One of a limited set of allowed values. An explicit value
 *  of undefined for this type is the equivalent of providing no value.
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_token
 * @abstract
 */
class AriaTypeToken extends _AriaType__WEBPACK_IMPORTED_MODULE_0__.AriaType
{
  /**
   * value = 'token'
   *      => 'token'
   *
   * value = null
   * value = undefined
   * value = 'undefined'
   * value = ''
   *      => no attr
   */

  /**
   * value === 'token'
   *      => 'token'
   *
   * value === 'undefined'
   * value === ''
   * no attr
   *      => undefined
   *
   * @param {DomElem} elem
   * @returns {string|undefined}
   */
  static get(elem) {
    const value = super.get(elem)
    if(value === TOKEN_UNDEFINED) {
      return undefined
    }
    return value
  }

  /**
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(elem, value) {
    return String(value) === TOKEN_UNDEFINED?
      !this.remove(elem) :
      super.removeOnValue(elem, value)
  }

  /**
   * @returns {undefined}
   */
  static get defaultValue() {
    return undefined
  }

  /**
   * @returns {string[]}
   */
  static get tokens() {
    // todo
  }
}


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaDescribedBy": () => (/* binding */ AriaDescribedBy)
/* harmony export */ });
/* harmony import */ var _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);


/**
 * Identifies the element (or elements) that describes the object.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-describedby
 */
class AriaDescribedBy extends _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__.AriaTypeIdRefList
{
}


/***/ }),
/* 21 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaDetails": () => (/* binding */ AriaDetails)
/* harmony export */ });
/* harmony import */ var _AriaTypeIdRef__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);


/**
 * Identifies the element that provides a detailed, extended description for the object.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-details
 */
class AriaDetails extends _AriaTypeIdRef__WEBPACK_IMPORTED_MODULE_0__.AriaTypeIdRef
{
}


/***/ }),
/* 22 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeIdRef": () => (/* binding */ AriaTypeIdRef)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _DomElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);



/**
 * Reference to the ID of another element in the same document
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_idref
 * @abstract
 */
class AriaTypeIdRef extends _AriaType__WEBPACK_IMPORTED_MODULE_0__.AriaType
{
  /**
   * @param {DomElem} elem
   * @param {DomElem|null} value
   */
  static set(elem, value) {
    if(!value) {
      this.remove(elem)
      return // fixme: refs.delete(this) ???
    }
    const doc = elem.doc
    let refs = doc.__refs.get(elem)
    refs || doc.__refs.set(elem, refs = new Map)
    refs.set(this, value)
    super.set(elem, value.id || (value.id = value.generateId()))
  }

  /**
   * @param {DomElem} elem
   * @returns {DomElem|null}
   */
  static get(elem) {
    const value = super.get(elem)
    if(value) {
      const doc = elem.doc
      const refs = doc.__refs.get(elem)
      return refs?
        refs.get(this) || null :
        doc.getElementById(value)
    }
    return value
  }

  /**
   * @param {DomElem} elem
   */
  static remove(elem) {
    const doc = elem.doc
    const refs = doc.__refs.get(elem)
    if(refs) {
      refs.delete(this)
      refs.size || doc.__refs.delete(elem)
    }
    super.remove(elem)
  }

  /**
   * @returns {null}
   */
  static get defaultValue() {
    return null
  }
}


/***/ }),
/* 23 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaFlowTo": () => (/* binding */ AriaFlowTo)
/* harmony export */ });
/* harmony import */ var _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);


/**
 * dentifies the next element (or elements) in an alternate reading order
 *  of content which, at the user's discretion, allows assistive technology
 *  to override the general default of reading in document source order.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-flowto
 */
class AriaFlowTo extends _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__.AriaTypeIdRefList
{
}


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaKeyShortcuts": () => (/* binding */ AriaKeyShortcuts)
/* harmony export */ });
/* harmony import */ var _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(25);


/**
 * Indicates keyboard shortcuts that an author has implemented
 *  to activate or give focus to an element.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-keyshortcuts
 */
class AriaKeyShortcuts extends _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__.AriaTypeString
{
}


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeString": () => (/* binding */ AriaTypeString)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


const EMPTY_STRING = ''

/**
 * Unconstrained value type.
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_string
 * @abstract
 */
class AriaTypeString extends _AriaType__WEBPACK_IMPORTED_MODULE_0__.AriaType
{
  /**
   * @returns {string}
   */
  static get defaultValue() {
    return EMPTY_STRING
  }
}


/***/ }),
/* 26 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaLabel": () => (/* binding */ AriaLabel)
/* harmony export */ });
/* harmony import */ var _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(25);


/**
 * Defines a string value that labels the current element.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-label
 */
class AriaLabel extends _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__.AriaTypeString
{
}


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaLabelledBy": () => (/* binding */ AriaLabelledBy)
/* harmony export */ });
/* harmony import */ var _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);


/**
 * Identifies the element (or elements) that labels the current element.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby
 */
class AriaLabelledBy extends _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__.AriaTypeIdRefList
{
}


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaLive": () => (/* binding */ AriaLive)
/* harmony export */ });
/* harmony import */ var _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);


const TOKEN_OFF = 'off'

/**
 * Indicates that an element will be updated, and describes
 *  the types of updates the user agents, assistive technologies,
 *  and user can expect from the live region.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-live
 */
class AriaLive extends _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__.AriaTypeToken
{
  /**
   * @param {DomElem} element
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(element, value) {
    return value === TOKEN_OFF?
      !this.remove(element) :
      super.removeOnValue(element, value)
  }
}


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaOwns": () => (/* binding */ AriaOwns)
/* harmony export */ });
/* harmony import */ var _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);


/**
 * Identifies an element (or elements) in order to define a visual,
 *  functional, or contextual parent/child relationship between DOM elements
 *  where the DOM hierarchy cannot be used to represent the relationship.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-owns
 */
class AriaOwns extends _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__.AriaTypeIdRefList
{
}


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaRelevant": () => (/* binding */ AriaRelevant)
/* harmony export */ });
/* harmony import */ var _AriaTypeTokenList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31);


/**
 * Indicates what notifications the user agent will trigger
 *  when the accessibility tree within a live region is modified.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-relevant
 */
class AriaRelevant extends _AriaTypeTokenList__WEBPACK_IMPORTED_MODULE_0__.AriaTypeTokenList
{
}


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeTokenList": () => (/* binding */ AriaTypeTokenList)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


const { isArray } = Array

/**
 * A list of one or more tokens.
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_token_list
 * @abstract
 */
class AriaTypeTokenList extends _AriaType__WEBPACK_IMPORTED_MODULE_0__.AriaType
{
  /**
   * @param {DomElem} elem
   * @param {*} value {string[]|string}
   */
  static set(elem, value) {
    if(isArray(value)) {
      const list = value.filter(Boolean)
      if(list.length) {
        super.set(elem, list.join(' '))
      }
      else elem.node.removeAttribute(this.localName)
    }
    else super.set(elem, value)
  }

  /**
   * @param {DomElem} elem
   * @returns {string[]}
   */
  static get(elem) {
    const value = elem.node.getAttribute(this.localName)
    return value? value.split(' ') : this.defaultValue
  }

  /**
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(elem, value) {
    return isArray(value) && !value.length?
      !this.remove(elem) :
      super.removeOnValue(elem, value)
  }

  /**
   * @returns {array}
   */
  static get defaultValue() {
    return []
  }
}


/***/ }),
/* 32 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaRoleDescription": () => (/* binding */ AriaRoleDescription)
/* harmony export */ });
/* harmony import */ var _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(25);


/**
 * Defines a human-readable, author-localized description for the role of an element.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-roledescription
 */
class AriaRoleDescription extends _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__.AriaTypeString
{
}


/***/ }),
/* 33 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Dataset": () => (/* binding */ Dataset)
/* harmony export */ });
/* harmony import */ var _AttrType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);


let undefined

class Dataset extends _AttrType__WEBPACK_IMPORTED_MODULE_0__.AttrType
{
  /**
   * @param {DomElem} elem
   * @param {{}} dataset
   */
  static set(elem, dataset) {
    const map = elem.node.dataset
    for(let [name, value] of Object.entries(dataset)) {
      if(value !== undefined) {
        map[name] = dataset[name]
      }
    }
  }

  /**
   * @param {DomElem} elem
   * @returns {DOMStringMap}
   */
  static get(elem) {
    return elem.node.dataset
  }

  /**
   * @param {DomElem} elem
   * @returns {boolean}
   */
  static has(elem) {
    return 'dataset' in elem.node
  }
}


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Style": () => (/* binding */ Style)
/* harmony export */ });
/* harmony import */ var _AttrType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);


class Style extends _AttrType__WEBPACK_IMPORTED_MODULE_0__.AttrType
{
  /**
   * @param {HtmlElem} elem
   * @param {string|{}} style
   */
  static set(elem, style) {
    if(typeof style === 'string') {
      elem.node.style = style
    }
    else Object.assign(elem.node.style, style)
  }

  /**
   * @param {HtmlElem} elem
   * @returns {CSSStyleDeclaration}
   */
  static get(elem) {
    return elem.node.style
  }

  /**
   * @param {HtmlElem} elem
   * @returns {boolean}
   */
  static has(elem) {
    return 'style' in elem.node
  }
}


/***/ }),
/* 35 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TabIndex": () => (/* binding */ TabIndex)
/* harmony export */ });
/* harmony import */ var _AriaDisabled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(36);
/* harmony import */ var _AttrType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _DomElem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6);




class TabIndex extends _AttrType__WEBPACK_IMPORTED_MODULE_1__.AttrType
{
  /**
   * @param {MutationRecord} record
   */
  static onDisabled(record) {
    const elem = _DomElem__WEBPACK_IMPORTED_MODULE_2__.DomElem.get(record.target)
    if(_AriaDisabled__WEBPACK_IMPORTED_MODULE_0__.AriaDisabled.get(elem)) {
      elem.__tabIndex = this.get(elem)
      super.remove(elem)
    }
    else super.set(elem, elem.__tabIndex)
  }

  /**
   * @param {DomElem} elem
   * @param {number} [elem.__tabIndex]
   * @param {number} value
   * todo handle set when elem.disabled === true
   */
  static set(elem, value) {
    elem.node.tabIndex = value
    if(elem.hasOwnProperty('__tabIndex')) {
      return
    }
    elem.__tabIndex = value
    elem.addAttrObserver(_AriaDisabled__WEBPACK_IMPORTED_MODULE_0__.AriaDisabled, this.onDisabled)
  }

  /**
   * @param {DomElem} elem
   * @returns {number|null}
   */
  static get(elem) {
    return elem.node.tabIndex
  }

  /**
   * @param {DomElem} elem
   * @param {number} [elem.__tabIndex]
   */
  static remove(elem) {
    super.remove(elem)
    elem.removeAttrObserver(_AriaDisabled__WEBPACK_IMPORTED_MODULE_0__.AriaDisabled, this.onDisabled)
    delete elem.__tabIndex
  }
}

TabIndex.onDisabled = TabIndex.onDisabled.bind(TabIndex)


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaDisabled": () => (/* binding */ AriaDisabled)
/* harmony export */ });
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);


/**
 * Indicates that the element is perceivable but disabled,
 *  so it is not editable or otherwise operable.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-disabled
 */
class AriaDisabled extends _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__.AriaTypeBoolean
{
}


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlHead": () => (/* binding */ HtmlHead)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-head-element
 */
class HtmlHead extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 38 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlHtml": () => (/* binding */ HtmlHtml)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-html-element
 */
class HtmlHtml extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 39 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DomFragment": () => (/* binding */ DomFragment)
/* harmony export */ });
/* harmony import */ var window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var window__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(window__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _DomNode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);



const { DocumentFragment } = (window__WEBPACK_IMPORTED_MODULE_0___default())

/**
 * @see https://www.w3.org/TR/dom/#interface-documentfragment
 */
class DomFragment extends _DomNode__WEBPACK_IMPORTED_MODULE_1__.DomNode
{
  /**
   * @param {{}} init
   * @param {DocumentFragment} [init.node]
   */
  create(init) {
    if(!init.node) {
      init.node = new DocumentFragment
    }
    super.create(init)
  }
}


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaType": () => (/* reexport safe */ _AriaType__WEBPACK_IMPORTED_MODULE_0__.AriaType),
/* harmony export */   "AriaActiveDescendant": () => (/* reexport safe */ _AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_1__.AriaActiveDescendant),
/* harmony export */   "AriaAtomic": () => (/* reexport safe */ _AriaAtomic__WEBPACK_IMPORTED_MODULE_2__.AriaAtomic),
/* harmony export */   "AriaAutoComplete": () => (/* reexport safe */ _AriaAutoComplete__WEBPACK_IMPORTED_MODULE_3__.AriaAutoComplete),
/* harmony export */   "AriaBusy": () => (/* reexport safe */ _AriaBusy__WEBPACK_IMPORTED_MODULE_4__.AriaBusy),
/* harmony export */   "AriaChecked": () => (/* reexport safe */ _AriaChecked__WEBPACK_IMPORTED_MODULE_5__.AriaChecked),
/* harmony export */   "AriaColCount": () => (/* reexport safe */ _AriaColCount__WEBPACK_IMPORTED_MODULE_6__.AriaColCount),
/* harmony export */   "AriaColIndex": () => (/* reexport safe */ _AriaColIndex__WEBPACK_IMPORTED_MODULE_7__.AriaColIndex),
/* harmony export */   "AriaColSpan": () => (/* reexport safe */ _AriaColSpan__WEBPACK_IMPORTED_MODULE_8__.AriaColSpan),
/* harmony export */   "AriaControls": () => (/* reexport safe */ _AriaControls__WEBPACK_IMPORTED_MODULE_9__.AriaControls),
/* harmony export */   "AriaCurrent": () => (/* reexport safe */ _AriaCurrent__WEBPACK_IMPORTED_MODULE_10__.AriaCurrent),
/* harmony export */   "AriaDescribedBy": () => (/* reexport safe */ _AriaDescribedBy__WEBPACK_IMPORTED_MODULE_11__.AriaDescribedBy),
/* harmony export */   "AriaDetails": () => (/* reexport safe */ _AriaDetails__WEBPACK_IMPORTED_MODULE_12__.AriaDetails),
/* harmony export */   "AriaDisabled": () => (/* reexport safe */ _AriaDisabled__WEBPACK_IMPORTED_MODULE_13__.AriaDisabled),
/* harmony export */   "AriaDropEffect": () => (/* reexport safe */ _AriaDropEffect__WEBPACK_IMPORTED_MODULE_14__.AriaDropEffect),
/* harmony export */   "AriaErrorMessage": () => (/* reexport safe */ _AriaErrorMessage__WEBPACK_IMPORTED_MODULE_15__.AriaErrorMessage),
/* harmony export */   "AriaExpanded": () => (/* reexport safe */ _AriaExpanded__WEBPACK_IMPORTED_MODULE_16__.AriaExpanded),
/* harmony export */   "AriaFlowTo": () => (/* reexport safe */ _AriaFlowTo__WEBPACK_IMPORTED_MODULE_17__.AriaFlowTo),
/* harmony export */   "AriaGrabbed": () => (/* reexport safe */ _AriaGrabbed__WEBPACK_IMPORTED_MODULE_18__.AriaGrabbed),
/* harmony export */   "AriaHasPopup": () => (/* reexport safe */ _AriaHasPopup__WEBPACK_IMPORTED_MODULE_19__.AriaHasPopup),
/* harmony export */   "AriaHidden": () => (/* reexport safe */ _AriaHidden__WEBPACK_IMPORTED_MODULE_20__.AriaHidden),
/* harmony export */   "AriaInvalid": () => (/* reexport safe */ _AriaInvalid__WEBPACK_IMPORTED_MODULE_21__.AriaInvalid),
/* harmony export */   "AriaKeyShortcuts": () => (/* reexport safe */ _AriaKeyShortcuts__WEBPACK_IMPORTED_MODULE_22__.AriaKeyShortcuts),
/* harmony export */   "AriaLabel": () => (/* reexport safe */ _AriaLabel__WEBPACK_IMPORTED_MODULE_23__.AriaLabel),
/* harmony export */   "AriaLabelledBy": () => (/* reexport safe */ _AriaLabelledBy__WEBPACK_IMPORTED_MODULE_24__.AriaLabelledBy),
/* harmony export */   "AriaLevel": () => (/* reexport safe */ _AriaLevel__WEBPACK_IMPORTED_MODULE_25__.AriaLevel),
/* harmony export */   "AriaLive": () => (/* reexport safe */ _AriaLive__WEBPACK_IMPORTED_MODULE_26__.AriaLive),
/* harmony export */   "AriaModal": () => (/* reexport safe */ _AriaModal__WEBPACK_IMPORTED_MODULE_27__.AriaModal),
/* harmony export */   "AriaMultiLine": () => (/* reexport safe */ _AriaMultiLine__WEBPACK_IMPORTED_MODULE_28__.AriaMultiLine),
/* harmony export */   "AriaMultiSelectable": () => (/* reexport safe */ _AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_29__.AriaMultiSelectable),
/* harmony export */   "AriaOrientation": () => (/* reexport safe */ _AriaOrientation__WEBPACK_IMPORTED_MODULE_30__.AriaOrientation),
/* harmony export */   "AriaOwns": () => (/* reexport safe */ _AriaOwns__WEBPACK_IMPORTED_MODULE_31__.AriaOwns),
/* harmony export */   "AriaPlaceholder": () => (/* reexport safe */ _AriaPlaceholder__WEBPACK_IMPORTED_MODULE_32__.AriaPlaceholder),
/* harmony export */   "AriaPosInSet": () => (/* reexport safe */ _AriaPosInSet__WEBPACK_IMPORTED_MODULE_33__.AriaPosInSet),
/* harmony export */   "AriaPressed": () => (/* reexport safe */ _AriaPressed__WEBPACK_IMPORTED_MODULE_34__.AriaPressed),
/* harmony export */   "AriaReadOnly": () => (/* reexport safe */ _AriaReadOnly__WEBPACK_IMPORTED_MODULE_35__.AriaReadOnly),
/* harmony export */   "AriaRelevant": () => (/* reexport safe */ _AriaRelevant__WEBPACK_IMPORTED_MODULE_36__.AriaRelevant),
/* harmony export */   "AriaRequired": () => (/* reexport safe */ _AriaRequired__WEBPACK_IMPORTED_MODULE_37__.AriaRequired),
/* harmony export */   "AriaRoleDescription": () => (/* reexport safe */ _AriaRoleDescription__WEBPACK_IMPORTED_MODULE_38__.AriaRoleDescription),
/* harmony export */   "AriaRowCount": () => (/* reexport safe */ _AriaRowCount__WEBPACK_IMPORTED_MODULE_39__.AriaRowCount),
/* harmony export */   "AriaRowIndex": () => (/* reexport safe */ _AriaRowIndex__WEBPACK_IMPORTED_MODULE_40__.AriaRowIndex),
/* harmony export */   "AriaRowSpan": () => (/* reexport safe */ _AriaRowSpan__WEBPACK_IMPORTED_MODULE_41__.AriaRowSpan),
/* harmony export */   "AriaSelected": () => (/* reexport safe */ _AriaSelected__WEBPACK_IMPORTED_MODULE_42__.AriaSelected),
/* harmony export */   "AriaSetSize": () => (/* reexport safe */ _AriaSetSize__WEBPACK_IMPORTED_MODULE_43__.AriaSetSize),
/* harmony export */   "AriaSort": () => (/* reexport safe */ _AriaSort__WEBPACK_IMPORTED_MODULE_44__.AriaSort),
/* harmony export */   "AriaTypeApplicable": () => (/* reexport safe */ _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_45__.AriaTypeApplicable),
/* harmony export */   "AriaTypeBoolean": () => (/* reexport safe */ _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_46__.AriaTypeBoolean),
/* harmony export */   "AriaTypeIdRef": () => (/* reexport safe */ _AriaTypeIdRef__WEBPACK_IMPORTED_MODULE_47__.AriaTypeIdRef),
/* harmony export */   "AriaTypeIdRefList": () => (/* reexport safe */ _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_48__.AriaTypeIdRefList),
/* harmony export */   "AriaTypeInteger": () => (/* reexport safe */ _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_49__.AriaTypeInteger),
/* harmony export */   "AriaTypeNumber": () => (/* reexport safe */ _AriaTypeNumber__WEBPACK_IMPORTED_MODULE_50__.AriaTypeNumber),
/* harmony export */   "AriaTypeString": () => (/* reexport safe */ _AriaTypeString__WEBPACK_IMPORTED_MODULE_51__.AriaTypeString),
/* harmony export */   "AriaTypeToken": () => (/* reexport safe */ _AriaTypeToken__WEBPACK_IMPORTED_MODULE_52__.AriaTypeToken),
/* harmony export */   "AriaTypeTokenList": () => (/* reexport safe */ _AriaTypeTokenList__WEBPACK_IMPORTED_MODULE_53__.AriaTypeTokenList),
/* harmony export */   "AriaTypeTristate": () => (/* reexport safe */ _AriaTypeTristate__WEBPACK_IMPORTED_MODULE_54__.AriaTypeTristate),
/* harmony export */   "AriaValueMax": () => (/* reexport safe */ _AriaValueMax__WEBPACK_IMPORTED_MODULE_55__.AriaValueMax),
/* harmony export */   "AriaValueMin": () => (/* reexport safe */ _AriaValueMin__WEBPACK_IMPORTED_MODULE_56__.AriaValueMin),
/* harmony export */   "AriaValueNow": () => (/* reexport safe */ _AriaValueNow__WEBPACK_IMPORTED_MODULE_57__.AriaValueNow),
/* harmony export */   "AriaValueText": () => (/* reexport safe */ _AriaValueText__WEBPACK_IMPORTED_MODULE_58__.AriaValueText),
/* harmony export */   "Role": () => (/* reexport safe */ _Role__WEBPACK_IMPORTED_MODULE_59__.Role),
/* harmony export */   "RoleAlert": () => (/* reexport safe */ _RoleAlert__WEBPACK_IMPORTED_MODULE_60__.RoleAlert),
/* harmony export */   "RoleAlertDialog": () => (/* reexport safe */ _RoleAlertDialog__WEBPACK_IMPORTED_MODULE_61__.RoleAlertDialog),
/* harmony export */   "RoleApplication": () => (/* reexport safe */ _RoleApplication__WEBPACK_IMPORTED_MODULE_62__.RoleApplication),
/* harmony export */   "RoleArticle": () => (/* reexport safe */ _RoleArticle__WEBPACK_IMPORTED_MODULE_63__.RoleArticle),
/* harmony export */   "RoleBanner": () => (/* reexport safe */ _RoleBanner__WEBPACK_IMPORTED_MODULE_64__.RoleBanner),
/* harmony export */   "RoleBlockQuote": () => (/* reexport safe */ _RoleBlockQuote__WEBPACK_IMPORTED_MODULE_65__.RoleBlockQuote),
/* harmony export */   "RoleButton": () => (/* reexport safe */ _RoleButton__WEBPACK_IMPORTED_MODULE_66__.RoleButton),
/* harmony export */   "RoleCaption": () => (/* reexport safe */ _RoleCaption__WEBPACK_IMPORTED_MODULE_67__.RoleCaption),
/* harmony export */   "RoleCell": () => (/* reexport safe */ _RoleCell__WEBPACK_IMPORTED_MODULE_68__.RoleCell),
/* harmony export */   "RoleCheckBox": () => (/* reexport safe */ _RoleCheckBox__WEBPACK_IMPORTED_MODULE_69__.RoleCheckBox),
/* harmony export */   "RoleColumnHeader": () => (/* reexport safe */ _RoleColumnHeader__WEBPACK_IMPORTED_MODULE_70__.RoleColumnHeader),
/* harmony export */   "RoleComboBox": () => (/* reexport safe */ _RoleComboBox__WEBPACK_IMPORTED_MODULE_71__.RoleComboBox),
/* harmony export */   "RoleCommand": () => (/* reexport safe */ _RoleCommand__WEBPACK_IMPORTED_MODULE_72__.RoleCommand),
/* harmony export */   "RoleComplementary": () => (/* reexport safe */ _RoleComplementary__WEBPACK_IMPORTED_MODULE_73__.RoleComplementary),
/* harmony export */   "RoleComposite": () => (/* reexport safe */ _RoleComposite__WEBPACK_IMPORTED_MODULE_74__.RoleComposite),
/* harmony export */   "RoleContentInfo": () => (/* reexport safe */ _RoleContentInfo__WEBPACK_IMPORTED_MODULE_75__.RoleContentInfo),
/* harmony export */   "RoleDefinition": () => (/* reexport safe */ _RoleDefinition__WEBPACK_IMPORTED_MODULE_76__.RoleDefinition),
/* harmony export */   "RoleDialog": () => (/* reexport safe */ _RoleDialog__WEBPACK_IMPORTED_MODULE_77__.RoleDialog),
/* harmony export */   "RoleDirectory": () => (/* reexport safe */ _RoleDirectory__WEBPACK_IMPORTED_MODULE_78__.RoleDirectory),
/* harmony export */   "RoleDocument": () => (/* reexport safe */ _RoleDocument__WEBPACK_IMPORTED_MODULE_79__.RoleDocument),
/* harmony export */   "RoleFeed": () => (/* reexport safe */ _RoleFeed__WEBPACK_IMPORTED_MODULE_80__.RoleFeed),
/* harmony export */   "RoleFigure": () => (/* reexport safe */ _RoleFigure__WEBPACK_IMPORTED_MODULE_81__.RoleFigure),
/* harmony export */   "RoleForm": () => (/* reexport safe */ _RoleForm__WEBPACK_IMPORTED_MODULE_82__.RoleForm),
/* harmony export */   "RoleGrid": () => (/* reexport safe */ _RoleGrid__WEBPACK_IMPORTED_MODULE_83__.RoleGrid),
/* harmony export */   "RoleGridCell": () => (/* reexport safe */ _RoleGridCell__WEBPACK_IMPORTED_MODULE_84__.RoleGridCell),
/* harmony export */   "RoleGroup": () => (/* reexport safe */ _RoleGroup__WEBPACK_IMPORTED_MODULE_85__.RoleGroup),
/* harmony export */   "RoleHeading": () => (/* reexport safe */ _RoleHeading__WEBPACK_IMPORTED_MODULE_86__.RoleHeading),
/* harmony export */   "RoleImg": () => (/* reexport safe */ _RoleImg__WEBPACK_IMPORTED_MODULE_87__.RoleImg),
/* harmony export */   "RoleInput": () => (/* reexport safe */ _RoleInput__WEBPACK_IMPORTED_MODULE_88__.RoleInput),
/* harmony export */   "RoleLandmark": () => (/* reexport safe */ _RoleLandmark__WEBPACK_IMPORTED_MODULE_89__.RoleLandmark),
/* harmony export */   "RoleLink": () => (/* reexport safe */ _RoleLink__WEBPACK_IMPORTED_MODULE_90__.RoleLink),
/* harmony export */   "RoleList": () => (/* reexport safe */ _RoleList__WEBPACK_IMPORTED_MODULE_91__.RoleList),
/* harmony export */   "RoleListBox": () => (/* reexport safe */ _RoleListBox__WEBPACK_IMPORTED_MODULE_92__.RoleListBox),
/* harmony export */   "RoleListItem": () => (/* reexport safe */ _RoleListItem__WEBPACK_IMPORTED_MODULE_93__.RoleListItem),
/* harmony export */   "RoleLog": () => (/* reexport safe */ _RoleLog__WEBPACK_IMPORTED_MODULE_94__.RoleLog),
/* harmony export */   "RoleMain": () => (/* reexport safe */ _RoleMain__WEBPACK_IMPORTED_MODULE_95__.RoleMain),
/* harmony export */   "RoleMarquee": () => (/* reexport safe */ _RoleMarquee__WEBPACK_IMPORTED_MODULE_96__.RoleMarquee),
/* harmony export */   "RoleMath": () => (/* reexport safe */ _RoleMath__WEBPACK_IMPORTED_MODULE_97__.RoleMath),
/* harmony export */   "RoleMenu": () => (/* reexport safe */ _RoleMenu__WEBPACK_IMPORTED_MODULE_98__.RoleMenu),
/* harmony export */   "RoleMenuBar": () => (/* reexport safe */ _RoleMenuBar__WEBPACK_IMPORTED_MODULE_99__.RoleMenuBar),
/* harmony export */   "RoleMenuItem": () => (/* reexport safe */ _RoleMenuItem__WEBPACK_IMPORTED_MODULE_100__.RoleMenuItem),
/* harmony export */   "RoleMenuItemCheckBox": () => (/* reexport safe */ _RoleMenuItemCheckBox__WEBPACK_IMPORTED_MODULE_101__.RoleMenuItemCheckBox),
/* harmony export */   "RoleMenuItemRadio": () => (/* reexport safe */ _RoleMenuItemRadio__WEBPACK_IMPORTED_MODULE_102__.RoleMenuItemRadio),
/* harmony export */   "RoleNavigation": () => (/* reexport safe */ _RoleNavigation__WEBPACK_IMPORTED_MODULE_103__.RoleNavigation),
/* harmony export */   "RoleNone": () => (/* reexport safe */ _RoleNone__WEBPACK_IMPORTED_MODULE_104__.RoleNone),
/* harmony export */   "RoleNote": () => (/* reexport safe */ _RoleNote__WEBPACK_IMPORTED_MODULE_105__.RoleNote),
/* harmony export */   "RoleOption": () => (/* reexport safe */ _RoleOption__WEBPACK_IMPORTED_MODULE_106__.RoleOption),
/* harmony export */   "RoleParagraph": () => (/* reexport safe */ _RoleParagraph__WEBPACK_IMPORTED_MODULE_107__.RoleParagraph),
/* harmony export */   "RolePresentation": () => (/* reexport safe */ _RolePresentation__WEBPACK_IMPORTED_MODULE_108__.RolePresentation),
/* harmony export */   "RoleProgressBar": () => (/* reexport safe */ _RoleProgressBar__WEBPACK_IMPORTED_MODULE_109__.RoleProgressBar),
/* harmony export */   "RoleRadio": () => (/* reexport safe */ _RoleRadio__WEBPACK_IMPORTED_MODULE_110__.RoleRadio),
/* harmony export */   "RoleRadioGroup": () => (/* reexport safe */ _RoleRadioGroup__WEBPACK_IMPORTED_MODULE_111__.RoleRadioGroup),
/* harmony export */   "RoleRange": () => (/* reexport safe */ _RoleRange__WEBPACK_IMPORTED_MODULE_112__.RoleRange),
/* harmony export */   "RoleRegion": () => (/* reexport safe */ _RoleRegion__WEBPACK_IMPORTED_MODULE_113__.RoleRegion),
/* harmony export */   "RoleRoleType": () => (/* reexport safe */ _RoleRoleType__WEBPACK_IMPORTED_MODULE_114__.RoleRoleType),
/* harmony export */   "RoleRow": () => (/* reexport safe */ _RoleRow__WEBPACK_IMPORTED_MODULE_115__.RoleRow),
/* harmony export */   "RoleRowGroup": () => (/* reexport safe */ _RoleRowGroup__WEBPACK_IMPORTED_MODULE_116__.RoleRowGroup),
/* harmony export */   "RoleRowHeader": () => (/* reexport safe */ _RoleRowHeader__WEBPACK_IMPORTED_MODULE_117__.RoleRowHeader),
/* harmony export */   "RoleScrollBar": () => (/* reexport safe */ _RoleScrollBar__WEBPACK_IMPORTED_MODULE_118__.RoleScrollBar),
/* harmony export */   "RoleSearch": () => (/* reexport safe */ _RoleSearch__WEBPACK_IMPORTED_MODULE_119__.RoleSearch),
/* harmony export */   "RoleSearchBox": () => (/* reexport safe */ _RoleSearchBox__WEBPACK_IMPORTED_MODULE_120__.RoleSearchBox),
/* harmony export */   "RoleSection": () => (/* reexport safe */ _RoleSection__WEBPACK_IMPORTED_MODULE_121__.RoleSection),
/* harmony export */   "RoleSectionHead": () => (/* reexport safe */ _RoleSectionHead__WEBPACK_IMPORTED_MODULE_122__.RoleSectionHead),
/* harmony export */   "RoleSelect": () => (/* reexport safe */ _RoleSelect__WEBPACK_IMPORTED_MODULE_123__.RoleSelect),
/* harmony export */   "RoleSeparator": () => (/* reexport safe */ _RoleSeparator__WEBPACK_IMPORTED_MODULE_124__.RoleSeparator),
/* harmony export */   "RoleSlider": () => (/* reexport safe */ _RoleSlider__WEBPACK_IMPORTED_MODULE_125__.RoleSlider),
/* harmony export */   "RoleSpinButton": () => (/* reexport safe */ _RoleSpinButton__WEBPACK_IMPORTED_MODULE_126__.RoleSpinButton),
/* harmony export */   "RoleStatus": () => (/* reexport safe */ _RoleStatus__WEBPACK_IMPORTED_MODULE_127__.RoleStatus),
/* harmony export */   "RoleStructure": () => (/* reexport safe */ _RoleStructure__WEBPACK_IMPORTED_MODULE_128__.RoleStructure),
/* harmony export */   "RoleSwitch": () => (/* reexport safe */ _RoleSwitch__WEBPACK_IMPORTED_MODULE_129__.RoleSwitch),
/* harmony export */   "RoleTab": () => (/* reexport safe */ _RoleTab__WEBPACK_IMPORTED_MODULE_130__.RoleTab),
/* harmony export */   "RoleTabList": () => (/* reexport safe */ _RoleTabList__WEBPACK_IMPORTED_MODULE_131__.RoleTabList),
/* harmony export */   "RoleTabPanel": () => (/* reexport safe */ _RoleTabPanel__WEBPACK_IMPORTED_MODULE_132__.RoleTabPanel),
/* harmony export */   "RoleTable": () => (/* reexport safe */ _RoleTable__WEBPACK_IMPORTED_MODULE_133__.RoleTable),
/* harmony export */   "RoleTerm": () => (/* reexport safe */ _RoleTerm__WEBPACK_IMPORTED_MODULE_134__.RoleTerm),
/* harmony export */   "RoleTextBox": () => (/* reexport safe */ _RoleTextBox__WEBPACK_IMPORTED_MODULE_135__.RoleTextBox),
/* harmony export */   "RoleTimer": () => (/* reexport safe */ _RoleTimer__WEBPACK_IMPORTED_MODULE_136__.RoleTimer),
/* harmony export */   "RoleToolBar": () => (/* reexport safe */ _RoleToolBar__WEBPACK_IMPORTED_MODULE_137__.RoleToolBar),
/* harmony export */   "RoleToolTip": () => (/* reexport safe */ _RoleToolTip__WEBPACK_IMPORTED_MODULE_138__.RoleToolTip),
/* harmony export */   "RoleTree": () => (/* reexport safe */ _RoleTree__WEBPACK_IMPORTED_MODULE_139__.RoleTree),
/* harmony export */   "RoleTreeGrid": () => (/* reexport safe */ _RoleTreeGrid__WEBPACK_IMPORTED_MODULE_140__.RoleTreeGrid),
/* harmony export */   "RoleTreeItem": () => (/* reexport safe */ _RoleTreeItem__WEBPACK_IMPORTED_MODULE_141__.RoleTreeItem),
/* harmony export */   "RoleWidget": () => (/* reexport safe */ _RoleWidget__WEBPACK_IMPORTED_MODULE_142__.RoleWidget),
/* harmony export */   "RoleWindow": () => (/* reexport safe */ _RoleWindow__WEBPACK_IMPORTED_MODULE_143__.RoleWindow)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(41);
/* harmony import */ var _AriaAtomic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(12);
/* harmony import */ var _AriaAutoComplete__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(42);
/* harmony import */ var _AriaBusy__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(15);
/* harmony import */ var _AriaChecked__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(43);
/* harmony import */ var _AriaColCount__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(45);
/* harmony import */ var _AriaColIndex__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(47);
/* harmony import */ var _AriaColSpan__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(48);
/* harmony import */ var _AriaControls__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(16);
/* harmony import */ var _AriaCurrent__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(18);
/* harmony import */ var _AriaDescribedBy__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(20);
/* harmony import */ var _AriaDetails__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(21);
/* harmony import */ var _AriaDisabled__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(36);
/* harmony import */ var _AriaDropEffect__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(49);
/* harmony import */ var _AriaErrorMessage__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(50);
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(51);
/* harmony import */ var _AriaFlowTo__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(23);
/* harmony import */ var _AriaGrabbed__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(53);
/* harmony import */ var _AriaHasPopup__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(54);
/* harmony import */ var _AriaHidden__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(55);
/* harmony import */ var _AriaInvalid__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(56);
/* harmony import */ var _AriaKeyShortcuts__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(24);
/* harmony import */ var _AriaLabel__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(26);
/* harmony import */ var _AriaLabelledBy__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(27);
/* harmony import */ var _AriaLevel__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(57);
/* harmony import */ var _AriaLive__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(28);
/* harmony import */ var _AriaModal__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(58);
/* harmony import */ var _AriaMultiLine__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(59);
/* harmony import */ var _AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(60);
/* harmony import */ var _AriaOrientation__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(61);
/* harmony import */ var _AriaOwns__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(29);
/* harmony import */ var _AriaPlaceholder__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(62);
/* harmony import */ var _AriaPosInSet__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(63);
/* harmony import */ var _AriaPressed__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(64);
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(65);
/* harmony import */ var _AriaRelevant__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(30);
/* harmony import */ var _AriaRequired__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(66);
/* harmony import */ var _AriaRoleDescription__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(32);
/* harmony import */ var _AriaRowCount__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(67);
/* harmony import */ var _AriaRowIndex__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(68);
/* harmony import */ var _AriaRowSpan__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(69);
/* harmony import */ var _AriaSelected__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(70);
/* harmony import */ var _AriaSetSize__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(71);
/* harmony import */ var _AriaSort__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(72);
/* harmony import */ var _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(52);
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(13);
/* harmony import */ var _AriaTypeIdRef__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(22);
/* harmony import */ var _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(17);
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(46);
/* harmony import */ var _AriaTypeNumber__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(73);
/* harmony import */ var _AriaTypeString__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(25);
/* harmony import */ var _AriaTypeToken__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(19);
/* harmony import */ var _AriaTypeTokenList__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__(31);
/* harmony import */ var _AriaTypeTristate__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__(44);
/* harmony import */ var _AriaValueMax__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__(74);
/* harmony import */ var _AriaValueMin__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__(75);
/* harmony import */ var _AriaValueNow__WEBPACK_IMPORTED_MODULE_57__ = __webpack_require__(76);
/* harmony import */ var _AriaValueText__WEBPACK_IMPORTED_MODULE_58__ = __webpack_require__(77);
/* harmony import */ var _Role__WEBPACK_IMPORTED_MODULE_59__ = __webpack_require__(78);
/* harmony import */ var _RoleAlert__WEBPACK_IMPORTED_MODULE_60__ = __webpack_require__(79);
/* harmony import */ var _RoleAlertDialog__WEBPACK_IMPORTED_MODULE_61__ = __webpack_require__(83);
/* harmony import */ var _RoleApplication__WEBPACK_IMPORTED_MODULE_62__ = __webpack_require__(86);
/* harmony import */ var _RoleArticle__WEBPACK_IMPORTED_MODULE_63__ = __webpack_require__(89);
/* harmony import */ var _RoleBanner__WEBPACK_IMPORTED_MODULE_64__ = __webpack_require__(87);
/* harmony import */ var _RoleBlockQuote__WEBPACK_IMPORTED_MODULE_65__ = __webpack_require__(93);
/* harmony import */ var _RoleButton__WEBPACK_IMPORTED_MODULE_66__ = __webpack_require__(94);
/* harmony import */ var _RoleCaption__WEBPACK_IMPORTED_MODULE_67__ = __webpack_require__(98);
/* harmony import */ var _RoleCell__WEBPACK_IMPORTED_MODULE_68__ = __webpack_require__(99);
/* harmony import */ var _RoleCheckBox__WEBPACK_IMPORTED_MODULE_69__ = __webpack_require__(100);
/* harmony import */ var _RoleColumnHeader__WEBPACK_IMPORTED_MODULE_70__ = __webpack_require__(102);
/* harmony import */ var _RoleComboBox__WEBPACK_IMPORTED_MODULE_71__ = __webpack_require__(103);
/* harmony import */ var _RoleCommand__WEBPACK_IMPORTED_MODULE_72__ = __webpack_require__(95);
/* harmony import */ var _RoleComplementary__WEBPACK_IMPORTED_MODULE_73__ = __webpack_require__(105);
/* harmony import */ var _RoleComposite__WEBPACK_IMPORTED_MODULE_74__ = __webpack_require__(106);
/* harmony import */ var _RoleContentInfo__WEBPACK_IMPORTED_MODULE_75__ = __webpack_require__(91);
/* harmony import */ var _RoleDefinition__WEBPACK_IMPORTED_MODULE_76__ = __webpack_require__(107);
/* harmony import */ var _RoleDialog__WEBPACK_IMPORTED_MODULE_77__ = __webpack_require__(84);
/* harmony import */ var _RoleDirectory__WEBPACK_IMPORTED_MODULE_78__ = __webpack_require__(108);
/* harmony import */ var _RoleDocument__WEBPACK_IMPORTED_MODULE_79__ = __webpack_require__(90);
/* harmony import */ var _RoleFeed__WEBPACK_IMPORTED_MODULE_80__ = __webpack_require__(111);
/* harmony import */ var _RoleFigure__WEBPACK_IMPORTED_MODULE_81__ = __webpack_require__(112);
/* harmony import */ var _RoleForm__WEBPACK_IMPORTED_MODULE_82__ = __webpack_require__(97);
/* harmony import */ var _RoleGrid__WEBPACK_IMPORTED_MODULE_83__ = __webpack_require__(113);
/* harmony import */ var _RoleGridCell__WEBPACK_IMPORTED_MODULE_84__ = __webpack_require__(114);
/* harmony import */ var _RoleGroup__WEBPACK_IMPORTED_MODULE_85__ = __webpack_require__(116);
/* harmony import */ var _RoleHeading__WEBPACK_IMPORTED_MODULE_86__ = __webpack_require__(120);
/* harmony import */ var _RoleImg__WEBPACK_IMPORTED_MODULE_87__ = __webpack_require__(122);
/* harmony import */ var _RoleInput__WEBPACK_IMPORTED_MODULE_88__ = __webpack_require__(101);
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_89__ = __webpack_require__(88);
/* harmony import */ var _RoleLink__WEBPACK_IMPORTED_MODULE_90__ = __webpack_require__(123);
/* harmony import */ var _RoleList__WEBPACK_IMPORTED_MODULE_91__ = __webpack_require__(109);
/* harmony import */ var _RoleListBox__WEBPACK_IMPORTED_MODULE_92__ = __webpack_require__(124);
/* harmony import */ var _RoleListItem__WEBPACK_IMPORTED_MODULE_93__ = __webpack_require__(110);
/* harmony import */ var _RoleLog__WEBPACK_IMPORTED_MODULE_94__ = __webpack_require__(127);
/* harmony import */ var _RoleMain__WEBPACK_IMPORTED_MODULE_95__ = __webpack_require__(92);
/* harmony import */ var _RoleMarquee__WEBPACK_IMPORTED_MODULE_96__ = __webpack_require__(128);
/* harmony import */ var _RoleMath__WEBPACK_IMPORTED_MODULE_97__ = __webpack_require__(129);
/* harmony import */ var _RoleMenu__WEBPACK_IMPORTED_MODULE_98__ = __webpack_require__(130);
/* harmony import */ var _RoleMenuBar__WEBPACK_IMPORTED_MODULE_99__ = __webpack_require__(132);
/* harmony import */ var _RoleMenuItem__WEBPACK_IMPORTED_MODULE_100__ = __webpack_require__(131);
/* harmony import */ var _RoleMenuItemCheckBox__WEBPACK_IMPORTED_MODULE_101__ = __webpack_require__(133);
/* harmony import */ var _RoleMenuItemRadio__WEBPACK_IMPORTED_MODULE_102__ = __webpack_require__(134);
/* harmony import */ var _RoleNavigation__WEBPACK_IMPORTED_MODULE_103__ = __webpack_require__(135);
/* harmony import */ var _RoleNone__WEBPACK_IMPORTED_MODULE_104__ = __webpack_require__(136);
/* harmony import */ var _RoleNote__WEBPACK_IMPORTED_MODULE_105__ = __webpack_require__(137);
/* harmony import */ var _RoleOption__WEBPACK_IMPORTED_MODULE_106__ = __webpack_require__(125);
/* harmony import */ var _RoleParagraph__WEBPACK_IMPORTED_MODULE_107__ = __webpack_require__(138);
/* harmony import */ var _RolePresentation__WEBPACK_IMPORTED_MODULE_108__ = __webpack_require__(139);
/* harmony import */ var _RoleProgressBar__WEBPACK_IMPORTED_MODULE_109__ = __webpack_require__(140);
/* harmony import */ var _RoleRadio__WEBPACK_IMPORTED_MODULE_110__ = __webpack_require__(142);
/* harmony import */ var _RoleRadioGroup__WEBPACK_IMPORTED_MODULE_111__ = __webpack_require__(143);
/* harmony import */ var _RoleRange__WEBPACK_IMPORTED_MODULE_112__ = __webpack_require__(141);
/* harmony import */ var _RoleRegion__WEBPACK_IMPORTED_MODULE_113__ = __webpack_require__(144);
/* harmony import */ var _RoleRoleType__WEBPACK_IMPORTED_MODULE_114__ = __webpack_require__(82);
/* harmony import */ var _RoleRow__WEBPACK_IMPORTED_MODULE_115__ = __webpack_require__(115);
/* harmony import */ var _RoleRowGroup__WEBPACK_IMPORTED_MODULE_116__ = __webpack_require__(118);
/* harmony import */ var _RoleRowHeader__WEBPACK_IMPORTED_MODULE_117__ = __webpack_require__(117);
/* harmony import */ var _RoleScrollBar__WEBPACK_IMPORTED_MODULE_118__ = __webpack_require__(145);
/* harmony import */ var _RoleSearch__WEBPACK_IMPORTED_MODULE_119__ = __webpack_require__(146);
/* harmony import */ var _RoleSearchBox__WEBPACK_IMPORTED_MODULE_120__ = __webpack_require__(147);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_121__ = __webpack_require__(80);
/* harmony import */ var _RoleSectionHead__WEBPACK_IMPORTED_MODULE_122__ = __webpack_require__(121);
/* harmony import */ var _RoleSelect__WEBPACK_IMPORTED_MODULE_123__ = __webpack_require__(126);
/* harmony import */ var _RoleSeparator__WEBPACK_IMPORTED_MODULE_124__ = __webpack_require__(148);
/* harmony import */ var _RoleSlider__WEBPACK_IMPORTED_MODULE_125__ = __webpack_require__(149);
/* harmony import */ var _RoleSpinButton__WEBPACK_IMPORTED_MODULE_126__ = __webpack_require__(150);
/* harmony import */ var _RoleStatus__WEBPACK_IMPORTED_MODULE_127__ = __webpack_require__(151);
/* harmony import */ var _RoleStructure__WEBPACK_IMPORTED_MODULE_128__ = __webpack_require__(81);
/* harmony import */ var _RoleSwitch__WEBPACK_IMPORTED_MODULE_129__ = __webpack_require__(152);
/* harmony import */ var _RoleTab__WEBPACK_IMPORTED_MODULE_130__ = __webpack_require__(153);
/* harmony import */ var _RoleTabList__WEBPACK_IMPORTED_MODULE_131__ = __webpack_require__(154);
/* harmony import */ var _RoleTabPanel__WEBPACK_IMPORTED_MODULE_132__ = __webpack_require__(155);
/* harmony import */ var _RoleTable__WEBPACK_IMPORTED_MODULE_133__ = __webpack_require__(119);
/* harmony import */ var _RoleTerm__WEBPACK_IMPORTED_MODULE_134__ = __webpack_require__(156);
/* harmony import */ var _RoleTextBox__WEBPACK_IMPORTED_MODULE_135__ = __webpack_require__(104);
/* harmony import */ var _RoleTimer__WEBPACK_IMPORTED_MODULE_136__ = __webpack_require__(157);
/* harmony import */ var _RoleToolBar__WEBPACK_IMPORTED_MODULE_137__ = __webpack_require__(158);
/* harmony import */ var _RoleToolTip__WEBPACK_IMPORTED_MODULE_138__ = __webpack_require__(159);
/* harmony import */ var _RoleTree__WEBPACK_IMPORTED_MODULE_139__ = __webpack_require__(160);
/* harmony import */ var _RoleTreeGrid__WEBPACK_IMPORTED_MODULE_140__ = __webpack_require__(162);
/* harmony import */ var _RoleTreeItem__WEBPACK_IMPORTED_MODULE_141__ = __webpack_require__(161);
/* harmony import */ var _RoleWidget__WEBPACK_IMPORTED_MODULE_142__ = __webpack_require__(96);
/* harmony import */ var _RoleWindow__WEBPACK_IMPORTED_MODULE_143__ = __webpack_require__(85);
/**
 * @module ariamodule
 * @author Vyacheslav Aristov <vv.aristov@gmail.com>
 * @license MIT
 * @see https://www.w3.org/TR/wai-aria
 */


















































































































































/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaActiveDescendant": () => (/* binding */ AriaActiveDescendant)
/* harmony export */ });
/* harmony import */ var _AriaTypeIdRef__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);


/**
 * Identifies the currently active element when DOM focus
 *  is on a composite widget, textbox, group, or application.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-activedescendant
 */
class AriaActiveDescendant extends _AriaTypeIdRef__WEBPACK_IMPORTED_MODULE_0__.AriaTypeIdRef
{
}


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaAutoComplete": () => (/* binding */ AriaAutoComplete)
/* harmony export */ });
/* harmony import */ var _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);


const TOKEN_NONE = 'none'

/**
 * Indicates whether inputting text could trigger display
 *  of one or more predictions of the user's intended value for an input
 *  and specifies how predictions would be presented if they are made.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-autocomplete
 */
class AriaAutoComplete extends _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__.AriaTypeToken
{
  /**
   * @param {DomElem} element
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(element, value) {
    return value === TOKEN_NONE?
      !this.remove(element) :
      super.removeOnValue(element, value)
  }
}


/***/ }),
/* 43 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaChecked": () => (/* binding */ AriaChecked)
/* harmony export */ });
/* harmony import */ var _AriaTypeTristate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);


/**
 * Indicates the current "checked" state of checkboxes,
 *  radio buttons, and other widgets.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-checked
 */
class AriaChecked extends _AriaTypeTristate__WEBPACK_IMPORTED_MODULE_0__.AriaTypeTristate
{
}


/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeTristate": () => (/* binding */ AriaTypeTristate)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


let undefined
const TOKEN_FALSE = 'false'
const TOKEN_MIXED = 'mixed'
const TOKEN_UNDEFINED = 'undefined'

/**
 * Value representing true or false, with an intermediate "mixed" value.
 *  The default value for this value type is false unless otherwise specified.
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_tristate
 * @abstract
 */
class AriaTypeTristate extends _AriaType__WEBPACK_IMPORTED_MODULE_0__.AriaType
{
  /**
   * value = true
   * value = 'true'
   * value = '*' // non empty string
   * value = 1
   * value = * // non zero number
   *      => 'true'
   *
   * value = false
   * value = 'false'
   * value = 0
   *      => 'false'
   *
   * value = 'mixed'
   *      => 'mixed'
   *
   * value = null
   * value = undefined
   * value = ''
   *      => no attr
   *
   * @param {DomElem} elem
   * @param {*} value {boolean|string}
   */
  static set(elem, value) {
    if(value === TOKEN_MIXED) {
      super.set(elem, TOKEN_MIXED)
    }
    else super.set(elem, String(Boolean(value) && value !== TOKEN_FALSE))
  }

  /**
   * value === 'true'
   * value === '0'
   * value === '*' // non empty string
   *      => true
   *
   * value === 'false'
   *      => false
   *
   * value === 'mixed'
   *      => 'mixed'
   *
   * value === 'undefined'
   * value === ''
   * no attr
   *      => undefined
   *
   * @param {DomElem} elem
   * @returns {boolean|string}
   */
  static get(elem) {
    const value = super.get(elem)
    if(value) {
      if(value === TOKEN_MIXED) {
        return TOKEN_MIXED
      }
      return value === TOKEN_UNDEFINED?
        undefined :
        Boolean(value) && value !== TOKEN_FALSE
    }
    return value
  }

  /**
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(elem, value) {
    return String(value) === TOKEN_UNDEFINED?
      !this.remove(elem) :
      super.removeOnValue(elem, value)
  }

  /**
   * @returns {undefined}
   */
  static get defaultValue() {
    return undefined
  }
}


/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaColCount": () => (/* binding */ AriaColCount)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);


/**
 * Defines the total number of columns in a table, grid, or treegrid.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-colcount
 */
class AriaColCount extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 46 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeInteger": () => (/* binding */ AriaTypeInteger)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * A numerical value without a fractional component.
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_integer
 * @abstract
 */
class AriaTypeInteger extends _AriaType__WEBPACK_IMPORTED_MODULE_0__.AriaType
{
  /**
   * value = .0
   * value = .0e-1
   * value = '.0'
   * value = '.0e-1'
   * value = []
   * value = [.0]
   * value = ['.0e-1']
   * value = false
   *      => '0'
   *
   * value = 1.1
   * value = 11e-1
   * value = '1.1'
   * value = '11e-1'
   * value = [1.1]
   * value = ['11e-1']
   * value = true
   *      => '1'
   *
   * value = 4.2
   * value = 42e-1
   * value = '4.2'
   * value = '42e-1'
   * value = [4.2]
   * value = ['4.2']
   *      => '4'
   *
   * value = NaN
   * value = 'NaN'
   * value = 'xyz' // non empty string
   * value = {}
   * value = [.0, 4.2, 1.1]
   * value = function() {}
   * value = undefined
   *      => 'NaN'
   *
   * value = Infinity
   * value = 'Infinity'
   *      => 'Infinity'
   *
   * value = null
   * value = ''
   *      => no attr
   *
   * @param {DomElem} elem
   * @param {number} value {number}
   */
  static set(elem, value) {
    super.set(elem, String(Math.floor(value)))
  }

  /**
   * value === '.0'
   * value === '.0e-1'
   *      => 0
   *
   * value === '1.1'
   * value === '11e-1'
   *      => 1
   *
   * value === '4.2'
   * value === '42e-1'
   *      => 4
   *
   * value === 'NaN'
   * value === 'true'
   * value === 'false'
   * value === 'undefined'
   * value === 'xyz' // non empty string
   *      => NaN
   *
   * value === 'Infinity'
   *      => Infinity
   *
   * value === ''
   * no attr
   *      => null
   *
   * @param {DomElem} elem
   * @returns {number}
   */
  static get(elem) {
    return Math.floor(Number(super.get(elem)))
  }

  /**
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   * @override
   */
  static removeOnValue(elem, value) {
    return isNaN(value)?
      !this.remove(elem) :
      super.removeOnValue(elem, value)
  }

  /**
   * @return {number}
   */
  static get defaultValue() {
    return NaN
  }
}


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaColIndex": () => (/* binding */ AriaColIndex)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);


/**
 * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-colindex
 */
class AriaColIndex extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 48 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaColSpan": () => (/* binding */ AriaColSpan)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);


/**
 * Defines the number of columns spanned by a cell
 *  or gridcell within a table, grid, or treegrid.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-colspan
 */
class AriaColSpan extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaDropEffect": () => (/* binding */ AriaDropEffect)
/* harmony export */ });
/* harmony import */ var _AriaTypeTokenList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31);


/**
 * [Deprecated in ARIA 1.1]
 *  Indicates what functions can be performed when a dragged object is released on the drop target.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-dropeffect
 * @deprecated
 */
class AriaDropEffect extends _AriaTypeTokenList__WEBPACK_IMPORTED_MODULE_0__.AriaTypeTokenList
{
}


/***/ }),
/* 50 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaErrorMessage": () => (/* binding */ AriaErrorMessage)
/* harmony export */ });
/* harmony import */ var _AriaTypeIdRef__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);


/**
 * Identifies the element that provides an error message for the object.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage
 */
class AriaErrorMessage extends _AriaTypeIdRef__WEBPACK_IMPORTED_MODULE_0__.AriaTypeIdRef
{
}


/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaExpanded": () => (/* binding */ AriaExpanded)
/* harmony export */ });
/* harmony import */ var _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(52);


/**
 * Indicates whether the element, or another grouping
 *  element it controls, is currently expanded or collapsed.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-expanded
 */
class AriaExpanded extends _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_0__.AriaTypeApplicable
{
}


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeApplicable": () => (/* binding */ AriaTypeApplicable)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


let undefined
const TOKEN_FALSE = 'false'
const TOKEN_UNDEFINED = 'undefined'

/**
 * Value representing true, false, or not applicable.
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_true-false-undefined
 * @abstract
 */
class AriaTypeApplicable extends _AriaType__WEBPACK_IMPORTED_MODULE_0__.AriaType
{
  /**
   * value = true
   * value = 'true'
   * value = '*' // non empty string
   *      => 'true'
   *
   * value = false
   * value = 'false'
   *      => 'false'
   *
   * value = undefined
   * value = 'undefined'
   * value = ''
   *      => no attr
   *
   * @param {DomElem} elem
   * @param {*} value {boolean|undefined|string}
   */
  static set(elem, value) {
    super.set(elem, String(Boolean(value) && value !== TOKEN_FALSE))
  }

  /**
   * value === 'true'
   * value === '*' // non empty string
   *      => true
   *
   * value === 'false'
   *      => false
   *
   * value === 'undefined'
   * value === ''
   * no attr
   *      => undefined
   *
   * @param {DomElem} elem
   * @returns {boolean|undefined}
   */
  static get(elem) {
    const value = super.get(elem)
    if(value) {
      return value === TOKEN_UNDEFINED?
        undefined :
        Boolean(value) && value !== TOKEN_FALSE
    }
    return value
  }

  /**
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(elem, value) {
    return String(value) === TOKEN_UNDEFINED?
      !this.remove(elem) :
      super.removeOnValue(elem, value)
  }

  /**
   * @returns {undefined}
   */
  static get defaultValue() {
    return undefined
  }
}


/***/ }),
/* 53 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaGrabbed": () => (/* binding */ AriaGrabbed)
/* harmony export */ });
/* harmony import */ var _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(52);


/**
 * Indicates an element's "grabbed" state in a drag-and-drop operation.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-grabbed
 * @deprecated in ARIA 1.1
 */
class AriaGrabbed extends _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_0__.AriaTypeApplicable
{
}


/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaHasPopup": () => (/* binding */ AriaHasPopup)
/* harmony export */ });
/* harmony import */ var _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);


const TOKEN_TRUE = 'true'
const TOKEN_FALSE = 'false'

/**
 * Indicates the availability and type of interactive popup element,
 *  such as menu or dialog, that can be triggered by an element.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-haspopup
 */
class AriaHasPopup extends _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__.AriaTypeToken
{
  /**
   * @param {DomElem} elem
   * @param {*} value {boolean|string}
   */
  static set(elem, value) {
    super.set(elem, String(value))
  }

  /**
   * @param {DomElem} elem
   * @returns {boolean|string}
   */
  static get(elem) {
    const value = elem.node.getAttribute(this.localName)
    return !value || value === TOKEN_FALSE?
      false :
      value === TOKEN_TRUE || value
  }

  /**
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(elem, value) {
    return String(value) === TOKEN_FALSE?
      !this.remove(elem) :
      super.removeOnValue(elem, value)
  }

  /**
   * @returns {boolean}
   */
  static get defaultValue() {
    return false
  }
}


/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaHidden": () => (/* binding */ AriaHidden)
/* harmony export */ });
/* harmony import */ var _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(52);


/**
 * Indicates whether the element is exposed to an accessibility API.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-hidden
 */
class AriaHidden extends _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_0__.AriaTypeApplicable
{
}


/***/ }),
/* 56 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaInvalid": () => (/* binding */ AriaInvalid)
/* harmony export */ });
/* harmony import */ var _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);


const TOKEN_TRUE = 'true'
const TOKEN_FALSE = 'false'

/**
 * Indicates the entered value does not conform to the format expected by the application.
 *
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-invalid
 */
class AriaInvalid extends _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__.AriaTypeToken
{
  /**
   * @param {DomElem} elem
   * @param {*} value {boolean|string}
   */
  static set(elem, value) {
    super.set(elem, String(value))
  }

  /**
   * @param {DomElem} elem
   * @returns {boolean|string}
   */
  static get(elem) {
    const value = elem.node.getAttribute(this.localName)
    return !value || value === TOKEN_FALSE?
      false :
      value === TOKEN_TRUE || value
  }

  /**
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(elem, value) {
    return String(value) === TOKEN_FALSE?
      !this.remove(elem) :
      super.removeOnValue(elem, value)
  }

  /**
   * @returns {boolean}
   */
  static get defaultValue() {
    return false
  }
}


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaLevel": () => (/* binding */ AriaLevel)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);


/**
 * Defines the hierarchical level of an element within a structure.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-level
 */
class AriaLevel extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 58 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaModal": () => (/* binding */ AriaModal)
/* harmony export */ });
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);


/**
 * Indicates whether an element is modal when displayed.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-modal
 */
class AriaModal extends _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__.AriaTypeBoolean
{
}


/***/ }),
/* 59 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaMultiLine": () => (/* binding */ AriaMultiLine)
/* harmony export */ });
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);


/**
 * Indicates whether a text box accepts multiple lines of input or only a single line.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-multiline
 */
class AriaMultiLine extends _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__.AriaTypeBoolean
{
}


/***/ }),
/* 60 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaMultiSelectable": () => (/* binding */ AriaMultiSelectable)
/* harmony export */ });
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);


/**
 * Indicates that the user may select more than one item
 *  from the current selectable descendants.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-multiselectable
 */
class AriaMultiSelectable extends _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__.AriaTypeBoolean
{
}


/***/ }),
/* 61 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaOrientation": () => (/* binding */ AriaOrientation)
/* harmony export */ });
/* harmony import */ var _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);


/**
 * Indicates whether the element's orientation
 *  is horizontal, vertical, or unknown/ambiguous.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-orientation
 */
class AriaOrientation extends _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__.AriaTypeToken
{
}


/***/ }),
/* 62 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaPlaceholder": () => (/* binding */ AriaPlaceholder)
/* harmony export */ });
/* harmony import */ var _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(25);


/**
 * Defines a short hint (a word or short phrase) intended
 *  to aid the user with data entry when the control has no value.
 *  A hint could be a sample value or a brief description of the expected format.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-placeholder
 */
class AriaPlaceholder extends _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__.AriaTypeString
{
}


/***/ }),
/* 63 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaPosInSet": () => (/* binding */ AriaPosInSet)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);


/**
 * Defines an element's number or position in the current set of listitems
 *  or treeitems. Not required if all elements in the set are present in the DOM.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-posinset
 */
class AriaPosInSet extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaPressed": () => (/* binding */ AriaPressed)
/* harmony export */ });
/* harmony import */ var _AriaTypeTristate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);


/**
 * Indicates the current "pressed" state of toggle buttons.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-pressed
 */
class AriaPressed extends _AriaTypeTristate__WEBPACK_IMPORTED_MODULE_0__.AriaTypeTristate
{
}


/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaReadOnly": () => (/* binding */ AriaReadOnly)
/* harmony export */ });
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);


/**
 * Indicates that the element is not editable, but is otherwise operable.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-readonly
 */
class AriaReadOnly extends _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__.AriaTypeBoolean
{
}


/***/ }),
/* 66 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaRequired": () => (/* binding */ AriaRequired)
/* harmony export */ });
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(13);


/**
 * Indicates that user input is required on the element before a form may be submitted.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-required
 */
class AriaRequired extends _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__.AriaTypeBoolean
{
}


/***/ }),
/* 67 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaRowCount": () => (/* binding */ AriaRowCount)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);


/**
 * Defines the total number of rows in a table, grid, or treegrid.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-rowcount
 */
class AriaRowCount extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaRowIndex": () => (/* binding */ AriaRowIndex)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);


/**
 * Defines an element's row index or position with respect
 *  to the total number of rows within a table, grid, or treegrid.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-rowindex
 */
class AriaRowIndex extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 69 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaRowSpan": () => (/* binding */ AriaRowSpan)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);


/**
 * Defines the number of rows spanned by a cell
 *  or gridcell within a table, grid, or treegrid.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-rowspan
 */
class AriaRowSpan extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 70 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaSelected": () => (/* binding */ AriaSelected)
/* harmony export */ });
/* harmony import */ var _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(52);


/**
 * Indicates the current "selected" state of various widgets.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-selected
 */
class AriaSelected extends _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_0__.AriaTypeApplicable
{
}


/***/ }),
/* 71 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaSetSize": () => (/* binding */ AriaSetSize)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);


/**
 * Defines the number of items in the current set of listitems or treeitems.
 *  Not required if all elements in the set are present in the DOM.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-setsize
 */
class AriaSetSize extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 72 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaSort": () => (/* binding */ AriaSort)
/* harmony export */ });
/* harmony import */ var _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(19);


const TOKEN_NONE = 'none'

/**
 * Indicates if items in a table or grid are sorted in ascending or descending order.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-sort
 */
class AriaSort extends _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__.AriaTypeToken
{
  /**
   * @param {DomElem} element
   * @param {*} value
   * @returns {boolean}
   */
  static removeOnValue(element, value) {
    return value === TOKEN_NONE?
      !this.remove(element) :
      super.removeOnValue(element, value)
  }
}


/***/ }),
/* 73 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeNumber": () => (/* binding */ AriaTypeNumber)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * Any real numerical value.
 * @see https://www.w3.org/TR/wai-aria-1.1/#valuetype_number
 * @abstract
 */
class AriaTypeNumber extends _AriaType__WEBPACK_IMPORTED_MODULE_0__.AriaType
{
  /**
   * value = .0
   * value = .0e-1
   * value = '.0'
   * value = '.0e-1'
   * value = []
   * value = [.0]
   * value = ['.0e-1']
   * value = false
   *      => '0'
   *
   * value = 1
   * value = .1e1
   * value = '1'
   * value = '.1e1'
   * value = [1]
   * value = ['.1e1']
   * value = true
   *      => '1'
   *
   * value = 4.2
   * value = 42e-1
   * value = '4.2'
   * value = '42e-1'
   * value = [4.2]
   * value = ['4.2']
   *      => '4.2'
   *
   * value = NaN
   * value = 'NaN'
   * value = 'xyz' // non empty string
   * value = {}
   * value = [.0, 4.2, 1]
   * value = function() {}
   * value = undefined
   *      => 'NaN'
   *
   * value = Infinity
   * value = 'Infinity'
   *      => 'Infinity'
   *
   * value = ''
   * value = null
   *      => no attr
   *
   * @param {DomElem} elem
   * @param {*} value {number}
   */
  static set(elem, value) {
    super.set(elem, String(Number(value)))
  }

  /**
   * value === '.0'
   * value === '.0e-1'
   *      => 0
   *
   * value === '1'
   * value === '.1e1'
   *      => 1
   *
   * value === '4.2'
   * value === '42e-1'
   *      => 4.2
   *
   * value === 'NaN'
   * value === 'xyz' // non empty string
   *      => NaN
   *
   * value === 'Infinity'
   *      => Infinity
   *
   * value === ''
   * no attr
   *      => null
   *
   * @param {DomElem} elem
   * @returns {number}
   */
  static get(elem) {
    return Number(super.get(elem))
  }

  /**
   * @param {DomElem} elem
   * @param {*} value
   * @returns {boolean}
   * @override
   */
  static removeOnValue(elem, value) {
    return isNaN(value)?
      !this.remove(elem) :
      super.removeOnValue(elem, value)
  }

  /**
   * @return {number}
   */
  static get defaultValue() {
    return NaN
  }
}


/***/ }),
/* 74 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaValueMax": () => (/* binding */ AriaValueMax)
/* harmony export */ });
/* harmony import */ var _AriaTypeNumber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(73);


/**
 * Defines the maximum allowed value for a range widget.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-valuemax
 */
class AriaValueMax extends _AriaTypeNumber__WEBPACK_IMPORTED_MODULE_0__.AriaTypeNumber
{
}


/***/ }),
/* 75 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaValueMin": () => (/* binding */ AriaValueMin)
/* harmony export */ });
/* harmony import */ var _AriaTypeNumber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(73);


/**
 * Defines the minimum allowed value for a range widget.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-valuemin
 */
class AriaValueMin extends _AriaTypeNumber__WEBPACK_IMPORTED_MODULE_0__.AriaTypeNumber
{
}


/***/ }),
/* 76 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaValueNow": () => (/* binding */ AriaValueNow)
/* harmony export */ });
/* harmony import */ var _AriaTypeNumber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(73);


/**
 * Defines the current value for a range widget.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-valuenow
 */
class AriaValueNow extends _AriaTypeNumber__WEBPACK_IMPORTED_MODULE_0__.AriaTypeNumber
{
}


/***/ }),
/* 77 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaValueText": () => (/* binding */ AriaValueText)
/* harmony export */ });
/* harmony import */ var _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(25);


/**
 * Defines the human readable text alternative of aria-valuenow for a range widget.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext
 */
class AriaValueText extends _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__.AriaTypeString
{
}


/***/ }),
/* 78 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Role": () => (/* binding */ Role)
/* harmony export */ });
/* harmony import */ var _Dataset__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(33);
/* harmony import */ var _DomElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _Style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(34);
/* harmony import */ var _TabIndex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(35);





/**
 * @see https://www.w3.org/TR/wai-aria-1.1/#host_general_role
 * @see https://www.w3.org/TR/html/dom.html#aria-role-attribute
 * @see https://www.w3.org/TR/role-attribute
 * @abstract
 */
class Role extends _DomElem__WEBPACK_IMPORTED_MODULE_1__.DomElem
{
  /**
   * @param {{}} init
   * @override
   */
  create(init) {
    if(this.constructor.abstract) {
      throw TypeError(`Could not create an abstract ${ this.constructor.name } instance`)
    }
    super.create(init)
    this.setAttr('role', this.constructor.roleList.join(' '))
  }

  /**
   * Blur the owner element
   */
  blur() {
    this.node.blur()
  }

  /**
   * Click the owner element
   */
  click() {
    this.node.click()
  }

  /**
   * Focus the owner element
   */
  focus() {
    this.node.focus()
  }

  /**
   * @param {boolean} autofocus
   */
  set autofocus(autofocus) {
    this.node.autofocus = autofocus
  }

  /**
   * @returns {boolean}
   */
  get autofocus() {
    return this.node.autofocus
  }

  /**
   * @param {{}} dataset
   */
  set dataset(dataset) {
    this.setAttr(_Dataset__WEBPACK_IMPORTED_MODULE_0__.Dataset, dataset)
  }

  /**
   * @returns {DOMStringMap}
   */
  get dataset() {
    return this.getAttr(_Dataset__WEBPACK_IMPORTED_MODULE_0__.Dataset)
  }

  /**
   * @param {*} style {string|{}}
   */
  set style(style) {
    this.setAttr(_Style__WEBPACK_IMPORTED_MODULE_2__.Style, style)
  }

  /**
   * @returns {CSSStyleDeclaration}
   */
  get style() {
    return this.getAttr(_Style__WEBPACK_IMPORTED_MODULE_2__.Style)
  }

  /**
   * @param {number|null} tabIndex
   */
  set tabIndex(tabIndex) {
    this.setAttr(_TabIndex__WEBPACK_IMPORTED_MODULE_3__.TabIndex, tabIndex)
  }

  /**
   * @returns {number|null}
   */
  get tabIndex() {
    return this.getAttr(_TabIndex__WEBPACK_IMPORTED_MODULE_3__.TabIndex)
  }

  /**
   * @returns {string[]}
   */
  static get classList() {
    const list = []
    let object = this, token
    do if(object.abstract === false) {
      token = object.classToken
      list.includes(token) || list.push(token)
    }
    while((object = Object.getPrototypeOf(object)) && 'classToken' in object)
    return list
  }

  /**
   * @returns {string}
   */
  static get classToken() {
    return this.role
  }

  /**
   * @returns {string}
   * @override
   */
  static get localName() {
    return 'div'
  }

  /**
   * @returns {string}
   */
  static get role() {
    return this.name.replace(/^Role/, '')
  }

  /**
   * @returns {string[]}
   */
  static get roleList() {
    const list = []
    let object = this
    do if(object.abstract === false) {
      const role = object.role
      list.includes(role) || list.push(role)
    }
    while((object = Object.getPrototypeOf(object)) && 'role' in object)
    return list
  }

  /**
   * @returns {string}
   * @override
   */
  static get selector() {
    return this.abstract? '[role]' : `[role~=${ this.role }]`
  }
}

/**
 * @see https://www.w3.org/TR/wai-aria-1.1/#isAbstract
 * @abstract
 */
Role.abstract = true

Role.defineGetters([
  'offsetLeft',
  'offsetTop',
  'offsetWidth',
  'offsetHeight'
])


/***/ }),
/* 79 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleAlert": () => (/* binding */ RoleAlert)
/* harmony export */ });
/* harmony import */ var _AriaAtomic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _AriaLive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(80);




/**
 * A type of live region with important, and usually time-sensitive, information.
 * @see https://www.w3.org/TR/wai-aria-1.1/#alert
 */
class RoleAlert extends _RoleSection__WEBPACK_IMPORTED_MODULE_2__.RoleSection
{
  /**
   * @param {string} live
   */
  set live(live) {
    super.live = live
  }

  /**
   * @returns {string}
   */
  get live() {
    return this.hasAttr(_AriaLive__WEBPACK_IMPORTED_MODULE_1__.AriaLive)? super.live : 'assertive'
  }

  /**
   * @param {boolean} atomic
   */
  set atomic(atomic) {
    super.atomic = atomic
  }

  /**
   * @returns {boolean}
   */
  get atomic() {
    return this.hasAttr(_AriaAtomic__WEBPACK_IMPORTED_MODULE_0__.AriaAtomic)? super.atomic : true
  }
}

RoleAlert.abstract = false


/***/ }),
/* 80 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSection": () => (/* binding */ RoleSection)
/* harmony export */ });
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(51);
/* harmony import */ var _RoleStructure__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(81);



/**
 * A renderable structural containment unit in a document or application.
 * @see https://www.w3.org/TR/wai-aria-1.1/#section
 * @abstract
 */
class RoleSection extends _RoleStructure__WEBPACK_IMPORTED_MODULE_1__.RoleStructure
{
  /**
   * @param {boolean|undefined} expanded
   */
  set expanded(expanded) {
    this.setAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded, expanded)
  }

  /**
   * @returns {boolean|undefined}
   */
  get expanded() {
    return this.getAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded)
  }
}


/***/ }),
/* 81 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleStructure": () => (/* binding */ RoleStructure)
/* harmony export */ });
/* harmony import */ var _RoleRoleType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(82);


/**
 * A document structural element.
 * @see https://www.w3.org/TR/wai-aria-1.1/#structure
 * @abstract
 */
class RoleStructure extends _RoleRoleType__WEBPACK_IMPORTED_MODULE_0__.RoleRoleType
{
}


/***/ }),
/* 82 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleRoleType": () => (/* binding */ RoleRoleType)
/* harmony export */ });
/* harmony import */ var _AriaAtomic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _AriaBusy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15);
/* harmony import */ var _AriaControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(16);
/* harmony import */ var _AriaCurrent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(18);
/* harmony import */ var _AriaDescribedBy__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(20);
/* harmony import */ var _AriaDetails__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(21);
/* harmony import */ var _AriaDisabled__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(36);
/* harmony import */ var _AriaDropEffect__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(49);
/* harmony import */ var _AriaErrorMessage__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(50);
/* harmony import */ var _AriaFlowTo__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(23);
/* harmony import */ var _AriaGrabbed__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(53);
/* harmony import */ var _AriaHasPopup__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(54);
/* harmony import */ var _AriaHidden__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(55);
/* harmony import */ var _AriaInvalid__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(56);
/* harmony import */ var _AriaKeyShortcuts__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(24);
/* harmony import */ var _AriaLabel__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(26);
/* harmony import */ var _AriaLabelledBy__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(27);
/* harmony import */ var _AriaLive__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(28);
/* harmony import */ var _AriaOwns__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(29);
/* harmony import */ var _AriaRelevant__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(30);
/* harmony import */ var _AriaRoleDescription__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(32);
/* harmony import */ var _Role__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(78);























/**
 * The base role from which all other roles in this taxonomy inherit.
 * @see https://www.w3.org/TR/wai-aria-1.1/#roletype
 * @abstract
 */
class RoleRoleType extends _Role__WEBPACK_IMPORTED_MODULE_21__.Role
{
  /**
   * @param {constructor|string} object
   * @returns {*|null}
   */
  closest(object) {
    const elem = super.closest(object)
    if(elem) {
      return elem
    }
    return this.doc.find(object, elem => elem.getAttr(_AriaOwns__WEBPACK_IMPORTED_MODULE_18__.AriaOwns).includes(this))
  }

  /**
   * @param {boolean} atomic
   */
  set atomic(atomic) {
    this.setAttr(_AriaAtomic__WEBPACK_IMPORTED_MODULE_0__.AriaAtomic, atomic)
  }

  /**
   * @returns {boolean}
   */
  get atomic() {
    return this.getAttr(_AriaAtomic__WEBPACK_IMPORTED_MODULE_0__.AriaAtomic)
  }

  /**
   * @param {boolean} busy
   */
  set busy(busy) {
    this.setAttr(_AriaBusy__WEBPACK_IMPORTED_MODULE_1__.AriaBusy, busy)
  }

  /**
   * @returns {boolean}
   */
  get busy() {
    return this.getAttr(_AriaBusy__WEBPACK_IMPORTED_MODULE_1__.AriaBusy)
  }

  /**
   * @param {*} controls
   */
  set controls(controls) {
    this.setAttr(_AriaControls__WEBPACK_IMPORTED_MODULE_2__.AriaControls, controls)
  }

  /**
   * @returns {*[]}
   */
  get controls() {
    return this.getAttr(_AriaControls__WEBPACK_IMPORTED_MODULE_2__.AriaControls)
  }

  /**
   * @param {string} current
   */
  set current(current) {
    this.setAttr(_AriaCurrent__WEBPACK_IMPORTED_MODULE_3__.AriaCurrent, current)
  }

  /**
   * @returns {string}
   */
  get current() {
    return this.getAttr(_AriaCurrent__WEBPACK_IMPORTED_MODULE_3__.AriaCurrent)
  }

  /**
   * @param {*} describedBy
   */
  set describedBy(describedBy) {
    this.setAttr(_AriaDescribedBy__WEBPACK_IMPORTED_MODULE_4__.AriaDescribedBy, describedBy)
  }

  /**
   * @returns {*[]}
   */
  get describedBy() {
    return this.getAttr(_AriaDescribedBy__WEBPACK_IMPORTED_MODULE_4__.AriaDescribedBy)
  }

  /**
   * @param {*} details
   */
  set details(details) {
    this.setAttr(_AriaDetails__WEBPACK_IMPORTED_MODULE_5__.AriaDetails, details)
  }

  /**
   * @returns {DomElem|*|null}
   */
  get details() {
    return this.getAttr(_AriaDetails__WEBPACK_IMPORTED_MODULE_5__.AriaDetails)
  }

  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    this.setAttr(_AriaDisabled__WEBPACK_IMPORTED_MODULE_6__.AriaDisabled, disabled)
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return this.getAttr(_AriaDisabled__WEBPACK_IMPORTED_MODULE_6__.AriaDisabled)
  }

  /**
   * @param {array|string|null} dropEffect
   * @deprecated
   */
  set dropEffect(dropEffect) {
    this.setAttr(_AriaDropEffect__WEBPACK_IMPORTED_MODULE_7__.AriaDropEffect, dropEffect)
  }

  /**
   * @returns {array|string|null}
   * @deprecated
   */
  get dropEffect() {
    return this.getAttr(_AriaDropEffect__WEBPACK_IMPORTED_MODULE_7__.AriaDropEffect)
  }

  /**
   * @param {*} errorMessage
   */
  set errorMessage(errorMessage) {
    this.setAttr(_AriaErrorMessage__WEBPACK_IMPORTED_MODULE_8__.AriaErrorMessage, errorMessage)
  }

  /**
   * @returns {DomElem|*|null}
   */
  get errorMessage() {
    return this.getAttr(_AriaErrorMessage__WEBPACK_IMPORTED_MODULE_8__.AriaErrorMessage)
  }

  /**
   * @param {*} flowTo
   */
  set flowTo(flowTo) {
    this.setAttr(_AriaFlowTo__WEBPACK_IMPORTED_MODULE_9__.AriaFlowTo, flowTo)
  }

  /**
   * @returns {DomElem|*|null}
   */
  get flowTo() {
    return this.getAttr(_AriaFlowTo__WEBPACK_IMPORTED_MODULE_9__.AriaFlowTo)
  }

  /**
   * @param {boolean|undefined} grabbed
   * @deprecated
   */
  set grabbed(grabbed) {
    this.setAttr(_AriaGrabbed__WEBPACK_IMPORTED_MODULE_10__.AriaGrabbed, grabbed)
  }

  /**
   * @returns {boolean|undefined}
   * @deprecated
   */
  get grabbed() {
    return this.getAttr(_AriaGrabbed__WEBPACK_IMPORTED_MODULE_10__.AriaGrabbed)
  }

  /**
   * @param {string} hasPopup
   */
  set hasPopup(hasPopup) {
    this.setAttr(_AriaHasPopup__WEBPACK_IMPORTED_MODULE_11__.AriaHasPopup, hasPopup)
  }

  /**
   * @returns {string}
   */
  get hasPopup() {
    return this.getAttr(_AriaHasPopup__WEBPACK_IMPORTED_MODULE_11__.AriaHasPopup)
  }

  /**
   * @param {boolean|undefined} hidden
   */
  set hidden(hidden) {
    this.setAttr(_AriaHidden__WEBPACK_IMPORTED_MODULE_12__.AriaHidden, hidden)
  }

  /**
   * @returns {boolean|undefined}
   */
  get hidden() {
    return this.getAttr(_AriaHidden__WEBPACK_IMPORTED_MODULE_12__.AriaHidden)
  }

  /**
   * @param {boolean|string} invalid
   */
  set invalid(invalid) {
    this.setAttr(_AriaInvalid__WEBPACK_IMPORTED_MODULE_13__.AriaInvalid, invalid)
  }

  /**
   * @returns {boolean|string}
   */
  get invalid() {
    return this.getAttr(_AriaInvalid__WEBPACK_IMPORTED_MODULE_13__.AriaInvalid)
  }

  /**
   * @param {string} keyShortcuts
   */
  set keyShortcuts(keyShortcuts) {
    this.setAttr(_AriaKeyShortcuts__WEBPACK_IMPORTED_MODULE_14__.AriaKeyShortcuts, keyShortcuts)
  }

  /**
   * @returns {string}
   */
  get keyShortcuts() {
    return this.getAttr(_AriaKeyShortcuts__WEBPACK_IMPORTED_MODULE_14__.AriaKeyShortcuts)
  }

  /**
   * @param {string} label
   */
  set label(label) {
    this.setAttr(_AriaLabel__WEBPACK_IMPORTED_MODULE_15__.AriaLabel, label)
  }

  /**
   * @returns {string}
   */
  get label() {
    return this.getAttr(_AriaLabel__WEBPACK_IMPORTED_MODULE_15__.AriaLabel)
  }

  /**
   * @param {*} labelledBy {*[]}
   */
  set labelledBy(labelledBy) {
    this.setAttr(_AriaLabelledBy__WEBPACK_IMPORTED_MODULE_16__.AriaLabelledBy, labelledBy)
  }

  /**
   * @returns {*[]}
   */
  get labelledBy() {
    return this.getAttr(_AriaLabelledBy__WEBPACK_IMPORTED_MODULE_16__.AriaLabelledBy)
  }

  /**
   * @param {string} live
   */
  set live(live) {
    this.setAttr(_AriaLive__WEBPACK_IMPORTED_MODULE_17__.AriaLive, live)
  }

  /**
   * @returns {string}
   */
  get live() {
    return this.getAttr(_AriaLive__WEBPACK_IMPORTED_MODULE_17__.AriaLive)
  }

  /**
   * @param {DomNode[]|*} owns
   */
  set owns(owns) {
    this.setAttr(_AriaOwns__WEBPACK_IMPORTED_MODULE_18__.AriaOwns, owns)
  }

  /**
   * @returns {DomNode[]|*}
   */
  get owns() {
    return this.getAttr(_AriaOwns__WEBPACK_IMPORTED_MODULE_18__.AriaOwns)
  }

  /**
   * @param {string[]} relevant
   */
  set relevant(relevant) {
    this.setAttr(_AriaRelevant__WEBPACK_IMPORTED_MODULE_19__.AriaRelevant, relevant)
  }

  /**
   * @returns {string[]}
   */
  get relevant() {
    return this.getAttr(_AriaRelevant__WEBPACK_IMPORTED_MODULE_19__.AriaRelevant)
  }

  /**
   * @param {string} roleDescription
   */
  set roleDescription(roleDescription) {
    this.setAttr(_AriaRoleDescription__WEBPACK_IMPORTED_MODULE_20__.AriaRoleDescription, roleDescription)
  }

  /**
   * @returns {string}
   */
  get roleDescription() {
    return this.getAttr(_AriaRoleDescription__WEBPACK_IMPORTED_MODULE_20__.AriaRoleDescription)
  }
}


/***/ }),
/* 83 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleAlertDialog": () => (/* binding */ RoleAlertDialog)
/* harmony export */ });
/* harmony import */ var _RoleDialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);


/**
 * A type of dialog that contains an alert message,
 *  where initial focus goes to an element within the dialog.
 * @see https://www.w3.org/TR/wai-aria-1.1/#alertdialog
 * @mixes RoleAlert
 */
class RoleAlertDialog extends _RoleDialog__WEBPACK_IMPORTED_MODULE_0__.RoleDialog
{
  /**
   * @param {{}} init
   */
  create(init) {
    super.create(init)
    this.modal = true
  }
}


/***/ }),
/* 84 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleDialog": () => (/* binding */ RoleDialog)
/* harmony export */ });
/* harmony import */ var _RoleWindow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(85);


/**
 * A dialog is a descendant window of the primary window of a web application.
 * @see https://www.w3.org/TR/wai-aria-1.1/#dialog
 */
class RoleDialog extends _RoleWindow__WEBPACK_IMPORTED_MODULE_0__.RoleWindow
{
}

RoleDialog.abstract = false


/***/ }),
/* 85 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleWindow": () => (/* binding */ RoleWindow)
/* harmony export */ });
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(51);
/* harmony import */ var _AriaModal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(58);
/* harmony import */ var _RoleRoleType__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(82);




/**
 * A browser or application window.
 * @see https://www.w3.org/TR/wai-aria-1.1/#window
 * @abstract
 */
class RoleWindow extends _RoleRoleType__WEBPACK_IMPORTED_MODULE_2__.RoleRoleType
{
  /**
   * @param {boolean|undefined} expanded
   */
  set expanded(expanded) {
    this.setAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded, expanded)
  }

  /**
   * @returns {boolean|undefined}
   */
  get expanded() {
    return this.getAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded)
  }

  /**
   * @param {boolean} modal
   */
  set modal(modal) {
    this.setAttr(_AriaModal__WEBPACK_IMPORTED_MODULE_1__.AriaModal, modal)
  }

  /**
   * @returns {boolean}
   */
  get modal() {
    return this.getAttr(_AriaModal__WEBPACK_IMPORTED_MODULE_1__.AriaModal)
  }
}


/***/ }),
/* 86 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleApplication": () => (/* binding */ RoleApplication)
/* harmony export */ });
/* harmony import */ var _AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(41);
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(51);
/* harmony import */ var _RoleBanner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(87);
/* harmony import */ var _RoleStructure__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(81);





/**
 * A structure containing one or more focusable elements requiring user input,
 *  such as keyboard or gesture events, that do not follow a standard interaction
 *  pattern supported by a widget role.
 * @see https://www.w3.org/TR/wai-aria-1.1/#application
 */
class RoleApplication extends _RoleStructure__WEBPACK_IMPORTED_MODULE_3__.RoleStructure
{
  /**
   * @param {*} activeDescendant
   */
  set activeDescendant(activeDescendant) {
    this.setAttr(_AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__.AriaActiveDescendant, activeDescendant)
  }

  /**
   * @returns {DomElem|null}
   */
  get activeDescendant() {
    return this.getAttr(_AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__.AriaActiveDescendant)
  }

  /**
   * @param {boolean|undefined} expanded
   */
  set expanded(expanded) {
    this.setAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_1__.AriaExpanded, expanded)
  }

  /**
   * @returns {boolean|undefined}
   */
  get expanded() {
    return this.getAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_1__.AriaExpanded)
  }
}

RoleApplication.abstract = false

_RoleBanner__WEBPACK_IMPORTED_MODULE_2__.RoleBanner.Application = RoleApplication


/***/ }),
/* 87 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleBanner": () => (/* binding */ RoleBanner)
/* harmony export */ });
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(88);


/**
 * A region that contains mostly site-oriented content, rather than page-specific content.
 * @see https://www.w3.org/TR/wai-aria-1.1/#banner
 */
class RoleBanner extends _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__.RoleLandmark
{
  /**
   * @returns {RoleApplication|*}
   */
  get application() {
    return this.closest(RoleBanner.Application)
  }

  /**
   * @returns {RoleDocument|*}
   */
  get document() {
    return this.closest(RoleBanner.Document)
  }
}

RoleBanner.abstract = false


/***/ }),
/* 88 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleLandmark": () => (/* binding */ RoleLandmark)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(80);


/**
 * A perceivable section containing content that is relevant to a specific,
 *  author-specified purpose and sufficiently important that users will likely
 *  want to be able to navigate to the section easily and to have it listed
 *  in a summary of the page. Such a page summary could be generated dynamically
 *  by a user agent or assistive technology.
 * @see https://www.w3.org/TR/wai-aria-1.1/#landmark
 * @abstract
 */
class RoleLandmark extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}


/***/ }),
/* 89 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleArticle": () => (/* binding */ RoleArticle)
/* harmony export */ });
/* harmony import */ var _AriaPosInSet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63);
/* harmony import */ var _AriaSetSize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(71);
/* harmony import */ var _RoleDocument__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(90);




/**
 * A section of a page that consists of a composition that forms
 *  an independent part of a document, page, or site.
 * @see https://www.w3.org/TR/wai-aria-1.1/#article
 */
class RoleArticle extends _RoleDocument__WEBPACK_IMPORTED_MODULE_2__.RoleDocument
{
  /**
   * @returns {RoleFeed|*|null}
   */
  get feed() {
    return this.closest(RoleArticle.Feed)
  }

  /**
   * @param {number} posInSet
   */
  set posInSet(posInSet) {
    this.setAttr(_AriaPosInSet__WEBPACK_IMPORTED_MODULE_0__.AriaPosInSet, posInSet)
  }

  /**
   * @returns {number}
   */
  get posInSet() {
    return this.getAttr(_AriaPosInSet__WEBPACK_IMPORTED_MODULE_0__.AriaPosInSet)
  }

  /**
   * @param {number} setSize
   */
  set setSize(setSize) {
    this.setAttr(_AriaSetSize__WEBPACK_IMPORTED_MODULE_1__.AriaSetSize, setSize)
  }

  /**
   * @returns {number}
   */
  get setSize() {
    return this.getAttr(_AriaSetSize__WEBPACK_IMPORTED_MODULE_1__.AriaSetSize)
  }
}


/***/ }),
/* 90 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleDocument": () => (/* binding */ RoleDocument)
/* harmony export */ });
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(51);
/* harmony import */ var _RoleBanner__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(87);
/* harmony import */ var _RoleContentInfo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(91);
/* harmony import */ var _RoleMain__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(92);
/* harmony import */ var _RoleStructure__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(81);






/**
 * An element containing content that assistive
 *  technology users may want to browse in a reading mode.
 * @see https://www.w3.org/TR/wai-aria-1.1/#document
 */
class RoleDocument extends _RoleStructure__WEBPACK_IMPORTED_MODULE_4__.RoleStructure
{
  /**
   * @returns {RoleBanner|*|null}
   */
  get banner() {
    return this.find(_RoleBanner__WEBPACK_IMPORTED_MODULE_1__.RoleBanner)
  }

  /**
   * @returns {RoleContentInfo|*|null}
   */
  get contentInfo() {
    return this.find(_RoleContentInfo__WEBPACK_IMPORTED_MODULE_2__.RoleContentInfo)
  }

  /**
   * @param {RoleMain|*|null} main
   */
  set main(main) {
    if(main) {
      const { main : _main, banner, contentInfo } = this
      if(_main) {
        _main.replaceWith(main)
      }
      else if(banner) {
        banner.after(main)
      }
      else if(contentInfo) {
        contentInfo.before(main)
      }
      else this.append(main)
    }
    else this.main.remove()
  }

  /**
   * @returns {RoleMain|*|null}
   */
  get main() {
    return this.find(_RoleMain__WEBPACK_IMPORTED_MODULE_3__.RoleMain)
  }

  /**
   * @param {boolean|undefined} expanded
   */
  set expanded(expanded) {
    this.setAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded, expanded)
  }

  /**
   * @returns {boolean|undefined}
   */
  get expanded() {
    return this.getAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded)
  }
}

RoleDocument.abstract = false

_RoleBanner__WEBPACK_IMPORTED_MODULE_1__.RoleBanner.Document = RoleDocument


/***/ }),
/* 91 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleContentInfo": () => (/* binding */ RoleContentInfo)
/* harmony export */ });
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(88);


/**
 * A large perceivable region that contains information about the parent document.
 * @see https://www.w3.org/TR/wai-aria-1.1/#contentinfo
 */
class RoleContentInfo extends _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__.RoleLandmark
{
}

RoleContentInfo.abstract = false


/***/ }),
/* 92 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleMain": () => (/* binding */ RoleMain)
/* harmony export */ });
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(88);


/**
 * The main content of a document.
 * @see https://www.w3.org/TR/wai-aria-1.1/#main
 */
class RoleMain extends _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__.RoleLandmark
{
}

RoleMain.abstract = false


/***/ }),
/* 93 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleBlockQuote": () => (/* binding */ RoleBlockQuote)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(80);


/**
 * A section of content that is quoted from another source.
 * @see https://www.w3.org/TR/wai-aria-1.2/#blockquote
 */
class RoleBlockQuote extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleBlockQuote.abstract = false


/***/ }),
/* 94 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleButton": () => (/* binding */ RoleButton)
/* harmony export */ });
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(51);
/* harmony import */ var _AriaPressed__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(64);
/* harmony import */ var _RoleCommand__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(95);




/**
 * An input that allows for user-triggered actions when clicked or pressed.
 * @see https://www.w3.org/TR/wai-aria-1.1/#button
 */
class RoleButton extends _RoleCommand__WEBPACK_IMPORTED_MODULE_2__.RoleCommand
{
  /**
   * @param {boolean|undefined} expanded
   */
  set expanded(expanded) {
    this.setAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded, expanded)
  }

  /**
   * @returns {boolean|undefined}
   */
  get expanded() {
    return this.getAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded)
  }

  /**
   * @param {boolean|string|undefined} pressed
   */
  set pressed(pressed) {
    this.setAttr(_AriaPressed__WEBPACK_IMPORTED_MODULE_1__.AriaPressed, pressed)
  }

  /**
   * @returns {boolean|string|undefined}
   */
  get pressed() {
    return this.getAttr(_AriaPressed__WEBPACK_IMPORTED_MODULE_1__.AriaPressed)
  }
}

RoleButton.abstract = false


/***/ }),
/* 95 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleCommand": () => (/* binding */ RoleCommand)
/* harmony export */ });
/* harmony import */ var _RoleWidget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96);


/**
 * A form of widget that performs an action but does not receive input data.
 * @see https://www.w3.org/TR/wai-aria-1.1/#command
 * @abstract
 */
class RoleCommand extends _RoleWidget__WEBPACK_IMPORTED_MODULE_0__.RoleWidget
{
}


/***/ }),
/* 96 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleWidget": () => (/* binding */ RoleWidget)
/* harmony export */ });
/* harmony import */ var _RoleForm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(97);
/* harmony import */ var _RoleRoleType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(82);



/**
 * An interactive component of a graphical user interface (GUI).
 * @see https://www.w3.org/TR/wai-aria-1.1/#widget
 * @abstract
 */
class RoleWidget extends _RoleRoleType__WEBPACK_IMPORTED_MODULE_1__.RoleRoleType
{
  /**
   * @returns {RoleForm|*|null}
   */
  get form() {
    return this.closest(_RoleForm__WEBPACK_IMPORTED_MODULE_0__.RoleForm)
  }
}


/***/ }),
/* 97 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleForm": () => (/* binding */ RoleForm)
/* harmony export */ });
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(88);


/**
 * A landmark region that contains a collection of items and objects that,
 *  as a whole, combine to create a form.
 * @see https://www.w3.org/TR/wai-aria-1.1/#form
 */
class RoleForm extends _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__.RoleLandmark
{
}

RoleForm.abstract = false


/***/ }),
/* 98 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleCaption": () => (/* binding */ RoleCaption)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(80);


/**
 * On-screen descriptive text for a figure or table in the page.
 * @see https://www.w3.org/TR/wai-aria-1.2/#caption
 */
class RoleCaption extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
  /**
   * @returns {RoleTable|*}
   */
  get table() {
    return this.closest(RoleCaption.Table)
  }
}

RoleCaption.abstract = false


/***/ }),
/* 99 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleCell": () => (/* binding */ RoleCell)
/* harmony export */ });
/* harmony import */ var _AriaColIndex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(47);
/* harmony import */ var _AriaColSpan__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(48);
/* harmony import */ var _AriaRowIndex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(68);
/* harmony import */ var _AriaRowSpan__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(69);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(80);






/**
 * A cell in a tabular container.
 * @see https://www.w3.org/TR/wai-aria-1.1/#cell
 */
class RoleCell extends _RoleSection__WEBPACK_IMPORTED_MODULE_4__.RoleSection
{
  /**
   * @returns {RoleGridCell[]}
   */
  get column() {
    const owner = this.rowGroup || this.grid
    const index = this.colIndex
    return owner.findAll(RoleCell, ({ colIndex }) => colIndex === index)
  }

  /**
   * @param {number} colIndex
   */
  set colIndex(colIndex) {
    this.setAttr(_AriaColIndex__WEBPACK_IMPORTED_MODULE_0__.AriaColIndex, colIndex)
  }

  /**
   * @returns {number}
   */
  get colIndex() {
    const index = this.getAttr(_AriaColIndex__WEBPACK_IMPORTED_MODULE_0__.AriaColIndex)
    return isNaN(index)?
      this.row.cells.indexOf(this) :
      index
  }

  /**
   * @param {number} colSpan
   */
  set colSpan(colSpan) {
    this.setAttr(_AriaColSpan__WEBPACK_IMPORTED_MODULE_1__.AriaColSpan, colSpan)
  }

  /**
   * @returns {number}
   */
  get colSpan() {
    return this.getAttr(_AriaColSpan__WEBPACK_IMPORTED_MODULE_1__.AriaColSpan)
  }

  /**
   * @returns {RoleColumnHeader|null}
   */
  get columnHeader() {
    const index = this.colIndex
    return this.table.find(RoleCell.ColumnHeader, ({ colIndex }) => colIndex === index)
  }

  /**
   * @returns {RoleGrid}
   */
  get grid() {
    return this.closest(RoleCell.Grid)
  }

  /**
   * @returns {RoleRow|null}
   */
  get row() {
    return this.closest(RoleCell.Row)
  }

  /**
   * @returns {RoleRowGroup|null}
   */
  get rowGroup() {
    return this.closest(RoleCell.RowGroup)
  }

  /**
   * @returns {RoleRowHeader}
   */
  get rowHeader() {
    return this.row.rowHeader
  }

  /**
   * @param {number} rowIndex
   */
  set rowIndex(rowIndex) {
    this.setAttr(_AriaRowIndex__WEBPACK_IMPORTED_MODULE_2__.AriaRowIndex, rowIndex)
  }

  /**
   * @returns {number}
   */
  get rowIndex() {
    const index = this.getAttr(_AriaRowIndex__WEBPACK_IMPORTED_MODULE_2__.AriaRowIndex)
    return isNaN(index)?
      this.row.rowIndex :
      index
  }

  /**
   * @param {number} rowSpan
   */
  set rowSpan(rowSpan) {
    this.setAttr(_AriaRowSpan__WEBPACK_IMPORTED_MODULE_3__.AriaRowSpan, rowSpan)
  }

  /**
   * @returns {number}
   */
  get rowSpan() {
    return this.getAttr(_AriaRowSpan__WEBPACK_IMPORTED_MODULE_3__.AriaRowSpan)
  }

  /**
   * @returns {RoleTable|null}
   */
  get table() {
    return this.closest(RoleCell.Table)
  }
}

RoleCell.abstract = false


/***/ }),
/* 100 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleCheckBox": () => (/* binding */ RoleCheckBox)
/* harmony export */ });
/* harmony import */ var _AriaChecked__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43);
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(65);
/* harmony import */ var _RoleInput__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(101);




/**
 * A checkable input that has three possible values: true, false, or mixed.
 * @see https://www.w3.org/TR/wai-aria-1.1/#checkbox
 */
class RoleCheckBox extends _RoleInput__WEBPACK_IMPORTED_MODULE_2__.RoleInput
{
  /**
   * @param {boolean|string} checked
   */
  set checked(checked) {
    this.setAttr(_AriaChecked__WEBPACK_IMPORTED_MODULE_0__.AriaChecked, checked)
  }

  /**
   * @returns {boolean|string}
   */
  get checked() {
    return this.getAttr(_AriaChecked__WEBPACK_IMPORTED_MODULE_0__.AriaChecked) || false
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_1__.AriaReadOnly, readOnly)
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_1__.AriaReadOnly)
  }
}

RoleCheckBox.abstract = false


/***/ }),
/* 101 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleInput": () => (/* binding */ RoleInput)
/* harmony export */ });
/* harmony import */ var _RoleWidget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96);


/**
 * A generic type of widget that allows user input.
 * @see https://www.w3.org/TR/wai-aria-1.1/#input
 * @abstract
 */
class RoleInput extends _RoleWidget__WEBPACK_IMPORTED_MODULE_0__.RoleWidget
{
}


/***/ }),
/* 102 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleColumnHeader": () => (/* binding */ RoleColumnHeader)
/* harmony export */ });
/* harmony import */ var _AriaSort__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(72);
/* harmony import */ var _RoleCell__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(99);



/**
 * A cell containing header information for a column.
 * @see https://www.w3.org/TR/wai-aria-1.1/#columnheader
 * @mixes RoleGridCell
 * @mixes RoleSectionHead
 */
class RoleColumnHeader extends _RoleCell__WEBPACK_IMPORTED_MODULE_1__.RoleCell
{
  /**
   * @param {string} sort
   */
  set sort(sort) {
    this.setAttr(_AriaSort__WEBPACK_IMPORTED_MODULE_0__.AriaSort, sort)
  }

  /**
   * @returns {string}
   */
  get sort() {
    return this.getAttr(_AriaSort__WEBPACK_IMPORTED_MODULE_0__.AriaSort)
  }
}

_RoleCell__WEBPACK_IMPORTED_MODULE_1__.RoleCell.ColumnHeader = RoleColumnHeader


/***/ }),
/* 103 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleComboBox": () => (/* binding */ RoleComboBox)
/* harmony export */ });
/* harmony import */ var _AriaAutoComplete__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(42);
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(51);
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(65);
/* harmony import */ var _AriaRequired__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(66);
/* harmony import */ var _RoleInput__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(101);
/* harmony import */ var _RoleTextBox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(104);







/**
 * A composite widget containing a single-line textbox and another element,
 *  such as a listbox or grid, that can dynamically pop up to help the user
 *  set the value of the textbox.
 * @see https://www.w3.org/TR/wai-aria-1.1/#combobox
 */
class RoleComboBox extends _RoleInput__WEBPACK_IMPORTED_MODULE_4__.RoleInput
{
  /**
   * @param {string} autoComplete
   */
  set autoComplete(autoComplete) {
    this.setAttr(_AriaAutoComplete__WEBPACK_IMPORTED_MODULE_0__.AriaAutoComplete, autoComplete)
  }

  /**
   * @returns {string}
   */
  get autoComplete() {
    return this.getAttr(_AriaAutoComplete__WEBPACK_IMPORTED_MODULE_0__.AriaAutoComplete)
  }

  /**
   * @param {boolean|undefined} expanded
   */
  set expanded(expanded) {
    this.setAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_1__.AriaExpanded, expanded)
  }

  /**
   * @returns {boolean|undefined}
   */
  get expanded() {
    return this.getAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_1__.AriaExpanded) || false
  }

  /**
   * @param {string} hasPopup
   */
  set hasPopup(hasPopup) {
    super.hasPopup = hasPopup
  }

  /**
   * @returns {string}
   */
  get hasPopup() {
    return super.hasPopup || 'listbox'
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_2__.AriaReadOnly, readOnly)
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_2__.AriaReadOnly)
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(_AriaRequired__WEBPACK_IMPORTED_MODULE_3__.AriaRequired, required)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(_AriaRequired__WEBPACK_IMPORTED_MODULE_3__.AriaRequired)
  }

  /**
   * @returns {RoleTextBox|*}
   */
  get textBox() {
    return this.find(_RoleTextBox__WEBPACK_IMPORTED_MODULE_5__.RoleTextBox)
  }
}

RoleComboBox.abstract = false


/***/ }),
/* 104 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTextBox": () => (/* binding */ RoleTextBox)
/* harmony export */ });
/* harmony import */ var _AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(41);
/* harmony import */ var _AriaAutoComplete__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(42);
/* harmony import */ var _AriaMultiLine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(59);
/* harmony import */ var _AriaPlaceholder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(62);
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(65);
/* harmony import */ var _AriaRequired__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(66);
/* harmony import */ var _RoleInput__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(101);








/**
 * A type of input that allows free-form text as its value.
 * @see https://www.w3.org/TR/wai-aria-1.1/#textbox
 */
class RoleTextBox extends _RoleInput__WEBPACK_IMPORTED_MODULE_6__.RoleInput
{
  /**
   * @param {*} activeDescendant
   */
  set activeDescendant(activeDescendant) {
    this.setAttr(_AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__.AriaActiveDescendant, activeDescendant)
  }

  /**
   * @returns {Role|DomElem|null}
   */
  get activeDescendant() {
    return this.getAttr(_AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__.AriaActiveDescendant)
  }

  /**
   * @param {string} autoComplete
   */
  set autoComplete(autoComplete) {
    this.setAttr(_AriaAutoComplete__WEBPACK_IMPORTED_MODULE_1__.AriaAutoComplete, autoComplete)
  }

  /**
   * @returns {string}
   */
  get autoComplete() {
    return this.getAttr(_AriaAutoComplete__WEBPACK_IMPORTED_MODULE_1__.AriaAutoComplete)
  }

  /**
   * @param {boolean} multiLine
   */
  set multiLine(multiLine) {
    this.setAttr(_AriaMultiLine__WEBPACK_IMPORTED_MODULE_2__.AriaMultiLine, multiLine)
  }

  /**
   * @returns {boolean}
   */
  get multiLine() {
    return this.getAttr(_AriaMultiLine__WEBPACK_IMPORTED_MODULE_2__.AriaMultiLine)
  }

  /**
   * @param {string} placeholder
   */
  set placeholder(placeholder) {
    this.setAttr(_AriaPlaceholder__WEBPACK_IMPORTED_MODULE_3__.AriaPlaceholder, placeholder)
  }

  /**
   * @returns {string}
   */
  get placeholder() {
    return this.getAttr(_AriaPlaceholder__WEBPACK_IMPORTED_MODULE_3__.AriaPlaceholder)
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_4__.AriaReadOnly, readOnly)
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_4__.AriaReadOnly)
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(_AriaRequired__WEBPACK_IMPORTED_MODULE_5__.AriaRequired, required)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(_AriaRequired__WEBPACK_IMPORTED_MODULE_5__.AriaRequired)
  }
}

RoleTextBox.abstract = false


/***/ }),
/* 105 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleComplementary": () => (/* binding */ RoleComplementary)
/* harmony export */ });
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(88);


/**
 * A supporting section of the document, designed to be complementary
 *  to the main content at a similar level in the DOM hierarchy,
 *  but remains meaningful when separated from the main content.
 * @see https://www.w3.org/TR/wai-aria-1.1/#complementary
 */
class RoleComplementary extends _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__.RoleLandmark
{
}

RoleComplementary.abstract = false


/***/ }),
/* 106 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleComposite": () => (/* binding */ RoleComposite)
/* harmony export */ });
/* harmony import */ var _AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(41);
/* harmony import */ var _RoleWidget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(96);



/**
 * A widget that may contain navigable descendants or owned children.
 * @see https://www.w3.org/TR/wai-aria-1.1/#composite
 * @abstract
 */
class RoleComposite extends _RoleWidget__WEBPACK_IMPORTED_MODULE_1__.RoleWidget
{
  /**
   * @param {*} activeDescendant
   */
  set activeDescendant(activeDescendant) {
    this.setAttr(_AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__.AriaActiveDescendant, activeDescendant)
  }

  /**
   * @returns {DomElem|null}
   */
  get activeDescendant() {
    return this.getAttr(_AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__.AriaActiveDescendant)
  }
}


/***/ }),
/* 107 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleDefinition": () => (/* binding */ RoleDefinition)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(80);


/**
 * A definition of a term or concept.
 * @see https://www.w3.org/TR/wai-aria-1.1/#definition
 */
class RoleDefinition extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleDefinition.abstract = false


/***/ }),
/* 108 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleDirectory": () => (/* binding */ RoleDirectory)
/* harmony export */ });
/* harmony import */ var _RoleList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(109);


/**
 * A list of references to members of a group, such as a static table of contents.
 * @see https://www.w3.org/TR/wai-aria-1.1/#directory
 */
class RoleDirectory extends _RoleList__WEBPACK_IMPORTED_MODULE_0__.RoleList
{
}


/***/ }),
/* 109 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleList": () => (/* binding */ RoleList)
/* harmony export */ });
/* harmony import */ var _RoleListItem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(110);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(80);



/**
 * A section containing listitem elements.
 * @see https://www.w3.org/TR/wai-aria-1.1/#list
 */
class RoleList extends _RoleSection__WEBPACK_IMPORTED_MODULE_1__.RoleSection
{
  /**
   * @returns {array.ListItem|*}
   */
  get items() {
    return this.findAll(_RoleListItem__WEBPACK_IMPORTED_MODULE_0__.RoleListItem)
  }
}

RoleList.abstract = false

_RoleListItem__WEBPACK_IMPORTED_MODULE_0__.RoleListItem.List = RoleList


/***/ }),
/* 110 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleListItem": () => (/* binding */ RoleListItem)
/* harmony export */ });
/* harmony import */ var _AriaLevel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(57);
/* harmony import */ var _AriaPosInSet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(63);
/* harmony import */ var _AriaSetSize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(71);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(80);





/**
 * A single item in a list or directory.
 * @see https://www.w3.org/TR/wai-aria-1.1/#listitem
 */
class RoleListItem extends _RoleSection__WEBPACK_IMPORTED_MODULE_3__.RoleSection
{
  /**
   * @param {number} level
   */
  set level(level) {
    this.setAttr(_AriaLevel__WEBPACK_IMPORTED_MODULE_0__.AriaLevel, level)
  }

  /**
   * @returns {number}
   */
  get level() {
    return this.getAttr(_AriaLevel__WEBPACK_IMPORTED_MODULE_0__.AriaLevel)
  }

  /**
   * @returns {RoleList|*}
   */
  get list() {
    return this.closest(RoleListItem.List)
  }

  /**
   * @param {number} posInSet
   */
  set posInSet(posInSet) {
    this.setAttr(_AriaPosInSet__WEBPACK_IMPORTED_MODULE_1__.AriaPosInSet, posInSet)
  }

  /**
   * @returns {number}
   */
  get posInSet() {
    return this.getAttr(_AriaPosInSet__WEBPACK_IMPORTED_MODULE_1__.AriaPosInSet)
  }

  /**
   * @param {number} setSize
   */
  set setSize(setSize) {
    this.setAttr(_AriaSetSize__WEBPACK_IMPORTED_MODULE_2__.AriaSetSize, setSize)
  }

  /**
   * @returns {number}
   */
  get setSize() {
    return this.getAttr(_AriaSetSize__WEBPACK_IMPORTED_MODULE_2__.AriaSetSize)
  }
}

RoleListItem.abstract = false


/***/ }),
/* 111 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleFeed": () => (/* binding */ RoleFeed)
/* harmony export */ });
/* harmony import */ var _RoleArticle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(89);
/* harmony import */ var _RoleList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(109);



/**
 * A scrollable list of articles where scrolling may cause
 *  articles to be added to or removed from either end of the list.
 * @see https://www.w3.org/TR/wai-aria-1.1/#feed
 */
class RoleFeed extends _RoleList__WEBPACK_IMPORTED_MODULE_1__.RoleList
{
  /**
   * @returns {array.RoleArticle|*}
   */
  get articles() {
    return this.findAll(_RoleArticle__WEBPACK_IMPORTED_MODULE_0__.RoleArticle)
  }
}

_RoleArticle__WEBPACK_IMPORTED_MODULE_0__.RoleArticle.Feed = RoleFeed


/***/ }),
/* 112 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleFigure": () => (/* binding */ RoleFigure)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(80);


/**
 * A perceivable section of content that typically contains
 *  a graphical document, images, code snippets, or example text.
 * @see https://www.w3.org/TR/wai-aria-1.1/#figure
 */
class RoleFigure extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleFigure.abstract = false


/***/ }),
/* 113 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleGrid": () => (/* binding */ RoleGrid)
/* harmony export */ });
/* harmony import */ var _AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(41);
/* harmony import */ var _AriaLevel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(57);
/* harmony import */ var _AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(60);
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(65);
/* harmony import */ var _RoleCell__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(99);
/* harmony import */ var _RoleGridCell__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(114);
/* harmony import */ var _RoleRow__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(115);
/* harmony import */ var _RoleRowGroup__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(118);
/* harmony import */ var _RoleTable__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(119);










/**
 * A composite widget containing a collection of one or more rows with one
 *  or more cells where some or all cells in the grid are focusable by using
 *  methods of two-dimensional navigation, such as directional arrow keys.
 * @see https://www.w3.org/TR/wai-aria-1.1/#grid
 * @mixes RoleComposite
 */
class RoleGrid extends _RoleTable__WEBPACK_IMPORTED_MODULE_8__.RoleTable
{
  /**
   * @param {RoleGridCell} activeDescendant
   */
  set activeDescendant(activeDescendant) {
    this.setAttr(_AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__.AriaActiveDescendant, activeDescendant)
  }

  /**
   * @returns {RoleGridCell}
   */
  get activeDescendant() {
    return this.getAttr(_AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__.AriaActiveDescendant)
  }

  /**
   * @returns {RoleGridCell[]}
   */
  get gridCells() {
    return this.findAll(_RoleGridCell__WEBPACK_IMPORTED_MODULE_5__.RoleGridCell)
  }

  /**
   * @param {number} level
   */
  set level(level) {
    this.setAttr(_AriaLevel__WEBPACK_IMPORTED_MODULE_1__.AriaLevel, level)
  }

  /**
   * @returns {number}
   */
  get level() {
    return this.getAttr(_AriaLevel__WEBPACK_IMPORTED_MODULE_1__.AriaLevel)
  }

  /**
   * @param {boolean} multiSelectable
   */
  set multiSelectable(multiSelectable) {
    this.setAttr(_AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_2__.AriaMultiSelectable, multiSelectable)
  }

  /**
   * @returns {boolean}
   */
  get multiSelectable() {
    return this.getAttr(_AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_2__.AriaMultiSelectable)
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_3__.AriaReadOnly, readOnly)
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_3__.AriaReadOnly)
  }

  /**
   * Gell all selected cells
   * @returns {RoleGridCell[]}
   */
  get selectedCells() {
    return this.gridCells.filter(({ selected }) => selected)
  }
}

_RoleCell__WEBPACK_IMPORTED_MODULE_4__.RoleCell.Grid = RoleGrid
_RoleRow__WEBPACK_IMPORTED_MODULE_6__.RoleRow.Grid = RoleGrid
_RoleRowGroup__WEBPACK_IMPORTED_MODULE_7__.RoleRowGroup.Grid = RoleGrid


/***/ }),
/* 114 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleGridCell": () => (/* binding */ RoleGridCell)
/* harmony export */ });
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(65);
/* harmony import */ var _AriaRequired__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(66);
/* harmony import */ var _AriaSelected__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(70);
/* harmony import */ var _RoleCell__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(99);





/**
 * A cell in a grid or treegrid.
 * @see https://www.w3.org/TR/wai-aria-1.1/#gridcell
 * @mixes RoleWidget
 */
class RoleGridCell extends _RoleCell__WEBPACK_IMPORTED_MODULE_3__.RoleCell
{
  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_0__.AriaReadOnly, readOnly)
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_0__.AriaReadOnly)
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(_AriaRequired__WEBPACK_IMPORTED_MODULE_1__.AriaRequired, required)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(_AriaRequired__WEBPACK_IMPORTED_MODULE_1__.AriaRequired)
  }

  /**
   * @param {boolean|undefined} selected
   */
  set selected(selected) {
    this.setAttr(_AriaSelected__WEBPACK_IMPORTED_MODULE_2__.AriaSelected, selected)
  }

  /**
   * @returns {boolean|undefined}
   */
  get selected() {
    return this.getAttr(_AriaSelected__WEBPACK_IMPORTED_MODULE_2__.AriaSelected)
  }
}


/***/ }),
/* 115 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleRow": () => (/* binding */ RoleRow)
/* harmony export */ });
/* harmony import */ var _AriaColIndex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(47);
/* harmony import */ var _AriaLevel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(57);
/* harmony import */ var _AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(60);
/* harmony import */ var _AriaRowIndex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(68);
/* harmony import */ var _AriaSelected__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(70);
/* harmony import */ var _RoleCell__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(99);
/* harmony import */ var _RoleGridCell__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(114);
/* harmony import */ var _RoleGroup__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(116);
/* harmony import */ var _RoleRowHeader__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(117);










/**
 * A row of cells in a tabular container.
 * @see https://www.w3.org/TR/wai-aria-1.1/#row
 * @mixes RoleWidget
 */
class RoleRow extends _RoleGroup__WEBPACK_IMPORTED_MODULE_7__.RoleGroup
{
  /**
   * @returns {RoleCell[]}
   */
  get cells() {
    return this.findAll(_RoleCell__WEBPACK_IMPORTED_MODULE_5__.RoleCell)
  }

  /**
   * @param {number} colIndex
   */
  set colIndex(colIndex) {
    this.setAttr(_AriaColIndex__WEBPACK_IMPORTED_MODULE_0__.AriaColIndex, colIndex)
  }

  /**
   * @returns {number}
   */
  get colIndex() {
    return this.getAttr(_AriaColIndex__WEBPACK_IMPORTED_MODULE_0__.AriaColIndex) || 0
  }

  /**
   * @returns {RoleGridCell[]}
   */
  get gridCells() {
    return this.findAll(_RoleGridCell__WEBPACK_IMPORTED_MODULE_6__.RoleGridCell)
  }

  /**
   * @param {number} level
   */
  set level(level) {
    this.setAttr(_AriaLevel__WEBPACK_IMPORTED_MODULE_1__.AriaLevel, level)
  }

  /**
   * @returns {number}
   */
  get level() {
    return this.getAttr(_AriaLevel__WEBPACK_IMPORTED_MODULE_1__.AriaLevel)
  }

  /**
   * @param {boolean} multiSelectable
   */
  set multiSelectable(multiSelectable) {
    this.setAttr(_AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_2__.AriaMultiSelectable, multiSelectable)
  }

  /**
   * @returns {boolean}
   */
  get multiSelectable() {
    return this.getAttr(_AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_2__.AriaMultiSelectable)
  }

  /**
   * @returns {RoleRow}
   */
  get nextRow() {
    const owner = this.rowGroup || this.table
    return owner.rows[this.rowIndex + 1] || null
  }

  /**
   * @returns {RoleRow}
   */
  get prevRow() {
    const owner = this.rowGroup || this.table
    return owner.rows[this.rowIndex - 1] || null
  }

  /**
   * @returns {RoleRowGroup}
   */
  get rowGroup() {
    return this.closest(RoleRow.RowGroup)
  }

  /**
   * @returns {RoleRowHeader|null}
   */
  get rowHeader() {
    return this.find(_RoleRowHeader__WEBPACK_IMPORTED_MODULE_8__.RoleRowHeader)
  }

  /**
   * @param {number} rowIndex
   */
  set rowIndex(rowIndex) {
    this.setAttr(_AriaRowIndex__WEBPACK_IMPORTED_MODULE_3__.AriaRowIndex, rowIndex)
  }

  /**
   * @returns {number}
   */
  get rowIndex() {
    const index = this.getAttr(_AriaRowIndex__WEBPACK_IMPORTED_MODULE_3__.AriaRowIndex)
    if(isNaN(index)) {
      const rows = (this.rowGroup || this.table).rows
      return rows.indexOf(this)
    }
    return index
  }

  /**
   * @param {boolean|undefined} selected
   */
  set selected(selected) {
    this.setAttr(_AriaSelected__WEBPACK_IMPORTED_MODULE_4__.AriaSelected, selected)
  }

  /**
   * @returns {boolean|undefined}
   */
  get selected() {
    return this.getAttr(_AriaSelected__WEBPACK_IMPORTED_MODULE_4__.AriaSelected)
  }

  /**
   * @returns {RoleTable|null}
   */
  get table() {
    return this.closest(RoleRow.Table)
  }

  /**
   * @return {RoleGrid|null}
   */
  get grid() {
    return this.closest(RoleRow.Grid)
  }
}

_RoleCell__WEBPACK_IMPORTED_MODULE_5__.RoleCell.Row = RoleRow


/***/ }),
/* 116 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleGroup": () => (/* binding */ RoleGroup)
/* harmony export */ });
/* harmony import */ var _AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(41);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(80);



/**
 * A set of user interface objects which are not intended to be included
 *  in a page summary or table of contents by assistive technologies.
 * @see https://www.w3.org/TR/wai-aria-1.1/#group
 */
class RoleGroup extends _RoleSection__WEBPACK_IMPORTED_MODULE_1__.RoleSection
{
  /**
   * @param {*} activeDescendant
   */
  set activeDescendant(activeDescendant) {
    this.setAttr(_AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__.AriaActiveDescendant, activeDescendant)
  }

  /**
   * @returns {DomElem|null}
   */
  get activeDescendant() {
    return this.getAttr(_AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__.AriaActiveDescendant)
  }
}

RoleGroup.abstract = false


/***/ }),
/* 117 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleRowHeader": () => (/* binding */ RoleRowHeader)
/* harmony export */ });
/* harmony import */ var _AriaSort__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(72);
/* harmony import */ var _RoleCell__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(99);



/**
 * A cell containing header information for a row in a grid.
 * @see https://www.w3.org/TR/wai-aria-1.1/#rowheader
 * @mixes RoleGridCell
 * @mixes RoleSectionHead
 */
class RoleRowHeader extends _RoleCell__WEBPACK_IMPORTED_MODULE_1__.RoleCell
{
  /**
   * @param {string} sort
   */
  set sort(sort) {
    this.setAttr(_AriaSort__WEBPACK_IMPORTED_MODULE_0__.AriaSort, sort)
  }

  /**
   * @returns {string}
   */
  get sort() {
    return this.getAttr(_AriaSort__WEBPACK_IMPORTED_MODULE_0__.AriaSort)
  }
}


/***/ }),
/* 118 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleRowGroup": () => (/* binding */ RoleRowGroup)
/* harmony export */ });
/* harmony import */ var _RoleCell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(99);
/* harmony import */ var _RoleGridCell__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(114);
/* harmony import */ var _RoleRow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(115);
/* harmony import */ var _RoleStructure__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(81);





/**
 * A structure containing one or more row elements in a tabular container.
 * @see https://www.w3.org/TR/wai-aria-1.1/#rowgroup
 */
class RoleRowGroup extends _RoleStructure__WEBPACK_IMPORTED_MODULE_3__.RoleStructure
{
  /**
   * @returns {RoleTable|*|null}
   */
  get table() {
    return this.closest(RoleRowGroup.Table)
  }

  /**
   * @returns {RoleGrid|*|null}
   */
  get grid() {
    return this.closest(RoleRowGroup.Grid)
  }

  /**
   * @returns {RoleCell[]}
   */
  get cells() {
    return this.findAll(_RoleCell__WEBPACK_IMPORTED_MODULE_0__.RoleCell)
  }

  /**
   * @returns {RoleGridCell[]}
   */
  get gridCells() {
    return this.findAll(_RoleGridCell__WEBPACK_IMPORTED_MODULE_1__.RoleGridCell)
  }

  /**
   * @returns {RoleRow[]}
   */
  get rows() {
    return this.findAll(_RoleRow__WEBPACK_IMPORTED_MODULE_2__.RoleRow)
  }
}

RoleRowGroup.abstract = false

_RoleCell__WEBPACK_IMPORTED_MODULE_0__.RoleCell.RowGroup = RoleRowGroup
_RoleRow__WEBPACK_IMPORTED_MODULE_2__.RoleRow.RowGroup = RoleRowGroup


/***/ }),
/* 119 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTable": () => (/* binding */ RoleTable)
/* harmony export */ });
/* harmony import */ var _AriaColCount__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(45);
/* harmony import */ var _AriaRowCount__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67);
/* harmony import */ var _RoleCaption__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(98);
/* harmony import */ var _RoleCell__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(99);
/* harmony import */ var _RoleRow__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(115);
/* harmony import */ var _RoleRowGroup__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(118);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(80);








/**
 * A section containing data arranged in rows and columns.
 * @see https://www.w3.org/TR/wai-aria-1.1/#table
 */
class RoleTable extends _RoleSection__WEBPACK_IMPORTED_MODULE_6__.RoleSection
{
  /**
   * @returns {RoleCaption|*}
   */
  get caption() {
    return this.find(_RoleCaption__WEBPACK_IMPORTED_MODULE_2__.RoleCaption)
  }

  /**
   * @returns {RoleCell[]}
   */
  get cells() {
    return this.findAll(_RoleCell__WEBPACK_IMPORTED_MODULE_3__.RoleCell)
  }

  /**
   * @param {number} colCount
   */
  set colCount(colCount) {
    this.setAttr(_AriaColCount__WEBPACK_IMPORTED_MODULE_0__.AriaColCount, colCount)
  }

  /**
   * @returns {number}
   */
  get colCount() {
    return this.getAttr(_AriaColCount__WEBPACK_IMPORTED_MODULE_0__.AriaColCount)
  }

  /**
   * @param {number} rowCount
   */
  set rowCount(rowCount) {
    this.setAttr(_AriaRowCount__WEBPACK_IMPORTED_MODULE_1__.AriaRowCount, rowCount)
  }

  /**
   * @returns {number}
   */
  get rowCount() {
    return this.getAttr(_AriaRowCount__WEBPACK_IMPORTED_MODULE_1__.AriaRowCount)
  }

  /**
   * @returns {RoleRowGroup[]}
   */
  get rowGroups() {
    return this.findAll(_RoleRowGroup__WEBPACK_IMPORTED_MODULE_5__.RoleRowGroup)
  }

  /**
   * @returns {RoleRow[]}
   */
  get rows() {
    return this.findAll(_RoleRow__WEBPACK_IMPORTED_MODULE_4__.RoleRow)
  }
}

RoleTable.abstract = false

_RoleCaption__WEBPACK_IMPORTED_MODULE_2__.RoleCaption.Table = RoleTable
_RoleCell__WEBPACK_IMPORTED_MODULE_3__.RoleCell.Table = RoleTable
_RoleRow__WEBPACK_IMPORTED_MODULE_4__.RoleRow.Table = RoleTable
_RoleRowGroup__WEBPACK_IMPORTED_MODULE_5__.RoleRowGroup.Table = RoleTable


/***/ }),
/* 120 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleHeading": () => (/* binding */ RoleHeading)
/* harmony export */ });
/* harmony import */ var _AriaLevel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(57);
/* harmony import */ var _RoleSectionHead__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(121);



const DEFAULT_LEVEL = 2

/**
 * A heading for a section of the page.
 * @see https://www.w3.org/TR/wai-aria-1.1/#heading
 */
class RoleHeading extends _RoleSectionHead__WEBPACK_IMPORTED_MODULE_1__.RoleSectionHead
{
  /**
   * @param {number} level
   */
  set level(level) {
    this.setAttr(_AriaLevel__WEBPACK_IMPORTED_MODULE_0__.AriaLevel, level)
  }

  /**
   * @returns {number}
   */
  get level() {
    return this.getAttr(_AriaLevel__WEBPACK_IMPORTED_MODULE_0__.AriaLevel) || DEFAULT_LEVEL
  }
}

RoleHeading.abstract = false


/***/ }),
/* 121 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSectionHead": () => (/* binding */ RoleSectionHead)
/* harmony export */ });
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(51);
/* harmony import */ var _RoleStructure__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(81);



/**
 * A structure that labels or summarizes the topic of its related section.
 * @see https://www.w3.org/TR/wai-aria-1.1/#sectionhead
 * @abstract
 */
class RoleSectionHead extends _RoleStructure__WEBPACK_IMPORTED_MODULE_1__.RoleStructure
{
  /**
   * @param {boolean|undefined} expanded
   */
  set expanded(expanded) {
    this.setAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded, expanded)
  }

  /**
   * @returns {boolean|undefined}
   */
  get expanded() {
    return this.getAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded)
  }
}


/***/ }),
/* 122 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleImg": () => (/* binding */ RoleImg)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(80);


/**
 * A container for a collection of elements that form an image.
 * @see https://www.w3.org/TR/wai-aria-1.1/#img
 */
class RoleImg extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleImg.abstract = false


/***/ }),
/* 123 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleLink": () => (/* binding */ RoleLink)
/* harmony export */ });
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(51);
/* harmony import */ var _RoleCommand__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(95);



/**
 * An interactive reference to an internal or external resource that,
 *  when activated, causes the user agent to navigate to that resource.
 * @see https://www.w3.org/TR/wai-aria-1.1/#link
 */
class RoleLink extends _RoleCommand__WEBPACK_IMPORTED_MODULE_1__.RoleCommand
{
  /**
   * @param {boolean|undefined} expanded
   */
  set expanded(expanded) {
    this.setAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded, expanded)
  }

  /**
   * @returns {boolean|undefined}
   */
  get expanded() {
    return this.getAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded)
  }
}

RoleLink.abstract = false


/***/ }),
/* 124 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleListBox": () => (/* binding */ RoleListBox)
/* harmony export */ });
/* harmony import */ var _AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(60);
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(65);
/* harmony import */ var _AriaRequired__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(66);
/* harmony import */ var _RoleOption__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(125);
/* harmony import */ var _RoleSelect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(126);






/**
 * A widget that allows the user to select one or more items from a list of choices.
 * @see https://www.w3.org/TR/wai-aria-1.1/#listbox
 */
class RoleListBox extends _RoleSelect__WEBPACK_IMPORTED_MODULE_4__.RoleSelect
{
  /**
   * @param {boolean} multiSelectable
   */
  set multiSelectable(multiSelectable) {
    this.setAttr(_AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_0__.AriaMultiSelectable, multiSelectable)
  }

  /**
   * @returns {boolean}
   */
  get multiSelectable() {
    return this.getAttr(_AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_0__.AriaMultiSelectable)
  }

  /**
   * @param {RoleOption[]} options
   */
  set options(options) {
    this.children = options
  }

  /**
   * @returns {RoleOption[]}
   */
  get options() {
    return this.findAll(_RoleOption__WEBPACK_IMPORTED_MODULE_3__.RoleOption)
  }

  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    super.orientation = orientation
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return super.orientation || 'vertical'
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_1__.AriaReadOnly, readOnly)
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_1__.AriaReadOnly)
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(_AriaRequired__WEBPACK_IMPORTED_MODULE_2__.AriaRequired, required)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(_AriaRequired__WEBPACK_IMPORTED_MODULE_2__.AriaRequired)
  }

  /**
   * @returns {RoleOption[]}
   */
  get selectedOptions() {
    return this.findAll(_RoleOption__WEBPACK_IMPORTED_MODULE_3__.RoleOption, ({ selected }) => selected)
  }

  /**
   * @returns {RoleOption[]}
   */
  get checkedOptions() {
    return this.findAll(_RoleOption__WEBPACK_IMPORTED_MODULE_3__.RoleOption, ({ checked }) => checked)
  }
}

RoleListBox.abstract = false


/***/ }),
/* 125 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleOption": () => (/* binding */ RoleOption)
/* harmony export */ });
/* harmony import */ var _AriaChecked__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43);
/* harmony import */ var _AriaPosInSet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(63);
/* harmony import */ var _AriaSelected__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(70);
/* harmony import */ var _AriaSetSize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(71);
/* harmony import */ var _RoleInput__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(101);
/* harmony import */ var _RoleListBox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(124);







/**
 * A selectable item in a select list.
 * @see https://www.w3.org/TR/wai-aria-1.1/#option
 */
class RoleOption extends _RoleInput__WEBPACK_IMPORTED_MODULE_4__.RoleInput
{
  /**
   * @param {boolean|string|undefined} checked
   */
  set checked(checked) {
    this.setAttr(_AriaChecked__WEBPACK_IMPORTED_MODULE_0__.AriaChecked, checked)
  }

  /**
   * @returns {boolean|string|undefined}
   */
  get checked() {
    return this.getAttr(_AriaChecked__WEBPACK_IMPORTED_MODULE_0__.AriaChecked)
  }

  /**
   * @returns {RoleListBox|*|null}
   */
  get listBox() {
    return this.closest(_RoleListBox__WEBPACK_IMPORTED_MODULE_5__.RoleListBox)
  }

  /**
   * @param {number} posInSet
   */
  set posInSet(posInSet) {
    this.setAttr(_AriaPosInSet__WEBPACK_IMPORTED_MODULE_1__.AriaPosInSet, posInSet)
  }

  /**
   * @returns {number}
   */
  get posInSet() {
    return this.getAttr(_AriaPosInSet__WEBPACK_IMPORTED_MODULE_1__.AriaPosInSet)
  }

  /**
   * @param {boolean} selected
   */
  set selected(selected) {
    this.setAttr(_AriaSelected__WEBPACK_IMPORTED_MODULE_2__.AriaSelected, selected)
  }

  /**
   * @returns {boolean}
   */
  get selected() {
    return this.getAttr(_AriaSelected__WEBPACK_IMPORTED_MODULE_2__.AriaSelected) || false
  }

  /**
   * @param {number} setSize
   */
  set setSize(setSize) {
    this.setAttr(_AriaSetSize__WEBPACK_IMPORTED_MODULE_3__.AriaSetSize, setSize)
  }

  /**
   * @returns {number}
   */
  get setSize() {
    return this.getAttr(_AriaSetSize__WEBPACK_IMPORTED_MODULE_3__.AriaSetSize)
  }
}

RoleOption.abstract = false


/***/ }),
/* 126 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSelect": () => (/* binding */ RoleSelect)
/* harmony export */ });
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(51);
/* harmony import */ var _AriaOrientation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(61);
/* harmony import */ var _RoleComposite__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(106);




/**
 * A form widget that allows the user to make selections from a set of choices.
 * @see https://www.w3.org/TR/wai-aria-1.1/#select
 * @mixes RoleGroup
 * @abstract
 */
class RoleSelect extends _RoleComposite__WEBPACK_IMPORTED_MODULE_2__.RoleComposite
{
  /**
   * @param {boolean|undefined} expanded
   */
  set expanded(expanded) {
    this.setAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded, expanded)
  }

  /**
   * @returns {boolean|undefined}
   */
  get expanded() {
    return this.getAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded)
  }

  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    this.setAttr(_AriaOrientation__WEBPACK_IMPORTED_MODULE_1__.AriaOrientation, orientation)
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return this.getAttr(_AriaOrientation__WEBPACK_IMPORTED_MODULE_1__.AriaOrientation)
  }
}


/***/ }),
/* 127 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleLog": () => (/* binding */ RoleLog)
/* harmony export */ });
/* harmony import */ var _AriaLive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(80);



/**
 * A type of live region where new information is added
 *  in meaningful order and old information may disappear.
 * @see https://www.w3.org/TR/wai-aria-1.1/#log
 */
class RoleLog extends _RoleSection__WEBPACK_IMPORTED_MODULE_1__.RoleSection
{
  /**
   * @param {string} live
   */
  set live(live) {
    super.live = live
  }

  /**
   * @returns {string}
   */
  get live() {
    return this.hasAttr(_AriaLive__WEBPACK_IMPORTED_MODULE_0__.AriaLive)? super.live : 'polite'
  }
}

RoleLog.abstract = false


/***/ }),
/* 128 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleMarquee": () => (/* binding */ RoleMarquee)
/* harmony export */ });
/* harmony import */ var _AriaLive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(80);



/**
 * A type of live region where non-essential information changes frequently.
 * @see https://www.w3.org/TR/wai-aria-1.1/#marquee
 */
class RoleMarquee extends _RoleSection__WEBPACK_IMPORTED_MODULE_1__.RoleSection
{
  /**
   * @param {string} live
   */
  set live(live) {
    super.live = live
  }

  /**
   * @returns {string}
   */
  get live() {
    return this.hasAttr(_AriaLive__WEBPACK_IMPORTED_MODULE_0__.AriaLive)? super.live : 'off'
  }
}

RoleMarquee.abstract = false


/***/ }),
/* 129 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleMath": () => (/* binding */ RoleMath)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(80);


/**
 * Content that represents a mathematical expression.
 * @see https://www.w3.org/TR/wai-aria-1.1/#math
 */
class RoleMath extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleMath.abstract = false


/***/ }),
/* 130 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleMenu": () => (/* binding */ RoleMenu)
/* harmony export */ });
/* harmony import */ var _RoleGroup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(116);
/* harmony import */ var _RoleMenuItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(131);
/* harmony import */ var _RoleSelect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(126);




/**
 * A type of widget that offers a list of choices to the user.
 * @see https://www.w3.org/TR/wai-aria-1.1/#menu
 */
class RoleMenu extends _RoleSelect__WEBPACK_IMPORTED_MODULE_2__.RoleSelect
{
  /**
   * @returns {RoleMenuItem[]}
   */
  get items() {
    return this.findAll(_RoleMenuItem__WEBPACK_IMPORTED_MODULE_1__.RoleMenuItem, item => item.parentMenu === this)
  }

  /**
   * @param {RoleMenuItem[]} items
   */
  set items(items) {
    this.children = items
  }

  /**
   * @returns {RoleGroup[]}
   */
  get groups() {
    return this.findAll(_RoleGroup__WEBPACK_IMPORTED_MODULE_0__.RoleGroup, group => {
      const menu = group.closest(RoleMenu)
      return !menu || menu === this
    })
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return super.orientation || 'vertical'
  }

  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    super.orientation = orientation
  }
}

RoleMenu.abstract = false


/***/ }),
/* 131 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleMenuItem": () => (/* binding */ RoleMenuItem)
/* harmony export */ });
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(51);
/* harmony import */ var _RoleCommand__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(95);
/* harmony import */ var _RoleMenu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(130);




/**
 * An option in a set of choices contained by a menu or menubar.
 * @see https://www.w3.org/TR/wai-aria-1.1/#menuitem
 */
class RoleMenuItem extends _RoleCommand__WEBPACK_IMPORTED_MODULE_1__.RoleCommand
{
  /**
   * @param {boolean|undefined} expanded
   */
  set expanded(expanded) {
    this.setAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded, expanded)
  }

  /**
   * @returns {boolean|undefined}
   */
  get expanded() {
    return this.getAttr(_AriaExpanded__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded)
  }

  /**
   * @returns {RoleMenuBar|null}
   */
  get menuBar() {
    return this.closest(RoleMenuItem.MenuBar)
  }

  /**
   * @returns {RoleMenuBar|RoleMenu|null}
   */
  get parentMenu() {
    return this.closest(_RoleMenu__WEBPACK_IMPORTED_MODULE_2__.RoleMenu)
  }
}

RoleMenuItem.abstract = false


/***/ }),
/* 132 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleMenuBar": () => (/* binding */ RoleMenuBar)
/* harmony export */ });
/* harmony import */ var _AriaOrientation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(61);
/* harmony import */ var _RoleMenu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(130);
/* harmony import */ var _RoleMenuItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(131);




/**
 * A presentation of menu that usually remains visible
 *  and is usually presented horizontally.
 * @see https://www.w3.org/TR/wai-aria-1.1/#menubar
 */
class RoleMenuBar extends _RoleMenu__WEBPACK_IMPORTED_MODULE_1__.RoleMenu
{
  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    super.orientation = orientation
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return this.hasAttr(_AriaOrientation__WEBPACK_IMPORTED_MODULE_0__.AriaOrientation)? this.getAttr(_AriaOrientation__WEBPACK_IMPORTED_MODULE_0__.AriaOrientation) : 'horizontal'
  }
}

_RoleMenuItem__WEBPACK_IMPORTED_MODULE_2__.RoleMenuItem.MenuBar = RoleMenuBar


/***/ }),
/* 133 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleMenuItemCheckBox": () => (/* binding */ RoleMenuItemCheckBox)
/* harmony export */ });
/* harmony import */ var _AriaChecked__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43);
/* harmony import */ var _RoleMenuItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(131);



/**
 * A menuitem with a checkable state whose possible values are true, false, or mixed.
 * @see https://www.w3.org/TR/wai-aria-1.1/#menuitemcheckbox
 * @mixes RoleCheckBox
 */
class RoleMenuItemCheckBox extends _RoleMenuItem__WEBPACK_IMPORTED_MODULE_1__.RoleMenuItem
{
  /**
   * @param {boolean} checked
   */
  set checked(checked) {
    this.setAttr(_AriaChecked__WEBPACK_IMPORTED_MODULE_0__.AriaChecked, checked)
  }

  /**
   * @returns {boolean}
   */
  get checked() {
    return this.getAttr(_AriaChecked__WEBPACK_IMPORTED_MODULE_0__.AriaChecked) || false
  }
}


/***/ }),
/* 134 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleMenuItemRadio": () => (/* binding */ RoleMenuItemRadio)
/* harmony export */ });
/* harmony import */ var _RoleMenuItemCheckBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(133);


/**
 * A checkable menuitem in a set of elements with the same role,
 *  only one of which can be checked at a time.
 * @see https://www.w3.org/TR/wai-aria-1.1/#menuitemradio
 * @mixes RoleRadio
 */
class RoleMenuItemRadio extends _RoleMenuItemCheckBox__WEBPACK_IMPORTED_MODULE_0__.RoleMenuItemCheckBox
{
}


/***/ }),
/* 135 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleNavigation": () => (/* binding */ RoleNavigation)
/* harmony export */ });
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(88);


/**
 * A collection of navigational elements (usually links)
 *  for navigating the document or related documents.
 * @see https://www.w3.org/TR/wai-aria-1.1/#navigation
 */
class RoleNavigation extends _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__.RoleLandmark
{
}

RoleNavigation.abstract = false


/***/ }),
/* 136 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleNone": () => (/* binding */ RoleNone)
/* harmony export */ });
/* harmony import */ var _Role__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(78);


/**
 * An element whose implicit native role semantics will not be mapped to the accessibility API.
 * @see https://www.w3.org/TR/wai-aria-1.1/#none
 */
class RoleNone extends _Role__WEBPACK_IMPORTED_MODULE_0__.Role
{
}

RoleNone.abstract = false


/***/ }),
/* 137 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleNote": () => (/* binding */ RoleNote)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(80);


/**
 * A section whose content is parenthetic or ancillary to the main content of the resource.
 * @see https://www.w3.org/TR/wai-aria-1.1/#note
 */
class RoleNote extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleNote.abstract = false


/***/ }),
/* 138 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleParagraph": () => (/* binding */ RoleParagraph)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(80);


/**
 * A paragraph of content.
 * @see https://www.w3.org/TR/wai-aria-1.2/#paragraph
 */
class RoleParagraph extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleParagraph.abstract = false


/***/ }),
/* 139 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RolePresentation": () => (/* binding */ RolePresentation)
/* harmony export */ });
/* harmony import */ var _RoleStructure__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81);


/**
 * An element whose implicit native role semantics will not be mapped to the accessibility API.
 * @see https://www.w3.org/TR/wai-aria-1.1/#presentation
 */
class RolePresentation extends _RoleStructure__WEBPACK_IMPORTED_MODULE_0__.RoleStructure
{
}

RolePresentation.abstract = false


/***/ }),
/* 140 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleProgressBar": () => (/* binding */ RoleProgressBar)
/* harmony export */ });
/* harmony import */ var _RoleRange__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(141);


/**
 * An element that displays the progress status for tasks that take a long time.
 * @see https://www.w3.org/TR/wai-aria-1.1/#progressbar
 */
class RoleProgressBar extends _RoleRange__WEBPACK_IMPORTED_MODULE_0__.RoleRange
{
}

RoleProgressBar.abstract = false


/***/ }),
/* 141 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleRange": () => (/* binding */ RoleRange)
/* harmony export */ });
/* harmony import */ var _AriaValueMax__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(74);
/* harmony import */ var _AriaValueMin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(75);
/* harmony import */ var _AriaValueNow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(76);
/* harmony import */ var _AriaValueText__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(77);
/* harmony import */ var _RoleWidget__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(96);






/**
 * An input representing a range of values that can be set by the user.
 * @see https://www.w3.org/TR/wai-aria-1.1/#range
 * @abstract
 */
class RoleRange extends _RoleWidget__WEBPACK_IMPORTED_MODULE_4__.RoleWidget
{
  /**
   * @param {number} valueMax
   */
  set valueMax(valueMax) {
    this.setAttr(_AriaValueMax__WEBPACK_IMPORTED_MODULE_0__.AriaValueMax, valueMax)
  }

  /**
   * @returns {number}
   */
  get valueMax() {
    return this.getAttr(_AriaValueMax__WEBPACK_IMPORTED_MODULE_0__.AriaValueMax)
  }

  /**
   * @param {number} valueMin
   */
  set valueMin(valueMin) {
    this.setAttr(_AriaValueMin__WEBPACK_IMPORTED_MODULE_1__.AriaValueMin, valueMin)
  }

  /**
   * @returns {number}
   */
  get valueMin() {
    return this.getAttr(_AriaValueMin__WEBPACK_IMPORTED_MODULE_1__.AriaValueMin)
  }

  /**
   * @param {number} valueNow
   */
  set valueNow(valueNow) {
    this.setAttr(_AriaValueNow__WEBPACK_IMPORTED_MODULE_2__.AriaValueNow, valueNow)
  }

  /**
   * @returns {number}
   */
  get valueNow() {
    return this.getAttr(_AriaValueNow__WEBPACK_IMPORTED_MODULE_2__.AriaValueNow)
  }

  /**
   * @param {string} valueText
   */
  set valueText(valueText) {
    this.setAttr(_AriaValueText__WEBPACK_IMPORTED_MODULE_3__.AriaValueText, valueText)
  }

  /**
   * @returns {string}
   */
  get valueText() {
    return this.getAttr(_AriaValueText__WEBPACK_IMPORTED_MODULE_3__.AriaValueText)
  }
}


/***/ }),
/* 142 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleRadio": () => (/* binding */ RoleRadio)
/* harmony export */ });
/* harmony import */ var _AriaChecked__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43);
/* harmony import */ var _RoleInput__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(101);
/* harmony import */ var _RoleRadioGroup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(143);




/**
 * A checkable input in a group of elements with the same role,
 *  only one of which can be checked at a time.
 * @see https://www.w3.org/TR/wai-aria-1.1/#radio
 */
class RoleRadio extends _RoleInput__WEBPACK_IMPORTED_MODULE_1__.RoleInput
{
  /**
   * @param {boolean} checked
   */
  set checked(checked) {
    this.setAttr(_AriaChecked__WEBPACK_IMPORTED_MODULE_0__.AriaChecked, checked)
  }

  /**
   * @returns {boolean}
   */
  get checked() {
    return this.getAttr(_AriaChecked__WEBPACK_IMPORTED_MODULE_0__.AriaChecked) || false
  }

  /**
   * @returns {RoleRadioGroup|*|null}
   */
  get group() {
    return this.closest(_RoleRadioGroup__WEBPACK_IMPORTED_MODULE_2__.RoleRadioGroup)
  }
}

RoleRadio.abstract = false


/***/ }),
/* 143 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleRadioGroup": () => (/* binding */ RoleRadioGroup)
/* harmony export */ });
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(65);
/* harmony import */ var _AriaRequired__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(66);
/* harmony import */ var _RoleSelect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(126);
/* harmony import */ var _RoleRadio__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(142);





/**
 * A group of radio buttons.
 * @see https://www.w3.org/TR/wai-aria-1.1/#radiogroup
 */
class RoleRadioGroup extends _RoleSelect__WEBPACK_IMPORTED_MODULE_2__.RoleSelect
{
  /**
   * @returns {RoleRadio[]}
   */
  get radios() {
    return this.findAll(_RoleRadio__WEBPACK_IMPORTED_MODULE_3__.RoleRadio)
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_0__.AriaReadOnly, readOnly)
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_0__.AriaReadOnly)
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(_AriaRequired__WEBPACK_IMPORTED_MODULE_1__.AriaRequired, required)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(_AriaRequired__WEBPACK_IMPORTED_MODULE_1__.AriaRequired)
  }
}

RoleRadioGroup.abstract = false


/***/ }),
/* 144 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleRegion": () => (/* binding */ RoleRegion)
/* harmony export */ });
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(88);


/**
 * A perceivable section containing content that is relevant to a specific, author-specified
 *  purpose and sufficiently important that users will likely want to be able to navigate
 *  to the section easily and to have it listed in a summary of the page.
 * @see https://www.w3.org/TR/wai-aria-1.1/#region
 */
class RoleRegion extends _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__.RoleLandmark
{
}

RoleRegion.abstract = false


/***/ }),
/* 145 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleScrollBar": () => (/* binding */ RoleScrollBar)
/* harmony export */ });
/* harmony import */ var _AriaOrientation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(61);
/* harmony import */ var _RoleRange__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(141);



const DEFAULT_VALUE_MAX = 100
const DEFAULT_VALUE_MIN = 0

/**
 * A graphical object that controls the scrolling of content within a viewing area,
 *  regardless of whether the content is fully displayed within the viewing area.
 * @see https://www.w3.org/TR/wai-aria-1.1/#scrollbar
 */
class RoleScrollBar extends _RoleRange__WEBPACK_IMPORTED_MODULE_1__.RoleRange
{
  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    this.setAttr(_AriaOrientation__WEBPACK_IMPORTED_MODULE_0__.AriaOrientation, orientation)
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return this.getAttr(_AriaOrientation__WEBPACK_IMPORTED_MODULE_0__.AriaOrientation) || 'vertical'
  }

  /**
   * @param {number} valueMax
   */
  set valueMax(valueMax) {
    super.valueMax = valueMax
  }

  /**
   * @returns {number}
   */
  get valueMax() {
    const value = super.valueMax
    return value === null? DEFAULT_VALUE_MAX : value
  }

  /**
   * @param {number} valueMin
   */
  set valueMin(valueMin) {
    super.valueMin = valueMin
  }

  /**
   * @returns {number}
   */
  get valueMin() {
    const value = super.valueMin
    return value === null? DEFAULT_VALUE_MIN : value
  }

  /**
   * @param {number} valueNow
   */
  set valueNow(valueNow) {
    super.valueNow = valueNow
  }

  /**
   * @returns {number}
   */
  get valueNow() {
    const { valueMin, valueMax } = this
    const valueNow = super.valueNow
    if(valueNow === null) {
      return valueMin + (valueMax - valueMin) / 2
    }
    return Math.min(Math.max(valueMin, valueNow), valueMax)
  }
}


/***/ }),
/* 146 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSearch": () => (/* binding */ RoleSearch)
/* harmony export */ });
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(88);


/**
 * A landmark region that contains a collection of items and objects that,
 *  as a whole, combine to create a search facility.
 * @see https://www.w3.org/TR/wai-aria-1.1/#search
 */
class RoleSearch extends _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__.RoleLandmark
{
}

RoleSearch.abstract = false


/***/ }),
/* 147 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSearchBox": () => (/* binding */ RoleSearchBox)
/* harmony export */ });
/* harmony import */ var _RoleTextBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(104);


/**
 * A type of textbox intended for specifying search criteria.
 * @see https://www.w3.org/TR/wai-aria-1.1/#searchbox
 */
class RoleSearchBox extends _RoleTextBox__WEBPACK_IMPORTED_MODULE_0__.RoleTextBox
{
}


/***/ }),
/* 148 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSeparator": () => (/* binding */ RoleSeparator)
/* harmony export */ });
/* harmony import */ var _RoleStructure__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81);


/**
 * A divider that separates and distinguishes sections of content or groups of menuitems.
 * @see https://www.w3.org/TR/wai-aria-1.1/#separator
 * @mixes RoleWidget
 */
class RoleSeparator extends _RoleStructure__WEBPACK_IMPORTED_MODULE_0__.RoleStructure
{
}

RoleSeparator.abstract = false


/***/ }),
/* 149 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSlider": () => (/* binding */ RoleSlider)
/* harmony export */ });
/* harmony import */ var _AriaOrientation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(61);
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(65);
/* harmony import */ var _RoleRange__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(141);




const DEFAULT_VALUE_MIN = 0
const DEFAULT_VALUE_MAX = 100

/**
 * A user input where the user selects a value from within a given range.
 * @see https://www.w3.org/TR/wai-aria-1.1/#slider
 * @see https://www.w3.org/TR/wai-aria-practices-1.1/#slider
 * @mixes RoleInput
 */
class RoleSlider extends _RoleRange__WEBPACK_IMPORTED_MODULE_2__.RoleRange
{
  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    this.setAttr(_AriaOrientation__WEBPACK_IMPORTED_MODULE_0__.AriaOrientation, orientation)
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return this.getAttr(_AriaOrientation__WEBPACK_IMPORTED_MODULE_0__.AriaOrientation) || 'horizontal'
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_1__.AriaReadOnly, readOnly)
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_1__.AriaReadOnly)
  }

  /**
   * @param {number} valueMin
   */
  set valueMin(valueMin) {
    super.valueMin = valueMin
  }

  /**
   * @returns {number}
   */
  get valueMin() {
    const value = super.valueMin
    return value === null? DEFAULT_VALUE_MIN : value
  }

  /**
   * @param {number} valueMax
   */
  set valueMax(valueMax) {
    super.valueMax = valueMax
  }

  /**
   * @returns {number}
   */
  get valueMax() {
    const value = super.valueMax
    return value === null? DEFAULT_VALUE_MAX : value
  }

  /**
   * @param {number} valueNow
   */
  set valueNow(valueNow) {
    super.valueNow = valueNow
  }

  /**
   * @returns {number}
   */
  get valueNow() {
    const { valueMin, valueMax } = this
    const valueNow = super.valueNow
    if(valueNow === null) {
      return valueMin + (valueMax - valueMin) / 2
    }
    return Math.min(Math.max(valueMin, valueNow), valueMax)
  }
}

RoleSlider.abstract = false


/***/ }),
/* 150 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSpinButton": () => (/* binding */ RoleSpinButton)
/* harmony export */ });
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(65);
/* harmony import */ var _AriaRequired__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(66);
/* harmony import */ var _RoleRange__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(141);




/**
 * A form of range that expects the user to select from among discrete choices.
 * @see https://www.w3.org/TR/wai-aria-1.1/#spinbutton
 * @mixes RoleComposite
 * @mixes RoleInput
 */
class RoleSpinButton extends _RoleRange__WEBPACK_IMPORTED_MODULE_2__.RoleRange
{
  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_0__.AriaReadOnly, readOnly)
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(_AriaReadOnly__WEBPACK_IMPORTED_MODULE_0__.AriaReadOnly)
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(_AriaRequired__WEBPACK_IMPORTED_MODULE_1__.AriaRequired, required)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(_AriaRequired__WEBPACK_IMPORTED_MODULE_1__.AriaRequired)
  }

  /**
   * @param {number} valueMin
   */
  set valueMin(valueMin) {
    super.valueMin = valueMin
  }

  /**
   * @returns {number}
   */
  get valueMin() {
    const valueMin = super.valueMin
    return valueMin === null? -Infinity : valueMin
  }

  /**
   * @param {number} valueMax
   */
  set valueMax(valueMax) {
    super.valueMax = valueMax
  }

  /**
   * @returns {number}
   */
  get valueMax() {
    const valueMax = super.valueMax
    return valueMax === null? Infinity : valueMax
  }
}

RoleSpinButton.abstract = false


/***/ }),
/* 151 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleStatus": () => (/* binding */ RoleStatus)
/* harmony export */ });
/* harmony import */ var _AriaAtomic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _AriaLive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(28);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(80);




/**
 * A type of live region whose content is advisory information
 *  for the user but is not important enough to justify an alert,
 *  often but not necessarily presented as a status bar.
 * @see https://www.w3.org/TR/wai-aria-1.1/#status
 */
class RoleStatus extends _RoleSection__WEBPACK_IMPORTED_MODULE_2__.RoleSection
{
  /**
   * @param {string} live
   */
  set live(live) {
    super.live = live
  }

  /**
   * @returns {string}
   */
  get live() {
    return this.hasAttr(_AriaLive__WEBPACK_IMPORTED_MODULE_1__.AriaLive)? super.live : 'polite'
  }

  /**
   * @param {boolean} atomic
   */
  set atomic(atomic) {
    super.atomic = atomic
  }

  /**
   * @returns {boolean}
   */
  get atomic() {
    return this.hasAttr(_AriaAtomic__WEBPACK_IMPORTED_MODULE_0__.AriaAtomic)? super.atomic : true
  }
}

RoleStatus.abstract = false


/***/ }),
/* 152 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSwitch": () => (/* binding */ RoleSwitch)
/* harmony export */ });
/* harmony import */ var _RoleCheckBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(100);


/**
 * A type of checkbox that represents on/off values,
 *  as opposed to checked/unchecked values.
 * @see https://www.w3.org/TR/wai-aria-1.1/#switch
 */
class RoleSwitch extends _RoleCheckBox__WEBPACK_IMPORTED_MODULE_0__.RoleCheckBox
{
}


/***/ }),
/* 153 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTab": () => (/* binding */ RoleTab)
/* harmony export */ });
/* harmony import */ var _AriaPosInSet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63);
/* harmony import */ var _AriaSelected__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(70);
/* harmony import */ var _AriaSetSize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(71);
/* harmony import */ var _RoleWidget__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(96);





/**
 * A grouping label providing a mechanism for selecting
 *  the tab content that is to be rendered to the user.
 * @see https://www.w3.org/TR/wai-aria-1.1/#tab
 * @mixes RoleSectionHead
 */
class RoleTab extends _RoleWidget__WEBPACK_IMPORTED_MODULE_3__.RoleWidget
{
  /**
   * @param {number|null} posInSet
   */
  set posInSet(posInSet) {
    this.setAttr(_AriaPosInSet__WEBPACK_IMPORTED_MODULE_0__.AriaPosInSet, posInSet)
  }

  /**
   * @returns {number|null}
   */
  get posInSet() {
    return this.getAttr(_AriaPosInSet__WEBPACK_IMPORTED_MODULE_0__.AriaPosInSet)
  }

  /**
   * @param {boolean} selected
   */
  set selected(selected) {
    this.setAttr(_AriaSelected__WEBPACK_IMPORTED_MODULE_1__.AriaSelected, selected)
  }

  /**
   * @returns {boolean}
   */
  get selected() {
    return this.getAttr(_AriaSelected__WEBPACK_IMPORTED_MODULE_1__.AriaSelected) || false
  }

  /**
   * @param {number|null} setSize
   */
  set setSize(setSize) {
    this.setAttr(_AriaSetSize__WEBPACK_IMPORTED_MODULE_2__.AriaSetSize, setSize)
  }

  /**
   * @returns {number|null}
   */
  get setSize() {
    return this.getAttr(_AriaSetSize__WEBPACK_IMPORTED_MODULE_2__.AriaSetSize)
  }
}

RoleTab.abstract = false


/***/ }),
/* 154 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTabList": () => (/* binding */ RoleTabList)
/* harmony export */ });
/* harmony import */ var _AriaLevel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(57);
/* harmony import */ var _AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(60);
/* harmony import */ var _AriaOrientation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(61);
/* harmony import */ var _RoleComposite__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(106);
/* harmony import */ var _RoleTab__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(153);






/**
 * A list of tab elements, which are references to tabpanel elements.
 * @see https://www.w3.org/TR/wai-aria-1.1/#tablist
 */
class RoleTabList extends _RoleComposite__WEBPACK_IMPORTED_MODULE_3__.RoleComposite
{
  /**
   * @param {number} level
   */
  set level(level) {
    this.setAttr(_AriaLevel__WEBPACK_IMPORTED_MODULE_0__.AriaLevel, level)
  }

  /**
   * @returns {number}
   */
  get level() {
    return this.getAttr(_AriaLevel__WEBPACK_IMPORTED_MODULE_0__.AriaLevel)
  }

  /**
   * @param {boolean} multiSelectable
   */
  set multiSelectable(multiSelectable) {
    this.setAttr(_AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_1__.AriaMultiSelectable, multiSelectable)
  }

  /**
   * @returns {boolean}
   */
  get multiSelectable() {
    return this.getAttr(_AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_1__.AriaMultiSelectable)
  }

  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    this.setAttr(_AriaOrientation__WEBPACK_IMPORTED_MODULE_2__.AriaOrientation, orientation)
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return this.getAttr(_AriaOrientation__WEBPACK_IMPORTED_MODULE_2__.AriaOrientation) || 'horizontal'
  }

  /**
   * @returns {RoleTab|*}
   */
  get selectedTab() {
    return this.find(_RoleTab__WEBPACK_IMPORTED_MODULE_4__.RoleTab, ({ selected }) => selected)
  }

  /**
   * @returns {RoleTab[]}
   */
  get tabs() {
    return this.findAll(_RoleTab__WEBPACK_IMPORTED_MODULE_4__.RoleTab)
  }
}

RoleTabList.abstract = false


/***/ }),
/* 155 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTabPanel": () => (/* binding */ RoleTabPanel)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(80);


/**
 * A container for the resources associated with a tab,
 *  where each tab is contained in a tablist.
 * @see https://www.w3.org/TR/wai-aria-1.1/#tabpanel
 */
class RoleTabPanel extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleTabPanel.abstract = false


/***/ }),
/* 156 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTerm": () => (/* binding */ RoleTerm)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(80);


/**
 * A word or phrase with a corresponding definition.
 * @see https://www.w3.org/TR/wai-aria-1.1/#term
 */
class RoleTerm extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleTerm.abstract = false


/***/ }),
/* 157 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTimer": () => (/* binding */ RoleTimer)
/* harmony export */ });
/* harmony import */ var _AriaLive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);
/* harmony import */ var _RoleStatus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(151);



/**
 * A type of live region containing a numerical counter which indicates an amount
 *  of elapsed time from a start point, or the time remaining until an end point.
 * @see https://www.w3.org/TR/wai-aria-1.1/#timer
 */
class RoleTimer extends _RoleStatus__WEBPACK_IMPORTED_MODULE_1__.RoleStatus
{
  /**
   * @param {string} live
   */
  set live(live) {
    super.live = live
  }

  /**
   * @returns {string}
   */
  get live() {
    return this.hasAttr(_AriaLive__WEBPACK_IMPORTED_MODULE_0__.AriaLive)? super.live : 'off'
  }
}


/***/ }),
/* 158 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleToolBar": () => (/* binding */ RoleToolBar)
/* harmony export */ });
/* harmony import */ var _AriaOrientation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(61);
/* harmony import */ var _RoleGroup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(116);



/**
 * A collection of commonly used function buttons
 *  or controls represented in compact visual form.
 * @see https://www.w3.org/TR/wai-aria-1.1/#toolbar
 */
class RoleToolBar extends _RoleGroup__WEBPACK_IMPORTED_MODULE_1__.RoleGroup
{
  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    this.setAttr(_AriaOrientation__WEBPACK_IMPORTED_MODULE_0__.AriaOrientation, orientation)
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return this.getAttr(_AriaOrientation__WEBPACK_IMPORTED_MODULE_0__.AriaOrientation) || 'horizontal'
  }
}


/***/ }),
/* 159 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleToolTip": () => (/* binding */ RoleToolTip)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(80);


/**
 * A contextual popup that displays a description for an element.
 * @see https://www.w3.org/TR/wai-aria-1.1/#tooltip
 */
class RoleToolTip extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleToolTip.abstract = false


/***/ }),
/* 160 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTree": () => (/* binding */ RoleTree)
/* harmony export */ });
/* harmony import */ var _AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(60);
/* harmony import */ var _AriaRequired__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(66);
/* harmony import */ var _RoleSelect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(126);
/* harmony import */ var _RoleTreeItem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(161);





/**
 * A type of select that may contain sub-level
 *  nested groups that can be collapsed and expanded.
 * @see https://www.w3.org/TR/wai-aria-1.1/#tree
 */
class RoleTree extends _RoleSelect__WEBPACK_IMPORTED_MODULE_2__.RoleSelect
{
  /**
   * @param {boolean} multiSelectable
   */
  set multiSelectable(multiSelectable) {
    this.setAttr(_AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_0__.AriaMultiSelectable, multiSelectable)
  }

  /**
   * @returns {boolean}
   */
  get multiSelectable() {
    return this.getAttr(_AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_0__.AriaMultiSelectable)
  }

  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    super.orientation = orientation
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return super.orientation || 'vertical'
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(_AriaRequired__WEBPACK_IMPORTED_MODULE_1__.AriaRequired, required)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(_AriaRequired__WEBPACK_IMPORTED_MODULE_1__.AriaRequired)
  }

  /**
   * @returns {RoleTreeItem[]}
   */
  get items() {
    return this.findAll(_RoleTreeItem__WEBPACK_IMPORTED_MODULE_3__.RoleTreeItem)
  }
}

RoleTree.abstract = false


/***/ }),
/* 161 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTreeItem": () => (/* binding */ RoleTreeItem)
/* harmony export */ });
/* harmony import */ var _AriaChecked__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43);
/* harmony import */ var _AriaSelected__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(70);
/* harmony import */ var _RoleGroup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(116);
/* harmony import */ var _RoleListItem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(110);
/* harmony import */ var _RoleTree__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(160);






/**
 * An option item of a tree. This is an element within a tree that may be expanded
 *  or collapsed if it contains a sub-level group of tree item elements.
 * @see https://www.w3.org/TR/wai-aria-1.1/#treeitem
 * @mixes RoleOption
 */
class RoleTreeItem extends _RoleListItem__WEBPACK_IMPORTED_MODULE_3__.RoleListItem
{
  /**
   * @param {boolean|string|undefined} checked
   */
  set checked(checked) {
    this.setAttr(_AriaChecked__WEBPACK_IMPORTED_MODULE_0__.AriaChecked, checked)
  }

  /**
   * @returns {boolean|string|undefined}
   */
  get checked() {
    return this.getAttr(_AriaChecked__WEBPACK_IMPORTED_MODULE_0__.AriaChecked)
  }

  /**
   * @returns {RoleGroup|null}
   */
  get group() {
    return this.find(_RoleGroup__WEBPACK_IMPORTED_MODULE_2__.RoleGroup)
  }

  /**
   * @returns {RoleTreeItem[]}
   */
  get items() {
    return this.findAll(RoleTreeItem)
  }

  /**
   * @returns {RoleTreeItem|null}
   */
  get parentItem() {
    const item = this.parent.closest(RoleTreeItem)
    return this.tree.contains(item)?
      item :
      null
  }

  /**
   * @param {boolean} selected
   */
  set selected(selected) {
    this.setAttr(_AriaSelected__WEBPACK_IMPORTED_MODULE_1__.AriaSelected, selected)
  }

  /**
   * @returns {boolean}
   */
  get selected() {
    return this.getAttr(_AriaSelected__WEBPACK_IMPORTED_MODULE_1__.AriaSelected)
  }

  /**
   * @returns {RoleTree|null}
   */
  get tree() {
    return this.closest(_RoleTree__WEBPACK_IMPORTED_MODULE_4__.RoleTree)
  }
}


/***/ }),
/* 162 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTreeGrid": () => (/* binding */ RoleTreeGrid)
/* harmony export */ });
/* harmony import */ var _RoleGrid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(113);


/**
 * A grid whose rows can be expanded and collapsed in the same manner as for a tree.
 * @see https://www.w3.org/TR/wai-aria-1.1/#treegrid
 * @mixes RoleTree
 */
class RoleTreeGrid extends _RoleGrid__WEBPACK_IMPORTED_MODULE_0__.RoleGrid
{
}


/***/ }),
/* 163 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlA": () => (/* reexport safe */ _HtmlA__WEBPACK_IMPORTED_MODULE_0__.HtmlA),
/* harmony export */   "HtmlAbbr": () => (/* reexport safe */ _HtmlAbbr__WEBPACK_IMPORTED_MODULE_1__.HtmlAbbr),
/* harmony export */   "HtmlAddress": () => (/* reexport safe */ _HtmlAddress__WEBPACK_IMPORTED_MODULE_2__.HtmlAddress),
/* harmony export */   "HtmlArea": () => (/* reexport safe */ _HtmlArea__WEBPACK_IMPORTED_MODULE_3__.HtmlArea),
/* harmony export */   "HtmlArticle": () => (/* reexport safe */ _HtmlArticle__WEBPACK_IMPORTED_MODULE_4__.HtmlArticle),
/* harmony export */   "HtmlAside": () => (/* reexport safe */ _HtmlAside__WEBPACK_IMPORTED_MODULE_5__.HtmlAside),
/* harmony export */   "HtmlAudio": () => (/* reexport safe */ _HtmlAudio__WEBPACK_IMPORTED_MODULE_6__.HtmlAudio),
/* harmony export */   "HtmlB": () => (/* reexport safe */ _HtmlB__WEBPACK_IMPORTED_MODULE_7__.HtmlB),
/* harmony export */   "HtmlBase": () => (/* reexport safe */ _HtmlBase__WEBPACK_IMPORTED_MODULE_8__.HtmlBase),
/* harmony export */   "HtmlBdi": () => (/* reexport safe */ _HtmlBdi__WEBPACK_IMPORTED_MODULE_9__.HtmlBdi),
/* harmony export */   "HtmlBdo": () => (/* reexport safe */ _HtmlBdo__WEBPACK_IMPORTED_MODULE_10__.HtmlBdo),
/* harmony export */   "HtmlBlockQuote": () => (/* reexport safe */ _HtmlBlockQuote__WEBPACK_IMPORTED_MODULE_11__.HtmlBlockQuote),
/* harmony export */   "HtmlBody": () => (/* reexport safe */ _HtmlBody__WEBPACK_IMPORTED_MODULE_12__.HtmlBody),
/* harmony export */   "HtmlBr": () => (/* reexport safe */ _HtmlBr__WEBPACK_IMPORTED_MODULE_13__.HtmlBr),
/* harmony export */   "HtmlButton": () => (/* reexport safe */ _HtmlButton__WEBPACK_IMPORTED_MODULE_14__.HtmlButton),
/* harmony export */   "HtmlCanvas": () => (/* reexport safe */ _HtmlCanvas__WEBPACK_IMPORTED_MODULE_15__.HtmlCanvas),
/* harmony export */   "HtmlCaption": () => (/* reexport safe */ _HtmlCaption__WEBPACK_IMPORTED_MODULE_16__.HtmlCaption),
/* harmony export */   "HtmlCite": () => (/* reexport safe */ _HtmlCite__WEBPACK_IMPORTED_MODULE_17__.HtmlCite),
/* harmony export */   "HtmlCode": () => (/* reexport safe */ _HtmlCode__WEBPACK_IMPORTED_MODULE_18__.HtmlCode),
/* harmony export */   "HtmlCol": () => (/* reexport safe */ _HtmlCol__WEBPACK_IMPORTED_MODULE_19__.HtmlCol),
/* harmony export */   "HtmlColGroup": () => (/* reexport safe */ _HtmlColGroup__WEBPACK_IMPORTED_MODULE_20__.HtmlColGroup),
/* harmony export */   "HtmlData": () => (/* reexport safe */ _HtmlData__WEBPACK_IMPORTED_MODULE_21__.HtmlData),
/* harmony export */   "HtmlDataList": () => (/* reexport safe */ _HtmlDataList__WEBPACK_IMPORTED_MODULE_22__.HtmlDataList),
/* harmony export */   "HtmlDd": () => (/* reexport safe */ _HtmlDd__WEBPACK_IMPORTED_MODULE_23__.HtmlDd),
/* harmony export */   "HtmlDel": () => (/* reexport safe */ _HtmlDel__WEBPACK_IMPORTED_MODULE_24__.HtmlDel),
/* harmony export */   "HtmlDetails": () => (/* reexport safe */ _HtmlDetails__WEBPACK_IMPORTED_MODULE_25__.HtmlDetails),
/* harmony export */   "HtmlDfn": () => (/* reexport safe */ _HtmlDfn__WEBPACK_IMPORTED_MODULE_26__.HtmlDfn),
/* harmony export */   "HtmlDialog": () => (/* reexport safe */ _HtmlDialog__WEBPACK_IMPORTED_MODULE_27__.HtmlDialog),
/* harmony export */   "HtmlDiv": () => (/* reexport safe */ _HtmlDiv__WEBPACK_IMPORTED_MODULE_28__.HtmlDiv),
/* harmony export */   "HtmlDl": () => (/* reexport safe */ _HtmlDl__WEBPACK_IMPORTED_MODULE_29__.HtmlDl),
/* harmony export */   "HtmlDt": () => (/* reexport safe */ _HtmlDt__WEBPACK_IMPORTED_MODULE_30__.HtmlDt),
/* harmony export */   "HtmlEm": () => (/* reexport safe */ _HtmlEm__WEBPACK_IMPORTED_MODULE_31__.HtmlEm),
/* harmony export */   "HtmlEmbed": () => (/* reexport safe */ _HtmlEmbed__WEBPACK_IMPORTED_MODULE_32__.HtmlEmbed),
/* harmony export */   "HtmlFieldSet": () => (/* reexport safe */ _HtmlFieldSet__WEBPACK_IMPORTED_MODULE_33__.HtmlFieldSet),
/* harmony export */   "HtmlFigCaption": () => (/* reexport safe */ _HtmlFigCaption__WEBPACK_IMPORTED_MODULE_34__.HtmlFigCaption),
/* harmony export */   "HtmlFigure": () => (/* reexport safe */ _HtmlFigure__WEBPACK_IMPORTED_MODULE_35__.HtmlFigure),
/* harmony export */   "HtmlFooter": () => (/* reexport safe */ _HtmlFooter__WEBPACK_IMPORTED_MODULE_36__.HtmlFooter),
/* harmony export */   "HtmlForm": () => (/* reexport safe */ _HtmlForm__WEBPACK_IMPORTED_MODULE_37__.HtmlForm),
/* harmony export */   "HtmlH1": () => (/* reexport safe */ _HtmlH1__WEBPACK_IMPORTED_MODULE_38__.HtmlH1),
/* harmony export */   "HtmlH2": () => (/* reexport safe */ _HtmlH2__WEBPACK_IMPORTED_MODULE_39__.HtmlH2),
/* harmony export */   "HtmlH3": () => (/* reexport safe */ _HtmlH3__WEBPACK_IMPORTED_MODULE_40__.HtmlH3),
/* harmony export */   "HtmlH4": () => (/* reexport safe */ _HtmlH4__WEBPACK_IMPORTED_MODULE_41__.HtmlH4),
/* harmony export */   "HtmlH5": () => (/* reexport safe */ _HtmlH5__WEBPACK_IMPORTED_MODULE_42__.HtmlH5),
/* harmony export */   "HtmlH6": () => (/* reexport safe */ _HtmlH6__WEBPACK_IMPORTED_MODULE_43__.HtmlH6),
/* harmony export */   "HtmlHGroup": () => (/* reexport safe */ _HtmlHGroup__WEBPACK_IMPORTED_MODULE_44__.HtmlHGroup),
/* harmony export */   "HtmlElem": () => (/* reexport safe */ _HtmlElem__WEBPACK_IMPORTED_MODULE_45__.HtmlElem),
/* harmony export */   "HtmlHyperlink": () => (/* reexport safe */ _HtmlHyperlink__WEBPACK_IMPORTED_MODULE_46__.HtmlHyperlink),
/* harmony export */   "HtmlMedia": () => (/* reexport safe */ _HtmlMedia__WEBPACK_IMPORTED_MODULE_47__.HtmlMedia),
/* harmony export */   "HtmlMod": () => (/* reexport safe */ _HtmlMod__WEBPACK_IMPORTED_MODULE_48__.HtmlMod),
/* harmony export */   "HtmlObject": () => (/* reexport safe */ _HtmlObject__WEBPACK_IMPORTED_MODULE_49__.HtmlObject),
/* harmony export */   "HtmlTableCell": () => (/* reexport safe */ _HtmlTableCell__WEBPACK_IMPORTED_MODULE_50__.HtmlTableCell),
/* harmony export */   "HtmlHead": () => (/* reexport safe */ _HtmlHead__WEBPACK_IMPORTED_MODULE_51__.HtmlHead),
/* harmony export */   "HtmlHeader": () => (/* reexport safe */ _HtmlHeader__WEBPACK_IMPORTED_MODULE_52__.HtmlHeader),
/* harmony export */   "HtmlHr": () => (/* reexport safe */ _HtmlHr__WEBPACK_IMPORTED_MODULE_53__.HtmlHr),
/* harmony export */   "HtmlHtml": () => (/* reexport safe */ _HtmlHtml__WEBPACK_IMPORTED_MODULE_54__.HtmlHtml),
/* harmony export */   "HtmlI": () => (/* reexport safe */ _HtmlI__WEBPACK_IMPORTED_MODULE_55__.HtmlI),
/* harmony export */   "HtmlIFrame": () => (/* reexport safe */ _HtmlIFrame__WEBPACK_IMPORTED_MODULE_56__.HtmlIFrame),
/* harmony export */   "HtmlImg": () => (/* reexport safe */ _HtmlImg__WEBPACK_IMPORTED_MODULE_57__.HtmlImg),
/* harmony export */   "HtmlInput": () => (/* reexport safe */ _HtmlInput__WEBPACK_IMPORTED_MODULE_58__.HtmlInput),
/* harmony export */   "HtmlIns": () => (/* reexport safe */ _HtmlIns__WEBPACK_IMPORTED_MODULE_59__.HtmlIns),
/* harmony export */   "HtmlKbd": () => (/* reexport safe */ _HtmlKbd__WEBPACK_IMPORTED_MODULE_60__.HtmlKbd),
/* harmony export */   "HtmlLabel": () => (/* reexport safe */ _HtmlLabel__WEBPACK_IMPORTED_MODULE_61__.HtmlLabel),
/* harmony export */   "HtmlLegend": () => (/* reexport safe */ _HtmlLegend__WEBPACK_IMPORTED_MODULE_62__.HtmlLegend),
/* harmony export */   "HtmlLi": () => (/* reexport safe */ _HtmlLi__WEBPACK_IMPORTED_MODULE_63__.HtmlLi),
/* harmony export */   "HtmlLink": () => (/* reexport safe */ _HtmlLink__WEBPACK_IMPORTED_MODULE_64__.HtmlLink),
/* harmony export */   "HtmlMain": () => (/* reexport safe */ _HtmlMain__WEBPACK_IMPORTED_MODULE_65__.HtmlMain),
/* harmony export */   "HtmlMap": () => (/* reexport safe */ _HtmlMap__WEBPACK_IMPORTED_MODULE_66__.HtmlMap),
/* harmony export */   "HtmlMark": () => (/* reexport safe */ _HtmlMark__WEBPACK_IMPORTED_MODULE_67__.HtmlMark),
/* harmony export */   "HtmlMenu": () => (/* reexport safe */ _HtmlMenu__WEBPACK_IMPORTED_MODULE_68__.HtmlMenu),
/* harmony export */   "HtmlMeta": () => (/* reexport safe */ _HtmlMeta__WEBPACK_IMPORTED_MODULE_69__.HtmlMeta),
/* harmony export */   "HtmlMeter": () => (/* reexport safe */ _HtmlMeter__WEBPACK_IMPORTED_MODULE_70__.HtmlMeter),
/* harmony export */   "HtmlNav": () => (/* reexport safe */ _HtmlNav__WEBPACK_IMPORTED_MODULE_71__.HtmlNav),
/* harmony export */   "HtmlNoScript": () => (/* reexport safe */ _HtmlNoScript__WEBPACK_IMPORTED_MODULE_72__.HtmlNoScript),
/* harmony export */   "HtmlOl": () => (/* reexport safe */ _HtmlOl__WEBPACK_IMPORTED_MODULE_73__.HtmlOl),
/* harmony export */   "HtmlOptGroup": () => (/* reexport safe */ _HtmlOptGroup__WEBPACK_IMPORTED_MODULE_74__.HtmlOptGroup),
/* harmony export */   "HtmlOption": () => (/* reexport safe */ _HtmlOption__WEBPACK_IMPORTED_MODULE_75__.HtmlOption),
/* harmony export */   "HtmlOutput": () => (/* reexport safe */ _HtmlOutput__WEBPACK_IMPORTED_MODULE_76__.HtmlOutput),
/* harmony export */   "HtmlP": () => (/* reexport safe */ _HtmlP__WEBPACK_IMPORTED_MODULE_77__.HtmlP),
/* harmony export */   "HtmlParam": () => (/* reexport safe */ _HtmlParam__WEBPACK_IMPORTED_MODULE_78__.HtmlParam),
/* harmony export */   "HtmlPicture": () => (/* reexport safe */ _HtmlPicture__WEBPACK_IMPORTED_MODULE_79__.HtmlPicture),
/* harmony export */   "HtmlPre": () => (/* reexport safe */ _HtmlPre__WEBPACK_IMPORTED_MODULE_80__.HtmlPre),
/* harmony export */   "HtmlProgress": () => (/* reexport safe */ _HtmlProgress__WEBPACK_IMPORTED_MODULE_81__.HtmlProgress),
/* harmony export */   "HtmlQ": () => (/* reexport safe */ _HtmlQ__WEBPACK_IMPORTED_MODULE_82__.HtmlQ),
/* harmony export */   "HtmlRp": () => (/* reexport safe */ _HtmlRp__WEBPACK_IMPORTED_MODULE_83__.HtmlRp),
/* harmony export */   "HtmlRt": () => (/* reexport safe */ _HtmlRt__WEBPACK_IMPORTED_MODULE_84__.HtmlRt),
/* harmony export */   "HtmlRuby": () => (/* reexport safe */ _HtmlRuby__WEBPACK_IMPORTED_MODULE_85__.HtmlRuby),
/* harmony export */   "HtmlS": () => (/* reexport safe */ _HtmlS__WEBPACK_IMPORTED_MODULE_86__.HtmlS),
/* harmony export */   "HtmlSamp": () => (/* reexport safe */ _HtmlSamp__WEBPACK_IMPORTED_MODULE_87__.HtmlSamp),
/* harmony export */   "HtmlScript": () => (/* reexport safe */ _HtmlScript__WEBPACK_IMPORTED_MODULE_88__.HtmlScript),
/* harmony export */   "HtmlSection": () => (/* reexport safe */ _HtmlSection__WEBPACK_IMPORTED_MODULE_89__.HtmlSection),
/* harmony export */   "HtmlSelect": () => (/* reexport safe */ _HtmlSelect__WEBPACK_IMPORTED_MODULE_90__.HtmlSelect),
/* harmony export */   "HtmlSmall": () => (/* reexport safe */ _HtmlSmall__WEBPACK_IMPORTED_MODULE_91__.HtmlSmall),
/* harmony export */   "HtmlSource": () => (/* reexport safe */ _HtmlSource__WEBPACK_IMPORTED_MODULE_92__.HtmlSource),
/* harmony export */   "HtmlSpan": () => (/* reexport safe */ _HtmlSpan__WEBPACK_IMPORTED_MODULE_93__.HtmlSpan),
/* harmony export */   "HtmlStrong": () => (/* reexport safe */ _HtmlStrong__WEBPACK_IMPORTED_MODULE_94__.HtmlStrong),
/* harmony export */   "HtmlStyle": () => (/* reexport safe */ _HtmlStyle__WEBPACK_IMPORTED_MODULE_95__.HtmlStyle),
/* harmony export */   "HtmlSub": () => (/* reexport safe */ _HtmlSub__WEBPACK_IMPORTED_MODULE_96__.HtmlSub),
/* harmony export */   "HtmlSummary": () => (/* reexport safe */ _HtmlSummary__WEBPACK_IMPORTED_MODULE_97__.HtmlSummary),
/* harmony export */   "HtmlSup": () => (/* reexport safe */ _HtmlSup__WEBPACK_IMPORTED_MODULE_98__.HtmlSup),
/* harmony export */   "HtmlTBody": () => (/* reexport safe */ _HtmlTBody__WEBPACK_IMPORTED_MODULE_99__.HtmlTBody),
/* harmony export */   "HtmlTFoot": () => (/* reexport safe */ _HtmlTFoot__WEBPACK_IMPORTED_MODULE_100__.HtmlTFoot),
/* harmony export */   "HtmlTHead": () => (/* reexport safe */ _HtmlTHead__WEBPACK_IMPORTED_MODULE_101__.HtmlTHead),
/* harmony export */   "HtmlTable": () => (/* reexport safe */ _HtmlTable__WEBPACK_IMPORTED_MODULE_102__.HtmlTable),
/* harmony export */   "HtmlTd": () => (/* reexport safe */ _HtmlTd__WEBPACK_IMPORTED_MODULE_103__.HtmlTd),
/* harmony export */   "HtmlTemplate": () => (/* reexport safe */ _HtmlTemplate__WEBPACK_IMPORTED_MODULE_104__.HtmlTemplate),
/* harmony export */   "HtmlTextArea": () => (/* reexport safe */ _HtmlTextArea__WEBPACK_IMPORTED_MODULE_105__.HtmlTextArea),
/* harmony export */   "HtmlTh": () => (/* reexport safe */ _HtmlTh__WEBPACK_IMPORTED_MODULE_106__.HtmlTh),
/* harmony export */   "HtmlTime": () => (/* reexport safe */ _HtmlTime__WEBPACK_IMPORTED_MODULE_107__.HtmlTime),
/* harmony export */   "HtmlTitle": () => (/* reexport safe */ _HtmlTitle__WEBPACK_IMPORTED_MODULE_108__.HtmlTitle),
/* harmony export */   "HtmlTr": () => (/* reexport safe */ _HtmlTr__WEBPACK_IMPORTED_MODULE_109__.HtmlTr),
/* harmony export */   "HtmlTrack": () => (/* reexport safe */ _HtmlTrack__WEBPACK_IMPORTED_MODULE_110__.HtmlTrack),
/* harmony export */   "HtmlU": () => (/* reexport safe */ _HtmlU__WEBPACK_IMPORTED_MODULE_111__.HtmlU),
/* harmony export */   "HtmlUl": () => (/* reexport safe */ _HtmlUl__WEBPACK_IMPORTED_MODULE_112__.HtmlUl),
/* harmony export */   "HtmlVar": () => (/* reexport safe */ _HtmlVar__WEBPACK_IMPORTED_MODULE_113__.HtmlVar),
/* harmony export */   "HtmlVideo": () => (/* reexport safe */ _HtmlVideo__WEBPACK_IMPORTED_MODULE_114__.HtmlVideo),
/* harmony export */   "HtmlWbr": () => (/* reexport safe */ _HtmlWbr__WEBPACK_IMPORTED_MODULE_115__.HtmlWbr),
/* harmony export */   "Win": () => (/* reexport safe */ _Win__WEBPACK_IMPORTED_MODULE_116__.Win)
/* harmony export */ });
/* harmony import */ var _HtmlA__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(164);
/* harmony import */ var _HtmlAbbr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(166);
/* harmony import */ var _HtmlAddress__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(167);
/* harmony import */ var _HtmlArea__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(168);
/* harmony import */ var _HtmlArticle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(169);
/* harmony import */ var _HtmlAside__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(170);
/* harmony import */ var _HtmlAudio__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(171);
/* harmony import */ var _HtmlB__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(173);
/* harmony import */ var _HtmlBase__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(174);
/* harmony import */ var _HtmlBdi__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(175);
/* harmony import */ var _HtmlBdo__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(176);
/* harmony import */ var _HtmlBlockQuote__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(177);
/* harmony import */ var _HtmlBody__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(10);
/* harmony import */ var _HtmlBr__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(178);
/* harmony import */ var _HtmlButton__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(179);
/* harmony import */ var _HtmlCanvas__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(182);
/* harmony import */ var _HtmlCaption__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(183);
/* harmony import */ var _HtmlCite__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(184);
/* harmony import */ var _HtmlCode__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(185);
/* harmony import */ var _HtmlCol__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(186);
/* harmony import */ var _HtmlColGroup__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(187);
/* harmony import */ var _HtmlData__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(188);
/* harmony import */ var _HtmlDataList__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(189);
/* harmony import */ var _HtmlDd__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(191);
/* harmony import */ var _HtmlDel__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(192);
/* harmony import */ var _HtmlDetails__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(194);
/* harmony import */ var _HtmlDfn__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(195);
/* harmony import */ var _HtmlDialog__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(196);
/* harmony import */ var _HtmlDiv__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(197);
/* harmony import */ var _HtmlDl__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(198);
/* harmony import */ var _HtmlDt__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(199);
/* harmony import */ var _HtmlEm__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(200);
/* harmony import */ var _HtmlEmbed__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(201);
/* harmony import */ var _HtmlFieldSet__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(202);
/* harmony import */ var _HtmlFigCaption__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(203);
/* harmony import */ var _HtmlFigure__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(204);
/* harmony import */ var _HtmlFooter__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(205);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(180);
/* harmony import */ var _HtmlH1__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(206);
/* harmony import */ var _HtmlH2__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(207);
/* harmony import */ var _HtmlH3__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(208);
/* harmony import */ var _HtmlH4__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(209);
/* harmony import */ var _HtmlH5__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(210);
/* harmony import */ var _HtmlH6__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(211);
/* harmony import */ var _HtmlHGroup__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(212);
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(11);
/* harmony import */ var _HtmlHyperlink__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(165);
/* harmony import */ var _HtmlMedia__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(172);
/* harmony import */ var _HtmlMod__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(193);
/* harmony import */ var _HtmlObject__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(213);
/* harmony import */ var _HtmlTableCell__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(214);
/* harmony import */ var _HtmlHead__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(37);
/* harmony import */ var _HtmlHeader__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(215);
/* harmony import */ var _HtmlHr__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__(216);
/* harmony import */ var _HtmlHtml__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__(38);
/* harmony import */ var _HtmlI__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__(217);
/* harmony import */ var _HtmlIFrame__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__(218);
/* harmony import */ var _HtmlImg__WEBPACK_IMPORTED_MODULE_57__ = __webpack_require__(219);
/* harmony import */ var _HtmlInput__WEBPACK_IMPORTED_MODULE_58__ = __webpack_require__(220);
/* harmony import */ var _HtmlIns__WEBPACK_IMPORTED_MODULE_59__ = __webpack_require__(221);
/* harmony import */ var _HtmlKbd__WEBPACK_IMPORTED_MODULE_60__ = __webpack_require__(222);
/* harmony import */ var _HtmlLabel__WEBPACK_IMPORTED_MODULE_61__ = __webpack_require__(181);
/* harmony import */ var _HtmlLegend__WEBPACK_IMPORTED_MODULE_62__ = __webpack_require__(223);
/* harmony import */ var _HtmlLi__WEBPACK_IMPORTED_MODULE_63__ = __webpack_require__(224);
/* harmony import */ var _HtmlLink__WEBPACK_IMPORTED_MODULE_64__ = __webpack_require__(225);
/* harmony import */ var _HtmlMain__WEBPACK_IMPORTED_MODULE_65__ = __webpack_require__(226);
/* harmony import */ var _HtmlMap__WEBPACK_IMPORTED_MODULE_66__ = __webpack_require__(227);
/* harmony import */ var _HtmlMark__WEBPACK_IMPORTED_MODULE_67__ = __webpack_require__(228);
/* harmony import */ var _HtmlMenu__WEBPACK_IMPORTED_MODULE_68__ = __webpack_require__(229);
/* harmony import */ var _HtmlMeta__WEBPACK_IMPORTED_MODULE_69__ = __webpack_require__(230);
/* harmony import */ var _HtmlMeter__WEBPACK_IMPORTED_MODULE_70__ = __webpack_require__(231);
/* harmony import */ var _HtmlNav__WEBPACK_IMPORTED_MODULE_71__ = __webpack_require__(232);
/* harmony import */ var _HtmlNoScript__WEBPACK_IMPORTED_MODULE_72__ = __webpack_require__(233);
/* harmony import */ var _HtmlOl__WEBPACK_IMPORTED_MODULE_73__ = __webpack_require__(234);
/* harmony import */ var _HtmlOptGroup__WEBPACK_IMPORTED_MODULE_74__ = __webpack_require__(235);
/* harmony import */ var _HtmlOption__WEBPACK_IMPORTED_MODULE_75__ = __webpack_require__(190);
/* harmony import */ var _HtmlOutput__WEBPACK_IMPORTED_MODULE_76__ = __webpack_require__(236);
/* harmony import */ var _HtmlP__WEBPACK_IMPORTED_MODULE_77__ = __webpack_require__(237);
/* harmony import */ var _HtmlParam__WEBPACK_IMPORTED_MODULE_78__ = __webpack_require__(238);
/* harmony import */ var _HtmlPicture__WEBPACK_IMPORTED_MODULE_79__ = __webpack_require__(239);
/* harmony import */ var _HtmlPre__WEBPACK_IMPORTED_MODULE_80__ = __webpack_require__(240);
/* harmony import */ var _HtmlProgress__WEBPACK_IMPORTED_MODULE_81__ = __webpack_require__(241);
/* harmony import */ var _HtmlQ__WEBPACK_IMPORTED_MODULE_82__ = __webpack_require__(242);
/* harmony import */ var _HtmlRp__WEBPACK_IMPORTED_MODULE_83__ = __webpack_require__(243);
/* harmony import */ var _HtmlRt__WEBPACK_IMPORTED_MODULE_84__ = __webpack_require__(244);
/* harmony import */ var _HtmlRuby__WEBPACK_IMPORTED_MODULE_85__ = __webpack_require__(245);
/* harmony import */ var _HtmlS__WEBPACK_IMPORTED_MODULE_86__ = __webpack_require__(246);
/* harmony import */ var _HtmlSamp__WEBPACK_IMPORTED_MODULE_87__ = __webpack_require__(247);
/* harmony import */ var _HtmlScript__WEBPACK_IMPORTED_MODULE_88__ = __webpack_require__(248);
/* harmony import */ var _HtmlSection__WEBPACK_IMPORTED_MODULE_89__ = __webpack_require__(249);
/* harmony import */ var _HtmlSelect__WEBPACK_IMPORTED_MODULE_90__ = __webpack_require__(250);
/* harmony import */ var _HtmlSmall__WEBPACK_IMPORTED_MODULE_91__ = __webpack_require__(251);
/* harmony import */ var _HtmlSource__WEBPACK_IMPORTED_MODULE_92__ = __webpack_require__(252);
/* harmony import */ var _HtmlSpan__WEBPACK_IMPORTED_MODULE_93__ = __webpack_require__(253);
/* harmony import */ var _HtmlStrong__WEBPACK_IMPORTED_MODULE_94__ = __webpack_require__(254);
/* harmony import */ var _HtmlStyle__WEBPACK_IMPORTED_MODULE_95__ = __webpack_require__(255);
/* harmony import */ var _HtmlSub__WEBPACK_IMPORTED_MODULE_96__ = __webpack_require__(256);
/* harmony import */ var _HtmlSummary__WEBPACK_IMPORTED_MODULE_97__ = __webpack_require__(257);
/* harmony import */ var _HtmlSup__WEBPACK_IMPORTED_MODULE_98__ = __webpack_require__(258);
/* harmony import */ var _HtmlTBody__WEBPACK_IMPORTED_MODULE_99__ = __webpack_require__(259);
/* harmony import */ var _HtmlTFoot__WEBPACK_IMPORTED_MODULE_100__ = __webpack_require__(263);
/* harmony import */ var _HtmlTHead__WEBPACK_IMPORTED_MODULE_101__ = __webpack_require__(264);
/* harmony import */ var _HtmlTable__WEBPACK_IMPORTED_MODULE_102__ = __webpack_require__(265);
/* harmony import */ var _HtmlTd__WEBPACK_IMPORTED_MODULE_103__ = __webpack_require__(261);
/* harmony import */ var _HtmlTemplate__WEBPACK_IMPORTED_MODULE_104__ = __webpack_require__(266);
/* harmony import */ var _HtmlTextArea__WEBPACK_IMPORTED_MODULE_105__ = __webpack_require__(267);
/* harmony import */ var _HtmlTh__WEBPACK_IMPORTED_MODULE_106__ = __webpack_require__(262);
/* harmony import */ var _HtmlTime__WEBPACK_IMPORTED_MODULE_107__ = __webpack_require__(268);
/* harmony import */ var _HtmlTitle__WEBPACK_IMPORTED_MODULE_108__ = __webpack_require__(269);
/* harmony import */ var _HtmlTr__WEBPACK_IMPORTED_MODULE_109__ = __webpack_require__(260);
/* harmony import */ var _HtmlTrack__WEBPACK_IMPORTED_MODULE_110__ = __webpack_require__(270);
/* harmony import */ var _HtmlU__WEBPACK_IMPORTED_MODULE_111__ = __webpack_require__(271);
/* harmony import */ var _HtmlUl__WEBPACK_IMPORTED_MODULE_112__ = __webpack_require__(272);
/* harmony import */ var _HtmlVar__WEBPACK_IMPORTED_MODULE_113__ = __webpack_require__(273);
/* harmony import */ var _HtmlVideo__WEBPACK_IMPORTED_MODULE_114__ = __webpack_require__(274);
/* harmony import */ var _HtmlWbr__WEBPACK_IMPORTED_MODULE_115__ = __webpack_require__(275);
/* harmony import */ var _Win__WEBPACK_IMPORTED_MODULE_116__ = __webpack_require__(276);
/**
 * @module htmlmodule
 * @author Vyacheslav Aristov <vv.aristov@gmail.com>
 * @license MIT
 * @see {@link https://www.w3.org/TR/html}
 * @see {@link https://html.spec.whatwg.org}
 */























































































































/***/ }),
/* 164 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlA": () => (/* binding */ HtmlA)
/* harmony export */ });
/* harmony import */ var _HtmlHyperlink__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(165);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-a-element
 */
class HtmlA extends _HtmlHyperlink__WEBPACK_IMPORTED_MODULE_0__.HtmlHyperlink
{
  /**
   * @param {string} target
   */
  set target(target) {
    this.node.target = target
  }

  /**
   * @returns {string}
   */
  get target() {
    return this.node.target
  }

  /**
   * @param {string} download
   */
  set download(download) {
    this.node.download = download
  }

  /**
   * @returns {string}
   */
  get download() {
    return this.node.download
  }

  /**
   * @param {string} rel
   */
  set rel(rel) {
    this.node.rel = rel
  }

  /**
   * @returns {string}
   */
  get rel() {
    return this.node.rel
  }

  /**
   * @param {string} rev
   */
  set rev(rev) {
    this.node.rev = rev
  }

  /**
   * @returns {string}
   */
  get rev() {
    return this.node.rev
  }

  /**
   * @param {string} hreflang
   */
  set hreflang(hreflang) {
    this.node.hreflang = hreflang
  }

  /**
   * @returns {string}
   */
  get hreflang() {
    return this.node.hreflang
  }

  /**
   * @param {string} type
   */
  set type(type) {
    this.node.type = type
  }

  /**
   * @returns {string}
   */
  get type() {
    return this.node.type
  }

  /**
   * @param {string} referrerPolicy
   */
  set referrerPolicy(referrerPolicy) {
    this.node.referrerPolicy = referrerPolicy
  }

  /**
   * @returns {string}
   */
  get referrerPolicy() {
    return this.node.referrerPolicy
  }
}


/***/ }),
/* 165 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlHyperlink": () => (/* binding */ HtmlHyperlink)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#htmlhyperlinkelementutils
 * @abstract
 */
class HtmlHyperlink extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {string} href
   */
  set href(href) {
    this.node.href = href
  }

  /**
   * @returns {string}
   */
  get href() {
    return this.node.href
  }

  /**
   * @returns {string}
   */
  get origin() {
    return this.node.origin
  }

  /**
   * @param {string} protocol
   */
  set protocol(protocol) {
    this.node.protocol = protocol
  }

  /**
   * @returns {string}
   */
  get protocol() {
    return this.node.protocol
  }

  /**
   * @param {string} username
   */
  set username(username) {
    this.node.username = username
  }

  /**
   * @returns {string}
   */
  get username() {
    return this.node.username
  }

  /**
   * @param {string} password
   */
  set password(password) {
    this.node.password = password
  }

  /**
   * @returns {string}
   */
  get password() {
    return this.node.password
  }

  /**
   * @param {string} host
   */
  set host(host) {
    this.node.host = host
  }

  /**
   * @returns {string}
   */
  get host() {
    return this.node.host
  }

  /**
   * @param {string} hostname
   */
  set hostname(hostname) {
    this.node.hostname = hostname
  }

  /**
   * @returns {string}
   */
  get hostname() {
    return this.node.hostname
  }

  /**
   * @param {string} port
   */
  set port(port) {
    this.node.port = port
  }

  /**
   * @returns {string}
   */
  get port() {
    return this.node.port
  }

  /**
   * @param {string} pathname
   */
  set pathname(pathname) {
    this.node.pathname = pathname
  }

  /**
   * @returns {string}
   */
  get pathname() {
    return this.node.pathname
  }

  /**
   * @param {string} search
   */
  set search(search) {
    this.node.search = search
  }

  /**
   * @returns {string}
   */
  get search() {
    return this.node.search
  }

  /**
   * @param {string} hash
   */
  set hash(hash) {
    this.node.hash = hash
  }

  /**
   * @returns {string}
   */
  get hash() {
    return this.node.hash
  }

  /**
   * @returns {constructor} HtmlHyperlink
   */
  static get superAssembler() {
    return HtmlHyperlink
  }
}


/***/ }),
/* 166 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlAbbr": () => (/* binding */ HtmlAbbr)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-abbr-element
 */
class HtmlAbbr extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 167 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlAddress": () => (/* binding */ HtmlAddress)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-address-element
 */
class HtmlAddress extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 168 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlArea": () => (/* binding */ HtmlArea)
/* harmony export */ });
/* harmony import */ var _HtmlHyperlink__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(165);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-area-element
 */
class HtmlArea extends _HtmlHyperlink__WEBPACK_IMPORTED_MODULE_0__.HtmlHyperlink
{
  /**
   * @param {string} alt
   */
  set alt(alt) {
    this.node.alt = alt
  }

  /**
   * @returns {string}
   */
  get alt() {
    return this.node.alt
  }

  /**
   * @param {string} coords
   */
  set coords(coords) {
    this.node.coords = coords
  }

  /**
   * @returns {string}
   */
  get coords() {
    return this.node.coords
  }

  /**
   * @param {string} shape
   */
  set shape(shape) {
    this.node.shape = shape
  }

  /**
   * @returns {string}
   */
  get shape() {
    return this.node.shape
  }

  /**
   * @param {string} target
   */
  set target(target) {
    this.node.target = target
  }

  /**
   * @returns {string}
   */
  get target() {
    return this.node.target
  }

  /**
   * @param {string} download
   */
  set download(download) {
    this.node.download = download
  }

  /**
   * @returns {string}
   */
  get download() {
    return this.node.download
  }

  /**
   * @param {string} rel
   */
  set rel(rel) {
    this.node.rel = rel
  }

  /**
   * @returns {string}
   */
  get rel() {
    return this.node.rel
  }

  /**
   * @returns {DOMTokenList}
   */
  get relList() {
    return this.node.relList
  }

  /**
   * @param {string} hreflang
   */
  set hreflang(hreflang) {
    this.node.hreflang = hreflang
  }

  /**
   * @returns {string}
   */
  get hreflang() {
    return this.node.hreflang
  }

  /**
   * @param {string} type
   */
  set type(type) {
    this.node.type = type
  }

  /**
   * @returns {string}
   */
  get type() {
    return this.node.type
  }

  /**
   * @param {string} referrerPolicy
   */
  set referrerPolicy(referrerPolicy) {
    this.node.referrerPolicy = referrerPolicy
  }

  /**
   * @returns {string}
   */
  get referrerPolicy() {
    return this.node.referrerPolicy
  }
}


/***/ }),
/* 169 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlArticle": () => (/* binding */ HtmlArticle)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-article-element
 */
class HtmlArticle extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 170 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlAside": () => (/* binding */ HtmlAside)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-aside-element
 */
class HtmlAside extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 171 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlAudio": () => (/* binding */ HtmlAudio)
/* harmony export */ });
/* harmony import */ var _HtmlMedia__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(172);


/**
 * @see https://www.w3.org/TR/html/single-page.html#dom-htmlaudioelement-audio
 */
class HtmlAudio extends _HtmlMedia__WEBPACK_IMPORTED_MODULE_0__.HtmlMedia
{
}


/***/ }),
/* 172 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlMedia": () => (/* binding */ HtmlMedia)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#htmlmediaelement
 * @abstract
 */
class HtmlMedia extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @see https://www.w3.org/TR/html/single-page.html#dom-htmlmediaelement-load
   */
  load() {
    this.node.load()
  }

  /**
   * @param type
   * @returns {CanPlayTypeResult}
   */
  canPlayType(type) {
    return this.node.canPlayType
  }

  /**
   * @param {number} time
   */
  fastSeek(time) {
    this.node.fastSeek(time)
  }

  /**
   * @returns {Date}
   */
  getStartDate() {
    return this.node.getStartDate()
  }

  /**
   * @see https://www.w3.org/TR/html/single-page.html#dom-htmlmediaelement-play
   */
  play() {
    this.node.play()
  }

  /**
   * @see https://www.w3.org/TR/html/single-page.html#dom-htmlmediaelement-pause
   */
  pause() {
    this.node.pause()
  }

  /**
   * @param {TextTrackKind} kind
   * @param {string} [label='']
   * @param {string} [language='']
   * @returns {TextTrack}
   */
  addTextTrack(kind, label = '', language = '') {
    return this.node.addTextTrack(kind, label, language)
  }

  /**
   * @returns {MediaError}
   */
  get error() {
    return this.node.error
  }

  /**
   * @param {string} src
   */
  set src(src) {
    this.node.src = src
  }

  /**
   * @returns {string}
   */
  get src() {
    return this.node.src
  }

  /**
   * @param {MediaProvider} srcObject
   */
  set srcObject(srcObject) {
    this.node.srcObject = srcObject
  }

  /**
   * @returns {MediaProvider}
   */
  get srcObject() {
    return this.node.srcObject
  }

  /**
   * @returns {string}
   */
  get currentSrc() {
    return this.node.currentSrc
  }

  /**
   * @param {string} crossOrigin
   */
  set crossOrigin(crossOrigin) {
    this.node.crossOrigin = crossOrigin
  }

  /**
   * @returns {string}
   */
  get crossOrigin() {
    return this.node.crossOrigin
  }

  /**
   * @returns {number}
   */
  get networkState() {
    return this.node.networkState
  }

  /**
   * @param {string} preload
   */
  set preload(preload) {
    this.node.preload = preload
  }

  /**
   * @returns {string}
   */
  get preload() {
    return this.node.preload
  }

  /**
   * @returns {TimeRanges}
   */
  get buffered() {
    return this.node.buffered
  }

  /**
   * @returns {number}
   */
  get readyState() {
    return this.node.readyState
  }

  /**
   * @returns {boolean}
   */
  get seeking() {
    return this.node.seeking
  }

  /**
   * @param {number} currentTime
   */
  set currentTime(currentTime) {
    this.node.currentTime = currentTime
  }

  /**
   * @returns {number}
   */
  get currentTime() {
    return this.node.currentTime
  }

  /**
   * @returns {number}
   */
  get duration() {
    return this.node.duration
  }

  /**
   * @returns {boolean}
   */
  get paused() {
    return this.node.paused
  }

  /**
   * @param {number} defaultPlaybackRate
   */
  set defaultPlaybackRate(defaultPlaybackRate) {
    this.node.defaultPlaybackRate = defaultPlaybackRate
  }

  /**
   * @returns {number}
   */
  get defaultPlaybackRate() {
    return this.node.defaultPlaybackRate
  }

  /**
   * @param {number} playbackRate
   */
  set playbackRate(playbackRate) {
    this.node.playbackRate = playbackRate
  }

  /**
   * @returns {number}
   */
  get playbackRate() {
    return this.node.playbackRate
  }

  /**
   * @returns {TimeRanges}
   */
  get played() {
    return this.node.played
  }

  /**
   * @returns {TimeRanges}
   */
  get seekable() {
    return this.node.seekable
  }

  /**
   * @returns {boolean}
   */
  get ended() {
    return this.node.ended
  }

  /**
   * @param {boolean} autoplay
   */
  set autoplay(autoplay) {
    this.node.autoplay = autoplay
  }

  /**
   * @returns {boolean}
   */
  get autoplay() {
    return this.node.autoplay
  }

  /**
   * @param {boolean} loop
   */
  set loop(loop) {
    this.node.loop = loop
  }

  /**
   * @returns {boolean}
   */
  get loop() {
    return this.node.loop
  }

  /**
   * @param {boolean} controls
   */
  set controls(controls) {
    this.node.controls = controls
  }

  /**
   * @returns {boolean}
   */
  get controls() {
    return this.node.controls
  }

  /**
   * @param {number} volume
   */
  set volume(volume) {
    this.node.volume
  }

  /**
   * @returns {number}
   */
  get volume() {
    return this.node.volume
  }

  /**
   * @param {boolean} muted
   */
  set muted(muted) {
    this.node.muted = muted
  }

  /**
   * @returns {boolean}
   */
  get muted() {
    return this.node.muted
  }

  /**
   * @param {boolean} defaultMuted
   */
  set defaultMuted(defaultMuted) {
    this.node.defaultMuted = defaultMuted
  }

  /**
   * @returns {boolean}
   */
  get defaultMuted() {
    return this.node.defaultMuted
  }

  /**
   * @returns {AudioTrackList}
   */
  get audioTracks() {
    return this.node.audioTracks
  }

  /**
   * @returns {VideoTrackList}
   */
  get videoTracks() {
    return this.node.videoTracks
  }

  /**
   * @returns {TextTrackList}
   */
  get textTracks() {
    return this.node.textTracks
  }

  /**
   * @returns {constructor} HtmlMedia
   */
  static get superAssembler() {
    return HtmlMedia
  }
}


/***/ }),
/* 173 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlB": () => (/* binding */ HtmlB)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-b-element
 */
class HtmlB extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 174 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlBase": () => (/* binding */ HtmlBase)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-base-element
 */
class HtmlBase extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {string} href
   */
  set href(href) {
    this.node.href = href
  }

  /**
   * @returns {string}
   */
  get href() {
    return this.node.href
  }

  /**
   * @param {string} target
   */
  set target(target) {
    this.node.target = target
  }

  /**
   * @returns {string}
   */
  get target() {
    return this.node.target
  }
}


/***/ }),
/* 175 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlBdi": () => (/* binding */ HtmlBdi)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-bdi-element
 */
class HtmlBdi extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 176 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlBdo": () => (/* binding */ HtmlBdo)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-bdo-element
 */
class HtmlBdo extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 177 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlBlockQuote": () => (/* binding */ HtmlBlockQuote)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-blockquote-element
 */
class HtmlBlockQuote extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {string} cite
   */
  set cite(cite) {
    this.node.cite = cite
  }

  /**
   * @returns {string}
   */
  get cite() {
    return this.node.cite
  }
}


/***/ }),
/* 178 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlBr": () => (/* binding */ HtmlBr)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-br-element
 */
class HtmlBr extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 179 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlButton": () => (/* binding */ HtmlButton)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(180);
/* harmony import */ var _HtmlLabel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(181);




const { map } = Array.prototype

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-button-element
 */
class HtmlButton extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @returns {boolean}
   */
  checkValidity() {
    return this.node.checkValidity()
  }

  /**
   * @returns {boolean}
   */
  reportValidity() {
    return this.node.reportValidity()
  }

  /**
   * @param {string} error
   */
  setCustomValidity(error) {
    this.node.setCustomValidity(error)
  }

  /**
   * @param {boolean} autofocus
   */
  set autofocus(autofocus) {
    this.node.autofocus = autofocus
  }

  /**
   * @returns {boolean}
   */
  get autofocus() {
    return this.node.autofocus
  }

  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    this.node.disabled = disabled
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return this.node.disabled
  }

  /**
   * @returns {HtmlForm|null}
   */
  get form() {
    return _HtmlForm__WEBPACK_IMPORTED_MODULE_1__.HtmlForm.get(this.node.form)
  }

  /**
   * @param {string} formAction
   */
  set formAction(formAction) {
    this.node.formAction = formAction
  }

  /**
   * @returns {string}
   */
  get formAction() {
    return this.node.formAction
  }

  /**
   * @param {string} formEnctype
   */
  set formEnctype(formEnctype) {
    this.node.formEnctype = formEnctype
  }

  /**
   * @returns {string}
   */
  get formEnctype() {
    return this.node.formEnctype
  }

  /**
   * @param {string} formMethod
   */
  set formMethod(formMethod) {
    this.node.formMethod = formMethod
  }

  /**
   * @returns {string}
   */
  get formMethod() {
    return this.node.formMethod
  }

  /**
   * @param {boolean} formNoValidate
   */
  set formNoValidate(formNoValidate) {
    this.node.formNoValidate = formNoValidate
  }

  /**
   * @returns {boolean}
   */
  get formNoValidate() {
    return this.node.formNoValidate
  }

  /**
   * @param {string} formTarget
   */
  set formTarget(formTarget) {
    this.node.formTarget = formTarget
  }

  /**
   * @returns {string}
   */
  get formTarget() {
    return this.node.formTarget
  }

  /**
   * @param {string} name
   */
  set name(name) {
    this.node.name = name
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.node.name
  }

  /**
   * @param {string} type
   */
  set type(type) {
    this.node.type = type
  }

  /**
   * @returns {string}
   */
  get type() {
    return this.node.type
  }

  /**
   * @param {string} value
   */
  set value(value) {
    this.node.value = value
  }

  /**
   * @returns {string}
   */
  get value() {
    return this.node.value
  }

  /**
   * @returns {boolean}
   */
  get willValidate() {
    return this.node.willValidate
  }

  /**
   * @returns {ValidityState}
   */
  get validity() {
    return this.node.validity
  }

  /**
   * @returns {string}
   */
  get validationMessage() {
    return this.node.validationMessage
  }

  /**
   * @returns {array.HtmlLabel}
   */
  get labels() {
    return map.call(this.node.labels, node => _HtmlLabel__WEBPACK_IMPORTED_MODULE_2__.HtmlLabel.get(node))
  }
}


/***/ }),
/* 180 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlForm": () => (/* binding */ HtmlForm)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


const { map } = Array.prototype

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-form-element
 */
class HtmlForm extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @returns {boolean}
   */
  checkValidity() {
    return this.node.checkValidity()
  }

  /**
   * @returns {boolean}
   */
  reportValidity() {
    return this.node.reportValidity()
  }

  /**
   * Reset the form
   */
  reset() {
    this.node.reset()
  }

  /**
   * Submit the form
   */
  submit() {
    this.node.submit()
  }

  /**
   * @param {string} acceptCharset
   */
  set acceptCharset(acceptCharset) {
    this.node.acceptCharset = acceptCharset
  }

  /**
   * @returns {string}
   */
  get acceptCharset() {
    return this.node.acceptCharset
  }

  /**
   * @param {string} action
   */
  set action(action) {
    this.node.action = action
  }

  /**
   * @return {string}
   */
  get action() {
    return this.node.action
  }

  /**
   * @param {string} autocomplete
   */
  set autocomplete(autocomplete) {
    this.node.autocomplete = autocomplete
  }

  /**
   * @returns {string}
   */
  get autocomplete() {
    return this.node.autocomplete
  }

  /**
   * @returns {HtmlElem[]}
   */
  get elements() {
    return map.call(this.node.elements, node => _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem.get(node))
  }

  /**
   * @param {string} enctype
   */
  set enctype(enctype) {
    this.node.enctype = enctype
  }

  /**
   * @returns {string}
   */
  get enctype() {
    return this.node.enctype
  }

  /**
   * @param {string} method
   */
  set method(method) {
    this.node.method = method
  }

  /**
   * @returns {string}
   */
  get method() {
    return this.node.method
  }

  /**
   * @param {string} name
   */
  set name(name) {
    this.node.name = name
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.node.name
  }

  /**
   * @param {boolean} noValidate
   */
  set noValidate(noValidate) {
    this.node.noValidate = noValidate
  }

  /**
   * @returns {boolean}
   */
  get noValidate() {
    return this.node.noValidate
  }

  /**
   * @param {string} target
   */
  set target(target) {
    this.node.target = target
  }

  /**
   * @returns {string}
   */
  get target() {
    return this.node.target
  }
}


/***/ }),
/* 181 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlLabel": () => (/* binding */ HtmlLabel)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(180);



/**
 * @see https://www.w3.org/TR/html/single-page.html#the-label-element
 */
class HtmlLabel extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {HtmlElem} control
   */
  set control(control) {
    this.htmlFor = control.id || (control.id = control.generateId())
  }

  /**
   * @returns {Button|Input|Meter|Output|Progress|Select|TextArea|null}
   */
  get control() {
    return _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem.get(this.node.control)
  }

  /**
   * @returns {Form|null}
   */
  get form() {
    return _HtmlForm__WEBPACK_IMPORTED_MODULE_1__.HtmlForm.get(this.node.form)
  }

  /**
   * @param {string} htmlFor
   */
  set htmlFor(htmlFor) {
    this.node.htmlFor = htmlFor
  }

  /**
   * @returns {string}
   */
  get htmlFor() {
    return this.node.htmlFor
  }
}


/***/ }),
/* 182 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlCanvas": () => (/* binding */ HtmlCanvas)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-canvas-element
 */
class HtmlCanvas extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {string} contextId
   * @param {*} args
   * @returns {*|CanvasRenderingContext2D|WebGLRenderingContext}
   */
  getContext(contextId, ...args) {
    return this.node.getContext(contextId, ...args)
  }

  /**
   * @param {string} contextId
   * @param {*} args
   * @returns {boolean}
   */
  probablySupportsContext(contextId, ...args) {
    return this.node.probablySupportsContext(contextId, ...args)
  }

  /**
   * @param {string} type
   * @param {*} args
   * @returns {string}
   */
  toDataURL(type, ...args) {
    return this.node.toDataURL(type, ...args)
  }

  /**
   * @param {function} _callback
   * @param {string} type
   * @param {*} args
   */
  toBlob(_callback, type, ...args) {
    this.node.toBlob(_callback, type, ...args)
  }

  /**
   * @param {number} width
   */
  set width(width) {
    this.node.width = width
  }

  /**
   * @returns {number}
   */
  get width() {
    return this.node.width
  }

  /**
   * @param {number} height
   */
  set height(height) {
    this.node.height = height
  }

  /**
   * @returns {number}
   */
  get height() {
    return this.node.height
  }
}


/***/ }),
/* 183 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlCaption": () => (/* binding */ HtmlCaption)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-caption-element
 */
class HtmlCaption extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 184 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlCite": () => (/* binding */ HtmlCite)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-cite-element
 */
class HtmlCite extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 185 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlCode": () => (/* binding */ HtmlCode)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-code-element
 */
class HtmlCode extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 186 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlCol": () => (/* binding */ HtmlCol)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-col-element
 */
class HtmlCol extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {number} span
   */
  set span(span) {
    this.node.span = span
  }

  /**
   * @returns {number}
   */
  get span() {
    return this.node.span
  }
}


/***/ }),
/* 187 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlColGroup": () => (/* binding */ HtmlColGroup)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-colgroup-element
 */
class HtmlColGroup extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {number} span
   */
  set span(span) {
    this.node.span = span
  }

  /**
   * @returns {number}
   */
  get span() {
    return this.node.span
  }
}


/***/ }),
/* 188 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlData": () => (/* binding */ HtmlData)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-data-element
 */
class HtmlData extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {string} value
   */
  set value(value) {
    this.node.value = value
  }

  /**
   * @returns {string}
   */
  get value() {
    return this.node.value
  }
}


/***/ }),
/* 189 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDataList": () => (/* binding */ HtmlDataList)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _HtmlOption__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(190);



const { map } = Array.prototype

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-datalist-element
 */
class HtmlDataList extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @returns {array.HtmlOption}
   */
  get options() {
    return map.call(this.node.options, option => {
      return _HtmlOption__WEBPACK_IMPORTED_MODULE_1__.HtmlOption.get(option)
    })
  }
}


/***/ }),
/* 190 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlOption": () => (/* binding */ HtmlOption)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(180);



/**
 * @see https://www.w3.org/TR/html/single-page.html#the-option-element
 */
class HtmlOption extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    this.node.disabled = disabled
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return this.node.disabled
  }

  /**
   * @returns {HtmlForm|null}
   */
  get form() {
    return _HtmlForm__WEBPACK_IMPORTED_MODULE_1__.HtmlForm.get(this.node.form)
  }

  /**
   * @param {string} label
   */
  set label(label) {
    this.node.label = label
  }

  /**
   * @returns {string}
   */
  get label() {
    return this.node.label
  }

  /**
   * @param {boolean} defaultSelected
   */
  set defaultSelected(defaultSelected) {
    this.node.defaultSelected = defaultSelected
  }

  /**
   * @returns {boolean}
   */
  get defaultSelected() {
    return this.node.defaultSelected
  }

  /**
   * @param {boolean} selected
   */
  set selected(selected) {
    this.node.selected = selected
  }

  /**
   * @returns {boolean}
   */
  get selected() {
    return this.node.selected
  }

  /**
   * @param {string} value
   */
  set value(value) {
    this.node.value = value
  }

  /**
   * @returns {string}
   */
  get value() {
    return this.node.value
  }

  /**
   * @param {string} text
   */
  set text(text) {
    this.node.text = text
  }

  /**
   * @returns {string}
   */
  get text() {
    return this.node.text
  }

  /**
   * @returns {number}
   */
  get index() {
    return this.node.index
  }
}


/***/ }),
/* 191 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDd": () => (/* binding */ HtmlDd)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-dd-element
 */
class HtmlDd extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 192 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDel": () => (/* binding */ HtmlDel)
/* harmony export */ });
/* harmony import */ var _HtmlMod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(193);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-del-element
 */
class HtmlDel extends _HtmlMod__WEBPACK_IMPORTED_MODULE_0__.HtmlMod
{
}


/***/ }),
/* 193 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlMod": () => (/* binding */ HtmlMod)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#htmlmodelement
 * @abstract
 */
class HtmlMod extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {string} cite
   */
  set cite(cite) {
    this.node.cite = cite
  }

  /**
   * @returns {string}
   */
  get cite() {
    return this.node.cite
  }

  /**
   * @param {string} dateTime
   */
  set dateTime(dateTime) {
    this.node.dateTime = dateTime
  }

  /**
   * @returns {string}
   */
  get dateTime() {
    return this.node.dateTime
  }

  /**
   * @returns {constructor} HtmlMod
   */
  static get superAssembler() {
    return HtmlMod
  }
}


/***/ }),
/* 194 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDetails": () => (/* binding */ HtmlDetails)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-details-element
 */
class HtmlDetails extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {boolean} open
   */
  set open(open) {
    this.node.open = open
  }

  /**
   * @returns {boolean}
   */
  get open() {
    return this.node.open
  }
}


/***/ }),
/* 195 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDfn": () => (/* binding */ HtmlDfn)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-dfn-element
 */
class HtmlDfn extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 196 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDialog": () => (/* binding */ HtmlDialog)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-dialog-element
 */
class HtmlDialog extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {MouseEvent|Element} [anchor]
   */
  show(anchor) {
    this.node.show(anchor)
  }

  /**
   * @param {MouseEvent|Element} [anchor]
   */
  showModal(anchor) {
    this.node.showModal(anchor)
  }

  /**
   * @param {string} returnValue
   */
  close(returnValue) {
    this.node.close(returnValue)
  }

  /**
   * @param {boolean} open
   */
  set open(open) {
    this.node.open = open
  }

  /**
   * @returns {boolean}
   */
  get open() {
    return this.node.open
  }

  /**
   * @param {string} returnValue
   */
  set returnValue(returnValue) {
    this.node.returnValue = returnValue
  }

  /**
   * @returns {string}
   */
  get returnValue() {
    return this.node.returnValue
  }
}


/***/ }),
/* 197 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDiv": () => (/* binding */ HtmlDiv)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-div-element
 */
class HtmlDiv extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 198 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDl": () => (/* binding */ HtmlDl)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-dl-element
 */
class HtmlDl extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 199 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDt": () => (/* binding */ HtmlDt)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-dt-element
 */
class HtmlDt extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 200 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlEm": () => (/* binding */ HtmlEm)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-em-element
 */
class HtmlEm extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 201 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlEmbed": () => (/* binding */ HtmlEmbed)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-embed-element
 */
class HtmlEmbed extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {string} src
   */
  set src(src) {
    this.node.src = src
  }

  /**
   * @returns {string}
   */
  get src() {
    return this.node.src
  }

  /**
   * @param {string} type
   */
  set type(type) {
    this.node.type = type
  }

  /**
   * @returns {string}
   */
  get type() {
    return this.node.type
  }

  /**
   * @param {number} width
   */
  set width(width) {
    this.node.width = width
  }

  /**
   * @returns {number}
   */
  get width() {
    return this.node.width
  }

  /**
   * @param {number} height
   */
  set height(height) {
    this.node.height = height
  }

  /**
   * @returns {number}
   */
  get height() {
    return this.node.height
  }
}


/***/ }),
/* 202 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlFieldSet": () => (/* binding */ HtmlFieldSet)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(180);



const { map } = Array.prototype

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-fieldset-element
 */
class HtmlFieldSet extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @returns {boolean}
   */
  checkValidity() {
    return this.node.checkValidity()
  }

  /**
   * @returns {boolean}
   */
  reportValidity() {
    return this.node.reportValidity()
  }

  /**
   * @param {string} error
   */
  setCustomValidity(error) {
    this.node.setCustomValidity(error)
  }

  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    this.node.disabled = disabled
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return this.node.disabled
  }

  /**
   * @returns {HtmlForm|null}
   */
  get form() {
    return _HtmlForm__WEBPACK_IMPORTED_MODULE_1__.HtmlForm.get(this.node.form)
  }

  /**
   * @param {string} name
   */
  set name(name) {
    this.node.name = name
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.node.name
  }

  /**
   * @returns {string}
   */
  get type() {
    return this.node.type
  }

  /**
   * @returns {array.HtmlElem|*}
   */
  get elements() {
    return map.call(this.node.elements, node => _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem.get(node))
  }

  /**
   * @returns {boolean}
   */
  get willValidate() {
    return this.node.willValidate
  }

  /**
   * @returns {ValidityState}
   */
  get validity() {
    return this.node.validity
  }

  /**
   * @returns {string}
   */
  get validationMessage() {
    return this.node.validationMessage
  }
}


/***/ }),
/* 203 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlFigCaption": () => (/* binding */ HtmlFigCaption)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-figcaption-element
 */
class HtmlFigCaption extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 204 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlFigure": () => (/* binding */ HtmlFigure)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-figure-element
 */
class HtmlFigure extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 205 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlFooter": () => (/* binding */ HtmlFooter)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-footer-element
 */
class HtmlFooter extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 206 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlH1": () => (/* binding */ HtmlH1)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-h1-element
 */
class HtmlH1 extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 207 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlH2": () => (/* binding */ HtmlH2)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-h2-element
 */
class HtmlH2 extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 208 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlH3": () => (/* binding */ HtmlH3)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-h3-element
 */
class HtmlH3 extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 209 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlH4": () => (/* binding */ HtmlH4)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-h4-element
 */
class HtmlH4 extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 210 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlH5": () => (/* binding */ HtmlH5)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-h5-element
 */
class HtmlH5 extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 211 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlH6": () => (/* binding */ HtmlH6)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-h6-element
 */
class HtmlH6 extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 212 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlHGroup": () => (/* binding */ HtmlHGroup)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-hgroup-element
 */
class HtmlHGroup extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 213 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlObject": () => (/* binding */ HtmlObject)
/* harmony export */ });
/* harmony import */ var _DomDoc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(180);




/**
 * @see https://www.w3.org/TR/html/single-page.html#the-object-element
 */
class HtmlObject extends _HtmlElem__WEBPACK_IMPORTED_MODULE_1__.HtmlElem
{
  /**
   * @returns {boolean}
   */
  checkValidity() {
    return this.node.checkValidity()
  }

  /**
   * @returns {boolean}
   */
  reportValidity() {
    return this.node.reportValidity()
  }

  /**
   * @param {string} error
   */
  setCustomValidity(error) {
    this.node.setCustomValidity(error)
  }

  /**
   * @param {string} name
   */
  set name(name) {
    this.node.name = name
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.node.name
  }

  /**
   * @param {string} data
   */
  set data(data) {
    this.node.data = data
  }

  /**
   * @returns {string}
   */
  get data() {
    return this.node.data
  }

  /**
   * @param {string} type
   */
  set type(type) {
    this.node.type = type
  }

  /**
   * @returns {string}
   */
  get type() {
    return this.node.type
  }

  /**
   * @param {boolean} typeMustMatch
   */
  set typeMustMatch(typeMustMatch) {
    this.node.typeMustMatch = typeMustMatch
  }

  /**
   * @returns {boolean}
   */
  get typeMustMatch() {
    return this.node.typeMustMatch
  }

  /**
   * @param {string} useMap
   */
  set useMap(useMap) {
    this.node.useMap = useMap
  }

  /**
   * @returns {string}
   */
  get useMap() {
    return this.node.useMap
  }

  /**
   * @param {string} width
   */
  set width(width) {
    this.node.width = width
  }

  /**
   * @returns {string}
   */
  get width() {
    return this.node.width
  }

  /**
   * @param {string} height
   */
  set height(height) {
    this.node.height = height
  }

  /**
   * @returns {string}
   */
  get height() {
    return this.node.height
  }

  /**
   * @returns {Form|null}
   */
  get form() {
    return _HtmlForm__WEBPACK_IMPORTED_MODULE_2__.HtmlForm.get(this.node.form)
  }

  /**
   * @returns {boolean}
   */
  get willValidate() {
    return this.node.willValidate
  }

  /**
   * @returns {ValidityState}
   */
  get validity() {
    return this.node.validity
  }

  /**
   * @returns {string}
   */
  get validationMessage() {
    return this.node.validationMessage
  }

  /**
   * @returns {DomDoc}
   */
  get contentDocument() {
    return _DomDoc__WEBPACK_IMPORTED_MODULE_0__.DomDoc.get(this.node.contentDocument)
  }
}


/***/ }),
/* 214 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTableCell": () => (/* binding */ HtmlTableCell)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#htmltablecellelement
 * @abstract
 */
class HtmlTableCell extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {number} colSpan
   */
  set colSpan(colSpan) {
    this.node.colSpan = colSpan
  }

  /**
   * @returns {number}
   */
  get colSpan() {
    return this.node.colSpan
  }

  /**
   * @param {number} rowSpan
   */
  set rowSpan(rowSpan) {
    this.node.rowSpan = rowSpan
  }

  /**
   * @returns {number}
   */
  get rowSpan() {
    return this.node.rowSpan
  }

  /**
   * @param {string} headers
   */
  set headers(headers) {
    this.node.headers = headers
  }

  /**
   * @returns {string}
   */
  get headers() {
    return this.node.headers
  }

  /**
   * @returns {number}
   */
  get cellIndex() {
    return this.node.cellIndex
  }

  /**
   * @returns {constructor} HtmlTableCell
   */
  static get superAssembler() {
    return HtmlTableCell
  }
}


/***/ }),
/* 215 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlHeader": () => (/* binding */ HtmlHeader)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-header-element
 */
class HtmlHeader extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 216 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlHr": () => (/* binding */ HtmlHr)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-hr-element
 */
class HtmlHr extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 217 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlI": () => (/* binding */ HtmlI)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-i-element
 */
class HtmlI extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 218 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlIFrame": () => (/* binding */ HtmlIFrame)
/* harmony export */ });
/* harmony import */ var _DomDoc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);



/**
 * @see https://www.w3.org/TR/html/single-page.html#the-iframe-element
 */
class HtmlIFrame extends _HtmlElem__WEBPACK_IMPORTED_MODULE_1__.HtmlElem
{
  /**
   * @param {string} src
   */
  set src(src) {
    this.node.src = src
  }

  /**
   * @returns {string}
   */
  get src() {
    return this.node.src
  }

  /**
   * @param {string} srcdoc
   */
  set srcdoc(srcdoc) {
    this.node.srcdoc = srcdoc
  }

  /**
   * @returns {string}
   */
  get srcdoc() {
    return this.node.srcdoc
  }

  /**
   * @returns {DOMTokenList}
   */
  get sandbox() {
    return this.node.sandbox
  }

  /**
   * @param {boolean} allowFullScreen
   */
  set allowFullScreen(allowFullScreen) {
    this.node.allowFullScreen = allowFullScreen
  }

  /**
   * @returns {boolean}
   */
  get allowFullScreen() {
    return this.node.allowFullScreen
  }

  /**
   * @param {boolean} allowPaymentRequest
   */
  set allowPaymentRequest(allowPaymentRequest) {
    this.node.allowPaymentRequest = allowPaymentRequest
  }

  /**
   * @returns {boolean}
   */
  get allowPaymentRequest() {
    return this.node.allowPaymentRequest
  }

  /**
   * @param {number} width
   */
  set width(width) {
    this.node.width = width
  }

  /**
   * @returns {number}
   */
  get width() {
    return this.node.width
  }

  /**
   * @param {number} height
   */
  set height(height) {
    this.node.height = height
  }

  /**
   * @returns {number}
   */
  get height() {
    return this.node.height
  }

  /**
   * @param {string} referrerPolicy
   */
  set referrerPolicy(referrerPolicy) {
    this.node.referrerPolicy = referrerPolicy
  }

  /**
   * @returns {string}
   */
  get referrerPolicy() {
    return this.node.referrerPolicy
  }

  /**
   * @returns {DomDoc|null}
   */
  get contentDocument() {
    return _DomDoc__WEBPACK_IMPORTED_MODULE_0__.DomDoc.get(this.node.contentDocument)
  }
}


/***/ }),
/* 219 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlImg": () => (/* binding */ HtmlImg)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-img-element
 */
class HtmlImg extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @returns {Promise}
   */
  decode() {
    return this.node.decode()
  }

  /**
   * @param {string} alt
   */
  set alt(alt) {
    this.node.alt = alt
  }

  /**
   * @returns {string}
   */
  get alt() {
    return this.node.alt
  }

  /**
   * @returns {boolean}
   */
  get complete() {
    return this.node.complete
  }

  /**
   * @returns {string}
   */
  get currentSrc() {
    return this.node.currentSrc
  }

  /**
   * @param {string} referrerPolicy
   */
  set referrerPolicy(referrerPolicy) {
    this.node.referrerPolicy = referrerPolicy
  }

  /**
   * @returns {string}
   */
  get referrerPolicy() {
    return this.node.referrerPolicy
  }

  /**
   * @param {string} src
   */
  set src(src) {
    this.node.src = src
  }

  /**
   * @returns {string}
   */
  get src() {
    return this.node.src
  }

  /**
   * @param {string} srcset
   */
  set srcset(srcset) {
    this.node.srcset = srcset
  }

  /**
   * @returns {string}
   */
  get srcset() {
    return this.node.srcset
  }

  /**
   * @param {string} sizes
   */
  set sizes(sizes) {
    this.node.sizes = sizes
  }

  /**
   * @returns {string}
   */
  get sizes() {
    return this.node.sizes
  }

  /**
   * @param {string} crossOrigin
   */
  set crossOrigin(crossOrigin) {
    this.node.crossOrigin = crossOrigin
  }

  /**
   * @returns {string}
   */
  get crossOrigin() {
    return this.node.crossOrigin
  }

  /**
   * @param {string} useMap
   */
  set useMap(useMap) {
    this.node.useMap = useMap
  }

  /**
   * @returns {string}
   */
  get useMap() {
    return this.node.useMap
  }

  /**
   * @param {boolean} isMap
   */
  set isMap(isMap) {
    this.node.isMap = isMap
  }

  /**
   * @returns {boolean}
   */
  get isMap() {
    return this.node.isMap
  }

  /**
   * @returns {number}
   */
  get naturalWidth() {
    return this.node.naturalWidth
  }

  /**
   * @returns {number}
   */
  get naturalHeight() {
    return this.node.naturalHeight
  }

  /**
   * @param {number} height
   */
  set height(height) {
    this.node.height = height
  }

  /**
   * @returns {number}
   */
  get height() {
    return this.node.height
  }

  /**
   * @param {number} width
   */
  set width(width) {
    this.node.width = width
  }

  /**
   * @returns {number}
   */
  get width() {
    return this.node.width
  }
}


/***/ }),
/* 220 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlInput": () => (/* binding */ HtmlInput)
/* harmony export */ });
/* harmony import */ var _HtmlDataList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(189);
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(180);
/* harmony import */ var _HtmlLabel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(181);





const { map } = Array.prototype

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-input-element
 */
class HtmlInput extends _HtmlElem__WEBPACK_IMPORTED_MODULE_1__.HtmlElem
{
  /**
   * @returns {boolean}
   */
  checkValidity() {
    return this.node.checkValidity()
  }

  /**
   * @returns {boolean}
   */
  reportValidity() {
    return this.node.reportValidity()
  }

  /**
   * Select the input
   */
  select() {
    this.node.select()
  }

  /**
   * @param {string} error
   */
  setCustomValidity(error) {
    this.node.setCustomValidity(error)
  }

  /**
   * @param {*} args
   */
  setRangeText(...args) {
    this.node.setRangeText(...args)
  }

  /**
   * @param {*} args
   */
  setSelectionRange(...args) {
    this.node.setSelectionRange(...args)
  }

  /**
   * @param {number} n
   */
  stepDown(n) {
    this.node.stepDown()
  }

  /**
   * @param {number} n
   */
  stepUp(n) {
    this.node.stepUp()
  }

  /**
   * @param {string} accept
   */
  set accept(accept) {
    this.node.accept = accept
  }

  /**
   * @returns {string}
   */
  get accept() {
    return this.node.accept
  }

  /**
   * @param {string} alt
   */
  set alt(alt) {
    this.node.alt = alt
  }

  /**
   * @returns {string}
   */
  get alt() {
    return this.node.alt
  }

  /**
   * @param {string} autocomplete
   */
  set autocomplete(autocomplete) {
    this.node.autocomplete = autocomplete
  }

  /**
   * @returns {string}
   */
  get autocomplete() {
    return this.node.autocomplete
  }

  /**
   * @param {boolean} autofocus
   */
  set autofocus(autofocus) {
    this.node.autofocus = autofocus
  }

  /**
   * @returns {boolean}
   */
  get autofocus() {
    return this.node.autofocus
  }

  /**
   * @param {boolean} defaultChecked
   */
  set defaultChecked(defaultChecked) {
    this.node.defaultChecked = defaultChecked
  }

  /**
   * @returns {boolean}
   */
  get defaultChecked() {
    return this.node.defaultChecked
  }

  /**
   * @param {boolean} checked
   */
  set checked(checked) {
    this.node.checked = checked
  }

  /**
   * @returns {boolean}
   */
  get checked() {
    return this.node.checked
  }

  /**
   * @param {string} dirName
   */
  set dirName(dirName) {
    this.node.dirName = dirName
  }

  /**
   * @returns {string}
   */
  get dirName() {
    return this.node.dirName
  }

  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    this.node.disabled = disabled
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return this.node.disabled
  }

  /**
   * @returns {HtmlForm|null}
   */
  get form() {
    return _HtmlForm__WEBPACK_IMPORTED_MODULE_2__.HtmlForm.get(this.node.form)
  }

  /**
   * @param {*} files
   */
  set files(files) {
    this.node.files = files
  }

  /**
   * @returns {*}
   */
  get files() {
    return this.node.files
  }

  /**
   * @param {string} formAction
   */
  set formAction(formAction) {
    this.node.formAction = formAction
  }

  /**
   * @returns {string}
   */
  get formAction() {
    return this.node.formAction
  }

  /**
   * @param {string} formEnctype
   */
  set formEnctype(formEnctype) {
    this.node.formEnctype = formEnctype
  }

  /**
   * @returns {string}
   */
  get formEnctype() {
    return this.node.formEnctype
  }

  /**
   * @param {string} formMethod
   */
  set formMethod(formMethod) {
    this.node.formMethod = formMethod
  }

  /**
   * @returns {string}
   */
  get formMethod() {
    return this.node.formMethod
  }

  /**
   * @param {boolean} formNoValidate
   */
  set formNoValidate(formNoValidate) {
    this.node.formNoValidate = formNoValidate
  }

  /**
   * @returns {boolean}
   */
  get formNoValidate() {
    return this.node.formNoValidate
  }

  /**
   * @param {string} formTarget
   */
  set formTarget(formTarget) {
    this.node.formTarget = formTarget
  }

  /**
   * @returns {string}
   */
  get formTarget() {
    return this.node.formTarget
  }

  /**
   * @param {number} height
   */
  set height(height) {
    this.node.height = height
  }

  /**
   * @returns {number}
   */
  get height() {
    return this.node.height
  }

  /**
   * @param {boolean} indeterminate
   */
  set indeterminate(indeterminate) {
    this.node.indeterminate = indeterminate
  }

  /**
   * @returns {boolean}
   */
  get indeterminate() {
    return this.node.indeterminate
  }

  /**
   * @param {string} inputMode
   */
  set inputMode(inputMode) {
    this.node.inputMode = inputMode
  }

  /**
   * @returns {string}
   */
  get inputMode() {
    return this.node.inputMode
  }

  /**
   * @param {HtmlDataList|null} list
   */
  set list(list) {
    if(!list) {
      this.removeAttr('list')
      return
    }
    if(!list.id) {
      list.id = list.generateId()
    }
    this.setAttr('list', list.id)
    if(this.doc.contains(list)) {
      return
    }
    if(this.doc.contains(this)) {
      this.after(list)
    }
    else setTimeout(() => this.after(list))
  }

  /**
   * @returns {HtmlDataList|null}
   */
  get list() {
    return _HtmlDataList__WEBPACK_IMPORTED_MODULE_0__.HtmlDataList.get(this.node.list)
  }

  /**
   * @param {string} max
   */
  set max(max) {
    this.node.max = max
  }

  /**
   * @returns {string}
   */
  get max() {
    return this.node.max
  }

  /**
   * @param {number} maxLength
   */
  set maxLength(maxLength) {
    this.node.maxLength = maxLength
  }

  /**
   * @returns {number}
   */
  get maxLength() {
    return this.node.maxLength
  }

  /**
   * @param {string} min
   */
  set min(min) {
    this.node.min = min
  }

  /**
   * @returns {string}
   */
  get min() {
    return this.node.min
  }

  /**
   * @param {number} minLength
   */
  set minLength(minLength) {
    this.node.minLength = minLength
  }

  /**
   * @returns {number}
   */
  get minLength() {
    return this.node.minLength
  }

  /**
   * @param {boolean} multiple
   */
  set multiple(multiple) {
    this.node.multiple = multiple
  }

  /**
   * @returns {boolean}
   */
  get multiple() {
    return this.node.multiple
  }

  /**
   * @param {string} name
   */
  set name(name) {
    this.node.name = name
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.node.name
  }

  /**
   * @param {string} pattern
   */
  set pattern(pattern) {
    this.node.pattern = pattern
  }

  /**
   * @returns {string}
   */
  get pattern() {
    return this.node.pattern
  }

  /**
   * @param {string} placeholder
   */
  set placeholder(placeholder) {
    this.node.placeholder = placeholder
  }

  /**
   * @returns {string}
   */
  get placeholder() {
    return this.node.placeholder
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.node.readOnly = readOnly
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.node.readOnly
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.node.required = required
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.node.required
  }

  /**
   * @param {number} size
   */
  set size(size) {
    this.node.size = size
  }

  /**
   * @returns {number}
   */
  get size() {
    return this.node.size
  }

  /**
   * @param {string} src
   */
  set src(src) {
    this.node.src = src
  }

  /**
   * @returns {string}
   */
  get src() {
    return this.node.src
  }

  /**
   * @param {string} step
   */
  set step(step) {
    this.node.step = step
  }

  /**
   * @returns {string}
   */
  get step() {
    return this.node.step
  }

  /**
   * @param {string} type
   */
  set type(type) {
    this.node.type = type
  }

  /**
   * @returns {string}
   */
  get type() {
    return this.node.type
  }

  /**
   * @param {string} defaultValue
   */
  set defaultValue(defaultValue) {
    this.node.defaultValue = defaultValue
  }

  /**
   * @returns {string}
   */
  get defaultValue() {
    return this.node.defaultValue
  }

  /**
   * @param {string} value
   */
  set value(value) {
    this.node.value = value
  }

  /**
   * @returns {string}
   */
  get value() {
    return this.node.value
  }

  /**
   * @param {Date} valueAsDate
   */
  set valueAsDate(valueAsDate) {
    this.node.valueAsDate = valueAsDate
  }

  /**
   * @returns {Date}
   */
  get valueAsDate() {
    return this.node.valueAsDate
  }

  /**
   * @param {number} valueAsNumber
   */
  set valueAsNumber(valueAsNumber) {
    this.node.valueAsNumber = valueAsNumber
  }

  /**
   * @returns {number}
   */
  get valueAsNumber() {
    return this.node.valueAsNumber
  }

  /**
   * @param {number} width
   */
  set width(width) {
    this.node.width = width
  }

  /**
   * @returns {number}
   */
  get width() {
    return this.node.width
  }

  /**
   * @returns {boolean}
   */
  get willValidate() {
    return this.node.willValidate
  }

  /**
   * @returns {ValidityState}
   */
  get validity() {
    return this.node.validity
  }

  /**
   * @returns {string}
   */
  get validationMessage() {
    return this.node.validationMessage
  }

  /**
   * @returns {array.Label}
   */
  get labels() {
    return map.call(this.node.labels, node => _HtmlLabel__WEBPACK_IMPORTED_MODULE_3__.HtmlLabel.get(node))
  }

  /**
   * @param {number} selectionStart
   */
  set selectionStart(selectionStart) {
    this.node.selectionStart = selectionStart
  }

  /**
   * @returns {number}
   */
  get selectionStart() {
    return this.node.selectionStart
  }

  /**
   * @param {number} selectionEnd
   */
  set selectionEnd(selectionEnd) {
    this.node.selectionEnd = selectionEnd
  }

  /**
   * @returns {number}
   */
  get selectionEnd() {
    return this.node.selectionEnd
  }

  /**
   * @param {string} selectionDirection
   */
  set selectionDirection(selectionDirection) {
    this.node.selectionDirection = selectionDirection
  }

  /**
   * @returns {string}
   */
  get selectionDirection() {
    return this.node.selectionDirection
  }
}


/***/ }),
/* 221 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlIns": () => (/* binding */ HtmlIns)
/* harmony export */ });
/* harmony import */ var _HtmlMod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(193);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-ins-element
 */
class HtmlIns extends _HtmlMod__WEBPACK_IMPORTED_MODULE_0__.HtmlMod
{
}


/***/ }),
/* 222 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlKbd": () => (/* binding */ HtmlKbd)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-kbd-element
 */
class HtmlKbd extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 223 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlLegend": () => (/* binding */ HtmlLegend)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(180);



/**
 * @see https://www.w3.org/TR/html/single-page.html#the-legend-element
 */
class HtmlLegend extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @returns {Form|null}
   */
  get form() {
    return _HtmlForm__WEBPACK_IMPORTED_MODULE_1__.HtmlForm.get(this.node.form)
  }
}


/***/ }),
/* 224 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlLi": () => (/* binding */ HtmlLi)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-li-element
 */
class HtmlLi extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {number} value
   */
  set value(value) {
    this.node.value = value
  }

  /**
   * @returns {number}
   */
  get value() {
    return this.node.value
  }
}


/***/ }),
/* 225 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlLink": () => (/* binding */ HtmlLink)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-link-element
 */
class HtmlLink extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {string} href
   */
  set href(href) {
    this.node.href = href
  }

  /**
   * @returns {string}
   */
  get href() {
    return this.node.href
  }

  /**
   * @param {string} crossOrigin
   */
  set crossOrigin(crossOrigin) {
    this.node.crossOrigin = crossOrigin
  }

  /**
   * @returns {string}
   */
  get crossOrigin() {
    return this.node.crossOrigin
  }

  /**
   * @param {string} rel
   */
  set rel(rel) {
    this.node.rel = rel
  }

  /**
   * @returns {string}
   */
  get rel() {
    return this.node.rel
  }


  /**
   * @param {string} rev
   */
  set rev(rev) {
    this.node.rev = rev
  }

  /**
   * @returns {string}
   */
  get rev() {
    return this.node.rev
  }

  /**
   * @returns {DOMTokenList}
   */
  get relList() {
    return this.node.relList
  }

  /**
   * @param {string} media
   */
  set media(media) {
    this.node.media = media
  }

  /**
   * @returns {string}
   */
  get media() {
    return this.node.media
  }

  /**
   * @param {string} nonce
   */
  set nonce(nonce) {
    this.node.nonce = nonce
  }

  /**
   * @returns {string}
   */
  get nonce() {
    return this.node.nonce
  }

  /**
   * @param {string} hreflang
   */
  set hreflang(hreflang) {
    this.node.hreflang = hreflang
  }

  /**
   * @returns {string}
   */
  get hreflang() {
    return this.node.hreflang
  }

  /**
   * @param {string} type
   */
  set type(type) {
    this.node.type = type
  }

  /**
   * @returns {string}
   */
  get type() {
    return this.node.type
  }

  /**
   * @returns {string}
   */
  get sizes() {
    return this.node.sizes
  }

  /**
   * @param {string} referrerPolicy
   */
  set referrerPolicy(referrerPolicy) {
    this.node.referrerPolicy = referrerPolicy
  }

  /**
   * @returns {string}
   */
  get referrerPolicy() {
    return this.node.referrerPolicy
  }
}


/***/ }),
/* 226 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlMain": () => (/* binding */ HtmlMain)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-main-element
 */
class HtmlMain extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 227 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlMap": () => (/* binding */ HtmlMap)
/* harmony export */ });
/* harmony import */ var _HtmlArea__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(168);
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var _HtmlImg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(219);
/* harmony import */ var _HtmlObject__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(213);





const _map = Array.prototype.map

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-map-element
 */
class HtmlMap extends _HtmlElem__WEBPACK_IMPORTED_MODULE_1__.HtmlElem
{
  /**
   * @returns {HtmlArea[]}
   */
  get areas() {
    return _map.call(this.node.areas, node => _HtmlArea__WEBPACK_IMPORTED_MODULE_0__.HtmlArea.get(node))
  }

  /**
   * @returns {array.HtmlImg|array.HtmlObject}
   */
  get images() {
    return _map.call(this.node.images, node => {
      return node.localName === 'img'?
        _HtmlImg__WEBPACK_IMPORTED_MODULE_2__.HtmlImg.get(node) :
        _HtmlObject__WEBPACK_IMPORTED_MODULE_3__.HtmlObject.get(node)
    })
  }

  /**
   * @param {string} name
   */
  set name(name) {
    this.node.name = name
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.node.name
  }
}


/***/ }),
/* 228 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlMark": () => (/* binding */ HtmlMark)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-mark-element
 */
class HtmlMark extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 229 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlMenu": () => (/* binding */ HtmlMenu)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-menu-element
 */
class HtmlMenu extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 230 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlMeta": () => (/* binding */ HtmlMeta)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-meta-element
 */
class HtmlMeta extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {string} httpEquiv
   */
  set httpEquiv(httpEquiv) {
    this.node.httpEquiv = httpEquiv
  }

  /**
   * @returns {string}
   */
  get httpEquiv() {
    return this.node.httpEquiv
  }

  /**
   * @param {string} name
   */
  set name(name) {
    this.node.name = name
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.node.name
  }

  /**
   * @param {string} content
   */
  set content(content) {
    this.node.content = content
  }

  /**
   * @returns {string}
   */
  get content() {
    return this.node.content
  }
}


/***/ }),
/* 231 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlMeter": () => (/* binding */ HtmlMeter)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _HtmlLabel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(181);



const { map } = Array.prototype

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-meter-element
 */
class HtmlMeter extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {number} value
   */
  set value(value) {
    this.node.value = value
  }

  /**
   * @returns {number}
   */
  get value() {
    return this.node.value
  }

  /**
   * @param {number} min
   */
  set min(min) {
    this.node.min = min
  }

  /**
   * @returns {number}
   */
  get min() {
    return this.node.min
  }

  /**
   * @param {number} max
   */
  set max(max) {
    this.node.max = max
  }

  /**
   * @returns {number}
   */
  get max() {
    return this.node.max
  }

  /**
   * @param {number} low
   */
  set low(low) {
    this.node.low = low
  }

  /**
   * @returns {number}
   */
  get low() {
    return this.node.low
  }

  /**
   * @param {number} high
   */
  set high(high) {
    this.node.high = high
  }

  /**
   * @returns {number}
   */
  get high() {
    return this.node.high
  }

  /**
   * @param {number} optimum
   */
  set optimum(optimum) {
    this.node.optimum = optimum
  }

  /**
   * @returns {number}
   */
  get optimum() {
    return this.node.optimum
  }

  /**
   * @returns {HtmlLabel[]}
   */
  get labels() {
    return map.call(this.node.labels, node => _HtmlLabel__WEBPACK_IMPORTED_MODULE_1__.HtmlLabel.get(node))
  }
}


/***/ }),
/* 232 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlNav": () => (/* binding */ HtmlNav)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-nav-element
 */
class HtmlNav extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 233 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlNoScript": () => (/* binding */ HtmlNoScript)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-noscript-element
 */
class HtmlNoScript extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 234 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlOl": () => (/* binding */ HtmlOl)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-ol-element
 */
class HtmlOl extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {boolean} reversed
   */
  set reversed(reversed) {
    this.node.reversed = reversed
  }

  /**
   * @returns {boolean}
   */
  get reversed() {
    return this.node.reversed
  }

  /**
   * @param {number} start
   */
  set start(start) {
    this.node.start = start
  }

  /**
   * @returns {number}
   */
  get start() {
    return this.node.start
  }

  /**
   * @param {string} type
   */
  set type(type) {
    this.node.type = type
  }

  /**
   * @returns {string}
   */
  get type() {
    return this.node.type
  }
}


/***/ }),
/* 235 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlOptGroup": () => (/* binding */ HtmlOptGroup)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-optgroup-element
 */
class HtmlOptGroup extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    this.node.disabled = disabled
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return this.node.disabled
  }

  /**
   * @param {string} label
   */
  set label(label) {
    this.node.label = label
  }

  /**
   * @returns {string}
   */
  get label() {
    return this.node.label
  }
}


/***/ }),
/* 236 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlOutput": () => (/* binding */ HtmlOutput)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(180);
/* harmony import */ var _HtmlLabel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(181);




const { map } = Array.prototype

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-output-element
 */
class HtmlOutput extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @returns {boolean}
   */
  checkValidity() {
    return this.node.checkValidity()
  }

  /**
   * @returns {boolean}
   */
  reportValidity() {
    return this.node.reportValidity()
  }

  /**
   * @param {string} error
   */
  setCustomValidity(error) {
    this.node.setCustomValidity(error)
  }

  /**
   * @param {string} htmlFor
   */
  set htmlFor(htmlFor) {
    this.node.htmlFor = htmlFor
  }

  /**
   * @returns {string}
   */
  get htmlFor() {
    return this.node.htmlFor
  }

  /**
   * @returns {HtmlForm|null}
   */
  get form() {
    return _HtmlForm__WEBPACK_IMPORTED_MODULE_1__.HtmlForm.get(this.node.form)
  }

  /**
   * @returns {string}
   */
  get type() {
    return this.node.type
  }

  /**
   * @param {string} defaultValue
   */
  set defaultValue(defaultValue) {
    this.node.defaultValue = defaultValue
  }

  /**
   * @returns {string}
   */
  get defaultValue() {
    return this.node.defaultValue
  }

  /**
   * @param {string} name
   */
  set name(name) {
    this.node.name = name
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.node.name
  }

  /**
   * @param {string} value
   */
  set value(value) {
    this.node.value = value
  }

  /**
   * @returns {string}
   */
  get value() {
    return this.node.value
  }

  /**
   * @returns {boolean}
   */
  get willValidate() {
    return this.node.willValidate
  }

  /**
   * @returns {ValidityState}
   */
  get validity() {
    return this.node.validity
  }

  /**
   * @returns {string}
   */
  get validationMessage() {
    return this.node.validationMessage
  }

  /**
   * @returns {array.HtmlLabel}
   */
  get labels() {
    return map.call(this.node.labels, node => _HtmlLabel__WEBPACK_IMPORTED_MODULE_2__.HtmlLabel.get(node))
  }
}


/***/ }),
/* 237 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlP": () => (/* binding */ HtmlP)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-p-element
 */
class HtmlP extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 238 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlParam": () => (/* binding */ HtmlParam)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-param-element
 */
class HtmlParam extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {string} name
   */
  set name(name) {
    this.node.name = name
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.node.name
  }

  /**
   * @param {string} value
   */
  set value(value) {
    this.node.value = value
  }

  /**
   * @returns {string}
   */
  get value() {
    return this.node.value
  }
}


/***/ }),
/* 239 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlPicture": () => (/* binding */ HtmlPicture)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-picture-element
 */
class HtmlPicture extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 240 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlPre": () => (/* binding */ HtmlPre)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-pre-element
 */
class HtmlPre extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 241 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlProgress": () => (/* binding */ HtmlProgress)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _HtmlLabel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(181);



const { map } = Array.prototype

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-progress-element
 */
class HtmlProgress extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {number} value
   */
  set value(value) {
    this.node.value = value
  }

  /**
   * @returns {number}
   */
  get value() {
    return this.node.value
  }

  /**
   * @param {number} max
   */
  set max(max) {
    this.node.max = max
  }

  /**
   * @returns {number}
   */
  get max() {
    return this.node.max
  }

  /**
   * @returns {number}
   */
  get position() {
    return this.node.position
  }

  /**
   * @returns {HtmlLabel[]}
   */
  get labels() {
    return map.call(this.node.labels, node => _HtmlLabel__WEBPACK_IMPORTED_MODULE_1__.HtmlLabel.get(node))
  }
}


/***/ }),
/* 242 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlQ": () => (/* binding */ HtmlQ)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-q-element
 */
class HtmlQ extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {string} cite
   */
  set cite(cite) {
    this.node.cite = cite
  }

  /**
   * @returns {string}
   */
  get cite() {
    return this.node.cite
  }
}


/***/ }),
/* 243 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlRp": () => (/* binding */ HtmlRp)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-rp-element
 */
class HtmlRp extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 244 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlRt": () => (/* binding */ HtmlRt)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-rt-element
 */
class HtmlRt extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 245 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlRuby": () => (/* binding */ HtmlRuby)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-ruby-element
 */
class HtmlRuby extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 246 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlS": () => (/* binding */ HtmlS)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-s-element
 */
class HtmlS extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 247 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSamp": () => (/* binding */ HtmlSamp)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-samp-element
 */
class HtmlSamp extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 248 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlScript": () => (/* binding */ HtmlScript)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-script-element
 */
class HtmlScript extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {string} src
   */
  set src(src) {
    this.node.src = src
  }

  /**
   * @returns {string}
   */
  get src() {
    return this.node.src
  }

  /**
   * @param {string} type
   */
  set type(type) {
    this.node.type = type
  }

  /**
   * @returns {string}
   */
  get type() {
    return this.node.type
  }

  /**
   * @param {string} noModule
   */
  set noModule(noModule) {
    this.node.noModule = noModule
  }

  /**
   * @returns {string}
   */
  get noModule() {
    return this.node.noModule
  }

  /**
   * @param {string} charset
   */
  set charset(charset) {
    this.node.charset = charset
  }

  /**
   * @returns {string}
   */
  get charset() {
    return this.node.charset
  }

  /**
   * @param {boolean} async
   */
  set async(async) {
    this.node.async = async
  }

  /**
   * @returns {boolean}
   */
  get async() {
    return this.node.async
  }

  /**
   * @param {boolean} defer
   */
  set defer(defer) {
    this.node.defer = defer
  }

  /**
   * @returns {boolean}
   */
  get defer() {
    return this.node.defer
  }

  /**
   * @param {string} crossOrigin
   */
  set crossOrigin(crossOrigin) {
    this.node.crossOrigin = crossOrigin
  }

  /**
   * @returns {string}
   */
  get crossOrigin() {
    return this.node.crossOrigin
  }

  /**
   * @param {string} integrity
   */
  set integrity(integrity) {
    this.node.integrity = integrity
  }

  /**
   * @returns {string}
   */
  get integrity() {
    return this.node.integrity
  }

  /**
   * @param {string} referrerPolicy
   */
  set referrerPolicy(referrerPolicy) {
    this.node.referrerPolicy = referrerPolicy
  }

  /**
   * @returns {string}
   */
  get referrerPolicy() {
    return this.node.referrerPolicy
  }

  /**
   * @param {string} text
   */
  set text(text) {
    this.node.text = text
  }

  /**
   * @returns {string}
   */
  get text() {
    return this.node.text
  }

  /**
   * @param {string} nonce
   */
  set nonce(nonce) {
    this.node.nonce = nonce
  }

  /**
   * @returns {string}
   */
  get nonce() {
    return this.node.nonce
  }
}


/***/ }),
/* 249 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSection": () => (/* binding */ HtmlSection)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-section-element
 */
class HtmlSection extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 250 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSelect": () => (/* binding */ HtmlSelect)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(180);
/* harmony import */ var _HtmlLabel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(181);
/* harmony import */ var _HtmlOption__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(190);





const { map } = Array.prototype

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-select-element
 */
class HtmlSelect extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {{}} init
   */
  assign(init) {
    if(init.hasOwnProperty('multiple')) {
      this.multiple = init.multiple
      delete init.multiple
    }
    super.assign(init)
  }

  /**
   * @param {Option|HTMLOptionElement|OptGroup|HTMLOptGroupElement} element
   * @param {HtmlElem|HTMLElement|number} [before=null]
   */
  add(element, before = null) {
    this.node.add(element.node || element, before.node || before)
  }

  /**
   * @returns {boolean}
   */
  checkValidity() {
    return this.node.checkValidity()
  }

  /**
   * @param {number} index
   * @returns {HtmlOption|null}
   */
  item(index) {
    return _HtmlOption__WEBPACK_IMPORTED_MODULE_3__.HtmlOption.get(this.node.item(index))
  }

  /**
   * @param {string} name
   * @returns {HtmlOption|null}
   */
  namedItem(name) {
    return _HtmlOption__WEBPACK_IMPORTED_MODULE_3__.HtmlOption.get(this.node.namedItem(name))
  }

  /**
   * @param {number} [index]
   */
  remove(index) {
    this.node.remove(index)
  }

  /**
   * @returns {boolean}
   */
  reportValidity() {
    return this.node.reportValidity()
  }

  /**
   * @param {string} error
   */
  setCustomValidity(error) {
    this.node.setCustomValidity(error)
  }

  /**
   * @param {string} autocomplete
   */
  set autocomplete(autocomplete) {
    this.node.autocomplete = autocomplete
  }

  /**
   * @returns {string}
   */
  get autocomplete() {
    return this.node.autocomplete
  }

  /**
   * @param {boolean} autofocus
   */
  set autofocus(autofocus) {
    this.node.autofocus = autofocus
  }

  /**
   * @returns {boolean}
   */
  get autofocus() {
    return this.node.autofocus
  }

  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    this.node.disabled = disabled
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return this.node.disabled
  }

  /**
   * @returns {HtmlForm|null}
   */
  get form() {
    return _HtmlForm__WEBPACK_IMPORTED_MODULE_1__.HtmlForm.get(this.node.form)
  }

  /**
   * @param {boolean} multiple
   */
  set multiple(multiple) {
    this.node.multiple = multiple
  }

  /**
   * @returns {boolean}
   */
  get multiple() {
    return this.node.multiple
  }

  /**
   * @param {string} name
   */
  set name(name) {
    this.node.name = name
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.node.name
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.node.required = required
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.node.required
  }

  /**
   * @param {number} size
   */
  set size(size) {
    this.node.size = size
  }

  /**
   * @returns {number}
   */
  get size() {
    return this.node.size
  }

  /**
   * @returns {string}
   */
  get type() {
    return this.node.type
  }

  /**
   * @param {array.HtmlOption} options
   */
  set options(options) {
    this.children = options
  }

  /**
   * @returns {array.HtmlOption}
   */
  get options() {
    return map.call(this.node.options, option => {
      return _HtmlOption__WEBPACK_IMPORTED_MODULE_3__.HtmlOption.get(option)
    })
  }

  /**
   * @returns {number}
   */
  get length() {
    return this.node.length
  }

  /**
   * @returns {array.HtmlOption}
   */
  get selectedOptions() {
    return map.call(this.node.selectedOptions, option => {
      return _HtmlOption__WEBPACK_IMPORTED_MODULE_3__.HtmlOption.get(option)
    })
  }

  /**
   * @param {number} selectedIndex
   */
  set selectedIndex(selectedIndex) {
    this.node.selectedIndex = selectedIndex
  }

  /**
   * @returns {number}
   */
  get selectedIndex() {
    return this.node.selectedIndex
  }

  /**
   * @param {string} value
   */
  set value(value) {
    this.node.value = value
  }

  /**
   * @returns {string}
   */
  get value() {
    return this.node.value
  }

  /**
   * @returns {boolean}
   */
  get willValidate() {
    return this.node.willValidate
  }

  /**
   * @returns {ValidityState}
   */
  get validity() {
    return this.node.validity
  }

  /**
   * @returns {string}
   */
  get validationMessage() {
    return this.node.validationMessage
  }

  /**
   * @returns {array.HtmlLabel}
   */
  get labels() {
    return map.call(this.node.labels, node => _HtmlLabel__WEBPACK_IMPORTED_MODULE_2__.HtmlLabel.get(node))
  }
}


/***/ }),
/* 251 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSmall": () => (/* binding */ HtmlSmall)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-small-element
 */
class HtmlSmall extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 252 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSource": () => (/* binding */ HtmlSource)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-source-element
 */
class HtmlSource extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {string} src
   */
  set src(src) {
    this.node.src = src
  }

  /**
   * @returns {string}
   */
  get src() {
    return this.node.src
  }

  /**
   * @param {string} type
   */
  set type(type) {
    this.node.type = type
  }

  /**
   * @returns {string}
   */
  get type() {
    return this.node.type
  }

  /**
   * @param {string} srcset
   */
  set srcset(srcset) {
    this.node.srcset = srcset
  }

  /**
   * @returns {string}
   */
  get srcset() {
    return this.node.srcset
  }

  /**
   * @param {string} sizes
   */
  set sizes(sizes) {
    this.node.sizes = sizes
  }

  /**
   * @returns {string}
   */
  get sizes() {
    return this.node.sizes
  }

  /**
   * @param {string} media
   */
  set media(media) {
    this.node.media = media
  }

  /**
   * @returns {string}
   */
  get media() {
    return this.node.media
  }
}


/***/ }),
/* 253 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSpan": () => (/* binding */ HtmlSpan)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-span-element
 */
class HtmlSpan extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 254 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlStrong": () => (/* binding */ HtmlStrong)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-strong-element
 */
class HtmlStrong extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 255 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlStyle": () => (/* binding */ HtmlStyle)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-style-element
 */
class HtmlStyle extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {string} media
   */
  set media(media) {
    this.node.media = media
  }

  /**
   * @returns {string}
   */
  get media() {
    return this.node.media
  }

  /**
   * @param {string} nonce
   */
  set nonce(nonce) {
    this.node.nonce = nonce
  }

  /**
   * @returns {string}
   */
  get nonce() {
    return this.node.nonce
  }

  /**
   * @param {string} type
   */
  set type(type) {
    this.node.type = type
  }

  /**
   * @returns {string}
   */
  get type() {
    return this.node.type
  }
}


/***/ }),
/* 256 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSub": () => (/* binding */ HtmlSub)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-sub-element
 */
class HtmlSub extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 257 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSummary": () => (/* binding */ HtmlSummary)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-summary-element
 */
class HtmlSummary extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 258 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSup": () => (/* binding */ HtmlSup)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-sup-element
 */
class HtmlSup extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 259 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTBody": () => (/* binding */ HtmlTBody)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _HtmlTr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(260);



const { map } = Array.prototype

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-tbody-element
 */
class HtmlTBody extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {number} [index]
   * @returns {HtmlTr}
   */
  insertRow(index) {
    return _HtmlTr__WEBPACK_IMPORTED_MODULE_1__.HtmlTr.get(this.node.insertRow(index))
  }

  /**
   * @param {number} index
   */
  deleteRow(index) {
    this.node.deleteRow(index)
  }

  /**
   * @returns {HtmlTr[]}
   */
  get rows() {
    return map.call(this.node.rows, node => _HtmlTr__WEBPACK_IMPORTED_MODULE_1__.HtmlTr.get(node))
  }
}


/***/ }),
/* 260 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTr": () => (/* binding */ HtmlTr)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _HtmlTd__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(261);
/* harmony import */ var _HtmlTh__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(262);




const { map } = Array.prototype

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-tr-element
 */
class HtmlTr extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {number} [index]
   * @returns {HtmlTd}
   */
  insertCell(index) {
    return _HtmlTd__WEBPACK_IMPORTED_MODULE_1__.HtmlTd.get(this.node.insertCell(index))
  }

  /**
   * @param {number} index
   */
  deleteCell(index) {
    this.node.deleteCell(index)
  }

  /**
   * @returns {number}
   */
  get rowIndex() {
    return this.node.rowIndex
  }

  /**
   * @returns {number}
   */
  get sectionRowIndex() {
    return this.node.sectionRowIndex
  }

  /**
   * @returns {array.HtmlTd|array.HtmlTh}
   */
  get cells() {
    return map.call(this.node.cells, node => {
      return node.localName === 'th'?
        _HtmlTh__WEBPACK_IMPORTED_MODULE_2__.HtmlTh.get(node) :
        _HtmlTd__WEBPACK_IMPORTED_MODULE_1__.HtmlTd.get(node)
    })
  }
}


/***/ }),
/* 261 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTd": () => (/* binding */ HtmlTd)
/* harmony export */ });
/* harmony import */ var _HtmlTableCell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(214);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-td-element
 */
class HtmlTd extends _HtmlTableCell__WEBPACK_IMPORTED_MODULE_0__.HtmlTableCell
{
}


/***/ }),
/* 262 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTh": () => (/* binding */ HtmlTh)
/* harmony export */ });
/* harmony import */ var _HtmlTableCell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(214);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-th-element
 */
class HtmlTh extends _HtmlTableCell__WEBPACK_IMPORTED_MODULE_0__.HtmlTableCell
{
  /**
   * @param {string} scope
   */
  set scope(scope) {
    this.node.scope = scope
  }

  /**
   * @returns {string}
   */
  get scope() {
    return this.node.scope
  }

  /**
   * @param {string} abbr
   */
  set abbr(abbr) {
    this.node.abbr = abbr
  }

  /**
   * @returns {string}
   */
  get abbr() {
    return this.node.abbr
  }
}


/***/ }),
/* 263 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTFoot": () => (/* binding */ HtmlTFoot)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _HtmlTr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(260);



const { map } = Array.prototype

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-tfoot-element
 */
class HtmlTFoot extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {number} [index]
   * @returns {HtmlTr}
   */
  insertRow(index) {
    return _HtmlTr__WEBPACK_IMPORTED_MODULE_1__.HtmlTr.get(this.node.insertRow(index))
  }

  /**
   * @param {number} index
   */
  deleteRow(index) {
    this.node.deleteRow(index)
  }

  /**
   * @returns {HtmlTr[]}
   */
  get rows() {
    return map.call(this.node.rows, node => _HtmlTr__WEBPACK_IMPORTED_MODULE_1__.HtmlTr.get(node))
  }
}


/***/ }),
/* 264 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTHead": () => (/* binding */ HtmlTHead)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _HtmlTr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(260);



const { map } = Array.prototype

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-thead-element
 */
class HtmlTHead extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {number} [index]
   * @returns {HtmlTr}
   */
  insertRow(index) {
    return _HtmlTr__WEBPACK_IMPORTED_MODULE_1__.HtmlTr.get(this.node.insertRow(index))
  }

  /**
   * @param {number} index
   */
  deleteRow(index) {
    this.node.deleteRow(index)
  }

  /**
   * @returns {HtmlTr[]}
   */
  get rows() {
    return map.call(this.node.rows, node => _HtmlTr__WEBPACK_IMPORTED_MODULE_1__.HtmlTr.get(node))
  }
}


/***/ }),
/* 265 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTable": () => (/* binding */ HtmlTable)
/* harmony export */ });
/* harmony import */ var _HtmlCaption__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(183);
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var _HtmlTBody__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(259);
/* harmony import */ var _HtmlTFoot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(263);
/* harmony import */ var _HtmlTHead__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(264);
/* harmony import */ var _HtmlTr__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(260);







const { map } = Array.prototype

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-table-element
 */
class HtmlTable extends _HtmlElem__WEBPACK_IMPORTED_MODULE_1__.HtmlElem
{
  /**
   * @returns {HtmlCaption}
   */
  createCaption() {
    return _HtmlCaption__WEBPACK_IMPORTED_MODULE_0__.HtmlCaption.get(this.node.createCaption())
  }

  /**
   * Delete the table caption
   */
  deleteCaption() {
    this.node.deleteCaption()
  }

  /**
   * @returns {HtmlTHead}
   */
  createTHead() {
    return _HtmlTHead__WEBPACK_IMPORTED_MODULE_4__.HtmlTHead.get(this.node.createTHead())
  }

  /**
   * Delete the table caption
   */
  deleteTHead() {
    this.node.deleteTHead()
  }

  /**
   * @returns {HtmlTFoot}
   */
  createTFoot() {
    return _HtmlTFoot__WEBPACK_IMPORTED_MODULE_3__.HtmlTFoot.get(this.node.createTFoot())
  }

  /**
   * Delete the table caption
   */
  deleteTFoot() {
    this.node.deleteTFoot()
  }

  /**
   * @returns {HtmlTBody}
   */
  createTBody() {
    return _HtmlTBody__WEBPACK_IMPORTED_MODULE_2__.HtmlTBody.get(this.node.createTBody())
  }

  /**
   * @param {number} [index]
   * @returns {HtmlTr}
   */
  insertRow(index) {
    return _HtmlTr__WEBPACK_IMPORTED_MODULE_5__.HtmlTr.get(this.node.insertRow(index))
  }

  /**
   * @param {number} index
   */
  deleteRow(index) {
    this.node.deleteRow(index)
  }

  /**
   * @param {*} caption {Caption|HTMLTableCaptionElement}
   */
  set caption(caption) {
    this.node.caption = caption.node || caption
  }

  /**
   * @returns {HTMLTableCaptionElement}
   */
  get caption() {
    return this.node.caption
  }

  /**
   * @param {*} tHead {THead|HTMLTableSectionElement}
   */
  set tHead(tHead) {
    this.node.tHead = tHead.node || tHead
  }

  /**
   * @returns {HtmlTHead}
   */
  get tHead() {
    return _HtmlTHead__WEBPACK_IMPORTED_MODULE_4__.HtmlTHead.get(this.node.tHead)
  }

  /**
   * @param {*} tFoot {TFoot|HTMLTableSectionElement}
   */
  set tFoot(tFoot) {
    this.node.tFoot = tFoot.node || tFoot
  }

  /**
   * @returns {HtmlTFoot}
   */
  get tFoot() {
    return _HtmlTFoot__WEBPACK_IMPORTED_MODULE_3__.HtmlTFoot.get(this.node.tFoot)
  }

  /**
   * @returns {HtmlTBody[]}
   */
  get tBodies() {
    return map.call(this.node.tBodies, node => _HtmlTBody__WEBPACK_IMPORTED_MODULE_2__.HtmlTBody.get(node))
  }

  /**
   * @returns {HtmlTr[]}
   */
  get rows() {
    return map.call(this.node.rows, node => _HtmlTr__WEBPACK_IMPORTED_MODULE_5__.HtmlTr.get(node))
  }
}


/***/ }),
/* 266 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTemplate": () => (/* binding */ HtmlTemplate)
/* harmony export */ });
/* harmony import */ var _DomFragment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(39);
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);



/**
 * @see https://www.w3.org/TR/html/single-page.html#the-template-element
 */
class HtmlTemplate extends _HtmlElem__WEBPACK_IMPORTED_MODULE_1__.HtmlElem
{
  /**
   * @returns {DomFragment}
   */
  get content() {
    return _DomFragment__WEBPACK_IMPORTED_MODULE_0__.DomFragment.get(this.node.content)
  }
}


/***/ }),
/* 267 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTextArea": () => (/* binding */ HtmlTextArea)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);
/* harmony import */ var _HtmlLabel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(181);



const { map } = Array.prototype

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-textarea-element
 */
class HtmlTextArea extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @returns {boolean}
   */
  checkValidity() {
    return this.node.checkValidity()
  }

  /**
   * @returns {boolean}
   */
  reportValidity() {
    return this.node.reportValidity()
  }

  /**
   * Select the input
   */
  select() {
    this.node.select()
  }

  /**
   * @param {string} error
   */
  setCustomValidity(error) {
    this.node.setCustomValidity(error)
  }

  /**
   * @param {*} args
   */
  setRangeText(...args) {
    this.node.setRangeText(...args)
  }

  /**
   * @param {*} args
   */
  setSelectionRange(...args) {
    this.node.setSelectionRange(...args)
  }

  /**
   * @param {string} autocomplete
   */
  set autocomplete(autocomplete) {
    this.node.autocomplete = autocomplete
  }

  /**
   * @returns {string}
   */
  get autocomplete() {
    return this.node.autocomplete
  }

  /**
   * @param {boolean} autofocus
   */
  set autofocus(autofocus) {
    this.node.autofocus = autofocus
  }

  /**
   * @returns {boolean}
   */
  get autofocus() {
    return this.node.autofocus
  }

  /**
   * @param {number} cols
   */
  set cols(cols) {
    this.node.cols = cols
  }

  /**
   * @returns {number}
   */
  get cols() {
    return this.node.cols
  }

  /**
   * @param {string} dirName
   */
  set dirName(dirName) {
    this.node.dirName = dirName
  }

  /**
   * @returns {string}
   */
  get dirName() {
    return this.node.dirName
  }

  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    this.node.disabled = disabled
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return this.node.disabled
  }

  /**
   * @returns {*}
   */
  get form() {
    return this.node.form
  }

  /**
   * @param {string} inputMode
   */
  set inputMode(inputMode) {
    this.node.inputMode = inputMode
  }

  /**
   * @returns {string}
   */
  get inputMode() {
    return this.node.inputMode
  }

  /**
   * @param {number} maxLength
   */
  set maxLength(maxLength) {
    this.node.maxLength = maxLength
  }

  /**
   * @returns {number}
   */
  get maxLength() {
    return this.node.maxLength
  }

  /**
   * @param {number} minLength
   */
  set minLength(minLength) {
    this.node.minLength = minLength
  }

  /**
   * @returns {number}
   */
  get minLength() {
    return this.node.minLength
  }

  /**
   * @param {string} name
   */
  set name(name) {
    this.node.name = name
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.node.name
  }

  /**
   * @param {string} placeholder
   */
  set placeholder(placeholder) {
    this.node.placeholder = placeholder
  }

  /**
   * @returns {string}
   */
  get placeholder() {
    return this.node.placeholder
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.node.readOnly = readOnly
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.node.readOnly
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.node.required = required
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.node.required
  }

  /**
   * @param {number} rows
   */
  set rows(rows) {
    this.node.rows = rows
  }

  /**
   * @returns {number}
   */
  get rows() {
    return this.node.rows
  }

  /**
   * @param {string} wrap
   */
  set wrap(wrap) {
    this.node.wrap = wrap
  }

  /**
   * @returns {string}
   */
  get wrap() {
    return this.node.wrap
  }

  /**
   * @param {string} step
   */
  set step(step) {
    this.node.step = step
  }

  /**
   * @returns {string}
   */
  get step() {
    return this.node.step
  }

  /**
   * @returns {string}
   */
  get type() {
    return this.node.type
  }

  /**
   * @param {string} defaultValue
   */
  set defaultValue(defaultValue) {
    this.node.defaultValue = defaultValue
  }

  /**
   * @returns {string}
   */
  get defaultValue() {
    return this.node.defaultValue
  }

  /**
   * @param {string} value
   */
  set value(value) {
    this.node.value = value
  }

  /**
   * @returns {string}
   */
  get value() {
    return this.node.value
  }

  /**
   * @returns {number}
   */
  get textLength() {
    return this.node.textLength
  }

  /**
   * @returns {boolean}
   */
  get willValidate() {
    return this.node.willValidate
  }

  /**
   * @returns {*}
   */
  get validity() {
    return this.node.validity
  }

  /**
   * @returns {string}
   */
  get validationMessage() {
    return this.node.validationMessage
  }

  /**
   * @returns {HtmlLabel[]}
   */
  get labels() {
    return map.call(this.node.labels, node => _HtmlLabel__WEBPACK_IMPORTED_MODULE_1__.HtmlLabel.get(node))
  }

  /**
   * @param {number} selectionStart
   */
  set selectionStart(selectionStart) {
    this.node.selectionStart = selectionStart
  }

  /**
   * @returns {number}
   */
  get selectionStart() {
    return this.node.selectionStart
  }

  /**
   * @param {number} selectionEnd
   */
  set selectionEnd(selectionEnd) {
    this.node.selectionEnd = selectionEnd
  }

  /**
   * @returns {number}
   */
  get selectionEnd() {
    return this.node.selectionEnd
  }

  /**
   * @param {string} selectionDirection
   */
  set selectionDirection(selectionDirection) {
    this.node.selectionDirection = selectionDirection
  }

  /**
   * @returns {string}
   */
  get selectionDirection() {
    return this.node.selectionDirection
  }
}


/***/ }),
/* 268 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTime": () => (/* binding */ HtmlTime)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-time-element
 */
class HtmlTime extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {string} dateTime
   */
  set dateTime(dateTime) {
    this.node.dateTime = dateTime
  }

  /**
   * @returns {string}
   */
  get dateTime() {
    return this.node.dateTime
  }
}


/***/ }),
/* 269 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTitle": () => (/* binding */ HtmlTitle)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-title-element
 */
class HtmlTitle extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {string} text
   */
  set text(text) {
    this.node.text = text
  }

  /**
   * @returns {string}
   */
  get text() {
    return this.node.text
  }
}


/***/ }),
/* 270 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTrack": () => (/* binding */ HtmlTrack)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-track-element
 */
class HtmlTrack extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
  /**
   * @param {string} kind
   */
  set kind(kind) {
    this.node.kind = kind
  }

  /**
   * @returns {string}
   */
  get kind() {
    return this.node.kind
  }

  /**
   * @param {string} src
   */
  set src(src) {
    this.node.src = src
  }

  /**
   * @returns {string}
   */
  get src() {
    return this.node.src
  }

  /**
   * @param {string} srclang
   */
  set srclang(srclang) {
    this.node.srclang = srclang
  }

  /**
   * @returns {string}
   */
  get srclang() {
    return this.node.srclang
  }

  /**
   * @param {string} label
   */
  set label(label) {
    this.node.label = label
  }

  /**
   * @returns {string}
   */
  get label() {
    return this.node.label
  }

  /**
   * @param {boolean} value
   */
  set default(value) {
    this.node.default = value
  }

  /**
   * @returns {boolean}
   */
  get default() {
    return this.node.default
  }

  /**
   * @returns {number}
   */
  get readyState() {
    return this.node.readyState
  }

  /**
   * @returns {TextTrack}
   */
  get track() {
    return this.node.track
  }
}


/***/ }),
/* 271 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlU": () => (/* binding */ HtmlU)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-u-element
 */
class HtmlU extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 272 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlUl": () => (/* binding */ HtmlUl)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-ul-element
 */
class HtmlUl extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 273 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlVar": () => (/* binding */ HtmlVar)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-var-element
 */
class HtmlVar extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 274 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlVideo": () => (/* binding */ HtmlVideo)
/* harmony export */ });
/* harmony import */ var _HtmlMedia__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(172);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-video-element
 */
class HtmlVideo extends _HtmlMedia__WEBPACK_IMPORTED_MODULE_0__.HtmlMedia
{
  /**
   * @param {number} width
   */
  set width(width) {
    this.node.width = width
  }

  /**
   * @returns {number}
   */
  get width() {
    return this.node.width
  }

  /**
   * @param {number} height
   */
  set height(height) {
    this.node.height = height
  }

  /**
   * @returns {number}
   */
  get height() {
    return this.node.height
  }

  /**
   * @returns {number}
   */
  get videoWidth() {
    return this.node.videoWidth
  }

  /**
   * @returns {number}
   */
  get videoHeight() {
    return this.node.videoHeight
  }

  /**
   * @param {string} poster
   */
  set poster(poster) {
    this.node.poster = poster
  }

  /**
   * @returns {string}
   */
  get poster() {
    return this.node.poster
  }
}


/***/ }),
/* 275 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlWbr": () => (/* binding */ HtmlWbr)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-wbr-element
 */
class HtmlWbr extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 276 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Win": () => (/* binding */ Win)
/* harmony export */ });
/* harmony import */ var window__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var window__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(window__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _DomTarget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _DomDoc__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5);




const JSON_MIME_TYPE = 'application/json'

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-window-object
 */
class Win extends _DomTarget__WEBPACK_IMPORTED_MODULE_1__.DomTarget
{
  /**
   * @param {{}} init
   * @param {Window} [init.node]
   */
  create(init) {
    if(!init.node) {
      init.node = (window__WEBPACK_IMPORTED_MODULE_0___default())
    }
    super.create(init)
  }

  /**
   * @param {boolean} [keepDom=false]
   */
  destroy(keepDom = false) {
    this.doc.destroy(keepDom)
    super.destroy()
  }

  /**
   * @returns {DomDoc}
   */
  get doc() {
    return this.constructor.DomDoc.get(this.node.document)
  }

  /**
   * @param {string} url
   * @param {RequestInit} init
   * @returns {Promise<any>}
   */
  static async fetchJson(url, init) {
    const res = await window__WEBPACK_IMPORTED_MODULE_0___default().fetch(url, init)
    if(!res.ok) {
      throw Error(res.statusText)
    }
    return res.json()
  }

  /**
   * @param {string} url
   * @returns {Promise<any>}
   */
  static async getJson(url) {
    return this.fetchJson(url, {
      headers : { 'Accept' : JSON_MIME_TYPE }
    })
  }

  /**
   * @param {string} url
   * @param {any} data
   * @returns {Promise<any>}
   */
  static async postJson(url, data) {
    const init = {
      method : 'POST',
      headers : {
        'Accept' : JSON_MIME_TYPE,
        'Content-Type' : JSON_MIME_TYPE
      }
    }
    if(typeof data !== 'undefined') {
      init.body = JSON.stringify(data)
    }
    return this.fetchJson(url, init)
  }
}

Win.prototype.fetchJson = Win.fetchJson
Win.prototype.getJson = Win.getJson
Win.prototype.postJson = Win.postJson

_DomTarget__WEBPACK_IMPORTED_MODULE_1__.DomTarget.Win = Win


/***/ }),
/* 277 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PendingChild": () => (/* binding */ PendingChild)
/* harmony export */ });
/* harmony import */ var _HtmlDiv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(197);


class PendingChild extends _HtmlDiv__WEBPACK_IMPORTED_MODULE_0__.HtmlDiv
{
  /**
   * @param {{}} init
   * @param {Promise} [init.promise]
   * @returns {string}
   */
  init(init) {
    super.init(init)
    this.promise = init.promise || Promise.resolve()
    this.error = null
    if(init.promise) {
      this.classList.add('pending')
      init.promise
      .then(res => this.onResolve(res))
      .catch(err => this.onReject(err))
    }
  }

  /**
   * @param {*} res
   */
  onResolve(res) {
    if(!this.node) {
      return
    }
    this.classList.remove('pending')
    this.emit('load')
    this.replaceWith(res)
    this.destroy()
  }

  /**
   * @param {Error|string|*} err
   */
  onReject(err) {
    console.error(this.error = typeof err === 'string'? Error(err) : err)
    if(!this.node) {
      return
    }
    this.classList.replace('pending', 'error')
    this.emit('error')
    this.children = err
  }

  /**
   * @param {boolean} [keepNode = false]
   */
  destroy(keepNode = false) {
    this.onResolve = this.onReject = () => {}
    super.destroy(keepNode)
  }
}


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Assembler": () => (/* reexport safe */ _Assembler__WEBPACK_IMPORTED_MODULE_0__.Assembler),
/* harmony export */   "AttrType": () => (/* reexport safe */ _dommodule__WEBPACK_IMPORTED_MODULE_1__.AttrType),
/* harmony export */   "DomDoc": () => (/* reexport safe */ _dommodule__WEBPACK_IMPORTED_MODULE_1__.DomDoc),
/* harmony export */   "DomElem": () => (/* reexport safe */ _dommodule__WEBPACK_IMPORTED_MODULE_1__.DomElem),
/* harmony export */   "DomFragment": () => (/* reexport safe */ _dommodule__WEBPACK_IMPORTED_MODULE_1__.DomFragment),
/* harmony export */   "DomNode": () => (/* reexport safe */ _dommodule__WEBPACK_IMPORTED_MODULE_1__.DomNode),
/* harmony export */   "DomTarget": () => (/* reexport safe */ _dommodule__WEBPACK_IMPORTED_MODULE_1__.DomTarget),
/* harmony export */   "AriaActiveDescendant": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaActiveDescendant),
/* harmony export */   "AriaAtomic": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaAtomic),
/* harmony export */   "AriaAutoComplete": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaAutoComplete),
/* harmony export */   "AriaBusy": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaBusy),
/* harmony export */   "AriaChecked": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaChecked),
/* harmony export */   "AriaColCount": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaColCount),
/* harmony export */   "AriaColIndex": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaColIndex),
/* harmony export */   "AriaColSpan": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaColSpan),
/* harmony export */   "AriaControls": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaControls),
/* harmony export */   "AriaCurrent": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaCurrent),
/* harmony export */   "AriaDescribedBy": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaDescribedBy),
/* harmony export */   "AriaDetails": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaDetails),
/* harmony export */   "AriaDisabled": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaDisabled),
/* harmony export */   "AriaDropEffect": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaDropEffect),
/* harmony export */   "AriaErrorMessage": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaErrorMessage),
/* harmony export */   "AriaExpanded": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaExpanded),
/* harmony export */   "AriaFlowTo": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaFlowTo),
/* harmony export */   "AriaGrabbed": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaGrabbed),
/* harmony export */   "AriaHasPopup": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaHasPopup),
/* harmony export */   "AriaHidden": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaHidden),
/* harmony export */   "AriaInvalid": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaInvalid),
/* harmony export */   "AriaKeyShortcuts": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaKeyShortcuts),
/* harmony export */   "AriaLabel": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaLabel),
/* harmony export */   "AriaLabelledBy": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaLabelledBy),
/* harmony export */   "AriaLevel": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaLevel),
/* harmony export */   "AriaLive": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaLive),
/* harmony export */   "AriaModal": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaModal),
/* harmony export */   "AriaMultiLine": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaMultiLine),
/* harmony export */   "AriaMultiSelectable": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaMultiSelectable),
/* harmony export */   "AriaOrientation": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaOrientation),
/* harmony export */   "AriaOwns": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaOwns),
/* harmony export */   "AriaPlaceholder": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaPlaceholder),
/* harmony export */   "AriaPosInSet": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaPosInSet),
/* harmony export */   "AriaPressed": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaPressed),
/* harmony export */   "AriaReadOnly": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaReadOnly),
/* harmony export */   "AriaRelevant": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaRelevant),
/* harmony export */   "AriaRequired": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaRequired),
/* harmony export */   "AriaRoleDescription": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaRoleDescription),
/* harmony export */   "AriaRowCount": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaRowCount),
/* harmony export */   "AriaRowIndex": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaRowIndex),
/* harmony export */   "AriaRowSpan": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaRowSpan),
/* harmony export */   "AriaSelected": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaSelected),
/* harmony export */   "AriaSetSize": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaSetSize),
/* harmony export */   "AriaSort": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaSort),
/* harmony export */   "AriaType": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaType),
/* harmony export */   "AriaTypeApplicable": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaTypeApplicable),
/* harmony export */   "AriaTypeBoolean": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaTypeBoolean),
/* harmony export */   "AriaTypeIdRef": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaTypeIdRef),
/* harmony export */   "AriaTypeIdRefList": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaTypeIdRefList),
/* harmony export */   "AriaTypeInteger": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaTypeInteger),
/* harmony export */   "AriaTypeNumber": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaTypeNumber),
/* harmony export */   "AriaTypeString": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaTypeString),
/* harmony export */   "AriaTypeToken": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaTypeToken),
/* harmony export */   "AriaTypeTokenList": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaTypeTokenList),
/* harmony export */   "AriaTypeTristate": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaTypeTristate),
/* harmony export */   "AriaValueMax": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaValueMax),
/* harmony export */   "AriaValueMin": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaValueMin),
/* harmony export */   "AriaValueNow": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaValueNow),
/* harmony export */   "AriaValueText": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AriaValueText),
/* harmony export */   "Role": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Role),
/* harmony export */   "RoleAlert": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleAlert),
/* harmony export */   "RoleAlertDialog": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleAlertDialog),
/* harmony export */   "RoleApplication": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleApplication),
/* harmony export */   "RoleArticle": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleArticle),
/* harmony export */   "RoleBanner": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleBanner),
/* harmony export */   "RoleBlockQuote": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleBlockQuote),
/* harmony export */   "RoleButton": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleButton),
/* harmony export */   "RoleCaption": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleCaption),
/* harmony export */   "RoleCell": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleCell),
/* harmony export */   "RoleCheckBox": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleCheckBox),
/* harmony export */   "RoleColumnHeader": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleColumnHeader),
/* harmony export */   "RoleComboBox": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleComboBox),
/* harmony export */   "RoleCommand": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleCommand),
/* harmony export */   "RoleComplementary": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleComplementary),
/* harmony export */   "RoleComposite": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleComposite),
/* harmony export */   "RoleContentInfo": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleContentInfo),
/* harmony export */   "RoleDefinition": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleDefinition),
/* harmony export */   "RoleDialog": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleDialog),
/* harmony export */   "RoleDirectory": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleDirectory),
/* harmony export */   "RoleDocument": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleDocument),
/* harmony export */   "RoleFeed": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleFeed),
/* harmony export */   "RoleFigure": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleFigure),
/* harmony export */   "RoleForm": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleForm),
/* harmony export */   "RoleGrid": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleGrid),
/* harmony export */   "RoleGridCell": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleGridCell),
/* harmony export */   "RoleGroup": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleGroup),
/* harmony export */   "RoleHeading": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleHeading),
/* harmony export */   "RoleImg": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleImg),
/* harmony export */   "RoleInput": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleInput),
/* harmony export */   "RoleLandmark": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleLandmark),
/* harmony export */   "RoleLink": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleLink),
/* harmony export */   "RoleList": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleList),
/* harmony export */   "RoleListBox": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleListBox),
/* harmony export */   "RoleListItem": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleListItem),
/* harmony export */   "RoleLog": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleLog),
/* harmony export */   "RoleMain": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleMain),
/* harmony export */   "RoleMarquee": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleMarquee),
/* harmony export */   "RoleMath": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleMath),
/* harmony export */   "RoleMenu": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleMenu),
/* harmony export */   "RoleMenuBar": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleMenuBar),
/* harmony export */   "RoleMenuItem": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleMenuItem),
/* harmony export */   "RoleMenuItemCheckBox": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleMenuItemCheckBox),
/* harmony export */   "RoleMenuItemRadio": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleMenuItemRadio),
/* harmony export */   "RoleNavigation": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleNavigation),
/* harmony export */   "RoleNone": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleNone),
/* harmony export */   "RoleNote": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleNote),
/* harmony export */   "RoleOption": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleOption),
/* harmony export */   "RoleParagraph": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleParagraph),
/* harmony export */   "RolePresentation": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RolePresentation),
/* harmony export */   "RoleProgressBar": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleProgressBar),
/* harmony export */   "RoleRadio": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleRadio),
/* harmony export */   "RoleRadioGroup": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleRadioGroup),
/* harmony export */   "RoleRange": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleRange),
/* harmony export */   "RoleRegion": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleRegion),
/* harmony export */   "RoleRoleType": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleRoleType),
/* harmony export */   "RoleRow": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleRow),
/* harmony export */   "RoleRowGroup": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleRowGroup),
/* harmony export */   "RoleRowHeader": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleRowHeader),
/* harmony export */   "RoleScrollBar": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleScrollBar),
/* harmony export */   "RoleSearch": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleSearch),
/* harmony export */   "RoleSearchBox": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleSearchBox),
/* harmony export */   "RoleSection": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleSection),
/* harmony export */   "RoleSectionHead": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleSectionHead),
/* harmony export */   "RoleSelect": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleSelect),
/* harmony export */   "RoleSeparator": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleSeparator),
/* harmony export */   "RoleSlider": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleSlider),
/* harmony export */   "RoleSpinButton": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleSpinButton),
/* harmony export */   "RoleStatus": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleStatus),
/* harmony export */   "RoleStructure": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleStructure),
/* harmony export */   "RoleSwitch": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleSwitch),
/* harmony export */   "RoleTab": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleTab),
/* harmony export */   "RoleTabList": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleTabList),
/* harmony export */   "RoleTabPanel": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleTabPanel),
/* harmony export */   "RoleTable": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleTable),
/* harmony export */   "RoleTerm": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleTerm),
/* harmony export */   "RoleTextBox": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleTextBox),
/* harmony export */   "RoleTimer": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleTimer),
/* harmony export */   "RoleToolBar": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleToolBar),
/* harmony export */   "RoleToolTip": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleToolTip),
/* harmony export */   "RoleTree": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleTree),
/* harmony export */   "RoleTreeGrid": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleTreeGrid),
/* harmony export */   "RoleTreeItem": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleTreeItem),
/* harmony export */   "RoleWidget": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleWidget),
/* harmony export */   "RoleWindow": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleWindow),
/* harmony export */   "HtmlA": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlA),
/* harmony export */   "HtmlAbbr": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlAbbr),
/* harmony export */   "HtmlAddress": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlAddress),
/* harmony export */   "HtmlArea": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlArea),
/* harmony export */   "HtmlArticle": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlArticle),
/* harmony export */   "HtmlAside": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlAside),
/* harmony export */   "HtmlAudio": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlAudio),
/* harmony export */   "HtmlB": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlB),
/* harmony export */   "HtmlBase": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlBase),
/* harmony export */   "HtmlBdi": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlBdi),
/* harmony export */   "HtmlBdo": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlBdo),
/* harmony export */   "HtmlBlockQuote": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlBlockQuote),
/* harmony export */   "HtmlBody": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlBody),
/* harmony export */   "HtmlBr": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlBr),
/* harmony export */   "HtmlButton": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlButton),
/* harmony export */   "HtmlCanvas": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlCanvas),
/* harmony export */   "HtmlCaption": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlCaption),
/* harmony export */   "HtmlCite": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlCite),
/* harmony export */   "HtmlCode": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlCode),
/* harmony export */   "HtmlCol": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlCol),
/* harmony export */   "HtmlColGroup": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlColGroup),
/* harmony export */   "HtmlData": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlData),
/* harmony export */   "HtmlDataList": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlDataList),
/* harmony export */   "HtmlDd": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlDd),
/* harmony export */   "HtmlDel": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlDel),
/* harmony export */   "HtmlDetails": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlDetails),
/* harmony export */   "HtmlDfn": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlDfn),
/* harmony export */   "HtmlDialog": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlDialog),
/* harmony export */   "HtmlDiv": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlDiv),
/* harmony export */   "HtmlDl": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlDl),
/* harmony export */   "HtmlDt": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlDt),
/* harmony export */   "HtmlElem": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlElem),
/* harmony export */   "HtmlEm": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlEm),
/* harmony export */   "HtmlEmbed": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlEmbed),
/* harmony export */   "HtmlFieldSet": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlFieldSet),
/* harmony export */   "HtmlFigCaption": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlFigCaption),
/* harmony export */   "HtmlFigure": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlFigure),
/* harmony export */   "HtmlFooter": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlFooter),
/* harmony export */   "HtmlForm": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlForm),
/* harmony export */   "HtmlH1": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlH1),
/* harmony export */   "HtmlH2": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlH2),
/* harmony export */   "HtmlH3": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlH3),
/* harmony export */   "HtmlH4": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlH4),
/* harmony export */   "HtmlH5": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlH5),
/* harmony export */   "HtmlH6": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlH6),
/* harmony export */   "HtmlHGroup": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlHGroup),
/* harmony export */   "HtmlHead": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlHead),
/* harmony export */   "HtmlHeader": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlHeader),
/* harmony export */   "HtmlHr": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlHr),
/* harmony export */   "HtmlHtml": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlHtml),
/* harmony export */   "HtmlHyperlink": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlHyperlink),
/* harmony export */   "HtmlI": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlI),
/* harmony export */   "HtmlIFrame": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlIFrame),
/* harmony export */   "HtmlImg": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlImg),
/* harmony export */   "HtmlInput": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlInput),
/* harmony export */   "HtmlIns": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlIns),
/* harmony export */   "HtmlKbd": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlKbd),
/* harmony export */   "HtmlLabel": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlLabel),
/* harmony export */   "HtmlLegend": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlLegend),
/* harmony export */   "HtmlLi": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlLi),
/* harmony export */   "HtmlLink": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlLink),
/* harmony export */   "HtmlMain": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlMain),
/* harmony export */   "HtmlMap": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlMap),
/* harmony export */   "HtmlMark": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlMark),
/* harmony export */   "HtmlMedia": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlMedia),
/* harmony export */   "HtmlMenu": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlMenu),
/* harmony export */   "HtmlMeta": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlMeta),
/* harmony export */   "HtmlMeter": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlMeter),
/* harmony export */   "HtmlMod": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlMod),
/* harmony export */   "HtmlNav": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlNav),
/* harmony export */   "HtmlNoScript": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlNoScript),
/* harmony export */   "HtmlObject": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlObject),
/* harmony export */   "HtmlOl": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlOl),
/* harmony export */   "HtmlOptGroup": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlOptGroup),
/* harmony export */   "HtmlOption": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlOption),
/* harmony export */   "HtmlOutput": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlOutput),
/* harmony export */   "HtmlP": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlP),
/* harmony export */   "HtmlParam": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlParam),
/* harmony export */   "HtmlPicture": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlPicture),
/* harmony export */   "HtmlPre": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlPre),
/* harmony export */   "HtmlProgress": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlProgress),
/* harmony export */   "HtmlQ": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlQ),
/* harmony export */   "HtmlRp": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlRp),
/* harmony export */   "HtmlRt": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlRt),
/* harmony export */   "HtmlRuby": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlRuby),
/* harmony export */   "HtmlS": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlS),
/* harmony export */   "HtmlSamp": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlSamp),
/* harmony export */   "HtmlScript": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlScript),
/* harmony export */   "HtmlSection": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlSection),
/* harmony export */   "HtmlSelect": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlSelect),
/* harmony export */   "HtmlSmall": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlSmall),
/* harmony export */   "HtmlSource": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlSource),
/* harmony export */   "HtmlSpan": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlSpan),
/* harmony export */   "HtmlStrong": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlStrong),
/* harmony export */   "HtmlStyle": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlStyle),
/* harmony export */   "HtmlSub": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlSub),
/* harmony export */   "HtmlSummary": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlSummary),
/* harmony export */   "HtmlSup": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlSup),
/* harmony export */   "HtmlTBody": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlTBody),
/* harmony export */   "HtmlTFoot": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlTFoot),
/* harmony export */   "HtmlTHead": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlTHead),
/* harmony export */   "HtmlTable": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlTable),
/* harmony export */   "HtmlTableCell": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlTableCell),
/* harmony export */   "HtmlTd": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlTd),
/* harmony export */   "HtmlTemplate": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlTemplate),
/* harmony export */   "HtmlTextArea": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlTextArea),
/* harmony export */   "HtmlTh": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlTh),
/* harmony export */   "HtmlTime": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlTime),
/* harmony export */   "HtmlTitle": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlTitle),
/* harmony export */   "HtmlTr": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlTr),
/* harmony export */   "HtmlTrack": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlTrack),
/* harmony export */   "HtmlU": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlU),
/* harmony export */   "HtmlUl": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlUl),
/* harmony export */   "HtmlVar": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlVar),
/* harmony export */   "HtmlVideo": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlVideo),
/* harmony export */   "HtmlWbr": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.HtmlWbr),
/* harmony export */   "Win": () => (/* reexport safe */ _htmlmodule__WEBPACK_IMPORTED_MODULE_3__.Win),
/* harmony export */   "PendingChild": () => (/* reexport safe */ _PendingChild__WEBPACK_IMPORTED_MODULE_4__.PendingChild)
/* harmony export */ });
/* harmony import */ var _Assembler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _dommodule__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _ariamodule__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(40);
/* harmony import */ var _htmlmodule__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(163);
/* harmony import */ var _PendingChild__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(277);






})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});