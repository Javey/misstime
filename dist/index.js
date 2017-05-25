'use strict';

exports.__esModule = true;
exports.hc = exports.render = exports.patch = exports.h = undefined;

var _vnode = require('./vnode');

var _vpatch = require('./vpatch');

var _vdom = require('./vdom');

exports.h = _vnode.createVNode;
exports.patch = _vpatch.patch;
exports.render = _vdom.render;
exports.hc = _vnode.createCommentVNode;