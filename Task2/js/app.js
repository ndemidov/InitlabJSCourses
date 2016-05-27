'use strict';

(function() {

  window.onload = function() {
    init();
  }

  /**
   * Initializes application.
   */
  function init() {

    // Init in-memory data representation.
    APP_DATA.init();
    AUTH.init();
    UI_CONTROL.init();

    /*APP_DATA.addEnt('users', {
      'username': 'admin',
      'role': '0',
      'tasks': []
    });

    APP_DATA.saveGrp('users');*/

    // Add some test entities.
    /*APP_DATA.addEnt('users', {
      'username': 'steve',
      'role': '2',
      'tasks': ['tasks1']
    });

    APP_DATA.addEnt('tasks', {
      'client': 'users1',
      'worker': 'users2',
      'status': '1',
      'title': 'Some title',
      'description': 'Some description',
      'priority': '1',
      'estimated': '40.0',
      'deadline': '1463666241112',
      'completion': '80',
      'date': '1463666241112',
      'comments': ['comments1', 'comments2'],
    });

    APP_DATA.addEnt('comments', {
      'task': 'tasks1',
      'author': 'users1',
      'text': 'Some comment',
      'date': '1463666241112'
    });*/

    // Save data to localStorage.
    //APP_DATA.saveAll();

    //console.log(APP_DATA.get());

  }

})();
