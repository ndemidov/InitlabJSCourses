var ENTITY = (function() {

  function Entity(id, data) {
    this.id = id;
    this.data;

    this.data = JSON.parse(JSON.stringify(data));
  }
  Entity.prototype.getSnapshot = function() {
    return {
      id: this.id,
      data: JSON.stringify(this.data)
    };
  };

  return Entity;
})();
