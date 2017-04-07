app.factory('SongFactory', ['$firebaseAuth', '$http', function ($firebaseAuth, $http) {
  var auth = $firebaseAuth();
  var songCollection = {};
  var selectedSong = {};

  auth.$onAuthStateChanged(getAllSongs);

  function getAllSongs() {
    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function (idToken) {
        $http({
          method: 'GET',
          url: '/songs',
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          songCollection.list = response.data;
        });
      });
    } else {
      songCollection = {};
      console.log('cannot get when not logged in');
    }
  }
  
  return {
    getAllSongs: getAllSongs,
    songCollection: songCollection
  };
}]);
