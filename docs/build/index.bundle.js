/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ (function() {

(function (global, factory) {
   true ? factory() :
  0;
}(this, (function () { 'use strict';

  /**
   * Applies the :focus-visible polyfill at the given scope.
   * A scope in this case is either the top-level Document or a Shadow Root.
   *
   * @param {(Document|ShadowRoot)} scope
   * @see https://github.com/WICG/focus-visible
   */
  function applyFocusVisiblePolyfill(scope) {
    var hadKeyboardEvent = true;
    var hadFocusVisibleRecently = false;
    var hadFocusVisibleRecentlyTimeout = null;

    var inputTypesAllowlist = {
      text: true,
      search: true,
      url: true,
      tel: true,
      email: true,
      password: true,
      number: true,
      date: true,
      month: true,
      week: true,
      time: true,
      datetime: true,
      'datetime-local': true
    };

    /**
     * Helper function for legacy browsers and iframes which sometimes focus
     * elements like document, body, and non-interactive SVG.
     * @param {Element} el
     */
    function isValidFocusTarget(el) {
      if (
        el &&
        el !== document &&
        el.nodeName !== 'HTML' &&
        el.nodeName !== 'BODY' &&
        'classList' in el &&
        'contains' in el.classList
      ) {
        return true;
      }
      return false;
    }

    /**
     * Computes whether the given element should automatically trigger the
     * `focus-visible` class being added, i.e. whether it should always match
     * `:focus-visible` when focused.
     * @param {Element} el
     * @return {boolean}
     */
    function focusTriggersKeyboardModality(el) {
      var type = el.type;
      var tagName = el.tagName;

      if (tagName === 'INPUT' && inputTypesAllowlist[type] && !el.readOnly) {
        return true;
      }

      if (tagName === 'TEXTAREA' && !el.readOnly) {
        return true;
      }

      if (el.isContentEditable) {
        return true;
      }

      return false;
    }

    /**
     * Add the `focus-visible` class to the given element if it was not added by
     * the author.
     * @param {Element} el
     */
    function addFocusVisibleClass(el) {
      if (el.classList.contains('focus-visible')) {
        return;
      }
      el.classList.add('focus-visible');
      el.setAttribute('data-focus-visible-added', '');
    }

    /**
     * Remove the `focus-visible` class from the given element if it was not
     * originally added by the author.
     * @param {Element} el
     */
    function removeFocusVisibleClass(el) {
      if (!el.hasAttribute('data-focus-visible-added')) {
        return;
      }
      el.classList.remove('focus-visible');
      el.removeAttribute('data-focus-visible-added');
    }

    /**
     * If the most recent user interaction was via the keyboard;
     * and the key press did not include a meta, alt/option, or control key;
     * then the modality is keyboard. Otherwise, the modality is not keyboard.
     * Apply `focus-visible` to any current active element and keep track
     * of our keyboard modality state with `hadKeyboardEvent`.
     * @param {KeyboardEvent} e
     */
    function onKeyDown(e) {
      if (e.metaKey || e.altKey || e.ctrlKey) {
        return;
      }

      if (isValidFocusTarget(scope.activeElement)) {
        addFocusVisibleClass(scope.activeElement);
      }

      hadKeyboardEvent = true;
    }

    /**
     * If at any point a user clicks with a pointing device, ensure that we change
     * the modality away from keyboard.
     * This avoids the situation where a user presses a key on an already focused
     * element, and then clicks on a different element, focusing it with a
     * pointing device, while we still think we're in keyboard modality.
     * @param {Event} e
     */
    function onPointerDown(e) {
      hadKeyboardEvent = false;
    }

    /**
     * On `focus`, add the `focus-visible` class to the target if:
     * - the target received focus as a result of keyboard navigation, or
     * - the event target is an element that will likely require interaction
     *   via the keyboard (e.g. a text box)
     * @param {Event} e
     */
    function onFocus(e) {
      // Prevent IE from focusing the document or HTML element.
      if (!isValidFocusTarget(e.target)) {
        return;
      }

      if (hadKeyboardEvent || focusTriggersKeyboardModality(e.target)) {
        addFocusVisibleClass(e.target);
      }
    }

    /**
     * On `blur`, remove the `focus-visible` class from the target.
     * @param {Event} e
     */
    function onBlur(e) {
      if (!isValidFocusTarget(e.target)) {
        return;
      }

      if (
        e.target.classList.contains('focus-visible') ||
        e.target.hasAttribute('data-focus-visible-added')
      ) {
        // To detect a tab/window switch, we look for a blur event followed
        // rapidly by a visibility change.
        // If we don't see a visibility change within 100ms, it's probably a
        // regular focus change.
        hadFocusVisibleRecently = true;
        window.clearTimeout(hadFocusVisibleRecentlyTimeout);
        hadFocusVisibleRecentlyTimeout = window.setTimeout(function() {
          hadFocusVisibleRecently = false;
        }, 100);
        removeFocusVisibleClass(e.target);
      }
    }

    /**
     * If the user changes tabs, keep track of whether or not the previously
     * focused element had .focus-visible.
     * @param {Event} e
     */
    function onVisibilityChange(e) {
      if (document.visibilityState === 'hidden') {
        // If the tab becomes active again, the browser will handle calling focus
        // on the element (Safari actually calls it twice).
        // If this tab change caused a blur on an element with focus-visible,
        // re-apply the class when the user switches back to the tab.
        if (hadFocusVisibleRecently) {
          hadKeyboardEvent = true;
        }
        addInitialPointerMoveListeners();
      }
    }

    /**
     * Add a group of listeners to detect usage of any pointing devices.
     * These listeners will be added when the polyfill first loads, and anytime
     * the window is blurred, so that they are active when the window regains
     * focus.
     */
    function addInitialPointerMoveListeners() {
      document.addEventListener('mousemove', onInitialPointerMove);
      document.addEventListener('mousedown', onInitialPointerMove);
      document.addEventListener('mouseup', onInitialPointerMove);
      document.addEventListener('pointermove', onInitialPointerMove);
      document.addEventListener('pointerdown', onInitialPointerMove);
      document.addEventListener('pointerup', onInitialPointerMove);
      document.addEventListener('touchmove', onInitialPointerMove);
      document.addEventListener('touchstart', onInitialPointerMove);
      document.addEventListener('touchend', onInitialPointerMove);
    }

    function removeInitialPointerMoveListeners() {
      document.removeEventListener('mousemove', onInitialPointerMove);
      document.removeEventListener('mousedown', onInitialPointerMove);
      document.removeEventListener('mouseup', onInitialPointerMove);
      document.removeEventListener('pointermove', onInitialPointerMove);
      document.removeEventListener('pointerdown', onInitialPointerMove);
      document.removeEventListener('pointerup', onInitialPointerMove);
      document.removeEventListener('touchmove', onInitialPointerMove);
      document.removeEventListener('touchstart', onInitialPointerMove);
      document.removeEventListener('touchend', onInitialPointerMove);
    }

    /**
     * When the polfyill first loads, assume the user is in keyboard modality.
     * If any event is received from a pointing device (e.g. mouse, pointer,
     * touch), turn off keyboard modality.
     * This accounts for situations where focus enters the page from the URL bar.
     * @param {Event} e
     */
    function onInitialPointerMove(e) {
      // Work around a Safari quirk that fires a mousemove on <html> whenever the
      // window blurs, even if you're tabbing out of the page. ¯\_(ツ)_/¯
      if (e.target.nodeName && e.target.nodeName.toLowerCase() === 'html') {
        return;
      }

      hadKeyboardEvent = false;
      removeInitialPointerMoveListeners();
    }

    // For some kinds of state, we are interested in changes at the global scope
    // only. For example, global pointer input, global key presses and global
    // visibility change should affect the state at every scope:
    document.addEventListener('keydown', onKeyDown, true);
    document.addEventListener('mousedown', onPointerDown, true);
    document.addEventListener('pointerdown', onPointerDown, true);
    document.addEventListener('touchstart', onPointerDown, true);
    document.addEventListener('visibilitychange', onVisibilityChange, true);

    addInitialPointerMoveListeners();

    // For focus and blur, we specifically care about state changes in the local
    // scope. This is because focus / blur events that originate from within a
    // shadow root are not re-dispatched from the host element if it was already
    // the active element in its own scope:
    scope.addEventListener('focus', onFocus, true);
    scope.addEventListener('blur', onBlur, true);

    // We detect that a node is a ShadowRoot by ensuring that it is a
    // DocumentFragment and also has a host property. This check covers native
    // implementation and polyfill implementation transparently. If we only cared
    // about the native implementation, we could just check if the scope was
    // an instance of a ShadowRoot.
    if (scope.nodeType === Node.DOCUMENT_FRAGMENT_NODE && scope.host) {
      // Since a ShadowRoot is a special kind of DocumentFragment, it does not
      // have a root element to add a class to. So, we add this attribute to the
      // host element instead:
      scope.host.setAttribute('data-js-focus-visible', '');
    } else if (scope.nodeType === Node.DOCUMENT_NODE) {
      document.documentElement.classList.add('js-focus-visible');
      document.documentElement.setAttribute('data-js-focus-visible', '');
    }
  }

  // It is important to wrap all references to global window and document in
  // these checks to support server-side rendering use cases
  // @see https://github.com/WICG/focus-visible/issues/199
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    // Make the polyfill helper globally available. This can be used as a signal
    // to interested libraries that wish to coordinate with the polyfill for e.g.,
    // applying the polyfill to a shadow root:
    window.applyFocusVisiblePolyfill = applyFocusVisiblePolyfill;

    // Notify interested libraries of the polyfill's presence, in case the
    // polyfill was loaded lazily:
    var event;

    try {
      event = new CustomEvent('focus-visible-polyfill-ready');
    } catch (error) {
      // IE11 does not support using CustomEvent as a constructor directly:
      event = document.createEvent('CustomEvent');
      event.initCustomEvent('focus-visible-polyfill-ready', false, false, {});
    }

    window.dispatchEvent(event);
  }

  if (typeof document !== 'undefined') {
    // Apply the polyfill to the global document, so that no JavaScript
    // coordination is required to use the polyfill in the top-level document:
    applyFocusVisiblePolyfill(document);
  }

})));


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Showcase": () => (/* binding */ Showcase)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Showcase_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(283);



class Showcase extends _lib__WEBPACK_IMPORTED_MODULE_0__.HtmlDiv
{
}


/***/ }),
/* 4 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Assembler": () => (/* reexport safe */ _Assembler__WEBPACK_IMPORTED_MODULE_0__.Assembler),
/* harmony export */   "AttrType": () => (/* reexport safe */ _dommodule__WEBPACK_IMPORTED_MODULE_1__.AttrType),
/* harmony export */   "DomDoc": () => (/* reexport safe */ _dommodule__WEBPACK_IMPORTED_MODULE_1__.DomDoc),
/* harmony export */   "DomElem": () => (/* reexport safe */ _dommodule__WEBPACK_IMPORTED_MODULE_1__.DomElem),
/* harmony export */   "DomFragment": () => (/* reexport safe */ _dommodule__WEBPACK_IMPORTED_MODULE_1__.DomFragment),
/* harmony export */   "DomNode": () => (/* reexport safe */ _dommodule__WEBPACK_IMPORTED_MODULE_1__.DomNode),
/* harmony export */   "DomTarget": () => (/* reexport safe */ _dommodule__WEBPACK_IMPORTED_MODULE_1__.DomTarget),
/* harmony export */   "Alert": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Alert),
/* harmony export */   "AlertDialog": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.AlertDialog),
/* harmony export */   "Application": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Application),
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
/* harmony export */   "Article": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Article),
/* harmony export */   "Banner": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Banner),
/* harmony export */   "BlockQuote": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.BlockQuote),
/* harmony export */   "Button": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Button),
/* harmony export */   "Caption": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Caption),
/* harmony export */   "Cell": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Cell),
/* harmony export */   "CheckBox": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.CheckBox),
/* harmony export */   "ColumnHeader": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.ColumnHeader),
/* harmony export */   "ComboBox": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.ComboBox),
/* harmony export */   "Command": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Command),
/* harmony export */   "Complementary": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Complementary),
/* harmony export */   "Composite": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Composite),
/* harmony export */   "ContentInfo": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.ContentInfo),
/* harmony export */   "Definition": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Definition),
/* harmony export */   "Dialog": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Dialog),
/* harmony export */   "Directory": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Directory),
/* harmony export */   "Feed": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Feed),
/* harmony export */   "Figure": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Figure),
/* harmony export */   "Form": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Form),
/* harmony export */   "Grid": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Grid),
/* harmony export */   "GridCell": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.GridCell),
/* harmony export */   "Group": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Group),
/* harmony export */   "Heading": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Heading),
/* harmony export */   "Img": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Img),
/* harmony export */   "Input": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Input),
/* harmony export */   "Landmark": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Landmark),
/* harmony export */   "Link": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Link),
/* harmony export */   "List": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.List),
/* harmony export */   "ListBox": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.ListBox),
/* harmony export */   "ListItem": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.ListItem),
/* harmony export */   "Log": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Log),
/* harmony export */   "Main": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Main),
/* harmony export */   "Marquee": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Marquee),
/* harmony export */   "Math": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Math),
/* harmony export */   "Menu": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Menu),
/* harmony export */   "MenuBar": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.MenuBar),
/* harmony export */   "MenuItem": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.MenuItem),
/* harmony export */   "MenuItemCheckBox": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.MenuItemCheckBox),
/* harmony export */   "MenuItemRadio": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.MenuItemRadio),
/* harmony export */   "Navigation": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Navigation),
/* harmony export */   "None": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.None),
/* harmony export */   "Note": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Note),
/* harmony export */   "Paragraph": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Paragraph),
/* harmony export */   "Presentation": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Presentation),
/* harmony export */   "ProgressBar": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.ProgressBar),
/* harmony export */   "Radio": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Radio),
/* harmony export */   "RadioGroup": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RadioGroup),
/* harmony export */   "Region": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Region),
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
/* harmony export */   "RoleType": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleType),
/* harmony export */   "RoleWidget": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleWidget),
/* harmony export */   "RoleWindow": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RoleWindow),
/* harmony export */   "Row": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Row),
/* harmony export */   "RowGroup": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RowGroup),
/* harmony export */   "RowHeader": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.RowHeader),
/* harmony export */   "ScrollBar": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.ScrollBar),
/* harmony export */   "Search": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Search),
/* harmony export */   "SearchBox": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.SearchBox),
/* harmony export */   "Section": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Section),
/* harmony export */   "SectionHead": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.SectionHead),
/* harmony export */   "Select": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Select),
/* harmony export */   "Separator": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Separator),
/* harmony export */   "Slider": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Slider),
/* harmony export */   "SpinButton": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.SpinButton),
/* harmony export */   "Status": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Status),
/* harmony export */   "Structure": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Structure),
/* harmony export */   "Switch": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Switch),
/* harmony export */   "Tab": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Tab),
/* harmony export */   "TabList": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.TabList),
/* harmony export */   "TabPanel": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.TabPanel),
/* harmony export */   "Table": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Table),
/* harmony export */   "Term": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Term),
/* harmony export */   "TextBox": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.TextBox),
/* harmony export */   "Timer": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Timer),
/* harmony export */   "ToolBar": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.ToolBar),
/* harmony export */   "ToolTip": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.ToolTip),
/* harmony export */   "Tree": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Tree),
/* harmony export */   "TreeGrid": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.TreeGrid),
/* harmony export */   "TreeItem": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.TreeItem),
/* harmony export */   "Widget": () => (/* reexport safe */ _ariamodule__WEBPACK_IMPORTED_MODULE_2__.Widget),
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
/* harmony import */ var _Assembler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _dommodule__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _ariamodule__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(43);
/* harmony import */ var _htmlmodule__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(87);
/* harmony import */ var _PendingChild__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(282);







/***/ }),
/* 5 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Assembler": () => (/* binding */ Assembler)
/* harmony export */ });
let undefined
const storage = window.env === 'development'? new Map : new WeakMap

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
    Assembler.__storage.delete(this.node)
    if(window.env === 'development') {
      this.node = null
    }
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
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AttrType": () => (/* reexport safe */ _AttrType__WEBPACK_IMPORTED_MODULE_0__.AttrType),
/* harmony export */   "DomDoc": () => (/* reexport safe */ _DomDoc__WEBPACK_IMPORTED_MODULE_1__.DomDoc),
/* harmony export */   "DomElem": () => (/* reexport safe */ _DomElem__WEBPACK_IMPORTED_MODULE_2__.DomElem),
/* harmony export */   "DomFragment": () => (/* reexport safe */ _DomFragment__WEBPACK_IMPORTED_MODULE_3__.DomFragment),
/* harmony export */   "DomNode": () => (/* reexport safe */ _DomNode__WEBPACK_IMPORTED_MODULE_4__.DomNode),
/* harmony export */   "DomTarget": () => (/* reexport safe */ _DomTarget__WEBPACK_IMPORTED_MODULE_5__.DomTarget)
/* harmony export */ });
/* harmony import */ var _AttrType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _DomDoc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);
/* harmony import */ var _DomElem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9);
/* harmony import */ var _DomFragment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(42);
/* harmony import */ var _DomNode__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(11);
/* harmony import */ var _DomTarget__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(12);
/**
 * @module dommodule
 * @author Vyacheslav Aristov <vv.aristov@gmail.com>
 * @license MIT
 * @see https://www.w3.org/TR/dom
 * @see https://dom.spec.whatwg.org
 */








/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
/* 8 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DomDoc": () => (/* binding */ DomDoc)
/* harmony export */ });
/* harmony import */ var _DomElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _DomNode__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(11);
/* harmony import */ var _DomTarget__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(12);
/* harmony import */ var _HtmlBody__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(13);
/* harmony import */ var _HtmlHead__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(40);
/* harmony import */ var _HtmlHtml__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(41);







const { Document } = window

/**
 * @see https://www.w3.org/TR/dom/#interface-document
 */
class DomDoc extends _DomNode__WEBPACK_IMPORTED_MODULE_1__.DomNode
{
  /**
   * @param {{}} init
   * @param {Document} [init.node]
   */
  create(init) {
    if(!init.node) {
      init.node = new Document
    }
    super.create(init)
  }

  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.__refs = new Map
    new _HtmlHtml__WEBPACK_IMPORTED_MODULE_5__.HtmlHtml({ node : this.node.documentElement })
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
    return _DomElem__WEBPACK_IMPORTED_MODULE_0__.DomElem.get(this.node.getElementById(id))
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
    return _DomElem__WEBPACK_IMPORTED_MODULE_0__.DomElem.get(this.node.activeElement)
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
    return _HtmlBody__WEBPACK_IMPORTED_MODULE_3__.HtmlBody.get(this.node.body)
  }

  /**
   * @returns {HtmlHead}
   */
  get head() {
    return _HtmlHead__WEBPACK_IMPORTED_MODULE_4__.HtmlHead.get(this.node.head)
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
    return _DomTarget__WEBPACK_IMPORTED_MODULE_2__.DomTarget.Win.get(this.node.defaultView)
  }

  /**
   * @returns {HtmlHtml|null}
   */
  get docElem() {
    return _HtmlHtml__WEBPACK_IMPORTED_MODULE_5__.HtmlHtml.get(this.node.documentElement)
  }
}

_DomTarget__WEBPACK_IMPORTED_MODULE_2__.DomTarget.DomDoc = DomDoc


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DomElem": () => (/* binding */ DomElem)
/* harmony export */ });
/* harmony import */ var _AttrType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _Class__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(10);
/* harmony import */ var _DomNode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(11);
/* harmony import */ var _DomTarget__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(12);





const map = Array.prototype.map
const { document, DocumentFragment } = window
let counter = 0

/**
 * @see https://www.w3.org/TR/dom/#interface-element
 */
class DomElem extends _DomNode__WEBPACK_IMPORTED_MODULE_2__.DomNode
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
    return this.getAttr(_Class__WEBPACK_IMPORTED_MODULE_1__.Class)
  }

  /**
   * @param {array.string|{}|string} value
   */
  set class(value) {
    this.setAttr(_Class__WEBPACK_IMPORTED_MODULE_1__.Class, value)
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
    return _DomNode__WEBPACK_IMPORTED_MODULE_2__.DomNode.DomDoc.get(this.node.ownerDocument)
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
    return _DomNode__WEBPACK_IMPORTED_MODULE_2__.DomNode.get(this.node.parentNode)
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
      _AttrType__WEBPACK_IMPORTED_MODULE_0__.AttrType.define(this, item)
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

_DomTarget__WEBPACK_IMPORTED_MODULE_3__.DomTarget.DomElem = DomElem


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Class": () => (/* binding */ Class)
/* harmony export */ });
/* harmony import */ var _AttrType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);


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
/* 11 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DomNode": () => (/* binding */ DomNode)
/* harmony export */ });
/* harmony import */ var _AttrType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _DomTarget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(12);



let undefined
const map = Array.prototype.map
const { MutationObserver, Node } = window
const ATTR_KEY_PREFIX = 'attr:'

/**
 * @see https://www.w3.org/TR/dom/#interface-node
 * @abstract
 */
class DomNode extends _DomTarget__WEBPACK_IMPORTED_MODULE_1__.DomTarget
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
    else if(type === _AttrType__WEBPACK_IMPORTED_MODULE_0__.AttrType || _AttrType__WEBPACK_IMPORTED_MODULE_0__.AttrType.isPrototypeOf(type)) {
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
    else if(type === _AttrType__WEBPACK_IMPORTED_MODULE_0__.AttrType || _AttrType__WEBPACK_IMPORTED_MODULE_0__.AttrType.isPrototypeOf(type)) {
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
      const name = attr === _AttrType__WEBPACK_IMPORTED_MODULE_0__.AttrType? '' : attr.localName || attr
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
    node.replaceWith(...DomNode.prototype.flatChildren([res]))
  })
  .catch(err => console.error(node.data = err))
  return node
}


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DomTarget": () => (/* binding */ DomTarget)
/* harmony export */ });
/* harmony import */ var _Assembler__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);


const {
  CustomEvent,
  Event,
  EventTarget,
  FocusEvent,
  InputEvent,
  KeyboardEvent,
  MouseEvent,
  Node,
  TouchEvent,
  UIEvent,
} = window
const EVENT_KEY_PREFIX = 'event:'

/**
 * @see https://www.w3.org/TR/dom/#interface-eventtarget
 */
class DomTarget extends _Assembler__WEBPACK_IMPORTED_MODULE_0__.Assembler
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
    const res = await fetch(request, init)
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
      headers : { 'Accept' : JSON_MIME_TYPE }
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
        'Content-Type' : JSON_MIME_TYPE
      }
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
  blur : [FocusEvent],
  cancel : [Event, false, true],
  change : [Event, true],
  click : [MouseEvent, true, true],
  close : [Event],
  contextmenu : [MouseEvent, true, true],
  dblclick : [MouseEvent, true, true],
  error : [Event],
  focus : [FocusEvent],
  focusin : [FocusEvent, true],
  focusout : [FocusEvent, true],
  input : [InputEvent, true],
  invalid : [Event, false, true],
  keydown : [KeyboardEvent, true, true],
  keyup : [KeyboardEvent, true, true],
  load : [Event],
  mousedown : [MouseEvent, true, true],
  mouseenter : [MouseEvent],
  mouseleave : [MouseEvent],
  mousemove : [MouseEvent, true, true],
  mouseout : [MouseEvent, true, true],
  mouseover : [MouseEvent, true, true],
  mouseup : [MouseEvent, true, true],
  reset : [Event, true, true],
  resize : [UIEvent],
  scroll : [Event, true],
  submit : [Event, true, true],
  touchcancel : [TouchEvent, true],
  touchend : [TouchEvent, true, true],
  touchmove : [TouchEvent, true, true],
  touchstart : [TouchEvent, true, true],
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
/* 13 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlBody": () => (/* binding */ HtmlBody)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-body-element
 */
class HtmlBody extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlElem": () => (/* binding */ HtmlElem)
/* harmony export */ });
/* harmony import */ var _AriaAtomic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _AriaBusy__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(18);
/* harmony import */ var _AriaControls__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(19);
/* harmony import */ var _AriaCurrent__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(21);
/* harmony import */ var _AriaDescribedBy__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(23);
/* harmony import */ var _AriaDetails__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(24);
/* harmony import */ var _AriaFlowTo__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(26);
/* harmony import */ var _AriaKeyShortcuts__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(27);
/* harmony import */ var _AriaLabel__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(29);
/* harmony import */ var _AriaLabelledBy__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(30);
/* harmony import */ var _AriaLive__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(31);
/* harmony import */ var _AriaOwns__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(32);
/* harmony import */ var _AriaRelevant__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(33);
/* harmony import */ var _AriaRoleDescription__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(35);
/* harmony import */ var _Dataset__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(36);
/* harmony import */ var _DomElem__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(9);
/* harmony import */ var _Style__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(37);
/* harmony import */ var _TabIndex__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(38);



















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
/* 15 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaAtomic": () => (/* binding */ AriaAtomic)
/* harmony export */ });
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);


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
/* 16 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeBoolean": () => (/* binding */ AriaTypeBoolean)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);


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
/* 17 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaType": () => (/* binding */ AriaType)
/* harmony export */ });
/* harmony import */ var _AttrType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);


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
/* 18 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaBusy": () => (/* binding */ AriaBusy)
/* harmony export */ });
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);


/**
 * Indicates an element is being modified and that assistive technologies MAY want
 *  to wait until the modifications are complete before exposing them to the user.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-busy
 */
class AriaBusy extends _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__.AriaTypeBoolean
{
}


/***/ }),
/* 19 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaControls": () => (/* binding */ AriaControls)
/* harmony export */ });
/* harmony import */ var _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);


/**
 * Identifies the element (or elements) whose contents
 *  or presence are controlled by the current element.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-controls
 */
class AriaControls extends _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__.AriaTypeIdRefList
{
}


/***/ }),
/* 20 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeIdRefList": () => (/* binding */ AriaTypeIdRefList)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var _DomElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);



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
/* 21 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaCurrent": () => (/* binding */ AriaCurrent)
/* harmony export */ });
/* harmony import */ var _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);


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
/* 22 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeToken": () => (/* binding */ AriaTypeToken)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);


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
/* 23 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaDescribedBy": () => (/* binding */ AriaDescribedBy)
/* harmony export */ });
/* harmony import */ var _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);


/**
 * Identifies the element (or elements) that describes the object.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-describedby
 */
class AriaDescribedBy extends _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__.AriaTypeIdRefList
{
}


/***/ }),
/* 24 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaDetails": () => (/* binding */ AriaDetails)
/* harmony export */ });
/* harmony import */ var _AriaTypeIdRef__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(25);


/**
 * Identifies the element that provides a detailed, extended description for the object.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-details
 */
class AriaDetails extends _AriaTypeIdRef__WEBPACK_IMPORTED_MODULE_0__.AriaTypeIdRef
{
}


/***/ }),
/* 25 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeIdRef": () => (/* binding */ AriaTypeIdRef)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var _DomElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);



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
/* 26 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaFlowTo": () => (/* binding */ AriaFlowTo)
/* harmony export */ });
/* harmony import */ var _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);


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
/* 27 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaKeyShortcuts": () => (/* binding */ AriaKeyShortcuts)
/* harmony export */ });
/* harmony import */ var _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);


/**
 * Indicates keyboard shortcuts that an author has implemented
 *  to activate or give focus to an element.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-keyshortcuts
 */
class AriaKeyShortcuts extends _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__.AriaTypeString
{
}


/***/ }),
/* 28 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeString": () => (/* binding */ AriaTypeString)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);


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
/* 29 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaLabel": () => (/* binding */ AriaLabel)
/* harmony export */ });
/* harmony import */ var _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);


/**
 * Defines a string value that labels the current element.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-label
 */
class AriaLabel extends _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__.AriaTypeString
{
}


/***/ }),
/* 30 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaLabelledBy": () => (/* binding */ AriaLabelledBy)
/* harmony export */ });
/* harmony import */ var _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);


/**
 * Identifies the element (or elements) that labels the current element.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-labelledby
 */
class AriaLabelledBy extends _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__.AriaTypeIdRefList
{
}


/***/ }),
/* 31 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaLive": () => (/* binding */ AriaLive)
/* harmony export */ });
/* harmony import */ var _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);


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
/* 32 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaOwns": () => (/* binding */ AriaOwns)
/* harmony export */ });
/* harmony import */ var _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(20);


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
/* 33 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaRelevant": () => (/* binding */ AriaRelevant)
/* harmony export */ });
/* harmony import */ var _AriaTypeTokenList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(34);


/**
 * Indicates what notifications the user agent will trigger
 *  when the accessibility tree within a live region is modified.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-relevant
 */
class AriaRelevant extends _AriaTypeTokenList__WEBPACK_IMPORTED_MODULE_0__.AriaTypeTokenList
{
}


/***/ }),
/* 34 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeTokenList": () => (/* binding */ AriaTypeTokenList)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);


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
/* 35 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaRoleDescription": () => (/* binding */ AriaRoleDescription)
/* harmony export */ });
/* harmony import */ var _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);


/**
 * Defines a human-readable, author-localized description for the role of an element.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-roledescription
 */
class AriaRoleDescription extends _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__.AriaTypeString
{
}


/***/ }),
/* 36 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Dataset": () => (/* binding */ Dataset)
/* harmony export */ });
/* harmony import */ var _AttrType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);


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
/* 37 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Style": () => (/* binding */ Style)
/* harmony export */ });
/* harmony import */ var _AttrType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);


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
/* 38 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TabIndex": () => (/* binding */ TabIndex)
/* harmony export */ });
/* harmony import */ var _AriaDisabled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(39);
/* harmony import */ var _AttrType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _DomElem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9);




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
/* 39 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaDisabled": () => (/* binding */ AriaDisabled)
/* harmony export */ });
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);


/**
 * Indicates that the element is perceivable but disabled,
 *  so it is not editable or otherwise operable.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-disabled
 */
class AriaDisabled extends _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__.AriaTypeBoolean
{
}


/***/ }),
/* 40 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlHead": () => (/* binding */ HtmlHead)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-head-element
 */
class HtmlHead extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 41 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlHtml": () => (/* binding */ HtmlHtml)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-html-element
 */
class HtmlHtml extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 42 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DomFragment": () => (/* binding */ DomFragment)
/* harmony export */ });
/* harmony import */ var _DomNode__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(11);


const { DocumentFragment } = window

/**
 * @see https://www.w3.org/TR/dom/#interface-documentfragment
 */
