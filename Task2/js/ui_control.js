var UI_CONTROL = (function(uc) {

  var mainContentCurrentBlock = null;

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

            var usernameField = target.querySelector('#jscLoginPanelInputUsername');
            var usernameValue = usernameField.value;
            if (usernameValue === '') {
              console.log('Login must be specified');
              return;
            }

            if (!AUTH.login(usernameValue.toLowerCase())) {
              console.log('Login incorrect');
              return;
            }

            blocks[mainContentCurrentBlock].hide(function() {
              usernameField.value = '';
              blocks['jscHeaderPanel'].show();
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

            // TODO Validate form.

            blocks['jscCreateTaskPanel'].hide();
          }
        },
        {
          event: 'click',
          target: 'jscCreateTaskPanelAssignWorker',

          /**
           * Handles open of Assign Worker Panel.
           */
          callback: function() {
            blocks['jscAssignWorkerPanel'].show();
          }
        },
        {
          event: 'click',
          target: 'jscCreateTaskPanelClose',

          /**
           * Handles form close.
           */
          callback: function() {
            blocks['jscCreateTaskPanel'].hide();
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
          callback: function() {
            blocks['jscCreateTaskPanel'].show();
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
            var usernameInput = target.querySelector('#jscRegisterClientPanelInputName');
            var usernameValue = usernameInput.value;
            if (saveNewUser(usernameValue, '1')) {
              blocks['jscRegisterClientPanel'].hide(function() {
                usernameInput.value = '';
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
            var usernameInput = target.querySelector('#jscRegisterWorkerPanelInputName');
            var usernameValue = usernameInput.value;
            if (saveNewUser(usernameValue, '2')) {
              blocks['jscRegisterWorkerPanel'].hide(function() {
                usernameInput.value = '';
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
  };

  /**
   * Validates and saves new user.
   */
  function saveNewUser(usernameValue, role) {
    usernameValue = usernameValue.toLowerCase();
    if (usernameValue === '') {
      console.log('Username must be specified');
      return false;
    }

    if (!UTILS.validateUsername(usernameValue)) {
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
  };

  /**
   * Initializes UI and selectes starting visible panel.
   */
  function init() {

    initBlocks();

    if (AUTH.getUser()) {

      // TODO Handle rights to show proper content for user.

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
