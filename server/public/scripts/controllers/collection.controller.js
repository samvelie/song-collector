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

  // self.htmlPopover = '<b style="color: red">I can</b> have <div class="label label-success">HTML</div> content';
  self.htmlPopover = 'Share this song:<input type="text" class="form-control" placeholder="Email address"><button class="btn btn-default" type="submit">';

  self.dynamicPopover = {
    content: 'Hello, World!',
    templateUrl: 'myPopoverTemplate.html',
    title: 'Share this song:'
  };

}]);
