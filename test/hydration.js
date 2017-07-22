import {hydrateRoot} from '../src/hydration';
import {h, hc, renderString, patch} from '../src';
import assert from 'assert';
import {eqlHtml} from './utils';

function sEql(a, b) {
    assert.strictEqual(a, b);
}

describe('hydrate', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        // document.body.removeChild(container);
    });

    function hy(vNode) {
        container.innerHTML = renderString(vNode);
        hydrateRoot(vNode, container);
    }

    it('hydrate element', () => {
        const vNode = h('div', {id: 'test'}, 'test', 'test');
        container.innerHTML = renderString(vNode);
        hydrateRoot(vNode, container);
        sEql(vNode.dom, container.firstChild);

        patch(vNode, h('div', null, 'hello'));
        eqlHtml(container, '<div>hello</div>');
    });

    it('hydrate text element', () => {
        const vNode = h('div', null, ['test']);
        hy(vNode);
        sEql(vNode.children[0].dom, container.firstChild.firstChild);

        patch(vNode, h('div', null, ['hello']));
        eqlHtml(container, '<div>hello</div>');
    });

    it('hydrate text elements', () => {
        const vNode = h('div', null, ['test1', 'test2']);
        container.innerHTML = renderString(vNode);
        hy(vNode);
        sEql(vNode.children[0].dom, container.firstChild.childNodes[0]);
        sEql(vNode.children[1].dom, container.firstChild.childNodes[1]);
        sEql(container.firstChild.childNodes.length, 2);

        patch(vNode, h('div', null, ['test3']));
        eqlHtml(container, '<div>test3</div>');
    });
});
