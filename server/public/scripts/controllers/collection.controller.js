app.controller('CollectionController', ['SongFactory', function(SongFactory) {
  var self = this;
  console.log('in CollectionController');
  self.songs = SongFactory.songCollection;
  // self.showSong = SongFactory.showSong;

  var selectedSong = {};
  self.songClicked = false;

  self.showSong = function(index) {
    // self.songClicked = true;
    console.log('songClicked:', self.songClicked);
    console.log('show song of index ' + index);
    console.log(self.songs.list[index]);
  }

  self.expandFilter = function() {
    if(self.spanClicked) {
      self.spanClicked = false;
    } else {
      self.spanClicked = true;
    }
  };
}]);
