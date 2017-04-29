const toString = Object.prototype.toString;

export const isArray = Array.isArray || function(arr) {
    return toString.call(arr) === '[object array]';
}
