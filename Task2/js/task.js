'use strict';

var TASK = (function() {

  function Task(id, data) {
    ENTITY.apply(this, arguments);
  }

  // Inherit Entity super-class.
  Task.prototype = Object.create(ENTITY.prototype);

  Task.prototype.constructor = Task;

  /**
   * Assigns new comment id to this task.
   */
  Task.prototype.assignComment = function(commentId) {
    if (!this.data.comments) {
      return;
    }
    if (UTILS.inArray(this.data.comments, commentId) === false) {
      this.data.comments.push(commentId);
    }
  }

  return Task;
})();
