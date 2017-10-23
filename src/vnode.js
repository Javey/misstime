import {
    isArray, isStringOrNumber, isNullOrUndefined, 
    isComponentInstance, browser
} from './utils';

export const Types = {
    Text: 1,
    HtmlElement: 1 << 1,

    ComponentClass: 1 << 2,
    ComponentFunction: 1 << 3,
    ComponentInstance: 1 << 4,

    HtmlComment: 1 << 5,

    InputElement: 1 << 6,
    SelectElement: 1 << 7,
    TextareaElement: 1 << 8,
    SvgElement: 1 << 9,

    UnescapeText: 1 << 10 // for server side render unescape text
};
Types.FormElement = Types.InputElement | Types.SelectElement | Types.TextareaElement;
Types.Element = Types.HtmlElement | Types.FormElement | Types.SvgElement;
Types.ComponentClassOrInstance = Types.ComponentClass | Types.ComponentInstance;
Types.TextElement = Types.Text | Types.HtmlComment;

export const EMPTY_OBJ = {};
if (process.env.NODE_ENV !== 'production' && !browser.isIE) {
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
            if (tag === 'input') {
                type = Types.InputElement;
            } else if(tag === 'select') {
                type = Types.SelectElement;
            } else if (tag === 'textarea') {
                type = Types.TextareaElement;
            } else if (tag === 'svg') {
                type = Types.SvgElement;
            } else {
                type = Types.HtmlElement;
            }
            break;
        case 'function':
            if (tag.prototype.init) {
                type = Types.ComponentClass;
            } else {
                return tag(props);
                // type = Types.ComponentFunction;
            }
            break;
        case 'object':
            if (tag.init) {
                return createComponentInstanceVNode(tag);
            }
        default:
            throw new Error(`unknown vNode type: ${tag}`);
    }

    if (type & Types.ComponentClass) {
        if (!isNullOrUndefined(children)) {
            if (props === EMPTY_OBJ) props = {};
            props.children = normalizeChildren(children);
        } else if (!isNullOrUndefined(props.children)) {
            props.children = normalizeChildren(props.children);
        }
    } else {
        children = normalizeChildren(children);
    }

    return new VNode(type, tag, props, children, 
        className || props.className, 
        key || props.key, 
        ref || props.ref
    );
}

export function createCommentVNode(children) {
    return new VNode(Types.HtmlComment, null, EMPTY_OBJ, children);
}

export function createUnescapeTextVNode(children) {
    return new VNode(Types.UnescapeText, null, EMPTY_OBJ, children);
}

export function createTextVNode(text) {
    return new VNode(Types.Text, null, EMPTY_OBJ, text);
}

export function createVoidVNode() {
    return new VNode(Types.VoidElement, null, EMPTY_OBJ);
}

export function createComponentInstanceVNode(instance) {
    const props = instance.props || EMPTY_OBJ;
    return new VNode(Types.ComponentInstance, instance.constructor, 
        props, instance, null, props.key, props.ref
    );
}

function normalizeChildren(vNodes) {
    if (isArray(vNodes)) {
        const childNodes = addChild(vNodes, {index: 0});
        return childNodes.length ? childNodes : null;
    } else if (isComponentInstance(vNodes)) {
        return createComponentInstanceVNode(vNodes);
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
        } else if (isComponentInstance(n)) {
            if (!newVNodes) {
                newVNodes = vNodes.slice(0, i);
            }
            newVNodes.push(applyKey(createComponentInstanceVNode(n), reference));
        } else if (n.type) {
            if (!newVNodes) {
                newVNodes = vNodes.slice(0, i);
            }
            newVNodes.push(applyKey(n, reference));
        }
    }
    return newVNodes || vNodes;
}
