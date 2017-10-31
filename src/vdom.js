import {Types, createTextVNode, EMPTY_OBJ} from './vnode';
import {patchProp} from './vpatch';
import {handleEvent} from './event';
import {
    MountedQueue, isArray, isStringOrNumber,
    isNullOrUndefined, isEventProp, doc as document,
    setTextContent, svgNS
} from './utils';
import {processForm} from './wrappers/process';

export function render(vNode, parentDom, mountedQueue, parentVNode, isSVG) {
    if (isNullOrUndefined(vNode)) return;
    let isTrigger = true;
    if (mountedQueue) {
        isTrigger = false;
    } else {
        mountedQueue = new MountedQueue();
    }
    const dom = createElement(vNode, parentDom, mountedQueue, true /* isRender */, parentVNode, isSVG);
    if (isTrigger) {
        mountedQueue.trigger();
    }
    return dom;
}

export function createElement(vNode, parentDom, mountedQueue, isRender, parentVNode, isSVG) {
    const type = vNode.type;
    if (type & Types.Element) {
        return createHtmlElement(vNode, parentDom, mountedQueue, isRender, parentVNode, isSVG);
    } else if (type & Types.Text) {
        return createTextElement(vNode, parentDom);
    } else if (type & Types.ComponentClassOrInstance) {
        return createComponentClassOrInstance(vNode, parentDom, mountedQueue, null, isRender, parentVNode, isSVG);
    // } else if (type & Types.ComponentFunction) {
        // return createComponentFunction(vNode, parentDom, mountedQueue, isNotAppendChild, isRender);
    // } else if (type & Types.ComponentInstance) {
        // return createComponentInstance(vNode, parentDom, mountedQueue);
    } else if (type & Types.HtmlComment) {
        return createCommentElement(vNode, parentDom);
    } else {
        throw new Error(`unknown vnode type ${type}`);
    }
}

