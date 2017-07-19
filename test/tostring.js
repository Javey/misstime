import {toString} from '../src/tostring';
import {h, hc, render} from '../src';

describe('toString', () => {
    it('test', () => {
        const vNode = h('div', {style: 'background: red;'}, 'test');
        console.log(toString(vNode));
    });
});
