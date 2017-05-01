import should from 'should';
import {createVNode as h, Types} from '../src/vnode';
import {render as createElement} from '../src/vdom';
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

    it('patch component', () => {
        const Component = function(props) {
            this.props = props;
        };
        Component.prototype.init = function() {
            return this.dom = createElement(h(Types.HtmlElement, 'div', {
                className: this.props.className
            }, this.props.children));
        };
        Component.prototype.mount = function(vNode) {
            console.log(vNode.dom);
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
        console.log('patch component', vNode);
        console.log(createElement(vNode));
        const NewComponent = function(props) {
            this.props = props;
        }
        NewComponent.prototype.init = function() {
            return this.dom = createElement(h(Types.HtmlElement, 'div', {
                className: this.props.className
            }, [this.props.children, h(Types.Text, null, null, 'Hello')]));
        };
        NewComponent.prototype.mount = function(vNode) {
            console.log(vNode, this.dom);
        }
        var newVNode = h(Types.HtmlElement, 'div', {className: 'container'}, [
            h(Types.Component, NewComponent, {
                className: 'header',
                children: [
                    h(Types.Text, null, null, 'header'),
                    h(Types.Text, null, null, 'new header')
                ]
            }),
            h(Types.HtmlElement, 'article', {className: 'body'}, [
                h(Types.Text, null, null, 'body')
            ])
        ]);
        patch(vNode, newVNode);
    })
})
