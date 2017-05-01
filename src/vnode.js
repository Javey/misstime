import {isArray} from './utils';

export const Types = {
    Text: 1,
    HtmlElement: 1 << 1,

    Component: 1 << 2
}
Types.Element = Types.HtmlElement;

export function VNode(type, tag, props, children) {
    this.type = type;
    this.tag = tag;
    this.props = props;
    this.children = children;
    this.key = props.key;
    this.ref = props.ref;
} 

export function createVNode(type, tag, props, children) {
    if (!type) type = detectType(type);
    props || (props = {});
    return new VNode(
        type, tag, props, 
        normalizeChildren(children, type)
    );
}

export function detectType(type, tag) {
    switch (typeof tag) {
        case 'function':
            return Types.Component;
        case 'string':
            return Types.Element;
        default:
            throw new Error('Unknown vNode type');
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
        } else if (vNode.type & (Types.Element | Types.Text)){
            if (vNode.key == null) {
                vNode.key = `.$${index}`;
            }
            children.push(vNode);
        }
    }
}
