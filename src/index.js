import {createVNode, createCommentVNode} from './vnode';
import {patch} from './vpatch';
import {render, removeElement} from './vdom';

export {createVNode as h, patch, render, createCommentVNode as hc, removeElement as remove};
