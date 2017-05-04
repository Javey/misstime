const toString = Object.prototype.toString;

export const isArray = Array.isArray || function(arr) {
    return toString.call(arr) === '[object array]';
};

export function isObject(o) {
    return typeof o === 'object' && o !== null;
}

export function isStringOrNumber(o) {
    const type = typeof o;
    return type === 'string' || type === 'number';
}

export function isNullOrUndefined(o) {
    return o === null || o === undefined;
}

export function isEventProp(propName) {
    return propName.substr(0, 3) === 'ev-';
}

export const indexOf = (function() {
    if (Array.prototype.indexOf) {
        return function(arr, value) {
            return arr.indexOf(value);
        };
    } else {
        return function(arr, value) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === value) {
                    return i;
                }
            }
            return -1;
        };
    }
})();

export const SimpleMap = typeof Map === 'function' ? Map : (function() {
    function SimpleMap() {
        this._keys = [];
        this._values = [];
        this.size = 0;
    }

    SimpleMap.prototype.set = function(key, value) {
        let index = indexOf(this._keys, key);
        if (!~index) {
            index = this._keys.push(key) - 1;
            this.size++;
        }
        this._values.push(value);
        return this;
    };
    SimpleMap.prototype.get = function(key) {
        let index = indexOf(this._keys, key);
        if (!~index) return;
        return this._values[index];
    };
    SimpleMap.prototype.delete = function(key) {
        const index = indexOf(this._keys, key);
        if (!~index) return false;
        this._keys.spilce(index, 1);
        this._values.splice(index, 1);
        this.size--;
        return true;
    };

    return SimpleMap;
})();


export const skipProps = {
    key: true,
    ref: true,
    children: true
};

export function MountedQueue() {
    this.queue = [];
}
MountedQueue.prototype.push = function(fn) {
    this.queue.push(fn);
};
MountedQueue.prototype.trigger = function() {
    const queue = this.queue;
    let callback;
    while (callback = queue.shift()) {
        callback();
    }
};
