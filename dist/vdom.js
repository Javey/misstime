'use strict';

exports.__esModule = true;
exports.render = render;
exports.createElement = createElement;
exports.createHtmlElement = createHtmlElement;
exports.createTextElement = createTextElement;
exports.createComponentClassOrInstance = createComponentClassOrInstance;
exports.createComponentFunction = createComponentFunction;
exports.createCommentElement = createCommentElement;
exports.createComponentFunctionVNode = createComponentFunctionVNode;
exports.createElements = createElements;
exports.removeElements = removeElements;
exports.removeElement = removeElement;
exports.removeHtmlElement = removeHtmlElement;
exports.removeText = removeText;
exports.removeComponentFunction = removeComponentFunction;
exports.removeComponentClassOrInstance = removeComponentClassOrInstance;
exports.removeAllChildren = removeAllChildren;
exports.replaceChild = replaceChild;
exports.createRef = createRef;

var _vnode = require('./vnode');

var _vpatch = require('./vpatch');

var _event = require('./event');

var _utils = require('./utils');

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
    } else if (type & _vnode.Types.ComponentClassOrInstance) {
        return createComponentClassOrInstance(vNode, parentDom, mountedQueue);
    } else if (type & _vnode.Types.ComponentFunction) {
        return createComponentFunction(vNode, parentDom, mountedQueue);
        // } else if (type & Types.ComponentInstance) {
        // return createComponentInstance(vNode, parentDom, mountedQueue);
    } else if (type & _vnode.Types.HtmlComment) {
        return createCommentElement(vNode, parentDom);
    } else {
        throw new Error('unknown vnode type ' + type);
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

function createComponentClassOrInstance(vNode, parentDom, mountedQueue, lastVNode) {
    var props = vNode.props;
    var instance = vNode.type & _vnode.Types.ComponentClass ? new vNode.tag(props) : vNode.children;
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
        (0, _utils.setTextContent)(parentDom, vNodes);
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
    } else if (type & _vnode.Types.ComponentClassOrInstance) {
        return removeComponentClassOrInstance(vNode, parentDom);
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
    (0, _utils.setTextContent)(dom, '');
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