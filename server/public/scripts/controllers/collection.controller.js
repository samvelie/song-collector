app.controller('CollectionController', ['SongFactory', function(SongFactory) {
  var self = this;
  console.log('in CollectionController');
  self.songs = SongFactory.songCollection;

  var selectedSong = {};

  self.expandFilter = function() {
    if(self.spanClicked) {
      self.spanClicked = false;
    } else {
      self.spanClicked = true;
    }
  };

  self.showSong = function (song) {
    console.log('showSong clicked:', song);
    selectedSong = song;
  }
}]);
