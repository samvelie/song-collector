app.factory('SongFactory', ['$firebaseAuth', '$http', 'angularFilepicker', '$location', '$routeParams', function ($firebaseAuth, $http, angularFilepicker, $location, $routeParams) {
  var auth = $firebaseAuth();
  var songCollection = {};
  var oneSong = {details: {}};
  var filesUploaded = {list:[]};
  var fileStackAPI = 'AIJdcA3UQs6mAMvmUvaTkz'; // NOTE: create as environment var when move to Heroku
  var client = filestack.init(fileStackAPI);
  var selectedSong = {};

  auth.$onAuthStateChanged(getAllSongs);
  if($routeParams.id) {
    auth.$onAuthStateChanged(getOneSong);
  }

  // on click function that redirects us to the card's full view
  function showSong(id) {
    $location.url('/edit/' + id);
  }

  // gets all songs from the db
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

  // get's one song from the database based on the song's ID grabbed from $routeParams
  function getOneSong() {
    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function (idToken) {
        $http({
          method: 'GET',
          url: '/songs/singleSong/' + $routeParams.id,
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          oneSong.details = response.data;
        });
      });
    } else {
      songCollection = {};
      console.log('cannot get when not logged in');
    }
  }

  // send file to FileStack and db at the same time
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
      showSong: showSong,
      getAllSongs: getAllSongs,
      songCollection: songCollection,
      getOneSong: getOneSong,
      oneSong: oneSong,
      fileUpload: fileUpload,
      filesUploaded: filesUploaded,
      // removeImage: removeImage
    };
  }]);
