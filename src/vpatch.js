import {Types, EMPTY_OBJ} from './vnode';
import {
    createElement,
    createElements, 
    removeElements, 
    removeElement,
    removeComponentClassOrInstance,
    removeAllChildren,
    createComponentClassOrInstance,
    createComponentFunction,
    createComponentFunctionVNode,
    createRef,
    replaceChild
} from './vdom';
import {isObject, isArray, isNullOrUndefined, 
    skipProps, MountedQueue, isEventProp, 
    booleanProps, strictProps,
    browser, setTextContent, isStringOrNumber
} from './utils';
import {handleEvent} from './event';
import {processSelect} from './wrappers/select';

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
                patchElement(lastVNode, nextVNode, parentDom, mountedQueue);
            } else {
                replaceElement(lastVNode, nextVNode, parentDom, mountedQueue);
            }
        } else if (nextType & Types.TextElement) {
            if (lastType & Types.TextElement) {
                patchText(lastVNode, nextVNode);
            } else {
                replaceElement(lastVNode, nextVNode, parentDom, mountedQueue);
            }
        } else if (nextType & Types.ComponentClass) {
            if (lastType & Types.ComponentClass) {
                patchComponentClass(lastVNode, nextVNode, parentDom, mountedQueue);
            } else {
                replaceElement(lastVNode, nextVNode, parentDom, mountedQueue);
            }
        } else if (nextType & Types.ComponentFunction) {
            if (lastType & Types.ComponentFunction) {
                patchComponentFunction(lastVNode, nextVNode, parentDom, mountedQueue);
            } else {
                replaceElement(lastVNode, nextVNode, parentDom, mountedQueue);
            }
        } else if (nextType & Types.ComponentInstance) {
            if (lastType & Types.ComponentInstance) {
                patchComponentIntance(lastVNode, nextVNode, parentDom, mountedQueue);
            } else {
                replaceElement(lastVNode, nextVNode, parentDom, mountedQueue);
            }
        }
    }
    return nextVNode.dom;
}

function patchElement(lastVNode, nextVNode, parentDom, mountedQueue) {
    const dom = lastVNode.dom;
    const lastProps = lastVNode.props;
    const nextProps = nextVNode.props;
    const lastChildren = lastVNode.children;
    const nextChildren = nextVNode.children;
    const nextRef = nextVNode.ref;
    const lastClassName = lastVNode.className;
    const nextClassName = nextVNode.className;

    nextVNode.dom = dom;

    if (lastVNode.tag !== nextVNode.tag) {
        replaceElement(lastVNode, nextVNode, parentDom, mountedQueue);
    } else {
        if (lastChildren !== nextChildren) {
            patchChildren(lastChildren, nextChildren, dom, mountedQueue);
        }

        if (lastProps !== nextProps) {
            patchProps(lastVNode, nextVNode);
        }

        if (lastClassName !== nextClassName) {
            if (isNullOrUndefined(nextClassName)) {
                dom.removeAttribute('class');
            } else {
                dom.className = nextClassName;
            }
        }

        if (!isNullOrUndefined(nextRef) && lastVNode.ref !== nextRef) {
            createRef(dom, nextRef, mountedQueue);
        }
    }

}

function patchComponentClass(lastVNode, nextVNode, parentDom, mountedQueue) {
    const lastTag = lastVNode.tag;
    const nextTag = nextVNode.tag;
    const dom = lastVNode.dom;

    let instance;
    let newDom;

    if (lastTag !== nextTag || lastVNode.key !== nextVNode.key) {
        removeComponentClassOrInstance(lastVNode, null, nextVNode);
        newDom = createComponentClassOrInstance(nextVNode, null, mountedQueue, lastVNode);
    } else {
        instance = lastVNode.children;
        newDom = instance.update(lastVNode, nextVNode);
        nextVNode.dom = newDom;
        nextVNode.children = instance;
    }

    if (dom !== newDom) {
        replaceChild(parentDom, newDom, dom);
    }
}

function patchComponentIntance(lastVNode, nextVNode, parentDom, mountedQueue) {
    const lastInstance = lastVNode.children;
    const nextInstance = nextVNode.children;
    const dom = lastVNode.dom;

    let newDom;

    if (lastInstance !== nextInstance) {
        removeComponentClassOrInstance(lastVNode, null, nextVNode);
        newDom = createComponentClassOrInstance(nextVNode, null, mountedQueue, lastVNode);
    } else {
        newDom = lastInstance.update(lastVNode, nextVNode);
        nextVNode.dom = newDom;
    }

    if (dom !== newDom) {
        replaceChild(parentDom, newDom, dom);
    }
}

function patchComponentFunction(lastVNode, nextVNode, parentDom, mountedQueue) {
    const lastTag = lastVNode.tag;
    const nextTag = nextVNode.tag;

    if (lastVNode.key !== nextVNode.key) {
        removeElements(lastVNode.children, parentDom);
        createComponentFunction(nextVNode, parentDom, mountedQueue);
    } else {
        nextVNode.dom = lastVNode.dom;
        createComponentFunctionVNode(nextVNode);
        patchChildren(lastVNode.children, nextVNode.children, parentDom, mountedQueue);
    }
}

