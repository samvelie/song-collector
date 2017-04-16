app.controller('CollectionController', ['SongFactory', function(SongFactory) {
  var self = this;
  console.log('in CollectionController');
  //full song collection
  self.songs = SongFactory.songCollection;

  //boolean to hide/show single song
  self.songClicked = false;

  self.editingRhythm = false;
  self.editingExtractableRhythm = false;

  self.oneSong = SongFactory.oneSong; //single song information
  self.fileUpload = SongFactory.fileUpload; //function for uploading
  self.filesUploaded = SongFactory.filesUploaded; //files for single song
  self.attachments = SongFactory.attachments; //attachments for single song

// have a promise so that after a song is deleted, user gets redirected back to the main card view
// need to create a confirmation popup and an alert of deletion popup
  self.deleteFunction = function(songId) {
    SongFactory.deleteSong(songId).then(function() {
      self.songClicked = false;
      self.editingRhythm = false;
      self.editingExtractableRhythm = false;
      self.deleteSuccessMessage = 'Song Deleted';
    });
  };

  self.showSong = function(songId) {
        console.log('show song of id ' + songId);
    SongFactory.showSong(songId);
    self.songClicked = true;
    self.editingRhythm = false;
    self.editingExtractableRhythm = false;
  };

  self.expandFilter = function() {
    if(self.spanClicked) {
      self.spanClicked = false;
    } else {
      self.spanClicked = true;
    }
  };

  self.loseFocus = function(fieldId, rhythmString) {
    if(fieldId == 'rhythm') {
      self.editingRhythm = false;
    }
    if(fieldId == 'extractableRhythm') {
      self.editingExtractableRhythm = false;
    }

  };

  //placeholder function that needs to focus on input field as it appears
  self.findFocus = function(fieldId) {
    if(fieldId == 'rhythm') {
      self.editingRhythm = true;
    }
    if(fieldId == 'extractableRhythm') {
      self.editingExtractableRhythm = true;
    }
  };

  self.updateRhythmDisplay = function (rhythmString) {
    self.oneSong.details.rhythmArray = SongFactory.prepareRhythmForFont(rhythmString);
  };

  self.updateExtractableRhythmDisplay = function (extractableRhythmString) {
    self.oneSong.details.extractableRhythmArray = SongFactory.prepareExtractableRhythmForFont(rhythmString);
  };


  // self.htmlPopover = '<b style="color: red">I can</b> have <div class="label label-success">HTML</div> content';
  self.htmlPopover = 'Share this song:<input type="text" class="form-control" placeholder="Email address"><button class="btn btn-default" type="submit">';

  self.dynamicPopover = {
    content: 'Hello, World!',
    templateUrl: 'myPopoverTemplate.html',
    title: 'Share this song:'
  };

}]);