class DomFragment extends _DomNode__WEBPACK_IMPORTED_MODULE_0__.DomNode
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
/* 43 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
/* harmony export */   "Alert": () => (/* reexport safe */ _RoleAlert__WEBPACK_IMPORTED_MODULE_60__.Alert),
/* harmony export */   "RoleAlert": () => (/* reexport safe */ _RoleAlert__WEBPACK_IMPORTED_MODULE_60__.RoleAlert),
/* harmony export */   "AlertDialog": () => (/* reexport safe */ _RoleAlertDialog__WEBPACK_IMPORTED_MODULE_61__.AlertDialog),
/* harmony export */   "RoleAlertDialog": () => (/* reexport safe */ _RoleAlertDialog__WEBPACK_IMPORTED_MODULE_61__.RoleAlertDialog),
/* harmony export */   "Application": () => (/* reexport safe */ _RoleApplication__WEBPACK_IMPORTED_MODULE_62__.Application),
/* harmony export */   "RoleApplication": () => (/* reexport safe */ _RoleApplication__WEBPACK_IMPORTED_MODULE_62__.RoleApplication),
/* harmony export */   "Article": () => (/* reexport safe */ _RoleArticle__WEBPACK_IMPORTED_MODULE_63__.Article),
/* harmony export */   "RoleArticle": () => (/* reexport safe */ _RoleArticle__WEBPACK_IMPORTED_MODULE_63__.RoleArticle),
/* harmony export */   "Banner": () => (/* reexport safe */ _RoleBanner__WEBPACK_IMPORTED_MODULE_64__.Banner),
/* harmony export */   "RoleBanner": () => (/* reexport safe */ _RoleBanner__WEBPACK_IMPORTED_MODULE_64__.RoleBanner),
/* harmony export */   "BlockQuote": () => (/* reexport safe */ _RoleBlockQuote__WEBPACK_IMPORTED_MODULE_65__.BlockQuote),
/* harmony export */   "RoleBlockQuote": () => (/* reexport safe */ _RoleBlockQuote__WEBPACK_IMPORTED_MODULE_65__.RoleBlockQuote),
/* harmony export */   "Button": () => (/* reexport safe */ _RoleButton__WEBPACK_IMPORTED_MODULE_66__.Button),
/* harmony export */   "RoleButton": () => (/* reexport safe */ _RoleButton__WEBPACK_IMPORTED_MODULE_66__.RoleButton),
/* harmony export */   "Caption": () => (/* reexport safe */ _RoleCaption__WEBPACK_IMPORTED_MODULE_67__.Caption),
/* harmony export */   "RoleCaption": () => (/* reexport safe */ _RoleCaption__WEBPACK_IMPORTED_MODULE_67__.RoleCaption),
/* harmony export */   "Cell": () => (/* reexport safe */ _RoleCell__WEBPACK_IMPORTED_MODULE_68__.Cell),
/* harmony export */   "RoleCell": () => (/* reexport safe */ _RoleCell__WEBPACK_IMPORTED_MODULE_68__.RoleCell),
/* harmony export */   "CheckBox": () => (/* reexport safe */ _RoleCheckBox__WEBPACK_IMPORTED_MODULE_69__.CheckBox),
/* harmony export */   "RoleCheckBox": () => (/* reexport safe */ _RoleCheckBox__WEBPACK_IMPORTED_MODULE_69__.RoleCheckBox),
/* harmony export */   "ColumnHeader": () => (/* reexport safe */ _RoleColumnHeader__WEBPACK_IMPORTED_MODULE_70__.ColumnHeader),
/* harmony export */   "RoleColumnHeader": () => (/* reexport safe */ _RoleColumnHeader__WEBPACK_IMPORTED_MODULE_70__.RoleColumnHeader),
/* harmony export */   "ComboBox": () => (/* reexport safe */ _RoleComboBox__WEBPACK_IMPORTED_MODULE_71__.ComboBox),
/* harmony export */   "RoleComboBox": () => (/* reexport safe */ _RoleComboBox__WEBPACK_IMPORTED_MODULE_71__.RoleComboBox),
/* harmony export */   "Command": () => (/* reexport safe */ _RoleCommand__WEBPACK_IMPORTED_MODULE_72__.Command),
/* harmony export */   "RoleCommand": () => (/* reexport safe */ _RoleCommand__WEBPACK_IMPORTED_MODULE_72__.RoleCommand),
/* harmony export */   "Complementary": () => (/* reexport safe */ _RoleComplementary__WEBPACK_IMPORTED_MODULE_73__.Complementary),
/* harmony export */   "RoleComplementary": () => (/* reexport safe */ _RoleComplementary__WEBPACK_IMPORTED_MODULE_73__.RoleComplementary),
/* harmony export */   "Composite": () => (/* reexport safe */ _RoleComposite__WEBPACK_IMPORTED_MODULE_74__.Composite),
/* harmony export */   "RoleComposite": () => (/* reexport safe */ _RoleComposite__WEBPACK_IMPORTED_MODULE_74__.RoleComposite),
/* harmony export */   "ContentInfo": () => (/* reexport safe */ _RoleContentInfo__WEBPACK_IMPORTED_MODULE_75__.ContentInfo),
/* harmony export */   "RoleContentInfo": () => (/* reexport safe */ _RoleContentInfo__WEBPACK_IMPORTED_MODULE_75__.RoleContentInfo),
/* harmony export */   "Definition": () => (/* reexport safe */ _RoleDefinition__WEBPACK_IMPORTED_MODULE_76__.Definition),
/* harmony export */   "RoleDefinition": () => (/* reexport safe */ _RoleDefinition__WEBPACK_IMPORTED_MODULE_76__.RoleDefinition),
/* harmony export */   "Dialog": () => (/* reexport safe */ _RoleDialog__WEBPACK_IMPORTED_MODULE_77__.Dialog),
/* harmony export */   "RoleDialog": () => (/* reexport safe */ _RoleDialog__WEBPACK_IMPORTED_MODULE_77__.RoleDialog),
/* harmony export */   "Directory": () => (/* reexport safe */ _RoleDirectory__WEBPACK_IMPORTED_MODULE_78__.Directory),
/* harmony export */   "RoleDirectory": () => (/* reexport safe */ _RoleDirectory__WEBPACK_IMPORTED_MODULE_78__.RoleDirectory),
/* harmony export */   "RoleDocument": () => (/* reexport safe */ _RoleDocument__WEBPACK_IMPORTED_MODULE_79__.RoleDocument),
/* harmony export */   "Feed": () => (/* reexport safe */ _RoleFeed__WEBPACK_IMPORTED_MODULE_80__.Feed),
/* harmony export */   "RoleFeed": () => (/* reexport safe */ _RoleFeed__WEBPACK_IMPORTED_MODULE_80__.RoleFeed),
/* harmony export */   "Figure": () => (/* reexport safe */ _RoleFigure__WEBPACK_IMPORTED_MODULE_81__.Figure),
/* harmony export */   "RoleFigure": () => (/* reexport safe */ _RoleFigure__WEBPACK_IMPORTED_MODULE_81__.RoleFigure),
/* harmony export */   "Form": () => (/* reexport safe */ _RoleForm__WEBPACK_IMPORTED_MODULE_82__.Form),
/* harmony export */   "RoleForm": () => (/* reexport safe */ _RoleForm__WEBPACK_IMPORTED_MODULE_82__.RoleForm),
/* harmony export */   "Grid": () => (/* reexport safe */ _RoleGrid__WEBPACK_IMPORTED_MODULE_83__.Grid),
/* harmony export */   "RoleGrid": () => (/* reexport safe */ _RoleGrid__WEBPACK_IMPORTED_MODULE_83__.RoleGrid),
/* harmony export */   "GridCell": () => (/* reexport safe */ _RoleGridCell__WEBPACK_IMPORTED_MODULE_84__.GridCell),
/* harmony export */   "RoleGridCell": () => (/* reexport safe */ _RoleGridCell__WEBPACK_IMPORTED_MODULE_84__.RoleGridCell),
/* harmony export */   "Group": () => (/* reexport safe */ _RoleGroup__WEBPACK_IMPORTED_MODULE_85__.Group),
/* harmony export */   "RoleGroup": () => (/* reexport safe */ _RoleGroup__WEBPACK_IMPORTED_MODULE_85__.RoleGroup),
/* harmony export */   "Heading": () => (/* reexport safe */ _RoleHeading__WEBPACK_IMPORTED_MODULE_86__.Heading),
/* harmony export */   "RoleHeading": () => (/* reexport safe */ _RoleHeading__WEBPACK_IMPORTED_MODULE_86__.RoleHeading),
/* harmony export */   "Img": () => (/* reexport safe */ _RoleImg__WEBPACK_IMPORTED_MODULE_87__.Img),
/* harmony export */   "RoleImg": () => (/* reexport safe */ _RoleImg__WEBPACK_IMPORTED_MODULE_87__.RoleImg),
/* harmony export */   "Input": () => (/* reexport safe */ _RoleInput__WEBPACK_IMPORTED_MODULE_88__.Input),
/* harmony export */   "RoleInput": () => (/* reexport safe */ _RoleInput__WEBPACK_IMPORTED_MODULE_88__.RoleInput),
/* harmony export */   "Landmark": () => (/* reexport safe */ _RoleLandmark__WEBPACK_IMPORTED_MODULE_89__.Landmark),
/* harmony export */   "RoleLandmark": () => (/* reexport safe */ _RoleLandmark__WEBPACK_IMPORTED_MODULE_89__.RoleLandmark),
/* harmony export */   "Link": () => (/* reexport safe */ _RoleLink__WEBPACK_IMPORTED_MODULE_90__.Link),
/* harmony export */   "RoleLink": () => (/* reexport safe */ _RoleLink__WEBPACK_IMPORTED_MODULE_90__.RoleLink),
/* harmony export */   "List": () => (/* reexport safe */ _RoleList__WEBPACK_IMPORTED_MODULE_91__.List),
/* harmony export */   "RoleList": () => (/* reexport safe */ _RoleList__WEBPACK_IMPORTED_MODULE_91__.RoleList),
/* harmony export */   "ListBox": () => (/* reexport safe */ _RoleListBox__WEBPACK_IMPORTED_MODULE_92__.ListBox),
/* harmony export */   "RoleListBox": () => (/* reexport safe */ _RoleListBox__WEBPACK_IMPORTED_MODULE_92__.RoleListBox),
/* harmony export */   "ListItem": () => (/* reexport safe */ _RoleListItem__WEBPACK_IMPORTED_MODULE_93__.ListItem),
/* harmony export */   "RoleListItem": () => (/* reexport safe */ _RoleListItem__WEBPACK_IMPORTED_MODULE_93__.RoleListItem),
/* harmony export */   "Log": () => (/* reexport safe */ _RoleLog__WEBPACK_IMPORTED_MODULE_94__.Log),
/* harmony export */   "RoleLog": () => (/* reexport safe */ _RoleLog__WEBPACK_IMPORTED_MODULE_94__.RoleLog),
/* harmony export */   "Main": () => (/* reexport safe */ _RoleMain__WEBPACK_IMPORTED_MODULE_95__.Main),
/* harmony export */   "RoleMain": () => (/* reexport safe */ _RoleMain__WEBPACK_IMPORTED_MODULE_95__.RoleMain),
/* harmony export */   "Marquee": () => (/* reexport safe */ _RoleMarquee__WEBPACK_IMPORTED_MODULE_96__.Marquee),
/* harmony export */   "RoleMarquee": () => (/* reexport safe */ _RoleMarquee__WEBPACK_IMPORTED_MODULE_96__.RoleMarquee),
/* harmony export */   "Math": () => (/* reexport safe */ _RoleMath__WEBPACK_IMPORTED_MODULE_97__.Math),
/* harmony export */   "RoleMath": () => (/* reexport safe */ _RoleMath__WEBPACK_IMPORTED_MODULE_97__.RoleMath),
/* harmony export */   "Menu": () => (/* reexport safe */ _RoleMenu__WEBPACK_IMPORTED_MODULE_98__.Menu),
/* harmony export */   "RoleMenu": () => (/* reexport safe */ _RoleMenu__WEBPACK_IMPORTED_MODULE_98__.RoleMenu),
/* harmony export */   "MenuBar": () => (/* reexport safe */ _RoleMenuBar__WEBPACK_IMPORTED_MODULE_99__.MenuBar),
/* harmony export */   "RoleMenuBar": () => (/* reexport safe */ _RoleMenuBar__WEBPACK_IMPORTED_MODULE_99__.RoleMenuBar),
/* harmony export */   "MenuItem": () => (/* reexport safe */ _RoleMenuItem__WEBPACK_IMPORTED_MODULE_100__.MenuItem),
/* harmony export */   "RoleMenuItem": () => (/* reexport safe */ _RoleMenuItem__WEBPACK_IMPORTED_MODULE_100__.RoleMenuItem),
/* harmony export */   "MenuItemCheckBox": () => (/* reexport safe */ _RoleMenuItemCheckBox__WEBPACK_IMPORTED_MODULE_101__.MenuItemCheckBox),
/* harmony export */   "RoleMenuItemCheckBox": () => (/* reexport safe */ _RoleMenuItemCheckBox__WEBPACK_IMPORTED_MODULE_101__.RoleMenuItemCheckBox),
/* harmony export */   "MenuItemRadio": () => (/* reexport safe */ _RoleMenuItemRadio__WEBPACK_IMPORTED_MODULE_102__.MenuItemRadio),
/* harmony export */   "RoleMenuItemRadio": () => (/* reexport safe */ _RoleMenuItemRadio__WEBPACK_IMPORTED_MODULE_102__.RoleMenuItemRadio),
/* harmony export */   "Navigation": () => (/* reexport safe */ _RoleNavigation__WEBPACK_IMPORTED_MODULE_103__.Navigation),
/* harmony export */   "RoleNavigation": () => (/* reexport safe */ _RoleNavigation__WEBPACK_IMPORTED_MODULE_103__.RoleNavigation),
/* harmony export */   "None": () => (/* reexport safe */ _RoleNone__WEBPACK_IMPORTED_MODULE_104__.None),
/* harmony export */   "RoleNone": () => (/* reexport safe */ _RoleNone__WEBPACK_IMPORTED_MODULE_104__.RoleNone),
/* harmony export */   "Note": () => (/* reexport safe */ _RoleNote__WEBPACK_IMPORTED_MODULE_105__.Note),
/* harmony export */   "RoleNote": () => (/* reexport safe */ _RoleNote__WEBPACK_IMPORTED_MODULE_105__.RoleNote),
/* harmony export */   "RoleOption": () => (/* reexport safe */ _RoleOption__WEBPACK_IMPORTED_MODULE_106__.RoleOption),
/* harmony export */   "Paragraph": () => (/* reexport safe */ _RoleParagraph__WEBPACK_IMPORTED_MODULE_107__.Paragraph),
/* harmony export */   "RoleParagraph": () => (/* reexport safe */ _RoleParagraph__WEBPACK_IMPORTED_MODULE_107__.RoleParagraph),
/* harmony export */   "Presentation": () => (/* reexport safe */ _RolePresentation__WEBPACK_IMPORTED_MODULE_108__.Presentation),
/* harmony export */   "RolePresentation": () => (/* reexport safe */ _RolePresentation__WEBPACK_IMPORTED_MODULE_108__.RolePresentation),
/* harmony export */   "ProgressBar": () => (/* reexport safe */ _RoleProgressBar__WEBPACK_IMPORTED_MODULE_109__.ProgressBar),
/* harmony export */   "RoleProgressBar": () => (/* reexport safe */ _RoleProgressBar__WEBPACK_IMPORTED_MODULE_109__.RoleProgressBar),
/* harmony export */   "Radio": () => (/* reexport safe */ _RoleRadio__WEBPACK_IMPORTED_MODULE_110__.Radio),
/* harmony export */   "RoleRadio": () => (/* reexport safe */ _RoleRadio__WEBPACK_IMPORTED_MODULE_110__.RoleRadio),
/* harmony export */   "RadioGroup": () => (/* reexport safe */ _RoleRadioGroup__WEBPACK_IMPORTED_MODULE_111__.RadioGroup),
/* harmony export */   "RoleRadioGroup": () => (/* reexport safe */ _RoleRadioGroup__WEBPACK_IMPORTED_MODULE_111__.RoleRadioGroup),
/* harmony export */   "RoleRange": () => (/* reexport safe */ _RoleRange__WEBPACK_IMPORTED_MODULE_112__.RoleRange),
/* harmony export */   "Region": () => (/* reexport safe */ _RoleRegion__WEBPACK_IMPORTED_MODULE_113__.Region),
/* harmony export */   "RoleRegion": () => (/* reexport safe */ _RoleRegion__WEBPACK_IMPORTED_MODULE_113__.RoleRegion),
/* harmony export */   "RoleRoleType": () => (/* reexport safe */ _RoleRoleType__WEBPACK_IMPORTED_MODULE_114__.RoleRoleType),
/* harmony export */   "RoleType": () => (/* reexport safe */ _RoleRoleType__WEBPACK_IMPORTED_MODULE_114__.RoleType),
/* harmony export */   "RoleRow": () => (/* reexport safe */ _RoleRow__WEBPACK_IMPORTED_MODULE_115__.RoleRow),
/* harmony export */   "Row": () => (/* reexport safe */ _RoleRow__WEBPACK_IMPORTED_MODULE_115__.Row),
/* harmony export */   "RoleRowGroup": () => (/* reexport safe */ _RoleRowGroup__WEBPACK_IMPORTED_MODULE_116__.RoleRowGroup),
/* harmony export */   "RowGroup": () => (/* reexport safe */ _RoleRowGroup__WEBPACK_IMPORTED_MODULE_116__.RowGroup),
/* harmony export */   "RoleRowHeader": () => (/* reexport safe */ _RoleRowHeader__WEBPACK_IMPORTED_MODULE_117__.RoleRowHeader),
/* harmony export */   "RowHeader": () => (/* reexport safe */ _RoleRowHeader__WEBPACK_IMPORTED_MODULE_117__.RowHeader),
/* harmony export */   "RoleScrollBar": () => (/* reexport safe */ _RoleScrollBar__WEBPACK_IMPORTED_MODULE_118__.RoleScrollBar),
/* harmony export */   "ScrollBar": () => (/* reexport safe */ _RoleScrollBar__WEBPACK_IMPORTED_MODULE_118__.ScrollBar),
/* harmony export */   "RoleSearch": () => (/* reexport safe */ _RoleSearch__WEBPACK_IMPORTED_MODULE_119__.RoleSearch),
/* harmony export */   "Search": () => (/* reexport safe */ _RoleSearch__WEBPACK_IMPORTED_MODULE_119__.Search),
/* harmony export */   "RoleSearchBox": () => (/* reexport safe */ _RoleSearchBox__WEBPACK_IMPORTED_MODULE_120__.RoleSearchBox),
/* harmony export */   "SearchBox": () => (/* reexport safe */ _RoleSearchBox__WEBPACK_IMPORTED_MODULE_120__.SearchBox),
/* harmony export */   "RoleSection": () => (/* reexport safe */ _RoleSection__WEBPACK_IMPORTED_MODULE_121__.RoleSection),
/* harmony export */   "Section": () => (/* reexport safe */ _RoleSection__WEBPACK_IMPORTED_MODULE_121__.Section),
/* harmony export */   "RoleSectionHead": () => (/* reexport safe */ _RoleSectionHead__WEBPACK_IMPORTED_MODULE_122__.RoleSectionHead),
/* harmony export */   "SectionHead": () => (/* reexport safe */ _RoleSectionHead__WEBPACK_IMPORTED_MODULE_122__.SectionHead),
/* harmony export */   "RoleSelect": () => (/* reexport safe */ _RoleSelect__WEBPACK_IMPORTED_MODULE_123__.RoleSelect),
/* harmony export */   "Select": () => (/* reexport safe */ _RoleSelect__WEBPACK_IMPORTED_MODULE_123__.Select),
/* harmony export */   "RoleSeparator": () => (/* reexport safe */ _RoleSeparator__WEBPACK_IMPORTED_MODULE_124__.RoleSeparator),
/* harmony export */   "Separator": () => (/* reexport safe */ _RoleSeparator__WEBPACK_IMPORTED_MODULE_124__.Separator),
/* harmony export */   "RoleSlider": () => (/* reexport safe */ _RoleSlider__WEBPACK_IMPORTED_MODULE_125__.RoleSlider),
/* harmony export */   "Slider": () => (/* reexport safe */ _RoleSlider__WEBPACK_IMPORTED_MODULE_125__.Slider),
/* harmony export */   "RoleSpinButton": () => (/* reexport safe */ _RoleSpinButton__WEBPACK_IMPORTED_MODULE_126__.RoleSpinButton),
/* harmony export */   "SpinButton": () => (/* reexport safe */ _RoleSpinButton__WEBPACK_IMPORTED_MODULE_126__.SpinButton),
/* harmony export */   "RoleStatus": () => (/* reexport safe */ _RoleStatus__WEBPACK_IMPORTED_MODULE_127__.RoleStatus),
/* harmony export */   "Status": () => (/* reexport safe */ _RoleStatus__WEBPACK_IMPORTED_MODULE_127__.Status),
/* harmony export */   "RoleStructure": () => (/* reexport safe */ _RoleStructure__WEBPACK_IMPORTED_MODULE_128__.RoleStructure),
/* harmony export */   "Structure": () => (/* reexport safe */ _RoleStructure__WEBPACK_IMPORTED_MODULE_128__.Structure),
/* harmony export */   "RoleSwitch": () => (/* reexport safe */ _RoleSwitch__WEBPACK_IMPORTED_MODULE_129__.RoleSwitch),
/* harmony export */   "Switch": () => (/* reexport safe */ _RoleSwitch__WEBPACK_IMPORTED_MODULE_129__.Switch),
/* harmony export */   "RoleTab": () => (/* reexport safe */ _RoleTab__WEBPACK_IMPORTED_MODULE_130__.RoleTab),
/* harmony export */   "Tab": () => (/* reexport safe */ _RoleTab__WEBPACK_IMPORTED_MODULE_130__.Tab),
/* harmony export */   "RoleTabList": () => (/* reexport safe */ _RoleTabList__WEBPACK_IMPORTED_MODULE_131__.RoleTabList),
/* harmony export */   "TabList": () => (/* reexport safe */ _RoleTabList__WEBPACK_IMPORTED_MODULE_131__.TabList),
/* harmony export */   "RoleTabPanel": () => (/* reexport safe */ _RoleTabPanel__WEBPACK_IMPORTED_MODULE_132__.RoleTabPanel),
/* harmony export */   "TabPanel": () => (/* reexport safe */ _RoleTabPanel__WEBPACK_IMPORTED_MODULE_132__.TabPanel),
/* harmony export */   "RoleTable": () => (/* reexport safe */ _RoleTable__WEBPACK_IMPORTED_MODULE_133__.RoleTable),
/* harmony export */   "Table": () => (/* reexport safe */ _RoleTable__WEBPACK_IMPORTED_MODULE_133__.Table),
/* harmony export */   "RoleTerm": () => (/* reexport safe */ _RoleTerm__WEBPACK_IMPORTED_MODULE_134__.RoleTerm),
/* harmony export */   "Term": () => (/* reexport safe */ _RoleTerm__WEBPACK_IMPORTED_MODULE_134__.Term),
/* harmony export */   "RoleTextBox": () => (/* reexport safe */ _RoleTextBox__WEBPACK_IMPORTED_MODULE_135__.RoleTextBox),
/* harmony export */   "TextBox": () => (/* reexport safe */ _RoleTextBox__WEBPACK_IMPORTED_MODULE_135__.TextBox),
/* harmony export */   "RoleTimer": () => (/* reexport safe */ _RoleTimer__WEBPACK_IMPORTED_MODULE_136__.RoleTimer),
/* harmony export */   "Timer": () => (/* reexport safe */ _RoleTimer__WEBPACK_IMPORTED_MODULE_136__.Timer),
/* harmony export */   "RoleToolBar": () => (/* reexport safe */ _RoleToolBar__WEBPACK_IMPORTED_MODULE_137__.RoleToolBar),
/* harmony export */   "ToolBar": () => (/* reexport safe */ _RoleToolBar__WEBPACK_IMPORTED_MODULE_137__.ToolBar),
/* harmony export */   "RoleToolTip": () => (/* reexport safe */ _RoleToolTip__WEBPACK_IMPORTED_MODULE_138__.RoleToolTip),
/* harmony export */   "ToolTip": () => (/* reexport safe */ _RoleToolTip__WEBPACK_IMPORTED_MODULE_138__.ToolTip),
/* harmony export */   "RoleTree": () => (/* reexport safe */ _RoleTree__WEBPACK_IMPORTED_MODULE_139__.RoleTree),
/* harmony export */   "Tree": () => (/* reexport safe */ _RoleTree__WEBPACK_IMPORTED_MODULE_139__.Tree),
/* harmony export */   "RoleTreeGrid": () => (/* reexport safe */ _RoleTreeGrid__WEBPACK_IMPORTED_MODULE_140__.RoleTreeGrid),
/* harmony export */   "TreeGrid": () => (/* reexport safe */ _RoleTreeGrid__WEBPACK_IMPORTED_MODULE_140__.TreeGrid),
/* harmony export */   "RoleTreeItem": () => (/* reexport safe */ _RoleTreeItem__WEBPACK_IMPORTED_MODULE_141__.RoleTreeItem),
/* harmony export */   "TreeItem": () => (/* reexport safe */ _RoleTreeItem__WEBPACK_IMPORTED_MODULE_141__.TreeItem),
/* harmony export */   "RoleWidget": () => (/* reexport safe */ _RoleWidget__WEBPACK_IMPORTED_MODULE_142__.RoleWidget),
/* harmony export */   "Widget": () => (/* reexport safe */ _RoleWidget__WEBPACK_IMPORTED_MODULE_142__.Widget),
/* harmony export */   "RoleWindow": () => (/* reexport safe */ _RoleWindow__WEBPACK_IMPORTED_MODULE_143__.RoleWindow)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var _AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(44);
/* harmony import */ var _AriaAtomic__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(15);
/* harmony import */ var _AriaAutoComplete__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(45);
/* harmony import */ var _AriaBusy__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(18);
/* harmony import */ var _AriaChecked__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(46);
/* harmony import */ var _AriaColCount__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(48);
/* harmony import */ var _AriaColIndex__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(50);
/* harmony import */ var _AriaColSpan__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(51);
/* harmony import */ var _AriaControls__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(19);
/* harmony import */ var _AriaCurrent__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(21);
/* harmony import */ var _AriaDescribedBy__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(23);
/* harmony import */ var _AriaDetails__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(24);
/* harmony import */ var _AriaDisabled__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(39);
/* harmony import */ var _AriaDropEffect__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(52);
/* harmony import */ var _AriaErrorMessage__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(53);
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(54);
/* harmony import */ var _AriaFlowTo__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(26);
/* harmony import */ var _AriaGrabbed__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(56);
/* harmony import */ var _AriaHasPopup__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(57);
/* harmony import */ var _AriaHidden__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(58);
/* harmony import */ var _AriaInvalid__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(59);
/* harmony import */ var _AriaKeyShortcuts__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(27);
/* harmony import */ var _AriaLabel__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(29);
/* harmony import */ var _AriaLabelledBy__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(30);
/* harmony import */ var _AriaLevel__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(60);
/* harmony import */ var _AriaLive__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(31);
/* harmony import */ var _AriaModal__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(61);
/* harmony import */ var _AriaMultiLine__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(62);
/* harmony import */ var _AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(63);
/* harmony import */ var _AriaOrientation__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(64);
/* harmony import */ var _AriaOwns__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(32);
/* harmony import */ var _AriaPlaceholder__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(65);
/* harmony import */ var _AriaPosInSet__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(66);
/* harmony import */ var _AriaPressed__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(67);
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(68);
/* harmony import */ var _AriaRelevant__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(33);
/* harmony import */ var _AriaRequired__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(69);
/* harmony import */ var _AriaRoleDescription__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(35);
/* harmony import */ var _AriaRowCount__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(70);
/* harmony import */ var _AriaRowIndex__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(71);
/* harmony import */ var _AriaRowSpan__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(72);
/* harmony import */ var _AriaSelected__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(73);
/* harmony import */ var _AriaSetSize__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(74);
/* harmony import */ var _AriaSort__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(75);
/* harmony import */ var _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(55);
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(16);
/* harmony import */ var _AriaTypeIdRef__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(25);
/* harmony import */ var _AriaTypeIdRefList__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(20);
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(49);
/* harmony import */ var _AriaTypeNumber__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(76);
/* harmony import */ var _AriaTypeString__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(28);
/* harmony import */ var _AriaTypeToken__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(22);
/* harmony import */ var _AriaTypeTokenList__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__(34);
/* harmony import */ var _AriaTypeTristate__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__(47);
/* harmony import */ var _AriaValueMax__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__(77);
/* harmony import */ var _AriaValueMin__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__(78);
/* harmony import */ var _AriaValueNow__WEBPACK_IMPORTED_MODULE_57__ = __webpack_require__(79);
/* harmony import */ var _AriaValueText__WEBPACK_IMPORTED_MODULE_58__ = __webpack_require__(80);
/* harmony import */ var _Role__WEBPACK_IMPORTED_MODULE_59__ = __webpack_require__(81);
/* harmony import */ var _RoleAlert__WEBPACK_IMPORTED_MODULE_60__ = __webpack_require__(82);
/* harmony import */ var _RoleAlertDialog__WEBPACK_IMPORTED_MODULE_61__ = __webpack_require__(202);
/* harmony import */ var _RoleApplication__WEBPACK_IMPORTED_MODULE_62__ = __webpack_require__(205);
/* harmony import */ var _RoleArticle__WEBPACK_IMPORTED_MODULE_63__ = __webpack_require__(208);
/* harmony import */ var _RoleBanner__WEBPACK_IMPORTED_MODULE_64__ = __webpack_require__(206);
/* harmony import */ var _RoleBlockQuote__WEBPACK_IMPORTED_MODULE_65__ = __webpack_require__(212);
/* harmony import */ var _RoleButton__WEBPACK_IMPORTED_MODULE_66__ = __webpack_require__(213);
/* harmony import */ var _RoleCaption__WEBPACK_IMPORTED_MODULE_67__ = __webpack_require__(217);
/* harmony import */ var _RoleCell__WEBPACK_IMPORTED_MODULE_68__ = __webpack_require__(218);
/* harmony import */ var _RoleCheckBox__WEBPACK_IMPORTED_MODULE_69__ = __webpack_require__(219);
/* harmony import */ var _RoleColumnHeader__WEBPACK_IMPORTED_MODULE_70__ = __webpack_require__(221);
/* harmony import */ var _RoleComboBox__WEBPACK_IMPORTED_MODULE_71__ = __webpack_require__(222);
/* harmony import */ var _RoleCommand__WEBPACK_IMPORTED_MODULE_72__ = __webpack_require__(214);
/* harmony import */ var _RoleComplementary__WEBPACK_IMPORTED_MODULE_73__ = __webpack_require__(224);
/* harmony import */ var _RoleComposite__WEBPACK_IMPORTED_MODULE_74__ = __webpack_require__(225);
/* harmony import */ var _RoleContentInfo__WEBPACK_IMPORTED_MODULE_75__ = __webpack_require__(210);
/* harmony import */ var _RoleDefinition__WEBPACK_IMPORTED_MODULE_76__ = __webpack_require__(226);
/* harmony import */ var _RoleDialog__WEBPACK_IMPORTED_MODULE_77__ = __webpack_require__(203);
/* harmony import */ var _RoleDirectory__WEBPACK_IMPORTED_MODULE_78__ = __webpack_require__(227);
/* harmony import */ var _RoleDocument__WEBPACK_IMPORTED_MODULE_79__ = __webpack_require__(209);
/* harmony import */ var _RoleFeed__WEBPACK_IMPORTED_MODULE_80__ = __webpack_require__(230);
/* harmony import */ var _RoleFigure__WEBPACK_IMPORTED_MODULE_81__ = __webpack_require__(231);
/* harmony import */ var _RoleForm__WEBPACK_IMPORTED_MODULE_82__ = __webpack_require__(216);
/* harmony import */ var _RoleGrid__WEBPACK_IMPORTED_MODULE_83__ = __webpack_require__(232);
/* harmony import */ var _RoleGridCell__WEBPACK_IMPORTED_MODULE_84__ = __webpack_require__(233);
/* harmony import */ var _RoleGroup__WEBPACK_IMPORTED_MODULE_85__ = __webpack_require__(235);
/* harmony import */ var _RoleHeading__WEBPACK_IMPORTED_MODULE_86__ = __webpack_require__(239);
/* harmony import */ var _RoleImg__WEBPACK_IMPORTED_MODULE_87__ = __webpack_require__(241);
/* harmony import */ var _RoleInput__WEBPACK_IMPORTED_MODULE_88__ = __webpack_require__(220);
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_89__ = __webpack_require__(207);
/* harmony import */ var _RoleLink__WEBPACK_IMPORTED_MODULE_90__ = __webpack_require__(242);
/* harmony import */ var _RoleList__WEBPACK_IMPORTED_MODULE_91__ = __webpack_require__(228);
/* harmony import */ var _RoleListBox__WEBPACK_IMPORTED_MODULE_92__ = __webpack_require__(243);
/* harmony import */ var _RoleListItem__WEBPACK_IMPORTED_MODULE_93__ = __webpack_require__(229);
/* harmony import */ var _RoleLog__WEBPACK_IMPORTED_MODULE_94__ = __webpack_require__(246);
/* harmony import */ var _RoleMain__WEBPACK_IMPORTED_MODULE_95__ = __webpack_require__(211);
/* harmony import */ var _RoleMarquee__WEBPACK_IMPORTED_MODULE_96__ = __webpack_require__(247);
/* harmony import */ var _RoleMath__WEBPACK_IMPORTED_MODULE_97__ = __webpack_require__(248);
/* harmony import */ var _RoleMenu__WEBPACK_IMPORTED_MODULE_98__ = __webpack_require__(249);
/* harmony import */ var _RoleMenuBar__WEBPACK_IMPORTED_MODULE_99__ = __webpack_require__(251);
/* harmony import */ var _RoleMenuItem__WEBPACK_IMPORTED_MODULE_100__ = __webpack_require__(250);
/* harmony import */ var _RoleMenuItemCheckBox__WEBPACK_IMPORTED_MODULE_101__ = __webpack_require__(252);
/* harmony import */ var _RoleMenuItemRadio__WEBPACK_IMPORTED_MODULE_102__ = __webpack_require__(253);
/* harmony import */ var _RoleNavigation__WEBPACK_IMPORTED_MODULE_103__ = __webpack_require__(254);
/* harmony import */ var _RoleNone__WEBPACK_IMPORTED_MODULE_104__ = __webpack_require__(255);
/* harmony import */ var _RoleNote__WEBPACK_IMPORTED_MODULE_105__ = __webpack_require__(256);
/* harmony import */ var _RoleOption__WEBPACK_IMPORTED_MODULE_106__ = __webpack_require__(244);
/* harmony import */ var _RoleParagraph__WEBPACK_IMPORTED_MODULE_107__ = __webpack_require__(257);
/* harmony import */ var _RolePresentation__WEBPACK_IMPORTED_MODULE_108__ = __webpack_require__(258);
/* harmony import */ var _RoleProgressBar__WEBPACK_IMPORTED_MODULE_109__ = __webpack_require__(259);
/* harmony import */ var _RoleRadio__WEBPACK_IMPORTED_MODULE_110__ = __webpack_require__(261);
/* harmony import */ var _RoleRadioGroup__WEBPACK_IMPORTED_MODULE_111__ = __webpack_require__(262);
/* harmony import */ var _RoleRange__WEBPACK_IMPORTED_MODULE_112__ = __webpack_require__(260);
/* harmony import */ var _RoleRegion__WEBPACK_IMPORTED_MODULE_113__ = __webpack_require__(263);
/* harmony import */ var _RoleRoleType__WEBPACK_IMPORTED_MODULE_114__ = __webpack_require__(85);
/* harmony import */ var _RoleRow__WEBPACK_IMPORTED_MODULE_115__ = __webpack_require__(234);
/* harmony import */ var _RoleRowGroup__WEBPACK_IMPORTED_MODULE_116__ = __webpack_require__(237);
/* harmony import */ var _RoleRowHeader__WEBPACK_IMPORTED_MODULE_117__ = __webpack_require__(236);
/* harmony import */ var _RoleScrollBar__WEBPACK_IMPORTED_MODULE_118__ = __webpack_require__(264);
/* harmony import */ var _RoleSearch__WEBPACK_IMPORTED_MODULE_119__ = __webpack_require__(265);
/* harmony import */ var _RoleSearchBox__WEBPACK_IMPORTED_MODULE_120__ = __webpack_require__(266);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_121__ = __webpack_require__(83);
/* harmony import */ var _RoleSectionHead__WEBPACK_IMPORTED_MODULE_122__ = __webpack_require__(240);
/* harmony import */ var _RoleSelect__WEBPACK_IMPORTED_MODULE_123__ = __webpack_require__(245);
/* harmony import */ var _RoleSeparator__WEBPACK_IMPORTED_MODULE_124__ = __webpack_require__(267);
/* harmony import */ var _RoleSlider__WEBPACK_IMPORTED_MODULE_125__ = __webpack_require__(268);
/* harmony import */ var _RoleSpinButton__WEBPACK_IMPORTED_MODULE_126__ = __webpack_require__(269);
/* harmony import */ var _RoleStatus__WEBPACK_IMPORTED_MODULE_127__ = __webpack_require__(270);
/* harmony import */ var _RoleStructure__WEBPACK_IMPORTED_MODULE_128__ = __webpack_require__(84);
/* harmony import */ var _RoleSwitch__WEBPACK_IMPORTED_MODULE_129__ = __webpack_require__(271);
/* harmony import */ var _RoleTab__WEBPACK_IMPORTED_MODULE_130__ = __webpack_require__(272);
/* harmony import */ var _RoleTabList__WEBPACK_IMPORTED_MODULE_131__ = __webpack_require__(273);
/* harmony import */ var _RoleTabPanel__WEBPACK_IMPORTED_MODULE_132__ = __webpack_require__(274);
/* harmony import */ var _RoleTable__WEBPACK_IMPORTED_MODULE_133__ = __webpack_require__(238);
/* harmony import */ var _RoleTerm__WEBPACK_IMPORTED_MODULE_134__ = __webpack_require__(275);
/* harmony import */ var _RoleTextBox__WEBPACK_IMPORTED_MODULE_135__ = __webpack_require__(223);
/* harmony import */ var _RoleTimer__WEBPACK_IMPORTED_MODULE_136__ = __webpack_require__(276);
/* harmony import */ var _RoleToolBar__WEBPACK_IMPORTED_MODULE_137__ = __webpack_require__(277);
/* harmony import */ var _RoleToolTip__WEBPACK_IMPORTED_MODULE_138__ = __webpack_require__(278);
/* harmony import */ var _RoleTree__WEBPACK_IMPORTED_MODULE_139__ = __webpack_require__(279);
/* harmony import */ var _RoleTreeGrid__WEBPACK_IMPORTED_MODULE_140__ = __webpack_require__(281);
/* harmony import */ var _RoleTreeItem__WEBPACK_IMPORTED_MODULE_141__ = __webpack_require__(280);
/* harmony import */ var _RoleWidget__WEBPACK_IMPORTED_MODULE_142__ = __webpack_require__(215);
/* harmony import */ var _RoleWindow__WEBPACK_IMPORTED_MODULE_143__ = __webpack_require__(204);
/**
 * @module ariamodule
 * @author Vyacheslav Aristov <vv.aristov@gmail.com>
 * @license MIT
 * @see https://www.w3.org/TR/wai-aria
 */


















































































































































/***/ }),
/* 44 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaActiveDescendant": () => (/* binding */ AriaActiveDescendant)
/* harmony export */ });
/* harmony import */ var _AriaTypeIdRef__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(25);


/**
 * Identifies the currently active element when DOM focus
 *  is on a composite widget, textbox, group, or application.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-activedescendant
 */
class AriaActiveDescendant extends _AriaTypeIdRef__WEBPACK_IMPORTED_MODULE_0__.AriaTypeIdRef
{
}


/***/ }),
/* 45 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaAutoComplete": () => (/* binding */ AriaAutoComplete)
/* harmony export */ });
/* harmony import */ var _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);


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
/* 46 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaChecked": () => (/* binding */ AriaChecked)
/* harmony export */ });
/* harmony import */ var _AriaTypeTristate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(47);


/**
 * Indicates the current "checked" state of checkboxes,
 *  radio buttons, and other widgets.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-checked
 */
class AriaChecked extends _AriaTypeTristate__WEBPACK_IMPORTED_MODULE_0__.AriaTypeTristate
{
}


/***/ }),
/* 47 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeTristate": () => (/* binding */ AriaTypeTristate)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);


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
/* 48 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaColCount": () => (/* binding */ AriaColCount)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(49);


/**
 * Defines the total number of columns in a table, grid, or treegrid.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-colcount
 */
class AriaColCount extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeInteger": () => (/* binding */ AriaTypeInteger)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);


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
/* 50 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaColIndex": () => (/* binding */ AriaColIndex)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(49);


/**
 * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-colindex
 */
class AriaColIndex extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaColSpan": () => (/* binding */ AriaColSpan)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(49);


/**
 * Defines the number of columns spanned by a cell
 *  or gridcell within a table, grid, or treegrid.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-colspan
 */
class AriaColSpan extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 52 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaDropEffect": () => (/* binding */ AriaDropEffect)
/* harmony export */ });
/* harmony import */ var _AriaTypeTokenList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(34);


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
/* 53 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaErrorMessage": () => (/* binding */ AriaErrorMessage)
/* harmony export */ });
/* harmony import */ var _AriaTypeIdRef__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(25);


/**
 * Identifies the element that provides an error message for the object.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-errormessage
 */
class AriaErrorMessage extends _AriaTypeIdRef__WEBPACK_IMPORTED_MODULE_0__.AriaTypeIdRef
{
}


/***/ }),
/* 54 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaExpanded": () => (/* binding */ AriaExpanded)
/* harmony export */ });
/* harmony import */ var _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(55);


/**
 * Indicates whether the element, or another grouping
 *  element it controls, is currently expanded or collapsed.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-expanded
 */
class AriaExpanded extends _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_0__.AriaTypeApplicable
{
}


/***/ }),
/* 55 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeApplicable": () => (/* binding */ AriaTypeApplicable)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);


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
/* 56 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaGrabbed": () => (/* binding */ AriaGrabbed)
/* harmony export */ });
/* harmony import */ var _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(55);


/**
 * Indicates an element's "grabbed" state in a drag-and-drop operation.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-grabbed
 * @deprecated in ARIA 1.1
 */
class AriaGrabbed extends _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_0__.AriaTypeApplicable
{
}


/***/ }),
/* 57 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaHasPopup": () => (/* binding */ AriaHasPopup)
/* harmony export */ });
/* harmony import */ var _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);


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
/* 58 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaHidden": () => (/* binding */ AriaHidden)
/* harmony export */ });
/* harmony import */ var _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(55);


/**
 * Indicates whether the element is exposed to an accessibility API.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-hidden
 */
class AriaHidden extends _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_0__.AriaTypeApplicable
{
}


/***/ }),
/* 59 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaInvalid": () => (/* binding */ AriaInvalid)
/* harmony export */ });
/* harmony import */ var _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);


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
/* 60 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaLevel": () => (/* binding */ AriaLevel)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(49);


/**
 * Defines the hierarchical level of an element within a structure.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-level
 */
class AriaLevel extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 61 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaModal": () => (/* binding */ AriaModal)
/* harmony export */ });
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);


/**
 * Indicates whether an element is modal when displayed.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-modal
 */
class AriaModal extends _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__.AriaTypeBoolean
{
}


/***/ }),
/* 62 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaMultiLine": () => (/* binding */ AriaMultiLine)
/* harmony export */ });
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);


/**
 * Indicates whether a text box accepts multiple lines of input or only a single line.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-multiline
 */
class AriaMultiLine extends _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__.AriaTypeBoolean
{
}


/***/ }),
/* 63 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaMultiSelectable": () => (/* binding */ AriaMultiSelectable)
/* harmony export */ });
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);


/**
 * Indicates that the user may select more than one item
 *  from the current selectable descendants.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-multiselectable
 */
class AriaMultiSelectable extends _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__.AriaTypeBoolean
{
}


/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaOrientation": () => (/* binding */ AriaOrientation)
/* harmony export */ });
/* harmony import */ var _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);


/**
 * Indicates whether the element's orientation
 *  is horizontal, vertical, or unknown/ambiguous.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-orientation
 */
class AriaOrientation extends _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__.AriaTypeToken
{
}


/***/ }),
/* 65 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaPlaceholder": () => (/* binding */ AriaPlaceholder)
/* harmony export */ });
/* harmony import */ var _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);


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
/* 66 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaPosInSet": () => (/* binding */ AriaPosInSet)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(49);


/**
 * Defines an element's number or position in the current set of listitems
 *  or treeitems. Not required if all elements in the set are present in the DOM.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-posinset
 */
class AriaPosInSet extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 67 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaPressed": () => (/* binding */ AriaPressed)
/* harmony export */ });
/* harmony import */ var _AriaTypeTristate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(47);


/**
 * Indicates the current "pressed" state of toggle buttons.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-pressed
 */
class AriaPressed extends _AriaTypeTristate__WEBPACK_IMPORTED_MODULE_0__.AriaTypeTristate
{
}


/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaReadOnly": () => (/* binding */ AriaReadOnly)
/* harmony export */ });
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);


/**
 * Indicates that the element is not editable, but is otherwise operable.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-readonly
 */
class AriaReadOnly extends _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__.AriaTypeBoolean
{
}


/***/ }),
/* 69 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaRequired": () => (/* binding */ AriaRequired)
/* harmony export */ });
/* harmony import */ var _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(16);


/**
 * Indicates that user input is required on the element before a form may be submitted.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-required
 */
class AriaRequired extends _AriaTypeBoolean__WEBPACK_IMPORTED_MODULE_0__.AriaTypeBoolean
{
}


/***/ }),
/* 70 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaRowCount": () => (/* binding */ AriaRowCount)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(49);


/**
 * Defines the total number of rows in a table, grid, or treegrid.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-rowcount
 */
class AriaRowCount extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 71 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaRowIndex": () => (/* binding */ AriaRowIndex)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(49);


/**
 * Defines an element's row index or position with respect
 *  to the total number of rows within a table, grid, or treegrid.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-rowindex
 */
class AriaRowIndex extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 72 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaRowSpan": () => (/* binding */ AriaRowSpan)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(49);


/**
 * Defines the number of rows spanned by a cell
 *  or gridcell within a table, grid, or treegrid.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-rowspan
 */
class AriaRowSpan extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 73 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaSelected": () => (/* binding */ AriaSelected)
/* harmony export */ });
/* harmony import */ var _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(55);


