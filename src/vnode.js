import {isArray} from './utils';

export const Types = {
    Text: 1,
    HtmlElement: 1 << 1,

    ComponentClass: 1 << 2,
    ComponentFunction: 1 << 3
}
Types.Element = Types.HtmlElement;
Types.Component = Types.ComponentClass | Types.ComponentFunction;

export function VNode(type, tag, props, children) {
    this.type = type;
    this.tag = tag;
    this.props = props;
    this.children = children;
    this.key = props.key;
    this.ref = props.ref;
} 

export function createVNode(type, tag, props, children) {
    if (!type || type & Types.Component) type = detectType(tag);
    props || (props = {});
    return new VNode(
        type, tag, props, 
        normalizeChildren(children, type)
    );
}

export function detectType(tag) {
    switch (typeof tag) {
        case 'function':
            if (tag.prototype.init) {
                return Types.ComponentClass;
            } else {
                return Types.ComponentFunction;
            }
        case 'string':
            return Types.Element;
        default:
            throw new Error(`unknown vNode type: ${tag}`);
    }
}

function normalizeChildren(vNodes, type) {
    if (!vNodes || (type & Types.Text)) return vNodes;
    const childNodes = [];
    addChild(vNodes, childNodes, 0);
    return childNodes;
}

function addChild(vNodes, children, index) {
    for (let i = 0; i < vNodes.length; i++) {
        let vNode = vNodes[i];
        if (isArray(vNode)) {
            addChild(vNode, children, index);
        } else if (vNode.type & (Types.Element | Types.Text | Types.Component)){
            if (vNode.key == null) {
                vNode.key = `.$${index}`;
            }
            children.push(vNode);
        }
    }
}
