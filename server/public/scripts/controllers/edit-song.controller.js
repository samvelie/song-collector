app.controller('EditSongController', ['SongFactory', '$routeParams', 'angularFilepicker', '$location', function (SongFactory, $routeParams, angularFilepicker, $location) {

  var self = this;

  self.index = $routeParams.index;
  self.songs = SongFactory.songCollection;
  self.message = 'This is the EditSongController View';
  // self.showPicker = SongFactory.showPicker;
  self.fileUpload = SongFactory.fileUpload;
  self.filesUploaded = SongFactory.filesUploaded;
  self.songInfo = SongFactory.songCollection;
  // self.removeImage = SongFactory.removeImage;

  // move to factory -- used in both edit-song.controller and collection.controller
  self.expandFilter = function() {
    if(self.spanClicked) {
      self.spanClicked = false;
    } else {
      self.spanClicked = true;
    }
  };

  self.showSong = function (song, index) {
    console.log('showSong clicked:', song);
    console.log('on index', index);
    selectedSong = song;
    //change url to edit with index
    $location.url('/edit/' + index);
  };
}]);
