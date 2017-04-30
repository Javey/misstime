import {Types} from './vnode';
import {patchProps} from './vpatch';

export function createElement(vNode, parentDom) {
    const type = vNode.type;
    switch (type) {
        case Types.HtmlElement:
            return createHtmlElement(vNode, parentDom);
        case Types.Text:
            return createTextElement(vNode, parentDom);
        default:
            throw new Error('Unknown vnode type');
    }
}

export function createHtmlElement(vNode, parentDom) {
    const dom = document.createElement(vNode.tag);
    const children = vNode.children;

    vNode.dom = dom;

    createElements(children, dom);

    patchProps(null, vNode);

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

export function createElements(vNodes, parentDom) {
    if (vNodes == null) return;
    for (let i = 0; i < vNodes.length; i++) {
        createElement(vNodes[i], parentDom);
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
