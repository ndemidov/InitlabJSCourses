'use strict';

var CONFIG = (function() {

  var entities = {
    'users': {
      'class': USER
    },
    'tasks': {
      'class': TASK
    },
    'comments': {
      'class': COMMENT
    }
  };

  var role = {
    '0': 'admin',
    '1': 'client',
    '2': 'worker'
  };

  var status = {
    '0': 'closed',
    '1': 'pending',
    '2': 'opened',
  };

  var priority = {
    '0': 'low',
    '1': 'normal',
    '2': 'high',
    '3': 'critical'
  };

  return {
    entities: entities,
    role: role,
    status: status,
    priority: priority
  }
})(CONFIG || {});
