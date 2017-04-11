app.controller('LoginController', ['AuthFactory', function(AuthFactory) {
  var self = this;
  self.login=AuthFactory.logIn;
  self.logout=AuthFactory.logOut;
  self.user = AuthFactory.userInfo;
  console.log('In LoginController');

  self.loggedIn = AuthFactory.newLoggedIn; // doesn't work -- trying to use self.loggedIn on client side for ng-if
  console.log('logged in', AuthFactory.newLoggedIn);


}]);
