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

export function VNode(type, tag, props, children) {
    this.type = type;
    this.tag = tag;
    this.props = props;
    this.children = children;
    this.key = props.key;
    this.ref = props.ref;
} 

export function createVNode(tag, props, children) {
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

    return new VNode(type, tag, props, normalizeChildren(children));
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
    if (isNullOrUndefined(vNodes)) return vNodes;
    const childNodes = [];
    addChild(vNodes, childNodes, 0);
    return childNodes.length ? childNodes : null;
}

function addChild(vNodes, children, index) {
    let hasKeyed = true;
    if (isNullOrUndefined(vNodes)) {
        vNodes = createTextVNode('');
    } else if (isArray(vNodes)) {
        for (let i = 0; i < vNodes.length; i++) {
            if (addChild(vNodes[i], children, index + i)) {
                --index;
            }
        }
        return;
    } else if (isStringOrNumber(vNodes)) {
        vNodes = createTextVNode(vNodes);
    } else if (!vNodes.type){
        throw new Error(`expect a vNode, but got ${vNodes}`);
    }
    if (isNullOrUndefined(vNodes.key)) {
        vNodes.key = `.$${index}`;
        hasKeyed = false;
    }
    children.push(vNodes);
    return hasKeyed;
}
