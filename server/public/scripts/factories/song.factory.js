app.factory('SongFactory', ['$firebaseAuth', '$http', 'angularFilepicker', function ($firebaseAuth, $http, angularFilepicker) {
  var auth = $firebaseAuth();
  var songCollection = {};
  var filesUploaded = {list:[]};
  var fileStackAPI = 'AIJdcA3UQs6mAMvmUvaTkz';
  var client = filestack.init(fileStackAPI);
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

    // remove Image function
    // function removeImage() {
    //   var storedurl = filesUploaded.list[0].url;
    //   console.log(filesUploaded.list[0].url);
    //   var handle = storedurl.substr(storedurl.lastIndexOf("/") + 1);
    //   console.log(handle);
    //   client.remove(handle);
    //   console.log('file removed successfully: ' + storedurl);
    // }

    return {
      getAllSongs: getAllSongs,
      songCollection: songCollection,
      fileUpload: fileUpload,
      filesUploaded: filesUploaded,
      // removeImage: removeImage
    };
  }]);
