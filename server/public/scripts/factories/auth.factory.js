app.factory('AuthFactory', ['$firebaseAuth', '$http', '$location', '$window', function($firebaseAuth, $http, $location, $window) {
  var auth = $firebaseAuth();
  var loggedIn = {};
  var userInfo = {};

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

    function logIn() {
      console.log('login clicked');
      auth.$signInWithPopup("google").then(function(firebaseUser) {
        console.log("Firebase Authenticated as: ", firebaseUser.user.displayName);
      }).catch(function(error) {
        console.log("Authentication failed: ", error);
      });
    }

    function getUserData(firebaseUser) {
      firebaseUser.getToken().then(function(idToken){
        $http({
          method: 'GET',
          url: '/users',
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          console.log('from user get', response.data);
          userInfo.info = response.data;
        });
      });
    }

    function logOut(){
      auth.$signOut().then(function(){
        console.log('Logging the user out!');
        $window.location.reload();
      });
    }

    return {
      logIn: logIn,
      logOut: logOut,
      userInfo: userInfo
    };
  }]);
