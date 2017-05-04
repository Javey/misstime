import {createVNode, createCommentVNode} from './vnode';
import {patch} from './vpatch';
import {render} from './vdom';

export {createVNode as h, patch, render, createCommentVNode as hc};
