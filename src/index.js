import {createVNode, createCommentVNode} from './vnode';
import {patch} from './vpatch';
import {render, removeElement} from './vdom';
import {MountedQueue} from './utils';
import {toString} from './tostring';

export {
    createVNode as h, patch, render, 
    createCommentVNode as hc, 
    removeElement as remove,
    MountedQueue,
    toString as renderString
};
