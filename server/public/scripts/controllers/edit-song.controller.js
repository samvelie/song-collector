app.controller('EditSongController', ['SongFactory', '$routeParams', 'angularFilepicker', function (SongFactory, $routeParams, angularFilepicker) {

  var self = this;

  SongFactory.getOneSong();
  SongFactory.getAllSongs();
  SongFactory.getAttachments();
  console.log('SongFactory.oneSong', SongFactory.oneSong);

  self.songs = SongFactory.songCollection; // for the left-hand card view sidebar
  self.fileUpload = SongFactory.fileUpload;
  self.filesUploaded = SongFactory.filesUploaded; // will grab existing files uploaded by the user
  // self.removeImage = SongFactory.removeImage;
  self.oneSong = SongFactory.oneSong;
  self.showSong = SongFactory.showSong;
  self.attachments = SongFactory.attachments;
  console.log('attachments', self.attachments);
  // move to factory -- used in both edit-song.controller and collection.controller
  self.expandFilter = function() {
    if(self.spanClicked) {
      self.spanClicked = false;
    } else {
      self.spanClicked = true;
    }
  };


}]);
