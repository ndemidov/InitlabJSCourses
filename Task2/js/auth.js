var AUTH = (function(ath) {

  var loggedInUser = null;

  function getUser() {
    return loggedInUser;
  }

  function handleLogin(username) {
    if (logUserIn(username) === true) {
      saveAuth({'username': username});
      return true;
    }
    return false;
  }

  function handleLogout() {
    if (loggedInUser) {
      APP_STORAGE.removeGrp('auth');
      loggedInUser = null;
      return true;
    }
    return false;
  }

  function logUserIn(username) {
    var userEntity = APP_DATA.findUserByName(username);
    if (userEntity) {
      loggedInUser = userEntity;
      return true;
    }
    return false;
  }

  function saveAuth(authInfo) {
    APP_STORAGE.saveGrp('auth', JSON.stringify(authInfo));
  }

  function init() {
    var authInfo = APP_STORAGE.getGrp('auth');
    if (authInfo) {
      authInfo = JSON.parse(authInfo);
      logUserIn(authInfo.username);
    }
  }

  ath.init = init;
  ath.getUser = getUser;
  ath.login = handleLogin;
  ath.logout = handleLogout;

  return ath;
})(AUTH || {});
