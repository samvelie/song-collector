app.controller('NewSongController', ['SongFactory', function(SongFactory) {

  var self = this;

  self.fileUpload = SongFactory.fileUpload;
  self.attachments = SongFactory.attachments;
  // self.showPicker = SongFactory.showPicker;

  self.dropdowns = SongFactory.dropdowns;
  self.newSongObject = {};

  self.saveNewSong = SongFactory.saveNewSong;

}]);
