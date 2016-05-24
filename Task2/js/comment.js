'use strict';

var COMMENT = (function() {

  function Comment(id, data) {
    ENTITY.apply(this, arguments);
  }

  // Inherit Entity super-class.
  Comment.prototype = Object.create(ENTITY.prototype);
  
  Comment.prototype.constructor = Comment;

  return Comment;
})();
