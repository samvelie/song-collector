app.factory('UserFactory', ['FirebaseAuthFactory', '$http',function (FirebaseAuthFactory, $http) {
  var auth = FirebaseAuthFactory;
  var users = {list:[]};
  var adminWarning = {};
  // auth.$onAuthStateChanged(getAllUsers);

  getAllUsers = function() {
    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function (idToken) {
        $http({
          method: 'GET',
          url: '/users/allUsers',
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          users.list = response.data;
          console.log('userlist', users.list);
        });
      });
    }
  };

  setAdminStatus = function(oldStatus, userId) {
    var usersNewAdminStatus = {newStatus: !oldStatus};
    console.log('usersNewAdminStatus', usersNewAdminStatus);
    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function (idToken) {
        $http({
          method: 'PUT',
          url: '/users/editUserAdminStatus/' + userId,
          data: usersNewAdminStatus,
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          console.log(response.data);
          // if adminWarning is false, user can't remove another administrator
          adminWarning = response.data;
          getAllUsers();
        });
      });
    }
  };

  setActiveStatus = function(oldStatus, userId) {
    var usersNewActiveStatus = {newStatus: !oldStatus};
    console.log('usersNewActiveStatus', usersNewActiveStatus);
    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function (idToken) {
        $http({
          method: 'PUT',
          url: '/users/editUserActiveStatus/' + userId,
          data: usersNewActiveStatus,
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          console.log(response);
          getAllUsers();
        });
      });
    }
  };

  return {
    getAllUsers: getAllUsers,
    users: users,
    setAdminStatus: setAdminStatus,
    setActiveStatus: setActiveStatus
  };
}]);
