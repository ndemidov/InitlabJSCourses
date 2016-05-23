'use strict';

var COMMENT = (function() {

  function Comment(id, data) {
    ENTITY.apply(this, arguments);
  }
  Comment.prototype = Object.create(ENTITY.prototype);
  Comment.prototype.constructor = Comment;

  return Comment;
})();
