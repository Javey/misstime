import {SimpleMap, isNullOrUndefined, createObject, doc as document, browser} from './utils';

const ALL_PROPS = [
    "altKey", "bubbles", "cancelable", "ctrlKey",
    "eventPhase", "metaKey", "relatedTarget", "shiftKey",
    "target", "timeStamp", "type", "view", "which"
];
const KEY_PROPS = ["char", "charCode", "key", "keyCode"];
const MOUSE_PROPS = [
    "button", "buttons", "clientX", "clientY", "layerX",
    "layerY", "offsetX", "offsetY", "pageX", "pageY",
    "screenX", "screenY", "toElement"
];

const rkeyEvent = /^key|input/;
const rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/;

function Event(e) {
    for (let i = 0; i < ALL_PROPS.length; i++) {
        let propKey = ALL_PROPS[i];
        this[propKey] = e[propKey];
    }
    
    if (!e.target) {
        this.target = e.srcElement;
    }

    this._rawEvent = e;
}
Event.prototype.preventDefault = function() {
    const e = this._rawEvent;
    if (e.preventDefault) {
        e.preventDefault();
    } else {
        e.returnValue = false;
    }
};
Event.prototype.stopPropagation = function() {
    const e = this._rawEvent;    
    e.cancelBubble = true;
    e.stopImmediatePropagation && e.stopImmediatePropagation();
};

function MouseEvent(e) {
    Event.call(this, e);
    for (let j = 0; j < MOUSE_PROPS.length; j++) {
        let mousePropKey = MOUSE_PROPS[j];
        this[mousePropKey] = e[mousePropKey];
    }
}
MouseEvent.prototype = createObject(Event.prototype);
MouseEvent.prototype.constructor = MouseEvent;

function KeyEvent(e) {
    Event.call(this, e);
    for (let j = 0; j < KEY_PROPS.length; j++) {
        let keyPropKey = KEY_PROPS[j];
        this[keyPropKey] = e[keyPropKey];
    }
}
KeyEvent.prototype = createObject(Event.prototype);
KeyEvent.prototype.constructor = KeyEvent;

function proxyEvent(e) {
    if (rkeyEvent.test(e.type)) {
        return new KeyEvent(e);
    } else if (rmouseEvent.test(e.type)) {
        return new MouseEvent(e);
    } else {
        return new Event(e);
    }
}

let addEventListener;
let removeEventListener;
if ('addEventListener' in document) {
    addEventListener = function(dom, name, fn) {
        dom.addEventListener(name, fn, false);
    };

    removeEventListener = function(dom, name, fn) {
        dom.removeEventListener(name, fn);
    };
} else {
    addEventListener = function(dom, name, fn) {
        fn.cb = (e) => {
            e = proxyEvent(e);
            fn(e);
        };
        dom.attachEvent(`on${name}`, fn.cb);
    };

    removeEventListener = function(dom, name, fn) {
        dom.detachEvent(`on${name}`, fn.cb || fn);
    };
}

const delegatedEvents = {};
const unDelegatesEvents = {
    'mouseenter': true,
    'mouseleave': true,
    'propertychange': true
};

// change event can not be deletegated in IE8 
if (browser.isIE8) {
    unDelegatesEvents.change = true;
}

export function handleEvent(name, lastEvent, nextEvent, dom) {
    if (name === 'blur') {
        name = 'focusout';
    } else if (name === 'focus') {
        name = 'focusin';
    } else if (browser.isIE8 && name === 'input') {
        name = 'propertychange';
    }

    if (!unDelegatesEvents[name]) {
        let delegatedRoots = delegatedEvents[name];

        if (nextEvent) {
            if (!delegatedRoots) {
                delegatedRoots = {items: new SimpleMap(), docEvent: null};
                delegatedRoots.docEvent = attachEventToDocument(name, delegatedRoots); 
                delegatedEvents[name] = delegatedRoots;
            }
            delegatedRoots.items.set(dom, nextEvent);
        } else if (delegatedRoots) {
            const items = delegatedRoots.items;
            if (items.delete(dom)) {
                if (items.size === 0) {
                    removeEventListener(document, name, delegatedRoots.docEvent);
                    delete delegatedRoots[name];
                }
            }
        }
    } else {
        if (lastEvent) {
            removeEventListener(dom, name, lastEvent);
        }
        if (nextEvent) {
            addEventListener(dom, name, nextEvent);
        }
    }
}

function dispatchEvent(event, target, items, count, isClick) {
    const eventToTrigger = items.get(target);
    if (eventToTrigger) {
        count--;
        event.currentTarget = target;
        eventToTrigger(event);
        if (event._rawEvent.cancelBubble) {
            return;
        }
    }
    if (count > 0) {
        const parentDom = target.parentNode;
        if (isNullOrUndefined(parentDom) || (isClick && parentDom.nodeType === 1 && parentDom.disabled)) {
            return;
        }
        dispatchEvent(event, parentDom, items, count, isClick);
    }
}

function attachEventToDocument(name, delegatedRoots) {
    var docEvent = function(event) {
        const count = delegatedRoots.items.size;
        event || (event = window.event);
        if (count > 0) {
            event = proxyEvent(event);
            dispatchEvent(event, event.target, delegatedRoots.items, count, event.type === 'click'); 
        }
    };
    addEventListener(document, name, docEvent);
    return docEvent;
}
