import {h} from '../src';
import assert from 'assert';

describe('VNode', () => {
    it('normalize children', () => {
        const vNodes = [
            h('i', {key: 'a'}),
            h('i', {key: 'b'}),
            h('i')
        ];
        const vNode1 = h('span', null, vNodes);
        const vNode2 = h('i', null, [
            h('i'), 
            vNodes,
            h('i')
        ]);
        ['.$0', 'a', 'b', '.$1.$0', '.$2'].forEach((item, index) => {
            assert.strictEqual(vNode2.children[index].key === item, true);
        });
    });
});
