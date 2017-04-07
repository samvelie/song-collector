app.controller('LoginController', ['AuthFactory', function(AuthFactory) {
  var self = this;
  self.login=AuthFactory.logIn;
  self.logout=AuthFactory.logOut;
  self.user = AuthFactory.userInfo;
  console.log('In LoginController');




}]);
