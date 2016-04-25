"use strict";
var _mergeWith = require('lodash/mergeWith');
var _isPlainObject = require('lodash/isPlainObject');
var _isUndefined = require('lodash/isUndefined');
var _memoize = require('memoizee');
function createMerger() {
    function merge() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        return _mergeWith.apply(void 0, [{}].concat(args, [customizer]));
    }
    var memoizedMerge = _memoize(merge, { length: 3 });
    function customizer(state, actions, key, object, source, stack) {
        if (_isUndefined(state)) {
            return actions;
        }
        else if (_isUndefined(actions)) {
            return state;
        }
        else if (_isPlainObject(state) && _isPlainObject(actions)) {
            return memoizedMerge(state, actions);
        }
        else {
            return undefined;
        }
    }
    return memoizedMerge;
}
module.exports = createMerger;
