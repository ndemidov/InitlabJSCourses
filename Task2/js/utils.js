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
    if (addEmpty) {
      markup += '<option value="">--' + addEmpty + '--</option>';
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

  /**
   * Adds 0 in front of digits that are < 10 for date entities.
   */
  var beautifyDateEnt = function(num) {
    if (num < 10) {
      return '0' + num;
    }
    return num;
  };

  /**
   * Parses string from date typed input into Date instance.
   */
  function parseDate(s) {
    var b = s.split(/\D/);
    return new Date(b[0], --b[1], b[2]);
  }

  /**
   * Stringify's date to yyyy-MM-dd format.
   */
  function stringifyDate(d) {
    var str = "";
    return beautifyDateEnt(d.getFullYear()) + '-' +
           beautifyDateEnt(d.getMonth() + 1) + '-' +
           beautifyDateEnt(d.getDate());
  }

  /**
   * Formats UNIX timestamp to human readable form.
   */
  function formatTimestamp(timestamp, includeTime) {
    var dateString = '';

    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = beautifyDateEnt(date.getMonth() + 1);
    var day = beautifyDateEnt(date.getDate());
    dateString = day + '.' + month + '.' + year;

    if (includeTime) {
      var hours = beautifyDateEnt(date.getHours());
      var minutes = beautifyDateEnt(date.getMinutes());
      dateString += ' ' + hours + ':' + minutes;
    }
    return dateString;
  }

  // Exports.
  utls.inArray = inArray;
  utls.isEmptyObject = isEmptyObject;
  utls.capitalizeFirstLetter = capitalizeFirstLetter;
  utls.hasClass = hasClass;
  utls.addClass = addClass;
  utls.removeClass = removeClass;
  utls.createMarkupSelect = createMarkupSelect;
  utls.parseDate = parseDate;
  utls.stringifyDate = stringifyDate;
  utls.formatTimestamp = formatTimestamp;

  return utls;
})(UTILS || {});
