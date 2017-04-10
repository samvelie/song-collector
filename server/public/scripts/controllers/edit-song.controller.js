app.controller('EditSongController', ['SongFactory', '$routeParams', 'angularFilepicker', function (SongFactory, $routeParams, angularFilepicker) {

  var self = this;

  self.index = $routeParams.index;

  self.message = 'This is the EditSongController View';
  // self.showPicker = SongFactory.showPicker;
  self.fileUpload = SongFactory.fileUpload;
  self.filesUploaded = SongFactory.filesUploaded;
  self.songInfo = SongFactory.songCollection;
}]);
