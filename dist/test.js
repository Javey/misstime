/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 41);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(26);
module.exports.default = module.exports;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
    return [];
};

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", { value: true });
var inferno_shared_1 = __webpack_require__(0);
var options_1 = __webpack_require__(3);
var VNodes_1 = __webpack_require__(4);
var constants_1 = __webpack_require__(8);
var mounting_1 = __webpack_require__(6);
var unmounting_1 = __webpack_require__(11);
// We need EMPTY_OBJ defined in one place.
// Its used for comparison so we cant inline it into shared
exports.EMPTY_OBJ = {};
if (process.env.NODE_ENV !== 'production') {
    Object.freeze(exports.EMPTY_OBJ);
}
function createClassComponentInstance(vNode, Component, props, context, isSVG, lifecycle) {
    if (inferno_shared_1.isUndefined(context)) {
        context = exports.EMPTY_OBJ; // Context should not be mutable
    }
    var instance = new Component(props, context);
    vNode.children = instance;
    instance._blockSetState = false;
    instance.context = context;
    if (instance.props === exports.EMPTY_OBJ) {
        instance.props = props;
    }
    // setState callbacks must fire after render is done when called from componentWillReceiveProps or componentWillMount
    instance._lifecycle = lifecycle;
    instance._unmounted = false;
    instance._pendingSetState = true;
    instance._isSVG = isSVG;
    if (!inferno_shared_1.isUndefined(instance.componentWillMount)) {
        instance._blockRender = true;
        instance.componentWillMount();
        instance._blockRender = false;
    }
    var childContext;
    if (!inferno_shared_1.isUndefined(instance.getChildContext)) {
        childContext = instance.getChildContext();
    }
    if (inferno_shared_1.isNullOrUndef(childContext)) {
        instance._childContext = context;
    } else {
        instance._childContext = inferno_shared_1.combineFrom(context, childContext);
    }
    if (!inferno_shared_1.isNull(options_1.options.beforeRender)) {
        options_1.options.beforeRender(instance);
    }
    var input = instance.render(props, instance.state, context);
    if (!inferno_shared_1.isNull(options_1.options.afterRender)) {
        options_1.options.afterRender(instance);
    }
    if (inferno_shared_1.isArray(input)) {
        if (process.env.NODE_ENV !== 'production') {
            inferno_shared_1.throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
        }
        inferno_shared_1.throwError();
    } else if (inferno_shared_1.isInvalid(input)) {
        input = VNodes_1.createVoidVNode();
    } else if (inferno_shared_1.isStringOrNumber(input)) {
        input = VNodes_1.createTextVNode(input, null);
    } else {
        if (input.dom) {
            input = VNodes_1.directClone(input);
        }
        if (input.flags & 28 /* Component */) {
                // if we have an input that is also a component, we run into a tricky situation
                // where the root vNode needs to always have the correct DOM entry
                // so we break monomorphism on our input and supply it our vNode as parentVNode
                // we can optimise this in the future, but this gets us out of a lot of issues
                input.parentVNode = vNode;
            }
    }
    instance._pendingSetState = false;
    instance._lastInput = input;
    return instance;
}
exports.createClassComponentInstance = createClassComponentInstance;
function replaceLastChildAndUnmount(lastInput, nextInput, parentDom, lifecycle, context, isSVG, isRecycling) {
    replaceVNode(parentDom, mounting_1.mount(nextInput, null, lifecycle, context, isSVG), lastInput, lifecycle, isRecycling);
}
exports.replaceLastChildAndUnmount = replaceLastChildAndUnmount;
function replaceVNode(parentDom, dom, vNode, lifecycle, isRecycling) {
    unmounting_1.unmount(vNode, null, lifecycle, false, isRecycling);
    replaceChild(parentDom, dom, vNode.dom);
}
exports.replaceVNode = replaceVNode;
function createFunctionalComponentInput(vNode, component, props, context) {
    var input = component(props, context);
    if (inferno_shared_1.isArray(input)) {
        if (process.env.NODE_ENV !== 'production') {
            inferno_shared_1.throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
        }
        inferno_shared_1.throwError();
    } else if (inferno_shared_1.isInvalid(input)) {
        input = VNodes_1.createVoidVNode();
    } else if (inferno_shared_1.isStringOrNumber(input)) {
        input = VNodes_1.createTextVNode(input, null);
    } else {
        if (input.dom) {
            input = VNodes_1.directClone(input);
        }
        if (input.flags & 28 /* Component */) {
                // if we have an input that is also a component, we run into a tricky situation
                // where the root vNode needs to always have the correct DOM entry
                // so we break monomorphism on our input and supply it our vNode as parentVNode
                // we can optimise this in the future, but this gets us out of a lot of issues
                input.parentVNode = vNode;
            }
    }
    return input;
}
exports.createFunctionalComponentInput = createFunctionalComponentInput;
function setTextContent(dom, text) {
    if (text !== '') {
        dom.textContent = text;
    } else {
        dom.appendChild(document.createTextNode(''));
    }
}
exports.setTextContent = setTextContent;
function updateTextContent(dom, text) {
    dom.firstChild.nodeValue = text;
}
exports.updateTextContent = updateTextContent;
function appendChild(parentDom, dom) {
    parentDom.appendChild(dom);
}
exports.appendChild = appendChild;
function insertOrAppend(parentDom, newNode, nextNode) {
    if (inferno_shared_1.isNullOrUndef(nextNode)) {
        appendChild(parentDom, newNode);
    } else {
        parentDom.insertBefore(newNode, nextNode);
    }
}
exports.insertOrAppend = insertOrAppend;
function documentCreateElement(tag, isSVG) {
    if (isSVG === true) {
        return document.createElementNS(constants_1.svgNS, tag);
    } else {
        return document.createElement(tag);
    }
}
exports.documentCreateElement = documentCreateElement;
function replaceWithNewNode(lastNode, nextNode, parentDom, lifecycle, context, isSVG, isRecycling) {
    unmounting_1.unmount(lastNode, null, lifecycle, false, isRecycling);
    var dom = mounting_1.mount(nextNode, null, lifecycle, context, isSVG);
    nextNode.dom = dom;
    replaceChild(parentDom, dom, lastNode.dom);
}
exports.replaceWithNewNode = replaceWithNewNode;
function replaceChild(parentDom, nextDom, lastDom) {
    if (!parentDom) {
        parentDom = lastDom.parentNode;
    }
    parentDom.replaceChild(nextDom, lastDom);
}
exports.replaceChild = replaceChild;
function removeChild(parentDom, dom) {
    parentDom.removeChild(dom);
}
exports.removeChild = removeChild;
function removeAllChildren(dom, children, lifecycle, isRecycling) {
    dom.textContent = '';
    if (!options_1.options.recyclingEnabled || options_1.options.recyclingEnabled && !isRecycling) {
        removeChildren(null, children, lifecycle, isRecycling);
    }
}
exports.removeAllChildren = removeAllChildren;
function removeChildren(dom, children, lifecycle, isRecycling) {
    for (var i = 0, len = children.length; i < len; i++) {
        var child = children[i];
        if (!inferno_shared_1.isInvalid(child)) {
            unmounting_1.unmount(child, dom, lifecycle, true, isRecycling);
        }
    }
}
exports.removeChildren = removeChildren;
function isKeyed(lastChildren, nextChildren) {
    return nextChildren.length > 0 && !inferno_shared_1.isNullOrUndef(nextChildren[0]) && !inferno_shared_1.isNullOrUndef(nextChildren[0].key) && lastChildren.length > 0 && !inferno_shared_1.isNullOrUndef(lastChildren[0]) && !inferno_shared_1.isNullOrUndef(lastChildren[0].key);
}
exports.isKeyed = isKeyed;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.options = {
    afterMount: null,
    afterRender: null,
    afterUpdate: null,
    beforeRender: null,
    beforeUnmount: null,
    createVNode: null,
    findDOMNodeEnabled: false,
    recyclingEnabled: false,
    roots: []
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var inferno_shared_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(2);
var normalization_1 = __webpack_require__(16);
var options_1 = __webpack_require__(3);
function VNode(children, className, flags, key, props, ref, type) {
    this.children = children;
    this.className = className;
    this.dom = null;
    this.flags = flags;
    this.key = key;
    this.props = props;
    this.ref = ref;
    this.type = type;
}
/**
 * Creates virtual node
 * @param {number} flags
 * @param {string|Function|null} type
 * @param {string|null=} className
 * @param {object=} children
 * @param {object=} props
 * @param {*=} key
 * @param {object|Function=} ref
 * @param {boolean=} noNormalise
 * @returns {VNode} returns new virtual node
 */
function createVNode(flags, type, className, children, props, key, ref, noNormalise) {
    if (flags & 16 /* ComponentUnknown */) {
            flags = inferno_shared_1.isStatefulComponent(type) ? 4 /* ComponentClass */ : 8 /* ComponentFunction */;
        }
    var vNode = new VNode(children === void 0 ? null : children, className === void 0 ? null : className, flags, key === void 0 ? null : key, props === void 0 ? null : props, ref === void 0 ? null : ref, type);
    if (noNormalise !== true) {
        normalization_1.normalize(vNode);
    }
    if (options_1.options.createVNode !== null) {
        options_1.options.createVNode(vNode);
    }
    return vNode;
}
exports.createVNode = createVNode;
function directClone(vNodeToClone) {
    var newVNode;
    var flags = vNodeToClone.flags;
    if (flags & 28 /* Component */) {
            var props = void 0;
            var propsToClone = vNodeToClone.props;
            if (inferno_shared_1.isNull(propsToClone)) {
                props = utils_1.EMPTY_OBJ;
            } else {
                props = {};
                for (var key in propsToClone) {
                    props[key] = propsToClone[key];
                }
            }
            newVNode = createVNode(flags, vNodeToClone.type, null, null, props, vNodeToClone.key, vNodeToClone.ref, true);
            var newProps = newVNode.props;
            var newChildren = newProps.children;
            // we need to also clone component children that are in props
            // as the children may also have been hoisted
            if (newChildren) {
                if (inferno_shared_1.isArray(newChildren)) {
                    var len = newChildren.length;
                    if (len > 0) {
                        var tmpArray = [];
                        for (var i = 0; i < len; i++) {
                            var child = newChildren[i];
                            if (inferno_shared_1.isStringOrNumber(child)) {
                                tmpArray.push(child);
                            } else if (!inferno_shared_1.isInvalid(child) && isVNode(child)) {
                                tmpArray.push(directClone(child));
                            }
                        }
                        newProps.children = tmpArray;
                    }
                } else if (isVNode(newChildren)) {
                    newProps.children = directClone(newChildren);
                }
            }
            newVNode.children = null;
        } else if (flags & 3970 /* Element */) {
            var children = vNodeToClone.children;
            var props = void 0;
            var propsToClone = vNodeToClone.props;
            if (propsToClone === null) {
                props = utils_1.EMPTY_OBJ;
            } else {
                props = {};
                for (var key in propsToClone) {
                    props[key] = propsToClone[key];
                }
            }
            newVNode = createVNode(flags, vNodeToClone.type, vNodeToClone.className, children, props, vNodeToClone.key, vNodeToClone.ref, !children);
        } else if (flags & 1 /* Text */) {
            newVNode = createTextVNode(vNodeToClone.children, vNodeToClone.key);
        }
    return newVNode;
}
exports.directClone = directClone;
/*
 directClone is preferred over cloneVNode and used internally also.
 This function makes Inferno backwards compatible.
 And can be tree-shaked by modern bundlers

 Would be nice to combine this with directClone but could not do it without breaking change
 */
/**
 * Clones given virtual node by creating new instance of it
 * @param {VNode} vNodeToClone virtual node to be cloned
 * @param {Props=} props additional props for new virtual node
 * @param {...*} _children new children for new virtual node
 * @returns {VNode} new virtual node
 */
function cloneVNode(vNodeToClone, props) {
    var _children = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        _children[_i - 2] = arguments[_i];
    }
    var children = _children;
    var childrenLen = _children.length;
    if (childrenLen > 0 && !inferno_shared_1.isUndefined(_children[0])) {
        if (!props) {
            props = {};
        }
        if (childrenLen === 1) {
            children = _children[0];
        }
        if (!inferno_shared_1.isUndefined(children)) {
            props.children = children;
        }
    }
    var newVNode;
    if (inferno_shared_1.isArray(vNodeToClone)) {
        var tmpArray = [];
        for (var i = 0, len = vNodeToClone.length; i < len; i++) {
            tmpArray.push(directClone(vNodeToClone[i]));
        }
        newVNode = tmpArray;
    } else {
        var flags = vNodeToClone.flags;
        var className = vNodeToClone.className || props && props.className;
        var key = !inferno_shared_1.isNullOrUndef(vNodeToClone.key) ? vNodeToClone.key : props ? props.key : null;
        var ref = vNodeToClone.ref || (props ? props.ref : null);
        if (flags & 28 /* Component */) {
                newVNode = createVNode(flags, vNodeToClone.type, className, null, !vNodeToClone.props && !props ? utils_1.EMPTY_OBJ : inferno_shared_1.combineFrom(vNodeToClone.props, props), key, ref, true);
                var newProps = newVNode.props;
                if (newProps) {
                    var newChildren = newProps.children;
                    // we need to also clone component children that are in props
                    // as the children may also have been hoisted
                    if (newChildren) {
                        if (inferno_shared_1.isArray(newChildren)) {
                            var len = newChildren.length;
                            if (len > 0) {
                                var tmpArray = [];
                                for (var i = 0; i < len; i++) {
                                    var child = newChildren[i];
                                    if (inferno_shared_1.isStringOrNumber(child)) {
                                        tmpArray.push(child);
                                    } else if (!inferno_shared_1.isInvalid(child) && isVNode(child)) {
                                        tmpArray.push(directClone(child));
                                    }
                                }
                                newProps.children = tmpArray;
                            }
                        } else if (isVNode(newChildren)) {
                            newProps.children = directClone(newChildren);
                        }
                    }
                }
                newVNode.children = null;
            } else if (flags & 3970 /* Element */) {
                children = props && !inferno_shared_1.isUndefined(props.children) ? props.children : vNodeToClone.children;
                newVNode = createVNode(flags, vNodeToClone.type, className, children, !vNodeToClone.props && !props ? utils_1.EMPTY_OBJ : inferno_shared_1.combineFrom(vNodeToClone.props, props), key, ref, !children);
            } else if (flags & 1 /* Text */) {
                newVNode = createTextVNode(vNodeToClone.children, key);
            }
    }
    return newVNode;
}
exports.cloneVNode = cloneVNode;
function createVoidVNode() {
    return createVNode(4096 /* Void */, null);
}
exports.createVoidVNode = createVoidVNode;
function createTextVNode(text, key) {
    return createVNode(1 /* Text */, null, null, text, null, key);
}
exports.createTextVNode = createTextVNode;
function isVNode(o) {
    return !!o.flags;
}
exports.isVNode = isVNode;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", { value: true });
var inferno_shared_1 = __webpack_require__(0);
var options_1 = __webpack_require__(3);
var VNodes_1 = __webpack_require__(4);
var constants_1 = __webpack_require__(8);
var delegation_1 = __webpack_require__(27);
var mounting_1 = __webpack_require__(6);
var rendering_1 = __webpack_require__(7);
var unmounting_1 = __webpack_require__(11);
var utils_1 = __webpack_require__(2);
var processElement_1 = __webpack_require__(12);
function patch(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling) {
    if (lastVNode !== nextVNode) {
        var lastFlags = lastVNode.flags;
        var nextFlags = nextVNode.flags;
        if (nextFlags & 28 /* Component */) {
                if (lastFlags & 28 /* Component */) {
                        patchComponent(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, nextFlags & 4 /* ComponentClass */, isRecycling);
                    } else {
                    utils_1.replaceVNode(parentDom, mounting_1.mountComponent(nextVNode, null, lifecycle, context, isSVG, (nextFlags & 4 /* ComponentClass */) > 0), lastVNode, lifecycle, isRecycling);
                }
            } else if (nextFlags & 3970 /* Element */) {
                if (lastFlags & 3970 /* Element */) {
                        patchElement(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
                    } else {
                    utils_1.replaceVNode(parentDom, mounting_1.mountElement(nextVNode, null, lifecycle, context, isSVG), lastVNode, lifecycle, isRecycling);
                }
            } else if (nextFlags & 1 /* Text */) {
                if (lastFlags & 1 /* Text */) {
                        patchText(lastVNode, nextVNode);
                    } else {
                    utils_1.replaceVNode(parentDom, mounting_1.mountText(nextVNode, null), lastVNode, lifecycle, isRecycling);
                }
            } else if (nextFlags & 4096 /* Void */) {
                if (lastFlags & 4096 /* Void */) {
                        patchVoid(lastVNode, nextVNode);
                    } else {
                    utils_1.replaceVNode(parentDom, mounting_1.mountVoid(nextVNode, null), lastVNode, lifecycle, isRecycling);
                }
            } else {
            // Error case: mount new one replacing old one
            utils_1.replaceLastChildAndUnmount(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
        }
    }
}
exports.patch = patch;
function unmountChildren(children, dom, lifecycle, isRecycling) {
    if (VNodes_1.isVNode(children)) {
        unmounting_1.unmount(children, dom, lifecycle, true, isRecycling);
    } else if (inferno_shared_1.isArray(children)) {
        utils_1.removeAllChildren(dom, children, lifecycle, isRecycling);
    } else {
        dom.textContent = '';
    }
}
function patchElement(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling) {
    var nextTag = nextVNode.type;
    var lastTag = lastVNode.type;
    if (lastTag !== nextTag) {
        utils_1.replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
    } else {
        var dom = lastVNode.dom;
        var lastProps = lastVNode.props;
        var nextProps = nextVNode.props;
        var lastChildren = lastVNode.children;
        var nextChildren = nextVNode.children;
        var lastFlags = lastVNode.flags;
        var nextFlags = nextVNode.flags;
        var nextRef = nextVNode.ref;
        var lastClassName = lastVNode.className;
        var nextClassName = nextVNode.className;
        nextVNode.dom = dom;
        isSVG = isSVG || (nextFlags & 128 /* SvgElement */) > 0;
        if (lastChildren !== nextChildren) {
            patchChildren(lastFlags, nextFlags, lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
        }
        // inlined patchProps  -- starts --
        if (lastProps !== nextProps) {
            var lastPropsOrEmpty = lastProps || utils_1.EMPTY_OBJ;
            var nextPropsOrEmpty = nextProps || utils_1.EMPTY_OBJ;
            var hasControlledValue = false;
            if (nextPropsOrEmpty !== utils_1.EMPTY_OBJ) {
                var isFormElement = (nextFlags & 3584 /* FormElement */) > 0;
                if (isFormElement) {
                    hasControlledValue = processElement_1.isControlledFormElement(nextPropsOrEmpty);
                }
                for (var prop in nextPropsOrEmpty) {
                    // do not add a hasOwnProperty check here, it affects performance
                    var nextValue = nextPropsOrEmpty[prop];
                    var lastValue = lastPropsOrEmpty[prop];
                    patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue);
                }
                if (isFormElement) {
                    processElement_1.processElement(nextFlags, nextVNode, dom, nextPropsOrEmpty, false, hasControlledValue);
                }
            }
            if (lastPropsOrEmpty !== utils_1.EMPTY_OBJ) {
                for (var prop in lastPropsOrEmpty) {
                    // do not add a hasOwnProperty check here, it affects performance
                    if (inferno_shared_1.isNullOrUndef(nextPropsOrEmpty[prop])) {
                        removeProp(prop, lastPropsOrEmpty[prop], dom);
                    }
                }
            }
        }
        // inlined patchProps  -- ends --
        if (lastClassName !== nextClassName) {
            if (inferno_shared_1.isNullOrUndef(nextClassName)) {
                dom.removeAttribute('class');
            } else {
                if (isSVG) {
                    dom.setAttribute('class', nextClassName);
                } else {
                    dom.className = nextClassName;
                }
            }
        }
        if (nextRef) {
            if (lastVNode.ref !== nextRef || isRecycling) {
                mounting_1.mountRef(dom, nextRef, lifecycle);
            }
        }
    }
}
exports.patchElement = patchElement;
function patchChildren(lastFlags, nextFlags, lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling) {
    var patchArray = false;
    var patchKeyed = false;
    if (nextFlags & 64 /* HasNonKeyedChildren */) {
            patchArray = true;
        } else if ((lastFlags & 32 /* HasKeyedChildren */) > 0 && (nextFlags & 32 /* HasKeyedChildren */) > 0) {
        patchKeyed = true;
        patchArray = true;
    } else if (inferno_shared_1.isInvalid(nextChildren)) {
        unmountChildren(lastChildren, dom, lifecycle, isRecycling);
    } else if (inferno_shared_1.isInvalid(lastChildren)) {
        if (inferno_shared_1.isStringOrNumber(nextChildren)) {
            utils_1.setTextContent(dom, nextChildren);
        } else {
            if (inferno_shared_1.isArray(nextChildren)) {
                mounting_1.mountArrayChildren(nextChildren, dom, lifecycle, context, isSVG);
            } else {
                mounting_1.mount(nextChildren, dom, lifecycle, context, isSVG);
            }
        }
    } else if (inferno_shared_1.isStringOrNumber(nextChildren)) {
        if (inferno_shared_1.isStringOrNumber(lastChildren)) {
            utils_1.updateTextContent(dom, nextChildren);
        } else {
            unmountChildren(lastChildren, dom, lifecycle, isRecycling);
            utils_1.setTextContent(dom, nextChildren);
        }
    } else if (inferno_shared_1.isArray(nextChildren)) {
        if (inferno_shared_1.isArray(lastChildren)) {
            patchArray = true;
            if (utils_1.isKeyed(lastChildren, nextChildren)) {
                patchKeyed = true;
            }
        } else {
            unmountChildren(lastChildren, dom, lifecycle, isRecycling);
            mounting_1.mountArrayChildren(nextChildren, dom, lifecycle, context, isSVG);
        }
    } else if (inferno_shared_1.isArray(lastChildren)) {
        utils_1.removeAllChildren(dom, lastChildren, lifecycle, isRecycling);
        mounting_1.mount(nextChildren, dom, lifecycle, context, isSVG);
    } else if (VNodes_1.isVNode(nextChildren)) {
        if (VNodes_1.isVNode(lastChildren)) {
            patch(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
        } else {
            unmountChildren(lastChildren, dom, lifecycle, isRecycling);
            mounting_1.mount(nextChildren, dom, lifecycle, context, isSVG);
        }
    }
    if (patchArray) {
        if (patchKeyed) {
            patchKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
        } else {
            patchNonKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
        }
    }
}
function patchComponent(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isClass, isRecycling) {
    var lastType = lastVNode.type;
    var nextType = nextVNode.type;
    var lastKey = lastVNode.key;
    var nextKey = nextVNode.key;
    if (lastType !== nextType || lastKey !== nextKey) {
        utils_1.replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
        return false;
    } else {
        var nextProps = nextVNode.props || utils_1.EMPTY_OBJ;
        if (isClass) {
            var instance = lastVNode.children;
            instance._updating = true;
            if (instance._unmounted) {
                if (inferno_shared_1.isNull(parentDom)) {
                    return true;
                }
                utils_1.replaceChild(parentDom, mounting_1.mountComponent(nextVNode, null, lifecycle, context, isSVG, (nextVNode.flags & 4 /* ComponentClass */) > 0), lastVNode.dom);
            } else {
                var hasComponentDidUpdate = !inferno_shared_1.isUndefined(instance.componentDidUpdate);
                var nextState = instance.state;
                // When component has componentDidUpdate hook, we need to clone lastState or will be modified by reference during update
                var lastState = hasComponentDidUpdate ? inferno_shared_1.combineFrom(nextState, null) : nextState;
                var lastProps = instance.props;
                var childContext = void 0;
                if (!inferno_shared_1.isUndefined(instance.getChildContext)) {
                    childContext = instance.getChildContext();
                }
                nextVNode.children = instance;
                instance._isSVG = isSVG;
                if (inferno_shared_1.isNullOrUndef(childContext)) {
                    childContext = context;
                } else {
                    childContext = inferno_shared_1.combineFrom(context, childContext);
                }
                var lastInput = instance._lastInput;
                var nextInput = instance._updateComponent(lastState, nextState, lastProps, nextProps, context, false, false);
                var didUpdate = true;
                instance._childContext = childContext;
                if (inferno_shared_1.isInvalid(nextInput)) {
                    nextInput = VNodes_1.createVoidVNode();
                } else if (nextInput === inferno_shared_1.NO_OP) {
                    nextInput = lastInput;
                    didUpdate = false;
                } else if (inferno_shared_1.isStringOrNumber(nextInput)) {
                    nextInput = VNodes_1.createTextVNode(nextInput, null);
                } else if (inferno_shared_1.isArray(nextInput)) {
                    if (process.env.NODE_ENV !== 'production') {
                        inferno_shared_1.throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
                    }
                    inferno_shared_1.throwError();
                } else if (inferno_shared_1.isObject(nextInput)) {
                    if (!inferno_shared_1.isNull(nextInput.dom)) {
                        nextInput = VNodes_1.directClone(nextInput);
                    }
                }
                if (nextInput.flags & 28 /* Component */) {
                        nextInput.parentVNode = nextVNode;
                    } else if (lastInput.flags & 28 /* Component */) {
                        lastInput.parentVNode = nextVNode;
                    }
                instance._lastInput = nextInput;
                instance._vNode = nextVNode;
                if (didUpdate) {
                    patch(lastInput, nextInput, parentDom, lifecycle, childContext, isSVG, isRecycling);
                    if (hasComponentDidUpdate) {
                        instance.componentDidUpdate(lastProps, lastState);
                    }
                    if (!inferno_shared_1.isNull(options_1.options.afterUpdate)) {
                        options_1.options.afterUpdate(nextVNode);
                    }
                    if (options_1.options.findDOMNodeEnabled) {
                        rendering_1.componentToDOMNodeMap.set(instance, nextInput.dom);
                    }
                }
                nextVNode.dom = nextInput.dom;
            }
            instance._updating = false;
        } else {
            var shouldUpdate = true;
            var lastProps = lastVNode.props;
            var nextHooks = nextVNode.ref;
            var nextHooksDefined = !inferno_shared_1.isNullOrUndef(nextHooks);
            var lastInput = lastVNode.children;
            var nextInput = lastInput;
            nextVNode.dom = lastVNode.dom;
            nextVNode.children = lastInput;
            if (lastKey !== nextKey) {
                shouldUpdate = true;
            } else {
                if (nextHooksDefined && !inferno_shared_1.isNullOrUndef(nextHooks.onComponentShouldUpdate)) {
                    shouldUpdate = nextHooks.onComponentShouldUpdate(lastProps, nextProps);
                }
            }
            if (shouldUpdate !== false) {
                if (nextHooksDefined && !inferno_shared_1.isNullOrUndef(nextHooks.onComponentWillUpdate)) {
                    nextHooks.onComponentWillUpdate(lastProps, nextProps);
                }
                nextInput = nextType(nextProps, context);
                if (inferno_shared_1.isInvalid(nextInput)) {
                    nextInput = VNodes_1.createVoidVNode();
                } else if (inferno_shared_1.isStringOrNumber(nextInput) && nextInput !== inferno_shared_1.NO_OP) {
                    nextInput = VNodes_1.createTextVNode(nextInput, null);
                } else if (inferno_shared_1.isArray(nextInput)) {
                    if (process.env.NODE_ENV !== 'production') {
                        inferno_shared_1.throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
                    }
                    inferno_shared_1.throwError();
                } else if (inferno_shared_1.isObject(nextInput)) {
                    if (!inferno_shared_1.isNull(nextInput.dom)) {
                        nextInput = VNodes_1.directClone(nextInput);
                    }
                }
                if (nextInput !== inferno_shared_1.NO_OP) {
                    patch(lastInput, nextInput, parentDom, lifecycle, context, isSVG, isRecycling);
                    nextVNode.children = nextInput;
                    if (nextHooksDefined && !inferno_shared_1.isNullOrUndef(nextHooks.onComponentDidUpdate)) {
                        nextHooks.onComponentDidUpdate(lastProps, nextProps);
                    }
                    nextVNode.dom = nextInput.dom;
                }
            }
            if (nextInput.flags & 28 /* Component */) {
                    nextInput.parentVNode = nextVNode;
                } else if (lastInput.flags & 28 /* Component */) {
                    lastInput.parentVNode = nextVNode;
                }
        }
    }
    return false;
}
exports.patchComponent = patchComponent;
function patchText(lastVNode, nextVNode) {
    var nextText = nextVNode.children;
    var dom = lastVNode.dom;
    nextVNode.dom = dom;
    if (lastVNode.children !== nextText) {
        dom.nodeValue = nextText;
    }
}
exports.patchText = patchText;
function patchVoid(lastVNode, nextVNode) {
    nextVNode.dom = lastVNode.dom;
}
exports.patchVoid = patchVoid;
function patchNonKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling) {
    var lastChildrenLength = lastChildren.length;
    var nextChildrenLength = nextChildren.length;
    var commonLength = lastChildrenLength > nextChildrenLength ? nextChildrenLength : lastChildrenLength;
    var i = 0;
    for (; i < commonLength; i++) {
        var nextChild = nextChildren[i];
        if (nextChild.dom) {
            nextChild = nextChildren[i] = VNodes_1.directClone(nextChild);
        }
        patch(lastChildren[i], nextChild, dom, lifecycle, context, isSVG, isRecycling);
    }
    if (lastChildrenLength < nextChildrenLength) {
        for (i = commonLength; i < nextChildrenLength; i++) {
            var nextChild = nextChildren[i];
            if (nextChild.dom) {
                nextChild = nextChildren[i] = VNodes_1.directClone(nextChild);
            }
            utils_1.appendChild(dom, mounting_1.mount(nextChild, null, lifecycle, context, isSVG));
        }
    } else if (nextChildrenLength === 0) {
        utils_1.removeAllChildren(dom, lastChildren, lifecycle, isRecycling);
    } else if (lastChildrenLength > nextChildrenLength) {
        for (i = commonLength; i < lastChildrenLength; i++) {
            unmounting_1.unmount(lastChildren[i], dom, lifecycle, false, isRecycling);
        }
    }
}
exports.patchNonKeyedChildren = patchNonKeyedChildren;
function patchKeyedChildren(a, b, dom, lifecycle, context, isSVG, isRecycling) {
    var aLength = a.length;
    var bLength = b.length;
    var aEnd = aLength - 1;
    var bEnd = bLength - 1;
    var aStart = 0;
    var bStart = 0;
    var i;
    var j;
    var aNode;
    var bNode;
    var nextNode;
    var nextPos;
    var node;
    if (aLength === 0) {
        if (bLength > 0) {
            mounting_1.mountArrayChildren(b, dom, lifecycle, context, isSVG);
        }
        return;
    } else if (bLength === 0) {
        utils_1.removeAllChildren(dom, a, lifecycle, isRecycling);
        return;
    }
    var aStartNode = a[aStart];
    var bStartNode = b[bStart];
    var aEndNode = a[aEnd];
    var bEndNode = b[bEnd];
    if (bStartNode.dom) {
        b[bStart] = bStartNode = VNodes_1.directClone(bStartNode);
    }
    if (bEndNode.dom) {
        b[bEnd] = bEndNode = VNodes_1.directClone(bEndNode);
    }
    // Step 1
    /* eslint no-constant-condition: 0 */
    outer: while (true) {
        // Sync nodes with the same key at the beginning.
        while (aStartNode.key === bStartNode.key) {
            patch(aStartNode, bStartNode, dom, lifecycle, context, isSVG, isRecycling);
            aStart++;
            bStart++;
            if (aStart > aEnd || bStart > bEnd) {
                break outer;
            }
            aStartNode = a[aStart];
            bStartNode = b[bStart];
            if (bStartNode.dom) {
                b[bStart] = bStartNode = VNodes_1.directClone(bStartNode);
            }
        }
        // Sync nodes with the same key at the end.
        while (aEndNode.key === bEndNode.key) {
            patch(aEndNode, bEndNode, dom, lifecycle, context, isSVG, isRecycling);
            aEnd--;
            bEnd--;
            if (aStart > aEnd || bStart > bEnd) {
                break outer;
            }
            aEndNode = a[aEnd];
            bEndNode = b[bEnd];
            if (bEndNode.dom) {
                b[bEnd] = bEndNode = VNodes_1.directClone(bEndNode);
            }
        }
        // Move and sync nodes from right to left.
        if (aEndNode.key === bStartNode.key) {
            patch(aEndNode, bStartNode, dom, lifecycle, context, isSVG, isRecycling);
            utils_1.insertOrAppend(dom, bStartNode.dom, aStartNode.dom);
            aEnd--;
            bStart++;
            aEndNode = a[aEnd];
            bStartNode = b[bStart];
            if (bStartNode.dom) {
                b[bStart] = bStartNode = VNodes_1.directClone(bStartNode);
            }
            continue;
        }
        // Move and sync nodes from left to right.
        if (aStartNode.key === bEndNode.key) {
            patch(aStartNode, bEndNode, dom, lifecycle, context, isSVG, isRecycling);
            nextPos = bEnd + 1;
            nextNode = nextPos < b.length ? b[nextPos].dom : null;
            utils_1.insertOrAppend(dom, bEndNode.dom, nextNode);
            aStart++;
            bEnd--;
            aStartNode = a[aStart];
            bEndNode = b[bEnd];
            if (bEndNode.dom) {
                b[bEnd] = bEndNode = VNodes_1.directClone(bEndNode);
            }
            continue;
        }
        break;
    }
    if (aStart > aEnd) {
        if (bStart <= bEnd) {
            nextPos = bEnd + 1;
            nextNode = nextPos < b.length ? b[nextPos].dom : null;
            while (bStart <= bEnd) {
                node = b[bStart];
                if (node.dom) {
                    b[bStart] = node = VNodes_1.directClone(node);
                }
                bStart++;
                utils_1.insertOrAppend(dom, mounting_1.mount(node, null, lifecycle, context, isSVG), nextNode);
            }
        }
    } else if (bStart > bEnd) {
        while (aStart <= aEnd) {
            unmounting_1.unmount(a[aStart++], dom, lifecycle, false, isRecycling);
        }
    } else {
        aLength = aEnd - aStart + 1;
        bLength = bEnd - bStart + 1;
        var sources = new Array(bLength);
        // Mark all nodes as inserted.
        for (i = 0; i < bLength; i++) {
            sources[i] = -1;
        }
        var moved = false;
        var pos = 0;
        var patched = 0;
        // When sizes are small, just loop them through
        if (bLength <= 4 || aLength * bLength <= 16) {
            for (i = aStart; i <= aEnd; i++) {
                aNode = a[i];
                if (patched < bLength) {
                    for (j = bStart; j <= bEnd; j++) {
                        bNode = b[j];
                        if (aNode.key === bNode.key) {
                            sources[j - bStart] = i;
                            if (pos > j) {
                                moved = true;
                            } else {
                                pos = j;
                            }
                            if (bNode.dom) {
                                b[j] = bNode = VNodes_1.directClone(bNode);
                            }
                            patch(aNode, bNode, dom, lifecycle, context, isSVG, isRecycling);
                            patched++;
                            a[i] = null;
                            break;
                        }
                    }
                }
            }
        } else {
            var keyIndex = new Map();
            // Map keys by their index in array
            for (i = bStart; i <= bEnd; i++) {
                keyIndex.set(b[i].key, i);
            }
            // Try to patch same keys
            for (i = aStart; i <= aEnd; i++) {
                aNode = a[i];
                if (patched < bLength) {
                    j = keyIndex.get(aNode.key);
                    if (!inferno_shared_1.isUndefined(j)) {
                        bNode = b[j];
                        sources[j - bStart] = i;
                        if (pos > j) {
                            moved = true;
                        } else {
                            pos = j;
                        }
                        if (bNode.dom) {
                            b[j] = bNode = VNodes_1.directClone(bNode);
                        }
                        patch(aNode, bNode, dom, lifecycle, context, isSVG, isRecycling);
                        patched++;
                        a[i] = null;
                    }
                }
            }
        }
        // fast-path: if nothing patched remove all old and add all new
        if (aLength === a.length && patched === 0) {
            utils_1.removeAllChildren(dom, a, lifecycle, isRecycling);
            while (bStart < bLength) {
                node = b[bStart];
                if (node.dom) {
                    b[bStart] = node = VNodes_1.directClone(node);
                }
                bStart++;
                utils_1.insertOrAppend(dom, mounting_1.mount(node, null, lifecycle, context, isSVG), null);
            }
        } else {
            i = aLength - patched;
            while (i > 0) {
                aNode = a[aStart++];
                if (!inferno_shared_1.isNull(aNode)) {
                    unmounting_1.unmount(aNode, dom, lifecycle, true, isRecycling);
                    i--;
                }
            }
            if (moved) {
                var seq = lis_algorithm(sources);
                j = seq.length - 1;
                for (i = bLength - 1; i >= 0; i--) {
                    if (sources[i] === -1) {
                        pos = i + bStart;
                        node = b[pos];
                        if (node.dom) {
                            b[pos] = node = VNodes_1.directClone(node);
                        }
                        nextPos = pos + 1;
                        nextNode = nextPos < b.length ? b[nextPos].dom : null;
                        utils_1.insertOrAppend(dom, mounting_1.mount(node, dom, lifecycle, context, isSVG), nextNode);
                    } else {
                        if (j < 0 || i !== seq[j]) {
                            pos = i + bStart;
                            node = b[pos];
                            nextPos = pos + 1;
                            nextNode = nextPos < b.length ? b[nextPos].dom : null;
                            utils_1.insertOrAppend(dom, node.dom, nextNode);
                        } else {
                            j--;
                        }
                    }
                }
            } else if (patched !== bLength) {
                // when patched count doesn't match b length we need to insert those new ones
                // loop backwards so we can use insertBefore
                for (i = bLength - 1; i >= 0; i--) {
                    if (sources[i] === -1) {
                        pos = i + bStart;
                        node = b[pos];
                        if (node.dom) {
                            b[pos] = node = VNodes_1.directClone(node);
                        }
                        nextPos = pos + 1;
                        nextNode = nextPos < b.length ? b[nextPos].dom : null;
                        utils_1.insertOrAppend(dom, mounting_1.mount(node, null, lifecycle, context, isSVG), nextNode);
                    }
                }
            }
        }
    }
}
exports.patchKeyedChildren = patchKeyedChildren;
// // https://en.wikipedia.org/wiki/Longest_increasing_subsequence
function lis_algorithm(arr) {
    var p = arr.slice(0);
    var result = [0];
    var i;
    var j;
    var u;
    var v;
    var c;
    var len = arr.length;
    for (i = 0; i < len; i++) {
        var arrI = arr[i];
        if (arrI === -1) {
            continue;
        }
        j = result[result.length - 1];
        if (arr[j] < arrI) {
            p[i] = j;
            result.push(i);
            continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
            c = (u + v) / 2 | 0;
            if (arr[result[c]] < arrI) {
                u = c + 1;
            } else {
                v = c;
            }
        }
        if (arrI < arr[result[u]]) {
            if (u > 0) {
                p[i] = result[u - 1];
            }
            result[u] = i;
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}
function isAttrAnEvent(attr) {
    return attr[0] === 'o' && attr[1] === 'n';
}
exports.isAttrAnEvent = isAttrAnEvent;
function patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue) {
    if (lastValue !== nextValue) {
        if (constants_1.skipProps.has(prop) || hasControlledValue && prop === 'value') {
            return;
        } else if (constants_1.booleanProps.has(prop)) {
            prop = prop === 'autoFocus' ? prop.toLowerCase() : prop;
            dom[prop] = !!nextValue;
        } else if (constants_1.strictProps.has(prop)) {
            var value = inferno_shared_1.isNullOrUndef(nextValue) ? '' : nextValue;
            if (dom[prop] !== value) {
                dom[prop] = value;
            }
        } else if (isAttrAnEvent(prop)) {
            patchEvent(prop, lastValue, nextValue, dom);
        } else if (inferno_shared_1.isNullOrUndef(nextValue)) {
            dom.removeAttribute(prop);
        } else if (prop === 'style') {
            patchStyle(lastValue, nextValue, dom);
        } else if (prop === 'dangerouslySetInnerHTML') {
            var lastHtml = lastValue && lastValue.__html;
            var nextHtml = nextValue && nextValue.__html;
            if (lastHtml !== nextHtml) {
                if (!inferno_shared_1.isNullOrUndef(nextHtml)) {
                    dom.innerHTML = nextHtml;
                }
            }
        } else {
            // We optimize for NS being boolean. Its 99.9% time false
            if (isSVG && constants_1.namespaces.has(prop)) {
                // If we end up in this path we can read property again
                dom.setAttributeNS(constants_1.namespaces.get(prop), prop, nextValue);
            } else {
                dom.setAttribute(prop, nextValue);
            }
        }
    }
}
exports.patchProp = patchProp;
function patchEvent(name, lastValue, nextValue, dom) {
    if (lastValue !== nextValue) {
        if (constants_1.delegatedEvents.has(name)) {
            delegation_1.handleEvent(name, lastValue, nextValue, dom);
        } else {
            var nameLowerCase = name.toLowerCase();
            var domEvent = dom[nameLowerCase];
            // if the function is wrapped, that means it's been controlled by a wrapper
            if (domEvent && domEvent.wrapped) {
                return;
            }
            if (!inferno_shared_1.isFunction(nextValue) && !inferno_shared_1.isNullOrUndef(nextValue)) {
                var linkEvent_1 = nextValue.event;
                if (linkEvent_1 && inferno_shared_1.isFunction(linkEvent_1)) {
                    dom[nameLowerCase] = function (e) {
                        linkEvent_1(nextValue.data, e);
                    };
                } else {
                    if (process.env.NODE_ENV !== 'production') {
                        inferno_shared_1.throwError("an event on a VNode \"" + name + "\". was not a function or a valid linkEvent.");
                    }
                    inferno_shared_1.throwError();
                }
            } else {
                dom[nameLowerCase] = nextValue;
            }
        }
    }
}
exports.patchEvent = patchEvent;
// We are assuming here that we come from patchProp routine
// -nextAttrValue cannot be null or undefined
function patchStyle(lastAttrValue, nextAttrValue, dom) {
    var domStyle = dom.style;
    if (inferno_shared_1.isString(nextAttrValue)) {
        domStyle.cssText = nextAttrValue;
        return;
    }
    for (var style in nextAttrValue) {
        // do not add a hasOwnProperty check here, it affects performance
        var value = nextAttrValue[style];
        if (!inferno_shared_1.isNumber(value) || constants_1.isUnitlessNumber.has(style)) {
            domStyle[style] = value;
        } else {
            domStyle[style] = value + 'px';
        }
    }
    if (!inferno_shared_1.isNullOrUndef(lastAttrValue)) {
        for (var style in lastAttrValue) {
            if (inferno_shared_1.isNullOrUndef(nextAttrValue[style])) {
                domStyle[style] = '';
            }
        }
    }
}
exports.patchStyle = patchStyle;
function removeProp(prop, lastValue, dom) {
    if (prop === 'value') {
        dom.value = '';
    } else if (prop === 'style') {
        dom.removeAttribute('style');
    } else if (isAttrAnEvent(prop)) {
        delegation_1.handleEvent(prop, lastValue, null, dom);
    } else {
        dom.removeAttribute(prop);
    }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
var inferno_shared_1 = __webpack_require__(0);
var options_1 = __webpack_require__(3);
var VNodes_1 = __webpack_require__(4);
var patching_1 = __webpack_require__(5);
var recycling_1 = __webpack_require__(15);
var rendering_1 = __webpack_require__(7);
var utils_1 = __webpack_require__(2);
var processElement_1 = __webpack_require__(12);
function mount(vNode, parentDom, lifecycle, context, isSVG) {
    var flags = vNode.flags;
    if (flags & 3970 /* Element */) {
            return mountElement(vNode, parentDom, lifecycle, context, isSVG);
        } else if (flags & 28 /* Component */) {
            return mountComponent(vNode, parentDom, lifecycle, context, isSVG, (flags & 4 /* ComponentClass */) > 0);
        } else if (flags & 4096 /* Void */) {
            return mountVoid(vNode, parentDom);
        } else if (flags & 1 /* Text */) {
            return mountText(vNode, parentDom);
        } else {
        if (process.env.NODE_ENV !== 'production') {
            if ((typeof vNode === "undefined" ? "undefined" : _typeof(vNode)) === 'object') {
                inferno_shared_1.throwError("mount() received an object that's not a valid VNode, you should stringify it first. Object: \"" + JSON.stringify(vNode) + "\".");
            } else {
                inferno_shared_1.throwError("mount() expects a valid VNode, instead it received an object with the type \"" + (typeof vNode === "undefined" ? "undefined" : _typeof(vNode)) + "\".");
            }
        }
        inferno_shared_1.throwError();
    }
}
exports.mount = mount;
function mountText(vNode, parentDom) {
    var dom = document.createTextNode(vNode.children);
    vNode.dom = dom;
    if (!inferno_shared_1.isNull(parentDom)) {
        utils_1.appendChild(parentDom, dom);
    }
    return dom;
}
exports.mountText = mountText;
function mountVoid(vNode, parentDom) {
    var dom = document.createTextNode('');
    vNode.dom = dom;
    if (!inferno_shared_1.isNull(parentDom)) {
        utils_1.appendChild(parentDom, dom);
    }
    return dom;
}
exports.mountVoid = mountVoid;
function mountElement(vNode, parentDom, lifecycle, context, isSVG) {
    if (options_1.options.recyclingEnabled) {
        var dom_1 = recycling_1.recycleElement(vNode, lifecycle, context, isSVG);
        if (!inferno_shared_1.isNull(dom_1)) {
            if (!inferno_shared_1.isNull(parentDom)) {
                utils_1.appendChild(parentDom, dom_1);
            }
            return dom_1;
        }
    }
    var flags = vNode.flags;
    isSVG = isSVG || (flags & 128 /* SvgElement */) > 0;
    var dom = utils_1.documentCreateElement(vNode.type, isSVG);
    var children = vNode.children;
    var props = vNode.props;
    var className = vNode.className;
    var ref = vNode.ref;
    vNode.dom = dom;
    if (!inferno_shared_1.isInvalid(children)) {
        if (inferno_shared_1.isStringOrNumber(children)) {
            utils_1.setTextContent(dom, children);
        } else if (inferno_shared_1.isArray(children)) {
            mountArrayChildren(children, dom, lifecycle, context, isSVG);
        } else if (VNodes_1.isVNode(children)) {
            mount(children, dom, lifecycle, context, isSVG);
        }
    }
    if (!inferno_shared_1.isNull(props)) {
        var hasControlledValue = false;
        var isFormElement = (flags & 3584 /* FormElement */) > 0;
        if (isFormElement) {
            hasControlledValue = processElement_1.isControlledFormElement(props);
        }
        for (var prop in props) {
            // do not add a hasOwnProperty check here, it affects performance
            patching_1.patchProp(prop, null, props[prop], dom, isSVG, hasControlledValue);
        }
        if (isFormElement) {
            processElement_1.processElement(flags, vNode, dom, props, true, hasControlledValue);
        }
    }
    if (className !== null) {
        if (isSVG) {
            dom.setAttribute('class', className);
        } else {
            dom.className = className;
        }
    }
    if (!inferno_shared_1.isNull(ref)) {
        mountRef(dom, ref, lifecycle);
    }
    if (!inferno_shared_1.isNull(parentDom)) {
        utils_1.appendChild(parentDom, dom);
    }
    return dom;
}
exports.mountElement = mountElement;
function mountArrayChildren(children, dom, lifecycle, context, isSVG) {
    for (var i = 0, len = children.length; i < len; i++) {
        var child = children[i];
        // Verify can string/number be here. might cause de-opt. - Normalization takes care of it.
        if (!inferno_shared_1.isInvalid(child)) {
            if (child.dom) {
                children[i] = child = VNodes_1.directClone(child);
            }
            mount(children[i], dom, lifecycle, context, isSVG);
        }
    }
}
exports.mountArrayChildren = mountArrayChildren;
function mountComponent(vNode, parentDom, lifecycle, context, isSVG, isClass) {
    if (options_1.options.recyclingEnabled) {
        var dom_2 = recycling_1.recycleComponent(vNode, lifecycle, context, isSVG);
        if (!inferno_shared_1.isNull(dom_2)) {
            if (!inferno_shared_1.isNull(parentDom)) {
                utils_1.appendChild(parentDom, dom_2);
            }
            return dom_2;
        }
    }
    var type = vNode.type;
    var props = vNode.props || utils_1.EMPTY_OBJ;
    var ref = vNode.ref;
    var dom;
    if (isClass) {
        var instance = utils_1.createClassComponentInstance(vNode, type, props, context, isSVG, lifecycle);
        var input = instance._lastInput;
        instance._vNode = vNode;
        vNode.dom = dom = mount(input, null, lifecycle, instance._childContext, isSVG);
        if (!inferno_shared_1.isNull(parentDom)) {
            utils_1.appendChild(parentDom, dom);
        }
        mountClassComponentCallbacks(vNode, ref, instance, lifecycle);
        instance._updating = false;
        if (options_1.options.findDOMNodeEnabled) {
            rendering_1.componentToDOMNodeMap.set(instance, dom);
        }
    } else {
        var input = utils_1.createFunctionalComponentInput(vNode, type, props, context);
        vNode.dom = dom = mount(input, null, lifecycle, context, isSVG);
        vNode.children = input;
        mountFunctionalComponentCallbacks(ref, dom, lifecycle);
        if (!inferno_shared_1.isNull(parentDom)) {
            utils_1.appendChild(parentDom, dom);
        }
    }
    return dom;
}
exports.mountComponent = mountComponent;
function mountClassComponentCallbacks(vNode, ref, instance, lifecycle) {
    if (ref) {
        if (inferno_shared_1.isFunction(ref)) {
            ref(instance);
        } else {
            if (process.env.NODE_ENV !== 'production') {
                if (inferno_shared_1.isStringOrNumber(ref)) {
                    inferno_shared_1.throwError('string "refs" are not supported in Inferno 1.0. Use callback "refs" instead.');
                } else if (inferno_shared_1.isObject(ref) && vNode.flags & 4 /* ComponentClass */) {
                    inferno_shared_1.throwError('functional component lifecycle events are not supported on ES2015 class components.');
                } else {
                    inferno_shared_1.throwError("a bad value for \"ref\" was used on component: \"" + JSON.stringify(ref) + "\"");
                }
            }
            inferno_shared_1.throwError();
        }
    }
    var hasDidMount = !inferno_shared_1.isUndefined(instance.componentDidMount);
    var afterMount = options_1.options.afterMount;
    if (hasDidMount || !inferno_shared_1.isNull(afterMount)) {
        lifecycle.addListener(function () {
            instance._updating = true;
            if (afterMount) {
                afterMount(vNode);
            }
            if (hasDidMount) {
                instance.componentDidMount();
            }
            instance._updating = false;
        });
    }
}
exports.mountClassComponentCallbacks = mountClassComponentCallbacks;
function mountFunctionalComponentCallbacks(ref, dom, lifecycle) {
    if (ref) {
        if (!inferno_shared_1.isNullOrUndef(ref.onComponentWillMount)) {
            ref.onComponentWillMount();
        }
        if (!inferno_shared_1.isNullOrUndef(ref.onComponentDidMount)) {
            lifecycle.addListener(function () {
                return ref.onComponentDidMount(dom);
            });
        }
    }
}
exports.mountFunctionalComponentCallbacks = mountFunctionalComponentCallbacks;
function mountRef(dom, value, lifecycle) {
    if (inferno_shared_1.isFunction(value)) {
        lifecycle.addListener(function () {
            return value(dom);
        });
    } else {
        if (inferno_shared_1.isInvalid(value)) {
            return;
        }
        if (process.env.NODE_ENV !== 'production') {
            inferno_shared_1.throwError('string "refs" are not supported in Inferno 1.0. Use callback "refs" instead.');
        }
        inferno_shared_1.throwError();
    }
}
exports.mountRef = mountRef;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", { value: true });
var inferno_shared_1 = __webpack_require__(0);
var options_1 = __webpack_require__(3);
var VNodes_1 = __webpack_require__(4);
var hydration_1 = __webpack_require__(29);
var mounting_1 = __webpack_require__(6);
var patching_1 = __webpack_require__(5);
var unmounting_1 = __webpack_require__(11);
var utils_1 = __webpack_require__(2);
// rather than use a Map, like we did before, we can use an array here
// given there shouldn't be THAT many roots on the page, the difference
// in performance is huge: https://esbench.com/bench/5802a691330ab09900a1a2da
exports.componentToDOMNodeMap = new Map();
var roots = options_1.options.roots;
/**
 * When inferno.options.findDOMNOdeEnabled is true, this function will return DOM Node by component instance
 * @param ref Component instance
 * @returns {*|null} returns dom node
 */
function findDOMNode(ref) {
    if (!options_1.options.findDOMNodeEnabled) {
        if (process.env.NODE_ENV !== 'production') {
            inferno_shared_1.throwError('findDOMNode() has been disabled, use Inferno.options.findDOMNodeEnabled = true; enabled findDOMNode(). Warning this can significantly impact performance!');
        }
        inferno_shared_1.throwError();
    }
    var dom = ref && ref.nodeType ? ref : null;
    return exports.componentToDOMNodeMap.get(ref) || dom;
}
exports.findDOMNode = findDOMNode;
function getRoot(dom) {
    for (var i = 0, len = roots.length; i < len; i++) {
        var root = roots[i];
        if (root.dom === dom) {
            return root;
        }
    }
    return null;
}
function setRoot(dom, input, lifecycle) {
    var root = {
        dom: dom,
        input: input,
        lifecycle: lifecycle
    };
    roots.push(root);
    return root;
}
function removeRoot(root) {
    for (var i = 0, len = roots.length; i < len; i++) {
        if (roots[i] === root) {
            roots.splice(i, 1);
            return;
        }
    }
}
if (process.env.NODE_ENV !== 'production') {
    if (inferno_shared_1.isBrowser && document.body === null) {
        inferno_shared_1.warning('Inferno warning: you cannot initialize inferno without "document.body". Wait on "DOMContentLoaded" event, add script to bottom of body, or use async/defer attributes on script tag.');
    }
}
var documentBody = inferno_shared_1.isBrowser ? document.body : null;
/**
 * Renders virtual node tree into parent node.
 * @param {VNode | null | string | number} input vNode to be rendered
 * @param parentDom DOM node which content will be replaced by virtual node
 * @returns {InfernoChildren} rendered virtual node
 */
function render(input, parentDom) {
    if (documentBody === parentDom) {
        if (process.env.NODE_ENV !== 'production') {
            inferno_shared_1.throwError('you cannot render() to the "document.body". Use an empty element as a container instead.');
        }
        inferno_shared_1.throwError();
    }
    if (input === inferno_shared_1.NO_OP) {
        return;
    }
    var root = getRoot(parentDom);
    if (inferno_shared_1.isNull(root)) {
        var lifecycle = new inferno_shared_1.Lifecycle();
        if (!inferno_shared_1.isInvalid(input)) {
            if (input.dom) {
                input = VNodes_1.directClone(input);
            }
            if (!hydration_1.hydrateRoot(input, parentDom, lifecycle)) {
                mounting_1.mount(input, parentDom, lifecycle, utils_1.EMPTY_OBJ, false);
            }
            root = setRoot(parentDom, input, lifecycle);
            lifecycle.trigger();
        }
    } else {
        var lifecycle = root.lifecycle;
        lifecycle.listeners = [];
        if (inferno_shared_1.isNullOrUndef(input)) {
            unmounting_1.unmount(root.input, parentDom, lifecycle, false, false);
            removeRoot(root);
        } else {
            if (input.dom) {
                input = VNodes_1.directClone(input);
            }
            patching_1.patch(root.input, input, parentDom, lifecycle, utils_1.EMPTY_OBJ, false, false);
        }
        root.input = input;
        lifecycle.trigger();
    }
    if (root) {
        var rootInput = root.input;
        if (rootInput && rootInput.flags & 28 /* Component */) {
            return rootInput.children;
        }
    }
}
exports.render = render;
function createRenderer(parentDom) {
    return function renderer(lastInput, nextInput) {
        if (!parentDom) {
            parentDom = lastInput;
        }
        render(nextInput, parentDom);
    };
}
exports.createRenderer = createRenderer;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
exports.xlinkNS = 'http://www.w3.org/1999/xlink';
exports.xmlNS = 'http://www.w3.org/XML/1998/namespace';
exports.svgNS = 'http://www.w3.org/2000/svg';
exports.strictProps = new Set();
exports.strictProps.add('volume');
exports.strictProps.add('defaultChecked');
exports.booleanProps = new Set();
exports.booleanProps.add('muted');
exports.booleanProps.add('scoped');
exports.booleanProps.add('loop');
exports.booleanProps.add('open');
exports.booleanProps.add('checked');
exports.booleanProps.add('default');
exports.booleanProps.add('capture');
exports.booleanProps.add('disabled');
exports.booleanProps.add('readOnly');
exports.booleanProps.add('required');
exports.booleanProps.add('autoplay');
exports.booleanProps.add('controls');
exports.booleanProps.add('seamless');
exports.booleanProps.add('reversed');
exports.booleanProps.add('allowfullscreen');
exports.booleanProps.add('novalidate');
exports.booleanProps.add('hidden');
exports.booleanProps.add('autoFocus');
exports.namespaces = new Map();
exports.namespaces.set('xlink:href', exports.xlinkNS);
exports.namespaces.set('xlink:arcrole', exports.xlinkNS);
exports.namespaces.set('xlink:actuate', exports.xlinkNS);
exports.namespaces.set('xlink:show', exports.xlinkNS);
exports.namespaces.set('xlink:role', exports.xlinkNS);
exports.namespaces.set('xlink:title', exports.xlinkNS);
exports.namespaces.set('xlink:type', exports.xlinkNS);
exports.namespaces.set('xml:base', exports.xmlNS);
exports.namespaces.set('xml:lang', exports.xmlNS);
exports.namespaces.set('xml:space', exports.xmlNS);
exports.isUnitlessNumber = new Set();
exports.isUnitlessNumber.add('animationIterationCount');
exports.isUnitlessNumber.add('borderImageOutset');
exports.isUnitlessNumber.add('borderImageSlice');
exports.isUnitlessNumber.add('borderImageWidth');
exports.isUnitlessNumber.add('boxFlex');
exports.isUnitlessNumber.add('boxFlexGroup');
exports.isUnitlessNumber.add('boxOrdinalGroup');
exports.isUnitlessNumber.add('columnCount');
exports.isUnitlessNumber.add('flex');
exports.isUnitlessNumber.add('flexGrow');
exports.isUnitlessNumber.add('flexPositive');
exports.isUnitlessNumber.add('flexShrink');
exports.isUnitlessNumber.add('flexNegative');
exports.isUnitlessNumber.add('flexOrder');
exports.isUnitlessNumber.add('gridRow');
exports.isUnitlessNumber.add('gridColumn');
exports.isUnitlessNumber.add('fontWeight');
exports.isUnitlessNumber.add('lineClamp');
exports.isUnitlessNumber.add('lineHeight');
exports.isUnitlessNumber.add('opacity');
exports.isUnitlessNumber.add('order');
exports.isUnitlessNumber.add('orphans');
exports.isUnitlessNumber.add('tabSize');
exports.isUnitlessNumber.add('widows');
exports.isUnitlessNumber.add('zIndex');
exports.isUnitlessNumber.add('zoom');
exports.isUnitlessNumber.add('fillOpacity');
exports.isUnitlessNumber.add('floodOpacity');
exports.isUnitlessNumber.add('stopOpacity');
exports.isUnitlessNumber.add('strokeDasharray');
exports.isUnitlessNumber.add('strokeDashoffset');
exports.isUnitlessNumber.add('strokeMiterlimit');
exports.isUnitlessNumber.add('strokeOpacity');
exports.isUnitlessNumber.add('strokeWidth');
exports.skipProps = new Set();
exports.skipProps.add('children');
exports.skipProps.add('childrenType');
exports.skipProps.add('defaultValue');
exports.skipProps.add('ref');
exports.skipProps.add('key');
exports.skipProps.add('selected');
exports.skipProps.add('checked');
exports.skipProps.add('multiple');
exports.delegatedEvents = new Set();
exports.delegatedEvents.add('onClick');
exports.delegatedEvents.add('onMouseDown');
exports.delegatedEvents.add('onMouseUp');
exports.delegatedEvents.add('onMouseMove');
exports.delegatedEvents.add('onSubmit');
exports.delegatedEvents.add('onDblClick');
exports.delegatedEvents.add('onKeyDown');
exports.delegatedEvents.add('onKeyUp');
exports.delegatedEvents.add('onKeyPress');

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.skipProps = exports.SimpleMap = exports.createObject = exports.indexOf = exports.isArray = exports.doc = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.isObject = isObject;
exports.isStringOrNumber = isStringOrNumber;
exports.isNullOrUndefined = isNullOrUndefined;
exports.isEventProp = isEventProp;
exports.MountedQueue = MountedQueue;

var _minDocument = __webpack_require__(39);

var _minDocument2 = _interopRequireDefault(_minDocument);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var toString = Object.prototype.toString;

var doc = exports.doc = typeof document === 'undefined' ? _minDocument2.default : document;

var isArray = exports.isArray = Array.isArray || function (arr) {
    return toString.call(arr) === '[object array]';
};

function isObject(o) {
    return (typeof o === 'undefined' ? 'undefined' : _typeof(o)) === 'object' && o !== null;
}

function isStringOrNumber(o) {
    var type = typeof o === 'undefined' ? 'undefined' : _typeof(o);
    return type === 'string' || type === 'number';
}

function isNullOrUndefined(o) {
    return o === null || o === undefined;
}

function isEventProp(propName) {
    return propName.substr(0, 3) === 'ev-';
}

var indexOf = exports.indexOf = function () {
    if (Array.prototype.indexOf) {
        return function (arr, value) {
            return arr.indexOf(value);
        };
    } else {
        return function (arr, value) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] === value) {
                    return i;
                }
            }
            return -1;
        };
    }
}();