function patchChildren(lastChildren, nextChildren, parentDom, mountedQueue) {
    if (isNullOrUndefined(lastChildren)) {
        if (!isNullOrUndefined(nextChildren)) {
            createElements(nextChildren, parentDom, mountedQueue);
        }
    } else if (isNullOrUndefined(nextChildren)) {
        removeElements(lastChildren, parentDom); 
    } else if (isStringOrNumber(nextChildren)) {
        if (isStringOrNumber(lastChildren)) {
            parentDom.firstChild.nodeValue = nextChildren;
        } else {
            removeElements(lastChildren, parentDom);
            setTextContent(parentDom, nextChildren);
        }
    } else if (isArray(lastChildren)) {
        if (isArray(nextChildren)) {
            patchChildrenByKey(lastChildren, nextChildren, parentDom, mountedQueue);
        } else {
            removeElements(lastChildren, parentDom);
            createElement(nextChildren, parentDom, mountedQueue);
        }
    } else if (isArray(nextChildren)) {
        removeElement(lastChildren, parentDom);
        createElements(nextChildren, parentDom, mountedQueue);
    } else if (isStringOrNumber(lastChildren)) {
        setTextContent(parentDom, '');
        createElement(nextChildren, parentDom, mountedQueue);
    } else {
        patchVNode(lastChildren, nextChildren, parentDom, mountedQueue);
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
            insertOrAppend(bEnd, bLength, bEndNode.dom, b, dom);
            ++aStart;
            --bEnd;
            aStartNode = a[aStart];
            bEndNode = b[bEnd];
            continue;
        }
        break;
    }

    if (aStart > aEnd) {
        while (bStart <= bEnd) {
            insertOrAppend(
                bEnd, bLength, 
                createElement(b[bStart], null, mountedQueue),
                b, dom
            );
            ++bStart;
        }
    } else if (bStart > bEnd) {
        while (aStart <= aEnd) {
            removeElement(a[aStart], dom);
            ++aStart;
        }
    } else {
        aLength = aEnd - aStart + 1;
        bLength = bEnd - bStart + 1;
        const sources = new Array(bLength);
        for (i = 0; i < bLength; i++) {
            sources[i] = -1;
        }
        let moved = false;
        let pos = 0;
        let patched = 0;

        if (bLength <= 4 || aLength * bLength <= 16) {
            for (i = aStart; i <= aEnd; i++) {
                aNode = a[i];
                if (patched < bLength) {
                    for (j = bStart; j <= bEnd; j++) {
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
                createElement(b[bStart], dom, mountedQueue);
                ++bStart;
            }
        } else {
            // some browsers, e.g. ie, must insert before remove for some element,
            // e.g. select/option, otherwise the selected property will be weird
            if (moved) {
                const seq = lisAlgorithm(sources);
                j = seq.length - 1;
                for (i = bLength - 1; i >= 0; i--) {
                    if (sources[i] === -1) {
                        pos = i + bStart;
                        insertOrAppend(
                            pos, b.length, 
                            createElement(b[pos], null, mountedQueue), 
                            b, dom
                        );
                    } else {
                        if (j < 0 || i !== seq[j]) {
                            pos = i + bStart;
                            insertOrAppend(pos, b.length, b[pos].dom, b, dom);
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
                            createElement(b[pos], null, mountedQueue),
                            b, dom
                        );
                    }
                }
            }
            i = aLength - patched;
            while (i > 0) {
                aNode = a[aStart++];
                if (aNode !== null) {
                    removeElement(aNode, dom);
                    --i;
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

function insertOrAppend(pos, length, newDom, nodes, dom) {
    const nextPos = pos + 1;
    if (nextPos < length) {
        dom.insertBefore(newDom, nodes[nextPos].dom);
    } else {
        dom.appendChild(newDom);
    }
}

function replaceElement(lastVNode, nextVNode, parentDom, mountedQueue) {
    if (!parentDom) parentDom = lastVNode.dom.parentNode;
    removeElement(lastVNode, null);
    createElement(nextVNode, null, mountedQueue);
    parentDom.replaceChild(nextVNode.dom, lastVNode.dom);
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
    const lastProps = lastVNode.props;
    const nextProps = nextVNode.props;
    const dom = nextVNode.dom;
    let prop;
    if (nextProps !== EMPTY_OBJ) {
        const isSelectElement = (nextVNode.type & Types.SelectElement) > 0;
        for (prop in nextProps) {
            patchProp(prop, lastProps[prop], nextProps[prop], dom, isSelectElement);
        }
        if (isSelectElement) {
            processSelect(nextVNode, dom, nextProps);
        }
    }
    if (lastProps !== EMPTY_OBJ) {
        for (prop in lastProps) {
            if (!(prop in nextProps)) {
                removeProp(prop, lastProps[prop], dom);
            } 
        }
    }
}

export function patchProp(prop, lastValue, nextValue, dom, isSelectElement) {
    if (lastValue !== nextValue) {
        if (skipProps[prop] || isSelectElement && prop === 'value') {
            return;
        } else if (booleanProps[prop]) {
            dom[prop] = !!nextValue;
        } else if (strictProps[prop]) {
            const value = isNullOrUndefined(nextValue) ? '' : nextValue;
            if (dom[prop] !== value) {
                dom[prop] = value;
            }
            // add a private property _value for select an object
            if (prop === 'value') {
                dom._value = value;
            }
        } else if (isNullOrUndefined(nextValue)) {
            removeProp(prop, lastValue, dom);
        } else if (isEventProp(prop)) {
            handleEvent(prop.substr(3), lastValue, nextValue, dom);
        } else if (isObject(nextValue)) {
            patchPropByObject(prop, lastValue, nextValue, dom);
        } else if (prop === 'innerHTML') {
            dom.innerHTML = nextValue;
        } else {
            dom.setAttribute(prop, nextValue);
        }
    }
}

function removeProp(prop, lastValue, dom) {
    if (!isNullOrUndefined(lastValue)) {
        switch (prop) {
            case 'value':
                dom.value = '';
                return;
            case 'style':
                dom.removeAttribute('style');
                return;
            case 'attributes':
                for (let key in lastValue) {
                    dom.removeAttribute(key);
                }
                return;
            case 'dataset':
                removeDataset(lastValue, dom);
                return; 
            default:
                break;
        }

        if (booleanProps[prop]) {
            dom[prop] = false;
        } else if (isEventProp(prop)) {
            handleEvent(prop.substr(3), lastValue, null, dom);
        } else if (isObject(lastValue)){
            const domProp = dom[prop];
            try {
                dom[prop] = undefined;
                delete dom[prop];
            } catch (e) {
                for (let key in lastValue) {
                    delete domProp[key];
                }
            }
        } else {
            dom.removeAttribute(prop);
        }
    }
}

const removeDataset = browser.isIE ? 
    function(lastValue, dom) {
        for (let key in lastValue) {
            dom.removeAttribute(`data-${kebabCase(key)}`);
        }
    } :
    function(lastValue, dom) {
        const domProp = dom.dataset;
        for (let key in lastValue) {
            delete domProp[key];
        }
    };

function patchPropByObject(prop, lastValue, nextValue, dom) {
    if (lastValue && !isObject(lastValue) && !isNullOrUndefined(lastValue)) {
        removeProp(prop, lastValue, dom);
        lastValue = null;
    }
    switch (prop) {
        case 'attributes':
            return patchAttributes(lastValue, nextValue, dom);
        case 'style':
            return patchStyle(lastValue, nextValue, dom);
        case 'dataset':
            return patchDataset(prop, lastValue, nextValue, dom);
        default:
            return patchObject(prop, lastValue, nextValue, dom);
    }
}

const patchDataset = browser.isIE ? 
    function patchDataset(prop, lastValue, nextValue, dom) {
        let hasRemoved = {};
        let key;
        let value;

        for (key in nextValue) {
            const dataKey = `data-${kebabCase(key)}`;
            value = nextValue[key];
            if (isNullOrUndefined(value)) {
                dom.removeAttribute(dataKey); 
                hasRemoved[key] = true;
            } else {
                dom.setAttribute(dataKey, value);
            }
        } 

        if (!isNullOrUndefined(lastValue)) {
            for (key in lastValue) {
                if (isNullOrUndefined(nextValue[key]) && !hasRemoved[key]) {
                    dom.removeAttribute(`data-${kebabCase(key)}`);
                }
            }
        }
    } : patchObject;

const _cache = {};
function kebabCase(word) {
    if (!_cache[word]) {
        _cache[word] = word.replace(/[A-Z]/g, (item) => {
            return `-${item.toLowerCase()}`;
        });
    }
    return _cache[word];
}

function patchObject(prop, lastValue, nextValue, dom) {
    let domProps = dom[prop];
    if (isNullOrUndefined(domProps)) {
        domProps = dom[prop] = {};
    }
    let key;
    let value;
    for (key in nextValue) {
        domProps[key] = nextValue[key];
    }
    if (!isNullOrUndefined(lastValue)) {
        for (key in lastValue) {
            if (isNullOrUndefined(nextValue[key])) {
                delete domProps[key];
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
        if (isNullOrUndefined(value)) {
            dom.removeAttribute(key);
            hasRemoved[key] = true;
        } else {
            dom.setAttribute(key, value);
        }
    }
    if (!isNullOrUndefined(lastValue)) {
        for (key in lastValue) {
            if (isNullOrUndefined(nextValue[key]) && !hasRemoved[key]) {
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
        if (isNullOrUndefined(value)) {
            domStyle[key] = '';
            hasRemoved[key] = true;
        } else {
            domStyle[key] = value;
        }
    }
    if (!isNullOrUndefined(lastValue)) {
        for (key in lastValue) {
            if (isNullOrUndefined(nextValue[key]) && !hasRemoved[key]) {
                domStyle[key] = '';
            }
        }
    }
}
