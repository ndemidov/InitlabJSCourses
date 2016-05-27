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

  /**
   * Checks if element has target class.
   */
  function hasClass(element, classname) {
    return (' ' + element.className + ' ').indexOf(' ' + classname + ' ') > -1;
  }

  /**
   * Adds target class to element.
   */
  function addClass(element, classname) {
    if (classname.indexOf(' ') > -1) {
      return;
    }
    if (hasClass(element, classname)) {
      return;
    }
    element.className += ' ' + classname;
  }

  /**
   * Removes target class from element.
   */
  function removeClass(element, classname) {
    if (classname.indexOf(' ') > -1) {
      return;
    }
    var initialClassSplit = element.className.split(' ');
    var classnameIndex = initialClassSplit.indexOf(classname);
    if (classnameIndex === -1) {
      return;
    }

    initialClassSplit.splice(classnameIndex, 1);
    element.className = initialClassSplit.join(' ');
  }

  function validateUsername(username) {
    var usernameRegex = /^[a-zA-Z0-9]{2,30}$/;
    return usernameRegex.test(username);
  }


  // Exports.
  utls.inArray = inArray;
  utls.isEmptyObject = isEmptyObject;
  utls.hasClass = hasClass;
  utls.addClass = addClass;
  utls.removeClass = removeClass;
  utls.validateUsername = validateUsername;

  return utls;
})(UTILS || {});
