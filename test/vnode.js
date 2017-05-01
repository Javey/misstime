import should from 'should';
import {createVNode as h, Types} from '../src/vnode';
import {render as createElement} from '../src/vdom';
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
    
    it('create component', () => {
        const Component = function(props) {
            this.props = props;
        };
        Component.prototype.init = function() {
            this.dom = createElement(h(Types.HtmlElement, 'div', {
                className: this.props.className
            }, this.props.children));
            return this.dom;
        };
        Component.prototype.mount = function() {
            console.log(this.dom);
        }
        var vNode = h(Types.HtmlElement, 'div', {className: 'container'}, [
            h(Types.Component, Component, {
                className: 'header',
                children: [
                    h(Types.Text, null, null, 'header')
                ]
            }),
            h(Types.HtmlElement, 'article', {className: 'body'}, [
                h(Types.Text, null, null, 'body')
            ])
        ]);
        console.log('create component', vNode);
        console.log(createElement(vNode));
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

    it('handle event', () => {
        var vNode = h(Types.HtmlElement, 'div', {
            className: 'container',
            'ev-click': function(e) {
                console.log('click', e);
            }
        }, [
            h(Types.HtmlElement, 'header', {className: 'header'}, [
                h(Types.Text, null, null, 'header')
            ])
        ]);
        const dom = createElement(vNode);
        document.body.appendChild(dom);
    });

    it('patch event', () => {
        var vNode = h(Types.HtmlElement, 'div', {
            className: 'container',
            'ev-click': function(e) {
                console.log('click', e);
            }
        }, [
            h(Types.HtmlElement, 'header', {className: 'header'}, [
                h(Types.Text, null, null, 'header')
            ])
        ]);
        const dom = createElement(vNode);
        document.body.appendChild(dom);
        var newVNode = h(Types.HtmlElement, 'div', {
            className: 'container',
            'ev-click': function(e) {
                console.log('new click', e);
            }
        }, [
            h(Types.HtmlElement, 'header', {className: 'header'}, [
                h(Types.Text, null, null, 'header')
            ])
        ]);
        patch(vNode, newVNode);
    })

    it('handle ref', () => {
        var vNode = h(Types.HtmlElement, 'div', {
            className: 'container',
            ref: (dom) => window.__test = dom
        }, [
            h(Types.HtmlElement, 'header', {className: 'header'}, [
                h(Types.Text, null, null, 'header')
            ])
        ]);
        const dom = createElement(vNode);
        console.log('ref', window.__test); 
    })
})

function log(info) {
    console.log(util.inspect(info, {
        showHidden: true,
        depth: null
    }));
}
