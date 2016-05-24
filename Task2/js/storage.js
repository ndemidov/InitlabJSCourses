'use strict';

var APP_STORAGE = (function(strg) {

  var namespacePrefix = 'jsc_app4_';
  var idIncrementPrefix = 'incr_';

  /**
   * Checks localStorage availability.
   */
  function isAvailable() {
    if (typeof(Storage) !== "undefined") {
      return true;
    }
    return false;
  }

  /**
   * Gets auto-incremented id for item of specified group.
   */
  function getEntityId(groupName) {
    var result = false;
    if (!isAvailable()) {
      return false;
    }

    var key = namespacePrefix + idIncrementPrefix + groupName;
    var lastId = localStorage.getItem(key);
    if (lastId) {
      lastId = +lastId;
    }
    else {
      lastId = 0;
    }

    lastId += 1;

    localStorage.setItem(key, lastId);

    return groupName + lastId;
  }

  /**
   * Gets group of entities.
   */
  function getEntityGroup(name) {
    if (!isAvailable()) {
      return false;
    }

    // Preserve namespace in localStorage key to avoid collisions.
    name = namespacePrefix + name;
    return localStorage.getItem(name);
  }

  /**
   * Sets group of entities.
   */
  function saveEntityGroup(name, entGrp) {
    if (!isAvailable()) {
      return false;
    }

    name = namespacePrefix + name;
    localStorage.setItem(name, entGrp);
  }

  /**
   * Removes group of entities.
   */
  function removeEntityGroup(name) {
    if (!isAvailable()) {
      return false;
    }

    name = namespacePrefix + name;
    localStorage.removeItem(name);
  }

  // Exports.
  strg.getId = getEntityId;
  strg.getGrp = getEntityGroup;
  strg.saveGrp = saveEntityGroup;
  strg.removeGrp = removeEntityGroup;

  return strg;
})(APP_STORAGE || {});
