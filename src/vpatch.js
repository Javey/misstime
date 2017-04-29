import {Types} from './vnode';
import {
    createElements, 
    removeElements, 
    removeElement,
    removeAllChildren
} from './vdom';

export function patch(lastVNode, nextVNode, parentDom) {
    if (lastVNode !== nextVNode) {
        const nextType = nextVNode.type;
        const lastType = lastVNode.type;

        if (nextType & Types.Element) {
            if (lastType & Types.Element) {
                patchElement(lastVNode, nextVNode);
            } else {
                replaceElement(lastVNode, nextVNode, parentDom);
            }
        } else if (nextType & Types.Text) {
            if (lastType & Types.Text) {
                patchText(lastVNode, nextVNode);
            } else {
                replaceElement(lastVNode, nextVNode, parentDom);
            }
        }
    }
    return nextVNode.dom;
}

function patchElement(lastVNode, nextVNode) {
    const dom = lastVNode.dom;
    const lastProps = lastVNode.props;
    const nextProps = nextVNode.props;
    const lastChildren = lastVNode.children;
    const nextChildren = nextVNode.children;

    nextVNode.dom = dom;

    patchChildren(lastChildren, nextChildren, dom);
}

function patchChildren(lastChildren, nextChildren, parentDom) {
    if (lastChildren == null) {
        createElements(nextChildren, parentDom);
    } else if (nextChildren == null) {
        removeElements(lastChildren, parentDom); 
    } else {
        patchChildrenByKey(lastChildren, nextChildren, parentDom);
    }
}

function patchChildrenByKey(a, b, dom) {
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
            patch(aStartNode, bStartNode, dom);
            ++aStart;
            ++bStart;
            if (aStart > aEnd || bStart > bEnd) {
                break outer;
            }
            aStartNode = a[aStart];
            bStartNode = b[bStart];
        }
        while (aEndNode.key === bEndNode.key) {
            patch(aEndNode, bEndNode, dom);
            --aEnd;
            --bEnd;
            if (aEnd < aStart || bEnd < bStart) {
                break outer;
            }
            aEndNode = a[aEnd];
            bEndNode = b[bEnd];
        }

        if (aEndNode.key === bStartNode.key) {
            patch(aEndNode, bStartNode, dom);
            dom.insertBefore(bStartNode.dom, aStartNode.dom);
            --aEnd;
            ++bStart;
            aEndNode = a[aEnd];
            bStartNode = b[bStart];
            continue;
        }

        if (aStartNode.key === bEndNode.key) {
            patch(aStartNode, bEndNode, dom); 
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
            removeElement(a[Start], dom);
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
                            patch(aNode, bNode, dom);
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
                        patch(aNode, bNode, dom);
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
    if (!parentDom) parentDom = lastVNode.dom;
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
