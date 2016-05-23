'use strict';

var USER = (function() {

  function User(id, data) {
    ENTITY.apply(this, arguments);
  }
  User.prototype = Object.create(ENTITY.prototype);
  User.prototype.constructor = User;
  User.prototype.assignTask = function(taskId) {
    if (!this.data.tasks) {
      return;
    }
    if (UTILS.inArray(this.data.tasks, taskId) === false) {
      this.data.tasks.push(taskId);
    }
  }

  return User;
})();
