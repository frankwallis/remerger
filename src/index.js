import * as _mergeWith from 'lodash/mergeWith'
import * as _isPlainObject from 'lodash/isPlainObject'
import * as _isUndefined from 'lodash/isUndefined'
import * as _memoize from 'memoizee'

function createMerger() {
   function merge(state, actions) {
      return _mergeWith({}, state, actions, customizer)
   }

   const memoizedMerge = _memoize(merge)

   function customizer(state, actions, key, object, source, stack) {
      if (_isUndefined(state)) {
         return actions
      }
      else if (_isUndefined(actions)) {
         return state
      }
      else if (_isPlainObject(state) && _isPlainObject(actions)) {
         return memoizedMerge(state, actions)
      }
      else {
         return undefined
      }
   }

   return memoizedMerge
}

module.exports = createMerger