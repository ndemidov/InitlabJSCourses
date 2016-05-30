var VALIDATE = (function(vl) {

  /**
   * Validates username token.
   */
  function validateUsername(username) {
    var usernameRegex = /^[a-zA-Z0-9]{2,30}$/;
    return usernameRegex.test(username);
  }

  /**
   * Validates client.
   */
  function validateUserId(userId) {
    var userIdRegex = /^users[0-9]*$/;
    return userIdRegex.test(userId);
  }

  /**
   * Validate title.
   */
  function validateTitle(title) {
    var titleRegex = /^[a-zA-Z0-9\s!?*,.()]{3,80}$/;
    return titleRegex.test(title);
  }

  /**
   * Validate description.
   */
  function validateDescription(description) {
    var descriptionRegex = /^[a-zA-Z0-9\s!?*,.()]{3,300}$/;
    return descriptionRegex.test(description);
  }

  /**
   * Validate estimated hours.
   */
  function validateEstimated(estimated) {
    var estimatedRegex = /^[0-9.,]*$/;
    return estimatedRegex.test(estimated);
  }

  /**
   * Validate priority.
   */
  function validatePriority(priority) {
    var priorityRegex = /^[0-3]{1}$/;
    return priorityRegex.test(priority);
  }

  /**
   * Validate status.
   */
  function validateStatus(status) {
    var statusRegex = /^[0-2]{1}$/;
    return statusRegex.text(status);
  }

  /**
   * Validate deadline.
   */
  function validateDeadline(date) {
    var matches = /^(\d{4})[-\/](\d{2})[-\/](\d{2})$/.exec(date);
    if (matches == null) return false;
    var d = matches[3];
    var m = matches[2] - 1;
    var y = matches[1];
    var composedDate = new Date(y, m, d);
    return composedDate.getDate() == d &&
            composedDate.getMonth() == m &&
            composedDate.getFullYear() == y;
  }

  vl.username = validateUsername;
  vl.userId = validateUserId;
  vl.title = validateTitle;
  vl.description = validateDescription;
  vl.estimated = validateEstimated;
  vl.priority = validatePriority;
  vl.status = validateStatus;
  vl.deadline = validateDeadline;

  return vl;
})(VALIDATE || {});
