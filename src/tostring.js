import {Types, EMPTY_OBJ} from './vnode';
import {isNullOrUndefined, isArray} from './utils';

export function toString(vNode, parent, firstChild) {
    const type = vNode.type;
    const tag = vNode.tag;
    const props = vNode.props;
    const children = vNode.children;

    let html;
    if (type & Types.ComponentClass) {
        const instance = new tag(props); 
        html = instance.init(null, vNode);
    } else if (type & Types.ComponentInstance) {
        html = vNode.children.init(null, vNode);
    } else if (type & Types.Element) {
        let innerHTML;
        html = `<${tag}`;

        if (!isNullOrUndefined(vNode.className)) {
            html += ` class="${escapeText(vNode.className)}"`;
        }

        if (props !== EMPTY_OBJ) {
            for (let prop in props) {
                const value = props[prop];
                
                if (prop === 'innerHTML') {
                    innerHTML = value;
                } else if (prop === 'style') {
                    html += ` style="${value}"`;
                } else if (prop === 'children') {

                } else if (prop === 'defaultValue') {
                    if (isNullOrUndefined(props.value)) {
                        html += ` value="${escapeText(value)}"`;
                    }
                } else if (prop === 'defaultChecked') {
                    if (isNullOrUndefined(props.checked)) {
                        html += ` checked="${value}"`;
                    }
                } else if (tag === 'option' && prop === 'value') {
                    if (value === parent.props.value) {
                        html += ` selected`;
                    }
                } else {
                    if (typeof value === 'string') {
                        html += ` ${prop}="${escapeText(value)}"`;
                    } else if (typeof value === 'number') {
                        html += ` ${prop}="${value}"`;
                    } else if (value === true) {
                        html += ` ${prop}`;
                    }
                }
            }
        }

        html += `>`;
        if (children) {
            if (typeof children === 'string') {
                html += children === '' ? ' ' : escapeText(children);
            } else if (typeof children === 'number') {
                html += children;
            } else if (isArray(children)) {
                for (let i = 0; i < children.length; i++) {
                    const child = children[i];
                    if (typeof child === 'string') {
                        html += child === '' ? ' ' : escapeText(child);
                    } else if (typeof child === 'number') {
                        html += child;
                    } else {
                        html += toString(child, vNode, i === 0);
                    }
                }
            } else {
                html += toString(children, vNode, true);
            }
        } else if (innerHTML) {
            html += innerHTML;
        }

        html += `</${tag}>`;
    } else if (type & Type.Text) {
        html = (firstChild ? '' : '<!---->') + (children === '' ? ' ' : escapeText(children));
    } else if (type & Type.HtmlComment) {
        html = `<!--${children}-->`;
    } else {
        throw new Error(`Unknown vNode: ${vNode}`);
    }

    return html;
}

export function escapeText(text) {
    let result = text;
    let escapeString = "";
    let start = 0;
    let i;
    for (i = 0; i < text.length; i++) {
        switch (text.charCodeAt(i)) {
            case 34: // "
                escapeString = "&quot;";
                break;
            case 39: // \
                escapeString = "&#039;";
                break;
            case 38: // &
                escapeString = "&amp;";
                break;
            case 60: // <
                escapeString = "&lt;";
                break;
            case 62: // >
                escapeString = "&gt;";
                break;
            default:
                continue;
        }
        if (i > start) {
            if (start) {
                result += text.slice(start, i);
            } else {
                result = text.slice(start, i);
            }
        }
        result += escapeString;
        start = i + 1;
    }
    if (start && i !== start) {
        return result + text.slice(start, i);
    }
    return result;
}
