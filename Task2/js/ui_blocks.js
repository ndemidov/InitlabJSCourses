var UI_BLOCKS = (function(ub) {

  /**
   * Base block for all app ui blocks (panels, views, popups).
   */
  function UIBasePanel(id) {
    this.id = id;
    this.el = document.getElementById(id);

    this.handlersSettings = {};
    this.animated = false;
    this.visibilityCallback = null;
  }

  /**
   * Initializes panel instance.
   */
  UIBasePanel.prototype.init = function() {

    // Handle transition-based animation callbacks.
    if (UTILS.hasClass(this.el, 'animated')) {
      this.animated = true;
      this.el.addEventListener("transitionend", this.transFinished.bind(this), false);
    }
  };

  /**
   * Shows panel.
   */
  UIBasePanel.prototype.show = function(callback) {

    // Assign outer callback.
    this.handleCallback(callback, true);
    this.el.style.display = 'block';
    UTILS.addClass(this.el, 'visible');

    if (!this.animated) {

      // Run outer callback right away if transitionEnd event is not expected to fire.
      if (this.visibilityCallback) {
        this.visibilityCallback();
      }

      // Reset callback.
      this.handleCallback(false);
    }
  };

  /**
   * Hides panel.
   */
  UIBasePanel.prototype.hide = function(callback) {
    var that = this;

    // Register mutated callback.
    this.handleCallback(callback, true, function() {
      that.el.style.display = 'none';
    });

    UTILS.removeClass(this.el, 'visible');
    if (!this.animated) {
      if (this.visibilityCallback) {
        this.visibilityCallback();
      }
      this.handleCallback(false);
    }
  };

  /**
   * Handles transition-based animation finish.
   */
  UIBasePanel.prototype.transFinished = function(event) {
    if (this.visibilityCallback) {
      this.visibilityCallback();
    }
    this.handleCallback(false);
  };

  /**
   * Registers and resets show/hide callbacks.
   */
  UIBasePanel.prototype.handleCallback = function(callback, on, mutationCb) {
    if (on === true) {
      if (mutationCb) {

        // Extend outer callback with provided inner callback.
        if (callback) {
          this.visibilityCallback = function() {
            mutationCb();
            callback();
          };
        }
        else {
          this.visibilityCallback = function() {
            mutationCb();
          };
        }
      }
      else {
        if (callback) {
          this.visibilityCallback = function() {
            callback();
          };
        }
      }
      return;
    }
    this.visibilityCallback = null;
  };

  /**
   * Delegates event handling from single base element.
   */
  UIBasePanel.prototype.delegateEvents = function(event) {
    var eventType = event.type;
    var eventPath = event.path;

    /**
     * Checks if provided target has handler for this event.
     */
    function checkTarget(target) {
      var result = false;

      // Look in all registered handlers.
      for (var eventId in this.handlersSettings) {
        if (eventType === this.handlersSettings[eventId].type) {
          var targetSelector = this.handlersSettings[eventId].target;
          var prefix = targetSelector.charAt(0);
          var selector = targetSelector.substring(1);

          // Handle according to prefix.
          if (prefix === "#") {
            if (selector === target.getAttribute('id')) {
              result = eventId;
              break;
            }
          }
          else if (prefix === ".") {
            if (UTILS.hasClass(target, selector) === true) {
              result = eventId;
              break;
            }
          }
          else {
            console.log('Error: wrong or unsupported selector. Use #id or .class');
          }
        }
      }
      return result;
    }

    // Bind correct context to inner function.
    var checkTargetCntx = checkTarget.bind(this);

    var eventId = false;
    var expectedTarget = null;

    for (var i = 0; i < eventPath.length; i++) {
      var currentElem = eventPath[i];

      eventId = checkTargetCntx(currentElem);
      if (eventId !== false) {

        // Take expected event target.
        expectedTarget = currentElem;
        break;
      }

      if (currentElem === this.el) {
        break;
      }
    }

    if (eventId !== false) {
      this.handlersSettings[eventId].handler(event, expectedTarget);
    }
  };

  /**
   * Adds listeners and event handlers for panel based on outer settings.
   */
  UIBasePanel.prototype.addListeners = function(settings) {
    var alreadyAddedEvents = [];
    for (var i = 0; i < settings.length; i++) {
      var eventId = settings[i].event + '*' + settings[i].target;
      var params = {
        eventId: eventId,
        type: settings[i].event,
        handler: this.genericEventHandler.bind(this, eventId),
        target: settings[i].target
      };

      if (settings[i].callback) {
        params.outerCallback = settings[i].callback;
      }

      this.addHandlersSettings(params);

      // Add listeners for unique events only.
      if (!UTILS.inArray(alreadyAddedEvents, settings[i].event)) {
        this.el.addEventListener(settings[i].event, this.delegateEvents.bind(this), false);
        alreadyAddedEvents.push(settings[i].event);
      }
    }
  };

  // TODO
  /*UIBasePanel.prototype.removeListeners = function(settings) {
    for (var i = 0; i < settings.length; i++) {
      var eventId = settings[i].event + '*' + settings[i].target;
      if (this.handlersSettings[eventId]) {
        this.el.removeEventListener(settings[i].event, this.handlersSettings[eventId].handler);
      }
    }
  };*/

  /**
   * Initializes specific handlers for each event.
   */
  UIBasePanel.prototype.addHandlersSettings = function(params) {
    if (!this.handlersSettings[params.eventId]) {
      this.handlersSettings[params.eventId] = {
        type: params.type,
        handler: params.handler,
        target: params.target,
        outerCallback: params.outerCallback
      };
    }
  };

  /**
   * Handles events in generic way, basically runs provided outer callbacks.
   */
  UIBasePanel.prototype.genericEventHandler = function(eventId, event, expectedTarget) {
    var that = this;
    event.preventDefault();
    if (that.handlersSettings[eventId].outerCallback) {
      that.handlersSettings[eventId].outerCallback(expectedTarget);
    }
  };

  // Exports.
  ub.UIBasePanel = UIBasePanel;

  return ub;
})(UI_BLOCKS || {});
