'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var minDocument = _interopDefault(require('min-document'));

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var toString = Object.prototype.toString;

var doc = typeof document === 'undefined' ? minDocument : document;

var isArray = Array.isArray || function (arr) {
    return toString.call(arr) === '[object Array]';
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

function isComponentInstance(o) {
    return o && typeof o.init === 'function';
}

function isEventProp(propName) {
    return propName.substr(0, 3) === 'ev-';
}

var indexOf = function () {
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
var createObject = function () {
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

var SimpleMap = typeof Map === 'function' ? Map : function () {
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
        this._values[index] = value;
        return this;
    };
    SimpleMap.prototype.get = function (key) {
        var index = indexOf(this._keys, key);
        if (!~index) return;
        return this._values[index];
    };
    SimpleMap.prototype['delete'] = function (key) {
        var index = indexOf(this._keys, key);
        if (!~index) return false;
        this._keys.splice(index, 1);
        this._values.splice(index, 1);
        this.size--;
        return true;
    };

    return SimpleMap;
}();

var skipProps = {
    key: true,
    ref: true,
    children: true,
    className: true
};

var booleanProps = {
    muted: true,
    scoped: true,
    loop: true,
    open: true,
    checked: true,
    'default': true,
    capture: true,
    disabled: true,
    readOnly: true,
    required: true,
    autoplay: true,
    controls: true,
    seamless: true,
    reversed: true,
    allowfullscreen: true,
    novalidate: true,
    hidden: true,
    autoFocus: true,
    selected: true
};

var strictProps = {
    volume: true,
    defaultChecked: true
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

var browser = {};
if (typeof navigator !== 'undefined') {
    var ua = navigator.userAgent;
    var index = ua.indexOf('MSIE ');
    if (~index) {
        browser.isIE = true;
        var version = parseInt(ua.substring(index + 5, ua.indexOf('.', index)), 10);
        browser.version = version;
        browser.isIE8 = version === 8;
    }
}

var setTextContent = browser.isIE8 ? function (dom, text) {
    dom.innerText = text;
} : function (dom, text) {
    dom.textContent = text;
};

var Types = {
    Text: 1,
    HtmlElement: 2,

    ComponentClass: 4,
    ComponentFunction: 8,
    ComponentInstance: 16,

    HtmlComment: 32
};
Types.Element = Types.HtmlElement;
Types.ComponentClassOrInstance = Types.ComponentClass | Types.ComponentInstance;
Types.TextElement = Types.Text | Types.HtmlComment;

var EMPTY_OBJ = {};
if (process.env.NODE_ENV !== 'production' && !browser.isIE) {
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

    return new VNode(type, tag, props, normalizeChildren(children), className || props.className, key || props.key, ref || props.ref);
}

function createCommentVNode(children) {
    return new VNode(Types.HtmlComment, null, EMPTY_OBJ, children);
}

function createTextVNode(text) {
    return new VNode(Types.Text, null, EMPTY_OBJ, text);
}



function createComponentInstanceVNode(instance) {
    var props = instance.props || EMPTY_OBJ;
    return new VNode(Types.ComponentInstance, instance.constructor, props, instance, null, props.key, props.ref);
}

function normalizeChildren(vNodes) {
    if (isArray(vNodes)) {
        var childNodes = addChild(vNodes, { index: 0 });
        return childNodes.length ? childNodes : null;
    } else if (isComponentInstance(vNodes)) {
        return createComponentInstanceVNode(vNodes);
    }
    return vNodes;
}

function applyKey(vNode, reference) {
    if (isNullOrUndefined(vNode.key)) {
        vNode.key = '.$' + reference.index++;
    }
    return vNode;
}

function addChild(vNodes, reference) {
    var newVNodes = void 0;
    for (var i = 0; i < vNodes.length; i++) {
        var n = vNodes[i];
        if (isNullOrUndefined(n)) {
            if (!newVNodes) {
                newVNodes = vNodes.slice(0, i);
            }
        } else if (isArray(n)) {
            if (!newVNodes) {
                newVNodes = vNodes.slice(0, i);
            }
            newVNodes = newVNodes.concat(addChild(n, reference));
        } else if (isStringOrNumber(n)) {
            if (!newVNodes) {
                newVNodes = vNodes.slice(0, i);
            }
            newVNodes.push(applyKey(createTextVNode(n), reference));
        } else if (isComponentInstance(n)) {
            if (!newVNodes) {
                newVNodes = vNodes.slice(0, i);
            }
            newVNodes.push(applyKey(createComponentInstanceVNode(n)), reference);
        } else if (n.type) {
            if (!newVNodes) {
                newVNodes = vNodes.slice(0, i);
            }
            newVNodes.push(applyKey(n, reference));
        }
    }
    return newVNodes || vNodes;
}

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

    if (!e.target) {
        this.target = e.srcElement;
    }

    this._rawEvent = e;
}
Event.prototype.preventDefault = function () {
    var e = this._rawEvent;
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
};
Event.prototype.stopPropagation = function () {
    var e = this._rawEvent;
    e.cancelBubble = true;
    e.stopImmediatePropagation && e.stopImmediatePropagation();
};

function MouseEvent(e) {
    Event.call(this, e);
    for (var j = 0; j < MOUSE_PROPS.length; j++) {
        var mousePropKey = MOUSE_PROPS[j];
        this[mousePropKey] = e[mousePropKey];
    }
}
MouseEvent.prototype = createObject(Event.prototype);
MouseEvent.prototype.constructor = MouseEvent;

function KeyEvent(e) {
    Event.call(this, e);
    for (var j = 0; j < KEY_PROPS.length; j++) {
        var keyPropKey = KEY_PROPS[j];
        this[keyPropKey] = e[keyPropKey];
    }
}
KeyEvent.prototype = createObject(Event.prototype);
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

var addEventListener = void 0;
var removeEventListener = void 0;
if ('addEventListener' in doc) {
    addEventListener = function addEventListener(name, fn) {
        doc.addEventListener(name, fn, false);
    };

    removeEventListener = function removeEventListener(name, fn) {
        doc.removeEventListener(name, fn);
    };
} else {
    addEventListener = function addEventListener(name, fn) {
        doc.attachEvent("on" + name, fn);
    };

    removeEventListener = function removeEventListener(name, fn) {
        doc.detachEvent("on" + name, fn);
    };
}

var delegatedEvents = {};

function handleEvent(name, lastEvent, nextEvent, dom) {
    var delegatedRoots = delegatedEvents[name];

    if (nextEvent) {
        if (!delegatedRoots) {
            delegatedRoots = { items: new SimpleMap(), docEvent: null };
            delegatedRoots.docEvent = attachEventToDocument(name, delegatedRoots);
            delegatedEvents[name] = delegatedRoots;
        }
        delegatedRoots.items.set(dom, nextEvent);
    } else if (delegatedRoots) {
        var items = delegatedRoots.items;
        if (items["delete"](dom)) {
            if (items.size === 0) {
                removeEventListener(name, delegatedRoots.docEvent);
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
        if (isNullOrUndefined(parentDom) || isClick && parentDom.nodeType === 1 && parentDom.disabled) {
            return;
        }
        dispatchEvent(event, parentDom, items, count, isClick);
    }
}

function attachEventToDocument(name, delegatedRoots) {
    var docEvent = function docEvent(event) {
        var count = delegatedRoots.items.size;
        event || (event = window.event);
        if (count > 0) {
            event = proxyEvent(event);
            dispatchEvent(event, event.target, delegatedRoots.items, count, event.type === 'click');
        }
    };
    addEventListener(name, docEvent);
    return docEvent;
}

function render(vNode, parentDom) {
    if (isNullOrUndefined(vNode)) return;
    var mountedQueue = new MountedQueue();
    var dom = createElement(vNode, parentDom, mountedQueue);
    mountedQueue.trigger();
    return dom;
}

function createElement(vNode, parentDom, mountedQueue) {
    var type = vNode.type;
    if (type & Types.HtmlElement) {
        return createHtmlElement(vNode, parentDom, mountedQueue);
    } else if (type & Types.Text) {
        return createTextElement(vNode, parentDom);
    } else if (type & Types.ComponentClassOrInstance) {
        return createComponentClassOrInstance(vNode, parentDom, mountedQueue);
    } else if (type & Types.ComponentFunction) {
        return createComponentFunction(vNode, parentDom, mountedQueue);
        // } else if (type & Types.ComponentInstance) {
        // return createComponentInstance(vNode, parentDom, mountedQueue);
    } else if (type & Types.HtmlComment) {
        return createCommentElement(vNode, parentDom);
    } else {
        throw new Error('unknown vnode type ' + type);
    }
}

function createHtmlElement(vNode, parentDom, mountedQueue) {
    var dom = doc.createElement(vNode.tag);
    var children = vNode.children;
    var ref = vNode.ref;
    var props = vNode.props;
    var className = vNode.className;

    vNode.dom = dom;

    if (!isNullOrUndefined(children)) {
        createElements(children, dom, mountedQueue);
    }

    if (!isNullOrUndefined(className)) {
        dom.className = className;
    }

    if (props !== EMPTY_OBJ) {
        for (var prop in props) {
            patchProp(prop, null, props[prop], dom);
        }
    }

    if (!isNullOrUndefined(ref)) {
        createRef(dom, ref, mountedQueue);
    }

    if (parentDom) {
        parentDom.appendChild(dom);
    }

    return dom;
}

function createTextElement(vNode, parentDom) {
    var dom = doc.createTextNode(vNode.children);
    vNode.dom = dom;

    if (parentDom) {
        parentDom.appendChild(dom);
    }

    return dom;
}

function createComponentClassOrInstance(vNode, parentDom, mountedQueue, lastVNode) {
    var props = vNode.props;
    var instance = vNode.type & Types.ComponentClass ? new vNode.tag(props) : vNode.children;
    var dom = instance.init(lastVNode, vNode);
    var ref = vNode.ref;

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

// export function createComponentInstance(vNode, parentDom, mountedQueue, lastVNode) {
// const props = vNode.props;
// const instance = vNode.children;
// const dom = instance.init(lastVNode, vNode);
// const ref = vNode.ref;

// vNode.dom = dom;

// if (parentDom) {
// parentDom.appendChild(dom);
// }

// if (typeof instance.mount === 'function') {
// mountedQueue.push(() => instance.mount(lastVNode, vNode));
// }

// if (typeof ref === 'function') {
// ref(instance);
// }

// return dom;
// }

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
    var dom = doc.createComment(vNode.children);
    vNode.dom = dom;

    if (parentDom) {
        parentDom.appendChild(dom);
    }

    return dom;
}

function createComponentFunctionVNode(vNode) {
    var result = vNode.tag(vNode.props);
    if (isArray(result)) {
        throw new Error('ComponentFunction ' + vNode.tag.name + ' returned a invalid vNode');
    } else if (isStringOrNumber(result)) {
        result = createTextVNode(result);
    }

    vNode.children = result;

    return vNode;
}

function createElements(vNodes, parentDom, mountedQueue) {
    if (isStringOrNumber(vNodes)) {
        setTextContent(parentDom, vNodes);
    } else if (isArray(vNodes)) {
        for (var i = 0; i < vNodes.length; i++) {
            createElement(vNodes[i], parentDom, mountedQueue);
        }
    } else {
        createElement(vNodes, parentDom, mountedQueue);
    }
}

function removeElements(vNodes, parentDom) {
    if (isNullOrUndefined(vNodes)) {
        return;
    } else if (isArray(vNodes)) {
        for (var i = 0; i < vNodes.length; i++) {
            removeElement(vNodes[i], parentDom);
        }
    } else {
        removeElement(vNodes, parentDom);
    }
}

function removeElement(vNode, parentDom) {
    var type = vNode.type;
    if (type & Types.Element) {
        return removeHtmlElement(vNode, parentDom);
    } else if (type & Types.TextElement) {
        return removeText(vNode, parentDom);
    } else if (type & Types.ComponentClassOrInstance) {
        return removeComponentClassOrInstance(vNode, parentDom);
    } else if (type & Types.ComponentFunction) {
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
        if (!isNullOrUndefined(prop) && isEventProp(name)) {
            handleEvent(name.substr(0, 3), prop, null, dom);
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

function removeComponentClassOrInstance(vNode, parentDom, nextVNode) {
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
    setTextContent(dom, '');
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

function patch(lastVNode, nextVNode, parentDom) {
    var mountedQueue = new MountedQueue();
    var dom = patchVNode(lastVNode, nextVNode, parentDom, mountedQueue);
    mountedQueue.trigger();
    return dom;
}

function patchVNode(lastVNode, nextVNode, parentDom, mountedQueue) {
    if (lastVNode !== nextVNode) {
        var nextType = nextVNode.type;
        var lastType = lastVNode.type;

        if (nextType & Types.Element) {
            if (lastType & Types.Element) {
                patchElement(lastVNode, nextVNode, parentDom, mountedQueue);
            } else {
                replaceElement(lastVNode, nextVNode, parentDom, mountedQueue);
            }
        } else if (nextType & Types.TextElement) {
            if (lastType & Types.TextElement) {
                patchText(lastVNode, nextVNode);
            } else {
                replaceElement(lastVNode, nextVNode, parentDom, mountedQueue);
            }
        } else if (nextType & Types.ComponentClass) {
            if (lastType & Types.ComponentClass) {
                patchComponentClass(lastVNode, nextVNode, parentDom, mountedQueue);
            } else {
                replaceElement(lastVNode, nextVNode, parentDom, mountedQueue);
            }
        } else if (nextType & Types.ComponentFunction) {
            if (lastType & Types.ComponentFunction) {
                patchComponentFunction(lastVNode, nextVNode, parentDom, mountedQueue);
            } else {
                replaceElement(lastVNode, nextVNode, parentDom, mountedQueue);
            }
        } else if (nextType & Types.ComponentInstance) {
            if (lastType & Types.ComponentInstance) {
                patchComponentIntance(lastVNode, nextVNode, parentDom, mountedQueue);
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
    var lastClassName = lastVNode.className;
    var nextClassName = nextVNode.className;

    nextVNode.dom = dom;

    if (lastVNode.tag !== nextVNode.tag) {
        replaceElement(lastVNode, nextVNode, parentDom, mountedQueue);
    } else {
        if (lastChildren !== nextChildren) {
            patchChildren(lastChildren, nextChildren, dom, mountedQueue);
        }

        if (lastProps !== nextProps) {
            patchProps(lastVNode, nextVNode);
        }

        if (lastClassName !== nextClassName) {
            if (isNullOrUndefined(nextClassName)) {
                dom.removeAttribute('class');
            } else {
                dom.className = nextClassName;
            }
        }

        if (!isNullOrUndefined(nextRef) && lastVNode.ref !== nextRef) {
            createRef(dom, nextRef, mountedQueue);
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
        removeComponentClassOrInstance(lastVNode, null, nextVNode);
        newDom = createComponentClassOrInstance(nextVNode, null, mountedQueue, lastVNode);
    } else {
        instance = lastVNode.children;
        newDom = instance.update(lastVNode, nextVNode);
        nextVNode.dom = newDom;
        nextVNode.children = instance;
    }

    if (dom !== newDom) {
        replaceChild(parentDom, newDom, dom);
    }
}

function patchComponentIntance(lastVNode, nextVNode, parentDom, mountedQueue) {
    var lastInstance = lastVNode.children;
    var nextInstance = nextVNode.children;
    var dom = lastVNode.dom;

    var newDom = void 0;

    if (lastInstance !== nextInstance) {
        removeComponentClassOrInstance(lastVNode, null, nextVNode);
        newDom = createComponentClassOrInstance(nextVNode, null, mountedQueue, lastVNode);
    } else {
        newDom = lastInstance.update(lastVNode, nextVNode);
        nextVNode.dom = newDom;
    }

    if (dom !== newDom) {
        replaceChild(parentDom, newDom, dom);
    }
}

function patchComponentFunction(lastVNode, nextVNode, parentDom, mountedQueue) {
    var lastTag = lastVNode.tag;
    var nextTag = nextVNode.tag;

    if (lastVNode.key !== nextVNode.key) {
        removeElement(lastVNode.children, parentDom);
        createComponentFunction(nextVNode, parentDom, mountedQueue);
    } else {
        nextVNode.dom = lastVNode.dom;
        createComponentFunctionVNode(nextVNode);
        patchVNode(lastVNode.children, nextVNode.children, parentDom, mountedQueue);
    }
}

function patchChildren(lastChildren, nextChildren, parentDom, mountedQueue) {
    if (isNullOrUndefined(lastChildren)) {
        if (!isNullOrUndefined(nextChildren)) {
            createElements(nextChildren, parentDom, mountedQueue);
        }
    } else if (isNullOrUndefined(nextChildren)) {
        removeElements(lastChildren, parentDom);
    } else if (isStringOrNumber(nextChildren)) {
        if (isStringOrNumber(lastChildren)) {
            parentDom.firstChild.nodeValue = nextChildren;
        } else {
            removeElements(lastChildren, parentDom);
            setTextContent(parentDom, nextChildren);
        }
    } else if (isArray(lastChildren)) {
        if (isArray(nextChildren)) {
            patchChildrenByKey(lastChildren, nextChildren, parentDom, mountedQueue);
        } else {
            removeElements(lastChildren, parentDom);
            createElement(nextChildren, parentDom, mountedQueue);
        }
    } else if (isArray(nextChildren)) {
        removeElement(lastChildren, parentDom);
        createElements(nextChildren, parentDom, mountedQueue);
    } else if (isStringOrNumber(lastChildren)) {
        setTextContent(parentDom, '');
        createElement(nextChildren, parentDom);
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
            insertOrAppend(bEnd, bLength, createElement(b[bStart], null, mountedQueue), b, dom);
            ++bStart;
        }
    } else if (bStart > bEnd) {
        while (aStart <= aEnd) {
            removeElement(a[aStart], dom);
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
            removeAllChildren(dom, a);
            while (bStart < bLength) {
                createElement(b[bStart], dom, mountedQueue);
                ++bStart;
            }
        } else {
            // some browsers, e.g. ie, must insert before remove for some element,
            // e.g. select/option, otherwise the selected property will be weird
            if (moved) {
                var seq = lisAlgorithm(sources);
                j = seq.length - 1;
                for (i = bLength - 1; i >= 0; i--) {
                    if (sources[i] === -1) {
                        pos = i + bStart;
                        insertOrAppend(pos, b.length, createElement(b[pos], null, mountedQueue), b, dom);
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
                        insertOrAppend(pos, b.length, createElement(b[pos], null, mountedQueue), b, dom);
                    }
                }
            }
            i = aLength - patched;
            while (i > 0) {
                aNode = a[aStart++];
                if (aNode !== null) {
                    removeElement(aNode, dom);
                    --i;
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
    removeElement(lastVNode, null);
    createElement(nextVNode, null, mountedQueue);
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
    if (nextProps !== EMPTY_OBJ) {
        for (prop in nextProps) {
            patchProp(prop, lastProps[prop], nextProps[prop], dom);
        }
    }
    if (lastProps !== EMPTY_OBJ) {
        for (prop in lastProps) {
            if (!(prop in nextProps)) {
                removeProp(prop, lastProps[prop], dom);
            }
        }
    }
}

function patchProp(prop, lastValue, nextValue, dom) {
    if (lastValue !== nextValue) {
        if (skipProps[prop]) {
            return;
        } else if (booleanProps[prop]) {
            dom[prop] = !!nextValue;
        } else if (strictProps[prop]) {
            var value = isNullOrUndefined(nextValue) ? '' : nextValue;
            if (dom[prop] !== value) {
                dom[prop] = value;
            }
        } else if (isNullOrUndefined(nextValue)) {
            removeProp(prop, lastValue, dom);
        } else if (isEventProp(prop)) {
            handleEvent(prop.substr(3), lastValue, nextValue, dom);
        } else if (isObject(nextValue)) {
            patchPropByObject(prop, lastValue, nextValue, dom);
        } else if (prop === 'innerHTML') {
            dom.innerHTML = nextValue;
        } else {
            dom.setAttribute(prop, nextValue);
        }
    }
}

function removeProp(prop, lastValue, dom) {
    if (!isNullOrUndefined(lastValue)) {
        switch (prop) {
            case 'value':
                dom.value = '';
                return;
            case 'style':
                dom.removeAttribute('style');
                return;
            case 'attributes':
                for (var key in lastValue) {
                    dom.removeAttribute(key);
                }
                return;
            case 'dataset':
                removeDataset(lastValue, dom);
                return;
            default:
                break;
        }

        if (booleanProps[prop]) {
            dom[prop] = false;
        } else if (isEventProp(prop)) {
            handleEvent(prop.substr(3), lastValue, null, dom);
        } else if (isObject(lastValue)) {
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

var removeDataset = browser.isIE ? function (lastValue, dom) {
    for (var key in lastValue) {
        dom.removeAttribute('data-' + kebabCase(key));
    }
} : function (lastValue, dom) {
    var domProp = dom.dataset;
    for (var key in lastValue) {
        delete domProp[key];
    }
};

function patchPropByObject(prop, lastValue, nextValue, dom) {
    if (lastValue && !isObject(lastValue) && !isNullOrUndefined(lastValue)) {
        removeProp(prop, lastValue, dom);
        lastValue = null;
    }
    switch (prop) {
        case 'attributes':
            return patchAttributes(lastValue, nextValue, dom);
        case 'style':
            return patchStyle(lastValue, nextValue, dom);
        case 'dataset':
            return patchDataset(prop, lastValue, nextValue, dom);
        default:
            return patchObject(prop, lastValue, nextValue, dom);
    }
}

var patchDataset = browser.isIE ? function patchDataset(prop, lastValue, nextValue, dom) {
    var hasRemoved = {};
    var key = void 0;
    var value = void 0;

    for (key in nextValue) {
        var dataKey = 'data-' + kebabCase(key);
        value = nextValue[key];
        if (isNullOrUndefined(value)) {
            dom.removeAttribute(dataKey);
            hasRemoved[key] = true;
        } else {
            dom.setAttribute(dataKey, value);
        }
    }

    if (!isNullOrUndefined(lastValue)) {
        for (key in lastValue) {
            if (isNullOrUndefined(nextValue[key]) && !hasRemoved[key]) {
                dom.removeAttribute('data-' + kebabCase(key));
            }
        }
    }
} : patchObject;

var _cache = {};
function kebabCase(word) {
    if (!_cache[word]) {
        _cache[word] = word.replace(/[A-Z]/g, function (item) {
            return '-' + item.toLowerCase();
        });
    }
    return _cache[word];
}

function patchObject(prop, lastValue, nextValue, dom) {
    var domProps = dom[prop];
    if (isNullOrUndefined(domProps)) {
        domProps = dom[prop] = {};
    }
    var key = void 0;
    var value = void 0;
    for (key in nextValue) {
        domProps[key] = nextValue[key];
    }
    if (!isNullOrUndefined(lastValue)) {
        for (key in lastValue) {
            if (isNullOrUndefined(nextValue[key])) {
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
        if (isNullOrUndefined(value)) {
            dom.removeAttribute(key);
            hasRemoved[key] = true;
        } else {
            dom.setAttribute(key, value);
        }
    }
    if (!isNullOrUndefined(lastValue)) {
        for (key in lastValue) {
            if (isNullOrUndefined(nextValue[key]) && !hasRemoved[key]) {
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
        if (isNullOrUndefined(value)) {
            domStyle[key] = '';
            hasRemoved[key] = true;
        } else {
            domStyle[key] = value;
        }
    }
    if (!isNullOrUndefined(lastValue)) {
        for (key in lastValue) {
            if (isNullOrUndefined(nextValue[key]) && !hasRemoved[key]) {
                domStyle[key] = '';
            }
        }
    }
}

exports.h = createVNode;
exports.patch = patch;
exports.render = render;
exports.hc = createCommentVNode;
exports.remove = removeElement;
