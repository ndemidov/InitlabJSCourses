'use strict';

var APP_DATA = (function(adt) {

  // In-memory representation for initialized entities.
  var appdata = {};

  function get() {
    return appdata;
  };

  /**
   * Adds new initialized entity to appdata. Id is optional, if not specified auto-incremented id will be requested.
   */
  function addEntity(groupName, data, id) {
    if (appdata[groupName]) {

      if (!id) {
        id = APP_STORAGE.getId(groupName);
      }
      if (id) {
        appdata[groupName][id] = new CONFIG.entities[groupName].class(id, data);
      }
    }
  }

  /**
   * Saves specified entity group info to localStorage.
   */
  function saveGroup(groupName) {
    var resultData = {};
    if (appdata[groupName]) {
      for (var key in appdata[groupName]) {
        // Get data snapshots from entity instances.
        resultData[key] = appdata[groupName][key].getSnapshot().data;
      }
    }
    if (!UTILS.isEmptyObject(resultData)) {
      APP_STORAGE.saveGrp(groupName, JSON.stringify(resultData));
    }
  }

  /**
   * Save all entity groups to localStorage.
   */
  function saveAll() {
    for (var key in appdata) {
      saveGroup(key);
    }
  }

  /**
   * Initialize in-memory storage module.
   */
  function init() {

    if (CONFIG.entities) {
      for (var name in CONFIG.entities) {
        appdata[name] = {};

        // Restore in-memory representation of app data from localStorage.
        var entGroup = APP_STORAGE.getGrp(name);
        if (entGroup) {
          var entList = JSON.parse(entGroup);
          for (var entId in entList) {
            addEntity(name, entList[entId], entId);
          }
        }

      }
    }

  }

  // Exports.
  adt.init = init;
  adt.get = get;
  adt.addEnt = addEntity;
  adt.saveGrp = saveGroup;
  adt.saveAll = saveAll;

  return adt;
})(APP_DATA || {});
