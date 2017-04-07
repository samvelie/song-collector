app.controller('CollectionController', ['SongFactory', '$location', function(SongFactory, $location) {
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

  self.showSong = function (song, index) {
    console.log('showSong clicked:', song);
    console.log('on index', index);
    selectedSong = song;
    //change url to edit with index
    $location.url('/edit/' + index)
  }
}]);
