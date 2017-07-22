import {Types, EMPTY_OBJ} from './vnode';
import {createElement, createRef,
    createTextElement
} from './vdom';
import {isNullOrUndefined, setTextContent,
    isStringOrNumber, isArray, MountedQueue
} from './utils';
import {patchProp} from './vpatch';
import {processForm} from './wrappers/process';

export function hydrateRoot(vNode, parentDom, mountedQueue) {
    if (!isNullOrUndefined(parentDom)) {
        let dom = parentDom.firstChild;

        if (dom !== null) {
            let isTrigger = true;
            if (mountedQueue) {
                isTrigger = false;
            } else {
                mountedQueue = new MountedQueue();
            }
            hydrate(vNode, dom, mountedQueue);
            dom = parentDom.firstChild;
            // should only one entry
            while (dom = dom.nextSibling) {
                parentDom.removeChild(dom);
            }
            if (isTrigger) {
                mountedQueue.trigger();
            }
            return true;
        }
    }
    return false;
}

function hydrate(vNode, dom, mountedQueue) {
    const type = vNode.type;
    
    if (type & Types.Element) {
        hydrateElement(vNode, dom, mountedQueue);
    } else if (type & Types.Text) {
        hydrateText(vNode, dom);
    }
}

function hydrateText(vNode, dom) {
    if (dom.nodeType !== 3) {
        const newDom = createTextElement(vNode, null);
        dom.parentNode.replaceChild(newDom, dom);

        return newDom;
    }

    const text = vNode.children;
    if (dom.nodeValue !== text) {
        dom.nodeValue = text;
    }
    vNode.dom = dom;

    return dom;
}

function hydrateElement(vNode, dom, mountedQueue) {
    const children = vNode.children;
    const props = vNode.props;
    const className = vNode.className;
    const type = vNode.type;
    const ref = vNode.ref;

    if (dom.nodeType !== 1 || dom.tagName.toLowerCase() !== vNode.tag) {
        warning('Server-side markup doesn\'t match client-side markup');
        const newDom = createElement(vNode, null, mountedQueue);
        dom.parentNode.replaceChild(newDom, dom);

        return newDom;
    }

    vNode.dom = dom;
    if (!isNullOrUndefined(children)) {
        hydrateChildren(children, dom, mountedQueue);
    } else if (dom.firstChild !== null) {
        setTextContent(dom, '');
    }

    if (props !== EMPTY_OBJ) {
        const isFormElement = (type & Types.FormElement) > 0;
        for (let prop in props) {
            patchProp(prop, null, props[prop], dom, isFormElement);
        }
        if (isFormElement) {
            processForm(vNode, dom, props, true);
        }
    }

    if (!isNullOrUndefined(className)) {
        dom.className = className;
    } else if (dom.className !== '') {
        dom.removeAttribute('class');
    }

    if (ref) {
        createRef(dom, ref, mountedQueue);
    }
}

function hydrateChildren(children, parentDom, mountedQueue) {
    normalizeChildren(parentDom);
    let dom = parentDom.firstChild;

    if (isStringOrNumber(children)) {
        if (dom !== null && dom.nodeType === 3) {
            if (dom.nodeValue !== children) {
                dom.nodeValue = children;
            }
        } else if (children === '') {
            parentDom.appendChild(document.createTextNode(''));
        } else {
            setTextContent(parentDom, children);
        }
        if (dom !== null) {
            dom = dom.nextSibling;
        }
    } else if (isArray(children)) {
        for (let i = 0; i < children.length; i++) {
            const child = children[i];

            if (!isNullOrUndefined(child)) {
                if (dom !== null) {
                    const nextSibling = dom.nextSibling;
                    hydrate(child, dom, mountedQueue);
                    dom = nextSibling;
                } else {
                    createElement(child, parentDom, mountedQueue);
                }
            }
        }
    } else {
        if (dom !== null) {
            hydrate(children, dom, mountedQueue);
        } else {
            createElement(children, parentDom, mountedQueue);
        }
    }

    // clear any other DOM nodes, there should be on a single entry for the root
    while (dom) {
        // const nextSibling = dom.nextSibling;
        // parentDom.removeChild(dom);
        // dom = nextSibling;
    }
}

function normalizeChildren(parentDom) {
    let dom = parentDom.firstChild;

    while (dom) {
        if (dom.nodeType === 8) {
            if (dom.data === '') {
                const lastDom = dom.previousSibling;
                parentDom.removeChild(dom);
                dom = lastDom || parentDom.firstChild;
            }
        } else {
            dom = dom.nextSibling;
        }
    }
}

const warning = typeof console === 'object' ? function(message) {
    console.warn(message);
} : function() {};
