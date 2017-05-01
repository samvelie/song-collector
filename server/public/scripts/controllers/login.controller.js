app.controller('LoginController', ['AuthFactory', 'SongFactory', '$scope', function(AuthFactory, SongFactory, $scope) {
  var self = this;
  self.login = AuthFactory.logIn;
  self.logout = AuthFactory.logOut;
  self.user = AuthFactory.userInfo;
  self.songClicked = SongFactory.songClicked;
  self.loggedIn = AuthFactory.newLoggedIn; // doesn't work -- trying to use self.loggedIn on client side for ng-if

}]);
