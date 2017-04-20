app.factory('SongFactory', ['$firebaseAuth', '$http', 'angularFilepicker', '$location', '$routeParams',function ($firebaseAuth, $http, angularFilepicker, $location, $routeParams) {
  var auth = $firebaseAuth();
  var songCollection = {list: []};
  var oneSong = {details: {}};
  var filesUploaded = {list:[]};
  var notationUploaded = {list:[]};
  var attachments = {attachments: [], notation: []};
  var dropdowns = {formType: [], songType: [], language: [], meter: [], scaleMode: [], teachableElements: []};
  var fileStackAPI = 'AIJdcA3UQs6mAMvmUvaTkz'; // NOTE: create as environment var when move to Heroku
  var client = filestack.init(fileStackAPI);
  var selectedSong = {};
  var songClicked = false;
  auth.$onAuthStateChanged(getAllSongs);
  auth.$onAuthStateChanged(getDropdownValues);

  // if($routeParams.id) {  //removed as not being passed in dynamic main page
  //   auth.$onAuthStateChanged(getOneSong);
  //   auth.$onAuthStateChanged(getAttachments);
  // }
  function changeSongClickedStatus(status) {
    songClicked = status;
  }

  // on click function that redirects us to the card's full view
  function showSong(id) {
    // $location.url('/edit/' + id); //removed for dynamic main page
    getAttachments(id);
    getNotation(id);
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
    filesUploaded.list = [];
    var firebaseUser = auth.$getAuth();
    if(firebaseUser) {
      firebaseUser.getToken().then(function (idToken) {
        $http({
          method: 'GET',
          url: '/songs/singleSong/' + songId,
          headers: {
            id_token: idToken
          }
        }).then(function(response) {
          console.log('onesong from database', oneSong);
          oneSong.details = response.data;
          oneSong.details.rhythmArray = prepareRhythmForFont(oneSong.details.rhythm); //converts the rhythm string from db to an array for displaying correct portions as MusiSync font
          oneSong.details.extractableRhythmArray = prepareExtractableRhythmForFont(oneSong.details.extractable_rhythms); //"" as above but for extractable rhythms
        });
      });
    } else {
      songCollection = {};
      console.log('cannot get when not logged in');
    }
  }

  // send file to FileStack and db at the same time
  function fileUpload(songId) {
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
        result.filesUploaded.isNotation = false;
        filesUploaded.list = result.filesUploaded;
        var firebaseUser = auth.$getAuth();
        if(firebaseUser) {
          firebaseUser.getToken().then(function (idToken) {
            $http({
              method: 'POST',
              url: '/songs/addImage/' + songId,
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

    function notationUpload(songId) {
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
          console.log('file uploaded, now sending to database... ', result.notationUploaded);
          result.isNotation = true;
          notationUploaded.list = result.notationUploaded;
          console.log(result);
          var firebaseUser = auth.$getAuth();
          if(firebaseUser) {
            firebaseUser.getToken().then(function (idToken) {
              $http({
                method: 'POST',
                url: '/songs/addImage/' + songId,
                data: result,
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
            url: '/songs/getAttachments/' + songId,
            headers: {
              id_token: idToken
            }
          }).then(function(response) {
            attachments.attachments = response.data;
          });
        });
      } else {
        console.log('not logged in!');
      }
    }

    function getNotation(songId) {
      console.log('hitting get notation function');
      var firebaseUser = auth.$getAuth();
      if(firebaseUser) {
        firebaseUser.getToken().then(function (idToken) {
          console.log('firebase user authenticated');
          $http({
            method: 'GET',
            url: '/songs/getNotation/' + songId,
            headers: {
              id_token: idToken
            }
          }).then(function(response) {
            attachments.notation = response.data;
          });
        });
      } else {
        console.log('not logged in!');
      }
    }

    function getDropdownValues() {
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
      console.log('newSong', newSong);
      var firebaseUser = auth.$getAuth();
      if(firebaseUser) {
        firebaseUser.getToken().then(function (idToken) {
          $http({
            method: 'POST',
            url: '/songs/newSong',
            data: newSong,
            headers: {
              id_token: idToken
            }
          }).then(function(response) {
            console.log(response.data);
            getAllSongs();
          });
        });
      } else {
        console.log('not logged in!');
      }
    }

    function updateSong(changedSong) {
      console.log('existing song with changes', changedSong);
      var firebaseUser = auth.$getAuth();
      if(firebaseUser) {
        firebaseUser.getToken().then(function (idToken) {
            $http({
              method: 'PUT',
              url: '/songs/editSong/' + changedSong.id,
              data: changedSong,
              headers: {
                id_token: idToken
              }
            }).then(function(response) {
              console.log('updated song');
              getOneSong(changedSong.id);

            });
        });
      } else {
        console.log('not logged in!');
      }
    }

    function deleteSong(songId) {
      var firebaseUser = auth.$getAuth();
      if(firebaseUser) {
        return firebaseUser.getToken().then(function (idToken) {
          $http({
            method: 'DELETE',
            url: '/songs/removeSong/' + songId,
            headers: {
              id_token: idToken
            }
          }).then(function(response) {
            getAllSongs();
          });
        });
      } else {
        console.log('not logged in!');
      }
    }

    // start share song
    function shareSong(emailAddress, imageId) {
      console.log('hit shareSong in song.factory');
      console.log('emailAddress:', emailAddress);
      console.log('imageId:', imageId);
      $http({
        method: 'POST',
        url: '/shareSong',
      }).then(function(response){
        console.log('response from shareSong', response);
        sharesong.imageId = response.data;
        console.log('response.data is', response.data);
        console.log('shareSong.imageId is', shareSong.imageId);
        if (shareSong.imageId === undefined) {
          console.log('response to shareSong.imageId is undefined');
        } else {
          console.log('response to shareSong.imageId is defined');
        }
      });
    }
    // end share song

    function prepareRhythmForFont(rhythmString) {
      if(rhythmString===null || rhythmString ==='') {
        return [];
      } else {
        var textString = '';
        var newString = rhythmString;
        if (rhythmString.indexOf("internal")>=0 || rhythmString.indexOf("(internal)")>=0) {
          newString = newString.replace('internal', '');
          newString = newString.replace('(internal)', '');
          textString += 'internal ';
        }
        if (rhythmString.indexOf("eighth")>=0) {
          newString = newString.replace('eighth', '');
          textString += 'eighth ';
        }
        if (rhythmString.indexOf("anacrusis")>=0 || rhythmString.indexOf("anacrusic")>=0) {
          newString = newString.replace('anacrusis', '');
          newString = newString.replace('anacrusic', '');
          textString += 'anacrusis ';
        }
        if (rhythmString.indexOf("all syncopated")>=0) {
          newString = newString.replace('all syncopated', '');
          textString += 'all syncopated ';
        }
        return [newString, textString];
      }
    }

    function prepareExtractableRhythmForFont(extractableRhythmString) {
      if(extractableRhythmString===null || extractableRhythmString==='') {
        return [];
      } else {
        var resultArray = extractableRhythmString.split(/\(([^)]+)\)/); //checks for Regex of anything between "(" and ")", splits on these values

        for (var i = 0; i < resultArray.length; i++) {
          if(i%2!==0) {
            resultArray[i] = '(' + resultArray[i] + ')';
          }
        }

        return resultArray;
      }

    }

    return {
      showSong: showSong,
      getAllSongs: getAllSongs,
      songCollection: songCollection,
      getOneSong: getOneSong,
      oneSong: oneSong,
      fileUpload: fileUpload,
      filesUploaded: filesUploaded,
      notationUpload: notationUpload,
      notationUploaded: notationUploaded,
      attachments: attachments,
      dropdowns: dropdowns,
      saveNewSong: saveNewSong,
      updateSong: updateSong,
      deleteSong: deleteSong,
      prepareRhythmForFont: prepareRhythmForFont,
      prepareExtractableRhythmForFont: prepareExtractableRhythmForFont,
      changeSongClickedStatus: changeSongClickedStatus,
      songClicked: songClicked,
      shareSong: shareSong
      // removeImage: removeImage
    };
  }]);
