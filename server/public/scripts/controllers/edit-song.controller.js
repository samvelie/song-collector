app.controller('EditSongController', ['SongFactory', '$routeParams', function (SongFactory, $routeParams) {

  var self = this;

  self.index = $routeParams.index;

  self.message = 'This is the EditSongController View';

  self.songInfo = SongFactory.songCollection;

}]);
