import {h, render} from '../src';
import assert from 'assert';

class ClassComponent {
    constructor(props) {
        this.props = props;
    }
    init() {
        return render(h('span', this.props, this.props.children));
    }
}

function FunctionComponent(props) {
    return h('p', {
        className: props.className
    }, props.children);
}

describe('Render', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    function reset() {
        container.innerHTML = '';
    }
    function eqlHtml(html) {
        assert.strictEqual(container.innerHTML, html);
    }
    function r(vNode) {
        reset();
        render(vNode, container);
    }
    function eql(vNode, html) {
        r(vNode);
        eqlHtml(html);
    }

    it('render null', () => {
        eql(null, '');
    });

    it('render div', () => {
        eql(h('div'), '<div></div>');
        assert.strictEqual(container.children.length, 1);
    });

    it('render invalid node should throw an error', () => {
        assert.throws(function() {eql(h('div', null, true));});
    });

    it('render properties', () => {
        const div = h('div', {className: 'test', id: 'test'});
        eql(div, '<div class="test" id="test"></div>');
        assert.strictEqual(container.children.length, 1);
    });

    it('render style', () => {
        eql(
            h('div', {style: 'color: red; font-size: 20px'}),
            '<div style="color: red; font-size: 20px;"></div>'
        );
        eql(
            h('div', {style: {color: 'red', fontSize: '20px'}}),
            '<div style="color: red; font-size: 20px;"></div>'
        );
    });

    it('render dataset', () => {
        eql(
            h('div', {dataset: {a: 1, b: 'b'}}),
            '<div data-a="1" data-b="b"></div>'
        );
    });

    it('render attributes', () => {
        eql(
            h('div', {attributes: {a: 1, b: 'b'}}),
            '<div a="1" b="b"></div>'
        );
    });

    it('render object property', () => {
        eql(
            h('div', {a: {b: 1}}),
            '<div></div>'
        );
        assert.strictEqual(container.firstChild.a.b, 1);
    });

    it('render children', () => {
        eql(
            h('div', {className: 'test'}, 'test'),
            '<div class="test">test</div>'
        );
        eql(
            h('div', null, ['text', 0]),
            '<div>text0</div>'
        );
        eql(
            h('div', null, ['text', h('div')]),
            '<div>text<div></div></div>'
        );
        eql(
            h('div', {}, [undefined, 'text']),
            '<div>text</div>'
        );
    });

    it('render nested children', () => {
        eql(
            h('div', null, [['text', [h('div')]]]),
            '<div>text<div></div></div>'
        );
    });

    it('render function component children', () => {
        function Component(props) {
            return h('span', {
                className: props.className
            }, props.children);
        }
        eql(
            h('div', null, h(Component, {
                className: 'component',
                children: 'text'
            })),
            '<div><span class="component">text</span></div>'
        );
        eql(
            h('div', null, h(Component, {
                className: 'component'
            })),
            '<div><span class="component"></span></div>'
        );
        eql(
            h('div', null, h(Component, {
                className: 'component',
                children: h(Component)
            })),
            '<div><span class="component"><span></span></span></div>'
        );
    });

    it('render class component children', () => {
        class Component {
            constructor(props) {
                this.props = props;
            }
            init() {
                return render(h('span', this.props, this.props.children));
            }
        }
        eql(
            h('div', null, h(Component, {
                className: 'test'
            })),
            '<div><span class="test"></span></div>'
        );
        eql(
            h('div', null, h(Component, {
                className: 'test',
                children: 'text'
            })),
            '<div><span class="test">text</span></div>'
        );
        eql(
            h('div', null, h(Component, {
                className: 'test',
                children: h(Component)
            })),
            '<div><span class="test"><span></span></span></div>'
        );
    });

    it('render class component in function component', () => {
        eql(
            h('div', null, h(FunctionComponent, {
                children: [
                    h(ClassComponent),
                    h('i')
                ]
            })),
            '<div><p><span></span><i></i></p></div>'
        );
    });

    it('render function component in class component', () => {
        eql(
            h('div', null, h(ClassComponent, {
                children: [
                    h(FunctionComponent),
                    h('i')
                ]
            })),
            '<div><span><p></p><i></i></span></div>'
        );
    });

    it('render div with ref', () => {
        const o = {};
        eql(
            h('div', {ref: (dom) => o.dom = dom, className: 'test'}),
            '<div class="test"></div>'
        );
        assert.strictEqual(o.dom, container.firstChild);
    });

    it('render function component with ref', () => {
        const o = {};
        function C(props) {
            return h('span', props, props.children);
        }
        eql(
            h(C, {
                ref: (dom) => o.dom = dom,
                className: 'test',
                children: 'text'
            }),
            '<span class="test">text</span>'
        );
        assert.strictEqual(o.dom, container.firstChild);
    });

    it('render class component with ref', () => {
        const o = {};
        class C {
            constructor(props) {
                this.props = props;
            }
            init() {
                o._instance = this;
                return render(h('span', this.props, this.props.children));
            }
        }
        eql(
            h(C, {
                ref: (instance) => o.instance = instance,
                className: 'test',
                children: 'text'
            }),
            '<span class="test">text</span>'
        );
        assert.strictEqual(o.instance, o._instance);
    });

    it('render ref with nested component', () => {
        const o = {};
        eql(
            h(ClassComponent, {
                children: [
                    h(FunctionComponent, {ref: (i) => o.i = i})
                ]
            }),
            '<span><p></p></span>'
        );
        assert.strictEqual(o.i, container.firstChild.firstChild);

        eql(
            h(FunctionComponent, {
                children: [
                    h(ClassComponent, {ref: (i) => o.j = i})
                ]
            }),
            '<p><span></span></p>'
        );
        assert.strictEqual(o.j instanceof ClassComponent, true);
    });

    describe('Event', () => {
        it('attach event listener', () => {
            const fn = sinon.spy();
            r(h('div', {'ev-click': fn}));
            container.firstChild.click();
            assert.strictEqual(fn.callCount, 1);
            assert.strictEqual(fn.args[0].length, 1);
            assert.strictEqual(fn.args[0][0].type, 'click');
            assert.strictEqual(fn.args[0][0].target, container.firstChild);
            assert.strictEqual(fn.args[0][0].currentTarget, container.firstChild);

            container.firstChild.click();
            assert.strictEqual(fn.callCount, 2);
        });

        it('trigger event on child node', () => {
            const fn = sinon.spy();
            r(h('div', {'ev-click': fn}, h('div')));
            container.firstChild.firstChild.click();
            assert.strictEqual(fn.callCount, 1);
            assert.strictEqual(fn.args[0][0].target, container.firstChild.firstChild);
            assert.strictEqual(fn.args[0][0].currentTarget, container.firstChild);
        });

        it('event bubble', () => {
            const currentTargets = [];
            const fn1 = sinon.spy((e) => currentTargets.push(e.currentTarget));
            const fn2 = sinon.spy((e) => currentTargets.push(e.currentTarget));
            r(h('p', {'ev-click': fn2}, h('span', {'ev-click': fn1})));
            container.firstChild.firstChild.click();
            assert.strictEqual(fn1.callCount, 1);
            assert.strictEqual(fn2.callCount, 1);
            assert.strictEqual(fn2.calledAfter(fn1), true);
            assert.strictEqual(fn1.args[0][0].target, container.firstChild.firstChild);
            assert.strictEqual(currentTargets[0], container.firstChild.firstChild);
            assert.strictEqual(fn2.args[0][0].target, container.firstChild.firstChild);
            assert.strictEqual(currentTargets[1], container.firstChild);
        });

        it('stop event bubble', () => {
            const fn1 = sinon.spy((e) => e.stopPropagation());
            const fn2 = sinon.spy();
            r(h('p', {'ev-click': fn2}, h('span', {'ev-click': fn1})));
            container.firstChild.firstChild.click();
            assert.strictEqual(fn1.callCount, 1);
            assert.strictEqual(fn2.callCount, 0);
        });

        it('prevent default', () => {
            const url = location.href;
            const fn = sinon.spy((e) => e.preventDefault());
            r(h('a', {'ev-click': fn, href: "https://www.baidu.com"}));
            container.firstChild.click();
            assert.strictEqual(location.href, url);
        });
    });

    describe('Class Component', () => {
        let C;
        let init;
        let mount;

        beforeEach(() => {
            init = sinon.spy((lastVNode, vNode) => {
                return render(h('div', vNode.props, vNode.props.children));
            });
            mount = sinon.spy((lastVNode, vNode) => {
                assert.strictEqual(container.firstChild, vNode.dom);
            });
            C = function(props) {
                this.props = props;
            };
            C.prototype.init = init;
            C.prototype.mount = mount;
        });

        it('init and mount', () => {
            const vNode = h(C, {className: 'test', children: 'text'});
            r(vNode);
            assert.strictEqual(init.callCount, 1);
            assert.strictEqual(init.calledWith(undefined, vNode), true);
            assert.strictEqual(mount.callCount, 1);
            assert.strictEqual(mount.calledWith(undefined, vNode), true);
            assert.strictEqual(mount.calledAfter(init), true);
        }); 
    });
});
