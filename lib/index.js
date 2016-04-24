"use strict";
var _mergeWith = require('lodash/mergeWith');
var _isObject = require('lodash/isObject');
var _isUndefined = require('lodash/isUndefined');
var _memoize = require('memoizee');
function createMerger() {
    function merge(state, actions) {
        return _mergeWith({}, state, actions, customizer);
    }
    var memoizedMerge = _memoize(merge);
    function customizer(state, actions, key, object, source, stack) {
        if (_isUndefined(state)) {
            return actions;
        }
        else if (_isUndefined(actions)) {
            return state;
        }
        else if (_isObject(state) && _isObject(actions)) {
            return memoizedMerge(state, actions);
        }
        else {
            return undefined;
        }
    }
    return memoizedMerge;
}
module.exports = createMerger;
