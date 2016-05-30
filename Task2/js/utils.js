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
   * Capitalizes first letter of string.
   */
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
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

  /**
   * Creates html of options for select.
   */
  function createMarkupSelect(values, addEmpty, defaultValue) {
    var markup = '';
    if (addEmpty === true) {
      markup += '<option value="">--Select Worker--</option>';
    }
    for (var value in values) {
      var selected = "";
      if (defaultValue && defaultValue === value) {
        selected = " selected";
      }
      markup += '<option value="' + value + '"' + selected + '>' + capitalizeFirstLetter(values[value]) + '</option>';
    }
    return markup;
  }

  // Exports.
  utls.inArray = inArray;
  utls.isEmptyObject = isEmptyObject;
  utls.capitalizeFirstLetter = capitalizeFirstLetter;
  utls.hasClass = hasClass;
  utls.addClass = addClass;
  utls.removeClass = removeClass;
  utls.createMarkupSelect = createMarkupSelect;

  return utls;
})(UTILS || {});
