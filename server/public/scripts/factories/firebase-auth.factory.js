app.factory('FirebaseAuthFactory', ['$firebaseAuth', function($firebaseAuth) {
  var auth = $firebaseAuth();

    return auth;
  }]);
