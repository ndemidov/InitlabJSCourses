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
    return id;
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

  /**
   * Finds user by username.
   */
  function findUserByName(username) {
    var resultData = false;
    for (var uid in appdata.users) {
      if (appdata.users[uid].data.username === username) {
        resultData = appdata.users[uid];
        break;
      }
    }
    return resultData
  }

  /**
   * Gets users with specified roles.
   */
  function getUsers(role) {
    var resultList = {};
    var wList = appdata.users;
    for (var id in wList) {
      if (wList[id].data.role === role) {
        resultList[id] = wList[id].data.username;
      }
    }
    return resultList;
  }

  /**
   * Creates new user.
   */
  function createNewUser(username, role) {
    if (findUserByName(username)) {
      return false;
    }
    addEntity('users', {
      'username': username,
      'role': role,
      'tasks': []
    });
    saveGroup('users');
    return true;
  }

  /**
   * Creates new task.
   */
  function createNewTask(formData) {
    var data = {};
    var now = new Date();

    data.client = formData.client;
    data.worker = formData.worker || '';
    data.status = '2';
    data.title = formData.title;
    data.description = formData.description;
    data.priority = formData.priority || '1';
    data.estimated = formData.estimated || '';
    data.deadline = formData.deadline || '';
    if (data.deadline !== '') {
      data.deadline = UTILS.parseDate(data.deadline).getTime();
    }
    data.completion = '0';
    data.date = now.getTime();
    data.comments = [];

    var tid = addEntity('tasks', data);
    saveGroup('tasks');

    if (appdata.users[data.client]) {
      appdata.users[data.client].assignTask(tid);
    }
    if (data.worker && appdata.users[data.worker]) {
      appdata.users[data.worker].assignTask(tid);
    }
    saveGroup('users');
  }

  // Exports.
  adt.init = init;
  adt.get = get;
  adt.addEnt = addEntity;
  adt.saveGrp = saveGroup;
  adt.saveAll = saveAll;
  adt.findUserByName = findUserByName;
  adt.getUsers = getUsers;
  adt.createNewUser = createNewUser;
  adt.createNewTask = createNewTask;

  return adt;
})(APP_DATA || {});
