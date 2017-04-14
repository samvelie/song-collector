app.factory('AuthFactory', ['$firebaseAuth', '$http', '$location', '$window', function($firebaseAuth, $http, $location, $window) {
  var auth = $firebaseAuth();
  var loggedIn = {};
  var userInfo = { info: '' };
  var newLoggedIn = { loginStatus: false };

  auth.$onAuthStateChanged(function(firebaseUser) {
    // Check directly if firebaseUser is null
    newLoggedIn.loginStatus = !!firebaseUser;
    console.log('newLoggedIn is', newLoggedIn);
    loggedIn.value = firebaseUser !== null;
    if (loggedIn.value) {
      console.log('user is logged in');
      getUserData(firebaseUser);
      //  $location.path('/collection');
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
          console.log('userInfo is', userInfo);
          console.log('userInfo.info is', userInfo.info);
          console.log('user is logged in as', userInfo.info.user_email);
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
      userInfo: userInfo,
      newLoggedIn: newLoggedIn
    };
  }]);
