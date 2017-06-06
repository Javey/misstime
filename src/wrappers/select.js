import {isNullOrUndefined, isArray, indexOf} from '../utils';

export function processSelect(vNode, dom, nextProps, isRender) {
    const multiple = nextProps.multiple;
    if (multiple !== dom.multiple) {
        dom.multiple = multiple;
    }
    const children = vNode.children;

    if (!isNullOrUndefined(children)) {
        let value = nextProps.value;
        if (isRender && isNullOrUndefined(value)) {
            value = nextProps.defaultValue;
        }
        
        if (multiple) {
            if (isArray(children)) {
                for (let i = 0; i < children.length; i++) {
                    updateChildOptionGroup(children[i], value);
                }
            } else {
                updateChildOptionGroup(children, value);
            }
        } else {
            dom.value = value;
        }
    }
}

function updateChildOptionGroup(vNode, value) {
    const tag = vNode.tag;

    if (tag === 'optgroup') {
        const children = vNode.children;

        if (isArray(children)) {
            for (let i = 0; i < children.length; i++) {
                updateChildOption(children[i], value);
            }
        } else {
            updateChildOption(children, value);
        }
    } else {
        updateChildOption(vNode, value);
    }
}

function updateChildOption(vNode, value) {
    const props = vNode.props;
    const dom = vNode.dom;

    dom.value = props.value;
    if (isArray(value) && indexOf(value, props.value) !== -1 || props.value === value) {
        dom.selected = true;
    } else if (!isNullOrUndefined(value) || !isNullOrUndefined(props.selected)) {
        dom.selected = !!props.selected;
    }
}
