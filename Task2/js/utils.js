'use strict';

var UTILS = (function(utls) {

  /**
   * Checks value presence in array.
   */
  function inArray(array, value) {
    var result = false;
    for (var i = 0; i < array.length; i++) {
      if (array[i] === value) {
        result = true;
        break;
      }
    }
    return result;
  }

  /**
   * Checks if object is empty.
   */
  function isEmptyObject(obj) {
    var result = true;
    for (var key in obj) {
      result = false;
      break;
    }
    return result;
  }

  // Exports.
  utls.inArray = inArray;
  utls.isEmptyObject = isEmptyObject;

  return utls;
})(UTILS || {});
