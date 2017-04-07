app.controller('LoginController', ['$firebaseAuth', '$http', function($firebaseAuth, $http) {
  var self = this;
  var auth = $firebaseAuth();
  var loggedIn = {};

  self.logIn = function() {
    console.log('login clicked in navbar');
    auth.$signInWithPopup("google").then(function(firebaseUser) {
      console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
      console.log('');
    }).catch(function(error) {
      console.log("Authentication failed: ", error);
    });
  };

  getUserData = function (firebaseUser) {
    firebaseUser.getToken().then(function(idToken){
      $http({
        method: 'GET',
        url: '/users',
        headers: {
          id_token: idToken
        }
      }).then(function(response) {
        console.log('from user get', response.data);
      });
    });
  };



  auth.$onAuthStateChanged(function(firebaseUser) {
    // Check directly if firebaseUser is null
    loggedIn.value = firebaseUser !== null;
    if (loggedIn.value) {
      console.log('user is logged in');
      getUserData(firebaseUser);
    } else {
      console.log('user is not logged in');
    }
  });

}]);
