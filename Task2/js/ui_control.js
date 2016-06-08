var UI_CONTROL = (function(uc) {

  var mainContentCurrentBlock = null;
  var activePopupCurrentBlock = null;
  var currentTask = null;

  var blocks = {};

  // Settings of event handlers for each panel.
  var eventHandlingSettings = {
    'jscHeaderPanel': [
        {
          event: 'click',
          target: '#jscHeaderPanelLogout',

          /**
           * Handles user logout.
           */
          callback: function() {
            AUTH.logout();
            blocks['jscHeaderPanel'].hide();
            blocks[mainContentCurrentBlock].hide();
            mainContentCurrentBlock = 'jscLoginPanel';
            blocks[mainContentCurrentBlock].show();
          }
        },
        {
          event: 'click',
          target: '#jscHeaderPanelNewClient',

          /**
           * Opens Register Client Panel.
           */
          callback: function(target) {
            var allowedTo = target.getAttribute('allowedTo');
            if (verifyRights(allowedTo)) {
              blocks['jscRegisterClientPanel'].show();
            }
          }
        },
        {
          event: 'click',
          target: '#jscHeaderPanelNewWorker',

          /**
           * Opens Register Worker Panel .
           */
          callback: function(target) {
            var allowedTo = target.getAttribute('allowedTo');
            if (verifyRights(allowedTo)) {
              blocks['jscRegisterWorkerPanel'].show();
            }
          }
        },
        {
          event: 'click',
          target: '#jscHeaderPanelBack',

          /**
           * Returnes to task list.
           */
          callback: function() {
            refreshTaskList();
            handleRightsControlledVisibility();
            var previousContentBlock = mainContentCurrentBlock;
            mainContentCurrentBlock = 'jscTaskListPanel';
            refreshHeader();

            blocks[previousContentBlock].hide(function() {
              blocks[mainContentCurrentBlock].show();
            });
          }
        }
      ],
    'jscLoginPanel': [
        {
          event: 'submit',
          target: '#jscLoginPanelForm',

          /**
           * Handles user login.
           */
          callback: function(target) {
            var formData = getFormData(target);
            var usernameValue = formData.username;
            if (usernameValue === '') {
              console.log('Login must be specified');
              return;
            }

            if (!AUTH.login(usernameValue.toLowerCase())) {
              console.log('Login incorrect');
              return;
            }

            blocks[mainContentCurrentBlock].hide(function() {
              resetForm(target);
              blocks['jscHeaderPanel'].show();
              mainContentCurrentBlock = 'jscTaskListPanel';
              refreshTaskList();
              refreshHeader();
              handleRightsControlledVisibility();
              blocks[mainContentCurrentBlock].show();
            });
          }
        }
      ],
    'jscCreateTaskPanel': [
        {
          event: 'submit',
          target: '#jscCreateTaskPanelForm',

          /**
           * Handles new task creation.
           */
          callback: function(target) {
            var formData = getFormData(target);

            if (saveNewTask(formData)) {
              refreshTaskList();
              handleRightsControlledVisibility(blocks['jscTaskListPanel'].el);
              blocks['jscCreateTaskPanel'].hide(function() {
                resetForm(blocks['jscAssignClientPanel'].el.querySelector('#jscAssignClientPanelForm'));
                resetForm(blocks['jscAssignWorkerPanel'].el.querySelector('#jscAssignWorkerPanelForm'));
                resetForm(target);
              });
            }
          }
        },
        {
          event: 'click',
          target: '#jscCreateTaskPanelAssignWorker',

          /**
           * Handles open of Assign Worker Panel.
           */
          callback: function() {
            prefillAssignUserForm('2');
            blocks['jscAssignWorkerPanel'].show();
          }
        },
        {
          event: 'click',
          target: '#jscCreateTaskPanelAssignClient',

          /**
           * Handles open of Assign Client Panel.
           */
          callback: function() {
            prefillAssignUserForm('1');
            blocks['jscAssignClientPanel'].show();
          }
        },
        {
          event: 'click',
          target: '#jscCreateTaskPanelClose',

          /**
           * Handles form close.
           */
          callback: function() {
            blocks['jscCreateTaskPanel'].hide(function() {
              resetForm(blocks['jscAssignClientPanel'].el.querySelector('#jscAssignClientPanelForm'));
              resetForm(blocks['jscAssignWorkerPanel'].el.querySelector('#jscAssignWorkerPanelForm'));
              resetForm(blocks['jscCreateTaskPanel'].el.querySelector('#jscCreateTaskPanelForm'));
            });
          }
        }
      ],
    'jscTaskListPanel': [
        {
          event: 'click',
          target: '#jscTaskListPanelCreateTask',

          /**
           * Handles open of Create Task Panel.
           */
          callback: function(target) {
            var allowedTo = target.getAttribute('allowedTo');
            if (verifyRights(allowedTo)) {
              activePopupCurrentBlock = 'jscCreateTaskPanel';
              blocks[activePopupCurrentBlock].show();
            }
          }
        },
        {
          event: 'click',
          target: '.jscTaskListItem',

          /**
           * Handles click on list item.
           */
          callback: function(target) {
            var taskId = null;
            if (!target) {
              return;
            }
            taskId = target.getAttribute('id');
            currentTask = taskId;

            blocks[mainContentCurrentBlock].hide(function() {
              mainContentCurrentBlock = 'jscTaskViewPanel';
              refreshHeader();
              refreshTaskView(taskId);
              blocks[mainContentCurrentBlock].show();
            });
          }
        }
      ],
    'jscTaskViewPanel': [
        {
          event: 'click',
          target: '#jscTaskViewPanelCreateComment',

          /**
           * Handles create comment button.
           */
          callback: function() {
            blocks['jscCreateCommentPanel'].show();
          }
        },
        {
          event: 'click',
          target: '#jscTaskViewPanelEditTask',

          /**
           * Handles edit task button.
           */
          callback: function() {
            activePopupCurrentBlock = 'jscEditTaskPanel';
            prefillTaskEditForm(currentTask);
            prefillAssignUserForm('2', currentTask);
            blocks[activePopupCurrentBlock].show();
          }
        }
      ],
    'jscCreateCommentPanel': [
        {
          event: 'submit',
          target: '#jscCreateCommentPanelForm',

          /**
           * Handles create new comment.
           */
          callback: function(target) {
            var formData = getFormData(target);

            if (saveNewComment(formData)) {
              refreshTaskView(currentTask);
              blocks['jscCreateCommentPanel'].hide(function() {
                resetForm(target);
              });
            }
          }
        },
        {
          event: 'click',
          target: '#jscCreateCommentPanelClose',

          /**
           * Handles panel close.
           */
          callback: function() {
            blocks['jscCreateCommentPanel'].hide();
          }
        }
      ],
    'jscRegisterClientPanel': [
        {
          event: 'click',
          target: '#jscRegisterClientPanelClose',

          /**
           * Handles panel close.
           */
          callback: function() {
            blocks['jscRegisterClientPanel'].hide();
          }
        },
        {
          event: 'submit',
          target: '#jscRegisterClientPanelForm',

          /**
           * Handles new Client user creation.
           */
          callback: function(target) {
            var formData = getFormData(target);
            var usernameValue = formData.username;
            if (saveNewUser(usernameValue, '1')) {
              blocks['jscRegisterClientPanel'].hide(function() {
                resetForm(target);
              });
            }
          }
        }
      ],
    'jscRegisterWorkerPanel': [
        {
          event: 'click',
          target: '#jscRegisterWorkerPanelClose',

          /**
           * Handles panel close.
           */
          callback: function(target) {
            blocks['jscRegisterWorkerPanel'].hide();
          }
        },
        {
          event: 'submit',
          target: '#jscRegisterWorkerPanelForm',

          /**
           * Handles new Worker user creation.
           */
          callback: function(target) {
            var formData = getFormData(target);
            var usernameValue = formData.username;
            if (saveNewUser(usernameValue, '2')) {
              blocks['jscRegisterWorkerPanel'].hide(function() {
                resetForm(target);
              });
            }
          }
        }
      ],
    'jscEditTaskPanel': [
        {
          event: 'click',
          target: '#jscEditTaskPanelClose',

          /**
           * Handles panel close.
           */
          callback: function() {
            blocks['jscEditTaskPanel'].hide(function() {
              resetForm(blocks['jscEditTaskPanel'].el.querySelector('#jscEditTaskPanelForm'));
            });
          }
        },
        {
          event: 'click',
          target: '#jscEditTaskPanelAssignWorker',

          /**
           * Handles open of Assign Worker Panel.
           */
          callback: function() {
            blocks['jscAssignWorkerPanel'].show();
          }
        },
        {
          event: 'submit',
          target: '#jscEditTaskPanelForm',

          /**
           * Handles task edit.
           */
          callback: function(target) {
            var formData = getFormData(target);

            if (saveTaskChanges(currentTask, formData)) {
              refreshTaskList();
              refreshTaskView(currentTask);
              handleRightsControlledVisibility(blocks['jscTaskListPanel'].el);
              blocks['jscEditTaskPanel'].hide(function() {
                resetForm(blocks['jscAssignWorkerPanel'].el.querySelector('#jscAssignWorkerPanelForm'));
                resetForm(target);
              });
            }
          }
        }
      ],
    'jscAssignWorkerPanel': [
        {
          event: 'click',
          target: '#jscAssignWorkerPanelClose',

          /**
           * Handles panel close.
           */
          callback: function() {
            blocks['jscAssignWorkerPanel'].hide();
          }
        },
        {
          event: 'submit',
          target: '#jscAssignWorkerPanelForm',

          callback: function(target) {
            var formData = getFormData(target);

            if (formData.worker === "") {
              return;
            }

            if (activePopupCurrentBlock) {
              var elem = blocks[activePopupCurrentBlock].el.querySelector('.jscAssignedWorker');
              elem.setAttribute('value', formData.worker);
              elem.innerHTML = UTILS.capitalizeFirstLetter(APP_DATA.get().users[formData.worker].data.username);
            }
            blocks['jscAssignWorkerPanel'].hide();
          }
        }
      ],
    'jscAssignClientPanel': [
        {
          event: 'click',
          target: '#jscAssignClientPanelClose',

          /**
           * Handles panel close.
           */
          callback: function() {
            blocks['jscAssignClientPanel'].hide();
          }
        },
        {
          event: 'submit',
          target: '#jscAssignClientPanelForm',

          callback: function(target) {
            var formData = getFormData(target);

            if (formData.client === "") {
              return;
            }

            if (activePopupCurrentBlock) {
              var elem = blocks[activePopupCurrentBlock].el.querySelector('.jscAssignedClient');
              elem.setAttribute('value', formData.client);
              elem.innerHTML = UTILS.capitalizeFirstLetter(APP_DATA.get().users[formData.client].data.username);
            }
            blocks['jscAssignClientPanel'].hide();
          }
        }
      ]
  };

  /**
   * Initializes UI Panel instances.
   */
  function initBlocks() {
    for (var i = 0; i < CONFIG.blocks.length; i++) {
      var block = CONFIG.blocks[i];
      blocks[block.id] = new block.class(block.id);
      blocks[block.id].init();
      blocks[block.id].addListeners(eventHandlingSettings[block.id]);
    }
  }

  /**
   * Checks rights of user to perform some action.
   */
  function verifyRights(allowedTo) {
    var result = false;
    var atSplit = allowedTo.split(',');
    for (var i = 0; i < atSplit.length; i++) {
      if (AUTH.getUser().data.role === atSplit[i]) {
        result = true;
        break;
      }
    }
    return result;
  }

  /**
   * Shows/hides elements that are intended to be displayed only for users with certain roles.
   */
  function handleRightsControlledVisibility(panelElem) {
    if (!AUTH.getUser()) {
      return;
    }

    var containerElem;
    if (panelElem) {
      containerElem = panelElem;
    }
    else {
      containerElem = document;
    }
    var rightsControlledElems = containerElem.querySelectorAll('.rightsControlled');
    for (var i = 0; i < rightsControlledElems.length; i++) {
      var rcElem = rightsControlledElems[i];
      if (verifyRights(rcElem.getAttribute('showto'))) {
        rcElem.style.display = '';
      }
      else {
        rcElem.style.display = 'none';
      }
    }
  }

  /**
   * Gets data from a form.
   */
  function getFormData(formElem) {
    var formData = {};
    var inputs = formElem.querySelectorAll('.form-control');
    //console.log(inputs);
    for (var i = 0; i < inputs.length; i++) {
      var input = inputs[i];
      formData[input.getAttribute('name')] = input.value;
    }

    var jac = formElem.querySelector('.jscAssignedClient');
    if (jac) {
      formData['client'] = jac.getAttribute('value');
    }

    var jaw = formElem.querySelector('.jscAssignedWorker');
    if (jaw) {
      formData['worker'] = jaw.getAttribute('value');
    }
    return formData;
  }

  /**
   * Prefills Assign Worker form.
   */
   function prefillAssignUserForm(role, taskId) {
     var userTitle = CONFIG.role[role];
     var cUserTitle = UTILS.capitalizeFirstLetter(userTitle);
     var formSelect = blocks['jscAssign' + cUserTitle + 'Panel'].el.querySelector('#jscAssign' + cUserTitle + 'PanelInput' + cUserTitle);
     if (formSelect.value !== "") {
       return;
     }
     var values = [];
     var usersList = APP_DATA.getUsers(role);
     var dVal = null;
     if (taskId) {
       dVal = APP_DATA.get().tasks[taskId].data[userTitle];
       if (activePopupCurrentBlock) {
         blocks[activePopupCurrentBlock].el.querySelector('.jscAssigned' + cUserTitle).setAttribute('value', dVal);
       }
     }
     var markup = UTILS.createMarkupSelect(usersList, 'Select user', dVal);
     formSelect.innerHTML = markup;
   }

  /**
   * Resets data entered in a form.
   */
  function resetForm(formElem) {
    var inputs = formElem.querySelectorAll('.form-control');
    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i].tagName !== "SELECT") {
        inputs[i].value = "";
      }
      else {
        var options = inputs[i].querySelectorAll('option');
        for (var j = 0; j < options.length; j++) {
          options[j].selected = options[j].defaultSelected;
        }
      }
    }
    var jac = formElem.querySelector('.jscAssignedClient');
    if (jac) {
      jac.setAttribute('value', '');
      jac.innerHTML = 'No client assigned yet';
    }
    var jaw = formElem.querySelector('.jscAssignedWorker');
    if (jaw) {
      jaw.setAttribute('value', '');
      jaw.innerHTML = 'No worker assigned yet';
    }
  }

  /**
   * Validates and saves new user.
   */
  function saveNewUser(usernameValue, role) {
    usernameValue = usernameValue.toLowerCase();
    if (usernameValue === '') {
      console.log('Username must be specified');
      return false;
    }

    if (!VALIDATE.username(usernameValue)) {
      console.log('Username is invalid (only letters and digits are allowed, length from 2 to 30 symbols)');
      return false;
    }

    // Ensure that username is unique.
    if (APP_DATA.findUserByName(usernameValue)) {
      console.log('Username is already in use');
      return false;
    }

    return APP_DATA.createNewUser(usernameValue, role);
  }

  /**
   * Validates and saves new task.
   */
  function saveNewTask(formData) {
    if (AUTH.getUser().data.role === '1') {
      formData.client = AUTH.getUser().id;
    }

    var isValid = true;
    if (!VALIDATE.userId(formData.client)) {
      console.log('Client is invalid');
      isValid = false;
    }

    if (!VALIDATE.title(formData.title)) {
      console.log('Title is invalid');
      isValid = false;
    }

    if (!VALIDATE.description(formData.description)) {
      console.log('Description is invalid');
      isValid = false;
    }

    if (!VALIDATE.priority(formData.priority)) {
      console.log('Priority is invalid');
      isValid = false;
    }

    if (formData.estimated !== "" && !VALIDATE.estimated(formData.estimated)) {
      console.log('Estimated is invalid');
      isValid = false;
    }

    if (formData.deadline !== "" && !VALIDATE.deadline(formData.deadline)) {
      console.log('Deadline is invalid');
      isValid = false;
    }

    if (!isValid) {
      console.log("Form did not pass validation");
      return;
    }

    return APP_DATA.createNewTask(formData);
  }

  /**
   * Saves changes to task.
   */
  function saveTaskChanges(taskId, formData) {
    console.log(formData);

    var isValid = true;

    if (!VALIDATE.title(formData.title)) {
      console.log('Title is invalid');
      isValid = false;
    }

    if (!VALIDATE.description(formData.description)) {
      console.log('Description is invalid');
      isValid = false;
    }

    if (verifyRights('0')) {
      if (!VALIDATE.userId(formData.worker)) {
        console.log('Worker is invalid');
        isValid = false;
      }

      if (!VALIDATE.priority(formData.priority)) {
        console.log('Priority is invalid');
        isValid = false;
      }

      if (formData.estimated !== "" && !VALIDATE.estimated(formData.estimated)) {
        console.log('Estimated is invalid');
        isValid = false;
      }

      if (formData.deadline !== "" && !VALIDATE.deadline(formData.deadline)) {
        console.log('Deadline is invalid');
        isValid = false;
      }
    }
    else {
      delete formData.worker;
      delete formData.priority;
      delete formData.estimated;
      delete formData.deadline;
    }

    if (!VALIDATE.status(formData.status)) {
      console.log('Status is invalid');
      isValid = false;
    }

    if (verifyRights('0, 2')) {
      if (!VALIDATE.completion(formData.completion)) {
        console.log('Completion is invalid');
        isValid = false;
      }
    }
    else {
      delete formData.completion;
    }

    if (!isValid) {
      console.log("Form did not pass validation");
      return;
    }

    var changed = APP_DATA.updateTask(taskId, formData);

    if (!changed) {
      console.log("All values are the same, no changes were made");
    }

    return changed;
  }

  /**
   * Validates and saves new comment.
   */
  function saveNewComment(commentData) {
    if (!VALIDATE.comment(commentData.text)) {
      console.log('Comment text is invalid');
      return false;
    }

    var author = AUTH.getUser().id;
    var task = currentTask;

    commentData.author = author;
    commentData.task = currentTask;

    return APP_DATA.createNewComment(commentData);
  }

  /**
   * Refreshes Task List.
   */
  function refreshTaskList() {
    var taskList = blocks['jscTaskListPanel'];
    var tableBody = taskList.el.querySelector('tbody');
    var markup = "";

    // Creates list item markup for task.
    function getMarkup(task) {
      var mrkp = "";

      var date = '&nbsp;';
      if (task.data.deadline !== '') {
        date = UTILS.formatTimestamp(+task.data.deadline);
      }

      mrkp += '<tr id="' + task.id + '" class="jscTaskListItem">';
      mrkp += '<td>' + UTILS.capitalizeFirstLetter(CONFIG.status[task.data.status]) + '</td>';
      mrkp += '<td class="rightsControlled" showto="0,2">' + UTILS.capitalizeFirstLetter(CONFIG.priority[task.data.priority]) + '</td>';
      mrkp += '<td>' + task.data.title + '</td>';
      mrkp += '<td class="rightsControlled" showTo="0,2">' + date + '</td>';
      mrkp += '</tr>';
      return mrkp;
    }

    // Get list of tasks assigned to user, get all existing tasks for admin.
    if (AUTH.getUser().data.role !== '0') {
      var list = AUTH.getUser().data.tasks;
      for (var i = 0; i < list.length; i++) {
        var task = APP_DATA.get().tasks[list[i]];
        markup += getMarkup(task);
      }
    }
    else {
      var list = APP_DATA.get().tasks;
      for (var id in list) {
        var task = list[id];
        markup += getMarkup(task);
      }
    }
    tableBody.innerHTML = markup;

    // Hide or show empty list notice.
    var emptyListNotice = taskList.el.querySelector('#tasksEmpty');
    if (markup !== "") {
      emptyListNotice.style.display = 'none';
    }
    else {
      emptyListNotice.style.display = '';
    }
  }

  /**
   * Refreshes Task View.
   */
  function refreshTaskView(taskId) {

    var taskViewElem = blocks['jscTaskViewPanel'].el;
    var taskData = APP_DATA.get().tasks[taskId].data;

    // Creates markup for task's inner info.
    function createInnerInfoMarkup() {
      var markup = '';

      var date = UTILS.formatTimestamp(+taskData.date);
      var priority = UTILS.capitalizeFirstLetter(CONFIG.priority[taskData.priority]);
      var estimated = '&nbsp;';
      if (taskData.estimated !== '') {
        estimated = taskData.estimated + ' hours';
      }
      var deadline = '&nbsp;'
      if (taskData.deadline !== '') {
        deadline = UTILS.formatTimestamp(+taskData.deadline);
      }
      var completion = taskData.completion + '%';

      markup += '<tr>' +
                  '<td>' + date + '</td>' +
                  '<td>' + priority + '</td>' +
                  '<td>' + estimated + '</td>' +
                  '<td>' + deadline + '</td>' +
                  '<td>' + completion + '</td>' +
                '</tr>'
      return markup;
    }

    // Creates comment markup.
    function createCommentMarkup(comment) {
      var markup = '';

      var author = '';
      if (APP_DATA.get().users[comment.data.author]) {
        author = APP_DATA.get().users[comment.data.author].data.username;
        author = UTILS.capitalizeFirstLetter(author);
      }

      var date = UTILS.formatTimestamp(+comment.data.date, true);

      markup += '<div id="' + comment.id + '" class="col-md-12">' +
                  '<div class="col-md-12">' +
                    '<span class="jscTaskViewPanelCommentAuthor col-md-6 text-left">' + author + '</span>' +
                    '<span class="jscTaskViewPanelCommentDate col-md-6 text-right">' + date + '</span>' +
                  '</div>' +
                  '<div class="panel panel-default col-md-12">' +
                    '<div class="panel-body">' +
                      '<div class="jscTaskViewPanelCommentText">' + comment.data.text + '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>';
      return markup;
    }


    taskViewElem.querySelector('tbody').innerHTML = createInnerInfoMarkup();
    taskViewElem.querySelector('#jscTaskViewPanelStatus').innerHTML = UTILS.capitalizeFirstLetter(CONFIG.status[taskData.status]);

    var clientName = 'No client assigned yet';
    if (taskData.client && taskData.client !== '' && APP_DATA.get().users[taskData.client]) {
     clientName = UTILS.capitalizeFirstLetter(APP_DATA.get().users[taskData.client].data.username);
    }
    taskViewElem.querySelector('#jscTaskViewPanelClient').innerHTML = clientName;

    var workerName = 'No worker assigned yet';
    if (taskData.worker && taskData.worker !== '' && APP_DATA.get().users[taskData.worker]) {
     workerName = UTILS.capitalizeFirstLetter(APP_DATA.get().users[taskData.worker].data.username);
    }
    taskViewElem.querySelector('#jscTaskViewPanelWorker').innerHTML = workerName;

    taskViewElem.querySelector('#jscTaskViewPanelTitle').innerHTML = taskData.title;
    taskViewElem.querySelector('#jscTaskViewPanelDescription').innerHTML = taskData.description;

    var commentsMarkup = '';
    for (var i = 0; i < taskData.comments.length; i++) {
      var commentId = taskData.comments[i];
      commentsMarkup += createCommentMarkup(APP_DATA.get().comments[commentId]);
    }
    taskViewElem.querySelector('.jscTaskViewPanelCommentsContainer').innerHTML = commentsMarkup;

    if (commentsMarkup !== '') {
      taskViewElem.querySelector('#commentsEmpty').style.display = 'none';
    }
    else {
      taskViewElem.querySelector('#commentsEmpty').style.display = '';
    }

  }

  /**
   * Prefills Task Edit form with data.
   */
  function prefillTaskEditForm(taskId) {
    var editFormElem = blocks['jscEditTaskPanel'].el;
    var taskData = APP_DATA.get().tasks[taskId].data;

    editFormElem.querySelector('#jscEditTaskPanelInputTitle').value = taskData.title;
    editFormElem.querySelector('#jscEditTaskPanelInputDescription').value = taskData.description;

    if (verifyRights('0')) {
      var workerName = 'No worker assigned yet';
      if (taskData.worker && taskData.worker !== '' && APP_DATA.get().users[taskData.worker]) {
       workerName = UTILS.capitalizeFirstLetter(APP_DATA.get().users[taskData.worker].data.username);
      }
      editFormElem.querySelector('#jscEditTaskPanelInputWorkerName').innerHTML = workerName;

      editFormElem.querySelector('#jscEditTaskPanelInputPriority').value = taskData.priority;
      editFormElem.querySelector('#jscEditTaskPanelInputEstimated').value = taskData.estimated;

      var deadline = taskData.deadline;
      if (deadline && deadline !== '') {
        editFormElem.querySelector('#jscEditTaskPanelInputDeadline').value = UTILS.stringifyDate(new Date(+deadline));
      }
    }

    editFormElem.querySelector('#jscEditTaskPanelInputStatus').value = taskData.status;

    if (verifyRights('0,2')) {
      editFormElem.querySelector('#jscEditTaskPanelInputCompletion').value = taskData.completion;
    }
  }

  /**
   * Refresh header panel.
   */
  function refreshHeader() {
     var headerElem = blocks['jscHeaderPanel'].el;
     headerElem.querySelector('#jscHeaderPanelUsername').innerHTML = UTILS.capitalizeFirstLetter(AUTH.getUser().data.username);
     var backButton = headerElem.querySelector('#jscHeaderPanelBack');
     if (mainContentCurrentBlock === 'jscTaskListPanel') {
       UTILS.removeClass(backButton, 'visible');
     }
     else if (mainContentCurrentBlock === 'jscTaskViewPanel') {
       UTILS.addClass(backButton, 'visible');
     }
  }

  /**
   * Initializes UI and selectes starting visible panel.
   */
  function init() {

    initBlocks();

    if (AUTH.getUser()) {
      refreshTaskList();
      refreshHeader();
      handleRightsControlledVisibility();
      blocks['jscHeaderPanel'].show();
      mainContentCurrentBlock = 'jscTaskListPanel';
      blocks[mainContentCurrentBlock].show();
    }
    else {
      mainContentCurrentBlock = 'jscLoginPanel';
      blocks[mainContentCurrentBlock].show();
    }
  }

  uc.init = init;

  return uc;
})(UI_CONTROL || {});
