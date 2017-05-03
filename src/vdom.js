import {Types, createTextVNode} from './vnode';
import {patchProps} from './vpatch';
import {MountedQueue, isArray, isStringOrNumber, isNullOrUndefined} from './utils';

export function render(vNode, parentDom) {
    if (isNullOrUndefined(vNode)) return;
    const mountedQueue = new MountedQueue();
    const dom = createElement(vNode, parentDom, mountedQueue); 
    mountedQueue.trigger();
    return dom;
}

export function createElement(vNode, parentDom, mountedQueue) {
    const type = vNode.type;
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

export function createHtmlElement(vNode, parentDom, mountedQueue) {
    const dom = document.createElement(vNode.tag);
    const children = vNode.children;
    const ref = vNode.ref;

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

    const dom = createElement(vNode.children, parentDom, mountedQueue);
    vNode.dom = dom;

    if (parentDom) {
        parentDom.appendChild(dom);
    }

    if (ref) {
        createRef(dom, ref, mountedQueue);
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
    if (isNullOrUndefined(vNodes)) return;
    for (let i = 0; i < vNodes.length; i++) {
        createElement(vNodes[i], parentDom, mountedQueue);
    }
}

export function removeElements(vNodes, parentDom) {
    if (isNullOrUndefined(vNodes)) return;
    for (let i = 0; i < vNodes.length; i++) {
        removeElement(vNodes[i], parentDom);
    }
}

export function removeElement(vNode, parentDom) {
    switch (vNode.type) {
        case Types.Element:
        case Types.Text:
            return removeHtmlElement(vNode, parentDom); 
        case Types.ComponentClass:
            return removeComponentClass(vNode, parentDom);
    }
}

export function removeHtmlElement(vNode, parentDom) {
    const ref = vNode.ref;
    if (parentDom) {
        parentDom.removeChild(vNode.dom);
    }
    if (ref) {
        ref(null);
    }
}

export function removeComponentClass(vNode, parentDom, nextVNode) {
    const instance = vNode.children;

    if (typeof instance.destroy === 'function') {
        instance.destroy(vNode, nextVNode);
    }

    removeHtmlElement(vNode, parentDom);
    removeElements(vNode.props.children, null);
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
