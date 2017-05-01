import {Types} from './vnode';
import {
    createElements, 
    removeElements, 
    removeElement,
    removeComponentClass,
    removeAllChildren,
    createComponentClass,
    createRef,
    replaceChild
} from './vdom';
import {isObject, skipProps, MountedQueue} from './utils';
import {handleEvent} from './event';

export function patch(lastVNode, nextVNode, parentDom) {
    const mountedQueue = new MountedQueue();
    const dom = patchVNode(lastVNode, nextVNode, parentDom, mountedQueue);
    mountedQueue.trigger();
    return dom;
}

export function patchVNode(lastVNode, nextVNode, parentDom, mountedQueue) {
    if (lastVNode !== nextVNode) {
        const nextType = nextVNode.type;
        const lastType = lastVNode.type;

        if (nextType & Types.Element) {
            if (lastType & Types.Element) {
                patchElement(lastVNode, nextVNode, mountedQueue);
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
                patchComponent(lastVNode, nextVNode, parentDom, mountedQueue);
            }
        }
    }
    return nextVNode.dom;
}

function patchElement(lastVNode, nextVNode, mountedQueue) {
    const dom = lastVNode.dom;
    const lastProps = lastVNode.props;
    const nextProps = nextVNode.props;
    const lastChildren = lastVNode.children;
    const nextChildren = nextVNode.children;
    const nextRef = nextVNode.ref;

    nextVNode.dom = dom;

    patchChildren(lastChildren, nextChildren, dom, mountedQueue);

    patchProps(lastVNode, nextVNode);

    if (nextRef != null && lastVNode.ref !== nextRef) {
        createRef(dom, nextRef, mountedQueue);
    }
}

function patchComponent(lastVNode, nextVNode, parentDom, mountedQueue) {
    const lastTag = lastVNode.tag;
    const nextTag = nextVNode.tag;
    const dom = lastVNode.dom;

    let instance;
    let newDom;
    
    if (lastTag !== nextTag || lastVNode.key !== nextVNode.key) {
        newDom = createComponentClass(nextVNode, null, mountedQueue);
        removeComponentClass(lastVNode, null);
    } else {
        instance = lastVNode.children;
        newDom = instance.update(lastVNode, nextVNode);
        nextVNode.dom = newDom;
    }

    if (dom !== newDom) {
        replaceChild(parentDom, newDom, dom);
    }
}

function patchChildren(lastChildren, nextChildren, parentDom, mountedQueue) {
    if (lastChildren == null) {
        createElements(nextChildren, parentDom, mountedQueue);
    } else if (nextChildren == null) {
        removeElements(lastChildren, parentDom); 
    } else {
        patchChildrenByKey(lastChildren, nextChildren, parentDom, mountedQueue);
    }
}

