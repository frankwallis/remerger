const _mergeWith = require('lodash').mergeWith;
const _isObject = require('lodash').isObject;
const _isUndefined = require('lodash').isUndefined;
const _memoize = require('memoizee');

function createMerger() {
   function merge(state, actions) {
      return _mergeWith({}, state, actions, customizer);
   }
   
   const memoizedMerge = _memoize(merge);

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