/**
 * Indicates the current "selected" state of various widgets.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-selected
 */
class AriaSelected extends _AriaTypeApplicable__WEBPACK_IMPORTED_MODULE_0__.AriaTypeApplicable
{
}


/***/ }),
/* 74 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaSetSize": () => (/* binding */ AriaSetSize)
/* harmony export */ });
/* harmony import */ var _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(49);


/**
 * Defines the number of items in the current set of listitems or treeitems.
 *  Not required if all elements in the set are present in the DOM.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-setsize
 */
class AriaSetSize extends _AriaTypeInteger__WEBPACK_IMPORTED_MODULE_0__.AriaTypeInteger
{
}


/***/ }),
/* 75 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaSort": () => (/* binding */ AriaSort)
/* harmony export */ });
/* harmony import */ var _AriaTypeToken__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(22);


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
/* 76 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaTypeNumber": () => (/* binding */ AriaTypeNumber)
/* harmony export */ });
/* harmony import */ var _AriaType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);


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
/* 77 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaValueMax": () => (/* binding */ AriaValueMax)
/* harmony export */ });
/* harmony import */ var _AriaTypeNumber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(76);


/**
 * Defines the maximum allowed value for a range widget.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-valuemax
 */
class AriaValueMax extends _AriaTypeNumber__WEBPACK_IMPORTED_MODULE_0__.AriaTypeNumber
{
}


/***/ }),
/* 78 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaValueMin": () => (/* binding */ AriaValueMin)
/* harmony export */ });
/* harmony import */ var _AriaTypeNumber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(76);


/**
 * Defines the minimum allowed value for a range widget.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-valuemin
 */
class AriaValueMin extends _AriaTypeNumber__WEBPACK_IMPORTED_MODULE_0__.AriaTypeNumber
{
}


/***/ }),
/* 79 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaValueNow": () => (/* binding */ AriaValueNow)
/* harmony export */ });
/* harmony import */ var _AriaTypeNumber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(76);


/**
 * Defines the current value for a range widget.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-valuenow
 */
class AriaValueNow extends _AriaTypeNumber__WEBPACK_IMPORTED_MODULE_0__.AriaTypeNumber
{
}


/***/ }),
/* 80 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AriaValueText": () => (/* binding */ AriaValueText)
/* harmony export */ });
/* harmony import */ var _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(28);


/**
 * Defines the human readable text alternative of aria-valuenow for a range widget.
 * @see https://www.w3.org/TR/wai-aria-1.1/#aria-valuetext
 */
class AriaValueText extends _AriaTypeString__WEBPACK_IMPORTED_MODULE_0__.AriaTypeString
{
}


/***/ }),
/* 81 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Role": () => (/* binding */ Role)
/* harmony export */ });
/* harmony import */ var _Dataset__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(36);
/* harmony import */ var _DomElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9);
/* harmony import */ var _Style__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(37);
/* harmony import */ var _TabIndex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(38);





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
/* 82 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleAlert": () => (/* binding */ RoleAlert),
/* harmony export */   "Alert": () => (/* binding */ RoleAlert)
/* harmony export */ });
/* harmony import */ var _AriaAtomic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _AriaLive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(31);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(83);




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
/* 83 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSection": () => (/* binding */ RoleSection),
/* harmony export */   "Section": () => (/* binding */ RoleSection)
/* harmony export */ });
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54);
/* harmony import */ var _RoleStructure__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(84);



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
/* 84 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleStructure": () => (/* binding */ RoleStructure),
/* harmony export */   "Structure": () => (/* binding */ RoleStructure)
/* harmony export */ });
/* harmony import */ var _RoleRoleType__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(85);


/**
 * A document structural element.
 * @see https://www.w3.org/TR/wai-aria-1.1/#structure
 * @abstract
 */
class RoleStructure extends _RoleRoleType__WEBPACK_IMPORTED_MODULE_0__.RoleRoleType
{
}




/***/ }),
/* 85 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleRoleType": () => (/* binding */ RoleRoleType),
/* harmony export */   "RoleType": () => (/* binding */ RoleRoleType)
/* harmony export */ });
/* harmony import */ var _Label__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(86);
/* harmony import */ var _AriaAtomic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(15);
/* harmony import */ var _AriaBusy__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(18);
/* harmony import */ var _AriaControls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(19);
/* harmony import */ var _AriaCurrent__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(21);
/* harmony import */ var _AriaDescribedBy__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(23);
/* harmony import */ var _AriaDetails__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(24);
/* harmony import */ var _AriaDisabled__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(39);
/* harmony import */ var _AriaDropEffect__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(52);
/* harmony import */ var _AriaErrorMessage__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(53);
/* harmony import */ var _AriaFlowTo__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(26);
/* harmony import */ var _AriaGrabbed__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(56);
/* harmony import */ var _AriaHasPopup__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(57);
/* harmony import */ var _AriaHidden__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(58);
/* harmony import */ var _AriaInvalid__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(59);
/* harmony import */ var _AriaKeyShortcuts__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(27);
/* harmony import */ var _AriaLabel__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(29);
/* harmony import */ var _AriaLabelledBy__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(30);
/* harmony import */ var _AriaLive__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(31);
/* harmony import */ var _AriaOwns__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(32);
/* harmony import */ var _AriaRelevant__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(33);
/* harmony import */ var _AriaRoleDescription__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(35);
/* harmony import */ var _Role__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(81);
























/**
 * The base role from which all other roles in this taxonomy inherit.
 * @see https://www.w3.org/TR/wai-aria-1.1/#roletype
 * @abstract
 */
class RoleRoleType extends _Role__WEBPACK_IMPORTED_MODULE_22__.Role
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
    return this.doc.find(object, elem => elem.getAttr(_AriaOwns__WEBPACK_IMPORTED_MODULE_19__.AriaOwns).includes(this))
  }

  /**
   * @param {boolean} atomic
   */
  set atomic(atomic) {
    this.setAttr(_AriaAtomic__WEBPACK_IMPORTED_MODULE_1__.AriaAtomic, atomic)
  }

  /**
   * @returns {boolean}
   */
  get atomic() {
    return this.getAttr(_AriaAtomic__WEBPACK_IMPORTED_MODULE_1__.AriaAtomic)
  }

  /**
   * @param {boolean} busy
   */
  set busy(busy) {
    this.setAttr(_AriaBusy__WEBPACK_IMPORTED_MODULE_2__.AriaBusy, busy)
  }

  /**
   * @returns {boolean}
   */
  get busy() {
    return this.getAttr(_AriaBusy__WEBPACK_IMPORTED_MODULE_2__.AriaBusy)
  }

  /**
   * @param {*} controls
   */
  set controls(controls) {
    this.setAttr(_AriaControls__WEBPACK_IMPORTED_MODULE_3__.AriaControls, controls)
  }

  /**
   * @returns {*[]}
   */
  get controls() {
    return this.getAttr(_AriaControls__WEBPACK_IMPORTED_MODULE_3__.AriaControls)
  }

  /**
   * @param {string} current
   */
  set current(current) {
    this.setAttr(_AriaCurrent__WEBPACK_IMPORTED_MODULE_4__.AriaCurrent, current)
  }

  /**
   * @returns {string}
   */
  get current() {
    return this.getAttr(_AriaCurrent__WEBPACK_IMPORTED_MODULE_4__.AriaCurrent)
  }

  /**
   * @param {*} describedBy
   */
  set describedBy(describedBy) {
    this.setAttr(_AriaDescribedBy__WEBPACK_IMPORTED_MODULE_5__.AriaDescribedBy, describedBy)
  }

  /**
   * @returns {*[]}
   */
  get describedBy() {
    return this.getAttr(_AriaDescribedBy__WEBPACK_IMPORTED_MODULE_5__.AriaDescribedBy)
  }

  /**
   * @param {*} details
   */
  set details(details) {
    this.setAttr(_AriaDetails__WEBPACK_IMPORTED_MODULE_6__.AriaDetails, details)
  }

  /**
   * @returns {DomElem|*|null}
   */
  get details() {
    return this.getAttr(_AriaDetails__WEBPACK_IMPORTED_MODULE_6__.AriaDetails)
  }

  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    this.setAttr(_AriaDisabled__WEBPACK_IMPORTED_MODULE_7__.AriaDisabled, disabled)
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return this.getAttr(_AriaDisabled__WEBPACK_IMPORTED_MODULE_7__.AriaDisabled)
  }

  /**
   * @param {array|string|null} dropEffect
   * @deprecated
   */
  set dropEffect(dropEffect) {
    this.setAttr(_AriaDropEffect__WEBPACK_IMPORTED_MODULE_8__.AriaDropEffect, dropEffect)
  }

  /**
   * @returns {array|string|null}
   * @deprecated
   */
  get dropEffect() {
    return this.getAttr(_AriaDropEffect__WEBPACK_IMPORTED_MODULE_8__.AriaDropEffect)
  }

  /**
   * @param {*} errorMessage
   */
  set errorMessage(errorMessage) {
    this.setAttr(_AriaErrorMessage__WEBPACK_IMPORTED_MODULE_9__.AriaErrorMessage, errorMessage)
  }

  /**
   * @returns {DomElem|*|null}
   */
  get errorMessage() {
    return this.getAttr(_AriaErrorMessage__WEBPACK_IMPORTED_MODULE_9__.AriaErrorMessage)
  }

  /**
   * @param {*} flowTo
   */
  set flowTo(flowTo) {
    this.setAttr(_AriaFlowTo__WEBPACK_IMPORTED_MODULE_10__.AriaFlowTo, flowTo)
  }

  /**
   * @returns {DomElem|*|null}
   */
  get flowTo() {
    return this.getAttr(_AriaFlowTo__WEBPACK_IMPORTED_MODULE_10__.AriaFlowTo)
  }

  /**
   * @param {boolean|undefined} grabbed
   * @deprecated
   */
  set grabbed(grabbed) {
    this.setAttr(_AriaGrabbed__WEBPACK_IMPORTED_MODULE_11__.AriaGrabbed, grabbed)
  }

  /**
   * @returns {boolean|undefined}
   * @deprecated
   */
  get grabbed() {
    return this.getAttr(_AriaGrabbed__WEBPACK_IMPORTED_MODULE_11__.AriaGrabbed)
  }

  /**
   * @param {string} hasPopup
   */
  set hasPopup(hasPopup) {
    this.setAttr(_AriaHasPopup__WEBPACK_IMPORTED_MODULE_12__.AriaHasPopup, hasPopup)
  }

  /**
   * @returns {string}
   */
  get hasPopup() {
    return this.getAttr(_AriaHasPopup__WEBPACK_IMPORTED_MODULE_12__.AriaHasPopup)
  }

  /**
   * @param {boolean|undefined} hidden
   */
  set hidden(hidden) {
    this.setAttr(_AriaHidden__WEBPACK_IMPORTED_MODULE_13__.AriaHidden, hidden)
  }

  /**
   * @returns {boolean|undefined}
   */
  get hidden() {
    return this.getAttr(_AriaHidden__WEBPACK_IMPORTED_MODULE_13__.AriaHidden)
  }

  /**
   * @param {boolean|string} invalid
   */
  set invalid(invalid) {
    this.setAttr(_AriaInvalid__WEBPACK_IMPORTED_MODULE_14__.AriaInvalid, invalid)
  }

  /**
   * @returns {boolean|string}
   */
  get invalid() {
    return this.getAttr(_AriaInvalid__WEBPACK_IMPORTED_MODULE_14__.AriaInvalid)
  }

  /**
   * @param {string} keyShortcuts
   */
  set keyShortcuts(keyShortcuts) {
    this.setAttr(_AriaKeyShortcuts__WEBPACK_IMPORTED_MODULE_15__.AriaKeyShortcuts, keyShortcuts)
  }

  /**
   * @returns {string}
   */
  get keyShortcuts() {
    return this.getAttr(_AriaKeyShortcuts__WEBPACK_IMPORTED_MODULE_15__.AriaKeyShortcuts)
  }

  /**
   * @param {string|DomElem|array|*} labels
   */
  set labels(labels) {
    if(!Array.isArray(labels)) {
      labels = [labels]
    }
    const labelledBy = []
    let label
    for(let i = 0; i < 2; i++) {
      label = labels[i]
      if(label) {
        label = typeof label === 'string'? new _Label__WEBPACK_IMPORTED_MODULE_0__.Label(label) : label
        this[i? 'append' : 'prepend'](label)
        labelledBy.push(label)
      }
    }
    this.setAttr(_AriaLabelledBy__WEBPACK_IMPORTED_MODULE_17__.AriaLabelledBy, labelledBy)
  }

  /**
   * @returns {DomElem[]}
   */
  get labels() {
    return this.getAttr(_AriaLabelledBy__WEBPACK_IMPORTED_MODULE_17__.AriaLabelledBy)
  }

  /**
   * @param {string} label
   */
  set label(label) {
    this.setAttr(_AriaLabel__WEBPACK_IMPORTED_MODULE_16__.AriaLabel, label)
  }

  /**
   * @returns {string}
   */
  get label() {
    return this.getAttr(_AriaLabel__WEBPACK_IMPORTED_MODULE_16__.AriaLabel)
  }

  /**
   * @param {*} labelledBy {*[]}
   */
  set labelledBy(labelledBy) {
    this.setAttr(_AriaLabelledBy__WEBPACK_IMPORTED_MODULE_17__.AriaLabelledBy, labelledBy)
  }

  /**
   * @returns {*[]}
   */
  get labelledBy() {
    return this.getAttr(_AriaLabelledBy__WEBPACK_IMPORTED_MODULE_17__.AriaLabelledBy)
  }

  /**
   * @param {string} live
   */
  set live(live) {
    this.setAttr(_AriaLive__WEBPACK_IMPORTED_MODULE_18__.AriaLive, live)
  }

  /**
   * @returns {string}
   */
  get live() {
    return this.getAttr(_AriaLive__WEBPACK_IMPORTED_MODULE_18__.AriaLive)
  }

  /**
   * @param {DomNode[]|*} owns
   */
  set owns(owns) {
    this.setAttr(_AriaOwns__WEBPACK_IMPORTED_MODULE_19__.AriaOwns, owns)
  }

  /**
   * @returns {DomNode[]|*}
   */
  get owns() {
    return this.getAttr(_AriaOwns__WEBPACK_IMPORTED_MODULE_19__.AriaOwns)
  }

  /**
   * @param {string[]} relevant
   */
  set relevant(relevant) {
    this.setAttr(_AriaRelevant__WEBPACK_IMPORTED_MODULE_20__.AriaRelevant, relevant)
  }

  /**
   * @returns {string[]}
   */
  get relevant() {
    return this.getAttr(_AriaRelevant__WEBPACK_IMPORTED_MODULE_20__.AriaRelevant)
  }

  /**
   * @param {string} roleDescription
   */
  set roleDescription(roleDescription) {
    this.setAttr(_AriaRoleDescription__WEBPACK_IMPORTED_MODULE_21__.AriaRoleDescription, roleDescription)
  }

  /**
   * @returns {string}
   */
  get roleDescription() {
    return this.getAttr(_AriaRoleDescription__WEBPACK_IMPORTED_MODULE_21__.AriaRoleDescription)
  }
}




/***/ }),
/* 86 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Label": () => (/* binding */ Label)
/* harmony export */ });
/* harmony import */ var _lib_htmlmodule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(87);
/* harmony import */ var _Label_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(201);



// BoxLabel

class Label extends _lib_htmlmodule__WEBPACK_IMPORTED_MODULE_0__.HtmlDiv
{
}


/***/ }),
/* 87 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
/* harmony import */ var _HtmlA__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(88);
/* harmony import */ var _HtmlAbbr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(90);
/* harmony import */ var _HtmlAddress__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(91);
/* harmony import */ var _HtmlArea__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(92);
/* harmony import */ var _HtmlArticle__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(93);
/* harmony import */ var _HtmlAside__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(94);
/* harmony import */ var _HtmlAudio__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(95);
/* harmony import */ var _HtmlB__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(97);
/* harmony import */ var _HtmlBase__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(98);
/* harmony import */ var _HtmlBdi__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(99);
/* harmony import */ var _HtmlBdo__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(100);
/* harmony import */ var _HtmlBlockQuote__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(101);
/* harmony import */ var _HtmlBody__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(13);
/* harmony import */ var _HtmlBr__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(102);
/* harmony import */ var _HtmlButton__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(103);
/* harmony import */ var _HtmlCanvas__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(106);
/* harmony import */ var _HtmlCaption__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(107);
/* harmony import */ var _HtmlCite__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(108);
/* harmony import */ var _HtmlCode__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(109);
/* harmony import */ var _HtmlCol__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(110);
/* harmony import */ var _HtmlColGroup__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(111);
/* harmony import */ var _HtmlData__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(112);
/* harmony import */ var _HtmlDataList__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(113);
/* harmony import */ var _HtmlDd__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(115);
/* harmony import */ var _HtmlDel__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(116);
/* harmony import */ var _HtmlDetails__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(118);
/* harmony import */ var _HtmlDfn__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(119);
/* harmony import */ var _HtmlDialog__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(120);
/* harmony import */ var _HtmlDiv__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(121);
/* harmony import */ var _HtmlDl__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(122);
/* harmony import */ var _HtmlDt__WEBPACK_IMPORTED_MODULE_30__ = __webpack_require__(123);
/* harmony import */ var _HtmlEm__WEBPACK_IMPORTED_MODULE_31__ = __webpack_require__(124);
/* harmony import */ var _HtmlEmbed__WEBPACK_IMPORTED_MODULE_32__ = __webpack_require__(125);
/* harmony import */ var _HtmlFieldSet__WEBPACK_IMPORTED_MODULE_33__ = __webpack_require__(126);
/* harmony import */ var _HtmlFigCaption__WEBPACK_IMPORTED_MODULE_34__ = __webpack_require__(127);
/* harmony import */ var _HtmlFigure__WEBPACK_IMPORTED_MODULE_35__ = __webpack_require__(128);
/* harmony import */ var _HtmlFooter__WEBPACK_IMPORTED_MODULE_36__ = __webpack_require__(129);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_37__ = __webpack_require__(104);
/* harmony import */ var _HtmlH1__WEBPACK_IMPORTED_MODULE_38__ = __webpack_require__(130);
/* harmony import */ var _HtmlH2__WEBPACK_IMPORTED_MODULE_39__ = __webpack_require__(131);
/* harmony import */ var _HtmlH3__WEBPACK_IMPORTED_MODULE_40__ = __webpack_require__(132);
/* harmony import */ var _HtmlH4__WEBPACK_IMPORTED_MODULE_41__ = __webpack_require__(133);
/* harmony import */ var _HtmlH5__WEBPACK_IMPORTED_MODULE_42__ = __webpack_require__(134);
/* harmony import */ var _HtmlH6__WEBPACK_IMPORTED_MODULE_43__ = __webpack_require__(135);
/* harmony import */ var _HtmlHGroup__WEBPACK_IMPORTED_MODULE_44__ = __webpack_require__(136);
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_45__ = __webpack_require__(14);
/* harmony import */ var _HtmlHyperlink__WEBPACK_IMPORTED_MODULE_46__ = __webpack_require__(89);
/* harmony import */ var _HtmlMedia__WEBPACK_IMPORTED_MODULE_47__ = __webpack_require__(96);
/* harmony import */ var _HtmlMod__WEBPACK_IMPORTED_MODULE_48__ = __webpack_require__(117);
/* harmony import */ var _HtmlObject__WEBPACK_IMPORTED_MODULE_49__ = __webpack_require__(137);
/* harmony import */ var _HtmlTableCell__WEBPACK_IMPORTED_MODULE_50__ = __webpack_require__(138);
/* harmony import */ var _HtmlHead__WEBPACK_IMPORTED_MODULE_51__ = __webpack_require__(40);
/* harmony import */ var _HtmlHeader__WEBPACK_IMPORTED_MODULE_52__ = __webpack_require__(139);
/* harmony import */ var _HtmlHr__WEBPACK_IMPORTED_MODULE_53__ = __webpack_require__(140);
/* harmony import */ var _HtmlHtml__WEBPACK_IMPORTED_MODULE_54__ = __webpack_require__(41);
/* harmony import */ var _HtmlI__WEBPACK_IMPORTED_MODULE_55__ = __webpack_require__(141);
/* harmony import */ var _HtmlIFrame__WEBPACK_IMPORTED_MODULE_56__ = __webpack_require__(142);
/* harmony import */ var _HtmlImg__WEBPACK_IMPORTED_MODULE_57__ = __webpack_require__(143);
/* harmony import */ var _HtmlInput__WEBPACK_IMPORTED_MODULE_58__ = __webpack_require__(144);
/* harmony import */ var _HtmlIns__WEBPACK_IMPORTED_MODULE_59__ = __webpack_require__(145);
/* harmony import */ var _HtmlKbd__WEBPACK_IMPORTED_MODULE_60__ = __webpack_require__(146);
/* harmony import */ var _HtmlLabel__WEBPACK_IMPORTED_MODULE_61__ = __webpack_require__(105);
/* harmony import */ var _HtmlLegend__WEBPACK_IMPORTED_MODULE_62__ = __webpack_require__(147);
/* harmony import */ var _HtmlLi__WEBPACK_IMPORTED_MODULE_63__ = __webpack_require__(148);
/* harmony import */ var _HtmlLink__WEBPACK_IMPORTED_MODULE_64__ = __webpack_require__(149);
/* harmony import */ var _HtmlMain__WEBPACK_IMPORTED_MODULE_65__ = __webpack_require__(150);
/* harmony import */ var _HtmlMap__WEBPACK_IMPORTED_MODULE_66__ = __webpack_require__(151);
/* harmony import */ var _HtmlMark__WEBPACK_IMPORTED_MODULE_67__ = __webpack_require__(152);
/* harmony import */ var _HtmlMenu__WEBPACK_IMPORTED_MODULE_68__ = __webpack_require__(153);
/* harmony import */ var _HtmlMeta__WEBPACK_IMPORTED_MODULE_69__ = __webpack_require__(154);
/* harmony import */ var _HtmlMeter__WEBPACK_IMPORTED_MODULE_70__ = __webpack_require__(155);
/* harmony import */ var _HtmlNav__WEBPACK_IMPORTED_MODULE_71__ = __webpack_require__(156);
/* harmony import */ var _HtmlNoScript__WEBPACK_IMPORTED_MODULE_72__ = __webpack_require__(157);
/* harmony import */ var _HtmlOl__WEBPACK_IMPORTED_MODULE_73__ = __webpack_require__(158);
/* harmony import */ var _HtmlOptGroup__WEBPACK_IMPORTED_MODULE_74__ = __webpack_require__(159);
/* harmony import */ var _HtmlOption__WEBPACK_IMPORTED_MODULE_75__ = __webpack_require__(114);
/* harmony import */ var _HtmlOutput__WEBPACK_IMPORTED_MODULE_76__ = __webpack_require__(160);
/* harmony import */ var _HtmlP__WEBPACK_IMPORTED_MODULE_77__ = __webpack_require__(161);
/* harmony import */ var _HtmlParam__WEBPACK_IMPORTED_MODULE_78__ = __webpack_require__(162);
/* harmony import */ var _HtmlPicture__WEBPACK_IMPORTED_MODULE_79__ = __webpack_require__(163);
/* harmony import */ var _HtmlPre__WEBPACK_IMPORTED_MODULE_80__ = __webpack_require__(164);
/* harmony import */ var _HtmlProgress__WEBPACK_IMPORTED_MODULE_81__ = __webpack_require__(165);
/* harmony import */ var _HtmlQ__WEBPACK_IMPORTED_MODULE_82__ = __webpack_require__(166);
/* harmony import */ var _HtmlRp__WEBPACK_IMPORTED_MODULE_83__ = __webpack_require__(167);
/* harmony import */ var _HtmlRt__WEBPACK_IMPORTED_MODULE_84__ = __webpack_require__(168);
/* harmony import */ var _HtmlRuby__WEBPACK_IMPORTED_MODULE_85__ = __webpack_require__(169);
/* harmony import */ var _HtmlS__WEBPACK_IMPORTED_MODULE_86__ = __webpack_require__(170);
/* harmony import */ var _HtmlSamp__WEBPACK_IMPORTED_MODULE_87__ = __webpack_require__(171);
/* harmony import */ var _HtmlScript__WEBPACK_IMPORTED_MODULE_88__ = __webpack_require__(172);
/* harmony import */ var _HtmlSection__WEBPACK_IMPORTED_MODULE_89__ = __webpack_require__(173);
/* harmony import */ var _HtmlSelect__WEBPACK_IMPORTED_MODULE_90__ = __webpack_require__(174);
/* harmony import */ var _HtmlSmall__WEBPACK_IMPORTED_MODULE_91__ = __webpack_require__(175);
/* harmony import */ var _HtmlSource__WEBPACK_IMPORTED_MODULE_92__ = __webpack_require__(176);
/* harmony import */ var _HtmlSpan__WEBPACK_IMPORTED_MODULE_93__ = __webpack_require__(177);
/* harmony import */ var _HtmlStrong__WEBPACK_IMPORTED_MODULE_94__ = __webpack_require__(178);
/* harmony import */ var _HtmlStyle__WEBPACK_IMPORTED_MODULE_95__ = __webpack_require__(179);
/* harmony import */ var _HtmlSub__WEBPACK_IMPORTED_MODULE_96__ = __webpack_require__(180);
/* harmony import */ var _HtmlSummary__WEBPACK_IMPORTED_MODULE_97__ = __webpack_require__(181);
/* harmony import */ var _HtmlSup__WEBPACK_IMPORTED_MODULE_98__ = __webpack_require__(182);
/* harmony import */ var _HtmlTBody__WEBPACK_IMPORTED_MODULE_99__ = __webpack_require__(183);
/* harmony import */ var _HtmlTFoot__WEBPACK_IMPORTED_MODULE_100__ = __webpack_require__(187);
/* harmony import */ var _HtmlTHead__WEBPACK_IMPORTED_MODULE_101__ = __webpack_require__(188);
/* harmony import */ var _HtmlTable__WEBPACK_IMPORTED_MODULE_102__ = __webpack_require__(189);
/* harmony import */ var _HtmlTd__WEBPACK_IMPORTED_MODULE_103__ = __webpack_require__(185);
/* harmony import */ var _HtmlTemplate__WEBPACK_IMPORTED_MODULE_104__ = __webpack_require__(190);
/* harmony import */ var _HtmlTextArea__WEBPACK_IMPORTED_MODULE_105__ = __webpack_require__(191);
/* harmony import */ var _HtmlTh__WEBPACK_IMPORTED_MODULE_106__ = __webpack_require__(186);
/* harmony import */ var _HtmlTime__WEBPACK_IMPORTED_MODULE_107__ = __webpack_require__(192);
/* harmony import */ var _HtmlTitle__WEBPACK_IMPORTED_MODULE_108__ = __webpack_require__(193);
/* harmony import */ var _HtmlTr__WEBPACK_IMPORTED_MODULE_109__ = __webpack_require__(184);
/* harmony import */ var _HtmlTrack__WEBPACK_IMPORTED_MODULE_110__ = __webpack_require__(194);
/* harmony import */ var _HtmlU__WEBPACK_IMPORTED_MODULE_111__ = __webpack_require__(195);
/* harmony import */ var _HtmlUl__WEBPACK_IMPORTED_MODULE_112__ = __webpack_require__(196);
/* harmony import */ var _HtmlVar__WEBPACK_IMPORTED_MODULE_113__ = __webpack_require__(197);
/* harmony import */ var _HtmlVideo__WEBPACK_IMPORTED_MODULE_114__ = __webpack_require__(198);
/* harmony import */ var _HtmlWbr__WEBPACK_IMPORTED_MODULE_115__ = __webpack_require__(199);
/* harmony import */ var _Win__WEBPACK_IMPORTED_MODULE_116__ = __webpack_require__(200);
/**
 * @module htmlmodule
 * @author Vyacheslav Aristov <vv.aristov@gmail.com>
 * @license MIT
 * @see {@link https://www.w3.org/TR/html}
 * @see {@link https://html.spec.whatwg.org}
 */























































































































/***/ }),
/* 88 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlA": () => (/* binding */ HtmlA)
/* harmony export */ });
/* harmony import */ var _HtmlHyperlink__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(89);


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
/* 89 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlHyperlink": () => (/* binding */ HtmlHyperlink)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 90 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlAbbr": () => (/* binding */ HtmlAbbr)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-abbr-element
 */
class HtmlAbbr extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 91 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlAddress": () => (/* binding */ HtmlAddress)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-address-element
 */
class HtmlAddress extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 92 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlArea": () => (/* binding */ HtmlArea)
/* harmony export */ });
/* harmony import */ var _HtmlHyperlink__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(89);


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
/* 93 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlArticle": () => (/* binding */ HtmlArticle)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-article-element
 */
class HtmlArticle extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 94 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlAside": () => (/* binding */ HtmlAside)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-aside-element
 */
class HtmlAside extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 95 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlAudio": () => (/* binding */ HtmlAudio)
/* harmony export */ });
/* harmony import */ var _HtmlMedia__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96);


/**
 * @see https://www.w3.org/TR/html/single-page.html#dom-htmlaudioelement-audio
 */
class HtmlAudio extends _HtmlMedia__WEBPACK_IMPORTED_MODULE_0__.HtmlMedia
{
}


/***/ }),
/* 96 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlMedia": () => (/* binding */ HtmlMedia)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 97 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlB": () => (/* binding */ HtmlB)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-b-element
 */
class HtmlB extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 98 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlBase": () => (/* binding */ HtmlBase)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 99 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlBdi": () => (/* binding */ HtmlBdi)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-bdi-element
 */
class HtmlBdi extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 100 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlBdo": () => (/* binding */ HtmlBdo)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-bdo-element
 */
class HtmlBdo extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 101 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlBlockQuote": () => (/* binding */ HtmlBlockQuote)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 102 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlBr": () => (/* binding */ HtmlBr)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-br-element
 */
class HtmlBr extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 103 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlButton": () => (/* binding */ HtmlButton)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(104);
/* harmony import */ var _HtmlLabel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(105);




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
/* 104 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlForm": () => (/* binding */ HtmlForm)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 105 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlLabel": () => (/* binding */ HtmlLabel)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(104);



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
/* 106 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlCanvas": () => (/* binding */ HtmlCanvas)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 107 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlCaption": () => (/* binding */ HtmlCaption)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-caption-element
 */
class HtmlCaption extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 108 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlCite": () => (/* binding */ HtmlCite)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-cite-element
 */
class HtmlCite extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 109 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlCode": () => (/* binding */ HtmlCode)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-code-element
 */
class HtmlCode extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 110 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlCol": () => (/* binding */ HtmlCol)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 111 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlColGroup": () => (/* binding */ HtmlColGroup)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 112 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlData": () => (/* binding */ HtmlData)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 113 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDataList": () => (/* binding */ HtmlDataList)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _HtmlOption__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(114);



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
/* 114 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlOption": () => (/* binding */ HtmlOption)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(104);



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
/* 115 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDd": () => (/* binding */ HtmlDd)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-dd-element
 */
class HtmlDd extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 116 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDel": () => (/* binding */ HtmlDel)
/* harmony export */ });
/* harmony import */ var _HtmlMod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(117);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-del-element
 */
class HtmlDel extends _HtmlMod__WEBPACK_IMPORTED_MODULE_0__.HtmlMod
{
}


/***/ }),
/* 117 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlMod": () => (/* binding */ HtmlMod)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 118 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDetails": () => (/* binding */ HtmlDetails)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 119 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDfn": () => (/* binding */ HtmlDfn)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-dfn-element
 */
class HtmlDfn extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 120 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDialog": () => (/* binding */ HtmlDialog)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 121 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDiv": () => (/* binding */ HtmlDiv)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-div-element
 */
class HtmlDiv extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 122 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDl": () => (/* binding */ HtmlDl)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-dl-element
 */
class HtmlDl extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 123 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlDt": () => (/* binding */ HtmlDt)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-dt-element
 */
class HtmlDt extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 124 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlEm": () => (/* binding */ HtmlEm)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-em-element
 */
class HtmlEm extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 125 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlEmbed": () => (/* binding */ HtmlEmbed)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 126 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlFieldSet": () => (/* binding */ HtmlFieldSet)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(104);



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
/* 127 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlFigCaption": () => (/* binding */ HtmlFigCaption)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-figcaption-element
 */
class HtmlFigCaption extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 128 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlFigure": () => (/* binding */ HtmlFigure)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-figure-element
 */
class HtmlFigure extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 129 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlFooter": () => (/* binding */ HtmlFooter)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-footer-element
 */
class HtmlFooter extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 130 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlH1": () => (/* binding */ HtmlH1)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-h1-element
 */
class HtmlH1 extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 131 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlH2": () => (/* binding */ HtmlH2)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-h2-element
 */
class HtmlH2 extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 132 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlH3": () => (/* binding */ HtmlH3)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-h3-element
 */
class HtmlH3 extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 133 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlH4": () => (/* binding */ HtmlH4)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-h4-element
 */
class HtmlH4 extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 134 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlH5": () => (/* binding */ HtmlH5)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-h5-element
 */
class HtmlH5 extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 135 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlH6": () => (/* binding */ HtmlH6)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-h6-element
 */
class HtmlH6 extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 136 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlHGroup": () => (/* binding */ HtmlHGroup)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-hgroup-element
 */
class HtmlHGroup extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 137 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlObject": () => (/* binding */ HtmlObject)
/* harmony export */ });
/* harmony import */ var _DomDoc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(104);




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
/* 138 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTableCell": () => (/* binding */ HtmlTableCell)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 139 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlHeader": () => (/* binding */ HtmlHeader)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-header-element
 */
class HtmlHeader extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 140 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlHr": () => (/* binding */ HtmlHr)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-hr-element
 */
class HtmlHr extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 141 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlI": () => (/* binding */ HtmlI)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-i-element
 */
class HtmlI extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 142 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlIFrame": () => (/* binding */ HtmlIFrame)
/* harmony export */ });
/* harmony import */ var _DomDoc__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);



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
/* 143 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlImg": () => (/* binding */ HtmlImg)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 144 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlInput": () => (/* binding */ HtmlInput)
/* harmony export */ });
/* harmony import */ var _HtmlDataList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(113);
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(104);
/* harmony import */ var _HtmlLabel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(105);





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
/* 145 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlIns": () => (/* binding */ HtmlIns)
/* harmony export */ });
/* harmony import */ var _HtmlMod__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(117);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-ins-element
 */
class HtmlIns extends _HtmlMod__WEBPACK_IMPORTED_MODULE_0__.HtmlMod
{
}


/***/ }),
/* 146 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlKbd": () => (/* binding */ HtmlKbd)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-kbd-element
 */
class HtmlKbd extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 147 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlLegend": () => (/* binding */ HtmlLegend)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(104);



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
/* 148 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlLi": () => (/* binding */ HtmlLi)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 149 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlLink": () => (/* binding */ HtmlLink)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 150 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlMain": () => (/* binding */ HtmlMain)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-main-element
 */
class HtmlMain extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 151 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlMap": () => (/* binding */ HtmlMap)
/* harmony export */ });
/* harmony import */ var _HtmlArea__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(92);
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);
/* harmony import */ var _HtmlImg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(143);
/* harmony import */ var _HtmlObject__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(137);





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
/* 152 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlMark": () => (/* binding */ HtmlMark)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-mark-element
 */
class HtmlMark extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 153 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlMenu": () => (/* binding */ HtmlMenu)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-menu-element
 */
class HtmlMenu extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 154 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlMeta": () => (/* binding */ HtmlMeta)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 155 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlMeter": () => (/* binding */ HtmlMeter)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _HtmlLabel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(105);



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
/* 156 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlNav": () => (/* binding */ HtmlNav)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-nav-element
 */
class HtmlNav extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 157 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlNoScript": () => (/* binding */ HtmlNoScript)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-noscript-element
 */
class HtmlNoScript extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 158 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlOl": () => (/* binding */ HtmlOl)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 159 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlOptGroup": () => (/* binding */ HtmlOptGroup)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 160 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlOutput": () => (/* binding */ HtmlOutput)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(104);
/* harmony import */ var _HtmlLabel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(105);




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
/* 161 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlP": () => (/* binding */ HtmlP)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-p-element
 */
class HtmlP extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 162 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlParam": () => (/* binding */ HtmlParam)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 163 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlPicture": () => (/* binding */ HtmlPicture)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-picture-element
 */
class HtmlPicture extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 164 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlPre": () => (/* binding */ HtmlPre)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-pre-element
 */
class HtmlPre extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 165 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlProgress": () => (/* binding */ HtmlProgress)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _HtmlLabel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(105);



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
/* 166 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlQ": () => (/* binding */ HtmlQ)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 167 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlRp": () => (/* binding */ HtmlRp)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-rp-element
 */
class HtmlRp extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 168 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlRt": () => (/* binding */ HtmlRt)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-rt-element
 */
class HtmlRt extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 169 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlRuby": () => (/* binding */ HtmlRuby)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-ruby-element
 */
class HtmlRuby extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 170 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlS": () => (/* binding */ HtmlS)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-s-element
 */
class HtmlS extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 171 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSamp": () => (/* binding */ HtmlSamp)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-samp-element
 */
class HtmlSamp extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 172 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlScript": () => (/* binding */ HtmlScript)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 173 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSection": () => (/* binding */ HtmlSection)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-section-element
 */
class HtmlSection extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 174 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSelect": () => (/* binding */ HtmlSelect)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _HtmlForm__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(104);
/* harmony import */ var _HtmlLabel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(105);
/* harmony import */ var _HtmlOption__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(114);





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
/* 175 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSmall": () => (/* binding */ HtmlSmall)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-small-element
 */
class HtmlSmall extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 176 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSource": () => (/* binding */ HtmlSource)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 177 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSpan": () => (/* binding */ HtmlSpan)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-span-element
 */
class HtmlSpan extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 178 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlStrong": () => (/* binding */ HtmlStrong)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-strong-element
 */
class HtmlStrong extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 179 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlStyle": () => (/* binding */ HtmlStyle)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 180 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSub": () => (/* binding */ HtmlSub)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-sub-element
 */
class HtmlSub extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 181 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSummary": () => (/* binding */ HtmlSummary)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-summary-element
 */
class HtmlSummary extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 182 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlSup": () => (/* binding */ HtmlSup)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-sup-element
 */
