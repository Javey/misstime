import {Types} from './vnode';

export function createElement(vNode, parentDom) {
    const type = vNode.type;
    let dom;
    switch (type) {
        case Types.HtmlElement:
            dom = createHtmlElement(vNode, parentDom);
            break;
        case Types.Text:
            dom = document.createTextNode(vNode.children); 
            break;
        default:
            throw new Error('Unknown vnode type');
    }
    
    if (parentDom) {
        parentDom.appendChild(dom);
    }

    return dom;
}

export function createHtmlElement(vNode, parentDom) {
    const dom = document.createElement(vNode.tag);
    const children = vNode.children;
    const props = vNode.props;

    vNode.dom = dom;

    createElements(children, dom);

    if (props) {
        for (let prop in props) {
            dom[prop] = props[prop];
        }
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
