import should from 'should';
import {createVNode as h, Types} from '../src/vnode';
import {createElement} from '../src/vdom';
import {patch} from '../src/vpatch';
import util from 'util';

describe('vnode', () => {
    it('createVNode', () => {
        var vnode = h(Types.HtmlElement, 'div', {className: 'container'}, [
            h(Types.HtmlElement, 'header', {className: 'header'}, [
                h(Types.Text, null, null, 'header')
            ]),
            h(Types.HtmlElement, 'article', {className: 'body'}, [
                h(Types.Text, null, null, 'body')
            ])
        ]);
        console.log(vnode);
        var dom = createElement(vnode);
        console.log(dom.cloneNode(true));
        var newVNode = h(Types.HtmlElement, 'div', {className: 'container'}, null);
        console.log(newVNode);
        console.log(patch(vnode, newVNode).cloneNode(true));

        var newVNode1 = h(Types.HtmlElement, 'div', {className: 'container'}, [
            h(Types.HtmlElement, 'header', {className: 'header'}, [
                h(Types.Text, null, null, 'header')
            ])
        ]);
        console.log(newVNode1);
        console.log(patch(newVNode, newVNode1).cloneNode(true));
    })
    it('createVNode benchmark', () => {
        const start = performance.now();
        const list = [];
        for (let i = 0; i < 10000; i++) {
            list.push(h(Types.HtmlElement, 'li', {className: 'li'}, [
                h(Types.Text, null, null, i)
            ]));
        }
        var vNode = h(Types.HtmlElement, 'ul', {className: 'ul'}, list);
        console.log(performance.now() - start);
        console.log(vNode);
    })
})

function log(info) {
    console.log(util.inspect(info, {
        showHidden: true,
        depth: null
    }));
}