export function createHtmlElement(vNode, parentDom, mountedQueue, isRender, parentVNode, isSVG) {
    const type = vNode.type;

    isSVG = isSVG || (type & Types.SvgElement) > 0;

    const dom = documentCreateElement(vNode.tag, isSVG);
    const children = vNode.children;
    const props = vNode.props;
    const className = vNode.className;

    vNode.dom = dom;
    vNode.parentVNode = parentVNode;

    if (!isNullOrUndefined(children)) {
        createElements(children, dom, mountedQueue, isRender, vNode,
            isSVG === true && vNode.tag !== 'foreignObject'
        );
    }

    if (!isNullOrUndefined(className)) {
        if (isSVG) {
            dom.setAttribute('class', className);
        } else {
            dom.className = className;
        }
    }

    // in IE8, the select value will be set to the first option's value forcely
    // when it is appended to parent dom. We change its value in processForm does not
    // work. So processForm after it has be appended to parent dom.
    let isFormElement;
    if (props !== EMPTY_OBJ) {
        isFormElement = (vNode.type & Types.FormElement) > 0;
        for (let prop in props) {
            patchProp(prop, null, props[prop], dom, isFormElement, isSVG);
        }
    }

    const ref = vNode.ref;
    if (!isNullOrUndefined(ref)) {
        createRef(dom, ref, mountedQueue);
    }

    if (parentDom) {
        appendChild(parentDom, dom);
    }

    if (isFormElement) {
        processForm(vNode, dom, props, true);
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

export function createComponentClassOrInstance(vNode, parentDom, mountedQueue, lastVNode, isRender, parentVNode, isSVG) {
    const props = vNode.props;
    const instance = vNode.type & Types.ComponentClass ?
        new vNode.tag(props) : vNode.children;
    instance.parentDom = parentDom;
    instance.mountedQueue = mountedQueue;
    instance.isRender = isRender;
    instance.parentVNode = parentVNode;
    instance.isSVG = isSVG;
    const dom = instance.init(lastVNode, vNode);
    const ref = vNode.ref;

    vNode.dom = dom;
    vNode.children = instance;

    if (parentDom) {
        appendChild(parentDom, dom);
        // parentDom.appendChild(dom);
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

    let children = vNode.children;
    let dom;
    // support ComponentFunction return an array for macro usage
    if (isArray(children)) {
        dom = [];
        for (let i = 0; i < children.length; i++) {
            dom.push(createElement(children[i], parentDom, mountedQueue));
        }
    } else {
        dom = createElement(vNode.children, parentDom, mountedQueue);
    }
    vNode.dom = dom;

    // if (parentDom) {
        // parentDom.appendChild(dom);
    // }

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
    if (isStringOrNumber(result)) {
        result = createTextVNode(result);
    } else if (process.env.NODE_ENV !== 'production') {
        if (isArray(result)) {
            throw new Error(`ComponentFunction ${vNode.tag.name} returned a invalid vNode`);
        }
    }

    vNode.children = result;

    return vNode;
}

export function createElements(vNodes, parentDom, mountedQueue, isRender, parentVNode, isSVG) {
    if (isStringOrNumber(vNodes)) {
        setTextContent(parentDom, vNodes);
    } else if (isArray(vNodes)) {
        for (let i = 0; i < vNodes.length; i++) {
            createElement(vNodes[i], parentDom, mountedQueue, isRender, parentVNode, isSVG);
        }
    } else {
        createElement(vNodes, parentDom, mountedQueue, isRender, parentVNode, isSVG);
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

export function removeElement(vNode, parentDom, nextVNode) {
    const type = vNode.type;
    if (type & Types.Element) {
        return removeHtmlElement(vNode, parentDom);
    } else if (type & Types.TextElement) {
        return removeText(vNode, parentDom);
    } else if (type & Types.ComponentClassOrInstance) {
        return removeComponentClassOrInstance(vNode, parentDom, nextVNode);
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

export function removeComponentClassOrInstance(vNode, parentDom, nextVNode) {
    const instance = vNode.children;
    const ref = vNode.ref;

    if (typeof instance.destroy === 'function') {
        instance.destroy(vNode, nextVNode, parentDom);
    }

    if (ref) {
        ref(null);
    }

    // instance destroy method will remove everything
    // removeElements(vNode.props.children, null);

    if (parentDom) {
        removeChild(parentDom, vNode);
    }
}

export function removeAllChildren(dom, vNodes) {
    // setTextContent(dom, '');
    // removeElements(vNodes);
}

export function replaceChild(parentDom, lastVNode, nextVNode) {
    const lastDom = lastVNode.dom;
    const nextDom = nextVNode.dom;
    const parentNode = lastDom.parentNode;
    // maybe the lastDom has be moved
    if (!parentDom || parentNode !== parentDom) parentDom = parentNode;
    if (lastDom._unmount) {
        lastDom._unmount(lastVNode, parentDom);
        if (!nextDom.parentNode) {
            parentDom.appendChild(nextDom);
        }
    } else {
        parentDom.replaceChild(nextDom, lastDom);
    }
}

export function removeChild(parentDom, vNode) {
    const dom = vNode.dom;
    if (dom._unmount) {
        dom._unmount(vNode, parentDom);
    } else {
        parentDom.removeChild(dom);
    }
}

export function appendChild(parentDom, dom) {
    // in IE8, when a element has appendChild,
    // then its parentNode will be HTMLDocument object,
    // so check the tagName for this case
    if (!dom.parentNode || !dom.parentNode.tagName) {
        parentDom.appendChild(dom);
    }
}

export function createRef(dom, ref, mountedQueue) {
    if (typeof ref === 'function') {
        mountedQueue.push(() => ref(dom));
    } else {
        throw new Error(`ref must be a function, but got "${JSON.stringify(ref)}"`);
    }
}

export function documentCreateElement(tag, isSVG) {
    if (isSVG === true) {
        return document.createElementNS(svgNS, tag);
    } else {
        return document.createElement(tag);
    }
}
