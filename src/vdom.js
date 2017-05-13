import {Types, createTextVNode, EMPTY_OBJ} from './vnode';
import {patchProp} from './vpatch';
import {handleEvent} from './event';
import {
    MountedQueue, isArray, isStringOrNumber, 
    isNullOrUndefined, isEventProp, doc as document
} from './utils';

export function render(vNode, parentDom) {
    if (isNullOrUndefined(vNode)) return;
    const mountedQueue = new MountedQueue();
    const dom = createElement(vNode, parentDom, mountedQueue); 
    mountedQueue.trigger();
    return dom;
}

export function createElement(vNode, parentDom, mountedQueue) {
    const type = vNode.type;
    if (type & Types.HtmlElement) {
        return createHtmlElement(vNode, parentDom, mountedQueue);
    } else if (type & Types.Text) {
        return createTextElement(vNode, parentDom);
    } else if (type & Types.ComponentClass) {
        return createComponentClass(vNode, parentDom, mountedQueue);
    } else if (type & Types.ComponentFunction) {
        return createComponentFunction(vNode, parentDom, mountedQueue);
    } else if (type & Types.HtmlComment) {
        return createCommentElement(vNode, parentDom);
    } else {
        throw new Error('unknown vnode type');
    }
}

export function createHtmlElement(vNode, parentDom, mountedQueue) {
    const dom = document.createElement(vNode.tag);
    const children = vNode.children;
    const ref = vNode.ref;
    const props = vNode.props;
    const className = vNode.className;

    vNode.dom = dom;

    if (!isNullOrUndefined(children)) {
        createElements(children, dom, mountedQueue);
    }

    if (!isNullOrUndefined(className)) {
        dom.className = className;
    }

    if (props !== EMPTY_OBJ) {
        for (let prop in props) {
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

export function createTextElement(vNode, parentDom) {
    const dom = document.createTextNode(vNode.children); 
    vNode.dom = dom;

    if (parentDom) {
        parentDom.appendChild(dom);
    }

    return dom;
}

export function createComponentClass(vNode, parentDom, mountedQueue, lastVNode) {
    const props = vNode.props;
    const instance = new vNode.tag(props); 
    const dom = instance.init(lastVNode, vNode);
    const ref = props.ref;

    vNode.dom = dom;
    vNode.children = instance;
    
    if (parentDom) {
        parentDom.appendChild(dom);
    }

    if (typeof instance.mount === 'function') {
        mountedQueue.push(() => instance.mount(lastVNode, vNode));
    }

    if (typeof ref === 'function') {
        ref(instance);
    }

    return dom;
}

export function createComponentFunction(vNode, parentDom, mountedQueue) {
    const props = vNode.props;
    const ref = vNode.ref;

    createComponentFunctionVNode(vNode);

    const dom = createElement(vNode.children, null, mountedQueue);
    vNode.dom = dom;

    if (parentDom) {
        parentDom.appendChild(dom);
    }

    if (ref) {
        createRef(dom, ref, mountedQueue);
    }

    return dom;
}

export function createCommentElement(vNode, parentDom) {
    const dom = document.createComment(vNode.children); 
    vNode.dom = dom;

    if (parentDom) {
        parentDom.appendChild(dom);
    }

    return dom;
}

export function createComponentFunctionVNode(vNode) {
    let result = vNode.tag(vNode.props);
    if (isArray(result)) {
        throw new Error(`ComponentFunction ${vNode.tag.name} returned a invalid vNode`);
    } else if (isStringOrNumber(result)) {
        result = createTextVNode(result);
    }

    vNode.children = result;

    return vNode;
}

export function createElements(vNodes, parentDom, mountedQueue) {
    if (isStringOrNumber(vNodes)) {
        parentDom.textContent = vNodes;
    } else if (isArray(vNodes)) {
        for (let i = 0; i < vNodes.length; i++) {
            createElement(vNodes[i], parentDom, mountedQueue);
        }
    } else {
        createElement(vNodes, parentDom, mountedQueue);
    }
}

export function removeElements(vNodes, parentDom) {
    if (isNullOrUndefined(vNodes)) {
        return;
    } else if (isArray(vNodes)) {
        for (let i = 0; i < vNodes.length; i++) {
            removeElement(vNodes[i], parentDom);
        }
    } else {
        removeElement(vNodes, parentDom);
    }
}

export function removeElement(vNode, parentDom) {
    const type = vNode.type;
    if (type & Types.Element) {
        return removeHtmlElement(vNode, parentDom); 
    } else if (type & Types.TextElement) {
        return removeText(vNode, parentDom);
    } else if (type & Types.ComponentClass) {
        return removeComponentClass(vNode, parentDom);
    } else if (type & Types.ComponentFunction) {
        return removeComponentFunction(vNode, parentDom); 
    }
}

export function removeHtmlElement(vNode, parentDom) {
    const ref = vNode.ref;
    const props = vNode.props;
    const dom = vNode.dom;

    if (ref) {
        ref(null);
    }

    removeElements(vNode.children, null);

    // remove event
    for (let name in props) {
        const prop = props[name];
        if (!isNullOrUndefined(prop) && isEventProp(name)) {
            handleEvent(name.substr(0, 3), prop, null, dom);
        }
    }

    if (parentDom) {
        parentDom.removeChild(dom);
    }
}

export function removeText(vNode, parentDom) {
    if (parentDom) {
        parentDom.removeChild(vNode.dom);
    }
} 

export function removeComponentFunction(vNode, parentDom) {
    const ref = vNode.ref;
    if (ref) {
        ref(null);
    }
    removeElement(vNode.children, parentDom);
}

export function removeComponentClass(vNode, parentDom, nextVNode) {
    const instance = vNode.children;
    const ref = vNode.ref;

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

export function removeAllChildren(dom, vNodes) {
    dom.textContent = '';
    removeElements(vNodes);
}

export function replaceChild(parentDom, nextDom, lastDom) {
    if (!parentDom) parentDom = lastDom.parentNode;
    parentDom.replaceChild(nextDom, lastDom);
}

export function createRef(dom, ref, mountedQueue) {
    if (typeof ref === 'function') {
        mountedQueue.push(() => ref(dom));
    } else {
        throw new Error(`ref must be a function, but got "${JSON.stringify(ref)}"`);
    }
}
