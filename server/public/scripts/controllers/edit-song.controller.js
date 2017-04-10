app.controller('EditSongController', ['SongFactory', 'angularFilepicker', function (SongFactory, angularFilepicker) {

  var self = this;

  self.message = 'This is the EditSongController View';
  // self.showPicker = SongFactory.showPicker;
  self.fileUpload = SongFactory.fileUpload;
  self.filesUploaded = SongFactory.filesUploaded;
}]);