class HtmlSup extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 183 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTBody": () => (/* binding */ HtmlTBody)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _HtmlTr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(184);



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
/* 184 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTr": () => (/* binding */ HtmlTr)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _HtmlTd__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(185);
/* harmony import */ var _HtmlTh__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(186);




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
/* 185 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTd": () => (/* binding */ HtmlTd)
/* harmony export */ });
/* harmony import */ var _HtmlTableCell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(138);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-td-element
 */
class HtmlTd extends _HtmlTableCell__WEBPACK_IMPORTED_MODULE_0__.HtmlTableCell
{
}


/***/ }),
/* 186 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTh": () => (/* binding */ HtmlTh)
/* harmony export */ });
/* harmony import */ var _HtmlTableCell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(138);


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
/* 187 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTFoot": () => (/* binding */ HtmlTFoot)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _HtmlTr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(184);



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
/* 188 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTHead": () => (/* binding */ HtmlTHead)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _HtmlTr__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(184);



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
/* 189 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTable": () => (/* binding */ HtmlTable)
/* harmony export */ });
/* harmony import */ var _HtmlCaption__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(107);
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);
/* harmony import */ var _HtmlTBody__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(183);
/* harmony import */ var _HtmlTFoot__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(187);
/* harmony import */ var _HtmlTHead__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(188);
/* harmony import */ var _HtmlTr__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(184);







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
/* 190 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTemplate": () => (/* binding */ HtmlTemplate)
/* harmony export */ });
/* harmony import */ var _DomFragment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(42);
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(14);



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
/* 191 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTextArea": () => (/* binding */ HtmlTextArea)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);
/* harmony import */ var _HtmlLabel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(105);



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
/* 192 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTime": () => (/* binding */ HtmlTime)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 193 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTitle": () => (/* binding */ HtmlTitle)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 194 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlTrack": () => (/* binding */ HtmlTrack)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


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
/* 195 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlU": () => (/* binding */ HtmlU)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-u-element
 */
class HtmlU extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 196 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlUl": () => (/* binding */ HtmlUl)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-ul-element
 */
class HtmlUl extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 197 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlVar": () => (/* binding */ HtmlVar)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-var-element
 */
class HtmlVar extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 198 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlVideo": () => (/* binding */ HtmlVideo)
/* harmony export */ });
/* harmony import */ var _HtmlMedia__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(96);


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
/* 199 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "HtmlWbr": () => (/* binding */ HtmlWbr)
/* harmony export */ });
/* harmony import */ var _HtmlElem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(14);


/**
 * @see https://www.w3.org/TR/html/single-page.html#the-wbr-element
 */
class HtmlWbr extends _HtmlElem__WEBPACK_IMPORTED_MODULE_0__.HtmlElem
{
}


/***/ }),
/* 200 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Win": () => (/* binding */ Win)
/* harmony export */ });
/* harmony import */ var _DomTarget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(12);
/* harmony import */ var _DomDoc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8);



const JSON_MIME_TYPE = 'application/json'

/**
 * @see https://www.w3.org/TR/html/single-page.html#the-window-object
 */
class Win extends _DomTarget__WEBPACK_IMPORTED_MODULE_0__.DomTarget
{
  /**
   * @param {{}} init
   * @param {Window} [init.node]
   */
  create(init) {
    if(!init.node) {
      init.node = window
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
    const res = await fetch(url, init)
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

_DomTarget__WEBPACK_IMPORTED_MODULE_0__.DomTarget.Win = Win


/***/ }),
/* 201 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 202 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleAlertDialog": () => (/* binding */ RoleAlertDialog),
/* harmony export */   "AlertDialog": () => (/* binding */ RoleAlertDialog)
/* harmony export */ });
/* harmony import */ var _RoleDialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(203);


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
/* 203 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleDialog": () => (/* binding */ RoleDialog),
/* harmony export */   "Dialog": () => (/* binding */ RoleDialog)
/* harmony export */ });
/* harmony import */ var _RoleWindow__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(204);


/**
 * A dialog is a descendant window of the primary window of a web application.
 * @see https://www.w3.org/TR/wai-aria-1.1/#dialog
 */
class RoleDialog extends _RoleWindow__WEBPACK_IMPORTED_MODULE_0__.RoleWindow
{
}

RoleDialog.abstract = false




/***/ }),
/* 204 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleWindow": () => (/* binding */ RoleWindow)
/* harmony export */ });
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54);
/* harmony import */ var _AriaModal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(61);
/* harmony import */ var _RoleRoleType__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(85);




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
/* 205 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleApplication": () => (/* binding */ RoleApplication),
/* harmony export */   "Application": () => (/* binding */ RoleApplication)
/* harmony export */ });
/* harmony import */ var _AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(54);
/* harmony import */ var _RoleBanner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(206);
/* harmony import */ var _RoleStructure__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(84);





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
/* 206 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleBanner": () => (/* binding */ RoleBanner),
/* harmony export */   "Banner": () => (/* binding */ RoleBanner)
/* harmony export */ });
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(207);


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
/* 207 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleLandmark": () => (/* binding */ RoleLandmark),
/* harmony export */   "Landmark": () => (/* binding */ RoleLandmark)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83);


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
/* 208 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleArticle": () => (/* binding */ RoleArticle),
/* harmony export */   "Article": () => (/* binding */ RoleArticle)
/* harmony export */ });
/* harmony import */ var _AriaPosInSet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(66);
/* harmony import */ var _AriaSetSize__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(74);
/* harmony import */ var _RoleDocument__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(209);




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
/* 209 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleDocument": () => (/* binding */ RoleDocument)
/* harmony export */ });
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54);
/* harmony import */ var _RoleBanner__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(206);
/* harmony import */ var _RoleContentInfo__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(210);
/* harmony import */ var _RoleMain__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(211);
/* harmony import */ var _RoleStructure__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(84);






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
/* 210 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleContentInfo": () => (/* binding */ RoleContentInfo),
/* harmony export */   "ContentInfo": () => (/* binding */ RoleContentInfo)
/* harmony export */ });
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(207);


/**
 * A large perceivable region that contains information about the parent document.
 * @see https://www.w3.org/TR/wai-aria-1.1/#contentinfo
 */
class RoleContentInfo extends _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__.RoleLandmark
{
}

RoleContentInfo.abstract = false




/***/ }),
/* 211 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleMain": () => (/* binding */ RoleMain),
/* harmony export */   "Main": () => (/* binding */ RoleMain)
/* harmony export */ });
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(207);


/**
 * The main content of a document.
 * @see https://www.w3.org/TR/wai-aria-1.1/#main
 */
class RoleMain extends _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__.RoleLandmark
{
}

RoleMain.abstract = false




/***/ }),
/* 212 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleBlockQuote": () => (/* binding */ RoleBlockQuote),
/* harmony export */   "BlockQuote": () => (/* binding */ RoleBlockQuote)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83);


/**
 * A section of content that is quoted from another source.
 * @see https://www.w3.org/TR/wai-aria-1.2/#blockquote
 */
class RoleBlockQuote extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleBlockQuote.abstract = false




/***/ }),
/* 213 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleButton": () => (/* binding */ RoleButton),
/* harmony export */   "Button": () => (/* binding */ RoleButton)
/* harmony export */ });
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54);
/* harmony import */ var _AriaPressed__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(67);
/* harmony import */ var _RoleCommand__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(214);




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
/* 214 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleCommand": () => (/* binding */ RoleCommand),
/* harmony export */   "Command": () => (/* binding */ RoleCommand)
/* harmony export */ });
/* harmony import */ var _RoleWidget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(215);


/**
 * A form of widget that performs an action but does not receive input data.
 * @see https://www.w3.org/TR/wai-aria-1.1/#command
 * @abstract
 */
class RoleCommand extends _RoleWidget__WEBPACK_IMPORTED_MODULE_0__.RoleWidget
{
}




/***/ }),
/* 215 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleWidget": () => (/* binding */ RoleWidget),
/* harmony export */   "Widget": () => (/* binding */ RoleWidget)
/* harmony export */ });
/* harmony import */ var _RoleForm__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(216);
/* harmony import */ var _RoleRoleType__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(85);



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
/* 216 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleForm": () => (/* binding */ RoleForm),
/* harmony export */   "Form": () => (/* binding */ RoleForm)
/* harmony export */ });
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(207);


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
/* 217 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleCaption": () => (/* binding */ RoleCaption),
/* harmony export */   "Caption": () => (/* binding */ RoleCaption)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83);


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
/* 218 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleCell": () => (/* binding */ RoleCell),
/* harmony export */   "Cell": () => (/* binding */ RoleCell)
/* harmony export */ });
/* harmony import */ var _AriaColIndex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(50);
/* harmony import */ var _AriaColSpan__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(51);
/* harmony import */ var _AriaRowIndex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(71);
/* harmony import */ var _AriaRowSpan__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(72);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(83);






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
/* 219 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleCheckBox": () => (/* binding */ RoleCheckBox),
/* harmony export */   "CheckBox": () => (/* binding */ RoleCheckBox)
/* harmony export */ });
/* harmony import */ var _AriaChecked__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(68);
/* harmony import */ var _RoleInput__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(220);




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
/* 220 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleInput": () => (/* binding */ RoleInput),
/* harmony export */   "Input": () => (/* binding */ RoleInput)
/* harmony export */ });
/* harmony import */ var _RoleWidget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(215);


/**
 * A generic type of widget that allows user input.
 * @see https://www.w3.org/TR/wai-aria-1.1/#input
 * @abstract
 */
class RoleInput extends _RoleWidget__WEBPACK_IMPORTED_MODULE_0__.RoleWidget
{
}




/***/ }),
/* 221 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleColumnHeader": () => (/* binding */ RoleColumnHeader),
/* harmony export */   "ColumnHeader": () => (/* binding */ RoleColumnHeader)
/* harmony export */ });
/* harmony import */ var _AriaSort__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(75);
/* harmony import */ var _RoleCell__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(218);



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
/* 222 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleComboBox": () => (/* binding */ RoleComboBox),
/* harmony export */   "ComboBox": () => (/* binding */ RoleComboBox)
/* harmony export */ });
/* harmony import */ var _AriaAutoComplete__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(45);
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(54);
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(68);
/* harmony import */ var _AriaRequired__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(69);
/* harmony import */ var _RoleInput__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(220);
/* harmony import */ var _RoleTextBox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(223);







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
/* 223 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTextBox": () => (/* binding */ RoleTextBox),
/* harmony export */   "TextBox": () => (/* binding */ RoleTextBox)
/* harmony export */ });
/* harmony import */ var _AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);
/* harmony import */ var _AriaAutoComplete__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(45);
/* harmony import */ var _AriaMultiLine__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(62);
/* harmony import */ var _AriaPlaceholder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(65);
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(68);
/* harmony import */ var _AriaRequired__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(69);
/* harmony import */ var _RoleInput__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(220);








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
/* 224 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleComplementary": () => (/* binding */ RoleComplementary),
/* harmony export */   "Complementary": () => (/* binding */ RoleComplementary)
/* harmony export */ });
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(207);


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
/* 225 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleComposite": () => (/* binding */ RoleComposite),
/* harmony export */   "Composite": () => (/* binding */ RoleComposite)
/* harmony export */ });
/* harmony import */ var _AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);
/* harmony import */ var _RoleWidget__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(215);



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
/* 226 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleDefinition": () => (/* binding */ RoleDefinition),
/* harmony export */   "Definition": () => (/* binding */ RoleDefinition)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83);


/**
 * A definition of a term or concept.
 * @see https://www.w3.org/TR/wai-aria-1.1/#definition
 */
class RoleDefinition extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleDefinition.abstract = false




/***/ }),
/* 227 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleDirectory": () => (/* binding */ RoleDirectory),
/* harmony export */   "Directory": () => (/* binding */ RoleDirectory)
/* harmony export */ });
/* harmony import */ var _RoleList__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(228);


/**
 * A list of references to members of a group, such as a static table of contents.
 * @see https://www.w3.org/TR/wai-aria-1.1/#directory
 */
class RoleDirectory extends _RoleList__WEBPACK_IMPORTED_MODULE_0__.RoleList
{
}




/***/ }),
/* 228 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleList": () => (/* binding */ RoleList),
/* harmony export */   "List": () => (/* binding */ RoleList)
/* harmony export */ });
/* harmony import */ var _RoleListItem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(229);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(83);



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
/* 229 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleListItem": () => (/* binding */ RoleListItem),
/* harmony export */   "ListItem": () => (/* binding */ RoleListItem)
/* harmony export */ });
/* harmony import */ var _AriaLevel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(60);
/* harmony import */ var _AriaPosInSet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(66);
/* harmony import */ var _AriaSetSize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(74);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(83);





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
/* 230 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleFeed": () => (/* binding */ RoleFeed),
/* harmony export */   "Feed": () => (/* binding */ RoleFeed)
/* harmony export */ });
/* harmony import */ var _RoleArticle__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(208);
/* harmony import */ var _RoleList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(228);



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
/* 231 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleFigure": () => (/* binding */ RoleFigure),
/* harmony export */   "Figure": () => (/* binding */ RoleFigure)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83);


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
/* 232 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleGrid": () => (/* binding */ RoleGrid),
/* harmony export */   "Grid": () => (/* binding */ RoleGrid)
/* harmony export */ });
/* harmony import */ var _AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);
/* harmony import */ var _AriaLevel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(60);
/* harmony import */ var _AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(63);
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(68);
/* harmony import */ var _RoleCell__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(218);
/* harmony import */ var _RoleGridCell__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(233);
/* harmony import */ var _RoleRow__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(234);
/* harmony import */ var _RoleRowGroup__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(237);
/* harmony import */ var _RoleTable__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(238);










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
/* 233 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleGridCell": () => (/* binding */ RoleGridCell),
/* harmony export */   "GridCell": () => (/* binding */ RoleGridCell)
/* harmony export */ });
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(68);
/* harmony import */ var _AriaRequired__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(69);
/* harmony import */ var _AriaSelected__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(73);
/* harmony import */ var _RoleCell__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(218);





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
/* 234 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleRow": () => (/* binding */ RoleRow),
/* harmony export */   "Row": () => (/* binding */ RoleRow)
/* harmony export */ });
/* harmony import */ var _AriaColIndex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(50);
/* harmony import */ var _AriaLevel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(60);
/* harmony import */ var _AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(63);
/* harmony import */ var _AriaRowIndex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(71);
/* harmony import */ var _AriaSelected__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(73);
/* harmony import */ var _RoleCell__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(218);
/* harmony import */ var _RoleGridCell__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(233);
/* harmony import */ var _RoleGroup__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(235);
/* harmony import */ var _RoleRowHeader__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(236);










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
/* 235 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleGroup": () => (/* binding */ RoleGroup),
/* harmony export */   "Group": () => (/* binding */ RoleGroup)
/* harmony export */ });
/* harmony import */ var _AriaActiveDescendant__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(44);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(83);



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
/* 236 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleRowHeader": () => (/* binding */ RoleRowHeader),
/* harmony export */   "RowHeader": () => (/* binding */ RoleRowHeader)
/* harmony export */ });
/* harmony import */ var _AriaSort__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(75);
/* harmony import */ var _RoleCell__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(218);



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
/* 237 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleRowGroup": () => (/* binding */ RoleRowGroup),
/* harmony export */   "RowGroup": () => (/* binding */ RoleRowGroup)
/* harmony export */ });
/* harmony import */ var _RoleCell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(218);
/* harmony import */ var _RoleGridCell__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(233);
/* harmony import */ var _RoleRow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(234);
/* harmony import */ var _RoleStructure__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(84);





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
/* 238 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTable": () => (/* binding */ RoleTable),
/* harmony export */   "Table": () => (/* binding */ RoleTable)
/* harmony export */ });
/* harmony import */ var _AriaColCount__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(48);
/* harmony import */ var _AriaRowCount__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(70);
/* harmony import */ var _RoleCaption__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(217);
/* harmony import */ var _RoleCell__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(218);
/* harmony import */ var _RoleRow__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(234);
/* harmony import */ var _RoleRowGroup__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(237);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(83);








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
/* 239 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleHeading": () => (/* binding */ RoleHeading),
/* harmony export */   "Heading": () => (/* binding */ RoleHeading)
/* harmony export */ });
/* harmony import */ var _AriaLevel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(60);
/* harmony import */ var _RoleSectionHead__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(240);



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
/* 240 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSectionHead": () => (/* binding */ RoleSectionHead),
/* harmony export */   "SectionHead": () => (/* binding */ RoleSectionHead)
/* harmony export */ });
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54);
/* harmony import */ var _RoleStructure__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(84);



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
/* 241 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleImg": () => (/* binding */ RoleImg),
/* harmony export */   "Img": () => (/* binding */ RoleImg)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83);


/**
 * A container for a collection of elements that form an image.
 * @see https://www.w3.org/TR/wai-aria-1.1/#img
 */
class RoleImg extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleImg.abstract = false




/***/ }),
/* 242 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleLink": () => (/* binding */ RoleLink),
/* harmony export */   "Link": () => (/* binding */ RoleLink)
/* harmony export */ });
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54);
/* harmony import */ var _RoleCommand__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(214);



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
/* 243 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleListBox": () => (/* binding */ RoleListBox),
/* harmony export */   "ListBox": () => (/* binding */ RoleListBox)
/* harmony export */ });
/* harmony import */ var _AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63);
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(68);
/* harmony import */ var _AriaRequired__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(69);
/* harmony import */ var _RoleOption__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(244);
/* harmony import */ var _RoleSelect__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(245);






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
/* 244 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleOption": () => (/* binding */ RoleOption)
/* harmony export */ });
/* harmony import */ var _AriaChecked__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);
/* harmony import */ var _AriaPosInSet__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(66);
/* harmony import */ var _AriaSelected__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(73);
/* harmony import */ var _AriaSetSize__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(74);
/* harmony import */ var _RoleInput__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(220);
/* harmony import */ var _RoleListBox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(243);







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
/* 245 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSelect": () => (/* binding */ RoleSelect),
/* harmony export */   "Select": () => (/* binding */ RoleSelect)
/* harmony export */ });
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54);
/* harmony import */ var _AriaOrientation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(64);
/* harmony import */ var _RoleComposite__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(225);




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
/* 246 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleLog": () => (/* binding */ RoleLog),
/* harmony export */   "Log": () => (/* binding */ RoleLog)
/* harmony export */ });
/* harmony import */ var _AriaLive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(83);



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
/* 247 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleMarquee": () => (/* binding */ RoleMarquee),
/* harmony export */   "Marquee": () => (/* binding */ RoleMarquee)
/* harmony export */ });
/* harmony import */ var _AriaLive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(83);



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
/* 248 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleMath": () => (/* binding */ RoleMath),
/* harmony export */   "Math": () => (/* binding */ RoleMath)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83);


/**
 * Content that represents a mathematical expression.
 * @see https://www.w3.org/TR/wai-aria-1.1/#math
 */
class RoleMath extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleMath.abstract = false




/***/ }),
/* 249 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleMenu": () => (/* binding */ RoleMenu),
/* harmony export */   "Menu": () => (/* binding */ RoleMenu)
/* harmony export */ });
/* harmony import */ var _RoleGroup__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(235);
/* harmony import */ var _RoleMenuItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(250);
/* harmony import */ var _RoleSelect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(245);




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
/* 250 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleMenuItem": () => (/* binding */ RoleMenuItem),
/* harmony export */   "MenuItem": () => (/* binding */ RoleMenuItem)
/* harmony export */ });
/* harmony import */ var _AriaExpanded__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(54);
/* harmony import */ var _RoleCommand__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(214);
/* harmony import */ var _RoleMenu__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(249);




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
/* 251 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleMenuBar": () => (/* binding */ RoleMenuBar),
/* harmony export */   "MenuBar": () => (/* binding */ RoleMenuBar)
/* harmony export */ });
/* harmony import */ var _AriaOrientation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(64);
/* harmony import */ var _RoleMenu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(249);
/* harmony import */ var _RoleMenuItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(250);




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
/* 252 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleMenuItemCheckBox": () => (/* binding */ RoleMenuItemCheckBox),
/* harmony export */   "MenuItemCheckBox": () => (/* binding */ RoleMenuItemCheckBox)
/* harmony export */ });
/* harmony import */ var _AriaChecked__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);
/* harmony import */ var _RoleMenuItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(250);



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
/* 253 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleMenuItemRadio": () => (/* binding */ RoleMenuItemRadio),
/* harmony export */   "MenuItemRadio": () => (/* binding */ RoleMenuItemRadio)
/* harmony export */ });
/* harmony import */ var _RoleMenuItemCheckBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(252);


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
/* 254 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleNavigation": () => (/* binding */ RoleNavigation),
/* harmony export */   "Navigation": () => (/* binding */ RoleNavigation)
/* harmony export */ });
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(207);


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
/* 255 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleNone": () => (/* binding */ RoleNone),
/* harmony export */   "None": () => (/* binding */ RoleNone)
/* harmony export */ });
/* harmony import */ var _Role__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(81);


/**
 * An element whose implicit native role semantics will not be mapped to the accessibility API.
 * @see https://www.w3.org/TR/wai-aria-1.1/#none
 */
class RoleNone extends _Role__WEBPACK_IMPORTED_MODULE_0__.Role
{
}

RoleNone.abstract = false




/***/ }),
/* 256 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleNote": () => (/* binding */ RoleNote),
/* harmony export */   "Note": () => (/* binding */ RoleNote)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83);


/**
 * A section whose content is parenthetic or ancillary to the main content of the resource.
 * @see https://www.w3.org/TR/wai-aria-1.1/#note
 */
class RoleNote extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleNote.abstract = false




/***/ }),
/* 257 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleParagraph": () => (/* binding */ RoleParagraph),
/* harmony export */   "Paragraph": () => (/* binding */ RoleParagraph)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83);


/**
 * A paragraph of content.
 * @see https://www.w3.org/TR/wai-aria-1.2/#paragraph
 */
class RoleParagraph extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleParagraph.abstract = false




/***/ }),
/* 258 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RolePresentation": () => (/* binding */ RolePresentation),
/* harmony export */   "Presentation": () => (/* binding */ RolePresentation)
/* harmony export */ });
/* harmony import */ var _RoleStructure__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);


/**
 * An element whose implicit native role semantics will not be mapped to the accessibility API.
 * @see https://www.w3.org/TR/wai-aria-1.1/#presentation
 */
class RolePresentation extends _RoleStructure__WEBPACK_IMPORTED_MODULE_0__.RoleStructure
{
}

RolePresentation.abstract = false




/***/ }),
/* 259 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleProgressBar": () => (/* binding */ RoleProgressBar),
/* harmony export */   "ProgressBar": () => (/* binding */ RoleProgressBar)
/* harmony export */ });
/* harmony import */ var _RoleRange__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(260);


/**
 * An element that displays the progress status for tasks that take a long time.
 * @see https://www.w3.org/TR/wai-aria-1.1/#progressbar
 */
class RoleProgressBar extends _RoleRange__WEBPACK_IMPORTED_MODULE_0__.RoleRange
{
}

RoleProgressBar.abstract = false




/***/ }),
/* 260 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleRange": () => (/* binding */ RoleRange)
/* harmony export */ });
/* harmony import */ var _AriaValueMax__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(77);
/* harmony import */ var _AriaValueMin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(78);
/* harmony import */ var _AriaValueNow__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(79);
/* harmony import */ var _AriaValueText__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(80);
/* harmony import */ var _RoleWidget__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(215);






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
/* 261 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleRadio": () => (/* binding */ RoleRadio),
/* harmony export */   "Radio": () => (/* binding */ RoleRadio)
/* harmony export */ });
/* harmony import */ var _AriaChecked__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);
/* harmony import */ var _RoleInput__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(220);
/* harmony import */ var _RoleRadioGroup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(262);




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
/* 262 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleRadioGroup": () => (/* binding */ RoleRadioGroup),
/* harmony export */   "RadioGroup": () => (/* binding */ RoleRadioGroup)
/* harmony export */ });
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(68);
/* harmony import */ var _AriaRequired__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(69);
/* harmony import */ var _RoleSelect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(245);
/* harmony import */ var _RoleRadio__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(261);





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
/* 263 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleRegion": () => (/* binding */ RoleRegion),
/* harmony export */   "Region": () => (/* binding */ RoleRegion)
/* harmony export */ });
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(207);


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
/* 264 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleScrollBar": () => (/* binding */ RoleScrollBar),
/* harmony export */   "ScrollBar": () => (/* binding */ RoleScrollBar)
/* harmony export */ });
/* harmony import */ var _AriaOrientation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(64);
/* harmony import */ var _RoleRange__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(260);



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
/* 265 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSearch": () => (/* binding */ RoleSearch),
/* harmony export */   "Search": () => (/* binding */ RoleSearch)
/* harmony export */ });
/* harmony import */ var _RoleLandmark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(207);


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
/* 266 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSearchBox": () => (/* binding */ RoleSearchBox),
/* harmony export */   "SearchBox": () => (/* binding */ RoleSearchBox)
/* harmony export */ });
/* harmony import */ var _RoleTextBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(223);


/**
 * A type of textbox intended for specifying search criteria.
 * @see https://www.w3.org/TR/wai-aria-1.1/#searchbox
 */
class RoleSearchBox extends _RoleTextBox__WEBPACK_IMPORTED_MODULE_0__.RoleTextBox
{
}




/***/ }),
/* 267 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSeparator": () => (/* binding */ RoleSeparator),
/* harmony export */   "Separator": () => (/* binding */ RoleSeparator)
/* harmony export */ });
/* harmony import */ var _RoleStructure__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(84);


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
/* 268 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSlider": () => (/* binding */ RoleSlider),
/* harmony export */   "Slider": () => (/* binding */ RoleSlider)
/* harmony export */ });
/* harmony import */ var _AriaOrientation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(64);
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(68);
/* harmony import */ var _RoleRange__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(260);




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
/* 269 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSpinButton": () => (/* binding */ RoleSpinButton),
/* harmony export */   "SpinButton": () => (/* binding */ RoleSpinButton)
/* harmony export */ });
/* harmony import */ var _AriaReadOnly__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(68);
/* harmony import */ var _AriaRequired__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(69);
/* harmony import */ var _RoleRange__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(260);




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
/* 270 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleStatus": () => (/* binding */ RoleStatus),
/* harmony export */   "Status": () => (/* binding */ RoleStatus)
/* harmony export */ });
/* harmony import */ var _AriaAtomic__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(15);
/* harmony import */ var _AriaLive__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(31);
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(83);




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
/* 271 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleSwitch": () => (/* binding */ RoleSwitch),
/* harmony export */   "Switch": () => (/* binding */ RoleSwitch)
/* harmony export */ });
/* harmony import */ var _RoleCheckBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(219);


/**
 * A type of checkbox that represents on/off values,
 *  as opposed to checked/unchecked values.
 * @see https://www.w3.org/TR/wai-aria-1.1/#switch
 */
class RoleSwitch extends _RoleCheckBox__WEBPACK_IMPORTED_MODULE_0__.RoleCheckBox
{
}




/***/ }),
/* 272 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTab": () => (/* binding */ RoleTab),
/* harmony export */   "Tab": () => (/* binding */ RoleTab)
/* harmony export */ });
/* harmony import */ var _AriaPosInSet__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(66);
/* harmony import */ var _AriaSelected__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(73);
/* harmony import */ var _AriaSetSize__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(74);
/* harmony import */ var _RoleWidget__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(215);





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
/* 273 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTabList": () => (/* binding */ RoleTabList),
/* harmony export */   "TabList": () => (/* binding */ RoleTabList)
/* harmony export */ });
/* harmony import */ var _AriaLevel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(60);
/* harmony import */ var _AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(63);
/* harmony import */ var _AriaOrientation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(64);
/* harmony import */ var _RoleComposite__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(225);
/* harmony import */ var _RoleTab__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(272);






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
/* 274 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTabPanel": () => (/* binding */ RoleTabPanel),
/* harmony export */   "TabPanel": () => (/* binding */ RoleTabPanel)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83);


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
/* 275 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTerm": () => (/* binding */ RoleTerm),
/* harmony export */   "Term": () => (/* binding */ RoleTerm)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83);


/**
 * A word or phrase with a corresponding definition.
 * @see https://www.w3.org/TR/wai-aria-1.1/#term
 */
class RoleTerm extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleTerm.abstract = false




/***/ }),
/* 276 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTimer": () => (/* binding */ RoleTimer),
/* harmony export */   "Timer": () => (/* binding */ RoleTimer)
/* harmony export */ });
/* harmony import */ var _AriaLive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31);
/* harmony import */ var _RoleStatus__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(270);



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
/* 277 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleToolBar": () => (/* binding */ RoleToolBar),
/* harmony export */   "ToolBar": () => (/* binding */ RoleToolBar)
/* harmony export */ });
/* harmony import */ var _AriaOrientation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(64);
/* harmony import */ var _RoleGroup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(235);



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
/* 278 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleToolTip": () => (/* binding */ RoleToolTip),
/* harmony export */   "ToolTip": () => (/* binding */ RoleToolTip)
/* harmony export */ });
/* harmony import */ var _RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83);


/**
 * A contextual popup that displays a description for an element.
 * @see https://www.w3.org/TR/wai-aria-1.1/#tooltip
 */
class RoleToolTip extends _RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
}

RoleToolTip.abstract = false




/***/ }),
/* 279 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTree": () => (/* binding */ RoleTree),
/* harmony export */   "Tree": () => (/* binding */ RoleTree)
/* harmony export */ });
/* harmony import */ var _AriaMultiSelectable__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(63);
/* harmony import */ var _AriaRequired__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(69);
/* harmony import */ var _RoleSelect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(245);
/* harmony import */ var _RoleTreeItem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(280);





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
/* 280 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTreeItem": () => (/* binding */ RoleTreeItem),
/* harmony export */   "TreeItem": () => (/* binding */ RoleTreeItem)
/* harmony export */ });
/* harmony import */ var _AriaChecked__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(46);
/* harmony import */ var _AriaSelected__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(73);
/* harmony import */ var _RoleGroup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(235);
/* harmony import */ var _RoleListItem__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(229);
/* harmony import */ var _RoleTree__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(279);






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
/* 281 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RoleTreeGrid": () => (/* binding */ RoleTreeGrid),
/* harmony export */   "TreeGrid": () => (/* binding */ RoleTreeGrid)
/* harmony export */ });
/* harmony import */ var _RoleGrid__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(232);


/**
 * A grid whose rows can be expanded and collapsed in the same manner as for a tree.
 * @see https://www.w3.org/TR/wai-aria-1.1/#treegrid
 * @mixes RoleTree
 */
class RoleTreeGrid extends _RoleGrid__WEBPACK_IMPORTED_MODULE_0__.RoleGrid
{
}




/***/ }),
/* 282 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PendingChild": () => (/* binding */ PendingChild)
/* harmony export */ });
/* harmony import */ var _HtmlDiv__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(121);


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


/***/ }),
/* 283 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 284 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Test": () => (/* binding */ Test)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);


class Test extends _lib__WEBPACK_IMPORTED_MODULE_0__.HtmlArticle
{
  
}


/***/ }),
/* 285 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(286);


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_0__.Heading('Heading')
  ]
});


/***/ }),
/* 286 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Heading": () => (/* binding */ Heading)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Heading_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(287);



class Heading extends _lib__WEBPACK_IMPORTED_MODULE_0__.RoleHeading
{
}


/***/ }),
/* 287 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 288 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(289);
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(286);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_1__.Heading('Button'),
    new _Button__WEBPACK_IMPORTED_MODULE_0__.Button('Simple'),
    new _Button__WEBPACK_IMPORTED_MODULE_0__.Button({
      pressed : true,
      text : 'Pressed',
    }),
    new _Button__WEBPACK_IMPORTED_MODULE_0__.Button({
      disabled : true,
      text : 'Disabled',
    }),
  ]
});


/***/ }),
/* 289 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Button": () => (/* binding */ Button)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(290);
/* harmony import */ var _Popup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(292);
/* harmony import */ var _Widget__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(308);
/* harmony import */ var _Button_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(310);






let undefined

/**
 * @summary An input that allows for user-triggered actions when clicked or pressed.
 * @see https://www.w3.org/TR/wai-aria-1.1/#button
 */
class Button extends _Widget__WEBPACK_IMPORTED_MODULE_3__.Widget
{
  /**
   * @param {{}} init
   * @return {Control}
   */
  build(init) {
    return this._control = new _Control__WEBPACK_IMPORTED_MODULE_1__.Control(super.build(init))
  }

  /**
   * Toggle expanded and pressed states if applicable
   */
  activate() {
    const { expanded, pressed } = this
    if(expanded !== undefined) {
      this.expanded = !expanded
    }
    if(pressed !== undefined) {
      this.pressed = !pressed
    }
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onClick(event, elem) {
    if(elem !== this) {
      event.stopImmediatePropagation()
      this.emit('click')
    }
    else super.onClick(event)
  }

  /**
   * @param {MutationRecord} record
   */
  onPopupHidden(record) {
    this.expanded = !this.popup.hidden
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Space(event) {
    event.preventDefault()
    this.class.active = true
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyUp_Space(event) {
    this.class.active = false
    this.click()
  }

  /**
   * @returns {boolean|undefined}
   */
  get expanded() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded)
  }

  /**
   * @param {boolean|undefined} expanded
   */
  set expanded(expanded) {
    if(expanded === this.expanded) {
      return
    }
    if(this.hasPopup) {
      const popup = this.popup
      if(popup) {
        expanded? popup.show() : popup.close()
      }
    }
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded, expanded)
  }

  /**
   * @returns {boolean|string|undefined}
   */
  get pressed() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaPressed)
  }

  /**
   * @param {boolean|string|undefined} pressed
   */
  set pressed(pressed) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaPressed, pressed)
  }

  /**
   * @returns {Popup|null}
   */
  get popup() {
    return this.controls.find(elem => elem instanceof _Popup__WEBPACK_IMPORTED_MODULE_2__.Popup) || null
  }

  /**
   * @param {Popup|null} popup
   * @param {DomElem|null} [popup.anchor]
   */
  set popup(popup) {
    const _popup = this.popup
    if(_popup) {
      _popup.anchor = null
      _popup.removeAttrObserver('hidden', this.onPopupHidden, this)
      this.controls = this.controls.filter(elem => elem !== _popup)
    }
    if(popup) {
      popup.anchor = this
      popup.addAttrObserver('hidden', this.onPopupHidden, this)
      this.controls = this.controls.concat([popup])
    }
  }

  /**
   * @return {string}
   */
  get text() {
    return this._control? this._control.text : super.text
  }

  /**
   * @param {string} text
   */
  set text(text) {
    if(this._control) {
      this._control.text = text
    }
    else super.text = text
  }
}


/***/ }),
/* 290 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Control": () => (/* binding */ Control)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Control_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(291);



class Control extends _lib__WEBPACK_IMPORTED_MODULE_0__.HtmlDiv
{
}


/***/ }),
/* 291 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 292 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Popup": () => (/* binding */ Popup)
/* harmony export */ });
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(293);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _Popup_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(307);




const DEBOUNCE_WAIT = 200

class Popup extends _lib__WEBPACK_IMPORTED_MODULE_1__.HtmlDiv
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
    this.updatePositionDebounce = lodash_debounce__WEBPACK_IMPORTED_MODULE_0___default()(this.updatePosition.bind(this), DEBOUNCE_WAIT)
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
    if(this.modal) {
      elem === this && this.close()
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


/***/ }),
/* 293 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isObject = __webpack_require__(294),
    now = __webpack_require__(295),
    toNumber = __webpack_require__(298);

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

module.exports = debounce;


/***/ }),
/* 294 */
/***/ ((module) => {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),
/* 295 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(296);

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

module.exports = now;


/***/ }),
/* 296 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var freeGlobal = __webpack_require__(297);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 297 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof __webpack_require__.g == 'object' && __webpack_require__.g && __webpack_require__.g.Object === Object && __webpack_require__.g;

module.exports = freeGlobal;


/***/ }),
/* 298 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseTrim = __webpack_require__(299),
    isObject = __webpack_require__(294),
    isSymbol = __webpack_require__(301);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),
/* 299 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var trimmedEndIndex = __webpack_require__(300);

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

module.exports = baseTrim;


/***/ }),
/* 300 */
/***/ ((module) => {

/** Used to match a single whitespace character. */
var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

module.exports = trimmedEndIndex;


/***/ }),
/* 301 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var baseGetTag = __webpack_require__(302),
    isObjectLike = __webpack_require__(306);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),
/* 302 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(303),
    getRawTag = __webpack_require__(304),
    objectToString = __webpack_require__(305);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 303 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var root = __webpack_require__(296);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 304 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var Symbol = __webpack_require__(303);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 305 */