function patchChildrenByKey(a, b, dom, mountedQueue) {
    let aLength = a.length;
    let bLength = b.length;
    let aEnd = aLength - 1;
    let bEnd = bLength - 1;
    let aStart = 0;
    let bStart = 0;
    let i;
    let j;
    let aNode;
    let bNode;
    let nextNode;
    let nextPos;
    let node;
    let aStartNode = a[aStart];
    let bStartNode = b[bStart];
    let aEndNode = a[aEnd];
    let bEndNode = b[bEnd];

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
            insertOrAppend(bEnd, bLength, bEndNode, a, dom);
            ++aStart;
            --bEnd;
            aStartNode = a[aStart];
            bEndNode = b[eEnd];
            continue;
        }
        break;
    }

    if (aStart > aEnd) {
        while (bStart <= bEnd) {
            insertOrAppend(bEnd, bLength, createElement(b[bStart]), a, dom);
            ++bStart;
        }
    } else if (bStart > bEnd) {
        while (aStart <= aEnd) {
            removeElement(a[aStart], dom);
            ++aStart;
        }
    } else {
        aLength = aLength - aEnd + 1;
        bLength = bLength - bEnd + 1;
        const sources = new Array(bLength);
        for (i = 0; i < bLength; i++) {
            sources[i] = -1;
        }
        let moved = false;
        let pos = 0;
        let patched = 0;

        if (bLength <= 4 || aLength * bLength <= 16) {
            for (i = aStart; i < aEnd; i++) {
                aNode = a[i];
                if (patched < bLength) {
                    for (j = bStart; j < bEnd; j++) {
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
                dom.appendChild(createElement(b[bStart]));
                ++bStart;
            }
        } else {
            i = aLength - patched;
            while (i > 0) {
                aNode = a[aStart++];
                removeElement(aNode, dom);
                --i;
            }
            if (moved) {
                const seq = lisAlgorithm(sources);
                j = seq.length - 1;
                for (i = bLength - 1; i >= 0; i--) {
                    if (sources[i] === -1) {
                        pos = i + bStart;
                        insertOrAppend(
                            pos, b.length, 
                            createElement(b[pos], dom), 
                            b, dom
                        );
                    } else {
                        if (j < 0 || i !== seq[j]) {
                            pos = i + bStart;
                            insertOrAppend(pos, b.length, b[pos], b, dom);
                        } else {
                            --j;
                        }
                    }
                }
            } else if (patched !== bLength) {
                for (i = bLength - 1; i >= 0; i--) {
                    if (sources[i] === -1) {
                        pos = i + bStart;
                        insertOrAppend(
                            pos, b.length,
                            createElement(b[pos], dom),
                            b, dom
                        );
                    }
                }
            }
        }
    }
}

function lisAlgorithm(arr) {
    let p = arr.slice(0);
    let result = [0];
    let i;
    let j;
    let u;
    let v;
    let c;
    let len = arr.length;
    for (i = 0; i < len; i++) {
        let arrI = arr[i];
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
            c = ((u + v) / 2) | 0;
            if (arr[result[c]] < arrI) {
                u = c + 1;
            }
            else {
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

function insertOrAppend(pos, length, newNode, nodes, dom) {
    const nextPos = pos + 1;
    if (nextPos < length) {
        dom.insertBefore(newNode.dom, nodes[nextPos].dom);
    } else {
        dom.appendChild(newNode.dom);
    }
}

function replaceElement(lastVNode, nextVNode, parentDom) {
    if (!parentDom) parentDom = lastVNode.dom.parentNode;
    removeElement(lastVNode, parentDom);
    createElement(nextVNode);
    parentDom.replaceChild(nextVNode.dom, nextVNode.dom);
}

function patchText(lastVNode, nextVNode, parentDom) {
    const nextText = nextVNode.children;
    const dom = lastVNode.dom;
    nextVNode.dom = dom;
    if (lastVNode.children !== nextText) {
        dom.nodeValue = nextText;
    }
}

export function patchProps(lastVNode, nextVNode) {
    const lastProps = lastVNode && lastVNode.props || null;
    const nextProps = nextVNode.props;
    const dom = nextVNode.dom;
    for (let propName in nextProps) {
        if (skipProps[propName]) continue;

        let propValue = nextProps[propName];
        if (propValue === undefined) {
            removeProp(propName, dom, lastProps);
        } else if (propName.substr(0, 3) === 'ev-') {
            patchEvent(propName, propValue, dom, lastProps);
        } else if (isObject(propValue)) {
            patchPropByObject(propName, propValue, dom, lastProps);
        } else if (propName === 'style') {
            dom.style.cssText = propValue;
        } else {
            dom[propName] = propValue; 
        }
    }
}

function removeProp(propName, dom, lastProps) {
    if (lastProps != null) {
        if (propName === 'attributes') {
            for (let key in lastProps[propName]) {
                dom.removeAttribute('style');
            }
        } else if (typeof lastProps[propName] === 'string') {
            dom[propName] = ''
        } else {
            dom[propName] = null;
        }
    }
}

function patchPropByObject(propName, propValue, dom, lastProps) {
    const lastPropValue = lastProps && lastProps[propName] || null;
    switch (propName) {
        case 'attributes':
            return patchAttributes(lastPropValue, propValue, dom);
        case 'style':
            return patchStyle(lastPropValue, propValue, dom);
        default:
            return patchObject(lastPropValue, propValue, dom);
    }
}

function patchObject(lastValue, nextValue, dom) {
    const domProps = dom[propName];
    let key;
    let value;
    for (key in nextValue) {
        domProps[key] = nextValue[key];
    }
    if (lastValue != null) {
        for (key in lastValue) {
            if (nextValue[key] === undefined) {
                domProps[key] = undefined;
            }
        }
    }
}

function patchAttributes(lastValue, nextValue, dom) {
    const hasRemoved = {};
    let key;
    let value;
    for (key in nextValue) {
        value = nextValue[key];
        if (value == null) {
            dom.removeAttribute(key);
            hasRemoved[key] = true;
        } else {
            dom.setAttribute(key, value);
        }
    }
    if (lastValue != null) {
        for (key in lastValue) {
            if (nextValue[key] == null && !hasRemoved[key]) {
                dom.removeAttribute(key);
            }
        }
    }
}

function patchStyle(lastValue, nextValue, dom) {
    const domStyle = dom.style;
    const hasRemoved = {};
    let key;
    let value;
    for (key in nextValue) {
        value = nextValue[key];
        if (value == null) {
            domStyle[key] = '';
            hasRemoved[key] = true;
        } else {
            domStyle[key] = value;
        }
    }
    if (lastValue != null) {
        for (key in lastValue) {
            if (nextValue[key] == null && !hasRemoved[key]) {
                domStyle[key] = '';
            }
        }
    }
}

function patchEvent(propName, nextValue, dom, lastProps) {
    const lastValue  = lastProps && lastProps[propName] || null;
    if (lastValue !== nextValue) {
        handleEvent(propName.substr(3), lastValue, nextValue, dom);
    }
}
