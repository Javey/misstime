'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var toString = Object.prototype.toString;

var isArray = Array.isArray || function (arr) {
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

var skipProps = {
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

var Types = {
    Text: 1,
    HtmlElement: 2,

    ComponentClass: 4,
    ComponentFunction: 8
};
Types.Element = Types.HtmlElement;
Types.Component = Types.ComponentClass | Types.ComponentFunction;

var EMPTY_OBJ = {};
if (process.env.NODE_ENV !== 'production') {
    Object.freeze(EMPTY_OBJ);
}

function VNode(type, tag, props, children) {
    this.type = type;
    this.tag = tag;
    this.props = props;
    this.children = children;
    this.key = props.key;
    this.ref = props.ref;
}

function createVNode(tag, props, children) {
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

    return new VNode(type, tag, props, normalizeChildren(children));
}

function createTextVNode(text) {
    return new VNode(Types.Text, null, EMPTY_OBJ, text);
}



function normalizeChildren(vNodes) {
    if (isNullOrUndefined(vNodes)) return vNodes;
    var childNodes = [];
    addChild(vNodes, childNodes, 0);
    return childNodes;
}

function addChild(vNodes, children, index) {
    var hasKeyed = true;
    if (isNullOrUndefined(vNodes)) {
        vNodes = createTextVNode('');
    } else if (isArray(vNodes)) {
        for (var i = 0; i < vNodes.length; i++) {
            if (addChild(vNodes[i], children, index + i)) {
                --index;
            }
        }
        return;
    } else if (isStringOrNumber(vNodes)) {
        vNodes = createTextVNode(vNodes);
    } else if (!vNodes.type) {
        throw new Error('expect a vNode, but got ' + vNodes);
    }
    if (isNullOrUndefined(vNodes.key)) {
        vNodes.key = '.$' + index;
        hasKeyed = false;
    }
    children.push(vNodes);
    return hasKeyed;
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
    switch (type) {
        case Types.HtmlElement:
            return createHtmlElement(vNode, parentDom, mountedQueue);
        case Types.Text:
            return createTextElement(vNode, parentDom);
        case Types.ComponentClass:
            return createComponentClass(vNode, parentDom, mountedQueue);
        case Types.ComponentFunction:
            return createComponentFunction(vNode, parentDom, mountedQueue);
        default:
            throw new Error('unknown vnode type');
    }
}

function createHtmlElement(vNode, parentDom, mountedQueue) {
    var dom = document.createElement(vNode.tag);
    var children = vNode.children;
    var ref = vNode.ref;

    vNode.dom = dom;

    createElements(children, dom, mountedQueue);

    patchProps(null, vNode);

    if (!isNullOrUndefined(ref)) {
        createRef(dom, ref, mountedQueue);
    }

    if (parentDom) {
        parentDom.appendChild(dom);
    }

    return dom;
}

function createTextElement(vNode, parentDom) {
    var dom = document.createTextNode(vNode.children);
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
    if (isNullOrUndefined(vNodes)) return;
    for (var i = 0; i < vNodes.length; i++) {
        createElement(vNodes[i], parentDom, mountedQueue);
    }
}

function removeElements(vNodes, parentDom) {
    if (isNullOrUndefined(vNodes)) return;
    for (var i = 0; i < vNodes.length; i++) {
        removeElement(vNodes[i], parentDom);
    }
}

function removeElement(vNode, parentDom) {
    switch (vNode.type) {
        case Types.Element:
            return removeHtmlElement(vNode, parentDom);
        case Types.Text:
            return removeText(vNode, parentDom);
        case Types.ComponentFunction:
            return removeComponentFunction(vNode, parentDom);
        case Types.ComponentClass:
            return removeComponentClass(vNode, parentDom);
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

var delegatedEvents = {};

function handleEvent$1(name, lastEvent, nextEvent, dom) {
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
        if (items.delete(dom)) {
            if (items.size === 0) {
                document.removeEventListener(name, delegatedRoots.docEvent);
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
        if (count > 0) {
            dispatchEvent(proxyEvent(event), event.target, delegatedRoots.items, count, event.type === 'click');
        }
    };
    document.addEventListener(name, docEvent);
    return docEvent;
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
        } else if (nextType & Types.Text) {
            if (lastType & Types.Text) {
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
        newDom = createComponentClass(nextVNode, null, mountedQueue, lastVNode);
        removeComponentClass(lastVNode, null, nextVNode);
    } else {
        instance = lastVNode.children;
        newDom = instance.update(lastVNode, nextVNode);
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
        createElements(nextChildren, parentDom, mountedQueue);
    } else if (isNullOrUndefined(nextChildren)) {
        removeElements(lastChildren, parentDom);
    } else {
        patchChildrenByKey(lastChildren, nextChildren, parentDom, mountedQueue);
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
            i = aLength - patched;
            while (i > 0) {
                aNode = a[aStart++];
                if (aNode !== null) {
                    removeElement(aNode, dom);
                    --i;
                }
            }
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
    var lastProps = lastVNode && lastVNode.props || null;
    var nextProps = nextVNode.props;
    var dom = nextVNode.dom;
    var propName = void 0;
    for (propName in nextProps) {
        if (skipProps[propName]) continue;

        var propValue = nextProps[propName];
        if (isNullOrUndefined(propValue)) {
            removeProp(propName, dom, lastProps);
        } else if (isEventProp(propName)) {
            patchEvent(propName, propValue, dom, lastProps);
        } else if (isObject(propValue)) {
            patchPropByObject(propName, propValue, dom, lastProps);
        } else if (propName === 'style') {
            dom.style.cssText = propValue;
        } else {
            try {
                dom[propName] = propValue;
            } catch (e) {}
        }
    }
    if (!isNullOrUndefined(lastProps)) {
        for (propName in lastProps) {
            if (!(propName in nextProps)) {
                removeProp(propName, dom, lastProps);
            }
        }
    }
}

function removeProp(propName, dom, lastProps) {
    if (!isNullOrUndefined(lastProps)) {
        var lastValue = lastProps[propName];
        var domProp = dom[propName];
        if (propName === 'attributes') {
            for (var key in lastValue) {
                dom.removeAttribute(key);
            }
        } else if (propName === 'style') {
            dom.style.cssText = '';
        } else if (isEventProp(propName)) {
            handleEvent$1(propName.substr(3), lastValue, null, dom);
        } else if (typeof lastValue === 'string' || typeof domProp === 'string') {
            dom[propName] = '';
        } else if ((typeof lastValue === 'undefined' ? 'undefined' : _typeof(lastValue)) === 'object') {
            try {
                dom[propName] = undefined;
                delete dom[propName];
            } catch (e) {
                for (var _key in lastValue) {
                    delete domProp[_key];
                }
            }
        } else {
            delete dom[propName];
        }
    }
}

function patchPropByObject(propName, propValue, dom, lastProps) {
    var lastPropValue = void 0;
    if (lastProps) {
        lastPropValue = lastProps[propName];
        if (!isObject(lastPropValue) && !isNullOrUndefined(lastPropValue)) {
            removeProp(propName, dom, lastProps);
            lastPropValue = null;
        }
    }
    switch (propName) {
        case 'attributes':
            return patchAttributes(lastPropValue, propValue, dom);
        case 'style':
            return patchStyle(lastPropValue, propValue, dom);
        default:
            return patchObject(propName, lastPropValue, propValue, dom);
    }
}

function patchObject(propName, lastValue, nextValue, dom) {
    var domProps = dom[propName];
    if (isNullOrUndefined(domProps)) {
        domProps = dom[propName] = {};
    }
    var key = void 0;
    var value = void 0;
    for (key in nextValue) {
        domProps[key] = nextValue[key];
    }
    if (!isNullOrUndefined(lastValue)) {
        for (key in lastValue) {
            if (isNullOrUndefined(nextValue[key])) {
                // domProps[key] = undefined;
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

function patchEvent(propName, nextValue, dom, lastProps) {
    var lastValue = lastProps && lastProps[propName] || null;
    if (lastValue !== nextValue) {
        handleEvent$1(propName.substr(3), lastValue, nextValue, dom);
    }
}

exports.h = createVNode;
exports.patch = patch;
exports.render = render;