/***/ ((module) => {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 306 */
/***/ ((module) => {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 307 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 308 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Widget": () => (/* binding */ Widget)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Widget_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(309);



class Widget extends _lib__WEBPACK_IMPORTED_MODULE_0__.RoleWidget
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.tabIndex = this.constructor.tabIndex
    this.on('blur', this.onBlur)
    this.on('click', this.onClick)
    this.on('focus', this.onFocus)
    this.on('focusin', this.onFocusIn)
    this.on('keydown', this.onKeyDown)
    this.on('keyup', this.onKeyUp)
    this.on('mousedown', this.onMouseDown)
  }

  /**
   * @abstract
   */
  activate() {
    void null
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   */
  onBlur(event, elem) {
    this.class.active = false
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onClick(event, elem) {
    if(this.disabled) {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
    event.defaultPrevented || this.activate()
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   * @abstract
   */
  onFocus(event, elem) {
    void null
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   */
  onFocusIn(event, elem) {
    if(this.class.keyboard || !this.doc.docElem.class.keyboard) {
      return
    }
    this.class.keyboard = true
    this.doc.on('mousedown', this._onDocEvent, this)
    this.doc.on('focusin', this._onDocEvent, this)
  }

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyDown(event, elem) {
    super.onKeyDown(event, elem)
    if(this.class.keyboard) {
      return
    }
    this.class.keyboard = true
    this.doc.on('mousedown', this._onDocEvent, this)
    this.doc.on('focusin', this._onDocEvent, this)
  }

  /**
   * @param {MouseEvent|FocusEvent} event
   * @param {DomElem} elem
   * @private
   */
  _onDocEvent(event, elem) {
    if(this.contains(elem) || this.controls.some(item => item.contains(elem))) {
      return
    }
    this.class.keyboard = false
    this.doc.off('mousedown', this._onDocEvent, this)
    this.doc.off('focusin', this._onDocEvent, this)
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onMouseDown(event, elem) {
    if(this.disabled) {
      return
    }
    this.class.active = true
    this.on('mouseleave', this.onMouseLeave, { once : true })
    this.on('mouseup', this.onMouseUp, { once : true })
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onMouseLeave(event, elem) {
    this.class.active = false
    this.off('mouseup', this.onMouseUp)
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onMouseUp(event, elem) {
    this.class.active = false
    this.off('mouseleave', this.onMouseLeave)
  }
}

Widget.prototype.name = null
Widget.abstract = false
Widget.tabIndex = 0


/***/ }),
/* 309 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 310 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 311 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _CheckBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(312);
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(286);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_1__.Heading('CheckBox'),
    new _CheckBox__WEBPACK_IMPORTED_MODULE_0__.CheckBox({
      labels : 'Simple',
    }),
    new _CheckBox__WEBPACK_IMPORTED_MODULE_0__.CheckBox({
      labels : 'Checked',
      checked : true,
    }),
    new _CheckBox__WEBPACK_IMPORTED_MODULE_0__.CheckBox({
      labels : 'Mixed',
      checked : 'mixed',
    }),
    new _CheckBox__WEBPACK_IMPORTED_MODULE_0__.CheckBox({
      labels : 'Disabled',
      disabled : true,
    }),
  ]
});


/***/ }),
/* 312 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CheckBox": () => (/* binding */ CheckBox)
/* harmony export */ });
/* harmony import */ var _lib_ariamodule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43);
/* harmony import */ var _CheckBox_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(313);



/**
 * @summary A checkable input that has three possible values: true, false, or mixed.
 * @see https://www.w3.org/TR/wai-aria-1.1/#checkbox
 */
class CheckBox extends _lib_ariamodule__WEBPACK_IMPORTED_MODULE_0__.RoleCheckBox
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.value = null
    this.tabIndex = 0
    this.on('blur', this.onBlur)
    this.on('click', this.onClick)
    this.on('focus', this.onFocus)
    this.on('mousedown', this.onMouseDown)
  }

  /**
   * @param {FocusEvent} event
   */
  onBlur(event) {
    this.classList.remove('active')
    this.off('keydown', this.onKeyDown)
    this.off('keyup', this.onKeyUp)
  }

  /**
   * @param {MouseEvent} event
   */
  onClick(event) {
    if(this.disabled) {
      event.stopImmediatePropagation()
    }
    else if(!event.defaultPrevented && !this.readOnly) {
      this.checked = !this.checked
      this.emit('change')
    }
  }

  /**
   * @param {FocusEvent} event
   */
  onFocus(event) {
    this.on('keydown', this.onKeyDown)
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    if(event.key === ' ') {
      event.preventDefault()
      this.classList.add('active')
    }
    this.on('keyup', this.onKeyUp, { once : true })
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyUp(event) {
    if(event.key === ' ') {
      this.classList.remove('active')
      this.click()
    }
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseDown(event) {
    if(this.disabled) {
      return
    }
    this.classList.add('active')
    this.on('mouseleave', this.onMouseLeave, { once : true })
    this.on('mouseup', this.onMouseUp, { once : true })
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseLeave(event) {
    this.classList.remove('active')
    this.off('mouseup', this.onMouseUp)
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseUp(event) {
    this.classList.remove('active')
    this.off('mouseleave', this.onMouseLeave)
  }
}


/***/ }),
/* 313 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 314 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(286);
/* harmony import */ var _RadioGroup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(315);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_0__.Heading('RadioGroup'),
    new _RadioGroup__WEBPACK_IMPORTED_MODULE_1__.RadioGroup({
      labels : 'Simple',
      children : [
        new _RadioGroup__WEBPACK_IMPORTED_MODULE_1__.Radio({
          checked : true,
          value : '-1',
          labels : 'This event only'
        }),
        new _RadioGroup__WEBPACK_IMPORTED_MODULE_1__.Radio({
          value : '1',
          labels : 'This and all the following'
        }),
        new _RadioGroup__WEBPACK_IMPORTED_MODULE_1__.Radio({
          value : '0',
          labels : 'No more repeats'
        })
      ]
    })
  ]
});


/***/ }),
/* 315 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RadioGroup": () => (/* binding */ RadioGroup),
/* harmony export */   "Radio": () => (/* reexport safe */ _Radio__WEBPACK_IMPORTED_MODULE_1__.Radio)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Radio__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(316);
/* harmony import */ var _RadioGroup_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(318);




/**
 * @summary A group of radio buttons.
 * @see https://www.w3.org/TR/wai-aria-1.1/#radiogroup
 */
class RadioGroup extends _lib__WEBPACK_IMPORTED_MODULE_0__.RoleRadioGroup
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this._radios = this.radios
    this.resetTabIndex()
    this.on(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaChecked, this.onChecked, { subtree : true })
    this.on(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaDisabled, this.onDisabled, { subtree : true })
    this.on(_Radio__WEBPACK_IMPORTED_MODULE_1__.Radio, this.onRadio, { subtree : true })
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
          const radio = this.find(_Radio__WEBPACK_IMPORTED_MODULE_1__.Radio, ({ checked }) => checked)
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
    const radios = this.findAll(_Radio__WEBPACK_IMPORTED_MODULE_1__.Radio, ({ disabled }) => !disabled)
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
    const radio = this.find(_Radio__WEBPACK_IMPORTED_MODULE_1__.Radio, radio => radio.value === value)
    if(radio) {
      radio.checked = true
    }
  }

  /**
   * @returns {string}
   */
  get value() {
    const radio = this.find(_Radio__WEBPACK_IMPORTED_MODULE_1__.Radio, ({ checked }) => checked)
    return radio && radio.value
  }
}




/***/ }),
/* 316 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Radio": () => (/* binding */ Radio)
/* harmony export */ });
/* harmony import */ var _lib_ariamodule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43);
/* harmony import */ var _Radio_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(317);



/**
 * @summary A checkable input in a group of elements with the same role,
 *  only one of which can be checked at a time.
 * @see https://www.w3.org/TR/wai-aria-1.1/#radio
 */
class Radio extends _lib_ariamodule__WEBPACK_IMPORTED_MODULE_0__.RoleRadio
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.value = init.hasOwnProperty('value')? init.value : null
    this.tabIndex = -1
    this.on('blur', this.onBlur)
    this.on('click', this.onClick)
    this.on('focus', this.onFocus)
    this.on('mousedown', this.onMouseDown)
  }

  /**
   * @param {FocusEvent} event
   */
  onBlur(event) {
    this.classList.remove('active')
    this.off('keydown', this.onKeyDown)
    this.off('keyup', this.onKeyUp)
  }

  /**
   * @param {MouseEvent} event
   */
  onClick(event) {
    if(this.disabled) {
      event.stopImmediatePropagation()
    }
    else if(!this.checked) {
      this.checked = true
    }
  }

  /**
   * @param {FocusEvent} event
   */
  onFocus(event) {
    this.on('keydown', this.onKeyDown)
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    if(event.key.startsWith('Arrow')) {
      this.onArrowKeyDown(event)
    }
    else if(event.key === ' ') {
      this.onKeyDown_Space(event)
    }
    this.on('keyup', this.onKeyUp, { once : true })
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowKeyDown(event) {
    event.preventDefault()
    const radios = this.group.radios
    let radio = this
    do {
      if(['ArrowLeft', 'ArrowUp'].includes(event.key)) {
        radio = radios[radios.indexOf(this) - 1] || radios[radios.length - 1]
      }
      else radio = radios[radios.indexOf(this) + 1] || radios[0]
    }
    while(radio.disabled)
    if(radio !== this) {
      radio.checked = true
      radio.focus()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Space(event) {
    event.preventDefault()
    this.classList.add('active')
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyUp(event) {
    if(event.key === ' ') {
      this.classList.remove('active')
      this.click()
    }
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseDown(event) {
    if(this.disabled) {
      return
    }
    this.classList.add('active')
    this.on('mouseleave', this.onMouseLeave, { once : true })
    this.on('mouseup', this.onMouseUp, { once : true })
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseLeave(event) {
    this.classList.remove('active')
    this.off('mouseup', this.onMouseUp)
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseUp(event) {
    this.classList.remove('active')
    this.off('mouseleave', this.onMouseLeave)
  }
}


/***/ }),
/* 317 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 318 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 319 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(286);
/* harmony import */ var _ListBox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(320);
// import api from './api'

// import { HtmlHr } from './lib'


const options = [
  'Rehearsal',
  'Lesson',
  'Practice',
  'Master class',
  'Concert',
  'Party',
  'Parking',
]

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => {
  // const rows = await api.findRows('Asset', { limit : null })
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_0__.Heading('ListBox'),
    /*new ListBox({
      labels : 'Ресурсы',
      multiSelectable : true,
      options : rows.map(row => ({ value : row.id, text : row.name })),
    }),
    new HtmlHr,*/
    /*new ListBox({
      labels : 'simple',
      readOnly : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
        selected : i === 3,
      })),
    }),
    new ListBox({
      labels : 'multiSelectable',
      multiSelectable : true,
      readOnly : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
        selected : 2 < i && i < 5,
      })),
    }),
    new ListBox({
      labels : 'checkable',
      checkable : true,
      readOnly : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
        checked : i === 4,
      })),
    }),
    new ListBox({
      labels : 'checkable + required',
      checkable : true,
      required : true,
      readOnly : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
        checked : i === 4,
      })),
    }),
    new ListBox({
      labels : 'multiSelectable + checked',
      multiSelectable : true,
      readOnly : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
        checked : i === 1 || i === 4,
      })),
    }),
    new ListBox({
      labels : 'checkable + multiSelectable',
      checkable : true,
      multiSelectable : true,
      readOnly : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
        checked : i === 1 || i === 4,
      })),
    }),
    new HtmlHr,
    new ListBox({
      labels : 'simple',
      value : 'Практика',
      options : options.map(value => ({
        value,
        text : value,
      })),
    }),
    new ListBox({
      labels : 'multiSelectable',
      multiSelectable : true,
      value : ['Урок', 'Мастер-класс', 'Концерт'],
      options : options.map(value => ({
        value,
        text : value,
      })),
    }),
    new ListBox({
      labels : 'checkable',
      checkable : true,
      value : 'Практика',
      options : options.map(value => ({
        value,
        text : value,
      })),
    }),
    new ListBox({
      labels : 'checkable + required',
      checkable : true,
      required : true,
      value : 'Практика',
      options : options.map(value => ({
        value,
        text : value,
      })),
    }),
    new ListBox({
      labels : 'multiSelectable + checked',
      multiSelectable : true,
      value : ['Репетиция', 'Практика', 'Вечеринка'],
      options : options.map(value => ({
        value,
        text : value,
        checked : false,
      })),
    }),
    new ListBox({
      labels : 'checkable + multiSelectable',
      checkable : true,
      multiSelectable : true,
      value : ['Репетиция', 'Практика', 'Вечеринка'],
      options : options.map(value => ({
        value,
        text : value,
      })),
    }),
    new HtmlHr,*/
    new _ListBox__WEBPACK_IMPORTED_MODULE_1__.ListBox({
      labels : 'Simple',
      options : options.map((value, i) => ({
        // value : i + 1,
        text : value,
      })),
    }),
    new _ListBox__WEBPACK_IMPORTED_MODULE_1__.ListBox({
      labels : 'MultiSelectable',
      multiSelectable : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
      })),
    }),
    new _ListBox__WEBPACK_IMPORTED_MODULE_1__.ListBox({
      labels : 'Checkable',
      checkable : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
      })),
    }),
    new _ListBox__WEBPACK_IMPORTED_MODULE_1__.ListBox({
      labels : 'Checkable + required',
      checkable : true,
      required : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
      })),
    }),
    new _ListBox__WEBPACK_IMPORTED_MODULE_1__.ListBox({
      labels : 'MultiSelectable + checked',
      multiSelectable : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
        checked : false,
      })),
    }),
    new _ListBox__WEBPACK_IMPORTED_MODULE_1__.ListBox({
      labels : 'MultiSelectable + checkable',
      checkable : true,
      multiSelectable : true,
      options : options.map((value, i) => ({
        value : i + 1,
        text : value,
      })),
    }),
    /*new ListBox({
      labels : 'Disabled',
      options : options.map((value, i) => ({
        text : value,
      })),
      disabled : true,
    }),*/
  ]
});


/***/ }),
/* 320 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ListBox": () => (/* binding */ ListBox),
/* harmony export */   "Option": () => (/* reexport safe */ _Option__WEBPACK_IMPORTED_MODULE_3__.Option)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Composite__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(321);
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(290);
/* harmony import */ var _Option__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(325);
/* harmony import */ var _ListBox_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(327);






let undefined
const map = Array.prototype.map
const sort = (i, j) => i - j

/**
 * @summary A widget that allows the user to select one or more items from a list of choices.
 * @see https://www.w3.org/TR/wai-aria-1.1/#listbox
 * todo Home + End + PageDown + PageUp
 * todo Type-ahead
 */
class ListBox extends _Composite__WEBPACK_IMPORTED_MODULE_1__.Composite
{
  /**
   * @param {any} init
   */
  constructor(init) {
    if(init && init.constructor !== Object) {
      init = { options : init }
    }
    super(init)
  }

  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this._anchor = null
    this._indexes = []
    this._checkable = false
    this._options = []
    this.children = this._control = new _Control__WEBPACK_IMPORTED_MODULE_2__.Control({
      onfocus : () => this.focus(), // scrollable element can receive focus in Firefox
    })
    if(!init.multiSelectable) {
      this.on(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaSelected, this.onSelected, { subtree : true })
      this.on(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaChecked, this.onChecked, { subtree : true })
    }
  }

  /**
   * @param {MutationRecord} record
   * @param {Option} elem
   */
  onSelected(record, elem) {
    if(!elem.selected) {
      return
    }
    const option = this._options.find(option => option !== elem && option.selected)
    option && (option.selected = false)
    this.activeDescendant = elem
  }

  /**
   * @param {MutationRecord} record
   * @param {Option} elem
   */
  onChecked(record, elem) {
    if(!elem.checked) {
      return
    }
    const option = this._options.find(option => option !== elem && option.checked)
    option && (option.checked = false)
  }

  /**
   * @param {{options,value}} init
   */
  assign(init) {
    const { options, value, ...rest } = init
    super.assign(rest)
    this.setProperty('options', options)
    this.setProperty('value', value)
  }

  /**
   * @param {array.Option|array.Object} options
   */
  appendOptions(options) {
    const multiSelectable = this.multiSelectable
    let i = this._options.length
    let checkable = this._checkable
    let anchor = this._anchor
    let activeDescendant
    this._control.append(options.map(option => {
      if(!option) {
        return
      }
      if(!(option instanceof _lib__WEBPACK_IMPORTED_MODULE_0__.DomElem)) {
        option = new this.constructor.Option(option)
      }
      option.index = i++
      this._options.push(option)
      if(multiSelectable && !anchor && option.selected) {
        anchor = option
      }
      option.selected && (activeDescendant = option)
      if(checkable) {
        if(option.checked === undefined) {
          option.checked = false
        }
      }
      else if(option.checked !== undefined) {
        checkable = true
      }
      return option
    }))
    anchor && (this._anchor = anchor)
    if(activeDescendant) {
      if(!multiSelectable) {
        const option = this.activeDescendant
        option && (option.selected = false)
      }
      this.activeDescendant = activeDescendant
    }
    this._checkable = checkable
  }

  /**
   * @param {boolean} [keepNode]
   */
  destroy(keepNode = false) {
    this._options = []
    super.destroy(keepNode)
  }

  /**
   * @param {number} offset
   * @param {KeyboardEvent|MouseEvent|TouchEvent} event
   * @return {Option|null}
   */
  shiftFocus(offset, event) {
    if(!this._checkable && this.readOnly) {
      return
    }
    const option = super.shiftFocus(offset, event)
    if(!option) {
      return null
    }
    if(this._anchor) {
      const [i, j] = [this._anchor.index, option.index].sort(sort)
      for(const item of this._options) {
        if(!item.disabled && !item.hidden) {
          item.selected = i <= item.index && item.index <= j
        }
      }
    }
    else for(const item of this._options) {
      if(!item.disabled && !item.hidden) {
        item.selected = item === option
      }
    }
    if(this._control.scrollHeight === this._control.clientHeight) {
      return
    }
    if(event instanceof KeyboardEvent) {
      this.scrollToOption(option, event.repeat? 'auto' : 'smooth')
      return
    }
    const { top, bottom, height } = option.rect
    const rect = this._control.rect
    if(bottom + height > rect.bottom) {
      this._control.scrollBy({ top : height, behavior : 'smooth' })
    }
    else if(top - height < rect.top) {
      this._control.scrollBy({ top : -height, behavior : 'smooth' })
    }
    return option
  }

  scrollToOption(option = this.activeDescendant, behavior = 'auto') {
    if(!option) {
      return
    }
    const clientHeight = this._control.clientHeight
    if(this._control.scrollHeight === clientHeight) {
      return
    }
    const { top, bottom, height } = option.rect
    const rect = this._control.rect
    if(bottom + height > rect.bottom || top - height < rect.top) {
      this._control.scrollTo({
        top : option.offsetTop + height / 2 - clientHeight / 2,
        behavior,
      })
    }
  }

  /**
   * @param {MutationRecord} record
   */
  onItem(record) {
    const options = map.call(record.addedNodes, node => _Option__WEBPACK_IMPORTED_MODULE_3__.Option.get(node)).reverse()
    const selectedOption = options.find(({ selected }) => selected)
    if(selectedOption) {
      this.activeDescendant = selectedOption
    }
    if(this.multiSelectable) {
      return
    }
    if(selectedOption) {
      for(const option of this._options) {
        option === selectedOption || (option.selected = false)
      }
    }
    if(this._checkable) {
      const checkedOption = options.find(({ checked }) => checked)
      if(checkedOption) {
        for(const option of this._options) {
          option === checkedOption || (option.checked = false)
        }
      }
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @param {ListBox} elem
   */
  onKeyDown(event, elem) {
    if(event.code.startsWith('Arrow')) {
      const activeDescendant = this.activeDescendant
      if(this.multiSelectable) {
        this._anchor = event.shiftKey? this._anchor || activeDescendant : null
      }
      if(!this._checkable) {
        super.onKeyDown(event, elem)
        this.activeDescendant === activeDescendant || this.emit('change')
        return
      }
    }
    super.onKeyDown(event, elem)
  }

  /**
   * @param {KeyboardEvent} event
   * @param {ListBox} elem
   */
  onKeyDown_KeyA(event, elem) {
    if(!event.ctrlKey && !event.metaKey) {
      return
    }
    event.preventDefault()
    if(!this._checkable && this.readOnly) {
      return
    }
    if(!this.multiSelectable) {
      return
    }
    let anchor, activeDescendant
    for(const option of this._options) {
      if(!option.disabled && !option.hidden && !option.selected) {
        option.selected = true
        anchor || (anchor = option)
        activeDescendant = option
      }
    }
    if(!anchor) {
      return
    }
    this._anchor = anchor
    this.activeDescendant = activeDescendant
    this._checkable || this.emit('change')
  }

  /**
   * @param {KeyboardEvent} event
   * @param {ListBox} elem
   */
  onKeyDown_Space(event, elem) {
    event.preventDefault()
    if(!this.multiSelectable) {
      const activeDescendant = this.activeDescendant
      activeDescendant && (activeDescendant.class.active = true)
      return
    }
    for(const option of this._options) {
      if(option.selected) {
        option.class.active = true
      }
    }
  }

  /**
   * @param {KeyboardEvent} event
   * @param {ListBox} elem
   */
  onKeyUp_Space(event, elem) {
    if(this.multiSelectable) {
      let change = false
      for(const option of this._options) {
        if(option.selected) {
          option.class.active = false
          if(this._checkable && !this.readOnly) {
            option.checked = !option.checked
            change = true
          }
        }
      }
      change && this.emit('change')
      return
    }
    const activeDescendant = this.activeDescendant
    if(!activeDescendant) {
      return
    }
    activeDescendant.class.active = false
    if(!this._checkable || this.readOnly) {
      return
    }
    const option = this._options.find(({ checked }) => checked)
    if(option === activeDescendant) {
      if(!this.required) {
        option.checked = false
        this.emit('change')
      }
      return
    }
    option && (option.checked = false)
    activeDescendant.checked = true
    this.emit('change')
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onMouseDown(event, elem) {
    super.onMouseDown(event, elem)
    if(!this._checkable && this.readOnly) {
      return
    }
    const option = elem.closest(_Option__WEBPACK_IMPORTED_MODULE_3__.Option)
    if(!option || option.disabled) {
      return
    }
    let activeDescendant = this.activeDescendant
    if(this.multiSelectable) {
      activeDescendant || (activeDescendant = option)
      if(!this._checkable) {
        this._indexes = [this._anchor? this._anchor.index : -1, activeDescendant.index]
      }
      if(!event.shiftKey) {
        this._anchor = option
        this._options.forEach(item => item.selected = item === option)
      }
      else this.shiftFocus(option.index - activeDescendant.index, event)
    }
    else {
      if(this._checkable) {
        const option = this._options.find(({ checked }) => checked)
        this._indexes = [option? option.index : -1]
        activeDescendant && (activeDescendant.selected = false)
      }
      else if(activeDescendant) {
        this._indexes = [activeDescendant.index]
        activeDescendant.selected = false
      }
      else this._indexes = [-1]
      option.selected || (option.selected = true)
    }
    this.activeDescendant = option
    this.on('mouseover', this.onMouseOver)
    this.doc.on('mouseup', this.onDocMouseUp, this)
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onMouseOver(event, elem) {
    if(!(elem instanceof _Option__WEBPACK_IMPORTED_MODULE_3__.Option) || elem.disabled) {
      return
    }
    this.shiftFocus(elem.index - this.activeDescendant.index, event)
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onDocMouseUp(event, elem) {
    this.off('mouseover', this.onMouseOver)
    this.doc.off('mouseup', this.onDocMouseUp, this)
    const { activeDescendant, multiSelectable } = this
    const indexes = multiSelectable?
      [this._anchor.index, activeDescendant.index].sort(sort) :
      [activeDescendant.index]
    if(this._checkable) {
      if(this.readOnly) {
        return
      }
      if(multiSelectable) {
        const options = this.options
        let [i, j] = indexes
        do options[i].checked = !options[i].checked
        while(i++ < j)
        this.emit('change')
        return
      }
      const option = this._options[this._indexes[0]]
      if(option === activeDescendant) {
        if(option.checked) {
          if(!this.required) {
            option.checked = false
            this.emit('change')
          }
          return
        }
        option.checked = true
        this.emit('change')
        return
      }
      option && (option.checked = false)
      activeDescendant.checked = true
      this.emit('change')
      return
    }
    String(indexes) === String(this._indexes.sort(sort)) || this.emit('change')
  }

  /**
   * @return {boolean}
   */
  get checkable() {
    return this._checkable
  }

  /**
   * @param {boolean} checkable
   */
  set checkable(checkable) {
    if(this._checkable = checkable) {
      // this.multiSelectable = true
    }
    for(const option of this._options) {
      if(checkable) {
        if(option.checked === undefined) {
          option.checked = false
        }
      }
      else if(option.checked !== undefined) {
        option.checked = undefined
      }
    }
  }

  /**
   * @returns {Option[]}
   */
  get options() {
    return this._options
  }

  /**
   * @param {Option[]} options
   */
  set options(options) {
    this._anchor = null
    this.activeDescendant = null
    this._options = []
    this._control.children = null
    this.appendOptions(options)
  }

  /**
   * @returns {any|array.any|null}
   */
  get value() {
    if(this.multiSelectable) {
      const value = []
      const attr = this._checkable? 'checked' : 'selected'
      for(const option of this._options) {
        option[attr] && value.push(option.value)
      }
      return value.length? value : null
    }
    if(this._checkable) {
      const option = this._options.find(({ checked }) => checked)
      return option? option.value : null
    }
    const activeDescendant = this.activeDescendant
    return activeDescendant && activeDescendant.value
  }

  /**
   * @param {any|array.any|null} value
   */
  set value(value) {
    const attr = this._checkable? 'checked' : 'selected'
    if(this.multiSelectable) {
      if(!Array.isArray(value)) {
        value = value === null? [] : [value]
      }
      let anchor, activeDescendant
      for(const option of this._options) {
        if(option[attr] = value.includes(option.value)) {
          anchor || (anchor = option)
          activeDescendant = option
        }
      }
      this._anchor = anchor
      this.activeDescendant = activeDescendant
      return
    }
    const oldOption = this._checkable?
      this._options.find(({ checked }) => checked) :
      this.activeDescendant
    const newOption = this._options.find(option => option.value === value)
    if(newOption === oldOption) {
      return
    }
    oldOption && (oldOption[attr] = false)
    newOption && (newOption[attr] = true)
    if(!this._checkable) {
      this.activeDescendant = newOption || null
    }
  }

  /**
   * @return {*[]}
   */
  get values() {
    const value = this.value
    if(value === null) {
      return []
    }
    return this.multiSelectable? value : [value]
  }

  /**
   * @returns {boolean}
   */
  get multiSelectable() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaMultiSelectable)
  }

  /**
   * @param {boolean} multiSelectable
   */
  set multiSelectable(multiSelectable) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaMultiSelectable, multiSelectable)
    if(multiSelectable) {
      this.off(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaSelected, this.onSelected)
      this.off(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaChecked, this.onChecked)
      return
    }
    this.on(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaSelected, this.onSelected, { subtree : true })
    this.on(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaChecked, this.onChecked, { subtree : true })
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaOrientation) || 'vertical'
  }

  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaOrientation, orientation)
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaReadOnly)
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaReadOnly, readOnly)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaRequired)
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaRequired, required)
  }

  /**
   * @returns {Option[]}
   */
  get selectedOptions() {
    return this.findAll(_Option__WEBPACK_IMPORTED_MODULE_3__.Option, ({ selected }) => selected)
  }

  /**
   * @returns {Option[]}
   */
  get checkedOptions() {
    return this.findAll(_Option__WEBPACK_IMPORTED_MODULE_3__.Option, ({ checked }) => checked)
  }
}

ListBox.Option = ListBox.Item = _Option__WEBPACK_IMPORTED_MODULE_3__.Option
ListBox.tabIndex = 0




/***/ }),
/* 321 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Composite": () => (/* binding */ Composite)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Item__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(322);
/* harmony import */ var _Widget__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(308);
/* harmony import */ var _Composite_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(324);





class Composite extends _Widget__WEBPACK_IMPORTED_MODULE_2__.Widget
{
  /**
   * @param {{}} init
   */
  init(init) {
    this.on(_Item__WEBPACK_IMPORTED_MODULE_1__.Item, this.onItem, { subtree : true })
    super.init(init)
  }

  /**
   * Focus the first focusable item
   */
  focus() {
    const item = this.focusableItem
    item && item.focus()
  }

  /**
   * @param {number} offset
   * @param {KeyboardEvent|MouseEvent|TouchEvent} event
   * @return {Item|null}
   */
  shiftFocus(offset, event) {
    const items = this.enabledItems
    if(!items.length) {
      return null
    }
    const activeDescendant = this.activeDescendant
    const index = activeDescendant?
      items.indexOf(activeDescendant) :
      offset < 0? items.length : -1
    const item = items[index + offset]
    item && item.focus()
    return item
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   */
  onFocusIn(event, elem) {
    super.onFocusIn(event, elem)
    if(elem instanceof this.constructor.Item) {
      this.activeDescendant = elem
    }
  }

  /*onMouseDown(event, elem) {
    super.onMouseDown(event, elem)
    const item = elem.closest(this.constructor.Item)
    if(!item) {
      return
    }
    const activeDescendant = this.activeDescendant
    if(activeDescendant !== item) {
      this.activeDescendant = item
    }
  }*/

  /**
   * @param {MutationRecord} record
   */
  onItem(record) {
    if(!this.activeDescendant && this.tabIndex === null) {
      this.activeDescendant = this.focusableItem
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_ArrowUp(event) {
    if(this.orientation === 'vertical') {
      event.preventDefault()
      this.shiftFocus(-1, event)
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_ArrowDown(event) {
    if(this.orientation === 'vertical') {
      event.preventDefault()
      this.shiftFocus(1, event)
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_ArrowLeft(event) {
    if(this.orientation === 'horizontal') {
      event.preventDefault()
      this.shiftFocus(-1, event)
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_ArrowRight(event) {
    if(this.orientation === 'horizontal') {
      event.preventDefault()
      this.shiftFocus(1, event)
    }
  }

  /**
   * @returns {Item|null}
   */
  get activeDescendant() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaActiveDescendant)
  }

  /**
   * @param {Item|null} activeDescendant
   */
  set activeDescendant(activeDescendant) {
    const item = this.activeDescendant
    if(item === activeDescendant) {
      return
    }
    if(item && item.tabIndex !== null) {
      item.tabIndex = -1
    }
    if(activeDescendant && activeDescendant.tabIndex !== null) {
      activeDescendant.tabIndex = 0
    }
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaActiveDescendant, activeDescendant)
  }

  /**
   * @return {Item[]}
   */
  get enabledItems() {
    return this.findAll(this.constructor.Item, item => {
      return !item.disabled && !item.hidden
    })
  }

  /**
   * @return {Item[]}
   */
  get items() {
    return this.findAll(this.constructor.Item)
  }

  /**
   * @return {DomElem}
   */
  get focusableItem() {
    return this.activeDescendant || this.find(this.constructor.Item, item => {
      return !item.disabled && !item.hidden
    })
  }
}

Composite.tabIndex = null
Composite.Item = _Item__WEBPACK_IMPORTED_MODULE_1__.Item


/***/ }),
/* 322 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Item": () => (/* binding */ Item)
/* harmony export */ });
/* harmony import */ var _Widget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(308);
/* harmony import */ var _Item_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(323);



class Item extends _Widget__WEBPACK_IMPORTED_MODULE_0__.Widget
{
}

Item.tabIndex = -1


/***/ }),
/* 323 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 324 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 325 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Option": () => (/* binding */ Option)
/* harmony export */ });
/* harmony import */ var _Item__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(322);
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _Option_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(326);




/**
 * @summary A selectable item in a select list.
 * @see https://www.w3.org/TR/wai-aria-1.1/#option
 *
 * Not to be confused with the native Option constructor of the HTML standard
 * @see https://www.w3.org/TR/html/single-page.html#dom-htmloptionelement-option
 */
class Option extends _Item__WEBPACK_IMPORTED_MODULE_0__.Item
{
  /**
   * @param {{}} init
   */
  init(init) {
    this._value = null
    super.init(init)
  }

  /**
   * Focus option
   */
  focus() {
    this.emit('focusin')
  }

  /**
   * @returns {boolean|string|undefined}
   */
  get checked() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_1__.AriaChecked)
  }

  /**
   * @param {boolean|string|undefined} checked
   */
  set checked(checked) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_1__.AriaChecked, checked)
  }

  /**
   * @returns {RoleListBox|*|null}
   */
  get listBox() {
    return this.closest(_lib__WEBPACK_IMPORTED_MODULE_1__.RoleListBox)
  }

  /**
   * @returns {number}
   */
  get posInSet() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_1__.AriaPosInSet)
  }

  /**
   * @param {number} posInSet
   */
  set posInSet(posInSet) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_1__.AriaPosInSet, posInSet)
  }

  /**
   * @returns {number}
   */
  get setSize() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_1__.AriaSetSize)
  }

  /**
   * @param {number} setSize
   */
  set setSize(setSize) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_1__.AriaSetSize, setSize)
  }

  /**
   * @returns {boolean}
   */
  get selected() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_1__.AriaSelected) || false
  }

  /**
   * @param {boolean} selected
   */
  set selected(selected) {
    if(!selected) {
      this.class.active = false
    }
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_1__.AriaSelected, selected)
  }

  /**
   * @return {any}
   */
  get value() {
    return /*this._value === null? this.text : */this._value
  }

  /**
   * @param {any} value
   */
  set value(value) {
    this._value = value
  }
}

Option.prototype.abbr = null
Option.prototype.index = -1
Option.tabIndex = null


/***/ }),
/* 326 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 327 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 328 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(286);
/* harmony import */ var _SelectBox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(329);
// import api from './api'

// import { HtmlHr } from './lib'


/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (/*async*/() => {
  // const assets = await api.findRows('Asset', { limit : null })
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_0__.Heading('SelectBox'),
    new _SelectBox__WEBPACK_IMPORTED_MODULE_1__.SelectBox({
      labels : 'Simple',
      options,
    }),
    new _SelectBox__WEBPACK_IMPORTED_MODULE_1__.SelectBox({
      labels : 'MultiSelectable',
      multiSelectable : true,
      options,
    }),
    new _SelectBox__WEBPACK_IMPORTED_MODULE_1__.SelectBox({
      labels : 'Checkable',
      checkable : true,
      options : options,
    }),
    new _SelectBox__WEBPACK_IMPORTED_MODULE_1__.SelectBox({
      labels : 'Checkable + required',
      checkable : true,
      required : true,
      options : options,
    }),
    new _SelectBox__WEBPACK_IMPORTED_MODULE_1__.SelectBox({
      labels : 'MultiSelectable + checkable',
      multiSelectable : true,
      checkable : true,
      options : options,
    }),
    new _SelectBox__WEBPACK_IMPORTED_MODULE_1__.SelectBox({
      labels : 'MultiSelectable + checked',
      multiSelectable : true,
      options : options.map(option => Object.assign({ checked : false }, option)),
    }),
    new _SelectBox__WEBPACK_IMPORTED_MODULE_1__.SelectBox({
      labels : 'Disabled',
      options,
      disabled : true,
    }),
    /*new HtmlHr,
    new SelectBox({
      labels : 'Ресурсы',
      options : assets.map(row => ({ value : row.id, text : row.name })),
    }),*/
  ]
});

const options = [
  {
    value : 'rehearsal',
    text : 'Rehearsal',
  },
  {
    value : 'lesson',
    text : 'Lesson',
  },
  {
    value : 'practice',
    text : 'Practice',
  },
  {
    value : 'masterclass',
    text : 'Master class',
  },
  {
    value : 'concert',
    text : 'Concert',
  },
  {
    value : 'party',
    text : 'Party',
  },
  {
    value : 'parking',
    text : 'Parking',
  },
]


/***/ }),
/* 329 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SelectBox": () => (/* binding */ SelectBox),
/* harmony export */   "ListBox": () => (/* reexport safe */ _ListBox__WEBPACK_IMPORTED_MODULE_3__.ListBox),
/* harmony export */   "Option": () => (/* reexport safe */ _Option__WEBPACK_IMPORTED_MODULE_4__.Option)
/* harmony export */ });
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(290);
/* harmony import */ var _ComboBox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(330);
/* harmony import */ var _Inner__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(331);
/* harmony import */ var _ListBox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(320);
/* harmony import */ var _Option__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(325);
/* harmony import */ var _SelectBox_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(332);







const NBSP = ' '

class SelectBox extends _ComboBox__WEBPACK_IMPORTED_MODULE_1__.ComboBox
{
  /**
   * @param {{}} init
   * @param {string} [init.text]
   * @param {ListBox|{}} [init.listBox]
   */
  init(init) {
    super.init(init)
    this._text = init.text || NBSP
    this.expanded = false
    this.hasPopup = 'listbox'
    this.children = new _Control__WEBPACK_IMPORTED_MODULE_0__.Control(this._inner = new _Inner__WEBPACK_IMPORTED_MODULE_2__.Inner(NBSP))
    if(!init.listBox) {
      this.listBox = new this.constructor.ListBox
    }
  }

  /**
   * @param {{}} init
   * @param {ListBox|{}} [init.listBox]
   * @param {Option[]} [init.options]
   */
  assign(init) {
    const { listBox, options, ...rest } = init
    this.setProperty('listBox', listBox)
    this.setProperty('options', options)
    super.assign(rest)
  }

  /**
   * Update widget content
   */
  updateText() {
    const options = this.checkable? this.checkedOptions : this.selectedOptions
    this.text = options.length?
      options.map(({ abbr, text }) => abbr || text).join(this.constructor.TEXT_DELIMITER) :
      this._text
  }

