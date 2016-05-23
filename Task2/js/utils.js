var UTILS = (function(utls) {

  function inArray (array, value) {
    var result = false;
    for (var i = 0; i < array.length; i++) {
      if (array[i] === value) {
        result = true;
        break;
      }
    }
    return result;
  }

  utls.inArray = inArray;

  return utls;
})(UTILS || {});
