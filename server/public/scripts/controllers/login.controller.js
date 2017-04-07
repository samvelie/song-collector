app.controller('LoginController', ['$firebaseAuth', function($firebaseAuth) {
  var self = this;
  var auth = $firebaseAuth();

  self.logIn = function() {
    console.log('login clicked in navbar');
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  };

}]);