  /**
   * Activate widget
   */
  activate() {
    if(!this.listBox) {
      this.listBox = new this.constructor.ListBox
    }
    super.activate()
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    super.onKeyDown(...arguments)
    if(!event.code.startsWith('Arrow')) {
      return
    }
    event.preventDefault()
    if(!this.expanded) {
      this.expanded = true
      return
    }
    this.listBox.emit('keydown', {
      code : event.code,
      shiftKey : event.shiftKey,
    })
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Backspace(event) {
    if(this.required || !this.value) {
      return
    }
    this.value = null
    this.emit('change')
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Enter(event) {
    if(this.expanded && this.checkable) {
      this.listBox.emit('keyup', { code : 'Space' })
    }
    super.onKeyDown_Enter(...arguments)
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_KeyA(event) {
    this.listBox.emit('keydown', { code : event.code })
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Space(event) {
    event.preventDefault()
    if(event.repeat) {
      return
    }
    if(this.expanded && this.checkable && this.selectedOptions.length) {
      this.listBox.emit('keydown', { code : event.code })
    }
    else super.onKeyDown_Space(...arguments)
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyUp_Space(event) {
    if(this.expanded && this.checkable && this.selectedOptions.length) {
      this.listBox.emit('keyup', { code : event.code })
      this.class.active = false
      if(this.multiSelectable || !this.required) {
        return
      }
    }
    super.onKeyUp_Space(...arguments)
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Escape(event) {
    if(!this.expanded) {
      return
    }
    event.stopPropagation()
    this.expanded = false
  }

  /**
   * @param {MouseEvent} event
   */
  onListBoxClick(event) {
    event.stopPropagation()
    this.focus()
    if(this.multiSelectable) {
      return
    }
    if(this.checkable && !this.required) {
      return
    }
    this.expanded = false
  }

  /**
   * @param {Event} event
   */
  onListBoxChange(event) {
    event.stopPropagation()
    this.updateText()
    this.emit('change')
  }

  /**
   * @return {boolean}
   */
  get checkable() {
    return this.listBox.checkable
  }

  /**
   * @param checkable
   */
  set checkable(checkable) {
    this.listBox.checkable = true
  }

  /**
   * @return {boolean}
   */
  get expanded() {
    return super.expanded
  }

  /**
   * @param {boolean} expanded
   */
  set expanded(expanded) {
    if(super.expanded = expanded) {
      this.listBox.scrollToOption()
    }
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return super.disabled
  }

  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    super.disabled = this.listBox.disabled = disabled
  }

  /**
   * @returns {ListBox|null}
   */
  get listBox() {
    return this.controls.find(elem => elem instanceof this.constructor.ListBox) || null
  }

  /**
   * @param {ListBox|null} listBox
   */
  set listBox(listBox) {
    if(!listBox) {
      this.controls = null
      return
    }
    if(listBox.constructor === Object) {
      listBox = new this.constructor.ListBox(listBox)
    }
    this.controls = [
      listBox,
      new this.constructor.Popup({
        anchor : this,
        children : listBox,
      }),
    ]
    listBox.tabIndex = null
    listBox.on('click', this.onListBoxClick, this)
    listBox.on('change', this.onListBoxChange, this)
  }

  /**
   * @returns {boolean}
   */
  get multiSelectable() {
    return this.listBox.multiSelectable
  }

  /**
   * @param {boolean} multiSelectable
   */
  set multiSelectable(multiSelectable) {
    this.listBox.multiSelectable = multiSelectable
  }

  /**
   * @returns {Option[]}
   */
  get options() {
    const listBox = this.listBox
    return listBox? listBox.options : []
  }

  /**
   * @param {Option[]} options
   */
  set options(options) {
    const listBox = this.listBox
    listBox.options = options
    this.updateText()
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return super.readOnly
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    super.readOnly = this.listBox.readOnly = readOnly
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return super.required
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    super.required = this.listBox.required = required
  }

  /**
   * @returns {Option[]}
   */
  get selectedOptions() {
    return this.listBox.selectedOptions
  }

  /**
   * @returns {Option[]}
   */
  get checkedOptions() {
    return this.listBox.checkedOptions
  }

  /**
   * @return {string}
   */
  get text() {
    return this._inner.text
  }

  /**
   * @param {string} text
   */
  set text(text) {
    this._inner.text = text
  }

  /**
   * @returns {string|array}
   */
  get value() {
    return this.listBox.value
  }

  /**
   * @param {string|array} value
   */
  set value(value) {
    this.listBox.value = value
    this.updateText()
  }

  /**
   * @return {string[]}
   */
  get values() {
    return this.listBox.values
  }
}

SelectBox.ListBox = _ListBox__WEBPACK_IMPORTED_MODULE_3__.ListBox
SelectBox.TEXT_DELIMITER = ', '




/***/ }),
/* 330 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ComboBox": () => (/* binding */ ComboBox)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Popup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(292);
/* harmony import */ var _Widget__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(308);




class ComboBox extends _Widget__WEBPACK_IMPORTED_MODULE_2__.Widget
{
  /**
   * Activate widget
   */
  activate() {
    this.expanded = !this.expanded
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Enter(event) {
    event.stopPropagation()
    this.activate()
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Escape(event) {
    if(this.expanded) {
      event.stopPropagation()
      this.expanded = false
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Space(event) {
    event.preventDefault()
    this.class.active = true
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyUp_Space(event) {
    this.class.active = false
    this.click()
  }

  /**
   * @param {MutationRecord} record
   */
  onPopupHidden(record) {
    this.expanded = !this.popup.hidden
  }

  /**
   * @returns {string}
   */
  get autoComplete() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaAutoComplete)
  }

  /**
   * @param {string} autoComplete
   */
  set autoComplete(autoComplete) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaAutoComplete, autoComplete)
  }

  /**
   * @param {*} controls
   */
  set controls(controls) {
    const oldPopup = this.popup
    super.controls = controls
    const newPopup = this.popup
    if(oldPopup !== newPopup) {
      oldPopup && oldPopup.destroy()
      newPopup && newPopup.addAttrObserver('hidden', this.onPopupHidden, this)
    }
  }

  /**
   * @returns {*[]}
   */
  get controls() {
    return super.controls
  }

  /**
   * @returns {boolean}
   */
  get expanded() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded) || false
  }

  /**
   * @param {boolean} expanded
   */
  set expanded(expanded) {
    if(expanded === this.expanded) {
      return
    }
    if(this.hasPopup) {
      const popup = this.popup
      if(popup) {
        expanded? popup.show() : popup.close()
      }
    }
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded, expanded)
  }

  /**
   * @returns {string}
   */
  get hasPopup() {
    return super.hasPopup || 'listbox'
  }

  /**
   * @param {string} hasPopup
   */
  set hasPopup(hasPopup) {
    super.hasPopup = hasPopup
  }

  /**
   * @returns {Popup|null}
   */
  get popup() {
    return this.controls.find(elem => elem instanceof _Popup__WEBPACK_IMPORTED_MODULE_1__.Popup) || null
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaReadOnly)
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaReadOnly, readOnly)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaRequired)
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaRequired, required)
  }
}

ComboBox.Popup = _Popup__WEBPACK_IMPORTED_MODULE_1__.Popup


/***/ }),
/* 331 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Inner": () => (/* binding */ Inner)
/* harmony export */ });
/* harmony import */ var _lib_htmlmodule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(87);


class Inner extends _lib_htmlmodule__WEBPACK_IMPORTED_MODULE_0__.HtmlDiv
{
}


/***/ }),
/* 332 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 333 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(286);
/* harmony import */ var _TextBox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(334);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_0__.Heading('TextBox'),
    new _TextBox__WEBPACK_IMPORTED_MODULE_1__.TextBox({
      labels : 'Simple',
    }),
    new _TextBox__WEBPACK_IMPORTED_MODULE_1__.TextBox({
      labels : 'Value',
      value : 'Hello world!',
    }),
    new _TextBox__WEBPACK_IMPORTED_MODULE_1__.TextBox({
      labels : 'Disabled',
      value : 'Hello world!',
      disabled : true,
    }),
    new _TextBox__WEBPACK_IMPORTED_MODULE_1__.TextBox({
      labels : 'MultiLine',
      value : 'Hello world!',
      multiLine : true,
    }),
  ]
});


/***/ }),
/* 334 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TextBox": () => (/* binding */ TextBox)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(290);
/* harmony import */ var _Edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(335);
/* harmony import */ var _Placeholder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(337);
/* harmony import */ var _Popup__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(292);
/* harmony import */ var _Widget__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(308);
/* harmony import */ var _TextBox_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(338);








let undefined

/**
 * @summary A type of input that allows free-form text as its value.
 * @see https://www.w3.org/TR/wai-aria-1.1/#textbox
 */
class TextBox extends _Widget__WEBPACK_IMPORTED_MODULE_5__.Widget
{
  /**
   * @param {{}} init
   */
  build(init) {
    return this._control = new _Control__WEBPACK_IMPORTED_MODULE_1__.Control(this._edit = new this.constructor.Edit)
  }

  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this._value = ''
    this._placeholder = null
    this.class.blank = true
    this.on('input', this.onInput)
    this.on('focusin', this.onFocusIn)
    this.on('focusout', this.onFocusOut)
    this._observer = new MutationObserver(this.onEditUpdate.bind(this))
    this._observer.observe(this._edit.node, {
      childList : true,
      characterData : true,
      subtree : true
    })
  }

  /**
   * @param {boolean} [keepNode=false]
   */
  destroy(keepNode = false) {
    this._observer.disconnect()
    super.destroy(keepNode)
  }

  /**
   * Activate widget
   */
  activate() {
    const expanded = this.expanded
    if(expanded !== undefined) {
      this.expanded = !expanded
    }
  }

  checkValidity() {
    return !this.required || !!this.value
  }

  reportValidity() {
    return !(this.invalid = !this.checkValidity())
  }

  /**
   * @param {MutationRecord[]} records
   */
  onEditUpdate(records) {
    this.class.blank = !this._edit.text
  }

  /**
   * @param {FocusEvent} event
   */
  onFocus(event) {
    this._edit.focus()
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   */
  onFocusIn(event, elem) {
    this._value = this.value
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   */
  onFocusOut(event, elem) {
    if(this.value !== this._value) {
      this.emit('change')
    }
  }

  /**
   * @param {InputEvent} event
   * @param {DomElem} elem
   */
  onInput(event, elem) {
    this.invalid = false
  }

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyDown_Enter(event, elem) {
    this.multiLine? event.stopPropagation() : event.preventDefault()
    if(this.value === this._value) {
      return
    }
    this._value = this.value
    this.emit('change')
  }

  /**
   * @param {MutationRecord} record
   */
  onPopupHidden(record) {
    this.expanded = !this.popup.hidden
  }

  /**
   * @returns {DomElem|null}
   */
  get activeDescendant() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaActiveDescendant)
  }

  /**
   * @param {DomElem|null} activeDescendant
   */
  set activeDescendant(activeDescendant) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaActiveDescendant, activeDescendant)
  }

  /**
   * @returns {string}
   */
  get autoComplete() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaAutoComplete)
  }

  /**
   * @param {string} autoComplete
   */
  set autoComplete(autoComplete) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaAutoComplete, autoComplete)
  }

  /**
   * @returns {*[]}
   */
  get controls() {
    return super.controls
  }

  /**
   * @param {*} controls
   */
  set controls(controls) {
    const oldPopup = this.popup
    super.controls = controls
    const newPopup = this.popup
    if(oldPopup !== newPopup) {
      oldPopup && oldPopup.destroy()
      newPopup && newPopup.addAttrObserver('hidden', this.onPopupHidden, this)
    }
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return super.disabled
  }

  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    super.disabled = this._edit.disabled = disabled
  }

  /**
   * @returns {boolean|undefined}
   */
  get expanded() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded)
  }

  /**
   * @param {boolean|undefined} expanded
   */
  set expanded(expanded) {
    if(expanded === this.expanded) {
      return
    }
    if(this.hasPopup) {
      const popup = this.popup
      if(popup) {
        expanded? popup.show() : popup.close()
      }
    }
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaExpanded, expanded)
  }

  /**
   * @returns {boolean}
   */
  get multiLine() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaMultiLine)
  }

  /**
   * @param {boolean} multiLine
   */
  set multiLine(multiLine) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaMultiLine, multiLine)
  }

  /**
   * @returns {string}
   */
  get placeholder() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaPlaceholder)
  }

  /**
   * @param {string} placeholder
   */
  set placeholder(placeholder) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaPlaceholder, placeholder)
    if(this._placeholder) {
      this._placeholder.text = placeholder
      return
    }
    this._edit.before(this._placeholder = new this.constructor.Placeholder(placeholder))
  }

  /**
   * @returns {Popup|null}
   */
  get popup() {
    return this.controls.find(elem => elem instanceof _Popup__WEBPACK_IMPORTED_MODULE_4__.Popup) || null
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaReadOnly)
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaReadOnly, this._edit.readOnly = readOnly)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaRequired)
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaRequired, required)
  }

  /**
   * @return {string}
   */
  get text() {
    return this._edit.text
  }

  /**
   * @param {string} text
   */
  set text(text) {
    this._edit.text = this.multiLine?
      text :
      text && String(text).replace(/\s/g, ' ')
  }

  /**
   * @returns {string}
   */
  get value() {
    return this.text
  }

  /**
   * @param {string} value
   */
  set value(value) {
    this.text = this._value = value
  }
}

TextBox.tabIndex = -1
TextBox.Edit = _Edit__WEBPACK_IMPORTED_MODULE_2__.Edit
TextBox.Placeholder = _Placeholder__WEBPACK_IMPORTED_MODULE_3__.Placeholder
TextBox.Popup = _Popup__WEBPACK_IMPORTED_MODULE_4__.Popup


/***/ }),
/* 335 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Edit": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var _clipboardData__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(336);
/* harmony import */ var _clipboardData__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_clipboardData__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);



const NBSP = ' '

class Edit extends _lib__WEBPACK_IMPORTED_MODULE_1__.HtmlDiv
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.tabIndex = 0
    this.contentEditable = 'plaintext-only'
    this.on('paste', this.onPaste)
  }

  /**
   * @param {ClipboardEvent} event
   */
  onPaste(event) {
    event.preventDefault()
    if(this.readOnly) {
      return
    }
    const text = this.text
    const selection = getSelection()
    const { anchorOffset, focusOffset } = selection
    const startOffset = Math.min(anchorOffset, focusOffset)
    const endOffset = Math.max(anchorOffset, focusOffset)
    const beforeText = text.slice(0, startOffset)
    const afterText = text.slice(endOffset, text.length)
    const data = event.clipboardData.getData('text')
    this.value = beforeText + data + afterText
    selection.collapse(this.node.firstChild, beforeText.length + data.length)
    this.emit('input')
  }

  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    this._disabled = disabled
    this.contentEditable = disabled? 'false' : 'plaintext-only'
    this.tabIndex = disabled? null : 0
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return this._disabled
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this._readOnly = readOnly
    this.contentEditable = readOnly? 'false' : 'plaintext-only'
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this._readOnly
  }

  /**
   * @param {string|*} value
   */
  set value(value) {
    this.text = value === null? '' : String(value).replace(/\s\s/g, ' ' + NBSP)
  }

  /**
   * @returns {string}
   */
  get value() {
    return this.text.replace(/\s/g, ' ')
  }
}


/***/ }),
/* 336 */
/***/ (() => {

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


/***/ }),
/* 337 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Placeholder": () => (/* binding */ Placeholder)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);


class Placeholder extends _lib__WEBPACK_IMPORTED_MODULE_0__.HtmlDiv
{
}


/***/ }),
/* 338 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 339 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(286);
/* harmony import */ var _SpinButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(340);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_0__.Heading('SpinButton'),
    new _SpinButton__WEBPACK_IMPORTED_MODULE_1__.SpinButton({
      labels : 'Simple',
    }),
    new _SpinButton__WEBPACK_IMPORTED_MODULE_1__.SpinButton({
      labels : 'Disabled',
      disabled : true,
    }),
  ]
});


/***/ }),
/* 340 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "SpinButton": () => (/* binding */ SpinButton)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(289);
/* harmony import */ var _Complex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(341);
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(290);
/* harmony import */ var _Inner__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(331);
/* harmony import */ var _SpinButton_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(343);







const MINUS = '−'

/**
 * @summary A form of range that expects the user to select from among discrete choices.
 * @see https://www.w3.org/TR/wai-aria-1.1/#spinbutton
 */
class SpinButton extends _Complex__WEBPACK_IMPORTED_MODULE_2__.Complex
{
  /**
   * @param {{}} init
   * @return {Control}
   */
  build(init) {
    return new _Control__WEBPACK_IMPORTED_MODULE_3__.Control([
      this._decrButton = new _Button__WEBPACK_IMPORTED_MODULE_1__.Button({
        tabIndex : null,
        onmousedown : () => {
          this._decrButton.disabled || this._startTimeout(() => this.decrement())
        }
      }),
      this._inner = new _Inner__WEBPACK_IMPORTED_MODULE_4__.Inner,
      this._incrButton = new _Button__WEBPACK_IMPORTED_MODULE_1__.Button({
        tabIndex : null,
        onmousedown : () => {
          this._incrButton.disabled || this._startTimeout(() => this.increment())
        }
      }),
    ])
  }

  /**
   * @return {boolean}
   */
  increment() {
    if(this.readOnly) {
      return false
    }
    let valueNow = this.valueNow || 0
    if(valueNow === this.valueMax) {
      return false
    }
    this.valueNow = valueNow + this.step
    return true
  }

  /**
   * @return {boolean}
   */
  decrement() {
    if(this.readOnly) {
      return false
    }
    let valueNow = this.valueNow || 0
    if(valueNow === this.valueMin) {
      return false
    }
    this.valueNow = valueNow - this.step
    return true
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Home(event) {
    event.preventDefault()
    const valueMin = this.valueMin
    if(this.readOnly || valueMin === -Infinity || this.valueNow === valueMin) {
      return
    }
    this.valueNow = valueMin
    this.emit('change')
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_End(event) {
    event.preventDefault()
    const valueMax = this.valueMax
    if(this.readOnly || valueMax === Infinity || this.valueNow === valueMax) {
      return
    }
    this.valueNow = valueMax
    this.emit('change')
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_ArrowUp(event) {
    event.preventDefault()
    this.increment() && this.emit('change')
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_ArrowDown(event) {
    event.preventDefault()
    this.decrement() && this.emit('change')
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Backspace(event) {
    event.preventDefault()
    if(this.required || isNaN(this.valueNow)) {
      return
    }
    this.valueNow = NaN
    this.emit('change')
  }
  
  updateState() {
    const { disabled, valueNow } = this
    this._decrButton.disabled = disabled || !isNaN(valueNow) && valueNow <= this.valueMin
    this._incrButton.disabled = disabled || !isNaN(valueNow) && valueNow >= this.valueMax
  }

  /**
   * @param {function} callback
   * @param {number} [delay]
   * @private
   */
  _startTimeout(callback, delay) {
    if(!callback()) {
      return
    }
    const id = setTimeout(() => this._startTimeout(callback, 50), delay || 500)
    const stopTimeout = () => {
      clearTimeout(id)
      this.off('mouseout', stopTimeout)
      this.off('mouseup', stopTimeout)
      delay || this.emit('change')
    }
    this.on('mouseout', stopTimeout)
    this.on('mouseup', stopTimeout)
  }

  /**
   * @returns {boolean}
   */
  get disabled() {
    return super.disabled
  }

  /**
   * @param {boolean} disabled
   */
  set disabled(disabled) {
    super.disabled = disabled
    this.updateState()
  }

  /**
   * @param {boolean} readOnly
   */
  set readOnly(readOnly) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaReadOnly, readOnly)
  }

  /**
   * @returns {boolean}
   */
  get readOnly() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaReadOnly)
  }

  /**
   * @param {boolean} required
   */
  set required(required) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaRequired, required)
  }

  /**
   * @returns {boolean}
   */
  get required() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaRequired)
  }

  /**
   * @return {string}
   */
  get text() {
    return this._inner.text
  }

  /**
   * @param {string} text
   */
  set text(text) {
    this._inner.text = text
  }

  /**
   * @return {string}
   */
  get value() {
    const valueNow = this.valueNow
    return isNaN(valueNow)? '' : String(valueNow)
  }

  /**
   * @param {string} value
   */
  set value(value) {
    this.valueNow = +value
  }

  /**
   * @returns {number}
   */
  get valueNow() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaValueNow)
  }

  /**
   * @param {number} valueNow
   */
  set valueNow(valueNow) {
    if(isNaN(valueNow)) {
      this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaValueNow, NaN)
      this._inner.text = null
    }
    else {
      const value = Math.min(Math.max(+valueNow.toFixed(10), this.valueMin), this.valueMax)
      this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaValueNow, value)
      this._inner.text = String(value).replace(/-/, MINUS)
    }
    this.updateState()
  }

  /**
   * @returns {number}
   */
  get valueMin() {
    const valueMin = this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaValueMin)
    return isNaN(valueMin)? -Infinity : valueMin
  }

  /**
   * @param {number} valueMin
   */
  set valueMin(valueMin) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaValueMin, valueMin)
    this.updateState()
  }

  /**
   * @returns {number}
   */
  get valueMax() {
    const valueMax = this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaValueMax)
    return isNaN(valueMax)? Infinity : valueMax
  }

  /**
   * @param {number} valueMax
   */
  set valueMax(valueMax) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaValueMax, valueMax)
    this.updateState()
  }

  /**
   * @returns {string}
   */
  get valueText() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaValueText)
  }

  /**
   * @param {string} valueText
   */
  set valueText(valueText) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaValueText, valueText)
  }
}

SpinButton.prototype.name = null
SpinButton.prototype.step = 1
SpinButton.tabIndex = 0


/***/ }),
/* 341 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Complex": () => (/* binding */ Complex)
/* harmony export */ });
/* harmony import */ var _Widget__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(308);
/* harmony import */ var _Complex_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(342);



class Complex extends _Widget__WEBPACK_IMPORTED_MODULE_0__.Widget
{
  init(init) {
    super.init(init)
    this.on('change', this.onChange)
  }

  focus() {
    const widget = this.find(_Widget__WEBPACK_IMPORTED_MODULE_0__.Widget, ({ disabled, hidden }) => !disabled && !hidden)
    widget && widget.focus()
  }

  onChange(event, elem) {
    if(elem === this) {
      return
    }
    event.stopImmediatePropagation()
    this.onWidgetChange(event, elem)
  }

  onWidgetChange(event, elem) {
    this.emit('change')
  }

  get disabled() {
    return super.disabled
  }

  set disabled(disabled) {
    this.findAll(_Widget__WEBPACK_IMPORTED_MODULE_0__.Widget).forEach(widget => widget.disabled = disabled)
    super.disabled = disabled
  }
}

Complex.tabIndex = null


/***/ }),
/* 342 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 343 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 344 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(286);
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(345);
/* harmony import */ var _MenuButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(349);
/* harmony import */ var _PopupMenu__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(350);





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_0__.Heading('MenuButton + PopupMenu'),
    new _MenuButton__WEBPACK_IMPORTED_MODULE_2__.MenuButton({
      menu : new _PopupMenu__WEBPACK_IMPORTED_MODULE_3__.PopupMenu([
        new _Menu__WEBPACK_IMPORTED_MODULE_1__.MenuItem('Events'),
        new _Menu__WEBPACK_IMPORTED_MODULE_1__.MenuItem('Groups'),
        new _Menu__WEBPACK_IMPORTED_MODULE_1__.MenuItem('Friends'),
        new _Menu__WEBPACK_IMPORTED_MODULE_1__.MenuItem('Equipment'),
        new _Menu__WEBPACK_IMPORTED_MODULE_1__.MenuItem('Rooms'),
        new _Menu__WEBPACK_IMPORTED_MODULE_1__.MenuItem('Schedule'),
        new _Menu__WEBPACK_IMPORTED_MODULE_1__.MenuItem('Information'),
        new _Menu__WEBPACK_IMPORTED_MODULE_1__.MenuItem('Rules'),
        new _Menu__WEBPACK_IMPORTED_MODULE_1__.MenuItem('Exit'),
      ]),
      text : 'User menu',
    }),
  ]
});


/***/ }),
/* 345 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Menu": () => (/* binding */ Menu),
/* harmony export */   "MenuItem": () => (/* reexport safe */ _MenuItem__WEBPACK_IMPORTED_MODULE_1__.MenuItem)
/* harmony export */ });
/* harmony import */ var _lib_ariamodule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43);
/* harmony import */ var _MenuItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(346);
/* harmony import */ var _Menu_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(348);




/**
 * @summary A type of widget that offers a list of choices to the user.
 * @see https://www.w3.org/TR/wai-aria-1.1/#menu
 */
class Menu extends _lib_ariamodule__WEBPACK_IMPORTED_MODULE_0__.RoleMenu
{
  /**
   * @return {MenuItem|null}
   */
  get currentItem() {
    return this.find(_MenuItem__WEBPACK_IMPORTED_MODULE_1__.MenuItem, ({ current }) => current)
  }
}




/***/ }),
/* 346 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MenuItem": () => (/* binding */ MenuItem)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Popup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(292);
/* harmony import */ var _MenuItem_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(347);





/**
 * @summary An option in a set of choices contained by a menu or menubar.
 * @see https://www.w3.org/TR/wai-aria-1.1/#menuitem
 */
class MenuItem extends _lib__WEBPACK_IMPORTED_MODULE_0__.RoleMenuItem
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.tabIndex = -1
    this.on('click', this.onClick)
    this.on('focus', this.onFocus)
    this.on('keydown', this.onKeyDown)
    // this.on('mouseenter', this.onMouseEnter)
  }

  /**
   * Activate the menu item
   */
  activate() {
    void null
  }

  /**
   * @param {Event} event
   */
  onClick(event) {
    if(this.disabled) {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
    else {
      event.stopPropagation()
      this.activate()
    }
  }

  /**
   * @param {FocusEvent} event
   */
  onFocus(event) {
    const menuBar = this.menuBar
    if(!menuBar) {
      return
    }
    for(const item of menuBar.items) {
      if(!item.disabled) {
        item.tabIndex = item === this? 0 : -1
      }
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    switch(event.key) {
      case ' ':
        this.onKeyDown_Space(event)
        break
      case 'Enter':
        this.onKeyDown_Enter(event)
        break
      default:
        event.key.startsWith('Arrow') && this.onArrowKeyDown(event)
    }
    this.on('keyup', this.onKeyUp, { once : true })
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowKeyDown(event) {
    event.preventDefault()
    switch(event.key) {
      case 'ArrowUp':
        this.onArrowUpKeyDown(event)
        break
      case 'ArrowRight':
        this.onArrowRightKeyDown(event)
        break
      case 'ArrowDown':
        this.onArrowDownKeyDown(event)
        break
      case 'ArrowLeft':
        this.onArrowLeftKeyDown(event)
        break
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowUpKeyDown(event) {
    const parentMenu = this.parentMenu
    if(parentMenu.orientation === 'vertical') {
      const items = parentMenu.items.filter(({ disabled }) => !disabled)
      const index = items.indexOf(this) - 1
      items[index < 0? items.length - 1 : index].focus()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowDownKeyDown(event) {
    const parentMenu = this.parentMenu
    if(parentMenu.orientation === 'vertical') {
      const items = parentMenu.items.filter(({ disabled }) => !disabled)
      const index = items.indexOf(this) + 1
      items[index === items.length? 0 : index].focus()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowLeftKeyDown(event) {
    const parentMenu = this.parentMenu
    if(parentMenu.orientation === 'horizontal') {
      const items = parentMenu.items.filter(({ disabled }) => !disabled)
      const index = items.indexOf(this) - 1
      items[index < 0? items.length - 1 : index].focus()
      return
    }
    if(parentMenu instanceof _lib__WEBPACK_IMPORTED_MODULE_0__.Role.MenuBar) {
      return
    }
    const ancestorMenu = parentMenu.parentMenu
    if(!ancestorMenu) {
      return
    }
    const item = ancestorMenu.find(MenuItem, ({ expanded }) => expanded)
    if(!item) {
      return
    }
    if(ancestorMenu.orientation === 'horizontal') {
      const items = ancestorMenu.items.filter(({ disabled }) => !disabled)
      const index = items.indexOf(item) - 1
      items[index < 0? items.length - 1 : index].focus()
      return
    }
    item.focus()
    parentMenu.closest(_Popup__WEBPACK_IMPORTED_MODULE_1__.Popup).anchor.expanded = false
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowRightKeyDown(event) {
    const parentMenu = this.parentMenu
    if(parentMenu.orientation === 'horizontal') {
      const items = parentMenu.items.filter(({ disabled }) => !disabled)
      const index = items.indexOf(this) + 1
      items[index === items.length? 0 : index].focus()
      return
    }
    if(parentMenu instanceof _lib__WEBPACK_IMPORTED_MODULE_0__.Role.MenuBar) {
      return
    }
    const menuBar = this.closest(_lib__WEBPACK_IMPORTED_MODULE_0__.Role.MenuBar)
    if(menuBar && menuBar.orientation === 'horizontal') {
      const items = menuBar.items.filter(({ disabled }) => !disabled)
      const item = menuBar.find(MenuItem, ({ expanded }) => expanded)
      const index = items.indexOf(item) + 1
      items[index === items.length? 0 : index].focus()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Space(event) {
    event.preventDefault()
    this.classList.add('active')
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Enter(event) {
    this.activate()
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyUp(event) {
    if(event.key === ' ') {
      this.classList.remove('active')
      this.click()
    }
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseEnter(event) {
    if(this.disabled) {
      return
    }
    const parentMenu = this.parentMenu
    if(parentMenu.contains(this.doc.activeElem)) {
      this.focus()
    }
  }
}


/***/ }),
/* 347 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 348 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 349 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MenuButton": () => (/* binding */ MenuButton)
/* harmony export */ });
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(289);
/* harmony import */ var _PopupMenu__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(350);
/* harmony import */ var _MenuButton_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(352);




class MenuButton extends _Button__WEBPACK_IMPORTED_MODULE_0__.Button
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.expanded = false
    this.hasPopup = 'menu'
  }

  /**
   * Create menu if needed, toggle the menu, focus the first item if shown
   */
  activate() {
    const menu = this.menu || (this.menu = new this.constructor.Menu)
    super.activate()
    if(this.expanded) {
      const item = menu.items.filter(({ disabled }) => !disabled)[0]
      item && item.focus()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    super.onKeyDown(...arguments)
    if(['ArrowUp', 'ArrowDown'].includes(event.key)) {
      this.activate()
      if(event.key === 'ArrowUp') {
        const items = this.items.filter(({ disabled }) => !disabled)
        const item = items[items.length - 1]
        item && item.focus()
      }
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Enter(event) {
    this.activate()
  }

  /**
   * @returns {PopupMenu|null}
   */
  get menu() {
    return this.controls.find(elem => elem instanceof this.constructor.Menu) || null
  }

  /**
   * @param {PopupMenu|null} menu
   */
  set menu(menu) {
    if(menu) {
      this.controls = menu
      this.popup = menu.popup
      return
    }
    this.popup = null
    this.controls = null
  }

  /**
   * @return {MenuItem[]}
   */
  get items() {
    const menu = this.menu
    return menu? menu.items : []
  }

  /**
   * @param {MenuItem[]} items
   */
  set items(items) {
    const menu = this.menu || (this.menu = new this.constructor.Menu)
    menu.children = items
  }
}

MenuButton.Menu = _PopupMenu__WEBPACK_IMPORTED_MODULE_1__.PopupMenu


/***/ }),
/* 350 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PopupMenu": () => (/* binding */ PopupMenu)
/* harmony export */ });
/* harmony import */ var _Menu__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(345);
/* harmony import */ var _Popup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(292);
/* harmony import */ var _PopupMenu_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(351);




class PopupMenu extends _Menu__WEBPACK_IMPORTED_MODULE_0__.Menu
{
  init(init) {
    super.init(init)
    this.popup || new this.constructor.Popup(this)
  }

  get popup() {
    return this.closest(_Popup__WEBPACK_IMPORTED_MODULE_1__.Popup)
  }

  get open() {
    return !this.popup.hidden
  }

  set open(open) {
    if(open) {
      this.popup.show()
    }
    else this.popup.close()
  }
}

PopupMenu.Popup = _Popup__WEBPACK_IMPORTED_MODULE_1__.Popup


/***/ }),
/* 351 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 352 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 353 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(289);
/* harmony import */ var _CloseButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(354);
/* harmony import */ var _DialogBody__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(356);
/* harmony import */ var _DialogButton__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(358);
/* harmony import */ var _DialogHead__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(363);
/* harmony import */ var _Dialog__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(359);
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(286);
/* harmony import */ var _TextBox__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(334);









/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_6__.Heading('DialogButton + Dialog'),
    new _DialogButton__WEBPACK_IMPORTED_MODULE_3__.DialogButton({
      dialog : new _Dialog__WEBPACK_IMPORTED_MODULE_5__.Dialog({
        children : [
          new _DialogHead__WEBPACK_IMPORTED_MODULE_4__.DialogHead([
            new _Heading__WEBPACK_IMPORTED_MODULE_6__.Heading('Hello!'),
            new _CloseButton__WEBPACK_IMPORTED_MODULE_1__.CloseButton,
          ]),
          new _DialogBody__WEBPACK_IMPORTED_MODULE_2__.DialogBody([
            new _TextBox__WEBPACK_IMPORTED_MODULE_7__.TextBox({
              labels : 'Say something',
            }),
            new _Button__WEBPACK_IMPORTED_MODULE_0__.Button({
              onclick : (event, elem) => {
                elem.closest(_Dialog__WEBPACK_IMPORTED_MODULE_5__.Dialog).open = false
              },
              text : 'Close',
            }),
          ]),
        ],
      }),
      children : 'Simple dialog',
    }),
    new _DialogButton__WEBPACK_IMPORTED_MODULE_3__.DialogButton({
      dialog : new _Dialog__WEBPACK_IMPORTED_MODULE_5__.Dialog({
        modal : true,
        children : [
          new _DialogHead__WEBPACK_IMPORTED_MODULE_4__.DialogHead([
            new _Heading__WEBPACK_IMPORTED_MODULE_6__.Heading('Hello!'),
            new _CloseButton__WEBPACK_IMPORTED_MODULE_1__.CloseButton,
          ]),
          new _DialogBody__WEBPACK_IMPORTED_MODULE_2__.DialogBody([
            new _TextBox__WEBPACK_IMPORTED_MODULE_7__.TextBox({
              labels : 'Say something',
            }),
            new _Button__WEBPACK_IMPORTED_MODULE_0__.Button({
              onclick : (event, elem) => {
                elem.closest(_Dialog__WEBPACK_IMPORTED_MODULE_5__.Dialog).open = false
              },
              text : 'Close',
            }),
          ]),
        ],
      }),
      children : 'Modal dialog',
    }),
  ]
});

/*import { CancelButton } from './CancelButton'
import { FootGroup } from './FootGroup'
import { Form } from './Form'
import { ModalDialog } from './ModalDialog'
import { UserBadge } from './UserBadge'
import data from '../data/userdata'

new AppMain({
  parent : document.body,
  children : [
    new DialogButton({
      dialog : new ModalDialog({
        children : new Form({
          label : new Heading('Выход'),
          children : [
            new UserBadge({
              data : data[0]
            }),
            new FootGroup([
              new Button({
                onclick : event => location.reload(),
                children : 'Выйти'
              }),
              new CancelButton('Отмена')
            ]),
            new CloseButton
          ]
        })
      }),
      children : 'Выход'
    })
  ]
})*/



/***/ }),
/* 354 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "CloseButton": () => (/* binding */ CloseButton)
/* harmony export */ });
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(289);
/* harmony import */ var _Popup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(292);
/* harmony import */ var _CloseButton_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(355);




class CloseButton extends _Button__WEBPACK_IMPORTED_MODULE_0__.Button
{
  init(init) {
    super.init(init)
    this.tabIndex = -1
    this.node.title = 'Закрыть'
  }

  activate() {
    this.closest(_Popup__WEBPACK_IMPORTED_MODULE_1__.Popup).close()
  }
}


/***/ }),
/* 355 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 356 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DialogBody": () => (/* binding */ DialogBody)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _DialogBody_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(357);



class DialogBody extends _lib__WEBPACK_IMPORTED_MODULE_0__.HtmlDiv
{
  init(init) {
    super.init(init)
    this.on('scroll', event => this.class.scrolled = !!this.scrollTop)
  }
}


/***/ }),
/* 357 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 358 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DialogButton": () => (/* binding */ DialogButton)
/* harmony export */ });
/* harmony import */ var _Dialog__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(359);
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(289);



class DialogButton extends _Button__WEBPACK_IMPORTED_MODULE_1__.Button
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.expanded = false
    this.hasPopup = 'dialog'
  }

  /**
   * Create dialog if needed, toggle the dialog
   */
  activate() {
    if(!this.dialog) {
      this.dialog = new this.constructor.Dialog
    }
    super.activate()
  }

  /**
   * @returns {Dialog|null}
   */
  get dialog() {
    return this.controls.find(elem => elem instanceof _Dialog__WEBPACK_IMPORTED_MODULE_0__.Dialog) || null
  }

  /**
   * @param {Dialog} dialog
   */
  set dialog(dialog) {
    if(dialog) {
      this.controls = dialog
      this.popup = dialog.popup
      return
    }
    this.popup = null
    this.controls = null
  }
}

DialogButton.Dialog = _Dialog__WEBPACK_IMPORTED_MODULE_0__.Dialog


/***/ }),
/* 359 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Dialog": () => (/* binding */ Dialog)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _DialogPopup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(360);
/* harmony import */ var _Dialog_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(362);


// import { ProgressBar } from './ProgressBar'


let undefined

/**
 * @summary A dialog is a descendant window of the primary window of a web application.
 * @see https://www.w3.org/TR/wai-aria-1.1/#dialog
 */
class Dialog extends _lib__WEBPACK_IMPORTED_MODULE_0__.RoleDialog
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.returnValue = null
    this.popup || new this.constructor.Popup(this)
    this.on('keydown', this.onKeyDown)
  }

  /**
   * @param {{}} init
   * @param {boolean} [init.open]
   */
  assign(init) {
    const open = init.open
    delete init.open
    super.assign(init)
    open && (this.open = true)
  }

  /**
   * Show the dialog
   */
  show() {
    if(this.open) {
      return
    }
    this.modal = false
    this.open = true
  }

  /**
   * Show the dialog as a modal
   */
  showModal() {
    if(this.open) {
      return
    }
    this.modal = true
    this.open = true
  }

  /**
   * @param {any} [returnValue]
   */
  close(returnValue) {
    if(!this.open) {
      return
    }
    if(returnValue !== undefined) {
      this.returnValue = returnValue
    }
    this.open = false
  }

  /**
   * Set focus on autofocus elem or the first tab sequence elem
   */
  setFocus() {
    const elem = this.find('[autofocus]')
    this.removeAttr('tabindex')
    if(elem) {
      elem.focus()
      return
    }
    const elems = this.getTabSequence()
    if(elems[0]) {
      elems[0].focus()
      return
    }
    const pending = this.findAll('.pending')
    this.node.tabIndex = -1
    this.focus()
    if(pending.length) {
      this.busy = true
      Promise.all(pending.map(({ promise }) => promise))
      .then(() => this.setFocus())
      .finally(() => this.busy = false)
    }
  }

  /**
   * @param {DomElem} [elem=this]
   * @returns {DomElem[]}
   */
  getTabSequence(elem = this) {
    const result = []
    for(const child of elem.children) {
      if(child.computedStyle.display === 'none') {
        continue
      }
      const node = child.node
      if(node.isContentEditable) {
        result.push(child)
      }
      else if(node.tabIndex > -1) {
        if(node.disabled) {
          continue
        }
        if(node.localName === 'input' && node.type === 'hidden') {
          continue
        }
        if('href' in node && !node.href) {
          continue
        }
        result.push(child)
      }
      if(node.hasChildNodes()) {
        result.push(...this.getTabSequence(child))
      }
    }
    return result
  }

  /*destroy(keepNode = false) {
    if(keepNode) {
      super.destroy(true)
    }
    else this.popup.destroy()
  }*/

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyDown_Tab(event, elem) {
    if(!this.modal) {
      return
    }
    const elems = this.getTabSequence()
    if(!elems.length) {
      event.preventDefault()
      return
    }
    const first = elems[0]
    const last = elems[elems.length - 1]
    if(event.shiftKey && elem === first) {
      event.preventDefault()
      last.focus()
    }
    else if(!event.shiftKey && elem === last) {
      event.preventDefault()
      first.focus()
    }
  }

  /**
   * @returns {DomElem}
   */
  get anchor() {
    return this.popup.anchor
  }

  /**
   * @param {DomElem} anchor
   */
  set anchor(anchor) {
    this.popup.anchor = anchor
  }

  /**
   * @return {string}
   */
  get direction() {
    return this.popup.direction
  }

  /**
   * @param {string} direction
   */
  set direction(direction) {
    this.popup.direction = direction
  }

  /**
   * @returns {boolean}
   */
  get modal() {
    return super.modal
  }

  /**
   * @param {boolean} modal
   */
  set modal(modal) {
    const popup = this.popup || new this.constructor.Popup(this)
    super.modal = popup.modal = modal
  }

  /**
   * @return {boolean}
   */
  get open() {
    return this.classList.contains('open')
  }

  /**
   * @param {boolean} open
   */
  set open(open) {
    if(open === this.open) {
      return
    }
    this.classList.toggle('open', open)?
      this.popup.show() :
      this.popup.close()
  }

  /**
   * @returns {DomElem}
   */
  get parent() {
    return this.popup.parent
  }

  /**
   * @param {DomElem} parent
   */
  set parent(parent) {
    this.popup.parent = parent
  }

  /**
   * @returns {DialogPopup}
   */
  get popup() {
    return this.closest(this.constructor.Popup)
  }
}

