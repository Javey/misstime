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
        case Types.ComponentClass:
            return createComponentClass(vNode, parentDom, mountedQueue);
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

export function createComponentClass(vNode, parentDom, mountedQueue) {
    const props = vNode.props;
    const instance = new vNode.tag(props); 
    const dom = instance.init(vNode);
    const ref = props.ref;

    vNode.dom = dom;
    vNode.children = instance;
    
    if (parentDom) {
        parentDom.appendChild(dom);
    }

    if (typeof instance.mount === 'function') {
        mountedQueue.push(() => instance.mount(vNode));
    }

    if (typeof ref === 'function') {
        ref(instance);
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

export function removeComponentClass(vNode, parentDom) {
    const instance = vNode.children;

    if (typeof instance.destroy === 'function') {
        instance.destroy(vNode);
    }

    removeHtmlElement(vNode, parentDom);
    removeElements(vNode.props.children, null);
}

export function removeAllChildren(dom, vNodes) {
    dom.textContent = ''
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
