'use strict';

var USER = (function() {

  function User(id, data) {
    ENTITY.apply(this, arguments);
  }
  
  // Inherit Entity super-class.
  User.prototype = Object.create(ENTITY.prototype);

  User.prototype.constructor = User;

  /**
   * Assigns new task id to this user.
   */
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