var nativeObject = Object.create;
var createObject = exports.createObject = function () {
    if (nativeObject) {
        return function (obj) {
            return nativeObject(obj);
        };
    } else {
        return function (obj) {
            function Fn() {}
            Fn.prototype = obj;
            return new Fn();
        };
    }
}();

var SimpleMap = exports.SimpleMap = typeof Map === 'function' ? Map : function () {
    function SimpleMap() {
        this._keys = [];
        this._values = [];
        this.size = 0;
    }

    SimpleMap.prototype.set = function (key, value) {
        var index = indexOf(this._keys, key);
        if (!~index) {
            index = this._keys.push(key) - 1;
            this.size++;
        }
        this._values.push(value);
        return this;
    };
    SimpleMap.prototype.get = function (key) {
        var index = indexOf(this._keys, key);
        if (!~index) return;
        return this._values[index];
    };
    SimpleMap.prototype.delete = function (key) {
        var index = indexOf(this._keys, key);
        if (!~index) return false;
        this._keys.spilce(index, 1);
        this._values.splice(index, 1);
        this.size--;
        return true;
    };

    return SimpleMap;
}();

var skipProps = exports.skipProps = {
    key: true,
    ref: true,
    children: true
};

function MountedQueue() {
    this.queue = [];
}
MountedQueue.prototype.push = function (fn) {
    this.queue.push(fn);
};
MountedQueue.prototype.trigger = function () {
    var queue = this.queue;
    var callback = void 0;
    while (callback = queue.shift()) {
        callback();
    }
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.render = render;
exports.createElement = createElement;
exports.createHtmlElement = createHtmlElement;
exports.createTextElement = createTextElement;
exports.createComponentClass = createComponentClass;
exports.createComponentFunction = createComponentFunction;
exports.createCommentElement = createCommentElement;
exports.createComponentFunctionVNode = createComponentFunctionVNode;
exports.createElements = createElements;
exports.removeElements = removeElements;
exports.removeElement = removeElement;
exports.removeHtmlElement = removeHtmlElement;
exports.removeText = removeText;
exports.removeComponentFunction = removeComponentFunction;
exports.removeComponentClass = removeComponentClass;
exports.removeAllChildren = removeAllChildren;
exports.replaceChild = replaceChild;
exports.createRef = createRef;

var _vnode = __webpack_require__(13);

var _vpatch = __webpack_require__(22);

var _event = __webpack_require__(21);

var _utils = __webpack_require__(9);

function render(vNode, parentDom) {
    if ((0, _utils.isNullOrUndefined)(vNode)) return;
    var mountedQueue = new _utils.MountedQueue();
    var dom = createElement(vNode, parentDom, mountedQueue);
    mountedQueue.trigger();
    return dom;
}

function createElement(vNode, parentDom, mountedQueue) {
    var type = vNode.type;
    if (type & _vnode.Types.HtmlElement) {
        return createHtmlElement(vNode, parentDom, mountedQueue);
    } else if (type & _vnode.Types.Text) {
        return createTextElement(vNode, parentDom);
    } else if (type & _vnode.Types.ComponentClass) {
        return createComponentClass(vNode, parentDom, mountedQueue);
    } else if (type & _vnode.Types.ComponentFunction) {
        return createComponentFunction(vNode, parentDom, mountedQueue);
    } else if (type & _vnode.Types.HtmlComment) {
        return createCommentElement(vNode, parentDom);
    } else {
        throw new Error('unknown vnode type');
    }
}

function createHtmlElement(vNode, parentDom, mountedQueue) {
    var dom = _utils.doc.createElement(vNode.tag);
    var children = vNode.children;
    var ref = vNode.ref;
    var props = vNode.props;
    var className = vNode.className;

    vNode.dom = dom;

    if (!(0, _utils.isNullOrUndefined)(children)) {
        createElements(children, dom, mountedQueue);
    }

    if (!(0, _utils.isNullOrUndefined)(className)) {
        dom.className = className;
    }

    if (props !== _vnode.EMPTY_OBJ) {
        for (var prop in props) {
            (0, _vpatch.patchProp)(prop, null, props[prop], dom);
        }
    }

    if (!(0, _utils.isNullOrUndefined)(ref)) {
        createRef(dom, ref, mountedQueue);
    }

    if (parentDom) {
        parentDom.appendChild(dom);
    }

    return dom;
}

function createTextElement(vNode, parentDom) {
    var dom = _utils.doc.createTextNode(vNode.children);
    vNode.dom = dom;

    if (parentDom) {
        parentDom.appendChild(dom);
    }

    return dom;
}

function createComponentClass(vNode, parentDom, mountedQueue, lastVNode) {
    var props = vNode.props;
    var instance = new vNode.tag(props);
    var dom = instance.init(lastVNode, vNode);
    var ref = props.ref;

    vNode.dom = dom;
    vNode.children = instance;

    if (parentDom) {
        parentDom.appendChild(dom);
    }

    if (typeof instance.mount === 'function') {
        mountedQueue.push(function () {
            return instance.mount(lastVNode, vNode);
        });
    }

    if (typeof ref === 'function') {
        ref(instance);
    }

    return dom;
}

function createComponentFunction(vNode, parentDom, mountedQueue) {
    var props = vNode.props;
    var ref = vNode.ref;

    createComponentFunctionVNode(vNode);

    var dom = createElement(vNode.children, null, mountedQueue);
    vNode.dom = dom;

    if (parentDom) {
        parentDom.appendChild(dom);
    }

    if (ref) {
        createRef(dom, ref, mountedQueue);
    }

    return dom;
}

function createCommentElement(vNode, parentDom) {
    var dom = _utils.doc.createComment(vNode.children);
    vNode.dom = dom;

    if (parentDom) {
        parentDom.appendChild(dom);
    }

    return dom;
}

function createComponentFunctionVNode(vNode) {
    var result = vNode.tag(vNode.props);
    if ((0, _utils.isArray)(result)) {
        throw new Error('ComponentFunction ' + vNode.tag.name + ' returned a invalid vNode');
    } else if ((0, _utils.isStringOrNumber)(result)) {
        result = (0, _vnode.createTextVNode)(result);
    }

    vNode.children = result;

    return vNode;
}

function createElements(vNodes, parentDom, mountedQueue) {
    if ((0, _utils.isStringOrNumber)(vNodes)) {
        parentDom.textContent = vNodes;
    } else if ((0, _utils.isArray)(vNodes)) {
        for (var i = 0; i < vNodes.length; i++) {
            createElement(vNodes[i], parentDom, mountedQueue);
        }
    } else {
        createElement(vNodes, parentDom, mountedQueue);
    }
}

function removeElements(vNodes, parentDom) {
    if ((0, _utils.isNullOrUndefined)(vNodes)) {
        return;
    } else if ((0, _utils.isArray)(vNodes)) {
        for (var i = 0; i < vNodes.length; i++) {
            removeElement(vNodes[i], parentDom);
        }
    } else {
        removeElement(vNodes, parentDom);
    }
}

function removeElement(vNode, parentDom) {
    var type = vNode.type;
    if (type & _vnode.Types.Element) {
        return removeHtmlElement(vNode, parentDom);
    } else if (type & _vnode.Types.TextElement) {
        return removeText(vNode, parentDom);
    } else if (type & _vnode.Types.ComponentClass) {
        return removeComponentClass(vNode, parentDom);
    } else if (type & _vnode.Types.ComponentFunction) {
        return removeComponentFunction(vNode, parentDom);
    }
}

function removeHtmlElement(vNode, parentDom) {
    var ref = vNode.ref;
    var props = vNode.props;
    var dom = vNode.dom;

    if (ref) {
        ref(null);
    }

    removeElements(vNode.children, null);

    // remove event
    for (var name in props) {
        var prop = props[name];
        if (!(0, _utils.isNullOrUndefined)(prop) && (0, _utils.isEventProp)(name)) {
            (0, _event.handleEvent)(name.substr(0, 3), prop, null, dom);
        }
    }

    if (parentDom) {
        parentDom.removeChild(dom);
    }
}

function removeText(vNode, parentDom) {
    if (parentDom) {
        parentDom.removeChild(vNode.dom);
    }
}

function removeComponentFunction(vNode, parentDom) {
    var ref = vNode.ref;
    if (ref) {
        ref(null);
    }
    removeElement(vNode.children, parentDom);
}

function removeComponentClass(vNode, parentDom, nextVNode) {
    var instance = vNode.children;
    var ref = vNode.ref;

    if (typeof instance.destroy === 'function') {
        instance.destroy(vNode, nextVNode);
    }

    if (ref) {
        ref(null);
    }

    removeElements(vNode.props.children, null);

    if (parentDom) {
        parentDom.removeChild(vNode.dom);
    }
}

function removeAllChildren(dom, vNodes) {
    dom.textContent = '';
    removeElements(vNodes);
}

function replaceChild(parentDom, nextDom, lastDom) {
    if (!parentDom) parentDom = lastDom.parentNode;
    parentDom.replaceChild(nextDom, lastDom);
}

function createRef(dom, ref, mountedQueue) {
    if (typeof ref === 'function') {
        mountedQueue.push(function () {
            return ref(dom);
        });
    } else {
        throw new Error('ref must be a function, but got "' + JSON.stringify(ref) + '"');
    }
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", { value: true });
var inferno_shared_1 = __webpack_require__(0);
var options_1 = __webpack_require__(3);
var patching_1 = __webpack_require__(5);
var recycling_1 = __webpack_require__(15);
var rendering_1 = __webpack_require__(7);
var utils_1 = __webpack_require__(2);
function unmount(vNode, parentDom, lifecycle, canRecycle, isRecycling) {
    var flags = vNode.flags;
    if (flags & 28 /* Component */) {
            unmountComponent(vNode, parentDom, lifecycle, canRecycle, isRecycling);
        } else if (flags & 3970 /* Element */) {
            unmountElement(vNode, parentDom, lifecycle, canRecycle, isRecycling);
        } else if (flags & (1 /* Text */ | 4096 /* Void */)) {
        unmountVoidOrText(vNode, parentDom);
    }
}
exports.unmount = unmount;
function unmountVoidOrText(vNode, parentDom) {
    if (!inferno_shared_1.isNull(parentDom)) {
        utils_1.removeChild(parentDom, vNode.dom);
    }
}
function unmountComponent(vNode, parentDom, lifecycle, canRecycle, isRecycling) {
    var instance = vNode.children;
    var flags = vNode.flags;
    var isStatefulComponent = flags & 4 /* ComponentClass */;
    var ref = vNode.ref;
    var dom = vNode.dom;
    if (!isRecycling) {
        if (isStatefulComponent) {
            if (!instance._unmounted) {
                instance._blockSetState = true;
                if (!inferno_shared_1.isNull(options_1.options.beforeUnmount)) {
                    options_1.options.beforeUnmount(vNode);
                }
                if (!inferno_shared_1.isUndefined(instance.componentWillUnmount)) {
                    instance.componentWillUnmount();
                }
                if (ref && !isRecycling) {
                    ref(null);
                }
                instance._unmounted = true;
                if (options_1.options.findDOMNodeEnabled) {
                    rendering_1.componentToDOMNodeMap.delete(instance);
                }
                unmount(instance._lastInput, null, instance._lifecycle, false, isRecycling);
            }
        } else {
            if (!inferno_shared_1.isNullOrUndef(ref)) {
                if (!inferno_shared_1.isNullOrUndef(ref.onComponentWillUnmount)) {
                    ref.onComponentWillUnmount(dom);
                }
            }
            unmount(instance, null, lifecycle, false, isRecycling);
        }
    }
    if (parentDom) {
        var lastInput = instance._lastInput;
        if (inferno_shared_1.isNullOrUndef(lastInput)) {
            lastInput = instance;
        }
        utils_1.removeChild(parentDom, dom);
    }
    if (options_1.options.recyclingEnabled && !isStatefulComponent && (parentDom || canRecycle)) {
        recycling_1.poolComponent(vNode);
    }
}
exports.unmountComponent = unmountComponent;
function unmountElement(vNode, parentDom, lifecycle, canRecycle, isRecycling) {
    var dom = vNode.dom;
    var ref = vNode.ref;
    var props = vNode.props;
    if (ref && !isRecycling) {
        unmountRef(ref);
    }
    var children = vNode.children;
    if (!inferno_shared_1.isNullOrUndef(children)) {
        unmountChildren(children, lifecycle, isRecycling);
    }
    if (!inferno_shared_1.isNull(props)) {
        for (var name_1 in props) {
            // do not add a hasOwnProperty check here, it affects performance
            if (props[name_1] !== null && patching_1.isAttrAnEvent(name_1)) {
                patching_1.patchEvent(name_1, props[name_1], null, dom);
                // We need to set this null, because same props otherwise come back if SCU returns false and we are recyling
                props[name_1] = null;
            }
        }
    }
    if (!inferno_shared_1.isNull(parentDom)) {
        utils_1.removeChild(parentDom, dom);
    }
    if (options_1.options.recyclingEnabled && (parentDom || canRecycle)) {
        recycling_1.poolElement(vNode);
    }
}
exports.unmountElement = unmountElement;
function unmountChildren(children, lifecycle, isRecycling) {
    if (inferno_shared_1.isArray(children)) {
        for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            if (!inferno_shared_1.isInvalid(child) && inferno_shared_1.isObject(child)) {
                unmount(child, null, lifecycle, false, isRecycling);
            }
        }
    } else if (inferno_shared_1.isObject(children)) {
        unmount(children, null, lifecycle, false, isRecycling);
    }
}
function unmountRef(ref) {
    if (inferno_shared_1.isFunction(ref)) {
        ref(null);
    } else {
        if (inferno_shared_1.isInvalid(ref)) {
            return;
        }
        if (process.env.NODE_ENV !== 'production') {
            inferno_shared_1.throwError('string "refs" are not supported in Inferno 1.0. Use callback "refs" instead.');
        }
        inferno_shared_1.throwError();
    }
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var inferno_shared_1 = __webpack_require__(0);
var InputWrapper_1 = __webpack_require__(30);
var SelectWrapper_1 = __webpack_require__(31);
var TextareaWrapper_1 = __webpack_require__(32);
/**
 * There is currently no support for switching same input between controlled and nonControlled
 * If that ever becomes a real issue, then re design controlled elements
 * Currently user must choose either controlled or non-controlled and stick with that
 */
function processElement(flags, vNode, dom, nextPropsOrEmpty, mounting, isControlled) {
    if (flags & 512 /* InputElement */) {
            InputWrapper_1.processInput(vNode, dom, nextPropsOrEmpty, mounting, isControlled);
        }
    if (flags & 2048 /* SelectElement */) {
            SelectWrapper_1.processSelect(vNode, dom, nextPropsOrEmpty, mounting, isControlled);
        }
    if (flags & 1024 /* TextareaElement */) {
            TextareaWrapper_1.processTextarea(vNode, dom, nextPropsOrEmpty, mounting, isControlled);
        }
}
exports.processElement = processElement;
function isControlledFormElement(nextPropsOrEmpty) {
    return nextPropsOrEmpty.type && InputWrapper_1.isCheckedType(nextPropsOrEmpty.type) ? !inferno_shared_1.isNullOrUndef(nextPropsOrEmpty.checked) : !inferno_shared_1.isNullOrUndef(nextPropsOrEmpty.value);
}
exports.isControlledFormElement = isControlledFormElement;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EMPTY_OBJ = exports.Types = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.VNode = VNode;
exports.createVNode = createVNode;
exports.createCommentVNode = createCommentVNode;
exports.createTextVNode = createTextVNode;
exports.createVoidVNode = createVoidVNode;

var _utils = __webpack_require__(9);

var Types = exports.Types = {
    Text: 1,
    HtmlElement: 1 << 1,

    ComponentClass: 1 << 2,
    ComponentFunction: 1 << 3,

    HtmlComment: 1 << 4
};
Types.Element = Types.HtmlElement;
Types.Component = Types.ComponentClass | Types.ComponentFunction;
Types.TextElement = Types.Text | Types.HtmlComment;

var EMPTY_OBJ = exports.EMPTY_OBJ = {};
if (process.env.NODE_ENV !== 'production') {
    Object.freeze(EMPTY_OBJ);
}

function VNode(type, tag, props, children, className, key, ref) {
    this.type = type;
    this.tag = tag;
    this.props = props;
    this.children = children;
    this.key = key;
    this.ref = ref;
    this.className = className;
}

function createVNode(tag, props, children, className, key, ref) {
    var type = void 0;
    props || (props = EMPTY_OBJ);
    switch (typeof tag === 'undefined' ? 'undefined' : _typeof(tag)) {
        case 'string':
            type = Types.HtmlElement;
            break;
        case 'function':
            if (tag.prototype.init) {
                type = Types.ComponentClass;
            } else {
                type = Types.ComponentFunction;
            }
            break;
        default:
            throw new Error('unknown vNode type: ' + tag);
    }

    if (props.children) {
        props.children = normalizeChildren(props.children);
    }

    return new VNode(type, tag, props, normalizeChildren(children), className, key, ref);
}

function createCommentVNode(children) {
    return new VNode(Types.HtmlComment, null, EMPTY_OBJ, children);
}

function createTextVNode(text) {
    return new VNode(Types.Text, null, EMPTY_OBJ, text);
}

function createVoidVNode() {
    return new VNode(Types.VoidElement, null, EMPTY_OBJ);
}

function normalizeChildren(vNodes) {
    if ((0, _utils.isArray)(vNodes)) {
        var childNodes = addChild(vNodes, { index: 0 });
        return childNodes.length ? childNodes : null;
    }
    return vNodes;
}

function applyKey(vNode, reference) {
    if ((0, _utils.isNullOrUndefined)(vNode.key)) {
        vNode.key = '.$' + reference.index++;
    }
    return vNode;
}

function addChild(vNodes, reference) {
    var newVNodes = void 0;
    for (var i = 0; i < vNodes.length; i++) {
        var n = vNodes[i];
        if ((0, _utils.isNullOrUndefined)(n)) {
            if (!newVNodes) {
                newVNodes = vNodes.slice(0, i);
            }
        } else if ((0, _utils.isArray)(n)) {
            if (!newVNodes) {
                newVNodes = vNodes.slice(0, i);
            }
            newVNodes = newVNodes.concat(addChild(n, reference));
        } else if ((0, _utils.isStringOrNumber)(n)) {
            if (!newVNodes) {
                newVNodes = vNodes.slice(0, i);
            }
            newVNodes.push(applyKey(createTextVNode(n), reference));
        } else if (n.type) {
            if (!newVNodes) {
                newVNodes = vNodes.slice(0, i);
            }
            newVNodes.push(applyKey(n, reference));
        }
    }
    return newVNodes || vNodes;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var slice = Array.prototype.slice;

module.exports = iterativelyWalk;

function iterativelyWalk(nodes, cb) {
    if (!('length' in nodes)) {
        nodes = [nodes];
    }

    nodes = slice.call(nodes);

    while (nodes.length) {
        var node = nodes.shift(),
            ret = cb(node);

        if (ret) {
            return ret;
        }

        if (node.childNodes && node.childNodes.length) {
            nodes = slice.call(node.childNodes).concat(nodes);
        }
    }
}

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var inferno_shared_1 = __webpack_require__(0);
var patching_1 = __webpack_require__(5);
var componentPools = new Map();
var elementPools = new Map();
function recycleElement(vNode, lifecycle, context, isSVG) {
    var tag = vNode.type;
    var pools = elementPools.get(tag);
    if (!inferno_shared_1.isUndefined(pools)) {
        var key = vNode.key;
        var pool = key === null ? pools.nonKeyed : pools.keyed.get(key);
        if (!inferno_shared_1.isUndefined(pool)) {
            var recycledVNode = pool.pop();
            if (!inferno_shared_1.isUndefined(recycledVNode)) {
                patching_1.patchElement(recycledVNode, vNode, null, lifecycle, context, isSVG, true);
                return vNode.dom;
            }
        }
    }
    return null;
}
exports.recycleElement = recycleElement;
function poolElement(vNode) {
    var tag = vNode.type;
    var key = vNode.key;
    var pools = elementPools.get(tag);
    if (inferno_shared_1.isUndefined(pools)) {
        pools = {
            keyed: new Map(),
            nonKeyed: []
        };
        elementPools.set(tag, pools);
    }
    if (inferno_shared_1.isNull(key)) {
        pools.nonKeyed.push(vNode);
    } else {
        var pool = pools.keyed.get(key);
        if (inferno_shared_1.isUndefined(pool)) {
            pool = [];
            pools.keyed.set(key, pool);
        }
        pool.push(vNode);
    }
}
exports.poolElement = poolElement;
function recycleComponent(vNode, lifecycle, context, isSVG) {
    var type = vNode.type;
    var pools = componentPools.get(type);
    if (!inferno_shared_1.isUndefined(pools)) {
        var key = vNode.key;
        var pool = key === null ? pools.nonKeyed : pools.keyed.get(key);
        if (!inferno_shared_1.isUndefined(pool)) {
            var recycledVNode = pool.pop();
            if (!inferno_shared_1.isUndefined(recycledVNode)) {
                var flags = vNode.flags;
                var failed = patching_1.patchComponent(recycledVNode, vNode, null, lifecycle, context, isSVG, flags & 4 /* ComponentClass */, true);
                if (!failed) {
                    return vNode.dom;
                }
            }
        }
    }
    return null;
}
exports.recycleComponent = recycleComponent;
function poolComponent(vNode) {
    var hooks = vNode.ref;
    var nonRecycleHooks = hooks && (hooks.onComponentWillMount || hooks.onComponentWillUnmount || hooks.onComponentDidMount || hooks.onComponentWillUpdate || hooks.onComponentDidUpdate);
    if (nonRecycleHooks) {
        return;
    }
    var type = vNode.type;
    var key = vNode.key;
    var pools = componentPools.get(type);
    if (inferno_shared_1.isUndefined(pools)) {
        pools = {
            keyed: new Map(),
            nonKeyed: []
        };
        componentPools.set(type, pools);
    }
    if (inferno_shared_1.isNull(key)) {
        pools.nonKeyed.push(vNode);
    } else {
        var pool = pools.keyed.get(key);
        if (inferno_shared_1.isUndefined(pool)) {
            pool = [];
            pools.keyed.set(key, pool);
        }
        pool.push(vNode);
    }
}
exports.poolComponent = poolComponent;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", { value: true });
var inferno_shared_1 = __webpack_require__(0);
var VNodes_1 = __webpack_require__(4);
function applyKey(key, vNode) {
    vNode.key = key;
    return vNode;
}
function applyKeyIfMissing(key, vNode) {
    if (inferno_shared_1.isNumber(key)) {
        key = "." + key;
    }
    if (inferno_shared_1.isNull(vNode.key) || vNode.key[0] === '.') {
        return applyKey(key, vNode);
    }
    return vNode;
}
function applyKeyPrefix(key, vNode) {
    vNode.key = key + vNode.key;
    return vNode;
}
function _normalizeVNodes(nodes, result, index, currentKey) {
    for (var len = nodes.length; index < len; index++) {
        var n = nodes[index];
        var key = currentKey + "." + index;
        if (!inferno_shared_1.isInvalid(n)) {
            if (inferno_shared_1.isArray(n)) {
                _normalizeVNodes(n, result, 0, key);
            } else {
                if (inferno_shared_1.isStringOrNumber(n)) {
                    n = VNodes_1.createTextVNode(n, null);
                } else if (VNodes_1.isVNode(n) && n.dom || n.key && n.key[0] === '.') {
                    n = VNodes_1.directClone(n);
                }
                if (inferno_shared_1.isNull(n.key) || n.key[0] === '.') {
                    n = applyKey(key, n);
                } else {
                    n = applyKeyPrefix(currentKey, n);
                }
                result.push(n);
            }
        }
    }
}
function normalizeVNodes(nodes) {
    var newNodes;
    // we assign $ which basically means we've flagged this array for future note
    // if it comes back again, we need to clone it, as people are using it
    // in an immutable way
    // tslint:disable
    if (nodes['$'] === true) {
        nodes = nodes.slice();
    } else {
        nodes['$'] = true;
    }
    // tslint:enable
    for (var i = 0, len = nodes.length; i < len; i++) {
        var n = nodes[i];
        if (inferno_shared_1.isInvalid(n) || inferno_shared_1.isArray(n)) {
            var result = (newNodes || nodes).slice(0, i);
            _normalizeVNodes(nodes, result, i, "");
            return result;
        } else if (inferno_shared_1.isStringOrNumber(n)) {
            if (!newNodes) {
                newNodes = nodes.slice(0, i);
            }
            newNodes.push(applyKeyIfMissing(i, VNodes_1.createTextVNode(n, null)));
        } else if (VNodes_1.isVNode(n) && n.dom !== null || inferno_shared_1.isNull(n.key) && (n.flags & 64 /* HasNonKeyedChildren */) === 0) {
            if (!newNodes) {
                newNodes = nodes.slice(0, i);
            }
            newNodes.push(applyKeyIfMissing(i, VNodes_1.directClone(n)));
        } else if (newNodes) {
            newNodes.push(applyKeyIfMissing(i, VNodes_1.directClone(n)));
        }
    }
    return newNodes || nodes;
}
exports.normalizeVNodes = normalizeVNodes;
function normalizeChildren(children) {
    if (inferno_shared_1.isArray(children)) {
        return normalizeVNodes(children);
    } else if (VNodes_1.isVNode(children) && children.dom !== null) {
        return VNodes_1.directClone(children);
    }
    return children;
}
function normalizeProps(vNode, props, children) {
    if (vNode.flags & 3970 /* Element */) {
            if (inferno_shared_1.isNullOrUndef(children) && !inferno_shared_1.isNullOrUndef(props.children)) {
                vNode.children = props.children;
            }
            if (!inferno_shared_1.isNullOrUndef(props.className)) {
                vNode.className = props.className;
                delete props.className;
            }
        }
    if (props.ref) {
        vNode.ref = props.ref;
        delete props.ref;
    }
    if (!inferno_shared_1.isNullOrUndef(props.key)) {
        vNode.key = props.key;
        delete props.key;
    }
}
function getFlagsForElementVnode(type) {
    if (type === 'svg') {
        return 128 /* SvgElement */;
    } else if (type === 'input') {
        return 512 /* InputElement */;
    } else if (type === 'select') {
        return 2048 /* SelectElement */;
    } else if (type === 'textarea') {
        return 1024 /* TextareaElement */;
    } else if (type === 'media') {
        return 256 /* MediaElement */;
    }
    return 2 /* HtmlElement */;
}
exports.getFlagsForElementVnode = getFlagsForElementVnode;
function normalize(vNode) {
    var props = vNode.props;
    var children = vNode.children;
    // convert a wrongly created type back to element
    // Primitive node doesn't have defaultProps, only Component
    if (vNode.flags & 28 /* Component */) {
            // set default props
            var type = vNode.type;
            var defaultProps = type.defaultProps;
            if (!inferno_shared_1.isNullOrUndef(defaultProps)) {
                if (!props) {
                    props = vNode.props = defaultProps; // Create new object if only defaultProps given
                } else {
                    for (var prop in defaultProps) {
                        if (inferno_shared_1.isUndefined(props[prop])) {
                            props[prop] = defaultProps[prop];
                        }
                    }
                }
            }
            if (inferno_shared_1.isString(type)) {
                vNode.flags = getFlagsForElementVnode(type);
                if (props && props.children) {
                    vNode.children = props.children;
                    children = props.children;
                }
            }
        }
    if (props) {
        normalizeProps(vNode, props, children);
        if (!inferno_shared_1.isInvalid(props.children)) {
            props.children = normalizeChildren(props.children);
        }
    }
    if (!inferno_shared_1.isInvalid(children)) {
        vNode.children = normalizeChildren(children);
    }
    if (process.env.NODE_ENV !== 'production') {
        // This code will be stripped out from production CODE
        // It helps users to track errors in their applications.
        var verifyKeys = function verifyKeys(vNodes) {
            var keyValues = vNodes.map(function (vnode) {
                return vnode.key;
            });
            keyValues.some(function (item, idx) {
                var hasDuplicate = keyValues.indexOf(item) !== idx;
                if (hasDuplicate) {
                    inferno_shared_1.warning('Inferno normalisation(...): Encountered two children with same key, all keys must be unique within its siblings. Duplicated key is:' + item);
                }
                return hasDuplicate;
            });
        };
        if (vNode.children && Array.isArray(vNode.children)) {
            verifyKeys(vNode.children);
        }
    }
}
exports.normalize = normalize;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domWalk = __webpack_require__(14);
var dispatchEvent = __webpack_require__(19);
var addEventListener = __webpack_require__(18);
var removeEventListener = __webpack_require__(20);
var serializeNode = __webpack_require__(40);

var htmlns = "http://www.w3.org/1999/xhtml";

module.exports = DOMElement;

function DOMElement(tagName, owner, namespace) {
    if (!(this instanceof DOMElement)) {
        return new DOMElement(tagName);
    }

    var ns = namespace === undefined ? htmlns : namespace || null;

    this.tagName = ns === htmlns ? String(tagName).toUpperCase() : tagName;
    this.nodeName = this.tagName;
    this.className = "";
    this.dataset = {};
    this.childNodes = [];
    this.parentNode = null;
    this.style = {};
    this.ownerDocument = owner || null;
    this.namespaceURI = ns;
    this._attributes = {};

    if (this.tagName === 'INPUT') {
        this.type = 'text';
    }
}

DOMElement.prototype.type = "DOMElement";
DOMElement.prototype.nodeType = 1;

DOMElement.prototype.appendChild = function _Element_appendChild(child) {
    if (child.parentNode) {
        child.parentNode.removeChild(child);
    }

    this.childNodes.push(child);
    child.parentNode = this;

    return child;
};

DOMElement.prototype.replaceChild = function _Element_replaceChild(elem, needle) {
    // TODO: Throw NotFoundError if needle.parentNode !== this

    if (elem.parentNode) {
        elem.parentNode.removeChild(elem);
    }

    var index = this.childNodes.indexOf(needle);

    needle.parentNode = null;
    this.childNodes[index] = elem;
    elem.parentNode = this;

    return needle;
};

DOMElement.prototype.removeChild = function _Element_removeChild(elem) {
    // TODO: Throw NotFoundError if elem.parentNode !== this

    var index = this.childNodes.indexOf(elem);
    this.childNodes.splice(index, 1);

    elem.parentNode = null;
    return elem;
};

DOMElement.prototype.insertBefore = function _Element_insertBefore(elem, needle) {
    // TODO: Throw NotFoundError if referenceElement is a dom node
    // and parentNode !== this

    if (elem.parentNode) {
        elem.parentNode.removeChild(elem);
    }

    var index = needle === null || needle === undefined ? -1 : this.childNodes.indexOf(needle);

    if (index > -1) {
        this.childNodes.splice(index, 0, elem);
    } else {
        this.childNodes.push(elem);
    }

    elem.parentNode = this;
    return elem;
};

DOMElement.prototype.setAttributeNS = function _Element_setAttributeNS(namespace, name, value) {
    var prefix = null;
    var localName = name;
    var colonPosition = name.indexOf(":");
    if (colonPosition > -1) {
        prefix = name.substr(0, colonPosition);
        localName = name.substr(colonPosition + 1);
    }
    if (this.tagName === 'INPUT' && name === 'type') {
        this.type = value;
    } else {
        var attributes = this._attributes[namespace] || (this._attributes[namespace] = {});
        attributes[localName] = { value: value, prefix: prefix };
    }
};

DOMElement.prototype.getAttributeNS = function _Element_getAttributeNS(namespace, name) {
    var attributes = this._attributes[namespace];
    var value = attributes && attributes[name] && attributes[name].value;
    if (this.tagName === 'INPUT' && name === 'type') {
        return this.type;
    }
    if (typeof value !== "string") {
        return null;
    }
    return value;
};

DOMElement.prototype.removeAttributeNS = function _Element_removeAttributeNS(namespace, name) {
    var attributes = this._attributes[namespace];
    if (attributes) {
        delete attributes[name];
    }
};

DOMElement.prototype.hasAttributeNS = function _Element_hasAttributeNS(namespace, name) {
    var attributes = this._attributes[namespace];
    return !!attributes && name in attributes;
};

DOMElement.prototype.setAttribute = function _Element_setAttribute(name, value) {
    return this.setAttributeNS(null, name, value);
};

DOMElement.prototype.getAttribute = function _Element_getAttribute(name) {
    return this.getAttributeNS(null, name);
};

DOMElement.prototype.removeAttribute = function _Element_removeAttribute(name) {
    return this.removeAttributeNS(null, name);
};

DOMElement.prototype.hasAttribute = function _Element_hasAttribute(name) {
    return this.hasAttributeNS(null, name);
};

DOMElement.prototype.removeEventListener = removeEventListener;
DOMElement.prototype.addEventListener = addEventListener;
DOMElement.prototype.dispatchEvent = dispatchEvent;

// Un-implemented
DOMElement.prototype.focus = function _Element_focus() {
    return void 0;
};

DOMElement.prototype.toString = function _Element_toString() {
    return serializeNode(this);
};

DOMElement.prototype.getElementsByClassName = function _Element_getElementsByClassName(classNames) {
    var classes = classNames.split(" ");
    var elems = [];

    domWalk(this, function (node) {
        if (node.nodeType === 1) {
            var nodeClassName = node.className || "";
            var nodeClasses = nodeClassName.split(" ");

            if (classes.every(function (item) {
                return nodeClasses.indexOf(item) !== -1;
            })) {
                elems.push(node);
            }
        }
    });

    return elems;
};

DOMElement.prototype.getElementsByTagName = function _Element_getElementsByTagName(tagName) {
    tagName = tagName.toLowerCase();
    var elems = [];

    domWalk(this.childNodes, function (node) {
        if (node.nodeType === 1 && (tagName === '*' || node.tagName.toLowerCase() === tagName)) {
            elems.push(node);
        }
    });

    return elems;
};

DOMElement.prototype.contains = function _Element_contains(element) {
    return domWalk(this, function (node) {
        return element === node;
    }) || false;
};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = addEventListener;

function addEventListener(type, listener) {
    var elem = this;

    if (!elem.listeners) {
        elem.listeners = {};
    }

    if (!elem.listeners[type]) {
        elem.listeners[type] = [];
    }

    if (elem.listeners[type].indexOf(listener) === -1) {
        elem.listeners[type].push(listener);
    }
}

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = dispatchEvent;

function dispatchEvent(ev) {
    var elem = this;
    var type = ev.type;

    if (!ev.target) {
        ev.target = elem;
    }

    if (!elem.listeners) {
        elem.listeners = {};
    }

    var listeners = elem.listeners[type];

    if (listeners) {
        return listeners.forEach(function (listener) {
            ev.currentTarget = elem;
            if (typeof listener === 'function') {
                listener(ev);
            } else {
                listener.handleEvent(ev);
            }
        });
    }

    if (elem.parentNode) {
        elem.parentNode.dispatchEvent(ev);
    }
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = removeEventListener;

function removeEventListener(type, listener) {
    var elem = this;

    if (!elem.listeners) {
        return;
    }

    if (!elem.listeners[type]) {
        return;
    }

    var list = elem.listeners[type];
    var index = list.indexOf(listener);
    if (index !== -1) {
        list.splice(index, 1);
    }
}

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.handleEvent = handleEvent;

var _utils = __webpack_require__(9);

var ALL_PROPS = ["altKey", "bubbles", "cancelable", "ctrlKey", "eventPhase", "metaKey", "relatedTarget", "shiftKey", "target", "timeStamp", "type", "view", "which"];
var KEY_PROPS = ["char", "charCode", "key", "keyCode"];
var MOUSE_PROPS = ["button", "buttons", "clientX", "clientY", "layerX", "layerY", "offsetX", "offsetY", "pageX", "pageY", "screenX", "screenY", "toElement"];

var rkeyEvent = /^key|input/;
var rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/;

function Event(e) {
    for (var i = 0; i < ALL_PROPS.length; i++) {
        var propKey = ALL_PROPS[i];
        this[propKey] = e[propKey];
    }

    this._rawEvent = e;
}
Event.prototype.preventDefault = function () {
    this._rawEvent.preventDefault();
};
Event.prototype.stopPropagation = function () {
    var e = this._rawEvent;
    e.cancelBubble = true;
    e.stopImmediatePropagation();
};

function MouseEvent(e) {
    Event.call(this, e);
    for (var j = 0; j < MOUSE_PROPS.length; j++) {
        var mousePropKey = MOUSE_PROPS[j];
        this[mousePropKey] = e[mousePropKey];
    }
}
MouseEvent.prototype = (0, _utils.createObject)(Event.prototype);
MouseEvent.prototype.constructor = MouseEvent;

function KeyEvent(e) {
    Event.call(this, e);
    for (var j = 0; j < KEY_PROPS.length; j++) {
        var keyPropKey = KEY_PROPS[j];
        this[keyPropKey] = e[keyPropKey];
    }
}
KeyEvent.prototype = (0, _utils.createObject)(Event.prototype);
KeyEvent.prototype.constructor = KeyEvent;

function proxyEvent(e) {
    if (rkeyEvent.test(e.type)) {
        return new KeyEvent(e);
    } else if (rmouseEvent.test(e.type)) {
        return new MouseEvent(e);
    } else {
        return new Event(e);
    }
}

var delegatedEvents = {};

function handleEvent(name, lastEvent, nextEvent, dom) {
    var delegatedRoots = delegatedEvents[name];

    if (nextEvent) {
        if (!delegatedRoots) {
            delegatedRoots = { items: new _utils.SimpleMap(), docEvent: null };
            delegatedRoots.docEvent = attachEventToDocument(name, delegatedRoots);
            delegatedEvents[name] = delegatedRoots;
        }
        delegatedRoots.items.set(dom, nextEvent);
    } else if (delegatedRoots) {
        var items = delegatedRoots.items;
        if (items.delete(dom)) {
            if (items.size === 0) {
                _utils.doc.removeEventListener(name, delegatedRoots.docEvent);
                delete delegatedRoots[name];
            }
        }
    }
}

function dispatchEvent(event, target, items, count, isClick) {
    var eventToTrigger = items.get(target);
    if (eventToTrigger) {
        count--;
        event.currentTarget = target;
        eventToTrigger(event);
        if (event._rawEvent.cancelBubble) {
            return;
        }
    }
    if (count > 0) {
        var parentDom = target.parentNode;
        if ((0, _utils.isNullOrUndefined)(parentDom) || isClick && parentDom.nodeType === 1 && parentDom.disabled) {
            return;
        }
        dispatchEvent(event, parentDom, items, count, isClick);
    }
}

function attachEventToDocument(name, delegatedRoots) {
    var docEvent = function docEvent(event) {
        var count = delegatedRoots.items.size;
        if (count > 0) {
            dispatchEvent(proxyEvent(event), event.target, delegatedRoots.items, count, event.type === 'click');
        }
    };
    _utils.doc.addEventListener(name, docEvent);
    return docEvent;
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.patch = patch;
exports.patchVNode = patchVNode;
exports.patchProps = patchProps;
exports.patchProp = patchProp;
exports._patchProp = _patchProp;

var _vnode = __webpack_require__(13);

var _vdom = __webpack_require__(10);

var _utils = __webpack_require__(9);

var _event = __webpack_require__(21);

function patch(lastVNode, nextVNode, parentDom) {
    var mountedQueue = new _utils.MountedQueue();
    var dom = patchVNode(lastVNode, nextVNode, parentDom, mountedQueue);
    mountedQueue.trigger();
    return dom;
}

function patchVNode(lastVNode, nextVNode, parentDom, mountedQueue) {
    if (lastVNode !== nextVNode) {
        var nextType = nextVNode.type;
        var lastType = lastVNode.type;

        if (nextType & _vnode.Types.Element) {
            if (lastType & _vnode.Types.Element) {
                patchElement(lastVNode, nextVNode, parentDom, mountedQueue);
            } else {
                replaceElement(lastVNode, nextVNode, parentDom, mountedQueue);
            }
        } else if (nextType & _vnode.Types.TextElement) {
            if (lastType & _vnode.Types.TextElement) {
                patchText(lastVNode, nextVNode);
            } else {
                replaceElement(lastVNode, nextVNode, parentDom, mountedQueue);
            }
        } else if (nextType & _vnode.Types.ComponentClass) {
            if (lastType & _vnode.Types.ComponentClass) {
                patchComponentClass(lastVNode, nextVNode, parentDom, mountedQueue);
            } else {
                replaceElement(lastVNode, nextVNode, parentDom, mountedQueue);
            }
        } else if (nextType & _vnode.Types.ComponentFunction) {
            if (lastType & _vnode.Types.ComponentFunction) {
                patchComponentFunction(lastVNode, nextVNode, parentDom, mountedQueue);
            } else {
                replaceElement(lastVNode, nextVNode, parentDom, mountedQueue);
            }
        }
    }
    return nextVNode.dom;
}

function patchElement(lastVNode, nextVNode, parentDom, mountedQueue) {
    var dom = lastVNode.dom;
    var lastProps = lastVNode.props;
    var nextProps = nextVNode.props;
    var lastChildren = lastVNode.children;
    var nextChildren = nextVNode.children;
    var nextRef = nextVNode.ref;

    nextVNode.dom = dom;

    if (lastVNode.tag !== nextVNode.tag) {
        replaceElement(lastVNode, nextVNode, parentDom, mountedQueue);
    } else {
        patchChildren(lastChildren, nextChildren, dom, mountedQueue);

        patchProps(lastVNode, nextVNode);

        if (!(0, _utils.isNullOrUndefined)(nextRef) && lastVNode.ref !== nextRef) {
            (0, _vdom.createRef)(dom, nextRef, mountedQueue);
        }
    }
}

function patchComponentClass(lastVNode, nextVNode, parentDom, mountedQueue) {
    var lastTag = lastVNode.tag;
    var nextTag = nextVNode.tag;
    var dom = lastVNode.dom;

    var instance = void 0;
    var newDom = void 0;

    if (lastTag !== nextTag || lastVNode.key !== nextVNode.key) {
        newDom = (0, _vdom.createComponentClass)(nextVNode, null, mountedQueue, lastVNode);
        (0, _vdom.removeComponentClass)(lastVNode, null, nextVNode);
    } else {
        instance = lastVNode.children;
        newDom = instance.update(lastVNode, nextVNode);
        nextVNode.dom = newDom;
    }

    if (dom !== newDom) {
        (0, _vdom.replaceChild)(parentDom, newDom, dom);
    }
}

function patchComponentFunction(lastVNode, nextVNode, parentDom, mountedQueue) {
    var lastTag = lastVNode.tag;
    var nextTag = nextVNode.tag;

    if (lastVNode.key !== nextVNode.key) {
        (0, _vdom.removeElement)(lastVNode.children, parentDom);
        (0, _vdom.createComponentFunction)(nextVNode, parentDom, mountedQueue);
    } else {
        nextVNode.dom = lastVNode.dom;
        (0, _vdom.createComponentFunctionVNode)(nextVNode);
        patchVNode(lastVNode.children, nextVNode.children, parentDom, mountedQueue);
    }
}

function patchChildren(lastChildren, nextChildren, parentDom, mountedQueue) {
    if ((0, _utils.isNullOrUndefined)(lastChildren)) {
        if (!(0, _utils.isNullOrUndefined)(nextChildren)) {
            (0, _vdom.createElements)(nextChildren, parentDom, mountedQueue);
        }
    } else if ((0, _utils.isNullOrUndefined)(nextChildren)) {
        (0, _vdom.removeElements)(lastChildren, parentDom);
    } else if ((0, _utils.isArray)(lastChildren)) {
        if ((0, _utils.isArray)(nextChildren)) {
            patchChildrenByKey(lastChildren, nextChildren, parentDom, mountedQueue);
        } else {
            (0, _vdom.removeElements)(lastChildren, parentDom);
            (0, _vdom.createElement)(nextChildren, parentDom, mountedQueue);
        }
    } else if ((0, _utils.isArray)(nextChildren)) {
        (0, _vdom.removeElement)(lastChildren, parentDom);
        (0, _vdom.createElements)(nextChildren, parentDom, mountedQueue);
    } else {
        patchVNode(lastChildren, nextChildren, parentDom, mountedQueue);
    }
}

function patchChildrenByKey(a, b, dom, mountedQueue) {
    var aLength = a.length;
    var bLength = b.length;
    var aEnd = aLength - 1;
    var bEnd = bLength - 1;
    var aStart = 0;
    var bStart = 0;
    var i = void 0;
    var j = void 0;
    var aNode = void 0;
    var bNode = void 0;
    var nextNode = void 0;
    var nextPos = void 0;
    var node = void 0;
    var aStartNode = a[aStart];
    var bStartNode = b[bStart];
    var aEndNode = a[aEnd];
    var bEndNode = b[bEnd];

    outer: while (true) {
        while (aStartNode.key === bStartNode.key) {
            patchVNode(aStartNode, bStartNode, dom, mountedQueue);
            ++aStart;
            ++bStart;
            if (aStart > aEnd || bStart > bEnd) {
                break outer;
            }
            aStartNode = a[aStart];
            bStartNode = b[bStart];
        }
        while (aEndNode.key === bEndNode.key) {
            patchVNode(aEndNode, bEndNode, dom, mountedQueue);
            --aEnd;
            --bEnd;
            if (aEnd < aStart || bEnd < bStart) {
                break outer;
            }
            aEndNode = a[aEnd];
            bEndNode = b[bEnd];
        }

        if (aEndNode.key === bStartNode.key) {
            patchVNode(aEndNode, bStartNode, dom, mountedQueue);
            dom.insertBefore(bStartNode.dom, aStartNode.dom);
            --aEnd;
            ++bStart;
            aEndNode = a[aEnd];
            bStartNode = b[bStart];
            continue;
        }

        if (aStartNode.key === bEndNode.key) {
            patchVNode(aStartNode, bEndNode, dom, mountedQueue);
            insertOrAppend(bEnd, bLength, bEndNode.dom, b, dom);
            ++aStart;
            --bEnd;
            aStartNode = a[aStart];
            bEndNode = b[bEnd];
            continue;
        }
        break;
    }

    if (aStart > aEnd) {
        while (bStart <= bEnd) {
            insertOrAppend(bEnd, bLength, (0, _vdom.createElement)(b[bStart], null, mountedQueue), b, dom);
            ++bStart;
        }
    } else if (bStart > bEnd) {
        while (aStart <= aEnd) {
            (0, _vdom.removeElement)(a[aStart], dom);
            ++aStart;
        }
    } else {
        aLength = aEnd - aStart + 1;
        bLength = bEnd - bStart + 1;
        var sources = new Array(bLength);
        for (i = 0; i < bLength; i++) {
            sources[i] = -1;
        }
        var moved = false;
        var pos = 0;
        var patched = 0;

        if (bLength <= 4 || aLength * bLength <= 16) {
            for (i = aStart; i <= aEnd; i++) {
                aNode = a[i];
                if (patched < bLength) {
                    for (j = bStart; j <= bEnd; j++) {
                        bNode = b[j];
                        if (aNode.key === bNode.key) {
                            sources[j - bStart] = i;
                            if (pos > j) {
                                moved = true;
                            } else {
                                pos = j;
                            }
                            patchVNode(aNode, bNode, dom, mountedQueue);
                            ++patched;
                            a[i] = null;
                            break;
                        }
                    }
                }
            }
        } else {
            var keyIndex = {};
            for (i = bStart; i <= bEnd; i++) {
                keyIndex[b[i].key] = i;
            }
            for (i = aStart; i <= aEnd; i++) {
                aNode = a[i];
                if (patched < bLength) {
                    j = keyIndex[aNode.key];
                    if (j !== undefined) {
                        bNode = b[j];
                        sources[j - bStart] = i;
                        if (pos > j) {
                            moved = true;
                        } else {
                            pos = j;
                        }
                        patchVNode(aNode, bNode, dom, mountedQueue);
                        ++patched;
                        a[i] = null;
                    }
                }
            }
        }
        if (aLength === a.length && patched === 0) {
            (0, _vdom.removeAllChildren)(dom, a);
            while (bStart < bLength) {
                (0, _vdom.createElement)(b[bStart], dom, mountedQueue);
                ++bStart;
            }
        } else {
            i = aLength - patched;
            while (i > 0) {
                aNode = a[aStart++];
                if (aNode !== null) {
                    (0, _vdom.removeElement)(aNode, dom);
                    --i;
                }
            }
            if (moved) {
                var seq = lisAlgorithm(sources);
                j = seq.length - 1;
                for (i = bLength - 1; i >= 0; i--) {
                    if (sources[i] === -1) {
                        pos = i + bStart;
                        insertOrAppend(pos, b.length, (0, _vdom.createElement)(b[pos], null, mountedQueue), b, dom);
                    } else {
                        if (j < 0 || i !== seq[j]) {
                            pos = i + bStart;
                            insertOrAppend(pos, b.length, b[pos].dom, b, dom);
                        } else {
                            --j;
                        }
                    }
                }
            } else if (patched !== bLength) {
                for (i = bLength - 1; i >= 0; i--) {
                    if (sources[i] === -1) {
                        pos = i + bStart;
                        insertOrAppend(pos, b.length, (0, _vdom.createElement)(b[pos], null, mountedQueue), b, dom);
                    }
                }
            }
        }
    }
}

function lisAlgorithm(arr) {
    var p = arr.slice(0);
    var result = [0];
    var i = void 0;
    var j = void 0;
    var u = void 0;
    var v = void 0;
    var c = void 0;
    var len = arr.length;
    for (i = 0; i < len; i++) {
        var arrI = arr[i];
        if (arrI === -1) {
            continue;
        }
        j = result[result.length - 1];
        if (arr[j] < arrI) {
            p[i] = j;
            result.push(i);
            continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
            c = (u + v) / 2 | 0;
            if (arr[result[c]] < arrI) {
                u = c + 1;
            } else {
                v = c;
            }
        }
        if (arrI < arr[result[u]]) {
            if (u > 0) {
                p[i] = result[u - 1];
            }
            result[u] = i;
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}

function insertOrAppend(pos, length, newDom, nodes, dom) {
    var nextPos = pos + 1;
    if (nextPos < length) {
        dom.insertBefore(newDom, nodes[nextPos].dom);
    } else {
        dom.appendChild(newDom);
    }
}

function replaceElement(lastVNode, nextVNode, parentDom, mountedQueue) {
    if (!parentDom) parentDom = lastVNode.dom.parentNode;
    (0, _vdom.removeElement)(lastVNode, null);
    (0, _vdom.createElement)(nextVNode, null, mountedQueue);
    parentDom.replaceChild(nextVNode.dom, lastVNode.dom);
}

function patchText(lastVNode, nextVNode, parentDom) {
    var nextText = nextVNode.children;
    var dom = lastVNode.dom;
    nextVNode.dom = dom;
    if (lastVNode.children !== nextText) {
        dom.nodeValue = nextText;
    }
}

function patchProps(lastVNode, nextVNode) {
    var lastProps = lastVNode.props;
    var nextProps = nextVNode.props;
    var dom = nextVNode.dom;
    var prop = void 0;
    if (nextProps !== _vnode.EMPTY_OBJ) {
        for (prop in nextProps) {
            patchProp(prop, lastProps[prop], nextProps[prop], dom);
        }
    }
    if (lastProps !== _vnode.EMPTY_OBJ) {
        for (prop in lastProps) {
            if (!(prop in nextProps)) {
                removeProp(prop, lastProps[prop], dom);
            }
        }
    }
}

function patchProp(prop, lastValue, nextValue, dom) {
    if (lastValue !== nextValue) {
        if (_utils.skipProps[prop]) {
            return;
        } else if ((0, _utils.isEventProp)(prop)) {
            patchEvent(prop, lastValue, nextValue, dom);
        } else if ((0, _utils.isNullOrUndefined)(nextValue)) {
            dom.removeAttribute('prop');
        } else if (prop === 'style') {
            patchStyle(lastValue, nextValue, dom);
        } else if (prop === 'innerHTML') {
            dom.innerHTML = nextValue;
        } else {
            dom.setAttribute(prop, nextValue);
        }
    }
}

function _patchProp(prop, lastValue, nextValue, dom) {
    if (lastValue !== nextValue) {
        if (_utils.skipProps[prop]) {
            return;
        } else if ((0, _utils.isNullOrUndefined)(nextValue)) {
            removeProp(prop, lastValue, dom);
        } else if (prop === 'className') {
            dom.className = nextValue;
        } else if ((0, _utils.isEventProp)(prop)) {
            patchEvent(prop, lastValue, nextValue, dom);
        } else if ((0, _utils.isObject)(nextValue)) {
            patchPropByObject(prop, lastValue, nextValue, dom);
        } else if (prop === 'innerHTML') {
            dom.innerHTML = nextValue;
        } else {
            dom.setAttribute(prop, nextValue);
        }
    }
}

function removeProp(prop, lastValue, dom) {
    if (!(0, _utils.isNullOrUndefined)(lastValue)) {
        var handled = false;
        switch (prop) {
            case 'className':
                dom.removeAttribute('class');
                handled = true;
                break;
            case 'value':
                dom.value = '';
                handled = true;
                break;
            case 'style':
                dom.removeAttribute('style');
                handled = true;
                break;
            case 'attributes':
                for (var key in lastValue) {
                    dom.removeAttribute(key);
                }
                handled = true;
                break;
            default:
                break;
        }
        if (!handled) {
            if ((0, _utils.isEventProp)(prop)) {
                (0, _event.handleEvent)(prop.substr(3), lastValue, null, dom);
            } else if ((0, _utils.isObject)(lastValue)) {
                var domProp = dom[prop];
                try {
                    dom[prop] = undefined;
                    delete dom[prop];
                } catch (e) {
                    for (var _key in lastValue) {
                        delete domProp[_key];
                    }
                }
            } else {
                dom.removeAttribute(prop);
            }
        }
    }
}

function patchPropByObject(prop, lastValue, nextValue, dom) {
    if (lastValue && !(0, _utils.isObject)(lastValue) && !(0, _utils.isNullOrUndefined)(lastValue)) {
        removeProp(prop, lastValue, dom);
    }
    switch (prop) {
        case 'attributes':
            return patchAttributes(lastValue, nextValue, dom);
        case 'style':
            return patchStyle(lastValue, nextValue, dom);
        default:
            return patchObject(prop, lastValue, nextValue, dom);
    }
}

function patchObject(prop, lastValue, nextValue, dom) {
    var domProps = dom[prop];
    if ((0, _utils.isNullOrUndefined)(domProps)) {
        domProps = dom[prop] = {};
    }
    var key = void 0;
    var value = void 0;
    for (key in nextValue) {
        domProps[key] = nextValue[key];
    }
    if (!(0, _utils.isNullOrUndefined)(lastValue)) {
        for (key in lastValue) {
            if ((0, _utils.isNullOrUndefined)(nextValue[key])) {
                delete domProps[key];
            }
        }
    }
}

function patchAttributes(lastValue, nextValue, dom) {
    var hasRemoved = {};
    var key = void 0;
    var value = void 0;
    for (key in nextValue) {
        value = nextValue[key];
        if ((0, _utils.isNullOrUndefined)(value)) {
            dom.removeAttribute(key);
            hasRemoved[key] = true;
        } else {
            dom.setAttribute(key, value);
        }
    }
    if (!(0, _utils.isNullOrUndefined)(lastValue)) {
        for (key in lastValue) {
            if ((0, _utils.isNullOrUndefined)(nextValue[key]) && !hasRemoved[key]) {
                dom.removeAttribute(key);
            }
        }
    }
}

function patchStyle(lastValue, nextValue, dom) {
    var domStyle = dom.style;
    var hasRemoved = {};
    var key = void 0;
    var value = void 0;
    for (key in nextValue) {
        value = nextValue[key];
        if ((0, _utils.isNullOrUndefined)(value)) {
            domStyle[key] = '';
            hasRemoved[key] = true;
        } else {
            domStyle[key] = value;
        }
    }
    if (!(0, _utils.isNullOrUndefined)(lastValue)) {
        for (key in lastValue) {
            if ((0, _utils.isNullOrUndefined)(nextValue[key]) && !hasRemoved[key]) {
                domStyle[key] = '';
            }
        }
    }
}

function patchEvent(prop, lastValue, nextValue, dom) {
    if (lastValue !== nextValue) {
        (0, _event.handleEvent)(prop.substr(3), lastValue, nextValue, dom);
    }
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(33).default;
module.exports.default = module.exports;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _random(max) {
    return Math.round(Math.random() * 1000) % max;
}

var Store = exports.Store = function () {
    function Store() {
        _classCallCheck(this, Store);

        this.data = [];
        this.selected = undefined;
        this.id = 1;
    }

    _createClass(Store, [{
        key: "buildData",
        value: function buildData() {
            var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;

            var adjectives = ["pretty", "large", "big", "small", "tall", "short", "long", "handsome", "plain", "quaint", "clean", "elegant", "easy", "angry", "crazy", "helpful", "mushy", "odd", "unsightly", "adorable", "important", "inexpensive", "cheap", "expensive", "fancy"];
            var colours = ["red", "yellow", "blue", "green", "pink", "brown", "purple", "brown", "white", "black", "orange"];
            var nouns = ["table", "chair", "house", "bbq", "desk", "car", "pony", "cookie", "sandwich", "burger", "pizza", "mouse", "keyboard"];
            var data = [];
            for (var i = 0; i < count; i++) {
                data.push({ id: this.id++, label: adjectives[_random(adjectives.length)] + " " + colours[_random(colours.length)] + " " + nouns[_random(nouns.length)] });
            }return data;
        }
    }, {
        key: "updateData",
        value: function updateData() {
            var mod = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 10;

            for (var i = 0; i < this.data.length; i += 10) {
                this.data[i] = Object.assign({}, this.data[i], { label: this.data[i].label + ' !!!' });
            }
        }
    }, {
        key: "delete",
        value: function _delete(id) {
            var idx = this.data.findIndex(function (d) {
                return d.id == id;
            });
            this.data = this.data.filter(function (e, i) {
                return i != idx;
            });
            return this;
        }
    }, {
        key: "run",
        value: function run() {
            this.data = this.buildData();
            this.selected = undefined;
        }
    }, {
        key: "add",
        value: function add() {
            var count = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;

            this.data = this.data.concat(this.buildData(count));
        }
    }, {
        key: "update",
        value: function update() {
            this.updateData();
        }
    }, {
        key: "select",
        value: function select(id) {
            this.selected = id;
        }
    }, {
        key: "hideAll",
        value: function hideAll() {
            this.backup = this.data;
            this.data = [];
            this.selected = undefined;
        }
    }, {
        key: "showAll",
        value: function showAll() {
            this.data = this.backup;
            this.backup = null;
            this.selected = undefined;
        }
    }, {
        key: "runLots",
        value: function runLots() {
            this.data = this.buildData(10000);
            this.selected = undefined;
        }
    }, {
        key: "clear",
        value: function clear() {
            this.data = [];
            this.selected = undefined;
        }
    }, {
        key: "swapRows",
        value: function swapRows() {
            if (this.data.length > 10) {
                var a = this.data[4];
                this.data[4] = this.data[9];
                this.data[9] = a;
            }
        }
    }]);

    return Store;
}();

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hc = exports.render = exports.patch = exports.h = undefined;

var _vnode = __webpack_require__(13);

var _vpatch = __webpack_require__(22);

var _vdom = __webpack_require__(10);

exports.h = _vnode.createVNode;
exports.patch = _vpatch.patch;
exports.render = _vdom.render;
exports.hc = _vnode.createCommentVNode;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
exports.NO_OP = '$NO_OP';
exports.ERROR_MSG = 'a runtime error occured! Use Inferno in development environment to find the error.';
// This should be boolean and not reference to window.document
exports.isBrowser = !!(typeof window !== 'undefined' && window.document);
function toArray(children) {
    return exports.isArray(children) ? children : children ? [children] : children;
}
exports.toArray = toArray;
// this is MUCH faster than .constructor === Array and instanceof Array
// in Node 7 and the later versions of V8, slower in older versions though
exports.isArray = Array.isArray;
function isStatefulComponent(o) {
    return !isUndefined(o.prototype) && !isUndefined(o.prototype.render);
}
exports.isStatefulComponent = isStatefulComponent;
function isStringOrNumber(o) {
    var type = typeof o === "undefined" ? "undefined" : _typeof(o);
    return type === 'string' || type === 'number';
}
exports.isStringOrNumber = isStringOrNumber;
function isNullOrUndef(o) {
    return isUndefined(o) || isNull(o);
}
exports.isNullOrUndef = isNullOrUndef;
function isInvalid(o) {
    return isNull(o) || o === false || isTrue(o) || isUndefined(o);
}
exports.isInvalid = isInvalid;
function isFunction(o) {
    return typeof o === 'function';
}
exports.isFunction = isFunction;
function isString(o) {
    return typeof o === 'string';
}
exports.isString = isString;
function isNumber(o) {
    return typeof o === 'number';
}
exports.isNumber = isNumber;
function isNull(o) {
    return o === null;
}
exports.isNull = isNull;
function isTrue(o) {
    return o === true;
}
exports.isTrue = isTrue;
function isUndefined(o) {
    return o === void 0;
}
exports.isUndefined = isUndefined;
function isObject(o) {
    return (typeof o === "undefined" ? "undefined" : _typeof(o)) === 'object';
}
exports.isObject = isObject;
function throwError(message) {
    if (!message) {
        message = exports.ERROR_MSG;
    }
    throw new Error("Inferno Error: " + message);
}
exports.throwError = throwError;
function warning(message) {
    console.warn(message);
}
exports.warning = warning;
function combineFrom(first, second) {
    var out = {};
    if (first) {
        for (var key in first) {
            out[key] = first[key];
        }
    }
    if (second) {
        for (var key in second) {
            out[key] = second[key];
        }
    }
    return out;
}
exports.combineFrom = combineFrom;
function Lifecycle() {
    this.listeners = [];
}
exports.Lifecycle = Lifecycle;
Lifecycle.prototype.addListener = function addListener(callback) {
    this.listeners.push(callback);
};
Lifecycle.prototype.trigger = function trigger() {
    var listeners = this.listeners;
    var listener;
    // We need to remove current listener from array when calling it, because more listeners might be added
    while (listener = listeners.shift()) {
        listener();
    }
};

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var inferno_shared_1 = __webpack_require__(0);
var isiOS = inferno_shared_1.isBrowser && !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
var delegatedEvents = new Map();
function handleEvent(name, lastEvent, nextEvent, dom) {
    var delegatedRoots = delegatedEvents.get(name);
    if (nextEvent) {
        if (!delegatedRoots) {
            delegatedRoots = { items: new Map(), docEvent: null };
            delegatedRoots.docEvent = attachEventToDocument(name, delegatedRoots);
            delegatedEvents.set(name, delegatedRoots);
        }
        if (!lastEvent) {
            if (isiOS && name === 'onClick') {
                trapClickOnNonInteractiveElement(dom);
            }
        }
        delegatedRoots.items.set(dom, nextEvent);
    } else if (delegatedRoots) {
        var items = delegatedRoots.items;
        if (items.delete(dom)) {
            // If any items were deleted, check if listener need to be removed
            if (items.size === 0) {
                document.removeEventListener(normalizeEventName(name), delegatedRoots.docEvent);
                delegatedEvents.delete(name);
            }
        }
    }
}
exports.handleEvent = handleEvent;
function dispatchEvent(event, target, items, count, isClick, eventData) {
    var eventsToTrigger = items.get(target);
    if (eventsToTrigger) {
        count--;
        // linkEvent object
        eventData.dom = target;
        if (eventsToTrigger.event) {
            eventsToTrigger.event(eventsToTrigger.data, event);
        } else {
            eventsToTrigger(event);
        }
        if (event.cancelBubble) {
            return;
        }
    }
    if (count > 0) {
        var parentDom = target.parentNode;
        // Html Nodes can be nested fe: span inside button in that scenario browser does not handle disabled attribute on parent,
        // because the event listener is on document.body
        // Don't process clicks on disabled elements
        if (parentDom === null || isClick && parentDom.nodeType === 1 && parentDom.disabled) {
            return;
        }
        dispatchEvent(event, parentDom, items, count, isClick, eventData);
    }
}
function normalizeEventName(name) {
    return name.substr(2).toLowerCase();
}
function stopPropagation() {
    this.cancelBubble = true;
    this.stopImmediatePropagation();
}
function attachEventToDocument(name, delegatedRoots) {
    var docEvent = function docEvent(event) {
        var count = delegatedRoots.items.size;
        if (count > 0) {
            event.stopPropagation = stopPropagation;
            // Event data needs to be object to save reference to currentTarget getter
            var eventData_1 = {
                dom: document
            };
            try {
                Object.defineProperty(event, 'currentTarget', {
                    configurable: true,
                    get: function get() {
                        return eventData_1.dom;
                    }
                });
            } catch (e) {}
            dispatchEvent(event, event.target, delegatedRoots.items, count, event.type === 'click', eventData_1);
        }
    };
    document.addEventListener(normalizeEventName(name), docEvent);
    return docEvent;
}
// tslint:disable-next-line:no-empty
function emptyFn() {}
function trapClickOnNonInteractiveElement(dom) {
    // Mobile Safari does not fire properly bubble click events on
    // non-interactive elements, which means delegated click listeners do not
    // fire. The workaround for this bug involves attaching an empty click
    // listener on the target node.
    // http://www.quirksmode.org/blog/archives/2010/09/click_event_del.html
    // Just set it using the onclick property so that we don't have to manage any
    // bookkeeping for it. Not sure if we need to clear it when the listener is
    // removed.
    // TODO: Only do this for the relevant Safaris maybe?
    dom.onclick = emptyFn;
}

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Links given data to event as first parameter
 * @param {*} data data to be linked, it will be available in function as first parameter
 * @param {Function} event Function to be called when event occurs
 * @returns {{data: *, event: Function}}
 */
function linkEvent(data, event) {
  return { data: data, event: event };
}
exports.linkEvent = linkEvent;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

Object.defineProperty(exports, "__esModule", { value: true });
var inferno_shared_1 = __webpack_require__(0);
var options_1 = __webpack_require__(3);
var constants_1 = __webpack_require__(8);
var mounting_1 = __webpack_require__(6);
var patching_1 = __webpack_require__(5);
var rendering_1 = __webpack_require__(7);
var utils_1 = __webpack_require__(2);
var processElement_1 = __webpack_require__(12);
function normalizeChildNodes(parentDom) {
    var dom = parentDom.firstChild;
    while (dom) {
        if (dom.nodeType === 8) {
            if (dom.data === '!') {
                var placeholder = document.createTextNode('');
                parentDom.replaceChild(placeholder, dom);
                dom = dom.nextSibling;
            } else {
                var lastDom = dom.previousSibling;
                parentDom.removeChild(dom);
                dom = lastDom || parentDom.firstChild;
            }
        } else {
            dom = dom.nextSibling;
        }
    }
}
exports.normalizeChildNodes = normalizeChildNodes;
function hydrateComponent(vNode, dom, lifecycle, context, isSVG, isClass) {
    var type = vNode.type;
    var ref = vNode.ref;
    vNode.dom = dom;
    var props = vNode.props || utils_1.EMPTY_OBJ;
    if (isClass) {
        var _isSVG = dom.namespaceURI === constants_1.svgNS;
        var instance = utils_1.createClassComponentInstance(vNode, type, props, context, _isSVG, lifecycle);
        var input = instance._lastInput;
        instance._vComponent = vNode;
        instance._vNode = vNode;
        hydrate(input, dom, lifecycle, instance._childContext, _isSVG);
        mounting_1.mountClassComponentCallbacks(vNode, ref, instance, lifecycle);
        instance._updating = false; // Mount finished allow going sync
        if (options_1.options.findDOMNodeEnabled) {
            rendering_1.componentToDOMNodeMap.set(instance, dom);
        }
    } else {
        var input = utils_1.createFunctionalComponentInput(vNode, type, props, context);
        hydrate(input, dom, lifecycle, context, isSVG);
        vNode.children = input;
        vNode.dom = input.dom;
        mounting_1.mountFunctionalComponentCallbacks(ref, dom, lifecycle);
    }
    return dom;
}
function hydrateElement(vNode, dom, lifecycle, context, isSVG) {
    var children = vNode.children;
    var props = vNode.props;
    var className = vNode.className;
    var flags = vNode.flags;
    var ref = vNode.ref;
    isSVG = isSVG || (flags & 128 /* SvgElement */) > 0;
    if (dom.nodeType !== 1 || dom.tagName.toLowerCase() !== vNode.type) {
        if (process.env.NODE_ENV !== 'production') {
            inferno_shared_1.warning('Inferno hydration: Server-side markup doesn\'t match client-side markup or Initial render target is not empty');
        }
        var newDom = mounting_1.mountElement(vNode, null, lifecycle, context, isSVG);
        vNode.dom = newDom;
        utils_1.replaceChild(dom.parentNode, newDom, dom);
        return newDom;
    }
    vNode.dom = dom;
    if (children) {
        hydrateChildren(children, dom, lifecycle, context, isSVG);
    }
    if (props) {
        var hasControlledValue = false;
        var isFormElement = (flags & 3584 /* FormElement */) > 0;
        if (isFormElement) {
            hasControlledValue = processElement_1.isControlledFormElement(props);
        }
        for (var prop in props) {
            // do not add a hasOwnProperty check here, it affects performance
            patching_1.patchProp(prop, null, props[prop], dom, isSVG, hasControlledValue);
        }
        if (isFormElement) {
            processElement_1.processElement(flags, vNode, dom, props, true, hasControlledValue);
        }
    }
    if (inferno_shared_1.isNullOrUndef(className)) {
        dom.removeAttribute('class');
    } else {
        if (isSVG) {
            dom.setAttribute('class', className);
        } else {
            dom.className = className;
        }
    }
    if (ref) {
        mounting_1.mountRef(dom, ref, lifecycle);
    }
    return dom;
}
function hydrateChildren(children, parentDom, lifecycle, context, isSVG) {
    normalizeChildNodes(parentDom);
    var dom = parentDom.firstChild;
    if (inferno_shared_1.isArray(children)) {
        for (var i = 0, len = children.length; i < len; i++) {
            var child = children[i];
            if (!inferno_shared_1.isNull(child) && inferno_shared_1.isObject(child)) {
                if (!inferno_shared_1.isNull(dom)) {
                    dom = hydrate(child, dom, lifecycle, context, isSVG).nextSibling;
                } else {
                    mounting_1.mount(child, parentDom, lifecycle, context, isSVG);
                }
            }
        }
    } else if (inferno_shared_1.isStringOrNumber(children)) {
        if (dom && dom.nodeType === 3) {
            if (dom.nodeValue !== children) {
                dom.nodeValue = children;
            }
        } else if (children) {
            parentDom.textContent = children;
        }
        dom = dom.nextSibling;
    } else if (inferno_shared_1.isObject(children)) {
        hydrate(children, dom, lifecycle, context, isSVG);
        dom = dom.nextSibling;
    }
    // clear any other DOM nodes, there should be only a single entry for the root
    while (dom) {
        var nextSibling = dom.nextSibling;
        parentDom.removeChild(dom);
        dom = nextSibling;
    }
}
function hydrateText(vNode, dom) {
    if (dom.nodeType !== 3) {
        var newDom = mounting_1.mountText(vNode, null);
        vNode.dom = newDom;
        utils_1.replaceChild(dom.parentNode, newDom, dom);
        return newDom;
    }
    var text = vNode.children;
    if (dom.nodeValue !== text) {
        dom.nodeValue = text;
    }
    vNode.dom = dom;
    return dom;
}
function hydrateVoid(vNode, dom) {
    vNode.dom = dom;
    return dom;
}
function hydrate(vNode, dom, lifecycle, context, isSVG) {
    var flags = vNode.flags;
    if (flags & 28 /* Component */) {
            return hydrateComponent(vNode, dom, lifecycle, context, isSVG, (flags & 4 /* ComponentClass */) > 0);
        } else if (flags & 3970 /* Element */) {
            return hydrateElement(vNode, dom, lifecycle, context, isSVG);
        } else if (flags & 1 /* Text */) {
            return hydrateText(vNode, dom);
        } else if (flags & 4096 /* Void */) {
            return hydrateVoid(vNode, dom);
        } else {
        if (process.env.NODE_ENV !== 'production') {
            inferno_shared_1.throwError("hydrate() expects a valid VNode, instead it received an object with the type \"" + (typeof vNode === "undefined" ? "undefined" : _typeof(vNode)) + "\".");
        }
        inferno_shared_1.throwError();
    }
}
function hydrateRoot(input, parentDom, lifecycle) {
    if (!inferno_shared_1.isNull(parentDom)) {
        var dom = parentDom.firstChild;
        if (!inferno_shared_1.isNull(dom)) {
            hydrate(input, dom, lifecycle, utils_1.EMPTY_OBJ, false);
            dom = parentDom.firstChild;
            // clear any other DOM nodes, there should be only a single entry for the root
            while (dom = dom.nextSibling) {
                parentDom.removeChild(dom);
            }
            return true;
        }
    }
    return false;
}
exports.hydrateRoot = hydrateRoot;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var inferno_shared_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(2);
function isCheckedType(type) {
    return type === 'checkbox' || type === 'radio';
}
exports.isCheckedType = isCheckedType;
function onTextInputChange(e) {
    var vNode = this;
    var props = vNode.props || utils_1.EMPTY_OBJ;
    var dom = vNode.dom;
    var previousValue = props.value;
    if (props.onInput) {
        var event_1 = props.onInput;
        if (event_1.event) {
            event_1.event(event_1.data, e);
        } else {
            event_1(e);
        }
    } else if (props.oninput) {
        props.oninput(e);
    }
    // the user may have updated the vNode from the above onInput events syncronously
    // so we need to get it from the context of `this` again
    var newVNode = this;
    var newProps = newVNode.props || utils_1.EMPTY_OBJ;
    // If render is going async there is no value change yet, it will come back to process input soon
    if (previousValue !== newProps.value) {
        // When this happens we need to store current cursor position and restore it, to avoid jumping
        applyValue(newProps, dom);
    }
}
function wrappedOnChange(e) {
    var props = this.props || utils_1.EMPTY_OBJ;
    var event = props.onChange;
    if (event.event) {
        event.event(event.data, e);
    } else {
        event(e);
    }
}
function onCheckboxChange(e) {
    e.stopPropagation(); // This click should not propagate its for internal use
    var vNode = this;
    var props = vNode.props || utils_1.EMPTY_OBJ;
    var dom = vNode.dom;
    var previousValue = props.value;
    if (props.onClick) {
        var event_2 = props.onClick;
        if (event_2.event) {
            event_2.event(event_2.data, e);
        } else {
            event_2(e);
        }
    } else if (props.onclick) {
        props.onclick(e);
    }
    // the user may have updated the vNode from the above onInput events syncronously
    // so we need to get it from the context of `this` again
    var newVNode = this;
    var newProps = newVNode.props || utils_1.EMPTY_OBJ;
    // If render is going async there is no value change yet, it will come back to process input soon
    if (previousValue !== newProps.value) {
        // When this happens we need to store current cursor position and restore it, to avoid jumping
        applyValue(newProps, dom);
    }
}
function processInput(vNode, dom, nextPropsOrEmpty, mounting, isControlled) {
    applyValue(nextPropsOrEmpty, dom);
    if (mounting && isControlled) {
        if (isCheckedType(nextPropsOrEmpty.type)) {
            dom.onclick = onCheckboxChange.bind(vNode);
            dom.onclick.wrapped = true;
        } else {
            dom.oninput = onTextInputChange.bind(vNode);
            dom.oninput.wrapped = true;
        }
        if (nextPropsOrEmpty.onChange) {
            dom.onchange = wrappedOnChange.bind(vNode);
            dom.onchange.wrapped = true;
        }
    }
}
exports.processInput = processInput;
function applyValue(nextPropsOrEmpty, dom) {
    var type = nextPropsOrEmpty.type;
    var value = nextPropsOrEmpty.value;
    var checked = nextPropsOrEmpty.checked;
    var multiple = nextPropsOrEmpty.multiple;
    var defaultValue = nextPropsOrEmpty.defaultValue;
    var hasValue = !inferno_shared_1.isNullOrUndef(value);
    if (type && type !== dom.type) {
        dom.setAttribute('type', type);
    }
    if (multiple && multiple !== dom.multiple) {
        dom.multiple = multiple;
    }
    if (!inferno_shared_1.isNullOrUndef(defaultValue) && !hasValue) {
        dom.defaultValue = defaultValue + '';
    }
    if (isCheckedType(type)) {
        if (hasValue) {
            dom.value = value;
        }
        if (!inferno_shared_1.isNullOrUndef(checked)) {
            dom.checked = checked;
        }
    } else {
        if (hasValue && dom.value !== value) {
            dom.value = value;
        } else if (!inferno_shared_1.isNullOrUndef(checked)) {
            dom.checked = checked;
        }
    }
}
exports.applyValue = applyValue;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var inferno_shared_1 = __webpack_require__(0);
var VNodes_1 = __webpack_require__(4);
var utils_1 = __webpack_require__(2);
function updateChildOptionGroup(vNode, value) {
    var type = vNode.type;
    if (type === 'optgroup') {
        var children = vNode.children;
        if (inferno_shared_1.isArray(children)) {
            for (var i = 0, len = children.length; i < len; i++) {
                updateChildOption(children[i], value);
            }
        } else if (VNodes_1.isVNode(children)) {
            updateChildOption(children, value);
        }
    } else {
        updateChildOption(vNode, value);
    }
}
function updateChildOption(vNode, value) {
    var props = vNode.props || utils_1.EMPTY_OBJ;
    var dom = vNode.dom;
    // we do this as multiple may have changed
    dom.value = props.value;
    if (inferno_shared_1.isArray(value) && value.indexOf(props.value) !== -1 || props.value === value) {
        dom.selected = true;
    } else if (!inferno_shared_1.isNullOrUndef(value) || !inferno_shared_1.isNullOrUndef(props.selected)) {
        dom.selected = props.selected || false;
    }
}
function onSelectChange(e) {
    var vNode = this;
    var props = vNode.props || utils_1.EMPTY_OBJ;
    var dom = vNode.dom;
    var previousValue = props.value;
    if (props.onChange) {
        var event_1 = props.onChange;
        if (event_1.event) {
            event_1.event(event_1.data, e);
        } else {
            event_1(e);
        }
    } else if (props.onchange) {
        props.onchange(e);
    }
    // the user may have updated the vNode from the above onInput events syncronously
    // so we need to get it from the context of `this` again
    var newVNode = this;
    var newProps = newVNode.props || utils_1.EMPTY_OBJ;
    // If render is going async there is no value change yet, it will come back to process input soon
    if (previousValue !== newProps.value) {
        // When this happens we need to store current cursor position and restore it, to avoid jumping
        applyValue(newVNode, dom, newProps, false);
    }
}
function processSelect(vNode, dom, nextPropsOrEmpty, mounting, isControlled) {
    applyValue(vNode, dom, nextPropsOrEmpty, mounting);
    if (mounting && isControlled) {
        dom.onchange = onSelectChange.bind(vNode);
        dom.onchange.wrapped = true;
    }
}
exports.processSelect = processSelect;
function applyValue(vNode, dom, nextPropsOrEmpty, mounting) {
    if (nextPropsOrEmpty.multiple !== dom.multiple) {
        dom.multiple = nextPropsOrEmpty.multiple;
    }
    var children = vNode.children;
    if (!inferno_shared_1.isInvalid(children)) {
        var value = nextPropsOrEmpty.value;
        if (mounting && inferno_shared_1.isNullOrUndef(value)) {
            value = nextPropsOrEmpty.defaultValue;
        }
        if (inferno_shared_1.isArray(children)) {
            for (var i = 0, len = children.length; i < len; i++) {
                updateChildOptionGroup(children[i], value);
            }
        } else if (VNodes_1.isVNode(children)) {
            updateChildOptionGroup(children, value);
        }
    }
}
exports.applyValue = applyValue;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", { value: true });
var inferno_shared_1 = __webpack_require__(0);
var utils_1 = __webpack_require__(2);
function wrappedOnChange(e) {
    var props = this.props || utils_1.EMPTY_OBJ;
    var event = props.onChange;
    if (event.event) {
        event.event(event.data, e);
    } else {
        event(e);
    }
}
function onTextareaInputChange(e) {
    var vNode = this;
    var props = vNode.props || utils_1.EMPTY_OBJ;
    var previousValue = props.value;
    if (props.onInput) {
        var event_1 = props.onInput;
        if (event_1.event) {
            event_1.event(event_1.data, e);
        } else {
            event_1(e);
        }
    } else if (props.oninput) {
        props.oninput(e);
    }
    // the user may have updated the vNode from the above onInput events syncronously
    // so we need to get it from the context of `this` again
    var newVNode = this;
    var newProps = newVNode.props || utils_1.EMPTY_OBJ;
    // If render is going async there is no value change yet, it will come back to process input soon
    if (previousValue !== newProps.value) {
        // When this happens we need to store current cursor position and restore it, to avoid jumping
        applyValue(newVNode, vNode.dom, false);
    }
}
function processTextarea(vNode, dom, nextPropsOrEmpty, mounting, isControlled) {
    applyValue(nextPropsOrEmpty, dom, mounting);
    if (mounting && isControlled) {
        dom.oninput = onTextareaInputChange.bind(vNode);
        dom.oninput.wrapped = true;
        if (nextPropsOrEmpty.onChange) {
            dom.onchange = wrappedOnChange.bind(vNode);
            dom.onchange.wrapped = true;
        }
    }
}
exports.processTextarea = processTextarea;
function applyValue(nextPropsOrEmpty, dom, mounting) {
    var value = nextPropsOrEmpty.value;
    var domValue = dom.value;
    if (inferno_shared_1.isNullOrUndef(value)) {
        if (mounting) {
            var defaultValue = nextPropsOrEmpty.defaultValue;
            if (!inferno_shared_1.isNullOrUndef(defaultValue)) {
                if (defaultValue !== domValue) {
                    dom.value = defaultValue;
                }
            } else if (domValue !== '') {
                dom.value = '';
            }
        }
    } else {
        /* There is value so keep it controlled */
        if (domValue !== value) {
            dom.value = value;
        }
    }
}
exports.applyValue = applyValue;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

Object.defineProperty(exports, "__esModule", { value: true });
var inferno_shared_1 = __webpack_require__(0);
exports.NO_OP = inferno_shared_1.NO_OP;
var normalization_1 = __webpack_require__(16);
exports.getFlagsForElementVnode = normalization_1.getFlagsForElementVnode;
exports.internal_normalize = normalization_1.normalize;
var options_1 = __webpack_require__(3);
exports.options = options_1.options;
var VNodes_1 = __webpack_require__(4);
exports.cloneVNode = VNodes_1.cloneVNode;
exports.createVNode = VNodes_1.createVNode;
var constants_1 = __webpack_require__(8);
exports.internal_isUnitlessNumber = constants_1.isUnitlessNumber;
var linkEvent_1 = __webpack_require__(28);
exports.linkEvent = linkEvent_1.linkEvent;
var patching_1 = __webpack_require__(5);
exports.internal_patch = patching_1.patch;
var rendering_1 = __webpack_require__(7);
exports.internal_DOMNodeMap = rendering_1.componentToDOMNodeMap;
exports.createRenderer = rendering_1.createRenderer;
exports.findDOMNode = rendering_1.findDOMNode;
exports.render = rendering_1.render;
var utils_1 = __webpack_require__(2);
exports.EMPTY_OBJ = utils_1.EMPTY_OBJ;
if (process.env.NODE_ENV !== 'production') {
    /* tslint:disable-next-line:no-empty */
    var testFunc = function testFn() {};
    if ((testFunc.name || testFunc.toString()).indexOf('testFn') === -1) {
        inferno_shared_1.warning('It looks like you\'re using a minified copy of the development build ' + 'of Inferno. When deploying Inferno apps to production, make sure to use ' + 'the production build which skips development warnings and is faster. ' + 'See http://infernojs.org for more details.');
    }
}
var version = '3.0.6';
exports.version = version;
// we duplicate it so it plays nicely with different module loading systems
exports.default = {
    getFlagsForElementVnode: normalization_1.getFlagsForElementVnode,
    linkEvent: linkEvent_1.linkEvent,
    // core shapes
    createVNode: VNodes_1.createVNode,
    // cloning
    cloneVNode: VNodes_1.cloneVNode,
    // used to shared common items between Inferno libs
    NO_OP: inferno_shared_1.NO_OP,
    EMPTY_OBJ: utils_1.EMPTY_OBJ,
    // DOM
    render: rendering_1.render,
    findDOMNode: rendering_1.findDOMNode,
    createRenderer: rendering_1.createRenderer,
    options: options_1.options,
    version: version,
    internal_patch: patching_1.patch,
    internal_DOMNodeMap: rendering_1.componentToDOMNodeMap,
    internal_isUnitlessNumber: constants_1.isUnitlessNumber,
    internal_normalize: normalization_1.normalize
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var domWalk = __webpack_require__(14);

var Comment = __webpack_require__(35);
var DOMText = __webpack_require__(37);
var DOMElement = __webpack_require__(17);
var DocumentFragment = __webpack_require__(36);
var Event = __webpack_require__(38);
var dispatchEvent = __webpack_require__(19);
var addEventListener = __webpack_require__(18);
var removeEventListener = __webpack_require__(20);

module.exports = Document;

function Document() {
    if (!(this instanceof Document)) {
        return new Document();
    }

    this.head = this.createElement("head");
    this.body = this.createElement("body");
    this.documentElement = this.createElement("html");
    this.documentElement.appendChild(this.head);
    this.documentElement.appendChild(this.body);
    this.childNodes = [this.documentElement];
    this.nodeType = 9;
}

var proto = Document.prototype;
proto.createTextNode = function createTextNode(value) {
    return new DOMText(value, this);
};

proto.createElementNS = function createElementNS(namespace, tagName) {
    var ns = namespace === null ? null : String(namespace);
    return new DOMElement(tagName, this, ns);
};

proto.createElement = function createElement(tagName) {
    return new DOMElement(tagName, this);
};

proto.createDocumentFragment = function createDocumentFragment() {
    return new DocumentFragment(this);
};

proto.createEvent = function createEvent(family) {
    return new Event(family);
};

proto.createComment = function createComment(data) {
    return new Comment(data, this);
};

proto.getElementById = function getElementById(id) {
    id = String(id);

    var result = domWalk(this.childNodes, function (node) {
        if (String(node.id) === id) {
            return node;
        }
    });

    return result || null;
};

proto.getElementsByClassName = DOMElement.prototype.getElementsByClassName;
proto.getElementsByTagName = DOMElement.prototype.getElementsByTagName;
proto.contains = DOMElement.prototype.contains;

proto.removeEventListener = removeEventListener;
proto.addEventListener = addEventListener;
proto.dispatchEvent = dispatchEvent;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = Comment;

function Comment(data, owner) {
    if (!(this instanceof Comment)) {
        return new Comment(data, owner);
    }

    this.data = data;
    this.nodeValue = data;
    this.length = data.length;
    this.ownerDocument = owner || null;
}

Comment.prototype.nodeType = 8;
Comment.prototype.nodeName = "#comment";

Comment.prototype.toString = function _Comment_toString() {
    return "[object Comment]";
};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var DOMElement = __webpack_require__(17);

module.exports = DocumentFragment;

function DocumentFragment(owner) {
    if (!(this instanceof DocumentFragment)) {
        return new DocumentFragment();
    }

    this.childNodes = [];
    this.parentNode = null;
    this.ownerDocument = owner || null;
}

DocumentFragment.prototype.type = "DocumentFragment";
DocumentFragment.prototype.nodeType = 11;
DocumentFragment.prototype.nodeName = "#document-fragment";

DocumentFragment.prototype.appendChild = DOMElement.prototype.appendChild;
DocumentFragment.prototype.replaceChild = DOMElement.prototype.replaceChild;
DocumentFragment.prototype.removeChild = DOMElement.prototype.removeChild;

DocumentFragment.prototype.toString = function _DocumentFragment_toString() {
    return this.childNodes.map(function (node) {
        return String(node);
    }).join("");
};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = DOMText;

function DOMText(value, owner) {
    if (!(this instanceof DOMText)) {
        return new DOMText(value);
    }

    this.data = value || "";
    this.length = this.data.length;
    this.ownerDocument = owner || null;
}

DOMText.prototype.type = "DOMTextNode";
DOMText.prototype.nodeType = 3;
DOMText.prototype.nodeName = "#text";

DOMText.prototype.toString = function _Text_toString() {
    return this.data;
};

DOMText.prototype.replaceData = function replaceData(index, length, value) {
    var current = this.data;
    var left = current.substring(0, index);
    var right = current.substring(index + length, current.length);
    this.data = left + value + right;
    this.length = this.data.length;
};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = Event;

function Event(family) {}

Event.prototype.initEvent = function _Event_initEvent(type, bubbles, cancelable) {
    this.type = type;
    this.bubbles = bubbles;
    this.cancelable = cancelable;
};

Event.prototype.preventDefault = function _Event_preventDefault() {};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Document = __webpack_require__(34);

module.exports = new Document();

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

module.exports = serializeNode;

var voidElements = ["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"];

function serializeNode(node) {
    switch (node.nodeType) {
        case 3:
            return escapeText(node.data);
        case 8:
            return "<!--" + node.data + "-->";
        default:
            return serializeElement(node);
    }
}

function serializeElement(elem) {
    var strings = [];

    var tagname = elem.tagName;

    if (elem.namespaceURI === "http://www.w3.org/1999/xhtml") {
        tagname = tagname.toLowerCase();
    }

    strings.push("<" + tagname + properties(elem) + datasetify(elem));

    if (voidElements.indexOf(tagname) > -1) {
        strings.push(" />");
    } else {
        strings.push(">");

        if (elem.childNodes.length) {
            strings.push.apply(strings, elem.childNodes.map(serializeNode));
        } else if (elem.textContent || elem.innerText) {
            strings.push(escapeText(elem.textContent || elem.innerText));
        } else if (elem.innerHTML) {
            strings.push(elem.innerHTML);
        }

        strings.push("</" + tagname + ">");
    }

    return strings.join("");
}

function isProperty(elem, key) {
    var type = _typeof(elem[key]);

    if (key === "style" && (type === "object" && Object.keys(elem.style).length > 0 || type === "string" && elem.style)) {
        return true;
    }

    return elem.hasOwnProperty(key) && (type === "string" || type === "boolean" && elem[key] || type === "number") && key !== "nodeName" && key !== "className" && key !== "tagName" && key !== "textContent" && key !== "innerText" && key !== "namespaceURI" && key !== "innerHTML";
}

function stylify(styles) {
    if (typeof styles === 'string') return styles;
    var attr = "";
    Object.keys(styles).forEach(function (key) {
        var value = styles[key];
        key = key.replace(/[A-Z]/g, function (c) {
            return "-" + c.toLowerCase();
        });
        attr += key + ":" + value + ";";
    });
    return attr;
}

function datasetify(elem) {
    var ds = elem.dataset;
    var props = [];

    for (var key in ds) {
        props.push({ name: "data-" + key, value: ds[key] });
    }

    return props.length ? stringify(props) : "";
}

function stringify(list) {
    var attributes = [];
    list.forEach(function (tuple) {
        var name = tuple.name;
        var value = tuple.value;

        if (name === "style") {
            value = stylify(value);
        }

        attributes.push(name + "=" + "\"" + escapeAttributeValue(value) + "\"");
    });

    return attributes.length ? " " + attributes.join(" ") : "";
}

function properties(elem) {
    var props = [];
    for (var key in elem) {
        if (isProperty(elem, key)) {
            props.push({ name: key, value: elem[key] });
        }
    }

    for (var ns in elem._attributes) {
        for (var attribute in elem._attributes[ns]) {
            var prop = elem._attributes[ns][attribute];
            var name = (prop.prefix ? prop.prefix + ":" : "") + attribute;
            props.push({ name: name, value: prop.value });
        }
    }

    if (elem.className) {
        props.push({ name: "class", value: elem.className });
    }

    return props.length ? stringify(props) : "";
}

function escapeText(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttributeValue(str) {
    return escapeText(str).replace(/"/g, "&quot;");
}

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var _store = __webpack_require__(24);

var _inferno = __webpack_require__(23);

var _mounting = __webpack_require__(6);

var _index = __webpack_require__(25);

var _vdom = __webpack_require__(10);

var store = new _store.Store();
// store.add(2);
store.runLots();
process.env.NODE_ENV = 'production';

function createRows() {
    var rows = [];
    var data = store.data;
    var selected = store.selected;

    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        var id = d.id;

        rows.push((0, _inferno.createVNode)(66, 'tr', id === selected ? 'danger' : '', [(0, _inferno.createVNode)(2, 'td', 'col-md-1', id + ''), (0, _inferno.createVNode)(2, 'td', 'col-md-4', (0, _inferno.createVNode)(2, 'a', null, d.label)), (0, _inferno.createVNode)(2, 'td', 'col-md-1', (0, _inferno.createVNode)(2, 'a', null, (0, _inferno.createVNode)(2, 'span', 'glyphicon glyphicon-remove', null, {
            'aria-hidden': 'true'
        }))), (0, _inferno.createVNode)(66, 'td', 'col-md-6')]));
    }
    return (0, _inferno.createVNode)(2, 'tbody', null, rows);
}

// function createRowsByMiss() {
// var rows = [];
// var data = store.data;
// var selected = store.selected;

// for (var i = 0; i < data.length; i++) {
// var d = data[i];
// var id = d.id;

// rows.push(
// h('tr', {className: id === selected ? 'danger' : ''}, [
// h('td', {className: 'col-md-1'}, id + ''), 
// h('td', {className: 'col-md-4'}, 
// h('a', null, d.label)
// ), 
// h('td', {className: 'col-md-1'}, 
// h('a', null,  
// h('span', { 
// className: 'glyphicon glyphicon-remove',
// 'aria-hidden': 'true'
// })
// )
// ),
// h('td', {className: 'col-md-6'})
// ])
// );
// }
// return h('tbody', null, rows);
// }

function createRowsByMiss() {
    var rows = [];
    var data = store.data;
    var selected = store.selected;

    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        var id = d.id;

        rows.push((0, _index.h)('tr', null, [(0, _index.h)('td', null, id + '', 'col-md-1'), (0, _index.h)('td', null, (0, _index.h)('a', null, d.label), 'col-md-4'), (0, _index.h)('td', null, (0, _index.h)('a', null, (0, _index.h)('span', {
            'aria-hidden': 'true'
        }, null, 'glyphicon glyphicon-remove')), 'col-md-1'), (0, _index.h)('td', null, null, 'col-md-6')], id === selected ? 'danger' : ''));
    }
    return (0, _index.h)('tbody', null, rows);
}

window.run = function () {
    console.time('a');
    var vNodes = createRows();
    (0, _mounting.mount)(vNodes, document.createElement('div'));
    console.timeEnd('a');
};

window.runMiss = function () {
    console.time('b');
    var vNodes1 = createRowsByMiss();
    (0, _vdom.createElement)(vNodes1, document.createElement('div'));
    console.timeEnd('b');
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(1)))

/***/ })
/******/ ]);