/*
 * util.js
 * Random utility and helper methods.
 */

BS.util = {};

/*
 * Sums the elements of list. If attr is given, that
 * attribute will be summed over.
 */
BS.util.listSum = function(list, attr) {
    return list.reduce(function(a, b) {
        if (attr) {
            return a[attr] + b[attr];
        } else {
            return a + b;
        }
    }, 0);
};

BS.util.isTrue = function(x) {
    return x === true;
}