_DialogPopup__WEBPACK_IMPORTED_MODULE_1__.DialogPopup.Dialog = Dialog
Dialog.Popup = _DialogPopup__WEBPACK_IMPORTED_MODULE_1__.DialogPopup
// Dialog.PendingChild = ProgressBar


/***/ }),
/* 360 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DialogPopup": () => (/* binding */ DialogPopup)
/* harmony export */ });
/* harmony import */ var _oncancel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(361);
/* harmony import */ var _oncancel__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_oncancel__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Popup__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(292);



class DialogPopup extends _Popup__WEBPACK_IMPORTED_MODULE_1__.Popup
{
  /**
   * Drop the popup
   */
  drop() {
    const dialog = this.dialog
    dialog && dialog.emit('close')
    super.drop()
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onDocClick(event, elem) {
    if(this.anchor && this.anchor.contains(elem)) {
      return
    }
    const dialog = this.dialog
    if(dialog.contains(elem)) {
      return
    }
    const popup = elem.closest(_Popup__WEBPACK_IMPORTED_MODULE_1__.Popup)
    // if(popup && popup !== this && popup.modal && !popup.contains(this)) {
    if(popup && popup !== this && !popup.contains(this)) {
      return
    }
    dialog.emit('cancel') && dialog.close()
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   */
  onDocFocusIn(event, elem) {
    if(elem === this) {
      return
    }
    if(this.anchor && this.anchor.contains(elem)) {
      return
    }
    const dialog = this.dialog
    if(dialog.contains(elem)) {
      return
    }
    const popup = elem.closest(_Popup__WEBPACK_IMPORTED_MODULE_1__.Popup)
    // if(popup && popup.modal && !popup.contains(this)) {
    if(popup && !popup.contains(this)) {
      return
    }
    dialog.emit('cancel') && dialog.close()
  }

  /**
   * @param {KeyboardEvent} event
   */
  onDocKeyDown(event) {
    if(event.code === 'Escape') {
      const dialog = this.dialog
      dialog.emit('cancel') && dialog.close()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    if(event.code === 'Escape') {
      event.stopPropagation()
      const dialog = this.dialog
      dialog.emit('cancel') && dialog.close()
    }
  }

  /**
   * @return {Dialog}
   */
  get dialog() {
    return this.find(DialogPopup.Dialog)
  }

  /**
   * @returns {boolean|null}
   */
  get hidden() {
    return super.hidden
  }

  /**
   * @param {boolean|null} hidden
   */
  set hidden(hidden) {
    if(hidden === this.hidden) {
      return
    }
    const dialog = this.dialog
    if(super.hidden = hidden) {
      dialog.close()
      return
    }
    dialog.open = true
    dialog.modal && setTimeout(() => dialog.setFocus())
  }
}


/***/ }),
/* 361 */
/***/ (() => {

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


/***/ }),
/* 362 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 363 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DialogHead": () => (/* binding */ DialogHead)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _DialogHead_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(364);



class DialogHead extends _lib__WEBPACK_IMPORTED_MODULE_0__.HtmlDiv
{
}


/***/ }),
/* 364 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 365 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(286);
/* harmony import */ var _TabList__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(366);
/* harmony import */ var _TabPanel__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(368);
/* harmony import */ var _Test__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(284);





/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  const panels = [
    new _TabPanel__WEBPACK_IMPORTED_MODULE_2__.TabPanel('1'),
    new _TabPanel__WEBPACK_IMPORTED_MODULE_2__.TabPanel('2'),
    new _TabPanel__WEBPACK_IMPORTED_MODULE_2__.TabPanel('3'),
  ]
  return new _Test__WEBPACK_IMPORTED_MODULE_3__.Test([
    new _Heading__WEBPACK_IMPORTED_MODULE_0__.Heading('TabList'),
    new _TabList__WEBPACK_IMPORTED_MODULE_1__.TabList([
      new _TabList__WEBPACK_IMPORTED_MODULE_1__.Tab({
        panels : panels[0],
        children : 'First',
      }),
      new _TabList__WEBPACK_IMPORTED_MODULE_1__.Tab({
        selected : true,
        panels : panels[1],
        children : 'Second',
      }),
      new _TabList__WEBPACK_IMPORTED_MODULE_1__.Tab({
        panels : panels[2],
        children : 'Third',
      }),
    ]),
    panels,
  ])
});


/***/ }),
/* 366 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TabList": () => (/* binding */ TabList),
/* harmony export */   "Tab": () => (/* reexport safe */ _Tab__WEBPACK_IMPORTED_MODULE_2__.Tab),
/* harmony export */   "TabPanel": () => (/* reexport safe */ _TabPanel__WEBPACK_IMPORTED_MODULE_3__.TabPanel)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _Composite__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(321);
/* harmony import */ var _Tab__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(367);
/* harmony import */ var _TabPanel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(368);
/* harmony import */ var _TabList_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(370);






/**
 * @summary A list of tab elements, which are references to tabpanel elements.
 * @see https://www.w3.org/TR/wai-aria-1.1/#tablist
 */
class TabList extends _Composite__WEBPACK_IMPORTED_MODULE_1__.Composite
{
  /**
   * @param {{}} [init]
   */
  init(init) {
    super.init(init)
    this.on(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaSelected, this.onSelected, { subtree : true })
  }

  /**
   * @param {MutationRecord} record
   * @param {Tab} elem
   */
  onSelected(record, elem) {
    if(!elem.selected) {
      return
    }
    for(const tab of this.tabs) {
      tab === elem || (tab.selected = false)
    }
  }

  /**
   * @return {DomElem}
   */
  get focusableItem() {
    return this.selectedTabs[0] || super.focusableItem
  }

  /**
   * @returns {RoleGroup[]}
   */
  get groups() {
    return this.controls.filter(elem => elem instanceof _lib__WEBPACK_IMPORTED_MODULE_0__.RoleGroup)
  }

  /**
   * @param {RoleGroup[]} groups
   */
  set groups(groups) {
    this.controls = groups
    groups = this.groups
    if(!groups.length) {
      return
    }
    this.tabs.forEach((tab, i) => {
      tab.controls = groups.map(group => group.findAll(_TabPanel__WEBPACK_IMPORTED_MODULE_3__.TabPanel)[i])
    })
  }

  /**
   * @returns {number}
   */
  get level() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaLevel)
  }

  /**
   * @param {number} level
   */
  set level(level) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaLevel, level)
  }

  /**
   * @returns {boolean}
   */
  get multiSelectable() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaMultiSelectable)
  }

  /**
   * @param {boolean} multiSelectable
   */
  set multiSelectable(multiSelectable) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaMultiSelectable, multiSelectable)
  }

  /**
   * @returns {string}
   */
  get orientation() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaOrientation) || 'horizontal'
  }

  /**
   * @param {string} orientation
   */
  set orientation(orientation) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_0__.AriaOrientation, orientation)
  }

  /**
   * @returns {Tab|*}
   */
  get selectedTabs() {
    return this.findAll(_Tab__WEBPACK_IMPORTED_MODULE_2__.Tab, ({ selected }) => selected)
  }

  /**
   * @returns {Tab[]}
   */
  get tabs() {
    return this.findAll(_Tab__WEBPACK_IMPORTED_MODULE_2__.Tab)
  }

  /**
   * @returns {boolean}
   */
  static get abstract() {
    return false
  }
}

TabList.Item = _Tab__WEBPACK_IMPORTED_MODULE_2__.Tab




/***/ }),
/* 367 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Tab": () => (/* binding */ Tab)
/* harmony export */ });
/* harmony import */ var _Item__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(322);
/* harmony import */ var _TabPanel__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(368);
/* harmony import */ var _lib_AriaPosInSet__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(66);
/* harmony import */ var _lib_AriaSelected__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(73);
/* harmony import */ var _lib_AriaSetSize__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(74);
/* harmony import */ var _Tab_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(369);







/**
 * @summary A grouping label providing a mechanism for selecting
 *  the tab content that is to be rendered to the user.
 * @see https://www.w3.org/TR/wai-aria-1.1/#tab
 */
class Tab extends _Item__WEBPACK_IMPORTED_MODULE_0__.Item
{
  /**
   * Activate tab
   */
  activate(event) {
    this.selected = true
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Enter(event) {
    this.activate()
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyUp_Space(event) {
    event.preventDefault()
    this.activate()
  }

  /**
   * @return {TabPanel|null}
   */
  get panel() {
    return this.panels[0] || null
  }

  /**
   * @param {TabPanel|null} panel
   */
  set panel(panel) {
    this.panels = panel
  }

  /**
   * @return {TabPanel[]}
   */
  get panels() {
    return this.controls.filter(elem => elem instanceof _TabPanel__WEBPACK_IMPORTED_MODULE_1__.TabPanel)
  }

  /**
   * @param {TabPanel[]} panels
   */
  set panels(panels) {
    this.controls = panels
    this.panels.forEach(panel => {
      panel.tab === this || (panel.tab = this)
      panel.hidden = !this.selected
    })
  }

  /**
   * @returns {number|null}
   */
  get posInSet() {
    return this.getAttr(_lib_AriaPosInSet__WEBPACK_IMPORTED_MODULE_2__.AriaPosInSet)
  }

  /**
   * @param {number|null} posInSet
   */
  set posInSet(posInSet) {
    this.setAttr(_lib_AriaPosInSet__WEBPACK_IMPORTED_MODULE_2__.AriaPosInSet, posInSet)
  }

  /**
   * @returns {boolean}
   */
  get selected() {
    return this.getAttr(_lib_AriaSelected__WEBPACK_IMPORTED_MODULE_3__.AriaSelected) || false
  }

  /**
   * @param {boolean} selected
   */
  set selected(selected) {
    this.panels.forEach(panel => panel.hidden = !selected)
    this.setAttr(_lib_AriaSelected__WEBPACK_IMPORTED_MODULE_3__.AriaSelected, selected)
  }

  /**
   * @returns {number|null}
   */
  get setSize() {
    return this.getAttr(_lib_AriaSetSize__WEBPACK_IMPORTED_MODULE_4__.AriaSetSize)
  }

  /**
   * @param {number|null} setSize
   */
  set setSize(setSize) {
    this.setAttr(_lib_AriaSetSize__WEBPACK_IMPORTED_MODULE_4__.AriaSetSize, setSize)
  }

  /**
   * @returns {boolean}
   */
  static get abstract() {
    return false
  }
}

_TabPanel__WEBPACK_IMPORTED_MODULE_1__.TabPanel.Tab = Tab


/***/ }),
/* 368 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TabPanel": () => (/* binding */ TabPanel)
/* harmony export */ });
/* harmony import */ var _lib_RoleSection__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(83);


/**
 * @summary A container for the resources associated with a tab,
 *  where each tab is contained in a tablist.
 * @see https://www.w3.org/TR/wai-aria-1.1/#tabpanel
 */
class TabPanel extends _lib_RoleSection__WEBPACK_IMPORTED_MODULE_0__.RoleSection
{
  /**
   * @return {Tab|null}
   */
  get tab() {
    return this.labelledBy[0] || null
  }

  /**
   * @param {Tab|null} tab
   */
  set tab(tab) {
    this.labelledBy = tab
  }

  /**
   * @returns {boolean}
   */
  static get abstract() {
    return false
  }
}


/***/ }),
/* 369 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 370 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 371 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(286);
/* harmony import */ var _NumberRangeBox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(372);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_0__.Heading('NumberRangeBox'),
    new _NumberRangeBox__WEBPACK_IMPORTED_MODULE_1__.NumberRangeBox({
      labels : 'Simple',
    }),
  ]
});


/***/ }),
/* 372 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "NumberRangeBox": () => (/* binding */ NumberRangeBox)
/* harmony export */ });
/* harmony import */ var _Complex__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(341);
/* harmony import */ var _Dash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(373);
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(290);
/* harmony import */ var _TextInputBox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(374);
/* harmony import */ var _NumberRangeBox_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(378);






class NumberRangeBox extends _Complex__WEBPACK_IMPORTED_MODULE_0__.Complex
{
  build(init) {
    return new _Control__WEBPACK_IMPORTED_MODULE_2__.Control([
      this._fromInput = new _TextInputBox__WEBPACK_IMPORTED_MODULE_3__.TextInputBox({
        type : 'number',
        min : 0,
        step : 1,
      }),
      new _Dash__WEBPACK_IMPORTED_MODULE_1__.Dash,
      this._toInput = new _TextInputBox__WEBPACK_IMPORTED_MODULE_3__.TextInputBox({
        type : 'number',
        min : 0,
        step : 1,
      }),
    ])
  }

  get from() {
    const value = this._fromInput.valueAsNumber
    return isNaN(value)? null : value
  }

  get to() {
    const value = this._toInput.valueAsNumber
    return isNaN(value)? null : value
  }

  get value() {
    const from = this.from
    const to = this.to
    return from === null && to === null? null : [this.from, this.to]
  }

  set value(value) {
    this._fromInput.valueAsNumber = value[0]
    this._toInput.valueAsNumber = value[1]
  }
}

NumberRangeBox.tabIndex = null


/***/ }),
/* 373 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Dash": () => (/* binding */ Dash)
/* harmony export */ });
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);


class Dash extends _lib__WEBPACK_IMPORTED_MODULE_0__.HtmlSpan
{
  build(init) {
    return '—'
  }
}


/***/ }),
/* 374 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TextInputBox": () => (/* binding */ TextInputBox)
/* harmony export */ });
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(290);
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _TextInput__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(375);
/* harmony import */ var _Widget__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(308);
/* harmony import */ var _TextInputBox_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(377);






class TextInputBox extends _Widget__WEBPACK_IMPORTED_MODULE_3__.Widget
{
  init(init) {
    super.init(init)
    this.on('change', this.onChange)
  }

  /**
   * @param {{}} init
   * @return {Control}
   */
  build(init) {
    return this._control = new _Control__WEBPACK_IMPORTED_MODULE_0__.Control(this._input = new _TextInput__WEBPACK_IMPORTED_MODULE_2__.TextInput)
  }

  focus() {
    this._input.focus()
  }

  onChange(event, elem) {
    if(elem === this) {
      return
    }
    event.stopImmediatePropagation()
    this.emit('change')
  }

  onMouseDown(event, elem) {
    super.onMouseDown(event, elem)
    elem === this._input || setTimeout(() => this._input.focus())
  }
}

TextInputBox.tabIndex = null

const names = [
  'type',
  'name',
  'value',
  'valueAsNumber',
  'min',
  'max',
  'step',
  'placeholder'
]
for(const name of names) {
  const descriptor = Object.getOwnPropertyDescriptor(_lib__WEBPACK_IMPORTED_MODULE_1__.HtmlInput.prototype, name)
  if(typeof descriptor.value === 'function') {
    descriptor.value = function(...args) {
      return this._input[name](...args)
    }
  }
  if(descriptor.get) {
    descriptor.get = function() {
      return this._input[name]
    }
  }
  if(descriptor.set) {
    descriptor.set = function(value) {
      this._input[name] = value
    }
  }
  Object.defineProperty(TextInputBox.prototype, name, descriptor)
}


/***/ }),
/* 375 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TextInput": () => (/* binding */ TextInput)
/* harmony export */ });
/* harmony import */ var _lib_htmlmodule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(87);
/* harmony import */ var _TextInput_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(376);



class TextInput extends _lib_htmlmodule__WEBPACK_IMPORTED_MODULE_0__.HtmlInput
{
}


/***/ }),
/* 376 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 377 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 378 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 379 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(286);
/* harmony import */ var _TimeBox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(380);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_0__.Heading('TimeBox'),
    new _TimeBox__WEBPACK_IMPORTED_MODULE_1__.TimeBox({
      labels : 'Simple',
    }),
    new _TimeBox__WEBPACK_IMPORTED_MODULE_1__.TimeBox({
      labels : 'Required',
      required : true,
    }),
    new _TimeBox__WEBPACK_IMPORTED_MODULE_1__.TimeBox({
      labels : 'Min, max',
      min : '09:00',
      max : '18:00',
    }),
    new _TimeBox__WEBPACK_IMPORTED_MODULE_1__.TimeBox({
      labels : 'Min, max, value, step',
      min : '9:00',
      max : '24:00',
      value : '15:30',
      step : '00:30',
    }),
  ]
});


/***/ }),
/* 380 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TimeBox": () => (/* binding */ TimeBox)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(381);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ListBox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(320);
/* harmony import */ var _TextBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(334);
/* harmony import */ var _TimeBox_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(382);





class TimeBox extends _TextBox__WEBPACK_IMPORTED_MODULE_2__.TextBox
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this._edit.inputMode = 'numeric'
    this.expanded = false
    this.hasPopup = 'listbox'
    init.value || (this.text = '––:––')
  }

  activate() {
    if(!this.listBox) {
      const range = moment__WEBPACK_IMPORTED_MODULE_0___default()(this.min, 'HH:mm').twix(this.max, 'HH:mm')
      const interval = moment__WEBPACK_IMPORTED_MODULE_0___default().duration(this.step)
      const value = this.value
      this.listBox = new this.constructor.ListBox(range.split(interval).map(item => {
        const time = item.start().format('HH:mm')
        return new this.constructor.Option({
          value : time,
          text : time,
          selected : time === value,
        })
      }))
    }
    super.activate()
    this.expanded && this.listBox.scrollToOption()
  }

  /**
   * @return {boolean}
   */
  checkValidity() {
    return this.text? !!this.value : !this.required
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   */
  onFocusIn(event, elem) {
    if(!this.value) {
      this.text = ''
    }
    super.onFocusIn(event, elem)
  }

  /**
   * @param {FocusEvent} event
   * @param {DomElem} elem
   */
  onFocusOut(event, elem) {
    const { value, _value } = this
    if(value) {
      this.value = value
    }
    else {
      this.value = this.required? this._value : null
      this.invalid = false
    }
    value === _value || this.emit('change')
  }

  /**
   * @param {InputEvent} event
   * @param {DomElem} elem
   */
  onInput(event, elem) {
    const listBox = this.listBox
    if(listBox) {
      listBox.value = this.value
      this.expanded && listBox.scrollToOption()
    }
    this.invalid = this.text? !this.value : false
  }

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyDown_ArrowUp(event, elem) {
    event.preventDefault()
    this.expanded || this.activate()
    this.listBox.emit('keydown', { code : event.code, repeat : event.repeat })
  }

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyDown_ArrowDown(event, elem) {
    event.preventDefault()
    this.expanded || this.activate()
    this.listBox.emit('keydown', { code : event.code, repeat : event.repeat })
  }

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyDown_Enter(event, elem) {
    event.stopPropagation()
    super.onKeyDown_Enter(event, elem)
    this.activate()
  }

  /**
   * @param {KeyboardEvent} event
   * @param {DomElem} elem
   */
  onKeyDown_Escape(event, elem) {
    event.stopPropagation()
    this.expanded = false
  }

  /**
   * @param {MouseEvent} event
   * @param {DomElem} elem
   */
  onListBoxClick(event, elem) {
    event.stopPropagation()
    this.focus()
    this.expanded = false
    this.reportValidity()
  }

  /**
   * @param {Event} event
   * @param {DomElem} elem
   */
  onListBoxChange(event, elem) {
    event.stopPropagation()
    this.value = this.listBox.value
    this.reportValidity()
    this.emit('change')
  }

  /**
   * @returns {ListBox|null}
   */
  get listBox() {
    return this.controls.find(elem => elem instanceof this.constructor.ListBox) || null
  }

  /**
   * @param {ListBox|null} listBox
   */
  set listBox(listBox) {
    if(!listBox) {
      this.controls = null
      return
    }
    if(listBox.constructor === Object) {
      listBox = new this.constructor.ListBox(listBox)
    }
    this.controls = [
      listBox,
      new this.constructor.Popup({
        anchor : this,
        children : listBox,
      }),
    ]
    listBox.tabIndex = null
    listBox.on('click', this.onListBoxClick, this)
    listBox.on('change', this.onListBoxChange, this)
  }

  /**
   * @return {string|null}
   */
  get value() {
    const value = super.value.trim()
    const time = moment__WEBPACK_IMPORTED_MODULE_0___default()(value, 'HH:mm')
    return time.isValid()? time.format('HH:mm') : null
  }

  /**
   * @param {string|null} value
   */
  set value(value) {
    if(!value) {
      super.value = null
      this.text = '––:––'
      return
    }
    const time = moment__WEBPACK_IMPORTED_MODULE_0___default()(value.trim(), 'HH:mm')
    super.value = time.isValid()? time.format('HH:mm') : null
  }
}

TimeBox.prototype.min = '00:00'
TimeBox.prototype.max = '24:00'
TimeBox.prototype.step = '00:15'
TimeBox.ListBox = _ListBox__WEBPACK_IMPORTED_MODULE_1__.ListBox
TimeBox.Option = _ListBox__WEBPACK_IMPORTED_MODULE_1__.Option


/***/ }),
/* 381 */
/***/ ((module) => {

"use strict";
module.exports = moment;

/***/ }),
/* 382 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 383 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(286);
/* harmony import */ var _Test__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(284);
/* harmony import */ var _TimeRangeListBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(384);




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (async () => {
  return new _Test__WEBPACK_IMPORTED_MODULE_1__.Test({
    // onchange : (event, elem) => console.log(elem.value),
    children : [
      new _Heading__WEBPACK_IMPORTED_MODULE_0__.Heading('TimeRangeListBox'),
      new _TimeRangeListBox__WEBPACK_IMPORTED_MODULE_2__.TimeRangeListBox({
        labels : 'Simple',
      }),
      new _TimeRangeListBox__WEBPACK_IMPORTED_MODULE_2__.TimeRangeListBox({
        labels : 'Value, interval',
        interval : 'PT30M',
        value : ['09:00', '12:30'],
      }),
      new _TimeRangeListBox__WEBPACK_IMPORTED_MODULE_2__.TimeRangeListBox({
        labels : 'Value, timeFrom, timeTo',
        timeFrom : '10:00',
        timeTo : '20:00',
        value : ['13:00', '17:00'],
      }),
    ]
  })
});


/***/ }),
/* 384 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TimeRangeListBox": () => (/* binding */ TimeRangeListBox)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(381);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _Label__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(86);
/* harmony import */ var _ListBox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(320);
/* harmony import */ var _TimeRangeListBox_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(385);






class TimeRangeListBox extends _ListBox__WEBPACK_IMPORTED_MODULE_3__.ListBox
{
  /**
   * @param {{}} init
   * @param {string} [init.timeFrom]
   * @param {string} [init.timeTo]
   * @param {string} [init.interval]
   */
  init(init) {
    super.init(init)
    const { timeFrom = '00:00', timeTo = '24:00', interval = 'PT1H' } = init
    const range = moment__WEBPACK_IMPORTED_MODULE_0___default()(timeFrom, 'HH:mm').twix(timeTo, 'HH:mm')
    const duration = moment__WEBPACK_IMPORTED_MODULE_0___default().duration(interval)
    this.multiSelectable = true
    this.options = range.split(duration).map(interval => {
      const start = interval.start().format('HH:mm')
      const end = interval.end().format('HH:mm')
      return {
        value : [start, end === '00:00'? '24:00' : end],
        children : new _Label__WEBPACK_IMPORTED_MODULE_2__.Label(start),
      }
    })
    this._control.append(new _lib__WEBPACK_IMPORTED_MODULE_1__.Presentation({
      class : 'Option',
      children : new _Label__WEBPACK_IMPORTED_MODULE_2__.Label(timeTo),
    }))
  }

  /**
   * @return {string[]|null}
   */
  get value() {
    const value = super.value
    if(value && value.length) {
      return [value[0][0], value[value.length - 1][1]]
    }
    return null
  }

  /**
   * @param {string[]|null} value
   */
  set value(value) {
    if(!value || !value.length) {
      super.value = value
      return
    }
    const start = value[0] && moment__WEBPACK_IMPORTED_MODULE_0___default()(value[0], 'HH:mm')
    const stop = value[1] && moment__WEBPACK_IMPORTED_MODULE_0___default()(value[1], 'HH:mm')
    const values = []
    for(const option of this.options) {
      const from = moment__WEBPACK_IMPORTED_MODULE_0___default()(option.value[0], 'HH:mm')
      const to = moment__WEBPACK_IMPORTED_MODULE_0___default()(option.value[1], 'HH:mm')
      from.isSameOrAfter(start) && values.push(option.value)
      if(to.isSameOrAfter(stop)) {
        break
      }
    }
    if(values.length) {
      super.value = values
    }
  }
}


/***/ }),
/* 385 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 386 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(286);
/* harmony import */ var _Test__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(284);
/* harmony import */ var _TimeRangeBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(387);




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return new _Test__WEBPACK_IMPORTED_MODULE_1__.Test({
    // onchange : (event, elem) => console.log(elem.value),
    children : [
      new _Heading__WEBPACK_IMPORTED_MODULE_0__.Heading('TimeRangeBox'),
      new _TimeRangeBox__WEBPACK_IMPORTED_MODULE_2__.TimeRangeBox({
        labels : 'Simple',
      }),
      new _TimeRangeBox__WEBPACK_IMPORTED_MODULE_2__.TimeRangeBox({
        labels : 'Value, interval',
        interval : 'PT30M',
        value : ['09:00', '12:30'],
      }),
      new _TimeRangeBox__WEBPACK_IMPORTED_MODULE_2__.TimeRangeBox({
        labels : 'Value, timeFrom, timeTo',
        timeFrom : '10:00',
        timeTo : '20:00',
        value : ['13:00', '17:00'],
      }),
    ]
  })
});


/***/ }),
/* 387 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TimeRangeBox": () => (/* binding */ TimeRangeBox)
/* harmony export */ });
/* harmony import */ var _Dash__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(373);
/* harmony import */ var _SelectBox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(329);
/* harmony import */ var _TimeRangeListBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(384);
/* harmony import */ var _TimeRangeBox_css__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(388);





class TimeRangeBox extends _SelectBox__WEBPACK_IMPORTED_MODULE_1__.SelectBox
{
  /**
   * @param {{timeFrom,timeTo,interval}} init
   * @param {ListBox|{}} [init.listBox]
   */
  init(init) {
    init.listBox = {
      timeFrom : init.timeFrom,
      timeTo : init.timeTo,
      interval : init.interval,
    }
    super.init(init)
  }

  updateText() {
    const value = this.value
    this._inner.children = value && value.length?
      [value[0], new _Dash__WEBPACK_IMPORTED_MODULE_0__.Dash(), value[1]] :
      this._text
  }
}

TimeRangeBox.ListBox = _TimeRangeListBox__WEBPACK_IMPORTED_MODULE_2__.TimeRangeListBox


/***/ }),
/* 388 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 389 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DurationBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(390);
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(286);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_1__.Heading('DurationBox'),
    new _DurationBox__WEBPACK_IMPORTED_MODULE_0__.DurationBox({
      labels : 'Simple',
    }),
    new _DurationBox__WEBPACK_IMPORTED_MODULE_0__.DurationBox({
      labels : 'Value',
      value : '03:45',
    }),
    new _DurationBox__WEBPACK_IMPORTED_MODULE_0__.DurationBox({
      labels : 'Value, units',
      value : '06:37',
      units : ['hours', 'minutes'],
    }),
    new _DurationBox__WEBPACK_IMPORTED_MODULE_0__.DurationBox({
      labels : 'Value, units',
      value : '18:30',
      units : ['hours', 'minutes'],
    }),
    new _DurationBox__WEBPACK_IMPORTED_MODULE_0__.DurationBox({
      labels : 'Value, units, step',
      value : '09:30',
      units : ['hours', 'minutes'],
      step : '00:30',
    }),
  ]
});


/***/ }),
/* 390 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DurationBox": () => (/* binding */ DurationBox)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(381);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Complex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(341);
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(290);
/* harmony import */ var _SelectBox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(329);
/* harmony import */ var _TextInputBox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(374);
/* harmony import */ var _DurationBox_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(391);







class DurationBox extends _Complex__WEBPACK_IMPORTED_MODULE_1__.Complex
{
  init(init) {
    super.init(init)
    init.value || this.updateUnits()
  }

  /**
   * @param {{}} init
   * @return {Control}
   */
  build(init) {
    const units = init.units || this.units
    return this._control = new _Control__WEBPACK_IMPORTED_MODULE_2__.Control([
      this._numberBox = new _TextInputBox__WEBPACK_IMPORTED_MODULE_4__.TextInputBox({
        type : 'number',
        min : 0,
      }),
      this._unitBox = new _SelectBox__WEBPACK_IMPORTED_MODULE_3__.SelectBox({
        title : 'Единица времени',
        value : this._unit = init.unit || units[0],
        // onchange : this.onUnitBoxChange.bind(this),
        options : units.map(value => ({ value })),
      }),
    ])
  }

  updateUnits() {
    for(const option of this._unitBox.options) {
      const unit = option.value
      const key = unit === 'months'? 'M' : unit.slice(0, 1)
      const duration = moment__WEBPACK_IMPORTED_MODULE_0___default().duration(this._numberBox.valueAsNumber || 0, key)
      option.text = duration.format(key + ' _', 1).split(' ')[1]
      this._unitBox.updateText()
    }
  }

  /**
   * @param {Event} event
   * @param {DomElem} elem
   */
  onWidgetChange(event, elem) {
    if(elem === this._unitBox && !this._numberBox.value) {
      return
    }
    if(elem === this._numberBox) {
      this.updateUnits()
    }
    super.onWidgetChange(event, elem)
  }

  /**
   * @param {Event} event
   */
  onUnitBoxChange(event) {
    const unit = this._unitBox.value
    const value = this._numberBox.valueAsNumber
    const step = this._numberBox.step
    if(!isNaN(value)) {
      const duration = moment__WEBPACK_IMPORTED_MODULE_0___default().duration(value, this._unit)
      const number = duration.as(unit)
      this._numberBox.value = number % 1? number.toFixed(2) : number
    }
    if(step) {
      this._numberBox.step = moment__WEBPACK_IMPORTED_MODULE_0___default().duration(+step, this._unit).as(unit)
    }
    this._unit = unit
  }

  /**
   * @return {string}
   */
  get step() {
    return moment__WEBPACK_IMPORTED_MODULE_0___default().duration(this._numberBox.step || 1, this._unit).toISOString()
  }

  /**
   * @param {string} step
   */
  set step(step) {
    this._numberBox.step = moment__WEBPACK_IMPORTED_MODULE_0___default().duration(step).as(this._unit)
  }

  /**
   * @return {string|null}
   */
  get value() {
    const value = this._numberBox.valueAsNumber
    if(isNaN(value)) {
      return null
    }
    const duration = moment__WEBPACK_IMPORTED_MODULE_0___default().duration(value, this._unitBox.value)
    return duration.asSeconds()? duration.toISOString() : null
  }

  /**
   * @param {string|number|null} value
   */
  set value(value) {
    const duration = typeof value === 'number'?
      moment__WEBPACK_IMPORTED_MODULE_0___default().duration(value, this._unitBox.value) :
      value && moment__WEBPACK_IMPORTED_MODULE_0___default().duration(value)
    if(duration) {
      const units = DurationBox.prototype.units.slice().reverse()
      let unit, number, remainder
      for(const item of units) {
        if(!this.units.includes(item)) {
          continue
        }
        number = duration.as(unit = item)
        remainder = number % 1
        if(!remainder || remainder === .5) {
          break
        }
      }
      this._unitBox.value = this._unit = unit
      this._numberBox.value = number
    }
    else this._numberBox.value = ''
    this.updateUnits()
  }
}

DurationBox.prototype.units = ['minutes', 'hours', 'days', 'weeks', 'months', 'years']


/***/ }),
/* 391 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 392 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(381);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(286);
/* harmony import */ var _IntervalBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(393);




/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_1__.Heading('IntervalBox'),
    new _IntervalBox__WEBPACK_IMPORTED_MODULE_2__.IntervalBox({
      labels : 'Simple',
    }),
    new _IntervalBox__WEBPACK_IMPORTED_MODULE_2__.IntervalBox({
      labels : 'Value',
      value : [moment__WEBPACK_IMPORTED_MODULE_0___default()().startOf('hour').format(), 'PT3H'].join('/'),
    }),
    new _IntervalBox__WEBPACK_IMPORTED_MODULE_2__.IntervalBox({
      labels : 'Value, step',
      value : [moment__WEBPACK_IMPORTED_MODULE_0___default()().startOf('hour').format(), 'PT3H'].join('/'),
      step : '00:30',
    }),
  ]
});


/***/ }),
/* 393 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "IntervalBox": () => (/* binding */ IntervalBox)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(381);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Complex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(341);
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(290);
/* harmony import */ var _DateTimeBox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(394);
/* harmony import */ var _DurationBox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(390);
/* harmony import */ var _IntervalBox_css__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(416);







class IntervalBox extends _Complex__WEBPACK_IMPORTED_MODULE_1__.Complex
{
  constructor(init) {
    super(init)
    this._value = null
    this._dateTimeBox.labelledBy = this.labels
  }

  build({ step }) {
    return new _Control__WEBPACK_IMPORTED_MODULE_2__.Control([
      this._dateTimeBox = new _DateTimeBox__WEBPACK_IMPORTED_MODULE_3__.DateTimeBox({ step }),
      this._durationBox = new _DurationBox__WEBPACK_IMPORTED_MODULE_4__.DurationBox({
        title : 'Интервал',
        units : ['hours', 'minutes'],
        step,
      }),
    ])
  }

  onWidgetChange(event, elem) {
    if(elem === this._dateTimeBox && !this.duration) {
      return
    }
    if(elem === this._durationBox && !this.dateTime) {
      return
    }
    super.onWidgetChange(event, elem)
  }

  get dateTime() {
    return this._dateTimeBox.value
  }

  get duration() {
    return this._durationBox.value
  }

  get range() {
    const { dateTime, duration } = this
    if(!dateTime) {
      return null
    }
    const interval = duration && moment__WEBPACK_IMPORTED_MODULE_0___default().duration(duration)
    const end = interval && moment__WEBPACK_IMPORTED_MODULE_0___default()(dateTime).add(interval)
    return [{ value : dateTime }, end && { value : end.format() }]
  }

  set range(range) {
    const dateTime = range && range[0] && range[0].value
    const end = range && range[1] && moment__WEBPACK_IMPORTED_MODULE_0___default()(range[1].value)
    const duration = dateTime && end && moment__WEBPACK_IMPORTED_MODULE_0___default().duration(end.diff(dateTime))
    this._dateTimeBox.value = dateTime
    this._durationBox.value = duration && duration.toISOString()
  }

  get value() {
    const { dateTime, duration } = this
    return dateTime && duration && [dateTime, duration].join('/')
  }

  set value(value) {
    let dateTime, duration
    if(value) {
      [dateTime, duration] = value.split('/')
    }
    this._dateTimeBox.value = dateTime || null
    this._durationBox.value = duration || null
  }
}


/***/ }),
/* 394 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DateTimeBox": () => (/* binding */ DateTimeBox)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(381);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);
/* harmony import */ var _ClearButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(395);
/* harmony import */ var _Complex__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(341);
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(290);
/* harmony import */ var _DateBox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(397);
/* harmony import */ var _TimeBox__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(380);
/* harmony import */ var _DateTimeBox_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(415);









let undefined

class DateTimeBox extends _Complex__WEBPACK_IMPORTED_MODULE_3__.Complex
{
  init(init) {
    super.init(init)
    init.value === undefined || (this.dataset.value = '')
  }

  build({ compact }) {
    return new _Control__WEBPACK_IMPORTED_MODULE_4__.Control([
      this._dateBox = new _DateBox__WEBPACK_IMPORTED_MODULE_5__.DateBox({
        title : 'Дата',
        text : '____',
        compact,
      }),
      this._timeBox = new _TimeBox__WEBPACK_IMPORTED_MODULE_6__.TimeBox({
        title : 'Время',
      }),
      new _ClearButton__WEBPACK_IMPORTED_MODULE_2__.ClearButton({
        title : 'Очистить',
        disabled : true,
        widget : this,
      })
    ])
  }

  onWidgetChange(event, elem) {
    const value = this.value
    if(value === this.dataset.value) {
      return
    }
    this.dataset.value = value
    super.onWidgetChange(event, elem)
  }

  get required() {
    return this.getAttr(_lib__WEBPACK_IMPORTED_MODULE_1__.AriaRequired)
  }

  set required(required) {
    this.setAttr(_lib__WEBPACK_IMPORTED_MODULE_1__.AriaRequired, this._dateBox.required = this._timeBox.required = required)
  }

  get step() {
    this._timeBox.step
  }

  set step(step) {
    this._timeBox.step = step
  }

  get value() {
    const date = this._dateBox.value
    const time = this._timeBox.value
    return date && time? moment__WEBPACK_IMPORTED_MODULE_0___default()(date + 'T' + time).format() : ''
  }

  set value(value) {
    const dateTime = value && moment__WEBPACK_IMPORTED_MODULE_0___default()(value)
    this._dateBox.value = dateTime && dateTime.format('YYYY-MM-DD')
    this._timeBox.value = dateTime && dateTime.format('HH:mm')
    this.dataset.value = value || ''
  }
}


/***/ }),
/* 395 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ClearButton": () => (/* binding */ ClearButton)
/* harmony export */ });
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(289);
/* harmony import */ var _ClearButton_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(396);



class ClearButton extends _Button__WEBPACK_IMPORTED_MODULE_0__.Button
{
  activate() {
    const widget = this.widget
    if(!widget || !widget.value) {
      return
    }
    widget.value = ''
    widget.emit('change')
  }

  onValue(record, elem) {
    this.disabled = !elem.value
  }

  get widget() {
    return this.controls[0] || null
  }

  set widget(widget) {
    const oldWidget = this.widget
    oldWidget && oldWidget.removeAttrObserver('data-value', this.onValue, this)
    widget && widget.addAttrObserver('data-value', this.onValue, this)
    super.controls = widget
  }
}

ClearButton.tabIndex = null


/***/ }),
/* 396 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 397 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DateBox": () => (/* binding */ DateBox)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(381);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ClearButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(395);
/* harmony import */ var _ComboBox__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(330);
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(290);
/* harmony import */ var _DateCell__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(398);
/* harmony import */ var _DatePicker__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(401);
/* harmony import */ var _Dialog__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(359);
/* harmony import */ var _Inner__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(331);
/* harmony import */ var _Popup__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(292);
/* harmony import */ var _ShortcutButton__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(411);
/* harmony import */ var _DateBox_css__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(414);












