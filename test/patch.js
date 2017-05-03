import {h, render, patch} from '../src';
import assert from 'assert';

class ClassComponent {
    constructor(props) {
        this.props = props;
    }
    init() { 
        return this.dom = render(h('span', this.props, this.props.children));
    }
    update() {
        return this.dom;
    }
} 

function FunctionComponent(props) {
    return h('p', props, props.children);
}


describe('Patch', () => {
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
    function p(lastVNode, nextVNode) {
        r(lastVNode);
        patch(lastVNode, nextVNode);
    }
    function eql(lastVNode, nextVNode, html) {
        p(lastVNode, nextVNode);
        eqlHtml(html);
    }
    function sEql(a, b) {
        assert.strictEqual(a, b);
    }

    it('patch elements', () => {
        eql(
            h('div'),
            h('span'),
            '<span></span>'
        );

        eql(
            h('div', null, h('span')),
            h('div', null, h('div')),
            '<div><div></div></div>'
        );
    });

    it('patch properties', () => {
        eql(
            h('div', {className: 'a'}),
            h('div', {className: 'b'}),
            '<div class="b"></div>'
        );

        eql(
            h('div', {className: 'a'}, h('span', {className: 'aa'})),
            h('div', {className: 'b'}, h('span', {className: 'bb'})),
            '<div class="b"><span class="bb"></span></div>'
        );

        eql(
            h('div', null, [
                h('span', {className: 'a'}),
                h('div', {className: 'b'})
            ]),
            h('div', null, [
                h('div', {className: 'b'}),
                h('span', {className: 'c'})
            ]),
            '<div><div class="b"></div><span class="c"></span></div>'
        );

        eql(
            h('div', {className: 'a'}),
            h('div'),
            '<div class=""></div>'
        );

        eql(
            h('div'),
            h('div', {className: 'a'}),
            '<div class="a"></div>'
        );

        eql(
            h('div'),
            h('div', {className: undefined}),
            '<div class=""></div>'
        );
    });
    
    it('patch style', () => {
        eql(
            h('div', {style: 'color: red; font-size: 20px'}),
            h('div', {style: 'color: red;'}),
            '<div style="color: red;"></div>'
        );
        eql(
            h('div', {style: {color: 'red', fontSize: '20px'}}),
            h('div', {style: {color: 'red'}}),
            '<div style="color: red;"></div>'
        );
        eql(
            h('div', {style: {color: 'red', fontSize: '20px'}}),
            h('div', {style: 'color: red;'}),
            '<div style="color: red;"></div>'
        );
        eql(
            h('div', {style: 'color: red; font-size: 20px'}),
            h('div', {style: {color: 'red'}}),
            '<div style="color: red;"></div>'
        );
    });

    it('patch dataset', () => {
        eql(
            h('div', {dataset: {a: 1, b: 'b'}}),
            h('div', {dataset: {a: 2, c: 'c'}}),
            '<div data-a="2" data-c="c"></div>'
        );
        eql(
            h('div'),
            h('div', {dataset: {a: 2, c: 'c'}}),
            '<div data-a="2" data-c="c"></div>'
        );
        eql(
            h('div', {dataset: null}),
            h('div', {dataset: {a: 2, c: 'c'}}),
            '<div data-a="2" data-c="c"></div>'
        );
        eql(
            h('div'),
            h('div', {dataset: {a: 2, c: 'c'}}),
            '<div data-a="2" data-c="c"></div>'
        );
        eql(
            h('div', {dataset: {a: 1, b: 'b'}}),
            h('div', {dataset: null}),
            '<div></div>'
        );
    });

    it('patch attributes', () => {
        eql(
            h('div', {attributes: {a: 1, b: 'b'}}),
            h('div', {attributes: {a: 2, c: 'c'}}),
            '<div a="2" c="c"></div>'
        );

        eql(
            h('div', {attributes: {a: 1, b: 'b'}}),
            h('div', {attributes: null}),
            '<div></div>'
        );

        eql(
            h('div', {attributes: {a: 1, b: 'b'}}),
            h('div'),
            '<div></div>'
        );

        eql(
            h('div'),
            h('div', {attributes: {a: 2, c: 'c'}}),
            '<div a="2" c="c"></div>'
        );

        eql(
            h('div', {attributes: {a: 1, b: 'b'}}),
            h('div', {attributes: {a: null, c: 'c'}}),
            '<div c="c"></div>'
        );
    });

    it('patch object property', () => {
        eql(
            h('div', {p: {a: 1, b: 'b'}}),
            h('div', {p: {a: 2, c: 'c'}}),
            '<div></div>'
        );
        assert.strictEqual(container.firstChild.p.a, 2);
        assert.strictEqual(container.firstChild.p.c, 'c');
        assert.strictEqual(container.firstChild.p.b, undefined);

        eql(
            h('div', {p: {a: 1, b: 'b'}}),
            h('div'),
            '<div></div>'
        );
        assert.strictEqual(container.firstChild.p, undefined);
    });

    it('patch select', () => {
        eql(
            h('select', null, [
                h('option', null, '1'),
                h('option', {selected: true}, '2'),
                h('option', null, '3'),
            ]),
            h('select', null, [
                h('option', null, '1'),
                h('option', null, '2'),
                h('option', {selected: true}, '3'),
            ]),
            '<select><option>1</option><option>2</option><option>3</option></select>'
        );
        assert.strictEqual(container.firstChild.children[1].selected, false);
        assert.strictEqual(container.firstChild.children[2].selected, true);

        eql(
            h('select', null, [
                h('option', {key: 1, selected: true}, '1'),
                h('option', {key: 2}, '2'),
                h('option', {key: 3}, '3'),
            ]),
            h('select', null, [
                h('option', {key: 4, selected: true}, '1'),
                h('option', {key: 2}, '2'),
                h('option', {key: 3}, '3'),
            ]),
            '<select><option>1</option><option>2</option><option>3</option></select>'
        );

        assert.strictEqual(container.firstChild.children[0].selected, true);
        assert.strictEqual(container.firstChild.children[1].selected, false);
    });

    it('patch children', () => {
        eql(
            h('div', null, [h('span'), 'test', null, undefined, 'hello']),
            h('div', null, ['test', h('span', {className: 'a'})]),
            '<div>test<span class="a"></span></div>'
        );
        eql(
            h('div', null, [[h('span'), 'test'], [null], [['hello']]]),
            h('div', null, [['test'], [h('span', {className: 'a'})]]),
            '<div>test<span class="a"></span></div>'
        );
    });

    it('patch ref', () => {
        const a = {};
        eql(
            h('div', {ref: (dom) => a.dom = dom}),
            h('div', {ref: (dom) => a.newDom = dom}),
            '<div></div>'
        );
        assert.strictEqual(a.dom, a.newDom);

        eql(
            h('div', {ref: (dom) => a.dom = dom}),
            h('span', {ref: (dom) => a.newDom = dom}),
            '<span></span>'
        );
        assert.strictEqual(a.dom, null);
        assert.strictEqual(a.newDom, container.firstChild);
    });

    it('patch class component with element', () => {
        eql(
            h('div', null, h('div')),
            h('div', null, h(ClassComponent)),
            '<div><span></span></div>'
        );
    });

    it('patch function component with element', () => {
        eql(
            h('div', null, h('div')),
            h('div', null, h(FunctionComponent)),
            '<div><p></p></div>'
        );
    });

    it('patch class component with function component', () => {
        eql(
            h('div', null, h(ClassComponent)),
            h('div', null, h(FunctionComponent)),
            '<div><p></p></div>'
        );

        eql(
            h('div', null, h(FunctionComponent)),
            h('div', null, h(ClassComponent)),
            '<div><span></span></div>'
        );
    });

    it('remove function component', () => {
        const o = {};
        eql(
            h('div', null, h(FunctionComponent, {
                children: [
                    h('b'),
                    h(ClassComponent, {ref: (i) => o.i = i})
                ]
            })),
            h('div'),
            '<div></div>'
        );
        sEql(o.i, null);
    });

    it('remove class component', () => {
        const o = {};
        eql(
            h('div', null, h(ClassComponent, {
                children: [
                    h('b'),
                    h(FunctionComponent, {ref: (i) => o.i = i})
                ]
            })),
            h('div'),
            '<div></div>'
        );
        sEql(o.i, null);
    });

    describe('Event', () => {
        it('patch event', () => {
            const fn = sinon.spy();
            const newFn = sinon.spy(); 
            p(
                h('div', {'ev-click': fn}),
                h('div', {'ev-click': newFn})
            );
            container.firstChild.click();
            sEql(fn.callCount, 0);
            sEql(newFn.callCount, 1);
        });
        
        it('remove event', () => {
            const fn = sinon.spy();
            p(
                h('div', {'ev-click': fn}),
                h('div')
            );
            container.firstChild.click();
            sEql(fn.callCount, 0);
        });

        it('add event', () => {
            const fn = sinon.spy();
            p(
                h('div'),
                h('div', {'ev-click': fn})
            );
            container.firstChild.click();
            sEql(fn.callCount, 1);
        });

        it('patch event on children', () => {
            const fn = sinon.spy();
            const newFn = sinon.spy();
            p(
                h('div', null, h('div', {'ev-click': fn})),
                h('div', null, h('div', {'ev-click': newFn}))
            );
            container.firstChild.firstChild.click();
            sEql(fn.callCount, 0);
            sEql(newFn.callCount, 1);
        });
    });

    describe('Key', () => {
        function createVNodeFromArray(arr) {
            return h('div', null, arr.map(value => h('span', {key: value})));
        }
        function saveChildren() {
            return Array.prototype.slice.call(container.firstChild.children, 0);
        }

        it('reorder children', () => {
            const vNode = createVNodeFromArray([1, 2, '3', 'test', 'a']);
            r(vNode);
            const childNodes = saveChildren();

            patch(vNode, createVNodeFromArray([2, '3', 1, 'a', 'test']));

            [1, 2, 0, 4, 3].forEach((order, index) => {
                sEql(container.firstChild.children[index], childNodes[order]);
            });
        });

        it('mix keys without keys', () => {
            const vNode = h('div', null, [
                h('span'),
                h('span', {key: 1}),
                h('span', {key: 2}),
                h('span'),
                h('span')
            ]);
            r(vNode);
            const childNodes = saveChildren();

            patch(vNode, h('div', null, [
                h('span', {key: 1}),
                h('span'),
                h('span'),
                h('span', {key: 2}),
                h('span')
            ]));

            [1, 0, 3, 2, 4].forEach((order, index) => {
                sEql(container.firstChild.children[index], childNodes[order]);
            });
        });

        it('missing key will be removed and insert a new node', () => {
            const vNode = h('div', null, [
                h('span', {key: 1}),
                h('span'),
                h('span')
            ]);
            r(vNode);
            const childNodes = saveChildren(); 
            patch(vNode, h('div', null, [
                h('span'),
                h('span'),
                h('span')
            ]));

            sEql(container.firstChild.children[0], childNodes[1]);
            sEql(container.firstChild.children[1], childNodes[2]);
            sEql(container.firstChild.children[2] === childNodes[0], false);
        });

        it('key in component', () => {
            function run(Component) {
                reset();
                function create(arr) {
                    return h('div', null, arr.map(value => h(Component, {key: value})));
                }
                const vNode = create([1, 2, 3]);
                r(vNode);
                const childNodes = saveChildren();
                patch(vNode, create([2, 1, 3]));

                [1, 0, 2].forEach((order, index) => {
                    sEql(container.firstChild.children[index], childNodes[order]);
                });
            }

            run(ClassComponent);
            run(FunctionComponent);
        });

        it('key in class component with element', () => {
            const vNode = h('div', null, [
                h('div', {key: 1}),
                h(ClassComponent, {key: 2}),
                h(FunctionComponent, {key: 3})
            ]);
            r(vNode);
            const childNodes = saveChildren();
            patch(vNode, h('div', null, [
                h(FunctionComponent, {key: 3}),
                h('div', {key: 1}),
                h(ClassComponent, {key: 2})
            ]));

            [2, 0, 1].forEach((order, index) => {
                sEql(container.firstChild.children[index], childNodes[order]);
            });
        });
    });
});
