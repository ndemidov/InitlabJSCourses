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
    var target = event.target;

    // Contruct event id from event name and target element id.
    var eventId = event.type + '*' + target.getAttribute('id');

    // Call handling function for event.
    if (this.handlersSettings[eventId]) {
      this.handlersSettings[eventId].handler(event);
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
        handler: this.genericEventHandler.bind(this, eventId),
        target: settings[i].target
      };

      if (settings[i].callback) {
        params.outerCallback = settings[i].callback;
      }

      this.addHandlersSettings(params);
      /*if (this.handlersSettings[eventId]) {
        if (settings[i].callback) {
          this.handlersSettings[eventId].outerCallback = settings[i].callback;
        }
        this.handlersSettings[eventId].target = settings[i].target;
        this.el.addEventListener(settings[i].event, this.delegateEvents.bind(this), false);
      }*/

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
        handler: params.handler,
        target: params.target,
        outerCallback: params.outerCallback
      };
    }
  };

  /**
   * Handles events in generic way, basically runs provided outer callbacks.
   */
  UIBasePanel.prototype.genericEventHandler = function(eventId, event) {
    var that = this;
    event.preventDefault();
    if (that.handlersSettings[eventId].outerCallback) {
      that.handlersSettings[eventId].outerCallback(event.target);
    }
  };

  // Exports.
  ub.UIBasePanel = UIBasePanel;

  return ub;
})(UI_BLOCKS || {});
