app.factory('SongFactory', ['$firebaseAuth', '$http', 'angularFilepicker', '$location', '$routeParams', function ($firebaseAuth, $http, angularFilepicker, $location, $routeParams) {
  var auth = $firebaseAuth();
  var songCollection = {list: []};
  var oneSong = {details: {}};
  var filesUploaded = {list:[]};
  var attachments = {list: []};
  var dropdowns = {formType: [], songType: [], language: [], meter: [], scaleMode: [], teachableElements: []};
  var fileStackAPI = 'AIJdcA3UQs6mAMvmUvaTkz'; // NOTE: create as environment var when move to Heroku
  var client = filestack.init(fileStackAPI);
  var selectedSong = {};
  auth.$onAuthStateChanged(getAllSongs);
  auth.$onAuthStateChanged(getDropdownValues);
  if($routeParams.id) {
    auth.$onAuthStateChanged(getOneSong);
    auth.$onAuthStateChanged(getAttachments);
  }

  // on click function that redirects us to the card's full view
  function showSong(id) {
    $location.url('/edit/' + id);
    getAttachments(id);
    getOneSong(id);
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
  function getOneSong(songId) {
    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function (idToken) {
        $http({
          method: 'GET',
          url: '/songs/singleSong/' + (typeof(songId) == "number" ? songId : $routeParams.id),
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
    console.log('file sending to FileStack...');
    client.pick(
      {
        accept: 'image/*',
        fromSources: ['local_file_system', 'googledrive', 'imagesearch', 'dropbox'],
        maxFiles: 1,
        // storeTo: {
        // location: 's3'
        // }
      }).then(function(result) {
        console.log('file uploaded, now sending to database... ', result.filesUploaded);
        filesUploaded.list = result.filesUploaded;
        var firebaseUser = auth.$getAuth();
        if(firebaseUser) {
          firebaseUser.getToken().then(function (idToken) {
            console.log('firebase user authenticated');
            $http({
              method: 'POST',
              url: '/songs/addImage/' + $routeParams.id,
              data: result.filesUploaded,
              headers: {
                id_token: idToken
              }
            }).then(function() {
              console.log('file posted to database!');
            });
          });
        } else {
          console.log('not logged in!');
        }
      });
    }

    function getAttachments(songId) {
      console.log('hitting get attachments function');
      var firebaseUser = auth.$getAuth();
      if(firebaseUser) {
        firebaseUser.getToken().then(function (idToken) {
          console.log('firebase user authenticated');
          $http({
            method: 'GET',
            url: '/songs/getAttachments/' + (typeof(songId) == "number" ? songId : $routeParams.id),
            headers: {
              id_token: idToken
            }
          }).then(function(response) {
            attachments.list = response.data;
            console.log('getting attachments!', attachments.list);
          });
        });
      } else {
        console.log('not logged in!');
      }
    }

    function getDropdownValues() {
      console.log('getting dropdowns?');
      var firebaseUser = auth.$getAuth();
      if(firebaseUser) {
        firebaseUser.getToken().then(function (idToken) {
          $http({
            method: 'GET',
            url: '/dropdowns/form-type',
            headers: {
              id_token: idToken
            }
          }).then(function(response) {
            dropdowns.formType = response.data;
          });
          $http({
            method: 'GET',
            url: '/dropdowns/song-type',
            headers: {
              id_token: idToken
            }
          }).then(function(response) {
            dropdowns.songType = response.data;
          });
          $http({
            method: 'GET',
            url: '/dropdowns/language',
            headers: {
              id_token: idToken
            }
          }).then(function(response) {
            dropdowns.language = response.data;
          });
          $http({
            method: 'GET',
            url: '/dropdowns/meter',
            headers: {
              id_token: idToken
            }
          }).then(function(response) {
            dropdowns.meter = response.data;
          });
          $http({
            method: 'GET',
            url: '/dropdowns/scale-mode',
            headers: {
              id_token: idToken
            }
          }).then(function(response) {
            dropdowns.scaleMode = response.data;
          });
          $http({
            method: 'GET',
            url: '/dropdowns/teachable-elements',
            headers: {
              id_token: idToken
            }
          }).then(function(response) {
            dropdowns.teachableElements = response.data;
          });
        });

      } else {
      }
    }

    function saveNewSong(newSong) {
      if(firebaseUser) {
        firebaseUser.getToken().then(function (idToken) {
          $http({
            method: 'POST',
            url: '/songs/newSong',
            headers: {
              id_token: idToken
            }
          }).then(function(response) {
            console.log(response.data);
          });
        });
      } else {
        console.log('not logged in!');
      }
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
      getAttachments: getAttachments,
      attachments: attachments,
      dropdowns: dropdowns,
      saveNewSong: saveNewSong
      // removeImage: removeImage
    };
  }]);
