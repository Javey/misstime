import should from 'should';
import {createVNode as h, Types} from '../src/vnode';
import {createElement} from '../src/vdom';
import {patch} from '../src/vpatch';

describe('vpath', () => {
    it('patch vnode', () => {
        var vNode = h(Types.HtmlElement, 'div', {className: 'container'}, [
            h(Types.HtmlElement, 'header', {className: 'header'}, [
                h(Types.Text, null, null, 'header')
            ]),
            h(Types.HtmlElement, 'article', {className: 'body'}, [
                h(Types.Text, null, null, 'body')
            ])
        ]);
        var dom = createElement(vNode);
        console.log(dom.cloneNode(true));
        var vNode1 = h(Types.HtmlElement, 'div', {className: 'container1'}, [
            h(Types.HtmlElement, 'article', {className: 'body1'}, [
                h(Types.Text, null, null, 'body')
            ])
        ]);
        dom = patch(vNode, vNode1);
        console.log(dom.cloneNode(true));
    });
})