const NBSP = ' '

class DateBox extends _ComboBox__WEBPACK_IMPORTED_MODULE_2__.ComboBox
{
  build(init) {
    this._value = null
    this._text = init.text || NBSP
    this._weekday = NaN
    this.expanded = false
    this.hasPopup = 'dialog'
    return this._control = new _Control__WEBPACK_IMPORTED_MODULE_3__.Control([
      this._inner = new _Inner__WEBPACK_IMPORTED_MODULE_7__.Inner(NBSP),
      this._clearButton = new _ClearButton__WEBPACK_IMPORTED_MODULE_1__.ClearButton({
        disabled : !init.value,
        onclick : this.onClearButtonClick.bind(this),
        onmousedown : event => event.stopPropagation(),
      }),
    ])
  }

  activate() {
    if(!this.datePicker) {
      this.datePicker = new this.constructor.DatePicker({ value : this.value })
    }
    super.activate()
  }

  onClearButtonClick(event) {
    event.stopPropagation()
    if(this._value) {
      this.value = null
      this.emit('change')
    }
  }

  onDatePickerChange(event) {
    event.stopPropagation()
  }

  onDatePickerClick(event) {
    if(event.target.closest([_DateCell__WEBPACK_IMPORTED_MODULE_4__.DateCell.selector, _ShortcutButton__WEBPACK_IMPORTED_MODULE_9__.ShortcutButton.selector])) {
      const value = this.value
      this.value = this.datePicker.value
      this.focus()
      this.expanded = false
      value === this.value || this.emit('change')
    }
  }

  onKeyDown(event) {
    super.onKeyDown(...arguments)
    if(!event.key.startsWith('Arrow')) {
      return
    }
    event.preventDefault()
    const key = event.key
    const value = this.value
    const date = value? moment__WEBPACK_IMPORTED_MODULE_0___default()(value, 'YYYY-MM-DD') : moment__WEBPACK_IMPORTED_MODULE_0___default()()
    const method = ['ArrowDown', 'ArrowRight'].includes(key)? 'add' : 'subtract'
    const unit = ['ArrowDown', 'ArrowUp'].includes(key)?
      event.altKey? 'year' : 'week' :
      event.altKey? 'month' : 'day'
    this.expanded || this.activate()
    this.datePicker.value = this.value = date[method](1, unit).format('YYYY-MM-DD')
    this.emit('change')
  }

  onKeyDown_Backspace(event) {
    if(!this.required && this.value) {
      this.value = null
      this.emit('change')
    }
  }

  /**
   * @returns {DatePicker|null}
   */
  get datePicker() {
    return this.controls.find(elem => elem instanceof this.constructor.DatePicker) || null
  }

  /**
   * @param {DatePicker|null} datePicker
   */
  set datePicker(datePicker) {
    if(!datePicker) {
      this.controls = null
      return
    }
    /*this.controls = [
      datePicker,
      new this.constructor.Popup({
        anchor : this,
        children : datePicker
      })
    ]*/
    const dialog = new _Dialog__WEBPACK_IMPORTED_MODULE_6__.Dialog({
      anchor : this,
      children : datePicker,
    })
    this.controls = [
      datePicker,
      // dialog,
      dialog.popup,
    ]
    datePicker.tabIndex = null
    datePicker.weekday = this._weekday
    datePicker.on('click', this.onDatePickerClick, this)
    datePicker.on('change', this.onDatePickerChange, this)
  }

  /**
   * @return {string}
   */
  get text() {
    return this._inner.text
  }

  /**
   * @param {string} text
   */
  set text(text) {
    this._inner.text = text
  }

  get value() {
    return this._value
  }

  set value(value) {
    const datePicker = this.datePicker
    this._clearButton.disabled = !value
    if(this._value = value) {
      const date = moment__WEBPACK_IMPORTED_MODULE_0___default()(value)
      const format = date.isSame(moment__WEBPACK_IMPORTED_MODULE_0___default()(), 'year')?
        (this.compact? 'D.MM' : 'D MMMM') :
        (this.compact? 'D.MM.YYYY' : 'D MMMM YYYY')
      datePicker && (datePicker.value = value)
      this.text = date.format(format)
      return
    }
    datePicker && (datePicker.value = null)
    this.text = this._text
  }

  get weekday() {
    return this._weekday
  }

  set weekday(weekday) {
    this._weekday = weekday
    const datePicker = this.datePicker
    const date = moment__WEBPACK_IMPORTED_MODULE_0___default()(this._value)
    datePicker && (datePicker.weekday = weekday)
    if(date.weekday() !== weekday) {
      this.value = null
    }
  }
}

DateBox.prototype.compact = false
DateBox.DatePicker = _DatePicker__WEBPACK_IMPORTED_MODULE_5__.DatePicker
DateBox.Popup = _Popup__WEBPACK_IMPORTED_MODULE_8__.Popup


/***/ }),
/* 398 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DateCell": () => (/* binding */ DateCell)
/* harmony export */ });
/* harmony import */ var _GridCell__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(399);
/* harmony import */ var _DateCell_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(400);



class DateCell extends _GridCell__WEBPACK_IMPORTED_MODULE_0__.GridCell
{
  init(init) {
    this.on('click', this.onClick)
    super.init(init)
  }

  onClick(event) {
    if(this.disabled) {
      event.stopImmediatePropagation()
    }
  }

  onFocus() {
    void null
  }

  onKeyDown(event) {
    super.onKeyDown(...arguments)
    if(event.code === 'Space' || event.code === 'Enter') {
      this.click()
    }
  }

  onArrowKeyDown(event) {
    event.stopPropagation()
    super.onArrowKeyDown(...arguments)
  }

  set value(value) {
    this.dataset.value = value
  }

  get value() {
    return this.dataset.value
  }
}


/***/ }),
/* 399 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GridCell": () => (/* binding */ GridCell)
/* harmony export */ });
/* harmony import */ var _lib_ariamodule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43);


let undefined

const TABINDEX_INITIAL_VALUE = -1

/**
 * @summary A cell in a grid or treegrid.
 * @see https://www.w3.org/TR/wai-aria-1.1/#gridcell
 */
class GridCell extends _lib_ariamodule__WEBPACK_IMPORTED_MODULE_0__.RoleGridCell
{
  /**
   * @param {{}} init
   */
  init(init) {
    super.init(init)
    this.tabIndex = TABINDEX_INITIAL_VALUE
    this.on('focus', this.onFocus)
    this.on('keydown', this.onKeyDown)
    this.on('mousemove', this.onMouseMove)
    this.on('mousedown', this.onMouseDown)
  }

  /**
   * @param {FocusEvent} event
   */
  onFocus(event) {
    const grid = this.grid
    if(this.selected !== undefined) {
      grid.gridCells.forEach(cell => cell.selected = false)
      this.selected = true
    }
    grid.activeDescendant = this
    grid.gridCells.forEach(cell => cell.tabIndex = cell === this? 0 : -1)
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseDown(event) {
    if(!event.shiftKey) return
    const grid = this.grid
    const focusedCell = grid.focusedCell
    if(!focusedCell) return
    event.preventDefault()
    if(this.disabled) return
    const row = this.row
    if(grid.multiSelectable) {
      if(row.multiSelectable) {
        grid.updateSelection(this)
      }
      else grid.updateSelection(focusedCell.column[this.rowIndex])
    }
    else if(row.multiSelectable) {
      grid.updateSelection(focusedCell.row.cells[this.colIndex])
    }
  }

  /**
   * @param {MouseEvent} event
   */
  onMouseMove(event) {
    if(event.buttons !== 1 || this.disabled) return
    const grid = this.grid
    const row = this.row
    const focusedCell = grid.focusedCell
    if(!focusedCell) return
    if(grid.multiSelectable) {
      if(row.multiSelectable) {
        grid.updateSelection(this)
      }
      else grid.updateSelection(focusedCell.column[this.rowIndex])
    }
    else if(row.multiSelectable) {
      grid.updateSelection(focusedCell.row.cells[this.colIndex])
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    if(event.code.startsWith('Arrow')) {
      this.onArrowKeyDown(event)
    }
    else if(event.code === 'KeyA') {
      this.onKeyDown_KeyA(event)
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowKeyDown(event) {
    event.preventDefault()
    switch(event.code) {
      case 'ArrowUp':
        this.onArrowUpKeyDown(event)
        break
      case 'ArrowDown':
        this.onArrowDownKeyDown(event)
        break
      case 'ArrowLeft':
        this.onArrowLeftKeyDown(event)
        break
      case 'ArrowRight':
        this.onArrowRightKeyDown(event)
        break
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowUpKeyDown(event) {
    const shiftKey = event.shiftKey
    const grid = this.grid
    const activeDescendant = grid.activeDescendant
    const column = shiftKey && this.row.multiSelectable?
      activeDescendant.column :
      this.column
    const rowIndex = shiftKey?
      activeDescendant.rowIndex :
      this.rowIndex
    const cell = column[rowIndex - 1]
    if(cell && cell instanceof GridCell && !cell.disabled) {
      if(shiftKey && grid.multiSelectable) {
        grid.updateSelection(cell)
      }
      else cell.focus()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowDownKeyDown(event) {
    const shiftKey = event.shiftKey
    const grid = this.grid
    const activeDescendant = grid.activeDescendant
    const column = shiftKey && this.row.multiSelectable?
      activeDescendant.column :
      this.column
    const rowIndex = shiftKey?
      activeDescendant.rowIndex :
      this.rowIndex
    const cell = column[rowIndex + 1]
    if(cell && cell instanceof GridCell && !cell.disabled) {
      if(shiftKey && grid.multiSelectable) {
        grid.updateSelection(cell)
      }
      else cell.focus()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowLeftKeyDown(event) {
    const shiftKey = event.shiftKey
    const grid = this.grid
    const activeDescendant = grid.activeDescendant
    const row = shiftKey && grid.multiSelectable?
      activeDescendant.row :
      this.row
    const colIndex = shiftKey?
      grid.activeDescendant.colIndex :
      this.colIndex
    const cell = row.cells[colIndex - 1]
    if(cell && cell instanceof GridCell && !cell.disabled) {
      if(shiftKey && row.multiSelectable) {
        grid.updateSelection(cell)
      }
      else cell.focus()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowRightKeyDown(event) {
    const shiftKey = event.shiftKey
    const grid = this.grid
    const activeDescendant = grid.activeDescendant
    const row = shiftKey && grid.multiSelectable?
      activeDescendant.row :
      this.row
    const colIndex = shiftKey?
      grid.activeDescendant.colIndex :
      this.colIndex
    const cell = row.cells[colIndex + 1]
    if(cell && cell instanceof GridCell && !cell.disabled) {
      if(shiftKey && row.multiSelectable) {
        grid.updateSelection(cell)
      }
      else cell.focus()
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_KeyA(event) {
    if(event.metaKey || event.ctrlKey) {
      event.preventDefault()
      const grid = this.grid
      let cells
      if(grid.multiSelectable) {
        cells = this.row.multiSelectable?
          grid.gridCells :
          this.column
      }
      else if(this.row.multiSelectable) {
        cells = this.row.gridCells
      }
      if(cells && !cells.some(({ disabled }) => disabled)) {
        cells.forEach(cell => cell.selected = true)
      }
    }
  }

  /*/!**
   * @param {boolean} disabled
   *!/
  set disabled(disabled) {
    this.tabIndex = disabled? null : -1
    super.disabled = disabled
  }

  /!**
   * @returns {boolean}
   *!/
  get disabled() {
    return super.disabled
  }*/
}


/***/ }),
/* 400 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 401 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DatePicker": () => (/* binding */ DatePicker)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(381);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(290);
/* harmony import */ var _DateGrid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(402);
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(289);
/* harmony import */ var _MonthYearBox__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(406);
/* harmony import */ var _TodayButton__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(410);
/* harmony import */ var _Widget__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(308);
/* harmony import */ var _DatePicker_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(413);









class DatePicker extends _Widget__WEBPACK_IMPORTED_MODULE_6__.Widget
{
  build(init) {
    this._value = null
    return new _Control__WEBPACK_IMPORTED_MODULE_1__.Control([
      this._monthYearBox = new _MonthYearBox__WEBPACK_IMPORTED_MODULE_4__.MonthYearBox({
        required : true,
        onchange : event => this.onMonthYearBoxChange(event)
      }),
      this._todayButton = new _TodayButton__WEBPACK_IMPORTED_MODULE_5__.TodayButton({
        onclick : this.onShortcutButtonClick.bind(this),
        children : 'today'
      }),
      this._grid = new _DateGrid__WEBPACK_IMPORTED_MODULE_2__.DateGrid({
        onchange : event => this.onGridChange(event)
      })
    ])
  }

  init(init) {
    super.init(init)
    if(!init.value) {
      this._monthYearBox.value = this._grid.month = moment__WEBPACK_IMPORTED_MODULE_0___default()().format('YYYY-MM')
    }
  }

  onMonthYearBoxChange(event) {
    event.stopPropagation()
    const grid = this._grid
    const value = this.value
    const month = this._monthYearBox.value
    month && (grid.month = month)
    if(value) {
      for(const cell of grid.gridCells) {
        cell.selected = cell.value === value
      }
    }
  }

  onShortcutButtonClick(event, elem) {
    this.value = elem.value
    this.emit('change')
  }

  onGridChange(event) {
    event.stopPropagation()
    this._monthYearBox.value = moment__WEBPACK_IMPORTED_MODULE_0___default()(this._grid.value).format('YYYY-MM')
    this._value = this._grid.value
    this.emit('change')
  }

  get disabled() {
    return super.disabled
  }

  set disabled(disabled) {
    for(const button of this.findAll(_Button__WEBPACK_IMPORTED_MODULE_3__.Button)) {
      button.disabled = disabled
    }
    this._grid.disabled = disabled
    super.disabled = disabled
  }

  get value() {
    return this._value
  }

  set value(value) {
    this._value = this._grid.value = value
    this._monthYearBox.value = this._grid.month
  }

  get weekday() {
    return this._grid.weekday
  }

  set weekday(weekday) {
    this._grid.weekday = weekday
    this._todayButton.disabled = !isNaN(weekday) && moment__WEBPACK_IMPORTED_MODULE_0___default()().weekday() !== weekday
  }
}

DatePicker.tabIndex = -1


/***/ }),
/* 402 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DateGrid": () => (/* binding */ DateGrid)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(381);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lib_ariamodule__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(43);
/* harmony import */ var _DateCell__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(398);
/* harmony import */ var _Grid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(403);
/* harmony import */ var _DateGrid_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(405);






const WEEK_DAY_NAMES = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс']

class DateGrid extends _Grid__WEBPACK_IMPORTED_MODULE_3__.Grid
{
  init(init) {
    super.init(init)
    this._month = null
    this._weekday = NaN
    this.on('focusin', this.onFocusIn)
  }

  onFocusIn(event, elem) {
    const cell = this.find(_DateCell__WEBPACK_IMPORTED_MODULE_2__.DateCell, ({ selected }) => selected)
    if(elem === cell) {
      return
    }
    const date = moment__WEBPACK_IMPORTED_MODULE_0___default()(elem.value)
    if(!date.isSame(this.month, 'month')) {
      event.stopPropagation()
      this.month = date.format('YYYY-MM')
      this.value = date.format('YYYY-MM-DD')
      const cell = this.activeDescendant = this.find(_DateCell__WEBPACK_IMPORTED_MODULE_2__.DateCell, ({ selected }) => selected)
      cell.focus()
      this.emit('change')
      return
    }
    cell && (cell.selected = false)
    elem.selected = true
    this.activeDescendant = elem
    this.emit('change')
  }

  resetTabIndex() {
    const cells = this.gridCells.filter(({ disabled }) => !disabled)
    const selectedCells = cells.filter(({ selected }) => selected)
    const targetCell = selectedCells[0] || cells[0]
    for(const cell of cells) {
      cell.tabIndex = cell === targetCell? 0 : -1
    }
  }

  get month() {
    return this._month
  }

  set month(month) {
    const time = moment__WEBPACK_IMPORTED_MODULE_0___default()(month, 'YYYY-MM').utcOffset(180)
    const start = time.clone().startOf('month').startOf('week')
    const end = start.clone().add(6, 'week')
    const weekday = this._weekday
    const rows = []
    while(start.isBefore(end)) {
      const row = new _Grid__WEBPACK_IMPORTED_MODULE_3__.Row
      WEEK_DAY_NAMES.forEach(() => {
        row.append(new _DateCell__WEBPACK_IMPORTED_MODULE_2__.DateCell({
          value : start.format('YYYY-MM-DD'),
          selected : false,
          current : start.isSame(moment__WEBPACK_IMPORTED_MODULE_0___default()().utcOffset(180), 'date')? 'date' : false,
          disabled : !isNaN(weekday) && start.weekday() !== weekday,
          class : { current : start.isSame(time, 'month') },
          text : start.format('D'),
        }))
        start.add(1, 'day')
      })
      rows.push(row)
    }
    this.children = [
      new _lib_ariamodule__WEBPACK_IMPORTED_MODULE_1__.RowGroup(new _Grid__WEBPACK_IMPORTED_MODULE_3__.Row(WEEK_DAY_NAMES.map(name => new _lib_ariamodule__WEBPACK_IMPORTED_MODULE_1__.ColumnHeader(name)))),
      new _lib_ariamodule__WEBPACK_IMPORTED_MODULE_1__.RowGroup(rows),
    ]
    this._month = month
    this.resetTabIndex()
  }

  get value() {
    const cell = this.find(_DateCell__WEBPACK_IMPORTED_MODULE_2__.DateCell, ({ selected }) => selected)
    return cell? cell.value : ''
  }

  set value(value) {
    if(value) {
      if(!moment__WEBPACK_IMPORTED_MODULE_0___default()(value, 'YYYY-MM-DD').utcOffset(180).isSame(this.value, 'month')) {
        this.month = value
      }
    }
    for(const cell of this.gridCells) {
      cell.selected = !!value && cell.value === value
    }
    this.resetTabIndex()
  }

  get weekday() {
    return this._weekday
  }

  set weekday(weekday) {
    for(const cell of this.gridCells) {
      const date = moment__WEBPACK_IMPORTED_MODULE_0___default()(cell.value)
      if(cell.disabled = !isNaN(weekday) && date.weekday() !== weekday) {
        cell.selected && (cell.selected = false)
      }
    }
    this._weekday = weekday
    this.resetTabIndex()
  }
}


/***/ }),
/* 403 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Grid": () => (/* binding */ Grid),
/* harmony export */   "GridCell": () => (/* reexport safe */ _GridCell__WEBPACK_IMPORTED_MODULE_1__.GridCell),
/* harmony export */   "Row": () => (/* reexport safe */ _Row__WEBPACK_IMPORTED_MODULE_2__.Row),
/* harmony export */   "RowGroup": () => (/* reexport safe */ _lib_ariamodule__WEBPACK_IMPORTED_MODULE_0__.RowGroup),
/* harmony export */   "RowHeader": () => (/* reexport safe */ _lib_ariamodule__WEBPACK_IMPORTED_MODULE_0__.RowHeader),
/* harmony export */   "ColumnHeader": () => (/* reexport safe */ _lib_ariamodule__WEBPACK_IMPORTED_MODULE_0__.ColumnHeader),
/* harmony export */   "Caption": () => (/* reexport safe */ _lib_ariamodule__WEBPACK_IMPORTED_MODULE_0__.Caption)
/* harmony export */ });
/* harmony import */ var _lib_ariamodule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43);
/* harmony import */ var _GridCell__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(399);
/* harmony import */ var _Row__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(404);








/**
 * @summary A composite widget containing a collection of one or more rows with one
 *  or more cells where some or all cells in the grid are focusable by using
 *  methods of two-dimensional navigation, such as directional arrow keys.
 * @see https://www.w3.org/TR/wai-aria-1.1/#grid
 */
class Grid extends _lib_ariamodule__WEBPACK_IMPORTED_MODULE_0__.RoleGrid
{
  /**
   * Reset grid tabIndex
   */
  resetTabIndex() {
    const cells = this.gridCells.filter(({ disabled }) => !disabled)
    if(!cells.some(({ tabIndex }) => tabIndex === 0)) {
      const first = cells[0]
      if(first) {
        first.tabIndex = 0
      }
    }
  }

  /**
   * Update selection according to the focused and active descendant cell
   */
  updateSelection(targetCell) {
    const focusedCell = this.focusedCell
    if(focusedCell && focusedCell.selected) {
      const rowIndex1 = focusedCell.rowIndex
      const rowIndex2 = targetCell.rowIndex
      const colIndex1 = focusedCell.colIndex
      const colIndex2 = targetCell.colIndex
      const rowIndexMin = Math.min(rowIndex1, rowIndex2)
      const rowIndexMax = Math.max(rowIndex1, rowIndex2)
      const colIndexMin = Math.min(colIndex1, colIndex2)
      const colIndexMax = Math.max(colIndex1, colIndex2)
      const cells = []
      for(const cell of this.gridCells) {
        const { rowIndex, colIndex } = cell
        if(rowIndex >= rowIndexMin && rowIndex <= rowIndexMax) {
          if(colIndex >= colIndexMin && colIndex <= colIndexMax) {
            if(cell.disabled) return
            cells.push(cell)
          }
        }
      }
      this.gridCells.forEach(cell => cell.selected = cells.includes(cell))
      this.activeDescendant = targetCell
    }
  }

  /**
   * @param {*} children
   */
  set children(children) {
    super.children = children
    this.resetTabIndex()
  }

  /**
   * @returns {DomElem[]|*}
   */
  get children() {
    return super.children
  }

  /**
   * @returns {GridCell}
   */
  get focusedCell() {
    const activeElem = this.doc.activeElem
    return this.find(_GridCell__WEBPACK_IMPORTED_MODULE_1__.GridCell, cell => cell === activeElem)
  }
}




/***/ }),
/* 404 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Row": () => (/* binding */ Row)
/* harmony export */ });
/* harmony import */ var _lib_ariamodule__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(43);


/**
 * @summary A row of cells in a tabular container.
 * @see https://www.w3.org/TR/wai-aria-1.1/#row
 */
class Row extends _lib_ariamodule__WEBPACK_IMPORTED_MODULE_0__.RoleRow
{
  /**
   * @param {FocusEvent} event
   */
  onFocus(event) {
    const parent = this.rowGroup || this.table
    for(const row of parent.rows) {
      row.tabIndex = row === this? 0 : -1
      if(row.selected !== undefined) {
        row.selected = row === this
      }
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown(event) {
    if(event.target === this.node) {
      switch(event.key) {
        case ' ':
          this.onKeyDown_Space(event)
          break
        case 'Enter':
          this.onKeyDown_Enter(event)
          break
        case 'ArrowUp':
          this.onArrowUpKeyDown(event)
          break
        case 'ArrowDown':
          this.onArrowDownKeyDown(event)
          break
      }
    }
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Space(event) {
    event.preventDefault()
    const handler = event => {
      this.classList.remove('active')
      this.click()
      this.off('keyup', handler)
    }
    this.classList.add('active')
    this.on('keyup', handler)
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown_Enter(event) {
    this.click()
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowUpKeyDown(event) {
    event.preventDefault()
    const parent = this.rowGroup || this.table
    const rows = parent.rows.filter(({ node, disabled }) => {
      return !disabled && getComputedStyle(node).display !== 'none'
    })
    const row = rows[rows.indexOf(this) - 1]
    row && row.focus()
  }

  /**
   * @param {KeyboardEvent} event
   */
  onArrowDownKeyDown(event) {
    event.preventDefault()
    const parent = this.rowGroup || this.table
    const rows = parent.rows.filter(({ node, disabled }) => {
      return !disabled && getComputedStyle(node).display !== 'none'
    })
    const row = rows[rows.indexOf(this) + 1]
    row && row.focus()
  }

  /**
   * @param {number|null} tabIndex
   */
  set tabIndex(tabIndex) {
    if(tabIndex !== null) {
      this.on('focus', this.onFocus)
      this.on('keydown', this.onKeyDown)
    }
    super.tabIndex = tabIndex
  }

  /**
   * @returns {number|null}
   */
  get tabIndex() {
    return super.tabIndex
  }
}


/***/ }),
/* 405 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 406 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MonthYearBox": () => (/* binding */ MonthYearBox)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(381);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Complex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(341);
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(290);
/* harmony import */ var _MonthBox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(407);
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(289);
/* harmony import */ var _TextInputBox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(374);
/* harmony import */ var _MonthYearBox_css__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(409);








class MonthYearBox extends _Complex__WEBPACK_IMPORTED_MODULE_1__.Complex
{
  build(init) {
    return new _Control__WEBPACK_IMPORTED_MODULE_2__.Control([
      this._decrButton = new DecrButton({
        tabIndex : null,
        onclick : event => this.shiftMonth('subtract'),
      }),
      this._incrButton = new IncrButton({
        tabIndex : null,
        onclick : event => this.shiftMonth('add'),
      }),
      this._monthBox = new _MonthBox__WEBPACK_IMPORTED_MODULE_3__.MonthBox({
        text : '____'
      }),
      this._yearBox = new _TextInputBox__WEBPACK_IMPORTED_MODULE_5__.TextInputBox({
        type : 'number',
        value : moment__WEBPACK_IMPORTED_MODULE_0___default()().format('YYYY'),
        min : 1970,
        max : 2100
      })
    ])
  }

  shiftMonth(method) {
    let value = this.value
    const month = value? moment__WEBPACK_IMPORTED_MODULE_0___default()(value, 'YYYY-MM') : moment__WEBPACK_IMPORTED_MODULE_0___default()()
    month[method](1, 'month')
    this.value = month.format('YYYY-MM')
    this.emit('change')
  }

  get required() {
    return this._monthBox.required
  }

  set required(required) {
    this._monthBox.required = required
  }

  get value() {
    const month = this._monthBox.value
    const year = this._yearBox.value
    return month && year? year + '-' + month : null
  }

  set value(value) {
    const [year, month] = value? value.split('-') : ''
    this._yearBox.value = year || null
    this._monthBox.value = month || null
  }
}

MonthYearBox.tabIndex = null

class IncrButton extends _Button__WEBPACK_IMPORTED_MODULE_4__.Button
{
}

class DecrButton extends _Button__WEBPACK_IMPORTED_MODULE_4__.Button
{
}


/***/ }),
/* 407 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "MonthBox": () => (/* binding */ MonthBox)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(381);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _SelectBox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(329);
/* harmony import */ var _MonthBox_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(408);




class MonthBox extends _SelectBox__WEBPACK_IMPORTED_MODULE_1__.SelectBox
{
  init(init) {
    super.init(init)
    this.options = Array.from(new Array(12)).map((_, i) => {
      const month = moment__WEBPACK_IMPORTED_MODULE_0___default()(i + 1, 'M')
      return new _SelectBox__WEBPACK_IMPORTED_MODULE_1__.Option({
        value : month.format('MM'),
        children : month.format('MMMM')
      })
    })
  }
}


/***/ }),
/* 408 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 409 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 410 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TodayButton": () => (/* binding */ TodayButton)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(381);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ShortcutButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(411);
/* harmony import */ var _TodayButton_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(412);




class TodayButton extends _ShortcutButton__WEBPACK_IMPORTED_MODULE_1__.ShortcutButton
{
  init(init) {
    super.init(init)
    this.value = moment__WEBPACK_IMPORTED_MODULE_0___default()().format('YYYY-MM-DD')
  }
}


/***/ }),
/* 411 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "ShortcutButton": () => (/* binding */ ShortcutButton)
/* harmony export */ });
/* harmony import */ var _Button__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(289);


class ShortcutButton extends _Button__WEBPACK_IMPORTED_MODULE_0__.Button
{
  activate() {
    const elem = this.controls[0]
    if(!elem) {
      return
    }
    const value = elem.value
    elem.value = this.value
    elem.focus()
    value === elem.value || elem.emit('change')
  }
}

ShortcutButton.prototype.value = null


/***/ }),
/* 412 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 413 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 414 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 415 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 416 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 417 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DurationGroupBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(418);
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(286);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_1__.Heading('DurationGroupBox'),
    new _DurationGroupBox__WEBPACK_IMPORTED_MODULE_0__.DurationGroupBox({
      labels : 'Simple',
      value : {
        months : 3,
        days : 5,
        minutes : 45,
      },
    }),
    /*new DurationGroupBox({
      labels : 'Simple',
      value : {
        years : 2,
        weeks : 3,
        hours : 12,
      },
    }),
    new DurationGroupBox({
      labels : 'Simple',
      value : {
        months : 12,
        days : 14,
        minutes : 180,
      },
    }),
    new DurationGroupBox({
      labels : 'Simple',
      value : {
        months : 13,
        days : 20,
        minutes : 75,
      },
    }),*/
  ]
});


/***/ }),
/* 418 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DurationGroupBox": () => (/* binding */ DurationGroupBox)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(381);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _Complex__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(341);
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(290);
/* harmony import */ var _DurationBox__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(390);
/* harmony import */ var _DurationGroupBox_css__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(419);






class DurationGroupBox extends _Complex__WEBPACK_IMPORTED_MODULE_1__.Complex
{
  build(init) {
    return new _Control__WEBPACK_IMPORTED_MODULE_2__.Control([
      this._myBox = new _DurationBox__WEBPACK_IMPORTED_MODULE_3__.DurationBox({
        units : ['months', 'years'],
      }),
      this._dwBox = new _DurationBox__WEBPACK_IMPORTED_MODULE_3__.DurationBox({
        units : ['days', 'weeks'],
      }),
      this._mhBox = new _DurationBox__WEBPACK_IMPORTED_MODULE_3__.DurationBox({
        units : ['minutes', 'hours'],
      }),
    ])
  }

  get value() {
    const duration = moment__WEBPACK_IMPORTED_MODULE_0___default().duration(this._myBox.value)
    duration.add(this._dwBox.value)
    duration.add(this._mhBox.value)
    return duration.toISOString()
  }

  /**
   * @param {string|{years,months,weeks,days,hours,minutes}|null} value
   */
  set value(value) {
    const duration = value && moment__WEBPACK_IMPORTED_MODULE_0___default().duration(value)
    const years = duration && duration.years() || 0
    const months = duration && duration.months() || 0
    const weeks = duration && duration.weeks() || 0
    const days = duration && duration.days() || 0
    const hours = duration && duration.hours() || 0
    const minutes = duration && duration.minutes() || 0
    if(months && months % 12) {
      this._myBox.unit = 'months'
      this._myBox.value = months + years * 12
    }
    else if(years) {
      this._myBox.unit = 'years'
      this._myBox.value = years
    }
    else this._myBox.value = null
    if(days && days % 7) {
      this._dwBox.unit = 'days'
      this._dwBox.value = days
    }
    else if(weeks) {
      this._dwBox.unit = 'weeks'
      this._dwBox.value = weeks
    }
    else this._dwBox.value = null
    if(minutes && minutes % 60) {
      this._mhBox.unit = 'minutes'
      this._mhBox.value = minutes + hours * 60
    }
    else if(hours) {
      this._mhBox.unit = 'hours'
      this._mhBox.value = hours
    }
    else this._mhBox.value = null
  }
}


/***/ }),
/* 419 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),
/* 420 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(286);
/* harmony import */ var _MonthYearBox__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(406);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_0__.Heading('MonthYearBox'),
    new _MonthYearBox__WEBPACK_IMPORTED_MODULE_1__.MonthYearBox({
      labels : 'Simple',
    }),
  ]
});


/***/ }),
/* 421 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DatePicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(401);
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(286);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_1__.Heading('DatePicker'),
    new _DatePicker__WEBPACK_IMPORTED_MODULE_0__.DatePicker({
      labels : 'Simple',
    }),
  ]
});


/***/ }),
/* 422 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DateBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(397);
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(286);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_1__.Heading('DateBox'),
    new _DateBox__WEBPACK_IMPORTED_MODULE_0__.DateBox({
      labels : 'Simple',
    }),
    new _DateBox__WEBPACK_IMPORTED_MODULE_0__.DateBox({
      labels : 'Required',
      required : true,
    }),
    new _DateBox__WEBPACK_IMPORTED_MODULE_0__.DateBox({
      labels : 'Disabled',
      disabled : true,
    }),
  ]
});


/***/ }),
/* 423 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DateTimeBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(394);
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(286);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_1__.Heading('DateTimeBox'),
    new _DateTimeBox__WEBPACK_IMPORTED_MODULE_0__.DateTimeBox({
      labels : 'Simple',
    }),
    new _DateTimeBox__WEBPACK_IMPORTED_MODULE_0__.DateTimeBox({
      labels : 'Required',
      required : true,
    }),
    new _DateTimeBox__WEBPACK_IMPORTED_MODULE_0__.DateTimeBox({
      labels : 'Disabled',
      disabled : true,
    }),
  ]
});


/***/ }),
/* 424 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _DateTimeRangeBox__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(425);
/* harmony import */ var _Heading__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(286);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (() => {
  return [
    new _Heading__WEBPACK_IMPORTED_MODULE_1__.Heading('DateTimeRangeBox'),
    new _DateTimeRangeBox__WEBPACK_IMPORTED_MODULE_0__.DateTimeRangeBox({
      labels : 'Simple',
    }),
    new _DateTimeRangeBox__WEBPACK_IMPORTED_MODULE_0__.DateTimeRangeBox({
      labels : 'Disabled',
      disabled : true,
    }),
  ]
});


/***/ }),
/* 425 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "DateTimeRangeBox": () => (/* binding */ DateTimeRangeBox)
/* harmony export */ });
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(381);
/* harmony import */ var moment__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(moment__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _ClearButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(395);
/* harmony import */ var _Complex__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(341);
/* harmony import */ var _Control__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(290);
/* harmony import */ var _Dash__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(373);
/* harmony import */ var _DateBox__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(397);
/* harmony import */ var _TimeBox__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(380);
/* harmony import */ var _DateTimeRangeBox_css__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(426);









class DateTimeRangeBox extends _Complex__WEBPACK_IMPORTED_MODULE_2__.Complex
{
  build({ compact, required }) {
    this._value = null
    this._step = '00:05'
    return new _Control__WEBPACK_IMPORTED_MODULE_3__.Control([
      this._beginDateBox = new _DateBox__WEBPACK_IMPORTED_MODULE_5__.DateBox({
        title : 'Дата начала',
        text : '____',
        compact,
      }),
      this._beginTimeBox = new _TimeBox__WEBPACK_IMPORTED_MODULE_6__.TimeBox({
        title : 'Время начала',
      }),
      new _Dash__WEBPACK_IMPORTED_MODULE_4__.Dash,
      this._endTimeBox = new _TimeBox__WEBPACK_IMPORTED_MODULE_6__.TimeBox({
        title : 'Время окончания',
      }),
      this._endDateBox = new _DateBox__WEBPACK_IMPORTED_MODULE_5__.DateBox({
        title : 'Дата окончания',
        text : '____',
        compact,
      }),
      this._clearButton = required? null : new _ClearButton__WEBPACK_IMPORTED_MODULE_1__.ClearButton({
        title : 'Очистить',
        disabled : true,
        onclick : event => {
          this._value = this.value = null
          this._clearButton.disabled = true
          this.emit('change')
        },
      }),
    ])
  }

  onWidgetChange(event, elem) {
    if(this.value === this._value) {
      return
    }
    this._value = this.value
    if(this._clearButton) {
      this._clearButton.disabled = !this._value
    }
    super.onWidgetChange(event, elem)
  }

  get step() {
    return this._step
  }

  set step(step) {
    this._step = this._endTimeBox.step = this._beginTimeBox.step = step
  }

  get value() {
    const beginDateVal = this._beginDateBox.value
    const beginTimeVal = this._beginTimeBox.value
    const endDateVal = this._endDateBox.value
    const endTimeVal = this._endTimeBox.value
    let begin, end
    if(endDateVal) {
      end = endTimeVal?
        moment__WEBPACK_IMPORTED_MODULE_0___default()(endDateVal + 'T' + endTimeVal) :
        moment__WEBPACK_IMPORTED_MODULE_0___default()(endDateVal).add(1, 'day')
    }
    if(beginDateVal) {
      begin = beginTimeVal?
        moment__WEBPACK_IMPORTED_MODULE_0___default()(beginDateVal + 'T' + beginTimeVal) :
        moment__WEBPACK_IMPORTED_MODULE_0___default()(beginDateVal)
      /*if(!end) {
        end = endTimeVal?
          moment(beginDateVal + 'T' + endTimeVal) :
          moment(beginDateVal).add(1, 'day')
      }*/
    }
    return begin || end?
      [begin? begin.format() : null, end? end.format() : null] :
      null
  }

  set value(value) {
    const beginAt = value && value[0] && value[0].value
    const endAt = value && value[1] && value[1].value
    const begin = beginAt && moment__WEBPACK_IMPORTED_MODULE_0___default()(beginAt)
    const end = endAt && moment__WEBPACK_IMPORTED_MODULE_0___default()(endAt)
    this._beginDateBox.value = begin && begin.format('YYYY-MM-DD')
    this._beginTimeBox.value = begin && begin.format('HH:mm')
    this._endDateBox.value = end && end.format('YYYY-MM-DD')
    this._endTimeBox.value = end && end.format('HH:mm')
    if(this._clearButton) {
      this._clearButton.disabled = !value
    }
  }
}

DateTimeRangeBox.prototype.name = null
DateTimeRangeBox.tabIndex = null


/***/ }),
/* 426 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var focus_visible__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var focus_visible__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(focus_visible__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _root_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);
/* harmony import */ var _Showcase__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3);
/* harmony import */ var _Test__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(284);





new _Showcase__WEBPACK_IMPORTED_MODULE_2__.Showcase({
  parent : document.body,
  children : [
    __webpack_require__(285).default(),
    __webpack_require__(288).default(),
    __webpack_require__(311).default(),
    __webpack_require__(314).default(),
    __webpack_require__(319).default(),
    __webpack_require__(328).default(),
    __webpack_require__(333).default(),
    __webpack_require__(339).default(),

    __webpack_require__(344).default(),
    __webpack_require__(353).default(),
    __webpack_require__(365).default(),

    __webpack_require__(371).default(),

    __webpack_require__(379).default(),
    __webpack_require__(383).default(),
    __webpack_require__(386).default(),

    __webpack_require__(389).default(),
    __webpack_require__(392).default(),
    __webpack_require__(417).default(),

    __webpack_require__(420).default(),
    __webpack_require__(421).default(),
    __webpack_require__(422).default(),

    __webpack_require__(423).default(),
    __webpack_require__(424).default(),
  ]
  .map(test => test instanceof _Test__WEBPACK_IMPORTED_MODULE_3__.Test? test : new _Test__WEBPACK_IMPORTED_MODULE_3__.Test(test))
})

})();

/******/ })()
;