import {isArray, isStringOrNumber, isNullOrUndefined} from './utils';

export const Types = {
    Text: 1,
    HtmlElement: 1 << 1,

    ComponentClass: 1 << 2,
    ComponentFunction: 1 << 3,

    HtmlComment: 1 << 4
};
Types.Element = Types.HtmlElement;
Types.Component = Types.ComponentClass | Types.ComponentFunction;
Types.TextElement = Types.Text | Types.HtmlComment;

export const EMPTY_OBJ = {};
if (process.env.NODE_ENV !== 'production') {
    Object.freeze(EMPTY_OBJ);
}

export function VNode(type, tag, props, children, className, key, ref) {
    this.type = type;
    this.tag = tag;
    this.props = props;
    this.children = children;
    this.key = key;
    this.ref = ref;
    this.className = className;
} 

export function createVNode(tag, props, children, className, key, ref) {
    let type;
    props || (props = EMPTY_OBJ);
    switch (typeof tag) {
        case 'string':
            type = Types.HtmlElement;
            break;
        case 'function':
            if (tag.prototype.init) {
                type = Types.ComponentClass;
            } else {
                type = Types.ComponentFunction;
            }
            break;
        default:
            throw new Error(`unknown vNode type: ${tag}`);
    }

    if (props.children) {
        props.children = normalizeChildren(props.children);
    }

    return new VNode(type, tag, props, normalizeChildren(children), className, key, ref);
}

export function createCommentVNode(children) {
    return new VNode(Types.HtmlComment, null, EMPTY_OBJ, children);
}

export function createTextVNode(text) {
    return new VNode(Types.Text, null, EMPTY_OBJ, text);
}

export function createVoidVNode() {
    return new VNode(Types.VoidElement, null, EMPTY_OBJ);
}

function normalizeChildren(vNodes) {
    if (isArray(vNodes)) {
        const childNodes = addChild(vNodes, {index: 0});
        return childNodes.length ? childNodes : null;
    }
    return vNodes;
}

function applyKey(vNode, reference) {
    if (isNullOrUndefined(vNode.key)) {
        vNode.key = `.$${reference.index++}`;
    }
    return vNode;
}

function addChild(vNodes, reference) {
    let newVNodes;
    for (let i = 0; i < vNodes.length; i++) {
        const n = vNodes[i];
        if (isNullOrUndefined(n)) {
            if (!newVNodes) {
                newVNodes = vNodes.slice(0, i);
            }
        } else if (isArray(n)) {
            if (!newVNodes) {
                newVNodes = vNodes.slice(0, i);
            }
            newVNodes = newVNodes.concat(addChild(n, reference));
        } else if (isStringOrNumber(n)) {
            if (!newVNodes) {
                newVNodes = vNodes.slice(0, i);
            }
            newVNodes.push(applyKey(createTextVNode(n), reference));
        } else if (n.type) {
            if (!newVNodes) {
                newVNodes = vNodes.slice(0, i);
            }
            newVNodes.push(applyKey(n, reference));
        }
    }
    return newVNodes || vNodes;
}
