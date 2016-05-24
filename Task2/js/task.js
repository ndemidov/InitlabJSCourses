'use strict';

var TASK = (function() {

  function Task(id, data) {
    ENTITY.apply(this, arguments);
  }
  
  // Inherit Entity super-class.
  Task.prototype = Object.create(ENTITY.prototype);

  Task.prototype.constructor = Task;

  return Task;
})();
