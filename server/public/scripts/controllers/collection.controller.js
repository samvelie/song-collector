app.controller('CollectionController', ['SongFactory', function(SongFactory) {
  var self = this;
  console.log('in CollectionController');
  //full song collection
  self.songs = SongFactory.songCollection;

  //boolean to hide/show single song
  self.songClicked = false;

  self.oneSong = SongFactory.oneSong; //single song information
  self.fileUpload = SongFactory.fileUpload; //function for uploading
  self.filesUploaded = SongFactory.filesUploaded; //files for single song
  self.attachments = SongFactory.attachments; //attachments for single song
  self.dropdowns = SongFactory.dropdowns;
// have a promise so that after a song is deleted, user gets redirected back to the main card view
// need to create a confirmation popup and an alert of deletion popup
  self.deleteFunction = function(songId) {
    SongFactory.deleteSong(songId).then(function() {
      self.songClicked = false;
      self.deleteSuccessMessage = 'Song Deleted';
    });
  };

  self.showSong = function(songId) {
        console.log('show song of id ' + songId);
    self.songClicked = true;
    SongFactory.showSong(songId);

  };

  self.expandFilter = function() {
    if(self.spanClicked) {
      self.spanClicked = false;
    } else {
      self.spanClicked = true;
    }
  };
}]);
