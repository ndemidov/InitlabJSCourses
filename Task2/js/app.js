'use strict';

(function() {

  window.onload = function() {
    init();
  }

  function init() {

    // TODO Test initialization.
    var user = new USER('uid0', {
      'username': 'john',
      'role': '1',
      'tasks': ['tid0', 'tid2']
    });
    var task = new TASK('tid0', {
      'client': 'uid1',
      'worker': 'uid2',
      'status': '1',
      'title': 'Some title',
      'description': 'Some description',
      'priority': '1',
      'estimated': '40.0',
      'deadline': '1463666241112',
      'completion': '80',
      'date': '1463666241112',
      'comments': ['cid0', 'cid2'],
    });
    var comment = new COMMENT('cid0', {
      'task': 'tid0',
      'author': 'uid2',
      'text': 'Some comment',
      'date': '1463666241112'
    });

    console.log(user);
    console.log(user.getSnapshot());
    console.log(task);
    console.log(task.getSnapshot());
    console.log(comment);
    console.log(comment.getSnapshot());

  }

})();
