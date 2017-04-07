app.controller('CollectionController', ['SongFactory', function(SongFactory) {
  var self = this;
  console.log('in CollectionController');
  self.songs = SongFactory.songCollection;
}]);
