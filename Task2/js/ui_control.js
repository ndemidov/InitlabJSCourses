var UI_CONTROL = (function(uc) {

  var mainContentCurrentBlock = null;
  var activePopupCurrentBlock = null;

  var blocks = {};

  // Settings of event handlers for each panel.
  var eventHandlingSettings = {
    'jscHeaderPanel': [
        {
          event: 'click',
          target: 'jscHeaderPanelLogout',

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
          target: 'jscHeaderPanelNewClient',

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
          target: 'jscHeaderPanelNewWorker',

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
      ],
    'jscLoginPanel': [
        {
          event: 'submit',
          target: 'jscLoginPanelForm',

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
              handleRightsControlledVisibility();
              mainContentCurrentBlock = 'jscTaskListPanel';
              blocks[mainContentCurrentBlock].show();
            });
          }
        }
      ],
    'jscCreateTaskPanel': [
        {
          event: 'submit',
          target: 'jscCreateTaskPanelForm',

          /**
           * Handles new task creation.
           */
          callback: function(target) {

            var formData = getFormData(target);

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

            if (formData.estimated !== "" && !VALIDATE.deadline(formData.deadline)) {
              console.log('Deadline is invalid');
              isValid = false;
            }

            if (!isValid) {
              console.log("Form did not pass validation");
              return;
            }

            //APP_DATA.createNewTask(formData);

            refreshTaskList();
            blocks['jscCreateTaskPanel'].hide(function() {
              resetForm(blocks['jscAssignClientPanel'].el.querySelector('#jscAssignClientPanelForm'));
              resetForm(blocks['jscAssignWorkerPanel'].el.querySelector('#jscAssignWorkerPanelForm'));
              resetForm(target);
            });
          }
        },
        {
          event: 'click',
          target: 'jscCreateTaskPanelAssignWorker',

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
          target: 'jscCreateTaskPanelAssignClient',

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
          target: 'jscCreateTaskPanelClose',

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
          target: 'jscTaskListPanelCreateTask',

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
        }
      ],
    'jscTaskViewPanel': [
        {

        }
      ],
    'jscCreateCommentPanel': [
        {
          event: 'click',
          target: 'jscCreateCommentPanelClose',

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
          target: 'jscRegisterClientPanelClose',

          /**
           * Handles panel close.
           */
          callback: function() {
            blocks['jscRegisterClientPanel'].hide();
          }
        },
        {
          event: 'submit',
          target: 'jscRegisterClientPanelForm',

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
          target: 'jscRegisterWorkerPanelClose',

          /**
           * Handles panel close.
           */
          callback: function(target) {
            blocks['jscRegisterWorkerPanel'].hide();
          }
        },
        {
          event: 'submit',
          target: 'jscRegisterWorkerPanelForm',

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
          target: 'jscEditTaskPanelClose',

          /**
           * Handles panel close.
           */
          callback: function() {
            blocks['jscEditTaskPanel'].hide();
          }
        }
      ],
    'jscAssignWorkerPanel': [
        {
          event: 'click',
          target: 'jscAssignWorkerPanelClose',

          /**
           * Handles panel close.
           */
          callback: function() {
            blocks['jscAssignWorkerPanel'].hide();
          }
        },
        {
          event: 'submit',
          target: 'jscAssignWorkerPanelForm',

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
          target: 'jscAssignClientPanelClose',

          /**
           * Handles panel close.
           */
          callback: function() {
            blocks['jscAssignClientPanel'].hide();
          }
        },
        {
          event: 'submit',
          target: 'jscAssignClientPanelForm',

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
  function handleRightsControlledVisibility() {
    if (!AUTH.getUser()) {
      return;
    }
    var rightsControlledElems = document.getElementsByClassName('rightsControlled');
    for (var i = 0; i < rightsControlledElems.length; i++) {
      var rcElem = rightsControlledElems[i];
      if (verifyRights(rcElem.getAttribute('showTo'))) {
        rcElem.style.display = 'block';
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
    console.log(formData);
    return formData;
  }

  /**
   * Prefills Task Edit form with data.
   */
  function prefillTaskEditForm() {

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
       dVal = APP_DATA.get().tasks[taskId][userTitle];
     }
     var markup = UTILS.createMarkupSelect(usersList, true, dVal);
     formSelect.innerHTML = markup;
   }

  /**
   * Resets entered data in a form.
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

    APP_DATA.addEnt('users', {
      'username': usernameValue,
      'role': role,
      'tasks': []
    });

    APP_DATA.saveGrp('users');
    return true;
  }

  /**
   * Refreshes Task List.
   */
  function refreshTaskList() {
    var taskList = blocks['jscTaskListPanel'];
    var tableBody = taskList.el.querySelector('tbody');
    var markup = "";
    var list = APP_DATA.get().tasks;
    for (var id in list) {
      var task = list[id];
      markup += '<tr id="' + id + '">';
      markup += '<td>' + UTILS.capitalizeFirstLetter(CONFIG.status[task.data.status]) + '</td>';
      markup += '<td class="rightsControlled" showTo="0,2">' + UTILS.capitalizeFirstLetter(CONFIG.priority[task.data.priority]) + '</td>';
      markup += '<td>' + task.data.title + '</td>';
      markup += '<td class="rightsControlled" showTo="0,2">' + task.data.deadline + '</td>'
      markup += '</tr>';
    }

    console.log(markup);
  }

  /**
   * Initializes UI and selectes starting visible panel.
   */
  function init() {

    initBlocks();

    if (AUTH.getUser()) {
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
