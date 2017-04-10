app.factory('SongFactory', ['$firebaseAuth', '$http', 'angularFilepicker', function ($firebaseAuth, $http, angularFilepicker) {
  var auth = $firebaseAuth();
  var songCollection = {};
  var filesUploaded = {list:[]};
  var fileStackAPI = 'AIJdcA3UQs6mAMvmUvaTkz';
  var client = filestack.init(fileStackAPI);

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

  // on success of pickFile, add files to array

  function fileUpload() {
    client.pick(
      {
        accept: 'image/*',
        fromSources: ['local_file_system', 'googledrive', 'imagesearch', 'dropbox'],
        maxFiles: 1,
        // storeTo: {
        // location: 's3'
        // }
      }).then(function(result) {
        console.log(result.filesUploaded);
        filesUploaded.list = result.filesUploaded;
        var firebaseUser = auth.$getAuth();
        if(firebaseUser) {
          firebaseUser.getToken().then(function (idToken) {
            $http({
              method: 'POST',
              url: '/songs/addImage',
              data: result.filesUploaded,
              headers: {
                id_token: idToken
              }
            }).then(function() {
              console.log('we did the post thing!');
            });
          });
        } else {
          console.log('not logged in!');
        }
      });
    }

    return {
      getAllSongs: getAllSongs,
      songCollection: songCollection,
      fileUpload: fileUpload,
      filesUploaded: filesUploaded
    };
  }]);
