'use strict';

var TASK = (function() {

  function Task(id, data) {
    ENTITY.apply(this, arguments);
  }
  Task.prototype = Object.create(ENTITY.prototype);
  Task.prototype.constructor = Task;

  return Task;
})();
