'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};

var Types = {
    Text: 1,
    HtmlElement: 2,

    Component: 4
};
Types.Element = Types.Text | Types.HtmlElement;

var a = 2;
console.log(a);

function VNode(type, tag, props, children) {
    this.type = type;
    this.tag = tag;
    this.props = props;
    this.children = children;
}

function createVNode(type, tag, props, children) {
    if (!type) type = detectType(type);
    props || (props = {});
    return new VNode(type, tag, props, children);
}

function detectType(type, tag) {
    switch (typeof tag === 'undefined' ? 'undefined' : _typeof(tag)) {
        case 'function':
            return Types.Component;
        case 'string':
            return Types.Element;
        default:
            throw new Error('Unknown type');
    }
}

exports.Types = Types;
exports.VNode = VNode;
exports.createVNode = createVNode;
exports.detectType = detectType;
