import {Types} from './vnode';
import {patchProps} from './vpatch';
import {MountedQueue} from './utils';

export function render(vNode, parentDom) {
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
        default:
            throw new Error('Unknown vnode type');
    }
}

export function createHtmlElement(vNode, parentDom, mountedQueue) {
    const dom = document.createElement(vNode.tag);
    const children = vNode.children;
    const ref = vNode.ref;

    vNode.dom = dom;

    createElements(children, dom, mountedQueue);

    patchProps(null, vNode);

    if (ref != null) {
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

export function createElements(vNodes, parentDom, mountedQueue) {
    if (vNodes == null) return;
    for (let i = 0; i < vNodes.length; i++) {
        createElement(vNodes[i], parentDom, mountedQueue);
    }
}

export function removeElements(vNodes, parentDom) {
    if (vNodes == null) return;
    for (let i = 0; i < vNodes.length; i++) {
        removeElement(vNodes[i], parentDom);
    }
}

export function removeElement(vNode, parentDom) {
    switch (vNode.type) {
        case Types.Element:
        case Types.Text:
            return removeHtmlElement(vNode, parentDom); 
    }
}

export function removeHtmlElement(vNode, parentDom) {
    if (parentDom) {
        parentDom.removeChild(vNode.dom);
    }
}

export function removeAllChildren(dom, vNodes) {
    dom.textContent = ''
    removeElements(vNodes);
}

export function createRef(dom, ref, mountedQueue) {
    if (typeof ref === 'function') {
        mountedQueue.push(() => ref(dom));
    } else {
        throw new Error(`ref must be a function, but got "${JSON.stringify(ref)}"`);
    }
}
