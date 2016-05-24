'use strict';

var ENTITY = (function() {

  function Entity(id, data) {
    this.id = id;
    this.data = data;
  }

  /**
   * Returns stringified representation of entity's data.
   */
  Entity.prototype.getSnapshot = function() {
    return {
      id: this.id,
      data: this.data
    };
  };

  return Entity;
})();
